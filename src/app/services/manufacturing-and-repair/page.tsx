"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";
const detailImage = "/manufacturing-repair.png";

const coreManufacturing = [
  "Distribution transformers up to 35kV built to IEC, ANSI/IEEE, and TIS standards.",
  "Custom LV/MV control panels and precision switchgear for substations and industrial plants.",
  "High-quality conductors, underground cables, and concrete poles tailored to project specifications.",
];

const repairCoverage = [
  "Refurbishment, rewinding, and accelerated testing for aging transformers.",
  "Full-scope repair and maintenance for switchgear, motors, pumps, and generators.",
  "On-site diagnostics, preventive maintenance, and modernization support for legacy fleets.",
];

const assurancePillars = [
  {
    title: "Certified Quality",
    description:
      "Manufacturing processes adhere to international benchmarks, ensuring every asset leaving the factory is grid-ready and compliant.",
  },
  {
    title: "Lifecycle Support",
    description:
      "Our technicians combine factory expertise with field experience to keep critical equipment reliable across decades of service.",
  },
  {
    title: "Integrated Delivery",
    description:
      "From component production to installation oversight, Dhinimex provides single-partner accountability for complex infrastructure builds.",
  },
];

export default function ManufacturingAndRepairDetailPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Manufacturing and Repair" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Manufacturing and Repair
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-red">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-brand-red">
            Services
          </Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">Manufacturing and Repair</span>
        </nav>

        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          {/* Image */}
          <div className="relative mx-auto mt-8 w-full max-w-lg lg:mx-0">
            <div
              className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto"
              style={{ width: "calc(100% - 32px)", height: "calc(100% - 32px)" }}
            />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: "17px" }}>
              <Image src={detailImage} alt="Manufacturing floor" width={720} height={480} className="h-auto w-full object-cover" priority />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">Services</p>
            <h2 className="text-4xl font-semibold text-brand-navy">Manufacturing and Repair</h2>
            <p className="text-base leading-relaxed text-slate-600">
              We design and manufacture high-quality electrical equipment, including high-quality cables and conductors, distribution transformers, control panels, and concrete poles. Our products are built to meet international standards and support reliable power infrastructure development.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Our team also provides comprehensive repair and maintenance services for transformers, switchgear, motors, pumps, generators, and more. With decades of expertise, we ensure critical equipment remains efficient, safe, and dependable.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact-us" className="inline-flex items-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                Discuss a project →
              </Link>
              <Link href="/products" className="inline-flex items-center rounded-full border border-brand-red px-6 py-3 text-sm font-semibold text-brand-red transition hover:bg-brand-red/10">
                Explore equipment catalogue
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


