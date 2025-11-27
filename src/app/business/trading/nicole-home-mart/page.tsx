"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

const brands = [
  { name: "Mitsubishi Electric", country: "Japan" },
  { name: "Stanley", country: "USA" },
  { name: "Solo", country: "Thailand" },
  { name: "Kyoritsu", country: "Japan" },
  { name: "Greenlawn", country: "Taiwan" },
  { name: "LWD", country: "Malaysia" },
];

const locations = [
  { name: "Toul Tum Pong", detail: "(near Russian Market)", mapLink: "https://www.google.com/maps/search/Nicole+Home+Mart+Toul+Tum+Pong" },
  { name: "Tep Phan Street", detail: "(at Dhinimex Office)", mapLink: "https://www.google.com/maps/search/Dhinimex+Co.,+Ltd" },
  { name: "Kiensvay", detail: "(at Kiensvay Electricity Office)", mapLink: "https://www.google.com/maps/search/Electricite+du+Cambodge+Kien+Svay" },
];

export default function NicoleHomeMartDetailPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="Nicole Home Mart Co., LTD"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Nicole Home Mart Co., LTD
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-red">Home</Link>
          <span>/</span>
          <Link href="/business/trading" className="hover:text-brand-red">Trading</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">Nicole Home Mart Co., LTD</span>
        </nav>

        {/* Content Section - Similar to Homepage About Us */}
        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          {/* Image Side */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 mt-8">
            <div className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto" style={{ width: 'calc(100% - 32px)', height: 'calc(100% - 32px)' }} />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: '17px' }}>
              <Image
                src="/nicole.jpg"
                alt="Nicole Home Mart Co., LTD"
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
              Trading
            </p>
            <h2 className="text-4xl font-semibold text-brand-navy">
              Nicole Home Mart Co., LTD
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              <strong>Nicole Home Mart (NHM)</strong> is the official distributor of high-quality mechanical and electrical tools, home appliances, and safety equipment. Supplying globally recognized brands like <strong>Mitsubishi Electric, Stanley, Solo, and Kyoritsu</strong>, NHM ensures reliable products and solutions for homes, businesses, and industries across Cambodia.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Nicole Home Mart (NHM) <strong>is a trusted retailer offering a wide range</strong> of mechanical and electrical tools, equipment, and home solutions. <strong>Our product</strong> portfolio includes power tools, welding machines, gardening and measurement tools, motors, pumps, breakers (MCB, MCCB, ACB), lamps, sockets, energy meters, fire extinguishers, home appliances, and more.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              We proudly supply internationally recognized brands, ensuring customers receive products of the highest quality and reliability.
            </p>

            {/* Brands */}
            <div className="pt-2">
              <h3 className="mb-4 text-lg font-semibold text-brand-navy">Our Brands</h3>
              <div className="flex flex-wrap gap-3">
                {brands.map((brand) => (
                  <span
                    key={brand.name}
                    className="rounded-full border-2 border-[#2E388C] bg-[#2E388C]/5 px-4 py-2 text-sm font-medium text-brand-navy transition hover:bg-[#2E388C]/10"
                  >
                    {brand.name} ({brand.country})
                  </span>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="pt-4">
              <h3 className="mb-4 text-lg font-semibold text-brand-navy">Our Locations</h3>
              <div className="space-y-3">
                {locations.map((location, index) => (
                  <div key={location.name} className="flex flex-col items-start justify-between gap-4 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2E388C] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-brand-navy">{location.name}</p>
                        <p className="text-sm text-slate-600">{location.detail}</p>
                      </div>
                    </div>
                    <a
                      href={location.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-9 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition hover:border-brand-red hover:text-brand-red sm:ml-0"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Maps
                    </a>
                  </div>
                ))}
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
              {/* <a 
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
              </a> */}
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

