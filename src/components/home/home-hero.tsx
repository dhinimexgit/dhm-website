"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "./sticky-header";
import { useLanguage } from "@/lib/i18n";
import { NavAdminLoginLink } from "@/components/layout/nav-admin-login-link";
import {
  NavUtilityCluster,
  NavUtilityDivider,
  NAV_UTILITY_ICON_CLASS,
} from "@/components/layout/nav-utility-cluster";
import { getHeroContent } from "@/data/site-content";

// 5 placeholder images for the carousel
const heroImages = [
  "/kcc-3.jpg",
  "/kcc.jpg",
  "/saekaraj-2.jpg",
];

export function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const heroContent = getHeroContent(language);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setContentVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      {mounted ? (
        <StickyHeader isVisible={isScrolled} />
      ) : (
        <header 
          suppressHydrationWarning
          className="fixed inset-x-0 top-0 z-50 hidden lg:block transition-all duration-300 -translate-y-full opacity-0"
          aria-hidden="true"
        />
      )}
      <section ref={heroRef} className="relative flex min-h-screen flex-col overflow-hidden">
        {/* Background Video with Glassmorphism Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            src="/home-hero.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Dark semi-transparent overlay for glassmorphism effect */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Gradient for depth and text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/50 via-black/20 to-transparent" />
        </div>

        {/* Header - Desktop Only */}
        <div className="relative z-30 hidden lg:block">
          <div className="mx-auto max-w-7xl px-8 pt-6">
            <div className="relative rounded-xl bg-brand-navy shadow-lg">
              <div className="flex items-center justify-between px-8 py-4">
                <Link href="/" className="flex-shrink-0">
                  <Image
                    src="/brands/DHM-WHITE.png"
                    alt="Dhinimex logo"
                    width={160}
                    height={46}
                    priority
                    className="h-auto w-[160px]"
                    unoptimized
                  />
                </Link>
                <nav className="flex items-center gap-8 text-[15px] font-medium text-white">
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
                    className="rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c91e21] hover:shadow-md"
                  >
                    {t.nav.contact}
                  </Link>
                </div>
              </div>

              {/* Search Dropdown - Absolutely positioned below navbar within rounded container */}
              {searchOpen && (
                <div 
                  ref={searchPanelRef}
                  className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-2xl"
                >
                  <div className="px-8 py-4">
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
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-1 items-center justify-center px-6 py-12 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Side - Text Content */}
            <div
              className={`flex flex-col items-center justify-center space-y-8 text-center transition-all duration-1000 ease-out lg:items-start lg:text-left ${
                contentVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0 lg:translate-x-32"
              }`}
            >
              <div className="space-y-6">
                {/* <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-red">
                  <span className="h-px w-10 bg-brand-red" />
                    <strong className="text-lg text-brand-navy">Since 2003</strong>
                </p> */}
                <h1 className="text-3xl font-bold leading-tight text-white sm:text-3xl lg:text-6xl xl:text-[62px] xl:leading-[1.1]">
                  {heroContent.title}
                </h1>
                <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/80 lg:mx-0 lg:text-xl">
                  {heroContent.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-navy hover:text-white"
                >
                  {t.home.hero.learnMore}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Side - Image/Video Carousel */}
            <div
              className={`relative mx-auto w-full max-w-xl transition-all duration-1000 ease-out lg:mx-0 lg:max-w-none ${
                contentVisible ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
                {heroImages.map((img, index) => (
                  <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Dhinimex operations ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
                  </div>
                ))}
                
                {/* Carousel Indicators */}
                <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand-red/20 blur-3xl" />
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
