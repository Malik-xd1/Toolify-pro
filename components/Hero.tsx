"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Zap,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Play,
  Music,
  Archive,
} from "lucide-react";
import { TOOLS, Tool } from "@/data/toolsData";

interface HeroProps {
  onSelectTool: (toolId: string) => void;
}

export default function Hero({ onSelectTool }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.searchKeywords?.some((k) => k.toLowerCase().includes(query))
    ).slice(0, 8);

    setSearchResults(results);
    setIsSearchOpen(true);
  }, [searchQuery]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const popularSearches = [
    { label: "PDF to Word", id: "pdf-to-word" },
    { label: "Image Compressor", id: "image-compressor" },
    { label: "MP4 to MP3", id: "mp4-to-mp3" },
    { label: "QR Code", id: "qr-code-generator" },
    { label: "ZIP", id: "zip-creator" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      onSelectTool(searchResults[0].id);
      setIsSearchOpen(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-[#060b1e] dark:via-[#091338] dark:to-[#0a122e] text-slate-900 dark:text-white pt-12 pb-24 lg:pt-16 lg:pb-32 transition-colors duration-200">
      {/* Background Neon Glow Light Streaks */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[450px] bg-cyan-400/10 dark:bg-cyan-500/15 blur-[130px] rounded-full pointer-events-none" />

      {/* Subtle curved light beam lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 600"
          fill="none"
        >
          <path
            d="M-100,450 C300,200 900,600 1600,150"
            stroke="url(#blue-grad)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <path
            d="M-50,300 C400,100 800,500 1500,250"
            stroke="url(#cyan-grad)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
              <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Subtitle, Search, Popular Searches */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge: 100+ Powerful Tools */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-6 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>100+ Powerful Tools</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5 text-slate-900 dark:text-white">
              Every Tool You Need.
              <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 dark:from-cyan-300 dark:via-sky-400 dark:to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                One Powerful Platform.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
              Convert, edit, secure, organize and manage your digital files with
              ease – all in one place.
            </p>

            {/* Search Box Bar */}
            <div ref={searchRef} className="w-full max-w-xl relative mb-6">
              <form onSubmit={handleSearchSubmit}>
                <div className="bg-white dark:bg-slate-900/90 rounded-full shadow-xl shadow-blue-500/10 dark:shadow-2xl p-1.5 pl-6 flex items-center justify-between border-2 border-slate-200 dark:border-transparent focus-within:border-blue-500 dark:focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-blue-500/20 dark:focus-within:ring-cyan-500/20 transition-all">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for any tool... (e.g. PDF to Word, Image Resize)"
                      className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base outline-none pr-2 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-7 py-3 rounded-full flex items-center gap-2 transition-all flex-shrink-0 shadow-md shadow-blue-500/30 hover:scale-[1.02]"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Instant Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0c132c] border border-slate-200 dark:border-blue-900/60 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-blue-950/80 backdrop-blur-xl">
                  {searchResults.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(tool.id);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="p-3.5 px-5 hover:bg-blue-50 dark:hover:bg-blue-600/20 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                          style={{ backgroundColor: tool.color || "#3B82F6" }}
                        >
                          {tool.category.toUpperCase().slice(0, 3)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {tool.description}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-amber-500 dark:text-amber-400 font-semibold flex items-center gap-1 mr-1">
                🔥 Popular Searches:
              </span>
              {popularSearches.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectTool(item.id)}
                  className="bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-sm dark:bg-white/10 dark:hover:bg-white/20 dark:text-slate-200 dark:hover:text-white dark:border-white/10 px-3 py-1.5 rounded-full transition-all font-medium backdrop-blur-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Laptop Mockup + Orbiting Colored Tiles */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Top handwriting script accent */}
            <div className="w-full flex justify-end pr-4 mb-2">
              <span className="font-script text-3xl sm:text-4xl text-slate-900 dark:text-white -rotate-6 tracking-wide drop-shadow-sm select-none">
                Work Smarter, <br />
                <span className="pl-6 text-blue-600 dark:text-cyan-300">Not Harder!</span>
              </span>
            </div>

            {/* Laptop Container */}
            <div className="relative w-full max-w-[460px] h-[340px] flex items-center justify-center">
              {/* Neon Cyan Orbit Rings */}
              <div className="absolute w-[420px] h-[220px] rounded-full border-2 border-cyan-400/40 rotate-[15deg] blur-[0.5px] pointer-events-none animate-pulse-slow" />
              <div className="absolute w-[460px] h-[240px] rounded-full border border-blue-500/30 -rotate-[10deg] pointer-events-none" />

              {/* 3D Laptop Mockup */}
              <div className="relative z-10 w-[300px] sm:w-[340px] transition-transform hover:scale-105 duration-500">
                {/* Screen Frame */}
                <div className="bg-slate-900 p-2.5 rounded-t-2xl border-2 border-slate-700 shadow-2xl shadow-blue-500/30 relative overflow-hidden">
                  {/* Screen Display */}
                  <div className="w-full h-[170px] sm:h-[190px] bg-gradient-to-br from-[#070b1e] via-[#09153d] to-[#061e52] rounded-xl flex flex-col items-center justify-center relative overflow-hidden border border-blue-500/30">
                    {/* Glowing Grid Background inside Laptop */}
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                    {/* Centered Glowing Lightning Logo */}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                        <Zap className="w-10 h-10 text-white fill-white transform -rotate-6" />
                      </div>
                      <div className="mt-2 text-white font-extrabold text-sm tracking-wide">
                        Your<span className="text-cyan-400">Tools</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Base */}
                <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-b-xl border-t border-slate-500 shadow-xl flex items-center justify-center">
                  <div className="w-16 h-1 bg-slate-500 rounded-full" />
                </div>
              </div>

              {/* Floating 3D Tool Tiles */}
              {/* 1. PDF Tile (Red) - Top Left */}
              <div
                onClick={() => onSelectTool("merge-pdf")}
                className="absolute top-2 left-2 z-20 cursor-pointer animate-float"
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-3 shadow-xl shadow-red-500/40 flex flex-col items-center justify-center text-white border border-red-300/40 transform -rotate-12 hover:scale-115 transition-all">
                  <FileText className="w-7 h-7 mb-0.5" />
                  <span className="text-[10px] font-extrabold tracking-wider">
                    PDF
                  </span>
                </div>
              </div>

              {/* 2. Image Tile (Green) - Top Center */}
              <div
                onClick={() => onSelectTool("image-compressor")}
                className="absolute -top-4 right-1/4 z-20 cursor-pointer animate-float-delayed"
              >
                <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 p-3 shadow-xl shadow-green-500/40 flex items-center justify-center text-white border border-green-300/40 transform rotate-6 hover:scale-115 transition-all">
                  <ImageIcon className="w-8 h-8" />
                </div>
              </div>

              {/* 3. Video Tile (Blue) - Top Right */}
              <div
                onClick={() => onSelectTool("video-compressor")}
                className="absolute top-6 -right-2 z-20 cursor-pointer animate-float"
              >
                <div className="w-16 h-16 sm:w-17 sm:h-17 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-xl shadow-blue-500/40 flex items-center justify-center text-white border border-blue-300/40 transform rotate-12 hover:scale-115 transition-all">
                  <Play className="w-8 h-8 fill-white ml-0.5" />
                </div>
              </div>

              {/* 4. Music/Audio Tile (Orange) - Mid Right */}
              <div
                onClick={() => onSelectTool("mp4-to-mp3")}
                className="absolute top-28 -right-6 z-20 cursor-pointer animate-float-delayed"
              >
                <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 shadow-xl shadow-orange-500/40 flex items-center justify-center text-white border border-orange-300/40 transform -rotate-6 hover:scale-115 transition-all">
                  <Music className="w-8 h-8" />
                </div>
              </div>

              {/* 5. ZIP Archive Tile (Lavender/Indigo) - Bottom Right */}
              <div
                onClick={() => onSelectTool("zip-creator")}
                className="absolute bottom-4 right-0 z-20 cursor-pointer animate-float"
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-xl shadow-purple-500/40 flex flex-col items-center justify-center text-white border border-purple-300/40 transform rotate-6 hover:scale-115 transition-all">
                  <Archive className="w-7 h-7 mb-0.5" />
                  <span className="text-[10px] font-extrabold tracking-wider">
                    ZIP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
