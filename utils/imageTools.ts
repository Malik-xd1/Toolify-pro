import JSZip from "jszip";

// Load image into HTMLImageElement
export function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

// Compress Image
export async function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  format: "jpeg" | "webp" | "auto" = "auto"
): Promise<{
  blob: Blob;
  url: string;
  originalSize: number;
  newSize: number;
  reductionPercentage: number;
  width: number;
  height: number;
}> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let { width, height } = img;
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  canvas.width = width;
  canvas.height = height;

  let mime = file.type || "image/jpeg";
  if (format === "jpeg") {
    mime = "image/jpeg";
  } else if (format === "webp") {
    mime = "image/webp";
  } else {
    // auto: if png, default to webp for transparency + high compression
    if (file.type === "image/png") {
      mime = "image/webp";
    }
  }

  if (ctx) {
    if (mime === "image/jpeg") {
      // Fill white background for transparent images converted to jpeg
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Compression failed"));
          return;
        }
        const originalSize = file.size;
        const newSize = blob.size;
        const reductionPercentage = Math.round(((originalSize - newSize) / originalSize) * 100);

        resolve({
          blob,
          url: URL.createObjectURL(blob),
          originalSize,
          newSize,
          reductionPercentage,
          width,
          height,
        });
      },
      mime,
      quality
    );
  });
}

// Convert image format
export async function convertImageFormat(
  file: File,
  targetFormat: "image/jpeg" | "image/png" | "image/webp",
  quality: number = 0.92
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  if (targetFormat === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Format conversion failed"));
        else resolve(blob);
      },
      targetFormat,
      quality
    );
  });
}

// Resize image
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  mimeType: string = "image/png"
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Resize failed"));
    }, mimeType);
  });
}

// Rotate & flip image
export async function transformImage(
  file: File,
  rotationDeg: number = 90,
  flipH: boolean = false,
  flipV: boolean = false
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context unavailable");

  const isPerpendicular = rotationDeg % 180 !== 0;
  canvas.width = isPerpendicular ? img.height : img.width;
  canvas.height = isPerpendicular ? img.width : img.height;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Transform failed"));
    }, file.type || "image/png");
  });
}

// Apply Filters
export async function applyFilters(
  file: File,
  filters: {
    brightness: number; // 100 is default
    contrast: number; // 100 is default
    grayscale: number; // 0-100
    sepia: number; // 0-100
    invert: number; // 0-100
  }
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) invert(${filters.invert}%)`;
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Filter application failed"));
    }, file.type || "image/png");
  });
}

// Add Watermark to Image
export async function addWatermarkToImage(
  file: File,
  text: string,
  color: string = "#ffffff",
  opacity: number = 0.6,
  position: "center" | "bottom-right" | "top-left" = "bottom-right"
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.drawImage(img, 0, 0);

  const fontSize = Math.max(16, Math.round(canvas.width / 25));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const padding = 20;

  let x = padding;
  let y = fontSize + padding;

  if (position === "center") {
    x = (canvas.width - textWidth) / 2;
    y = canvas.height / 2;
  } else if (position === "bottom-right") {
    x = canvas.width - textWidth - padding;
    y = canvas.height - padding;
  }

  // Draw subtle shadow for contrast
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillText(text, x, y);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Watermark failed"));
    }, file.type || "image/png");
  });
}

// Generate Favicon Suite
export async function generateFaviconSuite(file: File): Promise<Blob> {
  const img = await loadImage(file);
  const sizes = [16, 32, 48, 64, 128];
  const zip = new JSZip();

  for (const size of sizes) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, size, size);
      const dataUrl = canvas.toDataURL("image/png");
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
      zip.file(`favicon-${size}x${size}.png`, base64Data, { base64: true });
    }
  }

  return await zip.generateAsync({ type: "blob" });
}

// Extract dominant color palette
export async function extractColorPalette(file: File): Promise<string[]> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const sampleSize = 64;
  canvas.width = sampleSize;
  canvas.height = sampleSize;

  if (!ctx) return ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

  const colorCounts: { [hex: string]: number } = {};

  for (let i = 0; i < imgData.length; i += 16) {
    const r = Math.round(imgData[i] / 32) * 32;
    const g = Math.round(imgData[i + 1] / 32) * 32;
    const b = Math.round(imgData[i + 2] / 32) * 32;
    const a = imgData[i + 3];

    if (a < 128) continue; // Skip transparency

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
  }

  const sorted = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([hex]) => hex);

  return sorted.slice(0, 6);
}
