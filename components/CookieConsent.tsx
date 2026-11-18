"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield, X, Check, SlidersHorizontal } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [adsAllowed, setAdsAllowed] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("toolify_consent");
      if (!consent) {
        // Show after a brief 1-second delay so page loads smoothly
        const timer = setTimeout(() => setShowBanner(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch (_) {}
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        "toolify_consent",
        JSON.stringify({
          essential: true,
          analytics: true,
          advertising: true,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (_) {}
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem(
        "toolify_consent",
        JSON.stringify({
          essential: true,
          analytics: false,
          advertising: false,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (_) {}
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        "toolify_consent",
        JSON.stringify({
          essential: true,
          analytics: analyticsAllowed,
          advertising: adsAllowed,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (_) {}
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Floating Bottom Consent Banner */}
      <div
        role="region"
        aria-label="Cookie Preferences Banner"
        className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-lg z-50 bg-[#091233]/95 border border-blue-800/80 rounded-3xl shadow-2xl p-5 sm:p-6 backdrop-blur-xl text-white transition-all animate-in fade-in slide-in-from-bottom-5"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-cyan-400 flex-shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">
              We Value Your Privacy
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              ToolifyPro processes your files locally in your browser. We and our advertising partners (such as Google AdSense) use cookies to measure traffic and serve personalized ads. Read our{" "}
              <Link
                href="/cookies"
                className="underline text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-end gap-2 text-xs">
          <button
            onClick={() => setShowPreferences(true)}
            className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
          <button
            onClick={handleRejectNonEssential}
            className="px-3.5 py-1.5 rounded-xl border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white transition-colors font-semibold cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/40 cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091233] border border-blue-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Cookie Preferences</span>
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Essential Cookies */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <strong className="block text-white font-semibold mb-0.5">
                    Essential & Functional
                  </strong>
                  <span className="text-slate-400">
                    Required for site navigation, theme preferences, and local tool execution.
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold uppercase">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <strong className="block text-white font-semibold mb-0.5">
                    Analytics & Performance
                  </strong>
                  <span className="text-slate-400">
                    Helps us understand platform usage and optimize processing speed.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer accent-blue-600"
                />
              </div>

              {/* Advertising */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <strong className="block text-white font-semibold mb-0.5">
                    Personalized Advertising
                  </strong>
                  <span className="text-slate-400">
                    Allows Google AdSense and partners to deliver relevant advertisements.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={adsAllowed}
                  onChange={(e) => setAdsAllowed(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/40"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
