import { canAccessFunction, getCurrentUser, listManagedUsers } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { UserManagementClient } from "@/app/dhm-myadmin/internal/user-management/user-management-client";
import { getTranslation } from "@/lib/i18n-server";

export default async function UserManagementPage() {
  const { t } = await getTranslation();
  const user = await getCurrentUser();
  const allowed = await canAccessFunction("internal.user_management");

  if (!user || !allowed) {
    redirect("/dhm-myadmin");
  }

  const initialData = await listManagedUsers();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
            {t.admin.userMgmt.security}
          </p>
          <h1 className="text-4xl font-semibold text-brand-navy">{t.admin.userMgmt.title}</h1>
          <p className="max-w-2xl text-lg text-slate-600">
            {t.admin.userMgmt.createUsersDesc}
          </p>
        </div>
      </div>

      <UserManagementClient initialUsers={initialData.users} initialError={initialData.error || ""} />
    </div>
  );
}
