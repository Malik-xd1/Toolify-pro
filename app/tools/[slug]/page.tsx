import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, getToolById } from "@/data/toolsData";
import ToolPageClient from "./ToolPageClient";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.id,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolById(slug) || TOOLS.find((t) => t.id === slug);

  if (!tool) {
    return {
      title: "Tool Not Found | ToolifyPro",
      description: "The requested online tool could not be found.",
    };
  }

  const title = `${tool.name} - Free Online Tool | ToolifyPro`;
  const description = `${tool.description}. 100% free, browser-based, instant client-side processing with zero file uploads. No signup needed.`;
  const canonicalUrl = `https://toolifypro.com/tools/${tool.id}`;

  return {
    title,
    description,
    keywords: [
      tool.name,
      tool.category,
      ...(tool.searchKeywords || []),
      "online tool",
      "free converter",
      "privacy first",
      "no login",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "ToolifyPro",
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

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolById(slug) || TOOLS.find((t) => t.id === slug);

  if (!tool) {
    notFound();
  }

  // Structured Data (JSON-LD) for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: `https://toolifypro.com/tools/${tool.id}`,
    featureList: [
      "100% Free and Unlimited Usage",
      "Client-Side In-Browser Execution",
      "No Software Installation or Registration Required",
      "Mobile and Desktop Compatible",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#070b19] flex items-center justify-center text-slate-500">Loading tool...</div>}>
        <ToolPageClient tool={tool} />
      </Suspense>
    </>
  );
}
