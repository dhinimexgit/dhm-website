"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { productCategories } from "@/data/site-content";

const BRANDS = productCategories.map((c) => ({ name: c.name, slug: c.slug }));

type Props = {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ProductUploadForm({ initialData, onSuccess, onCancel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brand, setBrand] = useState(BRANDS[0].slug);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState(""); 
  
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);

  useEffect(() => {
    if (initialData) {
      setBrand(initialData.brand || BRANDS[0].slug);
      setName(initialData.name || "");
      setModel(initialData.model || "");
      setPrice(initialData.price?.toString() || "");
      setSummary(initialData.summary || "");
      setDescription(initialData.description || "");
      setCategories((initialData.categories || []).join(", "));
      
      if (initialData.specs) {
        setSpecs(Object.entries(initialData.specs).map(([key, value]) => ({ key, value: String(value) })));
      }
      
      setHighlights(initialData.highlights?.length ? initialData.highlights : [""]);
      setFeatures(initialData.features?.length ? initialData.features : [""]);
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

  const handleArrayChange = (
    index: number,
    val: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[]
  ) => {
    const newArr = [...current];
    newArr[index] = val;
    setter(newArr);
  };

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) =>
    setter([...current, ""]);
    
  const removeArrayItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[]
  ) => setter(current.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload New Images
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

      // Clean existing images - filter out null, undefined, empty strings
      const cleanedExistingImages = (existingImages || []).filter((img: any) => 
        img && typeof img === 'string' && img.trim().length > 0
      );
      
      const finalImages = [...cleanedExistingImages, ...uploadedImageUrls];

      // 2. Format Data
      const slug = initialData?.slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "");
      const categoryList = categories ? categories.split(",").map((s) => s.trim()).filter(Boolean) : [];
      if (brand && !categoryList.includes(brand)) categoryList.push(brand);

      const productData: any = {
        slug: slug || null,
        brand: brand || null,
        name: name || null,
        model: model || null,
        price: price ? parseFloat(price) : null,
        summary: summary || null,
        description: description || null,
        categories: categoryList.length > 0 ? categoryList : null,
        specs: (() => {
          const specObj = specs.reduce((acc, { key, value }) => {
            if (key.trim()) acc[key.trim()] = value.trim();
            return acc;
          }, {} as Record<string, string>);
          return Object.keys(specObj).length > 0 ? specObj : null;
        })(),
        highlights: highlights.filter((h) => h.trim()).length > 0 ? highlights.filter((h) => h.trim()) : null,
        features: features.filter((f) => f.trim()).length > 0 ? features.filter((f) => f.trim()) : null,
        images: finalImages.length > 0 ? finalImages : null,
        released: initialData?.released || new Date().toISOString(),
        rating: initialData?.rating || 5.0,
        ratingCount: initialData?.ratingCount || 0,
        updatedAt: Timestamp.now(),
        hidden: initialData?.hidden || false,
      };

      if (initialData?.id) {
        // Update
        await updateDoc(doc(db, "products", initialData.id), productData);
        alert("Product updated successfully!");
      } else {
        // Create
        await addDoc(collection(db, "products"), { ...productData, createdAt: Timestamp.now() });
        alert("Product created successfully!");
      }

      if (onSuccess) onSuccess();
      
      if (!initialData) {
        // Reset only if creating new
        setName("");
        setModel("");
        setPrice("");
        setSummary("");
        setDescription("");
        setNewImages(null);
        setSpecs([{ key: "", value: "" }]);
        setHighlights([""]);
        setFeatures([""]);
      }

    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Brand</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={!!initialData}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
          >
            {BRANDS.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Model Number</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. DCD710D2"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
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
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Categories (comma separated)</label>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="power-tools, drills, dewalt"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Short Summary</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief description of the product..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Full Description</label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the product, features, and benefits..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 resize-none"
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

      {/* Highlights Section */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900">Highlights</h3>
        {highlights.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <input
              value={item}
              onChange={(e) => handleArrayChange(idx, e.target.value, setHighlights, highlights)}
              placeholder="Enter highlight..."
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
            <button 
              type="button" 
              onClick={() => removeArrayItem(idx, setHighlights, highlights)} 
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
          onClick={() => addArrayItem(setHighlights, highlights)} 
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
