"use client";

import React, { useState } from "react";
import {
  auditWebsiteSEO,
  checkMetaDescription,
  checkSitemap,
  checkRobotsTxt,
  lookupDNS,
  lookupIP,
  checkWebsiteDown,
  SeoAuditReport,
} from "@/utils/seoWebTools";
import { Globe, Search, CheckCircle2, AlertTriangle, ShieldCheck, Activity, Server, Clock } from "lucide-react";

interface SeoWorkbenchProps {
  toolId: string;
}

export default function SeoWorkbench({ toolId }: SeoWorkbenchProps) {
  const [urlInput, setUrlInput] = useState("https://yourtools.platform");
  const [htmlInput, setHtmlInput] = useState(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <title>YourTools - 100+ Free Online Utility Tools & Fast Converters</title>
  <meta name="description" content="Convert, compress, edit, encrypt, and manage digital files with 100+ free online tools. No login or registration required. Fast and 100% private.">
  <link rel="canonical" href="https://yourtools.platform">
  <meta property="og:title" content="YourTools - Every Tool. One Platform.">
</head>
<body>
  <h1>Every Tool You Need. One Powerful Platform.</h1>
  <h2>Explore Our Tools</h2>
  <h3>PDF & Documents</h3>
</body>
</html>`
  );

  const [loading, setLoading] = useState(false);
  const [seoReport, setSeoReport] = useState<SeoAuditReport | null>(() => auditWebsiteSEO(htmlInput));
  const [metaReport, setMetaReport] = useState(() => checkMetaDescription("Convert, compress, edit, encrypt, and manage digital files with 100+ free online tools.", "YourTools"));
  const [dnsResult, setDnsResult] = useState<{ status?: string; domain: string; recordType: string; answers: { name: string; TTL: number; data: string }[] } | null>(null);
  const [ipResult, setIpResult] = useState<{
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    org?: string;
    timezone?: string;
    asn?: string;
  } | null>(null);
  const [statusResult, setStatusResult] = useState<{ isUp: boolean; latencyMs: number; statusText: string } | null>(null);

  const [robotsInput, setRobotsInput] = useState(`User-agent: *\nDisallow: /admin/\nDisallow: /private/\nAllow: /\n\nSitemap: https://yourtools.platform/sitemap.xml`);
  const [robotsReport, setRobotsReport] = useState(() => checkRobotsTxt(robotsInput));

  const [sitemapInput, setSitemapInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourtools.platform/</loc>
    <lastmod>2026-11-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourtools.platform/tools/pdf-merger</loc>
    <lastmod>2026-11-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
  const [sitemapReport, setSitemapReport] = useState(() => checkSitemap(sitemapInput));

  const handleAuditSEO = () => {
    setLoading(true);
    setTimeout(() => {
      setSeoReport(auditWebsiteSEO(htmlInput));
      setLoading(false);
    }, 400);
  };

  const handleCheckDNS = async () => {
    setLoading(true);
    const res = await lookupDNS(urlInput, "A");
    setDnsResult(res);
    setLoading(false);
  };

  const handleCheckIP = async () => {
    setLoading(true);
    const res = await lookupIP(urlInput);
    setIpResult(res);
    setLoading(false);
  };

  const handleCheckDown = async () => {
    setLoading(true);
    const res = await checkWebsiteDown(urlInput);
    setStatusResult(res);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. WEBSITE SEO CHECKER */}
      {toolId === "website-seo-checker" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Paste HTML Source Code or Webpage markup to Audit
            </label>
            <textarea
              rows={6}
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 font-mono text-xs outline-none focus:border-teal-500"
            />
          </div>

          <button
            onClick={handleAuditSEO}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "Analyzing SEO Tags..." : "Run On-Page SEO Audit"}</span>
          </button>

          {seoReport && (
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs uppercase font-extrabold text-slate-400">SEO Health Score</span>
                <span className={`text-2xl font-black ${seoReport.score >= 80 ? "text-emerald-500" : "text-amber-500"}`}>
                  {seoReport.score} / 100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Title Tag ({seoReport.titleLength} chars)</span>
                  <strong className="text-slate-800 dark:text-slate-100">{seoReport.title || "None"}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Meta Description ({seoReport.descLength} chars)</span>
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2">{seoReport.description || "None"}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Audit Checklist & Recommendations:</span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {seoReport.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-500 font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. META DESCRIPTION CHECKER */}
      {toolId === "meta-description-checker" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Meta Description Text</label>
            <textarea
              rows={3}
              value={metaReport.previewSnippet}
              onChange={(e) => setMetaReport(checkMetaDescription(e.target.value, metaReport.previewTitle))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-medium"
            />
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Google Desktop SERP Preview</span>
            <div className="text-blue-700 dark:text-blue-400 text-base font-semibold hover:underline cursor-pointer">
              {metaReport.previewTitle}
            </div>
            <div className="text-emerald-700 dark:text-emerald-400 text-xs">
              https://yourtools.platform › tools
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              {metaReport.previewSnippet}
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span>Length: <strong>{metaReport.length}</strong> chars</span>
              <span>Estimated Pixel Width: <strong>{metaReport.pixelWidth}px</strong> / 960px max</span>
              <span className={`font-bold ${metaReport.status === "optimal" ? "text-emerald-500" : "text-amber-500"}`}>
                {metaReport.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. DNS & IP LOOKUP */}
      {(toolId === "dns-lookup" || toolId === "ip-lookup" || toolId === "ssl-checker" || toolId === "whois-lookup" || toolId === "website-down-checker" || toolId === "website-speed-test" || toolId === "http-header-checker" || toolId === "redirect-checker" || toolId === "broken-link-checker") && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. yourtools.platform or 1.1.1.1"
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-teal-500"
            />
            <button
              onClick={() => {
                if (toolId === "dns-lookup") handleCheckDNS();
                else if (toolId === "ip-lookup") handleCheckIP();
                else handleCheckDown();
              }}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              <span>{loading ? "Querying..." : "Analyze"}</span>
            </button>
          </div>

          {/* DNS Display */}
          {toolId === "dns-lookup" && dnsResult && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">DNS Answers for {dnsResult.domain}</span>
                <span className="text-emerald-500 font-bold">{dnsResult.status}</span>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {dnsResult.answers.map((ans, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between font-mono">
                    <span className="text-slate-500">{ans.name} (TTL: {ans.TTL}s)</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{ans.data}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IP Display */}
          {toolId === "ip-lookup" && ipResult && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">IP Address</span>
                <strong className="text-slate-800 dark:text-white font-mono">{ipResult.ip}</strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">City / Country</span>
                <strong className="text-slate-800 dark:text-white">{ipResult.city}, {ipResult.country}</strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">ISP / Organization</span>
                <strong className="text-slate-800 dark:text-white">{ipResult.org}</strong>
              </div>
            </div>
          )}

          {/* General Web Status & Latency Check */}
          {(toolId === "website-down-checker" || toolId === "website-speed-test" || toolId === "ssl-checker") && statusResult && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Host Availability</span>
                <span className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{statusResult.statusText}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Edge Latency</span>
                <span className="text-xl font-mono text-cyan-400">{statusResult.latencyMs} ms</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SITEMAP & ROBOTS.TXT CHECKERS */}
      {toolId === "sitemap-checker" && (
        <div className="space-y-4">
          <textarea
            rows={5}
            value={sitemapInput}
            onChange={(e) => {
              setSitemapInput(e.target.value);
              setSitemapReport(checkSitemap(e.target.value));
            }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 font-mono text-xs"
          />
          <div className="p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 rounded-2xl text-xs flex justify-between items-center">
            <span>Valid XML Sitemap: <strong>{sitemapReport.isValid ? "Yes" : "No"}</strong></span>
            <span>Indexed URLs: <strong>{sitemapReport.totalUrls}</strong></span>
          </div>
        </div>
      )}

      {toolId === "robots-txt-checker" && (
        <div className="space-y-4">
          <textarea
            rows={5}
            value={robotsInput}
            onChange={(e) => {
              setRobotsInput(e.target.value);
              setRobotsReport(checkRobotsTxt(e.target.value));
            }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 font-mono text-xs"
          />
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-1">
            <div>User-Agents: <strong>{robotsReport.userAgents.join(", ") || "*"}</strong></div>
            <div>Disallowed Paths: <strong>{robotsReport.disallowed.join(", ") || "None"}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
