"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { subscribeBrands, FALLBACK_BRANDS, type Brand } from "@/lib/taxonomy";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyBrand: Brand = {
  slug: "",
  name: "",
  nameKh: "",
  tagline: "",
  description: "",
  focus: "",
  brandColor: "#1e2a78",
  heroImage: "",
  order: 0,
  hidden: false,
};

export function BrandManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const unsub = subscribeBrands((items) => {
      setBrands(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Brands coming from the static fallback have no Firestore id and can't be edited yet.
  const usingFallback = useMemo(() => brands.length > 0 && brands.every((b) => !b.id), [brands]);

  const handleImportDefaults = async () => {
    if (!confirm("Import the default brands into the database so they become editable?")) return;
    setImporting(true);
    try {
      const existing = await getDocs(collection(db, "brands"));
      if (!existing.empty) {
        alert("Brands already exist in the database.");
        return;
      }
      for (const b of FALLBACK_BRANDS) {
        const { id: _omit, ...data } = b;
        await addDoc(collection(db, "brands"), { ...data, hidden: false });
      }
      alert("Default brands imported.");
    } catch (err) {
      console.error("Failed to import default brands:", err);
      alert("Failed to import default brands.");
    } finally {
      setImporting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const name = editing.name.trim();
    if (!name) {
      alert("Brand name is required.");
      return;
    }
    const slug = (editing.slug || slugify(name)).trim();
    setIsSaving(true);
    try {
      const payload = {
        slug,
        name,
        nameKh: editing.nameKh?.trim() || "",
        tagline: editing.tagline?.trim() || "",
        description: editing.description?.trim() || "",
        focus: editing.focus?.trim() || "",
        brandColor: editing.brandColor?.trim() || "#1e2a78",
        heroImage: editing.heroImage?.trim() || "",
        order: Number.isFinite(editing.order) ? Number(editing.order) : brands.length,
        hidden: !!editing.hidden,
      };
      if (editing.id) {
        await updateDoc(doc(db, "brands", editing.id), payload);
      } else {
        await addDoc(collection(db, "brands"), payload);
      }
      setEditing(null);
    } catch (err) {
      console.error("Failed to save brand:", err);
      alert("Failed to save brand.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (b: Brand) => {
    if (!b.id) return;
    if (!confirm(`Delete brand "${b.name}"? Products already tagged with this brand are not removed.`)) return;
    try {
      await deleteDoc(doc(db, "brands", b.id));
    } catch (err) {
      console.error("Failed to delete brand:", err);
      alert("Failed to delete brand.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500">Loading brands...</div>
    );
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-xl font-semibold text-brand-navy">
          {editing.id ? `Edit Brand: ${editing.name}` : "New Brand"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Brand Name (English)</label>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder="e.g. STANLEY"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Brand Name (Khmer)</label>
            <input
              type="text"
              value={editing.nameKh || ""}
              onChange={(e) => setEditing({ ...editing, nameKh: e.target.value })}
              placeholder="ឈ្មោះ​ម៉ាក"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
            <input
              type="text"
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
              placeholder="auto-generated from name"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
            <p className="mt-1 text-xs text-slate-500">Used in product URLs. Leave blank to auto-generate.</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Display Order</label>
            <input
              type="number"
              value={editing.order ?? 0}
              onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value, 10) || 0 })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Focus</label>
            <input
              type="text"
              value={editing.focus || ""}
              onChange={(e) => setEditing({ ...editing, focus: e.target.value })}
              placeholder="e.g. Industrial crews"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={editing.brandColor || "#1e2a78"}
                onChange={(e) => setEditing({ ...editing, brandColor: e.target.value })}
                className="h-11 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                value={editing.brandColor || ""}
                onChange={(e) => setEditing({ ...editing, brandColor: e.target.value })}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Tagline</label>
            <input
              type="text"
              value={editing.tagline || ""}
              onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
              placeholder="e.g. Jobsite proven. Built to last."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Hero Image URL</label>
            <input
              type="text"
              value={editing.heroImage || ""}
              onChange={(e) => setEditing({ ...editing, heroImage: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={!!editing.hidden}
                onChange={(e) => setEditing({ ...editing, hidden: e.target.checked })}
                className="rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
              />
              Hide this brand from the public site
            </label>
          </div>
        </div>
        <div className="mt-8 flex gap-4 border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : editing.id ? "Update Brand" : "Add Brand"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">{brands.length} brand{brands.length === 1 ? "" : "s"}</p>
        <div className="flex flex-wrap gap-3">
          {usingFallback && (
            <button
              onClick={handleImportDefaults}
              disabled={importing}
              className="rounded-full border border-brand-navy/20 bg-brand-navy/5 px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/10 disabled:opacity-50"
            >
              {importing ? "Importing..." : "Import default brands"}
            </button>
          )}
          <button
            onClick={() => setEditing({ ...emptyBrand, order: brands.length })}
            className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90"
          >
            + Add Brand
          </button>
        </div>
      </div>

      {usingFallback && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          These are the built-in default brands. Click <strong>Import default brands</strong> to make them editable, or add a new brand directly.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Brand</th>
              <th className="px-6 py-4 font-semibold">Slug</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {brands.map((b) => (
              <tr key={b.id || b.slug} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-4 w-4 rounded-full border border-slate-200" style={{ backgroundColor: b.brandColor || "#ccc" }} />
                    <div>
                      <p className="font-medium text-brand-navy">{b.name}</p>
                      {b.nameKh ? <p className="text-xs text-slate-400">{b.nameKh}</p> : null}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{b.slug}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${b.hidden ? "bg-slate-100 text-slate-500" : "bg-green-100 text-green-700"}`}>
                    {b.hidden ? "Hidden" : "Visible"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditing(b)}
                      disabled={!b.id}
                      title={!b.id ? "Import defaults first to edit" : undefined}
                      className="rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-3 py-1.5 text-sm font-medium text-brand-navy transition hover:bg-brand-navy/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      disabled={!b.id}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No brands yet. Click &quot;Add Brand&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
