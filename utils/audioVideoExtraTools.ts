// Audio & Video Extra Tools Suite for ToolifyPro

export async function mergeAudioFiles(files: File[]): Promise<Blob> {
  const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const buffers: AudioBuffer[] = [];

  for (const f of files) {
    const arrayBuffer = await f.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    buffers.push(decoded);
  }

  const numChannels = Math.max(...buffers.map((b) => b.numberOfChannels));
  const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
  const sampleRate = buffers[0].sampleRate;

  const merged = audioCtx.createBuffer(numChannels, totalLength, sampleRate);

  for (let ch = 0; ch < numChannels; ch++) {
    const channelData = merged.getChannelData(ch);
    let offset = 0;
    for (const b of buffers) {
      if (ch < b.numberOfChannels) {
        channelData.set(b.getChannelData(ch), offset);
      }
      offset += b.length;
    }
  }

  return audioBufferToWav(merged);
}

export async function compressAudioFile(file: File, targetSampleRate: number = 22050): Promise<Blob> {
  const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);

  // Render to lower sample rate offline
  const offlineCtx = new OfflineAudioContext(1, (decoded.length * targetSampleRate) / decoded.sampleRate, targetSampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = decoded;
  source.connect(offlineCtx.destination);
  source.start();

  const renderedBuffer = await offlineCtx.startRendering();
  return audioBufferToWav(renderedBuffer);
}

// Convert AudioBuffer to downloadable 16-bit PCM WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  let result: Float32Array;
  if (numChannels === 2) {
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    result = new Float32Array(left.length + right.length);
    for (let i = 0; i < left.length; i++) {
      result[i * 2] = left[i];
      result[i * 2 + 1] = right[i];
    }
  } else {
    result = buffer.getChannelData(0);
  }

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = result.length * bytesPerSample;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < result.length; i++) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([view], { type: "audio/wav" });
}

export async function createVideoThumbnailWithBanner(
  file: File,
  bannerText: string = "WATCH NOW",
  timestampSec: number = 2
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(timestampSec, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context failed"));

      // Draw background video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Bottom gradient overlay
      const grad = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title banner
      ctx.font = "bold 56px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 15;
      ctx.fillText(bannerText, 60, canvas.height - 80);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Thumbnail generation failed"));
        resolve(blob);
      }, "image/jpeg", 0.95);
    };

    video.onerror = () => reject(new Error("Failed to read video"));
  });
}
