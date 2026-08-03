import { getCurrentUser } from "@/app/actions/auth";
import { SUPER_ADMIN_LOGIN_ID } from "@/lib/admin-auth-constants";
import { PrPoManager } from "@/components/admin/pr-po-manager";
import { redirect } from "next/navigation";
import { resolveBranchPoTabAccess } from "@/lib/branch-po-tab-access";
import {
  encodeAllowedBranchesForProps,
  resolveViewPoBranchScope,
} from "@/lib/branch-po-view-scope";
import { formatUserDisplayName } from "@/lib/user-display-name";

type Props = {
  searchParams: Promise<{ tab?: string; po?: string }>;
};

export default async function PrPoPage({ searchParams }: Props) {
  const { tab, po: viewPoId } = await searchParams;
  const user = await getCurrentUser();
  const permissions = user?.permissions ?? [];

  const isPrpoSuperUser =
    user?.role === "super_admin" ||
    user?.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID;

  const { canDashboard, canSubmit, canOpen, canViewPo, canItemTracker } = resolveBranchPoTabAccess(
    permissions,
    { isPrpoSuperUser },
  );

  if (!canDashboard && !canSubmit && !canOpen && !canViewPo && !canItemTracker) {
    redirect("/dhm-myadmin");
  }

  const viewPoBranchScope = resolveViewPoBranchScope(user, isPrpoSuperUser);

  const actorDisplayName = user
    ? formatUserDisplayName({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      })
    : "Unknown user";

  const initialTab =
    tab === "open" ||
    tab === "view" ||
    tab === "submit" ||
    tab === "dashboard" ||
    tab === "items"
      ? tab
      : undefined;

  return (
    <PrPoManager
      initialTab={initialTab}
      initialViewPoId={viewPoId?.trim() || undefined}
      canDashboard={canDashboard}
      canSubmit={canSubmit}
      canOpen={canOpen}
      canViewPo={canViewPo}
      canItemTracker={canItemTracker}
      viewPoStaffLock={viewPoBranchScope.kind !== "all" ? 1 : 0}
      viewPoAllowedBranches={
        viewPoBranchScope.kind === "branches"
          ? encodeAllowedBranchesForProps(viewPoBranchScope.branchNames)
          : ""
      }
      actorDisplayName={actorDisplayName}
      actorUsername={user?.username ?? ""}
      isPrpoSuperUser={isPrpoSuperUser}
    />
  );
}
