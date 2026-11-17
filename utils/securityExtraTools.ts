// Security Extra Tools Suite for ToolifyPro

export function generateSecurePin(length: number = 6, allowSequential: boolean = false): string {
  if (length < 4 || length > 12) length = 6;
  const sequentialPatterns = ["0123", "1234", "2345", "3456", "4567", "5678", "6789", "9876", "8765", "7654", "6543", "5432", "4321", "3210"];
  const cryptoObj = typeof window !== "undefined" && window.crypto ? window.crypto : globalThis.crypto;

  while (true) {
    const bytes = new Uint8Array(length);
    if (cryptoObj && cryptoObj.getRandomValues) {
      cryptoObj.getRandomValues(bytes);
    } else {
      for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    let pin = "";
    for (let i = 0; i < length; i++) {
      pin += (bytes[i] % 10).toString();
    }

    if (!allowSequential) {
      // Check for repeated identical characters like 1111 or sequential
      const allSame = pin.split("").every((c) => c === pin[0]);
      const hasSeq = sequentialPatterns.some((p) => pin.includes(p));
      if (!allSame && !hasSeq) return pin;
    } else {
      return pin;
    }
  }
}

export function generateRandomKeys(type: "api_key" | "hex_256" | "base64_256" | "token_512"): { key: string; bits: number; format: string } {
  const cryptoObj = typeof window !== "undefined" && window.crypto ? window.crypto : globalThis.crypto;
  const getRandomBytes = (len: number) => {
    const bytes = new Uint8Array(len);
    if (cryptoObj && cryptoObj.getRandomValues) {
      cryptoObj.getRandomValues(bytes);
    } else {
      for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  };

  if (type === "api_key") {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const bytes = getRandomBytes(32);
    let key = "api_key_";
    for (let i = 0; i < 32; i++) {
      key += chars[bytes[i] % chars.length];
    }
    return { key, bits: 256, format: "API Key (Bearer Token)" };
  } else if (type === "hex_256") {
    const bytes = getRandomBytes(32);
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    return { key: hex, bits: 256, format: "Hexadecimal (256-bit)" };
  } else if (type === "base64_256") {
    const bytes = getRandomBytes(32);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const b64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(bytes).toString("base64");
    return { key: b64, bits: 256, format: "Base64 (256-bit Secret)" };
  } else {
    const bytes = getRandomBytes(64);
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    return { key: hex, bits: 512, format: "Hexadecimal (512-bit High Security)" };
  }
}

export async function stripImageMetadata(file: File): Promise<Blob> {
  // Re-encode through pure canvas pixels to purge all EXIF, GPS, camera, and device metadata
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context failed"));
      ctx.drawImage(img, 0, 0);

      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Purge failed"));
        resolve(blob);
      }, mimeType, 0.95);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}
