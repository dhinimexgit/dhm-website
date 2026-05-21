import type { Timestamp } from "firebase/firestore";

export type PoItemRemarkEntry = {
  text: string;
  createdBy: string;
  createdByUsername?: string;
  createdAt?: Timestamp | null;
};

function parseRemarkEntry(raw: unknown): PoItemRemarkEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const text = String(row.text ?? "").trim();
  if (!text) return null;
  return {
    text,
    createdBy: String(row.createdBy ?? "Unknown").trim() || "Unknown",
    createdByUsername: row.createdByUsername ? String(row.createdByUsername) : undefined,
    createdAt: (row.createdAt as Timestamp | undefined) ?? null,
  };
}

export function parseItemRemarkHistoryFromPoData(data: Record<string, unknown>): Record<string, PoItemRemarkEntry[]> {
  const history: Record<string, PoItemRemarkEntry[]> = {};

  if (data.itemRemarkHistory && typeof data.itemRemarkHistory === "object") {
    for (const [lineKey, value] of Object.entries(data.itemRemarkHistory as Record<string, unknown>)) {
      if (!Array.isArray(value)) continue;
      const parsed = value.map(parseRemarkEntry).filter((e): e is PoItemRemarkEntry => e !== null);
      if (parsed.length) history[lineKey] = sortRemarkEntries(parsed);
    }
  }

  const legacyRemarks =
    data.itemRemarks && typeof data.itemRemarks === "object"
      ? (data.itemRemarks as Record<string, string>)
      : {};
  const legacyTimestamps =
    data.itemRemarkTimestamps && typeof data.itemRemarkTimestamps === "object"
      ? (data.itemRemarkTimestamps as Record<string, Timestamp>)
      : {};

  for (const [lineKey, text] of Object.entries(legacyRemarks)) {
    const trimmed = String(text ?? "").trim();
    if (!trimmed || (history[lineKey]?.length ?? 0) > 0) continue;
    history[lineKey] = [
      {
        text: trimmed,
        createdBy: "Unknown",
        createdAt: legacyTimestamps[lineKey] ?? null,
      },
    ];
  }

  return history;
}

export function sortRemarkEntries(entries: PoItemRemarkEntry[]): PoItemRemarkEntry[] {
  return [...entries].sort((a, b) => {
    const aMs = a.createdAt?.toMillis?.() ?? 0;
    const bMs = b.createdAt?.toMillis?.() ?? 0;
    return aMs - bMs;
  });
}

export function getItemRemarkEntries(
  history: Record<string, PoItemRemarkEntry[]> | undefined,
  lineNo: number,
): PoItemRemarkEntry[] {
  return history?.[String(lineNo)] ?? [];
}

export function formatRemarkTimestamp(entry: PoItemRemarkEntry): string {
  if (!entry.createdAt?.toDate) return "—";
  return entry.createdAt.toDate().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function remarkPreviewText(entries: PoItemRemarkEntry[]): string {
  if (!entries.length) return "";
  const latest = entries[entries.length - 1];
  return latest.text.length > 48 ? `${latest.text.slice(0, 48)}…` : latest.text;
}
