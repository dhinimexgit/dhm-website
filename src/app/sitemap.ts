import type { MetadataRoute } from "next";
import { siteNav } from "@/data/site-content";
import { getAllPosts } from "@/lib/posts";
import { getAllCareers } from "@/lib/careers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // 3. Map news posts from Firebase
  const posts = await getAllPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 4. Map careers from Firebase
  const careers = await getAllCareers();
  const careerRoutes = careers.map((career) => ({
    url: `${baseUrl}/careers/${career.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [homeRoute, ...staticRoutes, ...postRoutes, ...careerRoutes];
}