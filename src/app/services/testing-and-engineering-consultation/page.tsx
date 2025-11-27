"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";
const detailImage = "/testing-engineering.png";

const diagnostics = [
  "Relay setting, commissioning, and protection coordination for MV and LV systems.",
  "Transformer oil purification, thermographic inspections, and predictive diagnostics.",
  "Field laboratories equipped for loss analysis, cable testing, and power quality audits.",
];

const consultingTracks = [
  "Engineering design and turnkey consultation for substations, transformers, and distribution networks.",
  "Integrated solutions covering overhead, underground, and submarine corridors with remote monitoring.",
  "Smart maintenance programs that combine data logging with rapid-response service teams.",
];

const reliabilityPillars = [
  {
    title: "Precision Testing",
    description: "Advanced instrumentation and lab procedures deliver actionable insights that extend asset life cycles.",
  },
  {
    title: "MV/LV Expertise",
    description: "We cover every voltage class with standardized procedures so utilities can scale safely.",
  },
  {
    title: "Consultative Delivery",
    description: "Our engineers partner with clients from feasibility to commissioning, ensuring every upgrade is measurable.",
  },
];

export default function TestingAndEngineeringConsultationDetailPage() {
  return (
    <div className="space-y-16 pb-20">
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Testing and Engineering Consultation" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Testing and Engineering Consultation
          </h1>
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
          <span className="text-brand-navy font-semibold">Testing and Engineering Consultation</span>
        </nav>

        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div className="relative mx-auto mt-8 w-full max-w-lg lg:mx-0">
            <div
              className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto"
              style={{ width: "calc(100% - 32px)", height: "calc(100% - 32px)" }}
            />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: "17px" }}>
              <Image src={detailImage} alt="Testing laboratory" width={720} height={480} className="h-auto w-full object-cover" priority />
            </div>
          </div>

          <div className="space-y-6 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">Services</p>
            <h2 className="text-4xl font-semibold text-brand-navy">Testing & Engineering Consultation</h2>
            <p className="text-base leading-relaxed text-slate-600">
              From relay setting and transformer oil purification to system diagnostics, our testing services are designed to maximize performance and extend equipment lifespan. We deliver precise, trusted results to support smooth operations.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              We also provide end-to-end power and distribution solutions, covering MV & LV systems—overhead, underground, and submarine. Our expertise spans engineering design, project consultation, and turnkey implementation, from substations and transformers to relay protection and electrical panels. With advanced diagnostics, smart maintenance, and loss-reduction strategies, we help clients optimize efficiency, minimize downtime, and extend the life of their infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact-us" className="inline-flex items-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                Schedule diagnostics →
              </Link>
              {/* <Link href="/blog" className="inline-flex items-center rounded-full border border-brand-red px-6 py-3 text-sm font-semibold text-brand-red transition hover:bg-brand-red/10">
                Read technical insights
              </Link> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


