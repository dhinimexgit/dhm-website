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

const companies = [
  {
    name: "CamRad Diagnostic Center",
    description: "CamRad Diagnostic Center in Phnom Penh offers reliable, high-quality imaging and laboratory services, specializing in CT scans and radiology to support accurate and trusted healthcare diagnostics.",
    link: "/business/scientific/camrad",
    image: "/camrad.jpg"
  },
  {
    name: "Camirrad – An Electron Beam Irradiation Facility",
    description: "Camirrad Diagnostic & Irradiation Center is Cambodia's first state-of-the-art electron beam facility, ensuring food and agricultural products meet international safety and export standards.",
    link: "/business/scientific/camirrad",
    image: "/elect_distribute-1.png"
  },
];

export default function ScientificPage() {
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
            alt="Scientific"
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
            Scientific
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Companies Grid */}
        <section className="grid gap-12 md:grid-cols-2">
          {companies.map((company) => (
            <article
              key={company.name}
              className="group relative overflow-hidden rounded-3xl shadow-lg transition hover:shadow-2xl"
              style={{ minHeight: '500px' }}
            >
              <div className="relative h-[500px] w-full">
                <Image
                  src={company.image}
                  alt={company.name}
                  fill
                  className="object-cover"
                />
                {/* Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" /> */}
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="flex h-[280px] flex-col rounded-2xl bg-white/60 p-6 backdrop-blur-md border border-white/30">
                    <div className="flex-grow space-y-4">
                      <h2 className="text-2xl font-bold text-[#2E388C]">
                        {company.name}
                      </h2>
                      <p className="text-base leading-relaxed text-slate-700 line-clamp-4">
                        {company.description}
                      </p>
                    </div>
                    <Link
                      href={company.link}
                      className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-[#2E388C] transition hover:text-[#252f6e]"
                    >
                      Read More <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

