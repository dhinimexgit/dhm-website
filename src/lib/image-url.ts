const DEFAULT_BRAND_HERO =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80";

/** Returns true when the URL can be used with next/image. */
export function isValidImageSrc(url?: string | null): url is string {
  if (!url?.trim()) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("file://") || trimmed.startsWith("blob:")) return false;
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/")
  );
}

/** Resolve a brand hero image, falling back when missing or invalid (e.g. local file paths). */
export function resolveBrandHeroImage(url?: string | null): string {
  return isValidImageSrc(url) ? url.trim() : DEFAULT_BRAND_HERO;
}
