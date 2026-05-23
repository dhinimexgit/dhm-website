/** Admin session expires after 1 hour without activity. */
export const ADMIN_INACTIVITY_SECONDS = 60 * 60;

export const ADMIN_SESSION_MAX_AGE = ADMIN_INACTIVITY_SECONDS;

export const ADMIN_SESSION_COOKIE_NAMES = [
  "dhm_admin_session",
  "dhm_admin_user",
  "dhm_admin_role",
  "dhm_login_mode",
  "dhm_admin_last_activity",
] as const;

export type AdminSessionCookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  path: string;
  sameSite: "lax" | "strict" | "none";
};

export function getAdminSessionCookieOptions(): AdminSessionCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
  };
}

export function parseLastActivityMs(value: string | undefined): number | null {
  if (!value) return null;
  const ms = Number.parseInt(value, 10);
  return Number.isFinite(ms) && ms > 0 ? ms : null;
}

export function isAdminSessionExpired(lastActivityMs: number | null): boolean {
  if (lastActivityMs === null) return true;
  return Date.now() - lastActivityMs > ADMIN_INACTIVITY_SECONDS * 1000;
}

export function hasValidAdminSession(
  sessionValue: string | undefined,
  userValue: string | undefined,
  lastActivityValue: string | undefined
): boolean {
  if (!sessionValue || !userValue) return false;
  const lastActivityMs = parseLastActivityMs(lastActivityValue);
  return !isAdminSessionExpired(lastActivityMs);
}
