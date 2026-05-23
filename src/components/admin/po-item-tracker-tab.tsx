"use client";

import { Fragment, useMemo, useState } from "react";
import {
  aggregatePoItemsByName,
  type PoForItemTracker,
} from "@/lib/po-item-tracker";

export type PoItemTrackerLabels = {
  itemTracker: string;
  itemTrackerDesc: string;
  searchItem: string;
  onlyWithRemaining: string;
  itemName: string;
  itemCode: string;
  unit: string;
  trackerColOrdered: string;
  totalOpened: string;
  trackerColRemaining: string;
  poCount: string;
  poBreakdown: string;
  viewPo: string;
  lineNo: string;
  branch: string;
  prNumber: string;
  poNumber: string;
  orderedQty: string;
  openedShort: string;
  qtyLeft: string;
  loadingRecords: string;
  noItemsFound: string;
  expandRow: string;
  collapseRow: string;
  trackerSummary: string;
  allBranches: string;
  clearFilters: string;
  fulfilled: string;
  partial: string;
  notOpened: string;
};

type Props = {
  pos: PoForItemTracker[];
  loading: boolean;
  branches: readonly string[];
  labels: PoItemTrackerLabels;
  fmt: (template: string, vars: Record<string, string | number>) => string;
  formatPoNumber: (poNumber: string) => string;
  onOpenPoInView?: (poId: string) => void;
};

function qtyCell(value: number, emphasize?: "remaining") {
  const base = "tabular-nums font-semibold";
  if (emphasize === "remaining" && value > 0) {
    return <span className={`${base} text-amber-700`}>{value.toLocaleString()}</span>;
  }
  if (value <= 0 && emphasize === "remaining") {
    return <span className="tabular-nums text-emerald-600">0</span>;
  }
  return <span className={base}>{value.toLocaleString()}</span>;
}

export function PoItemTrackerTab({
  pos,
  loading,
  branches,
  labels,
  fmt,
  formatPoNumber,
  onOpenPoInView,
}: Props) {
  const [branchFilter, setBranchFilter] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [onlyWithRemaining, setOnlyWithRemaining] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set());

  const aggregated = useMemo(
    () =>
      aggregatePoItemsByName(pos, {
        branchFilter: branchFilter || undefined,
        itemSearch,
        onlyWithRemaining,
      }),
    [pos, branchFilter, itemSearch, onlyWithRemaining],
  );

  const summary = useMemo(() => {
    const poIds = new Set<string>();
    let totalRemaining = 0;
    for (const row of aggregated) {
      totalRemaining += row.totalRemaining;
      for (const line of row.lines) poIds.add(line.poId);
    }
    return { itemCount: aggregated.length, poCount: poIds.size, totalRemaining };
  }, [aggregated]);

  const hasFilters = !!(branchFilter || itemSearch.trim() || !onlyWithRemaining);

  const toggleExpanded = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* <div className="rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm text-sky-950">
        <p className="font-semibold text-brand-navy">{labels.itemTracker}</p>
        <p className="mt-1 text-sky-900/90">{labels.itemTrackerDesc}</p>
      </div> */}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4 lg:grid-cols-5">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">{labels.searchItem}</label>
          <input
            type="search"
            value={itemSearch}
            onChange={(e) => setItemSearch(e.target.value)}
            placeholder={labels.searchItem}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">{labels.branch}</label>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700"
          >
            <option value="">{labels.allBranches}</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={onlyWithRemaining}
              onChange={(e) => setOnlyWithRemaining(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
            />
            {labels.onlyWithRemaining}
          </label>
        </div>
        {hasFilters ? (
          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={() => {
                setBranchFilter("");
                setItemSearch("");
                setOnlyWithRemaining(true);
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              {labels.clearFilters}
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-sm text-slate-600">
        {fmt(labels.trackerSummary, {
          items: summary.itemCount,
          pos: summary.poCount,
          remaining: summary.totalRemaining.toLocaleString(),
        })}
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">{labels.loadingRecords}</p>
        ) : aggregated.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">{labels.noItemsFound}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="w-10 px-3 py-3" aria-hidden />
                  <th className="min-w-[200px] px-4 py-3 font-semibold">{labels.itemName}</th>
                  <th className="w-24 px-3 py-3 font-semibold">{labels.unit}</th>
                  <th className="w-28 px-3 py-3 text-right font-semibold">{labels.trackerColOrdered}</th>
                  <th className="w-28 px-3 py-3 text-right font-semibold">{labels.totalOpened}</th>
                  <th className="w-32 px-3 py-3 text-right font-semibold">{labels.trackerColRemaining}</th>
                  <th className="w-24 px-3 py-3 text-center font-semibold">{labels.poCount}</th>
                  <th className="w-28 px-3 py-3 text-center font-semibold">{labels.poBreakdown}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {aggregated.map((row) => {
                  const expanded = expandedKeys.has(row.groupKey);
                  const status =
                    row.totalRemaining <= 0
                      ? labels.fulfilled
                      : row.totalOpened > 0
                        ? labels.partial
                        : labels.notOpened;
                  return (
                    <Fragment key={row.groupKey}>
                      <tr className="bg-white hover:bg-slate-50/80">
                        <td className="w-10 px-3 py-3.5">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(row.groupKey)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100"
                            aria-expanded={expanded}
                            aria-label={expanded ? labels.collapseRow : labels.expandRow}
                          >
                            <svg
                              className={`h-4 w-4 transition ${expanded ? "rotate-90" : ""}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                        <td className="min-w-[200px] px-4 py-3.5">
                          <p className="font-semibold text-brand-navy">{row.itemDisplay}</p>
                          {row.itemCode ? (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {labels.itemCode}: {row.itemCode}
                            </p>
                          ) : null}
                        </td>
                        <td className="w-24 px-3 py-3.5 text-slate-600">{row.unit || "—"}</td>
                        <td className="w-28 px-3 py-3.5 text-right">{qtyCell(row.totalOrdered)}</td>
                        <td className="w-28 px-3 py-3.5 text-right">{qtyCell(row.totalOpened)}</td>
                        <td className="w-32 px-3 py-3.5 text-right">
                          {qtyCell(row.totalRemaining, "remaining")}
                        </td>
                        <td className="w-24 px-3 py-3.5 text-center tabular-nums">{row.poCount}</td>
                        <td className="w-28 px-3 py-3.5 text-center">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              row.totalRemaining <= 0
                                ? "bg-emerald-100 text-emerald-800"
                                : row.totalOpened > 0
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                      {expanded ? (
                        <tr className="bg-slate-50/60">
                          <td colSpan={8} className="px-4 pb-4 pt-1">
                            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                              <table className="w-full min-w-[720px] text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                                  <tr>
                                    <th className="px-3 py-2 text-left">{labels.poNumber}</th>
                                    <th className="px-3 py-2 text-left">{labels.branch}</th>
                                    <th className="px-3 py-2 text-left">{labels.prNumber}</th>
                                    <th className="px-3 py-2 text-center">{labels.lineNo}</th>
                                    <th className="px-3 py-2 text-right">{labels.orderedQty}</th>
                                    <th className="px-3 py-2 text-right">{labels.openedShort}</th>
                                    <th className="px-3 py-2 text-right">{labels.qtyLeft}</th>
                                    {onOpenPoInView ? (
                                      <th className="px-3 py-2 text-center">{labels.viewPo}</th>
                                    ) : null}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {row.lines.map((line) => (
                                    <tr key={`${line.poId}-${line.lineNo}`}>
                                      <td className="px-3 py-2 font-semibold text-brand-navy">
                                        {formatPoNumber(line.poNumber)}
                                      </td>
                                      <td className="px-3 py-2 text-slate-600">{line.branchName}</td>
                                      <td className="px-3 py-2 text-slate-600">{line.prNumber}</td>
                                      <td className="px-3 py-2 text-center text-slate-500">{line.lineNo}</td>
                                      <td className="px-3 py-2 text-right tabular-nums">
                                        {line.ordered.toLocaleString()}
                                      </td>
                                      <td className="px-3 py-2 text-right tabular-nums">
                                        {line.opened.toLocaleString()}
                                      </td>
                                      <td className="px-3 py-2 text-right">
                                        {qtyCell(line.remaining, "remaining")}
                                      </td>
                                      {onOpenPoInView ? (
                                        <td className="px-3 py-2 text-center">
                                          <button
                                            type="button"
                                            onClick={() => onOpenPoInView(line.poId)}
                                            className="rounded-full border border-brand-navy/30 px-2.5 py-1 text-[10px] font-semibold text-brand-navy hover:bg-brand-navy/5"
                                          >
                                            {labels.viewPo}
                                          </button>
                                        </td>
                                      ) : null}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
