"use client";

import { useRef, useState } from "react";
import {
  AGREEMENT_STATES,
  LIFECYCLE_STAGES,
  QUOTE_STATES,
  formatProjectDate,
  stageIsComplete,
  todayIso,
  type AgreementState,
  type DhmProject,
  type DocumentCategory,
  type LifecycleStage,
  type ProjectPatch,
  type QuoteState,
  DURATION_UNITS,
  formatDuration,
  parseDuration,
  type DurationUnit,
} from "@/lib/dhm-projects";
import {
  formatFileSize,
  removeProjectDocument,
  uploadProjectDocument,
} from "@/lib/project-files";

/**
 * The lifecycle as a walkable track rather than a grid of inputs.
 *
 * Each stage is a step you can see the state of at a glance — cleared, current,
 * or still ahead — the way a construction programme is read. Editing happens in
 * place on one step at a time, so the page stays a status view rather than a
 * form. Stages that carry paperwork expose their document count and a jump to
 * the matching upload panel.
 */

const FIELD =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-700";

/** Real buttons, not text links — these are the primary action on each step. */
const STEP_BTN =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-navy hover:bg-brand-navy/5 disabled:opacity-40";
const STEP_BTN_PRIMARY =
  "inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy/90 disabled:opacity-40";
const STEP_BTN_QUIET =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50";

/** Which stages have paperwork attached to them. */
const STAGE_DOCUMENTS: Partial<Record<string, DocumentCategory>> = {
  boqDate: "boq",
  quoteToCustomer: "quote",
  contractSignedDate: "contract",
};

/**
 * Files for one stage, uploaded in place.
 *
 * Attaching used to jump to the Documents tab, upload there, then come back —
 * three context switches for one file. The picker now opens straight from the
 * step and the list renders underneath it.
 */
function StageFiles({
  project,
  category,
  canUpdate,
  actorName,
  actorUsername,
  onError,
}: {
  project: DhmProject;
  category: DocumentCategory;
  canUpdate: boolean;
  actorName: string;
  actorUsername: string;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const files = project.documents.filter((d) => d.category === category);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setUploading(true);
    try {
      // Sequential: each upload appends to the array read from `project`, so
      // parallel writes would clobber one another.
      for (const file of Array.from(list)) {
        await uploadProjectDocument(project, file, category, {
          name: actorName,
          username: actorUsername,
        });
      }
    } catch (err) {
      console.error("uploadProjectDocument failed", err);
      onError(err instanceof Error ? err.message : "Could not upload that file.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {canUpdate && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`${STEP_BTN} ${files.length > 0 ? "" : "border-dashed"}`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
          </svg>
          {uploading ? "Uploading…" : files.length > 0 ? "Add another" : "Attach file"}
        </button>
      )}

      {files.length > 0 && (
        <ul className="mt-2 w-full space-y-1.5">
          {files.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"
            >
              <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate text-sm font-medium text-brand-navy hover:text-brand-red"
                title={doc.name}
              >
                {doc.name}
              </a>
              <span className="flex-shrink-0 text-xs text-slate-500">
                {formatFileSize(doc.size)}
              </span>
              {canUpdate && (
                <button
                  type="button"
                  aria-label={`Remove ${doc.name}`}
                  onClick={async () => {
                    if (!confirm(`Remove "${doc.name}"?`)) return;
                    try {
                      await removeProjectDocument(project, doc, { username: actorUsername });
                    } catch (err) {
                      console.error("removeProjectDocument failed", err);
                      onError("Could not remove that file.");
                    }
                  }}
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
    </>
  );
}

type StageState = "done" | "current" | "todo";

function stageValueOf(project: DhmProject, stage: LifecycleStage): string {
  return String(project[stage.key] ?? "").trim();
}

type Props = {
  project: DhmProject;
  canUpdate: boolean;
  busy: boolean;
  onPatch: (patch: ProjectPatch) => Promise<void>;
  actorName: string;
  actorUsername: string;
  onError: (message: string) => void;
};

export function ProjectTimeline({
  project,
  canUpdate,
  busy,
  onPatch,
  actorName,
  actorUsername,
  onError,
}: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const milestones = LIFECYCLE_STAGES.filter((s) => !s.informational);
  const firstOpen = milestones.find((s) => !stageIsComplete(project, s));
  const isClosed = project.status !== "Ongoing";

  const stateOf = (stage: LifecycleStage): StageState => {
    if (stageIsComplete(project, stage)) return "done";
    if (!isClosed && firstOpen && firstOpen.key === stage.key) return "current";
    return "todo";
  };

  async function commit(stage: LifecycleStage) {
    await onPatch({ [stage.key]: draft } as ProjectPatch);
    setEditing(null);
  }

  return (
    <ol className="relative space-y-0">
      {LIFECYCLE_STAGES.map((stage, i) => {
        const key = String(stage.key);
        const state = stateOf(stage);
        const raw = stageValueOf(project, stage);
        const isEditing = editing === key;
        const docCategory = STAGE_DOCUMENTS[key];
        const last = i === LIFECYCLE_STAGES.length - 1;

        return (
          <li
            key={key}
            className={`relative flex gap-4 rounded-xl px-3 py-3 transition ${
              state === "current" ? "bg-brand-navy/5" : ""
            }`}
          >
            {/* Rail */}
            {!last && (
              <span
                aria-hidden
                className={`absolute left-[26px] top-12 h-full w-0.5 ${
                  state === "done" ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}

            {/* Node */}
            <span
              aria-hidden
              className={`relative z-10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                state === "done"
                  ? "bg-emerald-600 text-white"
                  : state === "current"
                  ? "bg-white text-brand-navy ring-2 ring-brand-navy"
                  : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
              }`}
            >
              {state === "done" ? "✓" : i + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p
                  className={`text-base font-semibold ${
                    state === "todo" ? "text-slate-500" : "text-brand-navy"
                  }`}
                >
                  {stage.label}
                </p>
                {state === "current" && (
                  <span className="rounded-full bg-brand-navy px-2.5 py-1 text-xs font-semibold text-white">
                    In progress
                  </span>
                )}
                {stage.informational && (
                  <span className="text-xs text-slate-500">reference only</span>
                )}
              </div>

              {isEditing ? (
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <StageInput stage={stage} value={draft} onChange={setDraft} />
                  <button
                    type="button"
                    onClick={() => commit(stage)}
                    disabled={busy}
                    className={STEP_BTN_PRIMARY}
                  >
                    Save
                  </button>
                  <button type="button" onClick={() => setEditing(null)} className={STEP_BTN_QUIET}>
                    Cancel
                  </button>
                  {stage.kind === "date" && (
                    <button type="button" onClick={() => setDraft(todayIso())} className={STEP_BTN}>
                      Today
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p
                    className={`text-base ${
                      raw ? "font-medium text-slate-800" : "italic text-slate-500"
                    }`}
                  >
                    {raw
                      ? stage.kind === "date"
                        ? formatProjectDate(raw)
                        : raw
                      : "Not recorded"}
                  </p>

                  {canUpdate && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(key);
                        setDraft(raw);
                      }}
                      className={raw ? STEP_BTN : STEP_BTN_PRIMARY}
                    >
                      {raw ? "Edit" : "Set date"}
                    </button>
                  )}

                  {docCategory && (
                    <StageFiles
                      project={project}
                      category={docCategory}
                      canUpdate={canUpdate}
                      actorName={actorName}
                      actorUsername={actorUsername}
                      onError={onError}
                    />
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StageInput({
  stage,
  value,
  onChange,
}: {
  stage: LifecycleStage;
  value: string;
  onChange: (v: string) => void;
}) {
  if (stage.kind === "quote") {
    return (
      <select
        autoFocus
        className={`${FIELD} max-w-[12rem]`}
        value={value}
        onChange={(e) => onChange(e.target.value as QuoteState)}
      >
        {QUOTE_STATES.map((s) => (
          <option key={s || "none"} value={s}>
            {s || "—"}
          </option>
        ))}
      </select>
    );
  }
  if (stage.kind === "agreement") {
    return (
      <select
        autoFocus
        className={`${FIELD} max-w-[14rem]`}
        value={value}
        onChange={(e) => onChange(e.target.value as AgreementState)}
      >
        {AGREEMENT_STATES.map((s) => (
          <option key={s || "none"} value={s}>
            {s || "—"}
          </option>
        ))}
      </select>
    );
  }
  if (stage.kind === "duration") {
    // Stored as one string ("3 months") but entered as a number plus a unit,
    // so nobody has to remember the format.
    const { value: n, unit } = parseDuration(value);
    return (
      <span className="flex items-center gap-2">
        <input
          autoFocus
          type="number"
          min={0}
          step={1}
          className={`${FIELD} w-24`}
          value={n}
          onChange={(e) => onChange(formatDuration(e.target.value, unit))}
          placeholder="0"
        />
        <select
          className={`${FIELD} w-32`}
          value={unit}
          onChange={(e) => onChange(formatDuration(n, e.target.value as DurationUnit))}
        >
          {DURATION_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </span>
    );
  }
  if (stage.kind === "text") {
    return (
      <input
        autoFocus
        className={`${FIELD} max-w-[14rem]`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      autoFocus
      type="date"
      className={`${FIELD} max-w-[12rem]`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
