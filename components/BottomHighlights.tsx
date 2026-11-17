"use client";

import React from "react";
import {
  FileText,
  Image as ImageIcon,
  Play,
  Video,
  QrCode,
  Lock,
  CheckCircle2,
  ArrowRight,
  Rocket,
  TrendingUp,
} from "lucide-react";

interface BottomHighlightsProps {
  onOpenTool: (toolId: string) => void;
  onOpenAllTools: () => void;
  onOpenFileLocker: () => void;
}

export default function BottomHighlights({
  onOpenTool,
  onOpenAllTools,
  onOpenFileLocker,
}: BottomHighlightsProps) {
  const popularTools = [
    {
      id: "merge-pdf",
      name: "Merge PDF",
      icon: <FileText className="w-5 h-5 text-white" />,
      color: "bg-red-500",
    },
    {
      id: "jpg-to-png",
      name: "JPG to PNG",
      icon: <ImageIcon className="w-5 h-5 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "mp4-to-mp3",
      name: "MP4 to MP3",
      icon: <Play className="w-5 h-5 text-white fill-white ml-0.5" />,
      color: "bg-purple-600",
    },
    {
      id: "video-compressor",
      name: "Compress Video",
      icon: <Video className="w-5 h-5 text-white" />,
      color: "bg-teal-500",
    },
    {
      id: "qr-code-generator",
      name: "QR Code Generator",
      icon: <QrCode className="w-5 h-5 text-white" />,
      color: "bg-amber-500",
    },
    {
      id: "pdf-locker",
      name: "PDF Locker",
      icon: <Lock className="w-5 h-5 text-white" />,
      color: "bg-blue-600",
    },
  ];

  return (
    <section className="py-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Most Popular Tools (span 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏆</span>
                <span>Most Popular Tools</span>
              </h3>
              <button
                onClick={onOpenAllTools}
                className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick action grid (6 tools) */}
            <div className="grid grid-cols-3 gap-3">
              {popularTools.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    if (t.id === "pdf-locker") {
                      onOpenFileLocker();
                    } else {
                      onOpenTool(t.id);
                    }
                  }}
                  className="bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex flex-col items-center text-center cursor-pointer group transition-all hover:scale-105"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${t.color} flex items-center justify-center shadow-md mb-2 group-hover:shadow-lg transition-all`}
                  >
                    {t.icon}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Why Choose YourTools? (span 4) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
              Why Choose{" "}
              <span className="text-blue-600 dark:text-cyan-400">YourTools?</span>
            </h3>

            <div className="space-y-3 mb-4 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>100+ Free Online Tools</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>Fast & Reliable Performance</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>Works on All Devices</span>
              </div>
            </div>
          </div>

          {/* Rocket 3D Graphic */}
          <div className="absolute -bottom-2 -right-2 w-36 h-36 flex items-center justify-center opacity-90 pointer-events-none">
            <div className="relative">
              {/* Clouds */}
              <div className="absolute -bottom-3 -left-4 w-28 h-10 bg-slate-100 dark:bg-slate-800 rounded-full blur-[1px]" />
              {/* Rocket Body */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center transform -rotate-45 shadow-xl shadow-cyan-500/30">
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Boost Your Productivity (span 3) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#07133d] to-[#04081c] rounded-3xl p-6 border border-blue-600/30 shadow-xl shadow-blue-950/50 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle neon glow in corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
              Boost Your Productivity
            </h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed mb-4">
              Get more done with our powerful tools.
            </p>

            <button
              onClick={onOpenAllTools}
              className="bg-white hover:bg-slate-100 text-[#07133d] font-bold text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            >
              <span>Start Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Growth Bar Chart Graphic */}
          <div className="mt-4 flex items-end justify-end gap-1.5 pt-4">
            <div className="flex items-center gap-1 text-cyan-400 font-bold text-xs mr-2 mb-2">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="w-3 h-6 bg-cyan-600/50 rounded-t-sm" />
            <div className="w-3 h-9 bg-cyan-500/70 rounded-t-sm" />
            <div className="w-3 h-13 bg-cyan-400/90 rounded-t-sm" />
            <div className="w-3 h-17 bg-cyan-300 rounded-t-sm shadow-[0_0_10px_#22d3ee]" />
          </div>
        </div>
      </div>
    </section>
  );
}
