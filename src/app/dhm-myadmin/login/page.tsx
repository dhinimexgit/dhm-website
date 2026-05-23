import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LanguageProvider } from "@/lib/i18n";
import { hasValidAdminSession } from "@/lib/admin-session";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("dhm_admin_session")?.value;
  const user = cookieStore.get("dhm_admin_user")?.value;
  const lastActivity = cookieStore.get("dhm_admin_last_activity")?.value;

  if (hasValidAdminSession(session, user, lastActivity)) {
    redirect("/dhm-myadmin");
  }

  return (
    <LanguageProvider>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </LanguageProvider>
  );
}
