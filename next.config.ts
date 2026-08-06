import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 defaults localPatterns to [{ pathname: "**", search: "" }], which
    // rejects any local image carrying a query string — that is why the /about
    // art (`/about-us-1.png?v=20250611`) previously had to be marked
    // `unoptimized`. Omitting `search` here allows our own cache-busting
    // `?v=` suffixes through the optimizer.
    localPatterns: [{ pathname: "/**" }],
    // Serve modern formats when the client advertises support.
    formats: ["image/avif", "image/webp"],
    // Optimized derivatives are immutable; keep them in the CDN for a year.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.dhinimex.com",
      },
      {
        protocol: "https",
        hostname: "dhinimex.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "stanleytools.mediaroom.com",
      },
      {
        protocol: "https",
        hostname: "media.screwfix.com",
      },
      {
        protocol: "https",
        hostname: "www.blackanddecker.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
};

export default nextConfig;
