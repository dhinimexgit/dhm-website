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

const heroImage = "/water-supply.png";

const licenses = [
  {
    name: "Chhouk Water License (CHHW)",
    description: "The Chhouk license is dedicated to expanding clean water access in rural communities. We focus on building sustainable infrastructure to secure long-term water quality and supply.",
    link: "/business/water-supply/chhouk",
    image: "/water-supply.png",
    province: "Kampot"
  },
  {
    name: "TPhong Water License (TPHW)",
    description: "The TPhong license supports growing demand for safe water in its region. Our investments here strengthen water networks and improve service reliability for households and enterprises.",
    link: "/business/water-supply/tphong",
    image: "/water-supply.png",
    province: "Kampot"
  },
  {
    name: "Pong Traj Water License (PTRW)",
    description: "The Pong Traj license reflects our commitment to rural development through modern water distribution systems, ensuring consistent service and improved community well-being.",
    link: "/business/water-supply/pong-traj",
    image: "/water-supply.png",
    province: "Kampot"
  },
  {
    name: "Touk Meas Water License (TMW)",
    description: "This license covers the Touk Meas area. Our investment in pipelines and treatment systems ensures households and businesses receive safe, reliable clean water.",
    link: "/business/water-supply/touk-meas",
    image: "/water-supply.png",
    province: "Kampot"
  },
  {
    name: "Damnak Chang Eur Water Supply",
    description: "The Damnak Chang Eur water supply project represents our commitment to providing clean, reliable water access to communities in this vital region through strategic infrastructure investments.",
    link: "/business/water-supply/damnak-chang-eur",
    image: "/water-supply.png",
    province: "Kampot"
  },
  {
    name: "Teuk Pong Teuk Water License (TPTW)",
    description: "This license serves smaller communities with tailored infrastructure solutions, reinforcing our dedication to accessibility and quality even in underserved areas.",
    link: "/business/water-supply/teuk-pong-teuk",
    image: "/water-supply.png",
    province: "Kampot"
  },
];

export default function WaterSupplyPage() {
  const { t, language, setLanguage } = useLanguage();
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
            <Image src={heroImage} alt="Water Supply" fill priority className="object-cover" sizes="100vw" />
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
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
                      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Trading</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Manufacturing</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Electricity Distribution</Link>
                        <Link href="/business/water-supply" className="block rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-brand-red">Water Supply</Link>
                        <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Scientific</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">Services<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">Products<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">News<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/careers" className="group relative transition hover:text-white/80">Careers<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
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
                    <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">Contact Us</Link>
                  </div>
                </div>
                {searchOpen && (
                  <div ref={searchPanelRef} className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-2xl">
                    <div className="px-8 py-4">
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for services, products, careers..." className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner" />
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
            <div className="flex min-h-[calc(60vh-120px)] items-center py-16 lg:min-h-[calc(70vh-120px)] lg:py-0">
              <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                  <Link href="/business" className="text-sm font-medium text-white/70 transition hover:text-white">
                    Business Portfolio
                  </Link>
                  <span className="text-white/40">/</span>
                  <span className="text-sm font-medium text-brand-red">Water Supply</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Water Supply
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  Delivering clean, safe water to communities across Cambodia through 
                  modern infrastructure and sustainable distribution networks.
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/20">
                      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{licenses.length}</p>
                      <p className="text-sm text-white/60">Licenses</p>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/20">
                      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">100%</p>
                      <p className="text-sm text-white/60">Clean Water</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Licenses Section */}
        <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
                Our Licenses
              </p>
              <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
                Water Supply Distribution Areas
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Licensed distribution networks bringing clean water to communities
              </p>
            </div>

            {/* Licenses Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {licenses.map((license, index) => (
                <article
                  key={license.name}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={license.image}
                      alt={license.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Province badge */}
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-navy backdrop-blur-sm">
                        <svg className="h-3 w-3 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {license.province}
                      </span>
                    </div>

                    {/* License Name */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {license.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="relative p-6">
                    {/* Decorative line */}
                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-red via-brand-navy to-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {license.description}
                    </p>
                    <Link
                      href={license.link}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy transition-all group-hover:gap-3 group-hover:text-brand-red"
                    >
                      View Details
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
              Questions About Our Services?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Contact us to learn more about water supply services and solutions.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-base font-semibold text-white transition hover:bg-[#c91e21]"
              >
                Contact Us
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
