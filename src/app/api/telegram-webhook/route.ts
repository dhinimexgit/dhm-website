import { NextResponse } from "next/server";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Receives updates from Telegram and completes account linking.
//
// Only one command matters: `/start <code>`, which the t.me deep link sends
// when a user taps "Connect Telegram" in the portal. We look the code up
// against admin_users and, if it is valid and unexpired, record the sender's
// chat id. That the message arrived from that account IS the verification.
//
// Required env vars (see TELEGRAM_SETUP.md):
//   TELEGRAM_BOT_TOKEN     - to reply to the user
//   TELEGRAM_WEBHOOK_SECRET - shared secret Telegram echoes back in a header
//
// Register once with:
//   https://api.telegram.org/bot<TOKEN>/setWebhook
//     ?url=https://dhinimex.com/api/telegram-webhook
//     &secret_token=<TELEGRAM_WEBHOOK_SECRET>

const ADMIN_USERS_COLLECTION = "admin_users";
const TELEGRAM_API = "https://api.telegram.org";
const LINK_CODE_RE = /^\/start\s+([A-Z0-9]{6,16})$/i;

type TelegramUpdate = {
  message?: {
    text?: unknown;
    chat?: { id?: unknown };
    from?: { username?: unknown; first_name?: unknown };
  };
};

async function reply(chatId: number | string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    console.error("telegram-webhook: reply failed", err);
  }
}

export async function POST(request: Request) {
  // Telegram echoes the secret we registered. Without this the endpoint is
  // world-writable and anyone could claim another user's link code.
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expectedSecret) {
    console.error("telegram-webhook: TELEGRAM_WEBHOOK_SECRET is not set");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("x-telegram-bot-api-secret-token") !== expectedSecret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = update.message?.chat?.id;
  const text = typeof update.message?.text === "string" ? update.message.text.trim() : "";
  if (typeof chatId !== "number" && typeof chatId !== "string") {
    return NextResponse.json({ ok: true });
  }

  const match = LINK_CODE_RE.exec(text);
  if (!match) {
    // Always 200: a non-200 makes Telegram retry the same update forever.
    if (text.startsWith("/start")) {
      await reply(
        chatId,
        "Open DHM Projects in the portal and press Connect Telegram — that link carries the code needed to pair your account."
      );
    }
    return NextResponse.json({ ok: true });
  }

  const code = match[1].toUpperCase();

  try {
    const snap = await getDocs(
      query(collection(db, ADMIN_USERS_COLLECTION), where("telegramLinkCode", "==", code))
    );

    if (snap.empty) {
      await reply(chatId, "That code is not recognised. Please generate a new one in the portal.");
      return NextResponse.json({ ok: true });
    }

    const userDoc = snap.docs[0];
    const data = userDoc.data() as Record<string, unknown>;
    const expiresAt =
      typeof data.telegramLinkCodeExpiresAt === "string" ? data.telegramLinkCodeExpiresAt : null;

    if (!expiresAt || Date.parse(expiresAt) < Date.now()) {
      await reply(chatId, "That code has expired. Please generate a new one in the portal.");
      return NextResponse.json({ ok: true });
    }

    const username =
      typeof update.message?.from?.username === "string" ? update.message.from.username : "";
    const firstName =
      typeof update.message?.from?.first_name === "string" ? update.message.from.first_name : "";

    await setDoc(
      doc(db, ADMIN_USERS_COLLECTION, userDoc.id),
      {
        telegramChatId: chatId,
        telegramUsername: username,
        telegramFirstName: firstName,
        telegramLinkedAt: new Date().toISOString(),
        // Burn the code so it cannot be replayed.
        telegramLinkCode: null,
        telegramLinkCodeExpiresAt: null,
      },
      { merge: true }
    );

    await reply(
      chatId,
      `Connected. Your Telegram is now linked to the DHM portal account "${userDoc.id}".`
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("telegram-webhook: link failed", error);
    await reply(chatId, "Something went wrong linking your account. Please try again.");
    return NextResponse.json({ ok: true });
  }
}
