"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import type { WorkBook } from "xlsx";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useLanguage } from "@/lib/i18n";
import {
  isPoInViewPoBranchScope,
  selectablePoBranchesForScope,
  viewPoScopeFromStaffProps,
} from "@/lib/branch-po-view-scope";
import {
  formatRemarkTimestamp,
  getItemRemarkEntries,
  parseItemRemarkHistoryFromPoData,
  buildItemRemarkHistoryFromSubmitDraft,
  remarkPreviewText,
  type PoItemRemarkEntry,
} from "@/lib/po-item-remarks";
import { printViewPoDelivery } from "@/lib/print-view-po-delivery";
import { PoItemTrackerTab } from "@/components/admin/po-item-tracker-tab";
import type { PoForItemTracker } from "@/lib/po-item-tracker";

/** Full-viewport dim layer: avoids a gap at the bottom on mobile (100vh vs dynamic viewport) and covers the home-indicator safe area. */
const PR_PO_MODAL_OVERLAY =
  "fixed inset-0 flex w-full min-h-screen min-h-[100dvh] min-h-[calc(100dvh+env(safe-area-inset-bottom,0px))] items-center justify-center overscroll-contain p-4";

type PurchaseOrderItem = {
  lineNo: number;
  itemCode?: string;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type SisterSupplierPoStored = {
  /** Stable id per uploaded row (multiple POs from the same supplier). */
  entryId?: string;
  supplier: string;
  items: PurchaseOrderItem[];
  poFileName: string | null;
  poFileUrl: string | null;
  totalLineItems: number;
  totalQuantity: number;
  totalAmount: number;
  vat10Amount: number | null;
  poGrandTotal: number | null;
};

function sisterSupplierPoLinkLabel(list: SisterSupplierPoStored[] | undefined, index: number): string {
  const rows = list ?? [];
  const sp = rows[index];
  if (!sp) return "PO";
  const supplier = sp.supplier;
  const sameCount = rows.filter((x) => x.supplier === supplier).length;
  if (sameCount <= 1) return `PO ${supplier}`;
  const ordinal = rows.slice(0, index + 1).filter((x) => x.supplier === supplier).length;
  return `PO ${supplier} (${ordinal})`;
}

/** Firestore rejects `undefined` anywhere in a document; parsed rows often set `itemCode: undefined`. */
function purchaseOrderItemsForFirestore(list: PurchaseOrderItem[]): Record<string, unknown>[] {
  return list.map((i) => {
    const row: Record<string, unknown> = {
      lineNo: i.lineNo,
      item: i.item,
      unit: i.unit,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
    };
    const code = i.itemCode != null ? String(i.itemCode).trim() : "";
    if (code !== "") row.itemCode = code;
    return row;
  });
}

type SavedPurchaseOrder = {
  id: string;
  branchName: string;
  prNumber: string;
  poNumber: string;
  submittedByName?: string | null;
  submittedByUsername?: string | null;
  prFileName?: string | null;
  poFileName?: string | null;
  prFileUrl?: string | null;
  poFileUrl?: string | null;
  includeOtherSuppliers?: boolean;
  sisterSupplierPos?: SisterSupplierPoStored[];
  items: PurchaseOrderItem[];
  openedTotals?: Record<string, number>;
  openingHistory?: Array<{
    openedAt?: Timestamp;
    invoiceNumber?: string;
    invoiceLink?: string | null;
    deliveryNoteLinks?: string[];
    /** @deprecated Replaced by `invoiceLink` — still shown when viewing older openings */
    invoiceFileName?: string | null;
    invoiceFileUrl?: string | null;
    /** @deprecated Replaced by `deliveryNoteLinks` */
    deliveryNoteFileName?: string | null;
    deliveryNoteFileUrl?: string | null;
    createdByName?: string;
    createdByUsername?: string;
    items?: Array<{ lineNo: number; openedQty: number }>;
  }>;
  urgent?: "yes" | "no";
  itemRemarkHistory?: Record<string, PoItemRemarkEntry[]>;
  /** @deprecated Legacy single remark per line — migrated into `itemRemarkHistory` on load */
  itemRemarks?: Record<string, string>;
  itemRemarkTimestamps?: Record<string, Timestamp>;
  totalQuantity: number;
  totalAmount: number;
  vat10Amount?: number | null;
  poGrandTotal?: number | null;
  createdAt?: Timestamp | null;
};

type OpeningHistoryPhase = NonNullable<SavedPurchaseOrder["openingHistory"]>[number];

/** PO records per page on the Create SO list. */
const CREATE_SO_PO_LIST_PAGE_SIZE = 5;
/** PO records per page on the View PO list. */
const VIEW_PO_PO_LIST_PAGE_SIZE = 10;

function isPoOpeningComplete(po: SavedPurchaseOrder): boolean {
  if (!po.items.length) return false;
  const totals = po.openedTotals ?? {};
  return po.items.every((item) => Number(totals[String(item.lineNo)] ?? 0) >= item.quantity);
}

/** Default invoice prefix in the Create SO form; saving is blocked until the user extends it. */
const OPEN_PO_INVOICE_DEFAULT = "TI";

function normalizeExternalLink(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const href = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

function parsePastedLinks(text: string): string[] {
  const seen = new Set<string>();
  const links: string[] = [];
  for (const part of text.split(/[\n,]+/)) {
    const normalized = normalizeExternalLink(part);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      links.push(normalized);
    }
  }
  return links;
}

function phaseInvoiceLink(phase: NonNullable<SavedPurchaseOrder["openingHistory"]>[number]): string | null {
  return phase.invoiceLink ?? phase.invoiceFileUrl ?? null;
}

function formatPoNumberDisplay(poNumber: string): string {
  return poNumber.replace(/^W\.H\s*/i, "").trim() || poNumber;
}

/** Latest Create SO / opening timestamp for a PO (null if never opened). */
function getPoLastOpenedDate(po: SavedPurchaseOrder): Date | null {
  const times = (po.openingHistory ?? [])
    .map((ph) => (ph.openedAt?.toDate ? ph.openedAt.toDate().getTime() : null))
    .filter((ms): ms is number => ms !== null);
  if (times.length === 0) return null;
  return new Date(Math.max(...times));
}

function getOpenedQtyThroughPhase(
  sortedHistory: OpeningHistoryPhase[],
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

function phaseDeliveryNoteLinks(phase: OpeningHistoryPhase): string[] {
  if (phase.deliveryNoteLinks?.length) return phase.deliveryNoteLinks;
  if (phase.deliveryNoteFileUrl) return [phase.deliveryNoteFileUrl];
  return [];
}

function isOpenPoInvoicePlaceholderOnly(invoice: string): boolean {
  return invoice.trim().toUpperCase() === OPEN_PO_INVOICE_DEFAULT;
}

const normalizeHeader = (value: string) => {
  const trimmed = String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\u00a0/g, " ");
  if (trimmed === "#") return "no";
  return trimmed.replace(/[^a-z0-9]/g, "");
};

const PO_HEADER_ALIASES = {
  no: ["no", "lineno", "line", "n", "stt", "sl", "slno", "index"],
  itemCode: ["itemcode", "code", "itemno", "sku", "partno", "partnumber"],
  item: ["item", "description", "decription", "descriptionofgoods", "material", "product", "name"],
  unit: ["unit", "uom", "units", "um", "pcs", "pc", "pkg", "pack", "set", "roll", "sheet", "lot"],
  quantity: ["qty", "quantity", "q", "orderqty", "orderedqty", "qtyorder"],
  unitPrice: [
    "unitprice",
    "priceusd",
    "price",
    "unitcost",
    "unitpriceusd",
    "priceperunit",
    "rate",
    "unitrate",
    "cost",
    "priceusdkhr",
  ],
  totalPrice: [
    "totalprice",
    "amount",
    "total",
    "lineamount",
    "linetotal",
    "extendedprice",
    "extendedamount",
    "totalamount",
    "amt",
  ],
};

const hasAnyValue = (cells: unknown[]) =>
  cells.some((cell) => String(cell ?? "").trim() !== "");

const toNumber = (value: string) => {
  const cleaned = value.replace(/,/g, "").replace(/\s/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : NaN;
};

/** Remove $, ៛ (riel), Riel prefix, commas, spaces, trailing currency letters. */
const stripCurrencySymbols = (value: string) => {
  let s = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/\u00a0|\u2009/g, "");
  s = s.replace(/\$/g, "").replace(/\u17db/g, ""); // U+17DB KHMER CURRENCY SYMBOL RIEL
  s = s.replace(/^r(?=[\d,.])/i, "");
  s = s.replace(/,/g, "");
  s = s.replace(/[^\d.-]+$/g, "").replace(/^[^\d.-]+/g, "");
  return s.trim();
};

const isNumericValue = (value: string) => {
  const s = value.replace(/,/g, "").replace(/\s/g, "").replace(/\.$/, "").trim();
  return /^\d+(\.\d+)?$/.test(s);
};

const parseMoney = (value: string) => toNumber(stripCurrencySymbols(value));

const extractMoneyFromRow = (row: (string | number)[]) => {
  const candidates = row
    .map((cell) => String(cell ?? "").trim())
    .filter(Boolean)
    .map((cell) => stripCurrencySymbols(cell))
    .filter((cell) => isNumericValue(cell));

  if (!candidates.length) return null;
  const amount = toNumber(candidates[candidates.length - 1]);
  return Number.isNaN(amount) ? null : amount;
};

/** Prefer worksheet tab names that match the PO number field (multi-tab PO workbooks). */
function filterSheetNamesByPoDigits(sheetNames: string[], poDigits: string): string[] | null {
  const hint = poDigits.replace(/\D/g, "").trim();
  if (!hint) return null;

  const exact = sheetNames.filter((n) => n.trim() === hint);
  if (exact.length) return exact;

  const digitEq = sheetNames.filter((n) => n.replace(/\D/g, "") === hint);
  if (digitEq.length) return digitEq;

  if (hint.length >= 6) {
    const ends = sheetNames.filter((n) => n.replace(/\D/g, "").endsWith(hint));
    if (ends.length) return ends;
  }

  if (hint.length >= 5) {
    const inc = sheetNames.filter((n) => n.includes(hint));
    if (inc.length) return inc;
  }

  return null;
}

/** Two-row PO header: (6 col) No|ITEM|Unit|Qty + price row OR (7 col) No|Item Code|ITEM|Unit|Qty + price row. */
type SplitTwoRowPoCols = {
  no: number;
  item: number;
  unit: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemCode?: number;
};

function findSplitTwoRowPurchaseOrderHeader(rows: (string | number)[][]): {
  dataStartRow: number;
  cols: SplitTwoRowPoCols;
} | null {
  for (let i = 0; i < rows.length - 1; i++) {
    const r = rows[i];
    const r2 = rows[i + 1];
    if (!r?.length || !r2?.length) continue;

    const n0 = normalizeHeader(String(r[0] ?? ""));
    if (!PO_HEADER_ALIASES.no.includes(n0)) continue;

    const n1 = normalizeHeader(String(r[1] ?? ""));
    const n2 = normalizeHeader(String(r[2] ?? ""));
    const n3 = normalizeHeader(String(r[3] ?? ""));
    const n4 = normalizeHeader(String(r[4] ?? ""));

    if (
      PO_HEADER_ALIASES.itemCode.includes(n1) &&
      PO_HEADER_ALIASES.item.includes(n2) &&
      PO_HEADER_ALIASES.unit.includes(n3) &&
      PO_HEADER_ALIASES.quantity.includes(n4)
    ) {
      const upLabel = normalizeHeader(String(r2[5] ?? ""));
      const tpLabel = normalizeHeader(String(r2[6] ?? ""));
      if (PO_HEADER_ALIASES.unitPrice.includes(upLabel) && PO_HEADER_ALIASES.totalPrice.includes(tpLabel)) {
        return {
          dataStartRow: i + 2,
          cols: {
            no: 0,
            itemCode: 1,
            item: 2,
            unit: 3,
            quantity: 4,
            unitPrice: 5,
            totalPrice: 6,
          },
        };
      }
    }

    if (
      PO_HEADER_ALIASES.item.includes(n1) &&
      PO_HEADER_ALIASES.unit.includes(n2) &&
      PO_HEADER_ALIASES.quantity.includes(n3)
    ) {
      const upLabel = normalizeHeader(String(r2[4] ?? ""));
      const tpLabel = normalizeHeader(String(r2[5] ?? ""));
      if (PO_HEADER_ALIASES.unitPrice.includes(upLabel) && PO_HEADER_ALIASES.totalPrice.includes(tpLabel)) {
        return {
          dataStartRow: i + 2,
          cols: { no: 0, item: 1, unit: 2, quantity: 3, unitPrice: 4, totalPrice: 5 },
        };
      }
    }
  }
  return null;
}


/** Sister companies that issue their own PO lines for the same PR (cables, poles, transformers). */
const SISTER_SUPPLIER_OPTIONS = ["VCC", "KCC", "Saekaraj"] as const;
type SisterSupplierKey = (typeof SISTER_SUPPLIER_OPTIONS)[number];

type SisterSupplierDraft = {
  id: string;
  supplier: SisterSupplierKey;
  file: File | null;
  fileName: string;
  items: PurchaseOrderItem[];
  vat10Amount: number | null;
  poGrandTotal: number | null;
  parseStatus?: string;
};

function firstAccessiblePrPoTab(flags: {
  canDashboard: boolean;
  canSubmit: boolean;
  canOpen: boolean;
  canViewPo: boolean;
  canItemTracker: boolean;
}): "submit" | "open" | "view" | "items" | "dashboard" {
  if (flags.canDashboard) return "dashboard";
  if (flags.canSubmit) return "submit";
  if (flags.canOpen) return "open";
  if (flags.canViewPo) return "view";
  if (flags.canItemTracker) return "items";
  return "dashboard";
}

type PrPoManagerProps = {
  pageMode?: "full" | "create-so";
  initialCreateSoPoId?: string | null;
  initialTab?: "submit" | "open" | "view" | "items" | "dashboard";
  initialViewPoId?: string;
  canDashboard?: boolean;
  canSubmit?: boolean;
  canOpen?: boolean;
  canViewPo?: boolean;
  canItemTracker?: boolean;
  /** 1 = PO list/tabs limited to branches in `viewPoAllowedBranches` (pipe-separated). */
  viewPoStaffLock?: number;
  /** Allowed PO `branchName` values when `viewPoStaffLock` is 1 (e.g. `Kien Svay|EPOSE`). */
  viewPoAllowedBranches?: string;
  /** Signed-in user's full name for audit logs (remarks, Create SO, etc.). */
  actorDisplayName?: string;
  actorUsername?: string;
};

function UploadBusyInline({ message }: { message: string }) {
  return (
    <p className="mt-2 flex items-center gap-2 text-xs font-medium text-brand-navy" role="status" aria-live="polite">
      <svg
        className="h-4 w-4 shrink-0 animate-spin text-brand-navy"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span>{message}</span>
    </p>
  );
}

function RemarkTimelineList({
  entries,
  compact = false,
}: {
  entries: PoItemRemarkEntry[];
  compact?: boolean;
}) {
  if (!entries.length) {
    return <span className="text-slate-300">—</span>;
  }

  return (
    <ul className={compact ? "max-h-24 space-y-1.5 overflow-y-auto" : "max-h-52 space-y-3 overflow-y-auto pr-1"}>
      {entries.map((entry, index) => (
        <li
          key={`${entry.createdAt?.toMillis?.() ?? index}-${entry.text.slice(0, 12)}`}
          className={compact ? "text-xs" : "rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2"}
        >
          <p className={compact ? "line-clamp-2 text-slate-700" : "text-sm text-slate-800"}>{entry.text}</p>
          <p className={`mt-0.5 ${compact ? "text-[10px] text-slate-400" : "text-xs text-slate-500"}`}>
            {entry.createdBy} · {formatRemarkTimestamp(entry)}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function PrPoManager({
  pageMode = "full",
  initialCreateSoPoId = null,
  initialTab,
  initialViewPoId,
  canDashboard = false,
  canSubmit = false,
  canOpen = false,
  canViewPo = false,
  canItemTracker = false,
  viewPoStaffLock = 0,
  viewPoAllowedBranches = "",
  actorDisplayName = "Unknown user",
  actorUsername = "",
}: PrPoManagerProps) {
  const { t } = useLanguage();
  const p = t.admin.prpo;
  const fmt = (template: string, vars: Record<string, string | number>) =>
    Object.entries(vars).reduce((acc, [key, val]) => acc.split(`{${key}}`).join(String(val)), template);
  const router = useRouter();
  const viewPoBranchScope = useMemo(
    () => viewPoScopeFromStaffProps(viewPoStaffLock, viewPoAllowedBranches),
    [viewPoStaffLock, viewPoAllowedBranches]
  );
  const selectablePoBranches = useMemo(
    () => selectablePoBranchesForScope(viewPoBranchScope),
    [viewPoBranchScope]
  );
  const [activeTab, setActiveTab] = useState<"submit" | "open" | "view" | "items" | "dashboard">(() => {
    if (initialTab === "dashboard" && canDashboard) return "dashboard";
    if (initialTab === "submit" && canSubmit) return "submit";
    if (initialTab === "open" && canOpen) return "open";
    if (initialTab === "view" && canViewPo) return "view";
    if (initialTab === "items" && canItemTracker) return "items";
    return firstAccessiblePrPoTab({
      canDashboard,
      canSubmit,
      canOpen,
      canViewPo,
      canItemTracker,
    });
  });

  useEffect(() => {
    const allowed =
      (activeTab === "dashboard" && canDashboard) ||
      (activeTab === "submit" && canSubmit) ||
      (activeTab === "open" && canOpen) ||
      (activeTab === "view" && canViewPo) ||
      (activeTab === "items" && canItemTracker);
    if (!allowed) {
      setActiveTab(
        firstAccessiblePrPoTab({ canDashboard, canSubmit, canOpen, canViewPo, canItemTracker }),
      );
    }
  }, [activeTab, canDashboard, canSubmit, canOpen, canViewPo, canItemTracker]);

  const [branchName, setBranchName] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [vat10Amount, setVat10Amount] = useState<number | null>(null);
  const [poGrandTotal, setPoGrandTotal] = useState<number | null>(null);
  const [prFileName, setPrFileName] = useState("");
  const [poFileName, setPoFileName] = useState("");
  const [prFile, setPrFile] = useState<File | null>(null);
  const [poFile, setPoFile] = useState<File | null>(null);
  const [urgent, setUrgent] = useState<"no" | "yes">("no");
  const [status, setStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isParsingPo, setIsParsingPo] = useState(false);
  const [isReadingPr, setIsReadingPr] = useState(false);
  const [parsingSisterIds, setParsingSisterIds] = useState<Set<string>>(() => new Set());
  const [poParsingProgress, setPoParsingProgress] = useState(0);
  const [savedPos, setSavedPos] = useState<SavedPurchaseOrder[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [filterBranch, setFilterBranch] = useState("");
  const [filterPrNumber, setFilterPrNumber] = useState("");
  const [filterPoNumber, setFilterPoNumber] = useState("");
  const [filterInvoiceNumber, setFilterInvoiceNumber] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterUrgent, setFilterUrgent] = useState<"" | "yes" | "no">("");
  const [dashPeriod, setDashPeriod] = useState<"all" | "today" | "week" | "month" | "year" | "custom">("all");
  const [dashDateFrom, setDashDateFrom] = useState("");
  const [dashDateTo, setDashDateTo] = useState("");
  const [viewPage, setViewPage] = useState(1);
  const [openPage, setOpenPage] = useState(1);
  const [selectedViewPoId, setSelectedViewPoId] = useState<string | null>(null);
  const [collapsedPhases, setCollapsedPhases] = useState<Set<number>>(new Set());
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [openQtyInputs, setOpenQtyInputs] = useState<Record<string, string>>({});
  const [invoiceNumber, setInvoiceNumber] = useState(OPEN_PO_INVOICE_DEFAULT);
  const [invoiceLinkInput, setInvoiceLinkInput] = useState("");
  const [deliveryNoteLinksText, setDeliveryNoteLinksText] = useState("");
  const [isSavingOpen, setIsSavingOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"submit" | "open" | null>(null);
  const [remarkItemLineNo, setRemarkItemLineNo] = useState<number | null>(null);
  const [remarkText, setRemarkText] = useState("");
  /** Draft remarks per line on Submit PO (saved into `itemRemarkHistory` when the PO is submitted). */
  const [submitItemRemarks, setSubmitItemRemarks] = useState<Record<string, string>>({});
  const [isSavingRemark, setIsSavingRemark] = useState(false);
  const prFileInputRef = useRef<HTMLInputElement | null>(null);
  const poFileInputRef = useRef<HTMLInputElement | null>(null);
  const [includeOtherSuppliers, setIncludeOtherSuppliers] = useState(false);
  const [sisterSupplierDrafts, setSisterSupplierDrafts] = useState<SisterSupplierDraft[]>([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items],
  );

  const isFileProcessing = isReadingPr || isParsingPo || parsingSisterIds.size > 0;

  const fileProcessingOverlayMessage = useMemo(() => {
    const tasks: string[] = [];
    if (isReadingPr) tasks.push("pr");
    if (isParsingPo) tasks.push("po");
    if (parsingSisterIds.size > 0) tasks.push("sister");
    if (tasks.length > 1) return p.processingFiles;
    if (isReadingPr) return p.readingPrFile;
    if (isParsingPo) return p.extractingPoLines;
    if (parsingSisterIds.size > 0) return p.parsingSupplierPo;
    return p.processingFile;
  }, [isReadingPr, isParsingPo, parsingSisterIds.size, p]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "purchaseOrders"), (snapshot) => {
      const rows: SavedPurchaseOrder[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          branchName: String(data.branchName ?? ""),
          prNumber: String(data.prNumber ?? ""),
          poNumber: String(data.poNumber ?? ""),
          submittedByName: data.submittedByName ? String(data.submittedByName) : null,
          submittedByUsername: data.submittedByUsername ? String(data.submittedByUsername) : null,
          urgent: data.urgent === "yes" ? "yes" : data.urgent === "no" ? "no" : undefined,
          prFileName: data.prFileName ? String(data.prFileName) : null,
          poFileName: data.poFileName ? String(data.poFileName) : null,
          prFileUrl: data.prFileUrl ? String(data.prFileUrl) : null,
          poFileUrl: data.poFileUrl ? String(data.poFileUrl) : null,
          includeOtherSuppliers: data.includeOtherSuppliers === true,
          sisterSupplierPos: Array.isArray(data.sisterSupplierPos)
            ? (data.sisterSupplierPos as Record<string, unknown>[]).map((s) => {
                const sItems = Array.isArray(s.items)
                  ? (s.items as Record<string, unknown>[]).map((item, index) => ({
                      lineNo: Number(item.lineNo ?? index + 1),
                      itemCode: item.itemCode ? String(item.itemCode) : undefined,
                      item: String(item.item ?? ""),
                      unit: String(item.unit ?? ""),
                      quantity: Number(item.quantity ?? 0),
                      unitPrice: Number(item.unitPrice ?? 0),
                      totalPrice: Number(item.totalPrice ?? 0),
                    }))
                  : [];
                return {
                  entryId: s.entryId ? String(s.entryId) : undefined,
                  supplier: String(s.supplier ?? ""),
                  items: sItems,
                  poFileName: s.poFileName ? String(s.poFileName) : null,
                  poFileUrl: s.poFileUrl ? String(s.poFileUrl) : null,
                  totalLineItems: Number(s.totalLineItems ?? sItems.length),
                  totalQuantity: Number(s.totalQuantity ?? 0),
                  totalAmount: Number(s.totalAmount ?? 0),
                  vat10Amount: s.vat10Amount !== undefined ? Number(s.vat10Amount ?? 0) : null,
                  poGrandTotal: s.poGrandTotal !== undefined ? Number(s.poGrandTotal ?? 0) : null,
                };
              })
            : undefined,
          items: Array.isArray(data.items)
            ? (data.items as Record<string, unknown>[]).map((item, index) => ({
                lineNo: Number(item.lineNo ?? index + 1),
                itemCode: item.itemCode ? String(item.itemCode) : undefined,
                item: String(item.item ?? ""),
                unit: String(item.unit ?? ""),
                quantity: Number(item.quantity ?? 0),
                unitPrice: Number(item.unitPrice ?? 0),
                totalPrice: Number(item.totalPrice ?? 0),
              }))
            : [],
          openedTotals:
            data.openedTotals && typeof data.openedTotals === "object"
              ? (data.openedTotals as Record<string, number>)
              : {},
          openingHistory: Array.isArray(data.openingHistory)
            ? (data.openingHistory as SavedPurchaseOrder["openingHistory"])
            : [],
          itemRemarkHistory: parseItemRemarkHistoryFromPoData(data as Record<string, unknown>),
          itemRemarks:
            data.itemRemarks && typeof data.itemRemarks === "object"
              ? (data.itemRemarks as Record<string, string>)
              : {},
          itemRemarkTimestamps:
            data.itemRemarkTimestamps && typeof data.itemRemarkTimestamps === "object"
              ? (data.itemRemarkTimestamps as Record<string, Timestamp>)
              : {},
          totalQuantity: Number(data.totalQuantity ?? 0),
          totalAmount: Number(data.totalAmount ?? 0),
          vat10Amount: data.vat10Amount !== undefined ? Number(data.vat10Amount ?? 0) : null,
          poGrandTotal: data.poGrandTotal !== undefined ? Number(data.poGrandTotal ?? 0) : null,
          createdAt: (data.createdAt as Timestamp | undefined) ?? null,
        };
      });
      setSavedPos(rows);
      setLoadingSaved(false);
    });

    return () => unsubscribe();
  }, []);

  const officeScopedPos = useMemo(() => {
    if (viewPoBranchScope.kind === "all") return savedPos;
    if (viewPoBranchScope.kind === "none") return [];
    return savedPos.filter((po) => isPoInViewPoBranchScope(po, viewPoBranchScope));
  }, [savedPos, viewPoBranchScope]);

  useEffect(() => {
    if (!initialViewPoId || !canViewPo || loadingSaved) return;
    const po = savedPos.find((row) => row.id === initialViewPoId);
    if (!po || !isPoInViewPoBranchScope(po, viewPoBranchScope)) return;
    setActiveTab("view");
    setSelectedViewPoId(po.id);
  }, [initialViewPoId, canViewPo, loadingSaved, savedPos, viewPoBranchScope]);

  const listFilteredBase = useMemo(() => {
    return officeScopedPos.filter((po) => {
      const byBranch = !filterBranch || po.branchName.toLowerCase() === filterBranch.toLowerCase();
      const byPr = !filterPrNumber || po.prNumber.toLowerCase().includes(filterPrNumber.toLowerCase());
      const byPo = !filterPoNumber || po.poNumber.toLowerCase().includes(filterPoNumber.toLowerCase());
      const byInvoice =
        !filterInvoiceNumber ||
        (po.openingHistory ?? []).some((phase) =>
          String(phase.invoiceNumber ?? "")
            .toLowerCase()
            .includes(filterInvoiceNumber.toLowerCase()),
        );
      const byUrgent = !filterUrgent || (po.urgent ?? "no") === filterUrgent;
      return byBranch && byPr && byPo && byInvoice && byUrgent;
    });
  }, [officeScopedPos, filterBranch, filterPrNumber, filterPoNumber, filterInvoiceNumber, filterUrgent]);

  /** Create SO list — date range filters by PO submitted (requested) date. */
  const filteredSavedPos = useMemo(() => {
    return listFilteredBase
      .filter((po) => {
        const createdDate = po.createdAt?.toDate ? po.createdAt.toDate() : null;
        const fromOk = !filterDateFrom || (createdDate && createdDate >= new Date(`${filterDateFrom}T00:00:00`));
        const toOk = !filterDateTo || (createdDate && createdDate <= new Date(`${filterDateTo}T23:59:59`));
        return fromOk && toOk;
      })
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      });
  }, [listFilteredBase, filterDateFrom, filterDateTo]);

  /** View PO list — date range filters by last opening date. */
  const viewListSource = useMemo(() => {
    return listFilteredBase
      .filter((po) => {
        const lastOpened = getPoLastOpenedDate(po);
        const fromOk =
          !filterDateFrom || (lastOpened && lastOpened >= new Date(`${filterDateFrom}T00:00:00`));
        const toOk = !filterDateTo || (lastOpened && lastOpened <= new Date(`${filterDateTo}T23:59:59`));
        return fromOk && toOk;
      })
      .sort((a, b) => {
        const aTime = getPoLastOpenedDate(a)?.getTime() ?? 0;
        const bTime = getPoLastOpenedDate(b)?.getTime() ?? 0;
        return bTime - aTime;
      });
  }, [listFilteredBase, filterDateFrom, filterDateTo]);

  // Reset pagination/selection whenever filters change
  useEffect(() => {
    setViewPage(1);
    setOpenPage(1);
    setSelectedViewPoId(null);
  }, [filterBranch, filterPrNumber, filterPoNumber, filterInvoiceNumber, filterUrgent, filterDateFrom, filterDateTo, viewPoStaffLock, viewPoAllowedBranches]);

  useEffect(() => {
    if (!selectedViewPoId) return;
    const po = savedPos.find((p) => p.id === selectedViewPoId);
    if (!po || !isPoInViewPoBranchScope(po, viewPoBranchScope)) {
      setSelectedViewPoId(null);
    }
  }, [selectedViewPoId, savedPos, viewPoBranchScope]);

  const viewPagedPos = useMemo(() => {
    const start = (viewPage - 1) * VIEW_PO_PO_LIST_PAGE_SIZE;
    return viewListSource.slice(start, start + VIEW_PO_PO_LIST_PAGE_SIZE);
  }, [viewListSource, viewPage]);

  const openPagedPos = useMemo(() => {
    const start = (openPage - 1) * CREATE_SO_PO_LIST_PAGE_SIZE;
    return filteredSavedPos.slice(start, start + CREATE_SO_PO_LIST_PAGE_SIZE);
  }, [filteredSavedPos, openPage]);

  const selectedPo = useMemo(
    () => savedPos.find((po) => po.id === selectedPoId) ?? null,
    [savedPos, selectedPoId],
  );

  const selectedPoPhases = useMemo(() => {
    if (!selectedPo?.openingHistory?.length) return [];
    return [...selectedPo.openingHistory].sort((a, b) => {
      const aTime = a.openedAt?.toMillis ? a.openedAt.toMillis() : 0;
      const bTime = b.openedAt?.toMillis ? b.openedAt.toMillis() : 0;
      return aTime - bTime;
    });
  }, [selectedPo]);

  const selectedPoSisterDownloadCount = useMemo(
    () => (selectedPo?.sisterSupplierPos ?? []).filter((s) => s.poFileUrl).length,
    [selectedPo],
  );

  const getOpenedQtyByPhase = (lineNo: number, phaseIndex: number) => {
    const phase = selectedPoPhases[phaseIndex];
    if (!phase?.items?.length) return 0;
    const row = phase.items.find((entry) => entry.lineNo === lineNo);
    return Number(row?.openedQty ?? 0);
  };

  const getOpenedQty = (po: SavedPurchaseOrder, lineNo: number) =>
    Number(po.openedTotals?.[String(lineNo)] ?? 0);

  const initCreateSoForm = (po: SavedPurchaseOrder) => {
    const initialInputs: Record<string, string> = {};
    po.items.forEach((item) => {
      initialInputs[String(item.lineNo)] = "";
    });
    setSelectedPoId(po.id);
    setOpenQtyInputs(initialInputs);
    setInvoiceNumber(OPEN_PO_INVOICE_DEFAULT);
    setInvoiceLinkInput("");
    setDeliveryNoteLinksText("");
    setRemarkItemLineNo(null);
    setRemarkText("");
  };

  const handleOpenPoClick = (po: SavedPurchaseOrder) => {
    router.push(`/dhm-myadmin/pr-po/create-so?id=${encodeURIComponent(po.id)}`);
  };

  useEffect(() => {
    if (pageMode !== "create-so" || !initialCreateSoPoId || loadingSaved) return;
    const po = savedPos.find((p) => p.id === initialCreateSoPoId);
    if (!po || !isPoInViewPoBranchScope(po, viewPoBranchScope)) return;
    if (selectedPoId !== po.id) {
      initCreateSoForm(po);
    }
  }, [pageMode, initialCreateSoPoId, loadingSaved, savedPos, selectedPoId, viewPoBranchScope]);

  const hasActiveListFilters = useMemo(() => {
    return !!(
      filterBranch ||
      filterPrNumber ||
      filterPoNumber ||
      filterInvoiceNumber ||
      filterUrgent ||
      filterDateFrom ||
      filterDateTo
    );
  }, [
    filterBranch,
    filterPrNumber,
    filterPoNumber,
    filterInvoiceNumber,
    filterUrgent,
    filterDateFrom,
    filterDateTo,
  ]);

  const clearListFilters = () => {
    setFilterBranch("");
    setFilterPrNumber("");
    setFilterPoNumber("");
    setFilterInvoiceNumber("");
    setFilterUrgent("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setOpenPage(1);
    setViewPage(1);
  };

  const handleOpenQtyChange = (lineNo: number, value: string) => {
    if (!selectedPo) return;
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      setOpenQtyInputs((prev) => ({ ...prev, [String(lineNo)]: "" }));
      return;
    }

    const item = selectedPo.items.find((row) => row.lineNo === lineNo);
    if (!item) return;

    const opened = getOpenedQty(selectedPo, lineNo);
    const remaining = item.quantity - opened;
    const inputQty = Number(cleaned);

    if (inputQty > remaining) {
      alert(fmt(p.enteredQtyExceeds, { remaining, lineNo }));
      setOpenQtyInputs((prev) => ({ ...prev, [String(lineNo)]: "" }));
      return;
    }

    setOpenQtyInputs((prev) => ({ ...prev, [String(lineNo)]: cleaned }));
  };

  const handleSaveOpenPo = async (forceConfirmed = false) => {
    if (!selectedPo) return;

    if (!invoiceNumber.trim()) {
      setStatus(p.invoiceRequired);
      return;
    }

    if (isOpenPoInvoicePlaceholderOnly(invoiceNumber)) {
      setStatus(p.invoiceFullRequired);
      return;
    }

    const invoiceLink = normalizeExternalLink(invoiceLinkInput);
    const deliveryNoteLinks = parsePastedLinks(deliveryNoteLinksText);

    if (!invoiceLink) {
      setStatus(p.invalidInvoiceLink);
      return;
    }

    if (!deliveryNoteLinks.length) {
      setStatus(p.invalidDeliveryLinks);
      return;
    }

    if (!forceConfirmed) {
      setConfirmAction("open");
      return;
    }

    const updatedOpenedTotals: Record<string, number> = { ...(selectedPo.openedTotals ?? {}) };
    const openingItems: Array<{ lineNo: number; openedQty: number }> = [];

    for (const item of selectedPo.items) {
      const key = String(item.lineNo);
      const openNow = Number(openQtyInputs[key] || 0);
      if (!Number.isFinite(openNow)) {
        setStatus(fmt(p.openQtyMustBeNumeric, { lineNo: item.lineNo }));
        return;
      }

      const alreadyOpened = Number(updatedOpenedTotals[key] ?? 0);
      const remaining = item.quantity - alreadyOpened;

      if (openNow < 0 || openNow > remaining) {
        setStatus(fmt(p.openQtyInvalid, { lineNo: item.lineNo, remaining }));
        return;
      }

      updatedOpenedTotals[key] = alreadyOpened + openNow;
      openingItems.push({ lineNo: item.lineNo, openedQty: openNow });
    }

    try {
      setIsSavingOpen(true);

      await updateDoc(doc(db, "purchaseOrders", selectedPo.id), {
        openedTotals: updatedOpenedTotals,
        updatedAt: Timestamp.now(),
        openingHistory: arrayUnion({
          openedAt: Timestamp.now(),
          invoiceNumber: invoiceNumber.trim(),
          invoiceLink,
          deliveryNoteLinks,
          createdByName: actorDisplayName,
          createdByUsername: actorUsername || undefined,
          items: openingItems,
        }),
      });
      setStatus(p.soCreatedSuccess);
      setOpenQtyInputs({});
      setInvoiceNumber(OPEN_PO_INVOICE_DEFAULT);
      setInvoiceLinkInput("");
      setDeliveryNoteLinksText("");
      if (pageMode === "create-so") {
        router.push("/dhm-myadmin/pr-po?tab=open");
      }
    } catch (error) {
      console.error("Failed to save PO opening:", error);
      setStatus(p.soCreateFailed);
    } finally {
      setIsSavingOpen(false);
    }
  };

  const mergeSubmitRemarksForParsedItems = (parsedItems: PurchaseOrderItem[]) => {
    setSubmitItemRemarks((prev) => {
      const next: Record<string, string> = {};
      for (const item of parsedItems) {
        const key = String(item.lineNo);
        if (prev[key]) next[key] = prev[key];
      }
      return next;
    });
  };

  const setSubmitItemRemark = (lineNo: number, value: string) => {
    const key = String(lineNo);
    setSubmitItemRemarks((prev) => {
      if (!value.trim()) {
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const openRemarkModal = (lineNo: number) => {
    if (!selectedPo) return;
    setRemarkItemLineNo(lineNo);
    setRemarkText("");
  };

  const handleSaveRemark = async () => {
    if (!selectedPo || remarkItemLineNo === null) return;
    const trimmed = remarkText.trim();
    if (!trimmed) {
      setStatus(p.remarkRequired);
      return;
    }
    try {
      setIsSavingRemark(true);
      const now = Timestamp.now();
      const entry = {
        text: trimmed,
        createdBy: actorDisplayName,
        createdByUsername: actorUsername || undefined,
        createdAt: now,
      };
      await updateDoc(doc(db, "purchaseOrders", selectedPo.id), {
        [`itemRemarkHistory.${String(remarkItemLineNo)}`]: arrayUnion(entry),
        updatedAt: now,
      });
      setRemarkItemLineNo(null);
      setRemarkText("");
      setStatus(p.remarkAdded);
    } catch (error) {
      console.error("Failed to save remark:", error);
      setStatus(p.remarkFailed);
    } finally {
      setIsSavingRemark(false);
    }
  };

  const isOpenPoFormValid = useMemo(() => {
    if (!selectedPo) return false;
    if (!invoiceNumber.trim()) return false;
    if (isOpenPoInvoicePlaceholderOnly(invoiceNumber)) return false;
    if (!normalizeExternalLink(invoiceLinkInput)) return false;
    if (!parsePastedLinks(deliveryNoteLinksText).length) return false;

    // Empty fields count as 0; require at least one item with qty > 0
    let anyQty = false;
    for (const item of selectedPo.items) {
      const opened = getOpenedQty(selectedPo, item.lineNo);
      if (item.quantity - opened <= 0) continue; // already fulfilled

      const value = openQtyInputs[String(item.lineNo)] ?? "";
      const openNow = value.trim() === "" ? 0 : Number(value.trim());

      // If a value is entered it must be a valid non-negative integer
      if (value.trim() !== "" && (!/^\d+$/.test(value.trim()) || openNow > item.quantity - opened)) {
        return false;
      }
      if (openNow > 0) anyQty = true;
    }

    return anyQty;
  }, [selectedPo, invoiceNumber, openQtyInputs, invoiceLinkInput, deliveryNoteLinksText]);

  const findHeaderRowAndColumns = (rows: (string | number)[][]) => {
    let headerRowIndex = -1;
    const cols: Partial<Record<keyof typeof PO_HEADER_ALIASES, number>> = {};

    rows.forEach((row, rowIndex) => {
      if (headerRowIndex !== -1) return;
      const normalizedRow = row.map((cell) => normalizeHeader(String(cell ?? "")));

      const getColumnIndex = (aliases: string[]) =>
        normalizedRow.findIndex((header) => aliases.includes(header));

      const no = getColumnIndex(PO_HEADER_ALIASES.no);
      const item = getColumnIndex(PO_HEADER_ALIASES.item);
      const unit = getColumnIndex(PO_HEADER_ALIASES.unit);
      const quantity = getColumnIndex(PO_HEADER_ALIASES.quantity);
      const unitPrice = getColumnIndex(PO_HEADER_ALIASES.unitPrice);
      const totalPrice = getColumnIndex(PO_HEADER_ALIASES.totalPrice);

      // Item Code is optional
      const itemCode = getColumnIndex(PO_HEADER_ALIASES.itemCode);

      // Require these core columns to consider it a header row (each maps to a distinct column)
      if (no >= 0 && item >= 0 && unit >= 0 && quantity >= 0 && unitPrice >= 0 && totalPrice >= 0) {
        const requiredIdx = [no, item, unit, quantity, unitPrice, totalPrice];
        if (new Set(requiredIdx).size !== requiredIdx.length) return;

        headerRowIndex = rowIndex;
        cols.no = no;
        cols.item = item;
        cols.unit = unit;
        cols.quantity = quantity;
        cols.unitPrice = unitPrice;
        cols.totalPrice = totalPrice;
        if (itemCode >= 0) cols.itemCode = itemCode;
      }
    });

    return { headerRowIndex, cols };
  };

  const trimLeadingEmptyCells = (row: (string | number)[]) => {
    const cells = row.map((cell) => String(cell ?? "").trim());
    let start = 0;
    while (start < cells.length && cells[start] === "") start++;
    return cells.slice(start);
  };

  const tryParsePoRows = (
    rows: (string | number)[][],
  ): { items: PurchaseOrderItem[]; vat10Amount: number | null; poGrandTotal: number | null } | null => {
    const parsedItems: PurchaseOrderItem[] = [];
    let extractedVat10: number | null = null;
    let extractedGrandTotal: number | null = null;

    const { headerRowIndex, cols } = findHeaderRowAndColumns(rows);

    if (headerRowIndex !== -1 && cols.no !== undefined && cols.item !== undefined) {
      rows.slice(headerRowIndex + 1).forEach((row) => {
        if (!hasAnyValue(row)) return;

        const no = String(row[cols.no!] ?? "").trim();
        if (!isNumericValue(no)) return;

        const item = String(row[cols.item!] ?? "").trim();
        const unit = String(row[cols.unit!] ?? "").trim();

        const quantityRaw = String(row[cols.quantity!] ?? "").trim();
        const unitPriceRaw = String(row[cols.unitPrice!] ?? "").trim();
        const totalPriceRaw = String(row[cols.totalPrice!] ?? "").trim();

        const quantity = toNumber(quantityRaw);
        const unitPrice = parseMoney(unitPriceRaw);
        const totalPrice = parseMoney(totalPriceRaw);

        if (!item || Number.isNaN(quantity) || Number.isNaN(unitPrice) || Number.isNaN(totalPrice)) {
          return;
        }

        const itemCode =
          cols.itemCode !== undefined ? String(row[cols.itemCode] ?? "").trim() : undefined;

        parsedItems.push({
          lineNo: parsedItems.length + 1,
          itemCode: itemCode || undefined,
          item,
          unit: unit || "-",
          quantity,
          unitPrice,
          totalPrice,
        });
      });
    }

    // Fallback for PO templates with leading blanks / merged cells — do not use filter(Boolean)
    // on row cells or column indices shift. Expect: No | Item Code | ITEM | Unit | Qty | $UnitPrice | $TotalPrice
    if (!parsedItems.length) {
      const splitHeader = findSplitTwoRowPurchaseOrderHeader(rows);
      if (splitHeader) {
        const { dataStartRow, cols: sc } = splitHeader;
        rows.slice(dataStartRow).forEach((row) => {
          if (!hasAnyValue(row)) return;

          const no = String(row[sc.no] ?? "").trim();
          if (!isNumericValue(no)) return;

          const item = String(row[sc.item] ?? "").trim();
          const unit = String(row[sc.unit] ?? "").trim();
          const quantityRaw = String(row[sc.quantity] ?? "").trim();
          const unitPriceRaw = String(row[sc.unitPrice] ?? "").trim();
          const totalPriceRaw = String(row[sc.totalPrice] ?? "").trim();

          const quantity = toNumber(quantityRaw);
          const unitPrice = parseMoney(unitPriceRaw);
          const totalPrice = parseMoney(totalPriceRaw);

          if (!item || Number.isNaN(quantity) || Number.isNaN(unitPrice) || Number.isNaN(totalPrice)) {
            return;
          }

          const itemCode =
            sc.itemCode !== undefined ? String(row[sc.itemCode] ?? "").trim() : undefined;

          parsedItems.push({
            lineNo: parsedItems.length + 1,
            itemCode: itemCode || undefined,
            item,
            unit: unit || "-",
            quantity,
            unitPrice,
            totalPrice,
          });
        });
      }
    }

    if (!parsedItems.length) {
      rows.forEach((row) => {
        if (!hasAnyValue(row)) return;
        const cells = trimLeadingEmptyCells(row);
        if (cells.length < 7) return;

        const no = cells[0];
        if (!isNumericValue(no)) return;

        const itemCode = cells[1];
        const item = cells[2];
        const unit = cells[3];
        const qty = toNumber(cells[4]);
        const unitPrice = parseMoney(cells[5]);
        const totalPrice = parseMoney(cells[6]);

        if (!item || Number.isNaN(qty) || Number.isNaN(unitPrice) || Number.isNaN(totalPrice)) return;

        parsedItems.push({
          lineNo: parsedItems.length + 1,
          itemCode: itemCode || undefined,
          item,
          unit: unit || "-",
          quantity: qty,
          unitPrice,
          totalPrice,
        });
      });
    }

    // No | Item | Unit | Qty | Unit Price | Total Price (no Item Code column)
    if (!parsedItems.length) {
      rows.forEach((row) => {
        if (!hasAnyValue(row)) return;
        const cells = trimLeadingEmptyCells(row);
        if (cells.length < 6) return;

        const no = cells[0];
        if (!isNumericValue(no)) return;

        const item = cells[1];
        const unit = cells[2];
        const qty = toNumber(cells[3]);
        const unitPrice = parseMoney(cells[4]);
        const totalPrice = parseMoney(cells[5]);

        if (!item || Number.isNaN(qty) || Number.isNaN(unitPrice) || Number.isNaN(totalPrice)) return;

        parsedItems.push({
          lineNo: parsedItems.length + 1,
          item,
          unit: unit || "-",
          quantity: qty,
          unitPrice,
          totalPrice,
        });
      });
    }

    let plainTotalMoney: number | null = null;
    rows.forEach((row) => {
      const text = row.map((cell) => String(cell ?? "").trim().toLowerCase()).join(" ");
      if (
        extractedVat10 === null &&
        (/vat\s*\(\s*10%\s*\)/i.test(text) || /vat\s*10%/i.test(text))
      ) {
        extractedVat10 = extractMoneyFromRow(row);
      }

      const leading = trimLeadingEmptyCells(row);
      const firstRaw = String(leading[0] ?? "").trim();
      const firstLower = firstRaw.toLowerCase();
      const money = extractMoneyFromRow(row);

      if (/^grand\s*total/i.test(firstRaw) && money !== null && !Number.isNaN(money)) {
        extractedGrandTotal = money;
      } else if (firstLower === "total" && money !== null && !Number.isNaN(money)) {
        plainTotalMoney = plainTotalMoney ?? money;
      }
    });
    if (extractedGrandTotal === null && plainTotalMoney !== null) {
      extractedGrandTotal = plainTotalMoney;
    }

    if (!parsedItems.length) return null;
    return { items: parsedItems, vat10Amount: extractedVat10, poGrandTotal: extractedGrandTotal };
  };

  type SheetParseBundle = {
    sheetName: string;
    sheetIndex: number;
    parsed: { items: PurchaseOrderItem[]; vat10Amount: number | null; poGrandTotal: number | null };
  };

  const collectSheetParsesFromWorkbook = async (
    workbook: WorkBook,
    onSheetProgress?: (percent: number) => void,
  ): Promise<SheetParseBundle[]> => {
    const sheetParses: SheetParseBundle[] = [];
    const names = workbook.SheetNames;
    const totalNames = names.length || 1;

    for (let si = 0; si < names.length; si++) {
      const sheetName = names[si];
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      const rows = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
        header: 1,
        blankrows: false,
        defval: "",
        raw: false,
      });
      if (!rows.length) continue;

      const parsed = tryParsePoRows(rows);
      if (!parsed?.items.length) continue;

      sheetParses.push({ sheetName, sheetIndex: si, parsed });
      const pct = 34 + Math.round(((si + 1) / totalNames) * 46);
      onSheetProgress?.(pct);
      if (onSheetProgress) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      }
    }

    return sheetParses;
  };

  const pickBestSheetParse = (
    sheetParses: SheetParseBundle[],
    poDigitsHint: string,
  ): {
    items: PurchaseOrderItem[];
    vat10Amount: number | null;
    poGrandTotal: number | null;
    sheetUsedName: string;
    sheetChoiceNote: string;
  } => {
    if (!sheetParses.length) {
      throw new Error(p.noReadableSheets);
    }

    const matchedNames = filterSheetNamesByPoDigits(
      sheetParses.map((s) => s.sheetName),
      poDigitsHint,
    );

    let pool = sheetParses;
    let sheetChoiceNote = "";

    if (poDigitsHint && matchedNames?.length) {
      const nameSet = new Set(matchedNames);
      pool = sheetParses.filter((s) => nameSet.has(s.sheetName));
      if (pool.length === 1) {
        sheetChoiceNote = fmt(p.sheetTabMatched, { sheet: pool[0].sheetName, po: poDigitsHint });
      } else {
        sheetChoiceNote = fmt(p.sheetTabsMatched, { count: pool.length, po: poDigitsHint });
      }
    } else if (poDigitsHint) {
      pool = sheetParses;
      sheetChoiceNote = fmt(p.sheetNoTabMatched, { po: poDigitsHint });
      pool = [...sheetParses].sort((a, b) => a.sheetIndex - b.sheetIndex);
      pool = [pool[0]];
    } else {
      pool = [...sheetParses].sort((a, b) => a.sheetIndex - b.sheetIndex);
      pool = [pool[0]];
      sheetChoiceNote = fmt(p.sheetUsingFirst, { sheet: pool[0].sheetName });
    }

    let best = pool[0]!;
    for (const entry of pool) {
      if (entry.parsed.items.length > best.parsed.items.length) {
        best = entry;
      }
    }

    return {
      items: best.parsed.items,
      vat10Amount: best.parsed.vat10Amount,
      poGrandTotal: best.parsed.poGrandTotal,
      sheetUsedName: best.sheetName,
      sheetChoiceNote,
    };
  };

  const extractPurchaseOrderFromPoFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetParses = await collectSheetParsesFromWorkbook(workbook);
    return pickBestSheetParse(sheetParses, poNumber.replace(/\D/g, "").trim());
  };

  const parsePoExcelFile = async (file: File) => {
    setPoParsingProgress(6);
    const arrayBuffer = await file.arrayBuffer();
    setPoParsingProgress(22);
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    setPoParsingProgress(34);
    const sheetParses = await collectSheetParsesFromWorkbook(workbook, setPoParsingProgress);
    setPoParsingProgress(88);
    const result = pickBestSheetParse(sheetParses, poNumber.replace(/\D/g, "").trim());
    setPoParsingProgress(100);
    return result;
  };

  const handlePrUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsReadingPr(true);
    setStatus(p.readingPrFile);
    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 0);
      });
      setPrFile(file);
      setPrFileName(file.name);
      setStatus(p.prUploaded);
    } finally {
      setIsReadingPr(false);
    }
  };

  const handlePoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsParsingPo(true);
      setPoFile(file);
      setPoFileName(file.name);
      setStatus(p.readingPoFile);
      setPoParsingProgress(4);
      const parsed = await parsePoExcelFile(file);
      setItems(parsed.items);
      mergeSubmitRemarksForParsedItems(parsed.items);
      setVat10Amount(parsed.vat10Amount);
      setPoGrandTotal(parsed.poGrandTotal);
      setStatus(
        fmt(p.loadedLinesFromPo, {
          count: parsed.items.length,
          sheet: parsed.sheetUsedName,
          note: parsed.sheetChoiceNote,
        }),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : p.parseExcelFailed;
      setStatus(message);
      setItems([]);
      setSubmitItemRemarks({});
      setVat10Amount(null);
      setPoGrandTotal(null);
    } finally {
      setIsParsingPo(false);
      setPoParsingProgress(0);
    }
  };

  useEffect(() => {
    if (!poFile) return;
    let cancelled = false;
    const handle = window.setTimeout(() => {
      void (async () => {
        try {
          setIsParsingPo(true);
          setPoParsingProgress(4);
          const parsed = await parsePoExcelFile(poFile);
          if (cancelled) return;
          setItems(parsed.items);
          mergeSubmitRemarksForParsedItems(parsed.items);
          setVat10Amount(parsed.vat10Amount);
          setPoGrandTotal(parsed.poGrandTotal);
          setStatus(
            fmt(p.loadedLinesFromPo, {
              count: parsed.items.length,
              sheet: parsed.sheetUsedName,
              note: parsed.sheetChoiceNote,
            }),
          );
        } catch (error) {
          if (cancelled) return;
          const message = error instanceof Error ? error.message : p.parseExcelFailed;
          setStatus(message);
          setItems([]);
          setSubmitItemRemarks({});
          setVat10Amount(null);
          setPoGrandTotal(null);
        } finally {
          if (!cancelled) {
            setIsParsingPo(false);
            setPoParsingProgress(0);
          }
        }
      })();
    }, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
    // Re-run when PO number changes so multi-tab workbooks switch tabs without re-uploading.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- poFile is read from latest closure; parsePoExcelFile changes every render.
  }, [poNumber]);

  const newSisterSupplierRowId = () =>
    globalThis.crypto && "randomUUID" in globalThis.crypto
      ? globalThis.crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const addSisterSupplierRow = () => {
    setSisterSupplierDrafts((rows) => [
      ...rows,
      {
        id: newSisterSupplierRowId(),
        supplier: "VCC",
        file: null,
        fileName: "",
        items: [],
        vat10Amount: null,
        poGrandTotal: null,
      },
    ]);
  };

  const handleSisterPoFileChosen = async (draftId: string, file: File | undefined) => {
    if (!file) return;
    setParsingSisterIds((prev) => new Set(prev).add(draftId));
    setSisterSupplierDrafts((rows) =>
      rows.map((r) =>
        r.id === draftId ? { ...r, parseStatus: p.readingParseStatus, fileName: file.name, items: [], file: null } : r,
      ),
    );
    try {
      const parsed = await extractPurchaseOrderFromPoFile(file);
      setSisterSupplierDrafts((rows) =>
        rows.map((r) =>
          r.id === draftId
            ? {
                ...r,
                file,
                fileName: file.name,
                items: parsed.items,
                vat10Amount: parsed.vat10Amount,
                poGrandTotal: parsed.poGrandTotal,
                parseStatus: fmt(p.loadedLinesCount, { count: parsed.items.length }),
              }
            : r,
        ),
      );
    } catch {
      setSisterSupplierDrafts((rows) =>
        rows.map((r) =>
          r.id === draftId
            ? {
                ...r,
                file: null,
                fileName: "",
                items: [],
                vat10Amount: null,
                poGrandTotal: null,
                parseStatus: p.couldNotExtractLines,
              }
            : r,
        ),
      );
    } finally {
      setParsingSisterIds((prev) => {
        const next = new Set(prev);
        next.delete(draftId);
        return next;
      });
    }
  };

  const handleSubmitPo = async (forceConfirmed = false) => {
    if (!items.length) {
      setStatus(p.uploadPoFirst);
      return;
    }

    if (!branchName.trim() || !prNumber.trim() || !poNumber.trim()) {
      setStatus(p.completeFieldsBeforeSave);
      return;
    }

    if (includeOtherSuppliers) {
      if (!sisterSupplierDrafts.length) {
        setStatus(p.addOtherSupplierOrUncheck);
        return;
      }
      const incomplete = sisterSupplierDrafts.find((r) => !r.file || !r.items.length);
      if (incomplete) {
        setStatus(p.eachSupplierNeedsPo);
        return;
      }
    }

    if (!forceConfirmed) {
      setConfirmAction("submit");
      return;
    }

    const formattedPoNumber = poNumber.trim();

    try {
      setIsSaving(true);
      setStatus(p.savingPo);

      let prFileUrl: string | null = null;
      let poFileUrl: string | null = null;

      if (prFile) {
        const prStorageRef = ref(
          storage,
          `purchase-orders/${formattedPoNumber}/pr-${Date.now()}-${prFile.name}`,
        );
        const uploadedPr = await uploadBytes(prStorageRef, prFile);
        prFileUrl = await getDownloadURL(uploadedPr.ref);
      }

      if (poFile) {
        const poStorageRef = ref(
          storage,
          `purchase-orders/${formattedPoNumber}/po-${Date.now()}-${poFile.name}`,
        );
        const uploadedPo = await uploadBytes(poStorageRef, poFile);
        poFileUrl = await getDownloadURL(uploadedPo.ref);
      }

      const sisterPayload: Record<string, unknown>[] = [];
      if (includeOtherSuppliers && sisterSupplierDrafts.length) {
        for (const row of sisterSupplierDrafts) {
          if (!row.file) continue;
          const poStorageRef = ref(
            storage,
            `purchase-orders/${formattedPoNumber}/po-${row.supplier}-${Date.now()}-${row.file.name}`,
          );
          const uploadedPo = await uploadBytes(poStorageRef, row.file);
          const rowPoUrl = await getDownloadURL(uploadedPo.ref);
          const rowQty = row.items.reduce((s, i) => s + i.quantity, 0);
          const rowAmt = row.items.reduce((s, i) => s + i.totalPrice, 0);
          sisterPayload.push({
            entryId: row.id,
            supplier: row.supplier,
            items: purchaseOrderItemsForFirestore(row.items),
            poFileName: row.fileName || null,
            poFileUrl: rowPoUrl,
            totalLineItems: row.items.length,
            totalQuantity: rowQty,
            totalAmount: rowAmt,
            vat10Amount: row.vat10Amount ?? null,
            poGrandTotal: row.poGrandTotal ?? null,
          });
        }
      }

      const submittedAt = Timestamp.now();
      const itemRemarkHistory = buildItemRemarkHistoryFromSubmitDraft(
        submitItemRemarks,
        { displayName: actorDisplayName, username: actorUsername || undefined },
        submittedAt,
      );

      await addDoc(collection(db, "purchaseOrders"), {
        branchName: branchName.trim(),
        prNumber: prNumber.trim(),
        poNumber: formattedPoNumber,
        submittedByName: actorDisplayName,
        submittedByUsername: actorUsername || null,
        urgent,
        prFileName: prFileName || null,
        poFileName: poFileName || null,
        prFileUrl,
        poFileUrl,
        includeOtherSuppliers: sisterPayload.length > 0,
        sisterSupplierPos: sisterPayload.length ? sisterPayload : null,
        sourceType: "excel-po-upload",
        status: "draft",
        items: purchaseOrderItemsForFirestore(items),
        ...(itemRemarkHistory ? { itemRemarkHistory } : {}),
        totalLineItems: items.length,
        totalQuantity: totalItems,
        totalAmount,
        vat10Amount: vat10Amount ?? null,
        poGrandTotal: poGrandTotal ?? null,
        createdAt: submittedAt,
        updatedAt: submittedAt,
      });

      setStatus(p.poSavedSuccess);
      setBranchName("");
      setPrNumber("");
      setPoNumber("");
      setUrgent("no");
      setItems([]);
      setSubmitItemRemarks({});
      setVat10Amount(null);
      setPoGrandTotal(null);
      setPrFileName("");
      setPoFileName("");
      setPrFile(null);
      setPoFile(null);
      setIncludeOtherSuppliers(false);
      setSisterSupplierDrafts([]);
      if (prFileInputRef.current) {
        prFileInputRef.current.value = "";
      }
      if (poFileInputRef.current) {
        poFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to save PO:", error);
      setStatus(p.poSaveFailed);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {confirmAction ? (
        <div className={`${PR_PO_MODAL_OVERLAY} z-[70] bg-slate-900/40`}>
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h4 className="text-lg font-semibold text-brand-navy">{p.pleaseConfirm}</h4>
            <p className="mt-2 text-sm text-slate-600">{p.confirmMessage}</p>
            {includeOtherSuppliers && sisterSupplierDrafts.length ? (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                {fmt(p.confirmSisterSuppliers, {
                  count: sisterSupplierDrafts.length,
                  suppliers: sisterSupplierDrafts.map((r) => r.supplier).join(", "),
                })}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmAction(null);
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {p.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmAction;
                  setConfirmAction(null);
                  if (action === "submit") {
                    void handleSubmitPo(true);
                  } else {
                    void handleSaveOpenPo(true);
                  }
                }}
                className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
              >
                {p.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {(isSaving || isSavingOpen || isFileProcessing) ? (
        <div className={`${PR_PO_MODAL_OVERLAY} z-[60] bg-slate-900/35 backdrop-blur-[1px]`}>
          <div className="w-full max-w-sm rounded-xl bg-white px-5 py-4 shadow-xl">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 shrink-0 animate-spin text-brand-navy"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-slate-700">
                  {isSaving ? p.submittingPo : isSavingOpen ? p.creatingSo : fileProcessingOverlayMessage}
                </span>
                {isParsingPo && !isSaving && !isSavingOpen ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {fmt(p.readingWorkbook, { percent: Math.min(100, poParsingProgress) })}
                  </p>
                ) : null}
              </div>
            </div>
            {isParsingPo && !isSaving && !isSavingOpen ? (
              <div
                className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-valuenow={Math.min(100, poParsingProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-brand-navy transition-[width] duration-200 ease-out"
                  style={{ width: `${Math.min(100, poParsingProgress)}%` }}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {pageMode !== "create-so" ? (
        <>
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">{p.process}</p>
          <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">{p.title}</h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">{p.pageDesc}</p>
        </div>
      </div>

      <div className="-mx-1 flex flex-wrap gap-2 overflow-x-auto border-b border-slate-200 px-1 pb-2 [-webkit-overflow-scrolling:touch] sm:flex-nowrap sm:gap-3">
        {canDashboard ? (
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "dashboard"
                ? "bg-brand-navy text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p.dashboard}
          </button>
        ) : null}
        {canSubmit ? (
          <button
            type="button"
            onClick={() => setActiveTab("submit")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "submit"
                ? "bg-brand-navy text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p.submitPo}
          </button>
        ) : null}
        {canOpen ? (
          <button
            type="button"
            onClick={() => setActiveTab("open")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "open"
                ? "bg-brand-navy text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p.createSo}
          </button>
        ) : null}
        {canViewPo ? (
          <button
            type="button"
            onClick={() => setActiveTab("view")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "view"
                ? "bg-brand-navy text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p.viewPo}
          </button>
        ) : null}
        {canItemTracker ? (
          <button
            type="button"
            onClick={() => setActiveTab("items")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "items"
                ? "bg-brand-navy text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p.itemTracker}
          </button>
        ) : null}
      </div>
        </>
      ) : null}

      {pageMode === "create-so" && canOpen ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dhm-myadmin/pr-po?tab=open"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {p.backToCreateSoList}
            </Link>
            <h2 className="text-lg font-semibold text-brand-navy">{p.createSo}</h2>
          </div>
          {!selectedPo && !loadingSaved ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{p.poNotFound}</p>
          ) : null}
          {selectedPo && isPoOpeningComplete(selectedPo) ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {p.poCompleted}
            </p>
          ) : null}
          {selectedPo && !isPoOpeningComplete(selectedPo) ? (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{p.branch}</p>
                  <p className="mt-1 text-base font-semibold text-brand-navy">{selectedPo.branchName}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{p.prNumber}</p>
                  <p className="mt-1 text-base font-semibold text-brand-navy">{selectedPo.prNumber}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{p.poNumber}</p>
                  <p className="mt-1 text-base font-semibold text-brand-navy">{formatPoNumberDisplay(selectedPo.poNumber)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{p.submittedBy}</p>
                  <p className="mt-1 text-base font-semibold text-brand-navy">
                    {selectedPo.submittedByName ?? "—"}
                  </p>
                  {selectedPo.submittedByUsername ? (
                    <p className="text-xs text-slate-500">{selectedPo.submittedByUsername}</p>
                  ) : null}
                </div>
              </div>
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">{p.invoiceNumber}</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(event) => setInvoiceNumber(event.target.value)}
                    disabled={!!selectedPo && isPoOpeningComplete(selectedPo)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                  {selectedPo && !isPoOpeningComplete(selectedPo) && isOpenPoInvoicePlaceholderOnly(invoiceNumber) ? (
                    <p className="mt-1.5 text-xs text-slate-500">{p.invoiceHint}</p>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">{p.invoiceLink}</label>
                      <input
                        type="url"
                        value={invoiceLinkInput}
                        onChange={(event) => setInvoiceLinkInput(event.target.value)}
                        disabled={!!selectedPo && isPoOpeningComplete(selectedPo)}
                        placeholder={p.placeholderInvoiceLink}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                      {invoiceLinkInput.trim() && !normalizeExternalLink(invoiceLinkInput) ? (
                        <p className="mt-1 text-xs text-rose-600">{p.invalidHttpLink}</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">{p.deliveryNoteLinks}</label>
                      <textarea
                        rows={3}
                        value={deliveryNoteLinksText}
                        onChange={(event) => setDeliveryNoteLinksText(event.target.value)}
                        disabled={!!selectedPo && isPoOpeningComplete(selectedPo)}
                        placeholder={p.placeholderDeliveryLinks}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                      {deliveryNoteLinksText.trim() ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {parsePastedLinks(deliveryNoteLinksText).length === 1
                            ? fmt(p.validLinksDetected, { count: parsePastedLinks(deliveryNoteLinksText).length })
                            : fmt(p.validLinksDetectedPlural, { count: parsePastedLinks(deliveryNoteLinksText).length })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedPo.prFileUrl ? (
                      <a
                        href={selectedPo.prFileUrl}
                        download={
                          selectedPo.prFileName?.replace(/[/\\?%*:|"<>]/g, "-") ||
                          `PR-${selectedPo.prNumber}.xlsx`
                        }
                        rel="noreferrer"
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {p.downloadPr}
                      </a>
                    ) : null}
                    {selectedPo.poFileUrl ? (
                      <a
                        href={selectedPo.poFileUrl}
                        download={
                          selectedPo.poFileName?.replace(/[/\\?%*:|"<>]/g, "-") ||
                          `PO-${selectedPo.poNumber}.xlsx`
                        }
                        rel="noreferrer"
                        title={selectedPoSisterDownloadCount > 0 ? p.primaryPoDhm : undefined}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {p.downloadPo}
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        void handleSaveOpenPo();
                      }}
                      disabled={
                        isSavingOpen ||
                        !isOpenPoFormValid ||
                        (selectedPo ? isPoOpeningComplete(selectedPo) : false)
                      }
                      className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSavingOpen ? p.creating : p.createSo}
                    </button>
                  </div>
                  {selectedPoSisterDownloadCount > 0 ? (
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50/80 px-3 py-2">
                      <p className="text-xs font-semibold text-indigo-900">
                        +{selectedPoSisterDownloadCount} supplier PO
                        {selectedPoSisterDownloadCount === 1 ? "" : "s"} — download only (same PR, other companies):
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(selectedPo.sisterSupplierPos ?? []).map((sp, spIdx) =>
                          sp.poFileUrl ? (
                            <a
                              key={sp.entryId ?? `open-sister-dl-${spIdx}`}
                              href={sp.poFileUrl}
                              download={
                                sp.poFileName?.replace(/[/\\?%*:|"<>]/g, "-") ||
                                `PO-${sp.supplier}-${spIdx + 1}.xlsx`
                              }
                              rel="noreferrer"
                              title={
                                sp.poFileName
                                  ? fmt(p.downloadFile, { name: sp.poFileName })
                                  : fmt(p.downloadSupplierPo, { supplier: sp.supplier })
                              }
                              className="rounded-lg border border-indigo-300 bg-white px-3 py-2 text-xs font-semibold text-indigo-900 hover:bg-indigo-50"
                            >
                              {p.download}{" "}
                              {sisterSupplierPoLinkLabel(selectedPo.sisterSupplierPos, spIdx).replace(/^PO /, "")}
                            </a>
                          ) : null,
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{p.no}</th>
                      <th className="px-4 py-3 font-semibold">{p.item}</th>
                      <th className="px-4 py-3 font-semibold text-right">{p.orderedQty}</th>
                      {selectedPoPhases.map((phase, phaseIndex) => (
                        <th key={`phase-col-${phaseIndex}`} className="px-4 py-3 font-semibold text-right">
                          {fmt(p.openedCol, { label: phase.invoiceNumber || phaseIndex + 1 })}
                        </th>
                      ))}
                      <th className="px-4 py-3 font-semibold text-right">{p.openInThisPo}</th>
                      <th className="px-4 py-3 font-semibold text-right">{p.qtyLeft}</th>
                      <th className="px-4 py-3 font-semibold text-right">{p.unitCost}</th>
                      <th className="px-4 py-3 font-semibold text-right">{p.totalCost}</th>
                      <th className="min-w-[140px] px-4 py-3 font-semibold">{p.remarks}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPo.items.map((item) => {
                      const opened = getOpenedQty(selectedPo, item.lineNo);
                      const openNow = Number(openQtyInputs[String(item.lineNo)] || 0);
                      const left = item.quantity - opened - openNow;

                      return (
                        <tr key={`${selectedPo.id}-${item.lineNo}`}>
                          <td className="px-4 py-3">{item.lineNo}</td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-brand-navy">{item.item}</span>
                            {item.itemCode ? (
                              <div className="text-xs text-slate-400">{item.itemCode}</div>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          {selectedPoPhases.map((_, phaseIndex) => (
                            <td key={`phase-cell-${item.lineNo}-${phaseIndex}`} className="px-4 py-3 text-right">
                              {getOpenedQtyByPhase(item.lineNo, phaseIndex)}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-right">
                            {left + openNow <= 0 ? (
                              <div className="inline-flex h-9 w-24 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-400">
                                {p.fulfilled}
                              </div>
                            ) : (
                              <input
                                type="text"
                                inputMode="numeric"
                                value={openQtyInputs[String(item.lineNo)] ?? ""}
                                onChange={(event) =>
                                  handleOpenQtyChange(item.lineNo, event.target.value)
                                }
                                className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-right text-sm text-slate-700"
                              />
                            )}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-semibold ${
                              left === 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {left}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {item.unitPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 3,
                            })}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {item.totalPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-4 py-3">
                            {(() => {
                              const remarkEntries = getItemRemarkEntries(
                                selectedPo.itemRemarkHistory,
                                item.lineNo,
                              );
                              const preview = remarkPreviewText(remarkEntries);
                              return (
                                <button
                                  type="button"
                                  onClick={() => openRemarkModal(item.lineNo)}
                                  className="w-full min-w-[120px] rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-left text-sm text-slate-700 hover:border-brand-navy/40 hover:bg-slate-50"
                                >
                                  {remarkEntries.length > 0 ? (
                                    <>
                                      <span className="block font-medium text-brand-navy">
                                        {remarkEntries.length === 1
                                          ? fmt(p.remarkCount, { count: remarkEntries.length })
                                          : fmt(p.remarkCountPlural, { count: remarkEntries.length })}
                                      </span>
                                      <span className="block truncate text-xs text-slate-500">{preview}</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400">{p.addRemark}</span>
                                  )}
                                </button>
                              );
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      ) : activeTab === "submit" && canSubmit ? (
        <>
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">{p.branch}</label>
          <select
            value={branchName}
            onChange={(event) => setBranchName(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700"
          >
            <option value="">{p.selectBranch}</option>
            {selectablePoBranches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">{p.prNumber}</label>
          <input
            type="text"
            value={prNumber}
            onChange={(event) => setPrNumber(event.target.value)}
            placeholder="e.g. 2601-0014"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">{p.poNumber}</label>
          <input
            type="text"
            value={poNumber}
            onChange={(event) => setPoNumber(event.target.value.replace(/\D/g, ""))}
            placeholder="260400035"
            inputMode="numeric"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">{p.uploadPrExcel}</label>
          <div
            className={`rounded-lg border bg-white px-3 py-2 ${
              isReadingPr ? "border-brand-navy/40 bg-brand-navy/5 ring-1 ring-brand-navy/20" : "border-slate-300"
            }`}
          >
            <input
              ref={prFileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={isReadingPr || isParsingPo}
              onChange={(event) => {
                void handlePrUpload(event);
              }}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-navy file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {isReadingPr ? <UploadBusyInline message={p.readingPrFile} /> : null}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">{p.uploadPoExcelPrimary}</label>
          <div
            className={`rounded-lg border bg-white px-3 py-2 ${
              isParsingPo ? "border-brand-navy/40 bg-brand-navy/5 ring-1 ring-brand-navy/20" : "border-slate-300"
            }`}
          >
            <input
              ref={poFileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={isParsingPo || isReadingPr}
              onChange={(event) => {
                void handlePoUpload(event);
              }}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-navy file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {isParsingPo ? (
              <UploadBusyInline
                message={
                  poParsingProgress > 0
                    ? fmt(p.readingWorkbook, { percent: Math.min(100, poParsingProgress) })
                    : p.extractingPoLines
                }
              />
            ) : null}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">{p.urgent}</label>
          <select
            value={urgent}
            onChange={(e) => setUrgent(e.target.value as "no" | "yes")}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700"
          >
            <option value="no">{p.noOption}</option>
            <option value="yes">{p.yes}</option>
          </select>
        </div>
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/90 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={includeOtherSuppliers}
              onChange={() => {
                setIncludeOtherSuppliers((prev) => {
                  const next = !prev;
                  if (!next) {
                    setSisterSupplierDrafts([]);
                  } else {
                    setSisterSupplierDrafts((drafts) =>
                      drafts.length > 0
                        ? drafts
                        : [
                            {
                              id: newSisterSupplierRowId(),
                              supplier: "VCC",
                              file: null,
                              fileName: "",
                              items: [],
                              vat10Amount: null,
                              poGrandTotal: null,
                            },
                          ],
                    );
                  }
                  return next;
                });
              }}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-800">{p.includeOtherSuppliers}</span>
              <span className="mt-0.5 block text-xs text-slate-600">{p.includeOtherSuppliersDesc}</span>
            </span>
          </label>
          {includeOtherSuppliers ? (
            <div className="mt-4 space-y-3">
              {sisterSupplierDrafts.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:flex-wrap sm:items-end"
                >
                  <div className="min-w-[140px] flex-1">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {p.supplier}
                    </label>
                    <select
                      value={row.supplier}
                      onChange={(e) =>
                        setSisterSupplierDrafts((drafts) =>
                          drafts.map((d) =>
                            d.id === row.id ? { ...d, supplier: e.target.value as SisterSupplierKey } : d,
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {SISTER_SUPPLIER_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[200px] flex-[2]">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {fmt(p.poExcelFor, { supplier: row.supplier })}
                    </label>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      disabled={parsingSisterIds.has(row.id)}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        void handleSisterPoFileChosen(row.id, f);
                        e.target.value = "";
                      }}
                      className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-navy file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    {parsingSisterIds.has(row.id) ? (
                      <UploadBusyInline message={p.parsingSupplierPo} />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 text-xs text-slate-600">
                    {row.fileName ? <div className="font-medium text-slate-800">{row.fileName}</div> : null}
                    {row.parseStatus && !parsingSisterIds.has(row.id) ? (
                      <div className="mt-0.5">{row.parseStatus}</div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSisterSupplierDrafts((drafts) => drafts.filter((d) => d.id !== row.id))}
                    className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {p.remove}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSisterSupplierRow}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-brand-navy/40 bg-white px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50"
              >
                <span className="text-lg leading-none">+</span>
                {sisterSupplierDrafts.length ? p.addAnotherSupplierPo : p.addSupplierPo}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 text-xs uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">{p.no}</th>
                <th className="px-6 py-4 font-semibold">{p.item}</th>
                <th className="px-6 py-4 font-semibold">{p.unit}</th>
                <th className="px-6 py-4 font-semibold text-right">{p.quantity}</th>
                <th className="px-6 py-4 font-semibold text-right">{p.unitPrice}</th>
                <th className="px-6 py-4 font-semibold text-right">{p.totalPrice}</th>
                <th className="min-w-[180px] px-6 py-4 font-semibold">{p.remarks}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item) => (
                <tr key={`${item.lineNo}-${item.itemCode ?? item.item}`} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">{item.lineNo}</td>
                  <td className="px-6 py-4 text-brand-navy">
                    <div className="space-y-0.5">
                      <div className="font-medium text-brand-navy">{item.item}</div>
                      {item.itemCode ? <div className="text-xs text-slate-400">{item.itemCode}</div> : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 uppercase">{item.unit}</td>
                  <td className="px-6 py-4 text-right font-medium">{item.quantity}</td>
                  <td className="px-6 py-4 text-right font-medium">
                    {item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <textarea
                      rows={2}
                      value={submitItemRemarks[String(item.lineNo)] ?? ""}
                      onChange={(event) => setSubmitItemRemark(item.lineNo, event.target.value)}
                      className="w-full min-w-[160px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-navy/40 focus:outline-none focus:ring-1 focus:ring-brand-navy/30"
                    />
                  </td>
                </tr>
              ))}
              {items.length > 0 ? (
                <>
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4 text-right font-semibold text-slate-700" colSpan={2}>
                      {p.lineTotal}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}
                    </td>
                    <td className="px-6 py-4" />
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4 text-right font-semibold text-slate-700" colSpan={2}>
                      {p.vat10}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {(vat10Amount ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}
                    </td>
                    <td className="px-6 py-4" />
                  </tr>
                  <tr className="bg-slate-100/60">
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4 text-right font-bold text-slate-800" colSpan={2}>
                      {p.poTotal}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {(poGrandTotal ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}
                    </td>
                    <td className="px-6 py-4" />
                  </tr>
                </>
              ) : null}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    {p.uploadPoSheetHint}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600">
          {fmt(p.summaryPr, {
            pr: prFileName || p.notUploaded,
            po: poFileName || p.notUploaded,
            lines: items.length,
            qty: totalItems,
            lineTotal: totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            vat: (vat10Amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }),
            poTotal: (poGrandTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }),
          })}
          {includeOtherSuppliers && sisterSupplierDrafts.length
            ? fmt(p.summaryOtherSuppliers, { count: sisterSupplierDrafts.length })
            : ""}
        </div>
        <button
          type="button"
          onClick={() => {
            void handleSubmitPo();
          }}
          disabled={
            isSaving ||
            !items.length ||
            (includeOtherSuppliers &&
              (!sisterSupplierDrafts.length || sisterSupplierDrafts.some((r) => !r.file || !r.items.length)))
          }
          className="rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? p.saving : p.submitPo}
        </button>
      </div>

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
        </>
      ) : activeTab === "open" && canOpen ? (
        <div className="space-y-5">
          <div className="space-y-3">
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-7">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{p.branch}</label>
              <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700">
                <option value="">{p.allBranches}</option>
                {selectablePoBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{p.prNumber}</label>
              <input type="text" value={filterPrNumber} onChange={(e) => setFilterPrNumber(e.target.value)} placeholder={p.searchPrNumber} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{p.poNumber}</label>
              <input type="text" value={filterPoNumber} onChange={(e) => setFilterPoNumber(e.target.value)} placeholder={p.searchPoNumber} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{p.invoiceNumber}</label>
              <input type="text" value={filterInvoiceNumber} onChange={(e) => setFilterInvoiceNumber(e.target.value)} placeholder={p.searchInvoice} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{p.urgent}</label>
              <select value={filterUrgent} onChange={(e) => setFilterUrgent(e.target.value as "" | "yes" | "no")} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700">
                <option value="">{p.all}</option>
                <option value="yes">{p.yes}</option>
                <option value="no">{p.noOption}</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{p.dateFrom}</label>
              <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{p.dateTo}</label>
              <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
            </div>
          </div>
          {hasActiveListFilters ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearListFilters}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                {p.clearFilters}
              </button>
            </div>
          ) : null}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] table-fixed text-left text-sm text-slate-600">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 text-[11px] uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="w-[110px] px-4 py-4 font-semibold">{p.date}</th>
                    <th className="w-[120px] px-4 py-4 font-semibold">{p.branch}</th>
                    <th className="w-[120px] px-4 py-4 font-semibold">{p.prNumber}</th>
                    <th className="w-[145px] px-3 py-4 font-semibold">{p.poNumber}</th>
                    <th className="w-[72px] px-3 py-4 text-right font-semibold">{p.qty}</th>
                    <th className="w-[120px] px-4 py-4 text-right font-semibold">{p.poTotal}</th>
                    <th className="w-[240px] px-4 py-4 text-center font-semibold">{p.files}</th>
                    <th className="w-[110px] px-4 py-4 text-center font-semibold">{p.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loadingSaved ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                        {p.loadingPoRecords}
                      </td>
                    </tr>
                  ) : openPagedPos.length ? (
                    openPagedPos.map((po) => {
                      const sisterCount = (po.sisterSupplierPos ?? []).filter((s) => s.poFileUrl).length;
                      const openingDone = isPoOpeningComplete(po);
                      return (
                      <tr
                        key={po.id}
                        className="cursor-pointer align-middle transition hover:bg-slate-50"
                        onClick={() => handleOpenPoClick(po)}
                      >
                        <td className="whitespace-nowrap px-4 py-4">
                          <div>{po.createdAt?.toDate ? po.createdAt.toDate().toLocaleDateString() : "-"}</div>
                          {po.urgent === "yes" && (
                            <span className="mt-0.5 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">{p.urgent}</span>
                          )}
                        </td>
                        <td className="px-4 py-4 font-medium text-brand-navy">{po.branchName}</td>
                        <td className="px-4 py-4">{po.prNumber}</td>
                        <td className="px-3 py-4 font-semibold text-brand-navy">{formatPoNumberDisplay(po.poNumber)}</td>
                        <td className="px-3 py-4 text-right font-medium">{po.totalQuantity}</td>
                        <td className="px-4 py-4 text-right font-semibold tabular-nums text-brand-navy">
                          {(po.poGrandTotal ?? 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 3,
                          })}
                        </td>
                        <td className="px-4 py-4 align-middle" onClick={(e) => e.stopPropagation()}>
                          <div className="mx-auto flex max-w-[240px] flex-col items-stretch gap-2">
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                              {po.prFileUrl ? (
                                <a
                                  href={po.prFileUrl}
                                  download={
                                    po.prFileName?.replace(/[/\\?%*:|"<>]/g, "-") ||
                                    `PR-${po.prNumber}.xlsx`
                                  }
                                  rel="noreferrer"
                                  className="inline-flex h-9 min-w-[88px] items-center justify-center whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 text-xs font-semibold leading-none text-slate-700 transition hover:bg-slate-50"
                                >
                                  {p.downloadPr}
                                </a>
                              ) : (
                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-400">
                                  {p.noPr}
                                </span>
                              )}
                              {po.poFileUrl ? (
                                <a
                                  href={po.poFileUrl}
                                  download={
                                    po.poFileName?.replace(/[/\\?%*:|"<>]/g, "-") || `PO-${po.poNumber}.xlsx`
                                  }
                                  rel="noreferrer"
                                  title={sisterCount ? p.primaryPoDhm : undefined}
                                  className="inline-flex h-9 min-w-[88px] items-center justify-center whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 text-xs font-semibold leading-none text-slate-700 transition hover:bg-slate-50"
                                >
                                  {p.downloadPo}
                                </a>
                              ) : (
                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-400">
                                  {p.noPo}
                                </span>
                              )}
                            </div>
                            {sisterCount > 0 ? (
                              <div className="border-t border-slate-100 pt-2 text-center">
                                <p className="mb-1.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-indigo-800">
                                  {sisterCount === 1
                                    ? fmt(p.supplierPosList, { count: sisterCount })
                                    : fmt(p.supplierPosListPlural, { count: sisterCount })}
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                  {(po.sisterSupplierPos ?? []).map((sp, spIdx) =>
                                    sp.poFileUrl ? (
                                      <a
                                        key={sp.entryId ?? `sister-dl-${spIdx}`}
                                        href={sp.poFileUrl}
                                        download={
                                          sp.poFileName?.replace(/[/\\?%*:|"<>]/g, "-") ||
                                          `PO-${sp.supplier}-${spIdx + 1}.xlsx`
                                        }
                                        rel="noreferrer"
                                        title={
                                          sp.poFileName
                                            ? fmt(p.downloadFile, { name: sp.poFileName })
                                            : fmt(p.downloadSupplierPo, { supplier: sp.supplier })
                                        }
                                        className="inline-flex h-8 max-w-full min-w-0 items-center justify-center whitespace-nowrap rounded-full border border-indigo-300 bg-indigo-50 px-2.5 text-[11px] font-semibold leading-tight text-indigo-900 transition hover:bg-indigo-100"
                                      >
                                        {p.download}{" "}
                                        {sisterSupplierPoLinkLabel(po.sisterSupplierPos, spIdx).replace(/^PO /, "")}
                                      </a>
                                    ) : null,
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              openingDone ? "text-emerald-700" : "text-brand-navy"
                            }`}
                          >
                            {openingDone ? p.completed : p.createSo}
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </td>
                      </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                        {p.noPoRecordsForFilters}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredSavedPos.length > CREATE_SO_PO_LIST_PAGE_SIZE && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3">
              <p className="text-xs text-slate-500">
                {fmt(p.showingRange, {
                  from: Math.min((openPage - 1) * CREATE_SO_PO_LIST_PAGE_SIZE + 1, filteredSavedPos.length),
                  to: Math.min(openPage * CREATE_SO_PO_LIST_PAGE_SIZE, filteredSavedPos.length),
                  total: filteredSavedPos.length,
                })}
              </p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setOpenPage((p) => Math.max(1, p - 1))} disabled={openPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: Math.ceil(filteredSavedPos.length / CREATE_SO_PO_LIST_PAGE_SIZE) }, (_, i) => i + 1).map((page) => (
                  <button key={page} type="button" onClick={() => setOpenPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${openPage === page ? "bg-brand-navy text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    {page}
                  </button>
                ))}
                <button type="button" onClick={() => setOpenPage((p) => Math.min(Math.ceil(filteredSavedPos.length / CREATE_SO_PO_LIST_PAGE_SIZE), p + 1))} disabled={openPage === Math.ceil(filteredSavedPos.length / CREATE_SO_PO_LIST_PAGE_SIZE)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>

      ) : activeTab === "view" && canViewPo ? (
        /* â”€â”€ View PO — List â†’ Detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        <div className="space-y-5">

          {selectedViewPoId ? (
            /* â”€â”€ DETAIL: timeline for the selected PO â”€â”€ */
            (() => {
              const po = savedPos.find((p) => p.id === selectedViewPoId);
              if (!po || !isPoInViewPoBranchScope(po, viewPoBranchScope)) return null;

              const history = [...(po.openingHistory ?? [])].sort((a, b) => {
                const aT = a.openedAt?.toMillis ? a.openedAt.toMillis() : 0;
                const bT = b.openedAt?.toMillis ? b.openedAt.toMillis() : 0;
                return aT - bT;
              });
              const totalOrdered = po.items.reduce((s, i) => s + i.quantity, 0);
              const totalOpened = po.items.reduce((s, i) => s + getOpenedQty(po, i.lineNo), 0);
              const totalRemaining = totalOrdered - totalOpened;
              const fullyFulfilled = totalOpened >= totalOrdered;
              const hasAnyOpening = history.length > 0;

              return (
                <div className="space-y-5">
                  {/* Back + header */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedViewPoId(null)}
                      className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      {p.backToList}
                    </button>
                    <span className="text-sm text-slate-400">·</span>
                    <h3 className="text-sm font-bold text-slate-800">{formatPoNumberDisplay(po.poNumber)}</h3>
                    <span className="text-xs text-slate-400">{po.branchName} · PR {po.prNumber}</span>
                  </div>

                  {/* PO summary card */}
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Top header strip */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{p.poNumber}</p>
                          <p className="text-sm font-bold text-brand-navy">{formatPoNumberDisplay(po.poNumber)}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{p.branch}</p>
                          <p className="text-sm font-semibold text-slate-700">{po.branchName}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{p.prNumber}</p>
                          <p className="text-sm font-semibold text-slate-700">{po.prNumber}</p>
                        </div>
                        {po.createdAt?.toDate ? (
                          <>
                            <div className="h-8 w-px bg-slate-200" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{p.requested}</p>
                              <p className="text-sm font-semibold text-slate-700">
                                {po.createdAt.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </>
                        ) : null}
                        {po.urgent === "yes" && (
                          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-600">{p.urgent}</span>
                        )}
                      </div>
                      {/* Financial snapshot */}
                      <div className="flex shrink-0 flex-col items-end gap-0.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <div className="flex w-full items-center justify-between gap-8">
                          <span className="text-xs text-slate-400">{p.subtotal}</span>
                          <span className="text-xs font-semibold tabular-nums text-slate-700">
                            ${(po.totalAmount ?? po.items.reduce((s, i) => s + i.totalPrice, 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        {po.vat10Amount != null && (
                          <div className="flex w-full items-center justify-between gap-8">
                            <span className="text-xs text-slate-400">{p.vat10}</span>
                            <span className="text-xs font-semibold tabular-nums text-slate-500">
                              ${po.vat10Amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                        <div className="mt-1 flex w-full items-center justify-between gap-8 border-t border-slate-100 pt-1">
                          <span className="text-xs font-bold text-slate-600">{p.grandTotal}</span>
                          <span className="text-sm font-bold tabular-nums text-brand-navy">
                            ${(po.poGrandTotal ?? po.totalAmount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Qty + status bar */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-6 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        !hasAnyOpening ? "bg-slate-100 text-slate-500"
                          : fullyFulfilled ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}>
                        {!hasAnyOpening ? p.notOpened : fullyFulfilled ? p.fullyFulfilled : p.partiallyFulfilled}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                        {history.length === 1
                          ? fmt(p.openingsCount, { count: history.length })
                          : fmt(p.openingsCountPlural, { count: history.length })}
                      </span>
                      <span className="rounded-full bg-brand-navy/10 px-3 py-1 text-xs font-medium text-brand-navy">
                        {p.ordered}: {totalOrdered}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {p.opened}: {totalOpened}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${totalRemaining <= 0 ? "bg-slate-100 text-slate-400" : "bg-rose-50 text-rose-600"}`}>
                        {p.remaining}: {Math.max(0, totalRemaining)}
                      </span>
                    </div>

                    {/* Timeline */}
                    {!hasAnyOpening ? (
                      <div className="px-6 py-10 text-center text-sm text-slate-400">{p.noOpeningsYet}</div>
                    ) : (
                      <div className="px-6 py-5">
                        <div className="relative space-y-0">
                          {history.map((phase, idx) => {
                            const isLast = idx === history.length - 1;
                            const isCollapsed = collapsedPhases.has(idx);
                            const openDate = phase.openedAt?.toDate
                              ? phase.openedAt.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
                            const openTime = phase.openedAt?.toDate
                              ? phase.openedAt.toDate().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
                            const phaseOpenedCount = (phase.items ?? []).filter((e) => e.openedQty > 0).length;

                            return (
                              <div key={idx} className="relative flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                                    isLast && !fullyFulfilled ? "border-amber-400 bg-amber-50 text-amber-600" : "border-brand-navy bg-brand-navy text-white"
                                  }`}>{idx + 1}</div>
                                  {!isLast ? <div className="w-0.5 flex-1 bg-slate-200 my-1" style={{ minHeight: "24px" }} /> : null}
                                </div>
                                <div className={`min-w-0 flex-1 ${isLast ? "pb-2" : "pb-6"}`}>
                                  {/* Collapsible header */}
                                  {/* Phase value for collapsed header */}
                                  {(() => {
                                    const phaseValue = (phase.items ?? []).reduce((s, e) => {
                                      const item = po.items.find((i) => i.lineNo === e.lineNo);
                                      return s + (e.openedQty ?? 0) * (item?.unitPrice ?? 0);
                                    }, 0);
                                    return (
                                      <button
                                        type="button"
                                        onClick={() => setCollapsedPhases((prev) => {
                                          const next = new Set(prev);
                                          if (next.has(idx)) next.delete(idx); else next.add(idx);
                                          return next;
                                        })}
                                        className="mb-3 flex w-full flex-wrap items-center gap-2 text-left"
                                      >
                                        <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-xs font-bold text-brand-navy">{phase.invoiceNumber ?? "—"}</span>
                                        <span className="text-xs text-slate-400">{openDate}{openTime ? ` · ${openTime}` : ""}</span>
                                        {phase.createdByName ? (
                                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                            {fmt(p.byUser, { name: phase.createdByName })}
                                          </span>
                                        ) : null}
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                                          {phaseOpenedCount === 1
                                            ? fmt(p.itemsOpened, { count: phaseOpenedCount })
                                            : fmt(p.itemsOpenedPlural, { count: phaseOpenedCount })}
                                        </span>
                                        {phaseValue > 0 && (
                                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                            ${phaseValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </span>
                                        )}
                                        <span className="ml-auto text-slate-400">
                                          <svg className={`h-4 w-4 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </span>
                                      </button>
                                    );
                                  })()}
                                  <div className="mb-3 flex flex-wrap gap-2">
                                      <button
                                        type="button"
                                        onClick={() => printViewPoDelivery(po, history, idx)}
                                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                      >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        {p.print}
                                      </button>
                                      {phaseInvoiceLink(phase) ? (
                                        <a
                                          href={phaseInvoiceLink(phase)!}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                          {p.viewInvoice}
                                        </a>
                                      ) : null}
                                      {phaseDeliveryNoteLinks(phase).map((dnLink, dnIdx) => (
                                        <a
                                          key={`${dnLink}-${dnIdx}`}
                                          href={dnLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          title={dnLink}
                                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                          {phaseDeliveryNoteLinks(phase).length > 1
                                            ? `${p.viewDeliveryNote} ${dnIdx + 1}`
                                            : p.viewDeliveryNote}
                                        </a>
                                      ))}
                                    </div>
                                  {!isCollapsed && <div className="overflow-hidden rounded-lg border border-slate-100">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="bg-slate-50">
                                          <th className="px-3 py-2 text-left font-semibold text-slate-500">{p.item}</th>
                                          <th className="px-3 py-2 text-right font-semibold text-slate-500">{p.unit}</th>
                                          <th className="px-3 py-2 text-right font-semibold text-slate-500">{p.unitPriceUsd}</th>
                                          <th className="px-3 py-2 text-right font-semibold text-slate-500">{p.ordered}</th>
                                          <th className="px-3 py-2 text-right font-semibold text-slate-500">{p.thisDelivery}</th>
                                          <th className="px-3 py-2 text-right font-semibold text-slate-500">{p.openingValueUsd}</th>
                                          <th className="px-3 py-2 text-right font-semibold text-slate-500">{p.totalOpened}</th>
                                          <th className="px-3 py-2 text-right font-semibold text-slate-500">{p.remaining}</th>
                                          <th className="min-w-[120px] px-3 py-2 text-left font-semibold text-slate-500">{p.remarks}</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {po.items.map((poItem) => {
                                          const entry = (phase.items ?? []).find((e) => e.lineNo === poItem.lineNo);
                                          const thisOpeningQty = entry?.openedQty ?? 0;
                                          const totalOpenedForItem = getOpenedQtyThroughPhase(
                                            history,
                                            idx,
                                            poItem.lineNo,
                                          );
                                          const remainingForItem = Math.max(
                                            0,
                                            poItem.quantity - totalOpenedForItem,
                                          );
                                          const wasOpened = thisOpeningQty > 0;
                                          const isFulfilled = remainingForItem === 0;
                                          const openingValue = thisOpeningQty * (poItem.unitPrice ?? 0);
                                          const remarkEntries = getItemRemarkEntries(
                                            po.itemRemarkHistory,
                                            poItem.lineNo,
                                          );
                                          return (
                                            <tr key={poItem.lineNo} className={wasOpened ? "bg-white" : "bg-slate-50/40 opacity-60"}>
                                              <td className="px-3 py-2 text-slate-700">
                                                <span className="mr-2 text-slate-400">#{poItem.lineNo}</span>
                                                {poItem.item}
                                              </td>
                                              <td className="px-3 py-2 text-right text-slate-400">{poItem.unit}</td>
                                              <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                                                {poItem.unitPrice > 0 ? `$${poItem.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                                              </td>
                                              <td className="px-3 py-2 text-right text-slate-500">{poItem.quantity}</td>
                                              <td className={`px-3 py-2 text-right font-semibold tabular-nums ${wasOpened ? "text-brand-navy" : "text-slate-300"}`}>{wasOpened ? thisOpeningQty : "—"}</td>
                                              <td className={`px-3 py-2 text-right font-semibold tabular-nums ${wasOpened && openingValue > 0 ? "text-emerald-700" : "text-slate-300"}`}>
                                                {wasOpened && openingValue > 0 ? `$${openingValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                                              </td>
                                              <td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-700">{totalOpenedForItem > 0 ? totalOpenedForItem : "—"}</td>
                                              <td className={`px-3 py-2 text-right font-semibold tabular-nums ${isFulfilled ? "text-emerald-600" : "text-rose-500"}`}>{remainingForItem}</td>
                                              <td className="max-w-[220px] px-3 py-2 text-slate-600">
                                                <RemarkTimelineList entries={remarkEntries} compact />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                      <tfoot>
                                        {(() => {
                                          const totalPhaseQty = (phase.items ?? []).reduce((s, e) => s + (e.openedQty ?? 0), 0);
                                          const totalPhaseValue = (phase.items ?? []).reduce((s, e) => {
                                            const item = po.items.find((i) => i.lineNo === e.lineNo);
                                            return s + (e.openedQty ?? 0) * (item?.unitPrice ?? 0);
                                          }, 0);
                                          const totalAllOpened = po.items.reduce(
                                            (s, i) => s + getOpenedQtyThroughPhase(history, idx, i.lineNo),
                                            0,
                                          );
                                          const totalRem = po.items.reduce(
                                            (s, i) =>
                                              s +
                                              Math.max(
                                                0,
                                                i.quantity - getOpenedQtyThroughPhase(history, idx, i.lineNo),
                                              ),
                                            0,
                                          );
                                          return (
                                            <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-600">
                                              <td className="px-3 py-2">{p.total}</td>
                                              <td className="px-3 py-2" />
                                              <td className="px-3 py-2" />
                                              <td className="px-3 py-2 text-right text-slate-700">{po.items.reduce((s, i) => s + i.quantity, 0)}</td>
                                              <td className="px-3 py-2 text-right text-brand-navy">{totalPhaseQty || "—"}</td>
                                              <td className="px-3 py-2 text-right text-emerald-700">
                                                {totalPhaseValue > 0 ? `$${totalPhaseValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                                              </td>
                                              <td className="px-3 py-2 text-right text-slate-700">{totalAllOpened}</td>
                                              <td className={`px-3 py-2 text-right ${totalRem === 0 ? "text-emerald-600" : "text-rose-500"}`}>{totalRem}</td>
                                              <td className="px-3 py-2" />
                                            </tr>
                                          );
                                        })()}
                                      </tfoot>
                                    </table>
                                  </div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* File links */}
                    {(po.prFileUrl ?? po.poFileUrl ?? (po.sisterSupplierPos?.some((s) => s.poFileUrl))) ? (
                      <div className="flex flex-wrap gap-2 border-t border-slate-100 px-6 py-3">
                        {po.prFileUrl ? (
                          <a href={po.prFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            {p.viewPr}
                          </a>
                        ) : null}
                        {po.poFileUrl ? (
                          <a href={po.poFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            {p.viewPo}
                          </a>
                        ) : null}
                        {(po.sisterSupplierPos ?? []).map((sp, spIdx) =>
                          sp.poFileUrl ? (
                            <a
                              key={sp.entryId ?? `view-sister-${spIdx}`}
                              href={sp.poFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={sp.poFileName ?? undefined}
                              className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-100"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                              {sisterSupplierPoLinkLabel(po.sisterSupplierPos, spIdx)}
                            </a>
                          ) : null,
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })()
          ) : (
            /* â”€â”€ LIST: paginated table â”€â”€ */
            <>
              {/* {viewPoBranchScope.kind === "branch" ? (
                <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                  View PO is limited to your office branch:{" "}
                  <span className="font-semibold text-brand-navy">{viewPoBranchScope.branchName}</span>.
                </div>
              ) : null} */}
              {/* Filters */}
              <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-7">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{p.branch}</label>
                  <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700"
                  >
                    <option value="">{p.allBranches}</option>
                    {selectablePoBranches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{p.prNumber}</label>
                  <input type="text" value={filterPrNumber} onChange={(e) => setFilterPrNumber(e.target.value)} placeholder={p.searchPrNumber} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{p.poNumber}</label>
                  <input type="text" value={filterPoNumber} onChange={(e) => setFilterPoNumber(e.target.value)} placeholder={p.searchPoNumber} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{p.invoiceNumber}</label>
                  <input type="text" value={filterInvoiceNumber} onChange={(e) => setFilterInvoiceNumber(e.target.value)} placeholder={p.searchInvoice} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{p.urgent}</label>
                  <select value={filterUrgent} onChange={(e) => setFilterUrgent(e.target.value as "" | "yes" | "no")} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700">
                    <option value="">{p.all}</option>
                    <option value="yes">{p.yes}</option>
                    <option value="no">{p.noOption}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{p.lastOpenedFrom}</label>
                  <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{p.lastOpenedTo}</label>
                  <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700" />
                </div>
              </div>
              {hasActiveListFilters ? (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearListFilters}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {p.clearFilters}
                  </button>
                </div>
              ) : null}

              {loadingSaved ? (
                <p className="py-10 text-center text-sm text-slate-400">{p.loadingRecords}</p>
              ) : viewListSource.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center">
                  <p className="text-sm text-slate-400">
                    {viewPoBranchScope.kind === "none" ? p.noPosForAccount : p.noPosFound}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{p.poNumber}</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{p.branch}</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{p.prNumber}</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{p.requestedDate}</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{p.lastOpened}</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">{p.poValueUsd}</th>
                          <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">{p.openings}</th>
                          <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">{p.status}</th>
                          <th className="px-5 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewPagedPos.map((po) => {
                          const totalOrdered = po.items.reduce((s, i) => s + i.quantity, 0);
                          const totalOpened = po.items.reduce((s, i) => s + getOpenedQty(po, i.lineNo), 0);
                          const fullyFulfilled = totalOpened >= totalOrdered;
                          const openingCount = (po.openingHistory ?? []).length;
                          return (
                            <tr
                              key={po.id}
                              className="cursor-pointer transition hover:bg-slate-50"
                              onClick={() => { setSelectedViewPoId(po.id); setCollapsedPhases(new Set()); }}
                            >
                              <td className="px-5 py-3.5 font-semibold text-brand-navy">
                                {formatPoNumberDisplay(po.poNumber)}
                                {po.urgent === "yes" && <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">{p.urgent}</span>}
                              </td>
                              <td className="px-5 py-3.5 text-slate-700">{po.branchName}</td>
                              <td className="px-5 py-3.5 text-slate-600">{po.prNumber}</td>
                              <td className="px-5 py-3.5 text-slate-500">
                                {po.createdAt?.toDate
                                  ? po.createdAt.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                  : "—"}
                              </td>
                              <td className="px-5 py-3.5 text-slate-500">
                                {(() => {
                                  const latest = getPoLastOpenedDate(po);
                                  if (!latest) return <span className="text-slate-300">—</span>;
                                  return latest.toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  });
                                })()}
                              </td>
                              <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-brand-navy">
                                {po.poGrandTotal != null
                                  ? `$${po.poGrandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                  : <span className="text-slate-300">—</span>}
                              </td>
                              <td className="px-5 py-3.5 text-center text-slate-600">{openingCount}</td>
                              <td className="px-5 py-3.5 text-center">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  openingCount === 0
                                    ? "bg-slate-100 text-slate-500"
                                    : fullyFulfilled
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-amber-100 text-amber-700"
                                }`}>
                                  {openingCount === 0 ? p.notOpened : fullyFulfilled ? p.fulfilled : p.partial}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy">
                                  {p.viewHistory}
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {viewListSource.length > VIEW_PO_PO_LIST_PAGE_SIZE ? (
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3">
                      <p className="text-xs text-slate-500">
                        {fmt(p.showingRange, {
                          from: Math.min((viewPage - 1) * VIEW_PO_PO_LIST_PAGE_SIZE + 1, viewListSource.length),
                          to: Math.min(viewPage * VIEW_PO_PO_LIST_PAGE_SIZE, viewListSource.length),
                          total: viewListSource.length,
                        })}
                      </p>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setViewPage((p) => Math.max(1, p - 1))} disabled={viewPage === 1}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        {Array.from({ length: Math.ceil(viewListSource.length / VIEW_PO_PO_LIST_PAGE_SIZE) }, (_, i) => i + 1).map((page) => (
                          <button key={page} type="button" onClick={() => setViewPage(page)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${viewPage === page ? "bg-brand-navy text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                            {page}
                          </button>
                        ))}
                        <button type="button" onClick={() => setViewPage((p) => Math.min(Math.ceil(viewListSource.length / VIEW_PO_PO_LIST_PAGE_SIZE), p + 1))} disabled={viewPage === Math.ceil(viewListSource.length / VIEW_PO_PO_LIST_PAGE_SIZE)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>

      ) : activeTab === "items" && canItemTracker ? (
        <PoItemTrackerTab
          pos={officeScopedPos as PoForItemTracker[]}
          loading={loadingSaved}
          branches={selectablePoBranches}
          labels={{
            itemTracker: p.itemTracker,
            itemTrackerDesc: p.itemTrackerDesc,
            searchItem: p.searchItem,
            onlyWithRemaining: p.onlyWithRemaining,
            itemName: p.itemName,
            itemCode: p.itemCode,
            unit: p.unit,
            trackerColOrdered: p.trackerColOrdered,
            totalOpened: p.totalOpened,
            trackerColRemaining: p.trackerColRemaining,
            poCount: p.poCount,
            poBreakdown: p.poBreakdown,
            viewPo: p.viewPo,
            lineNo: p.no,
            branch: p.branch,
            prNumber: p.prNumber,
            poNumber: p.poNumber,
            orderedQty: p.orderedQty,
            openedShort: p.openedShort,
            qtyLeft: p.qtyLeft,
            loadingRecords: p.loadingRecords,
            noItemsFound: p.noItemsFound,
            expandRow: p.expandRow,
            collapseRow: p.collapseRow,
            trackerSummary: p.trackerSummary,
            allBranches: p.allBranches,
            clearFilters: p.clearFilters,
            fulfilled: p.fulfilled,
            partial: p.partial,
            notOpened: p.notOpened,
          }}
          fmt={fmt}
          formatPoNumber={formatPoNumberDisplay}
          onOpenPoInView={
            canViewPo
              ? (poId) => {
                  setActiveTab("view");
                  setSelectedViewPoId(poId);
                  setCollapsedPhases(new Set());
                }
              : undefined
          }
        />
      ) : activeTab === "dashboard" && canDashboard ? (() => {
        const R = 40;
        const SW = 18;
        const C = 2 * Math.PI * R;

        const renderDonut = (slices: { value: number; color: string }[]) => {
          const total = slices.reduce((s, sl) => s + sl.value, 0);
          if (total === 0) {
            return (
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx={50} cy={50} r={R} fill="none" stroke="#e2e8f0" strokeWidth={SW} />
                <text x={50} y={54} textAnchor="middle" fontSize={13} fontWeight={600} fill="#94a3b8">—</text>
              </svg>
            );
          }
          let accumulated = 0;
          return (
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle cx={50} cy={50} r={R} fill="none" stroke="#e2e8f0" strokeWidth={SW} />
              {slices.map((sl, i) => {
                if (sl.value === 0) return null;
                const len = (sl.value / total) * C;
                const offset = -C * 0.25 + accumulated * C / total;
                const dashOffset = -offset;
                const el = (
                  <circle
                    key={i}
                    cx={50} cy={50} r={R}
                    fill="none"
                    stroke={sl.color}
                    strokeWidth={SW}
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="butt"
                    style={{ transition: "stroke-dasharray 0.4s ease" }}
                  />
                );
                accumulated += sl.value;
                return el;
              })}
              <text x={50} y={50} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1e3a5f" dominantBaseline="central">{total}</text>
            </svg>
          );
        };

        const now = new Date();
        const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

        let dashFrom: Date | null = null;
        let dashTo: Date | null = null;
        if (dashPeriod === "today") {
          dashFrom = startOfDay(now); dashTo = endOfDay(now);
        } else if (dashPeriod === "week") {
          const day = now.getDay();
          const mon = new Date(now); mon.setDate(now.getDate() - ((day + 6) % 7));
          dashFrom = startOfDay(mon); dashTo = endOfDay(now);
        } else if (dashPeriod === "month") {
          dashFrom = new Date(now.getFullYear(), now.getMonth(), 1);
          dashTo = endOfDay(now);
        } else if (dashPeriod === "year") {
          dashFrom = new Date(now.getFullYear(), 0, 1);
          dashTo = endOfDay(now);
        } else if (dashPeriod === "custom") {
          dashFrom = dashDateFrom ? new Date(`${dashDateFrom}T00:00:00`) : null;
          dashTo = dashDateTo ? new Date(`${dashDateTo}T23:59:59`) : null;
        }

        const dashPos = officeScopedPos.filter((po) => {
          const d = po.createdAt?.toDate ? po.createdAt.toDate() : null;
          if (dashFrom && (!d || d < dashFrom)) return false;
          if (dashTo && (!d || d > dashTo)) return false;
          return true;
        });

        const fmtUSD = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const branchStats = selectablePoBranches.map((branch) => {
          const bpos = dashPos.filter((po) => po.branchName === branch);
          const counts = { notOpened: 0, partial: 0, fulfilled: 0 };
          const values = { notOpened: 0, partial: 0, fulfilled: 0 };
          let totalOrdered = 0;
          let totalOpened = 0;
          let totalValue = 0;
          let urgentCount = 0;
          bpos.forEach((po) => {
            const ord = po.items.reduce((s, i) => s + i.quantity, 0);
            const opn = po.items.reduce((s, i) => s + getOpenedQty(po, i.lineNo), 0);
            const poVal = po.poGrandTotal ?? 0;
            totalOrdered += ord;
            totalOpened += opn;
            totalValue += poVal;
            if (po.urgent === "yes") urgentCount++;
            const hasHistory = (po.openingHistory ?? []).length > 0;
            if (!hasHistory) { counts.notOpened++; values.notOpened += poVal; }
            else if (opn >= ord) { counts.fulfilled++; values.fulfilled += poVal; }
            else { counts.partial++; values.partial += poVal; }
          });
          return { branch, bpos, counts, values, totalOrdered, totalOpened, totalValue, urgentCount };
        });

        const PERIOD_LABELS: Record<string, string> = {
          all: p.allTime,
          today: p.today,
          week: p.thisWeek,
          month: p.thisMonth,
          year: p.thisYear,
          custom: p.custom,
        };

        return (
          <div className="space-y-6">
            {/* Period filter bar */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{p.period}</label>
                <select
                  value={dashPeriod}
                  onChange={(e) => setDashPeriod(e.target.value as typeof dashPeriod)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">{p.allTime}</option>
                  <option value="today">{p.today}</option>
                  <option value="week">{p.thisWeek}</option>
                  <option value="month">{p.thisMonth}</option>
                  <option value="year">{p.thisYear}</option>
                  <option value="custom">{p.custom}</option>
                </select>
              </div>
              {dashPeriod === "custom" && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-400">{p.from}</label>
                    <input type="date" value={dashDateFrom} onChange={(e) => setDashDateFrom(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-400">{p.to}</label>
                    <input type="date" value={dashDateTo} onChange={(e) => setDashDateTo(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700" />
                  </div>
                  {(dashDateFrom || dashDateTo) && (
                    <button type="button" onClick={() => { setDashDateFrom(""); setDashDateTo(""); }}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">
                      {p.clear}
                    </button>
                  )}
                </>
              )}
              <div className="ml-auto flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {PERIOD_LABELS[dashPeriod]}
                </span>
                <span className="text-xs text-slate-400">
                  {dashPos.length === 1 ? fmt(p.posCount, { count: dashPos.length }) : fmt(p.posCountPlural, { count: dashPos.length })}
                </span>
              </div>
            </div>

            {/* Branch cards */}
            <div className="grid gap-5 md:grid-cols-2">
              {branchStats.map(({ branch, bpos, counts, values, totalOrdered, totalOpened, totalValue, urgentCount }) => {
                const totalRemaining = Math.max(0, totalOrdered - totalOpened);
                const slices = [
                  { value: counts.fulfilled, color: "#10b981" },
                  { value: counts.partial, color: "#f59e0b" },
                  { value: counts.notOpened, color: "#94a3b8" },
                ];
                return (
                  <div key={branch} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    {/* Card header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-brand-navy">{branch}</h3>
                        {urgentCount > 0 && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">
                            {fmt(p.urgentCount, { count: urgentCount })}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{p.totalPoValue}</p>
                        <p className="text-lg font-bold tabular-nums text-brand-navy">${fmtUSD(totalValue)}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start gap-5">
                        {/* Donut */}
                        <div className="h-28 w-28 shrink-0">
                          {loadingSaved ? (
                            <div className="flex h-full items-center justify-center">
                              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-navy" />
                            </div>
                          ) : renderDonut(slices)}
                        </div>
                        {/* Legend with value breakdown */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          {[
                            { label: p.fulfilled, count: counts.fulfilled, value: values.fulfilled, color: "bg-emerald-500", txtCls: "text-emerald-700" },
                            { label: p.partial, count: counts.partial, value: values.partial, color: "bg-amber-400", txtCls: "text-amber-600" },
                            { label: p.notOpened, count: counts.notOpened, value: values.notOpened, color: "bg-slate-400", txtCls: "text-slate-500" },
                          ].map(({ label, count, value, color, txtCls }) => (
                            <div key={label} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
                              <span className={`h-2 w-2 shrink-0 rounded-full ${color}`} />
                              <span className="min-w-0 flex-1 text-xs text-slate-600">{label}</span>
                              <span className="text-xs font-bold text-slate-700">{count}</span>
                              <span className={`text-[11px] font-semibold tabular-nums ${txtCls}`}>${fmtUSD(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Qty bar */}
                      <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
                        {[
                          { label: p.itemsOrdered, val: totalOrdered, cls: "text-brand-navy" },
                          { label: p.itemsOpened, val: totalOpened, cls: "text-emerald-600" },
                          { label: p.itemsRemaining, val: totalRemaining, cls: totalRemaining > 0 ? "text-rose-500" : "text-slate-400" },
                        ].map(({ label, val, cls }) => (
                          <div key={label} className="py-2.5 text-center">
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                            <p className={`text-base font-bold ${cls}`}>{val}</p>
                          </div>
                        ))}
                      </div>
                      {bpos.length === 0 && (
                        <p className="mt-3 text-center text-xs text-slate-400">{p.noPosForPeriod}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary totals row */}
            {(() => {
              const tot = { pos: dashPos.length, notOpened: 0, partial: 0, fulfilled: 0, ordered: 0, opened: 0, value: 0, urgent: 0 };
              const valByStatus = { notOpened: 0, partial: 0, fulfilled: 0 };
              dashPos.forEach((po) => {
                const ord = po.items.reduce((s, i) => s + i.quantity, 0);
                const opn = po.items.reduce((s, i) => s + getOpenedQty(po, i.lineNo), 0);
                const poVal = po.poGrandTotal ?? 0;
                tot.ordered += ord; tot.opened += opn; tot.value += poVal;
                if (po.urgent === "yes") tot.urgent++;
                const hasH = (po.openingHistory ?? []).length > 0;
                if (!hasH) { tot.notOpened++; valByStatus.notOpened += poVal; }
                else if (opn >= ord) { tot.fulfilled++; valByStatus.fulfilled += poVal; }
                else { tot.partial++; valByStatus.partial += poVal; }
              });
              return (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {fmt(p.overallSummary, { period: PERIOD_LABELS[dashPeriod] })}
                    </p>
                  </div>
                  {/* KPI tiles */}
                  <div className="grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
                    {[
                      {
                        label: p.totalPos,
                        value: String(tot.pos),
                        sub: fmt(p.urgentCount, { count: tot.urgent }),
                        subCls: tot.urgent > 0 ? "text-rose-500" : "text-slate-400",
                      },
                      { label: p.notOpened, value: String(tot.notOpened), sub: `$${fmtUSD(valByStatus.notOpened)}`, subCls: "text-slate-400" },
                      { label: p.partial, value: String(tot.partial), sub: `$${fmtUSD(valByStatus.partial)}`, subCls: "text-amber-500" },
                      { label: p.fulfilled, value: String(tot.fulfilled), sub: `$${fmtUSD(valByStatus.fulfilled)}`, subCls: "text-emerald-600" },
                    ].map(({ label, value, sub, subCls }) => (
                      <div key={label} className="px-5 py-4 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                        <p className="text-2xl font-bold text-brand-navy">{value}</p>
                        <p className={`mt-0.5 text-xs font-semibold ${subCls}`}>{sub}</p>
                      </div>
                    ))}
                  </div>
                  {/* Financial + qty strip */}
                  <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50 sm:grid-cols-4">
                    {[
                      { label: p.totalValue, value: `$${fmtUSD(tot.value)}`, cls: "text-brand-navy" },
                      { label: p.itemsOrdered, value: String(tot.ordered), cls: "text-brand-navy" },
                      { label: p.itemsOpened, value: String(tot.opened), cls: "text-emerald-600" },
                      {
                        label: p.itemsRemaining,
                        value: String(Math.max(0, tot.ordered - tot.opened)),
                        cls: tot.ordered - tot.opened > 0 ? "text-rose-500" : "text-slate-400",
                      },
                    ].map(({ label, value, cls }) => (
                      <div key={label} className="px-5 py-3 text-center">
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                        <p className={`text-base font-bold tabular-nums ${cls}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })() : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
          <svg className="mb-4 h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-sm font-semibold text-slate-500">{p.noAccess}</p>
          <p className="mt-1 text-xs text-slate-400">{p.contactAdmin}</p>
        </div>
      )}

      {selectedPo && remarkItemLineNo !== null ? (
        <div className={`${PR_PO_MODAL_OVERLAY} z-50 bg-slate-900/40`}>
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            {(() => {
              const remarkItem = selectedPo.items.find((row) => row.lineNo === remarkItemLineNo);
              const remarkEntries = getItemRemarkEntries(selectedPo.itemRemarkHistory, remarkItemLineNo);
              return (
                <>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-brand-navy">{p.remarksTimeline}</h4>
                      <p className="mt-0.5 text-sm text-slate-600">
                        #{remarkItemLineNo}
                        {remarkItem ? ` · ${remarkItem.item}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRemarkItemLineNo(null);
                        setRemarkText("");
                      }}
                      className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      aria-label={p.closeRemarkPopup}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{p.history}</p>
                    {remarkEntries.length ? (
                      <RemarkTimelineList entries={remarkEntries} />
                    ) : (
                      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                        {p.noRemarksYet}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {fmt(p.addRemarkAs, { name: actorDisplayName })}
                    </label>
                    <textarea
                      rows={4}
                      value={remarkText}
                      onChange={(event) => setRemarkText(event.target.value)}
                      placeholder={p.placeholderNewRemark}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRemarkItemLineNo(null);
                        setRemarkText("");
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {p.cancel}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRemark}
                      disabled={isSavingRemark || !remarkText.trim()}
                      className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSavingRemark ? p.saving : p.addRemarkBtn}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      ) : null}
    </div>
  );
}
