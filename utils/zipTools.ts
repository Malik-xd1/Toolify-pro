import JSZip from "jszip";

export interface ZipEntryItem {
  name: string;
  size: number;
  date: Date;
  dir: boolean;
}

export async function createZipArchive(
  files: File[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    zip.file(file.name, arrayBuffer);
  }

  return await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) onProgress(Math.round(metadata.percent));
    }
  );
}

export async function readZipArchive(zipFile: File): Promise<{
  entries: ZipEntryItem[];
  extractFile: (filename: string) => Promise<Blob>;
  extractAllFiles: (onProgress?: (current: number, total: number) => void) => Promise<{ name: string; blob: Blob }[]>;
}> {
  const arrayBuffer = await zipFile.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const entries: ZipEntryItem[] = [];

  zip.forEach((relativePath, fileObj) => {
    entries.push({
      name: relativePath,
      size: (fileObj as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize || 0,
      date: fileObj.date || new Date(),
      dir: fileObj.dir,
    });
  });

  const extractFile = async (filename: string): Promise<Blob> => {
    const file = zip.file(filename);
    if (!file) throw new Error("File not found inside archive");
    return await file.async("blob");
  };

  const extractAllFiles = async (
    onProgress?: (current: number, total: number) => void
  ): Promise<{ name: string; blob: Blob }[]> => {
    const nonDirFiles = entries.filter((e) => !e.dir);
    const results: { name: string; blob: Blob }[] = [];
    let count = 0;

    for (const entry of nonDirFiles) {
      const file = zip.file(entry.name);
      if (file) {
        const blob = await file.async("blob");
        results.push({ name: entry.name, blob });
      }
      count++;
      if (onProgress) onProgress(count, nonDirFiles.length);
    }

    return results;
  };

  return { entries, extractFile, extractAllFiles };
}
