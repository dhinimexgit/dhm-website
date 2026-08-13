"use client";

import { useCallback, useEffect, useState } from "react";
import {
  disconnectTelegram,
  getTelegramLinkState,
  startTelegramLink,
  type TelegramLinkState,
} from "@/app/actions/telegram-link";

/**
 * Connect-your-Telegram panel.
 *
 * Shows a t.me deep link carrying a one-time code. Once the user taps it and
 * Telegram delivers `/start <code>` to our webhook, the link completes
 * server-side — so this polls while a code is outstanding rather than asking
 * the user to refresh.
 */

const POLL_MS = 3000;

export function TelegramConnect({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<TelegramLinkState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setState(await getTelegramLinkState());
    } catch (err) {
      console.error("getTelegramLinkState failed", err);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Poll only while a code is outstanding — the webhook completes the link
  // out of band, so there is nothing else to tell this component it happened.
  useEffect(() => {
    if (!state?.pendingCode || state.connected) return;
    const t = setInterval(refresh, POLL_MS);
    return () => clearInterval(t);
  }, [state?.pendingCode, state?.connected, refresh]);

  async function connect() {
    setBusy(true);
    setError(null);
    try {
      const res = await startTelegramLink();
      if (!res.success) setError(res.error);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!confirm("Disconnect your Telegram account from the portal?")) return;
    setBusy(true);
    try {
      const res = await disconnectTelegram();
      if (!res.success && res.error) setError(res.error);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!state) return null;

  if (state.connected) {
    const handle = state.telegramUsername ? `@${state.telegramUsername}` : state.telegramFirstName;
    if (compact) {
      return (
        <p className="text-sm text-emerald-700">
          Telegram connected{handle ? ` as ${handle}` : ""}.
        </p>
      );
    }
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-sm text-emerald-900">
          <span className="font-semibold">Telegram connected</span>
          {handle ? ` as ${handle}` : ""}. Tickets you raise will mention you in the group chat.
        </p>
        <button
          type="button"
          onClick={disconnect}
          disabled={busy}
          className="rounded-lg border border-emerald-300 bg-white px-3.5 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-40"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const deepLink =
    state.botUsername && state.pendingCode
      ? `https://t.me/${state.botUsername}?start=${state.pendingCode}`
      : null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-amber-900">
          <span className="font-semibold">Telegram not connected.</span>{" "}
          {state.botConfigured
            ? "Connect your account so the group chat knows who raised a ticket."
            : "The server has no Telegram bot configured yet (see TELEGRAM_SETUP.md)."}
        </p>
        {state.botConfigured && (
          <button
            type="button"
            onClick={connect}
            disabled={busy}
            className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-40"
          >
            {state.pendingCode ? "New code" : "Connect Telegram"}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm font-medium text-rose-700">{error}</p>}

      {state.pendingCode && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-white p-4">
          {deepLink ? (
            <>
              <a
                href={deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#229ED9] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Open Telegram and confirm
              </a>
              <p className="mt-2 text-sm text-slate-600">
                Or message the bot manually with:{" "}
                <code className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-800">
                  /start {state.pendingCode}
                </code>
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-700">
              Send this to the bot on Telegram:{" "}
              <code className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-800">
                /start {state.pendingCode}
              </code>
              <span className="mt-1 block text-slate-500">
                (TELEGRAM_BOT_USERNAME is not set, so the one-tap link is unavailable.)
              </span>
            </p>
          )}
          <p className="mt-2 text-sm text-slate-500">
            Waiting for confirmation… this code expires in 15 minutes.
          </p>
        </div>
      )}
    </div>
  );
}
