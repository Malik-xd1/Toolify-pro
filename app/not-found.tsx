import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "404 - Page Not Found | ToolifyPro",
  description: "The page or tool you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const popularTools = [
    { name: "PDF Merger", href: "/tools/pdf-merger" },
    { name: "Image Compressor", href: "/tools/image-compressor" },
    { name: "Video to MP3", href: "/tools/video-to-mp3" },
    { name: "Age Calculator", href: "/tools/age-calculator" },
    { name: "BMI Calculator", href: "/tools/bmi-calculator" },
    { name: "QR Code Generator", href: "/tools/qr-code-generator" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 text-blue-600 dark:text-cyan-400 mb-6 shadow-inner">
            <span className="text-3xl font-black">404</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            The page or digital tool you requested could not be located. It may have been moved, renamed, or is temporarily unavailable.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500 font-bold text-xs shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Browse All Tools</span>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <span>Popular Tools You Might Need</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors truncate"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
