# Telegram notifications for DHM Projects

DHM Projects posts ticket activity to **one designated Telegram group chat**.
Until the two environment variables below are set, the portal works normally —
tickets save fine — but each notification logs
`project-notify: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set` and nothing
is posted. Nothing breaks; the message is simply dropped.

> Treat the bot token like a password. Do not paste it into chat, a ticket, or a
> commit. `.env` is already git-ignored (`.gitignore` → `.env*`).

## 1. Create the bot

1. In Telegram, open a chat with **@BotFather**.
2. Send `/newbot` and follow the prompts (name, then a username ending in `bot`).
3. BotFather replies with a token like `123456789:AAH...`. Keep it private.

## 2. Add the bot to the group

1. Open the group chat that should receive notifications.
2. **Add member** → search your new bot → add it.
3. Send any message in the group (e.g. `hello`) so there is something to read.

If the group has **Privacy Mode** on, the bot cannot read messages — that is
fine here, it only needs to *send*. But it must be a member of the group.

## 3. Find the chat id

With the bot in the group, open this URL in a browser, replacing `<TOKEN>`:

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

Look for `"chat":{"id":-1001234567890,...}`. That negative number is your
`TELEGRAM_CHAT_ID`. Group ids are negative; supergroup ids start with `-100`.

If `getUpdates` returns an empty `result`, send another message in the group and
reload. (If the bot is also used with a webhook, `getUpdates` stays empty —
remove the webhook first with `/deleteWebhook`.)

## 4. Set the variables

**Local development** — add to `.env` in the project root:

```
TELEGRAM_BOT_TOKEN=123456789:AAH...
TELEGRAM_CHAT_ID=-1001234567890
TELEGRAM_BOT_USERNAME=DhinimexProjectsBot
TELEGRAM_WEBHOOK_SECRET=<any long random string you invent>
```

`TELEGRAM_BOT_USERNAME` is the bot's `@handle` without the `@`; it builds the
one-tap "Connect Telegram" link. `TELEGRAM_WEBHOOK_SECRET` is a value you make
up — Telegram echoes it back on every webhook call so the endpoint can reject
anything that did not come from Telegram.

**Production (Netlify)** — Site configuration → Environment variables → Add a
variable, for both keys. Then **redeploy**: Netlify only injects environment
variables at build/function-init time, so an existing deploy will not pick them
up.

## 5. Register the webhook (needed for per-user linking)

Staff link their own Telegram account so the group post says who raised a
ticket. That requires Telegram to call back into the site, which happens once
per bot:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://dhinimex.com/api/telegram-webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

Check it took with `https://api.telegram.org/bot<TOKEN>/getWebhookInfo` — it
should report your URL and `pending_update_count: 0`.

> The webhook must point at a **public** URL. It cannot reach `localhost`, so
> account linking only works against the deployed site. Everything else (raising
> tickets, group notifications) works locally.

Staff then press **Connect Telegram** on the DHM Projects page, tap the link,
and the bot confirms. Their `@handle` is stored against their portal account
and appears as "Raised by Victor Khov (@victorkhov)" in group posts. The handle
is read server-side from their own record, so nobody can post under a
colleague's name.

## 6. Verify

Sign in to the portal, open **DHM Projects**, and raise a test ticket. The group
should receive a message within a second or two.

If nothing arrives, check the Netlify function log for `project-notify`:

| Log / response | Meaning |
| --- | --- |
| `TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set` | Variables missing, or the site was not redeployed after adding them. |
| `telegram responded 400 ... chat not found` | Wrong `TELEGRAM_CHAT_ID`, or the bot was removed from the group. |
| `telegram responded 401` | Token is wrong or was revoked by BotFather. |
| `telegram responded 403 ... bot was kicked` | Re-add the bot to the group. |
| `401 unauthorized` from the endpoint | Expected for anonymous calls — only signed-in portal users can trigger a notification. |

## What gets posted

| Event | Trigger |
| --- | --- |
| 🆕 New project ticket | Sales submit the intake form. Includes the customer inquiry text. |
| 📥 Received by Technical | Technical press **Mark as received** on an unacknowledged ticket. |
| 🔄 Project updated | Any lifecycle save — **one** message summarising every field changed in that save, not one per field. |
| ✅ Project closed | Status moves from Ongoing to Completed or Cancelled. |

Messages use Telegram's HTML parse mode; all customer-supplied text is escaped,
so a customer name containing `<` or `&` cannot break formatting or inject tags.
Long messages are truncated at 3500 characters and change lists at 12 entries
(with an "…and N more" line) to stay under the Bot API's 4096-character limit.
