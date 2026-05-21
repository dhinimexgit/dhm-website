import { redirect } from "next/navigation";

/** Seed UI disabled; restore `seed-page-content` from git history if needed. */
export default function SeedPage() {
  redirect("/dhm-myadmin");
}
