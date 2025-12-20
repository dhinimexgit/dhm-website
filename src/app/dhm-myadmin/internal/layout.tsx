import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout, getCurrentUser } from "@/app/actions/auth";
import Link from "next/link";
import { InternalTabs } from "./internal-tabs";

export default async function InternalToolingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("dhm_admin_session");

  if (!session) {
    redirect("/dhm-myadmin/login");
  }

  // Admin users can access Internal Tooling regardless of login mode
  // Only redirect non-admin users who logged in via admin mode
  const user = await getCurrentUser();
  const userEmail = user?.email || 'Unknown';
  const userRole = user?.role || 'admin';
  const isAdmin = user?.role === 'admin' || user?.role === 'marketing';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section matching admin dashboard style */}
      <div className="relative bg-[#2E388C] text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-12">
            <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
              <Link 
                href="/dhm-myadmin/internal" 
                className="relative text-white hover:text-brand-red transition-colors"
              >
                Internal Tooling
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
              </Link>
              {isAdmin && (
                <Link 
                  href="/dhm-myadmin" 
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-medium text-white/90">
                {isAdmin ? 'Admin' : 'User'}
              </span>
              <span className="text-xs text-white/60">
                {userEmail}
              </span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full bg-white/10 px-6 py-2 text-[14px] font-semibold text-white transition-all hover:bg-brand-red"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main 
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        data-user-email={userEmail}
        data-user-role={userRole}
        data-is-admin={isAdmin ? 'true' : 'false'}
      >
        {/* Tab Navigation */}
        <InternalTabs isAdmin={isAdmin} />
        
        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
