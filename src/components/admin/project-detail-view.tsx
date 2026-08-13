"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PROJECT_STATUSES,
  diffProject,
  formatProjectDate,
  projectProgress,
  subscribeProject,
  todayIso,
  updateProject,
  type DhmProject,
  type DocumentCategory,
  type ProjectPatch,
  type ProjectStatus,
} from "@/lib/dhm-projects";
import { describeNotifyFailure, notifyProject } from "@/lib/notify-project";
import { ProjectTimeline } from "@/components/admin/project-timeline";
import { ProjectDocuments } from "@/components/admin/project-documents";
import { ProjectUpdates } from "@/components/admin/project-updates";
import { ProjectComments } from "@/components/admin/project-comments";

const PILL = "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold";

const STATUS_PILL: Record<ProjectStatus, string> = {
  Ongoing: "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-slate-200 text-slate-600",
};

const LIST_HREF = "/dhm-myadmin/dhm-projects";

type PageProps = {
  projectId: string;
  actorName: string;
  actorUsername: string;
  canUpdate: boolean;
};

/**
 * One project, on its own page.
 *
 * The register used to expand each ticket inline, which does not survive a
 * realistic number of projects — ten open accordions is an unreadable page.
 * A ticket now has its own URL, so it can be linked, bookmarked and shared.
 */
export function ProjectDetailPage({ projectId, actorName, actorUsername, canUpdate }: PageProps) {
  const [project, setProject] = useState<DhmProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ tone: "ok" | "warn" | "err"; text: string } | null>(null);

  useEffect(() => {
    const unsub = subscribeProject(projectId, (p) => {
      setProject(p);
      setLoading(false);
    });
    return () => unsub();
  }, [projectId]);

  async function handlePatch(current: DhmProject, patch: ProjectPatch) {
    if (!canUpdate) return;
    const after = { ...current, ...patch } as DhmProject;
    const changes = diffProject(current, after);
    if (changes.length === 0) return;

    try {
      await updateProject(current.id, patch, { username: actorUsername });

      const acknowledging = !current.acknowledgedDate && Boolean(patch.acknowledgedDate);
      const closing =
        current.status === "Ongoing" &&
        (after.status === "Completed" || after.status === "Cancelled");

      const result = await notifyProject(
        acknowledging ? "acknowledged" : closing ? "closed" : "updated",
        after,
        actorName,
        changes
      );
      const failure = describeNotifyFailure(result);
      setBanner(
        failure
          ? { tone: "warn", text: `Saved, but ${failure}.` }
          : { tone: "ok", text: "Saved and posted to the group chat." }
      );
    } catch (err) {
      console.error("updateProject failed", err);
      setBanner({ tone: "err", text: "Could not save that change. Please try again." });
    }
  }

  if (loading) {
    return <p className="py-20 text-center text-base text-slate-500">Loading project…</p>;
  }

  if (!project) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-base text-slate-600">This project no longer exists.</p>
        <Link
          href={LIST_HREF}
          className="mt-4 inline-block rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white"
        >
          Back to all projects
        </Link>
      </div>
    );
  }

  const progress = projectProgress(project);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={LIST_HREF}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-navy"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          All projects
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="rounded bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">
            {project.ticketNo || "—"}
          </code>
          <h1 className="text-2xl font-semibold text-brand-navy sm:text-3xl">
            {project.projectName}
          </h1>
          <StatusPill status={project.status} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <span className="h-2 w-48 overflow-hidden rounded-full bg-slate-200">
            <span
              className={`block h-full rounded-full transition-[width] duration-500 ${
                project.status === "Cancelled" ? "bg-slate-400" : "bg-brand-navy"
              }`}
              style={{ width: `${progress.percent}%` }}
            />
          </span>
          <span className="text-sm text-slate-600">
            {progress.done}/{progress.total} complete · {progress.currentStage}
          </span>
        </div>
      </div>

      {banner && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            banner.tone === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : banner.tone === "warn"
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {banner.text}
        </div>
      )}

      <ProjectDetail
        project={project}
        canUpdate={canUpdate}
        actorName={actorName}
        actorUsername={actorUsername}
        onPatch={handlePatch}
        onError={(text) => setBanner({ tone: "err", text })}
      />
    </div>
  );
}

function StatusPill({ status }: { status: ProjectStatus }) {
  return <span className={`${PILL} ${STATUS_PILL[status]}`}>{status}</span>;
}

type DetailTab = "overview" | "documents" | "updates" | "comments";

function ProjectDetail({
  project,
  canUpdate,
  actorName,
  actorUsername,
  onPatch,
  onError,
}: {
  project: DhmProject;
  canUpdate: boolean;
  actorName: string;
  actorUsername: string;
  onPatch: (project: DhmProject, patch: ProjectPatch) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [tab, setTab] = useState<DetailTab>("overview");
  const [busy, setBusy] = useState(false);
  const [docFocus, setDocFocus] = useState<DocumentCategory | null>(null);
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaDraft, setMetaDraft] = useState({ projectLead: "" });

  const progress = projectProgress(project);

  async function patch(p: ProjectPatch) {
    setBusy(true);
    await onPatch(project, p);
    setBusy(false);
  }

  async function acknowledge() {
    await patch({
      acknowledgedDate: todayIso(),
      acknowledgedByName: actorName,
      acknowledgedByUsername: actorUsername,
      ...(project.projectLead ? {} : { projectLead: actorName }),
    });
  }

  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: "overview", label: "Progress" },
    { id: "documents", label: "Documents", count: project.documents.length },
    { id: "updates", label: "Site updates", count: project.updates.length },
    { id: "comments", label: "Comments", count: project.comments.length },
  ];

  return (
    <div className="border-t border-slate-200 bg-slate-50/60">
      {/* Facts strip */}
      <div className="grid gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Customer" value={project.customerName} />
        <Detail
          label="Phone"
          value={project.customerPhone}
          href={project.customerPhone ? `tel:${project.customerPhone}` : undefined}
        />
        <Detail label="Location / Area" value={project.customerLocation} />
        <Detail label="Project type" value={project.projectType} />
        <Detail label="Created by" value={project.submittedByName} />
        <Detail label="Date submitted" value={formatProjectDate(project.saleTeamInformed)} />
        <Detail label="Received by" value={project.acknowledgedByName || "Not yet acknowledged"} />
        <Detail label="Project lead" value={project.projectLead || "Not yet assigned"} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 bg-white px-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              if (t.id !== "documents") setDocFocus(null);
            }}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition ${
              tab === t.id
                ? "border-brand-red text-brand-navy"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === "overview" && (
          <div className="space-y-5">
            {canUpdate && !project.acknowledgedDate && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-semibold text-amber-900">
                  Not yet acknowledged by the technical team.
                </p>
                <button
                  type="button"
                  onClick={acknowledge}
                  disabled={busy}
                  className="rounded-full bg-brand-navy px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
                >
                  Mark as received
                </button>
              </div>
            )}

            {project.inquiryDetail && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Information received from customer
                </p>
                <p className="whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
                  {project.inquiryDetail}
                </p>
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Project lifecycle
                  </p>
                  <span className="text-xs font-semibold text-slate-500">
                    {progress.done}/{progress.total} complete
                  </span>
                </div>
                <ProjectTimeline
                  project={project}
                  canUpdate={canUpdate}
                  busy={busy}
                  onPatch={patch}
                  actorName={actorName}
                  actorUsername={actorUsername}
                  onError={onError}
                />
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </p>
                  {canUpdate ? (
                    <select
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                      value={project.status}
                      onChange={(e) => patch({ status: e.target.value as ProjectStatus })}
                      disabled={busy}
                    >
                      {PROJECT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <StatusPill status={project.status} />
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Project lead
                    </p>
                    {canUpdate && !editingMeta && (
                      <button
                        type="button"
                        onClick={() => {
                          setMetaDraft({ projectLead: project.projectLead });
                          setEditingMeta(true);
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/5"
                      >
                        Reassign
                      </button>
                    )}
                  </div>

                  {editingMeta ? (
                    <div className="space-y-2">
                      <input
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                        value={metaDraft.projectLead}
                        onChange={(e) => setMetaDraft({ projectLead: e.target.value })}
                        placeholder="Project lead"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={async () => {
                            await patch(metaDraft);
                            setEditingMeta(false);
                          }}
                          className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingMeta(false)}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base font-medium text-slate-800">
                      {project.projectLead || "Not yet assigned"}
                    </p>
                  )}
                </div>

                {/* Read-only: this is what sales filed at intake. Anything said
                    afterwards belongs on the comment thread, not overwritten here. */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Remark from sales
                  </p>
                  <p className="whitespace-pre-wrap break-words text-base text-slate-700">
                    {project.remark || <span className="italic text-slate-500">No remark</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "documents" && (
          <ProjectDocuments
            project={project}
            canUpdate={canUpdate}
            actorName={actorName}
            actorUsername={actorUsername}
            focus={docFocus}
            onError={onError}
          />
        )}

        {tab === "comments" && (
          <ProjectComments
            project={project}
            canComment
            actorName={actorName}
            actorUsername={actorUsername}
            onError={onError}
          />
        )}

        {tab === "updates" && (
          <ProjectUpdates
            project={project}
            canUpdate={canUpdate}
            actorName={actorName}
            actorUsername={actorUsername}
            onError={onError}
          />
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          className="mt-1 block truncate text-base font-medium text-brand-navy hover:text-brand-red"
        >
          {value || "—"}
        </a>
      ) : (
        <p className="mt-1 truncate text-base font-medium text-slate-800">{value || "—"}</p>
      )}
    </div>
  );
}
