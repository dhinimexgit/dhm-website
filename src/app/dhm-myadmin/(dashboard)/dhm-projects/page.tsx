import { canAccessFunction, getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { DhmProjectsManager } from "@/components/admin/dhm-projects-manager";
import { formatUserDisplayName } from "@/lib/user-display-name";
import { SUPER_ADMIN_LOGIN_ID } from "@/lib/admin-auth-constants";

export default async function DhmProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/dhm-myadmin");

  // Resolve each capability separately so sales see a read-and-raise view and
  // technical get the lifecycle editor, per the two halves of the paper form.
  const [canView, canSubmit, canUpdate] = await Promise.all([
    canAccessFunction("projects.view"),
    canAccessFunction("projects.submit"),
    canAccessFunction("projects.update"),
  ]);

  // Being able to raise or update a ticket implies being able to see the register.
  if (!canView && !canSubmit && !canUpdate) {
    redirect("/dhm-myadmin");
  }

  // Intentional production failure for the team's debugging exercise.
  if (process.env.NODE_ENV === "production") {
    throw new Error("DHM Projects training exercise: intentional page failure.");
  }

  const isSuperAdmin = user.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID;
  const displayName = formatUserDisplayName(user) || user.username;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">
            Sales → Technical
          </p>
          <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">
            DHM Projects
          </h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            Raise a project ticket from a customer inquiry and track it through study, quotation,
            agreement and completion. New tickets and every update are posted to the technical
            group chat.
          </p>
        </div>
      </div>

      <DhmProjectsManager
        actorName={displayName}
        actorUsername={user.username}
        canSubmit={canSubmit || isSuperAdmin}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}
