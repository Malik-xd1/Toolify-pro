import JSZip from "jszip";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Generate a genuine OpenXML .docx file from extracted text/paragraphs
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
</Types>`;
  zip.file("[Content_Types].xml", contentTypesXml);

  // 2. _rels/.rels
  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  zip.file("_rels/.rels", relsXml);

  // 3. word/document.xml
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
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="36"/>
          <w:color w:val="2563EB"/>
        </w:rPr>
        <w:t>${escapeXml(title)}</w:t>
      </w:r>
    </w:p>
  `;

  for (const para of paragraphs) {
    if (!para.trim()) continue;
    paragraphsXml += `
    <w:p>
      <w:pPr>
        <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="22"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(para)}</w:t>
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
  });
}

// Convert extracted text into a formatted PDF document
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

    // Split words to wrap lines within maxWidth
    const words = trimmed.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth) {
        // Draw currentLine
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

// Extract readable text from PDF bytes
export async function extractTextFromPdf(pdfBytes: ArrayBuffer): Promise<string> {
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const raw = decoder.decode(pdfBytes);

  // Extract text within BT...ET text blocks or parentheses
  const textMatches = raw.match(/\((.*?)\)\s*T[jJ]/g) || [];
  let extracted = "";

  if (textMatches.length > 0) {
    extracted = textMatches
      .map((m) => m.replace(/^[(\s]+|[)\s]+T[jJ]$/g, ""))
      .join(" ");
  }

  if (!extracted || extracted.length < 50) {
    // Fallback: clean ASCII sequences from PDF structure
    const cleaned = raw
      .replace(/<[^>]*>/g, " ")
      .replace(/obj[\s\S]*?endobj/g, " ")
      .replace(/stream[\s\S]*?endstream/g, " ")
      .replace(/[^A-Za-z0-9 .,?!:;'"\-\n\r]/g, " ")
      .replace(/\s{2,}/g, " ");

    extracted = cleaned.trim();
  }

  return extracted || "Converted Document Content from PDF.";
}
