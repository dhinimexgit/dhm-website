// Fire-and-forget helper: asks our API route to send a customer confirmation
// email via Resend and forward notification to Telegram. Never throws and never blocks the submit UX.

export function sendConfirmationEmail(params: {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  inquiry?: string;
  productName?: string;
}): void {
  const email = (params.email || "").trim();
  if (!email) return; // email is optional; nothing to send

  fetch("/api/send-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: params.name,
      email,
      phone: params.phone,
      message: params.message || params.inquiry,
      productName: params.productName,
    }),
  }).catch((err) => {
    console.error("Failed to send confirmation email and notification:", err);
  });
}