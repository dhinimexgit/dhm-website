"use client";

import { useState } from "react";
import {
  PROJECT_TYPES,
  createProjectType,
  deleteProjectType,
  projectTypeKey,
  seedProjectTypesFromSheet,
  swapProjectTypeOrder,
  updateProjectType,
  type ProjectTypeRecord,
} from "@/lib/dhm-projects";

const FIELD =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700";
const GHOST_BTN =
  "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

type Props = {
  types: ProjectTypeRecord[];
  /** How many tickets currently use each type name, for delete safety. */
  usageByName: Record<string, number>;
  /** True while the list is still the static fallback (nothing seeded yet). */
  isFallback: boolean;
};

export function ProjectTypeManager({ types, usageByName, isFallback }: Props) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const existingKeys = new Set(types.map((t) => projectTypeKey(t.name)));

  async function run(label: string, fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      await fn();
    } catch (err) {
      console.error(`${label} failed`, err);
      setNote({ tone: "err", text: `Could not ${label}. Please try again.` });
    } finally {
      setBusy(false);
    }
  }

  async function handleSeed() {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const { added, skipped } = await seedProjectTypesFromSheet();
      setNote({
        tone: "ok",
        text:
          added === 0
            ? `All ${skipped} types from the sheet are already in the list.`
            : `Added ${added} type${added === 1 ? "" : "s"} from the sheet${
                skipped ? `, skipped ${skipped} already present` : ""
              }.`,
      });
    } catch (err) {
      console.error("seedProjectTypesFromSheet failed", err);
      setNote({ tone: "err", text: "Could not import the sheet types. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (existingKeys.has(projectTypeKey(name))) {
      setNote({ tone: "err", text: `"${name}" is already in the list.` });
      return;
    }
    const nextOrder = types.reduce((m, t) => Math.max(m, t.order), -1) + 1;
    void run("add the type", async () => {
      await createProjectType(name, nextOrder);
      setNewName("");
    });
  }

  function handleRename(type: ProjectTypeRecord) {
    const name = editingName.trim();
    if (!type.id || !name) return;
    if (name !== type.name && existingKeys.has(projectTypeKey(name))) {
      setNote({ tone: "err", text: `"${name}" is already in the list.` });
      return;
    }
    void run("rename the type", async () => {
      await updateProjectType(type.id!, { name });
      setEditingId(null);
      // Existing tickets keep the old string — renaming is not a migration.
      const used = usageByName[type.name] ?? 0;
      if (used > 0) {
        setNote({
          tone: "ok",
          text: `Renamed. ${used} existing ticket${used === 1 ? "" : "s"} still show "${type.name}".`,
        });
      }
    });
  }

  function handleDelete(type: ProjectTypeRecord) {
    if (!type.id) return;
    const used = usageByName[type.name] ?? 0;
    if (used > 0) {
      setNote({
        tone: "err",
        text: `"${type.name}" is used by ${used} ticket${used === 1 ? "" : "s"}. Hide it instead so history stays readable.`,
      });
      return;
    }
    if (!confirm(`Delete the project type "${type.name}"?`)) return;
    void run("delete the type", () => deleteProjectType(type.id!));
  }

  function move(index: number, dir: -1 | 1) {
    const a = types[index];
    const b = types[index + dir];
    if (!a || !b) return;
    void run("reorder the types", () => swapProjectTypeOrder(a, b));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-brand-navy">Project types</h2>
          <p className="mt-1 text-sm text-slate-500">
            Controls the Project Type picker on new tickets. Hidden types stay on existing tickets
            but disappear from the picker.
          </p>
        </div>
      </div>

      {note && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            note.tone === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {note.text}
        </div>
      )}

      {isFallback && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Not set up yet.</span> The picker is showing the{" "}
            {PROJECT_TYPES.length} types from the Technical Dept sheet. Import them to start
            managing the list here.
          </p>
          <button type="button" onClick={handleSeed} disabled={busy} className={GHOST_BTN}>
            Import {PROJECT_TYPES.length} types from sheet
          </button>
        </div>
      )}

      <ul className="divide-y divide-slate-100 border-y border-slate-100">
        {types.map((type, i) => {
          const used = usageByName[type.name] ?? 0;
          const editing = editingId === type.id;
          return (
            <li key={type.id ?? type.name} className="flex flex-wrap items-center gap-3 py-2.5">
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label={`Move ${type.name} up`}
                  onClick={() => move(i, -1)}
                  disabled={busy || i === 0 || !type.id}
                  className="px-1 text-xs leading-none text-slate-400 hover:text-brand-navy disabled:opacity-25"
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label={`Move ${type.name} down`}
                  onClick={() => move(i, 1)}
                  disabled={busy || i === types.length - 1 || !type.id}
                  className="px-1 text-xs leading-none text-slate-400 hover:text-brand-navy disabled:opacity-25"
                >
                  ▼
                </button>
              </div>

              {editing ? (
                <input
                  autoFocus
                  className={`${FIELD} max-w-xs flex-1 py-1.5`}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(type);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span
                  className={`flex-1 text-sm ${
                    type.hidden ? "text-slate-400 line-through" : "text-slate-800"
                  }`}
                >
                  {type.name}
                </span>
              )}

              <span className="text-xs text-slate-400">
                {used > 0 ? `${used} ticket${used === 1 ? "" : "s"}` : "unused"}
              </span>

              {!type.id ? (
                <span className="text-xs italic text-slate-400">from sheet</span>
              ) : editing ? (
                <>
                  <button type="button" onClick={() => handleRename(type)} disabled={busy} className={GHOST_BTN}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className={GHOST_BTN}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(type.id!);
                      setEditingName(type.name);
                    }}
                    className={GHOST_BTN}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => run("update the type", () => updateProjectType(type.id!, { hidden: !type.hidden }))}
                    disabled={busy}
                    className={GHOST_BTN}
                  >
                    {type.hidden ? "Show" : "Hide"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(type)}
                    disabled={busy}
                    className={`${GHOST_BTN} border-rose-200 text-rose-600 hover:bg-rose-50`}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-center gap-3">
        <input
          className={`${FIELD} max-w-xs flex-1`}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a project type…"
        />
        <button
          type="submit"
          disabled={busy || !newName.trim()}
          className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add
        </button>
        {!isFallback && (
          <button type="button" onClick={handleSeed} disabled={busy} className={GHOST_BTN}>
            Re-import sheet types
          </button>
        )}
      </form>
    </div>
  );
}
