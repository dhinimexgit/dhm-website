"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "./sticky-header";

// 5 placeholder images for the carousel
const heroImages = [
  "/Dhinimex-building_e.jpg",
  "/kcc-3.jpg",
  "/camrad.jpg",
  "/kcc.jpg",
  "/saekaraj-2.jpg",
];

export function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLElement>(null);
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
    setMounted(true);
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
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Background Image with Glassmorphism Dark Overlay - IES Style */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/cover-slide.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark semi-transparent overlay for glassmorphism effect */}
          <div className="absolute inset-0 bg-black/20" />
          {/* Gradient for depth and text readability */}
          <div className="absolute inset-0 bg-gradient-to-r bg-gray-500/30 to-transparent" />
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
                  <Link href="/careers" className="group relative transition hover:text-white/80">
                    Careers
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                  </Link>
                </nav>
                <div className="flex items-center gap-4">
                  {/* Search Button */}
                  <button 
                    onClick={() => setSearchOpen(!searchOpen)}
                    className={`p-2 transition ${searchOpen ? "text-white" : "text-white/80 hover:text-white"}`}
                    aria-label="Search"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <span className="text-white/30">|</span>
                  <Link href="mailto:info@dhinimex.com.kh" className="p-2 text-white/80 transition hover:text-white" aria-label="Email">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact-us"
                    className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]"
                  >
                    Contact Us
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
                          placeholder="Search for services, products, careers..."
                          className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner"
                        />
                      </div>
                      <button
                        type="submit"
                        className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-0">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center space-y-8 pt-20 lg:pt-0">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-red">
                  <span className="h-px w-10 bg-brand-red" />
                    <strong className="text-lg text-brand-navy">Since 2003</strong>
                </p>
                <h1 className="text-3xl font-bold leading-tight text-white sm:text-3xl lg:text-6xl xl:text-[62px] xl:leading-[1.1]">
                  Driven by Quality,
                  <br />
                  <span>Guided by Standards</span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-white/80 lg:text-xl">
                  Empowering progress with trusted expertise. Dhinimex delivers comprehensive electrical, water supply, 
                  and engineering solutions driven by innovation, quality, and a commitment to long-term impact.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-navy hover:text-white"
                >
                  Learn more about us
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Side - Image/Video Carousel */}
            <div className="relative hidden lg:block">
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
      </section>
    </>
  );
}
