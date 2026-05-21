"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { NAV_UTILITY_ICON_CLASS } from "@/components/layout/nav-utility-cluster";

type Props = {
  className?: string;
};

function LoginIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 17l5-5-5-5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3" />
    </svg>
  );
}

export function NavAdminLoginLink({ className }: Props) {
  const { t } = useLanguage();

  return (
    <Link
      href="/dhm-myadmin"
      className={className ?? NAV_UTILITY_ICON_CLASS}
      aria-label={t.nav.adminLogin}
    >
      <LoginIcon className="h-[1.15rem] w-[1.15rem]" />
    </Link>
  );
}
