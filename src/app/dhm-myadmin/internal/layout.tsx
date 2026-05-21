import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Internal tooling (room/car booking, resource admin) is disabled for the portal UI.
 * Restore the previous layout from version control and remove the redirect below to re-enable.
 */
export default async function InternalToolingLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("dhm_admin_session");

  if (!session) {
    redirect("/dhm-myadmin/login");
  }

  redirect("/dhm-myadmin");
}
