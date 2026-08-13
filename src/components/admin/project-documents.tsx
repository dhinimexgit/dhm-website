"use client";

import { useRef, useState } from "react";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_LABELS,
  formatProjectDate,
  type DhmProject,
  type DocumentCategory,
  type ProjectDocument,
} from "@/lib/dhm-projects";
import {
  MAX_DOCUMENT_BYTES,
  formatFileSize,
  removeProjectDocument,
  uploadProjectDocument,
} from "@/lib/project-files";

type Props = {
  project: DhmProject;
  canUpdate: boolean;
  actorName: string;
  actorUsername: string;
  /** Category to scroll to / highlight when arriving from the timeline. */
  focus: DocumentCategory | null;
  onError: (message: string) => void;
};

export function ProjectDocuments({
  project,
  canUpdate,
  actorName,
  actorUsername,
  focus,
  onError,
}: Props) {
  const [uploading, setUploading] = useState<DocumentCategory | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {DOCUMENT_CATEGORIES.map((category) => (
        <DocumentBucket
          key={category}
          category={category}
          project={project}
          canUpdate={canUpdate}
          actorName={actorName}
          actorUsername={actorUsername}
          highlighted={focus === category}
          uploading={uploading === category}
          setUploading={setUploading}
          onError={onError}
        />
      ))}
    </div>
  );
}

function DocumentBucket({
  category,
  project,
  canUpdate,
  actorName,
  actorUsername,
  highlighted,
  uploading,
  setUploading,
  onError,
}: {
  category: DocumentCategory;
  project: DhmProject;
  canUpdate: boolean;
  actorName: string;
  actorUsername: string;
  highlighted: boolean;
  uploading: boolean;
  setUploading: (c: DocumentCategory | null) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const files = project.documents.filter((d) => d.category === category);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setUploading(category);
    try {
      // Sequential: each upload appends to the array read from `project`, so
      // running them in parallel would have later writes clobber earlier ones.
      for (const file of Array.from(list)) {
        await uploadProjectDocument(
          { ...project, documents: [...project.documents] },
          file,
          category,
          { name: actorName, username: actorUsername }
        );
      }
    } catch (err) {
      console.error("uploadProjectDocument failed", err);
      onError(err instanceof Error ? err.message : "Could not upload that file.");
    } finally {
      setUploading(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(doc: ProjectDocument) {
    if (!confirm(`Remove "${doc.name}"?`)) return;
    try {
      await removeProjectDocument(project, doc, { username: actorUsername });
    } catch (err) {
      console.error("removeProjectDocument failed", err);
      onError("Could not remove that file.");
    }
  }

  return (
    <div
      id={`documents-${category}`}
      className={`rounded-xl border bg-white p-4 shadow-sm transition ${
        highlighted ? "border-brand-navy ring-2 ring-brand-navy/20" : "border-slate-200"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-brand-navy">
          {DOCUMENT_CATEGORY_LABELS[category]}
          {files.length > 0 && (
            <span className="ml-2 text-sm font-medium text-slate-500">{files.length}</span>
          )}
        </h4>
        {canUpdate && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-navy hover:bg-brand-navy/5 disabled:opacity-40"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {files.length === 0 ? (
        <p className="py-5 text-center text-sm text-slate-500">
          No files yet{canUpdate ? ` · max ${formatFileSize(MAX_DOCUMENT_BYTES)} each` : ""}
        </p>
      ) : (
        <ul className="space-y-2">
          {files.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
              <svg
                className="h-4 w-4 flex-shrink-0 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <div className="min-w-0 flex-1">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-base font-medium text-brand-navy hover:text-brand-red"
                  title={doc.name}
                >
                  {doc.name}
                </a>
                <p className="truncate text-xs text-slate-500">
                  {formatFileSize(doc.size)} · {doc.uploadedByName} ·{" "}
                  {formatProjectDate(doc.uploadedAt.slice(0, 10))}
                </p>
              </div>
              {canUpdate && (
                <button
                  type="button"
                  onClick={() => handleRemove(doc)}
                  aria-label={`Remove ${doc.name}`}
                  className="flex-shrink-0 rounded p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
