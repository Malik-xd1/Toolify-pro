"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Bug,
  Cpu,
  Monitor,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ReportProblemPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "broken_tool",
    toolName: "",
    browser: "",
    operatingSystem: "",
    description: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const [ticketId, setTicketId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setResponseMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: `[Bug Report: ${formData.toolName || "General"}] - ${formData.issueType}`,
        category: "bug",
        message: `Issue Type: ${formData.issueType}\nAffected Tool: ${formData.toolName}\nBrowser: ${formData.browser}\nOS: ${formData.operatingSystem}\n\nDescription:\n${formData.description}`,
        honeypot: formData.honeypot,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setResponseMessage(data.error || "Failed to submit problem report. Please try again.");
      } else {
        setStatus("success");
        setResponseMessage(data.message || "Thank you! Your bug report has been received.");
        setTicketId(data.ticketId || "");
        setFormData({
          name: "",
          email: "",
          issueType: "broken_tool",
          toolName: "",
          browser: "",
          operatingSystem: "",
          description: "",
          honeypot: "",
        });
      }
    } catch (_) {
      setStatus("error");
      setResponseMessage("Network connection error. Please verify your connection or email support@toolifypro.com.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6"
        >
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Report a Problem
          </span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 border border-red-200 dark:border-red-800">
            <Bug className="w-3.5 h-3.5" />
            <span>Bug & Quality Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Report a Problem
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Did a tool fail to execute, yield unexpected results, or crash in your browser? Help us fix it. Our engineering team reviews all technical reports directly.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#0a122e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-blue-900/40 shadow-sm">
          {status === "success" ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Report Logged Successfully</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                {responseMessage}
              </p>
              {ticketId && (
                <div className="inline-block p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-blue-600 dark:text-cyan-400">
                  Tracking Reference: {ticketId}
                </div>
              )}
              <div className="pt-4">
                <button
                  onClick={() => setStatus("idle")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{responseMessage}</span>
                </div>
              )}

              {/* Honeypot anti-spam field */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Smith"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com (for status updates)"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Issue Classification *
                  </label>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="broken_tool">Tool Execution Error / Crash</option>
                    <option value="wrong_output">Incorrect Calculation or Output</option>
                    <option value="ui_glitch">Layout / Mobile Display Glitch</option>
                    <option value="performance">Browser Freezing or Slow Processing</option>
                    <option value="feature_request">Feature Request / Enhancement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Affected Tool Name or URL *
                  </label>
                  <input
                    type="text"
                    name="toolName"
                    required
                    value={formData.toolName}
                    onChange={handleChange}
                    placeholder="e.g. PDF Compressor, Age Calculator"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Web Browser
                  </label>
                  <input
                    type="text"
                    name="browser"
                    value={formData.browser}
                    onChange={handleChange}
                    placeholder="e.g. Chrome 128, Safari iOS, Firefox"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Operating System
                  </label>
                  <input
                    type="text"
                    name="operatingSystem"
                    value={formData.operatingSystem}
                    onChange={handleChange}
                    placeholder="e.g. Windows 11, macOS, Android 14"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Description of the Problem *
                </label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe what happened: What file format were you processing? What error message appeared? What were the expected vs. actual results?"
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-red-600/30 disabled:opacity-50 cursor-pointer"
              >
                {status === "submitting" ? (
                  <>Logging Report...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Technical Report</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
