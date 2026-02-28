"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/data/site-content";
import type { ReactNode } from "react";

type Props = {
  services: Service[];
};

// Line icons matching JP Morgan style (single color - brand navy)
const serviceIcons: Record<string, ReactNode> = {
  "manufacturing-and-repair": (
    <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  "construction-and-installation": (
    <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  "testing-and-engineering-consultation": (
    <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  "utilities-provider": (
    <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  "electrical-and-heavy-equipment-supply-services": (
    <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
};

// Service descriptions (institutional tone)
const serviceDescriptions: Record<string, string> = {
  "manufacturing-and-repair": "We design and manufacture high-quality electrical equipment, including cables, conductors, distribution transformers, control panels, and concrete poles.",
  "construction-and-installation": "We deliver end-to-end power infrastructure solutions—from poles and transformers to fully equipped substations and monitoring systems.",
  "testing-and-engineering-consultation": "From relay setting and transformer oil purification to system diagnostics, our testing services maximize performance and extend asset lifecycle.",
  "utilities-provider": "Beyond equipment and services, Dhinimex is a trusted utilities provider, delivering both electrical and water infrastructure across Cambodia.",
  "electrical-and-heavy-equipment-supply-services": "We provide a comprehensive range of high-quality electrical and heavy equipment solutions to support infrastructure development.",
};

export function ServicesCarousel({ services }: Props) {
  const allServices = services.slice(0, 5);
  const totalServices = allServices.length;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Desktop shows 4 cards at a time
  const visibleCardsDesktop = 4;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalServices - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalServices - 1 ? 0 : prev + 1));
  };

  // Get visible cards for the current view (with wrapping)
  const getVisibleCards = (count: number) => {
    const cards = [];
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % totalServices;
      cards.push(allServices[index]);
    }
    return cards;
  };

  return (
    <section className="relative bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Headline Row */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-red">
              
              Our Services
            </p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              What Problem Can We{" "}
              <span className="text-brand-navy">Solve Together?</span>
            </h2>
          </div>

          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition-all hover:bg-brand-navy hover:text-white"
          >
            View all services
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* ===== MOBILE LAYOUT ===== */}
        <div className="lg:hidden">
          {/* Image */}
          <div className="relative mb-6 h-[250px] w-full overflow-hidden">
            <Image
              src="/dhinimex.jpg"
              alt="Dhinimex infrastructure"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          {/* Single Card - Below Image */}
          <div className="relative overflow-hidden">
            <article className="flex h-[280px] w-full flex-col border border-slate-200 bg-white p-5 shadow-lg">
              <div className="mb-4 text-brand-navy">
                {serviceIcons[allServices[currentIndex].slug] || (
                  <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21" />
                  </svg>
                )}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {allServices[currentIndex].name}
              </h3>
              <p className="mb-4 flex-grow text-sm leading-relaxed text-slate-500">
                {serviceDescriptions[allServices[currentIndex].slug] || allServices[currentIndex].description}
              </p>
              <Link
                href={`/services#${allServices[currentIndex].slug}`}
                className="group mt-auto inline-flex items-center gap-2 text-sm font-medium text-brand-navy transition-colors hover:text-brand-red"
              >
                Learn more
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </article>
          </div>
        </div>

        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="relative hidden min-h-[520px] lg:block">
          
          {/* Large Background Image - Left Side */}
          <div className="absolute left-0 top-0 z-0 h-full w-[40%] overflow-hidden">
            <Image
              src="https://www.dhinimex.com/wp-content/uploads/2025/11/Dhinimex-building_e.jpg"
              alt="Dhinimex infrastructure"
              fill
              className="object-cover"
              sizes="40vw"
              priority
            />
          </div>

          {/* Desktop Cards - Show 4 visible cards */}
          <div className="relative z-10">
            <div className="absolute left-[25%] right-0 top-[120px]">
              <div className="flex gap-5">
                {getVisibleCards(visibleCardsDesktop).map((service, idx) => (
                  <article
                    key={`${service.slug}-${idx}`}
                    className="flex h-[350px] w-[285px] flex-shrink-0 flex-col border border-slate-200 bg-white p-6 shadow-lg transition-all duration-700"
                  >
                    <div className="mb-4 text-brand-navy">
                      {serviceIcons[service.slug] || (
                        <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21" />
                        </svg>
                      )}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                      {service.name}
                    </h3>
                    <p className="flex-grow text-sm leading-relaxed text-slate-500 line-clamp-5">
                      {serviceDescriptions[service.slug] || service.description}
                    </p>
                    <Link
                      href={`/services#${service.slug}`}
                      className="group mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium text-brand-navy transition-colors hover:text-brand-red"
                    >
                      Learn more
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:border-brand-navy hover:text-brand-navy"
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Dots - One per service */}
          <div className="flex items-center gap-2">
            {allServices.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-brand-navy" 
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to service ${i + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:border-brand-navy hover:text-brand-navy"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
