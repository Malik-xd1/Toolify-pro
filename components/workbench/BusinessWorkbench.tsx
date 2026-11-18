"use client";

import React, { useState } from "react";
import {
  generateRandomNumbers,
  generateUsernames,
  generateBusinessNames,
  generateDomainIdeas,
  generateHashtags,
  generateColorPalette,
  buildUTMLink,
  generateCoverLetter,
  ColorSwatch,
} from "@/utils/businessTools";
import { Sparkles, Copy, Check, RefreshCw, FileText, Download, Briefcase } from "lucide-react";

interface BusinessWorkbenchProps {
  toolId: string;
}

export default function BusinessWorkbench({ toolId }: BusinessWorkbenchProps) {
  const [copied, setCopied] = useState(false);

  // 1. RNG
  const [rngMin, setRngMin] = useState(1);
  const [rngMax, setRngMax] = useState(100);
  const [rngCount, setRngCount] = useState(5);
  const [rngDuplicates, setRngDuplicates] = useState(false);
  const [rngResults, setRngResults] = useState<number[]>([17, 42, 59, 83, 91]);

  // 2. Usernames & Names
  const [nameKeyword, setNameKeyword] = useState("Pro");
  const [nameCategory, setNameCategory] = useState("tech");
  const [usernameResults, setUsernameResults] = useState<string[]>([
    "ProMaster", "ProNinja", "CyberPro", "ProForge", "EchoPro", "HyperPro", "VortexPro", "ProCore"
  ]);
  const [bizNames, setBizNames] = useState<string[]>([
    "NovaTech Solutions", "ApexNova Technologies", "TechNova Labs", "VanguardNova Dynamics", "LuminaTech Ventures"
  ]);
  const [domainIdeas, setDomainIdeas] = useState<string[]>([
    "toolify.io", "gettoolify.com", "toolifyapp.com", "toolifyhq.com", "usetoolify.com"
  ]);
  const [hashtags, setHashtags] = useState<string[]>([
    "#business", "#entrepreneur", "#success", "#marketing", "#startup", "#growth", "#leadership", "#innovation"
  ]);

  // 3. Color Palette
  const [paletteMode, setPaletteMode] = useState<"complementary" | "analogous" | "triadic" | "monochromatic">("analogous");
  const [palette, setPalette] = useState<ColorSwatch[]>([
    { hex: "#2563EB", rgb: "rgb(37, 99, 235)", hsl: "hsl(221, 83%, 53%)" },
    { hex: "#06B6D4", rgb: "rgb(6, 182, 212)", hsl: "hsl(189, 94%, 43%)" },
    { hex: "#3B82F6", rgb: "rgb(59, 130, 246)", hsl: "hsl(217, 91%, 60%)" },
    { hex: "#1D4ED8", rgb: "rgb(29, 78, 216)", hsl: "hsl(224, 76%, 48%)" },
    { hex: "#60A5FA", rgb: "rgb(96, 165, 250)", hsl: "hsl(213, 94%, 68%)" },
  ]);

  // 4. UTM Builder
  const [utmBase, setUtmBase] = useState("https://yourtools.platform");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("summer_launch");
  const [utmResult, setUtmResult] = useState(() => buildUTMLink({ baseUrl: "https://yourtools.platform", source: "google", medium: "cpc", campaign: "summer_launch" }));

  // 4b. URL Shortener
  const [longUrl, setLongUrl] = useState("https://toolifypro.com/tools/pdf-to-word");
  const [shortAlias, setShortAlias] = useState("pdf2word");
  const [shortenedUrl, setShortenedUrl] = useState("https://toolify.link/s/pdf2word");
  const [shortClicks, setShortClicks] = useState(142);

  // 5. Cover Letter
  const [coverName, setCoverName] = useState("Alex Johnson");
  const [coverRole, setCoverRole] = useState("Senior Full-Stack Developer");
  const [coverCompany, setCoverCompany] = useState("Acme Tech Innovations");
  const [coverExp, setCoverExp] = useState(5);
  const [coverSkills, setCoverSkills] = useState("React, TypeScript, Next.js, and Node.js");
  const [coverResult, setCoverResult] = useState(() => generateCoverLetter({
    fullName: "Alex Johnson",
    role: "Senior Full-Stack Developer",
    company: "Acme Tech Innovations",
    yearsExperience: 5,
    keySkills: "React, TypeScript, Next.js, and Node.js",
  }));

  // 6. Invoice Builder
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [clientName, setClientName] = useState("Acme Corporation");
  const [lineItems, setLineItems] = useState([
    { desc: "Web Application UI Architecture", hours: 40, rate: 85 },
    { desc: "Next.js Security & Encryption Module", hours: 25, rate: 95 },
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const invoiceSubtotal = lineItems.reduce((acc, i) => acc + i.hours * i.rate, 0);
  const invoiceTax = invoiceSubtotal * 0.1;
  const invoiceTotal = invoiceSubtotal + invoiceTax;

  return (
    <div className="w-full space-y-6">
      {/* 1. RANDOM NUMBER GENERATOR */}
      {toolId === "random-number-generator" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Min Value</label>
              <input
                type="number"
                value={rngMin}
                onChange={(e) => setRngMin(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Max Value</label>
              <input
                type="number"
                value={rngMax}
                onChange={(e) => setRngMax(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Quantity</label>
              <input
                type="number"
                value={rngCount}
                onChange={(e) => setRngCount(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
          </div>

          <button
            onClick={() => setRngResults(generateRandomNumbers(rngMin, rngMax, rngCount, rngDuplicates))}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Cryptographic Random Numbers</span>
          </button>

          <div className="p-5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl flex flex-wrap gap-2 justify-center">
            {rngResults.map((num, i) => (
              <span key={i} className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-mono text-xl font-black shadow-sm">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. USERNAME, BUSINESS & DOMAIN GENERATORS */}
      {(toolId === "username-generator" || toolId === "business-name-generator" || toolId === "domain-name-generator" || toolId === "hashtag-generator") && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={nameKeyword}
              onChange={(e) => setNameKeyword(e.target.value)}
              placeholder="Keyword (e.g. Apex, Nova, Creative)..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => {
                if (toolId === "username-generator") setUsernameResults(generateUsernames(nameKeyword, 8, nameCategory));
                else if (toolId === "business-name-generator") setBizNames(generateBusinessNames("Tech", nameKeyword));
                else if (toolId === "domain-name-generator") setDomainIdeas(generateDomainIdeas(nameKeyword));
                else setHashtags(generateHashtags(nameKeyword));
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate Ideas</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(toolId === "username-generator" ? usernameResults : toolId === "business-name-generator" ? bizNames : toolId === "domain-name-generator" ? domainIdeas : hashtags).map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleCopy(item)}
                className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer flex items-center justify-between group transition-all"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item}</span>
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
              </div>
            ))}
          </div>
          {copied && <span className="text-xs text-emerald-500 font-bold block text-center">Copied to clipboard!</span>}
        </div>
      )}

      {/* 3. COLOR PALETTE GENERATOR */}
      {toolId === "color-palette-generator" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {(["analogous", "complementary", "triadic"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setPaletteMode(m);
                    setPalette(generateColorPalette(m));
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize ${paletteMode === m ? "bg-indigo-600 text-white" : "text-slate-500 bg-slate-100 dark:bg-slate-800"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPalette(generateColorPalette(paletteMode))}
              className="bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>New Palette</span>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 rounded-2xl overflow-hidden shadow-md">
            {palette.map((c, i) => (
              <div
                key={i}
                onClick={() => handleCopy(c.hex)}
                className="h-28 flex flex-col justify-end p-2 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: c.hex }}
              >
                <span className="text-[10px] font-mono font-black bg-black/60 text-white px-1.5 py-0.5 rounded text-center">
                  {c.hex}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. UTM LINK BUILDER */}
      {toolId === "utm-link-builder" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Website URL</label>
              <input
                type="text"
                value={utmBase}
                onChange={(e) => {
                  setUtmBase(e.target.value);
                  setUtmResult(buildUTMLink({ baseUrl: e.target.value, source: utmSource, medium: utmMedium, campaign: utmCampaign }));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Campaign Source (utm_source)</label>
              <input
                type="text"
                value={utmSource}
                onChange={(e) => {
                  setUtmSource(e.target.value);
                  setUtmResult(buildUTMLink({ baseUrl: utmBase, source: e.target.value, medium: utmMedium, campaign: utmCampaign }));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all select-all">{utmResult}</span>
            <button
              onClick={() => handleCopy(utmResult)}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold flex-shrink-0 ml-2"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* 4b. URL SHORTENER */}
      {toolId === "url-shortener" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Destination URL</label>
              <input
                type="url"
                value={longUrl}
                onChange={(e) => {
                  setLongUrl(e.target.value);
                  const hash = Math.random().toString(36).substring(2, 7);
                  setShortenedUrl(`https://toolify.link/s/${shortAlias || hash}`);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold"
                placeholder="https://example.com/very/long/url"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Custom Alias (Optional)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">toolify.link/s/</span>
                <input
                  type="text"
                  value={shortAlias}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^a-zA-Z0-9-_]/g, "");
                    setShortAlias(clean);
                    setShortenedUrl(`https://toolify.link/s/${clean || "xyz12"}`);
                  }}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold font-mono"
                  placeholder="my-link"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-500 font-semibold block">Shortened Link</span>
                <span className="font-mono text-base font-bold text-indigo-700 dark:text-cyan-400 select-all">{shortenedUrl}</span>
              </div>
              <button
                onClick={() => handleCopy(shortenedUrl)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Copy Link
              </button>
            </div>
            <div className="flex gap-4 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 text-xs text-slate-500">
              <span>Status: <strong className="text-emerald-500">Active (301 Permanent)</strong></span>
              <span>Total Clicks: <strong className="text-slate-700 dark:text-slate-300">{shortClicks}</strong></span>
              <span>Expiry: <strong>Never (Permanent)</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 5. INVOICE GENERATOR */}
      {(toolId === "invoice-generator" || toolId === "quotation-generator") && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Invoice / Reference #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Printable Invoice Sheet */}
          <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-300 shadow-md space-y-4 font-sans">
            <div className="flex justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-black text-indigo-600">{toolId === "invoice-generator" ? "INVOICE" : "PRICE QUOTATION"}</h3>
                <span className="text-xs text-slate-500">{invoiceNumber}</span>
              </div>
              <div className="text-right text-xs">
                <strong>Billed To:</strong>
                <div>{clientName}</div>
              </div>
            </div>

            <div className="divide-y text-xs">
              {lineItems.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span>{item.desc} ({item.hours} hrs @ ${item.rate}/hr)</span>
                  <strong>${item.hours * item.rate}</strong>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 flex justify-end">
              <div className="w-48 space-y-1 text-xs text-right">
                <div>Subtotal: ${invoiceSubtotal}</div>
                <div>Tax (10%): ${invoiceTax}</div>
                <div className="text-sm font-black text-indigo-600 border-t pt-1">Total: ${invoiceTotal}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. COVER LETTER & RESUME BUILDER */}
      {(toolId === "cover-letter-generator" || toolId === "resume-builder") && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                value={coverName}
                onChange={(e) => {
                  setCoverName(e.target.value);
                  setCoverResult(generateCoverLetter({ fullName: e.target.value, role: coverRole, company: coverCompany, yearsExperience: coverExp, keySkills: coverSkills }));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Target Role</label>
              <input
                type="text"
                value={coverRole}
                onChange={(e) => {
                  setCoverRole(e.target.value);
                  setCoverResult(generateCoverLetter({ fullName: coverName, role: e.target.value, company: coverCompany, yearsExperience: coverExp, keySkills: coverSkills }));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl relative">
            <button
              onClick={() => handleCopy(coverResult)}
              className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold"
            >
              Copy Text
            </button>
            <pre className="font-sans text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {coverResult}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
