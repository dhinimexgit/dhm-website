"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

export function HeroHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // i18n
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const heroNavLinks = [
    { label: t.nav.about, href: "/about", caret: false },
    { 
      label: t.nav.business,
      href: "#", 
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
    { label: t.nav.blog, href: "/blog", caret: false },
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
    <div className="flex w-full items-center justify-between bg-[#2E388C] px-14 py-5 shadow-lg">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo-dhinimex.png"
          alt="Dhinimex logo"
          width={170}
          height={49}
          priority
          className="h-auto w-[170px]"
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
                const isActive = item.dropdown.some((link) => pathname.startsWith(link.href));
                return (
                  <button
                    type="button"
                    className={`group relative flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      isActive ? "text-brand-red" : "hover:text-brand-red"
                    }`}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.label}
                    {item.caret && <span className="text-[11px]">▼</span>}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-brand-red transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
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
      <div className="flex items-center gap-3 text-white xl:gap-4 relative">
        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="absolute right-full mr-4 z-50 flex items-center bg-white rounded-full px-2 py-1 shadow-md w-[266px] border border-slate-200">
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
            className="p-1 text-lg transition-opacity hover:opacity-70" 
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        <span className="hidden font-light text-white/70 lg:inline">|</span>
        
        {/* Language Selector */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
          >
            <Image 
              src={language === 'en' ? "/en-flag.png" : "/kh-flag.png"} 
              alt={language === 'en' ? "English" : "Khmer"} 
              width={30} 
              height={20}
              className="h-6 w-auto"
            />
            <span className="text-[11px]">▼</span>
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

        <Link
          href="/contact-us"
          className="ml-2 whitespace-nowrap bg-brand-red px-6 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#c91e21]"
        >
          {t.nav.contact}
        </Link>
      </div>
    </div>
  );
}
