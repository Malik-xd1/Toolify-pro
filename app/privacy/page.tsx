import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Shield, Lock, FileCheck, Eye, HardDrive, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy – ToolifyPro Data Handling & Privacy Disclosures",
  description:
    "Comprehensive Privacy Policy for ToolifyPro. Learn about our client-side processing architecture, zero-retention policies, cookie usage, Google AdSense disclosures, and user rights under GDPR and CCPA.",
  alternates: {
    canonical: "https://toolifypro.com/privacy",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 18, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Transparency & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Last Updated: <strong>{lastUpdated}</strong> • Effective Date: January 1, 2025
          </p>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-[#0a122e] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-blue-900/40 shadow-sm text-xs sm:text-sm leading-relaxed space-y-8">
          {/* Section 1: Introduction */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              1. Introduction & Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Welcome to <strong>ToolifyPro</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We operate the digital utility website located at <code>https://toolifypro.com</code> (the &quot;Platform&quot;). ToolifyPro is built upon a fundamental architectural commitment: <strong>privacy by default</strong>. 
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              This Privacy Policy explains what information is processed when you use our website, how your browser processes digital files, how third-party advertising partners (such as Google AdSense) use cookies, and the privacy rights you retain under global data protection frameworks, including the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
            </p>
          </div>

          {/* Section 2: In-Browser Client-Side Processing */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <span>2. Local Browser-Side Processing Architecture</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Unlike traditional file conversion services that upload your personal documents to remote cloud servers, <strong>ToolifyPro operates predominantly client-side</strong>:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>
                <strong>PDF Tools</strong> (Merge, Split, Rotate, Compress, Password Protect, Sign): Executed directly inside your browser memory using WebAssembly and client-side JavaScript (via <code>pdf-lib</code>).
              </li>
              <li>
                <strong>Image Tools</strong> (Compress, Resize, Crop, WebP/JPG/PNG conversion, Background Remover, Passport Photo): Processed locally using the HTML5 Canvas API and Web Workers.
              </li>
              <li>
                <strong>Video & Audio Tools</strong> (Trimming, Frame Capture, Audio Merger, Waveform Synthesis): Processed locally via the browser Web Audio API and HTML5 Media interfaces.
              </li>
              <li>
                <strong>Calculators & Developer Tools</strong> (Formatting, Minifying, Base64, Regex, Financial Equations): Executed instantly within your local browser JavaScript engine.
              </li>
              <li>
                <strong>Anonymous File Locker</strong>: Files stored in your locker are encrypted on your device using 256-bit AES-GCM encryption before being committed to your browser&apos;s isolated <code>IndexedDB</code> sandbox.
              </li>
            </ul>
            <div className="mt-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Your private documents and media files are never transferred to or permanently stored on our servers.</span>
            </div>
          </div>

          {/* Section 3: Information We Collect */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              3. Information We Collect Automatically
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              When you browse our Platform, standard internet telemetry may be logged by our content delivery network (CDN) and hosting infrastructure for security, caching, and operational integrity:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-300">
              <li>IP address (anonymized for analytical reports)</li>
              <li>Browser type, version, and device operating system</li>
              <li>Referring website URLs and search queries</li>
              <li>Timestamp, request latency, and HTTP response status codes</li>
            </ul>
          </div>

          {/* Section 4: Cookies & Local Storage */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              4. Cookies and Local Browser Storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We utilize minimal client storage mechanisms necessary for application functionality:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-300">
              <li>
                <strong>Theme Preference:</strong> We store a simple key (<code>theme: &quot;light&quot;</code> or <code>theme: &quot;dark&quot;</code>) in your browser&apos;s <code>localStorage</code> to maintain your selected display mode.
              </li>
              <li>
                <strong>Cookie Consent Choice:</strong> Stored in <code>localStorage</code> so you are not repeatedly prompted on subsequent page visits.
              </li>
              <li>
                <strong>File Locker Storage:</strong> Encrypted blobs and key tokens stored locally in <code>IndexedDB</code> if you choose to utilize the File Locker utility.
              </li>
            </ul>
          </div>

          {/* Section 5: Google AdSense and Third-Party Advertising */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              5. Google AdSense & Advertising Disclosures
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              ToolifyPro partners with third-party advertising vendors, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites across the internet.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting Google&apos;s <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Ads Settings</a>.
              </li>
              <li>
                Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">www.aboutads.info</a>.
              </li>
            </ul>
          </div>

          {/* Section 6: User Rights (GDPR & CCPA) */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              6. Your Data Protection Rights
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Depending on your jurisdiction, you possess specific statutory rights regarding personal data:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-600 dark:text-slate-300">
              <li><strong>Right to Access:</strong> Request confirmation of what personal information, if any, is maintained.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request deletion of submitted contact details.</li>
              <li><strong>Right to Object & Restrict Processing:</strong> Restrict how non-essential cookies and analytics are applied.</li>
              <li><strong>Do Not Sell My Personal Information (CCPA/CPRA):</strong> ToolifyPro does not sell, rent, or trade your personal information to third parties.</li>
            </ul>
          </div>

          {/* Section 7: Contact Us */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
              7. Privacy Contact & Inquiries
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our client-side processing practices, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              Email: <strong>privacy@toolifypro.com</strong> or <strong>support@toolifypro.com</strong><br />
              Website: <Link href="/contact" className="text-blue-600 dark:text-cyan-400 underline">https://toolifypro.com/contact</Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
