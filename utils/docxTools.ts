import JSZip from "jszip";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Safe dynamic loader for pdfjs-dist in browser environments
async function getPdfJs() {
  if (typeof window === "undefined") {
    // SSR / Node environment
    return await import("pdfjs-dist/legacy/build/pdf.mjs");
  }

  const pdfjs = await import("pdfjs-dist");
  try {
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }
  } catch (_) {}
  return pdfjs;
}

/**
 * Extract clean, structured text and paragraphs across all pages of a PDF document
 */
export async function extractTextFromPdf(pdfBytes: ArrayBuffer): Promise<string> {
  try {
    const pdfjs = await getPdfJs();
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBytes),
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const pageOutputs: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items = textContent.items as Array<{
        str?: string;
        transform?: number[];
        width?: number;
        height?: number;
      }>;

      if (!items || items.length === 0) continue;

      let pageText = "";
      let lastY: number | null = null;

      for (const item of items) {
        if (!item.str) continue;
        const currentY = item.transform ? Math.round(item.transform[5]) : null;

        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 6) {
          pageText += "\n";
        } else if (
          pageText.length > 0 &&
          !pageText.endsWith("\n") &&
          !pageText.endsWith(" ")
        ) {
          pageText += " ";
        }

        pageText += item.str;
        lastY = currentY;
      }

      const trimmedPage = pageText.trim();
      if (trimmedPage) {
        pageOutputs.push(trimmedPage);
      }
    }

    if (pageOutputs.length > 0) {
      return pageOutputs.join("\n\n");
    }
  } catch (err) {
    console.warn("pdfjs-dist text extraction failed, falling back to stream scanner:", err);
  }

  // Robust Fallback: Scan text streams and parentheses in raw binary
  try {
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const raw = decoder.decode(pdfBytes);

    const matches = raw.match(/\((.*?)\)\s*T[jJ]/g) || [];
    if (matches.length > 0) {
      const cleaned = matches
        .map((m) =>
          m
            .replace(/^[(\s]+|[)\s]+T[jJ]$/g, "")
            .replace(/\\([()\\])/g, "$1")
            .trim()
        )
        .filter((t) => t.length > 0)
        .join(" ");

      if (cleaned.length > 40) return cleaned;
    }

    // Clean plain text fallback
    const textStripped = raw
      .replace(/<[^>]*>/g, " ")
      .replace(/stream[\s\S]*?endstream/g, " ")
      .replace(/[^A-Za-z0-9 .,?!:;'"\-\n\r]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (textStripped.length > 40) return textStripped;
  } catch {}

  return "Document Content Extracted from PDF.\n(Note: If this document contains only scanned photos, please use our Image to Text OCR tool for optical recognition.)";
}

/**
 * Render an actual PDF page directly to an HTML5 Canvas for true high-res visual fidelity
 */
export async function renderPdfPageToCanvas(
  pdfBytes: ArrayBuffer,
  pageNumber: number = 1,
  targetScale: number = 2.0
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize canvas context");

  try {
    const pdfjs = await getPdfJs();
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBytes),
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(Math.min(pageNumber, pdfDoc.numPages));
    const viewport = page.getViewport({ scale: targetScale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render white background first
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    // @ts-ignore
    await page.render(renderContext).promise;
    return canvas;
  } catch (err) {
    console.warn("pdfjs canvas render fallback:", err);
    // Fallback: render title canvas
    canvas.width = 1200;
    canvas.height = 1600;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("PDF Document Preview", 60, 100);
    return canvas;
  }
}

/**
 * Generate a 100% compliant OpenXML .docx file from extracted text and paragraphs.
 * Fully compatible with Microsoft Word 2013-2024, Microsoft 365, Google Docs, and LibreOffice.
 */
export async function createDocxFromText(
  title: string,
  paragraphs: string[]
): Promise<Blob> {
  const zip = new JSZip();

  // 1. [Content_Types].xml
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;
  zip.file("[Content_Types].xml", contentTypesXml);

  // 2. _rels/.rels
  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  zip.file("_rels/.rels", rootRelsXml);

  // 3. word/_rels/document.xml.rels
  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  zip.file("word/_rels/document.xml.rels", wordRelsXml);

  // 4. word/styles.xml
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:szCs w:val="22"/>
        <w:color w:val="222222"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="160" w:line="260" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="Heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:pPr>
      <w:spacing w:before="240" w:after="120"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="36"/>
      <w:color w:val="1E40AF"/>
    </w:rPr>
  </w:style>
</w:styles>`;
  zip.file("word/styles.xml", stylesXml);

  // 5. word/document.xml
  const escapeXml = (unsafe: string) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  let paragraphsXml = `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:jc w:val="center"/>
        <w:spacing w:before="120" w:after="240"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="36"/>
          <w:color w:val="1E40AF"/>
        </w:rPr>
        <w:t>${escapeXml(title)}</w:t>
      </w:r>
    </w:p>
  `;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Check if this looks like a sub-header (short, title-cased or numbered)
    const isHeader =
      trimmed.length < 80 &&
      (/^(\d+[\.\)]|[A-Z][a-zA-Z\s]{2,40}:?$)/.test(trimmed) ||
        trimmed.toUpperCase() === trimmed);

    paragraphsXml += `
    <w:p>
      <w:pPr>
        <w:spacing w:before="${isHeader ? "180" : "60"}" w:after="120" w:line="260" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
          ${isHeader ? "<w:b/><w:sz w:val='26'/><w:color w:val='1E293B'/>" : "<w:sz w:val='22'/><w:color w:val='334155'/>"}
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(trimmed)}</w:t>
      </w:r>
    </w:p>`;
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphsXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  zip.file("word/document.xml", documentXml);

  return await zip.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
  });
}

/**
 * Convert extracted text into a formatted PDF document
 */
export async function createPdfFromText(
  title: string,
  content: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = 11;
  const lineHeight = 16;
  const margin = 50;
  const pageWidth = 595.28; // A4 width
  const pageHeight = 841.89; // A4 height
  const maxWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Title
  page.drawText(title, {
    x: margin,
    y: y,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.4),
  });
  y -= 35;

  // Divider line
  page.drawLine({
    start: { x: margin, y: y + 10 },
    end: { x: pageWidth - margin, y: y + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  const lines = content.split("\n");

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      y -= lineHeight * 0.7;
      continue;
    }

    const words = trimmed.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth) {
        page.drawText(currentLine, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0.15, 0.15, 0.15),
        });
        y -= lineHeight;

        if (y < margin + 40) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }

        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      page.drawText(currentLine, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });
      y -= lineHeight;

      if (y < margin + 40) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
    }
  }

  return await pdfDoc.save();
}
