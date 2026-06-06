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

const heroImage = "/business-manufacturing-hero.jpg";

const getCompanies = (language: string) => [
  {
    name: language === 'kh' ? "ក្រុមហ៊ុន ខ្មែរខនគ្រីត ចំកាត់" : "Khmer Concrete Co., LTD",
    description: language === 'kh' ? "រោងចក្រ ខ្មែរខនគ្រីត (KCC) ដែលមានមូលដ្ឋាននៅខេត្តកណ្តាល គឺជាក្រុមហ៊ុនផលិតផលិតផលបេតុងដ៏រឹងមាំ និងមានគុណភាពខ្ពស់ឈានមុខគេ។ គ្រឿងបរិក្ខារទំនើបរបស់យើងផលិតបង្គោលបេតុង បំពង់ និងសមាសភាគហេដ្ឋារចនាសម្ព័ន្ធផ្សេងទៀត។" : "Khmer Concrete Factory (KCC), based in Kandal Province, is a leading manufacturer of durable and high-quality concrete products. Our state-of-the-art facility produces concrete poles, pipes, and other infrastructure components.",
    link: "/business/manufacturing/khmer-concrete",
    image: "/kcc.jpg",
    logo: "/brands/ALL-LOGO-12.png",
    specialty: language === 'kh' ? "ផលិតផលបេតុង" : "Concrete Products"
  },
  {
    name: language === 'kh' ? "ក្រុមហ៊ុន វង្ស ចាន់ ខេបល ចំកាត់" : "Vong Chan Cable Co., LTD",
    description: language === 'kh' ? "វង្ស ចាន់ ខេបល គឺជាក្រុមហ៊ុនផលិតខ្សែភ្លើង LV/MV គុណភាពខ្ពស់ដែលបំពេញតាមស្តង់ដារអន្តរជាតិ។ ខ្សែភ្លើងរបស់យើងត្រូវបានប្រើប្រាស់នៅក្នុងបណ្តាញចែកចាយថាមពលទូទាំងប្រទេសកម្ពុជា។" : "Vong Chan Cable is a manufacturer of high-quality LV/MV cables that meet international standards. Our cables are used in power distribution networks across Cambodia.",
    link: "/business/manufacturing/vong-chan-cable",
    image: "/vcc.jpg",
    logo: "/brands/ALL-LOGO-11.png",
    specialty: language === 'kh' ? "ខ្សែភ្លើង LV/MV" : "LV/MV Cables"
  },
  {
    name: language === 'kh' ? "ក្រុមហ៊ុន សេករាជ ត្រង់ស្វូ ចំកាត់" : "Saekaraj Transfo Co., LTD",
    description: language === 'kh' ? "សេករាជ ត្រង់ស្វូ ដែលជាក្រុមហ៊ុនផលិតត្រង់ស្វូម៉ាទ័រដំបូងគេនៅកម្ពុជា ផ្តល់នូវត្រង់ស្វូម៉ាទ័រគុណភាពខ្ពស់ និងសេវាកម្មថែទាំទូទាំងប្រទេស ដើម្បីគាំទ្រដល់ហេដ្ឋារចនាសម្ព័ន្ធថាមពលដែលអាចទុកចិត្តបាន។" : "Saekaraj Transfo, Cambodia's first transformer manufacturer, delivers high-quality transformers and nationwide maintenance services to support reliable power infrastructure.",
    link: "/business/manufacturing/saekaraj-transfo",
    image: "/saekaraj.jpg",
    logo: "/brands/ALL-LOGO-13.png",
    specialty: language === 'kh' ? "ត្រង់ស្វូម៉ាទ័រ" : "Transformers"
  },
];

export default function ManufacturingPage() {
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
            <Image src={heroImage} alt="Manufacturing" fill priority className="object-cover" sizes="100vw" />
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
                        <Link href="/business/manufacturing" className="block rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-brand-red">{t.business.manufacturing}</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.electricity}</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.water}</Link>
                        <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.scientific}</Link>
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
                  <span className="text-sm font-medium text-brand-red">{t.business.manufacturing}</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{t.business.manufacturing}</h1>
                <p className="max-w-xl text-lg text-white/80">
                  {language === 'kh' ? "ការរួមបញ្ចូលបញ្ឈរតាមរយៈការផលិតត្រង់ស្វូម៉ាទ័រ ខ្សែភ្លើង និងផលិតផលបេតុងនៅក្នុងស្រុក ធានាបាននូវការត្រួតពិនិត្យគុណភាព និងការផ្គត់ផ្គង់ដែលអាចទុកចិត្តបាន។" : "Vertical integration through in-house manufacturing of transformers, cables, and concrete products ensures quality control and reliable supply."}
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/20">
                      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{companies.length}</p>
                      <p className="text-sm text-white/60">{language === 'kh' ? "រោងចក្រ" : "Factories"}</p>
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
                      <p className="text-2xl font-bold text-white">ISO</p>
                      <p className="text-sm text-white/60">{language === 'kh' ? "ទទួលស្គាល់" : "Certified"}</p>
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
                {language === 'kh' ? "រោងចក្ររបស់យើង" : "Our Facilities"}
              </p>
              <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
                {language === 'kh' ? "ផ្នែកផលិតកម្ម" : "Manufacturing Division"}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                {language === 'kh' ? "រោងចក្រទំនើបផលិតសមាសភាគហេដ្ឋារចនាសម្ព័ន្ធគុណភាពខ្ពស់" : "State-of-the-art facilities producing high-quality infrastructure components"}
              </p>
            </div>

            {/* Companies Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company, index) => (
                <article
                  key={company.name}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={company.image}
                      alt={company.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Floating badge */}
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-navy backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-brand-red" />
                        {company.specialty}
                      </span>
                    </div>

                    {/* Logo and Name */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 p-2 shadow-lg backdrop-blur-md ring-1 ring-white/30">
                        <Image
                          src={company.logo}
                          alt={`${company.name} logo`}
                          width={46}
                          height={46}
                          className="object-contain drop-shadow-md"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-white drop-shadow-lg">
                        {company.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="relative p-6">
                    {/* Decorative line */}
                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-red via-brand-navy to-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {company.description}
                    </p>
                    <Link
                      href={company.link}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy transition-all group-hover:gap-3 group-hover:text-brand-red"
                    >
                      {language === 'kh' ? "ស្វែងយល់បន្ថែម" : "Learn More"}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
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
              {language === 'kh' ? "ទាក់ទងមកយើងដើម្បីស្វែងយល់បន្ថែមអំពីសមត្ថភាពផលិត និងដំណោះស្រាយរបស់យើង។" : "Contact us to learn more about our manufacturing capabilities and solutions."}
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
