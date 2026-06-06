"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import {
  subscribeCategories,
  buildCategoryTree,
  FALLBACK_CATEGORIES,
  type Category,
} from "@/lib/taxonomy";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyCategory: Category = {
  id: "",
  label: "",
  labelKh: "",
  parentId: null,
  order: 0,
  hidden: false,
};

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const unsub = subscribeCategories((items) => {
      setCategories(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const usingFallback = useMemo(
    () => categories.length > 0 && categories.every((c) => !c.docId),
    [categories]
  );

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const topLevel = useMemo(
    () => categories.filter((c) => !c.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [categories]
  );

  const handleImportDefaults = async () => {
    if (!confirm("Import the default categories into the database so they become editable?")) return;
    setImporting(true);
    try {
      const existing = await getDocs(collection(db, "categories"));
      if (!existing.empty) {
        alert("Categories already exist in the database.");
        return;
      }
      for (const c of FALLBACK_CATEGORIES) {
        await addDoc(collection(db, "categories"), {
          id: c.id,
          label: c.label,
          labelKh: c.labelKh || "",
          parentId: c.parentId ?? null,
          order: c.order ?? 0,
          hidden: false,
        });
      }
      alert("Default categories imported.");
    } catch (err) {
      console.error("Failed to import default categories:", err);
      alert("Failed to import default categories.");
    } finally {
      setImporting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const label = editing.label.trim();
    if (!label) {
      alert("Category name is required.");
      return;
    }
    const id = (editing.id || slugify(label)).trim();

    // Prevent duplicate ids (other than the doc being edited).
    const clash = categories.find((c) => c.id === id && c.docId !== editing.docId);
    if (clash) {
      alert(`A category with id "${id}" already exists. Choose a different name/id.`);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id,
        label,
        labelKh: editing.labelKh?.trim() || "",
        parentId: editing.parentId || null,
        order: Number.isFinite(editing.order) ? Number(editing.order) : 0,
        hidden: !!editing.hidden,
      };
      if (editing.docId) {
        await updateDoc(doc(db, "categories", editing.docId), payload);
      } else {
        await addDoc(collection(db, "categories"), payload);
      }
      setEditing(null);
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (c: Category) => {
    if (!c.docId) return;
    const childCount = categories.filter((x) => x.parentId === c.id).length;
    const msg = childCount
      ? `Delete "${c.label}" and detach its ${childCount} subcategor${childCount === 1 ? "y" : "ies"}?`
      : `Delete category "${c.label}"?`;
    if (!confirm(msg)) return;
    try {
      await deleteDoc(doc(db, "categories", c.docId));
      // Detach children so they don't become orphaned under a missing parent.
      for (const child of categories.filter((x) => x.parentId === c.id && x.docId)) {
        await updateDoc(doc(db, "categories", child.docId!), { parentId: null });
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-slate-500">Loading categories...</div>;
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-xl font-semibold text-brand-navy">
          {editing.docId ? `Edit Category: ${editing.label}` : "New Category"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name (English)</label>
            <input
              type="text"
              value={editing.label}
              onChange={(e) => setEditing({ ...editing, label: e.target.value })}
              placeholder="e.g. Power Tools"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name (Khmer)</label>
            <input
              type="text"
              value={editing.labelKh || ""}
              onChange={(e) => setEditing({ ...editing, labelKh: e.target.value })}
              placeholder="ឈ្មោះ​ប្រភេទ"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Parent Category</label>
            <select
              value={editing.parentId || ""}
              onChange={(e) => setEditing({ ...editing, parentId: e.target.value || null })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            >
              <option value="">— Top level —</option>
              {topLevel
                .filter((p) => p.id !== editing.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
            </select>
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
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">ID (used on products)</label>
            <input
              type="text"
              value={editing.id}
              onChange={(e) => setEditing({ ...editing, id: slugify(e.target.value) })}
              placeholder="auto-generated from name"
              disabled={!!editing.docId}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              {editing.docId
                ? "The id is locked after creation to keep existing products tagged correctly."
                : "Leave blank to auto-generate from the name."}
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={!!editing.hidden}
                onChange={(e) => setEditing({ ...editing, hidden: e.target.checked })}
                className="rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
              />
              Hide this category from the public site
            </label>
          </div>
        </div>
        <div className="mt-8 flex gap-4 border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : editing.docId ? "Update Category" : "Add Category"}
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
        <p className="text-sm text-slate-600">
          {topLevel.length} top-level categor{topLevel.length === 1 ? "y" : "ies"}
        </p>
        <div className="flex flex-wrap gap-3">
          {usingFallback && (
            <button
              onClick={handleImportDefaults}
              disabled={importing}
              className="rounded-full border border-brand-navy/30 bg-white px-6 py-2.5 text-sm font-semibold text-brand-navy shadow-sm transition hover:bg-brand-navy/5 disabled:opacity-50"
            >
              {importing ? "Importing..." : "Import Defaults"}
            </button>
          )}
          <button
            onClick={() => setEditing({ ...emptyCategory })}
            className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90"
          >
            + Add Category
          </button>
        </div>
      </div>


      <div className="space-y-4">
        {tree.map((parent) => (
          <div key={parent.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 bg-slate-50 px-5 py-3">
              <div>
                <p className="font-semibold text-brand-navy">
                  {parent.label}
                  {parent.hidden ? <span className="ml-2 text-xs font-normal text-slate-400">(hidden)</span> : null}
                </p>
                {parent.labelKh ? <p className="text-xs text-slate-400">{parent.labelKh}</p> : null}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(parent)}
                  disabled={!parent.docId}
                  title={!parent.docId ? "Import defaults first to edit" : undefined}
                  className="rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-3 py-1.5 text-xs font-medium text-brand-navy transition hover:bg-brand-navy/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(parent)}
                  disabled={!parent.docId}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
            </div>
            <ul className="divide-y divide-slate-100">
              {parent.children.map((child) => (
                <li key={child.id} className="flex items-center justify-between gap-4 px-5 py-3 pl-10">
                  <div>
                    <p className="text-sm text-slate-700">
                      {child.label}
                      {child.hidden ? <span className="ml-2 text-xs text-slate-400">(hidden)</span> : null}
                    </p>
                    {child.labelKh ? <p className="text-xs text-slate-400">{child.labelKh}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(child)}
                      disabled={!child.docId}
                      className="rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-3 py-1.5 text-xs font-medium text-brand-navy transition hover:bg-brand-navy/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(child)}
                      disabled={!child.docId}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {parent.children.length === 0 && (
                <li className="px-5 py-3 pl-10 text-xs text-slate-400">No subcategories</li>
              )}
            </ul>
          </div>
        ))}
        {tree.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm">
            No categories yet. Click &quot;Add Category&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}
