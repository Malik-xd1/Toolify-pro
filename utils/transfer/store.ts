// SERVER-ONLY: session store + temporary file storage for QR File Transfer.
// Never import this from client components (it uses node:crypto / node:fs).
//
// State lives in `kv` (Upstash Redis when configured — required on Vercel — otherwise in-process
// with a disk snapshot). Temporary files go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set,
// otherwise to the local temp folder (self-hosted only).

import { randomBytes, scryptSync, timingSafeEqual, createHash, createHmac } from "node:crypto";
import { promises as fs, createReadStream } from "node:fs";
import os from "node:os";
import path from "node:path";
import { del as blobDel } from "@vercel/blob";
import { kv, usingRedis } from "./kv";
import {
  DEFAULT_CLOUD_FILE_BYTES,
  EXPIRY_OPTIONS_MIN,
  TransferFileMeta,
  sanitizeFileName,
  validateFileList,
  SignalMessage,
} from "./shared";

const MAX_RECEIVERS = 10;
const MAX_MAILBOX = 300;
const MAX_PASSWORD_FAILURES = 10;
const ENDED_TTL = 86_400; // remember "expired"/"cancelled" for a day
export const SENDER = "sender";

export interface Session {
  id: string;
  createdAt: number;
  expiresAt: number;
  files: TransferFileMeta[];
  senderTokenHash: string;
  password?: { salt: string; hash: string };
}

export type CloudMode = "blob" | "disk" | "none";

export function cloudMode(): CloudMode {
  if (process.env.TRANSFER_CLOUD_DISABLED === "1") return "none";
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  // Local disk only works when every request reaches the same machine.
  return usingRedis ? "none" : "disk";
}

export function cloudMaxBytes(): number {
  const mb = Number(process.env.TRANSFER_CLOUD_MAX_MB);
  return Number.isFinite(mb) && mb > 0 ? mb * 1024 * 1024 : DEFAULT_CLOUD_FILE_BYTES;
}

const K = {
  session: (id: string) => `tx:s:${id}`,
  ended: (id: string) => `tx:e:${id}`,
  receivers: (id: string) => `tx:r:${id}`,
  cloud: (id: string) => `tx:c:${id}`,
  failures: (id: string) => `tx:f:${id}`,
  mailbox: (id: string, peer: string) => `tx:m:${id}:${peer}`,
  blobs: "tx:blobs", // url -> expiresAt, for cleanup
};

const ttlOf = (s: Session) => Math.max(1, Math.ceil((s.expiresAt - Date.now()) / 1000));
const hashToken = (t: string) => createHash("sha256").update(t).digest();
const newToken = () => randomBytes(32).toString("base64url");
const safeEqual = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

// ------------------------------------------------------------------ temporary files (disk mode)

export const STORAGE_ROOT = path.join(os.tmpdir(), "toolify-transfer");
const sessionDir = (id: string) => path.join(STORAGE_ROOT, id);
const cloudFilePath = (id: string, i: number) => path.join(sessionDir(id), `${i}.bin`);

const g = globalThis as unknown as { __toolifyTransferSweeper?: NodeJS.Timeout };
if (cloudMode() === "disk" && !g.__toolifyTransferSweeper) {
  const sweepDisk = async () => {
    try {
      for (const dir of await fs.readdir(STORAGE_ROOT)) {
        if (dir.startsWith("_")) continue;
        if (!(await kv.get(K.session(dir)))) await fs.rm(path.join(STORAGE_ROOT, dir), { recursive: true, force: true });
      }
    } catch {
      /* folder may not exist yet */
    }
  };
  g.__toolifyTransferSweeper = setInterval(() => void sweepDisk(), 60_000);
  g.__toolifyTransferSweeper.unref?.();
  void sweepDisk();
}

/** Deletes Vercel Blob files whose session has expired. Called opportunistically and by cron. */
export async function cleanupBlobs() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 0;
  const all = await kv.hgetall(K.blobs);
  const expired = Object.entries(all).filter(([, exp]) => Number(exp) <= Date.now()).map(([url]) => url);
  if (!expired.length) return 0;
  await blobDel(expired).catch(() => {});
  for (const url of expired) await kv.hdel(K.blobs, url);
  return expired.length;
}

async function deleteFiles(id: string) {
  const refs = await kv.hgetall(K.cloud(id));
  const urls = Object.values(refs).filter((v) => v.startsWith("http"));
  if (urls.length) {
    await blobDel(urls).catch(() => {});
    for (const u of urls) await kv.hdel(K.blobs, u);
  }
  await fs.rm(sessionDir(id), { recursive: true, force: true }).catch(() => {});
}

// ------------------------------------------------------------------ sessions

export async function createSession(input: { files: TransferFileMeta[]; expiryMinutes: number; password?: string }) {
  const err = validateFileList(input.files);
  if (err) return { error: err } as const;
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
    senderTokenHash: hashToken(senderToken).toString("base64"),
  };
  if (input.password) {
    const salt = randomBytes(16);
    session.password = { salt: salt.toString("base64"), hash: scryptSync(input.password, salt, 32).toString("base64") };
  }
  await kv.set(K.session(id), JSON.stringify(session), minutes * 60);
  // Pre-arm the "expired" marker; cancel overwrites it. Outlives the session by a day.
  await kv.set(K.ended(id), "expired", minutes * 60 + ENDED_TTL);
  void cleanupBlobs().catch(() => {});
  return { id, senderToken, expiresAt: session.expiresAt, cloudMode: cloudMode(), cloudMaxBytes: cloudMaxBytes() } as const;
}

export async function getSession(id: string | null): Promise<Session | null> {
  if (!id || !/^[A-Za-z0-9_-]{10,40}$/.test(id)) return null;
  const raw = await kv.get(K.session(id));
  if (!raw) return null;
  const s = JSON.parse(raw) as Session;
  return s.expiresAt > Date.now() ? s : null;
}

export async function endedStatus(id: string | null): Promise<"expired" | "cancelled" | "not_found"> {
  if (!id) return "not_found";
  const v = await kv.get(K.ended(id));
  return v === "expired" || v === "cancelled" ? v : "not_found";
}

type ReceiverRec = { tokenHash: string; lastSeen: number };

async function receivers(s: Session): Promise<Record<string, ReceiverRec>> {
  const raw = await kv.hgetall(K.receivers(s.id));
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, JSON.parse(v) as ReceiverRec]));
}

/** Returns "sender", a receiver peerId, or null. Constant-time token comparison. */
export async function authenticate(s: Session, token: string | null): Promise<string | null> {
  if (!token) return null;
  const h = hashToken(token);
  if (safeEqual(h, Buffer.from(s.senderTokenHash, "base64"))) return SENDER;
  for (const [peerId, r] of Object.entries(await receivers(s))) {
    if (safeEqual(h, Buffer.from(r.tokenHash, "base64"))) {
      // Throttle lastSeen writes to keep Redis traffic low.
      if (Date.now() - r.lastSeen > 15_000) {
        await kv.hset(K.receivers(s.id), peerId, JSON.stringify({ ...r, lastSeen: Date.now() }), ttlOf(s));
      }
      return peerId;
    }
  }
  return null;
}

export async function joinSession(s: Session, password: string | undefined) {
  if (s.password) {
    const failures = Number((await kv.get(K.failures(s.id))) ?? 0);
    if (failures >= MAX_PASSWORD_FAILURES) return { error: "Too many wrong attempts. This transfer is locked.", status: 429 } as const;
    const attempt = scryptSync(password ?? "", Buffer.from(s.password.salt, "base64"), 32);
    if (!safeEqual(attempt, Buffer.from(s.password.hash, "base64"))) {
      await kv.incr(K.failures(s.id), ttlOf(s));
      return { error: "Incorrect password.", status: 401 } as const;
    }
  }
  const current = await receivers(s);
  let active = 0;
  for (const [pid, r] of Object.entries(current)) {
    if (Date.now() - r.lastSeen > 120_000) await kv.hdel(K.receivers(s.id), pid);
    else active++;
  }
  if (active >= MAX_RECEIVERS) return { error: "Too many devices are connected to this transfer.", status: 429 } as const;

  const peerId = "r_" + randomBytes(6).toString("hex");
  const token = newToken();
  const rec: ReceiverRec = { tokenHash: hashToken(token).toString("base64"), lastSeen: Date.now() };
  await kv.hset(K.receivers(s.id), peerId, JSON.stringify(rec), ttlOf(s));
  return { peerId, token, files: s.files, expiresAt: s.expiresAt, cloudMode: cloudMode() } as const;
}

export async function postMessage(s: Session, from: string, to: string, data: Record<string, unknown>) {
  // Receivers may only talk to the sender; the sender may only talk to known receivers.
  if (from !== SENDER && to !== SENDER) return false;
  if (from === SENDER && !(to in (await receivers(s)))) return false;
  await kv.rpush(K.mailbox(s.id, to), JSON.stringify({ from, data }), ttlOf(s), MAX_MAILBOX);
  return true;
}

export async function drainMessages(s: Session, peer: string): Promise<SignalMessage[]> {
  return (await kv.drain(K.mailbox(s.id, peer))).map((m) => (typeof m === "string" ? JSON.parse(m) : m));
}

export async function receiverList(s: Session) {
  return Object.entries(await receivers(s)).map(([peerId, r]) => ({ peerId, lastSeen: r.lastSeen }));
}

/** Per-file storage reference: "disk", a Blob URL, or undefined. */
export async function cloudRefs(s: Session): Promise<(string | undefined)[]> {
  const refs = await kv.hgetall(K.cloud(s.id));
  return s.files.map((_, i) => refs[String(i)]);
}

export async function cancelSession(s: Session) {
  await kv.set(K.ended(s.id), "cancelled", ENDED_TTL);
  await deleteFiles(s.id);
  await kv.del(K.session(s.id), K.receivers(s.id), K.cloud(s.id), K.failures(s.id), K.mailbox(s.id, SENDER));
}

// ------------------------------------------------------------------ disk mode upload/download

/** Streams an upload body to disk, enforcing the size limit and the declared file size. */
export async function saveDiskFile(s: Session, index: number, body: ReadableStream<Uint8Array>) {
  const meta = s.files[index];
  const limit = Math.min(cloudMaxBytes(), meta.size);
  await fs.mkdir(sessionDir(s.id), { recursive: true });
  const target = cloudFilePath(s.id, index);
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
  if (!(await getSession(s.id))) {
    await fs.rm(sessionDir(s.id), { recursive: true, force: true });
    throw new Error("Transfer ended.");
  }
  await fs.rename(tmp, target);
  await kv.hset(K.cloud(s.id), String(index), "disk", ttlOf(s));
}

export function openDiskFile(s: Session, index: number) {
  return createReadStream(cloudFilePath(s.id, index));
}

/** Records a completed Vercel Blob upload (after the route has verified it). */
export async function recordBlob(s: Session, index: number, url: string) {
  await kv.hset(K.cloud(s.id), String(index), url, ttlOf(s));
  await kv.hset(K.blobs, url, String(s.expiresAt), ENDED_TTL * 2);
}

// ------------------------------------------------------------------ ICE

/** ICE servers for WebRTC. TURN credentials are minted server-side and short-lived. */
export function iceServers(peer: string) {
  const servers: RTCIceServer[] = [];
  const stun = (process.env.STUN_URLS || "stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302")
    .split(",").map((x) => x.trim()).filter(Boolean);
  if (stun.length) servers.push({ urls: stun });

  const turnUrls = (process.env.TURN_URLS || "").split(",").map((x) => x.trim()).filter(Boolean);
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
