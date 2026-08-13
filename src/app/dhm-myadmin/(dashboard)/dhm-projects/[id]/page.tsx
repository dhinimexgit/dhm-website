import { canAccessFunction, getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { ProjectDetailPage } from "@/components/admin/project-detail-view";
import { formatUserDisplayName } from "@/lib/user-display-name";
import { SUPER_ADMIN_LOGIN_ID } from "@/lib/admin-auth-constants";

type Props = { params: Promise<{ id: string }> };

export default async function DhmProjectDetailRoute({ params }: Props) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/dhm-myadmin");

  const [canView, canSubmit, canUpdate] = await Promise.all([
    canAccessFunction("projects.view"),
    canAccessFunction("projects.submit"),
    canAccessFunction("projects.update"),
  ]);

  if (!canView && !canSubmit && !canUpdate) {
    redirect("/dhm-myadmin");
  }

  const isSuperAdmin = user.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID;

  return (
    <ProjectDetailPage
      projectId={id}
      actorName={formatUserDisplayName(user) || user.username}
      actorUsername={user.username}
      canUpdate={canUpdate || isSuperAdmin}
    />
  );
}
