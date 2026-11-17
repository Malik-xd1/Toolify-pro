"use client";

import React, { useState } from "react";
import {
  convertPdfToExcelData,
  reorderPdfPages,
  signPdfDocument,
} from "@/utils/pdfExtraTools";
import {
  removeImageBackground,
  changeImageBackground,
  upscaleImage,
  createPassportPhotoSheet,
} from "@/utils/imageExtraTools";
import {
  mergeAudioFiles,
  compressAudioFile,
  createVideoThumbnailWithBanner,
} from "@/utils/audioVideoExtraTools";
import { stripImageMetadata } from "@/utils/securityExtraTools";
import { downloadBlob } from "@/utils/pdfTools";
import { Upload, Download, Sparkles, CheckCircle2, FileText, Image as ImageIcon } from "lucide-react";

interface MediaFileWorkbenchProps {
  toolId: string;
}

export default function MediaFileWorkbench({ toolId }: MediaFileWorkbenchProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Options
  const [pageOrderStr, setPageOrderStr] = useState("3,1,2");
  const [bannerText, setBannerText] = useState("TOOLIFY PREVIEW");
  const [bgColorHex, setBgColorHex] = useState("#3B82F6");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setErrorMsg("");
      setResultBlob(null);
      setResultUrl(null);
    }
  };

  const handleExecute = async () => {
    if (files.length === 0) {
      setErrorMsg("Please select a file first");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      if (toolId === "pdf-to-excel") {
        const { csvString } = await convertPdfToExcelData(files[0]);
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName(`${files[0].name.replace(/\.pdf$/i, "")}-Extracted.csv`);
      } else if (toolId === "pdf-page-reorder") {
        const indices = pageOrderStr.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
        const bytes = await reorderPdfPages(files[0], indices);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("Reordered-Document.pdf");
      } else if (toolId === "image-background-remover") {
        const blob = await removeImageBackground(files[0]);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("Transparent-Background.png");
      } else if (toolId === "image-background-changer") {
        const blob = await changeImageBackground(files[0], bgColorHex);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("New-Background.jpg");
      } else if (toolId === "image-upscaler") {
        const blob = await upscaleImage(files[0], 2);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("Upscaled-2X-Photo.png");
      } else if (toolId === "passport-photo-maker") {
        const blob = await createPassportPhotoSheet(files[0], "US_2x2");
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("Passport-Photos-Sheet-4x6.jpg");
      } else if (toolId === "audio-merger" || toolId === "video-merger") {
        const blob = await mergeAudioFiles(files);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("Merged-Audio-Stream.wav");
      } else if (toolId === "audio-compressor") {
        const blob = await compressAudioFile(files[0]);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("Compressed-Audio.wav");
      } else if (toolId === "video-thumbnail-maker") {
        const blob = await createVideoThumbnailWithBanner(files[0], bannerText);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("Custom-Video-Thumbnail.jpg");
      } else if (toolId === "metadata-cleaner") {
        const blob = await stripImageMetadata(files[0]);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultName("Scrubbed-Clean-Metadata.jpg");
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* File Dropzone */}
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center transition-all bg-slate-50/50 dark:bg-slate-900/40">
        <input
          type="file"
          id="media-file-input"
          onChange={handleFileChange}
          multiple={toolId === "audio-merger" || toolId === "video-merger"}
          className="hidden"
        />
        <label htmlFor="media-file-input" className="cursor-pointer flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-3 shadow-inner">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-white">
            Click to upload or drag and drop files here
          </span>
          <span className="text-xs text-slate-400 mt-1">
            All processing is 100% private and performed directly in your browser.
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs flex justify-between items-center font-semibold">
          <span>Selected: {files.map((f) => f.name).join(", ")}</span>
          <span className="text-slate-400">({(files.reduce((a, b) => a + b.size, 0) / 1024 / 1024).toFixed(2)} MB)</span>
        </div>
      )}

      {/* Options */}
      {toolId === "pdf-page-reorder" && (
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">New Page Order (comma-separated, e.g. 3,1,2)</label>
          <input
            type="text"
            value={pageOrderStr}
            onChange={(e) => setPageOrderStr(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
          />
        </div>
      )}

      {toolId === "image-background-changer" && (
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">New Background Color</label>
          <input
            type="color"
            value={bgColorHex}
            onChange={(e) => setBgColorHex(e.target.value)}
            className="w-16 h-10 rounded-lg cursor-pointer"
          />
        </div>
      )}

      {toolId === "video-thumbnail-maker" && (
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Thumbnail Headline Text</label>
          <input
            type="text"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-semibold"
          />
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleExecute}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
      >
        <Sparkles className="w-4 h-4" />
        <span>{loading ? "Processing Locally..." : "Execute Tool"}</span>
      </button>

      {/* Download Result Card */}
      {resultBlob && (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-900/60 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400">Processing Completed</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">{resultName}</h4>
            </div>
          </div>

          <button
            onClick={() => downloadBlob(resultBlob, resultName)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Result</span>
          </button>
        </div>
      )}
    </div>
  );
}
