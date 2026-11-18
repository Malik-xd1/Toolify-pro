import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "ToolifyPro – Free Online Tools & Document Utilities (120+ Tools)",
  description:
    "Convert, edit, secure, organize and manage your digital files with ease. 100% Free, Client-Side In-Browser Processing, No Login Required, Completely Private.",
  keywords: [
    "ToolifyPro",
    "PDF tools",
    "image converter",
    "video compressor",
    "MP4 to MP3",
    "QR code generator",
    "file locker",
    "developer tools",
    "online tools",
    "calculators",
  ],
  metadataBase: new URL("https://toolifypro.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${caveat.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
