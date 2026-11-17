"use client";

import React from "react";
import { Lock, CheckCircle2, ArrowRight, ShieldCheck, FileText, Image as ImageIcon, Play } from "lucide-react";

interface FileLockerBannerProps {
  onOpenFileLocker: () => void;
}

export default function FileLockerBanner({ onOpenFileLocker }: FileLockerBannerProps) {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#050c26] via-[#0a1b49] to-[#04091f] border border-blue-600/30 shadow-2xl shadow-blue-900/30 p-8 sm:p-12 text-white">
        {/* Glow and light curves */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Vault Safe Illustration with Floating File Badges */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Glowing floor pedestal ring */}
              <div className="absolute bottom-2 w-56 h-16 rounded-full bg-cyan-500/30 blur-md border border-cyan-400/50 transform rotate-[-5deg]" />
              <div className="absolute bottom-0 w-48 h-10 rounded-full bg-blue-600/40 blur-lg" />

              {/* 3D Vault Safe Box */}
              <div className="relative z-10 w-48 h-48 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-4 border-blue-400/60 shadow-[0_0_35px_rgba(59,130,246,0.5)] flex items-center justify-center">
                {/* Vault Door Inset */}
                <div className="w-38 h-38 sm:w-42 sm:h-42 rounded-2xl bg-gradient-to-tr from-slate-800 via-slate-900 to-slate-800 border-2 border-slate-600 flex items-center justify-center relative overflow-hidden">
                  {/* Glowing dial / wheel */}
                  <div className="w-24 h-24 rounded-full border-4 border-blue-400/80 bg-slate-950/80 flex items-center justify-center shadow-inner relative animate-pulse-slow">
                    {/* Dial spokes */}
                    <div className="absolute w-full h-1 bg-blue-400/60" />
                    <div className="absolute h-full w-1 bg-blue-400/60" />
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md shadow-blue-400/50">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges around safe */}
              {/* PDF badge */}
              <div className="absolute top-10 right-2 z-20 animate-float">
                <div className="w-11 h-11 rounded-xl bg-red-500 shadow-lg shadow-red-500/50 flex flex-col items-center justify-center text-white border border-red-300/40 transform rotate-12">
                  <FileText className="w-5 h-5" />
                  <span className="text-[8px] font-bold">PDF</span>
                </div>
              </div>

              {/* Image badge */}
              <div className="absolute top-16 right-12 z-20 animate-float-delayed">
                <div className="w-9 h-9 rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/50 flex items-center justify-center text-white border border-emerald-300/40 transform -rotate-12">
                  <ImageIcon className="w-5 h-5" />
                </div>
              </div>

              {/* Video badge */}
              <div className="absolute bottom-12 right-6 z-20 animate-float">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/50 flex items-center justify-center text-white border border-indigo-300/40 transform rotate-6">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Details & CTA */}
          <div className="lg:col-span-5 flex flex-col items-start">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Private & Secure</span>
            </div>

            {/* Heading */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              File Locker – Keep Your Files Private
            </h3>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-300 font-normal mb-5 leading-relaxed">
              Store your PDFs, videos, images and more with password protection.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-7 text-xs sm:text-sm text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>No Login Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Recovery Key</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Encrypted Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Easy Access</span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onOpenFileLocker}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all text-sm"
            >
              <span>Open File Locker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Handwritten Script Accent */}
          <div className="lg:col-span-3 flex items-center justify-center lg:justify-end">
            <div className="font-script text-3xl sm:text-4xl text-white/90 -rotate-6 tracking-wide drop-shadow-[0_2px_12px_rgba(34,211,238,0.4)] text-center lg:text-right select-none">
              Your Files... <br />
              <span className="text-cyan-300">Your Privacy...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
