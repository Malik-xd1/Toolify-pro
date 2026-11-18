import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Cookie, Settings, ShieldCheck, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy – ToolifyPro Cookie & Storage Disclosures",
  description:
    "Learn how ToolifyPro and third-party advertising partners use cookies and local storage, and how you can manage or opt out of tracking.",
  alternates: {
    canonical: "https://toolifypro.com/cookies",
  },
};

export default function CookiePolicyPage() {
  const lastUpdated = "November 18, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Cookie className="w-3.5 h-3.5" />
            <span>Storage & Tracking Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Cookie Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Last Updated: <strong>{lastUpdated}</strong> • Effective Date: January 1, 2025
          </p>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-[#0a122e] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-blue-900/40 shadow-sm text-xs sm:text-sm leading-relaxed space-y-8">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              1. What Are Cookies and Local Storage?
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Cookies are small text files placed on your computer or mobile device by websites you visit. They are widely used to make websites function efficiently, remember user preferences, and provide analytical insights.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              In addition to standard HTTP cookies, modern web applications utilize <code>localStorage</code>, <code>sessionStorage</code>, and <code>IndexedDB</code> to store application state directly inside your browser. ToolifyPro prioritizes client-side technologies to minimize server transmission.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              2. How ToolifyPro Uses Storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              ToolifyPro uses first-party client storage strictly for functional and performance purposes:
            </p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold">
                    <th className="py-2.5 pr-4">Storage Key / Cookie</th>
                    <th className="py-2.5 pr-4">Type</th>
                    <th className="py-2.5 pr-4">Purpose</th>
                    <th className="py-2.5">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="py-2.5 pr-4 font-mono">theme</td>
                    <td className="py-2.5 pr-4">localStorage</td>
                    <td className="py-2.5 pr-4">Remembers your preference for Light or Dark theme</td>
                    <td className="py-2.5">Persistent</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono">toolify_consent</td>
                    <td className="py-2.5 pr-4">localStorage</td>
                    <td className="py-2.5 pr-4">Stores your cookie consent selections</td>
                    <td className="py-2.5">12 months</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono">ToolifyVaultDB</td>
                    <td className="py-2.5 pr-4">IndexedDB</td>
                    <td className="py-2.5 pr-4">Stores locally encrypted files for File Locker users</td>
                    <td className="py-2.5">Until cleared</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              3. Third-Party Advertising Cookies (Google AdSense)
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              ToolifyPro displays advertisements provided by Google AdSense and its certified advertising partners to keep all platform utilities 100% free for users worldwide.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                Google and other third-party vendors use cookies to serve ads based on your prior visits to ToolifyPro or other websites across the web.
              </li>
              <li>
                These cookies allow ad networks to understand general browsing interests to display relevant, non-intrusive advertisements.
              </li>
              <li>
                In jurisdictions governed by the EU General Data Protection Regulation (GDPR) and the ePrivacy Directive, non-essential advertising cookies are only activated after you provide consent through our cookie preferences banner.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              4. How You Can Manage or Disable Cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              You possess complete control over cookies on your devices. You can adjust your preferences through several avenues:
            </p>
            <div className="space-y-3 mt-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <strong className="block text-slate-900 dark:text-white font-bold mb-1">
                  A. Browser Settings
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Most modern browsers allow you to block, restrict, or delete cookies via your browser settings:
                  Google Chrome (Settings &gt; Privacy & Security &gt; Cookies), Mozilla Firefox (Settings &gt; Privacy & Security), Apple Safari (Preferences &gt; Privacy), and Microsoft Edge (Settings &gt; Cookies and site permissions).
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <strong className="block text-slate-900 dark:text-white font-bold mb-1">
                  B. Google Ad Personalization Opt-Out
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  You can opt out of personalized advertisements from Google by visiting{" "}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">
                    Google Ads Settings
                  </a>.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <strong className="block text-slate-900 dark:text-white font-bold mb-1">
                  C. Industry-Wide Opt-Out Tools
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  You can opt out of participating advertising networks via the Digital Advertising Alliance at{" "}
                  <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">
                    aboutads.info
                  </a>{" "}
                  or the European Interactive Digital Advertising Alliance at{" "}
                  <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">
                    youronlinechoices.eu
                  </a>.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
              5. Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions regarding our Cookie Policy, please reach out to us at:
            </p>
            <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              Email: <strong>privacy@toolifypro.com</strong><br />
              Inquiry Form: <Link href="/contact" className="text-blue-600 dark:text-cyan-400 underline">https://toolifypro.com/contact</Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
