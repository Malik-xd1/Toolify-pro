import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CATEGORIES, TOOLS, ToolCategory } from "@/data/toolsData";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);

  if (!cat) {
    return {
      title: "Category Not Found | ToolifyPro",
    };
  }

  const title = `${cat.name} - Free Online Utilities | ToolifyPro`;
  const description = `Free browser-based ${cat.name.toLowerCase()} tools. ${cat.description}. 100% private, client-side execution with zero file uploads or logins.`;
  const canonicalUrl = `https://toolifypro.com/categories/${cat.id}`;

  return {
    title,
    description,
    keywords: [
      cat.name,
      `${cat.name} tools`,
      "online tools",
      "free converter",
      "client side",
      "privacy first",
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);

  if (!cat) {
    notFound();
  }

  const categoryTools = TOOLS.filter((t) => t.category === cat.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} - ToolifyPro`,
    description: cat.description,
    url: `https://toolifypro.com/categories/${cat.id}`,
    hasPart: categoryTools.map((t) => ({
      "@type": "WebApplication",
      name: t.name,
      description: t.description,
      url: `https://toolifypro.com/tools/${t.id}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <Link
            href="/categories"
            className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          >
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {cat.name}
          </span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{categoryTools.length} Tools Available</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {cat.name}
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {cat.description}. Every tool runs securely in your web browser with zero file uploads, no account creation, and unlimited free daily access.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" /> Client-Side Sandbox
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Instant Processing
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-500" /> 100% Free & No Sign-in
            </span>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="bg-white dark:bg-[#0a122e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-cyan-400">
                    {cat.name}
                  </span>
                  {tool.badge && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-cyan-400">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Category Educational Architecture Details */}
        <div className="mt-16 bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-900/40 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
            Why Use ToolifyPro for {cat.name}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Traditional online utilities upload your files and private inputs to third-party cloud servers, posing data leakage risks and enforcing artificial wait timers to upsell subscription tiers. ToolifyPro changes this paradigm by compiling native algorithms into high-speed WebAssembly and browser Web APIs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white mb-1">Hardware-Accelerated Speed</strong>
              Transforms documents, media streams, and mathematical arrays directly using your CPU/GPU capabilities.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white mb-1">Confidential & Compliant</strong>
              Ideal for sensitive business records, financial spreadsheets, and personal IDs since data never exits your device.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
