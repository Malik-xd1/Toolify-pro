import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms and Conditions – ToolifyPro Terms of Service",
  description:
    "Terms and Conditions governing the use of ToolifyPro's digital tools, file conversion utilities, calculators, and services.",
  alternates: {
    canonical: "https://toolifypro.com/terms",
  },
};

export default function TermsPage() {
  const lastUpdated = "November 18, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Terms and Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Last Updated: <strong>{lastUpdated}</strong> • Effective Date: January 1, 2025
          </p>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-[#0a122e] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-blue-900/40 shadow-sm text-xs sm:text-sm leading-relaxed space-y-8">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              By accessing, browsing, or utilizing any of the web-based utilities, converters, editors, calculators, or software interfaces available on <strong>ToolifyPro</strong> (accessible via <code>https://toolifypro.com</code>), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions (&quot;Terms&quot;) and our associated <Link href="/privacy" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Privacy Policy</Link>. If you do not agree with any portion of these Terms, you must discontinue your use of our services immediately.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              2. Permitted and Acceptable Use
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              ToolifyPro grants you a personal, non-exclusive, non-transferable, revocable license to utilize our tools for lawful personal, academic, and business productivity purposes. When using our Platform, you agree that you will NOT:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>Upload, process, or distribute files that contain malware, ransomware, viruses, or malicious code designed to disrupt client or server systems.</li>
              <li>Process content that infringes upon the copyright, trademark, privacy, or proprietary rights of any third party without explicit legal authorization.</li>
              <li>Attempt to reverse-engineer, decompile, scrape, or overwhelm our web infrastructure using automated scrapers, denial-of-service tools, or botnets.</li>
              <li>Bypass, alter, or disable any security features, cryptographic verifiers, or rate-limiting protocols deployed on the Platform.</li>
              <li>Use the Platform for any unlawful, defamatory, fraudulent, or harmful activities under applicable international, federal, or state laws.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              3. User Responsibilities & File Security
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Because ToolifyPro executes document operations client-side inside your browser sandbox:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>You retain 100% ownership and intellectual property rights over all files, text, images, and documents you process through our tools. We claim zero ownership or rights over your content.</li>
              <li>You are solely responsible for maintaining backups of your original documents prior to performing file conversions, compressions, or modifications.</li>
              <li>If you utilize the anonymous File Locker, you are solely responsible for securely storing your 12-word recovery key and master password. Since cryptographic keys are derived client-side, we cannot recover encrypted files if you lose your credentials.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              4. Disclaimer of Warranties
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              The services, tools, converters, calculators, and information on ToolifyPro are provided strictly on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis, without warranties of any kind, whether express, implied, statutory, or otherwise. ToolifyPro expressly disclaims all warranties, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              We do not guarantee that file conversions will be 100% loss-free or that complex formatting will render identically across disparate third-party office suites.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              5. Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              To the fullest extent permitted by applicable law, in no event shall ToolifyPro, its developers, operators, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages—including but not limited to loss of data, loss of profits, business interruption, or device failure—arising from or in connection with your use of, or inability to use, any tools or features provided on the Platform.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              6. Third-Party Services and Advertisements
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Our website may display advertisements served by third-party advertising networks (including Google AdSense) or link to external web resources. ToolifyPro does not endorse, control, or assume responsibility for the content, privacy policies, products, or practices of any third-party websites or services linked to from our platform.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
              7. Service Modifications and Updates
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We reserve the right to modify, expand, suspend, or discontinue any individual tool, feature, or service at any time without prior notice. We may also revise these Terms periodically. Your continued use of ToolifyPro following the posting of updated Terms constitutes your binding acceptance of the revisions.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
              8. Contact Information
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions or require clarification regarding these Terms and Conditions, please submit your inquiry to:
            </p>
            <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              Email: <strong>legal@toolifypro.com</strong> or <strong>support@toolifypro.com</strong><br />
              Inquiry Form: <Link href="/contact" className="text-blue-600 dark:text-cyan-400 underline">https://toolifypro.com/contact</Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
