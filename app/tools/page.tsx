import React from "react";
import { Metadata } from "next";
import { TOOLS, CATEGORIES } from "@/data/toolsData";
import ToolsDirectoryClient from "./ToolsDirectoryClient";

export const metadata: Metadata = {
  title: "All 120+ Online Tools - Free Digital Utility Directory | ToolifyPro",
  description:
    "Browse our complete directory of 120+ free online tools for PDF, image, video, audio, text, developer, calculators, QR codes, and SEO. 100% private and client-side.",
  alternates: {
    canonical: "https://toolifypro.com/tools",
  },
};

export default function ToolsDirectoryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ToolifyPro Online Tools Directory",
    description: "Complete list of free browser-based online tools and utilities.",
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((t, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: t.name,
      description: t.description,
      url: `https://toolifypro.com/tools/${t.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolsDirectoryClient tools={TOOLS} categories={CATEGORIES} />
    </>
  );
}
