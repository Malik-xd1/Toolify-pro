import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Eye,
  CheckCircle2,
  Keyboard,
  Contrast,
  Sparkles,
  ChevronRight,
  Mail,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Accessibility Statement (WCAG 2.1 AA) | ToolifyPro",
  description:
    "Review ToolifyPro's accessibility commitment, WCAG 2.1 Level AA standards, assistive technology support, keyboard shortcuts, and feedback contact.",
  alternates: {
    canonical: "https://toolifypro.com/accessibility",
  },
};

export default function AccessibilityPage() {
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
            Accessibility
          </span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <Eye className="w-3.5 h-3.5" />
            <span>Inclusive Design</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Accessibility Statement
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Conformance Target: Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-blue-900/40 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              1. Our Accessibility Commitment
            </h2>
            <p>
              ToolifyPro is dedicated to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards to make our utility platform intuitive, operable, and robust across diverse assistive hardware and software.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              2. Measures to Support Accessibility
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <Keyboard className="w-5 h-5 text-blue-600 dark:text-cyan-400 mb-2" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Keyboard Navigation</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  All interactive controls, buttons, tool inputs, and sliders are accessible and operable using standard <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">Tab</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">Enter</kbd>, and arrow keys.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <Contrast className="w-5 h-5 text-blue-600 dark:text-cyan-400 mb-2" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">High Contrast & Themes</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Our default light palette and custom dark mode both strictly comply with WCAG 2.1 AA minimum 4.5:1 text-to-background contrast ratios for enhanced readability.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              3. Assistive Technology Compatibility
            </h2>
            <p>
              ToolifyPro is designed to be compatible with:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-700 dark:text-slate-300">
              <li>Screen readers (including NVDA, JAWS, VoiceOver, and TalkBack).</li>
              <li>Screen magnifiers and browser-level zoom configurations up to 200% without loss of content structure.</li>
              <li>Speech recognition software for hands-free navigation.</li>
              <li>Operating-system level reduced motion and high-contrast color settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              4. Technical Specifications
            </h2>
            <p>
              Accessibility of ToolifyPro relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-700 dark:text-slate-300">
              <li>HTML5 Semantic Landmarks (<code className="text-blue-600 dark:text-cyan-400 font-mono text-[11px]">&lt;main&gt;</code>, <code className="text-blue-600 dark:text-cyan-400 font-mono text-[11px]">&lt;nav&gt;</code>, <code className="text-blue-600 dark:text-cyan-400 font-mono text-[11px]">&lt;section&gt;</code>, <code className="text-blue-600 dark:text-cyan-400 font-mono text-[11px]">&lt;footer&gt;</code>)</li>
              <li>WAI-ARIA Attributes for dynamic status updates and interactive accordions</li>
              <li>CSS3 Responsive Flexbox and Grid Layouts</li>
              <li>ECMAScript / WebAssembly runtime standards</li>
            </ul>
          </section>

          <section className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Accessibility Feedback & Remediation</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We welcome your feedback on the accessibility of ToolifyPro. If you encounter accessibility barriers, please contact our accessibility coordinator:
            </p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              Email: <a href="mailto:accessibility@toolifypro.com" className="text-blue-600 dark:text-cyan-400 underline font-semibold">accessibility@toolifypro.com</a><br />
              We aim to respond to accessibility inquiries within 2 business days.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
