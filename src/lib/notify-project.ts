/**
 * Telegram notification for DHM Projects.
 *
 * Never throws and never blocks a save: the caller has already written to
 * Firestore by the time this runs, so a notification failure must not surface
 * as a failed save. It does *report* what happened, though — claiming
 * "sent to the group chat" when nothing was sent is worse than saying nothing.
 */
import type { DhmProject, ProjectChange } from "@/lib/dhm-projects";
import { TELEGRAM_NOT_CONFIGURED } from "@/lib/project-telegram-message";

export type ProjectNotifyEvent = "created" | "acknowledged" | "updated" | "closed";

export type NotifyResult =
  | { ok: true }
  /** `notConfigured` means the Telegram env vars are missing — see TELEGRAM_SETUP.md. */
  | { ok: false; notConfigured: boolean; reason: string };

export async function notifyProject(
  event: ProjectNotifyEvent,
  project: DhmProject,
  actorName: string,
  changes: ProjectChange[] = []
): Promise<NotifyResult> {
  const payload = {
    event,
    ticketNo: project.ticketNo,
    projectName: project.projectName,
    projectType: project.projectType,
    customerName: project.customerName,
    location: project.customerLocation,
    projectLead: project.projectLead,
    status: project.status,
    actorName,
    detail: event === "created" ? project.inquiryDetail : "",
    changes,
  };

  try {
    const res = await fetch("/api/project-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) return { ok: true };

    const body = (await res.json().catch(() => ({}))) as { error?: string };
    const reason = body.error || `HTTP ${res.status}`;
    return {
      ok: false,
      notConfigured: reason === TELEGRAM_NOT_CONFIGURED,
      reason,
    };
  } catch (err) {
    console.error("notifyProject: request failed", err);
    return { ok: false, notConfigured: false, reason: "network error" };
  }
}

/** Human-readable tail for a status banner, or null when it all worked. */
export function describeNotifyFailure(result: NotifyResult): string | null {
  if (result.ok) return null;
  if (result.notConfigured) {
    return "the Telegram group chat is not configured yet, so no message was sent (see TELEGRAM_SETUP.md)";
  }
  return `the Telegram message could not be sent (${result.reason})`;
}
