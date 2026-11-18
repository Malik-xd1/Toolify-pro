"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tool, CategoryInfo } from "@/data/toolsData";

interface ToolsDirectoryClientProps {
  tools: Tool[];
  categories: CategoryInfo[];
}

export default function ToolsDirectoryClient({
  tools,
  categories,
}: ToolsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inName = tool.name.toLowerCase().includes(q);
      const inDesc = tool.description.toLowerCase().includes(q);
      const inKeywords =
        tool.searchKeywords?.some((kw) => kw.toLowerCase().includes(q)) ?? false;

      return inName || inDesc || inKeywords;
    });
  }, [tools, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
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
            All Tools ({tools.length})
          </span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            All {tools.length} Free Online Tools
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Instant, browser-native digital utilities for documents, images, audio, video, calculations, developer workflows, and privacy.
          </p>

          {/* Search Box */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, keyword, or format (e.g. PDF, Resize, JSON, EMI)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#0a122e] border border-slate-200 dark:border-blue-900/40 text-slate-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-white dark:bg-[#0a122e] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-blue-900/40 hover:border-blue-400"
            }`}
          >
            All Categories ({tools.length})
          </button>
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat.id).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-white dark:bg-[#0a122e] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-blue-900/40 hover:border-blue-400"
                }`}
              >
                <span>{cat.name}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search / Filter Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
          <div>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredTools.length}</strong> tools
            {selectedCategory !== "all" && (
              <span>
                {" "}in category &ldquo;
                <strong className="text-slate-900 dark:text-white font-semibold">
                  {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                </strong>
                &rdquo;
              </span>
            )}
            {searchQuery && (
              <span>
                {" "}matching &ldquo;
                <strong className="text-slate-900 dark:text-white font-semibold">{searchQuery}</strong>
                &rdquo;
              </span>
            )}
          </div>
          {(selectedCategory !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-blue-600 dark:text-cyan-400 hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="bg-white dark:bg-[#0a122e] rounded-3xl p-12 text-center border border-slate-200 dark:border-blue-900/40">
            <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No tools found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any tools matching your search criteria. Try a different query or reset filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 bg-blue-600 text-white font-bold px-5 py-2 rounded-xl text-xs hover:bg-blue-700 transition-all"
            >
              Show All Tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const catInfo = categories.find((c) => c.id === tool.category);
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="bg-white dark:bg-[#0a122e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {catInfo?.name || tool.category}
                      </span>
                      {tool.badge && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {tool.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-cyan-400">
                    <span>Launch Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-16 bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-900/40 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Shield className="w-6 h-6 text-emerald-500 mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% In-Browser Privacy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero server file uploads or remote tracking.</p>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-6 h-6 text-amber-500 mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Zero Cost Forever</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unlimited usage with no subscriptions or paywalls.</p>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Account Needed</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Instant execution directly from any modern browser.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
