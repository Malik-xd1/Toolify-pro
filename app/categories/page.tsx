import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Video,
  Headphones,
  FileCheck,
  Code,
  ShieldCheck,
  Calculator,
  QrCode,
  Briefcase,
  Globe,
  Archive,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CATEGORIES, TOOLS, ToolCategory } from "@/data/toolsData";

export const metadata: Metadata = {
  title: "Tool Categories - Browse Tools by Department | ToolifyPro",
  description:
    "Explore our complete suite of 12 tool categories: PDF, Image, Video, Audio, Text, Developer, Security, Calculators, QR Codes, Business, and SEO.",
  alternates: {
    canonical: "https://toolifypro.com/categories",
  },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  image: ImageIcon,
  video: Video,
  audio: Headphones,
  document: FileCheck,
  developer: Code,
  security: ShieldCheck,
  calculators: Calculator,
  qr: QrCode,
  business: Briefcase,
  seo: Globe,
  zip: Archive,
  conversion: RefreshCw,
};

export default function CategoriesPage() {
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
            Categories
          </span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <Folder className="w-3.5 h-3.5" />
            <span>Category Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Tools by Category
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Organized suites tailored for students, content creators, software engineers, accountants, marketers, and daily productivity.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Folder;
            const categoryTools = TOOLS.filter((t) => t.category === cat.id);
            const featuredTools = categoryTools.slice(0, 4);

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 border border-slate-200 dark:border-blue-900/40 shadow-sm hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {categoryTools.length} Tools
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Sample Tool Links */}
                  <div className="mt-5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Popular Utilities:
                    </span>
                    {featuredTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 py-1 transition-colors group"
                      >
                        <span className="truncate">{tool.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/categories/${cat.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    <span>View all {categoryTools.length} {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
