"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import type { Post } from "@/data/site-content";

type Props = {
  initialData?: Post & { id?: string };
  onSuccess: () => void;
  onCancel: () => void;
};

export function PostForm({ initialData, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    tag: initialData?.tag || "News",
    excerpt: initialData?.excerpt || "",
    cover: initialData?.cover || "",
    content: Array.isArray(initialData?.content) 
      ? initialData.content.join("\n\n") 
      : initialData?.content || "",
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);
      const contentArray = formData.content
        .split("\n\n")
        .filter(p => p.trim().length > 0);

      const postData: Omit<Post, "slug"> & { slug: string } = {
        slug,
        title: formData.title,
        date: formData.date,
        tag: formData.tag as "News" | "Event" | "Insight",
        excerpt: formData.excerpt,
        cover: formData.cover,
        content: contentArray,
      };

      await setDoc(doc(db, "posts", slug), postData);
      onSuccess();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (!initialData || !formData.slug) {
                setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
              }
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tag *
          </label>
          <select
            required
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value as "News" | "Event" | "Insight" })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          >
            <option value="News">News</option>
            <option value="Event">Event</option>
            <option value="Insight">Insight</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Cover Image URL *
        </label>
        <input
          type="url"
          required
          value={formData.cover}
          onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Excerpt *
        </label>
        <textarea
          required
          rows={3}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Content * (Separate paragraphs with blank lines)
        </label>
        <textarea
          required
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-navy px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}

