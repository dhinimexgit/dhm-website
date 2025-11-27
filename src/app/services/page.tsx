"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services, faqs } from "@/data/site-content";
import { FAQAccordion } from "@/components/faq";
import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "/services-banner.png";
const servicesBackground = "/services.png";

export default function ServicesPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="Services"
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
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">Services</p>
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Comprehensive Solutions for Infrastructure and Development
          </h1>
        </div>
      </section>
      <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
              Our Services
            </p>
            <h2 className="mb-6 text-4xl font-semibold text-brand-navy lg:text-5xl">
              Explore What We Offer
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-slate-700">
              For over two decades, Dhinimex has been a trusted name in EPC services—powering electric, water, and industrial infrastructure across Cambodia.
            </p>
          </div>
      {/* Services Section with Unified Background */}
      <section className="full-bleed relative bg-white py-16">
        <div className="absolute inset-0">
          <Image
            src={servicesBackground}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">

          {/* Services Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.slug}
                className="group relative overflow-hidden rounded-3xl transition"
                style={{ minHeight: '270px' }}
              >
                <div className="relative h-[270px] w-full">
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="flex h-[310px] flex-col rounded-2xl bg-white/60 p-4 backdrop-blur-md" style={{ border: 'none', outline: 'none', boxShadow: 'none', width: 'calc(100% + 30px)', marginLeft: '-15px', marginRight: '-15px' }}>
                      <div className="flex-grow space-y-2.5">
                        <div className="flex items-center gap-3">
                          {service.icon.startsWith("/") ? (
                            <Image
                              src={service.icon}
                              alt={service.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 flex-shrink-0 object-contain"
                            />
                          ) : (
                            <span className="text-2xl text-[#2E388C] flex-shrink-0">
                              {service.icon}
                            </span>
                          )}
                          <h2 className="text-lg font-bold text-[#2E388C] leading-tight">
                            {service.name}
                          </h2>
                        </div>
                        <p className="text-sm leading-relaxed text-[#2E388C] line-clamp-3 pt-5">
                          {service.description}
                        </p>
                      </div>
                      <Link
                        href={`/services/${service.slug}`}
                        className="mt-2.5 inline-flex items-center gap-2 text-sm font-semibold text-[#2E388C] transition hover:text-[#252f6e]"
                      >
                        Read More <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
        <section className="space-y-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
              Frequently Asked Questions (FAQ)
            </p>
            <h2 className="mb-4 text-4xl font-semibold text-brand-navy">
              Support & Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Get clear answers to the most common questions about Dhinimex services.
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      </div>
    </div>
  );
}
