import QRCode from "qrcode";

export interface QRCodeOptions {
  text: string;
  darkColor?: string;
  lightColor?: string;
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

export async function generateQRCodeDataUrl(options: QRCodeOptions): Promise<string> {
  return await QRCode.toDataURL(options.text || "https://yourtools.platform", {
    width: options.width || 360,
    margin: options.margin || 2,
    color: {
      dark: options.darkColor || "#000000",
      light: options.lightColor || "#ffffff",
    },
    errorCorrectionLevel: options.errorCorrectionLevel || "M",
  });
}

export async function generateQRCodeSVG(options: QRCodeOptions): Promise<string> {
  return await QRCode.toString(options.text || "https://yourtools.platform", {
    type: "svg",
    width: options.width || 360,
    margin: options.margin || 2,
    color: {
      dark: options.darkColor || "#000000",
      light: options.lightColor || "#ffffff",
    },
    errorCorrectionLevel: options.errorCorrectionLevel || "M",
  });
}

// Generate formatted strings for Wi-Fi and vCard
export function formatWifiQR(ssid: string, password: string, encryption: string = "WPA"): string {
  return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
}

export function formatVCardQR(card: {
  name: string;
  phone: string;
  email: string;
  company?: string;
  url?: string;
}): string {
  return `BEGIN:VCARD\nVERSION:3.0\nN:${card.name}\nFN:${card.name}\nORG:${card.company || ""}\nTEL:${card.phone}\nEMAIL:${card.email}\nURL:${card.url || ""}\nEND:VCARD`;
}
