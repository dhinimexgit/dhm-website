"use client";

import { useMemo } from "react";
import {
  LIFECYCLE_STAGES,
  PROJECT_STATUSES,
  stageIsComplete,
  type DhmProject,
  type ProjectStatus,
} from "@/lib/dhm-projects";

/**
 * Management overview.
 *
 * Headline counts are stat tiles, not a chart — a single number needs no plot.
 * The two plots below are single-hue magnitude bars (one series each), so they
 * carry no legend and no colour coding; every bar is direct-labelled with its
 * value, which removes the need for an axis or grid.
 *
 * Status colours are the reserved status palette, validated with the dataviz
 * checker: #c2410c / #15803d pass the lightness, chroma, normal-vision and
 * contrast checks, with CVD separation at 7.0 (the 6–8 band) — legal here only
 * because every status also carries a text label, never colour alone.
 * "Cancelled" is a deliberate neutral grey: it is a void state, not a series.
 */

const STATUS_INK: Record<ProjectStatus, string> = {
  Ongoing: "#c2410c",
  Completed: "#15803d",
  Cancelled: "#64748b",
};

/** Single hue for magnitude. Brand navy has ample contrast on white. */
const BAR_IN = "#2e388c";

type Props = { projects: DhmProject[] };

export function ProjectDashboard({ projects }: Props) {
  const stats = useMemo(() => {
    const byStatus = Object.fromEntries(
      PROJECT_STATUSES.map((s) => [s, projects.filter((p) => p.status === s).length])
    ) as Record<ProjectStatus, number>;

    const ongoing = projects.filter((p) => p.status === "Ongoing");
    const awaiting = ongoing.filter((p) => !p.acknowledgedDate).length;

    const today = new Date().toISOString().slice(0, 10);
    const overdue = ongoing.filter((p) => p.deadline && p.deadline < today).length;

    return { byStatus, awaiting, overdue, total: projects.length };
  }, [projects]);

  // How many live projects have cleared each milestone — a funnel, so the
  // reader can see where work is piling up.
  const funnel = useMemo(() => {
    const live = projects.filter((p) => p.status !== "Cancelled");
    const milestones = LIFECYCLE_STAGES.filter((s) => !s.informational);
    return milestones.map((stage) => ({
      label: stage.label,
      value: live.filter((p) => stageIsComplete(p, stage)).length,
      of: live.length,
    }));
  }, [projects]);

  const byType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      const key = p.projectType || "Unspecified";
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [projects]);

  if (projects.length === 0) return null;

  return (
    <section aria-label="Project overview" className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile label="Total projects" value={stats.total} />
        {PROJECT_STATUSES.map((s) => (
          <StatTile key={s} label={s} value={stats.byStatus[s]} ink={STATUS_INK[s]} />
        ))}
        <StatTile
          label="Awaiting technical"
          value={stats.awaiting}
          hint={stats.overdue > 0 ? `${stats.overdue} past deadline` : undefined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarPanel
          title="Pipeline"
          caption="Live projects that have cleared each milestone"
          rows={funnel}
          max={Math.max(1, ...funnel.map((r) => r.of))}
          emptyLabel="No live projects."
        />
        <BarPanel
          title="By project type"
          caption="All projects, most common first"
          rows={byType}
          max={Math.max(1, ...byType.map((r) => r.value))}
          emptyLabel="No projects yet."
        />
      </div>
    </section>
  );
}

function StatTile({
  label,
  value,
  ink,
  hint,
}: {
  label: string;
  value: number;
  ink?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {ink && (
          <span
            aria-hidden
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ backgroundColor: ink }}
          />
        )}
        <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-brand-navy">{value}</p>
      {hint && <p className="mt-1 text-xs font-medium text-[#c2410c]">{hint}</p>}
    </div>
  );
}

function BarPanel({
  title,
  caption,
  rows,
  max,
  emptyLabel,
}: {
  title: string;
  caption: string;
  rows: { label: string; value: number }[];
  max: number;
  emptyLabel: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold text-brand-navy">{title}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{caption}</p>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((row) => {
            const pct = max === 0 ? 0 : Math.round((row.value / max) * 100);
            return (
              <li key={row.label} className="grid grid-cols-[9.5rem_1fr_2rem] items-center gap-3">
                <span className="truncate text-xs text-slate-600" title={row.label}>
                  {row.label}
                </span>
                {/* Track is a recessive surface; the fill is the only ink. */}
                <span className="h-2.5 w-full overflow-hidden rounded-sm bg-slate-100">
                  <span
                    className="block h-full rounded-sm transition-[width] duration-500"
                    style={{ width: `${pct}%`, backgroundColor: BAR_IN }}
                    role="img"
                    aria-label={`${row.label}: ${row.value}`}
                  />
                </span>
                {/* Direct label — removes the need for an axis. */}
                <span className="text-right text-xs font-semibold tabular-nums text-slate-700">
                  {row.value}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
