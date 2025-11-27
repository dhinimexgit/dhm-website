"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

const companies = [
  {
    name: "Khmer Concrete Co., LTD",
    description: "Khmer Concrete Factory (KCC), based in Kandal Province, is a leading manufacturer of durable and high-quality concrete products.",
    link: "/business/manufacturing/khmer-concrete",
    image: "/kcc.jpg"
  },
  {
    name: "Vong Chan Cable Co., LTD",
    description: "Vong Chan Cable is a manufacturer of high-quality LV/MV cable that meets international standards.",
    link: "/business/manufacturing/vong-chan-cable",
    image: "/vcc.jpg"
  },
  {
    name: "Saekaraj Transfo Co., LTD",
    description: "Saekaraj Transfo, Cambodia's first transformer manufacturer, delivers high-quality transformers and nationwide maintenance services to support reliable power infrastructure.",
    link: "/business/manufacturing/saekaraj-transfo",
    image: "/saekaraj.jpg"
  },
];

export default function ManufacturingPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="Manufacturing"
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
            Manufacturing
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Companies Grid */}
        <section className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex h-[280px] flex-col rounded-2xl bg-white/60 p-5 backdrop-blur-md border border-white/30">
                    <div className="flex-grow space-y-3">
                      <h2 className="text-xl font-bold text-[#2E388C]">
                        {company.name}
                      </h2>
                      <p className="text-sm leading-relaxed text-slate-700 line-clamp-5">
                        {company.description}
                      </p>
                    </div>
                    <Link
                      href={company.link}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2E388C] transition hover:text-[#252f6e]"
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

