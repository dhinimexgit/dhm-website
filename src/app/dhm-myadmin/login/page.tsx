import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("dhm_admin_session");

  if (session) {
    redirect("/dhm-myadmin");
  }

  return (
    <LanguageProvider>
      <LoginForm />
    </LanguageProvider>
  );
}
