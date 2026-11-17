import React from "react";
import { Zap, ShieldCheck, Infinity, Gem, Headphones } from "lucide-react";

export default function TrustBar() {
  const highlights = [
    {
      icon: <Zap className="w-5 h-5 text-blue-600 fill-blue-600" />,
      title: "Lightning Fast",
      subtitle: "Get results instantly",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: "100% Secure",
      subtitle: "Your files are safe",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      icon: <Infinity className="w-5 h-5 text-cyan-600 stroke-[2.5]" />,
      title: "No Login Required",
      subtitle: "Use all tools freely",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/50",
    },
    {
      icon: <Gem className="w-5 h-5 text-blue-600" />,
      title: "Premium Quality",
      subtitle: "Professional results",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      icon: <Headphones className="w-5 h-5 text-blue-600" />,
      title: "Always Available",
      subtitle: "Anytime, Anywhere",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
  ];

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-10 sm:-mt-12">
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-black/40 border border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3.5 ${
                idx !== 0 ? "pt-3 md:pt-0 md:pl-4" : ""
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${item.bgColor} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
