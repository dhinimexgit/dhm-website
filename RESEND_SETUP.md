# Resend Setup — Customer Confirmation Emails

This site sends an automatic "thank you" email to customers who leave an email
address on the **Contact Us** form or a **Product Inquiry**. Emails are sent
through [Resend](https://resend.com) from the API route
`src/app/api/send-confirmation/route.ts`.

Follow these steps once. After that, emails just work.

---

## 1. Create a Resend account

1. Go to <https://resend.com> and click **Sign Up** (free tier = 3,000 emails/month, 100/day).
2. Verify your login email and sign in to the dashboard.

## 2. Verify the dhinimex.com domain (so emails come from @dhinimex.com)

1. In the Resend dashboard, open **Domains** → **Add Domain**.
2. Enter `dhinimex.com` and click **Add**.
3. Resend shows a list of **DNS records** (a few `TXT` records for SPF/DKIM and
   sometimes a `MX` record for the return-path).
4. Add those records in whoever manages dhinimex.com's DNS (your domain
   registrar / hosting DNS panel). Copy each record's **Type**, **Name/Host**,
   and **Value** exactly.
5. Back in Resend, click **Verify**. It can take a few minutes to a few hours for
   DNS to propagate. Once every record shows a green check, the domain is verified.

> **Want to test before DNS is ready?** Skip domain verification for now and use
> Resend's sandbox sender. In `.env` set:
> `CONTACT_FROM_EMAIL=Dhinimex <onboarding@resend.dev>`
> Resend's sandbox can only deliver to **your own** Resend account email, which is
> fine for a quick test. Switch to `noreply@dhinimex.com` after the domain verifies.

## 3. Create an API key

1. In Resend, open **API Keys** → **Create API Key**.
2. Name it e.g. `dhinimex-web`, permission **Sending access**, and create it.
3. Copy the key (starts with `re_...`). **You only see it once.**

## 4. Put the key in your environment

### Local development (`.env`)

Open `.env` in the project root and fill in the two values (already stubbed there):

```
RESEND_API_KEY=re_your_key_here
CONTACT_FROM_EMAIL=Dhinimex <noreply@dhinimex.com>
```

(Use `Dhinimex <onboarding@resend.dev>` for `CONTACT_FROM_EMAIL` while testing in
sandbox — see the note in step 2.)

Restart the dev server after editing `.env`:

```
npm run dev
```

### Production (Netlify)

The `.env` file is **not** deployed. Add the same two variables in Netlify:

1. Netlify dashboard → your site → **Site configuration** → **Environment variables**.
2. **Add a variable** for each:
   - `RESEND_API_KEY` = `re_your_key_here`
   - `CONTACT_FROM_EMAIL` = `Dhinimex <noreply@dhinimex.com>`
3. **Trigger a redeploy** (Deploys → Trigger deploy) so the new variables take effect.

> Keep `RESEND_API_KEY` secret. It has **no** `NEXT_PUBLIC_` prefix on purpose —
> it stays server-side in the API route and is never sent to the browser.

## 5. Test it

1. Go to the **Contact Us** page, fill the form with a real email you can check,
   and submit.
2. You should receive the branded "Thank you for contacting Dhinimex" email within
   a minute (check spam on the first send).
3. Try a **Product Inquiry** (any product → Contact/Inquiry button), enter an email
   in the new **Email (optional)** field, and submit — you should get a
   "Thank you for your inquiry about <product>" email.

If nothing arrives:

- Check **Resend dashboard → Emails/Logs** — every attempt (delivered, bounced,
  failed) shows there with a reason.
- Check the server logs for `send-confirmation:` messages (locally in the terminal,
  on Netlify under **Deploys → Functions/Logs**). A missing key logs
  `RESEND_API_KEY is not set`.

---

## How it fits together

- **Optional email** — the Product Inquiry modal now has an optional email field.
  Contact Us already required email. If the field is empty, no email is sent; the
  inquiry is still saved.
- **Confirmation email** — after an inquiry is saved to Firestore, the browser
  calls `POST /api/send-confirmation`, which sends the email via Resend server-side.
  It's fire-and-forget: if the email fails, the inquiry is still saved.
- **Spam filter** — `src/lib/spam-filter.ts` runs before saving. A hidden honeypot
  field plus content heuristics (gibberish names/messages, dotted-Gmail-alias
  emails, links) silently drop bot submissions, so junk never hits Firestore and
  no confirmation emails go to fake addresses.
