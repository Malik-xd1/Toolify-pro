"use client";

import React, { useState } from "react";
import {
  removeExtraSpaces,
  findAndReplace,
  checkGrammarAndStyle,
  checkSpelling,
  checkPlagiarismScore,
  calculateReadingTime,
  convertTextToSlug,
} from "@/utils/writingTextTools";
import { Copy, Check, Sparkles, CheckCircle2 } from "lucide-react";

interface TextWritingWorkbenchProps {
  toolId: string;
}

export default function TextWritingWorkbench({ toolId }: TextWritingWorkbenchProps) {
  const [inputText, setInputText] = useState(
    "YourTools provides high performance, 100% free digital utility tools for PDF conversion, image editing, and secure file processing."
  );
  const [copied, setCopied] = useState(false);

  // Find & Replace state
  const [searchTerm, setSearchTerm] = useState("tools");
  const [replaceTerm, setReplaceTerm] = useState("utilities");
  const [replaceResult, setReplaceResult] = useState(() => findAndReplace(inputText, "tools", "utilities"));

  // Slug State
  const [slugSep, setSlugSep] = useState<"-" | "_">("-");

  // Duplicate Lines State
  const [dedupCaseSensitive, setDedupCaseSensitive] = useState(false);
  const [dedupResult, setDedupResult] = useState<{ text: string; removed: number }>({ text: "", removed: 0 });

  // Comparer State
  const [diffTextA, setDiffTextA] = useState("ToolifyPro is a fast, free, client-side digital tools platform.");
  const [diffTextB, setDiffTextB] = useState("ToolifyPro is a secure, 100% free, private digital tools platform.");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readingStats = calculateReadingTime(inputText);
  const grammarStats = checkGrammarAndStyle(inputText);
  const spellStats = checkSpelling(inputText);
  const plagiarismStats = checkPlagiarismScore(inputText);

  return (
    <div className="w-full space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
          Input Text / Document Content
        </label>
        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setReplaceResult(findAndReplace(e.target.value, searchTerm, replaceTerm));
          }}
          placeholder="Paste or write your text here..."
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-xs font-medium outline-none focus:border-emerald-500 leading-relaxed"
        />
      </div>

      {/* 1. WORD & READING TIME STATS */}
      {(toolId === "word-counter" || toolId === "character-counter" || toolId === "reading-time-calculator") && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{readingStats.words}</span>
            <span className="block text-xs text-slate-500 mt-0.5">Words</span>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{inputText.length}</span>
            <span className="block text-xs text-slate-500 mt-0.5">Characters</span>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{readingStats.readingTimeMinutes} min</span>
            <span className="block text-xs text-slate-500 mt-0.5">Reading Pace</span>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{readingStats.fleschScore}</span>
            <span className="block text-xs text-slate-500 mt-0.5">Readability Score</span>
          </div>
        </div>
      )}

      {/* 2. REMOVE EXTRA SPACES */}
      {toolId === "remove-extra-spaces" && (
        <div className="space-y-3">
          <button
            onClick={() => setInputText(removeExtraSpaces(inputText))}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Clean Whitespace & Extra Spaces</span>
          </button>
        </div>
      )}

      {/* 3. FIND & REPLACE */}
      {toolId === "find-and-replace" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Find</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setReplaceResult(findAndReplace(inputText, e.target.value, replaceTerm));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Replace With</label>
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => {
                  setReplaceTerm(e.target.value);
                  setReplaceResult(findAndReplace(inputText, searchTerm, e.target.value));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl relative">
            <span className="text-xs text-slate-400 block mb-2">Replaced {replaceResult.count} occurrence(s):</span>
            <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{replaceResult.result}</p>
            <button
              onClick={() => handleCopy(replaceResult.result)}
              className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* 4. GRAMMAR & SPELL CHECK */}
      {(toolId === "grammar-checker" || toolId === "spell-checker") && (
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs uppercase font-extrabold text-slate-500">Grammar & Style Health</span>
            <span className="text-xl font-black text-emerald-500">{grammarStats.score} / 100</span>
          </div>

          {grammarStats.issues.length === 0 ? (
            <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 py-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>No major grammatical or style issues detected.</span>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {grammarStats.issues.map((iss, i) => (
                <div key={i} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border flex justify-between">
                  <span>&ldquo;{iss.word}&rdquo; – {iss.message}</span>
                  <span className="font-bold text-emerald-500">Suggestion: {iss.suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. PLAGIARISM CHECKER */}
      {toolId === "plagiarism-checker" && (
        <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl text-center space-y-2">
          <span className="text-xs uppercase font-bold text-slate-500">Originality & Uniqueness Index</span>
          <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{plagiarismStats.originalityScore}% Unique</div>
          <p className="text-xs text-slate-500">
            N-gram uniqueness score based on lexical phrase diversity ({plagiarismStats.wordCount} words analyzed).
          </p>
        </div>
      )}

      {/* 6. SLUG CONVERTER */}
      {toolId === "text-to-slug-converter" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Separator:</label>
            <button
              onClick={() => setSlugSep("-")}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${slugSep === "-" ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-800"}`}
            >
              Hyphen (-)
            </button>
            <button
              onClick={() => setSlugSep("_")}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${slugSep === "_" ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-800"}`}
            >
              Underscore (_)
            </button>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border flex items-center justify-between font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold select-all">
            <span>{convertTextToSlug(inputText, slugSep)}</span>
            <button
              onClick={() => handleCopy(convertTextToSlug(inputText, slugSep))}
              className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-sans font-bold"
            >
              Copy Slug
            </button>
          </div>
        </div>
      )}

      {/* 7. CASE CONVERTER */}
      {toolId === "case-converter" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "UPPERCASE", fn: () => setInputText(inputText.toUpperCase()) },
              { label: "lowercase", fn: () => setInputText(inputText.toLowerCase()) },
              {
                label: "Title Case",
                fn: () =>
                  setInputText(
                    inputText
                      .toLowerCase()
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")
                  ),
              },
              {
                label: "Sentence case",
                fn: () =>
                  setInputText(
                    inputText
                      .toLowerCase()
                      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
                  ),
              },
              {
                label: "camelCase",
                fn: () =>
                  setInputText(
                    inputText
                      .toLowerCase()
                      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
                  ),
              },
              {
                label: "snake_case",
                fn: () =>
                  setInputText(
                    inputText
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "")
                  ),
              },
              {
                label: "kebab-case",
                fn: () =>
                  setInputText(
                    inputText
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                  ),
              },
              {
                label: "CONSTANT_CASE",
                fn: () =>
                  setInputText(
                    inputText
                      .toUpperCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^A-Z0-9_]/g, "")
                  ),
              },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.fn}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-cyan-400 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleCopy(inputText)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Converted Text</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. REMOVE DUPLICATE LINES */}
      {(toolId === "remove-duplicate-lines" || toolId === "remove-duplicates") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={dedupCaseSensitive}
                onChange={(e) => setDedupCaseSensitive(e.target.checked)}
                className="rounded"
              />
              <span>Case Sensitive Matching</span>
            </label>
            <button
              onClick={() => {
                const lines = inputText.split("\n");
                const seen = new Set<string>();
                const unique: string[] = [];
                for (const l of lines) {
                  const key = dedupCaseSensitive ? l.trim() : l.trim().toLowerCase();
                  if (!seen.has(key) && l.trim().length > 0) {
                    seen.add(key);
                    unique.push(l.trim());
                  }
                }
                const res = unique.join("\n");
                setDedupResult({ text: res, removed: lines.length - unique.length });
                setInputText(res);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deduplicate Lines</span>
            </button>
          </div>

          {dedupResult.removed > 0 && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Successfully removed {dedupResult.removed} duplicate line(s)!</span>
            </div>
          )}
        </div>
      )}

      {/* 9. TEXT COMPARER */}
      {(toolId === "text-comparer" || toolId === "text-diff") && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Original Text (A)</label>
              <textarea
                rows={5}
                value={diffTextA}
                onChange={(e) => setDiffTextA(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Modified Text (B)</label>
              <textarea
                rows={5}
                value={diffTextB}
                onChange={(e) => setDiffTextB(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <span className="text-xs uppercase font-extrabold text-slate-500 block">Diff Analysis & Token Changes</span>
            <div className="text-xs font-mono leading-relaxed p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-x-1.5 flex flex-wrap">
              {diffTextB.split(/\s+/).map((word, i) => {
                const wordsA = diffTextA.split(/\s+/);
                const isNew = !wordsA.includes(word);
                return (
                  <span
                    key={i}
                    className={
                      isNew
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded"
                        : "text-slate-800 dark:text-slate-200"
                    }
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
