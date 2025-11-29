"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { posts } from "@/data/site-content";

export function SeedPostsButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSeed = async () => {
    if (!confirm("This will populate the database with blog posts from your static files. Existing posts with the same slug will be updated. Continue?")) {
      return;
    }

    setLoading(true);
    setStatus("Starting seed...");

    try {
      let count = 0;

      for (const post of posts) {
        setStatus(`Processing ${post.title}...`);

        const postData = {
          slug: post.slug,
          title: post.title,
          date: post.date,
          tag: post.tag,
          excerpt: post.excerpt,
          cover: post.cover,
          content: post.content,
          updatedAt: Timestamp.now(),
          updatedBy: 'system',
        };

        // Use setDoc with merge to update or create
        await setDoc(doc(db, "posts", post.slug), {
          ...postData,
          createdAt: Timestamp.now(),
          createdBy: 'system',
        }, { merge: true });

        console.log(`Seeded ${post.title}`);
        count++;
      }

      setStatus(`Success! Processed ${count} posts.`);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Seeding error:", error);
      setStatus("Error during seeding. Check console.");
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
        {loading ? "Seeding..." : "Seed Posts"}
      </button>
    </div>
  );
}

