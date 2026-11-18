// Shared (client + server) constants and validation for QR File Transfer.

export const MAX_FILES_PER_SESSION = 20;
/** Max size per file for direct (WebRTC) transfer. Files are buffered in the receiver's memory. */
export const MAX_P2P_FILE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
/** Default cloud-fallback cap per file; the server may lower/raise via TRANSFER_CLOUD_MAX_MB. */
export const DEFAULT_CLOUD_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

export const EXPIRY_OPTIONS_MIN = [10, 30, 60, 360, 1440] as const;
export const DEFAULT_EXPIRY_MIN = 30;

/** Executable / script formats are rejected to avoid spreading malware via share links. */
export const BLOCKED_EXTENSIONS = [
  "exe", "msi", "bat", "cmd", "com", "scr", "pif", "vbs", "vbe", "jse",
  "wsf", "wsh", "hta", "cpl", "lnk", "reg", "ps1", "psm1", "msc", "scf",
];

export interface TransferFileMeta {
  name: string;
  size: number;
  type: string;
}

export function fileExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|\x00-\x1f]/g, "_").trim().slice(0, 200);
  return cleaned || "file";
}

/** Returns an error message, or null if the file list is acceptable. */
export function validateFileList(files: TransferFileMeta[]): string | null {
  if (!Array.isArray(files) || files.length === 0) return "Select at least one file.";
  if (files.length > MAX_FILES_PER_SESSION) return `You can share up to ${MAX_FILES_PER_SESSION} files per transfer.`;
  for (const f of files) {
    if (typeof f?.name !== "string" || typeof f?.size !== "number" || f.size < 0) return "Invalid file information.";
    if (BLOCKED_EXTENSIONS.includes(fileExtension(f.name))) {
      return `"${f.name}" is an executable/script file type, which is blocked for safety.`;
    }
    if (f.size > MAX_P2P_FILE_BYTES) return `"${f.name}" exceeds the ${formatBytes(MAX_P2P_FILE_BYTES)} per-file limit.`;
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const v = bytes / Math.pow(1024, i);
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatLabel(meta: TransferFileMeta): string {
  const ext = fileExtension(meta.name);
  return ext ? ext.toUpperCase() : meta.type || "FILE";
}

/** Public session info returned to receivers before/after joining. */
export interface SessionStatus {
  status: "active" | "expired" | "cancelled" | "not_found";
  expiresAt?: number;
  requiresPassword?: boolean;
  fileCount?: number;
}

export type CloudMode = "blob" | "disk" | "none";

export interface JoinResponse {
  cloudMode?: CloudMode;
  peerId: string;
  token: string;
  files: TransferFileMeta[];
  expiresAt: number;
}

export interface SignalMessage {
  from: string;
  data: Record<string, unknown>;
}

export interface PollResponse {
  status: SessionStatus["status"];
  expiresAt: number;
  messages: SignalMessage[];
  /** Per-file: true when a temporary cloud copy is available. */
  cloud: boolean[];
  /** Sender only: peers that joined and when they were last seen. */
  receivers?: { peerId: string; lastSeen: number }[];
}
