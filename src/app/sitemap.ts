import type { MetadataRoute } from "next";
import { siteNav, posts } from "@/data/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dhinimex.com";

  // 1. Explicitly add the Home page
  const homeRoute = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 1,
  };

  // 2. Map the rest of the site navigation
  const staticRoutes = siteNav.map((route) => ({
    url: `${baseUrl}${route.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 3. Map blog posts
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [homeRoute, ...staticRoutes, ...postRoutes];
}