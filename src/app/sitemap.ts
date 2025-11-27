import type { MetadataRoute } from "next";
import { siteNav, posts } from "@/data/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dhinimex.com";

  const staticRoutes = siteNav.map((route) => ({
    url: `${baseUrl}${route.href === "/" ? "" : route.href}`,
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...postRoutes];
}

