"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  EMPTY_PROJECT,
  PROJECT_STATUSES,
  createProject,
  formatProjectDate,
  nextTicketNo,
  projectProgress,
  subscribeProjectTypes,
  subscribeProjects,
  todayIso,
  type DhmProject,
  type NewProjectInput,
  type ProjectStatus,
  type ProjectTypeRecord,
} from "@/lib/dhm-projects";
import { describeNotifyFailure, notifyProject } from "@/lib/notify-project";
import { ProjectTypeManager } from "@/components/admin/project-type-manager";
import { ProjectDashboard } from "@/components/admin/project-dashboard";
import { TelegramConnect } from "@/components/admin/telegram-connect";
import { getTelegramLinkState } from "@/app/actions/telegram-link";

type Props = {
  actorName: string;
  actorUsername: string;
  canSubmit: boolean;
  /** Editing the project-type list is restricted to the super admin. */
  isSuperAdmin: boolean;
};

const FIELD =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700";
const LABEL = "mb-2 block text-sm font-semibold text-slate-700";
const CARD = "rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6";
const PILL = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

const STATUS_PILL: Record<ProjectStatus, string> = {
  Ongoing: "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-slate-200 text-slate-600",
};

const EMPTY_FORM = {
  projectName: "",
  projectType: "",
  customerName: "",
  customerPhone: "",
  customerLocation: "",
  inquiryDetail: "",
  saleTeamInformed: "",
  remark: "",
};

export function DhmProjectsManager({ actorName, actorUsername, canSubmit, isSuperAdmin }: Props) {
  const [projects, setProjects] = useState<DhmProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM, saleTeamInformed: "" });
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ tone: "ok" | "warn" | "err"; text: string } | null>(null);
  const [projectTypes, setProjectTypes] = useState<ProjectTypeRecord[]>([]);
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);
  const [tgConnected, setTgConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = subscribeProjects((rows) => {
      setProjects(rows);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribeProjectTypes(setProjectTypes);
    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getTelegramLinkState()
      .then((s) => !cancelled && setTgConnected(s.connected))
      .catch(() => !cancelled && setTgConnected(false));
    return () => {
      cancelled = true;
    };
  }, [confirmingSubmit]);

  const typesAreFallback = projectTypes.length > 0 && projectTypes.every((t) => !t.id);

  const pickerTypes = useMemo(() => {
    const visible = projectTypes.filter((t) => !t.hidden).map((t) => t.name);
    return Array.from(new Set(visible));
  }, [projectTypes]);

  const typeUsage = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      if (p.projectType) counts[p.projectType] = (counts[p.projectType] ?? 0) + 1;
    }
    return counts;
  }, [projects]);

  useEffect(() => {
    setForm((f) => (f.saleTeamInformed ? f : { ...f, saleTeamInformed: todayIso() }));
  }, []);

  useEffect(() => {
    if (pickerTypes.length === 0) return;
    setForm((f) => (f.projectType ? f : { ...f, projectType: pickerTypes[0] }));
  }, [pickerTypes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (typeFilter !== "all" && p.projectType !== typeFilter) return false;
      if (!q) return true;
      return [p.ticketNo, p.projectName, p.customerName, p.customerLocation, p.projectLead]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [projects, statusFilter, typeFilter, search]);

  const counts = useMemo(
    () => ({
      all: projects.length,
      Ongoing: projects.filter((p) => p.status === "Ongoing").length,
      Completed: projects.filter((p) => p.status === "Completed").length,
      Cancelled: projects.filter((p) => p.status === "Cancelled").length,
    }),
    [projects]
  );

  function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || saving) return;

    if (!form.projectName.trim() || !form.customerName.trim()) {
      setBanner({ tone: "err", text: "Project name and customer name are required." });
      return;
    }
    setBanner(null);
    setConfirmingSubmit(true);
  }

  async function handleCreate() {
    if (!canSubmit || saving) return;

    setConfirmingSubmit(false);
    setSaving(true);
    setBanner(null);
    const ticketNo = nextTicketNo(projects);
    try {
      const input: NewProjectInput = {
        projectName: form.projectName.trim(),
        projectType: form.projectType.trim(),
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerLocation: form.customerLocation.trim(),
        inquiryDetail: form.inquiryDetail.trim(),
        saleTeamInformed: form.saleTeamInformed || todayIso(),
        remark: form.remark.trim(),
      };

      const id = await createProject(input, { name: actorName, username: actorUsername }, ticketNo);

      setForm({ ...EMPTY_FORM, saleTeamInformed: todayIso() });
      setShowForm(false);
      setBanner({ tone: "ok", text: `Ticket ${ticketNo} created.` });

      const result = await notifyProject(
        "created",
        {
          ...EMPTY_PROJECT,
          ...input,
          id,
          ticketNo,
          status: "Ongoing",
          submittedByName: actorName,
          submittedByUsername: actorUsername,
        },
        actorName
      );

      const failure = describeNotifyFailure(result);
      setBanner(
        failure
          ? { tone: "warn", text: `Ticket ${ticketNo} created, but ${failure}.` }
          : { tone: "ok", text: `Ticket ${ticketNo} created and sent to the group chat.` }
      );
    } catch (err) {
      console.error("createProject failed", err);
      setBanner({ tone: "err", text: "Could not create the ticket. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {confirmingSubmit && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-submit-title"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setConfirmingSubmit(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-submit-title" className="text-lg font-semibold text-brand-navy">
              Submit this ticket?
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-600">
              This creates ticket <span className="font-semibold">{nextTicketNo(projects)}</span> and
              posts a message to the technical group chat on Telegram. Everyone in that chat will be
              notified.
            </p>

            <dl className="mt-4 space-y-1.5 rounded-lg bg-slate-50 p-4 text-sm">
              <div className="flex gap-2">
                <dt className="w-24 flex-shrink-0 text-slate-500">Project</dt>
                <dd className="min-w-0 font-medium text-slate-800">{form.projectName}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 flex-shrink-0 text-slate-500">Customer</dt>
                <dd className="min-w-0 font-medium text-slate-800">{form.customerName}</dd>
              </div>
              {form.customerLocation && (
                <div className="flex gap-2">
                  <dt className="w-24 flex-shrink-0 text-slate-500">Location</dt>
                  <dd className="min-w-0 font-medium text-slate-800">{form.customerLocation}</dd>
                </div>
              )}
            </dl>

            {tgConnected === false && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-900">
                  <span className="font-semibold">Your Telegram is not connected.</span> The ticket
                  will still be posted, but the group will not know it came from you. Connect it
                  from the banner at the top of this page.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmingSubmit(false)}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                onClick={handleCreate}
                className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90"
              >
                Submit and notify
              </button>
            </div>
          </div>
        </div>
      )}

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

      {canSubmit && <TelegramConnect />}

      {!loading && <ProjectDashboard projects={projects} />}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(["all", ...PROJECT_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                statusFilter === s
                  ? "bg-brand-navy text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {s === "all" ? "All" : s} ({counts[s]})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setShowTypeManager((v) => !v)}
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {showTypeManager ? "Hide project types" : "Project types"}
            </button>
          )}
          {canSubmit && (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90"
            >
              {showForm ? "Cancel" : "+ New Project Ticket"}
            </button>
          )}
        </div>
      </div>

      {showTypeManager && isSuperAdmin && (
        <ProjectTypeManager
          types={projectTypes}
          usageByName={typeUsage}
          isFallback={typesAreFallback}
        />
      )}

      {showForm && canSubmit && (
        <form onSubmit={handleSubmitRequest} className={CARD}>
          <h2 className="mb-1 text-lg font-semibold text-brand-navy">New Project Ticket</h2>
          <p className="mb-5 text-sm text-slate-500">
            Raised by {actorName}. Submitting notifies the technical group chat on Telegram.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={LABEL}>Project Name *</label>
              <input
                className={FIELD}
                value={form.projectName}
                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                placeholder="e.g. Install Transformer 2×1000kVA (Mr.Sodanid)"
              />
            </div>

            <div>
              <label className={LABEL}>Project Type</label>
              <select
                className={FIELD}
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              >
                {pickerTypes.length === 0 && <option value="">Loading types…</option>}
                {pickerTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setShowTypeManager(true)}
                  className="mt-1.5 text-xs font-semibold text-brand-navy hover:text-brand-red"
                >
                  Manage project types
                </button>
              )}
            </div>

            <div>
              <label className={LABEL}>Customer Name *</label>
              <input
                className={FIELD}
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
            </div>

            <div>
              <label className={LABEL}>Customer Phone</label>
              <input
                className={FIELD}
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                placeholder="068 897 777"
              />
            </div>

            <div>
              <label className={LABEL}>Customer Location / Area</label>
              <input
                className={FIELD}
                value={form.customerLocation}
                onChange={(e) => setForm({ ...form, customerLocation: e.target.value })}
                placeholder="e.g. Kampong Cham"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL}>Information received from customer</label>
              <textarea
                className={`${FIELD} min-h-[110px]`}
                value={form.inquiryDetail}
                onChange={(e) => setForm({ ...form, inquiryDetail: e.target.value })}
                placeholder="What the customer asked for, quantities, symptoms, site conditions…"
              />
            </div>

            <div>
              <label className={LABEL}>Date Submitted</label>
              <input
                type="date"
                className={FIELD}
                value={form.saleTeamInformed}
                onChange={(e) => setForm({ ...form, saleTeamInformed: e.target.value })}
              />
            </div>

            <div>
              <label className={LABEL}>Remark</label>
              <input
                className={FIELD}
                value={form.remark}
                onChange={(e) => setForm({ ...form, remark: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90 disabled:opacity-50"
            >
              {saving ? "Submitting…" : "Submit Ticket"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div>
          <label className={LABEL}>Search</label>
          <input
            className={FIELD}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ticket, project, customer, zone, lead…"
          />
        </div>
        <div>
          <label className={LABEL}>Project Type</label>
          <select className={FIELD} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All types</option>
            {Array.from(new Set(projects.map((p) => p.projectType).filter(Boolean))).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <p className="text-sm text-slate-600">
            Showing {filtered.length} of {projects.length} projects
          </p>
        </div>
      </div>

      {loading ? (
        <p className="px-6 py-12 text-center text-sm text-slate-500">Loading projects…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-500">
            {projects.length === 0
              ? "No project tickets yet. Sales can raise the first one above."
              : "No projects match these filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <ProjectRow key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectRow({ project }: { project: DhmProject }) {
  const progress = projectProgress(project);
  const docCount = project.documents.length;
  const updateCount = project.updates.length;

  return (
    <Link
      href={`/dhm-myadmin/dhm-projects/${project.id}`}
      className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-navy/40 hover:shadow-md"
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {project.ticketNo || "—"}
          </code>
          <h3 className="text-base font-semibold text-brand-navy">{project.projectName}</h3>
          <span className={`${PILL} ${STATUS_PILL[project.status]}`}>{project.status}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="font-medium text-slate-800">{project.customerName}</span>
          {project.projectType && <span>· {project.projectType}</span>}
          {project.customerLocation && <span>· {project.customerLocation}</span>}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          <span>
            Raised by{" "}
            <span className="font-medium text-slate-700">{project.submittedByName || "—"}</span>
            {project.saleTeamInformed && ` · ${formatProjectDate(project.saleTeamInformed)}`}
          </span>
          <span>
            Lead{" "}
            <span className="font-medium text-slate-700">
              {project.projectLead || "unassigned"}
            </span>
          </span>
          {docCount > 0 && <span>· {docCount} file{docCount === 1 ? "" : "s"}</span>}
          {updateCount > 0 && <span>· {updateCount} update{updateCount === 1 ? "" : "s"}</span>}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <span className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
            <span
              className={`block h-full rounded-full transition-[width] duration-500 ${
                project.status === "Cancelled" ? "bg-slate-400" : "bg-brand-navy"
              }`}
              style={{ width: `${progress.percent}%` }}
            />
          </span>
          <span className="text-sm text-slate-500">
            {progress.done}/{progress.total} · {progress.currentStage}
          </span>
        </div>
      </div>

      <svg
        className="mt-1 h-5 w-5 flex-shrink-0 text-slate-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}