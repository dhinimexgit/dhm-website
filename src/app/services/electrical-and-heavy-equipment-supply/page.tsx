"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { StickyHeader } from "@/components/home/sticky-header";

const heroImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80";

const equipmentCategories = [
  {
    title: "Power Transmission & Distribution",
    items: [
      "Electrical conductors up to 35kV",
      "Underground, submarine, and underwater cables up to 35kV",
      "Distribution transformers up to 35kV",
      "Switchgear and control panels (up to 35kV)",
    ]
  },
  {
    title: "Renewable & Energy Solutions",
    items: [
      "Stand-alone and grid-tied solar panel systems",
      "Inverter outdoor motors",
      "Low-energy water pumps",
      "Automatic meter reading systems",
    ]
  },
  {
    title: "Metering & Instrumentation",
    items: [
      "Electrical kWh meters (Mitsubishi, Landis + Gyr)",
      "Voltage transformers (VT) and current transformers (CT)",
      "Portable water meters",
    ]
  },
  {
    title: "Heavy Equipment & Machinery",
    items: [
      "Oil purifier machines (GlobeCore)",
      "Pulling machines for stringing works",
      "Drilling machines for power erection",
      "Crane trucks, lorries, bulldozers",
    ]
  },
];

export default function ElectricalAndHeavyEquipmentSupplyDetailPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <StickyHeader isVisible={isScrolled} />

      <div>
        {/* Hero Banner Section */}
        <section className="relative min-h-[50vh] overflow-hidden lg:min-h-[60vh]">
          <div className="absolute inset-0 z-0">
            <Image src={heroImage} alt="Electrical and Heavy Equipment Supply" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-brand-navy/50" />
          </div>

          {/* Header - Desktop Only */}
          <div className="relative z-30 hidden lg:block">
            <div className="mx-auto max-w-7xl px-8 pt-6">
              <div className="relative rounded-xl bg-brand-navy/80 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between px-8 py-4">
                  <Link href="/" className="flex-shrink-0">
                    <Image src="/brands/DHM-WHITE.png" alt="Dhinimex logo" width={160} height={46} priority className="h-auto w-[160px]" />
                  </Link>
                  <nav className="flex items-center gap-8 text-[15px] font-medium text-white">
                    <Link href="/about" className="group relative transition hover:text-white/80">About Us<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <div className="group relative">
                      <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">
                        Business Portfolio
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </Link>
                      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Trading</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Manufacturing</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Electricity Distribution</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Water Supply</Link>
                        <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Scientific</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">Services<span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" /></Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">Products<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">News<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/careers" className="group relative transition hover:text-white/80">Careers<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                  </nav>
                  <div className="flex items-center gap-4">
                    <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">Contact Us</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex min-h-[calc(50vh-120px)] items-center py-16 lg:min-h-[calc(60vh-120px)] lg:py-0">
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Link href="/" className="font-medium text-white/70 transition hover:text-white">Home</Link>
                  <span className="text-white/40">/</span>
                  <Link href="/services" className="font-medium text-white/70 transition hover:text-white">Services</Link>
                  <span className="text-white/40">/</span>
                  <span className="font-medium text-brand-red">Equipment Supply</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Electrical & Heavy Equipment Supply
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  Comprehensive range of high-quality electrical and heavy equipment solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              {/* Image Side */}
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl bg-brand-navy/10 lg:-left-6 lg:-top-6" />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image src="/utilities-elec-provider.png" alt="Electrical Equipment" width={720} height={480} className="h-auto w-full object-cover" priority />
                </div>
              </div>

              {/* Content Side */}
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">Our Services</p>
                  <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">Equipment Supply</h2>
                </div>
                
                <div className="space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    We provide a comprehensive range of <strong className="text-brand-navy">high-quality electrical and heavy equipment</strong> solutions to support power distribution, installation, and maintenance projects.
                  </p>
                  <p>
                    From medium-voltage components to household-grade products, Dhinimex aggregates multi-brand inventory for rapid deployment with technical assurance and nationwide fulfilment.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                    Request Product List
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                  <Link href="/products" className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white">
                    Browse Products
                  </Link>
                </div>
              </div>
            </div>

            {/* Equipment Categories Grid */}
            <div className="mt-20">
              <h3 className="mb-8 text-center text-2xl font-bold text-brand-navy">Our Product Categories</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {equipmentCategories.map((category, index) => (
                  <div key={index} className="rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                    <h4 className="mb-4 text-lg font-semibold text-brand-navy">{category.title}</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-red" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-navy py-16">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">Need Equipment for Your Project?</h2>
            <p className="mb-8 text-white/80">Contact us for product inquiries and technical support.</p>
            <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-base font-semibold text-white transition hover:bg-[#c91e21]">
              Get in Touch
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
