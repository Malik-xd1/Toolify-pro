"use client";

import React, { useState } from "react";
import { X, Search, ArrowRight, Sparkles } from "lucide-react";
import { TOOLS, CATEGORIES, ToolCategory } from "@/data/toolsData";
import ToolIcon from "@/components/ToolIcon";

interface AllToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  initialCategory?: ToolCategory | "all";
}

export default function AllToolsModal({
  isOpen,
  onClose,
  onSelectTool,
  initialCategory = "all",
}: AllToolsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.searchKeywords?.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0a1026] w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-900/50 flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span>All 100+ Free Online Tools</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Instant access to every tool. No login, 100% free, 100% private.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, format, or keyword (e.g. merge, compress, mp3, qr)..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-11 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:focus:border-cyan-400 shadow-sm transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              All Tools ({TOOLS.length})
            </button>
            {CATEGORIES.filter((c) => c.id !== "more").map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === c.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh] divide-y divide-slate-100 dark:divide-slate-800/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  onClose();
                }}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-500/50 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <ToolIcon tool={tool} size="sm" />
                    {tool.popular && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40">
                        Popular
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-cyan-400">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-400/50 mb-3" />
              <p className="text-base font-semibold">No tools found matching your search</p>
              <p className="text-xs mt-1">Try another keyword or select All Tools.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
