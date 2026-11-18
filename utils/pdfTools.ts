import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

// Robust PDF loader that handles offset headers, BOMs, prepended bytes, and non-PDF fallbacks
export async function cleanAndLoadPdf(arrayBuffer: ArrayBuffer): Promise<PDFDocument> {
  const bytes = new Uint8Array(arrayBuffer);

  // Look for '%PDF-' signature (0x25, 0x50, 0x44, 0x46, 0x2D)
  let headerIndex = -1;
  for (let i = 0; i <= bytes.length - 5; i++) {
    if (
      bytes[i] === 0x25 &&
      bytes[i + 1] === 0x50 &&
      bytes[i + 2] === 0x44 &&
      bytes[i + 3] === 0x46 &&
      bytes[i + 4] === 0x2d
    ) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex !== -1) {
    const validPdfBuffer =
      headerIndex === 0 ? arrayBuffer : arrayBuffer.slice(headerIndex);
    try {
      return await PDFDocument.load(validPdfBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });
    } catch {
      return await PDFDocument.load(validPdfBuffer);
    }
  }

  // Check if user uploaded an image instead (PNG or JPEG)
  const isPng =
    bytes.length > 4 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isJpg =
    bytes.length > 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;

  if (isPng || isJpg) {
    const doc = await PDFDocument.create();
    let embeddedImg;
    if (isPng) {
      embeddedImg = await doc.embedPng(arrayBuffer);
    } else {
      embeddedImg = await doc.embedJpg(arrayBuffer);
    }
    const page = doc.addPage([embeddedImg.width, embeddedImg.height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: embeddedImg.width,
      height: embeddedImg.height,
    });
    return doc;
  }

  // If text or other document
  try {
    const text = new TextDecoder().decode(bytes);
    if (text && text.trim().length > 0) {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      page.drawText(text.slice(0, 3000), {
        x: 50,
        y: 800,
        size: 11,
        font,
      });
      return doc;
    }
  } catch {}

  throw new Error(
    "Invalid PDF file: The uploaded file does not contain a valid %PDF- header. Please ensure you are uploading a valid .pdf document."
  );
}

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await cleanAndLoadPdf(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

export async function splitPDF(
  file: File,
  pageRanges: string // e.g. "1-3, 5" (1-indexed)
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await cleanAndLoadPdf(arrayBuffer);
  const totalPages = srcPdf.getPageCount();

  const pagesToExtract = new Set<number>();
  const parts = pageRanges.split(",").map((s) => s.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          pagesToExtract.add(i - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        pagesToExtract.add(p - 1);
      }
    }
  }

  if (pagesToExtract.size === 0) {
    throw new Error("No valid pages selected for split");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, Array.from(pagesToExtract).sort((a, b) => a - b));
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

export async function rotatePDF(file: File, angleDeg: number = 90): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await cleanAndLoadPdf(arrayBuffer);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angleDeg) % 360));
  });

  return await pdf.save();
}

export async function addWatermarkPDF(
  file: File,
  text: string = "CONFIDENTIAL",
  opacity: number = 0.35
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await cleanAndLoadPdf(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const fontSize = Math.min(width, height) / 10;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font,
      color: rgb(0.8, 0.2, 0.2),
      opacity,
      rotate: degrees(45),
    });
  });

  return await pdf.save();
}

export async function addPageNumbersPDF(
  file: File,
  position: "bottom-center" | "bottom-right" | "top-right" = "bottom-center"
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await cleanAndLoadPdf(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const total = pages.length;

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const text = `Page ${idx + 1} of ${total}`;
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x = width / 2 - textWidth / 2;
    let y = 25;

    if (position === "bottom-right") {
      x = width - textWidth - 30;
      y = 25;
    } else if (position === "top-right") {
      x = width - textWidth - 30;
      y = height - 30;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  return await pdf.save();
}

export async function imagesToPDF(imageFiles: File[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  for (const file of imageFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const isPng = file.type.includes("png") || file.name.toLowerCase().endsWith(".png");
    let embeddedImg;

    if (isPng) {
      embeddedImg = await pdf.embedPng(arrayBuffer);
    } else {
      embeddedImg = await pdf.embedJpg(arrayBuffer);
    }

    const { width, height } = embeddedImg;
    const page = pdf.addPage([width, height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  return await pdf.save();
}

export async function removePagesPDF(file: File, pagesToRemove: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await cleanAndLoadPdf(arrayBuffer);
  const total = pdf.getPageCount();

  // Convert 1-indexed to 0-indexed and sort descending to avoid index shifts
  const toDelete = pagesToRemove
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < total)
    .sort((a, b) => b - a);

  toDelete.forEach((idx) => {
    pdf.removePage(idx);
  });

  return await pdf.save();
}

/**
 * Truly compresses PDF documents client-side using stream consolidation and image resampling
 */
export async function compressPDF(
  file: File,
  qualityPercent: number = 70,
  onProgress?: (progress: number) => void
): Promise<{ bytes: Uint8Array; originalSize: number; compressedSize: number }> {
  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();

  if (onProgress) onProgress(20);

  const pdfDoc = await cleanAndLoadPdf(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  // High-compression via canvas page rendering for large files (> 1MB)
  if (originalSize > 1024 * 1024 && typeof window !== "undefined") {
    try {
      const { renderPdfPageToCanvas } = await import("./docxTools");
      const compressedDoc = await PDFDocument.create();

      const scale = qualityPercent < 50 ? 1.0 : qualityPercent < 75 ? 1.25 : 1.5;
      const jpegQuality = Math.max(0.4, Math.min(0.85, qualityPercent / 100));

      for (let i = 1; i <= totalPages; i++) {
        if (onProgress) onProgress(20 + Math.round((i / totalPages) * 60));
        const canvas = await renderPdfPageToCanvas(arrayBuffer, i, scale);
        const jpegDataUrl = canvas.toDataURL("image/jpeg", jpegQuality);
        const jpegBytes = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());
        const embedded = await compressedDoc.embedJpg(jpegBytes);
        const page = compressedDoc.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width: embedded.width,
          height: embedded.height,
        });
      }

      if (onProgress) onProgress(90);
      const compressedBytes = await compressedDoc.save({ useObjectStreams: true });
      if (compressedBytes.length < originalSize) {
        return { bytes: compressedBytes, originalSize, compressedSize: compressedBytes.length };
      }
    } catch (e) {
      console.warn("Canvas compression fallback:", e);
    }
  }

  if (onProgress) onProgress(80);
  const optimizedBytes = await pdfDoc.save({ useObjectStreams: true });
  return {
    bytes: optimizedBytes,
    originalSize,
    compressedSize: optimizedBytes.length,
  };
}

/**
 * Truly encrypts PDF with AES-256 standard security handler password protection
 */
export async function protectPDF(
  file: File,
  password: string
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);
  const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt");
  return await encryptPDF(pdfBytes, password, { algorithm: "AES-256" });
}

/**
 * Removes password protection from an unlocked PDF document
 */
export async function unlockPDF(
  file: File
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await cleanAndLoadPdf(arrayBuffer);
  return await pdfDoc.save({ useObjectStreams: true });
}

// Download helper for binary arrays
export function downloadBlob(data: Uint8Array | Blob, filename: string, mimeType: string = "application/octet-stream") {
  const blob = data instanceof Blob ? data : new Blob([data as unknown as BlobPart], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
