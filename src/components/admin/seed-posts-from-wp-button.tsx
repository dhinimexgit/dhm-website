"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

// Helper to strip HTML and extract text (browser-safe)
function stripHtml(html: string): string {
  if (!html) return "";
  if (typeof document === "undefined") {
    // Fallback for SSR - basic regex strip
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  }
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Helper to extract paragraphs from HTML content
function extractParagraphs(html: string): string[] {
  if (!html) return [];
  if (typeof document === "undefined") {
    // Fallback for SSR
    const text = stripHtml(html);
    return text ? text.split(/\n+/).filter(p => p.trim().length > 0) : [];
  }
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  const paragraphs = tmp.querySelectorAll("p");
  const texts: string[] = [];
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (text && text.length > 0) {
      texts.push(text);
    }
  });
  return texts.length > 0 ? texts : [stripHtml(html)];
}

// Helper to get featured image URL
async function getFeaturedImageUrl(mediaId: number): Promise<string> {
  try {
    const response = await fetch(`https://www.dhinimex.com/wp-json/wp/v2/media/${mediaId}`);
    if (!response.ok) return "";
    const media = await response.json();
    return media.source_url || "";
  } catch {
    return "";
  }
}

export function SeedPostsFromWPButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSeed = async () => {
    if (!confirm("This will fetch news posts from https://www.dhinimex.com/news/ and populate Firebase. Existing posts with the same slug will be updated. Continue?")) {
      return;
    }

    setLoading(true);
    setStatus("Fetching posts from WordPress...");

    try {
      // Fetch posts from WordPress REST API
      const response = await fetch("https://www.dhinimex.com/wp-json/wp/v2/posts?per_page=100&status=publish");
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const wpPosts = await response.json();
      setStatus(`Found ${wpPosts.length} posts. Processing...`);

      let count = 0;
      let skipped = 0;

      for (const wpPost of wpPosts) {
        try {
          setStatus(`Processing: ${wpPost.title?.rendered || wpPost.slug}...`);

          // Extract date (format: YYYY-MM-DD)
          const dateStr = wpPost.date ? wpPost.date.split("T")[0] : new Date().toISOString().split("T")[0];

          // Get featured image
          let coverImage = "";
          if (wpPost.featured_media) {
            coverImage = await getFeaturedImageUrl(wpPost.featured_media);
          }

          // Extract content paragraphs
          const content = extractParagraphs(wpPost.content?.rendered || "");

          // Determine tag (default to "News")
          let tag: "News" | "Event" | "Insight" = "News";
          if (wpPost.categories && Array.isArray(wpPost.categories)) {
            // You might want to map category IDs to tags if needed
            // For now, default to News
          }

          // Clean slug (remove WordPress numeric suffix if present)
          let slug = wpPost.slug;
          // Remove trailing numbers like "-12", "-11", etc.
          slug = slug.replace(/-\d+$/, "");

          const postData = {
            slug,
            title: wpPost.title?.rendered || wpPost.slug,
            date: dateStr,
            tag,
            excerpt: stripHtml(wpPost.excerpt?.rendered || "").substring(0, 200) || "No excerpt available.",
            cover: coverImage || "https://www.dhinimex.com/wp-content/uploads/2025/08/img-post_1.png",
            content: content.length > 0 ? content : ["Content coming soon."],
            updatedAt: Timestamp.now(),
            updatedBy: "wordpress-import",
          };

          // Use setDoc with merge to update or create
          await setDoc(doc(db, "posts", slug), {
            ...postData,
            createdAt: Timestamp.fromDate(new Date(wpPost.date || Date.now())),
            createdBy: "wordpress-import",
          }, { merge: true });

          console.log(`Seeded: ${postData.title}`);
          count++;
        } catch (error) {
          console.error(`Error processing post ${wpPost.slug}:`, error);
          skipped++;
        }
      }

      setStatus(`Success! Processed ${count} posts${skipped > 0 ? `, skipped ${skipped}` : ""}.`);
      setTimeout(() => setStatus(""), 5000);
    } catch (error) {
      console.error("Seeding error:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : "Failed to fetch posts"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {status && <span className="text-sm text-slate-600 animate-pulse">{status}</span>}
      <button
        onClick={handleSeed}
        disabled={loading}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {loading ? "Fetching & Seeding..." : "Seed from WordPress"}
      </button>
    </div>
  );
}

