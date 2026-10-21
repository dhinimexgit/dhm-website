"use client";

/** ---------------------------------------------------------------------------
 *  Item Code registry & engine — DHM Group Item Code Policy (+ Tools edition).
 *
 *    - "One item, one code — for the whole Group."
 *    - Domain-first structure.
 *      Tools (TL):  TL - BR - CAT - FAM - MODEL - SEQ   e.g. TL-DW-PT-DRL-DCD796-001
 *      Group:       DOM - SUB - FAM - MODEL - SEQ        e.g. CB-CU-BW-2P5MM-001
 *    - The holding/selling company is a master-data FIELD, never part of code.
 *    - Obsolete items are marked inactive, never deleted.
 *
 *  Item codes live in the Firestore `itemCodes` collection (the code itself is
 *  the document id, so uniqueness is guaranteed by the database).
 *  --------------------------------------------------------------------------- */

import { requireFirebaseDb } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, type Unsubscribe } from "firebase/firestore";

// ============================================================================
//   Firestore record
// ============================================================================
export type ItemStatus = "active" | "inactive" | "obsolete";

export type ItemCodeRecord = {
  id: string; // == code
  code: string;
  domain: string;
  brand: string;
  category: string;
  family: string;
  model: string;
  seq: number;
  description: string;
  supplierPartNumber: string;
  barcode: string;
  uom: string;
  minStockLevel: number | null;
  reorderLevel: number | null;
  warrantyPeriod: string;
  taxCategory: string;
  costingMethod: string;
  compatibleModel: string;
  hsCode: string;
  companyCode: string;
  status: ItemStatus;
  notes: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdBy?: string;
};

// ============================================================================
//   1. PRODUCT DOMAINS  (first segment)
// ============================================================================
export type DomainDef = {
  code: string;
  labelEn: string;
  usedBy: string;
  active: boolean;
  /** true → Tools-Division edition: adds a Category segment. */
  tools?: boolean;
};

export const DOMAINS: DomainDef[] = [
  { code: "TL", labelEn: "Tools (power & hand tools)", usedBy: "Dhinimex, NHM", active: true, tools: true },
  { code: "ME", labelEn: "Measuring & test equipment", usedBy: "Dhinimex, NHM", active: true },
  { code: "CB", labelEn: "Cable & wire", usedBy: "Dhinimex, NHM, Electricity", active: true },
  { code: "TX", labelEn: "Transformer", usedBy: "Electricity cos", active: true },
  { code: "MT", labelEn: "Smart meter / metering", usedBy: "Electricity cos", active: true },
  { code: "EM", labelEn: "Electrical materials (MV/LV)", usedBy: "Electricity cos", active: true },
  { code: "WP", labelEn: "Water pipe", usedBy: "Water cos, NHM", active: true },
  { code: "WF", labelEn: "Water fittings & valves", usedBy: "Water cos, NHM", active: true },
  { code: "WM", labelEn: "Water meter", usedBy: "Water cos", active: true },
  { code: "BM", labelEn: "Building materials & hardware", usedBy: "NHM", active: true },
  { code: "SV", labelEn: "Services (irradiation, testing)", usedBy: "Camirrad", active: true },
  { code: "EV", labelEn: "EV charging equipment", usedBy: "Reserved", active: false },
  { code: "OT", labelEn: "Other / unclassified", usedBy: "Reserved", active: false },
];

export function getDomain(code: string): DomainDef | undefined {
  return DOMAINS.find((d) => d.code === code);
}

// ============================================================================
//   2. GROUP COMPANY CODES  — a master-data field, never part of the code
// ============================================================================
export type CompanyDef = { code: string; name: string; role: string };

export const COMPANIES: CompanyDef[] = [
  { code: "DHM", name: "Dhinimex Co., Ltd.", role: "Importer / principal trading company" },
  { code: "NHM", name: "Nicole Home Mart", role: "Retail — tools, measuring, building wire" },
  { code: "SKR", name: "Saekaraj", role: "Group company" },
  { code: "KCC", name: "KCC", role: "Group company" },
  { code: "VCC", name: "VCC", role: "Group company" },
  { code: "CRD", name: "CamRad", role: "Group company" },
  { code: "CIR", name: "Camirrad Center", role: "E-beam / food irradiation services" },
  { code: "ELK", name: "Elek / Kiensvay Electricity", role: "Transformers, cable, meters, MV/LV" },
  { code: "EPS", name: "Epose Electricity", role: "Transformers, cable, meters, MV/LV" },
  { code: "TKE", name: "Toukmeas Electricity", role: "Transformers, cable, meters, MV/LV" },
  { code: "DGE", name: "Dangtong Electricity", role: "Transformers, cable, meters, MV/LV" },
  { code: "CHK", name: "Chhouk Water", role: "Pipes, fittings, water meters" },
  { code: "CKR", name: "Chumkiri Water", role: "Pipes, fittings, water meters" },
  { code: "TPT", name: "Teuk Pong Toukmeas", role: "Pipes, fittings, water meters" },
  { code: "TPJ", name: "Teuk Pong Traj", role: "Pipes, fittings, water meters" },
  { code: "TKW", name: "Toukmeas Water", role: "Pipes, fittings, water meters" },
  { code: "THP", name: "Thpong Water", role: "Pipes, fittings, water meters" },
];

// ============================================================================
//   3. TOOLS-DIVISION CODE TABLES
// ============================================================================
export type CodeRow = { code: string; labelEn: string };

export const TOOL_BRANDS: CodeRow[] = [
  { code: "DW", labelEn: "DeWalt" },
  { code: "ST", labelEn: "Stanley" },
  { code: "BD", labelEn: "Black+Decker" },
  { code: "OT", labelEn: "Other brand (BU Head approval)" },
];

export const TOOL_CATEGORIES: CodeRow[] = [
  { code: "PT", labelEn: "Power Tools" },
  { code: "HT", labelEn: "Hand Tools" },
  { code: "AC", labelEn: "Accessories" },
  { code: "SP", labelEn: "Spare Parts" },
  { code: "BT", labelEn: "Battery" },
  { code: "CH", labelEn: "Charger" },
  { code: "KT", labelEn: "Kit / Combo Set" },
  { code: "CS", labelEn: "Consumables" },
];

export const TOOL_FAMILIES: Record<string, CodeRow[]> = {
  PT: [
    { code: "DRL", labelEn: "Drill / Driver" },
    { code: "IMP", labelEn: "Impact Driver" },
    { code: "GRD", labelEn: "Angle Grinder" },
    { code: "SAW", labelEn: "Circular Saw" },
    { code: "CUT", labelEn: "Cut-off Machine" },
    { code: "DHM", labelEn: "Demolition Hammer" },
    { code: "SND", labelEn: "Sander" },
    { code: "POL", labelEn: "Polisher" },
    { code: "HGN", labelEn: "Heat Gun" },
    { code: "MTL", labelEn: "Multi Tool" },
    { code: "RHM", labelEn: "Rotary Hammer" },
    { code: "BLW", labelEn: "Blower" },
  ],
  HT: [
    { code: "HMR", labelEn: "Hammer" },
    { code: "PLR", labelEn: "Pliers" },
    { code: "SCR", labelEn: "Screwdriver" },
    { code: "WRN", labelEn: "Wrench / Spanner" },
    { code: "TPE", labelEn: "Measuring Tape" },
    { code: "KNI", labelEn: "Cutter / Knife" },
    { code: "HEX", labelEn: "Hex Key" },
    { code: "SOC", labelEn: "Socket Set" },
    { code: "BOX", labelEn: "Tool Box" },
    { code: "CLP", labelEn: "Clamp" },
    { code: "LVL", labelEn: "Level" },
  ],
  AC: [
    { code: "BIT", labelEn: "Drill Bit" },
    { code: "SBT", labelEn: "Screwdriver Bit" },
    { code: "DSC", labelEn: "Cutting Disc" },
    { code: "GDS", labelEn: "Grinding Disc" },
    { code: "BLD", labelEn: "Saw Blade" },
    { code: "HSW", labelEn: "Hole Saw" },
    { code: "ADP", labelEn: "Adapter" },
    { code: "CHK", labelEn: "Chuck" },
    { code: "SDS", labelEn: "SDS Bit" },
    { code: "SNP", labelEn: "Sanding Paper" },
  ],
  SP: [
    { code: "CBR", labelEn: "Carbon Brush" },
    { code: "SWT", labelEn: "Switch" },
    { code: "ARM", labelEn: "Armature" },
    { code: "FLD", labelEn: "Field Coil / Stator" },
    { code: "GER", labelEn: "Gear" },
    { code: "BRG", labelEn: "Bearing" },
    { code: "HSG", labelEn: "Housing / Body" },
    { code: "CRD", labelEn: "Cord / Cable" },
    { code: "CHK", labelEn: "Chuck" },
    { code: "BTM", labelEn: "Battery Terminal" },
    { code: "PCB", labelEn: "PCB / Electronic Module" },
  ],
};

export const CATEGORIES_WITHOUT_FAMILY = ["BT", "CH", "KT", "CS"];

export const UOMS: CodeRow[] = [
  { code: "PCS", labelEn: "Pieces" },
  { code: "SET", labelEn: "Set" },
  { code: "PACK", labelEn: "Pack" },
  { code: "BOX", labelEn: "Box" },
  { code: "M", labelEn: "Metre" },
  { code: "ROLL", labelEn: "Roll" },
];

export const DEFAULT_UOM: Record<string, string> = {
  PT: "PCS", HT: "PCS", AC: "PCS", SP: "PCS", BT: "PCS", CH: "PCS", KT: "SET", CS: "PCS",
};

export const COSTING_METHODS: CodeRow[] = [
  { code: "FIFO", labelEn: "FIFO (first-in, first-out)" },
  { code: "AVG", labelEn: "Weighted average" },
  { code: "STD", labelEn: "Standard cost" },
];

// ============================================================================
//   4. SEGMENT NORMALISATION & VALIDATION
// ============================================================================

/** Uppercase; decimal point → "P"; strip everything except A–Z, 0–9. */
export function normalizeSegment(raw: string): string {
  return raw.toUpperCase().replace(/[.,]/g, "P").replace(/[^A-Z0-9]/g, "");
}

export const SEQ_PAD = 3;
export function padSeq(n: number): string {
  return String(n).padStart(SEQ_PAD, "0");
}

/** The full code minus its trailing -SEQ segment. */
export function codeStem(code: string): string {
  return code.replace(/-\d+$/, "");
}

export function isValidCode(code: string): boolean {
  return /^[A-Z]{2}(-[A-Z0-9]+){3,4}-\d{3,}$/.test(code);
}

// ============================================================================
//   5. CODE BUILDER
// ============================================================================
export type CodeDraft = {
  domain: string;
  brand: string;
  category: string;
  family: string;
  model: string;
};

/** Build the code stem (everything before -SEQ). "" if a segment is missing. */
export function buildStem(draft: CodeDraft): string {
  const dom = getDomain(draft.domain);
  if (!dom) return "";
  const parts: string[] = [dom.code];
  if (!draft.brand) return "";
  parts.push(normalizeSegment(draft.brand));
  if (dom.tools) {
    if (!draft.category) return "";
    parts.push(normalizeSegment(draft.category));
  }
  if (!draft.family) return "";
  parts.push(normalizeSegment(draft.family));
  if (!draft.model) return "";
  parts.push(normalizeSegment(draft.model));
  return parts.join("-");
}

/** Next free SEQ code for a stem, given existing items. */
export function nextCode(stem: string, existing: ItemCodeRecord[]): string {
  if (!stem) return "";
  let max = 0;
  for (const it of existing) {
    if (codeStem(it.code) === stem) {
      const m = it.code.match(/-(\d+)$/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
  }
  return `${stem}-${padSeq(max + 1)}`;
}

// ============================================================================
//   6. STANDARD DESCRIPTION — Brand + Type + Model/Size + Spec + UOM
// ============================================================================
export function familyLabel(domain: string, category: string, family: string): string {
  const dom = getDomain(domain);
  if (dom?.tools) {
    const row = TOOL_FAMILIES[category]?.find((f) => f.code === family);
    if (row) return row.labelEn;
  }
  return family;
}

export function suggestDescription(draft: CodeDraft, uom: string): string {
  const dom = getDomain(draft.domain);
  const brand = dom?.tools
    ? TOOL_BRANDS.find((b) => b.code === draft.brand)?.labelEn ?? draft.brand
    : draft.brand;
  const family = familyLabel(draft.domain, draft.category, draft.family);
  return [brand, family, draft.model.trim(), uom].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

// ============================================================================
//   7. DUPLICATE DETECTION
// ============================================================================
export type DuplicateReason = "code" | "model" | "barcode" | "supplierPart" | "description";

export type DuplicateHit = {
  item: ItemCodeRecord;
  reason: DuplicateReason;
  blocking: boolean;
};

function norm(s: string | null | undefined): string {
  return (s ?? "").trim().toUpperCase().replace(/\s+/g, " ");
}

export type DuplicateProbe = {
  code?: string;
  model?: string;
  barcode?: string;
  supplierPartNumber?: string;
  description?: string;
};

export function findDuplicates(probe: DuplicateProbe, existing: ItemCodeRecord[]): DuplicateHit[] {
  const hits: DuplicateHit[] = [];
  const seen = new Set<string>();
  const push = (item: ItemCodeRecord, reason: DuplicateReason, blocking: boolean) => {
    const key = item.id + reason;
    if (seen.has(key)) return;
    seen.add(key);
    hits.push({ item, reason, blocking });
  };

  const code = norm(probe.code);
  const model = norm(probe.model);
  const barcode = norm(probe.barcode);
  const part = norm(probe.supplierPartNumber);
  const desc = norm(probe.description);

  for (const it of existing) {
    if (code && norm(it.code) === code) push(it, "code", true);
    if (barcode && it.barcode && norm(it.barcode) === barcode) push(it, "barcode", false);
    if (part && it.supplierPartNumber && norm(it.supplierPartNumber) === part) push(it, "supplierPart", false);
    if (model && it.model && norm(it.model) === model) push(it, "model", false);
    if (desc && norm(it.description) === desc) push(it, "description", false);
  }
  return hits.sort((a, b) => Number(b.blocking) - Number(a.blocking));
}

export function matchesSearch(it: ItemCodeRecord, term: string): boolean {
  const q = norm(term);
  if (!q) return true;
  return (
    norm(it.code).includes(q) ||
    norm(it.description).includes(q) ||
    norm(it.model).includes(q) ||
    norm(it.barcode).includes(q) ||
    norm(it.supplierPartNumber).includes(q)
  );
}

// ============================================================================
//   8. Realtime subscription
// ============================================================================
export function subscribeItemCodes(callback: (items: ItemCodeRecord[]) => void): Unsubscribe {
  try {
    const q = query(collection(requireFirebaseDb(), "itemCodes"), orderBy("code", "asc"));
    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ItemCodeRecord, "id">) })));
      },
      (err) => {
        console.error("subscribeItemCodes error:", err);
        callback([]);
      },
    );
  } catch (err) {
    console.error("subscribeItemCodes setup error:", err);
    callback([]);
    return () => {};
  }
}
