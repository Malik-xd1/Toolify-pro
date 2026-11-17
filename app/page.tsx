"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import CategoriesGrid from "@/components/CategoriesGrid";
import FileLockerBanner from "@/components/FileLockerBanner";
import BottomHighlights from "@/components/BottomHighlights";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ToolWorkbench from "@/components/ToolWorkbench";
import AllToolsModal from "@/components/AllToolsModal";
import FileLockerModal from "@/components/FileLockerModal";
import AboutModal from "@/components/AboutModal";
import ContactModal from "@/components/ContactModal";
import LegalModal, { LegalDocType } from "@/components/LegalModal";
import { ToolCategory } from "@/data/toolsData";

export default function Home() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isAllToolsOpen, setIsAllToolsOpen] = useState(false);
  const [allToolsCategory, setAllToolsCategory] = useState<ToolCategory | "all">("all");
  const [isFileLockerOpen, setIsFileLockerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [legalModalDoc, setLegalModalDoc] = useState<LegalDocType | null>(null);

  const handleOpenTool = (toolId: string) => {
    if (toolId === "file-locker" || toolId === "pdf-locker") {
      setIsFileLockerOpen(true);
    } else {
      setActiveToolId(toolId);
    }
  };

  const handleOpenCategory = (category: ToolCategory | "all") => {
    setAllToolsCategory(category);
    setIsAllToolsOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] transition-colors duration-200">
      {/* 1. Header / Navbar */}
      <Navbar
        onOpenTool={handleOpenTool}
        onOpenCategory={handleOpenCategory}
        onOpenFileLocker={() => setIsFileLockerOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* 2. Hero Section */}
      <Hero onSelectTool={handleOpenTool} />

      {/* 3. 5-Feature Trust Bar */}
      <TrustBar />

      {/* 4. Explore Our Tools (12 Category Cards) */}
      <CategoriesGrid
        onSelectCategory={handleOpenCategory}
        onOpenFileLocker={() => setIsFileLockerOpen(true)}
      />

      {/* 5. File Locker Banner */}
      <FileLockerBanner onOpenFileLocker={() => setIsFileLockerOpen(true)} />

      {/* 6. Bottom 3-Column Highlights */}
      <BottomHighlights
        onOpenTool={handleOpenTool}
        onOpenAllTools={() => handleOpenCategory("all")}
        onOpenFileLocker={() => setIsFileLockerOpen(true)}
      />

      {/* 7. FAQ Section */}
      <FAQSection />

      {/* 8. Footer */}
      <Footer
        onOpenCategory={handleOpenCategory}
        onOpenFileLocker={() => setIsFileLockerOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenLegal={(doc) => setLegalModalDoc(doc)}
      />

      {/* Modals & Workbenches */}
      {/* Active Tool Interactive Workbench */}
      {activeToolId && (
        <ToolWorkbench
          toolId={activeToolId}
          onClose={() => setActiveToolId(null)}
          onSwitchTool={(newId) => setActiveToolId(newId)}
        />
      )}

      {/* All Tools Directory Modal */}
      <AllToolsModal
        isOpen={isAllToolsOpen}
        onClose={() => setIsAllToolsOpen(false)}
        onSelectTool={handleOpenTool}
        initialCategory={allToolsCategory}
      />

      {/* Anonymous File Locker Modal */}
      <FileLockerModal
        isOpen={isFileLockerOpen}
        onClose={() => setIsFileLockerOpen(false)}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={!!legalModalDoc}
        onClose={() => setLegalModalDoc(null)}
        docType={legalModalDoc || "privacy"}
      />
    </main>
  );
}
