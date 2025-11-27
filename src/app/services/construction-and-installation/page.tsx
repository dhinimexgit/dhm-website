"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";
const detailImage = "/construction-installation.png";

const deliveryScope = [
  "Design, BOQ preparation, procurement, and commissioning for MV/LV networks.",
  "Substation assembly, transformer installation, and performance testing.",
  "Precision earthing, grounding, and protection planning for high-availability grids.",
];

const integratedServices = [
  "Solar energy systems and hybrid generation for residential, commercial, and industrial facilities.",
  "Air-conditioning, building wiring, and smart metering deployments.",
  "Underground, submarine, and overhead cabling projects with full monitoring integration.",
];

const constructionPillars = [
  {
    title: "End-to-End Accountability",
    description:
      "Single-partner delivery from concept to energization protects timelines while simplifying stakeholder coordination for complex builds.",
  },
  {
    title: "Future-Ready Networks",
    description:
      "We integrate digital metering, remote monitoring, and loss-reduction strategies so enterprises can manage consumption in real time.",
  },
  {
    title: "Trusted Since 2003",
    description:
      "Dhinimex has delivered critical infrastructure throughout Cambodia, including rapid growth zones that demand meticulous safety compliance.",
  },
];

export default function ConstructionAndInstallationDetailPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Construction and Installation" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Construction and Installation
          </h1>
        </div>
      </section>

      {/* Content */}
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
          <span className="text-brand-navy font-semibold">Construction and Installation</span>
        </nav>

        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div className="relative mx-auto mt-8 w-full max-w-lg lg:mx-0">
            <div
              className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto"
              style={{ width: "calc(100% - 32px)", height: "calc(100% - 32px)" }}
            />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: "17px" }}>
              <Image src={detailImage} alt="Construction and installation works" width={720} height={480} className="h-auto w-full object-cover" priority />
            </div>
          </div>

          <div className="space-y-6 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">Services</p>
            <h2 className="text-4xl font-semibold text-brand-navy">Construction and Installation</h2>
            <p className="text-base leading-relaxed text-slate-600">
              Dhinimex delivers end-to-end power infrastructure—from poles and transformers to fully equipped substations—ensuring every stage,
              from engineering designs to energized handover, is managed by a single accountable team.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Our specialists handle advanced cabling systems, including underground, submarine, and precision grounding networks, while
              integrating solar, HVAC, and electrical wiring services for turnkey residential, commercial, and industrial projects.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/40 backdrop-blur">
                <h3 className="text-xl font-semibold text-brand-navy">Delivery Scope</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                  {deliveryScope.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-brand-red">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/40 backdrop-blur">
                <h3 className="text-xl font-semibold text-brand-navy">Integrated Services</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                  {integratedServices.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-brand-red">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact-us" className="inline-flex items-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                Plan an installation →
              </Link>
              <Link href="/projects" className="inline-flex items-center rounded-full border border-brand-red px-6 py-3 text-sm font-semibold text-brand-red transition hover:bg-brand-red/10">
                View reference projects
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


