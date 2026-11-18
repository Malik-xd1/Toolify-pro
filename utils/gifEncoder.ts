/**
 * Pure TypeScript GIF89a Encoder
 * Creates animated, looping .gif files directly in the browser from Canvas ImageData frames.
 * Zero external dependencies.
 */

export function encodeGifAnimation(
  frames: ImageData[],
  width: number,
  height: number,
  delayMs: number = 100
): Blob {
  function lzwEncode(minCodeSize: number, pixelIndices: Uint8Array): Uint8Array {
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;
    const maxCode = 1 << 12;

    const prefixTable = new Map<string, number>();
    function resetTable() {
      prefixTable.clear();
      codeSize = minCodeSize + 1;
      nextCode = eoiCode + 1;
    }

    const outputCodes: number[] = [clearCode];
    let curPrefix = "";

    for (let i = 0; i < pixelIndices.length; i++) {
      const k = pixelIndices[i];
      const entry = curPrefix === "" ? "" + k : curPrefix + "," + k;

      if (prefixTable.has(entry)) {
        curPrefix = entry;
      } else {
        if (curPrefix === "") {
          outputCodes.push(k);
        } else {
          outputCodes.push(prefixTable.get(curPrefix)!);
        }

        if (nextCode < maxCode) {
          prefixTable.set(entry, nextCode++);
          if (nextCode > (1 << codeSize) && codeSize < 12) {
            codeSize++;
          }
        } else {
          outputCodes.push(clearCode);
          resetTable();
        }

        curPrefix = "" + k;
      }
    }

    if (curPrefix !== "") {
      if (curPrefix.includes(",")) {
        outputCodes.push(prefixTable.get(curPrefix)!);
      } else {
        outputCodes.push(parseInt(curPrefix, 10));
      }
    }
    outputCodes.push(eoiCode);

    // Pack codes into bit stream
    const bytes: number[] = [];
    let curBit = 0;
    let curByte = 0;
    let currentCodeSize = minCodeSize + 1;
    let nextCodeThreshold = eoiCode + 1;

    for (let i = 0; i < outputCodes.length; i++) {
      const code = outputCodes[i];

      for (let b = 0; b < currentCodeSize; b++) {
        if ((code >> b) & 1) {
          curByte |= 1 << curBit;
        }
        curBit++;
        if (curBit === 8) {
          bytes.push(curByte);
          curByte = 0;
          curBit = 0;
        }
      }

      if (code === clearCode) {
        currentCodeSize = minCodeSize + 1;
        nextCodeThreshold = eoiCode + 1;
      } else {
        nextCodeThreshold++;
        if (nextCodeThreshold > (1 << currentCodeSize) && currentCodeSize < 12) {
          currentCodeSize++;
        }
      }
    }

    if (curBit > 0) {
      bytes.push(curByte);
    }

    // Wrap in sub-blocks of max 255 bytes
    const subBlocks: number[] = [];
    let offset = 0;
    while (offset < bytes.length) {
      const chunkSize = Math.min(255, bytes.length - offset);
      subBlocks.push(chunkSize);
      for (let c = 0; c < chunkSize; c++) {
        subBlocks.push(bytes[offset + c]);
      }
      offset += chunkSize;
    }
    subBlocks.push(0); // block terminator

    return new Uint8Array(subBlocks);
  }

  // Create standard 216 web-safe + 40 grayscale color palette (256 colors)
  const palette = new Uint8Array(768);
  let pIdx = 0;
  for (let r = 0; r < 6; r++) {
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        palette[pIdx++] = Math.round(r * 51);
        palette[pIdx++] = Math.round(g * 51);
        palette[pIdx++] = Math.round(b * 51);
      }
    }
  }
  while (pIdx < 768) {
    const gray = Math.round(((pIdx / 3) % 40) * 6.375);
    palette[pIdx++] = gray;
    palette[pIdx++] = gray;
    palette[pIdx++] = gray;
  }

  const out: number[] = [];

  // Header: GIF89a
  out.push(0x47, 0x49, 0x46, 0x38, 0x39, 0x61);

  // Logical Screen Descriptor
  out.push(width & 0xff, (width >> 8) & 0xff);
  out.push(height & 0xff, (height >> 8) & 0xff);
  out.push(0xf7); // GCT flag 1, resolution 7, size 7 (256 colors)
  out.push(0x00); // BG color index
  out.push(0x00); // Aspect ratio

  // Global Color Table
  for (let i = 0; i < 768; i++) out.push(palette[i]);

  // Netscape Looping Application Extension (Loop forever)
  out.push(0x21, 0xff, 0x0b);
  const appExt = "NETSCAPE2.0";
  for (let i = 0; i < appExt.length; i++) out.push(appExt.charCodeAt(i));
  out.push(0x03, 0x01, 0x00, 0x00, 0x00);

  const delayInCentiseconds = Math.max(1, Math.round(delayMs / 10));

  for (const frame of frames) {
    const framePixels = frame.data;

    // Graphic Control Extension
    out.push(0x21, 0xf9, 0x04);
    out.push(0x04); // Disposal method 1 (do not dispose)
    out.push(delayInCentiseconds & 0xff, (delayInCentiseconds >> 8) & 0xff);
    out.push(0x00); // Transparent color index
    out.push(0x00); // Block terminator

    // Image Descriptor
    out.push(0x2c);
    out.push(0x00, 0x00, 0x00, 0x00); // Left, Top
    out.push(width & 0xff, (width >> 8) & 0xff);
    out.push(height & 0xff, (height >> 8) & 0xff);
    out.push(0x00); // No local color table

    // LZW Min Code Size
    out.push(0x08);

    // Quantize RGBA to palette indices
    const indices = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = framePixels[i * 4];
      const g = framePixels[i * 4 + 1];
      const b = framePixels[i * 4 + 2];
      const ri = Math.min(5, Math.round(r / 51));
      const gi = Math.min(5, Math.round(g / 51));
      const bi = Math.min(5, Math.round(b / 51));
      indices[i] = ri * 36 + gi * 6 + bi;
    }

    const lzwBlocks = lzwEncode(8, indices);
    for (let b = 0; b < lzwBlocks.length; b++) {
      out.push(lzwBlocks[b]);
    }
  }

  // Trailer
  out.push(0x3b);

  return new Blob([new Uint8Array(out)], { type: "image/gif" });
}
