// PDF Extra Tools Suite for ToolifyPro

import { PDFDocument, rgb } from "pdf-lib";
import { cleanAndLoadPdf } from "./pdfTools";
import { extractTextFromPdf } from "./docxTools";

export async function convertPdfToExcelData(file: File): Promise<{ csvString: string; rowCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const rawText = await extractTextFromPdf(arrayBuffer);
  const lines = rawText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  const rows: string[][] = [];

  // Parse lines into columns (splitting on tabs, multiple spaces, commas, or pipes)
  for (const line of lines) {
    let cells: string[] = [];
    if (line.includes("\t")) {
      cells = line.split("\t");
    } else if (line.includes("|")) {
      cells = line.split("|").map((c) => c.trim()).filter(Boolean);
    } else if (line.includes(",")) {
      cells = line.split(",");
    } else if (/\s{2,}/.test(line)) {
      cells = line.split(/\s{2,}/);
    } else {
      cells = [line];
    }

    if (cells.length > 0) {
      rows.push(cells.map((c) => c.trim()));
    }
  }

  // Ensure header row exists
  if (rows.length === 0) {
    rows.push(["Extracted Content", "Document Name"]);
    rows.push(["No readable text data found in PDF", file.name]);
  }

  const csvString = rows
    .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  return { csvString, rowCount: rows.length };
}

export async function reorderPdfPages(file: File, newOrderIndices: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await cleanAndLoadPdf(arrayBuffer);
  const outDoc = await PDFDocument.create();
  const totalPages = srcDoc.getPageCount();

  // Validate indices (1-based to 0-based)
  const validZeroIndices = newOrderIndices
    .map((num) => num - 1)
    .filter((idx) => idx >= 0 && idx < totalPages);

  if (validZeroIndices.length === 0) {
    throw new Error(`Please specify valid page numbers between 1 and ${totalPages}`);
  }

  const copiedPages = await outDoc.copyPages(srcDoc, validZeroIndices);
  copiedPages.forEach((p) => outDoc.addPage(p));

  return await outDoc.save();
}

export async function signPdfDocument(
  file: File,
  signatureDataUrl: string,
  targetPageNumber: number = 1
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await cleanAndLoadPdf(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const pageIdx = Math.max(0, Math.min(totalPages - 1, targetPageNumber - 1));
  const page = pdfDoc.getPage(pageIdx);
  const { width } = page.getSize();

  // Embed PNG signature
  const sigPngBytes = await fetch(signatureDataUrl).then((res) => res.arrayBuffer());
  const sigImage = await pdfDoc.embedPng(sigPngBytes);

  const sigWidth = 140;
  const sigHeight = (sigWidth / sigImage.width) * sigImage.height;

  // Stamp in bottom-right corner
  page.drawImage(sigImage, {
    x: width - sigWidth - 40,
    y: 40,
    width: sigWidth,
    height: sigHeight,
  });

  return await pdfDoc.save();
}
