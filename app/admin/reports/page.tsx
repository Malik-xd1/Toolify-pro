"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Mail,
  Clock,
  Tag,
  ChevronRight,
  Lock,
  ArrowLeft,
  AlertCircle,
  Inbox,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Report {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

export default function AdminReportsPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem("toolify_admin_key");
    if (savedKey) {
      setPasscode(savedKey);
      fetchReports(savedKey);
    }
  }, []);

  const fetchReports = async (keyToUse: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/contact?key=${encodeURIComponent(keyToUse)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsAuthenticated(false);
        setError(data.error || "Incorrect admin passcode. Access denied.");
        sessionStorage.removeItem("toolify_admin_key");
      } else {
        setIsAuthenticated(true);
        setReports(data.reports || []);
        sessionStorage.setItem("toolify_admin_key", keyToUse);
      }
    } catch {
      setError("Failed to connect to the server. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter the admin passcode.");
      return;
    }
    fetchReports(passcode.trim());
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete report ${id}?`)) return;
    try {
      const res = await fetch(
        `/api/contact?key=${encodeURIComponent(passcode)}&id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(data.error || "Failed to delete report");
      }
    } catch {
      alert("Error contacting server to delete report");
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredReports = reports.filter((r) => {
    const matchesCategory =
      selectedCategory === "all" || r.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.id.toLowerCase().includes(query) ||
      r.name.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query) ||
      r.subject.toLowerCase().includes(query) ||
      r.message.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6"
        >
          <Link href="/" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Admin Reports Dashboard
          </span>
        </nav>

        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div className="max-w-md mx-auto my-12 bg-white dark:bg-[#0a122e] rounded-3xl p-8 border border-slate-200 dark:border-blue-900/40 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Enter your admin passcode to view submitted bug reports, user feedback, and contact inquiries.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Admin Passcode (Default: toolifyadmin)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-blue-900/60 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Unlock Dashboard"}
              </button>
            </form>
            <p className="mt-4 text-[11px] text-slate-400">
              Default passcode is <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-cyan-400 font-mono">toolifyadmin</code> (customize via <code className="font-mono">ADMIN_SECRET</code> in environment).
            </p>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Submitted Reports & Inquiries
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Total logged submissions: <strong className="text-blue-600 dark:text-cyan-400">{reports.length}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchReports(passcode)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-blue-900 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    sessionStorage.removeItem("toolify_admin_key");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-[#0a122e] rounded-2xl p-4 mb-6 border border-slate-200 dark:border-blue-900/40 shadow-sm flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Ticket ID (e.g. TICK-MWMK19NH), Name, Email or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-blue-900/60 bg-slate-50 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                {["all", "bug", "feature", "general", "business"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions List */}
            {filteredReports.length === 0 ? (
              <div className="bg-white dark:bg-[#0a122e] rounded-3xl p-12 text-center border border-slate-200 dark:border-blue-900/40 shadow-sm my-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                  No Submissions Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {searchTerm || selectedCategory !== "all"
                    ? "No reports match your current filter or search criteria."
                    : "No problem reports or contact inquiries have been submitted yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white dark:bg-[#0a122e] rounded-2xl p-5 border border-slate-200 dark:border-blue-900/40 shadow-sm hover:border-blue-400 dark:hover:border-blue-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-blue-900/30">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 px-2.5 py-1 rounded-lg">
                          {report.id}
                        </span>
                        <button
                          onClick={() => handleCopyId(report.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                          title="Copy Ticket Reference"
                        >
                          {copiedId === report.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            report.category === "bug"
                              ? "bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400"
                              : report.category === "feature"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400"
                          }`}
                        >
                          {report.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {report.subject}
                        </h4>
                        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <span className="font-semibold">{report.name}</span>
                          <span>&bull;</span>
                          <a
                            href={`mailto:${report.email}`}
                            className="text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            {report.email}
                          </a>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-blue-900/20 text-xs text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                        {report.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
