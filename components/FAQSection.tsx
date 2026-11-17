"use client";

import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Zap, Lock, HardDrive } from "lucide-react";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is YourTools really 100% free with no login required?",
      a: "Yes! Every single tool across all categories is free and instantly accessible. You do not need to register, verify an email, or create an account.",
    },
    {
      q: "How does the Anonymous File Locker work without an account?",
      a: "The File Locker uses client-side Web Crypto API (256-bit AES-GCM with PBKDF2 key derivation). Files are encrypted before being stored in your browser's private IndexedDB. You are given a unique Locker ID and a 12-word recovery key. You can also export an encrypted .vault backup file to restore your locker on any other computer.",
    },
    {
      q: "Are my files uploaded to your servers during conversions?",
      a: "No! Most processing (PDF merging, image compression, video frame extraction, audio conversion, QR codes, hashing, encryption) executes entirely locally inside your browser engine. Your files never leave your device.",
    },
    {
      q: "Can I use YourTools on mobile devices and tablets?",
      a: "Absolutely. The platform is engineered with a responsive mobile-first interface optimized for touch gestures, camera QR scanning, and mobile file handling.",
    },
  ];

  return (
    <section className="py-12 pb-16 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Everything you need to know about our privacy-first digital tools platform.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  openIdx === idx ? "rotate-180 text-blue-600 dark:text-cyan-400" : ""
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
