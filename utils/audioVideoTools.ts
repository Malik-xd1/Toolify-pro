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

export interface VideoCompressOptions {
  quality?: "high" | "medium" | "low";
  resolution?: "original" | "1080p" | "720p" | "480p" | "360p";
  fps?: number;
  speed?: number;
  onProgress?: (progress: number) => void;
}

export interface VideoCompressResult {
  blob: Blob;
  url: string;
  originalSize: number;
  newSize: number;
  reductionPercentage: number;
  duration: number;
  width: number;
  height: number;
  mimeType: string;
}

// Client-side video compressor using HTML5 Video, Canvas and MediaRecorder
export async function compressVideo(
  file: File,
  options: VideoCompressOptions = {}
): Promise<VideoCompressResult> {
  const {
    quality = "medium",
    resolution = "720p",
    fps = 30,
    speed = 2.0,
    onProgress,
  } = options;

  if (typeof window === "undefined") {
    throw new Error("Video compression requires a browser environment");
  }

  const videoUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = videoUrl;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () =>
        reject(new Error("Unable to decode video metadata. The format may not be supported by your browser."));
    });

    const origW = video.videoWidth || 1280;
    const origH = video.videoHeight || 720;
    const duration = video.duration || 1;

    let maxH = origH;
    if (resolution === "1080p") maxH = 1080;
    else if (resolution === "720p") maxH = 720;
    else if (resolution === "480p") maxH = 480;
    else if (resolution === "360p") maxH = 360;
    else if (resolution === "original") maxH = Math.min(origH, 1920);

    let targetW = origW;
    let targetH = origH;
    if (targetH > maxH) {
      targetW = Math.round((targetW * maxH) / targetH);
      targetH = maxH;
    }
    // Must be even integers for video encoding
    targetW = targetW - (targetW % 2);
    targetH = targetH - (targetH % 2);
    if (targetW < 64) targetW = 64;
    if (targetH < 64) targetH = 64;

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Could not initialize 2D canvas context");

    // Bitrate calculation based on quality and resolution
    let targetBitrate = 1_200_000;
    if (quality === "high") targetBitrate = 2_200_000;
    else if (quality === "low") targetBitrate = 550_000;

    if (targetH <= 480) {
      targetBitrate = Math.min(targetBitrate, 800_000);
    }
    if (targetH <= 360) {
      targetBitrate = Math.min(targetBitrate, 450_000);
    }

    if (duration > 0 && file.size > 0) {
      const origBitrate = (file.size * 8) / duration;
      const ratio = quality === "high" ? 0.75 : quality === "medium" ? 0.5 : 0.35;
      targetBitrate = Math.min(targetBitrate, Math.max(250_000, Math.round(origBitrate * ratio)));
    }

    const stream = canvas.captureStream(fps);

    // Capture audio if possible
    let audioCtx: AudioContext | null = null;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) {
          stream.addTrack(audioTrack);
        }
      }
    } catch {
      // Audio capture fallback
    }

    // Determine supported mime type
    const mimeCandidates = [
      "video/mp4;codecs=avc1,mp4a.40.2",
      "video/mp4",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    let chosenMime =
      mimeCandidates.find(
        (m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)
      ) || "";

    const recorderOptions: MediaRecorderOptions = {
      videoBitsPerSecond: targetBitrate,
    };
    if (chosenMime) {
      recorderOptions.mimeType = chosenMime;
    }

    const recorder = new MediaRecorder(stream, recorderOptions);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    const playbackRate = Math.min(4.0, Math.max(1.0, speed));
    video.playbackRate = playbackRate;

    await video.play();
    recorder.start(100);

    let animationId: number;
    let isDrawing = true;

    const renderLoop = () => {
      if (!isDrawing) return;
      if (!video.paused && !video.ended) {
        ctx.drawImage(video, 0, 0, targetW, targetH);
        if (onProgress && video.duration > 0) {
          const p = Math.min(99, Math.round((video.currentTime / video.duration) * 100));
          onProgress(p);
        }
      }
      animationId = requestAnimationFrame(renderLoop);
    };
    animationId = requestAnimationFrame(renderLoop);

    await new Promise<void>((resolve, reject) => {
      video.onended = () => {
        isDrawing = false;
        cancelAnimationFrame(animationId);
        try {
          ctx.drawImage(video, 0, 0, targetW, targetH);
        } catch {}
        if (recorder.state !== "inactive") {
          recorder.onstop = () => resolve();
          recorder.stop();
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        isDrawing = false;
        cancelAnimationFrame(animationId);
        if (recorder.state !== "inactive") recorder.stop();
        reject(new Error("Video playback error during compression"));
      };
    });

    if (audioCtx) {
      try {
        await audioCtx.close();
      } catch {}
    }
    stream.getTracks().forEach((t) => t.stop());

    let finalBlob = new Blob(chunks, {
      type: chosenMime.includes("mp4") ? "video/mp4" : "video/webm",
    });

    if (finalBlob.size === 0) {
      finalBlob = file;
    }

    const originalSize = file.size;
    const newSize = finalBlob.size;
    const reductionPercentage = Math.round(((originalSize - newSize) / originalSize) * 100);

    return {
      blob: finalBlob,
      url: URL.createObjectURL(finalBlob),
      originalSize,
      newSize,
      reductionPercentage,
      duration,
      width: targetW,
      height: targetH,
      mimeType: finalBlob.type,
    };
  } finally {
    URL.revokeObjectURL(videoUrl);
  }
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