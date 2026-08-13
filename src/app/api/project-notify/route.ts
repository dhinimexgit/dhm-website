import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hasValidAdminSession } from "@/lib/admin-session";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  TELEGRAM_NOT_CONFIGURED,
  buildProjectMessage,
  isProjectNotifyEvent,
  type TelegramPayload,
} from "@/lib/project-telegram-message";

// Posts DHM Projects ticket activity to one designated Telegram group chat.
// Uses the Bot HTTP API directly (no SDK) so it works on Netlify's serverless
// runtime, same approach as the Resend integration in send-confirmation.
//
// Required env vars (see TELEGRAM_SETUP.md):
//   TELEGRAM_BOT_TOKEN  - from @BotFather, looks like 123456789:AA...
//   TELEGRAM_CHAT_ID    - the group chat id, usually negative e.g. -1001234567890
//
// Notifications are best-effort: a Telegram outage must never block or roll
// back the Firestore write that already succeeded on the client.

const TELEGRAM_API = "https://api.telegram.org";
const ADMIN_USERS_COLLECTION = "admin_users";

/**
 * The Telegram handle we verified for this portal account, if any.
 *
 * Read server-side from the session cookie's user, so a caller cannot claim
 * someone else's handle by putting it in the request body.
 */
async function lookupVerifiedHandle(username: string | undefined): Promise<string> {
  if (!username) return "";
  try {
    const snap = await getDoc(doc(db, ADMIN_USERS_COLLECTION, username));
    if (!snap.exists()) return "";
    const data = snap.data() as Record<string, unknown>;
    // Only trust the handle when a chat id proves the link completed.
    if (!data.telegramChatId) return "";
    return typeof data.telegramUsername === "string" ? data.telegramUsername : "";
  } catch (err) {
    console.error("project-notify: handle lookup failed", err);
    return "";
  }
}

export async function POST(request: Request) {
  // This endpoint writes into a private staff group chat, so it must not be
  // callable anonymously — otherwise anyone who found the URL could post
  // arbitrary text there. Only signed-in portal users may trigger it.
  // (middleware.ts only guards /dhm-myadmin/*, not /api/*.)
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

  // Validate before touching any secret.
  if (!isProjectNotifyEvent(body.event)) {
    return NextResponse.json({ ok: false, error: "invalid event" }, { status: 400 });
  }
  if (!String(body.ticketNo ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "missing ticketNo" }, { status: 400 });
  }

  // The handle is read from the signed-in user's own record, never taken from
  // the request body — otherwise anyone could post a message attributed to a
  // colleague's Telegram account.
  const actorHandle = await lookupVerifiedHandle(jar.get("dhm_admin_user")?.value);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // Deliberately soft: the ticket itself is already saved. Log loudly so the
    // missing configuration is obvious in the Netlify function logs.
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
      // Telegram puts the real reason in the body; surface it to the logs but
      // never to the browser (the request URL contains the bot token).
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
