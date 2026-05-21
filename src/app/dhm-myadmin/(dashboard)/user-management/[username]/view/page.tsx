import { canAccessFunction, getCurrentUser, getManagedUserByUsername } from "@/app/actions/auth";
import { ViewUserClient } from "@/app/dhm-myadmin/internal/user-management/view-user-client";
import { notFound, redirect } from "next/navigation";

export default async function ViewManagedUserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: raw } = await params;
  const decoded = decodeURIComponent(raw);

  const sessionUser = await getCurrentUser();
  const allowed = await canAccessFunction("internal.user_management");

  if (!sessionUser || !allowed) {
    redirect("/dhm-myadmin");
  }

  const res = await getManagedUserByUsername(decoded);
  if (!res.success || !res.user) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Security</p>
          <h1 className="text-4xl font-semibold text-brand-navy">User Management</h1>
        </div>
      </div>
      <ViewUserClient user={res.user} />
    </div>
  );
}
