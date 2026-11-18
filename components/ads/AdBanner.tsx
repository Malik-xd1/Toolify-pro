"use client";

import React, { useEffect, useState } from "react";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  client?: string; // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
}

export default function AdBanner({
  slot = "1234567890",
  format = "auto",
  responsive = true,
  className = "",
  client = "ca-pub-XXXXXXXXXXXXXXXX",
}: AdBannerProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const isProduction = process.env.NODE_ENV === "production" && client !== "ca-pub-XXXXXXXXXXXXXXXX";

  useEffect(() => {
    if (isProduction && typeof window !== "undefined") {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }
  }, [isProduction]);

  return (
    <div
      className={`my-8 mx-auto w-full max-w-5xl flex flex-col items-center justify-center ${className}`}
      aria-label="Advertisement"
    >
      {/* Policy-Required Advertisement Label */}
      <div className="w-full text-center mb-1.5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 select-none">
          Advertisement
        </span>
      </div>

      {/* Ad Container Box */}
      <div className="w-full min-h-[100px] sm:min-h-[120px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-blue-900/30 bg-slate-100/60 dark:bg-[#070e28]/60 flex items-center justify-center text-center p-3 transition-colors">
        {isProduction ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
          />
        ) : (
          /* High-Fidelity AdSense Placeholder in Development */
          <div className="flex flex-col items-center justify-center p-4 text-slate-400 dark:text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mb-1 text-[11px] font-bold">
              AD
            </div>
            <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">
              Google AdSense Policy-Compliant Ad Slot
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Slot ID: {slot} • Responsive Auto Format
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
