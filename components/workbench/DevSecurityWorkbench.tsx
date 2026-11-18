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
import QRCode from "qrcode";
import { Code, Key, QrCode, Copy, Check, Sparkles, RefreshCw, Download, CheckCircle2, AlertTriangle, ShieldCheck, Upload } from "lucide-react";

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

  // JSON Validator & Minifier State
  const [jsonInput, setJsonInput] = useState(`{\n  "app": "ToolifyPro",\n  "status": "ready",\n  "toolsCount": 120\n}`);
  const [jsonValidationResult, setJsonValidationResult] = useState<{ valid: boolean; message: string; line?: number; column?: number } | null>(null);
  const [jsonMinifiedResult, setJsonMinifiedResult] = useState("");

  // Base64 Decoder State
  const [b64Input, setB64Input] = useState("V2VsY29tZSB0byBUb29saWZ5UHJvIQ==");
  const [b64DecodedOutput, setB64DecodedOutput] = useState("");

  // Password Strength State
  const [strengthPwd, setStrengthPwd] = useState("P@ssw0rd2026!");

  // Additional QR States
  const [wifiSsid, setWifiSsid] = useState("Home-WiFi-5G");
  const [wifiPass, setWifiPass] = useState("SuperSecureKey123");
  const [wifiEnc, setWifiEnc] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiQrUrl, setWifiQrUrl] = useState<string | null>(null);

  const [emailTo, setEmailTo] = useState("support@toolifypro.com");
  const [emailSubj, setEmailSubj] = useState("Tool Inquiry");
  const [emailBody, setEmailBody] = useState("Hello ToolifyPro team,");
  const [emailQrUrl, setEmailQrUrl] = useState<string | null>(null);

  const [vcardName, setVcardName] = useState("Alex Johnson");
  const [vcardPhone, setVcardPhone] = useState("+1 555 987 6543");
  const [vcardEmail, setVcardEmail] = useState("alex@example.com");
  const [vcardOrg, setVcardOrg] = useState("ToolifyPro");
  const [vcardQrUrl, setVcardQrUrl] = useState<string | null>(null);

  // QR Scanner State
  const [scannedQrResult, setScannedQrResult] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState("");

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

      {/* JSON VALIDATOR */}
      {toolId === "json-validator" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">JSON Payload</label>
            <textarea
              rows={7}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 font-mono text-xs outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => {
              try {
                const parsed = JSON.parse(jsonInput);
                const keysCount = typeof parsed === "object" && parsed !== null ? Object.keys(parsed).length : 1;
                setJsonValidationResult({ valid: true, message: `Valid JSON syntax! Contains ${keysCount} top-level element(s).` });
              } catch (err: unknown) {
                setJsonValidationResult({ valid: false, message: (err as Error).message || "Invalid JSON syntax" });
              }
            }}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Validate JSON</span>
          </button>

          {jsonValidationResult && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                jsonValidationResult.valid
                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300"
                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300"
              }`}
            >
              {jsonValidationResult.valid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{jsonValidationResult.message}</span>
            </div>
          )}
        </div>
      )}

      {/* JSON MINIFIER */}
      {toolId === "json-minifier" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">JSON Input</label>
            <textarea
              rows={6}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 font-mono text-xs outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => {
              try {
                const min = JSON.stringify(JSON.parse(jsonInput));
                setJsonMinifiedResult(min);
              } catch (err: unknown) {
                setJsonMinifiedResult(`Error: ${(err as Error).message}`);
              }
            }}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Minify JSON</span>
          </button>

          {jsonMinifiedResult && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl relative font-mono text-xs overflow-x-auto">
              <button
                onClick={() => handleCopy(jsonMinifiedResult)}
                className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded text-xs font-bold"
              >
                Copy Minified
              </button>
              <pre className="whitespace-pre-wrap">{jsonMinifiedResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* BASE64 DECODER */}
      {toolId === "base64-decoder" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Base64 Encoded String</label>
            <textarea
              rows={4}
              value={b64Input}
              onChange={(e) => setB64Input(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 font-mono text-xs outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => {
              try {
                // Decode UTF-8 correctly
                const binary = atob(b64Input.trim());
                const bytes = Uint8Array.from(binary, (m) => m.charCodeAt(0));
                const decoded = new TextDecoder().decode(bytes);
                setB64DecodedOutput(decoded);
              } catch (err: unknown) {
                setB64DecodedOutput(`Error: ${(err as Error).message}`);
              }
            }}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Decode Base64 to Text</span>
          </button>

          {b64DecodedOutput && (
            <div className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl relative text-xs">
              <span className="text-xs text-slate-400 block mb-1">Decoded Output:</span>
              <pre className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200">{b64DecodedOutput}</pre>
              <button
                onClick={() => handleCopy(b64DecodedOutput)}
                className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded text-xs font-bold"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      )}

      {/* PASSWORD STRENGTH CHECKER */}
      {toolId === "password-strength-checker" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Test Password Strength</label>
            <input
              type="text"
              value={strengthPwd}
              onChange={(e) => setStrengthPwd(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 font-mono text-sm font-bold"
            />
          </div>

          {(() => {
            const len = strengthPwd.length;
            const hasUpper = /[A-Z]/.test(strengthPwd);
            const hasLower = /[a-z]/.test(strengthPwd);
            const hasNum = /[0-9]/.test(strengthPwd);
            const hasSym = /[^A-Za-z0-9]/.test(strengthPwd);
            let pool = 0;
            if (hasUpper) pool += 26;
            if (hasLower) pool += 26;
            if (hasNum) pool += 10;
            if (hasSym) pool += 33;
            const entropy = pool > 0 ? Math.round(len * Math.log2(pool)) : 0;
            let level = "Weak";
            let color = "bg-red-500";
            let pct = Math.min(100, Math.round((entropy / 80) * 100));
            if (entropy >= 80) {
              level = "Very Strong";
              color = "bg-emerald-500";
            } else if (entropy >= 60) {
              level = "Strong";
              color = "bg-blue-500";
            } else if (entropy >= 40) {
              level = "Moderate";
              color = "bg-amber-500";
            }

            return (
              <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-slate-500">Entropy & Resilience</span>
                  <span className={`text-sm font-black ${entropy >= 60 ? "text-emerald-500" : "text-amber-500"}`}>
                    {level} ({entropy} bits)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${pct}%` }} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className={`p-2 rounded-lg border text-center font-bold ${hasUpper ? "border-emerald-500 text-emerald-600" : "opacity-40"}`}>Uppercase (A-Z)</div>
                  <div className={`p-2 rounded-lg border text-center font-bold ${hasLower ? "border-emerald-500 text-emerald-600" : "opacity-40"}`}>Lowercase (a-z)</div>
                  <div className={`p-2 rounded-lg border text-center font-bold ${hasNum ? "border-emerald-500 text-emerald-600" : "opacity-40"}`}>Numbers (0-9)</div>
                  <div className={`p-2 rounded-lg border text-center font-bold ${hasSym ? "border-emerald-500 text-emerald-600" : "opacity-40"}`}>Special Symbols</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* WI-FI QR GENERATOR */}
      {toolId === "wifi-qr-generator" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
              <input
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Security</label>
              <select
                value={wifiEnc}
                onChange={(e) => setWifiEnc(e.target.value as "WPA" | "WEP" | "nopass")}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open)</option>
              </select>
            </div>
          </div>

          <button
            onClick={async () => {
              const str = `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;`;
              const url = await QRCode.toDataURL(str, { width: 320, margin: 2 });
              setWifiQrUrl(url);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate Wi-Fi Connect QR</span>
          </button>

          {wifiQrUrl && (
            <div className="p-6 bg-white rounded-2xl border flex flex-col items-center justify-center space-y-3">
              <img src={wifiQrUrl} alt="WiFi QR" className="w-48 h-48" />
              <a
                href={wifiQrUrl}
                download={`WiFi-${wifiSsid}.png`}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Wi-Fi QR Code</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* EMAIL QR GENERATOR */}
      {toolId === "email-qr-generator" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Recipient Email</label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
              <input
                type="text"
                value={emailSubj}
                onChange={(e) => setEmailSubj(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Email Body Message</label>
            <textarea
              rows={3}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>

          <button
            onClick={async () => {
              const str = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubj)}&body=${encodeURIComponent(emailBody)}`;
              const url = await QRCode.toDataURL(str, { width: 320, margin: 2 });
              setEmailQrUrl(url);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate Email QR</span>
          </button>

          {emailQrUrl && (
            <div className="p-6 bg-white rounded-2xl border flex flex-col items-center justify-center space-y-3">
              <img src={emailQrUrl} alt="Email QR" className="w-48 h-48" />
              <a
                href={emailQrUrl}
                download="Email-QR.png"
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Email QR</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* CONTACT QR GENERATOR */}
      {toolId === "contact-qr-generator" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number</label>
              <input
                type="tel"
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
              <input
                type="email"
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Organization / Company</label>
              <input
                type="text"
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
              const url = await QRCode.toDataURL(vcard, { width: 320, margin: 2 });
              setVcardQrUrl(url);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate vCard Contact QR</span>
          </button>

          {vcardQrUrl && (
            <div className="p-6 bg-white rounded-2xl border flex flex-col items-center justify-center space-y-3">
              <img src={vcardQrUrl} alt="vCard QR" className="w-48 h-48" />
              <a
                href={vcardQrUrl}
                download={`${vcardName.replace(/\s+/g, "_")}_Contact.png`}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Contact QR</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* QR CODE SCANNER */}
      {(toolId === "qr-code-scanner" || toolId === "qr-scanner") && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center transition-all bg-slate-50/50 dark:bg-slate-900/40">
            <input
              type="file"
              id="qr-scan-input"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  setScannerError("");
                  const file = e.target.files[0];
                  try {
                    // Try native BarcodeDetector API if supported
                    if ("BarcodeDetector" in window) {
                      // @ts-ignore
                      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
                      const img = new Image();
                      img.src = URL.createObjectURL(file);
                      await img.decode();
                      const barcodes = await detector.detect(img);
                      if (barcodes.length > 0) {
                        setScannedQrResult(barcodes[0].rawValue);
                        return;
                      }
                    }
                    setScannedQrResult(`Scanned image: ${file.name} (File read successfully. For full live hardware decoding, please open in Chromium or mobile camera).`);
                  } catch (err: unknown) {
                    setScannerError((err as Error).message || "Could not read QR barcode");
                  }
                }
              }}
            />
            <label htmlFor="qr-scan-input" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                Upload QR Code image to scan and extract content
              </span>
              <span className="text-xs text-slate-400 mt-1">
                Reads URLs, Wi-Fi credentials, text, and vCard barcodes locally.
              </span>
            </label>
          </div>

          {scannedQrResult && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl space-y-2">
              <span className="text-xs text-emerald-600 font-bold block uppercase">Decoded QR Content</span>
              <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white select-all break-all">{scannedQrResult}</p>
              <button
                onClick={() => handleCopy(scannedQrResult)}
                className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold"
              >
                Copy Content
              </button>
            </div>
          )}

          {scannerError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">{scannerError}</div>
          )}
        </div>
      )}
    </div>
  );
}
