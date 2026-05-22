import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout, getCurrentUser } from "@/app/actions/auth";
import { SUPER_ADMIN_LOGIN_ID } from "@/lib/admin-auth-constants";
import { AdminTopNav } from "@/components/admin/admin-top-nav";
import { getTranslation } from "@/lib/i18n-server";
import { LanguageProvider } from "@/lib/i18n";
import { formatUserHeaderName } from "@/lib/user-display-name";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("dhm_admin_session");
  const loginCookie = cookieStore.get("dhm_admin_user");
  const { t } = await getTranslation();

  if (!session?.value || !loginCookie?.value) {
    redirect("/dhm-myadmin/login");
  }

  // Get current user info
  const user = await getCurrentUser();
  const userRole = user?.role || "admin";
  const isSuperAdmin = user?.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID;

  const loginUsername = user?.username?.trim() ?? "";
  const headerIdentity = user
    ? formatUserHeaderName({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      })
    : "";
  const mainSessionLabel = loginUsername;

  return (
    <LanguageProvider>
    <div className="min-h-screen min-h-[100dvh] bg-slate-50 pb-20">
       {/* HeroHeader Section matching site style */}
      <div className="relative bg-[#2E388C] text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex min-w-0 items-center gap-3 lg:gap-12">
                {/* <Link href="/dhm-myadmin" className="flex-shrink-0">
                    <Image
                        src="/brands/DHM-WHITE.png"
                        alt="Dhinimex logo"
                        width={170}
                        height={49}
                        priority
                        className="h-auto w-[150px] brightness-0 invert filter"
                    />
                </Link> */}
                
                <AdminTopNav isSuperAdmin={isSuperAdmin} permissions={user?.permissions ?? []} />
            </div>

            <div className="flex min-w-0 w-full items-center justify-between gap-2 border-t border-white/10 pt-3 sm:gap-3 lg:w-auto lg:justify-end lg:border-t-0 lg:pt-0">
                 {headerIdentity ? (
                   <span className="flex min-w-0 flex-1 items-center gap-2 text-left lg:max-w-[20rem] lg:flex-none">
                     <svg
                       className="h-4 w-4 shrink-0 text-white/85 sm:h-[1.125rem] sm:w-[1.125rem]"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                       strokeWidth={1.75}
                       aria-hidden
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                       />
                     </svg>
                     <span className="truncate text-xs font-medium text-white/90 sm:text-sm lg:text-right">
                       {headerIdentity}
                     </span>
                   </span>
                 ) : (
                   <span className="flex-1 lg:hidden" aria-hidden />
                 )}
                 <form action={logout} className="shrink-0">
                    <button
                        type="submit"
                        className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-red sm:px-6 sm:text-[14px]"
                    >
                        {t.admin.common.signOut}
                    </button>
                 </form>
            </div>
        </div>
      </div>

      {/* Main Content - Pass user info via data attributes for client components */}
      <main 
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
        data-user-email={mainSessionLabel}
        data-user-role={userRole}
        data-user-permissions={(user?.permissions || []).join(",")}
      >
        {children}
      </main>
    </div>
    </LanguageProvider>
  );
}
