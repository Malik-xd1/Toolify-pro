"use client";

import React from "react";
import {
  FileText,
  ArrowLeftRight,
  Image as ImageIcon,
  Play,
  Headphones,
  FileCheck,
  Archive,
  QrCode,
  Code2,
  ShieldCheck,
  Lock,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES, ToolCategory } from "@/data/toolsData";

interface CategoriesGridProps {
  onSelectCategory: (category: ToolCategory | "all") => void;
  onOpenFileLocker: () => void;
}

export default function CategoriesGrid({
  onSelectCategory,
  onOpenFileLocker,
}: CategoriesGridProps) {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "pdf":
        return <FileText className="w-5 h-5 text-white" />;
      case "conversion":
        return <ArrowLeftRight className="w-5 h-5 text-white" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-white" />;
      case "video":
        return <Play className="w-5 h-5 text-white fill-white ml-0.5" />;
      case "audio":
        return <Headphones className="w-5 h-5 text-white" />;
      case "document":
        return <FileCheck className="w-5 h-5 text-white" />;
      case "zip":
        return <Archive className="w-5 h-5 text-white" />;
      case "qr":
        return <QrCode className="w-5 h-5 text-white" />;
      case "developer":
        return <Code2 className="w-5 h-5 text-white" />;
      case "security":
        return <ShieldCheck className="w-5 h-5 text-white" />;
      case "locker":
        return <Lock className="w-5 h-5 text-white" />;
      default:
        return <LayoutGrid className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section id="explore-tools" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <span className="h-[2px] w-8 sm:w-12 bg-blue-600 rounded-full" />
          <span>
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Our Tools
            </span>
          </span>
          <span className="h-[2px] w-8 sm:w-12 bg-blue-600 rounded-full" />
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
          Choose from a wide range of online tools, all in one place.
        </p>
      </div>

      {/* Grid of 12 categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {CATEGORIES.map((cat) => {
          return (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.id === "locker") {
                  onOpenFileLocker();
                } else if (cat.id === "more") {
                  onSelectCategory("all");
                } else {
                  onSelectCategory(cat.id);
                }
              }}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4.5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Icon square badge with glow */}
                <div
                  className={`w-12 h-12 rounded-xl ${cat.bgColor} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {getCategoryIcon(cat.id)}
                </div>

                {/* Title & description */}
                <div className="min-w-0 pr-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Right chevron arrow */}
              <div className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
