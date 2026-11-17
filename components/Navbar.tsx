"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  Home,
  ChevronDown,
  Lock,
  Sun,
  Moon,
  FileText,
  Image as ImageIcon,
  Video,
  Headphones,
  Grid,
} from "lucide-react";
import { ToolCategory } from "@/data/toolsData";

interface NavbarProps {
  onOpenTool: (toolId: string) => void;
  onOpenCategory: (category: ToolCategory | "all") => void;
  onOpenFileLocker: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
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

  useEffect(() => {
    // Check initial dark mode preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
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
    { id: "image-cropper", name: "Image Cropper" },
    { id: "favicon-generator", name: "Favicon Generator" },
    { id: "color-picker", name: "Color Picker" },
  ];

  const videoQuickTools = [
    { id: "video-compressor", name: "Video Compressor" },
    { id: "mp4-to-mp3", name: "MP4 to MP3" },
    { id: "video-trimmer", name: "Video Trimmer" },
    { id: "video-frame-extractor", name: "Video Frame Extractor" },
    { id: "video-speed", name: "Video Speed" },
    { id: "mute-video", name: "Mute Video" },
  ];

  const audioQuickTools = [
    { id: "audio-cutter", name: "Audio Cutter" },
    { id: "audio-converter", name: "Audio Converter" },
    { id: "voice-recorder", name: "Voice Recorder" },
    { id: "text-to-speech", name: "Text to Speech" },
    { id: "audio-speed", name: "Audio Speed" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070b19] border-b border-blue-950/60 shadow-lg shadow-black/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
            <div className="w-full h-full bg-[#070b19] rounded-[11px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400 transform -rotate-6 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-0.5">
              Your<span className="text-cyan-400">Tools</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
              Every Tool. One Platform.
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium text-slate-300">
          {/* Home Pill */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          {/* All Tools */}
          <button
            onClick={() => onOpenCategory("all")}
            className="hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            <span>All Tools</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Categories */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("categories")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => {
                const el = document.getElementById("explore-tools");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              <span>Categories</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === "categories" && (
              <div className="absolute top-full left-0 w-64 mt-1 bg-[#0a1026] border border-blue-900/40 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl">
                <div className="grid grid-cols-1 gap-1">
                  <button
                    onClick={() => {
                      onOpenCategory("pdf");
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-600/20 rounded-lg text-slate-200 hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>PDF Tools</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenCategory("image");
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-600/20 rounded-lg text-slate-200 hover:text-white transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>Image Tools</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenCategory("video");
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-600/20 rounded-lg text-slate-200 hover:text-white transition-colors"
                  >
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>Video Tools</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenCategory("audio");
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-600/20 rounded-lg text-slate-200 hover:text-white transition-colors"
                  >
                    <Headphones className="w-4 h-4 text-orange-400" />
                    <span>Audio Tools</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenCategory("all");
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-600/20 rounded-lg text-slate-200 hover:text-white transition-colors"
                  >
                    <Grid className="w-4 h-4 text-emerald-400" />
                    <span>View All Categories</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PDF Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("pdf")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => onOpenCategory("pdf")}
              className="hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              <span>PDF Tools</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {activeDropdown === "pdf" && (
              <div className="absolute top-full left-0 w-52 mt-1 bg-[#0a1026] border border-blue-900/40 rounded-xl shadow-2xl p-2 z-50">
                {pdfQuickTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onOpenTool(t.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Image Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("image")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => onOpenCategory("image")}
              className="hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              <span>Image Tools</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {activeDropdown === "image" && (
              <div className="absolute top-full left-0 w-52 mt-1 bg-[#0a1026] border border-blue-900/40 rounded-xl shadow-2xl p-2 z-50">
                {imageQuickTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onOpenTool(t.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("video")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => onOpenCategory("video")}
              className="hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              <span>Video Tools</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {activeDropdown === "video" && (
              <div className="absolute top-full left-0 w-52 mt-1 bg-[#0a1026] border border-blue-900/40 rounded-xl shadow-2xl p-2 z-50">
                {videoQuickTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onOpenTool(t.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("audio")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => onOpenCategory("audio")}
              className="hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              <span>Audio Tools</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {activeDropdown === "audio" && (
              <div className="absolute top-full left-0 w-52 mt-1 bg-[#0a1026] border border-blue-900/40 rounded-xl shadow-2xl p-2 z-50">
                {audioQuickTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onOpenTool(t.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File Locker */}
          <button
            onClick={onOpenFileLocker}
            className="text-cyan-300 hover:text-white px-3 py-1.5 rounded-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-700/40 transition-all flex items-center gap-1.5 font-semibold"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>File Locker</span>
          </button>

          {/* About Us */}
          <button
            onClick={onOpenAbout}
            className="hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            About Us
          </button>

          {/* Contact */}
          <button
            onClick={onOpenContact}
            className="hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right side: Dark / Light toggle switch */}
        <div className="flex items-center gap-3">
          <div
            onClick={toggleTheme}
            className="flex items-center bg-[#0d1633] border border-blue-900/40 rounded-full p-1 cursor-pointer select-none transition-all hover:border-blue-700"
            title="Toggle Light / Dark Mode"
          >
            <div
              className={`p-1 rounded-full transition-all ${
                !isDarkMode
                  ? "bg-amber-400/20 text-amber-300 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div
              className={`p-1 rounded-full transition-all ${
                isDarkMode
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
