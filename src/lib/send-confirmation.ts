// Fire-and-forget helper: asks our API route to send a customer confirmation
// email via Resend. Never throws and never blocks the submit UX — if the email
// fails, the inquiry was still saved to Firestore, so we just log and move on.

export function sendConfirmationEmail(params: {
  name?: string;
  email?: string;
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
      productName: params.productName,
    }),
  }).catch((err) => {
    console.error("Failed to send confirmation email:", err);
  });
}
