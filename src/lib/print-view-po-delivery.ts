import type { Timestamp } from "firebase/firestore";
import { formatRemarkTimestamp, getItemRemarkEntries, type PoItemRemarkEntry } from "@/lib/po-item-remarks";

type PoItem = {
  lineNo: number;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
};

type OpeningPhase = {
  openedAt?: Timestamp;
  invoiceNumber?: string;
  createdByName?: string;
  items?: Array<{ lineNo: number; openedQty: number }>;
};

type PrintPo = {
  branchName: string;
  prNumber: string;
  poNumber: string;
  items: PoItem[];
  itemRemarkHistory?: Record<string, PoItemRemarkEntry[]>;
};

function getOpenedQtyThroughPhase(
  sortedHistory: OpeningPhase[],
  phaseIndex: number,
  lineNo: number,
): number {
  let sum = 0;
  for (let p = 0; p <= phaseIndex; p++) {
    const entry = (sortedHistory[p]?.items ?? []).find((e) => e.lineNo === lineNo);
    sum += Number(entry?.openedQty ?? 0);
  }
  return sum;
}

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPoNumberDisplay(poNumber: string): string {
  return poNumber.replace(/^W\.H\s*/i, "").trim() || poNumber;
}

function remarksForPrint(history: Record<string, PoItemRemarkEntry[]> | undefined, lineNo: number): string {
  const entries = getItemRemarkEntries(history, lineNo);
  if (!entries.length) return "—";
  return entries
    .map((e) => `${e.text} (${e.createdBy}, ${formatRemarkTimestamp(e)})`)
    .join("; ");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function printViewPoDelivery(
  po: PrintPo,
  sortedHistory: OpeningPhase[],
  phaseIndex: number,
): void {
  const phase = sortedHistory[phaseIndex];
  if (!phase) return;

  const openDate = phase.openedAt?.toDate
    ? phase.openedAt.toDate().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
  const openTime = phase.openedAt?.toDate
    ? phase.openedAt.toDate().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "";

  const rows = po.items.map((poItem) => {
    const entry = (phase.items ?? []).find((e) => e.lineNo === poItem.lineNo);
    const thisDelivery = entry?.openedQty ?? 0;
    const totalOpened = getOpenedQtyThroughPhase(sortedHistory, phaseIndex, poItem.lineNo);
    const remaining = Math.max(0, poItem.quantity - totalOpened);
    const deliveryValue = thisDelivery * (poItem.unitPrice ?? 0);

    return {
      lineNo: poItem.lineNo,
      item: poItem.item,
      unit: poItem.unit || "—",
      unitPrice: poItem.unitPrice > 0 ? formatUsd(poItem.unitPrice) : "—",
      ordered: poItem.quantity,
      thisDelivery: thisDelivery > 0 ? String(thisDelivery) : "—",
      deliveryValue: thisDelivery > 0 && deliveryValue > 0 ? formatUsd(deliveryValue) : "—",
      totalOpened: totalOpened > 0 ? String(totalOpened) : "—",
      remaining: String(remaining),
      remarks: remarksForPrint(po.itemRemarkHistory, poItem.lineNo),
      dim: thisDelivery <= 0,
    };
  });

  const totalPhaseQty = (phase.items ?? []).reduce((s, e) => s + (e.openedQty ?? 0), 0);
  const totalPhaseValue = (phase.items ?? []).reduce((s, e) => {
    const item = po.items.find((i) => i.lineNo === e.lineNo);
    return s + (e.openedQty ?? 0) * (item?.unitPrice ?? 0);
  }, 0);
  const totalOrdered = po.items.reduce((s, i) => s + i.quantity, 0);
  const totalAllOpened = po.items.reduce(
    (s, i) => s + getOpenedQtyThroughPhase(sortedHistory, phaseIndex, i.lineNo),
    0,
  );
  const totalRem = po.items.reduce(
    (s, i) => s + Math.max(0, i.quantity - getOpenedQtyThroughPhase(sortedHistory, phaseIndex, i.lineNo)),
    0,
  );

  const tableRows = rows
    .map(
      (r) => `
    <tr class="${r.dim ? "dim" : ""}">
      <td>#${r.lineNo} ${escapeHtml(r.item)}</td>
      <td class="num">${escapeHtml(r.unit)}</td>
      <td class="num">${r.unitPrice}</td>
      <td class="num">${r.ordered}</td>
      <td class="num">${r.thisDelivery}</td>
      <td class="num">${r.deliveryValue}</td>
      <td class="num">${r.totalOpened}</td>
      <td class="num">${r.remaining}</td>
      <td class="remarks">${escapeHtml(r.remarks)}</td>
    </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Delivery ${escapeHtml(phase.invoiceNumber ?? String(phaseIndex + 1))} — PO ${escapeHtml(formatPoNumberDisplay(po.poNumber))}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: "Segoe UI", Arial, sans-serif; font-size: 11px; color: #1e293b; margin: 24px; }
    h1 { font-size: 18px; margin: 0 0 4px; color: #0f2749; }
    .meta { margin-bottom: 16px; font-size: 12px; color: #475569; }
    .meta p { margin: 2px 0; }
    .badge { display: inline-block; background: #e8eef7; color: #0f2749; padding: 2px 8px; border-radius: 999px; font-weight: 600; font-size: 11px; margin-right: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top; }
    th { background: #f1f5f9; font-size: 10px; text-transform: uppercase; letter-spacing: 0.03em; color: #64748b; }
    td.num { text-align: right; white-space: nowrap; }
    td.remarks { max-width: 200px; font-size: 10px; }
    tr.dim td { color: #94a3b8; }
    tfoot td { font-weight: 700; background: #f8fafc; }
    @media print {
      body { margin: 12px; }
      @page { margin: 12mm; }
    }
  </style>
</head>
<body>
  <h1>Delivery Record</h1>
  <div class="meta">
    <p><span class="badge">${escapeHtml(phase.invoiceNumber ?? "—")}</span> ${escapeHtml(openDate)}${openTime ? ` · ${escapeHtml(openTime)}` : ""}${phase.createdByName ? ` · by ${escapeHtml(phase.createdByName)}` : ""}</p>
    <p><strong>PO Number:</strong> ${escapeHtml(formatPoNumberDisplay(po.poNumber))} &nbsp;|&nbsp; <strong>Branch:</strong> ${escapeHtml(po.branchName)} &nbsp;|&nbsp; <strong>PR Number:</strong> ${escapeHtml(po.prNumber)}</p>
    <p><strong>Delivery value:</strong> ${totalPhaseValue > 0 ? formatUsd(totalPhaseValue) : "—"} &nbsp;|&nbsp; <strong>Items in this delivery:</strong> ${totalPhaseQty}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Unit</th>
        <th>Unit Price ($)</th>
        <th>Ordered</th>
        <th>This Delivery</th>
        <th>Delivery Value ($)</th>
        <th>Total Opened</th>
        <th>Remaining</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td></td>
        <td></td>
        <td class="num">${totalOrdered}</td>
        <td class="num">${totalPhaseQty || "—"}</td>
        <td class="num">${totalPhaseValue > 0 ? formatUsd(totalPhaseValue) : "—"}</td>
        <td class="num">${totalAllOpened}</td>
        <td class="num">${totalRem}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");

  if (!printWindow) {
    URL.revokeObjectURL(url);
    alert("Could not open print window. Please allow pop-ups for this site.");
    return;
  }

  let didPrint = false;
  const triggerPrint = () => {
    if (didPrint) return;
    didPrint = true;
    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      /* print may be blocked until user interacts */
    }
    URL.revokeObjectURL(url);
  };

  printWindow.addEventListener("load", triggerPrint);
  window.setTimeout(triggerPrint, 600);
}
