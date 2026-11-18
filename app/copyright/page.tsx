import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Copyright,
  FileCode,
  Mail,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Copyright & DMCA Policy | ToolifyPro",
  description:
    "Review ToolifyPro's Intellectual Property, User Ownership, Open-Source Credits, and Digital Millennium Copyright Act (DMCA) notice procedure.",
  alternates: {
    canonical: "https://toolifypro.com/copyright",
  },
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
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
            Copyright & DMCA
          </span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <Copyright className="w-3.5 h-3.5" />
            <span>Intellectual Property</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Copyright & DMCA Policy
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Last Updated: November 2026 • Official Intellectual Property Statement
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-blue-900/40 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              1. Ownership of User Files & Processed Output
            </h2>
            <p>
              <strong>You retain 100% full ownership, intellectual property rights, and copyright</strong> over any documents, images, audio, video files, code snippets, or text you process using ToolifyPro.
            </p>
            <p className="mt-2">
              ToolifyPro claims zero ownership, license, or right to use, inspect, replicate, or distribute your uploaded or converted files. Because all transformations happen client-side in your device's memory, we do not store, copy, or index your original or processed files.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              2. ToolifyPro Platform Intellectual Property
            </h2>
            <p>
              The ToolifyPro website, visual branding, proprietary software components, design layouts, written documentation, tutorials, UI icons, and interactive workbench interface are protected by applicable copyright, trademark, and unfair competition laws.
            </p>
            <p className="mt-2">
              You may not scrape, frame, reverse-engineer, clone, or redistribute the platform codebase or proprietary UI workflows without express written permission from ToolifyPro.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              3. Open-Source Software Acknowledgments
            </h2>
            <p>
              ToolifyPro proudly utilizes and complies with permissively licensed open-source libraries that make client-side processing possible, including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-700 dark:text-slate-300">
              <li><strong>pdf-lib</strong> (MIT License) – In-browser PDF generation and manipulation.</li>
              <li><strong>pdfjs-dist</strong> (Apache-2.0 License) – In-browser PDF rendering and text parsing.</li>
              <li><strong>Lucide Icons</strong> (ISC License) – UI iconography.</li>
              <li><strong>Next.js & React</strong> (MIT License) – Application architecture.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              4. Digital Millennium Copyright Act (DMCA) Notice Procedure
            </h2>
            <p>
              ToolifyPro respects the intellectual property rights of creators and adheres to the Digital Millennium Copyright Act (17 U.S.C. § 512). If you believe in good faith that any content hosted directly on our website infringes your copyright, you may submit a formal notification to our Designated Copyright Agent containing:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-slate-700 dark:text-slate-300">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li>Identification of the copyrighted work claimed to have been infringed, or a representative list of such works.</li>
              <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material (specifically, exact URLs).</li>
              <li>Information reasonably sufficient to permit us to contact you, such as your address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ol>
          </section>

          <section className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Designated Copyright Agent Contact</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Attn: ToolifyPro Legal & Copyright Department<br />
              Email: <a href="mailto:dmca@toolifypro.com" className="text-blue-600 dark:text-cyan-400 underline font-semibold">dmca@toolifypro.com</a><br />
              Subject Line: Formal DMCA Takedown Notice
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
