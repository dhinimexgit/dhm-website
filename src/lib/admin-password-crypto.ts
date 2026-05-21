import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** Stored passwords prefixed with this use AES-256-GCM + app secret. */
const STORED_PREFIX = 'dhmenc:v1:';

const GCM_IV_LENGTH = 12;
const GCM_TAG_LENGTH = 16;

function deriveKey(): Buffer {
  return createHash('sha256').update('wearedhm', 'utf8').digest();
}

/** Encrypt before persisting (Firestore / env should use this for new values). */
export function encryptAdminPassword(plain: string): string {
  const key = deriveKey();
  const iv = randomBytes(GCM_IV_LENGTH);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const packed = Buffer.concat([iv, enc, tag]);
  return STORED_PREFIX + packed.toString('base64url');
}

function decryptAdminPassword(stored: string): string {
  if (!stored.startsWith(STORED_PREFIX)) {
    throw new Error('Not an encrypted admin password');
  }
  const raw = Buffer.from(stored.slice(STORED_PREFIX.length), 'base64url');
  if (raw.length < GCM_IV_LENGTH + GCM_TAG_LENGTH + 1) {
    throw new Error('Invalid ciphertext');
  }
  const iv = raw.subarray(0, GCM_IV_LENGTH);
  const tag = raw.subarray(raw.length - GCM_TAG_LENGTH);
  const enc = raw.subarray(GCM_IV_LENGTH, raw.length - GCM_TAG_LENGTH);
  const decipher = createDecipheriv('aes-256-gcm', deriveKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

function timingSafeEqualUtf8(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * True if `plainInput` matches `stored` (encrypted v1 or legacy plain text).
 */
export function verifyAdminPassword(stored: string, plainInput: string): boolean {
  if (stored.startsWith(STORED_PREFIX)) {
    try {
      return timingSafeEqualUtf8(decryptAdminPassword(stored), plainInput);
    } catch {
      return false;
    }
  }
  return timingSafeEqualUtf8(stored, plainInput);
}
