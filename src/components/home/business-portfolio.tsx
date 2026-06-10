"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { homePageBrands } from "@/data/site-content";

export function BusinessPortfolio() {
  const { t } = useLanguage();
  const companyLogos = homePageBrands;
  const renderLogo = (company: (typeof homePageBrands)[number], index: number) => (
    <Link
      key={`${company.name}-${index}`}
      href={"#"}
      className="group relative flex h-20 w-40 shrink-0 items-center justify-center"
    >
      <Image
        src={company.logo}
        alt={`${company.name} logo`}
        width={160}
        height={80}
        className="h-full w-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        unoptimized
        priority={index < 14}
      />
    </Link>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-[#1a2066] to-brand-navy py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-brand-red blur-3xl" />
        <div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-red">
            
            {t.home.businessPortfolio.sectionTitle}
            
          </p>
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {t.home.businessPortfolio.title}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-white/70 lg:text-xl">
            {t.home.businessPortfolio.description}
          </p>
        </div>

        {/* Logo Carousel - Full color logos with border */}
        <div className="relative overflow-hidden rounded-xl border-2 border-white/30 bg-white/95 backdrop-blur-sm py-10 px-4 shadow-xl">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white/95 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white/95 to-transparent" />
          
          <div className="portfolio-marquee gap-0">
            <div className="portfolio-marquee-group inline-flex shrink-0 items-center gap-16">
              {companyLogos.map((company, index) => renderLogo(company, index))}
            </div>
            <div className="portfolio-marquee-group inline-flex shrink-0 items-center gap-16" aria-hidden>
              {companyLogos.map((company, index) => renderLogo(company, index + companyLogos.length))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/brands"
            className="group inline-flex items-center gap-3 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            {t.home.businessPortfolio.explore}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
