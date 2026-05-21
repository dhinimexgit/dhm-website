"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { NavAdminLoginLink } from "@/components/layout/nav-admin-login-link";
import {
  NavUtilityCluster,
  NavUtilityDivider,
  NAV_UTILITY_ICON_CLASS,
} from "@/components/layout/nav-utility-cluster";

export function HeroHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // i18n
  const { language, setLanguage, t } = useLanguage();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const heroNavLinks = [
    { label: t.nav.about, href: "/about", caret: false },
    { 
      label: t.nav.business,
      href: "/business", 
      caret: true,
      dropdown: [
        { label: t.business.trading, href: "/business/trading" },
        { label: t.business.manufacturing, href: "/business/manufacturing" },
        { label: t.business.electricity, href: "/business/electricity" },
        { label: t.business.water, href: "/business/water-supply" },
        { label: t.business.scientific, href: "/business/scientific" },
      ]
    },
    { label: t.nav.services, href: "/services", caret: false },
    { label: t.nav.products, href: "/products", caret: false },
    { label: t.nav.blog, href: "/news", caret: false },
    { label: t.nav.careers, href: "/careers", caret: false },
  ];

  const handleMouseEnter = (label: string) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
    setHideTimeout(timeout);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="flex w-full items-center justify-between bg-brand-navy px-14 py-5 shadow-lg">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/brands/DHM-WHITE.png"
          alt="Dhinimex logo"
          width={170}
          height={49}
          priority
          className="h-auto w-[170px]"
          unoptimized
        />
      </Link>
      <nav className="flex items-center gap-6 text-[15px] font-medium text-white xl:gap-8">
        {heroNavLinks.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            {item.dropdown ? (
              (() => {
                const isActive = pathname === item.href || item.dropdown.some((link) => pathname.startsWith(link.href));
                return (
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      isActive ? "text-brand-red" : "hover:text-brand-red"
                    }`}
                  >
                    {item.label}
                    {item.caret && <span className="text-[11px]">▼</span>}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-brand-red transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })()
            ) : (
              (() => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link 
                    href={item.href} 
                    className={`group relative flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      active ? "text-brand-red" : "hover:text-brand-red"
                    }`}
                  >
                    {item.label}
                    {item.caret && <span className="text-[11px]">▼</span>}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-brand-red transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })()
            )}
            
            {item.dropdown && openDropdown === item.label && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-lg bg-white py-2 shadow-xl">
                {item.dropdown.map((dropdownItem) => (
                  <Link
                    key={dropdownItem.label}
                    href={dropdownItem.href}
                    className="block px-6 py-3 text-[15px] text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    {dropdownItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="relative flex items-center gap-2 text-white xl:gap-3">
        {searchOpen ? (
          <form
            onSubmit={handleSearchSubmit}
            className="absolute right-full z-50 mr-2 flex w-[min(266px,calc(100vw-420px))] items-center rounded-full border border-slate-200/90 bg-white px-2 py-1 shadow-lg"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.search}
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />
            <button type="submit" className="p-1.5 text-brand-red transition hover:text-brand-navy" aria-label={t.nav.search}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1.5 text-slate-400 transition hover:text-slate-600"
              aria-label={t.nav.cancel}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        ) : null}

        <NavUtilityCluster>
          {!searchOpen ? (
            <>
              <button
                type="button"
                className={NAV_UTILITY_ICON_CLASS}
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <NavUtilityDivider />
            </>
          ) : null}
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "kh" : "en")}
            className={`${NAV_UTILITY_ICON_CLASS} px-1.5`}
            aria-label="Toggle Language"
          >
            <Image
              src={language === "en" ? "/kh-flag.png" : "/en-flag.png"}
              alt={language === "en" ? "Khmer" : "English"}
              width={30}
              height={20}
              className="h-4 w-auto rounded-sm"
            />
          </button>
          <NavUtilityDivider />
          <NavAdminLoginLink />
        </NavUtilityCluster>

        <Link
          href="/contact-us"
          className="ml-1 whitespace-nowrap rounded-full bg-brand-red px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#c91e21] hover:shadow-md"
        >
          {t.nav.contact}
        </Link>
      </div>
    </div>
  );
}
