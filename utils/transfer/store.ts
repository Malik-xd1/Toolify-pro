// SERVER-ONLY: in-memory session store + temporary disk storage for QR File Transfer.
// Never import this from client components (it uses node:crypto / node:fs).
//
// Scaling note: sessions live in this process's memory. That is correct for a single
// `next start` server. For multi-instance / serverless hosting, replace the Map with
// Redis (or similar) and the disk folder with an object store using presigned URLs.

import { randomBytes, scryptSync, timingSafeEqual, createHash, createHmac } from "node:crypto";
import { promises as fs, createReadStream } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  DEFAULT_CLOUD_FILE_BYTES,
  EXPIRY_OPTIONS_MIN,
  TransferFileMeta,
  sanitizeFileName,
  validateFileList,
  SignalMessage,
} from "./shared";

const MAX_SESSIONS = 1000;
const MAX_RECEIVERS = 10;
const MAX_MAILBOX = 300;
const MAX_PASSWORD_FAILURES = 10;
const SENDER = "sender";

interface Receiver {
  tokenHash: Buffer;
  lastSeen: number;
}

interface Session {
  id: string;
  createdAt: number;
  expiresAt: number;
  files: TransferFileMeta[];
  senderTokenHash: Buffer;
  senderLastSeen: number;
  password?: { salt: Buffer; hash: Buffer };
  passwordFailures: number;
  receivers: Map<string, Receiver>;
  mailbox: Map<string, SignalMessage[]>;
  cloud: boolean[];
}

type Store = { sessions: Map<string, Session>; ended: Map<string, { status: "expired" | "cancelled"; at: number }>; sweeper?: NodeJS.Timeout };
const g = globalThis as unknown as { __toolifyTransfer?: Store };
const store: Store = g.__toolifyTransfer ?? (g.__toolifyTransfer = { sessions: new Map(), ended: new Map() });

export const STORAGE_ROOT = path.join(os.tmpdir(), "toolify-transfer");

export function cloudMaxBytes(): number {
  const mb = Number(process.env.TRANSFER_CLOUD_MAX_MB);
  return Number.isFinite(mb) && mb > 0 ? mb * 1024 * 1024 : DEFAULT_CLOUD_FILE_BYTES;
}

export function cloudEnabled(): boolean {
  return process.env.TRANSFER_CLOUD_DISABLED !== "1";
}

const hashToken = (t: string) => createHash("sha256").update(t).digest();
const newToken = () => randomBytes(32).toString("base64url");

function sessionDir(id: string) {
  return path.join(STORAGE_ROOT, id);
}

export function cloudFilePath(id: string, index: number) {
  return path.join(sessionDir(id), `${index}.bin`);
}

async function destroy(session: Session, reason: "expired" | "cancelled") {
  store.sessions.delete(session.id);
  store.ended.set(session.id, { status: reason, at: Date.now() });
  await fs.rm(sessionDir(session.id), { recursive: true, force: true }).catch(() => {});
}

export async function sweep() {
  const now = Date.now();
  for (const s of store.sessions.values()) {
    if (s.expiresAt <= now) await destroy(s, "expired");
  }
  // Forget "ended" markers after a day.
  for (const [id, e] of store.ended) if (now - e.at > 86_400_000) store.ended.delete(id);
  // Remove orphaned folders (e.g. after a server restart).
  try {
    for (const dir of await fs.readdir(STORAGE_ROOT)) {
      if (!store.sessions.has(dir)) await fs.rm(path.join(STORAGE_ROOT, dir), { recursive: true, force: true });
    }
  } catch {
    /* folder may not exist yet */
  }
}

if (!store.sweeper) {
  store.sweeper = setInterval(() => void sweep(), 60_000);
  store.sweeper.unref?.();
  void sweep();
}

export function createSession(input: { files: TransferFileMeta[]; expiryMinutes: number; password?: string }) {
  const err = validateFileList(input.files);
  if (err) return { error: err } as const;
  if (store.sessions.size >= MAX_SESSIONS) return { error: "Server is busy. Please try again later." } as const;
  const minutes = (EXPIRY_OPTIONS_MIN as readonly number[]).includes(input.expiryMinutes) ? input.expiryMinutes : 30;

  const id = randomBytes(16).toString("base64url");
  const senderToken = newToken();
  const now = Date.now();
  const session: Session = {
    id,
    createdAt: now,
    expiresAt: now + minutes * 60_000,
    files: input.files.map((f) => ({
      name: sanitizeFileName(f.name),
      size: Math.floor(f.size),
      type: typeof f.type === "string" ? f.type.slice(0, 120) : "",
    })),
    senderTokenHash: hashToken(senderToken),
    senderLastSeen: now,
    passwordFailures: 0,
    receivers: new Map(),
    mailbox: new Map(),
    cloud: input.files.map(() => false),
  };
  if (input.password) {
    const salt = randomBytes(16);
    session.password = { salt, hash: scryptSync(input.password, salt, 32) };
  }
  store.sessions.set(id, session);
  return { id, senderToken, expiresAt: session.expiresAt } as const;
}

export function getSession(id: string | null): Session | undefined {
  if (!id) return undefined;
  const s = store.sessions.get(id);
  if (s && s.expiresAt <= Date.now()) {
    void destroy(s, "expired");
    return undefined;
  }
  return s;
}

export function endedStatus(id: string | null): "expired" | "cancelled" | "not_found" {
  return (id && store.ended.get(id)?.status) || "not_found";
}

/** Returns "sender", a receiver peerId, or null. Constant-time token comparison. */
export function authenticate(session: Session, token: string | null): string | null {
  if (!token) return null;
  const h = hashToken(token);
  if (timingSafeEqual(h, session.senderTokenHash)) {
    session.senderLastSeen = Date.now();
    return SENDER;
  }
  for (const [peerId, r] of session.receivers) {
    if (timingSafeEqual(h, r.tokenHash)) {
      r.lastSeen = Date.now();
      return peerId;
    }
  }
  return null;
}

export function joinSession(session: Session, password: string | undefined) {
  if (session.password) {
    if (session.passwordFailures >= MAX_PASSWORD_FAILURES) return { error: "Too many wrong attempts. This transfer is locked.", status: 429 } as const;
    const attempt = scryptSync(password ?? "", session.password.salt, 32);
    if (!timingSafeEqual(attempt, session.password.hash)) {
      session.passwordFailures++;
      return { error: "Incorrect password.", status: 401 } as const;
    }
  }
  // Drop receivers not seen for 2 minutes to make room.
  for (const [pid, r] of session.receivers) if (Date.now() - r.lastSeen > 120_000) session.receivers.delete(pid);
  if (session.receivers.size >= MAX_RECEIVERS) return { error: "Too many devices are connected to this transfer.", status: 429 } as const;

  const peerId = "r_" + randomBytes(6).toString("hex");
  const token = newToken();
  session.receivers.set(peerId, { tokenHash: hashToken(token), lastSeen: Date.now() });
  return { peerId, token, files: session.files, expiresAt: session.expiresAt } as const;
}

export function postMessage(session: Session, from: string, to: string, data: Record<string, unknown>) {
  // Receivers may only talk to the sender; the sender may only talk to known receivers.
  if (from !== SENDER && to !== SENDER) return false;
  if (from === SENDER && !session.receivers.has(to)) return false;
  const box = session.mailbox.get(to) ?? [];
  if (box.length >= MAX_MAILBOX) box.shift();
  box.push({ from, data });
  session.mailbox.set(to, box);
  return true;
}

export function drainMessages(session: Session, peer: string): SignalMessage[] {
  const box = session.mailbox.get(peer) ?? [];
  session.mailbox.set(peer, []);
  return box;
}

export function receiverList(session: Session) {
  return [...session.receivers].map(([peerId, r]) => ({ peerId, lastSeen: r.lastSeen }));
}

export async function cancelSession(session: Session) {
  await destroy(session, "cancelled");
}

/** Streams an upload body to disk, enforcing the size limit and the declared file size. */
export async function saveCloudFile(session: Session, index: number, body: ReadableStream<Uint8Array>) {
  const meta = session.files[index];
  const limit = Math.min(cloudMaxBytes(), meta.size);
  await fs.mkdir(sessionDir(session.id), { recursive: true });
  const target = cloudFilePath(session.id, index);
  const tmp = target + ".part";
  const handle = await fs.open(tmp, "w");
  let written = 0;
  try {
    const reader = body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      written += value.byteLength;
      if (written > limit) {
        await reader.cancel();
        throw new Error("File is larger than allowed.");
      }
      await handle.write(value);
    }
  } catch (e) {
    await handle.close();
    await fs.rm(tmp, { force: true });
    throw e;
  }
  await handle.close();
  if (written !== meta.size) {
    await fs.rm(tmp, { force: true });
    throw new Error("Upload incomplete.");
  }
  // Session may have been cancelled/expired during upload.
  if (!store.sessions.has(session.id)) {
    await fs.rm(sessionDir(session.id), { recursive: true, force: true });
    throw new Error("Transfer ended.");
  }
  await fs.rename(tmp, target);
  session.cloud[index] = true;
}

export function openCloudFile(session: Session, index: number) {
  return createReadStream(cloudFilePath(session.id, index));
}

/** ICE servers for WebRTC. TURN credentials are minted server-side and short-lived. */
export function iceServers(peer: string) {
  const servers: RTCIceServer[] = [];
  const stun = (process.env.STUN_URLS || "stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302")
    .split(",").map((s) => s.trim()).filter(Boolean);
  if (stun.length) servers.push({ urls: stun });

  const turnUrls = (process.env.TURN_URLS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (turnUrls.length) {
    if (process.env.TURN_SECRET) {
      // coturn "use-auth-secret" (TURN REST API): time-limited HMAC credentials.
      const username = `${Math.floor(Date.now() / 1000) + 3600}:${peer}`;
      const credential = createHmac("sha1", process.env.TURN_SECRET).update(username).digest("base64");
      servers.push({ urls: turnUrls, username, credential });
    } else if (process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
      servers.push({ urls: turnUrls, username: process.env.TURN_USERNAME, credential: process.env.TURN_CREDENTIAL });
    }
  }
  return servers;
}

export { SENDER };
