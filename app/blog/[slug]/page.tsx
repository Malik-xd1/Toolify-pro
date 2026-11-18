import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Calendar,
  User,
  ChevronRight,
  ArrowRight,
  Sparkles,
  BookOpen,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_ARTICLES, BlogArticle } from "@/data/blogArticles";
import { TOOLS } from "@/data/toolsData";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Article Not Found | ToolifyPro",
    };
  }

  const title = `${article.title} | ToolifyPro Guides`;
  const description = article.description;
  const canonicalUrl = `https://toolifypro.com/blog/${article.slug}`;

  return {
    title,
    description,
    keywords: article.keywords,
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Find related tools data
  const linkedTools = article.relatedTools
    .map((toolId) => TOOLS.find((t) => t.id === toolId))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "ToolifyPro",
      logo: {
        "@type": "ImageObject",
        url: "https://toolifypro.com/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://toolifypro.com/blog/${article.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
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
            href="/blog"
            className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          >
            Blog & Guides
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{article.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {article.author.name}
                </span>
                <span className="text-[11px] text-slate-500">{article.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:ml-auto">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {article.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Article Lead Paragraph */}
        <div className="p-6 rounded-3xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-medium mb-10">
          {article.content.lead}
        </div>

        {/* Article Body Content */}
        <article className="space-y-10 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {article.content.sections.map((section, idx) => (
            <section key={idx} className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-900/40 shadow-sm space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {section.heading}
              </h2>

              <p className="leading-relaxed">{section.body}</p>

              {section.list && (
                <ul className="space-y-2 pl-2">
                  {section.list.map((item, lIdx) => (
                    <li key={lIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.codeSnippet && (
                <div className="p-4 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                  <code>{section.codeSnippet}</code>
                </div>
              )}

              {section.callout && (
                <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  section.callout.type === "warning"
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200"
                    : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-cyan-200"
                }`}>
                  {section.callout.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs leading-relaxed">{section.callout.text}</p>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* Related Interactive Tools Callout */}
        {linkedTools.length > 0 && (
          <div className="mt-14 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-900/10 dark:bg-[#0a122e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-900/40">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <span>Try the Tools Mentioned in this Guide</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Execute what you just learned with our free, browser-native tools:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {linkedTools.map((t) => (
                <Link
                  key={t!.id}
                  href={`/tools/${t!.id}`}
                  className="p-4 rounded-2xl bg-white dark:bg-[#070e28] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 transition-all flex items-center justify-between group"
                >
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                      {t!.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{t!.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
          >
            <span>← Back to all Guides & Tutorials</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
