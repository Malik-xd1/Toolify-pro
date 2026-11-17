export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  badge?: string;
  popular?: boolean;
  searchKeywords?: string[];
  color?: string;
}

export type ToolCategory =
  | "pdf"
  | "conversion"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "zip"
  | "qr"
  | "developer"
  | "security"
  | "locker"
  | "more";

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
  bgColor: string;
  accentColor: string;
  borderColor: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    description: "Merge, split, compress and more...",
    iconName: "FileText",
    bgColor: "bg-red-500",
    accentColor: "text-red-500",
    borderColor: "border-red-200 dark:border-red-900/30",
  },
  {
    id: "conversion",
    name: "File Converter",
    description: "Convert between multiple formats",
    iconName: "ArrowLeftRight",
    bgColor: "bg-teal-500",
    accentColor: "text-teal-500",
    borderColor: "border-teal-200 dark:border-teal-900/30",
  },
  {
    id: "image",
    name: "Image Tools",
    description: "Edit, resize, convert and enhance",
    iconName: "Image",
    bgColor: "bg-purple-500",
    accentColor: "text-purple-500",
    borderColor: "border-purple-200 dark:border-purple-900/30",
  },
  {
    id: "video",
    name: "Video Tools",
    description: "Compress, trim, convert and more",
    iconName: "Video",
    bgColor: "bg-blue-500",
    accentColor: "text-blue-500",
    borderColor: "border-blue-200 dark:border-blue-900/30",
  },
  {
    id: "audio",
    name: "Audio Tools",
    description: "Convert, edit and manage audio",
    iconName: "Headphones",
    bgColor: "bg-orange-500",
    accentColor: "text-orange-500",
    borderColor: "border-orange-200 dark:border-orange-900/30",
  },
  {
    id: "document",
    name: "Document Tools",
    description: "Word count, edit and more",
    iconName: "FileCheck",
    bgColor: "bg-emerald-500",
    accentColor: "text-emerald-500",
    borderColor: "border-emerald-200 dark:border-emerald-900/30",
  },
  {
    id: "zip",
    name: "ZIP & Archive",
    description: "Compress and extract files",
    iconName: "Archive",
    bgColor: "bg-indigo-500",
    accentColor: "text-indigo-500",
    borderColor: "border-indigo-200 dark:border-indigo-900/30",
  },
  {
    id: "qr",
    name: "QR Code Tools",
    description: "Generate and scan QR codes",
    iconName: "QrCode",
    bgColor: "bg-cyan-500",
    accentColor: "text-cyan-500",
    borderColor: "border-cyan-200 dark:border-cyan-900/30",
  },
  {
    id: "developer",
    name: "Developer Tools",
    description: "JSON, HTML, and more utilities",
    iconName: "Code",
    bgColor: "bg-amber-500",
    accentColor: "text-amber-500",
    borderColor: "border-amber-200 dark:border-amber-900/30",
  },
  {
    id: "security",
    name: "Security Tools",
    description: "Encrypt, hash and protect your files",
    iconName: "ShieldCheck",
    bgColor: "bg-emerald-600",
    accentColor: "text-emerald-600",
    borderColor: "border-emerald-300 dark:border-emerald-900/30",
  },
  {
    id: "locker",
    name: "File Locker",
    description: "Store your files securely",
    iconName: "Lock",
    bgColor: "bg-blue-600",
    accentColor: "text-blue-600",
    borderColor: "border-blue-200 dark:border-blue-900/30",
  },
  {
    id: "more",
    name: "More Tools",
    description: "And many more tools...",
    iconName: "LayoutGrid",
    bgColor: "bg-sky-500",
    accentColor: "text-sky-500",
    borderColor: "border-sky-200 dark:border-sky-900/30",
  },
];

export const TOOLS: Tool[] = [
  // PDF TOOLS
  {
    id: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    description: "Combine multiple PDF files in any order you choose into one single file.",
    popular: true,
    searchKeywords: ["combine", "join", "pdf", "merge"],
    color: "#EF4444",
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    description: "Separate pages or extract specific page ranges from your PDF.",
    popular: true,
    searchKeywords: ["extract", "cut", "separate", "split"],
    color: "#EF4444",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    description: "Reduce the file size of your PDF while maintaining optimal visual quality.",
    popular: true,
    searchKeywords: ["shrink", "reduce", "size", "compress"],
    color: "#EF4444",
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    category: "pdf",
    description: "Extract clean, editable text and doc structure from your PDF document.",
    popular: true,
    searchKeywords: ["doc", "docx", "word", "convert"],
    color: "#EF4444",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    category: "pdf",
    description: "Convert text and formatted documents directly into standard PDF files.",
    popular: true,
    searchKeywords: ["docx", "doc", "make pdf"],
    color: "#EF4444",
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    category: "pdf",
    description: "Convert JPG, PNG, and WebP images into a clean multi-page or single PDF.",
    popular: true,
    searchKeywords: ["jpg to pdf", "png to pdf", "photos to pdf"],
    color: "#EF4444",
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    category: "pdf",
    description: "Render and extract PDF pages into high quality image files.",
    searchKeywords: ["pdf to jpg", "pdf to png"],
    color: "#EF4444",
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    category: "pdf",
    description: "Rotate all pages or specific pages of your PDF 90, 180, or 270 degrees.",
    searchKeywords: ["orient", "turn", "landscape", "portrait"],
    color: "#EF4444",
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    category: "pdf",
    description: "Encrypt your PDF with a strong password to prevent unauthorized reading.",
    searchKeywords: ["lock", "encrypt", "password", "secure"],
    color: "#EF4444",
  },
  {
    id: "add-watermark-pdf",
    name: "Add Watermark",
    category: "pdf",
    description: "Stamp customized text, dates, or confidential marks on PDF pages.",
    searchKeywords: ["stamp", "watermark", "protect", "brand"],
    color: "#EF4444",
  },
  {
    id: "page-numbers-pdf",
    name: "Add Page Numbers",
    category: "pdf",
    description: "Number the pages of your PDF document with customizable position and font.",
    searchKeywords: ["numbering", "footer", "header"],
    color: "#EF4444",
  },
  {
    id: "remove-pages-pdf",
    name: "Remove Pages",
    category: "pdf",
    description: "Delete unwanted pages from your PDF and download the clean document.",
    searchKeywords: ["delete pages", "cut pages"],
    color: "#EF4444",
  },
  {
    id: "pdf-to-text",
    name: "PDF to Text",
    category: "pdf",
    description: "Extract readable raw text from your PDF file.",
    searchKeywords: ["ocr", "read pdf", "txt"],
    color: "#EF4444",
  },

  // IMAGE TOOLS
  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    category: "image",
    description: "Convert JPG photos into lossless PNG format with transparent support.",
    popular: true,
    searchKeywords: ["jpeg", "png", "convert", "image"],
    color: "#3B82F6",
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG",
    category: "image",
    description: "Convert PNG images to compact JPG images with quality optimization.",
    popular: true,
    searchKeywords: ["png", "jpg", "jpeg"],
    color: "#3B82F6",
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    category: "image",
    description: "Compress JPG, PNG, and WebP images with real-time size reduction comparison.",
    popular: true,
    searchKeywords: ["reduce image size", "compress photo", "optimize"],
    color: "#8B5CF6",
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    category: "image",
    description: "Resize photos by dimensions or percentage while maintaining aspect ratio.",
    searchKeywords: ["dimensions", "scale", "width", "height"],
    color: "#8B5CF6",
  },
  {
    id: "image-cropper",
    name: "Image Cropper",
    category: "image",
    description: "Crop photos with custom aspect ratios (1:1, 16:9, 4:3, freeform).",
    searchKeywords: ["cut image", "crop photo", "aspect ratio"],
    color: "#8B5CF6",
  },
  {
    id: "webp-converter",
    name: "WebP Converter",
    category: "image",
    description: "Convert images to and from modern next-gen WebP format.",
    searchKeywords: ["webp", "next-gen", "convert"],
    color: "#8B5CF6",
  },
  {
    id: "image-watermark",
    name: "Image Watermark",
    category: "image",
    description: "Add custom copyright or text watermarks to your pictures.",
    searchKeywords: ["copyright", "stamp", "watermark"],
    color: "#8B5CF6",
  },
  {
    id: "image-filters",
    name: "Image Filters & Effects",
    category: "image",
    description: "Adjust brightness, contrast, grayscale, sepia, saturation, and invert colors.",
    searchKeywords: ["edit", "effects", "black and white", "vintage"],
    color: "#8B5CF6",
  },
  {
    id: "favicon-generator",
    name: "Favicon Generator",
    category: "image",
    description: "Generate complete favicon package (16x16, 32x32, 48x48, 64x64, 128x128).",
    searchKeywords: ["icon", "website icon", "ico", "favicon"],
    color: "#8B5CF6",
  },
  {
    id: "color-picker",
    name: "Image Color Picker",
    category: "image",
    description: "Extract color palettes and hex codes directly from any uploaded image.",
    searchKeywords: ["eyedropper", "palette", "hex", "colors"],
    color: "#8B5CF6",
  },
  {
    id: "image-metadata",
    name: "Image Metadata Viewer",
    category: "image",
    description: "Inspect resolution, color depth, file size, MIME type, and dimensions.",
    searchKeywords: ["exif", "info", "metadata", "properties"],
    color: "#8B5CF6",
  },

  // VIDEO TOOLS
  {
    id: "video-compressor",
    name: "Video Compressor",
    category: "video",
    description: "Compress video files by downscaling and reducing bitrate for easier sharing.",
    popular: true,
    searchKeywords: ["compress video", "shrink mp4", "reduce video size"],
    color: "#10B981",
  },
  {
    id: "mp4-to-mp3",
    name: "MP4 to MP3",
    category: "video",
    description: "Extract high-quality audio tracks directly from your video files.",
    popular: true,
    searchKeywords: ["extract audio", "video to mp3", "audio rip"],
    color: "#8B5CF6",
  },
  {
    id: "video-trimmer",
    name: "Video Trimmer",
    category: "video",
    description: "Trim start and end points of videos with precise interactive timestamp preview.",
    searchKeywords: ["cut video", "shorten", "clip", "trim"],
    color: "#3B82F6",
  },
  {
    id: "video-frame-extractor",
    name: "Video Frame Extractor",
    category: "video",
    description: "Capture high resolution still image frames from any moment in a video.",
    searchKeywords: ["snapshot", "screenshot video", "frame grab"],
    color: "#3B82F6",
  },
  {
    id: "video-speed",
    name: "Video Speed Controller",
    category: "video",
    description: "Speed up or slow down video playback from 0.25x up to 4x.",
    searchKeywords: ["fast motion", "slow motion", "speed up"],
    color: "#3B82F6",
  },
  {
    id: "mute-video",
    name: "Mute Video (Remove Audio)",
    category: "video",
    description: "Strip the audio track from video files cleanly.",
    searchKeywords: ["silent video", "remove sound", "strip audio"],
    color: "#3B82F6",
  },

  // AUDIO TOOLS
  {
    id: "audio-cutter",
    name: "Audio Cutter & Trimmer",
    category: "audio",
    description: "Cut MP3 and audio tracks with precise start and end times.",
    popular: true,
    searchKeywords: ["ringtone maker", "trim mp3", "cut song"],
    color: "#F97316",
  },
  {
    id: "audio-converter",
    name: "Audio Converter",
    category: "audio",
    description: "Convert between MP3, WAV, OGG, and WebM audio formats.",
    searchKeywords: ["mp3 to wav", "wav to mp3", "audio format"],
    color: "#F97316",
  },
  {
    id: "voice-recorder",
    name: "Voice Recorder",
    category: "audio",
    description: "Record clear voice audio directly in your browser with real-time waveform.",
    searchKeywords: ["mic", "microphone", "record speech", "audio record"],
    color: "#F97316",
  },
  {
    id: "text-to-speech",
    name: "Text to Speech (TTS)",
    category: "audio",
    description: "Convert typed text into natural spoken speech using customizable voices.",
    popular: true,
    searchKeywords: ["tts", "voice synthesizer", "speak text", "narration"],
    color: "#F97316",
  },
  {
    id: "audio-speed",
    name: "Audio Speed Changer",
    category: "audio",
    description: "Change the playback speed and tempo of songs and voice recordings.",
    searchKeywords: ["tempo", "pitch", "audio speed", "slow down"],
    color: "#F97316",
  },

  // DOCUMENT & TEXT TOOLS
  {
    id: "word-counter",
    name: "Word & Character Counter",
    category: "document",
    description: "Count words, characters, sentences, paragraphs, and estimated reading time.",
    popular: true,
    searchKeywords: ["word count", "character count", "essay length"],
    color: "#10B981",
  },
  {
    id: "case-converter",
    name: "Case Converter",
    category: "document",
    description: "Switch text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case.",
    searchKeywords: ["capitalize", "lowercase", "uppercase", "camelcase"],
    color: "#10B981",
  },
  {
    id: "text-diff",
    name: "Text Diff Checker",
    category: "document",
    description: "Compare two pieces of text side-by-side with highlight differences.",
    searchKeywords: ["compare text", "diff", "text comparison"],
    color: "#10B981",
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor & Preview",
    category: "document",
    description: "Write Markdown with real-time rendered HTML preview and export to HTML.",
    searchKeywords: ["md", "markdown to html", "live preview"],
    color: "#10B981",
  },
  {
    id: "remove-duplicates",
    name: "Remove Duplicate Lines",
    category: "document",
    description: "Clean lists by stripping repeated lines and empty whitespace.",
    searchKeywords: ["dedupe", "unique lines", "clean text"],
    color: "#10B981",
  },
  {
    id: "lorem-generator",
    name: "Lorem Ipsum Generator",
    category: "document",
    description: "Generate placeholder filler text for mockups, prototypes, and layouts.",
    searchKeywords: ["dummy text", "placeholder", "filler text"],
    color: "#10B981",
  },

  // ZIP & ARCHIVE TOOLS
  {
    id: "zip-creator",
    name: "ZIP Creator",
    category: "zip",
    description: "Bundle multiple files into a clean compressed .ZIP archive.",
    popular: true,
    searchKeywords: ["zip", "compress files", "archive", "package"],
    color: "#6366F1",
  },
  {
    id: "zip-extractor",
    name: "ZIP Extractor & Viewer",
    category: "zip",
    description: "Open and browse contents of .ZIP archives, extract files individually or all at once.",
    popular: true,
    searchKeywords: ["unzip", "extract zip", "open zip"],
    color: "#6366F1",
  },

  // QR CODE TOOLS
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    category: "qr",
    description: "Generate customizable QR codes for URLs, Wi-Fi passwords, Contact Cards, Text, Phone.",
    popular: true,
    searchKeywords: ["qr", "barcode", "wifi qr", "generate qr"],
    color: "#06B6D4",
  },
  {
    id: "qr-code-scanner",
    name: "QR Code Scanner",
    category: "qr",
    description: "Scan QR codes instantly from uploaded images or your device camera.",
    searchKeywords: ["read qr", "decode qr", "scan barcode"],
    color: "#06B6D4",
  },

  // DEVELOPER TOOLS
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    category: "developer",
    description: "Beautify, validate, format, and minify JSON with syntax error highlight.",
    popular: true,
    searchKeywords: ["pretty json", "validate json", "minify json"],
    color: "#F59E0B",
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder & Decoder",
    category: "developer",
    description: "Encode text and files to Base64 or decode Base64 back to original content.",
    searchKeywords: ["base64", "encode", "decode", "b64"],
    color: "#F59E0B",
  },
  {
    id: "url-encoder",
    name: "URL Encoder & Decoder",
    category: "developer",
    description: "Encode special characters into URL-safe strings or decode URI strings.",
    searchKeywords: ["urlencode", "urldecode", "uri component"],
    color: "#F59E0B",
  },
  {
    id: "uuid-generator",
    name: "UUID / GUID Generator",
    category: "developer",
    description: "Generate cryptographically secure v4 UUIDs individually or in bulk.",
    searchKeywords: ["guid", "random id", "unique id"],
    color: "#F59E0B",
  },
  {
    id: "jwt-decoder",
    name: "JWT Token Decoder",
    category: "developer",
    description: "Decode JSON Web Tokens to inspect header and claims without exposing secrets.",
    searchKeywords: ["jwt", "token", "auth payload"],
    color: "#F59E0B",
  },

  // SECURITY TOOLS
  {
    id: "password-generator",
    name: "Password Generator",
    category: "security",
    description: "Generate highly secure, random passwords with custom symbols, numbers, and length.",
    popular: true,
    searchKeywords: ["random password", "secure password", "passphrase"],
    color: "#059669",
  },
  {
    id: "password-strength",
    name: "Password Strength Checker",
    category: "security",
    description: "Analyze password security, entropy, crack time estimation, and vulnerabilities.",
    popular: true,
    searchKeywords: ["check password", "entropy", "security audit"],
    color: "#059669",
  },
  {
    id: "hash-generator",
    name: "Hash Generator (SHA-256 / SHA-512)",
    category: "security",
    description: "Generate cryptographic hashes using SHA-256, SHA-512, SHA-384, and SHA-1.",
    searchKeywords: ["sha256", "checksum", "digest", "hash"],
    color: "#059669",
  },
  {
    id: "text-encryptor",
    name: "Text Encryptor & Decryptor",
    category: "security",
    description: "Encrypt and decrypt confidential notes with AES-256-GCM using a personal password.",
    searchKeywords: ["aes", "encrypt note", "secret text", "cipher"],
    color: "#059669",
  },

  // FILE LOCKER
  {
    id: "file-locker",
    name: "File Locker",
    category: "locker",
    description: "Zero-knowledge private vault to encrypt and store PDFs, images, and videos with password protection.",
    popular: true,
    searchKeywords: ["private vault", "secret storage", "locker", "secure files"],
    color: "#2563EB",
  },
  {
    id: "pdf-locker",
    name: "PDF Locker",
    category: "locker",
    description: "Dedicated encrypted compartment for your private PDF contracts and documents.",
    popular: true,
    searchKeywords: ["private pdf", "secure documents", "pdf vault"],
    color: "#2563EB",
  },
];
