import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("dhm_admin_session");

  // If no session exists, we'll check if we are already on the login page
  // But since this layout wraps everything under /dhm-myadmin, 
  // and the login page is at /dhm-myadmin/login, we need to be careful not to infinite loop.
  // Ideally, we move the login page OUT of this layout protection, or handle it conditionally.
  
  // However, Next.js layouts nest. 
  // If I put this layout at src/app/dhm-myadmin/layout.tsx, it wraps /dhm-myadmin/login too.
  // So I need to check the route or structure it differently.
  // A better approach:
  // src/app/dhm-myadmin/layout.tsx -> The layout for the dashboard (sidebar, logout, etc).
  // src/app/dhm-myadmin/page.tsx -> The dashboard.
  // src/app/dhm-myadmin/login/page.tsx -> The login page.
  
  // BUT, if I put the protection in dhm-myadmin/layout.tsx, it WILL affect login/page.tsx.
  
  // Strategy: 
  // Move the protection to a component or check strictly for dashboard routes.
  // Or, use Route Groups. (admin)/layout.tsx vs (auth)/login/page.tsx.
  // Since I've already defined the path as /dhm-myadmin/login, let's use a check.
  
  // Actually, in Next.js App Router, we can just check inside the Layout.
  // But getting the current pathname in a Server Component layout is tricky/not recommended directly.
  // Middleware is better for this.
  
  // For simplicity in this plan without adding middleware file:
  // I will make this layout ONLY provide the shell.
  // I will add a `checkSession` call to the `page.tsx` of the dashboard instead.
  // OR, I can use a Route Group:
  // src/app/dhm-myadmin/(dashboard)/layout.tsx -> Protected
  // src/app/dhm-myadmin/(dashboard)/page.tsx
  // src/app/dhm-myadmin/login/page.tsx -> Public
  
  // Let's go with Route Group approach for cleaner separation.
  
  return (
    <div className="min-h-screen bg-slate-50">
       {children}
    </div>
  );
}

