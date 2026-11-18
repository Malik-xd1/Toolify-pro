import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  User,
  Calendar,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_ARTICLES } from "@/data/blogArticles";

export const metadata: Metadata = {
  title: "Blog & Technical Guides - Tutorials & Best Practices | ToolifyPro",
  description:
    "Explore our collection of in-depth guides, technical tutorials, and best practices for PDF management, image optimization, GPA calculation, invoicing, and developer tools.",
  alternates: {
    canonical: "https://toolifypro.com/blog",
  },
};

export default function BlogIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ToolifyPro Engineering & Productivity Blog",
    description: "In-depth technical guides, tutorials, and calculation best practices.",
    url: "https://toolifypro.com/blog",
    blogPost: BLOG_ARTICLES.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        "@type": "Person",
        name: article.author.name,
      },
      url: `https://toolifypro.com/blog/${article.slug}`,
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
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Blog & Guides
          </span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Base & Tutorials</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Practical Guides & Technical Tutorials
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Master digital workflows with our peer-reviewed guides on document compression, graphic optimization, financial math, and developer standards.
          </p>
        </div>

        {/* Featured Article */}
        {BLOG_ARTICLES[0] && (
          <div className="mb-12 bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-blue-900/40 shadow-sm hover:border-blue-500 dark:hover:border-cyan-400 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                Featured Guide
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {BLOG_ARTICLES[0].readTime}
              </span>
            </div>

            <Link href={`/blog/${BLOG_ARTICLES[0].slug}`} className="group">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                {BLOG_ARTICLES[0].title}
              </h2>
            </Link>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
              {BLOG_ARTICLES[0].description}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{BLOG_ARTICLES[0].author.name}</span>
                <span>•</span>
                <span>{BLOG_ARTICLES[0].publishedAt}</span>
              </div>

              <Link
                href={`/blog/${BLOG_ARTICLES[0].slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_ARTICLES.slice(1).map((article) => (
            <div
              key={article.slug}
              className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 border border-slate-200 dark:border-blue-900/40 shadow-sm hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase">
                    {article.category}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>

                <Link href={`/blog/${article.slug}`} className="group">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                    {article.title}
                  </h3>
                </Link>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{article.publishedAt}</span>
                <Link
                  href={`/blog/${article.slug}`}
                  className="font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
