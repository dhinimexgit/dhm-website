"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLink = {
  href: string;
  label: string;
  /** One or more permission keys — user needs at least one to see this link */
  requiredPerms?: string[];
};

const ALL_LINKS: NavLink[] = [
  {
    href: "/dhm-myadmin",
    label: "Home",
  },
  {
    href: "/dhm-myadmin/dashboard",
    label: "Admin Dashboard",
    requiredPerms: ["admin.products", "admin.posts", "admin.careers", "admin.inquiries", "admin.qrcode"],
  },
  {
    href: "/dhm-myadmin/pr-po",
    label: "Branch Functions",
    requiredPerms: [
      "admin.prpo",
      "admin.prpo.dashboard",
      "admin.prpo.submit",
      "admin.prpo.open",
      "admin.prpo.view",
    ],
  },
  /* Internal tooling hidden
  {
    href: "/dhm-myadmin/internal",
    label: "Internal Tooling",
    requiredPerms: ["internal.rooms", "internal.cars", "internal.resource_management"],
  },
  */
  {
    href: "/dhm-myadmin/user-management",
    label: "User Management",
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

  const visibleLinks = ALL_LINKS.filter((link) => {
    // Super admin sees everything
    if (isSuperAdmin) return true;
    // No restriction defined → always show
    if (!link.requiredPerms) return true;
    // User must have at least one of the required permissions
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
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
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

        <nav className="hidden min-w-0 items-center gap-6 text-[15px] font-medium lg:flex xl:gap-8" aria-label="Admin primary">
          {visibleLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <Link key={link.href} href={link.href} className={desktopLinkClass(active)}>
                {link.label}
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
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute left-0 top-0 flex h-full min-h-[100dvh] w-[min(20rem,88vw)] flex-col border-r border-white/10 bg-[#2E388C] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
          >
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-4">
              <span className="text-sm font-semibold tracking-wide text-white/95">Navigate</span>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain p-3 pb-[max(1rem,env(safe-area-inset-bottom))]" aria-label="Admin primary mobile">
              {visibleLinks.map((link) => {
                const active = isActiveLink(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={mobileLinkClass(active)}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
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
