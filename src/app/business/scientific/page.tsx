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

const heroImage = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=80";

const getCompanies = (language: string) => [
  {
    name: language === 'kh' ? "មជ្ឈមណ្ឌលរោគវិនិច្ឆ័យ ខេមរ៉ាដ" : "CamRad Diagnostic Center",
    description: language === 'kh' ? "មជ្ឈមណ្ឌលរោគវិនិច្ឆ័យ ខេមរ៉ាដ នៅរាជធានីភ្នំពេញ ផ្តល់នូវសេវាកម្មរូបភាពវេជ្ជសាស្ត្រ និងមន្ទីរពិសោធន៍ដែលមានគុណភាពខ្ពស់ និងអាចទុកចិត្តបាន ដោយមានជំនាញលើការថត CT ស្កេន និងកាំរស្មីអ៊ិច ដើម្បីគាំទ្រដល់ការធ្វើរោគវិនិច្ឆ័យថែទាំសុខភាពដែលត្រឹមត្រូវ និងគួរឱ្យទុកចិត្ត។" : "CamRad Diagnostic Center in Phnom Penh offers reliable, high-quality imaging and laboratory services, specializing in CT scans and radiology to support accurate and trusted healthcare diagnostics.",
    link: "/business/scientific/camrad",
    image: "/camrad.jpg",
    logo: "/brands/Camrad Logo-01.png",
    specialty: language === 'kh' ? "រូបភាពវេជ្ជសាស្ត្រ និងរោគវិនិច្ឆ័យ" : "Medical Imaging & Diagnostics"
  },
  {
    name: language === 'kh' ? "ខេមអុីរ៉ាដ – រោងចក្របញ្ចេញកាំរស្មីអេឡិចត្រុង" : "Camirrad – Electron Beam Irradiation Facility",
    description: language === 'kh' ? "មជ្ឈមណ្ឌលរោគវិនិច្ឆ័យ និងបញ្ចេញកាំរស្មី ខេមអុីរ៉ាដ គឺជារោងចក្របញ្ចេញកាំរស្មីអេឡិចត្រុងទំនើបដំបូងគេនៅកម្ពុជា ដែលធានាថាផលិតផលម្ហូបអាហារ និងកសិកម្មបំពេញតាមស្តង់ដារសុវត្ថិភាព និងការនាំចេញអន្តរជាតិ។" : "Camirrad Diagnostic & Irradiation Center is Cambodia's first state-of-the-art electron beam facility, ensuring food and agricultural products meet international safety and export standards.",
    link: "/business/scientific/camirrad",
    image: "/biz-portfolio-timeline/optimized/v2/2023-camirrad.webp",
    logo: null,
    specialty: language === 'kh' ? "សុវត្ថិភាពចំណីអាហារ និងការបញ្ចេញកាំរស្មី" : "Food Safety & Irradiation"
  },
];

export default function ScientificPage() {
  const { t, language, setLanguage } = useLanguage();
  const companies = getCompanies(language);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setSearchQuery("");
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

      <div>
        {/* Hero Banner Section */}
        <section className="relative min-h-[60vh] overflow-hidden lg:min-h-[70vh]">
          <div className="absolute inset-0 z-0">
            <Image src={heroImage} alt="Scientific" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-brand-navy/50" />
          </div>

          {/* Header - Desktop Only */}
          <div className="relative z-30 hidden lg:block">
            <div className="mx-auto max-w-7xl px-8 pt-6">
              <div className="relative rounded-xl bg-brand-navy/80 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between px-8 py-4">
                  <Link href="/" className="flex-shrink-0">
                    <Image src="/brands/DHM-WHITE.png" alt="Dhinimex logo" width={160} height={46} priority className="h-auto w-[160px]" />
                  </Link>
                  <nav className="flex items-center gap-8 text-[15px] font-medium text-white">
                    <Link href="/about" className="group relative transition hover:text-white/80">{t.nav.about}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <div className="group relative">
                      <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">{t.nav.business}<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
                      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.trading}</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.manufacturing}</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.electricity}</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.water}</Link>
                        <Link href="/business/scientific" className="block rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-brand-red">{t.business.scientific}</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">{t.nav.services}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">{t.nav.products}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">{t.nav.blog}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/careers" className="group relative transition hover:text-white/80">{t.nav.careers}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                  </nav>
                  <div className="flex items-center gap-3">
                    <NavUtilityCluster>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(!searchOpen)}
                      className={`${NAV_UTILITY_ICON_CLASS} ${searchOpen ? "text-white" : ""}`}
                      aria-label="Search"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
                    <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">{t.nav.contact}</Link>
                  </div>
                </div>
                {searchOpen && (
                  <div ref={searchPanelRef} className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-2xl">
                    <div className="px-8 py-4">
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.nav.searchPlaceholder} className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner" />
                        </div>
                        <button type="submit" className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy/90">{t.nav.searchBtn}</button>
                        <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">{t.nav.cancel}</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex min-h-[calc(60vh-120px)] items-center py-16 lg:min-h-[calc(70vh-120px)] lg:py-0">
              <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                  <Link href="/business" className="text-sm font-medium text-white/70 transition hover:text-white">{t.nav.business}</Link>
                  <span className="text-white/40">/</span>
                  <span className="text-sm font-medium text-brand-red">{t.business.scientific}</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{t.business.scientific}</h1>
                <p className="max-w-xl text-lg text-white/80">
                  {language === 'kh' ? "ជំរុញការថែទាំសុខភាព និងសុវត្ថិភាពចំណីអាហារនៅកម្ពុជា តាមរយៈបច្ចេកវិទ្យារូបភាពរោគវិនិច្ឆ័យដ៏ទំនើប និងបច្ចេកវិទ្យាបញ្ចេញកាំរស្មីអេឡិចត្រុង។" : "Advancing healthcare and food safety in Cambodia through cutting-edge diagnostic imaging and electron beam irradiation technology."}
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/20">
                      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{companies.length}</p>
                      <p className="text-sm text-white/60">{language === 'kh' ? "មជ្ឈមណ្ឌល" : "Facilities"}</p>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/20">
                      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{language === 'kh' ? "ដំបូងគេ" : "First"}</p>
                      <p className="text-sm text-white/60">{language === 'kh' ? "នៅកម្ពុជា" : "In Cambodia"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
                {language === 'kh' ? "មជ្ឈមណ្ឌលរបស់យើង" : "Our Facilities"}
              </p>
              <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
                {language === 'kh' ? "ផ្នែកវិទ្យាសាស្ត្រ" : "Scientific Division"}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                {language === 'kh' ? "ត្រួសត្រាយដំណោះស្រាយវិទ្យាសាស្ត្រកម្រិតខ្ពស់សម្រាប់ការថែទាំសុខភាព និងសុវត្ថិភាពចំណីអាហារ" : "Pioneering advanced scientific solutions for healthcare and food safety"}
              </p>
            </div>

            {/* Companies Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {companies.map((company, index) => (
                <article
                  key={company.name}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={company.image}
                      alt={company.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Floating badge */}
                    <div className="absolute left-6 top-6">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-brand-navy backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-brand-red" />
                        {company.specialty}
                      </span>
                    </div>

                    {/* Logo and Name */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-4">
                      {company.logo && (
                        <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-xl bg-white/20 p-2 shadow-lg backdrop-blur-md ring-1 ring-white/30">
                          <Image
                            src={company.logo}
                            alt={`${company.name} logo`}
                            width={56}
                            height={56}
                            className="object-contain drop-shadow-md"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {company.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="relative p-8">
                    {/* Decorative line */}
                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-red via-brand-navy to-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <p className="mb-6 text-base leading-relaxed text-slate-600">
                      {company.description}
                    </p>
                    <Link
                      href={company.link}
                      className="inline-flex items-center gap-3 text-base font-semibold text-brand-navy transition-all group-hover:gap-4 group-hover:text-brand-red"
                    >
                      {language === 'kh' ? "ស្វែងយល់បន្ថែម" : "Learn More"}
                      <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-brand-navy py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-white lg:text-4xl">
                {language === 'kh' ? "ហេតុអ្វីជ្រើសរើសសេវាកម្មវិទ្យាសាស្ត្ររបស់យើង?" : "Why Choose Our Scientific Services?"}
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-red/20">
                  <svg className="h-7 w-7 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{language === 'kh' ? "ស្តង់ដារអន្តរជាតិ" : "International Standards"}</h3>
                <p className="text-white/70">
                  {language === 'kh' ? "មជ្ឈមណ្ឌលរបស់យើងបំពេញតាមស្តង់ដារគុណភាព និងសុវត្ថិភាពអន្តរជាតិដ៏តឹងរ៉ឹងសម្រាប់ការថែទាំសុខភាព និងសុវត្ថិភាពចំណីអាហារ។" : "Our facilities meet rigorous international quality and safety standards for healthcare and food safety."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-red/20">
                  <svg className="h-7 w-7 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{language === 'kh' ? "បច្ចេកវិទ្យាទំនើបចុងក្រោយ" : "Cutting-Edge Technology"}</h3>
                <p className="text-white/70">
                  {language === 'kh' ? "បរិក្ខារទំនើបៗរួមមានម៉ាស៊ីន CT ស្កេន និងប្រព័ន្ធបញ្ចេញកាំរស្មីអេឡិចត្រុង។" : "State-of-the-art equipment including CT scanners and electron beam irradiation systems."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-red/20">
                  <svg className="h-7 w-7 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{language === 'kh' ? "ក្រុមអ្នកជំនាញ" : "Expert Team"}</h3>
                <p className="text-white/70">
                  {language === 'kh' ? "អ្នកជំនាញដែលទទួលបានការបណ្តុះបណ្តាលកម្រិតខ្ពស់ ជាមួយនឹងជំនាញក្នុងការធ្វើរោគវិនិច្ឆ័យវេជ្ជសាស្ត្រ និងបច្ចេកវិទ្យាសុវត្ថិភាពចំណីអាហារ។" : "Highly trained professionals with expertise in medical diagnostics and food safety technology."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-brand-navy py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          </div>
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              {language === 'kh' ? "មានសំណួរអំពីសេវាកម្មរបស់យើង?" : "Questions About Our Services?"}
            </h2>
            <p className="mb-8 text-lg text-white/80">
              {language === 'kh' ? "ទាក់ទងមកយើងដើម្បីស្វែងយល់បន្ថែមអំពីដំណោះស្រាយរោគវិនិច្ឆ័យ និងការបញ្ចេញកាំរស្មីរបស់យើង។" : "Contact us to learn more about our diagnostic and irradiation solutions."}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-base font-semibold text-white transition hover:bg-[#c91e21]"
              >{t.nav.contact}<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                {language === 'kh' ? "មើលសេវាកម្មទាំងអស់" : "View All Services"}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
