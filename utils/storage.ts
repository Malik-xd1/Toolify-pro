// Zero-Knowledge Encrypted Client-Side File Locker Engine

export interface LockerFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: "pdf" | "image" | "video" | "document" | "other";
  folder?: string;
  createdAt: number;
  encryptedData: string; // Base64 encoded encrypted bytes
  iv: string; // Base64 initialization vector
}

export interface LockerFolder {
  id: string;
  name: string;
  color?: string;
}

export interface LockerMeta {
  lockerId: string;
  recoveryKey: string;
  salt: string; // Base64 PBKDF2 salt
  verifier: string; // Encrypted known string to verify password
  verifierIv: string;
  createdAt: number;
  folders: LockerFolder[];
}

const DB_NAME = "YourTools_LockerDB";
const DB_VERSION = 1;
const STORE_FILES = "files";
const STORE_META = "metadata";

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        db.createObjectStore(STORE_FILES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Cryptographic helpers using Web Crypto API
async function deriveKey(password: string, saltBytes: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes as unknown as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

// Generate random 12-word recovery key
export function generateRecoveryKey(): string {
  const words = [
    "shield", "cipher", "matrix", "falcon", "nexus", "quantum", "crystal", "orbit", 
    "aurora", "zenith", "vortex", "cobalt", "mystic", "beacon", "titan", "stellar",
    "horizon", "pulse", "solaris", "shadow", "apex", "echo", "stride", "haven"
  ];
  const selected: string[] = [];
  const randValues = new Uint32Array(12);
  window.crypto.getRandomValues(randValues);
  for (let i = 0; i < 12; i++) {
    selected.push(words[randValues[i] % words.length]);
  }
  return selected.join("-");
}

export function generateLockerId(): string {
  const rand = new Uint8Array(4);
  window.crypto.getRandomValues(rand);
  const hex = Array.from(rand)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");
  return `LOCKER-${hex.slice(0, 4)}-${hex.slice(4)}`;
}

// Locker State & Engine
export class LockerEngine {
  private static cachedKey: CryptoKey | null = null;
  private static activeLockerId: string | null = null;

  static isUnlocked(): boolean {
    return this.cachedKey !== null;
  }

  static getActiveLockerId(): string | null {
    return this.activeLockerId;
  }

  static lock(): void {
    this.cachedKey = null;
    this.activeLockerId = null;
  }

  // Check if a locker exists in local browser
  static async getLockerMeta(): Promise<LockerMeta | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_META, "readonly");
      const store = tx.objectStore(STORE_META);
      const req = store.get("locker_meta");
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => reject(req.error);
    });
  }

  // Create new locker
  static async createLocker(password: string): Promise<LockerMeta> {
    const db = await openDB();
    const lockerId = generateLockerId();
    const recoveryKey = generateRecoveryKey();

    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt);

    const key = await deriveKey(password, salt);

    // Create verifier
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);
    const verifierText = new TextEncoder().encode("VERIFIED_LOCKER_KEY");
    const encryptedVerifier = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv as unknown as BufferSource },
      key,
      verifierText
    );

    const meta: LockerMeta = {
      lockerId,
      recoveryKey,
      salt: arrayBufferToBase64(salt),
      verifier: arrayBufferToBase64(encryptedVerifier),
      verifierIv: arrayBufferToBase64(iv),
      createdAt: Date.now(),
      folders: [
        { id: "personal", name: "Personal Docs" },
        { id: "work", name: "Work Contracts" },
      ],
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_META, "readwrite");
      const store = tx.objectStore(STORE_META);
      const req = store.put({ key: "locker_meta", data: meta });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    this.cachedKey = key;
    this.activeLockerId = lockerId;
    return meta;
  }

  // Unlock existing locker with password or recovery key
  static async unlock(credential: string): Promise<boolean> {
    const meta = await this.getLockerMeta();
    if (!meta) return false;

    try {
      const saltBytes = base64ToArrayBuffer(meta.salt);
      const verifierBytes = base64ToArrayBuffer(meta.verifier);
      const ivBytes = base64ToArrayBuffer(meta.verifierIv);

      // Attempt unlocking with password or recovery key
      let key = await deriveKey(credential.trim(), saltBytes);
      let isValid = false;

      try {
        const decrypted = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv: ivBytes as unknown as BufferSource },
          key,
          verifierBytes as unknown as BufferSource
        );
        const text = new TextDecoder().decode(decrypted);
        if (text === "VERIFIED_LOCKER_KEY") {
          isValid = true;
        }
      } catch {
        // If password failed, test if credential is recovery key
        if (credential.trim().toLowerCase() === meta.recoveryKey.toLowerCase()) {
          // Recovery key matched!
          isValid = true;
          // Re-derive key from recovery key directly
          key = await deriveKey(meta.recoveryKey, saltBytes);
        }
      }

      if (isValid) {
        this.cachedKey = key;
        this.activeLockerId = meta.lockerId;
        return true;
      }
      return false;
    } catch (err) {
      console.error("Unlock failed", err);
      return false;
    }
  }

  // Upload and encrypt file
  static async saveFile(
    file: File,
    folderId?: string
  ): Promise<LockerFile> {
    if (!this.cachedKey) {
      throw new Error("Locker is locked. Unlock first.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv as unknown as BufferSource },
      this.cachedKey,
      arrayBuffer
    );

    let category: LockerFile["category"] = "other";
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (type.includes("pdf") || name.endsWith(".pdf")) category = "pdf";
    else if (type.startsWith("image/") || /\.(png|jpg|jpeg|webp|gif|svg)$/.test(name)) category = "image";
    else if (type.startsWith("video/") || /\.(mp4|mov|avi|webm|mkv)$/.test(name)) category = "video";
    else if (
      type.includes("word") ||
      type.includes("document") ||
      type.includes("text") ||
      /\.(txt|docx|doc|xlsx|csv|md)$/.test(name)
    )
      category = "document";

    const lockerFile: LockerFile = {
      id: "file_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      category,
      folder: folderId,
      createdAt: Date.now(),
      encryptedData: arrayBufferToBase64(encrypted),
      iv: arrayBufferToBase64(iv),
    };

    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, "readwrite");
      const store = tx.objectStore(STORE_FILES);
      const req = store.put(lockerFile);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    return lockerFile;
  }

  // Get all files
  static async listFiles(): Promise<LockerFile[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, "readonly");
      const store = tx.objectStore(STORE_FILES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // Decrypt file to Blob for preview or download
  static async decryptFile(file: LockerFile): Promise<Blob> {
    if (!this.cachedKey) {
      throw new Error("Locker is locked.");
    }

    const encryptedBytes = base64ToArrayBuffer(file.encryptedData);
    const ivBytes = base64ToArrayBuffer(file.iv);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes as unknown as BufferSource },
      this.cachedKey,
      encryptedBytes as unknown as BufferSource
    );

    return new Blob([decrypted], { type: file.type });
  }

  // Delete file
  static async deleteFile(id: string): Promise<void> {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, "readwrite");
      const store = tx.objectStore(STORE_FILES);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Rename file
  static async renameFile(id: string, newName: string): Promise<void> {
    const db = await openDB();
    const files = await this.listFiles();
    const file = files.find((f) => f.id === id);
    if (!file) return;

    file.name = newName;
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, "readwrite");
      const store = tx.objectStore(STORE_FILES);
      const req = store.put(file);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Add folder
  static async createFolder(name: string): Promise<void> {
    const meta = await this.getLockerMeta();
    if (!meta) return;

    meta.folders = meta.folders || [];
    meta.folders.push({
      id: "folder_" + Date.now(),
      name,
    });

    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_META, "readwrite");
      const store = tx.objectStore(STORE_META);
      const req = store.put({ key: "locker_meta", data: meta });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Export full encrypted backup vault file
  static async exportVault(): Promise<string> {
    const meta = await this.getLockerMeta();
    const files = await this.listFiles();
    return JSON.stringify({
      version: 1,
      appName: "YourTools Vault",
      meta,
      files,
    }, null, 2);
  }

  // Import vault file
  static async importVault(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.meta || !parsed.files) return false;

      const db = await openDB();
      // Save meta
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_META, "readwrite");
        const store = tx.objectStore(STORE_META);
        const req = store.put({ key: "locker_meta", data: parsed.meta });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      // Save files
      for (const file of parsed.files) {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_FILES, "readwrite");
          const store = tx.objectStore(STORE_FILES);
          const req = store.put(file);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }

      return true;
    } catch (err) {
      console.error("Failed to import vault", err);
      return false;
    }
  }
}
