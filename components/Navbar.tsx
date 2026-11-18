"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  Home,
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
  LayoutGrid,
  Folder,
  FileText,
  Image as ImageIcon,
  Play,
  Headphones,
  Menu,
  X,
} from "lucide-react";
import { ToolCategory } from "@/data/toolsData";

interface NavbarProps {
  onOpenTool?: (toolId: string) => void;
  onOpenCategory?: (category: ToolCategory | "all") => void;
  onOpenFileLocker?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
}

export default function Navbar({
  onOpenTool,
  onOpenCategory,
  onOpenFileLocker,
  onOpenAbout,
  onOpenContact,
}: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenTool = (toolId: string) => {
    if (onOpenTool) {
      onOpenTool(toolId);
    } else if (typeof window !== "undefined") {
      window.location.href = `/tools/${toolId}`;
    }
  };

  const handleOpenCategory = (category: ToolCategory | "all") => {
    if (onOpenCategory) {
      onOpenCategory(category);
    } else if (typeof window !== "undefined") {
      if (category === "all") {
        window.location.href = "/tools";
      } else {
        window.location.href = `/categories/${category}`;
      }
    }
  };

  const handleOpenFileLocker = () => {
    if (onOpenFileLocker) {
      onOpenFileLocker();
    } else if (typeof window !== "undefined") {
      window.location.href = "/?open=file-locker";
    }
  };

  const handleNavigateHome = () => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
        if (!savedTheme) {
          localStorage.setItem("theme", "light");
        }
      }
    } catch (_) {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch (_) {}
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (_) {}
      setIsDarkMode(true);
    }
  };

  const pdfQuickTools = [
    { id: "merge-pdf", name: "Merge PDF" },
    { id: "split-pdf", name: "Split PDF" },
    { id: "compress-pdf", name: "Compress PDF" },
    { id: "pdf-to-word", name: "PDF to Word" },
    { id: "word-to-pdf", name: "Word to PDF" },
    { id: "image-to-pdf", name: "Image to PDF" },
    { id: "rotate-pdf", name: "Rotate PDF" },
    { id: "protect-pdf", name: "Protect PDF" },
  ];

  const imageQuickTools = [
    { id: "jpg-to-png", name: "JPG to PNG" },
    { id: "png-to-jpg", name: "PNG to JPG" },
    { id: "image-compressor", name: "Image Compressor" },
    { id: "image-resizer", name: "Image Resizer" },
    { id: "favicon-generator", name: "Favicon Generator" },
    { id: "color-picker", name: "Color Picker" },
  ];

  const videoQuickTools = [
    { id: "video-compressor", name: "Video Compressor" },
    { id: "mp4-to-mp3", name: "MP4 to MP3" },
    { id: "video-trimmer", name: "Video Trimmer" },
    { id: "video-frame-extractor", name: "Video Frame Extractor" },
    { id: "mute-video", name: "Mute Video" },
  ];

  const audioQuickTools = [
    { id: "audio-cutter", name: "Audio Cutter" },
    { id: "audio-converter", name: "Audio Converter" },
    { id: "voice-recorder", name: "Voice Recorder" },
    { id: "text-to-speech", name: "Text to Speech" },
  ];

  return (
    <header className="sticky top-2 sm:top-3 z-50 w-full px-2 sm:px-4 md:px-6 pointer-events-none">
      {/* Outer Floating Pill Capsule */}
      <div className="max-w-[1400px] mx-auto pointer-events-auto bg-gradient-to-r from-[#050b1f] via-[#09153d] to-[#050b1f] rounded-full border border-blue-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_25px_rgba(37,99,235,0.25)] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between text-white relative backdrop-blur-xl">
        {/* Glowing Top-Left and Top-Right Edge Flares (Exact as in reference image) */}
        <div className="absolute -top-[1px] left-10 sm:left-14 w-44 sm:w-56 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[0.5px] pointer-events-none shadow-[0_0_12px_#22d3ee]" />
        <div className="absolute -top-[1px] right-10 sm:right-14 w-44 sm:w-56 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[0.5px] pointer-events-none shadow-[0_0_12px_#22d3ee]" />
        {/* Bottom Subtle Flares */}
        <div className="absolute -bottom-[1px] left-20 w-32 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-[0.5px] pointer-events-none" />
        <div className="absolute -bottom-[1px] right-20 w-32 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-[0.5px] pointer-events-none" />

        {/* 1. Logo Section */}
        <div
          onClick={handleNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          {/* Logo Badge with Cyan Glow Border */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-blue-800 p-[1.5px] shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] transition-all">
            <div className="w-full h-full bg-[#070e28] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400 transform -rotate-6 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center leading-none">
              Your<span className="text-cyan-400">Tools</span>
            </span>
            <span className="text-[9px] text-slate-400 tracking-wider font-medium mt-1">
              Every Tool. One Platform.
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-[1px] h-7 bg-slate-700/60 mx-1 xl:mx-2 flex-shrink-0" />

        {/* 2. Navigation Items (Icon centered above text) */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 flex-1 justify-center">
          {/* Home Glowing Active Pill with Underline Indicator */}
          <div className="flex flex-col items-center justify-center relative flex-shrink-0">
            <button
              onClick={handleNavigateHome}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-[0_0_18px_rgba(37,99,235,0.8)] border border-blue-400/50 transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            {/* Active Cyan Glow Notch Under Home */}
            <div className="w-5 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] mt-1 -mb-1" />
          </div>

          {/* All Tools (Icon centered above text) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("all-tools")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleOpenCategory("all")}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 mb-0.5 text-slate-300 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
              <div className="flex items-center gap-0.5 text-[11px] font-semibold tracking-tight">
                <span>All Tools</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 group-hover:text-white" />
              </div>
            </button>
            {activeDropdown === "all-tools" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 bg-[#091233] border border-blue-800/60 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl">
                <button
                  onClick={() => {
                    handleOpenCategory("all");
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-blue-600/30 rounded-xl transition-colors cursor-pointer"
                >
                  Browse 120+ Tools
                </button>
              </div>
            )}
          </div>

          {/* Categories (Icon centered above text) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("categories")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => {
                const el = document.getElementById("explore-tools");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else if (typeof window !== "undefined") {
                  window.location.href = "/#explore-tools";
                }
              }}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group cursor-pointer"
            >
              <Folder className="w-4 h-4 mb-0.5 text-slate-300 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
              <div className="flex items-center gap-0.5 text-[11px] font-semibold tracking-tight">
                <span>Categories</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 group-hover:text-white" />
              </div>
            </button>
            {activeDropdown === "categories" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 mt-2 bg-[#091233] border border-blue-800/60 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl max-h-80 overflow-y-auto">
                {[
                  "pdf",
                  "image",
                  "video",
                  "audio",
                  "document",
                  "developer",
                  "security",
                  "calculators",
                  "qr",
                  "business",
                  "seo",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      handleOpenCategory(c as ToolCategory);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 rounded-lg capitalize transition-colors cursor-pointer"
                  >
                    {c} Tools
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PDF Tools (Icon centered above text) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("pdf")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleOpenCategory("pdf")}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group cursor-pointer"
            >
              <FileText className="w-4 h-4 mb-0.5 text-slate-300 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
              <div className="flex items-center gap-0.5 text-[11px] font-semibold tracking-tight">
                <span>PDF Tools</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 group-hover:text-white" />
              </div>
            </button>
            {activeDropdown === "pdf" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 bg-[#091233] border border-blue-800/60 rounded-2xl shadow-2xl p-2 z-50">
                {pdfQuickTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      handleOpenTool(t.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-blue-600/30 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Image Tools (Icon centered above text) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("image")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleOpenCategory("image")}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 mb-0.5 text-slate-300 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
              <div className="flex items-center gap-0.5 text-[11px] font-semibold tracking-tight">
                <span>Image Tools</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 group-hover:text-white" />
              </div>
            </button>
            {activeDropdown === "image" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 bg-[#091233] border border-blue-800/60 rounded-2xl shadow-2xl p-2 z-50">
                {imageQuickTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      handleOpenTool(t.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-blue-600/30 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video Tools (Icon centered above text) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("video")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleOpenCategory("video")}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group cursor-pointer"
            >
              <Play className="w-4 h-4 mb-0.5 text-slate-300 group-hover:text-cyan-400 group-hover:scale-105 transition-all fill-current" />
              <div className="flex items-center gap-0.5 text-[11px] font-semibold tracking-tight">
                <span>Video Tools</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 group-hover:text-white" />
              </div>
            </button>
            {activeDropdown === "video" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 bg-[#091233] border border-blue-800/60 rounded-2xl shadow-2xl p-2 z-50">
                {videoQuickTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      handleOpenTool(t.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-blue-600/30 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio Tools (Icon centered above text) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("audio")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleOpenCategory("audio")}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group cursor-pointer"
            >
              <Headphones className="w-4 h-4 mb-0.5 text-slate-300 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
              <div className="flex items-center gap-0.5 text-[11px] font-semibold tracking-tight">
                <span>Audio Tools</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 group-hover:text-white" />
              </div>
            </button>
            {activeDropdown === "audio" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 bg-[#091233] border border-blue-800/60 rounded-2xl shadow-2xl p-2 z-50">
                {audioQuickTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      handleOpenTool(t.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-blue-600/30 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File Locker (Cyan Glowing Outlined Pill) */}
          <button
            onClick={handleOpenFileLocker}
            className="border-2 border-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-[0_0_16px_rgba(6,182,212,0.45),inset_0_0_8px_rgba(6,182,212,0.2)] hover:shadow-[0_0_22px_rgba(6,182,212,0.7)] transition-all flex-shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>File Locker</span>
          </button>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-slate-700/60 mx-1 flex-shrink-0" />

          {/* Guides / Blog */}
          <a
            href="/blog"
            className="text-[11px] font-medium text-slate-300 hover:text-white px-2 py-1 transition-colors flex-shrink-0 cursor-pointer"
          >
            Guides
          </a>

          {/* About Us */}
          <button
            onClick={() => {
              if (onOpenAbout) {
                onOpenAbout();
              } else if (typeof window !== "undefined") {
                window.location.href = "/about";
              }
            }}
            className="text-[11px] font-medium text-slate-300 hover:text-white px-2 py-1 transition-colors flex-shrink-0 cursor-pointer"
          >
            About Us
          </button>

          {/* Contact */}
          <button
            onClick={() => {
              if (onOpenContact) {
                onOpenContact();
              } else if (typeof window !== "undefined") {
                window.location.href = "/contact";
              }
            }}
            className="text-[11px] font-medium text-slate-300 hover:text-white px-2 py-1 transition-colors flex-shrink-0 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* 3. Right Section: Theme Toggle Switch */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-[#0a122e] border border-cyan-500/40 rounded-full p-0.5 cursor-pointer flex items-center justify-between select-none shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:border-cyan-400 transition-all"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Light / Dark Mode"
          >
            {/* Sun Icon on the left */}
            <div className="w-6 h-6 flex items-center justify-center text-amber-300">
              <Sun className="w-3.5 h-3.5" />
            </div>

            {/* Moon Icon on the right */}
            <div className="w-6 h-6 flex items-center justify-center text-cyan-300">
              <Moon className="w-3.5 h-3.5" />
            </div>

            {/* Sliding Thumb */}
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 ${
                isDarkMode
                  ? "right-0.5 bg-blue-600 shadow-blue-500/50"
                  : "left-0.5 bg-amber-500 shadow-amber-500/50"
              }`}
            >
              {isDarkMode ? (
                <Moon className="w-3 h-3 fill-white" />
              ) : (
                <Sun className="w-3 h-3 fill-white" />
              )}
            </div>
          </button>

          {/* Mobile Menu Hamburger (Visible on mobile/tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden pointer-events-auto mt-2 max-w-[1400px] mx-auto bg-[#091233] border border-blue-800/60 rounded-3xl shadow-2xl p-4 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                handleNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="bg-blue-600 text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-blue-600/40"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                handleOpenFileLocker();
                setMobileMenuOpen(false);
              }}
              className="border border-cyan-400 bg-cyan-950/40 text-cyan-300 px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>File Locker</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              onClick={() => {
                handleOpenCategory("all");
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200"
            >
              <LayoutGrid className="w-4 h-4 mb-1 text-cyan-400" />
              <span>All Tools</span>
            </button>
            <button
              onClick={() => {
                handleOpenCategory("pdf");
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200"
            >
              <FileText className="w-4 h-4 mb-1 text-red-400" />
              <span>PDF Tools</span>
            </button>
            <button
              onClick={() => {
                handleOpenCategory("image");
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200"
            >
              <ImageIcon className="w-4 h-4 mb-1 text-purple-400" />
              <span>Image Tools</span>
            </button>
            <button
              onClick={() => {
                handleOpenCategory("video");
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200"
            >
              <Play className="w-4 h-4 mb-1 text-blue-400 fill-current" />
              <span>Video Tools</span>
            </button>
            <button
              onClick={() => {
                handleOpenCategory("audio");
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200"
            >
              <Headphones className="w-4 h-4 mb-1 text-amber-400" />
              <span>Audio Tools</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("explore-tools");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else if (typeof window !== "undefined") {
                  window.location.href = "/#explore-tools";
                }
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200"
            >
              <Folder className="w-4 h-4 mb-1 text-emerald-400" />
              <span>Categories</span>
            </button>
          </div>

          <div className="flex items-center justify-around border-t border-slate-700/60 pt-3 mt-3 text-xs text-slate-300">
            <a
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Guides
            </a>
            <button
              onClick={() => {
                if (onOpenAbout) {
                  onOpenAbout();
                } else if (typeof window !== "undefined") {
                  window.location.href = "/about";
                }
                setMobileMenuOpen(false);
              }}
              className="hover:text-white"
            >
              About Us
            </button>
            <button
              onClick={() => {
                if (onOpenContact) {
                  onOpenContact();
                } else if (typeof window !== "undefined") {
                  window.location.href = "/contact";
                }
                setMobileMenuOpen(false);
              }}
              className="hover:text-white"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
