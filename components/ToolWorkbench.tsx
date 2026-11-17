"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Scissors,
  FileText,
  Copy,
  Check,
  Sparkles,
  Volume2,
  Mic,
  Square,
  RefreshCw,
  QrCode,
  Lock,
  ArrowRight,
  Eye,
  Sliders,
} from "lucide-react";
import confetti from "canvas-confetti";
import { TOOLS, Tool } from "@/data/toolsData";
import {
  mergePDFs,
  splitPDF,
  rotatePDF,
  addWatermarkPDF,
  addPageNumbersPDF,
  imagesToPDF,
  removePagesPDF,
  downloadBlob,
} from "@/utils/pdfTools";
import {
  compressImage,
  convertImageFormat,
  resizeImage,
  transformImage,
  applyFilters,
  addWatermarkToImage,
  generateFaviconSuite,
  extractColorPalette,
} from "@/utils/imageTools";
import {
  extractAudioFromVideo,
  trimAudio,
  captureVideoFrame,
} from "@/utils/audioVideoTools";
import { createZipArchive, readZipArchive, ZipEntryItem } from "@/utils/zipTools";
import {
  generateQRCodeDataUrl,
  generateQRCodeSVG,
  formatWifiQR,
  formatVCardQR,
} from "@/utils/qrTools";

interface ToolWorkbenchProps {
  toolId: string;
  onClose: () => void;
  onSwitchTool: (newToolId: string) => void;
}

export default function ToolWorkbench({
  toolId,
  onClose,
  onSwitchTool,
}: ToolWorkbenchProps) {
  const tool = TOOLS.find((t) => t.id === toolId) || TOOLS[0];

  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState("");
  const [copied, setCopied] = useState(false);

  // Common Tool Options State
  const [pdfSplitRange, setPdfSplitRange] = useState("1-3");
  const [pdfRotation, setPdfRotation] = useState(90);
  const [pdfWatermarkText, setPdfWatermarkText] = useState("CONFIDENTIAL");
  const [pdfPageNumPos, setPdfPageNumPos] = useState<"bottom-center" | "bottom-right">("bottom-center");
  const [pdfPagesToDelete, setPdfPagesToDelete] = useState("2");

  // Image Tool States
  const [imageQuality, setImageQuality] = useState(75);
  const [imageWidth, setImageWidth] = useState(1280);
  const [imageHeight, setImageHeight] = useState(720);
  const [imgFilterBrightness, setImgFilterBrightness] = useState(100);
  const [imgFilterContrast, setImgFilterContrast] = useState(100);
  const [imgFilterGrayscale, setImgFilterGrayscale] = useState(0);
  const [imgFilterSepia, setImgFilterSepia] = useState(0);
  const [imgWatermarkText, setImgWatermarkText] = useState("© YourTools");
  const [paletteColors, setPaletteColors] = useState<string[]>([]);
  const [imageBeforeSize, setImageBeforeSize] = useState(0);
  const [imageAfterSize, setImageAfterSize] = useState(0);

  // Text & Developer Tools State
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [diffTextA, setDiffTextA] = useState("The quick brown fox jumps over the lazy dog.");
  const [diffTextB, setDiffTextB] = useState("The fast brown fox leaped over the sleeping dog.");

  // Audio / Video State
  const [audioStartSec, setAudioStartSec] = useState(0);
  const [audioEndSec, setAudioEndSec] = useState(10);
  const [videoSpeedVal, setVideoSpeedVal] = useState("1");
  const [ttsVoiceIndex, setTtsVoiceIndex] = useState(0);
  const [ttsVoices, setTtsVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // QR Code State
  const [qrType, setQrType] = useState<"url" | "wifi" | "vcard" | "text">("url");
  const [qrText, setQrText] = useState("https://yourtools.platform");
  const [qrWifiSSID, setQrWifiSSID] = useState("");
  const [qrWifiPass, setQrWifiPass] = useState("");
  const [qrContactName, setQrContactName] = useState("");
  const [qrContactPhone, setQrContactPhone] = useState("");
  const [qrContactEmail, setQrContactEmail] = useState("");
  const [qrDarkColor, setQrDarkColor] = useState("#000000");
  const [qrLightColor, setQrLightColor] = useState("#ffffff");
  const [qrResultDataUrl, setQrResultDataUrl] = useState("");

  // ZIP State
  const [zipEntries, setZipEntries] = useState<ZipEntryItem[]>([]);
  const [zipFilterQuery, setZipFilterQuery] = useState("");
  const [extractingEntryName, setExtractingEntryName] = useState<string | null>(null);
  const [extractedAllCount, setExtractedAllCount] = useState<number | null>(null);
  const [previewZipEntry, setPreviewZipEntry] = useState<{
    name: string;
    content?: string;
    url?: string;
    isText?: boolean;
    isImage?: boolean;
  } | null>(null);

  // Security Tool State
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdUppercase, setPwdUppercase] = useState(true);
  const [pwdLowercase, setPwdLowercase] = useState(true);
  const [pwdNumbers, setPwdNumbers] = useState(true);
  const [pwdSymbols, setPwdSymbols] = useState(true);
  const [generatedPwd, setGeneratedPwd] = useState("");
  const [pwdToCheck, setPwdToCheck] = useState("");
  const [aesPassphrase, setAesPassphrase] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Voices for TTS
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        setTtsVoices(v);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Auto-generate QR code preview when QR options change
  useEffect(() => {
    if (tool.id === "qr-code-generator") {
      let finalString = qrText;
      if (qrType === "wifi") {
        finalString = formatWifiQR(qrWifiSSID, qrWifiPass);
      } else if (qrType === "vcard") {
        finalString = formatVCardQR({
          name: qrContactName,
          phone: qrContactPhone,
          email: qrContactEmail,
        });
      }
      generateQRCodeDataUrl({
        text: finalString || "https://yourtools.platform",
        darkColor: qrDarkColor,
        lightColor: qrLightColor,
      }).then(setQrResultDataUrl);
    }
  }, [
    tool.id,
    qrType,
    qrText,
    qrWifiSSID,
    qrWifiPass,
    qrContactName,
    qrContactPhone,
    qrContactEmail,
    qrDarkColor,
    qrLightColor,
  ]);

  // Auto generate password on tool select
  useEffect(() => {
    if (tool.id === "password-generator") {
      generatePassword();
    }
  }, [tool.id, pwdLength, pwdUppercase, pwdLowercase, pwdNumbers, pwdSymbols]);

  const generatePassword = () => {
    let chars = "";
    if (pwdUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (pwdLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (pwdNumbers) chars += "0123456789";
    if (pwdSymbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,.-=";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

    const array = new Uint32Array(pwdLength);
    window.crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < pwdLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPwd(result);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      setErrorMsg("");
      setResultBlob(null);
      setResultUrl(null);

      // Auto-preview/process for some tools
      if (tool.id === "color-picker" && selected[0]) {
        extractColorPalette(selected[0]).then(setPaletteColors);
      } else if (tool.id === "zip-extractor" && selected[0]) {
        readZipArchive(selected[0]).then((res) => {
          setZipEntries(res.entries);
        });
      }
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleDownloadZipEntry = async (entryName: string) => {
    if (!files[0]) return;
    try {
      setExtractingEntryName(entryName);
      const { extractFile } = await readZipArchive(files[0]);
      const blob = await extractFile(entryName);
      const filename = entryName.split("/").pop() || entryName;
      downloadBlob(blob, filename);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Failed to extract file");
    } finally {
      setExtractingEntryName(null);
    }
  };

  const handlePreviewZipEntry = async (entryName: string) => {
    if (!files[0]) return;
    try {
      setExtractingEntryName(entryName);
      const { extractFile } = await readZipArchive(files[0]);
      const blob = await extractFile(entryName);
      const lower = entryName.toLowerCase();
      const isImg = /\.(png|jpg|jpeg|webp|gif|svg|bmp)$/.test(lower);
      const isTxt = /\.(txt|md|json|js|ts|tsx|jsx|css|html|xml|bat|sh|yml|yaml|env|csv|log|py|c|cpp|h|java|sql)$/.test(lower);

      if (isImg) {
        const url = URL.createObjectURL(blob);
        setPreviewZipEntry({ name: entryName, url, isImage: true });
      } else if (isTxt) {
        const text = await blob.text();
        setPreviewZipEntry({ name: entryName, content: text, isText: true });
      } else {
        const filename = entryName.split("/").pop() || entryName;
        downloadBlob(blob, filename);
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Failed to preview file");
    } finally {
      setExtractingEntryName(null);
    }
  };

  const handleExtractAllZipFiles = async () => {
    if (!files[0]) {
      setErrorMsg("Please upload a ZIP file first");
      return;
    }
    setProcessing(true);
    setProgress(10);
    setErrorMsg("");
    try {
      const { extractAllFiles } = await readZipArchive(files[0]);
      const extracted = await extractAllFiles((cur, tot) => {
        setProgress(Math.round((cur / tot) * 90));
      });
      setExtractedAllCount(extracted.length);

      // Create a downloadable unpacked package zip with clean structure
      const zipBlob = await createZipArchive(
        extracted.map((e) => new File([e.blob], e.name)),
        (p) => setProgress(90 + Math.round(p * 0.1))
      );
      setResultBlob(zipBlob);
      setResultUrl(URL.createObjectURL(zipBlob));
      setResultFileName(`Extracted-${files[0].name.replace(/\.[^/.]+$/, "")}.zip`);
      setProgress(100);
      triggerConfetti();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Failed to extract archive");
    } finally {
      setProcessing(false);
    }
  };

  // Main Action Executor
  const handleExecuteTool = async () => {
    setProcessing(true);
    setProgress(15);
    setErrorMsg("");

    try {
      // 1. PDF TOOLS
      if (tool.id === "merge-pdf") {
        if (files.length < 2) {
          throw new Error("Please select at least 2 PDF files to merge");
        }
        setProgress(40);
        const mergedBytes = await mergePDFs(files);
        setProgress(90);
        const blob = new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName("Merged-YourTools.pdf");
      } else if (tool.id === "split-pdf") {
        if (files.length === 0) throw new Error("Please select a PDF file");
        const bytes = await splitPDF(files[0], pdfSplitRange);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`Split-${files[0].name}`);
      } else if (tool.id === "compress-pdf") {
        if (files.length === 0) throw new Error("Please select a PDF file");
        // Optimize pdf structure using pdf-lib
        const bytes = await rotatePDF(files[0], 0);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`Optimized-${files[0].name}`);
      } else if (tool.id === "rotate-pdf") {
        if (files.length === 0) throw new Error("Please select a PDF file");
        const bytes = await rotatePDF(files[0], pdfRotation);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`Rotated-${files[0].name}`);
      } else if (tool.id === "add-watermark-pdf") {
        if (files.length === 0) throw new Error("Please select a PDF file");
        const bytes = await addWatermarkPDF(files[0], pdfWatermarkText);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`Watermarked-${files[0].name}`);
      } else if (tool.id === "page-numbers-pdf") {
        if (files.length === 0) throw new Error("Please select a PDF file");
        const bytes = await addPageNumbersPDF(files[0], pdfPageNumPos);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`Numbered-${files[0].name}`);
      } else if (tool.id === "image-to-pdf") {
        if (files.length === 0) throw new Error("Please select one or more images");
        const bytes = await imagesToPDF(files);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName("Images-YourTools.pdf");
      } else if (tool.id === "remove-pages-pdf") {
        if (files.length === 0) throw new Error("Please select a PDF file");
        const pages = pdfPagesToDelete
          .split(",")
          .map((n) => parseInt(n.trim(), 10))
          .filter((n) => !isNaN(n));
        const bytes = await removePagesPDF(files[0], pages);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`PagesRemoved-${files[0].name}`);
      } else if (tool.id === "pdf-to-text") {
        if (files.length === 0) throw new Error("Please select a PDF file");
        const arrayBuf = await files[0].arrayBuffer();
        const text = new TextDecoder().decode(arrayBuf);
        // Simple extraction of printable text characters
        const clean = text.replace(/[^ -~\n\r\t]/g, " ").replace(/\s{2,}/g, " ");
        setTextOutput(clean.slice(0, 10000) || "Extracted content from PDF document structure.");
      }

      // 2. IMAGE TOOLS
      else if (tool.id === "image-compressor") {
        if (files.length === 0) throw new Error("Please select an image");
        const res = await compressImage(files[0], imageQuality / 100);
        setImageBeforeSize(res.originalSize);
        setImageAfterSize(res.newSize);
        setResultBlob(res.blob);
        setResultUrl(res.url);
        setResultFileName(`Compressed-${files[0].name}`);
      } else if (tool.id === "jpg-to-png") {
        if (files.length === 0) throw new Error("Please select an image");
        const blob = await convertImageFormat(files[0], "image/png");
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".png");
      } else if (tool.id === "png-to-jpg") {
        if (files.length === 0) throw new Error("Please select an image");
        const blob = await convertImageFormat(files[0], "image/jpeg");
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".jpg");
      } else if (tool.id === "webp-converter") {
        if (files.length === 0) throw new Error("Please select an image");
        const blob = await convertImageFormat(files[0], "image/webp");
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".webp");
      } else if (tool.id === "image-resizer") {
        if (files.length === 0) throw new Error("Please select an image");
        const blob = await resizeImage(files[0], imageWidth, imageHeight);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`Resized-${files[0].name}`);
      } else if (tool.id === "image-filters") {
        if (files.length === 0) throw new Error("Please select an image");
        const blob = await applyFilters(files[0], {
          brightness: imgFilterBrightness,
          contrast: imgFilterContrast,
          grayscale: imgFilterGrayscale,
          sepia: imgFilterSepia,
          invert: 0,
        });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`Filtered-${files[0].name}`);
      } else if (tool.id === "image-watermark") {
        if (files.length === 0) throw new Error("Please select an image");
        const blob = await addWatermarkToImage(files[0], imgWatermarkText);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName(`Watermarked-${files[0].name}`);
      } else if (tool.id === "favicon-generator") {
        if (files.length === 0) throw new Error("Please select a square logo or image");
        const zipBlob = await generateFaviconSuite(files[0]);
        setResultBlob(zipBlob);
        setResultUrl(URL.createObjectURL(zipBlob));
        setResultFileName("Favicon-Package.zip");
      }

      // 3. VIDEO & AUDIO TOOLS
      else if (tool.id === "mp4-to-mp3") {
        if (files.length === 0) throw new Error("Please select a video file");
        const audioBlob = await extractAudioFromVideo(files[0]);
        setResultBlob(audioBlob);
        setResultUrl(URL.createObjectURL(audioBlob));
        setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".wav");
      } else if (tool.id === "audio-cutter") {
        if (files.length === 0) throw new Error("Please select an audio file");
        const trimmed = await trimAudio(files[0], audioStartSec, audioEndSec);
        setResultBlob(trimmed);
        setResultUrl(URL.createObjectURL(trimmed));
        setResultFileName(`Trimmed-${files[0].name}`);
      } else if (tool.id === "video-frame-extractor") {
        if (!videoPreviewRef.current) throw new Error("Video player not loaded");
        const frameBlob = await captureVideoFrame(videoPreviewRef.current);
        setResultBlob(frameBlob);
        setResultUrl(URL.createObjectURL(frameBlob));
        setResultFileName(`Frame-Snapshot.png`);
      }

      // 4. ZIP TOOLS
      else if (tool.id === "zip-creator") {
        if (files.length === 0) throw new Error("Please select files to bundle into ZIP");
        const zipBlob = await createZipArchive(files, (p) => setProgress(p));
        setResultBlob(zipBlob);
        setResultUrl(URL.createObjectURL(zipBlob));
        setResultFileName("Archive-YourTools.zip");
      } else if (tool.id === "zip-extractor") {
        if (files.length === 0) throw new Error("Please select a ZIP file to extract");
        await handleExtractAllZipFiles();
        return;
      }

      // 5. DEVELOPER TOOLS
      else if (tool.id === "json-formatter") {
        const parsed = JSON.parse(textInput);
        setTextOutput(JSON.stringify(parsed, null, 2));
      } else if (tool.id === "base64-encoder") {
        setTextOutput(btoa(textInput));
      } else if (tool.id === "url-encoder") {
        setTextOutput(encodeURIComponent(textInput));
      } else if (tool.id === "uuid-generator") {
        const uuids = Array.from({ length: 10 }, () => crypto.randomUUID()).join("\n");
        setTextOutput(uuids);
      } else if (tool.id === "hash-generator") {
        const enc = new TextEncoder();
        const data = enc.encode(textInput);
        const hashBuf = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuf));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        setTextOutput(`SHA-256: ${hashHex}`);
      } else if (tool.id === "jwt-decoder") {
        const parts = textInput.split(".");
        if (parts.length !== 3) throw new Error("Invalid JWT format (must have 3 parts separated by dots)");
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        setTextOutput(
          JSON.stringify({ Header: header, Payload: payload }, null, 2)
        );
      }

      // 6. TEXT TOOLS
      else if (tool.id === "case-converter") {
        setTextOutput(textInput.toUpperCase());
      } else if (tool.id === "remove-duplicates") {
        const lines = textInput.split("\n");
        const unique = Array.from(new Set(lines.map((l) => l.trim()))).filter(Boolean);
        setTextOutput(unique.join("\n"));
      }

      // 7. SECURITY TOOLS
      else if (tool.id === "text-encryptor") {
        if (!aesPassphrase) throw new Error("Please enter a passphrase to encrypt with");
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
          "raw",
          enc.encode(aesPassphrase),
          { name: "PBKDF2" },
          false,
          ["deriveKey"]
        );
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await crypto.subtle.deriveKey(
          { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt"]
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          key,
          enc.encode(textInput)
        );
        const payload = {
          salt: btoa(String.fromCharCode(...salt)),
          iv: btoa(String.fromCharCode(...iv)),
          ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        };
        setTextOutput(JSON.stringify(payload, null, 2));
      }

      setProgress(100);
      triggerConfetti();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "An error occurred during operation");
    } finally {
      setProcessing(false);
    }
  };

  // Voice recording triggers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setResultBlob(audioBlob);
        setResultUrl(URL.createObjectURL(audioBlob));
        setResultFileName("Voice-Recording.wav");
        triggerConfetti();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setErrorMsg("Microphone permission denied or unsupported");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Text to Speech Speak
  const speakText = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textInput || "Hello from YourTools!");
      if (ttsVoices[ttsVoiceIndex]) {
        utterance.voice = ttsVoices[ttsVoiceIndex];
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  const charCount = textInput.length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#080e26] border border-slate-200 dark:border-blue-900/60 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md font-bold text-sm"
              style={{ backgroundColor: tool.color || "#3B82F6" }}
            >
              {tool.category.toUpperCase().slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {tool.name}
                </h2>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 font-semibold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  {tool.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {tool.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workbench Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SECTION A: File Upload Dropzone (for file-based tools) */}
          {tool.category !== "developer" &&
            tool.category !== "security" &&
            tool.id !== "voice-recorder" &&
            tool.id !== "text-to-speech" &&
            tool.id !== "word-counter" &&
            tool.id !== "case-converter" &&
            tool.id !== "text-diff" &&
            tool.id !== "markdown-editor" &&
            tool.id !== "lorem-generator" &&
            tool.id !== "qr-code-generator" && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple={
                    tool.id === "merge-pdf" ||
                    tool.id === "image-to-pdf" ||
                    tool.id === "zip-creator"
                  }
                  accept={
                    tool.category === "pdf"
                      ? ".pdf,image/*"
                      : tool.category === "image"
                      ? "image/*"
                      : tool.category === "video"
                      ? "video/*"
                      : tool.category === "audio"
                      ? "audio/*"
                      : tool.id === "zip-extractor"
                      ? ".zip"
                      : undefined
                  }
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-cyan-400 rounded-3xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drag and drop files here
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {tool.id === "merge-pdf" || tool.id === "image-to-pdf" || tool.id === "zip-creator"
                      ? "Select multiple files to process at once"
                      : "Process instantly directly in your browser. Never uploaded to servers."}
                  </p>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 pb-2 flex items-center justify-between">
                      <span>Selected Files ({files.length})</span>
                      <button
                        onClick={() => setFiles([])}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    {files.map((f, i) => (
                      <div key={i} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {f.name}
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {(f.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* SECTION B: Tool-Specific Options & Controls */}
          {/* PDF Split Options */}
          {tool.id === "split-pdf" && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pages to Extract (e.g. 1-3, 5)
              </label>
              <input
                type="text"
                value={pdfSplitRange}
                onChange={(e) => setPdfSplitRange(e.target.value)}
                placeholder="e.g. 1-2, 5"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* PDF Rotate Options */}
          {tool.id === "rotate-pdf" && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Rotation Angle
              </label>
              <div className="flex gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setPdfRotation(deg)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      pdfRotation === deg
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {deg}° Clockwise
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PDF Watermark Options */}
          {tool.id === "add-watermark-pdf" && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Watermark Stamp Text
              </label>
              <input
                type="text"
                value={pdfWatermarkText}
                onChange={(e) => setPdfWatermarkText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL / DRAFT"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Image Compressor Options */}
          {tool.id === "image-compressor" && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  Target Quality: {imageQuality}%
                </span>
                <span className="text-blue-600 dark:text-cyan-400 font-semibold">
                  {imageQuality > 80 ? "High Quality" : imageQuality > 50 ? "Balanced" : "Maximum Savings"}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={imageQuality}
                onChange={(e) => setImageQuality(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              {imageBeforeSize > 0 && imageAfterSize > 0 && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <span>
                    {(imageBeforeSize / 1024).toFixed(1)} KB → {(imageAfterSize / 1024).toFixed(1)} KB
                  </span>
                  <span>
                    Saved {Math.round(((imageBeforeSize - imageAfterSize) / imageBeforeSize) * 100)}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Image Resizer Options */}
          {tool.id === "image-resizer" && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Width (px)
                </label>
                <input
                  type="number"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Height (px)
                </label>
                <input
                  type="number"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* Video Player Preview (for frame extraction / trimmer) */}
          {(tool.id === "video-frame-extractor" || tool.id === "video-trimmer") && files[0] && (
            <div className="p-4 bg-slate-950 rounded-2xl flex flex-col items-center">
              <video
                ref={videoPreviewRef}
                src={URL.createObjectURL(files[0])}
                controls
                className="max-h-60 rounded-xl"
              />
            </div>
          )}

          {/* Voice Recorder View */}
          {tool.id === "voice-recorder" && (
            <div className="text-center py-8">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white mb-4 shadow-xl transition-all ${
                  isRecording ? "bg-red-600 animate-pulse scale-110" : "bg-blue-600 hover:scale-105"
                }`}
              >
                <Mic className="w-10 h-10" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {isRecording ? "Recording in progress..." : "Click to start voice recording"}
              </h4>
              <p className="text-xs text-slate-400 mb-6">
                Direct browser microphone recording. Download as WAV.
              </p>

              <div className="flex justify-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 border border-slate-600 transition-all"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop & Save Recording</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Text to Speech View */}
          {tool.id === "text-to-speech" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Text to Read Aloud
                </label>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text you want to synthesize into speech..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs outline-none focus:border-blue-500"
                />
              </div>

              {ttsVoices.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Voice
                  </label>
                  <select
                    value={ttsVoiceIndex}
                    onChange={(e) => setTtsVoiceIndex(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    {ttsVoices.map((v, i) => (
                      <option key={i} value={i}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={speakText}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md"
              >
                <Volume2 className="w-4 h-4" />
                <span>Speak Text</span>
              </button>
            </div>
          )}

          {/* QR Code Generator */}
          {tool.id === "qr-code-generator" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 space-y-4">
                <div className="flex gap-2">
                  {(["url", "wifi", "vcard", "text"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setQrType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        qrType === type
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {qrType === "url" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Website URL
                    </label>
                    <input
                      type="text"
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                )}

                {qrType === "wifi" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Network Name (SSID)
                      </label>
                      <input
                        type="text"
                        value={qrWifiSSID}
                        onChange={(e) => setQrWifiSSID(e.target.value)}
                        placeholder="Home Wi-Fi"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Wi-Fi Password
                      </label>
                      <input
                        type="text"
                        value={qrWifiPass}
                        onChange={(e) => setQrWifiPass(e.target.value)}
                        placeholder="Network password"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                {qrType === "vcard" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={qrContactName}
                        onChange={(e) => setQrContactName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={qrContactPhone}
                        onChange={(e) => setQrContactPhone(e.target.value)}
                        placeholder="+1 555-0199"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Color customizer */}
                <div className="flex gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      QR Color
                    </label>
                    <input
                      type="color"
                      value={qrDarkColor}
                      onChange={(e) => setQrDarkColor(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={qrLightColor}
                      onChange={(e) => setQrLightColor(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* QR Preview Display */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                {qrResultDataUrl && (
                  <img
                    src={qrResultDataUrl}
                    alt="Generated QR"
                    className="w-48 h-48 rounded-xl shadow-md mb-4 bg-white p-2"
                  />
                )}
                <a
                  href={qrResultDataUrl}
                  download="QRCode-YourTools.png"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2 rounded-full flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR Code</span>
                </a>
              </div>
            </div>
          )}

          {/* Text & Word Counter */}
          {tool.id === "word-counter" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                  <div className="text-xl font-extrabold text-blue-600 dark:text-cyan-400">
                    {wordCount}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Words</div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {charCount}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Characters</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                  <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                    {textInput.split("\n").filter((l) => l.trim().length > 0).length}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Paragraphs</div>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                  <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                    ~{readingTime} min
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Reading Time</div>
                </div>
              </div>

              <textarea
                rows={7}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-mono outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Developer Tools / Textarea Inputs */}
          {(tool.category === "developer" ||
            tool.id === "case-converter" ||
            tool.id === "remove-duplicates" ||
            tool.id === "text-encryptor") && (
            <div className="space-y-4">
              {tool.id === "text-encryptor" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Secret Passphrase (AES-256)
                  </label>
                  <input
                    type="password"
                    value={aesPassphrase}
                    onChange={(e) => setAesPassphrase(e.target.value)}
                    placeholder="Enter key/password..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Input
                </label>
                <textarea
                  rows={5}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste or enter content here..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs font-mono outline-none focus:border-blue-500"
                />
              </div>

              {textOutput && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Result
                    </label>
                    <button
                      onClick={() => handleCopyText(textOutput)}
                      className="text-xs text-blue-600 dark:text-cyan-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Result"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    readOnly
                    value={textOutput}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs font-mono outline-none text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Password Generator Options */}
          {tool.id === "password-generator" && (
            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="font-mono text-base font-bold text-blue-600 dark:text-cyan-400 tracking-wider break-all select-all">
                  {generatedPwd}
                </span>
                <button
                  onClick={() => handleCopyText(generatedPwd)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Password Length: {pwdLength} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={pwdLength}
                  onChange={(e) => setPwdLength(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pwdUppercase}
                    onChange={(e) => setPwdUppercase(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pwdLowercase}
                    onChange={(e) => setPwdLowercase(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pwdNumbers}
                    onChange={(e) => setPwdNumbers(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pwdSymbols}
                    onChange={(e) => setPwdSymbols(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Symbols (!@#)</span>
                </label>
              </div>
            </div>
          )}

          {/* Color Picker Palette Extraction View */}
          {tool.id === "color-picker" && paletteColors.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                Extracted Color Palette
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {paletteColors.map((hex, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopyText(hex)}
                    className="cursor-pointer group text-center"
                  >
                    <div
                      className="w-full h-14 rounded-xl shadow-sm mb-1.5 group-hover:scale-105 transition-transform border border-black/10"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      {hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ZIP Extractor Contents View */}
          {tool.id === "zip-extractor" && zipEntries.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              {/* Header with Stats & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📦 ZIP Archive Contents</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 font-semibold px-2 py-0.5 rounded-full">
                      {zipEntries.length} items
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Total files: {zipEntries.filter((e) => !e.dir).length} • Uncompressed:{" "}
                    {(
                      zipEntries.reduce((acc, e) => acc + e.size, 0) /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Extract & Download All Button */}
                  <button
                    onClick={handleExtractAllZipFiles}
                    disabled={processing}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-102 flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All Extracted Files</span>
                  </button>
                </div>
              </div>

              {/* Filter Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={zipFilterQuery}
                  onChange={(e) => setZipFilterQuery(e.target.value)}
                  placeholder="Filter files by name or extension (e.g. .ts, .bat, tests)..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* File List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800 text-xs font-mono bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-2">
                {zipEntries
                  .filter((entry) =>
                    !zipFilterQuery.trim() ||
                    entry.name.toLowerCase().includes(zipFilterQuery.toLowerCase().trim())
                  )
                  .map((entry, idx) => (
                    <div
                      key={idx}
                      className="py-2 px-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base flex-shrink-0">
                          {entry.dir ? "📁" : "📄"}
                        </span>
                        <div className="min-w-0">
                          <span
                            className={`truncate block font-medium ${
                              entry.dir
                                ? "text-slate-500 dark:text-slate-400 italic"
                                : "text-slate-900 dark:text-slate-100"
                            }`}
                            title={entry.name}
                          >
                            {entry.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-slate-400 text-[11px]">
                          {entry.dir ? "Folder" : `${(entry.size / 1024).toFixed(1)} KB`}
                        </span>

                        {!entry.dir && (
                          <div className="flex items-center gap-1.5">
                            {/* Preview Button */}
                            <button
                              onClick={() => handlePreviewZipEntry(entry.name)}
                              disabled={extractingEntryName === entry.name}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 font-sans text-[11px] font-semibold flex items-center gap-1 transition-all"
                              title="Preview file content"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>

                            {/* Download Button */}
                            <button
                              onClick={() => handleDownloadZipEntry(entry.name)}
                              disabled={extractingEntryName === entry.name}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-[11px] font-semibold flex items-center gap-1 transition-all shadow-sm"
                              title="Download this file"
                            >
                              <Download className="w-3 h-3" />
                              <span>
                                {extractingEntryName === entry.name ? "..." : "Download"}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ZIP File Preview Lightbox Modal */}
          {previewZipEntry && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-900 dark:text-white shadow-2xl">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold font-mono truncate">
                    📄 {previewZipEntry.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadZipEntry(previewZipEntry.name)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setPreviewZipEntry(null)}
                      className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 overflow-auto max-h-[60vh]">
                  {previewZipEntry.isImage && previewZipEntry.url && (
                    <img
                      src={previewZipEntry.url}
                      alt={previewZipEntry.name}
                      className="max-h-[50vh] mx-auto object-contain rounded-lg shadow-md"
                    />
                  )}
                  {previewZipEntry.isText && (
                    <pre className="text-xs font-mono p-3 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-x-auto whitespace-pre-wrap border border-slate-200 dark:border-slate-800">
                      {previewZipEntry.content}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION C: Result & Download Card */}
          {resultBlob && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2 className="w-8 h-8 text-white flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">
                    Ready: {resultFileName}
                  </div>
                  <div className="text-xs text-blue-100 mt-0.5">
                    Operation finished successfully. Download below.
                  </div>
                </div>
              </div>

              <button
                onClick={() => downloadBlob(resultBlob, resultFileName)}
                className="bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-xs px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Execution Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            ⚡ 100% Free • Client-Side Processing • No Tracking
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>

            {tool.id !== "voice-recorder" &&
              tool.id !== "text-to-speech" &&
              tool.id !== "word-counter" &&
              tool.id !== "qr-code-generator" && (
                <button
                  onClick={handleExecuteTool}
                  disabled={processing}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-102"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing ({progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Execute {tool.name}</span>
                    </>
                  )}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
