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
import { services, faqs } from "@/data/site-content";
import { FAQAccordion } from "@/components/faq";
import { StickyHeader } from "@/components/home/sticky-header";

// Hero background image
const heroImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80";

// Service category images
const serviceImages = {
  hero: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
  electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
  construction: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  testing: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
  water: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
};

export default function ServicesPage() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setFormSubmitting(false);
    setFormSuccess(true);
    setTimeout(() => {
      setQuoteModalOpen(false);
      setFormSuccess(false);
      setFormData({ name: "", phone: "", service: "", message: "" });
    }, 2000);
  };

  // Close modal on escape or click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuoteModalOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setQuoteModalOpen(false);
      }
    };
    if (quoteModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "";
      };
    }
  }, [quoteModalOpen]);

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

      <div>
        {/* Hero Banner Section */}
        <section className="relative min-h-[70vh] overflow-hidden lg:min-h-[80vh]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Dhinimex Services"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
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
                    {/* Services - Active */}
                    <Link href="/services" className="group relative transition hover:text-white/80">
                      Services
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
                    </Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">
                      Products
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">
                      News
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/careers" className="group relative transition hover:text-white/80">
                      Careers
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
          <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex min-h-[calc(70vh-120px)] items-center py-16 lg:min-h-[calc(80vh-120px)] lg:py-0 lg:pt-4">
              <div className="max-w-2xl space-y-6">
                <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">
                  
                  {t.nav.services}
                </p>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-[64px] xl:leading-[1.1]">
                  {t.servicesPage.hero.title}
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  {t.servicesPage.hero.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-4 mb-6">
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#c91e21]"
                  >
                    {t.servicesPage.hero.requestQuote}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <Link
                    href="#services"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    {t.servicesPage.hero.exploreServices}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do - Intro Section */}
        {/* <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                // 
                What We Do
              </p>
              <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
                Powering Cambodia&apos;s Growth with Expert EPC Solutions
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                For over two decades, Dhinimex has been a trusted name in EPC services—powering 
                electric, water, and industrial infrastructure across Cambodia. Our integrated 
                approach combines manufacturing excellence, expert installation, rigorous testing, 
                and reliable utility operations.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={serviceImages.hero}
                  alt="Dhinimex Services"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-2xl bg-brand-red/10" />
            </div>
          </div>
        </section> */}

        {/* Services Grid Section */}
        <section id="services" className="full-bleed bg-slate-50/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                
                {t.servicesPage.expertise.sectionTitle}
              </p>
              <h2 className="mb-2 text-3xl font-bold text-brand-navy lg:text-4xl">
                {t.servicesPage.expertise.title}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-slate-600">
                {t.servicesPage.expertise.description}
              </p>
            </div>

            {/* Services Cards - Elegant Minimalistic Design */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group relative"
                >
                  <article className="relative h-full overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-xl">
                    {/* Subtle top border accent */}
                    <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-brand-navy via-brand-navy to-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Card Content */}
                    <div className="p-8">
                      {/* Icon & Number Row */}
                      <div className="mb-6 flex items-start justify-between">
                        {/* Icon */}
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 transition-colors duration-300 group-hover:bg-brand-navy">
                          {service.icon.startsWith("/") ? (
                            <Image
                              src={service.icon}
                              alt={service.name}
                              width={28}
                              height={28}
                              className="h-7 w-7 object-contain opacity-70 transition-all duration-300 group-hover:brightness-0 group-hover:invert group-hover:opacity-100"
                            />
                          ) : (
                            <span className="text-2xl text-slate-600 transition-colors duration-300 group-hover:text-white">
                              {service.icon}
                            </span>
                          )}
                        </div>
                        
                        {/* Number */}
                        <span className="text-sm font-medium text-slate-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-lg font-semibold text-brand-navy transition-colors duration-300 group-hover:text-brand-red">
                        {service.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {service.description}
                      </p>

                      {/* Divider */}
                      <div className="mb-5 h-px bg-slate-100" />

                      {/* Highlights - Minimal */}
                      <ul className="mb-6 space-y-2">
                        {service.highlights.slice(0, 2).map((highlight, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="h-1 w-1 rounded-full bg-brand-red" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sm font-medium text-brand-navy transition-colors duration-300 group-hover:text-brand-red">
                        <span>{t.servicesPage.expertise.learnMore}</span>
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-4 inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
              
              {t.servicesPage.process.sectionTitle}
            </p>
            <h2 className="mb-4 text-3xl font-bold text-brand-navy lg:text-4xl">
              {t.servicesPage.process.title}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              {t.servicesPage.process.description}
            </p>
          </div>

          {/* Process Steps - Clean Stepper Design */}
          <div className="relative">
            {/* Horizontal Connecting Line - Desktop only, positioned at circle center */}
            <div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-[2px] bg-slate-200 lg:block" />
            
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: t.servicesPage.process.steps[0].step,
                  title: t.servicesPage.process.steps[0].title,
                  description: t.servicesPage.process.steps[0].description,
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                },
                {
                  step: t.servicesPage.process.steps[1].step,
                  title: t.servicesPage.process.steps[1].title,
                  description: t.servicesPage.process.steps[1].description,
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                },
                {
                  step: t.servicesPage.process.steps[2].step,
                  title: t.servicesPage.process.steps[2].title,
                  description: t.servicesPage.process.steps[2].description,
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ),
                },
                {
                  step: t.servicesPage.process.steps[3].step,
                  title: t.servicesPage.process.steps[3].title,
                  description: t.servicesPage.process.steps[3].description,
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group relative flex flex-col items-center text-center"
                >
                  {/* Circle */}
                  <div className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-brand-navy transition-all duration-300 group-hover:border-brand-navy group-hover:bg-brand-navy group-hover:text-white">
                    {item.icon}
                  </div>
                  
                  {/* Step Number */}
                  <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-red">{item.step}</span>
                  
                  {/* Title */}
                  <h3 className="mb-2 text-base font-bold text-brand-navy">{item.title}</h3>
                  
                  {/* Description */}
                  <p className="max-w-[220px] text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="full-bleed bg-white py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Header - Centered */}
            <div className="mb-12 text-center">
              <p className="mb-3 inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                
                {t.servicesPage.faq.sectionTitle}
              </p>
              <h2 className="mb-4 text-3xl font-bold text-brand-navy lg:text-4xl">
                {t.servicesPage.faq.title}
              </h2>
              <p className="mx-auto max-w-2xl text-base text-slate-500">
                {t.servicesPage.faq.description}
              </p>
            </div>

            {/* Accordion - Full Width */}
            <div className="mb-10">
              <FAQAccordion faqs={faqs} />
            </div>

            {/* Contact Link - Centered */}
            <div className="text-center">
              <Link
                href="/contact-us"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-navy transition hover:text-brand-navy/70"
              >
                {t.servicesPage.faq.contactMore}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="full-bleed relative overflow-hidden bg-brand-navy py-24">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02]" />
          </div>

          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-5 text-3xl font-bold text-white lg:text-4xl">
              {t.servicesPage.cta.title}
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-white/70">
              {t.servicesPage.cta.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-brand-navy shadow-lg transition hover:bg-slate-100"
              >
                {t.servicesPage.cta.getQuote}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <Link
                href="tel:011753940"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t.servicesPage.cta.call}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Quote Request Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="relative my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {formSuccess ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-brand-navy">{t.servicesPage.modal.successTitle}</h3>
                  <p className="text-slate-600">{t.servicesPage.modal.successDesc}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-brand-navy">{t.servicesPage.modal.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {t.servicesPage.modal.subtitle}
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-brand-navy">
                        {t.servicesPage.modal.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.servicesPage.modal.namePlaceholder}
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-brand-navy">
                        {t.servicesPage.modal.phoneLabel}
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">
                          +855
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            // Only allow digits, remove leading 0, and format as XX XXX XXXX
                            let digits = e.target.value.replace(/\D/g, "");
                            // Remove leading zero if present
                            if (digits.startsWith("0")) {
                              digits = digits.slice(1);
                            }
                            digits = digits.slice(0, 9);
                            let formatted = "";
                            if (digits.length > 0) {
                              formatted = digits.slice(0, 2);
                              if (digits.length > 2) {
                                formatted += " " + digits.slice(2, 5);
                              }
                              if (digits.length > 5) {
                                formatted += " " + digits.slice(5, 9);
                              }
                            }
                            setFormData({ ...formData, phone: formatted });
                          }}
                          placeholder={t.servicesPage.modal.phonePlaceholder}
                          className="w-full rounded-r-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                        />
                      </div>
                    </div>

                    {/* Service Category */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-brand-navy">
                        {t.servicesPage.modal.serviceLabel}
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                        >
                          <option value="" disabled>{t.servicesPage.modal.serviceSelect}</option>
                          {services.map((service) => (
                            <option key={service.slug} value={service.slug}>
                              {service.name}
                            </option>
                          ))}
                          <option value="other">{t.servicesPage.modal.serviceOther}</option>
                        </select>
                        {/* Dropdown Arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-brand-navy">
                        {t.servicesPage.modal.messageLabel}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t.servicesPage.modal.messagePlaceholder}
                        className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full rounded-lg bg-brand-navy py-3.5 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {formSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t.servicesPage.modal.sending}
                        </span>
                      ) : (
                        t.servicesPage.modal.send
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
