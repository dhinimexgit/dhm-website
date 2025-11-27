"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";
const detailImage = "/water-supply.png";

export default function WaterAndUtilityDetailPage() {
  return (
    <div className="space-y-16 pb-20">
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Water & Utility" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Water & Utility
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
          <span className="text-brand-navy font-semibold">Water & Utility</span>
        </nav>

        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div className="relative mx-auto mt-8 w-full max-w-lg lg:mx-0">
            <div
              className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto"
              style={{ width: "calc(100% - 32px)", height: "calc(100% - 32px)" }}
            />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: "17px" }}>
              <Image src={detailImage} alt="Water & Utility" width={720} height={480} className="h-auto w-full object-cover" priority />
            </div>
          </div>

          <div className="space-y-6 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">Services</p>
            <h2 className="text-4xl font-semibold text-brand-navy">Water & Utility</h2>
            <p className="text-base leading-relaxed text-slate-600">
              Our Water & Utility services page is currently under construction. We are working hard to bring you comprehensive information about our water infrastructure, pumping systems, and utility management solutions.
            </p>
            
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/40 backdrop-blur">
               <h3 className="text-xl font-semibold text-brand-navy">In Progress</h3>
               <p className="mt-2 text-slate-600">
                 Content coming soon. Please check back later for updates.
               </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact-us" className="inline-flex items-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                Contact Us →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

