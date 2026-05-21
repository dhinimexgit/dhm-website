export type UserNameFields = {
  firstName?: string;
  lastName?: string;
  username?: string;
};

/** Full name for audit logs; falls back to username. */
export function formatUserDisplayName(fields: UserNameFields): string {
  const first = (fields.firstName ?? "").trim();
  const last = (fields.lastName ?? "").trim();
  const full = [first, last].filter(Boolean).join(" ");
  if (full) return full;
  const login = (fields.username ?? "").trim();
  return login || "Unknown user";
}
