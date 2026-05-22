import { getCurrentUser } from "@/app/actions/auth";
import { SUPER_ADMIN_LOGIN_ID } from "@/lib/admin-auth-constants";
import { PrPoManager } from "@/components/admin/pr-po-manager";
import { redirect } from "next/navigation";
import { resolveBranchPoTabAccess } from "@/lib/branch-po-tab-access";
import { resolveViewPoBranchScope } from "@/lib/branch-po-view-scope";
import { formatUserDisplayName } from "@/lib/user-display-name";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function PrPoPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const user = await getCurrentUser();
  const permissions = user?.permissions ?? [];

  const isPrpoSuperUser =
    user?.role === "super_admin" ||
    user?.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID;

  const { canDashboard, canSubmit, canOpen, canViewPo } = resolveBranchPoTabAccess(permissions, {
    isPrpoSuperUser,
  });

  if (!canDashboard && !canSubmit && !canOpen && !canViewPo) {
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
    tab === "open" || tab === "view" || tab === "submit" || tab === "dashboard" ? tab : undefined;

  return (
    <PrPoManager
      initialTab={initialTab}
      canDashboard={canDashboard}
      canSubmit={canSubmit}
      canOpen={canOpen}
      canViewPo={canViewPo}
      viewPoStaffLock={viewPoBranchScope.kind !== "all" ? 1 : 0}
      viewPoStaffBranchName={viewPoBranchScope.kind === "branch" ? viewPoBranchScope.branchName : ""}
      actorDisplayName={actorDisplayName}
      actorUsername={user?.username ?? ""}
    />
  );
}
