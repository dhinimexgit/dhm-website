'use server';

/**
 * Linking a portal account to a real Telegram account.
 *
 * Flow: the portal mints a short one-time code and stores it on the user's
 * admin_users doc. The user opens `t.me/<bot>?start=<code>`, Telegram sends
 * `/start <code>` to our webhook, and the webhook swaps the code for the
 * sender's chat id. That round trip is what makes the link *verified* — the
 * user cannot type someone else's handle, because the proof is that Telegram
 * itself delivered the message from that account.
 *
 * Codes are single-use and short-lived; an unused one simply expires.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { requireFirebaseDb } from '@/lib/firebase';
import { getCurrentUser } from '@/app/actions/auth';

const ADMIN_USERS_COLLECTION = 'admin_users';

export const TELEGRAM_LINK_CODE_TTL_MS = 15 * 60 * 1000;

/** Unambiguous alphabet — no O/0, I/1 — because people retype these by hand. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;

export type TelegramLinkState = {
  connected: boolean;
  telegramUsername?: string;
  telegramFirstName?: string;
  linkedAt?: string;
  /** Present only while a link attempt is pending. */
  pendingCode?: string;
  pendingExpiresAt?: string;
  /** From TELEGRAM_BOT_USERNAME; without it the deep link cannot be built. */
  botUsername?: string;
  botConfigured: boolean;
};

function generateCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
}

function readState(data: Record<string, unknown> | undefined): Omit<TelegramLinkState, 'botUsername' | 'botConfigured'> {
  const chatId = data?.telegramChatId;
  const pendingExpires = typeof data?.telegramLinkCodeExpiresAt === 'string'
    ? data.telegramLinkCodeExpiresAt
    : undefined;
  const stillPending = pendingExpires ? Date.parse(pendingExpires) > Date.now() : false;

  return {
    connected: typeof chatId === 'number' || (typeof chatId === 'string' && chatId.length > 0),
    telegramUsername: typeof data?.telegramUsername === 'string' ? data.telegramUsername : undefined,
    telegramFirstName:
      typeof data?.telegramFirstName === 'string' ? data.telegramFirstName : undefined,
    linkedAt: typeof data?.telegramLinkedAt === 'string' ? data.telegramLinkedAt : undefined,
    pendingCode:
      stillPending && typeof data?.telegramLinkCode === 'string' ? data.telegramLinkCode : undefined,
    pendingExpiresAt: stillPending ? pendingExpires : undefined,
  };
}

export async function getTelegramLinkState(): Promise<TelegramLinkState> {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME?.replace(/^@/, '') || undefined;
  const botConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

  const user = await getCurrentUser();
  if (!user) return { connected: false, botUsername, botConfigured };

  try {
    const snap = await getDoc(doc(requireFirebaseDb(), ADMIN_USERS_COLLECTION, user.username));
    return {
      ...readState(snap.exists() ? (snap.data() as Record<string, unknown>) : undefined),
      botUsername,
      botConfigured,
    };
  } catch (error) {
    console.error('getTelegramLinkState failed', error);
    return { connected: false, botUsername, botConfigured };
  }
}

/** Mint (or re-mint) a one-time code for the signed-in user. */
export async function startTelegramLink(): Promise<
  { success: true; code: string; expiresAt: string; botUsername?: string } | { success: false; error: string }
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not signed in.' };

  const botUsername = process.env.TELEGRAM_BOT_USERNAME?.replace(/^@/, '') || undefined;
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return { success: false, error: 'Telegram is not configured on the server yet.' };
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + TELEGRAM_LINK_CODE_TTL_MS).toISOString();

  try {
    await setDoc(
      doc(requireFirebaseDb(), ADMIN_USERS_COLLECTION, user.username),
      { telegramLinkCode: code, telegramLinkCodeExpiresAt: expiresAt },
      { merge: true }
    );
    return { success: true, code, expiresAt, botUsername };
  } catch (error) {
    console.error('startTelegramLink failed', error);
    return { success: false, error: 'Could not start the link. Please try again.' };
  }
}

export async function disconnectTelegram(): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not signed in.' };

  try {
    await setDoc(
      doc(requireFirebaseDb(), ADMIN_USERS_COLLECTION, user.username),
      {
        telegramChatId: null,
        telegramUsername: null,
        telegramFirstName: null,
        telegramLinkedAt: null,
        telegramLinkCode: null,
        telegramLinkCodeExpiresAt: null,
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.error('disconnectTelegram failed', error);
    return { success: false, error: 'Could not disconnect. Please try again.' };
  }
}
