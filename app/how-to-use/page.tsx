import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  Play,
  Headphones,
  Calculator,
  Code,
  Shield,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How to Use ToolifyPro - Complete User Guide",
  description:
    "Master ToolifyPro with our complete step-by-step user guide. Learn how to process PDFs, compress images, convert media, use calculators, and format code securely in your browser.",
  alternates: {
    canonical: "https://toolifypro.com/how-to-use",
  },
};

const GUIDES = [
  {
    icon: FileText,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-200 dark:border-red-900/30",
    title: "PDF & Document Suite",
    desc: "Merge, split, compress, protect, convert, and sign PDF documents without server uploads.",
    steps: [
      "Select your desired PDF tool from the navigation menu or tools directory.",
      "Drag and drop your PDF file(s) into the dedicated dotted drop-zone, or click 'Choose Files'.",
      "Configure your processing preferences: page ranges, rotation angles, passwords, or watermark text.",
      "Click the 'Execute' action button to trigger the instant client-side WebAssembly engine.",
      "Click 'Download Processed File' to immediately save your newly generated document.",
    ],
    tip: "For maximum compression efficiency without visible quality loss, use 'Medium Compression' on text-heavy documents.",
  },
  {
    icon: ImageIcon,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-900/30",
    title: "Image & Photo Utilities",
    desc: "Compress, resize, crop, remove backgrounds, convert formats, and create passport photos.",
    steps: [
      "Select the image tool suited to your task (e.g. Image Compressor or JPG to PNG).",
      "Upload your photo in PNG, JPG, WebP, or SVG format.",
      "Adjust dimensions, aspect ratios, target file size percentage, or background transparency options.",
      "Preview the transformation live on the interactive canvas before finalizing.",
      "Download your crisp, high-resolution result with one click.",
    ],
    tip: "Use the WebP converter to reduce website image sizes by up to 35% compared to standard JPEG while preserving transparency.",
  },
  {
    icon: Play,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-900/30",
    title: "Video & Animation Tools",
    desc: "Trim clips, convert video formats, extract MP3 audio, and create animated GIFs.",
    steps: [
      "Choose your video tool (e.g. Video Cutter, Video to GIF, or Video to MP3).",
      "Select an MP4, WebM, or MOV video clip from your device.",
      "Set your start and end trimming timestamps using the interactive timeline scrubbers.",
      "Select target bitrate, frame rate, or output container format.",
      "Allow the in-browser video processor to compile the stream and save the output.",
    ],
    tip: "Keep video clips under 100MB for optimal browser processing speeds on mobile and battery-powered laptops.",
  },
  {
    icon: Headphones,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-900/30",
    title: "Audio & Speech Suite",
    desc: "Convert audio formats, compress sound files, cut tracks, and convert text to speech.",
    steps: [
      "Navigate to the audio tool you require (e.g. MP3 to WAV, Audio Cutter, or Text to Speech).",
      "Upload your audio recording or type your text script into the voice synthesizer.",
      "Select your preferred audio sample rate (e.g., 44.1 kHz CD quality) or synthesis voice pitch.",
      "Process the audio stream locally using the Web Audio API.",
      "Listen to the in-browser preview player and download your finalized audio file.",
    ],
    tip: "When preparing audio for podcast distribution, 128 kbps stereo MP3 strikes the ideal balance between bandwidth and fidelity.",
  },
  {
    icon: Calculator,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-900/30",
    title: "Calculators & Financial Planning",
    desc: "Calculate loan EMIs, compound interest, BMI, GPA, profit margins, and currency conversions.",
    steps: [
      "Choose the appropriate calculator (e.g., Loan EMI Calculator or BMI Calculator).",
      "Input your primary metrics: principal loan amount, annual interest rate, tenure, or body metrics.",
      "View the live mathematical breakdown, amortization schedule, and graphical representation.",
      "Use the 'Copy Result' button to transfer the figures to your spreadsheet or report.",
    ],
    tip: "All calculator formulas adhere strictly to standard actuarial and mathematical formulas. Review our Disclaimer page for estimation notes.",
  },
  {
    icon: Code,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-200 dark:border-cyan-900/30",
    title: "Developer & Security Utilities",
    desc: "Beautify JSON, test Regular Expressions, encode/decode Base64, and generate secure passwords.",
    steps: [
      "Open your developer utility (e.g., JSON Formatter or Regex Tester).",
      "Paste your source code, raw payload, or string into the code editor area.",
      "Choose your indentation width (2 or 4 spaces) or regex matching flags (g, i, m).",
      "Review the parsed syntax tree, errors, or matches highlighted in real time.",
      "Copy the clean output or download the formatted script directly.",
    ],
    tip: "Because our developer tools run 100% client-side, you can safely format production JSON containing sensitive API keys or client tokens without external exposure.",
  },
];

export default function HowToUsePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
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
            How to Use
          </span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master ToolifyPro</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How to Use ToolifyPro
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            A comprehensive, step-by-step guide to executing high-performance digital conversions, calculations, and security tasks directly in your web browser.
          </p>
        </div>

        {/* Core Principles */}
        <div className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-900/40 shadow-sm mb-12">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>3 Simple Steps for Every Tool</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">01</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2">Input or Drop</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Provide your raw text, numbers, or drag and drop your media files into the workspace.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">02</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2">Adjust & Execute</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Fine-tune processing parameters and run the client-side algorithm securely in RAM.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">03</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2">Download & Apply</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Save your transformed file immediately or copy the structured output to your clipboard.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Suite Guides */}
        <div className="space-y-8">
          {GUIDES.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <section
                key={idx}
                className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-900/40 shadow-sm"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`p-3 rounded-2xl ${guide.bg} ${guide.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {guide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {guide.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Execution Steps:
                  </h3>
                  {guide.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Pro Tip */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white font-semibold">Pro Tip: </strong>
                    {guide.tip}
                  </p>
                </div>
              </section>
            );
          })}
        </div>

        {/* Security & Client-Side Notice */}
        <div className="mt-12 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
          <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-emerald-900 dark:text-emerald-300">
              Your Files Never Leave Your Computer
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800/90 dark:text-emerald-400/90 mt-1 leading-relaxed">
              Every operation described above runs in the sandboxed runtime of your device's browser. ToolifyPro does not upload, inspect, or retain your files on remote web servers. Learn more in our{" "}
              <Link href="/privacy" className="underline font-semibold hover:text-emerald-950 dark:hover:text-emerald-200">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/30"
          >
            <span>Explore All 120+ Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
