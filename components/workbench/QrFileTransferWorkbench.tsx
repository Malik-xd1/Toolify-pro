"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode";
import JSZip from "jszip";
import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  Copy,
  Download,
  FileArchive,
  FileText,
  Lock,
  Loader2,
  QrCode,
  RefreshCw,
  Smartphone,
  Trash2,
  Upload,
  Wifi,
  X,
  XCircle,
} from "lucide-react";
import {
  DEFAULT_CLOUD_FILE_BYTES,
  DEFAULT_EXPIRY_MIN,
  EXPIRY_OPTIONS_MIN,
  MAX_FILES_PER_SESSION,
  MAX_P2P_FILE_BYTES,
  PollResponse,
  SessionStatus,
  TransferFileMeta,
  CloudMode,
  JoinResponse,
  BLOCKED_EXTENSIONS,
  fileExtension,
  formatBytes,
  formatLabel,
  validateFileList,
} from "@/utils/transfer/shared";
import {
  ReceiverState,
  SignalClient,
  TransferReceiver,
  TransferSender,
  cloudFileUrl,
  fetchCloudBlob,
  saveBlob,
  uploadToCloud,
} from "@/utils/transfer/client";

// ---------------------------------------------------------------------------------------
// Small UI helpers
// ---------------------------------------------------------------------------------------

function Banner({ kind, children, onClose }: { kind: "error" | "success" | "info"; children: React.ReactNode; onClose?: () => void }) {
  const styles = {
    error: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300",
    success: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300",
    info: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300",
  }[kind];
  const Icon = kind === "error" ? AlertCircle : kind === "success" ? CheckCircle2 : Wifi;
  return (
    <div className={`flex items-start gap-2 p-3 rounded-xl border text-sm ${styles}`} role={kind === "error" ? "alert" : "status"}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">{children}</div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function ProgressBar({ value, color = "bg-cyan-500" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <div className={`h-full ${color} transition-[width] duration-200`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function formatRemaining(ms: number) {
  if (ms <= 0) return "expired";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}:${String(sec).padStart(2, "0")}`;
}

function expiryLabel(min: number) {
  return min >= 60 ? `${min / 60} hour${min > 60 ? "s" : ""}` : `${min} minutes`;
}

/** Collects high-frequency progress updates in a ref and flushes them to state at most 4x/sec. */
function useThrottledMap<T>() {
  const ref = useRef<Record<string, T>>({});
  const [snap, setSnap] = useState<Record<string, T>>({});
  useEffect(() => {
    const t = setInterval(() => setSnap((prev) => (prev === ref.current ? prev : { ...ref.current })), 250);
    return () => clearInterval(t);
  }, []);
  const set = useCallback((key: string, value: T) => {
    ref.current = { ...ref.current, [key]: value };
  }, []);
  return [snap, set] as const;
}

// ---------------------------------------------------------------------------------------
// Root: decide sender vs receiver from the URL (?s=<sessionId>)
// ---------------------------------------------------------------------------------------

export default function QrFileTransferWorkbench() {
  // undefined on the server / first hydration pass, then the ?s= value (or null) in the browser.
  const sessionParam = useSyncExternalStore<string | null | undefined>(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("s"),
    () => undefined
  );

  if (sessionParam === undefined) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  if (typeof window !== "undefined" && typeof RTCPeerConnection === "undefined" && !sessionParam) {
    return <Banner kind="error">Your browser does not support WebRTC. Please use a recent version of Chrome, Edge, Firefox or Safari.</Banner>;
  }
  return sessionParam ? <ReceiverView sessionId={sessionParam} /> : <SenderView />;
}

// ---------------------------------------------------------------------------------------
// Sender
// ---------------------------------------------------------------------------------------

interface ActiveSession {
  cloudMode: CloudMode;
  cloudMax: number;
  id: string;
  token: string;
  expiresAt: number;
  url: string;
  qr: string;
}

type PeerInfo = { state: string; lastSeen: number };

function SenderView() {
  const [files, setFiles] = useState<File[]>([]);
  const [expiry, setExpiry] = useState<number>(DEFAULT_EXPIRY_MIN);
  const [password, setPassword] = useState("");
  const [cloudCopy, setCloudCopy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [ended, setEnded] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [peers, setPeers] = useState<Record<string, PeerInfo>>({});
  const [sent, setSent] = useThrottledMap<number>(); // key `${peer}:${index}`
  const [uploaded, setUploaded] = useThrottledMap<number>(); // key `${index}`
  const [cloud, setCloud] = useState<boolean[]>([]);
  const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});
  const senderRef = useRef<TransferSender | null>(null);
  const uploadingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const now = useNow();

  const totalBytes = files.reduce((a, f) => a + f.size, 0);

  const addFiles = (list: FileList | File[]) => {
    setError("");
    const incoming = Array.from(list);
    const rejected = incoming.filter((f) => BLOCKED_EXTENSIONS.includes(fileExtension(f.name)));
    const tooBig = incoming.filter((f) => f.size > MAX_P2P_FILE_BYTES);
    const ok = incoming.filter((f) => !rejected.includes(f) && !tooBig.includes(f));
    const merged = [...files, ...ok];
    const msgs: string[] = [];
    if (rejected.length) msgs.push(`Blocked for safety (executable/script): ${rejected.map((f) => f.name).join(", ")}.`);
    if (tooBig.length) msgs.push(`Over the ${formatBytes(MAX_P2P_FILE_BYTES)} per-file limit: ${tooBig.map((f) => f.name).join(", ")}.`);
    if (merged.length > MAX_FILES_PER_SESSION) msgs.push(`Only the first ${MAX_FILES_PER_SESSION} files were kept.`);
    if (msgs.length) setError(msgs.join(" "));
    setFiles(merged.slice(0, MAX_FILES_PER_SESSION));
  };

  const startCloudUpload = useCallback(async (s: ActiveSession, list: File[]) => {
    if (uploadingRef.current) return;
    if (s.cloudMode === "none") {
      setNotice("Cloud fallback isn't configured on this server, so files can only be sent directly.");
      return;
    }
    uploadingRef.current = true;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (f.size > s.cloudMax) {
        setUploadErrors((e) => ({ ...e, [i]: `Too large for cloud fallback (max ${formatBytes(s.cloudMax)}).` }));
        continue;
      }
      try {
        await uploadToCloud(s.cloudMode, s.id, s.token, i, f, (b) => setUploaded(String(i), b));
        setUploaded(String(i), f.size);
      } catch (e) {
        setUploadErrors((er) => ({ ...er, [i]: (e as Error).message }));
      }
    }
    uploadingRef.current = false;
  }, [setUploaded]);

  const createTransfer = async () => {
    const meta: TransferFileMeta[] = files.map((f) => ({ name: f.name, size: f.size, type: f.type }));
    const v = validateFileList(meta);
    if (v) return setError(v);
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/transfer/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: meta, expiryMinutes: expiry, password: password || undefined }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Could not create the transfer.");
      const url = `${window.location.origin}/tools/qr-file-transfer?s=${encodeURIComponent(body.id)}`;
      const qr = await QRCode.toDataURL(url, { width: 320, margin: 1, errorCorrectionLevel: "M" });
      const s: ActiveSession = {
        cloudMode: body.cloudMode ?? "none",
        cloudMax: body.cloudMaxBytes ?? DEFAULT_CLOUD_FILE_BYTES,
        id: body.id, token: body.senderToken, expiresAt: body.expiresAt, url, qr };
      setSession(s);
      setCloud(meta.map(() => false));

      const sender = new TransferSender(new SignalClient(s.id, s.token), files, {
        onPoll: (p: PollResponse) => {
          setCloud(p.cloud);
          setPeers((prev) => {
            const next = { ...prev };
            for (const r of p.receivers ?? []) next[r.peerId] = { state: prev[r.peerId]?.state ?? "joined", lastSeen: r.lastSeen };
            return next;
          });
        },
        onPeerState: (peerId, state) => setPeers((prev) => ({ ...prev, [peerId]: { lastSeen: prev[peerId]?.lastSeen ?? Date.now(), state } })),
        onProgress: (peerId, index, bytes) => setSent(`${peerId}:${index}`, bytes),
        onFallbackRequest: () => {
          setNotice("A receiver couldn't connect directly, so files are being uploaded to temporary storage.");
          void startCloudUpload(s, files);
        },
        onEnded: (e) => setEnded(e.message),
        onError: (msg) => setNotice(msg),
      });
      senderRef.current = sender;
      sender.start();
      if (cloudCopy) void startCloudUpload(s, files);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const cancelTransfer = async () => {
    if (!session) return;
    senderRef.current?.stop();
    await fetch(`/api/transfer/session?s=${encodeURIComponent(session.id)}`, {
      method: "DELETE",
      headers: { "x-transfer-token": session.token },
    }).catch(() => {});
    setEnded("Transfer cancelled. The link no longer works and temporary files were deleted.");
  };

  const reset = () => {
    senderRef.current?.stop();
    senderRef.current = null;
    uploadingRef.current = false;
    setSession(null);
    setEnded("");
    setNotice("");
    setPeers({});
    setUploadErrors({});
    setFiles([]);
    setPassword("");
  };

  // Clean up on unmount; warn before closing the tab while sharing.
  useEffect(() => () => senderRef.current?.stop(), []);
  useEffect(() => {
    if (!session || ended) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [session, ended]);

  const remaining = session ? session.expiresAt - now : 0;
  useEffect(() => {
    if (session && !ended && remaining <= 0) {
      senderRef.current?.stop();
      setEnded("This transfer has expired. Temporary files were deleted.");
    }
  }, [session, ended, remaining]);

  const copyLink = async () => {
    if (!session) return;
    try {
      await navigator.clipboard.writeText(session.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy automatically. Select the link and copy it manually.");
    }
  };

  // ---------------- Sharing screen ----------------
  if (session) {
    const peerIds = Object.keys(peers);
    return (
      <div className="space-y-5">
        {ended ? (
          <div className="text-center space-y-4 py-6">
            <Banner kind="info">{ended}</Banner>
            <button onClick={reset} className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm">
              Start a new transfer
            </button>
          </div>
        ) : (
          <>
            {error && <Banner kind="error" onClose={() => setError("")}>{error}</Banner>}
            {notice && <Banner kind="info" onClose={() => setNotice("")}>{notice}</Banner>}
            <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
              <div className="mx-auto md:mx-0 text-center space-y-2">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={session.qr} alt="QR code for the receiver link" className="w-56 h-56 sm:w-64 sm:h-64" />
                </div>
                <p className="text-xs text-slate-500">
                  Expires in <span className="font-semibold tabular-nums">{formatRemaining(remaining)}</span>
                  {password && (
                    <span className="inline-flex items-center gap-1 ml-2">
                      <Lock className="w-3 h-3" /> Password protected
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-4 min-w-0">
                <div>
                  <h3 className="font-bold text-base">Scan to receive</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Open the camera on the other device and scan the QR code, or send the link. Keep this page open — files go directly from this
                    device.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={session.url}
                    onFocus={(e) => e.currentTarget.select()}
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                    aria-label="Receiver link"
                  />
                  <button
                    onClick={copyLink}
                    className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold inline-flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Smartphone className="w-4 h-4" /> Receivers
                    <span className="text-xs font-normal text-slate-500">({peerIds.length})</span>
                  </div>
                  {peerIds.length === 0 ? (
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Waiting for a device to scan…
                    </p>
                  ) : (
                    peerIds.map((pid, n) => {
                      const st = peers[pid].state;
                      const bytes = files.reduce((a, _f, i) => a + (sent[`${pid}:${i}`] ?? 0), 0);
                      return (
                        <div key={pid} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Device {n + 1}</span>
                            <span
                              className={
                                st === "connected" ? "text-emerald-600" : st === "failed" || st === "disconnected" ? "text-amber-600" : "text-slate-500"
                              }
                            >
                              {st === "connected" ? "Connected directly" : st === "joined" ? "Opened link" : st}
                              {bytes > 0 && ` · ${formatBytes(bytes)} sent`}
                            </span>
                          </div>
                          {bytes > 0 && <ProgressBar value={(bytes / totalBytes) * 100} />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Files ({files.length} · {formatBytes(totalBytes)})</h4>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
                {files.map((f, i) => {
                  const up = uploaded[String(i)];
                  return (
                    <li key={i} className="p-3 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate flex-1">{f.name}</span>
                        <span className="text-xs text-slate-500 shrink-0">{formatBytes(f.size)}</span>
                        {cloud[i] && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 inline-flex items-center gap-1">
                            <Cloud className="w-3 h-3" /> Cloud copy
                          </span>
                        )}
                      </div>
                      {up !== undefined && !cloud[i] && <ProgressBar value={(up / Math.max(1, f.size)) * 100} color="bg-sky-500" />}
                      {uploadErrors[i] && <p className="text-xs text-red-600">{uploadErrors[i]}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 justify-between">
              {!cloud.every(Boolean) && (
                <button
                  onClick={() => void startCloudUpload(session, files)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold inline-flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <Cloud className="w-4 h-4" /> Upload temporary cloud copy
                </button>
              )}
              <button
                onClick={cancelTransfer}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold inline-flex items-center gap-2 ml-auto"
              >
                <XCircle className="w-4 h-4" /> Cancel transfer
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ---------------- File selection screen ----------------
  return (
    <div className="space-y-5">
      {error && <Banner kind="error" onClose={() => setError("")}>{error}</Banner>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragOver ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30" : "border-slate-300 dark:border-slate-700 hover:border-cyan-400"
        }`}
      >
        <Upload className="w-8 h-8 mx-auto text-cyan-600 mb-2" />
        <p className="font-semibold">Select or drop files to share</p>
        <p className="text-xs text-slate-500 mt-1">
          Photos, videos, PDFs & documents · up to {MAX_FILES_PER_SESSION} files · {formatBytes(MAX_P2P_FILE_BYTES)} per file direct ·{" "}
          {formatBytes(DEFAULT_CLOUD_FILE_BYTES)} per file via cloud fallback
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-2 p-3 text-sm">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate flex-1">{f.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                  {formatLabel({ name: f.name, size: f.size, type: f.type })}
                </span>
                <span className="text-xs text-slate-500 shrink-0 w-16 text-right">{formatBytes(f.size)}</span>
                {f.size > DEFAULT_CLOUD_FILE_BYTES && (
                  <span title="Too large for cloud fallback; direct transfer only" className="text-[10px] text-amber-600 shrink-0">
                    direct only
                  </span>
                )}
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label={`Remove ${f.name}`} className="p-1 text-slate-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">
            {files.length}/{MAX_FILES_PER_SESSION} files · {formatBytes(totalBytes)} total
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm space-y-1">
              <span className="font-semibold">Link expires after</span>
              <select
                value={expiry}
                onChange={(e) => setExpiry(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {EXPIRY_OPTIONS_MIN.map((m) => (
                  <option key={m} value={m}>
                    {expiryLabel(m)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm space-y-1">
              <span className="font-semibold">Password (optional)</span>
              <input
                type="password"
                value={password}
                maxLength={128}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave empty for no password"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </label>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={cloudCopy} onChange={(e) => setCloudCopy(e.target.checked)} className="mt-1" />
            <span>
              <span className="font-semibold">Also upload a temporary cloud copy</span>
              <span className="block text-xs text-slate-500">
                Lets receivers download even if a direct connection is blocked or you close this page. Deleted automatically at expiry.
              </span>
            </span>
          </label>

          <button
            onClick={createTransfer}
            disabled={creating}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-bold inline-flex items-center justify-center gap-2"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
            Generate QR Code
          </button>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------
// Receiver
// ---------------------------------------------------------------------------------------

function ReceiverView({ sessionId }: { sessionId: string }) {
  const [phase, setPhase] = useState<"loading" | "password" | "joining" | "ready" | "ended">("loading");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState("");
  const [join, setJoin] = useState<JoinResponse | null>(null);
  const [conn, setConn] = useState<ReceiverState>("connecting");
  const [cloud, setCloud] = useState<boolean[]>([]);
  const [expiresAt, setExpiresAt] = useState(0);
  const [progress, setProgress] = useThrottledMap<number>();
  const [busy, setBusy] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [zipState, setZipState] = useState<{ active: boolean; label: string; pct: number }>({ active: false, label: "", pct: 0 });
  const [fallbackAsked, setFallbackAsked] = useState(false);
  const receiverRef = useRef<TransferReceiver | null>(null);
  const now = useNow();

  const doJoin = useCallback(
    async (pw?: string) => {
      setPhase("joining");
      setError("");
      try {
        const res = await fetch("/api/transfer/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ s: sessionId, password: pw }),
        });
        const body = await res.json();
        if (res.status === 410) {
          setError(body.error);
          return setPhase("ended");
        }
        if (!res.ok) {
          setError(body.error || "Could not open this transfer.");
          return setPhase(res.status === 401 ? "password" : "ended");
        }
        const j = body as JoinResponse;
        setJoin(j);
        setExpiresAt(j.expiresAt);
        setCloud(j.files.map(() => false));
        setPhase("ready");
        const r = new TransferReceiver(new SignalClient(sessionId, j.token), j.files, {
          onState: setConn,
          onProgress: (i, b) => setProgress(String(i), b),
          onPoll: (p) => {
            setCloud(p.cloud);
            setExpiresAt(p.expiresAt);
          },
          onEnded: (e) => {
            setError(e.message);
            setPhase("ended");
          },
        });
        receiverRef.current = r;
        if (typeof RTCPeerConnection === "undefined") {
          setConn("failed");
        } else {
          r.start();
        }
      } catch {
        setError("Network error. Check your connection and try again.");
        setPhase("password");
      }
    },
    [sessionId, setProgress]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/transfer/session?s=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const st = (await res.json()) as SessionStatus;
        if (cancelled) return;
        if (st.status !== "active") {
          setError(
            st.status === "cancelled"
              ? "The sender cancelled this transfer."
              : st.status === "expired"
              ? "This transfer has expired and its files were deleted."
              : "Transfer not found. The link may be incomplete, already expired, or created on a different server. Ask the sender to generate a new QR code."
          );
          return setPhase("ended");
        }
        if (st.requiresPassword) setPhase("password");
        else void doJoin();
      } catch {
        if (!cancelled) {
          setError("Couldn't reach the server.");
          setPhase("ended");
        }
      }
    })();
    return () => {
      cancelled = true;
      receiverRef.current?.stop();
    };
  }, [sessionId, doJoin]);

  // Direct connection failed: ask the sender for a cloud copy (once).
  useEffect(() => {
    if (conn === "failed" && !fallbackAsked && receiverRef.current) {
      setFallbackAsked(true);
      void receiverRef.current.requestFallback();
    }
  }, [conn, fallbackAsked]);

  const files = useMemo(() => join?.files ?? [], [join]);
  const direct = conn === "connected";

  const getBlob = async (i: number): Promise<Blob> => {
    const r = receiverRef.current!;
    const have = r.getBlob(i);
    if (have) return have;
    if (direct || (!cloud[i] && conn !== "failed")) return r.download(i);
    if (cloud[i]) return fetchCloudBlob(cloudFileUrl(sessionId, join!.token, i) + "&inline=1", (b) => setProgress(String(i), b));
    throw new Error("Waiting for the sender to upload a cloud copy.");
  };

  const downloadOne = async (i: number) => {
    if (!join) return;
    setError("");
    const r = receiverRef.current!;
    // Cloud path without a direct connection: let the browser stream it straight to disk.
    if (!direct && cloud[i] && !r.getBlob(i)) {
      const a = document.createElement("a");
      a.href = cloudFileUrl(sessionId, join.token, i);
      a.download = files[i].name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDone((d) => ({ ...d, [i]: true }));
      return;
    }
    setBusy((b) => ({ ...b, [i]: true }));
    try {
      const blob = await getBlob(i);
      saveBlob(blob, files[i].name);
      setDone((d) => ({ ...d, [i]: true }));
      setProgress(String(i), files[i].size);
      setSuccess(`Downloaded ${files[i].name}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy((b) => ({ ...b, [i]: false }));
    }
  };

  const downloadZip = async () => {
    setError("");
    setZipState({ active: true, label: "Receiving files…", pct: 0 });
    try {
      const zip = new JSZip();
      const used = new Set<string>();
      for (let i = 0; i < files.length; i++) {
        setZipState({ active: true, label: `Receiving ${i + 1}/${files.length}: ${files[i].name}`, pct: (i / files.length) * 80 });
        const blob = await getBlob(i);
        setDone((d) => ({ ...d, [i]: true }));
        let name = files[i].name;
        for (let n = 1; used.has(name); n++) name = files[i].name.replace(/(\.[^.]*)?$/, ` (${n})$1`);
        used.add(name);
        zip.file(name, blob);
      }
      setZipState({ active: true, label: "Creating ZIP…", pct: 80 });
      const out = await zip.generateAsync({ type: "blob", compression: "STORE", streamFiles: true }, (m) =>
        setZipState({ active: true, label: "Creating ZIP…", pct: 80 + m.percent * 0.2 })
      );
      saveBlob(out, `toolifypro-transfer-${new Date().toISOString().slice(0, 10)}.zip`);
      setSuccess("All files downloaded as ZIP.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setZipState({ active: false, label: "", pct: 0 });
    }
  };

  const totalBytes = useMemo(() => files.reduce((a, f) => a + f.size, 0), [files]);

  if (phase === "loading" || phase === "joining") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Opening transfer…</p>
      </div>
    );
  }

  if (phase === "ended") {
    return (
      <div className="space-y-4 text-center py-8">
        <XCircle className="w-10 h-10 mx-auto text-slate-400" />
        <p className="font-semibold">{error || "This transfer is no longer available."}</p>
        <button
          onClick={() => window.location.assign("/tools/qr-file-transfer")}
          className="inline-block px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold"
        >
          Send your own files
        </button>
      </div>
    );
  }

  if (phase === "password") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void doJoin(password);
        }}
        className="max-w-sm mx-auto space-y-4 py-6"
      >
        <div className="text-center">
          <Lock className="w-8 h-8 mx-auto text-cyan-600 mb-2" />
          <h3 className="font-bold">This transfer is password protected</h3>
        </div>
        {error && <Banner kind="error">{error}</Banner>}
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
        />
        <button type="submit" disabled={!password} className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-semibold">
          Unlock files
        </button>
      </form>
    );
  }

  const connBadge = {
    connecting: { text: "Connecting to sender…", cls: "text-slate-500", spin: true },
    reconnecting: { text: "Reconnecting…", cls: "text-amber-600", spin: true },
    connected: { text: "Direct connection", cls: "text-emerald-600", spin: false },
    failed: { text: "Direct connection unavailable", cls: "text-amber-600", spin: false },
    ended: { text: "Transfer ended", cls: "text-slate-500", spin: false },
  }[conn];

  const anyCloud = cloud.some(Boolean);

  return (
    <div className="space-y-5">
      {error && <Banner kind="error" onClose={() => setError("")}>{error}</Banner>}
      {success && <Banner kind="success" onClose={() => setSuccess("")}>{success}</Banner>}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-bold">
            {files.length} file{files.length === 1 ? "" : "s"} shared with you
          </h3>
          <p className="text-xs text-slate-500">
            {formatBytes(totalBytes)} · expires in <span className="tabular-nums">{formatRemaining(expiresAt - now)}</span>
          </p>
        </div>
        <span className={`text-xs font-semibold inline-flex items-center gap-1.5 ${connBadge.cls}`}>
          {connBadge.spin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
          {connBadge.text}
        </span>
      </div>

      {conn === "failed" && (
        <Banner kind="info">
          {join?.cloudMode === "none" && !anyCloud ? (
            "Your network blocked a direct connection, and cloud fallback isn't available on this site. Try another network (e.g. both devices on the same Wi-Fi)."
          ) : anyCloud ? (
            "Your network blocked a direct connection. Files are being served from temporary cloud storage instead."
          ) : (
            <>
              Your network blocked a direct connection. We asked the sender for a temporary cloud copy — files become available as they upload. The sender must
              keep their page open.
            </>
          )}
          <button onClick={() => receiverRef.current?.retry()} className="ml-2 underline inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Retry direct
          </button>
        </Banner>
      )}

      <ul className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
        {files.map((f, i) => {
          const got = progress[String(i)] ?? 0;
          const available = direct || cloud[i] || !!done[i];
          return (
            <li key={i} className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{f.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatLabel(f)} · {formatBytes(f.size)}
                    {cloud[i] && " · cloud copy available"}
                  </p>
                </div>
                {done[i] && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                <button
                  onClick={() => void downloadOne(i)}
                  disabled={!available || busy[i] || zipState.active}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1 shrink-0"
                >
                  {busy[i] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Download
                </button>
              </div>
              {got > 0 && got < f.size && (
                <div className="space-y-1">
                  <ProgressBar value={(got / Math.max(1, f.size)) * 100} />
                  <p className="text-[11px] text-slate-500 tabular-nums">
                    {formatBytes(got)} / {formatBytes(f.size)} ({Math.floor((got / Math.max(1, f.size)) * 100)}%)
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {zipState.active && (
        <div className="space-y-1">
          <ProgressBar value={zipState.pct} />
          <p className="text-xs text-slate-500 truncate">{zipState.label}</p>
        </div>
      )}

      <button
        onClick={() => void downloadZip()}
        disabled={zipState.active || !(direct || cloud.every(Boolean))}
        className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-50 font-bold inline-flex items-center justify-center gap-2"
      >
        {zipState.active ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileArchive className="w-4 h-4" />}
        Download all as ZIP
      </button>
      <p className="text-[11px] text-slate-500 text-center">
        Files are transferred directly between devices when possible. Temporary cloud copies are deleted automatically when the link expires.
      </p>
    </div>
  );
}
