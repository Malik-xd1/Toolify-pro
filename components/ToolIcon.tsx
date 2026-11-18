import React from "react";
import {
  AlarmClock, ArrowDownUp, ArrowLeftRight, AudioLines, Award, Banknote, Barcode, BookOpen, Bot, Braces,
  Briefcase, Calculator, CalendarDays, CaseSensitive, Code, Coins, Combine, Contact, Copy, Crop,
  Database, DollarSign, Eraser, FileArchive, FileCheck, FileCode, FileImage, FileKey, FileLock, FileMinus,
  FileOutput, FileSearch, FileSignature, FileSpreadsheet, FileText, FileType, FileUp, FileVideo, Film,
  Fingerprint, Fuel, Gauge, Globe, GraduationCap, Hash, HeartPulse, Image as ImageIcon, ImageDown,
  ImageMinus, ImagePlus, ImageUpscale, KeyRound, Languages, Link, Link2, Lock, Mail, MessageCircle,
  Minimize2, Music, Network, Palette, Percent, PiggyBank, Puzzle, QrCode, Receipt, Regex, Repeat, RotateCw,
  ScanLine, ScanText, Scissors, Search, Send, Server, Shield, ShieldCheck, Shuffle, SpellCheck,
  Split, Stamp, Tag, Type, User, UserSquare, Volume2, Wifi, Wrench, Zap,
  type LucideIcon,
} from "lucide-react";
import type { Tool, ToolCategory } from "@/data/toolsData";

/** Per-tool icons. Tools not listed fall back to their category icon. */
const TOOL_ICONS: Record<string, LucideIcon> = {
  // PDF
  "pdf-merger": Combine, "pdf-splitter": Split, "pdf-compressor": Minimize2, "pdf-to-word": FileType,
  "word-to-pdf": FileOutput, "pdf-to-jpg": FileImage, "jpg-to-pdf": FileUp, "pdf-to-excel": FileSpreadsheet,
  "pdf-to-text": ScanText, "pdf-page-deleter": FileMinus, "pdf-page-reorder": ArrowDownUp, "pdf-rotator": RotateCw,
  "pdf-watermark": Stamp, "pdf-password-protector": FileLock, "pdf-signer": FileSignature, "pdf-locker": FileKey,
  // Image
  "image-compressor": ImageMinus, "image-resizer": ImageUpscale, "image-cropper": Crop, "image-converter": Repeat,
  "jpg-to-png": ArrowLeftRight, "png-to-jpg": ArrowLeftRight, "image-background-remover": Eraser,
  "image-background-changer": Palette, "image-to-text": ScanText, "image-upscaler": ImagePlus,
  "passport-photo-maker": UserSquare, "favicon-generator": Globe,
  // Video
  "video-compressor": Minimize2, "video-converter": Repeat, "video-cutter": Scissors, "video-trimmer": Scissors,
  "video-merger": Combine, "video-to-mp3": Music, "video-to-gif": Film, "video-thumbnail-maker": ImageDown,
  // Audio
  "audio-converter": Repeat, "mp3-to-wav": ArrowLeftRight, "wav-to-mp3": ArrowLeftRight, "audio-compressor": Minimize2,
  "audio-cutter": Scissors, "audio-merger": Combine, "text-to-speech": Volume2,
  // Text & writing
  "word-counter": Hash, "character-counter": Type, "case-converter": CaseSensitive, "remove-extra-spaces": Eraser,
  "remove-duplicate-lines": Copy, "text-comparer": FileSearch, "find-and-replace": Search, "grammar-checker": SpellCheck,
  "spell-checker": SpellCheck, "plagiarism-checker": FileCheck, "reading-time-calculator": BookOpen,
  "text-to-slug-converter": Link2,
  // Developer
  "json-formatter": Braces, "json-validator": FileCheck, "json-minifier": Minimize2, "html-formatter": Code,
  "html-minifier": Minimize2, "css-formatter": Palette, "css-minifier": Minimize2, "javascript-formatter": FileCode,
  "base64-encoder": Database, "base64-decoder": Database, "url-encoder": Link, "regex-tester": Regex,
  // Security
  "password-generator": KeyRound, "password-strength-checker": ShieldCheck, "secure-pin-generator": Fingerprint,
  "random-key-generator": KeyRound, "text-encryption-tool": Lock, "metadata-cleaner": Eraser, "file-locker": Lock,
  // Calculators
  "age-calculator": CalendarDays, "bmi-calculator": HeartPulse, "percentage-calculator": Percent,
  "discount-calculator": Tag, "profit-calculator": Coins, "profit-margin-calculator": Percent, "loan-calculator": Banknote,
  "emi-calculator": Banknote, "compound-interest-calculator": PiggyBank, "salary-calculator": DollarSign,
  "currency-converter": ArrowLeftRight, "date-difference-calculator": CalendarDays, "gpa-calculator": GraduationCap,
  "scientific-calculator": Calculator, "fuel-cost-calculator": Fuel,
  // QR & file sharing
  "qr-file-transfer": Send, "qr-code-generator": QrCode, "qr-code-scanner": ScanLine, "wifi-qr-generator": Wifi,
  "whatsapp-qr-generator": MessageCircle, "email-qr-generator": Mail, "contact-qr-generator": Contact,
  "barcode-generator": Barcode,
  // Business & generators
  "random-number-generator": Shuffle, "username-generator": User, "business-name-generator": Briefcase,
  "domain-name-generator": Globe, "hashtag-generator": Hash, "color-palette-generator": Palette,
  "invoice-generator": Receipt, "quotation-generator": Receipt, "resume-builder": Award, "cover-letter-generator": Mail,
  // SEO & web
  "utm-link-builder": Link2, "url-shortener": Link, "website-seo-checker": Search, "meta-description-checker": FileText,
  "sitemap-checker": Network, "robots-txt-checker": Bot, "broken-link-checker": Link2, "website-speed-test": Gauge,
  "dns-lookup": Server, "ip-lookup": Globe, "whois-lookup": Search, "ssl-checker": ShieldCheck,
  "http-header-checker": Languages, "redirect-checker": Repeat, "website-down-checker": AlarmClock,
  // ZIP
  "zip-creator": FileArchive, "zip-extractor": FileArchive,
};

const CATEGORY_ICONS: Partial<Record<ToolCategory, LucideIcon>> = {
  pdf: FileText, conversion: Repeat, image: ImageIcon, video: FileVideo, audio: AudioLines, document: Type,
  zip: FileArchive, qr: QrCode, developer: Code, security: Shield, calculators: Calculator, business: Briefcase,
  seo: Globe, locker: Lock, more: Puzzle,
};

export function getToolIcon(tool: Pick<Tool, "id" | "category">): LucideIcon {
  return TOOL_ICONS[tool.id] ?? CATEGORY_ICONS[tool.category] ?? Wrench;
}

const SIZES = {
  sm: { box: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
  md: { box: "w-9 h-9 rounded-xl", icon: "w-[18px] h-[18px]" },
  lg: { box: "w-10 h-10 rounded-xl", icon: "w-5 h-5" },
  xl: { box: "w-14 h-14 rounded-2xl", icon: "w-7 h-7" },
};

/** Coloured square with the tool's icon, replacing the old 3-letter category badge. */
export default function ToolIcon({
  tool,
  size = "md",
  className = "",
}: {
  tool: Pick<Tool, "id" | "category" | "color">;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <div
      className={`${s.box} flex items-center justify-center text-white shadow-sm shrink-0 ${className}`}
      style={{ backgroundColor: tool.color || "#3B82F6" }}
      aria-hidden="true"
    >
      {React.createElement(getToolIcon(tool), { className: s.icon, strokeWidth: 2.2 })}
    </div>
  );
}

