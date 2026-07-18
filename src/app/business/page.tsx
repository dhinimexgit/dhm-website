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

// Optimized timeline photos (WebP) labelled by year + company name.
const TL = "/biz-portfolio-timeline/optimized/v2";

// Company milestones data.
// Displayed text (title/subtitle/description/events) is pulled from translations
// (t.businessPage.milestones); the events array length here MUST stay in sync with it.
// Events without a supplied photo fall back to a generic era image.
const milestones = [
  {
    id: "founding",
    yearRange: "2003 – 2004",
    title: "Where Dhinimex Started",
    subtitle: "First Steps to Create Tomorrow",
    description:
      "Dhinimex Co., Ltd. was founded in 2003 as a trade-based supplier of electrical equipment and water-supply components, and as the headquarters of the group. Within a year it secured its first rural electricity distribution concession, laying the foundation for a diversified infrastructure group.",
    image: `${TL}/2003-2004-start.webp`,
    events: [
      { year: "2003", description: "Dhinimex Co., Ltd (DHM) founded as trading company and group HQ", image: `${TL}/2003-dhm.webp` },
      { year: "2004", description: "Toukmeas Electricity — first rural electricity distribution concession", image: `${TL}/2004-toukmeas.webp` },
    ],
  },
  {
    id: "utilities",
    yearRange: "2006 – 2010",
    title: "Powering & Supplying Communities",
    subtitle: "Electricity and Water for the Provinces",
    description:
      "The group expanded into provincial electricity and potable water concessions, growing its electricity distribution network across Kiensvay, Dangtong and eastern Cambodia and launching its first potable water supplies. This period transformed Dhinimex from a trader into an integrated utilities provider.",
    image: `${TL}/2006-2010-powering-communities.webp`,
    events: [
      { year: "2006", description: "Electricity of Kiensvay (Elek)", image: `${TL}/2006-elek.webp` },
      { year: "2008", description: "Dangtong Electricity", image: `${TL}/2008-dangtong.webp` },
      { year: "2009", description: "Eastern Power Supply Enterprise (Epose)", image: `${TL}/2009-epose.webp` },
      { year: "2009", description: "Chhouk & Chumkiri Water — first potable water concession", image: `${TL}/2009-chhouk.webp` },
      { year: "2010", description: "Toukmeas Water", image: `${TL}/2010-toukmeas-water.webp` },
    ],
  },
  {
    id: "manufacturing",
    yearRange: "2010 – 2018",
    title: "Building & Manufacturing",
    subtitle: "Vertical Integration for Quality Control",
    description:
      "Dhinimex scaled up in-house fabrication and retail, opening the Khmer Concrete pole factory, Saekaraj transformer factory and Vong Chan cable factory, while launching the Nicole Home Mart retail business and adding new water operations. Vertical integration enabled end-to-end EPC delivery.",
    image: `${TL}/2010-2018-building-manufacturing.webp`,
    events: [
      { year: "2010", description: "Khmer Concrete Co., Ltd (KCC) — concrete pole factory", image: `${TL}/2010-kcc.webp` },
      { year: "2011", description: "Nicole Home Mart — retail mart for tools and equipment", image: `${TL}/2011-nicolehomemart.webp` },
      { year: "2013", description: "Saekaraj Transfo — distribution transformer factory", image: `${TL}/2013-saekaraj.webp` },
      { year: "2015", description: "Tek Pong Traj — potable water supply", image: `${TL}/2015-pong-traj.webp` },
      { year: "2018", description: "Vong Chan Cable Co., Ltd (VCC) — wire and cable factory", image: `${TL}/2018-vcc.webp` },
    ],
  },
  {
    id: "investment",
    yearRange: "2019 – Present",
    title: "Diversification & Innovation",
    subtitle: "Healthcare, Food-Tech and New Frontiers",
    description:
      "Today Dhinimex Group spans trading, manufacturing, electricity, water and scientific sectors. Recent years added the CamRad medical diagnostic center and the CamIrrad E-Beam food irradiation facility, alongside new potable water operations — reflecting the group's move into healthcare and food technology.",
    image: `${TL}/2019-present.webp`,
    events: [
      { year: "2019", description: "CamRad — medical diagnostic center", image: `${TL}/2019-camrad.webp` },
      { year: "2019", description: "Thpong Water — potable water supply", image: `${TL}/2019-thpong-water.webp` },
      { year: "2020", description: "Tek Pong Teuk — potable water supply", image: `${TL}/202-tek-pong-teuk.webp` },
      { year: "2023", description: "CamIrrad Center Co., Ltd — E-Beam food irradiation", image: `${TL}/2023-camirrad.webp` },
    ],
  },
];

// Investment portfolio logos
const investmentLogos = [
  { name: "ThiPha Cable", logo: "/brands/ALL-LOGO-01.png" },
  { name: "Mitsubishi Electric", logo: "/brands/ALL-LOGO-02.png" },
  { name: "LS VINA", logo: "/brands/ALL-LOGO-03.png" },
  { name: "Black+Decker", logo: "/brands/ALL-LOGO-05.png" },
  { name: "Stanley", logo: "/brands/ALL-LOGO-06.png" },
  { name: "Hi-Min Solar", logo: "/brands/ALL-LOGO-07.png" },
  { name: "Partner 8", logo: "/brands/ALL-LOGO-08.png" },
  { name: "Partner 9", logo: "/brands/ALL-LOGO-09.png" },
  { name: "Partner 10", logo: "/brands/ALL-LOGO-10.png" },
];

export default function BusinessPortfolioPage() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
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
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
        setIsPastHero(window.scrollY > heroBottom - 200);
      }
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible (has highest intersection ratio)
        let mostVisibleIndex = -1;
        let highestRatio = 0;
        
        entries.forEach((entry) => {
          const index = sectionRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1 && entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            mostVisibleIndex = index;
            highestRatio = entry.intersectionRatio;
          }
        });
        
        if (mostVisibleIndex !== -1) {
          setActiveSection(mostVisibleIndex);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], rootMargin: "-10% 0px -10% 0px" }
    );
    sectionRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  const logosPerPage = 5;
  const totalPages = Math.ceil(investmentLogos.length / logosPerPage);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalPages);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalPages) % totalPages);
  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <StickyHeader isVisible={isScrolled} />

      <div>
        {/* Hero Banner Section */}
        <section ref={heroRef} className="relative min-h-[70vh] overflow-hidden lg:min-h-[80vh]">
          <div className="absolute inset-0 z-0">
            {/* Same hero banner asset as the home page */}
            <video
              src="/home-hero.mp4"
              autoPlay
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            {/* Slightly darker on the left to keep the hero text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
          </div>

          {/* Header - Desktop Only */}
          <div className="relative z-30 hidden lg:block">
            <div className="mx-auto max-w-7xl px-8 pt-6">
              <div className="relative rounded-xl bg-brand-navy shadow-lg">
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
            <div className="flex min-h-[calc(70vh-120px)] items-center py-16 lg:min-h-[calc(80vh-120px)] lg:py-0">
              <div className="max-w-2xl space-y-6">
                <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">
                  
                  {t.nav.business}
                </p>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-[64px] xl:leading-[1.1]">
                  {t.businessPage.hero.title}
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  {t.businessPage.hero.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Elegant Side Navigation - Only visible after hero */}
        <div className={`fixed right-6 top-1/2 z-40 -translate-y-1/2 transition-all duration-500 ${
          isPastHero ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
        } hidden lg:block`}>
          <div className="relative flex flex-col items-end">
            {/* Vertical line connecting all dots */}
            <div className="absolute right-[5px] top-2 bottom-2 w-px bg-slate-300" />
            
            {milestones.map((milestone, index) => (
              <button
                key={milestone.id}
                onClick={() => scrollToSection(index)}
                className="group relative flex items-center gap-4 py-3"
                aria-label={`Go to ${milestone.yearRange}`}
              >
                {/* Year label - appears on hover or when active */}
                <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                  activeSection === index 
                    ? "bg-brand-navy text-white opacity-100" 
                    : "bg-slate-100 text-slate-600 opacity-0 group-hover:opacity-100"
                }`}>
                  {milestone.yearRange}
                </span>
                
                {/* Dot indicator */}
                <span className={`relative z-10 h-3 w-3 rounded-full transition-all duration-300 ${
                  activeSection === index 
                    ? "bg-brand-red scale-150" 
                    : "bg-slate-400 group-hover:bg-brand-navy group-hover:scale-125"
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Milestone Sections */}
        {milestones.map((milestone, index) => {
          const isEven = index % 2 === 0;
          const localizedMilestone = t.businessPage.milestones[index];
          
          return (
            <section
              key={milestone.id}
              ref={(el) => { sectionRefs.current[index] = el; }}
              className="relative overflow-hidden"
            >
              {/* Full-width header band */}
              <div className="relative overflow-hidden bg-brand-navy py-16 lg:py-24">
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="grid items-center gap-8 lg:grid-cols-2">
                    {/* Text content */}
                    <div className={`text-white ${isEven ? "" : "lg:order-2"}`}>
                      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
                        {localizedMilestone.subtitle}
                      </p>
                      <h2 className="mb-4 text-3xl font-bold lg:text-4xl xl:text-5xl">
                        {localizedMilestone.title}
                      </h2>
                      <p className="text-base leading-relaxed text-white/80 lg:text-lg">
                        {localizedMilestone.description}
                      </p>
                    </div>
                    
                    {/* Large year + image */}
                    <div className={`relative ${isEven ? "" : "lg:order-1"}`}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                        <Image src={milestone.image} alt={localizedMilestone.title} fill className="object-cover" />
                        {/* Slight dark overlay so the white year text stays readable */}
                        <div className="absolute inset-0 bg-black/35" />
                        {/* Large year overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`font-semibold tracking-wider text-white/90 ${
                            milestone.id === "investment"
                              ? "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
                              : "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl"
                          }`}>
                            {milestone.yearRange}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline events section */}
              <div className="relative bg-gradient-to-b from-slate-50 to-white py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  {/* Central timeline line */}
                  <div className="absolute left-1/2 top-16 bottom-16 hidden w-0.5 -translate-x-1/2 bg-slate-300 lg:block" />
                  
                  <div className="space-y-8 lg:space-y-0">
                    {milestone.events.map((event, eventIndex) => {
                      const isLeft = eventIndex % 2 === 0;
                      const isLast = eventIndex === milestone.events.length - 1;
                      const localizedEventDescription = localizedMilestone.events[eventIndex];
                      
                      return (
                        <div key={`${milestone.id}-${eventIndex}`} className="relative lg:grid lg:grid-cols-2 lg:gap-10">
                          {/* Timeline dot - center */}
                          <div className="absolute left-1/2 top-8 z-10 hidden -translate-x-1/2 lg:block">
                            <div className="relative">
                              {/* Vertical line segment to next dot */}
                              {!isLast && (
                                <div className="absolute left-1/2 top-4 h-[calc(100%+8rem)] w-0.5 -translate-x-1/2 bg-slate-300" />
                              )}
                              {/* The dot itself */}
                              <div className="relative z-10 h-4 w-4 rounded-full border-4 border-white bg-brand-red shadow-lg" />
                              {/* Connector line to card */}
                              <div className={`absolute top-1/2 h-px w-12 -translate-y-1/2 bg-slate-300 ${isLeft ? "right-4" : "left-4"}`} />
                            </div>
                          </div>
                          
                          {/* Card - alternating sides */}
                          <div className={`${isLeft ? "lg:pr-10" : "lg:col-start-2 lg:pl-10"}`}>
                            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                              {/* Image */}
                              <div className="relative aspect-[16/9] overflow-hidden">
                                <Image
                                  src={event.image}
                                  alt={event.year}
                                  fill
                                  sizes="(max-width: 1024px) 100vw, 620px"
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                
                                {/* Year badge on image */}
                                <div className="absolute bottom-4 left-4">
                                  <span className="inline-block rounded-lg bg-brand-red px-4 py-2 text-2xl font-bold text-white shadow-lg">
                                    {event.year}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="p-6">
                                <p className="text-sm leading-relaxed text-slate-600">
                                  {localizedEventDescription}
                                </p>
                              </div>
                              
                              {/* Decorative accent */}
                              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-brand-red to-brand-navy opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                          </div>
                          
                          {/* Spacer for alternating layout */}
                          {isLeft && <div className="hidden lg:block" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
