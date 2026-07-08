"use client";

/**
 * Client-side image compression used by every admin upload (brands, news,
 * products, etc.) so nothing large ever reaches Firebase Storage.
 *
 * Resizes down to a max dimension and re-encodes to WebP via <canvas>.
 * Non-images, vectors (SVG) and animated GIFs are returned untouched, as are
 * cases where compression would not actually shrink the file.
 */

export type CompressOptions = {
  /** Cap the longest side (px). Downscale only; never upscales. */
  maxDimension?: number;
  /** WebP quality, 0..1. */
  quality?: number;
  /** Output mime type. */
  mimeType?: string;
};

const DEFAULTS: Required<CompressOptions> = {
  maxDimension: 1600,
  quality: 0.82,
  mimeType: "image/webp",
};

// Formats we must not re-encode (vector / animated would be broken by canvas).
const SKIP_TYPES = ["image/svg+xml", "image/gif"];

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  // SSR guard + only touch raster images.
  if (typeof window === "undefined" || typeof document === "undefined") return file;
  if (!file.type.startsWith("image/")) return file;
  if (SKIP_TYPES.includes(file.type)) return file;

  const { maxDimension, quality, mimeType } = { ...DEFAULTS, ...options };

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // decoding failed — upload the original rather than lose it
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close?.();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, mimeType, quality)
  );
  if (!blob || blob.size >= file.size) return file; // no gain — keep original

  const baseName = file.name.replace(/\.[^./\\]+$/, "") || "image";
  const ext = mimeType === "image/webp" ? "webp" : mimeType.split("/")[1] || "img";
  return new File([blob], `${baseName}.${ext}`, {
    type: mimeType,
    lastModified: Date.now(),
  });
}
