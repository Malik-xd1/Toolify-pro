import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Layers,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us – ToolifyPro All-in-One Digital Platform",
  description:
    "Learn about ToolifyPro: our mission to provide fast, free, privacy-first online tools for PDF, media, calculation, and developer tasks without mandatory signups or server tracking.",
  alternates: {
    canonical: "https://toolifypro.com/about",
  },
};

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Privacy by Design",
      desc: "Whenever technically possible, our tools process files and calculations locally within your web browser using WebAssembly, Canvas, and Web APIs. Your confidential files remain on your device.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Zero Artificial Barriers",
      desc: "No accounts, no mandatory email subscriptions, no CAPTCHAs, and no paywalled download limits for standard utility workflows. Immediate access the moment you visit.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-blue-500" />,
      title: "High-Performance Engineering",
      desc: "Built on modern web architectures (Next.js, Web Audio API, Web Workers) to maximize client processing speeds while keeping system overhead minimal.",
    },
    {
      icon: <Layers className="w-6 h-6 text-cyan-500" />,
      title: "Centralized Utility",
      desc: "Eliminates the frustration of bookmarking dozens of fragmented single-purpose websites. All essential everyday file and data tasks unified under one cohesive interface.",
    },
  ];

  const toolCategories = [
    {
      name: "PDF & Document Suite",
      desc: "Merge, split, compress, protect, watermark, sign, reorder, and convert documents between PDF, Word, and Excel formats.",
    },
    {
      name: "Image & Media Tools",
      desc: "In-browser resizing, lossless compression, format conversions, background removal, passport photo generation, and bicubic upscaling.",
    },
    {
      name: "Audio & Video Utilities",
      desc: "Audio conversion, track trimming, waveform merging, video compression, frame capture, and text-to-speech synthesis.",
    },
    {
      name: "Calculators & Financial Engines",
      desc: "Age, BMI, loan EMI amortization, compound interest, currency conversion across 32 currencies, GPA, and fuel cost calculators.",
    },
    {
      name: "Developer & Security Diagnostics",
      desc: "Syntax formatters for JSON, HTML, and CSS, regular expression tester, Base64 converters, cryptographically secure PIN/key generators, and metadata scrubbers.",
    },
    {
      name: "Business & Productivity Generators",
      desc: "Invoice generators, quotation builders, resumes, UTM tracking link builders, QR codes, and barcodes.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Making Everyday Digital Tasks Fast, Free, and Private
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            ToolifyPro was built to solve a simple yet widespread digital frustration: having to visit dozens of cluttered, ad-heavy, and privacy-invasive websites just to compress a PDF, convert an image, or run a calculation.
          </p>
        </div>

        {/* Section: Why ToolifyPro Was Created */}
        <section className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-blue-900/40 shadow-sm mb-12">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
            <span>The Problem We Solve</span>
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              In today's remote and digital environment, students, professionals, developers, and creators perform repetitive digital file operations daily. However, the online utility landscape is largely divided between two undesirable extremes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Bloated Subscription Paywalls:</strong> Platforms that offer basic conversions but quickly lock downloads behind forced trial credit cards or mandatory accounts.
              </li>
              <li>
                <strong>Privacy-Invasive File Farms:</strong> Unsecured web portals that upload your private documents to third-party remote servers with ambiguous data retention policies and intrusive popups.
              </li>
            </ul>
            <p>
              ToolifyPro takes an fundamentally different technical approach: <strong>client-side browser execution</strong>. By leveraging modern browser APIs, WebAssembly, and high-performance JavaScript engines, we execute complex file manipulation directly on your hardware without sending your personal documents across the internet.
            </p>
          </div>
        </section>

        {/* Section: Core Pillars */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Our Core Engineering Principles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Every tool added to ToolifyPro is built against these four non-negotiable standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0a122e] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: What Types of Tools Are Available */}
        <section className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-blue-900/40 shadow-sm mb-16">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
            Comprehensive Digital Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
            ToolifyPro organizes over 120 specialized utilities across key functional domains:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {toolCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
              >
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                  <span>{cat.name}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Commitment to Transparency */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-xl sm:text-2xl font-black mb-2">
              Ready to Explore the Platform?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              No registration or setup required. Choose any tool from our directory and start converting, calculating, or formatting instantly in your browser.
            </p>
          </div>
          <Link
            href="/tools"
            className="px-6 py-3.5 rounded-full bg-white text-blue-600 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-md flex items-center gap-2 flex-shrink-0 hover:scale-105"
          >
            <span>Browse All 120+ Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
