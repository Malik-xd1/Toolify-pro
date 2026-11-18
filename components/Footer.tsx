"use client";

import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";
import { ToolCategory } from "@/data/toolsData";

interface FooterProps {
  onOpenCategory?: (category: ToolCategory | "all") => void;
  onOpenFileLocker?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenLegal?: (docType: "privacy" | "terms" | "disclaimer") => void;
}

export default function Footer({
  onOpenCategory,
  onOpenFileLocker,
  onOpenAbout,
  onOpenContact,
  onOpenLegal,
}: FooterProps) {
  const handleCategoryClick = (cat: ToolCategory | "all") => {
    if (onOpenCategory) {
      onOpenCategory(cat);
    } else if (typeof window !== "undefined") {
      window.location.href = `/categories/${cat}`;
    }
  };

  return (
    <footer className="bg-[#050917] text-white border-t border-blue-950/60 pt-14 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80 text-xs">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-[#050917] rounded-[11px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400 transform -rotate-6 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Toolify<span className="text-cyan-400">Pro</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                  Every Tool. One Platform.
                </span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              ToolifyPro is an all-in-one suite of 120+ free online tools for PDF, image, video, audio, text, developer, and financial tasks. Every operation runs client-side in your browser for total privacy.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% In-Browser Security • Zero File Uploads</span>
            </div>
          </div>

          {/* Column 2: Tool Suites */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
              Tool Suites
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/tools" className="hover:text-cyan-400 transition-colors">
                  All 120+ Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/categories/pdf" className="hover:text-cyan-400 transition-colors">
                  PDF & Documents
                </Link>
              </li>
              <li>
                <Link href="/categories/image" className="hover:text-cyan-400 transition-colors">
                  Image & Photo
                </Link>
              </li>
              <li>
                <Link href="/categories/video" className="hover:text-cyan-400 transition-colors">
                  Video Utilities
                </Link>
              </li>
              <li>
                <Link href="/categories/audio" className="hover:text-cyan-400 transition-colors">
                  Audio & Voice
                </Link>
              </li>
              <li>
                <Link href="/categories/calculators" className="hover:text-cyan-400 transition-colors">
                  Financial Calculators
                </Link>
              </li>
              <li>
                <Link href="/categories/developer" className="hover:text-cyan-400 transition-colors">
                  Developer Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Guides */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
              Knowledge & Help
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/blog" className="hover:text-cyan-400 transition-colors">
                  Blog & Guides Hub
                </Link>
              </li>
              <li>
                <Link href="/how-to-use" className="hover:text-cyan-400 transition-colors">
                  How to Use ToolifyPro
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/editorial-guidelines" className="hover:text-cyan-400 transition-colors">
                  Editorial Guidelines
                </Link>
              </li>
              <li>
                <Link href="/report-problem" className="hover:text-cyan-400 transition-colors">
                  Report a Problem / Bug
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-cyan-400 transition-colors">
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Legal */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
              Company & Legal
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-cyan-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-cyan-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="hover:text-cyan-400 transition-colors">
                  Copyright & DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 ToolifyPro. All rights reserved. Built with privacy-first client-side technology.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>

          <div className="font-script text-cyan-400 text-base sm:text-lg font-bold tracking-wide">
            Smart Tools. Better Productivity.
          </div>
        </div>
      </div>
    </footer>
  );
}
