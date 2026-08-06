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
import type { CareerRole } from "@/data/site-content";
import { getCareer } from "@/data/site-content";

// Hero background image - Team collaboration
const heroImage = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80";

type Props = {
  job: CareerRole;
};

export function JobDetailClient({ job: propJob }: Props) {
  const { t, language, setLanguage } = useLanguage();
  const job = getCareer(propJob.slug, language) || propJob;
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
        <section className="relative min-h-[50vh] overflow-hidden lg:min-h-[55vh]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Career opportunity"
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
                    />
                  </Link>
                  <nav className="flex items-center gap-8 text-[15px] font-medium text-white">
                    <Link href="/about" className="group relative transition hover:text-white/80">{t.nav.about}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <div className="group relative">
                      <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">{t.nav.business}<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <Link href="/services" className="group relative transition hover:text-white/80">{t.nav.services}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">{t.nav.products}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">{t.nav.blog}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    {/* Careers - Active */}
                    <Link href="/careers" className="group relative transition hover:text-white/80">{t.nav.careers}<span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
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
                    <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">{t.nav.contact}</Link>
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
                            placeholder={t.nav.searchPlaceholder}
                            className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner"
                          />
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
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex min-h-[calc(50vh-100px)] items-center py-16 lg:min-h-[calc(55vh-100px)] lg:py-0">
              <div className="max-w-3xl">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
                  <Link href="/" className="hover:text-white transition">
                    Home
                  </Link>
                  <span>/</span>
                  <Link href="/careers" className="hover:text-white transition">{t.nav.careers}</Link>
                  <span>/</span>
                  <span className="text-white">{job.title}</span>
                </nav>

                <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {job.title}
                </h1>

                {/* Job Meta Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.position}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-red/80 px-3 py-1.5 text-sm font-medium text-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {language === 'kh' ? "ថ្ងៃផុតកំណត់:" : "Deadline:"} {job.deadline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="space-y-12">
              {/* Job Description */}
              {job.description && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-navy">{language === 'kh' ? "អំពីតួនាទី" : "About the Role"}</h2>
                  <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-600">
                    <p dangerouslySetInnerHTML={{ __html: job.description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                  </div>
                </div>
              )}

              {/* Key Responsibilities */}
              {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-navy">{language === 'kh' ? "ទំនួលខុសត្រូវសំខាន់ៗ" : "Key Responsibilities"}</h2>
                  <ul className="space-y-3">
                    {job.keyResponsibilities.map((responsibility, index) => (
                      <li key={index} className="flex gap-3 text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-red" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-navy">{language === 'kh' ? "តម្រូវការ" : "Requirements"}</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex gap-3 text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-red" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What We Offer */}
              {job.whatWeOffer && job.whatWeOffer.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-navy">{language === 'kh' ? "អ្វីដែលយើងផ្តល់ជូន" : "What We Offer"}</h2>
                  <ul className="space-y-3">
                    {job.whatWeOffer.map((offer, index) => (
                      <li key={index} className="flex gap-3 text-slate-600">
                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{offer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to Apply */}
              <div className="rounded-2xl bg-slate-50 p-8">
                <h2 className="mb-4 text-2xl font-bold text-brand-navy">{language === 'kh' ? "របៀបដាក់ពាក្យ" : "How to Apply"}</h2>
                {job.howToApply ? (
                  <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-600">
                    <p dangerouslySetInnerHTML={{ __html: job.howToApply.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/_(.*?)_/g, "<em>$1</em>") }} />
                  </div>
                ) : (
                  <p className="text-slate-600">
                    {language === 'kh' ? "ផ្ញើប្រវត្តិរូបសង្ខេប និងលិខិតចំណាប់អារម្មណ៍របស់អ្នកទៅកាន់" : "Send your CV and cover letter to"}{" "}
                    <a href="mailto:recruitment@dhinimex.com" className="font-semibold text-brand-navy hover:underline">
                      recruitment@dhinimex.com
                    </a>{" "}
                    {language === 'kh' ? "ជាមួយនឹងប្រធានបទ:" : "with the subject line:"} <strong>&quot;{job.title}&quot;</strong>
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href="mailto:recruitment@dhinimex.com"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {language === 'kh' ? "ដាក់ពាក្យឥឡូវនេះ" : "Apply Now"}
                  </a>
                  <Link
                    href="/careers"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {language === 'kh' ? "មើលការងារទាំងអស់" : "View All Jobs"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-navy py-16">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">
              {language === 'kh' ? "មិនមែនជាជម្រើសត្រឹមត្រូវមែនទេ?" : "Not the right fit?"}
            </h2>
            <p className="mb-8 text-white/70">
              {language === 'kh' ? "ស្វែងរកមុខតំណែងដែលបើកផ្សេងទៀត ឬផ្ញើប្រវត្តិរូបសង្ខេបរបស់អ្នកមកយើងសម្រាប់ឱកាសនាពេលអនាគត។" : "Explore other open positions or send us your CV for future opportunities."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition hover:bg-slate-100"
              >
                {language === 'kh' ? "មើលមុខតំណែងទាំងអស់" : "Browse All Positions"}
              </Link>
              <a
                href="mailto:recruitment@dhinimex.com"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {language === 'kh' ? "ផ្ញើប្រវត្តិរូបសង្ខេបរបស់អ្នក" : "Send Your CV"}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

