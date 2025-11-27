"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";
const detailImage = "/utilities-elec-provider.png";

const infrastructureFocus = [
  "Electrical distribution networks that connect provincial towns and industrial corridors.",
  "Water treatment plants, pumping stations, and smart metering designed for sustainable growth.",
  "Monitoring centers staffed 24/7 to support reliable service across remote regions.",
];

const communityCommitments = [
  "Expanding access for rural communities that still face unstable grids or limited potable water.",
  "Investing in sustainable technologies that lower operating costs and environmental impact.",
  "Coordinating with local authorities to accelerate permits, inspections, and expansion plans.",
];

const utilitiesPillars = [
  {
    title: "Reliable Access",
    description: "Integrated electrical and water infrastructure keeps households, farms, and factories productive every day.",
  },
  {
    title: "Rural Inclusion",
    description: "We prioritize underserved provinces, combining private investment with public coordination to close supply gaps.",
  },
  {
    title: "Sustainable Operations",
    description: "Smart monitoring, energy-efficient pumps, and preventative maintenance reduce losses across the network.",
  },
];

export default function UtilitiesProviderDetailPage() {
  return (
    <div className="space-y-16 pb-20">
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Utilities Provider" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">Utilities Provider</h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-red">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-brand-red">
            Services
          </Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">Utilities Provider</span>
        </nav>

        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div className="relative mx-auto mt-8 w-full max-w-lg lg:mx-0">
            <div
              className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto"
              style={{ width: "calc(100% - 32px)", height: "calc(100% - 32px)" }}
            />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: "17px" }}>
              <Image src={detailImage} alt="Utility infrastructure" width={720} height={480} className="h-auto w-full object-cover" priority />
            </div>
          </div>

          <div className="space-y-6 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">Services</p>
            <h2 className="text-4xl font-semibold text-brand-navy">Utilities Provider</h2>
            <p className="text-base leading-relaxed text-slate-600">
            Beyond equipment and services, Dhinimex is a trusted utilities provider, delivering both electrical and water infrastructure across provinces in Cambodia. We are dedicated to supporting communities with sustainable and reliable utilities—especially in rural areas where stable access is still limited.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Our teams design, build, and manage networks that connect households, farms, and businesses to safe, affordable energy and water—
              supported by 24/7 monitoring and on-call maintenance.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Every concession is developed with local authorities, ensuring compliance, community engagement, and investment in long-term asset
              health.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact-us" className="inline-flex items-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                Start a concession →
              </Link>
              <Link href="/business/water-supply" className="inline-flex items-center rounded-full border border-brand-red px-6 py-3 text-sm font-semibold text-brand-red transition hover:bg-brand-red/10">
                Explore water supply licenses
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


