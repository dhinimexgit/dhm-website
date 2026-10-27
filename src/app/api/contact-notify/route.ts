import { NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactInquiry = {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
};

function isContactInquiry(value: unknown): value is ContactInquiry {
  if (typeof value !== "object" || value === null) return false;
  const body = value as Record<string, unknown>;
  return (
    typeof body.fullName === "string" &&
    typeof body.email === "string" &&
    typeof body.phone === "string" &&
    typeof body.inquiryType === "string" &&
    typeof body.message === "string"
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  if (!isContactInquiry(body)) {
    return NextResponse.json({ ok: false, error: "invalid inquiry" }, { status: 400 });
  }

  const inquiry: ContactInquiry = {
    fullName: body.fullName.trim(),
    email: body.email.trim(),
    phone: body.phone.trim(),
    inquiryType: body.inquiryType.trim(),
    message: body.message.trim(),
  };

  if (
    !inquiry.fullName ||
    inquiry.fullName.length > 120 ||
    !EMAIL_RE.test(inquiry.email) ||
    inquiry.email.length > 254 ||
    inquiry.phone.length > 60 ||
    inquiry.inquiryType.length > 100 ||
    !inquiry.message ||
    inquiry.message.length > 2000
  ) {
    return NextResponse.json({ ok: false, error: "invalid inquiry" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_NAET_CHAT_ID || "777479607"; //[cite: 4]

  if (!token || !chatId) {
    console.error("contact-notify: TELEGRAM_BOT_TOKEN or TELEGRAM_NAET_CHAT_ID is not set");
    return NextResponse.json({ ok: false, error: "telegram not configured" }, { status: 500 });
  }

  // 🎯 ទម្រង់សារបែបថ្មីដែលមាន Emoji ស្អាតដូចក្នុងរូបភាព
  const text = [
    "📥 <b>New Customer Inquiry</b>",
    "-----------------------------------",
    `👤 <b>Name:</b> ${escapeHtml(inquiry.fullName)}`,
    `✉️ <b>Email:</b> ${escapeHtml(inquiry.email)}`,
    `📞 <b>Phone:</b> ${escapeHtml(inquiry.phone || "—")}`,
    `💬 <b>Message/Help:</b> ${escapeHtml(inquiry.message)}`,
  ].join("\n");

  try {
    const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("contact-notify: telegram responded", response.status, detail.slice(0, 300));
      return NextResponse.json({ ok: false, error: "telegram rejected" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact-notify: telegram request failed", error);
    return NextResponse.json({ ok: false, error: "telegram unreachable" }, { status: 502 });
  }
}