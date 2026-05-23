/**
 * Pure helper — must not live in a `'use server'` file (Next.js requires exported server actions to be async).
 * Legacy `admin.prpo` or super-user bypass grants all Branch Functions tabs.
 */
export function resolveBranchPoTabAccess(
  permissions: readonly string[] | undefined,
  opts: { isPrpoSuperUser: boolean }
): {
  canDashboard: boolean;
  canSubmit: boolean;
  canOpen: boolean;
  canViewPo: boolean;
  canItemTracker: boolean;
} {
  const p = new Set(permissions ?? []);
  const legacy = opts.isPrpoSuperUser || p.has("admin.prpo");
  const canViewPo = legacy || p.has("admin.prpo.view");
  const canOpen = legacy || p.has("admin.prpo.open");
  return {
    canDashboard: legacy || p.has("admin.prpo.dashboard"),
    canSubmit: legacy || p.has("admin.prpo.submit"),
    canOpen,
    canViewPo,
    canItemTracker:
      legacy ||
      p.has("admin.prpo.items") ||
      canViewPo ||
      canOpen,
  };
}
