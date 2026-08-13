/**
 * Builds the Telegram message body for a DHM Projects event.
 *
 * Kept pure and free of next/server imports so it can be unit-tested without
 * a bot token or a running server; the route handler only does auth, env and
 * the HTTP call.
 */

/** Bot API caps a message at 4096 chars; leave headroom for the closing tags. */
export const TELEGRAM_MAX_LEN = 3500;

/**
 * Error string the notify route returns when the Telegram env vars are absent.
 * Shared so the client can distinguish "not set up yet" from a real delivery
 * failure without duplicating a magic string on both sides.
 */
export const TELEGRAM_NOT_CONFIGURED = "telegram not configured";

export const PROJECT_NOTIFY_EVENTS = ["created", "acknowledged", "updated", "closed"] as const;
export type ProjectNotifyEventName = (typeof PROJECT_NOTIFY_EVENTS)[number];

const HEADINGS: Record<ProjectNotifyEventName, string> = {
  created: "🆕 New project ticket",
  acknowledged: "📥 Received by Technical",
  updated: "🔄 Project updated",
  closed: "✅ Project closed",
};

export type TelegramChange = { label?: unknown; from?: unknown; to?: unknown };

export type TelegramPayload = {
  event?: unknown;
  ticketNo?: unknown;
  projectName?: unknown;
  projectType?: unknown;
  customerName?: unknown;
  location?: unknown;
  projectLead?: unknown;
  status?: unknown;
  actorName?: unknown;
  actorHandle?: unknown;
  detail?: unknown;
  changes?: unknown;
};

export function isProjectNotifyEvent(v: unknown): v is ProjectNotifyEventName {
  return typeof v === "string" && (PROJECT_NOTIFY_EVENTS as readonly string[]).includes(v);
}

/** Telegram HTML mode allows only a small tag set — escape everything else. */
export function escapeTelegramHtml(v: unknown, max = 200): string {
  return String(v ?? "")
    .trim()
    .slice(0, max)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** "Victor Khov (@victorkhov)" when the account is linked, else just the name. */
function withHandle(name: unknown, handle: unknown): string {
  const n = String(name ?? "").trim();
  const h = String(handle ?? "").trim().replace(/^@/, "");
  if (!n) return h ? `@${h}` : "";
  return h ? `${n} (@${h})` : n;
}

export function buildProjectMessage(body: TelegramPayload): string {
  const event = isProjectNotifyEvent(body.event) ? body.event : "updated";
  const lines: string[] = [];
  const esc = escapeTelegramHtml;

  lines.push(`<b>${HEADINGS[event]}</b>`);
  const ticket = esc(body.ticketNo, 40);
  if (ticket) lines.push(`<code>${ticket}</code>`);
  lines.push("");

  const row = (label: string, value: unknown, max = 200) => {
    const v = esc(value, max);
    if (v) lines.push(`<b>${label}:</b> ${v}`);
  };

  row("Project", body.projectName, 160);
  row("Type", body.projectType, 80);
  row("Customer", body.customerName, 120);
  row("Location", body.location, 80);
  row("Lead", body.projectLead, 80);
  row("Status", body.status, 40);

  if (event === "created") {
    row("Raised by", withHandle(body.actorName, body.actorHandle), 120);
    const detail = esc(body.detail, 700);
    if (detail) lines.push("", "<b>Customer inquiry:</b>", detail);
  } else {
    row("By", withHandle(body.actorName, body.actorHandle), 120);
  }

  if (Array.isArray(body.changes) && body.changes.length > 0) {
    const changes = body.changes as TelegramChange[];
    lines.push("", "<b>Changes:</b>");
    for (const raw of changes.slice(0, 12)) {
      const label = esc(raw?.label, 60);
      if (!label) continue;
      lines.push(`• ${label}: ${esc(raw?.from, 60)} → <b>${esc(raw?.to, 60)}</b>`);
    }
    if (changes.length > 12) lines.push(`• …and ${changes.length - 12} more`);
  }

  return lines.join("\n").slice(0, TELEGRAM_MAX_LEN);
}
