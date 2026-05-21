const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const MAX_EDGE_PX = 1920;
const JPEG_QUALITY = 0.82;
/** Skip re-encoding when the source is already small. */
const SKIP_BELOW_BYTES = 200 * 1024;

function isCompressibleImage(file: File): boolean {
  if (IMAGE_MIME_TYPES.has(file.type)) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}

function outputName(file: File): string {
  const base = file.name.replace(/\.[^.]+$/i, "") || "attachment";
  return `${base}.jpg`;
}

/**
 * Compresses photos before Firebase upload. PDF/Excel/Word files are returned unchanged.
 */
export async function compressFileForUpload(file: File): Promise<File> {
  if (!isCompressibleImage(file) || file.size < SKIP_BELOW_BYTES) {
    return file;
  }

  if (typeof document === "undefined" || typeof createImageBitmap !== "function") {
    return file;
  }

  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = longest > MAX_EDGE_PX ? MAX_EDGE_PX / longest : 1;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    return new File([blob], outputName(file), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}
