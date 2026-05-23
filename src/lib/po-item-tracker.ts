/** PO row shape required for cross-PO item aggregation (Branch Functions item tracker). */
export type PoForItemTracker = {
  id: string;
  branchName: string;
  prNumber: string;
  poNumber: string;
  items: Array<{
    lineNo: number;
    itemCode?: string;
    item: string;
    unit: string;
    quantity: number;
  }>;
  openedTotals?: Record<string, number>;
};

export type PoItemLineBreakdown = {
  poId: string;
  poNumber: string;
  branchName: string;
  prNumber: string;
  lineNo: number;
  itemCode?: string;
  ordered: number;
  opened: number;
  remaining: number;
};

export type AggregatedPoItemRow = {
  groupKey: string;
  itemDisplay: string;
  unit: string;
  itemCode?: string;
  totalOrdered: number;
  totalOpened: number;
  totalRemaining: number;
  poCount: number;
  lines: PoItemLineBreakdown[];
};

export type AggregatePoItemsOptions = {
  branchFilter?: string;
  itemSearch?: string;
  onlyWithRemaining?: boolean;
};

function normalizeKeyPart(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function itemTrackerGroupKey(item: string, unit: string): string {
  return `${normalizeKeyPart(item)}||${normalizeKeyPart(unit)}`;
}

function openedQtyForLine(po: PoForItemTracker, lineNo: number): number {
  return Number(po.openedTotals?.[String(lineNo)] ?? 0);
}

function matchesItemSearch(
  search: string,
  itemDisplay: string,
  itemCode: string | undefined,
  lines: PoItemLineBreakdown[],
): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  if (itemDisplay.toLowerCase().includes(q)) return true;
  if (itemCode?.toLowerCase().includes(q)) return true;
  return lines.some(
    (l) =>
      l.poNumber.toLowerCase().includes(q) ||
      l.prNumber.toLowerCase().includes(q),
  );
}

/**
 * Roll up line items across POs by item name + unit.
 * Ordered / opened / remaining use PO `openedTotals` (cumulative per line).
 */
export function aggregatePoItemsByName(
  pos: PoForItemTracker[],
  options: AggregatePoItemsOptions = {},
): AggregatedPoItemRow[] {
  const branchFilter = options.branchFilter?.trim();
  const itemSearch = options.itemSearch?.trim() ?? "";
  const onlyWithRemaining = options.onlyWithRemaining ?? false;

  const scopedPos = branchFilter
    ? pos.filter((po) => po.branchName.trim().toLowerCase() === branchFilter.toLowerCase())
    : pos;

  const groups = new Map<
    string,
    {
      itemDisplay: string;
      unit: string;
      itemCode?: string;
      lines: PoItemLineBreakdown[];
    }
  >();

  for (const po of scopedPos) {
    for (const line of po.items) {
      const ordered = Number(line.quantity ?? 0);
      if (ordered <= 0) continue;

      const opened = Math.min(ordered, openedQtyForLine(po, line.lineNo));
      const remaining = Math.max(0, ordered - opened);
      const key = itemTrackerGroupKey(line.item, line.unit);

      const breakdown: PoItemLineBreakdown = {
        poId: po.id,
        poNumber: po.poNumber,
        branchName: po.branchName,
        prNumber: po.prNumber,
        lineNo: line.lineNo,
        itemCode: line.itemCode,
        ordered,
        opened,
        remaining,
      };

      const existing = groups.get(key);
      if (!existing) {
        groups.set(key, {
          itemDisplay: line.item.trim(),
          unit: line.unit.trim(),
          itemCode: line.itemCode?.trim() || undefined,
          lines: [breakdown],
        });
      } else {
        if (line.item.trim().length > existing.itemDisplay.length) {
          existing.itemDisplay = line.item.trim();
        }
        if (!existing.itemCode && line.itemCode?.trim()) {
          existing.itemCode = line.itemCode.trim();
        }
        existing.lines.push(breakdown);
      }
    }
  }

  const rows: AggregatedPoItemRow[] = [];

  for (const [groupKey, group] of groups) {
    const totalOrdered = group.lines.reduce((s, l) => s + l.ordered, 0);
    const totalOpened = group.lines.reduce((s, l) => s + l.opened, 0);
    const totalRemaining = group.lines.reduce((s, l) => s + l.remaining, 0);
    const poCount = new Set(group.lines.map((l) => l.poId)).size;

    const row: AggregatedPoItemRow = {
      groupKey,
      itemDisplay: group.itemDisplay,
      unit: group.unit,
      itemCode: group.itemCode,
      totalOrdered,
      totalOpened,
      totalRemaining,
      poCount,
      lines: [...group.lines].sort((a, b) => {
        if (b.remaining !== a.remaining) return b.remaining - a.remaining;
        return a.poNumber.localeCompare(b.poNumber);
      }),
    };

    if (onlyWithRemaining && row.totalRemaining <= 0) continue;
    if (!matchesItemSearch(itemSearch, row.itemDisplay, row.itemCode, row.lines)) continue;

    rows.push(row);
  }

  rows.sort((a, b) => {
    if (b.totalRemaining !== a.totalRemaining) return b.totalRemaining - a.totalRemaining;
    if (b.totalOrdered !== a.totalOrdered) return b.totalOrdered - a.totalOrdered;
    return a.itemDisplay.localeCompare(b.itemDisplay);
  });

  return rows;
}
