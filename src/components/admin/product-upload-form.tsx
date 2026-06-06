"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  subscribeBrands,
  subscribeCategories,
  buildCategoryTree,
  type Brand,
  type CategoryNode,
} from "@/lib/taxonomy";

type Props = {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type Lang = "en" | "kh";

export function ProductUploadForm({ initialData, onSuccess, onCancel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Taxonomy (brands + categories) loaded from Firestore with static fallback.
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);

  // Active editing language for the bilingual text fields.
  const [lang, setLang] = useState<Lang>("en");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  // Bilingual text fields: { en, kh }
  const [name, setName] = useState<{ en: string; kh: string }>({ en: "", kh: "" });
  const [summary, setSummary] = useState<{ en: string; kh: string }>({ en: "", kh: "" });
  const [description, setDescription] = useState<{ en: string; kh: string }>({ en: "", kh: "" });
  const [highlights, setHighlights] = useState<{ en: string[]; kh: string[] }>({ en: [""], kh: [""] });

  // Category selection (ids) replaces the old comma-separated text field.
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);

  // Subscribe to brands & categories.
  useEffect(() => {
    const unsubBrands = subscribeBrands(setBrands);
    const unsubCats = subscribeCategories((cats) => setCategoryTree(buildCategoryTree(cats)));
    return () => {
      unsubBrands();
      unsubCats();
    };
  }, []);

  // Default the brand selection once brands are available (new products only).
  useEffect(() => {
    if (!initialData && !brand && brands.length > 0) {
      setBrand(brands[0].slug);
    }
  }, [brands, initialData, brand]);

  useEffect(() => {
    if (initialData) {
      setBrand(initialData.brand || "");
      setModel(initialData.model || "");
      setPrice(initialData.price?.toString() || "");
      setName({ en: initialData.name || "", kh: initialData.nameKh || "" });
      setSummary({ en: initialData.summary || "", kh: initialData.summaryKh || "" });
      setDescription({ en: initialData.description || "", kh: initialData.descriptionKh || "" });
      setSelectedCategories(Array.isArray(initialData.categories) ? initialData.categories : []);

      if (initialData.specs) {
        setSpecs(Object.entries(initialData.specs).map(([key, value]) => ({ key, value: String(value) })));
      }

      const enHighlights = initialData.highlights?.length ? initialData.highlights : [""];
      const khHighlights = initialData.highlightsKh?.length ? initialData.highlightsKh : [""];
      setHighlights({ en: enHighlights, kh: khHighlights });

      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

  const handleHighlightChange = (index: number, val: string) => {
    setHighlights((prev) => {
      const arr = [...prev[lang]];
      arr[index] = val;
      return { ...prev, [lang]: arr };
    });
  };

  const addHighlight = () =>
    setHighlights((prev) => ({ ...prev, [lang]: [...prev[lang], ""] }));

  const removeHighlight = (index: number) =>
    setHighlights((prev) => ({ ...prev, [lang]: prev[lang].filter((_, i) => i !== index) }));

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.en.trim()) {
      alert("Please enter the English product name (it is used for the URL and as a fallback).");
      setLang("en");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload new images.
      const uploadedImageUrls: string[] = [];
      if (newImages) {
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          const storageRef = ref(storage, `products/${brand}/${Date.now()}-${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          uploadedImageUrls.push(url);
        }
      }

      const cleanedExistingImages = (existingImages || []).filter(
        (img: any) => img && typeof img === "string" && img.trim().length > 0
      );
      const finalImages = [...cleanedExistingImages, ...uploadedImageUrls];

      const slug =
        initialData?.slug ||
        (name.en ? name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "");

      const cleanHighlights = (arr: string[]) => arr.map((h) => h.trim()).filter(Boolean);
      const enHighlights = cleanHighlights(highlights.en);
      const khHighlights = cleanHighlights(highlights.kh);

      const productData: any = {
        slug: slug || null,
        brand: brand || null,
        name: name.en.trim() || null,
        nameKh: name.kh.trim() || null,
        model: model || null,
        price: price ? parseFloat(price) : null,
        summary: summary.en.trim() || null,
        summaryKh: summary.kh.trim() || null,
        description: description.en.trim() || null,
        descriptionKh: description.kh.trim() || null,
        categories: selectedCategories.length > 0 ? selectedCategories : null,
        specs: (() => {
          const specObj = specs.reduce((acc, { key, value }) => {
            if (key.trim()) acc[key.trim()] = value.trim();
            return acc;
          }, {} as Record<string, string>);
          return Object.keys(specObj).length > 0 ? specObj : null;
        })(),
        highlights: enHighlights.length > 0 ? enHighlights : null,
        highlightsKh: khHighlights.length > 0 ? khHighlights : null,
        images: finalImages.length > 0 ? finalImages : null,
        released: initialData?.released || new Date().toISOString(),
        rating: initialData?.rating || 5.0,
        ratingCount: initialData?.ratingCount || 0,
        updatedAt: Timestamp.now(),
        hidden: initialData?.hidden || false,
      };

      if (initialData?.id) {
        await updateDoc(doc(db, "products", initialData.id), productData);
        alert("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), { ...productData, createdAt: Timestamp.now() });
        alert("Product created successfully!");
      }

      if (onSuccess) onSuccess();

      if (!initialData) {
        setName({ en: "", kh: "" });
        setModel("");
        setPrice("");
        setSummary({ en: "", kh: "" });
        setDescription({ en: "", kh: "" });
        setSelectedCategories([]);
        setNewImages(null);
        setSpecs([{ key: "", value: "" }]);
        setHighlights({ en: [""], kh: [""] });
        setLang("en");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Language toggle for bilingual fields */}
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Brand</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={!!initialData}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
          >
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Product Name {lang === "kh" ? "(Khmer)" : "(English)"}
          </label>
          <input
            type="text"
            value={name[lang]}
            onChange={(e) => setName({ ...name, [lang]: e.target.value })}
            placeholder={lang === "kh" ? "បញ្ចូលឈ្មោះផលិតផល" : "Enter product name"}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Model Number</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. DCD710D2"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        {/* Categories as checkboxes */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Categories</label>
          <div className="rounded-lg border border-slate-300 bg-white p-4">
            {categoryTree.length === 0 ? (
              <p className="text-sm text-slate-400">Loading categories...</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTree.map((group) => (
                  <div key={group.id}>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(group.id)}
                        onChange={() => toggleCategory(group.id)}
                        className="rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
                      />
                      {group.label}
                    </label>
                    {group.children.length > 0 && (
                      <div className="mt-2 ml-5 space-y-1.5 border-l border-slate-100 pl-3">
                        {group.children.map((child) => (
                          <label key={child.id} className="flex items-center gap-2 text-sm text-slate-600">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(child.id)}
                              onChange={() => toggleCategory(child.id)}
                              className="rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
                            />
                            {child.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Tick every category this product belongs to. Manage the list under the Categories tab.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Short Summary {lang === "kh" ? "(Khmer)" : "(English)"}
          </label>
          <textarea
            rows={3}
            value={summary[lang]}
            onChange={(e) => setSummary({ ...summary, [lang]: e.target.value })}
            placeholder={lang === "kh" ? "ការពិពណ៌នាសង្ខេប..." : "Brief description of the product..."}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Description {lang === "kh" ? "(Khmer)" : "(English)"}
          </label>
          <textarea
            rows={6}
            value={description[lang]}
            onChange={(e) => setDescription({ ...description, [lang]: e.target.value })}
            placeholder={lang === "kh" ? "ការពិពណ៌នាលម្អិត..." : "Detailed description of the product, features, and benefits..."}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Current Images</label>
          <div className="mt-2 flex flex-wrap gap-4">
            {existingImages.map((img, idx) => (
              <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-lg border-2 border-slate-200 transition hover:border-slate-300">
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
            {existingImages.length === 0 && (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                <span className="text-xs">No images</span>
              </div>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Add New Images</label>
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNewImages(e.target.files)}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-navy file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white file:transition hover:file:bg-brand-navy/90"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">You can select multiple images at once</p>
        </div>
      </div>

      {/* Specs Section */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900">Specifications</h3>
        {specs.map((spec, idx) => (
          <div key={idx} className="flex gap-4">
            <input
              placeholder="Key"
              value={spec.key}
              onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
              className="w-1/3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
            <input
              placeholder="Value"
              value={spec.value}
              onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
            <button
              type="button"
              onClick={() => removeSpec(idx)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 hover:border-red-300"
              aria-label="Remove specification"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpec}
          className="rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/10 hover:border-brand-navy/30"
        >
          + Add Specification
        </button>
      </div>

      {/* Highlights Section (bilingual) */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Highlights {lang === "kh" ? "(Khmer)" : "(English)"}
        </h3>
        {highlights[lang].map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <input
              value={item}
              onChange={(e) => handleHighlightChange(idx, e.target.value)}
              placeholder={lang === "kh" ? "បញ្ចូលចំណុចសំខាន់..." : "Enter highlight..."}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
            <button
              type="button"
              onClick={() => removeHighlight(idx)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 hover:border-red-300"
              aria-label="Remove highlight"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addHighlight}
          className="rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/10 hover:border-brand-navy/30"
        >
          + Add Highlight
        </button>
      </div>

      <div className="flex gap-4 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-brand-red px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Add Product"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
