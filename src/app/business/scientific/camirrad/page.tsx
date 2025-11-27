"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

const heroNavLinks = [
  { label: "About Us", href: "/about", caret: false },
  { 
    label: "Business Porfolio", 
    href: "#", 
    caret: true,
    dropdown: [
      { label: "Trading", href: "/business/trading" },
      { label: "Manufacturing", href: "/business/manufacturing" },
      { label: "Electricity Distributions", href: "/business/electricity" },
      { label: "Water Supply", href: "/business/water-supply" },
      { label: "Scientific", href: "/business/scientific" },
    ]
  },
  { label: "Services", href: "/services", caret: false },
  { label: "Products", href: "/products", caret: false },
  { label: "Blog", href: "/blog", caret: false },
  { label: "Careers", href: "/careers", caret: false },
];

export default function CamirradPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
    setHideTimeout(timeout);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="Camirrad – An Electron Beam Irradiation Facility"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <div className="flex w-full items-center justify-between bg-[#2E388C] px-14 py-5 shadow-lg">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo-dhinimex.png"
                alt="Dhinimex logo"
                width={170}
                height={49}
                priority
                className="h-auto w-[170px]"
              />
            </Link>
            <nav className="flex items-center gap-6 text-[15px] font-medium text-white xl:gap-8">
              {heroNavLinks.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.dropdown ? (
                    <button
                      type="button"
                      className="group relative flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-brand-red"
                      onClick={(e) => e.preventDefault()}
                    >
                      {item.label}
                      {item.caret && <span className="text-[11px]">▼</span>}
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
                    </button>
                  ) : (
                    <Link 
                      href={item.href} 
                      className="group relative flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-brand-red"
                    >
                      {item.label}
                      {item.caret && <span className="text-[11px]">▼</span>}
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
                    </Link>
                  )}
                  
                  {item.dropdown && openDropdown === item.label && (
                    <div className="absolute left-0 top-full mt-2 w-64 rounded-lg bg-white py-2 shadow-xl">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block px-6 py-3 text-[15px] text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-3 text-white xl:gap-4">
              <button 
                  type="button" 
                  className="p-1 text-lg transition-opacity hover:opacity-70" 
                  aria-label="Search"
                >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <span className="hidden font-light text-white/70 lg:inline">|</span>
              
              <button 
                type="button" 
                className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
              >
                <Image 
                  src="https://flagcdn.com/w20/gb.png" 
                  alt="EN" 
                  width={20} 
                  height={15}
                  className="h-3.5 w-auto"
                />
                <span className="text-[11px]">▼</span>
              </button>
              <Link
                href="/contact-us"
                className="ml-2 whitespace-nowrap bg-brand-red px-6 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#c91e21]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Camirrad – An Electron Beam Irradiation Facility
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-red transition-colors">Home</Link>
          <span>/</span>
          <Link href="/business/scientific" className="hover:text-brand-red transition-colors">Scientific</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">Camirrad – An Electron Beam Irradiation Facility</span>
        </nav>

        {/* Main Content */}
        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          {/* Image Side */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 mt-8">
            <div className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto" style={{ width: 'calc(100% - 32px)', height: 'calc(100% - 32px)' }} />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: '17px' }}>
              <Image
                src="/elect_distribute-1.png"
                alt="Camirrad – An Electron Beam Irradiation Facility"
                width={720}
                height={480}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
              Scientific
            </p>
            <h2 className="text-4xl font-semibold text-brand-navy">
              Camirrad – An Electron Beam Irradiation Facility
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              <strong>Camirrad Diagnostic & Irradiation Center</strong> is Cambodia&apos;s first electron beam irradiation facility, established under the sponsorship of <strong>Dhinimex Co., Ltd.</strong> Created to address the lack of standardized export regulations, Camirrad ensures that agricultural and food products meet the international standards required by markets in the United States, China, Japan, Southeast Asia, and Europe.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Equipped with state-of-the-art technology, Camirrad specializes in <strong>food safety, quality assurance, and compliance certifications</strong> such as CODEX, ISO, and HACCP. The center provides end-to-end services including irradiation treatment, safety management, staff training, and regulatory compliance support, enabling Cambodian exporters to compete on the global stage.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              With a mission to become <strong>Cambodia&apos;s leading irradiation provider</strong>, Camirrad aims to partner with the majority of active food exporters and facilitate the export of up to <strong>24,000 metric tons of treated produce annually</strong>. By combining innovation, strict quality control, and strong industry collaboration, Camirrad is driving the future of Cambodia&apos;s agricultural exports and global competitiveness.
            </p>

            {/* Key Highlights */}
            <div className="pt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E388C] text-white text-xl">⚡</span>
                  <h4 className="font-semibold text-brand-navy">First in Cambodia</h4>
                </div>
                <p className="mt-2 text-sm text-slate-600">Pioneering electron beam irradiation facility.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E388C] text-white text-xl">🌍</span>
                  <h4 className="font-semibold text-brand-navy">Global Standards</h4>
                </div>
                <p className="mt-2 text-sm text-slate-600">CODEX, ISO, and HACCP certified.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E388C] text-white text-xl">📦</span>
                  <h4 className="font-semibold text-brand-navy">Export Ready</h4>
                </div>
                <p className="mt-2 text-sm text-slate-600">24,000 metric tons annual capacity.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E388C] text-white text-xl">✓</span>
                  <h4 className="font-semibold text-brand-navy">Full Service</h4>
                </div>
                <p className="mt-2 text-sm text-slate-600">Treatment, training, and compliance support.</p>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-4">
              <a 
                href="https://facebook.com/dhinimex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white transition hover:bg-[#252f6e]"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/dhinimex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white transition hover:bg-[#252f6e]"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com/@dhinimex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white transition hover:bg-[#252f6e]"
                aria-label="TikTok"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/@dhinimex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white transition hover:bg-[#252f6e]"
                aria-label="YouTube"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

