"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Shield,
  Zap,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolWorkbench from "@/components/ToolWorkbench";
import ToolIcon from "@/components/ToolIcon";
import { Tool, TOOLS, CATEGORIES, ToolCategory } from "@/data/toolsData";

interface ToolPageClientProps {
  tool: Tool;
}

export default function ToolPageClient({ tool }: ToolPageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categoryInfo = CATEGORIES.find((c) => c.id === tool.category) || {
    id: tool.category,
    name: tool.category.toUpperCase(),
    description: "",
    bgColor: "bg-blue-600",
    accentColor: "text-blue-600",
    borderColor: "border-blue-200",
  };

  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 4);

  const getHowToSteps = () => {
    switch (tool.category) {
      case "pdf":
        return [
          {
            step: "1",
            title: "Select or Drop PDF",
            desc: "Drag and drop your PDF document or click to browse files from your local storage.",
          },
          {
            step: "2",
            title: "Configure Options",
            desc: "Adjust page ranges, passwords, rotation angles, or compression preferences.",
          },
          {
            step: "3",
            title: "Instant Download",
            desc: "Click Execute and immediately download your freshly generated PDF document.",
          },
        ];
      case "image":
        return [
          {
            step: "1",
            title: "Upload Image",
            desc: "Select any PNG, JPG, or WebP photo directly from your device.",
          },
          {
            step: "2",
            title: "Tune Dimensions & Styles",
            desc: "Set resize dimensions, compression ratios, crop frames, or remove backgrounds.",
          },
          {
            step: "3",
            title: "Save High-Res Output",
            desc: "Preview your transformed image in real time and download the file with one click.",
          },
        ];
      case "calculators":
        return [
          {
            step: "1",
            title: "Enter Values",
            desc: "Input your primary numbers, financial terms, percentages, or dates.",
          },
          {
            step: "2",
            title: "Instant Real-Time Math",
            desc: "Formulas compute immediately with precision breakdown, formulas, and visual metrics.",
          },
          {
            step: "3",
            title: "Copy or Apply",
            desc: "Copy your calculated breakdown or amortization schedule for planning and records.",
          },
        ];
      case "seo":
        return [
          {
            step: "1",
            title: "Enter Target Domain or URL",
            desc: "Provide the website address, domain, or IP you wish to inspect or audit.",
          },
          {
            step: "2",
            title: "Run Real Diagnostic",
            desc: "Edge queries verify DNS records, response times, SSL status, or on-page tags.",
          },
          {
            step: "3",
            title: "Review Insights",
            desc: "Examine detailed latency breakdowns, server headers, and optimization recommendations.",
          },
        ];
      case "business":
        return [
          {
            step: "1",
            title: "Define Parameters",
            desc: "Specify your project details, invoice line items, keywords, or profile info.",
          },
          {
            step: "2",
            title: "Generate Content",
            desc: "Our algorithms generate structured documents, creative names, or tracking URLs.",
          },
          {
            step: "3",
            title: "Export & Share",
            desc: "Download formatted PDF/text files or copy data directly to your clipboard.",
          },
        ];
      case "developer":
      case "document":
        return [
          {
            step: "1",
            title: "Paste Content",
            desc: "Insert your raw code, JSON data, text snippet, or document into the input field.",
          },
          {
            step: "2",
            title: "Process & Format",
            desc: "Validate syntax, minify payload, count words, or convert casing in real time.",
          },
          {
            step: "3",
            title: "Copy Clean Output",
            desc: "Grab your beautified, validated, or analyzed text instantly.",
          },
        ];
      default:
        return [
          {
            step: "1",
            title: "Provide Input",
            desc: "Upload your file or type your parameters into the dedicated workspace.",
          },
          {
            step: "2",
            title: "Run Processing",
            desc: "The client-side engine executes the algorithm securely in your browser.",
          },
          {
            step: "3",
            title: "Download Result",
            desc: "Access your processed file or copied result with zero waiting time.",
          },
        ];
    }
  };

  const faqs = [
    {
      q: `Is ${tool.name} completely free to use?`,
      a: "Yes! ToolifyPro provides full access to this tool with zero paywalls, no subscription requirements, and unlimited daily usage.",
    },
    {
      q: "Are my sensitive files or personal inputs stored on your servers?",
      a: "No. ToolifyPro prioritizes user privacy. Tools run client-side using browser-native Web APIs, WebAssembly, and Canvas. Your data never leaves your browser unless an external public API lookup is explicitly requested.",
    },
    {
      q: "Does this tool work on mobile devices and tablets?",
      a: "Yes, this tool is fully responsive and optimized for seamless use on smartphones, tablets, laptops, and desktop workstations.",
    },
    {
      q: "Can I download or copy my results immediately?",
      a: "Immediately upon processing completion, a prominent download or copy button appears so you can save your results without delay.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link
            href="/#explore-tools"
            className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          >
            Categories
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="capitalize">{categoryInfo.name}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
            {tool.name}
          </span>
        </nav>

        {/* Tool Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <ToolIcon tool={tool} size="xl" className="mx-auto mb-4 shadow-lg" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{categoryInfo.name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {tool.name}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {tool.description}
          </p>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Instant Processing
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" /> 100% Private & Client-Side
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-500" /> No Login Required
            </span>
          </div>
        </div>

        {/* Embedded Interactive Tool Workbench */}
        <section aria-label={`${tool.name} workspace`} className="my-6">
          <ToolWorkbench toolId={tool.id} isInline={true} />
        </section>

        {/* How to Use Section */}
        <section className="mt-16 bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-900/40 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/30">
                ?
              </span>
              <span>How to Use {tool.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Follow these simple steps to get results in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {getHowToSteps().map((item) => (
              <div
                key={item.step}
                className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-full bg-blue-600/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-black text-sm mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features & Benefits */}
        <section className="mt-12 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-900/10 dark:bg-slate-900/40 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-900/40">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
            Why Choose Our {tool.name}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-3 p-4 bg-white dark:bg-[#070e28] rounded-2xl border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold mb-0.5">
                  100% Free Forever
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Unlimited tasks without subscription fees, usage limits, or locked premium tiers.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white dark:bg-[#070e28] rounded-2xl border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold mb-0.5">
                  Private & Secure
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Executed directly inside your browser sandbox. Your confidential files stay safe.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white dark:bg-[#070e28] rounded-2xl border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold mb-0.5">
                  No Registration
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Start using the tool immediately. No email verification or account creation required.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <span>Frequently Asked Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0a122e] border border-slate-200 dark:border-blue-900/40 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools in Same Category */}
        {relatedTools.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                More {categoryInfo.name}
              </h2>
              <Link
                href="/#explore-tools"
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.id}
                  href={`/tools/${rt.id}`}
                  className="bg-white dark:bg-[#0a122e] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-cyan-400">
                        {rt.category}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {rt.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {rt.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
