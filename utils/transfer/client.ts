// Browser-side WebRTC engine for QR File Transfer.
//
// Protocol (over one ordered, reliable RTCDataChannel per receiver):
//   receiver -> sender : {"type":"get","index":n,"offset":bytes}
//   sender   -> receiver: {"type":"start","index":n,"offset":bytes,"size":total}
//                         <binary chunks of CHUNK_SIZE bytes>
//                         {"type":"end","index":n}
// The receiver requests one file at a time, so binary chunks are unambiguous. After a
// reconnection the receiver re-requests the current file from the byte offset it already has.

import { upload as blobUpload } from "@vercel/blob/client";
import type { CloudMode, PollResponse, TransferFileMeta } from "./shared";

const CHUNK_SIZE = 64 * 1024;
const HIGH_WATER = 8 * 1024 * 1024;
const LOW_WATER = 1024 * 1024;
const CONNECT_TIMEOUT_MS = 15_000;
const MAX_CONNECT_ATTEMPTS = 3;

export class TransferEndedError extends Error {
  constructor(public status: string) {
    super(status === "cancelled" ? "The sender cancelled this transfer." : status === "expired" ? "This transfer has expired." : "Transfer not found.");
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const randomId = () => Math.random().toString(36).slice(2, 10);

export class SignalClient {
  constructor(public sessionId: string, public token: string) {}

  private headers() {
    return { "Content-Type": "application/json", "x-transfer-token": this.token };
  }

  async send(to: string, data: Record<string, unknown>) {
    const res = await fetch("/api/transfer/signal", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ s: this.sessionId, to, data }),
    });
    if (res.status === 410) throw new TransferEndedError((await res.json().catch(() => ({}))).status ?? "expired");
  }

  async poll(): Promise<PollResponse> {
    const res = await fetch(`/api/transfer/signal?s=${encodeURIComponent(this.sessionId)}`, { headers: this.headers(), cache: "no-store" });
    const body = await res.json().catch(() => ({}));
    if (res.status === 410) throw new TransferEndedError(body.status ?? "expired");
    if (!res.ok) throw new Error(body.error || "Connection to server failed.");
    return body as PollResponse;
  }

  async iceServers(): Promise<RTCIceServer[]> {
    try {
      const res = await fetch(`/api/transfer/ice?s=${encodeURIComponent(this.sessionId)}`, { headers: this.headers(), cache: "no-store" });
      if (res.ok) return (await res.json()).iceServers;
    } catch {
      /* fall through */
    }
    return [{ urls: "stun:stun.l.google.com:19302" }];
  }
}

/** Buffers outgoing ICE candidates until the SDP that precedes them has been sent. */
function candidateOutbox(sig: SignalClient, to: string, cid: string) {
  let queue: RTCIceCandidateInit[] | null = [];
  const flush = (c: RTCIceCandidateInit) => sig.send(to, { type: "candidate", cid, candidate: c }).catch(() => {});
  return {
    push(c: RTCIceCandidateInit) {
      if (queue) queue.push(c);
      else void flush(c);
    },
    ready() {
      const q = queue ?? [];
      queue = null;
      q.forEach((c) => void flush(c));
    },
  };
}

// ---------------------------------------------------------------------------------------
// Sender
// ---------------------------------------------------------------------------------------

export interface SenderEvents {
  onPoll(p: PollResponse): void;
  onPeerState(peerId: string, state: string): void;
  onProgress(peerId: string, index: number, bytes: number): void;
  onFallbackRequest(peerId: string): void;
  onEnded(err: TransferEndedError): void;
  onError(msg: string): void;
}

interface SenderPeer {
  pc: RTCPeerConnection;
  cid: string;
  chain: Promise<void>;
}

export class TransferSender {
  private peers = new Map<string, SenderPeer>();
  private stopped = false;

  constructor(private sig: SignalClient, private files: File[], private ev: SenderEvents) {}

  start() {
    void this.loop();
  }

  stop() {
    this.stopped = true;
    this.peers.forEach((p) => p.pc.close());
    this.peers.clear();
  }

  private async loop() {
    let failures = 0;
    while (!this.stopped) {
      try {
        const p = await this.sig.poll();
        failures = 0;
        this.ev.onPoll(p);
        for (const m of p.messages) await this.handle(m.from, m.data);
      } catch (e) {
        if (e instanceof TransferEndedError) {
          this.stop();
          this.ev.onEnded(e);
          return;
        }
        if (++failures === 3) this.ev.onError("Having trouble reaching the server. Retrying…");
      }
      await sleep(1000);
    }
  }

  private async handle(from: string, d: Record<string, unknown>) {
    try {
      if (d.type === "offer") await this.acceptOffer(from, String(d.cid), d.sdp as RTCSessionDescriptionInit);
      else if (d.type === "candidate") {
        const peer = this.peers.get(from);
        if (peer && peer.cid === d.cid && d.candidate) await peer.pc.addIceCandidate(d.candidate as RTCIceCandidateInit).catch(() => {});
      } else if (d.type === "fallback-request") this.ev.onFallbackRequest(from);
    } catch (e) {
      console.warn("[transfer] signaling error", e);
    }
  }

  private async acceptOffer(peerId: string, cid: string, sdp: RTCSessionDescriptionInit) {
    this.peers.get(peerId)?.pc.close();
    const pc = new RTCPeerConnection({ iceServers: await this.sig.iceServers() });
    const peer: SenderPeer = { pc, cid, chain: Promise.resolve() };
    this.peers.set(peerId, peer);
    const outbox = candidateOutbox(this.sig, peerId, cid);
    pc.onicecandidate = (e) => e.candidate && outbox.push(e.candidate.toJSON());
    pc.onconnectionstatechange = () => this.peers.get(peerId) === peer && this.ev.onPeerState(peerId, pc.connectionState);
    pc.ondatachannel = (e) => this.setupChannel(peerId, peer, e.channel);
    await pc.setRemoteDescription(sdp);
    await pc.setLocalDescription(await pc.createAnswer());
    await this.sig.send(peerId, { type: "answer", cid, sdp: pc.localDescription!.toJSON() });
    outbox.ready();
  }

  private setupChannel(peerId: string, peer: SenderPeer, dc: RTCDataChannel) {
    dc.binaryType = "arraybuffer";
    dc.bufferedAmountLowThreshold = LOW_WATER;
    dc.onmessage = (e) => {
      if (typeof e.data !== "string") return;
      let msg: { type?: string; index?: number; offset?: number };
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }
      if (msg.type === "get" && Number.isInteger(msg.index) && this.files[msg.index!]) {
        const index = msg.index!;
        const offset = Math.max(0, Math.min(Number(msg.offset) || 0, this.files[index].size));
        peer.chain = peer.chain.then(() => this.sendFile(peerId, dc, index, offset)).catch(() => {});
      }
    };
  }

  private waitForDrain(dc: RTCDataChannel) {
    return new Promise<void>((resolve) => {
      const done = () => {
        dc.removeEventListener("bufferedamountlow", done);
        dc.removeEventListener("close", done);
        resolve();
      };
      dc.addEventListener("bufferedamountlow", done);
      dc.addEventListener("close", done);
    });
  }

  private async sendFile(peerId: string, dc: RTCDataChannel, index: number, offset: number) {
    const file = this.files[index];
    if (dc.readyState !== "open") return;
    dc.send(JSON.stringify({ type: "start", index, offset, size: file.size }));
    let pos = offset;
    while (pos < file.size) {
      if (this.stopped || dc.readyState !== "open") return;
      if (dc.bufferedAmount > HIGH_WATER) {
        await this.waitForDrain(dc);
        continue;
      }
      const buf = await file.slice(pos, pos + CHUNK_SIZE).arrayBuffer();
      dc.send(buf);
      pos += buf.byteLength;
      this.ev.onProgress(peerId, index, pos);
    }
    if (dc.readyState === "open") dc.send(JSON.stringify({ type: "end", index }));
  }
}

// ---------------------------------------------------------------------------------------
// Receiver
// ---------------------------------------------------------------------------------------

export type ReceiverState = "connecting" | "connected" | "reconnecting" | "failed" | "ended";

export interface ReceiverEvents {
  onState(state: ReceiverState): void;
  onProgress(index: number, bytes: number): void;
  onPoll(p: PollResponse): void;
  onEnded(err: TransferEndedError): void;
}

interface Pending {
  index: number;
  chunks: ArrayBuffer[];
  received: number;
  resolve(b: Blob): void;
  reject(e: Error): void;
}

export class TransferReceiver {
  private pc?: RTCPeerConnection;
  private dc?: RTCDataChannel;
  private cid = "";
  private attempts = 0;
  private failingCid = "";
  private stopped = false;
  private failed = false;
  private current?: Pending;
  private chain: Promise<unknown> = Promise.resolve();
  private blobs = new Map<number, Blob>();
  private connectTimer?: ReturnType<typeof setTimeout>;

  constructor(private sig: SignalClient, private files: TransferFileMeta[], private ev: ReceiverEvents) {}

  start() {
    void this.pollLoop();
    void this.connect();
  }

  stop() {
    this.stopped = true;
    clearTimeout(this.connectTimer);
    this.pc?.close();
    this.current?.reject(new Error("Stopped"));
  }

  get isFailed() {
    return this.failed;
  }

  /** Try direct connection again after it was marked failed. */
  retry() {
    this.failed = false;
    this.attempts = 0;
    void this.connect();
  }

  requestFallback() {
    return this.sig.send("sender", { type: "fallback-request" }).catch(() => {});
  }

  getBlob(index: number) {
    return this.blobs.get(index);
  }

  private async pollLoop() {
    while (!this.stopped) {
      try {
        const p = await this.sig.poll();
        this.ev.onPoll(p);
        for (const m of p.messages) await this.handleSignal(m.data);
      } catch (e) {
        if (e instanceof TransferEndedError) {
          this.stop();
          this.ev.onState("ended");
          this.ev.onEnded(e);
          return;
        }
      }
      // Poll faster while negotiating.
      await sleep(this.dc?.readyState === "open" ? 2500 : 1000);
    }
  }

  private async handleSignal(d: Record<string, unknown>) {
    if (!this.pc || d.cid !== this.cid) return; // stale message from an older attempt
    try {
      if (d.type === "answer") await this.pc.setRemoteDescription(d.sdp as RTCSessionDescriptionInit);
      else if (d.type === "candidate" && d.candidate) await this.pc.addIceCandidate(d.candidate as RTCIceCandidateInit);
    } catch (e) {
      console.warn("[transfer] signaling error", e);
    }
  }

  private async connect() {
    if (this.stopped) return;
    clearTimeout(this.connectTimer);
    this.pc?.close();
    this.attempts++;
    this.ev.onState(this.attempts > 1 ? "reconnecting" : "connecting");

    const cid = randomId();
    this.cid = cid;
    const pc = new RTCPeerConnection({ iceServers: await this.sig.iceServers() });
    if (this.cid !== cid || this.stopped) return pc.close();
    this.pc = pc;
    const dc = pc.createDataChannel("files", { ordered: true });
    dc.binaryType = "arraybuffer";
    this.dc = dc;

    const outbox = candidateOutbox(this.sig, "sender", cid);
    pc.onicecandidate = (e) => e.candidate && outbox.push(e.candidate.toJSON());
    pc.onconnectionstatechange = () => {
      if (this.cid !== cid) return;
      if (pc.connectionState === "failed") this.connectionLost(cid);
      if (pc.connectionState === "disconnected") {
        setTimeout(() => this.cid === cid && pc.connectionState !== "connected" && this.connectionLost(cid), 4000);
      }
    };
    dc.onopen = () => {
      if (this.cid !== cid) return;
      clearTimeout(this.connectTimer);
      this.attempts = 0;
      this.failed = false;
      this.ev.onState("connected");
      if (this.current) this.request(this.current); // resume interrupted file
    };
    dc.onclose = () => this.cid === cid && !this.stopped && this.connectionLost(cid);
    dc.onmessage = (e) => this.cid === cid && this.onData(e.data);

    await pc.setLocalDescription(await pc.createOffer());
    try {
      await this.sig.send("sender", { type: "offer", cid, sdp: pc.localDescription!.toJSON() });
    } catch (e) {
      if (e instanceof TransferEndedError) return;
    }
    outbox.ready();
    this.connectTimer = setTimeout(() => dc.readyState !== "open" && this.connectionLost(cid), CONNECT_TIMEOUT_MS);
  }

  private connectionLost(cid: string) {
    if (this.stopped || this.failingCid === cid) return;
    this.failingCid = cid;
    if (this.attempts >= MAX_CONNECT_ATTEMPTS) {
      this.failed = true;
      this.pc?.close();
      this.ev.onState("failed");
      this.current?.reject(new Error("Direct connection failed."));
      this.current = undefined;
      return;
    }
    setTimeout(() => void this.connect(), 1000);
  }

  private request(p: Pending) {
    if (this.dc?.readyState === "open") this.dc.send(JSON.stringify({ type: "get", index: p.index, offset: p.received }));
  }

  private onData(data: unknown) {
    const p = this.current;
    if (typeof data === "string") {
      let msg: { type?: string; index?: number; offset?: number };
      try {
        msg = JSON.parse(data);
      } catch {
        return;
      }
      if (!p || msg.index !== p.index) return;
      if (msg.type === "start" && msg.offset !== p.received) {
        // Offsets disagree (should not happen) — restart the file from scratch.
        p.chunks = [];
        p.received = msg.offset === 0 ? 0 : p.received;
      }
      if (msg.type === "end") {
        const meta = this.files[p.index];
        if (p.received !== meta.size) return p.reject(new Error("File arrived incomplete. Please retry."));
        const blob = new Blob(p.chunks, { type: meta.type || "application/octet-stream" });
        this.blobs.set(p.index, blob);
        this.current = undefined;
        p.resolve(blob);
      }
      return;
    }
    if (p && data instanceof ArrayBuffer) {
      p.chunks.push(data);
      p.received += data.byteLength;
      this.ev.onProgress(p.index, p.received);
    }
  }

  /** Download one file over the direct connection. Requests are queued and run one at a time. */
  download(index: number): Promise<Blob> {
    const cached = this.blobs.get(index);
    if (cached) return Promise.resolve(cached);
    const run = () =>
      new Promise<Blob>((resolve, reject) => {
        const done = this.blobs.get(index);
        if (done) return resolve(done);
        if (this.failed || this.stopped) return reject(new Error("Direct connection is not available."));
        const p: Pending = {
          index,
          chunks: [],
          received: 0,
          resolve,
          reject: (e) => {
            if (this.current === p) this.current = undefined;
            reject(e);
          },
        };
        this.current = p;
        this.request(p); // if not open yet, dc.onopen will send it
      });
    const result = this.chain.then(run, run);
    this.chain = result.catch(() => {});
    return result;
  }
}

/** Upload a file to temporary cloud storage with progress (sender, fallback path). */
export async function uploadToCloud(
  mode: CloudMode,
  sessionId: string,
  token: string,
  index: number,
  file: File,
  onProgress: (bytes: number) => void
) {
  if (mode === "none") throw new Error("Cloud fallback is not available on this server.");
  if (mode === "disk") return uploadToDisk(sessionId, token, index, file, onProgress);
  // Vercel Blob: browser uploads directly to storage with a short-lived token from our server.
  const safe = file.name.replace(/[^A-Za-z0-9._-]/g, "_").slice(-80) || "file";
  const blob = await blobUpload(`transfer/${sessionId}/${index}-${safe}`, file, {
    access: "public",
    handleUploadUrl: "/api/transfer/blob",
    clientPayload: JSON.stringify({ s: sessionId, i: index, t: token }),
    multipart: file.size > 20 * 1024 * 1024,
    onUploadProgress: (e) => onProgress(e.loaded),
  });
  const res = await fetch("/api/transfer/blob", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-transfer-token": token },
    body: JSON.stringify({ s: sessionId, i: index, url: blob.url }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload could not be verified.");
}

function uploadToDisk(sessionId: string, token: string, index: number, file: File, onProgress: (bytes: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/api/transfer/upload?s=${encodeURIComponent(sessionId)}&i=${index}`);
    xhr.setRequestHeader("x-transfer-token", token);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.upload.onprogress = (e) => onProgress(e.loaded);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let msg = "Upload failed.";
      try {
        msg = JSON.parse(xhr.responseText).error || msg;
      } catch {
        /* ignore */
      }
      reject(new Error(msg));
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(file);
  });
}

export function cloudFileUrl(sessionId: string, token: string, index: number) {
  return `/api/transfer/file?s=${encodeURIComponent(sessionId)}&i=${index}&t=${encodeURIComponent(token)}`;
}

/** Fetch a cloud-stored file into memory with progress (used for ZIP). */
export async function fetchCloudBlob(url: string, onProgress: (bytes: number) => void): Promise<Blob> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok || !res.body) throw new Error("Could not download file from temporary storage.");
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    got += value.byteLength;
    onProgress(got);
  }
  return new Blob(parts as BlobPart[]);
}

export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
