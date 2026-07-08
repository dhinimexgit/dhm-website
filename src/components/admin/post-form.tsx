"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Post } from "@/data/site-content";
import { compressImage } from "@/lib/image-compress";

type Props = {
  initialData?: Post & { id?: string };
  onSuccess: () => void;
  onCancel: () => void;
};

type Lang = "en" | "kh";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20";

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const contentToText = (content?: string[] | string) => {
  if (Array.isArray(content)) return content.join("\n\n");
  return content || "";
};

const textToContent = (text: string) =>
  text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

export function PostForm({ initialData, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [tag, setTag] = useState<"News" | "Event" | "Insight">(initialData?.tag || "News");

  const [title, setTitle] = useState<{ en: string; kh: string }>({
    en: initialData?.title || "",
    kh: initialData?.titleKh || "",
  });
  const [excerpt, setExcerpt] = useState<{ en: string; kh: string }>({
    en: initialData?.excerpt || "",
    kh: initialData?.excerptKh || "",
  });
  const [content, setContent] = useState<{ en: string; kh: string }>({
    en: contentToText(initialData?.content),
    kh: contentToText(initialData?.contentKh),
  });

  const [existingCover, setExistingCover] = useState(initialData?.cover || "");
  const [newCover, setNewCover] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [newImages, setNewImages] = useState<FileList | null>(null);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date || new Date().toISOString().split("T")[0]);
      setTag(initialData.tag || "News");
      setTitle({ en: initialData.title || "", kh: initialData.titleKh || "" });
      setExcerpt({ en: initialData.excerpt || "", kh: initialData.excerptKh || "" });
      setContent({
        en: contentToText(initialData.content),
        kh: contentToText(initialData.contentKh),
      });
      setExistingCover(initialData.cover || "");
      setExistingImages(initialData.images || []);
      setNewCover(null);
      setNewImages(null);
    }
  }, [initialData]);

  const uploadFile = async (file: File, path: string) => {
    const optimized = await compressImage(file);
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, optimized);
    return getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.en.trim()) {
      alert("Please enter the English title (it is used for the URL and as a fallback).");
      setLang("en");
      return;
    }

    if (!initialData && !newCover && !existingCover) {
      alert("Please upload a cover image.");
      return;
    }

    setLoading(true);

    try {
      const docId =
        initialData?.id || initialData?.slug || generateSlug(title.en);
      const slug = initialData?.slug || initialData?.id || generateSlug(title.en);

      let coverUrl = existingCover;
      if (newCover) {
        coverUrl = await uploadFile(
          newCover,
          `posts/${slug}/cover-${Date.now()}-${newCover.name}`
        );
      }

      const uploadedImageUrls: string[] = [];
      if (newImages) {
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          const url = await uploadFile(
            file,
            `posts/${slug}/${Date.now()}-${i}-${file.name}`
          );
          uploadedImageUrls.push(url);
        }
      }

      const cleanedExistingImages = existingImages.filter(
        (img) => img && img.trim().length > 0
      );
      const finalImages = [...cleanedExistingImages, ...uploadedImageUrls];

      const enContent = textToContent(content.en);
      const khContent = textToContent(content.kh);

      const postData: Record<string, unknown> = {
        slug,
        title: title.en.trim(),
        date,
        tag,
        excerpt: excerpt.en.trim(),
        cover: coverUrl,
        content: enContent,
      };

      if (title.kh.trim()) postData.titleKh = title.kh.trim();
      if (excerpt.kh.trim()) postData.excerptKh = excerpt.kh.trim();
      if (khContent.length > 0) postData.contentKh = khContent;
      if (finalImages.length > 0) postData.images = finalImages;

      await setDoc(doc(db, "posts", docId), postData);
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
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Content language</p>
          <p className="text-xs text-slate-500">
            Switch to enter the English and Khmer versions. Both are saved together.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
          {(["en", "kh"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                lang === l ? "bg-brand-navy text-white shadow" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {l === "en" ? "English" : "ខ្មែរ Khmer"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Title {lang === "kh" ? "(Khmer)" : "(English)"} *
        </label>
        <input
          type="text"
          required={lang === "en"}
          value={title[lang]}
          onChange={(e) => setTitle({ ...title, [lang]: e.target.value })}
          placeholder={lang === "kh" ? "បញ្ចូលចំណងជើង" : "Enter post title"}
          className={inputClass}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Date *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Tag *</label>
          <select
            required
            value={tag}
            onChange={(e) => setTag(e.target.value as "News" | "Event" | "Insight")}
            className={inputClass}
          >
            <option value="News">News</option>
            <option value="Event">Event</option>
            <option value="Insight">Insight</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Cover Image {!initialData ? "*" : ""}
        </label>
        {(existingCover || newCover) && (
          <div className="mb-3">
            <div className="relative h-40 w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {newCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(newCover)}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                />
              ) : existingCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={existingCover} alt="Current cover" className="h-full w-full object-cover" />
              ) : null}
            </div>
            {existingCover && !newCover && (
              <button
                type="button"
                onClick={() => setExistingCover("")}
                className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
              >
                Remove current cover
              </button>
            )}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewCover(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-navy file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white file:transition hover:file:bg-brand-navy/90"
        />
        <p className="mt-2 text-xs text-slate-500">Upload a cover image from your device</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Additional Images</label>
        {existingImages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-4">
            {existingImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative h-24 w-24 overflow-hidden rounded-lg border-2 border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setNewImages(e.target.files)}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-navy file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white file:transition hover:file:bg-brand-navy/90"
        />
        <p className="mt-2 text-xs text-slate-500">You can select multiple images at once</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Excerpt {lang === "kh" ? "(Khmer)" : "(English)"} *
        </label>
        <textarea
          required={lang === "en"}
          rows={3}
          value={excerpt[lang]}
          onChange={(e) => setExcerpt({ ...excerpt, [lang]: e.target.value })}
          placeholder={lang === "kh" ? "សេចក្តីសង្ខេប..." : "Brief summary of the post..."}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Content {lang === "kh" ? "(Khmer)" : "(English)"} * (Separate paragraphs with blank lines)
        </label>
        <textarea
          required={lang === "en"}
          rows={10}
          value={content[lang]}
          onChange={(e) => setContent({ ...content, [lang]: e.target.value })}
          placeholder={lang === "kh" ? "ខ្លឹមសារព័ត៌មាន..." : "Write the full article content..."}
          className={inputClass}
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
