"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { leadership } from "@/data/site-content";
import { StickyHeader } from "@/components/home/sticky-header";

// Hero background image
const heroImage = "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&q=80";

// Placeholder images from Unsplash
const placeholderImages = {
  teamPhoto: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  vision: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  mission: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
  coreValues: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  workCulture: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  // Using avatar.iran.liara.run for team member avatars
  teamMembers: [
    "https://avatar.iran.liara.run/public/boy?username=John",
    "https://avatar.iran.liara.run/public/girl?username=Sarah",
    "https://avatar.iran.liara.run/public/boy?username=Mike",
    "https://avatar.iran.liara.run/public/girl?username=Lisa",
    "https://avatar.iran.liara.run/public/73",
    "https://avatar.iran.liara.run/public/boy?username=Ash",
  ],
};

const coreValues = [
  {
    title: "Quality Assurance",
    description:
      "We are committed to delivering only high-quality products that meet or exceed Cambodian and international standards such as TIS, IEC, ANSI/IEEE, or specific client requirements.",
  },
  {
    title: "Technical Excellence",
    description:
      "Our equipment is built with premium materials, efficient design, and engineered to pass all routine and type tests for performance, safety, and longevity.",
  },
  {
    title: "Customer Commitment",
    description:
      "We prioritize customer satisfaction by providing only products that meet rigorous internal quality controls, ensuring reliability and value in every solution delivered.",
  },
  {
    title: "Standards-Driven Operations",
    description:
      "We design and manufacture with a dual focus on local and global standards, merging innovation with compliance to deliver dependable, future-ready solutions.",
  },
  {
    title: "Integrity & Professionalism",
    description:
      "We adhere to ethical practices and professional conduct in every aspect of our operations—from product development to customer service and global partnerships.",
  },
];

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [visionVisible, setVisionVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Scroll detection for sticky header
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

  // Intersection Observer for Vision & Mission fade-in animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    };

    const visionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisionVisible(true);
        }
      });
    }, observerOptions);

    const missionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setMissionVisible(true);
        }
      });
    }, observerOptions);

    if (visionRef.current) visionObserver.observe(visionRef.current);
    if (missionRef.current) missionObserver.observe(missionRef.current);

    return () => {
      visionObserver.disconnect();
      missionObserver.disconnect();
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <>
      <StickyHeader isVisible={isScrolled} />
      
      <div>
        {/* Hero Banner Section - Following home-hero.tsx pattern */}
        <section className="relative min-h-[70vh] overflow-hidden lg:min-h-[80vh]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="About Dhinimex"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
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
                    />
                  </Link>
                  <nav className="flex items-center gap-8 text-[15px] font-medium text-white">
                    {/* About Us - Active: white text with underline only */}
                    <Link href="/about" className="group relative transition hover:text-white/80">
                      About Us
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
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

          {/* Hero Content - Left aligned like home-hero */}
          <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex min-h-[calc(70vh-120px)] items-center py-16 lg:min-h-[calc(80vh-120px)] lg:py-0">
              <div className="max-w-2xl space-y-6">
                <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">
                  
                  About Us
                </p>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-[64px] xl:leading-[1.1]">
                  Building Cambodia&apos;s Future Through Innovation and Excellence
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text Content */}
            <div className="space-y-8">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                  
                  Who We Are
                </p>
                <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
                  Creating with Purpose
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-slate-600">
                In a fast-moving and increasingly complex global economy, our success depends on
                how faithfully we adhere to our core principles: delivering exceptional client service,
                acting with integrity and responsibility, and supporting the growth of our employees.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">
                    Our Business
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    We are a leading corporation with assets and operations worldwide.
                  </p>
                  <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline">
                    Explore Portfolio <span>→</span>
                  </Link>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">
                    Our Services
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Electrical, water supply, and engineering solutions for Cambodia.
                  </p>
                  <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline">
                    Explore Services <span>→</span>
                  </Link>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">
                    Our History
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    With a legacy dating back to 2003, we have demonstrated leadership.
                  </p>
                  <Link href="/news" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline">
                    Explore Here <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={placeholderImages.teamPhoto}
                  alt="Dhinimex Team"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-brand-red/10" />
            </div>
          </div>
        </section>

        {/* Vision & Mission Section - Faded transition animations */}
        <section className="full-bleed relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Vision - Slides in from left */}
            <div 
              ref={visionRef}
              className={`relative mb-20 transition-all duration-1000 ease-out ${
                visionVisible 
                  ? "translate-x-0 opacity-100" 
                  : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                    
                    Our Vision
                  </p>
                  <h2 className="mb-4 text-3xl font-bold text-brand-navy lg:text-4xl">
                    Innovating Locally, Impacting Globally
                  </h2>
                  <p className="text-base leading-relaxed text-slate-600">
                    Our vision is to become a leading corporation in electrical appliances, water supply, and technological innovation, delivering world-class solutions and service that drive sustainable growth and industry impact, both locally and internationally.
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy/5 to-brand-red/5 shadow-lg lg:h-[350px]">
                    <Image
                      src={placeholderImages.vision}
                      alt="Vision - Innovation and Technology"
                      fill
                      className="object-cover"
                    />
                    {/* Faded gradient overlay on left */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mission - Slides in from right */}
            <div 
              ref={missionRef}
              className={`relative transition-all duration-1000 ease-out delay-200 ${
                missionVisible 
                  ? "translate-x-0 opacity-100" 
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="order-2 lg:order-1 lg:col-span-8">
                  <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gradient-to-bl from-brand-navy/5 to-brand-red/5 shadow-lg lg:h-[350px]">
                    <Image
                      src={placeholderImages.mission}
                      alt="Mission - Empowering Communities"
                      fill
                      className="object-cover"
                    />
                    {/* Faded gradient overlay on right */}
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent" />
                  </div>
                </div>
                <div className="order-1 lg:order-2 lg:col-span-4">
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                    
                    Our Mission
                  </p>
                  <h2 className="mb-4 text-3xl font-bold text-brand-navy lg:text-4xl">
                    Empowering Communities
                  </h2>
                  <p className="text-base leading-relaxed text-slate-600">
                  Our mission is to drive leadership in the electrical and technology sectors by delivering high-quality products and expert services, creating job opportunities, and expanding access to modern energy and clean water–especially in rural Cambodia. Through innovation, ethical practices, and professionalism, we aim to enhance our supply capabilities, empower communities, and establish a strong presence in the global market.                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section - Accordion Style */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy/5 to-brand-red/5 shadow-lg lg:aspect-[1/1]">
                <Image
                  src={placeholderImages.coreValues}
                  alt="Core Values - Team Collaboration"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Accordion Content */}
            <div className="space-y-6">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                  
                  What We Stand For
                </p>
                <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
                  Core Values
                </h2>
              </div>

              {/* Accordion Items */}
              <div className="space-y-3">
                {coreValues.map((value, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50"
                    >
                      <span className="text-lg font-semibold text-brand-navy">
                        {value.title}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-center leading-none transition-all duration-300 ${
                          openAccordion === index
                            ? "bg-brand-red text-white"
                            : "bg-slate-100 text-brand-navy"
                        }`}
                      >
                        <svg 
                          className="h-4 w-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                        >
                          {openAccordion === index ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                          )}
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        openAccordion === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-l-4 border-brand-red mx-6 mb-6 pl-4">
                        <p className="text-base leading-relaxed text-slate-600">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Leadership - Chairwoman */}
        <section className="full-bleed bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                
                Our Leadership
              </p>
              <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
                Meet Our Chairwoman
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">
                Guided by our chairwoman&apos;s vision and leadership, Dhinimex has established itself as a trusted and respected corporation within the industry.
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-white p-6 shadow-2xl sm:p-8 lg:flex lg:items-center lg:gap-10 lg:p-12">
                <div className="mx-auto w-full max-w-[240px] flex-shrink-0 overflow-hidden rounded-2xl lg:mx-0 lg:max-w-[280px]">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={leadership[0].portrait}
                      alt={leadership[0].name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <div className="mt-8 space-y-6 text-center lg:mt-0 lg:flex-1 lg:text-left">
                  <div>
                    <h3 className="text-3xl font-bold text-brand-navy">
                      {leadership[0].name}
                    </h3>
                    <p className="mt-2 text-lg font-semibold text-brand-red">
                      {leadership[0].title}
                    </p>
                  </div>
                  <div className="space-y-4 text-base leading-relaxed text-slate-600">
                    <p>
                      Dhinimex Group originated from a small-scale business founded in 2003 and has since grown into a well-recognized company known for its continuous development and meaningful contributions to both society and the nation.
                    </p>
                    <p>
                      The company&apos;s strength and longevity are rooted in its firm commitment to a core direction: to earn recognition and trust from customers by upholding strong ethical standards, transparency, and integrity. Dhinimex places high importance on excellent service and product quality, which are key factors behind its current success and sustained growth.
                    </p>
                    <p>
                      This progress has been made possible thanks to the dedicated efforts of a collaborative team that works like a family, with persistence, strong commitment, mutual support, and effective communication. The principle of unity as strength has been central to the company&apos;s advancement.
                    </p>
                    <p>
                      Today, Dhinimex continues to grow and actively promotes the development of its workforce through training and encouragement of innovative thinking. The company aspires to remain a leading choice at the national level while advancing its mission on the international stage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Management Team - MD & DMD with Quotes */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
              
              Directors
            </p>
            <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
              Meet Our Management Team
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">
              Dhinimex&apos;s management team brings together a diverse group of experienced professionals with deep expertise in engineering, finance, operations, and strategic development.
            </p>
          </div>

          <div className="space-y-16">
            {leadership.slice(1).map((leader, index) => (
              <div
                key={leader.name}
                className={`flex flex-col items-center gap-8 lg:flex-row ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Photo */}
                <div className="w-full max-w-[200px] flex-shrink-0 lg:max-w-[240px]">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={leader.portrait}
                      alt={leader.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Vertical Line */}
                <div className="hidden h-48 w-px bg-brand-red lg:block" />

                {/* Quote Card */}
                <div className="flex-1">
                  <div className="relative rounded-2xl bg-white p-8 shadow-lg">
                    {/* Quote marks */}
                    <span className="absolute -top-4 left-6 text-6xl font-serif text-brand-red/20">
                      &ldquo;
                    </span>
                    <div className="relative z-10 space-y-4">
                      {leader.quote && (
                        <p className="text-lg italic leading-relaxed text-slate-700">
                          {leader.quote}
                        </p>
                      )}
                      <div className="pt-2">
                        <h3 className="text-xl font-bold text-brand-navy">
                          {leader.name}
                        </h3>
                        <p className="text-sm font-semibold text-brand-red">
                          {leader.title}
                        </p>
                      </div>
                    </div>
                    <span className="absolute -bottom-4 right-6 text-6xl font-serif text-brand-red/20">
                      &rdquo;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Culture Section - White background */}
        <section className="full-bleed relative overflow-hidden bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="relative mx-auto mb-8 h-[200px] max-w-3xl overflow-hidden rounded-2xl lg:h-[280px]">
                <Image
                  src={placeholderImages.workCulture}
                  alt="Work Culture"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                    Our Culture
                  </p>
                  <h2 className="mt-2 text-2xl font-bold lg:text-3xl">
                    Unity as Strength
                  </h2>
                </div>
              </div>
            </div>

            {/* Team Photos Grid */}
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 lg:gap-6">
              {placeholderImages.teamMembers.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-md transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={image}
                    alt={`Team Member ${index + 1}`}
                    fill
                    className="object-cover transition-opacity group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
