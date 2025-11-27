"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

const companies = [
  {
    name: "Dhinimex Co., LTD",
    description: "Dhinimex Co., Ltd., established in 2003, is a leading provider of electrical equipment, appliances, and solar solutions in Cambodia.",
    link: "/business/trading/dhinimex",
    image: "/dhinimex.jpg"
  },
  {
    name: "Nicole Home Mart Co., LTD",
    description: "Nicole Home Mart (NHM) is the official distributor of high-quality mechanical and electrical tools, home appliances, and safety equipment.",
    link: "/business/trading/nicole-home-mart",
    image: "/nicole.jpg"
  },
];

export default function TradingPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="Trading"
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
            Trading
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

