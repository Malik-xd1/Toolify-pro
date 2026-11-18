import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  HelpCircle,
  Shield,
  Zap,
  Lock,
  FileText,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | ToolifyPro",
  description:
    "Find answers to common questions about ToolifyPro: file privacy, browser-based processing, supported formats, tool limitations, and zero-cost policy.",
  alternates: {
    canonical: "https://toolifypro.com/faq",
  },
};

const FAQ_SECTIONS = [
  {
    category: "General & Platform",
    questions: [
      {
        q: "What is ToolifyPro and how does it work?",
        a: "ToolifyPro is a unified, browser-first digital utility suite providing over 120 free tools spanning PDF management, image manipulation, video & audio conversion, text formatting, web developer utilities, mathematical calculators, and privacy tools. Unlike traditional web converters that require server uploads, ToolifyPro executes algorithms directly inside your web browser using HTML5 Web APIs, WebAssembly, and Canvas technology.",
      },
      {
        q: "Is ToolifyPro really 100% free?",
        a: "Yes. Every tool across all categories is free to use with zero hidden subscriptions, paywalls, trial expirations, or daily conversion quotas. You do not need to register, provide an email address, or enter credit card information.",
      },
      {
        q: "Do I need to create an account or sign in?",
        a: "No. ToolifyPro requires no registration, logins, or social account links. You can access any tool instantly from any modern web browser.",
      },
      {
        q: "How does ToolifyPro fund its infrastructure if the tools are free?",
        a: "We support our ongoing development, hosting, and bandwidth costs through non-intrusive, privacy-compliant digital advertisements (such as Google AdSense). We never sell user data or gate functionality behind paywalls.",
      },
    ],
  },
  {
    category: "Privacy & Data Security",
    questions: [
      {
        q: "Are my uploaded files and documents sent to your servers?",
        a: "No. The vast majority of our tools (including PDF merger, image compressor, audio converter, JSON formatter, and calculators) run client-side in your browser's local sandbox. Your files are read into local browser memory, transformed, and saved directly to your downloads without ever traveling across our servers.",
      },
      {
        q: "How long do you retain my files?",
        a: "Because processing happens directly on your device, we have zero retention. Once you close your browser tab or clear the tool workspace, your files and processed data are instantly wiped from your device's volatile memory (RAM).",
      },
      {
        q: "What about tools that inspect live websites (like DNS Lookup or SEO Checker)?",
        a: "Network inspection tools query public internet DNS servers and HTTP headers via secure edge proxies to bypass browser cross-origin (CORS) limits. These queries only inspect the publicly accessible target domain and never transmit or log your personal identification data.",
      },
    ],
  },
  {
    category: "Tools & Compatibility",
    questions: [
      {
        q: "What file formats does ToolifyPro support?",
        a: "We support industry-standard formats across multiple domains: Documents (PDF, DOCX, TXT, HTML, RTF), Images (PNG, JPG/JPEG, WebP, SVG, ICO), Audio (MP3, WAV, AAC, OGG), Video (MP4, WebM, GIF), and Structured Data (JSON, XML, CSS, CSV, Base64).",
      },
      {
        q: "Are there file size limitations?",
        a: "Because processing utilizes your computer or smartphone's memory (RAM), files up to 50MB–100MB process smoothly on almost all consumer devices. For multi-gigabyte video or heavy bulk archives, system performance depends on your local device hardware.",
      },
      {
        q: "Can I use ToolifyPro on mobile devices and tablets?",
        a: "Yes. ToolifyPro is built on a responsive mobile-first architecture that functions seamlessly across iOS Safari, Android Chrome, iPadOS, and modern desktop browsers.",
      },
      {
        q: "Which browsers are officially supported?",
        a: "ToolifyPro is verified to work on modern versions of Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Opera, and Brave. We recommend keeping your browser updated for optimal WebAssembly and Canvas performance.",
      },
    ],
  },
  {
    category: "Troubleshooting & Feedback",
    questions: [
      {
        q: "Why did a large file fail or freeze during processing?",
        a: "In browser-side processing, very large files (e.g. 200MB+ video or complex 1,000-page scanned PDFs) can occasionally exceed the memory allocation granted to an individual browser tab. If this happens, close background browser tabs, verify file integrity, and try again.",
      },
      {
        q: "How do I report a bug or suggest a new tool?",
        a: "We welcome user feedback! Visit our Report a Problem page or contact our development team directly at support@toolifypro.com.",
      },
    ],
  },
];

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_SECTIONS.flatMap((sec) =>
      sec.questions.map((q) => ({
        "@type": "Question",
        name: q.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.a,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6"
        >
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            FAQ
          </span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Everything you need to know about ToolifyPro, our browser-native security architecture, file privacy, and supported utilities.
          </p>
        </div>

        {/* Quick Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white dark:bg-[#0a122e] p-5 rounded-2xl border border-slate-200 dark:border-blue-900/40 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Zero Server Uploads</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Files process locally on your hardware for privacy.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a122e] p-5 rounded-2xl border border-slate-200 dark:border-blue-900/40 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Free Forever</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">No subscriptions, no trials, no paywalls, no login.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a122e] p-5 rounded-2xl border border-slate-200 dark:border-blue-900/40 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Every Screen & OS</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Runs smoothly on mobile phones, tablets, and desktops.</p>
            </div>
          </div>
        </div>

        {/* Categorized FAQs */}
        <div className="space-y-10">
          {FAQ_SECTIONS.map((section, sIdx) => (
            <div key={sIdx}>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
                <span>{section.category}</span>
              </h2>

              <div className="space-y-3">
                {section.questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="bg-white dark:bg-[#0a122e] border border-slate-200 dark:border-blue-900/40 rounded-2xl p-5 shadow-sm hover:border-blue-300 dark:hover:border-cyan-500/40 transition-colors"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {q.q}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {q.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Help CTA */}
        <div className="mt-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl shadow-blue-600/20">
          <h2 className="text-xl sm:text-2xl font-black">Still have questions or found a bug?</h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto mt-2">
            Our technical support team is always eager to assist you with inquiries, custom tool requests, or issue resolutions.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md"
            >
              Contact Support
            </Link>
            <Link
              href="/report-problem"
              className="bg-blue-900/40 border border-white/30 text-white hover:bg-blue-900/60 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
            >
              Report a Problem
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
