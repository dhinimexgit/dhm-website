import { getCurrentUser } from "@/app/actions/auth";
import { SUPER_ADMIN_LOGIN_ID } from "@/lib/admin-auth-constants";
import { PrPoManager } from "@/components/admin/pr-po-manager";
import { redirect } from "next/navigation";
import { resolveBranchPoTabAccess } from "@/lib/branch-po-tab-access";
import { resolveViewPoBranchScope } from "@/lib/branch-po-view-scope";
import { formatUserDisplayName } from "@/lib/user-display-name";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CreateSoPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const user = await getCurrentUser();
  const permissions = user?.permissions ?? [];

  const isPrpoSuperUser =
    user?.role === "super_admin" ||
    user?.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID;

  const { canOpen } = resolveBranchPoTabAccess(permissions, { isPrpoSuperUser });

  if (!canOpen) {
    redirect("/dhm-myadmin/pr-po");
  }

  if (!id?.trim()) {
    redirect("/dhm-myadmin/pr-po?tab=open");
  }

  const viewPoBranchScope = resolveViewPoBranchScope(user, isPrpoSuperUser);
  const actorDisplayName = user
    ? formatUserDisplayName({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      })
    : "Unknown user";

  return (
    <PrPoManager
      pageMode="create-so"
      initialCreateSoPoId={id.trim()}
      canOpen={canOpen}
      viewPoStaffLock={viewPoBranchScope.kind !== "all" ? 1 : 0}
      viewPoStaffBranchName={viewPoBranchScope.kind === "branch" ? viewPoBranchScope.branchName : ""}
      actorDisplayName={actorDisplayName}
      actorUsername={user?.username ?? ""}
    />
  );
}
