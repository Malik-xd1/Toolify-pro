"use client";

import React from "react";
import { X, ShieldCheck, Scale, AlertCircle } from "lucide-react";

export type LegalDocType = "privacy" | "terms" | "disclaimer";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: LegalDocType;
}

export default function LegalModal({ isOpen, onClose, docType }: LegalModalProps) {
  if (!isOpen) return null;

  const contentMap = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "100% Client-Side Processing & Zero-Knowledge Architecture",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            At <strong>YourTools</strong>, privacy is not an afterthought—it is the foundational architecture of the platform. We operate under a strict <strong>Zero-Knowledge &amp; No-Log</strong> principle.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-emerald-500">
              Key Privacy Guarantees
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><strong>Local File Processing:</strong> All PDF manipulations, image resizes/compressions, audio/video conversions, and cryptographic functions run directly in your web browser. Your files never touch external servers.</li>
              <li><strong>Zero User Registration:</strong> We do not ask for email addresses, phone numbers, names, or account passwords.</li>
              <li><strong>No Tracking &amp; No Cookies:</strong> We do not track your digital fingerprint, store analytics cookies, or sell browsing habits.</li>
              <li><strong>Encrypted Private Storage:</strong> The File Locker encrypts files on your device using 256-bit AES-GCM with PBKDF2 before storing them in your browser&apos;s isolated IndexedDB storage. Only you hold the decryption keys.</li>
            </ul>
          </div>
          <p>
            When you close your browser or clear site data, your local workspace remains under your full control. You can export an encrypted <code>.vault</code> backup anytime.
          </p>
        </div>
      ),
    },
    terms: {
      title: "Terms of Service",
      subtitle: "Open-Access, Free Usage & Fair Use Policy",
      icon: <Scale className="w-6 h-6 text-blue-400" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Welcome to <strong>YourTools</strong>. By accessing and using any tool on this platform, you agree to these transparent Terms of Service.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-500">
              Usage Guidelines
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><strong>100% Free &amp; Open Access:</strong> All tools are provided free of charge for personal and commercial productivity.</li>
              <li><strong>Lawful Content:</strong> Users agree not to use the tools to generate, modify, or distribute illegal material, malicious executables, or copyrighted assets without appropriate rights.</li>
              <li><strong>Client-Side Ownership:</strong> You retain 100% ownership, copyright, and control over any documents, images, or media processed through YourTools.</li>
            </ul>
          </div>
          <p>
            YourTools does not throttle or impose artificial paywalls. All utility algorithms run via your device&apos;s native computing power.
          </p>
        </div>
      ),
    },
    disclaimer: {
      title: "Legal Disclaimer",
      subtitle: "Tool Accuracy, Data Responsibility & Encryption Notice",
      icon: <AlertCircle className="w-6 h-6 text-amber-400" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>YourTools</strong> is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-amber-500">
              Important Notices
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><strong>Local Encryption Responsibility:</strong> Because the File Locker employs true client-side zero-knowledge encryption, YourTools staff cannot recover lost master passwords or restore lost recovery keys. Please safeguard your 12-word recovery key.</li>
              <li><strong>File Integrity:</strong> While we employ industry-standard parsing libraries (pdf-lib, JSZip, Canvas, Web Audio API), we recommend keeping original backups of critical files prior to compression or destructive trimming.</li>
              <li><strong>Third-Party System Compatibility:</strong> Formats exported (.docx, .pdf, .zip, .mp3) follow open standard specifications compatible with Microsoft Office, LibreOffice, and Google Docs.</li>
            </ul>
          </div>
        </div>
      ),
    },
  };

  const current = contentMap[docType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#080e26] border border-slate-200 dark:border-blue-900/60 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {current.icon}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {current.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {current.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 overflow-y-auto flex-1">
          {current.body}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
