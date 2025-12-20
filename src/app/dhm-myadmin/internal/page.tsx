import { redirect } from "next/navigation";

// Redirect to rooms page by default
export default function InternalDashboard() {
  redirect("/dhm-myadmin/internal/rooms");
}
