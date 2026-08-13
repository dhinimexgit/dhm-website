/** Login username for the built-in super admin (email-shaped id). Not a server action — safe to import from client or server. */
export const SUPER_ADMIN_LOGIN_ID = "admin@dhinimex.com";

type SuperAdminCheckUser = {
  username?: string;
  email?: string;
  role?: string;
} | null | undefined;

/**
 * Does this account bypass per-feature permission checks?
 *
 * Shared deliberately: the portal cards and the top nav each used to compute
 * this inline, and they had drifted — the cards accepted `role === "super_admin"`
 * while the nav only matched the built-in login id, so a super admin by role
 * saw a section's card but not its nav link. One definition, used by both.
 *
 * Mirrors the server-side short-circuit in `canAccessFunction`, which also
 * grants everything to the `admin` role — see `hasFullAdminAccess`.
 */
export function isSuperAdminUser(user: SuperAdminCheckUser): boolean {
  if (!user) return false;
  return (
    user.role === "super_admin" ||
    user.username?.toLowerCase() === SUPER_ADMIN_LOGIN_ID ||
    user.email?.toLowerCase() === SUPER_ADMIN_LOGIN_ID
  );
}

/**
 * Accounts that see every feature regardless of their stored permissions.
 *
 * `canAccessFunction` returns true for `admin` as well as `super_admin` before
 * it ever consults the permissions array, so client-side navigation has to use
 * the same rule or it will hide links the user can actually open — which is
 * what happened to DHM Projects for accounts whose permission array predated
 * the projects.* keys.
 */
export function hasFullAdminAccess(user: SuperAdminCheckUser): boolean {
  return isSuperAdminUser(user) || user?.role === "admin";
}
