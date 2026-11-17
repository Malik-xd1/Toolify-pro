"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  FolderPlus,
  Upload,
  Download,
  Trash2,
  Eye,
  Edit2,
  FileText,
  Image as ImageIcon,
  Video,
  FileCheck,
  File,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Copy,
  Check,
  ArrowRight,
  Folder,
  DatabaseBackup,
} from "lucide-react";
import {
  LockerEngine,
  LockerFile,
  LockerMeta,
} from "@/utils/storage";

interface FileLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FileLockerModal({ isOpen, onClose }: FileLockerModalProps) {
  // Locker State
  const [hasLocker, setHasLocker] = useState<boolean | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [meta, setMeta] = useState<LockerMeta | null>(null);
  const [files, setFiles] = useState<LockerFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Setup / Unlock form
  const [passwordInput, setPasswordInput] = useState("");
  const [recoveryInput, setRecoveryInput] = useState("");
  const [showRecoverySetup, setShowRecoverySetup] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Active Category & Folder Tab
  const [activeTab, setActiveTab] = useState<"all" | "pdf" | "video" | "image" | "document" | "folders">("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);

  // Search in locker
  const [searchQuery, setSearchQuery] = useState("");

  // Preview State
  const [previewFile, setPreviewFile] = useState<{
    file: LockerFile;
    url: string;
  } | null>(null);

  // File rename state
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editFileName, setEditFileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const vaultImportRef = useRef<HTMLInputElement>(null);

  // Load locker status on mount
  useEffect(() => {
    if (isOpen) {
      checkLockerStatus();
    }
  }, [isOpen]);

  const checkLockerStatus = async () => {
    try {
      const existingMeta = await LockerEngine.getLockerMeta();
      setHasLocker(!!existingMeta);
      setMeta(existingMeta);
      setIsUnlocked(LockerEngine.isUnlocked());

      if (LockerEngine.isUnlocked()) {
        await refreshFiles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const refreshFiles = async () => {
    const list = await LockerEngine.listFiles();
    setFiles(list.sort((a, b) => b.createdAt - a.createdAt));
  };

  // Create new locker
  const handleCreateLocker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const newMeta = await LockerEngine.createLocker(passwordInput);
      setMeta(newMeta);
      setHasLocker(true);
      setIsUnlocked(true);
      setShowRecoverySetup(true);
      await refreshFiles();
    } catch {
      setErrorMessage("Failed to create secure locker");
    } finally {
      setLoading(false);
    }
  };

  // Unlock existing locker
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const cred = recoveryInput.trim() || passwordInput.trim();
    if (!cred) {
      setErrorMessage("Please enter your Master Password or Recovery Key");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const success = await LockerEngine.unlock(cred);
      if (success) {
        setIsUnlocked(true);
        setPasswordInput("");
        setRecoveryInput("");
        await refreshFiles();
      } else {
        setErrorMessage("Invalid password or recovery key. Try again.");
      }
    } catch {
      setErrorMessage("Failed to unlock locker");
    } finally {
      setLoading(false);
    }
  };

  // Lock Vault
  const handleLockVault = () => {
    LockerEngine.lock();
    setIsUnlocked(false);
    setFiles([]);
    setPreviewFile(null);
  };

  // Upload and encrypt files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setLoading(true);
    setErrorMessage("");
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        await LockerEngine.saveFile(
          selectedFiles[i],
          selectedFolder || undefined
        );
      }
      setSuccessMessage("Files encrypted and stored in private vault!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await refreshFiles();
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "Failed to encrypt and store file");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Decrypt and preview file
  const handlePreview = async (file: LockerFile) => {
    try {
      setLoading(true);
      const decryptedBlob = await LockerEngine.decryptFile(file);
      const url = URL.createObjectURL(decryptedBlob);
      setPreviewFile({ file, url });
    } catch {
      setErrorMessage("Failed to decrypt file");
    } finally {
      setLoading(false);
    }
  };

  // Decrypt and download file
  const handleDownload = async (file: LockerFile) => {
    try {
      const decryptedBlob = await LockerEngine.decryptFile(file);
      const url = URL.createObjectURL(decryptedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setErrorMessage("Failed to decrypt file for download");
    }
  };

  // Delete file
  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this encrypted file?")) {
      await LockerEngine.deleteFile(id);
      await refreshFiles();
    }
  };

  // Rename file
  const handleSaveRename = async (id: string) => {
    if (!editFileName.trim()) return;
    await LockerEngine.renameFile(id, editFileName.trim());
    setEditingFileId(null);
    await refreshFiles();
  };

  // Create folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await LockerEngine.createFolder(newFolderName.trim());
    setNewFolderName("");
    setShowNewFolderModal(false);
    const updatedMeta = await LockerEngine.getLockerMeta();
    setMeta(updatedMeta);
  };

  // Export encrypted backup vault
  const handleExportVault = async () => {
    const backupJson = await LockerEngine.exportVault();
    const blob = new Blob([backupJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `YourTools-Vault-${meta?.lockerId || "Backup"}.vault`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Import vault backup
  const handleImportVault = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const text = await file.text();
      const success = await LockerEngine.importVault(text);
      if (success) {
        setSuccessMessage("Vault imported successfully! Enter your password to unlock.");
        await checkLockerStatus();
      } else {
        setErrorMessage("Invalid vault backup file");
      }
    } catch {
      setErrorMessage("Failed to import vault file");
    } finally {
      setLoading(false);
    }
  };

  // Copy Recovery Key
  const handleCopyRecoveryKey = () => {
    if (meta?.recoveryKey) {
      navigator.clipboard.writeText(meta.recoveryKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  // Calculate storage usage
  const totalBytesUsed = files.reduce((acc, f) => acc + f.size, 0);
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Filter files by active tab and search
  const filteredFiles = files.filter((f) => {
    const matchesCategory =
      activeTab === "all" ||
      (activeTab === "pdf" && f.category === "pdf") ||
      (activeTab === "video" && f.category === "video") ||
      (activeTab === "image" && f.category === "image") ||
      (activeTab === "document" && f.category === "document") ||
      (activeTab === "folders" && (selectedFolder ? f.folder === selectedFolder : true));

    const matchesSearch =
      !searchQuery.trim() ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (cat: LockerFile["category"]) => {
    switch (cat) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-purple-500" />;
      case "video":
        return <Video className="w-5 h-5 text-blue-500" />;
      case "document":
        return <FileCheck className="w-5 h-5 text-emerald-500" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#070d24] border border-blue-900/60 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-blue-950 flex items-center justify-between gap-4 bg-[#091233]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Anonymous Secure File Locker
                </h2>
                {isUnlocked && meta && (
                  <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono px-2 py-0.5 rounded-full">
                    {meta.lockerId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Client-Side AES-256-GCM Zero-Knowledge Encryption • No Account Required
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={handleLockVault}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Lock Vault</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Notification Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* VIEW 1: Recovery Key Display (One-time right after setup) */}
          {showRecoverySetup && meta && (
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold mb-2">
                <KeyRound className="w-5 h-5" />
                <span>Important: Save Your 12-Word Recovery Key</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Since YourTools does not collect accounts or emails, this recovery
                key is the <strong className="text-white">only way</strong> to
                restore your vault if you forget your master password or clear
                your browser cache.
              </p>

              <div className="p-3.5 bg-black/60 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 break-all select-all flex items-center justify-between gap-3">
                <span>{meta.recoveryKey}</span>
                <button
                  onClick={handleCopyRecoveryKey}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-all"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowRecoverySetup(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all"
                >
                  I Have Saved It, Proceed to Locker →
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: Locker Locked (Enter Password / Create Locker) */}
          {!isUnlocked && (
            <div className="max-w-md mx-auto py-8 text-center">
              <div className="w-18 h-18 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-lg shadow-blue-500/10">
                <ShieldAlert className="w-9 h-9" />
              </div>

              {hasLocker ? (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Unlock Your Private Vault
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Enter your Master Password or your 12-word Recovery Key to
                    decrypt and access your files.
                  </p>

                  <form onSubmit={handleUnlock} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Master Password or Recovery Key
                      </label>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>{loading ? "Decrypting..." : "Unlock Vault"}</span>
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                    <button
                      onClick={() => {
                        const rec = prompt("Paste your 12-word recovery key:");
                        if (rec) {
                          setRecoveryInput(rec);
                          LockerEngine.unlock(rec).then((ok) => {
                            if (ok) {
                              setIsUnlocked(true);
                              refreshFiles();
                            } else {
                              alert("Invalid recovery key");
                            }
                          });
                        }
                      }}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Forgot password? Use Recovery Key
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Create Your Anonymous Vault
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Choose a Master Password. Your private vault will be
                    encrypted with 256-bit AES-GCM directly inside your browser.
                  </p>

                  <form onSubmit={handleCreateLocker} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Choose Master Password (min. 6 characters)
                      </label>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Choose a strong password..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{loading ? "Generating Vault..." : "Create Secure Locker"}</span>
                    </button>
                  </form>
                </>
              )}

              {/* Import Existing Vault Backup */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <input
                  type="file"
                  ref={vaultImportRef}
                  onChange={handleImportVault}
                  accept=".vault,.json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => vaultImportRef.current?.click()}
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <DatabaseBackup className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Restore from a .vault Backup File</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: Unlocked Vault Management */}
          {isUnlocked && (
            <div className="space-y-6">
              {/* Top Controls Bar: Storage & Action Buttons */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Storage Quota Usage */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-cyan-400">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-300">
                      Encrypted Storage Usage
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{formatBytes(totalBytesUsed)}</span>
                      <span className="text-xs text-slate-500 font-normal">
                        ({files.length} file{files.length === 1 ? "" : "s"})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Upload, Add Folder, Export Vault */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* File Upload Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Encrypt</span>
                  </button>

                  <button
                    onClick={() => setShowNewFolderModal(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>New Folder</span>
                  </button>

                  <button
                    onClick={handleExportVault}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                    title="Export encrypted vault backup file to move to another device"
                  >
                    <DatabaseBackup className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export Backup</span>
                  </button>
                </div>
              </div>

              {/* Locker Category Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-semibold">
                  <button
                    onClick={() => {
                      setActiveTab("all");
                      setSelectedFolder(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      activeTab === "all"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    All Files ({files.length})
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("pdf");
                      setSelectedFolder(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      activeTab === "pdf"
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF Locker</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("video");
                      setSelectedFolder(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      activeTab === "video"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Locker</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("image");
                      setSelectedFolder(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      activeTab === "image"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image Locker</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("document");
                      setSelectedFolder(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      activeTab === "document"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Doc Locker</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("folders")}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      activeTab === "folders"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span>Folders</span>
                  </button>
                </div>

                {/* Search */}
                <div className="w-full sm:w-60">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in locker..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Folders Bar (if tab is folders) */}
              {activeTab === "folders" && meta?.folders && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-slate-900/40 rounded-xl border border-slate-800">
                  {meta.folders.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFolder(selectedFolder === f.id ? null : f.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                        selectedFolder === f.id
                          ? "bg-blue-600/30 border-cyan-400 text-white"
                          : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Folder className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-semibold truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Files Table / List */}
              <div className="divide-y divide-slate-800/80 bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                        {getFileIcon(file.category)}
                      </div>

                      <div className="min-w-0">
                        {editingFileId === file.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editFileName}
                              onChange={(e) => setEditFileName(e.target.value)}
                              className="bg-slate-950 border border-cyan-400 rounded px-2 py-0.5 text-xs text-white outline-none"
                            />
                            <button
                              onClick={() => handleSaveRename(file.id)}
                              className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm font-semibold text-white truncate">
                            {file.name}
                          </div>
                        )}
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          {file.folder && (
                            <>
                              <span>•</span>
                              <span className="text-cyan-400 font-mono text-[10px]">
                                📁 {file.folder}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Decrypt & Preview */}
                      <button
                        onClick={() => handlePreview(file)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Decrypt & Preview"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      </button>

                      {/* Decrypt & Download */}
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Decrypt & Download"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                      </button>

                      {/* Rename */}
                      <button
                        onClick={() => {
                          setEditingFileId(file.id);
                          setEditFileName(file.name);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-300 transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredFiles.length === 0 && (
                  <div className="py-16 text-center text-slate-500">
                    <Lock className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-400">
                      No encrypted files found in this category
                    </p>
                    <p className="text-xs mt-1">
                      Click &ldquo;Upload &amp; Encrypt&rdquo; to add private PDFs, images, videos, or documents.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Decrypted File Preview Lightbox */}
          {previewFile && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden text-white">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold truncate">
                      {previewFile.file.name} (Decrypted Preview)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(previewFile.file)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setPreviewFile(null)}
                      className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
                  {previewFile.file.category === "image" && (
                    <img
                      src={previewFile.url}
                      alt={previewFile.file.name}
                      className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-xl"
                    />
                  )}
                  {previewFile.file.category === "video" && (
                    <video
                      src={previewFile.url}
                      controls
                      autoPlay
                      className="max-h-[60vh] max-w-full rounded-lg shadow-xl"
                    />
                  )}
                  {previewFile.file.category === "pdf" && (
                    <iframe
                      src={previewFile.url}
                      className="w-full h-[65vh] rounded-lg border border-slate-800"
                    />
                  )}
                  {previewFile.file.category === "document" && (
                    <iframe
                      src={previewFile.url}
                      className="w-full h-[60vh] rounded-lg border border-slate-800 bg-white"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* New Folder Modal */}
          {showNewFolderModal && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-white">
                <h4 className="text-base font-bold mb-3 flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-cyan-400" />
                  <span>Create New Folder</span>
                </h4>
                <form onSubmit={handleCreateFolder} className="space-y-4">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name (e.g. Tax Returns)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewFolderModal(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
