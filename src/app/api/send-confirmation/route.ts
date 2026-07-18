import { NextResponse } from "next/server";

// Sends a branded "thank you" confirmation email to a customer who left an email
// address on the Contact Us form or a Product Inquiry. Uses Resend's HTTP API so
// there is no SMTP config and it works fine on Netlify's serverless runtime.
//
// Required env vars:
//   RESEND_API_KEY      - from https://resend.com/api-keys
//   CONTACT_FROM_EMAIL  - verified sender, e.g. "Dhinimex <noreply@dhinimex.com>"

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BRAND_NAVY = "#2e388c";
const BRAND_RED = "#e8262a";
// Absolute URL required for email clients. The navy is baked into this PNG, so
// dark-mode clients can't recolor the emblem.
const LOGO_URL = "https://dhinimex.com/brands/ALL-LOGO-25.png";

type Payload = {
  name?: string;
  email?: string;
  productName?: string;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const email = (body.email || "").trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || "Dhinimex <noreply@dhinimex.com>";
  if (!apiKey) {
    console.error("send-confirmation: RESEND_API_KEY is not set");
    return NextResponse.json({ ok: false, error: "email not configured" }, { status: 500 });
  }

  const name = (body.name || "").toString().trim().slice(0, 80) || "there";
  const productName = (body.productName || "").toString().trim().slice(0, 160);

  const subject = productName
    ? `Thank you for your inquiry about ${productName}`
    : "Thank you for contacting Dhinimex";

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject,
        html: buildHtml(name, productName),
        text: buildText(name, productName),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("send-confirmation: Resend error", res.status, detail);
      return NextResponse.json({ ok: false, error: "send failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send-confirmation: unexpected error", error);
    return NextResponse.json({ ok: false, error: "unexpected" }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(name: string, productName: string): string {
  const safeName = escapeHtml(name);
  const intro = productName
    ? `Thank you for your interest in <strong>${escapeHtml(productName)}</strong>. We've received your inquiry and a member of our team will get back to you shortly.`
    : `Thank you for reaching out to Dhinimex. We've received your message and a member of our team will get back to you shortly.`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Tell dark-mode clients the email themes itself, so they don't remap the brand navy. -->
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      /* Force the brand navy header to stay navy in dark mode (Outlook.com / supported clients). */
      [data-ogsc] .dhm-header, [data-ogsb] .dhm-header { background-color: ${BRAND_NAVY} !important; }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f5f6fb;font-family:Arial,Helvetica,sans-serif;color:#1e1f2c;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(46,56,140,0.08);">
            <tr>
              <td class="dhm-header" bgcolor="${BRAND_NAVY}" style="background-color:${BRAND_NAVY};padding:24px 32px;text-align:center;">
                <img src="${LOGO_URL}" width="64" height="64" alt="Dhinimex" style="display:block;margin:0 auto 12px auto;width:64px;height:64px;border:0;outline:none;text-decoration:none;" />
                <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">DHINIMEX CO., LTD.</span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 8px 32px;">
                <h1 style="margin:0 0 16px 0;font-size:22px;color:${BRAND_NAVY};">Thank you, ${safeName}!</h1>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#3a3b48;">${intro}</p>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#3a3b48;">
                  We typically respond within one business day. If your request is urgent, feel free to call us directly.
                </p>
                <div style="border-left:4px solid ${BRAND_RED};padding:8px 0 8px 16px;margin:0 0 28px 0;">
                  <p style="margin:0;font-size:14px;color:#6b6c7a;">This is an automated confirmation — no need to reply.</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 36px 32px;">
                <p style="margin:0;font-size:14px;line-height:1.6;color:#3a3b48;">
                  Warm regards,<br />
                  <strong style="color:${BRAND_NAVY};">The Dhinimex Team</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f5f6fb;padding:20px 32px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#9a9bab;">
                  Dhinimex Co., Ltd. &bull; #245, St. Tep Phan (182), Tuk Laak 2, Khan Toul Kork, Phnom Penh<br />
                  <a href="https://www.dhinimex.com" style="color:${BRAND_NAVY};text-decoration:none;">www.dhinimex.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildText(name: string, productName: string): string {
  const intro = productName
    ? `Thank you for your interest in ${productName}. We've received your inquiry and a member of our team will get back to you shortly.`
    : `Thank you for reaching out to Dhinimex. We've received your message and a member of our team will get back to you shortly.`;

  return [
    `Thank you, ${name}!`,
    "",
    intro,
    "",
    "We typically respond within one business day. If your request is urgent, feel free to call us directly.",
    "",
    "This is an automated confirmation — no need to reply.",
    "",
    "Warm regards,",
    "The Dhinimex Team",
    "",
    "Dhinimex Co., Ltd. — #245, St. Tep Phan (182), Tuk Laak 2, Khan Toul Kork, Phnom Penh",
    "www.dhinimex.com",
  ].join("\n");
}
