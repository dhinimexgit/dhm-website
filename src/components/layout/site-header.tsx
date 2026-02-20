"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  
  // i18n
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";
  const isServicesPage = pathname.startsWith("/services");
  const isBusinessPage = pathname === "/business" || pathname.startsWith("/business/");
  const isCareersPage = pathname === "/careers" || pathname.startsWith("/careers/");
  const isBlogPage = pathname === "/news" || pathname.startsWith("/news/");
  const isContactPage = pathname === "/contact-us";
  // Hide global navbar for Products Landing (/products) and Brand Landing (/products/brand) 
  // but show it for Product Detail (/products/brand/slug)
  const isProductsPage = pathname.startsWith("/products") && pathname.split('/').filter(Boolean).length <= 2;
  const isSearchPage = pathname === "/search";
  const hasEmbeddedNav =
    isHomePage ||
    isAboutPage ||
    isServicesPage ||
    isBusinessPage ||
    isCareersPage ||
    isBlogPage ||
    isContactPage ||
    isProductsPage ||
    isSearchPage;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Use consistent background logic
  const headerClasses = hasEmbeddedNav 
    ? 'lg:hidden lg:relative fixed inset-x-0 top-0 z-50 bg-[#2E388C] text-white shadow-lg' 
    : 'relative z-50 bg-[#2E388C] text-white shadow-md';

  const navItems = [
    { label: t.nav.about, href: "/about" },
    {
      label: t.nav.business,
      href: "/business",
      dropdown: [
        { label: t.business.trading, href: "/business/trading" },
        { label: t.business.manufacturing, href: "/business/manufacturing" },
        { label: t.business.electricity, href: "/business/electricity" },
        { label: t.business.water, href: "/business/water-supply" },
        { label: t.business.scientific, href: "/business/scientific" },
      ]
    },
    { label: t.nav.services, href: "/services" },
    { label: t.nav.products, href: "/products" },
    { label: t.nav.blog, href: "/news" },
    { label: t.nav.careers, href: "/careers" },
    { label: t.nav.contact, href: "/contact-us" },
  ];

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 md:px-0 relative">
        <button
          className="md:hidden p-2 -ml-1"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            className="h-7 w-7 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 md:ml-8 lg:ml-12"
        >
          <Image
            src="/brands/DHM-WHITE.png"
            alt="Dhinimex logo"
            width={150}
            height={44}
            priority
            className="h-auto w-[150px] md:hidden"
            unoptimized
          />
          <Image
            src="/brands/ALL-LOGO-25.png"
            alt="Dhinimex bilingual logo"
            width={48}
            height={16}
            priority
            className="hidden h-auto w-[48px] md:block"
            unoptimized
          />
        </Link>
        <div className="w-10 md:hidden" />
        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => {
            if (item.dropdown) {
              const isActive = pathname === item.href || item.dropdown.some((link) => pathname.startsWith(link.href));
              return (
                <div key={item.label} className="group relative text-sm font-semibold">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 transition ${
                      isActive ? "text-brand-red" : "text-white/80 group-hover:text-brand-red"
                    }`}
                  >
                    {item.label}
                    <span className="text-[10px]">▼</span>
                  </Link>
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-brand-red transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                  <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-2xl bg-white p-3 text-sm text-brand-navy opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="flex flex-col divide-y divide-slate-100">
                      {item.dropdown.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="px-3 py-2 transition hover:text-brand-red"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-sm font-semibold transition ${
                  active ? "text-brand-red" : "text-white/80 hover:text-brand-red"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-brand-red transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
          <div className="ml-2 flex items-center gap-3 text-white/80 relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="absolute right-0 z-50 flex items-center bg-white rounded-full px-2 py-1 shadow-md w-64 border border-slate-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.nav.search}
                  className="flex-grow bg-transparent px-2 text-sm text-brand-navy focus:outline-none placeholder:text-slate-400"
                  autoFocus
                />
                <button type="submit" className="p-1 text-brand-red hover:text-brand-navy">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="p-2 text-base text-white transition hover:text-brand-red"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
            
            {/* Language Selector Desktop */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white transition hover:text-brand-red"
              >
                <Image 
                  src={language === 'en' ? "/en-flag.png" : "/kh-flag.png"} 
                  alt={language === 'en' ? "English" : "Khmer"} 
                  width={30} 
                  height={20}
                  className="h-6 w-auto"
                />
                {language === 'en' ? 'EN' : 'KH'}
                <span className="text-[10px]">▼</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-lg bg-white py-1 shadow-xl text-brand-navy z-50">
                  <button
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    <Image src="/en-flag.png" alt="EN" width={30} height={20} className="h-6 w-auto" />
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('kh'); setLangOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    <Image src="/kh-flag.png" alt="KH" width={30} height={20} className="h-6 w-auto" />
                    Khmer
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      {isOpen && (
        <div className="absolute inset-x-0 top-full border-t border-white/20 bg-[#2E388C] md:hidden">
          <nav className="flex flex-col px-4 pb-6">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4 mb-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {navItems.map((item) => {
              if (item.dropdown) {
                const isBusinessActive = pathname === item.href || pathname.startsWith("/business/");
                return (
                  <div key={item.label}>
                    <div className="flex w-full items-center justify-between py-3">
                      {/* Clickable label that navigates to the page */}
                      <Link
                        href={item.href}
                        className={`flex-1 text-left text-sm font-semibold ${
                          isBusinessActive ? "text-brand-red" : "text-white/80"
                        }`}
                        onClick={() => {
                          setIsOpen(false);
                          setMobileDropdownOpen(null);
                        }}
                      >
                        {item.label}
                      </Link>
                      {/* Arrow button that toggles dropdown */}
                      <button
                        type="button"
                        className="p-2 text-white/80"
                        onClick={() => setMobileDropdownOpen(mobileDropdownOpen === item.label ? null : item.label)}
                        aria-label="Toggle submenu"
                      >
                        <span className={`text-xs transition-transform inline-block ${mobileDropdownOpen === item.label ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                    </div>
                    {mobileDropdownOpen === item.label && (
                      <div className="ml-4 flex flex-col border-l-2 border-white/20 pl-4">
                        {item.dropdown.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`py-2 text-sm ${
                                isSubActive ? "font-semibold text-brand-red" : "text-white/70 hover:text-white"
                              }`}
                              onClick={() => {
                                setIsOpen(false);
                                setMobileDropdownOpen(null);
                              }}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              const isActive = item.href !== "#" && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-3 text-sm font-semibold ${
                    isActive ? "text-brand-red" : "text-white/80"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Language Selector Mobile */}
            <div className="mt-4 border-t border-white/20 pt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex items-center gap-3 text-sm font-semibold ${language === 'en' ? 'text-brand-red' : 'text-white/80'}`}
                >
                  <Image 
                    src="/en-flag.png" 
                    alt="EN" 
                    width={30} 
                    height={20}
                    className="h-6 w-auto"
                  />
                  <span>English</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('kh')}
                  className={`flex items-center gap-3 text-sm font-semibold ${language === 'kh' ? 'text-brand-red' : 'text-white/80'}`}
                >
                  <Image 
                    src="/kh-flag.png" 
                    alt="KH" 
                    width={30} 
                    height={20}
                    className="h-6 w-auto"
                  />
                  <span>Khmer</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
