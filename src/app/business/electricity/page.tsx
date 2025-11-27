"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

const licenses = [
  {
    name: "Akissni Touk Meas",
    customers: "50,733",
    description: "As our largest licensed area, 50,733 customers are connected under the Touk Meas license. This area represents a core part of our electricity distribution portfolio, supported by substantial infrastructure to meet growing demand.",
    link: "/business/electricity/touk-meas",
    image: "/elect_distribute-1.png"
  },
  {
    name: "Akissni Dong Tong",
    customers: "10,215",
    description: "Providing electricity to 10,215 customers, this license supports smaller but vital communities in Dong Tong. Our operations here focus on accessibility, reliability, and continuous improvement in service delivery.",
    link: "/business/electricity/dong-tong",
    image: "/elect_distribute-2.png"
  },
  {
    name: "Akissni EPOSE",
    customers: "25,455",
    description: "With a customer base of 25,455 users, this license ensures electricity supply to the EPOSE region. Our investment supports rural development by strengthening grid reliability and expanding access to modern energy.",
    link: "/business/electricity/epose",
    image: "/elect_distribute-1.png"
  },
  {
    name: "Akissni KEANSVAY",
    customers: "29,052",
    description: "Serving 29,052 customers, this license covers the distribution of electricity across the Keansvay area, where we have invested in infrastructure to deliver stable and affordable energy to households and businesses.",
    link: "/business/electricity/keansvay",
    image: "/elect_distribute-2.png"
  },
];

export default function ElectricityPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="Electricity Distribution"
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
            Electricity Distribution
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Licenses Grid */}
        <section className="grid gap-12 md:grid-cols-2">
          {licenses.map((license) => (
            <article
              key={license.name}
              className="group relative overflow-hidden rounded-3xl shadow-lg transition hover:shadow-2xl"
              style={{ minHeight: '500px' }}
            >
              <div className="relative h-[500px] w-full">
                <Image
                  src={license.image}
                  alt={license.name}
                  fill
                  className="object-cover"
                />
                {/* Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" /> */}
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="flex h-[280px] flex-col rounded-2xl bg-white/60 p-6 backdrop-blur-md border border-white/30">
                    <div className="flex-grow space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-2xl font-bold text-[#2E388C]">
                          {license.name}
                        </h2>
                        {/* <span className="flex-shrink-0 rounded-full bg-[#2E388C]/10 px-3 py-1 text-sm font-semibold text-[#2E388C]">
                          {license.customers} Customers
                        </span> */}
                      </div>
                      <p className="text-base leading-relaxed text-slate-700 line-clamp-3">
                        {license.description.split(/(\d{1,3}(?:,\d{3})* (?:customers|users))/gi).map((part, i) => 
                          /\d{1,3}(?:,\d{3})* (?:customers|users)/i.test(part) ? (
                            <strong key={i}>{part}</strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    </div>
                    <Link
                      href={license.link}
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

