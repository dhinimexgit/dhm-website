"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n";

type NavLinkId = "home" | "dashboard" | "prpo" | "dhmProjects" | "userMgmt";

type NavLink = {
  href: string;
  id: NavLinkId;
  /** One or more permission keys — user needs at least one to see this link */
  requiredPerms?: string[];
};

const ALL_LINKS: NavLink[] = [
  {
    href: "/dhm-myadmin",
    id: "home",
  },
  {
    href: "/dhm-myadmin/dashboard",
    id: "dashboard",
    requiredPerms: ["admin.products", "admin.posts", "admin.careers", "admin.inquiries", "admin.qrcode"],
  },
  {
    href: "/dhm-myadmin/pr-po",
    id: "prpo",
    requiredPerms: [
      "admin.prpo",
      "admin.prpo.dashboard",
      "admin.prpo.submit",
      "admin.prpo.open",
      "admin.prpo.view",
    ],
  },
  {
    href: "/dhm-myadmin/dhm-projects",
    id: "dhmProjects",
    requiredPerms: ["projects.view", "projects.submit", "projects.update"],
  },
  /* Internal tooling hidden
  {
    href: "/dhm-myadmin/internal",
    id: "internal",
    requiredPerms: ["internal.rooms", "internal.cars", "internal.resource_management"],
  },
  */
  {
    href: "/dhm-myadmin/user-management",
    id: "userMgmt",
    requiredPerms: ["internal.user_management"],
  },
];

const isActiveLink = (pathname: string, href: string) => {
  if (href === "/dhm-myadmin") return pathname === "/dhm-myadmin";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export function AdminTopNav({
  isSuperAdmin,
  permissions = [],
}: {
  isSuperAdmin?: boolean;
  permissions?: string[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const linkLabels = useMemo(
    (): Record<NavLinkId, string> => ({
      home: t.admin.common.navHome,
      dashboard: t.admin.dashboard.title,
      prpo: t.admin.prpo.title,
      dhmProjects: t.admin.dhmProjects.title,
      userMgmt: t.admin.userMgmt.title,
    }),
    [t],
  );

  const visibleLinks = ALL_LINKS.filter((link) => {
    if (isSuperAdmin) return true;
    if (!link.requiredPerms) return true;
    return link.requiredPerms.some((p) => permissions.includes(p));
  });

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const desktopLinkClass = (active: boolean) =>
    `relative text-[15px] font-medium transition-colors ${
      active ? "text-white hover:text-brand-red" : "text-white/70 hover:text-white"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `rounded-lg px-3 py-3 text-base font-medium transition-colors ${
      active ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:contents">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/25 text-white transition hover:bg-white/10 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-nav"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">{mobileOpen ? t.admin.common.closeMenu : t.admin.common.openMenu}</span>
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <nav className="hidden min-w-0 items-center gap-6 text-[15px] font-medium lg:flex xl:gap-8" aria-label={t.admin.common.adminNavigation}>
          {visibleLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <Link key={link.href} href={link.href} className={desktopLinkClass(active)}>
                {linkLabels[link.id]}
                {active ? <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" /> : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden" id="admin-mobile-nav">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            aria-label={t.admin.common.closeMenu}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute left-0 top-0 flex h-full min-h-[100dvh] w-[min(20rem,88vw)] flex-col border-r border-white/10 bg-[#2E388C] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={t.admin.common.adminNavigation}
          >
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-4">
              <span className="text-sm font-semibold tracking-wide text-white/95">{t.admin.common.navigate}</span>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
                aria-label={t.admin.common.closeMenu}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain p-3 pb-[max(1rem,env(safe-area-inset-bottom))]" aria-label={t.admin.common.adminNavigation}>
              {visibleLinks.map((link) => {
                const active = isActiveLink(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={mobileLinkClass(active)}
                    onClick={() => setMobileOpen(false)}
                  >
                    {linkLabels[link.id]}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
