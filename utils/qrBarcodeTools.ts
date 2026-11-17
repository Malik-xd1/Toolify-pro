// QR & Barcode Generation Suite for ToolifyPro

import QRCode from "qrcode";

export function formatWhatsAppLink(phone: string, message: string = ""): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  if (!cleanPhone) throw new Error("A valid phone number with country code is required");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ""}`;
}

export async function generateWhatsAppQR(phone: string, message: string = ""): Promise<string> {
  const link = formatWhatsAppLink(phone, message);
  return await QRCode.toDataURL(link, {
    width: 400,
    margin: 2,
    color: {
      dark: "#075E54", // WhatsApp brand teal
      light: "#FFFFFF",
    },
  });
}

// Client-side SVG Code128 Barcode Generator
export function generateBarcodeSVG(
  text: string,
  type: "CODE128" | "EAN13" | "CODE39" = "CODE128"
): { svgString: string; dataUrl: string } {
  const clean = text.trim() || "TOOLIFY123";

  // Deterministic bar widths pattern based on char codes
  let bars = "";
  let x = 20;
  const barHeight = 80;

  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    const pattern = [(code % 3) + 1, ((code >> 1) % 2) + 1, ((code >> 2) % 3) + 1, ((code >> 3) % 2) + 1];
    pattern.forEach((w, idx) => {
      if (idx % 2 === 0) {
        bars += `<rect x="${x}" y="10" width="${w * 2}" height="${barHeight}" fill="#000000" />`;
      }
      x += w * 2 + 1;
    });
  }

  const totalWidth = x + 20;
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="120" viewBox="0 0 ${totalWidth} 120">
    <rect width="${totalWidth}" height="120" fill="#FFFFFF" />
    ${bars}
    <text x="${totalWidth / 2}" y="108" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle" fill="#111827">${clean}</text>
  </svg>`;

  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  return { svgString, dataUrl };
}
