// Audio and Video Processing Utilities for Client-Side Execution

// Convert AudioBuffer to WAV ArrayBuffer
export function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  let sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit precision

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return out.buffer;
}

// Extract Audio from Video File or convert Audio to WAV
export async function extractAudioFromVideo(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);
  const wavBuffer = audioBufferToWav(decodedAudio);
  await audioCtx.close();
  return new Blob([wavBuffer], { type: "audio/wav" });
}

// Slice AudioBuffer between start and end seconds
export async function trimAudio(file: File, startSec: number, endSec: number): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);

  const sampleRate = decoded.sampleRate;
  const startOffset = Math.max(0, Math.floor(startSec * sampleRate));
  const endOffset = Math.min(decoded.length, Math.floor(endSec * sampleRate));
  const frameCount = Math.max(1, endOffset - startOffset);

  const trimmedBuffer = audioCtx.createBuffer(
    decoded.numberOfChannels,
    frameCount,
    sampleRate
  );

  for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
    const channelData = decoded.getChannelData(channel);
    const trimmedData = trimmedBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      trimmedData[i] = channelData[startOffset + i];
    }
  }

  const wavData = audioBufferToWav(trimmedBuffer);
  await audioCtx.close();
  return new Blob([wavData], { type: "audio/wav" });
}

// Capture frame from video at specific time
export function captureVideoFrame(
  videoElement: HTMLVideoElement,
  format: "image/png" | "image/jpeg" = "image/png"
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 360;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Frame capture failed"));
    }, format);
  });
}

import { encodeGifAnimation } from "./gifEncoder";

/**
 * Truly compresses video client-side by resizing frame resolution and re-encoding at lower bitrate
 */
export async function compressVideo(
  file: File,
  targetResolution: "720p" | "480p" | "360p" = "720p",
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    video.onloadedmetadata = () => {
      let targetW = video.videoWidth || 1280;
      let targetH = video.videoHeight || 720;
      const aspect = targetW / targetH;

      if (targetResolution === "480p") {
        targetH = 480;
        targetW = Math.round(480 * aspect);
      } else if (targetResolution === "360p") {
        targetH = 360;
        targetW = Math.round(360 * aspect);
      } else if (targetH > 720) {
        targetH = 720;
        targetW = Math.round(720 * aspect);
      }
      targetW = targetW % 2 === 0 ? targetW : targetW - 1;
      targetH = targetH % 2 === 0 ? targetH : targetH - 1;

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas context failed"));
      }

      const stream = canvas.captureStream(24);
      let mimeType = "video/webm;codecs=vp8";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/mp4";
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: targetResolution === "360p" ? 500000 : 900000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(url);
        const compressedBlob = new Blob(chunks, { type: mimeType });
        resolve(compressedBlob);
      };

      let animId: number;
      const drawFrame = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, targetW, targetH);
        if (onProgress && video.duration > 0) {
          onProgress(Math.min(95, Math.round((video.currentTime / video.duration) * 90)));
        }
        animId = requestAnimationFrame(drawFrame);
      };

      video.onended = () => {
        cancelAnimationFrame(animId);
        recorder.stop();
      };

      recorder.start(100);
      video.play().then(() => {
        drawFrame();
      }).catch(reject);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read video for compression"));
    };
  });
}

/**
 * Truly mutes video by re-encoding canvas stream without audio tracks
 */
export async function muteVideo(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas context failed"));
      }

      const stream = canvas.captureStream(30);
      let mimeType = "video/webm;codecs=vp8";
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(url);
        resolve(new Blob(chunks, { type: mimeType }));
      };

      let animId: number;
      const render = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (onProgress && video.duration > 0) {
          onProgress(Math.min(95, Math.round((video.currentTime / video.duration) * 90)));
        }
        animId = requestAnimationFrame(render);
      };

      video.onended = () => {
        cancelAnimationFrame(animId);
        recorder.stop();
      };

      recorder.start(100);
      video.play().then(render).catch(reject);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video file"));
    };
  });
}

/**
 * Changes video playback speed
 */
export async function changeVideoSpeed(
  file: File,
  speed: number = 1.5,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.playbackRate = speed;

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas context failed"));
      }

      const stream = canvas.captureStream(30);
      let mimeType = "video/webm;codecs=vp8";
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(url);
        resolve(new Blob(chunks, { type: mimeType }));
      };

      let animId: number;
      const render = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (onProgress && video.duration > 0) {
          onProgress(Math.min(95, Math.round((video.currentTime / video.duration) * 90)));
        }
        animId = requestAnimationFrame(render);
      };

      video.onended = () => {
        cancelAnimationFrame(animId);
        recorder.stop();
      };

      recorder.start(100);
      video.play().then(render).catch(reject);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to read video file"));
    };
  });
}

/**
 * Trims video between startSec and endSec
 */
export async function trimVideo(
  file: File,
  startSec: number,
  endSec: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas context failed"));
      }

      video.currentTime = Math.max(0, startSec);

      video.onseeked = () => {
        const stream = canvas.captureStream(30);
        let mimeType = "video/webm;codecs=vp8";
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm";

        const recorder = new MediaRecorder(stream, { mimeType });
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          URL.revokeObjectURL(url);
          resolve(new Blob(chunks, { type: mimeType }));
        };

        const targetEnd = Math.min(video.duration, endSec > startSec ? endSec : startSec + 5);
        let animId: number;

        const render = () => {
          if (video.currentTime >= targetEnd || video.ended) {
            cancelAnimationFrame(animId);
            video.pause();
            recorder.stop();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (onProgress) {
            const span = targetEnd - startSec;
            onProgress(Math.min(95, Math.round(((video.currentTime - startSec) / span) * 90)));
          }
          animId = requestAnimationFrame(render);
        };

        recorder.start(100);
        video.play().then(render).catch(reject);
      };
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video file for trimming"));
    };
  });
}

/**
 * Converts video clip into an animated GIF89a file
 */
export async function convertVideoToGif(
  file: File,
  options: { maxFrames?: number; targetWidth?: number } = {},
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const maxFrames = options.maxFrames || 16;
      const duration = Math.min(6, video.duration);
      const targetWidth = options.targetWidth || 320;
      const aspect = (video.videoHeight || 240) / (video.videoWidth || 320);
      const targetHeight = Math.round(targetWidth * aspect);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas context failed"));
      }

      const frameImages: ImageData[] = [];
      const interval = duration / maxFrames;
      let frameIndex = 0;

      const captureNext = () => {
        if (frameIndex >= maxFrames) {
          URL.revokeObjectURL(url);
          if (onProgress) onProgress(80);
          try {
            const gifBlob = encodeGifAnimation(frameImages, targetWidth, targetHeight, Math.round(interval * 1000));
            if (onProgress) onProgress(100);
            resolve(gifBlob);
          } catch (e) {
            reject(e);
          }
          return;
        }

        video.currentTime = frameIndex * interval;
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        frameImages.push(imgData);
        frameIndex++;
        if (onProgress) onProgress(Math.round((frameIndex / maxFrames) * 75));
        captureNext();
      };

      captureNext();
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video for GIF conversion"));
    };
  });
}
