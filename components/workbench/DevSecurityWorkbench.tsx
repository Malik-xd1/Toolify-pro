"use client";

import React, { useState } from "react";
import {
  formatHTML,
  minifyHTML,
  formatCSS,
  minifyCSS,
  formatJS,
  testRegex,
} from "@/utils/devToolsExtra";
import {
  generateSecurePin,
  generateRandomKeys,
} from "@/utils/securityExtraTools";
import {
  formatWhatsAppLink,
  generateWhatsAppQR,
  generateBarcodeSVG,
} from "@/utils/qrBarcodeTools";
import { Code, Key, QrCode, Copy, Check, Sparkles, RefreshCw, Download } from "lucide-react";

interface DevSecurityWorkbenchProps {
  toolId: string;
}

export default function DevSecurityWorkbench({ toolId }: DevSecurityWorkbenchProps) {
  const [codeSnippet, setCodeSnippet] = useState(
    `<div class="card"><h1 class="title">Welcome to ToolifyPro</h1><p>Every digital tool in one place.</p></div>`
  );
  const [codeResult, setCodeResult] = useState("");
  const [copied, setCopied] = useState(false);

  // Regex State
  const [regexPattern, setRegexPattern] = useState("(\\w+)@(\\w+)\\.(\\w+)");
  const [regexFlags, setRegexFlags] = useState("g");
  const [regexText, setRegexText] = useState("Contact us at support@yourtools.platform or admin@toolify.com for help.");
  const [regexResult, setRegexResult] = useState(() => testRegex("(\\w+)@(\\w+)\\.(\\w+)", "g", regexText));

  // PIN & Keys
  const [pinLength, setPinLength] = useState(6);
  const [pinResult, setPinResult] = useState("849201");
  const [keyType, setKeyType] = useState<"api_key" | "hex_256" | "base64_256" | "token_512">("api_key");
  const [keyResult, setKeyResult] = useState({
    key: "api_key_4b8f9e01a2c3d4e5f607182930415263",
    bits: 256,
    format: "API Key (Bearer Token)",
  });

  // WhatsApp QR
  const [waPhone, setWaPhone] = useState("+1 555 123 4567");
  const [waMsg, setWaMsg] = useState("Hello! I am contacting you via ToolifyPro.");
  const [waQrDataUrl, setWaQrDataUrl] = useState<string | null>(null);

  // Barcode
  const [barcodeText, setBarcodeText] = useState("TOOLIFY-2026-PRO");
  const [barcodeType, setBarcodeType] = useState<"CODE128" | "EAN13" | "CODE39">("CODE128");
  const [barcodeDataUrl, setBarcodeDataUrl] = useState(() => generateBarcodeSVG("TOOLIFY-2026-PRO").dataUrl);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. HTML / CSS / JS FORMATTER & MINIFIER */}
      {(toolId === "html-formatter" || toolId === "html-minifier" || toolId === "css-formatter" || toolId === "css-minifier" || toolId === "javascript-formatter") && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Source Code</label>
            <textarea
              rows={6}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 font-mono text-xs outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (toolId === "html-formatter") setCodeResult(formatHTML(codeSnippet));
                else if (toolId === "html-minifier") setCodeResult(minifyHTML(codeSnippet));
                else if (toolId === "css-formatter") setCodeResult(formatCSS(codeSnippet));
                else if (toolId === "css-minifier") setCodeResult(minifyCSS(codeSnippet));
                else setCodeResult(formatJS(codeSnippet));
              }}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Execute Formatting</span>
            </button>
          </div>

          {codeResult && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl relative font-mono text-xs overflow-x-auto">
              <button
                onClick={() => handleCopy(codeResult)}
                className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded text-xs font-sans font-bold"
              >
                Copy Code
              </button>
              <pre className="whitespace-pre-wrap">{codeResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* 2. REGEX TESTER */}
      {toolId === "regex-tester" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <label className="block text-xs font-bold text-slate-500 mb-1">RegExp Pattern</label>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => {
                  setRegexPattern(e.target.value);
                  setRegexResult(testRegex(e.target.value, regexFlags, regexText));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-mono text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Flags</label>
              <input
                type="text"
                value={regexFlags}
                onChange={(e) => {
                  setRegexFlags(e.target.value);
                  setRegexResult(testRegex(regexPattern, e.target.value, regexText));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-mono text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Test String</label>
            <textarea
              rows={3}
              value={regexText}
              onChange={(e) => {
                setRegexText(e.target.value);
                setRegexResult(testRegex(regexPattern, regexFlags, e.target.value));
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs"
            />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-2">
            <div className="flex justify-between font-bold">
              <span>Matches Found: {regexResult.matches.length}</span>
              <span className={regexResult.isValid ? "text-emerald-500" : "text-rose-500"}>
                {regexResult.isValid ? "Valid Regex" : regexResult.error}
              </span>
            </div>
            <div className="space-y-1">
              {regexResult.matches.map((m, i) => (
                <div key={i} className="p-2 bg-white dark:bg-slate-800 rounded-lg border font-mono flex justify-between">
                  <span>Match #{i + 1}: &ldquo;{m.match}&rdquo;</span>
                  <span className="text-slate-400">Index: {m.index}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SECURE PIN & RANDOM KEY GENERATORS */}
      {(toolId === "secure-pin-generator" || toolId === "random-key-generator") && (
        <div className="space-y-4">
          {toolId === "secure-pin-generator" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-500">PIN Length:</label>
                {[4, 6, 8, 10].map((len) => (
                  <button
                    key={len}
                    onClick={() => {
                      setPinLength(len);
                      setPinResult(generateSecurePin(len));
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg ${pinLength === len ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-800"}`}
                  >
                    {len} Digits
                  </button>
                ))}
              </div>

              <div className="p-6 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Generated CSPRNG PIN</span>
                  <span className="font-mono text-3xl font-black text-emerald-400 tracking-widest">{pinResult}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPinResult(generateSecurePin(pinLength))}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(pinResult)}
                    className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Copy PIN
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                {(["api_key", "hex_256", "base64_256", "token_512"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setKeyType(k);
                      setKeyResult(generateRandomKeys(k));
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase ${keyType === k ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-800"}`}
                  >
                    {k.replace("_", " ")}
                  </button>
                ))}
              </div>

              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2">
                <span className="text-xs text-slate-400 block">{keyResult.format} ({keyResult.bits} bits)</span>
                <div className="font-mono text-xs text-cyan-300 break-all select-all p-3 bg-black/50 rounded-xl">
                  {keyResult.key}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setKeyResult(generateRandomKeys(keyType))}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(keyResult.key)}
                    className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Copy Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. WHATSAPP QR & BARCODE GENERATOR */}
      {toolId === "whatsapp-qr-generator" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number (with Country Code)</label>
              <input
                type="text"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Greeting Message</label>
              <input
                type="text"
                value={waMsg}
                onChange={(e) => setWaMsg(e.target.value)}
                placeholder="Pre-filled message..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              const dataUrl = await generateWhatsAppQR(waPhone, waMsg);
              setWaQrDataUrl(dataUrl);
            }}
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate WhatsApp Direct-Chat QR Code</span>
          </button>

          {waQrDataUrl && (
            <div className="p-6 bg-white rounded-2xl border flex flex-col items-center justify-center space-y-3">
              <img src={waQrDataUrl} alt="WhatsApp QR Code" className="w-56 h-56 rounded-lg shadow-sm" />
              <a
                href={waQrDataUrl}
                download="WhatsApp-QR-Toolify.png"
                className="bg-[#075E54] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR PNG</span>
              </a>
            </div>
          )}
        </div>
      )}

      {toolId === "barcode-generator" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={barcodeText}
              onChange={(e) => {
                setBarcodeText(e.target.value);
                setBarcodeDataUrl(generateBarcodeSVG(e.target.value, barcodeType).dataUrl);
              }}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold"
            />
            <button
              onClick={() => setBarcodeDataUrl(generateBarcodeSVG(barcodeText, barcodeType).dataUrl)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-5 py-2 rounded-xl"
            >
              Generate Barcode
            </button>
          </div>

          <div className="p-6 bg-white rounded-2xl border flex flex-col items-center justify-center space-y-3">
            <img src={barcodeDataUrl} alt="Generated Barcode" className="max-w-full h-24 object-contain" />
            <a
              href={barcodeDataUrl}
              download={`${barcodeText}.svg`}
              className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Barcode SVG</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
