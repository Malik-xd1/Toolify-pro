import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  RefreshCw,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Editorial Guidelines & Content Standards | ToolifyPro",
  description:
    "Review ToolifyPro's editorial policy: algorithmic integrity, calculation formula verification, content review, and transparency standards.",
  alternates: {
    canonical: "https://toolifypro.com/editorial-guidelines",
  },
};

export default function EditorialGuidelinesPage() {
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
            Editorial Guidelines
          </span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Transparency & Quality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Editorial Guidelines & Standards
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Last Updated: November 2026 • Published by ToolifyPro Engineering & Editorial Team
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-blue-900/40 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              1. Our Editorial Mission
            </h2>
            <p>
              ToolifyPro is dedicated to providing accurate, secure, practical, and accessible digital utilities and educational resources. We believe digital workers, students, developers, and creators deserve honest tools that deliver genuine utility without misleading claims, artificial paywalls, or privacy-invasive tracking.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              2. Algorithmic Integrity & Mathematical Verification
            </h2>
            <p>
              Every utility published on ToolifyPro undergoes strict technical verification before public deployment:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-700 dark:text-slate-300">
              <li>
                <strong>Financial & Actuarial Calculators:</strong> Loan, EMI, compound interest, and profit margin calculators implement standard mathematical formulas (e.g., standard reducing-balance amortization algorithms).
              </li>
              <li>
                <strong>Health & Wellness Calculators:</strong> Body Mass Index (BMI) and calorie calculators cite standard World Health Organization (WHO) and Centers for Disease Control (CDC) classification thresholds.
              </li>
              <li>
                <strong>Cryptographic & Privacy Tools:</strong> Password generation, PIN derivation, and hashing utilize cryptographically secure random number generators (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-mono text-[11px]">crypto.getRandomValues</code>) rather than predictable pseudo-random seeds.
              </li>
              <li>
                <strong>Developer Syntax Parsers:</strong> JSON, HTML, CSS, and JavaScript formatters utilize industry-standard AST parsing rules to ensure data structure integrity is never corrupted during beautification or minification.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              3. Originality & Human Oversight
            </h2>
            <p>
              All explanatory articles, tool guides, technical tutorials, and frequently asked questions are authored, reviewed, and maintained by our technical writers and engineers. We strictly prohibit:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-700 dark:text-slate-300">
              <li>Unverified, hallucinated, or unedited generative AI text dumping.</li>
              <li>Plagiarized content or scraped text from competitor websites.</li>
              <li>Keyword stuffing or artificial filler intended solely to manipulate search rankings.</li>
              <li>Deceptive download prompts, misleading advertisements, or dark design patterns.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              4. Transparency Regarding Tool Limitations
            </h2>
            <p>
              We believe in total transparency regarding what our tools can and cannot achieve. Each tool page explicitly discloses:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-700 dark:text-slate-300">
              <li>The specific browser memory constraints applicable to large file transformations.</li>
              <li>Format compatibility parameters (e.g., raster vs. vector graphic limitations).</li>
              <li>The difference between scanned image PDFs (requiring OCR) and digital text PDFs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              5. Corrections & Continuous Review Protocol
            </h2>
            <p>
              When a user reports a mathematical discrepancy, formatting bug, or outdated guide, our team investigates within 48 business hours. Verified corrections are deployed immediately with version tracking.
            </p>
            <p className="mt-2">
              If you detect an error or wish to request an algorithmic audit, please submit a report via our{" "}
              <Link href="/report-problem" className="text-blue-600 dark:text-cyan-400 font-semibold underline">
                Problem Reporting Portal
              </Link>{" "}
              or email us at{" "}
              <a href="mailto:editorial@toolifypro.com" className="text-blue-600 dark:text-cyan-400 font-semibold underline">
                editorial@toolifypro.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
