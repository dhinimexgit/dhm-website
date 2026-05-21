"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { NavAdminLoginLink } from "@/components/layout/nav-admin-login-link";
import {
  NavUtilityCluster,
  NavUtilityDivider,
  NAV_UTILITY_ICON_CLASS,
} from "@/components/layout/nav-utility-cluster";
import { StickyHeader } from "@/components/home/sticky-header";

// Hero background image - Team collaboration in modern workspace
const heroImage = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80";

// Career role type
type CareerRole = {
  slug: string;
  title: string;
  location: string;
  position: string;
  deadline: string;
  summary: string;
  department?: string;
};

// Categories for filtering
const categories = [
  "View all",
  "Engineering",
  "Technical",
  "Operations",
  "Management",
  "Sales",
  "Administration",
];

export default function CareersPage() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("View all");
  const [careers, setCareers] = useState<CareerRole[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch careers from API
  useEffect(() => {
    async function fetchCareers() {
      try {
        const res = await fetch("/api/careers");
        if (res.ok) {
          const data = await res.json();
          setCareers(data);
        }
      } catch (error) {
        console.error("Error fetching careers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  // Filter careers based on active filter
  const filteredCareers = activeFilter === "View all" 
    ? careers 
    : careers.filter(career => {
        const title = career.title.toLowerCase();
        const filter = activeFilter.toLowerCase();
        if (filter === "engineering") return title.includes("engineer") || title.includes("technical");
        if (filter === "technical") return title.includes("technical") || title.includes("technician");
        if (filter === "operations") return title.includes("operations") || title.includes("operator");
        if (filter === "management") return title.includes("manager") || title.includes("director") || title.includes("lead");
        if (filter === "sales") return title.includes("sales") || title.includes("account") || title.includes("business development");
        if (filter === "administration") return title.includes("admin") || title.includes("hr") || title.includes("finance");
        return true;
      });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

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
      <StickyHeader isVisible={isScrolled} />

      <div className="min-h-screen bg-white">
        {/* Hero Section with Background Image */}
        <section className="relative min-h-[60vh] overflow-hidden lg:min-h-[70vh]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Modern office"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>

          {/* Header - Desktop Only */}
          <div className="relative z-30 hidden lg:block">
            <div className="mx-auto max-w-7xl px-8 pt-6">
              <div className="relative rounded-xl bg-brand-navy shadow-lg shadow-brand-navy/20">
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
                      About Us
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <div className="group relative">
                      <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">
                        Business Portfolio
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Trading</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Manufacturing</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Electricity Distribution</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Water Supply</Link>
                        <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Scientific</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">
                      Services
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">
                      Products
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">
                      News
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    {/* Careers - Active */}
                    <Link href="/careers" className="group relative transition hover:text-white/80">
                      Careers
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
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
                      onClick={() => setLanguage(language === 'en' ? 'kh' : 'en')}
                      className={`${NAV_UTILITY_ICON_CLASS} px-1.5`}
                      aria-label="Toggle Language"
                    >
                      <Image
                        src={language === 'en' ? "/kh-flag.png" : "/en-flag.png"}
                        alt={language === 'en' ? "Khmer" : "English"}
                        width={30}
                        height={20}
                        className="h-4 w-auto rounded-sm"
                      />
                    </button>
                    <NavUtilityDivider />
                    <NavAdminLoginLink />
                  </NavUtilityCluster>
                    <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                      Contact Us
                    </Link>
                  </div>
                </div>

                {/* Search Dropdown */}
                {searchOpen && (
                  <div
                    ref={searchPanelRef}
                    className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-2xl"
                  >
                    <div className="px-8 py-4">
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for services, products, careers..."
                            className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner"
                          />
                        </div>
                        <button type="submit" className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy/90">Search</button>
                        <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">Cancel</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex min-h-[calc(60vh-100px)] items-center py-16 lg:min-h-[calc(70vh-100px)] lg:py-0 lg:pt-4">
              <div className="max-w-2xl space-y-6">
                {/* Subtitle */}
                <div className="mb-6 inline-flex items-center gap-3">
                  <span className="h-px w-12 bg-brand-red" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                    {t.careersPage.hero.sectionTitle}
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {t.careersPage.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
                  {t.careersPage.hero.description}
                </p>

                {/* Stats Row */}
                <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-white/20 pt-10">
                  <div>
                    <p className="text-3xl font-bold text-white">21+</p>
                    <p className="mt-1 text-sm text-white/60">{t.careersPage.hero.stats.years}</p>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div>
                    <p className="text-3xl font-bold text-white">500+</p>
                    <p className="mt-1 text-sm text-white/60">{t.careersPage.hero.stats.team}</p>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div>
                    <p className="text-3xl font-bold text-white">5</p>
                    <p className="mt-1 text-sm text-white/60">{t.careersPage.hero.stats.sectors}</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-wrap gap-4 mb-6">
                  <a
                    href="#open-positions"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]"
                  >
                    {t.careersPage.hero.viewPositions}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </a>
                  <a
                    href="mailto:recruitment@dhinimex.com"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    {t.careersPage.hero.sendCv}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section id="open-positions" className="relative bg-white pb-24 scroll-mt-20">
          {/* Section Header */}
          <div className="border-b border-slate-100 bg-slate-50/50 py-6">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-brand-navy">{t.careersPage.positions.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredCareers.length} {filteredCareers.length === 1 ? t.careersPage.positions.roleAvailable : t.careersPage.positions.rolesAvailable}
                  </p>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveFilter(category)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        activeFilter === category
                          ? "bg-brand-navy text-white"
                          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
            <div className="divide-y divide-slate-100">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-8 animate-pulse">
                    <div className="h-7 w-64 rounded bg-slate-200 mb-3" />
                    <div className="h-5 w-96 rounded bg-slate-100 mb-4" />
                    <div className="flex gap-3">
                      <div className="h-7 w-28 rounded-full bg-slate-100" />
                      <div className="h-7 w-24 rounded-full bg-slate-100" />
                    </div>
                  </div>
                ))
              ) : filteredCareers.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                    <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-brand-navy">{t.careersPage.positions.empty.title}</h3>
                  <p className="mx-auto max-w-md text-slate-500">
                    {activeFilter === "View all" 
                      ? t.careersPage.positions.empty.allDesc
                      : t.careersPage.positions.empty.filterDesc
                    }
                  </p>
                </div>
              ) : (
                filteredCareers.map((role, index) => (
                  <article 
                    key={role.slug} 
                    className="group relative py-8"
                  >
                    {/* Number indicator */}
                    <span className="absolute left-0 top-8 hidden text-[10px] font-medium text-slate-300 lg:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:pl-10">
                      {/* Left Content */}
                      <div className="flex-1">
                        <Link 
                          href={`/careers/${role.slug}`}
                          className="inline-block"
                        >
                          <h3 className="text-xl font-semibold text-brand-navy transition-colors group-hover:text-brand-red sm:text-2xl">
                            {role.title}
                          </h3>
                        </Link>
                        <p className="mt-2 leading-relaxed text-slate-600">
                          {role.summary}
                        </p>
                        
                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                            <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {role.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                            <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {role.position}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-red/10 px-3 py-1.5 text-xs font-medium text-brand-red">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {t.careersPage.positions.deadline} {role.deadline}
                          </span>
                        </div>
                      </div>

                      {/* Apply Link */}
                      <Link
                        href={`/careers/${role.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-brand-navy/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition-all hover:border-brand-red hover:bg-brand-red hover:text-white sm:mt-0"
                      >
                        {t.careersPage.positions.apply}
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-brand-navy py-24">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/10" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              {t.careersPage.cta.title}
            </h2>
            <p className="mb-10 text-lg text-white/70">
              {t.careersPage.cta.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:recruitment@dhinimex.com"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-brand-navy shadow-lg transition hover:bg-slate-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t.careersPage.cta.sendCv}
              </a>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {t.careersPage.cta.contact}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
