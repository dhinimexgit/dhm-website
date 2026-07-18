// Heuristic spam detection for the public contact / product-inquiry forms.
//
// The bots hitting these forms submit random keyboard-mash names and messages
// ("nhnctgCutGuJrXxoJi", "MLAGJuPjNoOvylXWsQWK") and dotted Gmail-alias emails
// ("k.uq.ab.az.u.v.14@gmail.com"). This module scores those signals.
//
// Design goals:
//  - Zero false positives on real submissions (English or Khmer). Non-Latin
//    script (e.g. Khmer names) is never flagged.
//  - A hidden honeypot field is the strongest signal: real users can't fill it.
//  - Everything else only contributes to a score; we require >= 2 signals so no
//    single quirky-but-real message gets blocked.

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function isLatinAlpha(s: string): boolean {
  return /^[A-Za-z]+$/.test(s);
}

// Random camel-mash flips case constantly ("nhnctgCutGuJrXxoJi"); real names and
// words almost never switch case mid-word.
function countCaseSwitches(s: string): number {
  let switches = 0;
  for (let i = 1; i < s.length; i++) {
    const prev = s[i - 1];
    const cur = s[i];
    if (!/[A-Za-z]/.test(prev) || !/[A-Za-z]/.test(cur)) continue;
    const prevUpper = prev === prev.toUpperCase();
    const curUpper = cur === cur.toUpperCase();
    if (prevUpper !== curUpper) switches++;
  }
  return switches;
}

function longestConsonantRun(s: string): number {
  let run = 0;
  let max = 0;
  for (const ch of s.toLowerCase()) {
    if (/[a-z]/.test(ch) && !VOWELS.has(ch)) {
      run++;
      if (run > max) max = run;
    } else {
      run = 0;
    }
  }
  return max;
}

function vowelRatio(s: string): number {
  const letters = s.toLowerCase().replace(/[^a-z]/g, "");
  if (!letters.length) return 1;
  let v = 0;
  for (const ch of letters) if (VOWELS.has(ch)) v++;
  return v / letters.length;
}

// A single "word" that looks like random keyboard mash rather than a real name/word.
function looksGibberish(token: string): boolean {
  if (!isLatinAlpha(token)) return false; // ignore numbers, punctuation, non-Latin
  if (token.length < 8) return false; // too short to judge reliably
  if (countCaseSwitches(token) >= 3) return true;
  if (token.length >= 10 && vowelRatio(token) < 0.28) return true;
  if (longestConsonantRun(token) >= 5) return true;
  return false;
}

function textIsGibberish(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const tokens = trimmed.split(/\s+/);
  // A single blob with no spaces ("MLAGJuPjNoOvylXWsQWK").
  if (tokens.length === 1) return looksGibberish(tokens[0]);
  // Multi-word: only flag if most words are individually gibberish.
  const gib = tokens.filter(looksGibberish).length;
  return gib >= 2 && gib / tokens.length >= 0.5;
}

// Dotted Gmail-alias abuse: many dots / many 1-2 char segments in the local part.
function emailLooksLikeAliasAbuse(email: string): boolean {
  const at = email.indexOf("@");
  if (at < 0) return false;
  const local = email.slice(0, at);
  const dots = (local.match(/\./g) || []).length;
  if (dots >= 4) return true;
  const segments = local.split(".").filter(Boolean);
  const tiny = segments.filter((s) => s.length <= 2).length;
  return segments.length >= 5 && tiny >= 4;
}

const URL_RE =
  /(https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|ru|xyz|top|info|online|site|link|click|shop)\b)/i;

export type SpamInput = {
  name?: string;
  email?: string;
  message?: string;
  /** Hidden honeypot field value. Real users never see it, so it must stay empty. */
  honeypot?: string;
};

/**
 * Returns true if a submission looks like bot spam and should be silently dropped.
 * A filled honeypot is an immediate reject; otherwise we require >= 2 weak signals.
 */
export function isLikelySpam(input: SpamInput): boolean {
  if (input.honeypot && input.honeypot.trim() !== "") return true;

  let score = 0;
  if (input.name && textIsGibberish(input.name)) score++;
  if (input.message && textIsGibberish(input.message)) score++;
  if (input.email && emailLooksLikeAliasAbuse(input.email)) score++;
  if (input.message && URL_RE.test(input.message)) score++;

  return score >= 2;
}
