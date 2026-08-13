"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { formatProjectDate, todayIso, type DhmProject, type ProjectUpdate } from "@/lib/dhm-projects";
import { addProjectUpdate, removeProjectUpdate } from "@/lib/project-files";

/**
 * Dated site-progress feed.
 *
 * Newest first, each entry stamped with its date and author, so the thread
 * reads as a record of what happened on site rather than a photo dump.
 * Photos go through compressImage on the way up.
 */

const FIELD =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-700";

type Props = {
  project: DhmProject;
  canUpdate: boolean;
  actorName: string;
  actorUsername: string;
  onError: (message: string) => void;
};

export function ProjectUpdates({ project, canUpdate, actorName, actorUsername, onError }: Props) {
  const [date, setDate] = useState(todayIso());
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo(
    () =>
      [...project.updates].sort((a, b) =>
        // Same-day entries fall back to post time so ordering stays stable.
        a.date === b.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)
      ),
    [project.updates]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!note.trim() && files.length === 0) {
      onError("Add a note or at least one photo.");
      return;
    }
    setBusy(true);
    try {
      await addProjectUpdate(
        project,
        { date: date || todayIso(), note, files },
        { name: actorName, username: actorUsername }
      );
      setNote("");
      setFiles([]);
      setDate(todayIso());
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error("addProjectUpdate failed", err);
      onError("Could not post that update.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(entry: ProjectUpdate) {
    if (!confirm("Delete this update and its photos?")) return;
    try {
      await removeProjectUpdate(project, entry, { username: actorUsername });
    } catch (err) {
      console.error("removeProjectUpdate failed", err);
      onError("Could not delete that update.");
    }
  }

  return (
    <div className="space-y-5">
      {canUpdate && (
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date</label>
              <input type="date" className={FIELD} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Progress note</label>
              <textarea
                className={`${FIELD} min-h-[68px]`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What happened on site…"
              />
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-navy hover:bg-brand-navy/5"
            >
              Add photos
            </button>
            {files.length > 0 && (
              <span className="text-sm text-slate-600">
                {files.length} photo{files.length === 1 ? "" : "s"} ready
                <button
                  type="button"
                  onClick={() => {
                    setFiles([]);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="ml-2 font-semibold text-slate-400 hover:text-rose-600"
                >
                  clear
                </button>
              </span>
            )}
            <button
              type="submit"
              disabled={busy}
              className="ml-auto rounded-full bg-brand-navy px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-40"
            >
              {busy ? "Posting…" : "Post update"}
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-base text-slate-500">
          No progress updates yet.
        </p>
      ) : (
        <ol className="space-y-4">
          {entries.map((entry) => (
            <li key={entry.id} className="relative flex gap-4">
              <span aria-hidden className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand-navy" />
              <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-base font-semibold text-brand-navy">
                    {formatProjectDate(entry.date)}
                  </p>
                  <p className="text-sm text-slate-500">{entry.authorName}</p>
                </div>

                {entry.note && (
                  <p className="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed text-slate-700">
                    {entry.note}
                  </p>
                )}

                {entry.photos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.photos.map((photo) => (
                      <button
                        key={photo.path}
                        type="button"
                        onClick={() => setLightbox({ url: photo.url, name: photo.name })}
                        className="relative h-24 w-24 overflow-hidden rounded-lg ring-1 ring-slate-200 transition hover:ring-brand-navy"
                      >
                        <Image
                          src={photo.url}
                          alt={photo.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => remove(entry)}
                    className="mt-3 text-sm font-semibold text-slate-500 transition hover:text-rose-600"
                  >
                    Delete update
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.name}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/70 p-6"
        >
          <div className="relative max-h-full w-full max-w-3xl">
            {/* Intentionally a plain img: the Storage URL is already a
                compressed WebP, and next/image cannot resize an arbitrary
                remote object any further here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt={lightbox.name}
              className="mx-auto max-h-[80vh] w-auto rounded-xl object-contain"
            />
            <p className="mt-3 text-center text-sm text-white/80">{lightbox.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
