// Image Extra Tools Suite for ToolifyPro

export async function removeImageBackground(file: File, tolerance: number = 30): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context failed"));

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample corner color as background reference (top-left pixel)
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const diff = Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        );

        if (diff < tolerance) {
          data[i + 3] = 0; // Alpha transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Background removal failed"));
        resolve(blob);
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

export async function changeImageBackground(file: File, newBgColorHex: string = "#3B82F6"): Promise<Blob> {
  const transparentPngBlob = await removeImageBackground(file, 35);
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(transparentPngBlob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context failed"));

      // Fill background
      ctx.fillStyle = newBgColorHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Export failed"));
        resolve(blob);
      }, "image/jpeg", 0.95);
    };
    img.onerror = () => reject(new Error("Failed to composite background"));
    img.src = url;
  });
}

export async function upscaleImage(file: File, factor: 2 | 4 = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth * factor;
      canvas.height = img.naturalHeight * factor;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context failed"));

      // High-quality bicubic image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Upscale failed"));
        resolve(blob);
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

export async function createPassportPhotoSheet(file: File, format: "US_2x2" | "EU_35x45" = "US_2x2"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      // Standard 4x6 inch printable sheet at 300 DPI = 1200x1800 px
      const sheet = document.createElement("canvas");
      sheet.width = 1800;
      sheet.height = 1200;
      const ctx = sheet.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context failed"));

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, sheet.width, sheet.height);

      // Photo size: 2x2 inches = 600x600 px (6 photos on a 4x6 sheet)
      const photoWidth = 520;
      const photoHeight = format === "US_2x2" ? 520 : 660;

      // Draw 2 rows of 3 photos with grid borders
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          const x = 60 + c * (photoWidth + 50);
          const y = 40 + r * (photoHeight + 40);

          // Subtle cut boundary outline
          ctx.strokeStyle = "#E5E7EB";
          ctx.lineWidth = 1;
          ctx.strokeRect(x - 2, y - 2, photoWidth + 4, photoHeight + 4);

          ctx.drawImage(img, x, y, photoWidth, photoHeight);
        }
      }

      sheet.toBlob((blob) => {
        if (!blob) return reject(new Error("Failed to generate passport sheet"));
        resolve(blob);
      }, "image/jpeg", 0.95);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}
