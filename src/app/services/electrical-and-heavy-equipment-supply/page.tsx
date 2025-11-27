"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";
const detailImage = "/utilities-elec-provider.png";

const transmissionDistribution = [
  "Electrical conductors up to 35kV",
  "Underground, submarine, and underwater cables up to 35kV",
  "Distribution transformers up to 35kV",
  "Switchgear and control panels (up to 35kV)",
  "LV and medium voltage lightning arresters",
  "Auto-Reclosers, load break switches (manual & remote SMS control), sectionalizers, and relay protection devices",
  "Capacitor banks for low & medium voltage power factor correction",
  "Insulators (pin, pin post, line post, string/tension – porcelain & polymer)",
  "Steel and concrete cross arms/support structures",
];

const renewableSolutions = [
  "Stand-alone and grid-tied solar panel systems",
  "Inverter outdoor motors",
  "Low-energy water pumps (ground-mounted and submersible)",
  "Automatic meter reading systems",
];

const meteringInstrumentation = [
  "Electrical kWh meters (Mitsubishi, Landis + Gyr)",
  "Instrument transformers: voltage transformers (VT) and current transformers (CT)",
  "Portable water meters",
];

const electricalComponentsTools = [
  "House wiring cables and control cables",
  "Circuit breakers: CB, MCB, MCCB (up to 35kV)",
  "Electrical maintenance and installation tools",
  "Testing devices: Euro SMC, MTE, Omicron, Megger",
];

const heavyEquipmentMachinery = [
  "Oil purifier machines (GlobeCore, Ukraine/Europe)",
  "Pulling machines for stringing works",
  "Drilling machines/vehicles for power erection works",
  "Crane trucks, lorries, bulldozers, and related equipment",
];

const climateHousehold = [
  "Air conditioning systems",
  "Gardening materials for modern households",
];

const safetyEquipment = [
  "Safety helmets",
  "High-tension jackets",
  "Belts, boots, and shoes",
  "Insulated gloves and PPE kits",
];

const supplyPillars = [
  {
    title: "Complete Catalogue",
    description:
      "From medium-voltage components to household-grade products, Dhinimex aggregates multi-brand inventory for rapid deployment.",
  },
  {
    title: "Technical Assurance",
    description:
      "Every item is vetted by engineers who support installation, commissioning, and after-sales diagnostics for seamless integration.",
  },
  {
    title: "Nationwide Fulfilment",
    description:
      "Strategic warehousing and logistics ensure projects across Cambodia receive the right equipment on time and on budget.",
  },
];

export default function ElectricalAndHeavyEquipmentSupplyDetailPage() {
  return (
    <div className="space-y-16 pb-20">
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Electrical and Heavy Equipment Supply" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Electrical & Heavy Equipment Supply
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
          <span className="text-brand-navy font-semibold">Electrical & Heavy Equipment Supply</span>
        </nav>

        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div className="relative mx-auto mt-8 w-full max-w-lg lg:mx-0">
            <div
              className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto"
              style={{ width: "calc(100% - 32px)", height: "calc(100% - 32px)" }}
            />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: "17px" }}>
              <Image src={detailImage} alt="Electrical components" width={720} height={480} className="h-auto w-full object-cover" priority />
            </div>
          </div>

          <div className="space-y-6 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">Services</p>
            <h2 className="text-4xl font-semibold text-brand-navy">Electrical & Heavy Equipment Supply</h2>
            <p className="text-base leading-relaxed text-slate-600">
            We provide a comprehensive range of high-quality electrical and heavy equipment solutions to support power distribution, installation, and maintenance projects. Our offerings include:
            </p>
            
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="columns-1 space-y-6 md:columns-2 lg:columns-3 md:space-y-6">
              {[
                { title: "Power Transmission & Distribution Equipment", items: transmissionDistribution },
                { title: "Renewable & Energy-Saving Solutions", items: renewableSolutions },
                { title: "Electrical Components & Tools", items: electricalComponentsTools },
                { title: "Climate & Household Solutions", items: climateHousehold },
                { title: "Metering & Instrumentation", items: meteringInstrumentation },
                { title: "Heavy Equipment & Machinery", items: heavyEquipmentMachinery },
                { title: "Safety Equipment", items: safetyEquipment },

              ].map((group) => (
                <div
                  key={group.title}
                  className="mb-6 break-inside-avoid rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-blue-100/40 backdrop-blur last:mb-0"
                >
                  <h3 className="text-xl font-semibold text-brand-navy">{group.title}</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-brand-red">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact-us" className="inline-flex items-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                Request product list →
              </Link>
              <Link href="/products" className="inline-flex items-center rounded-full border border-brand-red px-6 py-3 text-sm font-semibold text-brand-red transition hover:bg-brand-red/10">
                Browse featured products
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


