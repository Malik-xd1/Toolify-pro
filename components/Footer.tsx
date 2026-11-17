"use client";

import React from "react";
import { Zap } from "lucide-react";
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
  const handleHomeClick = () => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
    }
  };

  const handleCategoryClick = (cat: ToolCategory | "all") => {
    if (onOpenCategory) {
      onOpenCategory(cat);
    } else if (typeof window !== "undefined") {
      window.location.href = `/?category=${cat}#explore-tools`;
    }
  };

  const handleLockerClick = () => {
    if (onOpenFileLocker) {
      onOpenFileLocker();
    } else if (typeof window !== "undefined") {
      window.location.href = "/?open=file-locker";
    }
  };
  return (
    <footer className="bg-[#050917] text-white border-t border-blue-950/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800/80">
          {/* Logo */}
          <div
            onClick={handleHomeClick}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#050917] rounded-[11px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400 transform -rotate-6 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Your<span className="text-cyan-400">Tools</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Every Tool. One Platform.
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium text-slate-300">
            <button
              onClick={handleHomeClick}
              className="hover:text-cyan-400 transition-colors"
            >
              Home
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleCategoryClick("all")}
              className="hover:text-cyan-400 transition-colors"
            >
              All Tools
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleCategoryClick("all")}
              className="hover:text-cyan-400 transition-colors"
            >
              Categories
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleCategoryClick("pdf")}
              className="hover:text-cyan-400 transition-colors"
            >
              PDF Tools
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleCategoryClick("image")}
              className="hover:text-cyan-400 transition-colors"
            >
              Image Tools
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleCategoryClick("video")}
              className="hover:text-cyan-400 transition-colors"
            >
              Video Tools
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleCategoryClick("audio")}
              className="hover:text-cyan-400 transition-colors"
            >
              Audio Tools
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={handleLockerClick}
              className="hover:text-cyan-400 transition-colors"
            >
              File Locker
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenAbout}
              className="hover:text-cyan-400 transition-colors"
            >
              About Us
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenContact}
              className="hover:text-cyan-400 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5">
            {/* YouTube */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white hover:opacity-90 hover:scale-105 transition-all shadow-sm"
              title="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-90 hover:scale-105 transition-all shadow-sm"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-black border border-slate-700 flex items-center justify-center text-white hover:opacity-90 hover:scale-105 transition-all shadow-sm"
              title="X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:opacity-90 hover:scale-105 transition-all shadow-sm"
              title="LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Sub-Footer Row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>© 2025 YourTools. All rights reserved.</div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => onOpenLegal && onOpenLegal("privacy")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              onClick={() => onOpenLegal && onOpenLegal("terms")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>|</span>
            <button
              onClick={() => onOpenLegal && onOpenLegal("disclaimer")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
          </div>

          <div className="font-script text-cyan-400 text-lg sm:text-xl font-bold tracking-wide">
            Smart Tools. Better Productivity.
          </div>
        </div>
      </div>
    </footer>
  );
}
