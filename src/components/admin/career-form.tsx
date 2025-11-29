"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import type { CareerRole } from "@/data/site-content";

type Props = {
  initialData?: CareerRole & { id?: string };
  onSuccess: () => void;
  onCancel: () => void;
};

export function CareerForm({ initialData, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    location: initialData?.location || "",
    position: initialData?.position || "",
    deadline: initialData?.deadline || "",
    url: initialData?.url || "",
    summary: initialData?.summary || "",
    description: initialData?.description || "",
    keyResponsibilities: initialData?.keyResponsibilities || [""],
    requirements: initialData?.requirements || [""],
    whatWeOffer: initialData?.whatWeOffer || [""],
    howToApply: initialData?.howToApply || "",
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleArrayChange = (
    index: number,
    value: string,
    field: "keyResponsibilities" | "requirements" | "whatWeOffer"
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: "keyResponsibilities" | "requirements" | "whatWeOffer") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (
    index: number,
    field: "keyResponsibilities" | "requirements" | "whatWeOffer"
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);

      const careerData: Omit<CareerRole, "slug"> & { slug: string } = {
        slug,
        title: formData.title,
        location: formData.location,
        position: formData.position,
        deadline: formData.deadline,
        url: formData.url || `https://www.dhinimex.com/careers/${slug}/`,
        summary: formData.summary,
        description: formData.description || undefined,
        keyResponsibilities: formData.keyResponsibilities.filter(r => r.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        whatWeOffer: formData.whatWeOffer.filter(o => o.trim()),
        howToApply: formData.howToApply || undefined,
      };

      await setDoc(doc(db, "careers", slug), careerData);
      onSuccess();
    } catch (error) {
      console.error("Error saving career:", error);
      alert("Failed to save career");
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

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Position *
          </label>
          <input
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Deadline *
          </label>
          <input
            type="text"
            required
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            placeholder="e.g., September 20, 2026"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Summary *
        </label>
        <textarea
          required
          rows={2}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description
        </label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Key Responsibilities
        </label>
        {formData.keyResponsibilities.map((item, index) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(index, e.target.value, "keyResponsibilities")}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
            <button
              type="button"
              onClick={() => removeArrayItem(index, "keyResponsibilities")}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("keyResponsibilities")}
          className="mt-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          + Add Responsibility
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Requirements
        </label>
        {formData.requirements.map((item, index) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(index, e.target.value, "requirements")}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
            <button
              type="button"
              onClick={() => removeArrayItem(index, "requirements")}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("requirements")}
          className="mt-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          + Add Requirement
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          What We Offer
        </label>
        {formData.whatWeOffer.map((item, index) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(index, e.target.value, "whatWeOffer")}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
            <button
              type="button"
              onClick={() => removeArrayItem(index, "whatWeOffer")}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("whatWeOffer")}
          className="mt-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          + Add Offer
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          How to Apply
        </label>
        <textarea
          rows={3}
          value={formData.howToApply}
          onChange={(e) => setFormData({ ...formData, howToApply: e.target.value })}
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
          {loading ? "Saving..." : initialData ? "Update Career" : "Create Career"}
        </button>
      </div>
    </form>
  );
}

