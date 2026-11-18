import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { AlertCircle, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Disclaimer – ToolifyPro General Informational & Utility Disclaimers",
  description:
    "Important disclaimers regarding calculation estimates, mathematical models, medical/financial limits, and digital file conversions on ToolifyPro.",
  alternates: {
    canonical: "https://toolifypro.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  const lastUpdated = "November 18, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Important Notices</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            General Disclaimer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Last Updated: <strong>{lastUpdated}</strong> • Effective Date: January 1, 2025
          </p>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-[#0a122e] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-blue-900/40 shadow-sm text-xs sm:text-sm leading-relaxed space-y-8">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              1. General Informational and Productivity Purpose
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              All digital tools, calculation algorithms, file conversion utilities, formatters, and textual guides provided on <strong>ToolifyPro</strong> (<code>https://toolifypro.com</code>) are designed strictly for <strong>general informational, educational, and everyday productivity purposes</strong>.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              While we engineer our software to adhere to rigorous mathematical, syntactic, and file format standards, digital processing outcomes may vary depending on source file integrity, client device specifications, browser memory constraints, and operating system quirks.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              2. No Financial, Investment, or Tax Advice
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Our financial and business calculators—including the <strong>Loan Calculator</strong>, <strong>EMI Calculator</strong>, <strong>Compound Interest Calculator</strong>, <strong>Salary Calculator</strong>, <strong>Profit & Margin Calculators</strong>, and <strong>Currency Converter</strong>—utilize standardized mathematical models and generalized interest formulations.
            </p>
            <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-amber-900 dark:text-amber-200 text-xs">
              <strong>Notice:</strong> Outputs from financial calculators should be treated as estimates for planning purposes only. They do not constitute official financial, lending, investment, or taxation advice. Real-world financial figures vary based on lender terms, compounding periods, bank fees, jurisdiction taxes, and dynamic currency exchange spreads. Always consult a certified financial planner, licensed accountant, or qualified financial institution for binding transactions.
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              3. No Medical or Healthcare Advice
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              The <strong>BMI Calculator</strong> computes Body Mass Index based on universal World Health Organization (WHO) baseline categories (weight in kilograms divided by height in meters squared).
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              BMI is a statistical screening metric and does not account for muscle mass, bone density, age, biological sex, athletic conditioning, or clinical health markers. Results do not constitute a medical diagnosis or medical advice. Always consult a licensed physician, clinical nutritionist, or healthcare professional regarding weight management or health concerns.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              4. No Legal or Formal Professional Advice
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Templates and generators provided on the Platform—including the <strong>Invoice Generator</strong>, <strong>Quotation Generator</strong>, <strong>Resume Builder</strong>, <strong>Cover Letter Generator</strong>, and <strong>PDF Signer</strong>—are provided as customizable drafting aids. They do not substitute for formal legal documentation, statutory employment agreements, or certified legal counsel. Users are solely responsible for ensuring that generated invoices and commercial documents comply with local tax, commercial, and legal obligations.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              5. File Integrity and Conversion Accuracy
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Because file conversions (e.g., PDF to Word, Word to PDF, Image formatting, Video frame extraction) require parsing complex document object models, minor variances in typography, table alignment, vector positioning, and embedded fonts may occur.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Users must inspect and verify converted or modified files prior to publishing, submitting, or printing them.</li>
              <li>Always keep a secure backup of your original source files before running compression, deletion, or modification operations.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              6. Network Diagnostics and SEO Audits
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Our web diagnostics—including the <strong>DNS Lookup</strong>, <strong>IP Address Lookup</strong>, <strong>SSL Checker</strong>, and <strong>Website SEO Checker</strong>—query public edge resolvers and on-page markup. Results reflect real-time snapshot conditions and may vary depending on DNS propagation, regional edge caches, and target server firewall configurations.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
              7. Questions Regarding This Disclaimer
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              For questions concerning these disclaimers or to report an inaccuracy in any calculation algorithm, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              Email: <strong>support@toolifypro.com</strong><br />
              Inquiry Form: <Link href="/contact" className="text-blue-600 dark:text-cyan-400 underline">https://toolifypro.com/contact</Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
