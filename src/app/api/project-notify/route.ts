import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hasValidAdminSession } from "@/lib/admin-session";
import {
  TELEGRAM_NOT_CONFIGURED,
  buildProjectMessage,
  isProjectNotifyEvent,
  type TelegramPayload,
} from "@/lib/project-telegram-message";

// Posts DHM Projects ticket activity to one designated Telegram group chat.
// Automatically routes group alerts using the logged-in admin's handle.
const TELEGRAM_API = "https://api.telegram.org";

export async function POST(request: Request) {
  // Guard endpoint: Only signed-in portal users may trigger it
  const jar = await cookies();
  const signedIn = hasValidAdminSession(
    jar.get("dhm_admin_session")?.value,
    jar.get("dhm_admin_user")?.value,
    jar.get("dhm_admin_last_activity")?.value
  );
  if (!signedIn) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: TelegramPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  // Validate before touching any secret
  if (!isProjectNotifyEvent(body.event)) {
    return NextResponse.json({ ok: false, error: "invalid event" }, { status: 400 });
  }
  if (!String(body.ticketNo ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "missing ticketNo" }, { status: 400 });
  }

  // Use the signed-in admin username directly so users don't need individual Telegram setup
  const adminUser = jar.get("dhm_admin_user")?.value;
  const actorHandle = adminUser ? `@${adminUser}` : "@admin";

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("project-notify: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
    return NextResponse.json({ ok: false, error: TELEGRAM_NOT_CONFIGURED }, { status: 500 });
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildProjectMessage({ ...body, actorHandle }),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("project-notify: telegram responded", res.status, detail.slice(0, 300));
      return NextResponse.json({ ok: false, error: "telegram rejected" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("project-notify: telegram request failed", error);
    return NextResponse.json({ ok: false, error: "telegram unreachable" }, { status: 502 });
  }
}