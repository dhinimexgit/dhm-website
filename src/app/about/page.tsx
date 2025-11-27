"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { leadership } from "@/data/site-content";
import { CoreValuesCarousel } from "@/components/core-values-carousel";
import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "/about-us.png";

const coreValues = [
  {
    title: "Quality Assurance",
    description:
      "We are committed to delivering only high-quality products that meet or exceed Cambodian and international standards such as TIS, IEC, ANSI/IEEE, or specific client requirements.",
  },
  {
    title: "Technical Excellence",
    description:
      "Our equipment is built with premium materials, efficient design, and engineered to pass all routine and type tests for performance, safety, and longevity.",
  },
  {
    title: "Customer Commitment",
    description:
      "We prioritize customer satisfaction by providing only products that meet rigorous internal quality controls, ensuring reliability and value in every solution delivered.",
  },
  {
    title: "Standards-Driven Innovation",
    description:
      "We design and manufacture with a dual focus on local and global standards, merging innovation with compliance to deliver dependable, future-ready solutions.",
  },
  {
    title: "Integrity and Professionalism",
    description:
      "We adhere to ethical practices and professional conduct in every aspect of our operations—from product development to customer service and global partnerships.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="About Dhinimex"
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
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">About Us</p>
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Building Cambodia&apos;s Future Through Innovation and Excellence
          </h1>
          {/* <p className="max-w-7xl text-[15px] leading-relaxed text-white/90 sm:text-base lg:text-[17px]">
            Creating with Purpose - Driving Growth Through Innovation and Excellence
          </p> */}
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-20 px-4 sm:px-6 lg:px-8">
      {/* Intro Section */}
      <section className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
          Creating with Purpose
        </p>
        <h2 className="text-4xl font-bold text-brand-navy lg:text-5xl">
          Driving Growth Through Innovation and Excellence
        </h2>
        <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600">
          At Dhinimex, we approach every project with purpose—combining technical expertise, reliable service, and a deep commitment to Cambodia&apos;s development. Our work is grounded in innovation and executed with precision and care. The following vision, mission, and core values define the principles that guide us as we expand our impact locally and globally.
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6 rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ffffff]">
            <Image
              src="/vision.png"
              alt="Vision"
              width={65}
              height={65}
              className="h-[65px] w-[65px] object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-brand-navy">Vision</h2>
          <p className="text-xl font-semibold text-brand-red">
            Innovating Locally, Impacting Globally
          </p>
          <p className="text-base leading-relaxed text-slate-600">
            Our vision is to become a leading corporation in electrical appliances, water supply, and technological innovation, delivering world-class solutions and service that drive sustainable growth and industry impact, both locally and internationally.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ffffff]">
            <Image
              src="/mission.png"
              alt="Mission"
              width={65}
              height={65}
              className="h-[65px] w-[65px] object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-brand-navy">Mission</h2>
          <p className="text-base leading-relaxed text-slate-600">
            Our mission is to drive leadership in the electrical and technology sectors by delivering high-quality products and expert services, creating job opportunities, and expanding access to modern energy and clean water–especially in rural Cambodia. Through innovation, ethical practices, and professionalism, we aim to enhance our supply capabilities, empower communities, and establish a strong presence in the global market.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-12">
        <CoreValuesCarousel values={coreValues} />
      </section>

      {/* Our Leadership - Chairwoman */}
      <section className="space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
            Our Leadership
          </p>
          <h2 className="text-4xl font-bold text-brand-navy">
            Meet Our Chairwoman
          </h2>
          <p className="mx-auto max-w-3xl text-base text-slate-600">
            Guided by our chairwoman&apos;s vision and leadership, Dhinimex has established itself as a trusted and respected corporation within the industry.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 lg:flex lg:items-center lg:gap-10 lg:p-12">
            <div className="mx-auto w-full max-w-[240px] flex-shrink-0 overflow-hidden rounded-2xl lg:mx-0 lg:max-w-[260px]">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={leadership[0].portrait}
                  alt={leadership[0].name}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="mt-8 space-y-6 text-center lg:mt-0 lg:flex-1 lg:text-left">
              <div>
                <h3 className="text-3xl font-bold text-brand-navy">
                  {leadership[0].name}
                </h3>
                <p className="mt-2 text-lg font-semibold text-brand-red">
                  {leadership[0].title}
                </p>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Dhinimex Group originated from a small-scale business founded in 2003 and has since grown into a well-recognized company known for its continuous development and meaningful contributions to both society and the nation.
                </p>
                <p>
                  The company&apos;s strength and longevity are rooted in its firm commitment to a core direction: to earn recognition and trust from customers by upholding strong ethical standards, transparency, and integrity. Dhinimex places high importance on excellent service and product quality, which are key factors behind its current success and sustained growth.
                </p>
                <p>
                  This progress has been made possible thanks to the dedicated efforts of a collaborative team that works like a family, with persistence, strong commitment, mutual support, and effective communication. The principle of unity as strength has been central to the company&apos;s advancement.
                </p>
                <p>
                  Today, Dhinimex continues to grow and actively promotes the development of its workforce through training and encouragement of innovative thinking. The company aspires to remain a leading choice at the national level while advancing its mission on the international stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
            Directors
          </p>
          <h2 className="text-4xl font-bold text-brand-navy">
            Management Team
          </h2>
          <p className="mx-auto max-w-3xl text-base text-slate-600">
            Dhinimex&apos;s management team brings together a diverse group of experienced professionals with deep expertise in engineering, finance, operations, and strategic development. Through collaborative decision-making, proactive leadership, and a strong commitment to accountability, the team drives the company&apos;s continued success across multiple sectors.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {leadership.slice(1).map((leader) => (
            <article
              key={leader.name}
              className="overflow-hidden rounded-[32px] bg-white shadow-xl transition hover:shadow-2xl md:mx-auto md:max-w-[480px]"
            >
              <div className="flex flex-col items-center p-8 text-center">
                <div className="relative aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl">
                  <Image
                    src={leader.portrait}
                    alt={leader.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="mt-6 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-brand-navy">
                      {leader.name}
                    </h3>
                    <p className="mt-1 text-base font-semibold text-brand-red">
                      {leader.title}
                    </p>
                  </div>
                  {leader.quote && (
                    <p className="border-l-4 border-brand-red pl-4 text-left text-sm italic text-slate-600">
                      &quot;{leader.quote}&quot;
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}

