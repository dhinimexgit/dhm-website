"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { NavAdminLoginLink } from "@/components/layout/nav-admin-login-link";
import {
  NavUtilityCluster,
  NavUtilityDivider,
  NAV_UTILITY_ICON_CLASS,
} from "@/components/layout/nav-utility-cluster";

type Props = {
  isVisible: boolean;
};

export function StickyHeader({ isVisible }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close on escape key or click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (searchOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [searchOpen]);

  return (
    <header
      suppressHydrationWarning
      className={`fixed inset-x-0 top-0 z-50 hidden lg:block transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-brand-navy shadow-lg">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/brands/DHM-WHITE.png"
                alt="Dhinimex logo"
                width={140}
                height={40}
                priority
                className="h-auto w-[140px]"
                unoptimized
              />
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-white">
              <Link href="/about" className="group relative transition hover:text-white/80">
                {t.nav.about}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <div className="group relative">
                <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">
                  {t.nav.business}
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.trading}</Link>
                  <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.manufacturing}</Link>
                  <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.electricity}</Link>
                  <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.water}</Link>
                  <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.scientific}</Link>
                </div>
              </div>
              <Link href="/services" className="group relative transition hover:text-white/80">
                {t.nav.services}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <Link href="/products" className="group relative transition hover:text-white/80">
                {t.nav.products}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <Link href="/news" className="group relative transition hover:text-white/80">
                {t.nav.blog}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <Link href="/careers" className="group relative transition hover:text-white/80">
                {t.nav.careers}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <NavUtilityCluster>
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`${NAV_UTILITY_ICON_CLASS} ${searchOpen ? "text-white" : ""}`}
                  aria-label="Search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <NavUtilityDivider />
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
                className="rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c91e21] hover:shadow-md"
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Dropdown - Absolutely positioned below navbar */}
      {searchOpen && (
        <div 
          ref={searchPanelRef}
          className="absolute left-0 right-0 top-full bg-white shadow-2xl"
        >
          <div className="mx-auto max-w-7xl px-8 py-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
              <div className="relative flex-1">
                <svg 
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.nav.searchPlaceholder}
                  className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
              >
                {t.nav.searchBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                {t.nav.cancel}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
