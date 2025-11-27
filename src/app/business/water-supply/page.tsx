"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "/water-supply.png";

const licenses = [
  {
    name: "Chhouk Water License (CHHW)",
    customers: "3,736",
    description: "Serving 3,736 customers, the Chhouk license is dedicated to expanding clean water access in rural communities. We focus on building sustainable infrastructure to secure long-term water quality and supply.",
    link: "/business/water-supply/chhouk",
    image: "/elect_distribute-1.png"
  },
  {
    name: "TPhong Water License (TPHW)",
    customers: "2,888",
    description: "Supplying 2,888 customers, the TPhong license supports growing demand for safe water in its region. Our investments here strengthen water networks and improve service reliability for households and enterprises alike.",
    link: "/business/water-supply/tphong",
    image: "/elect_distribute-2.png"
  },
  {
    name: "Pong Traj Water License (PTRW)",
    customers: "3,082",
    description: "With 3,082 customers, the Pong Traj license reflects our commitment to rural development through modern water distribution systems, ensuring consistent service and improved community well-being.",
    link: "/business/water-supply/pong-traj",
    image: "/elect_distribute-1.png"
  },
  {
    name: "Touk Meas Water License (TMW)",
    customers: "4,576",
    description: "Supplying 4,576 customers, this license covers the Touk Meas area. Our investment in pipelines and treatment systems ensures households and businesses receive safe, reliable clean water.",
    link: "/business/water-supply/touk-meas",
    image: "/elect_distribute-2.png"
  },
  {
    name: "Damnak Chang Eur Water Supply",
    customers: "",
    description: "The Damnak Chang Eur water supply project represents our commitment to providing clean, reliable water access to communities in this vital region through strategic infrastructure investments.",
    link: "/business/water-supply/damnak-chang-eur",
    image: "/elect_distribute-1.png"
  },
  {
    name: "Teuk Pong Teuk Water License (TPTW)",
    customers: "649",
    description: "Providing clean water to 649 customers, this license serves smaller communities with tailored infrastructure solutions, reinforcing our dedication to accessibility and quality even in underserved areas.",
    link: "/business/water-supply/teuk-pong-teuk",
    image: "/elect_distribute-2.png"
  },
];

export default function WaterSupplyPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="Water Supply"
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
            Water Supply
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Licenses Grid */}
        <section className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex h-[280px] flex-col rounded-2xl bg-white/60 p-5 backdrop-blur-md border border-white/30">
                    <div className="flex-grow space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-bold text-[#2E388C]">
                          {license.name}
                        </h2>
                        {/* {license.customers && (
                          <span className="flex-shrink-0 rounded-full bg-[#2E388C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#2E388C]">
                            {license.customers} Customers
                          </span>
                        )} */}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 line-clamp-5">
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

