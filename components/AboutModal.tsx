"use client";

import React from "react";
import { X, Shield, Zap, Heart, Lock, Globe } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#080e26] border border-slate-200 dark:border-blue-900/60 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Zap className="w-7 h-7 fill-white" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              About YourTools
            </h3>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
              Every Tool. One Platform.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          YourTools is designed as the ultimate open-access, login-free digital
          utility suite. We believe powerful tools for PDF manipulation, file
          conversions, media editing, developer helpers, and cryptographic storage
          should be fast, beautiful, and completely free of paywalls or forced
          account registrations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                100% Privacy by Design
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                All file processing is performed client-side. Your documents
                never touch our servers.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Zero-Knowledge Vault
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Anonymous file locker protected with client-side 256-bit AES-GCM
                and 12-word recovery keys.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-full"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
