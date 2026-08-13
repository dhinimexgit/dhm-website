"use client";

import { useMemo, useState } from "react";
import {
  COMMENTS_PAGE_SIZE,
  addProjectComment,
  formatProjectInstant,
  type DhmProject,
} from "@/lib/dhm-projects";

/**
 * Append-only comment thread.
 *
 * Replaces what used to be an editable "remark" box. The intake remark is part
 * of the record sales filed and is now read-only; anything said afterwards is
 * a comment with an author and a timestamp, so the history of a ticket cannot
 * be quietly rewritten.
 *
 * Newest first, paginated — a long-running project accumulates a lot of these
 * and an unbounded thread would bury the timeline below it.
 */

type Props = {
  project: DhmProject;
  canComment: boolean;
  actorName: string;
  actorUsername: string;
  onError: (message: string) => void;
};

export function ProjectComments({
  project,
  canComment,
  actorName,
  actorUsername,
  onError,
}: Props) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState(COMMENTS_PAGE_SIZE);

  const ordered = useMemo(
    () => [...project.comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [project.comments]
  );

  const visible = ordered.slice(0, shown);
  const remaining = ordered.length - visible.length;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !text.trim()) return;
    setBusy(true);
    try {
      await addProjectComment(project, text, { name: actorName, username: actorUsername });
      setText("");
      // Keep the new comment in view rather than hiding it behind "show older".
      setShown((n) => Math.max(n, COMMENTS_PAGE_SIZE));
    } catch (err) {
      console.error("addProjectComment failed", err);
      onError("Could not post that comment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold text-brand-navy">Comments</h3>
        {ordered.length > 0 && (
          <span className="text-sm text-slate-500">
            {ordered.length} comment{ordered.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {canComment && (
        <form onSubmit={submit} className="mb-4">
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-700"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={busy || !text.trim()}
              className="rounded-full bg-brand-navy px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      )}

      {ordered.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">No comments yet.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {visible.map((c) => (
              <li key={c.id} className="rounded-lg bg-slate-50 px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-brand-navy">{c.authorName}</p>
                  <p className="text-xs text-slate-500">{formatProjectInstant(c.createdAt)}</p>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap break-words text-base leading-relaxed text-slate-700">
                  {c.text}
                </p>
              </li>
            ))}
          </ul>

          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setShown((n) => n + COMMENTS_PAGE_SIZE)}
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Show {Math.min(remaining, COMMENTS_PAGE_SIZE)} older
              {remaining > COMMENTS_PAGE_SIZE ? ` of ${remaining}` : ""}
            </button>
          )}

          {shown > COMMENTS_PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setShown(COMMENTS_PAGE_SIZE)}
              className="mt-2 w-full text-sm font-semibold text-slate-500 transition hover:text-brand-navy"
            >
              Collapse
            </button>
          )}
        </>
      )}
    </div>
  );
}
