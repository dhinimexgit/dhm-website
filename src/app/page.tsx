"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { stats, services, whyChooseUs, homePageBrands, posts } from "@/data/site-content";
import { BrandCarousel } from "@/components/brand-carousel";
import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";
const aboutImage = "https://www.dhinimex.com/wp-content/uploads/2025/11/Dhinimex-building_e.jpg";
const servicesBackground = "https://www.dhinimex.com/wp-content/uploads/2025/08/bg-our_service.png";
const blogIntro =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,";
const trustIcons = ["✔", "🛡️", "💬", "⏱️"];

export default function Home() {
  const highlightedStats = stats.slice(0, 2);
  const featuredServices = services.slice(0, 4);
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="space-y-16 pb-20">
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[700px] w-full sm:h-[700px] lg:h-[900px]">
          <Image
            src={heroImage}
            alt=""
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
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">Home</p>
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Driven by Quality, Guided by Standards, Sustained by Service
          </h1>
          <p className="max-w-7xl text-[15px] leading-relaxed text-white/90 sm:text-base lg:text-[17px]">
            Empowering progress with trusted expertise. Dhinimex delivers comprehensive electrical, water supply,
            and engineering solutions driven by innovation, quality, and a commitment to long-term impact.
          </p>
          <Link
            href="/about"
            className="mt-2 bg-[#2E388C] px-9 py-3 text-[15px] font-semibold text-[#ffffff] transition"
          >
            Learn More
          </Link>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
      <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
        <div className="relative mx-auto w-full max-w-lg lg:mx-0 mt-16">
          <div className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto" style={{ width: 'calc(100% - 32px)', height: 'calc(100% - 32px)' }} />
          <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: '17px' }}>
            <Image
              src={aboutImage}
              alt="Dhinimex storefront"
              width={720}
              height={480}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
        <div className="space-y-5 lg:pt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
            About Us
          </p>
          <h2 className="text-4xl font-semibold text-brand-navy">
            From Powering Homes to Shaping Industries
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            Dhinimex Co., Ltd, established in 2003, has evolved from a trade-based company focused on electrical appliances
            and water supply equipment into a highly respected corporation with a diversified portfolio of approximately
            18 companies across five scientific and technological sectors.
          </p>
          <p className="text-base leading-relaxed text-slate-600">
            Today, the group employs over 500 professionals representing multiple nationalities, reflecting its dynamic growth
            and international outlook. Driven by a commitment to excellence and continuous innovation, Dhinimex actively
            leverages emerging technologies to expand operations, enhance product quality, and deliver cutting-edge solutions.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {highlightedStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4"
              >
                {stat.icon ? (
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-base font-bold text-white">
                    {stat.value}
                  </span>
                )}
                <div>
                  <p className="text-2xl font-semibold text-brand-navy">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
          Built on Trust
        </p>
        <h2 className="text-4xl font-semibold text-brand-navy">
          Quality You Can Trust, Service You Can Rely On
        </h2>
        <p className="mx-auto max-w-3xl text-base text-slate-600">
          At Dhinimex, we take pride in delivering high-quality, precision-tested products designed for durability and efficiency.
          Backed by responsive customer support and expert technical service, we’re committed to meeting your needs—before
          and after every sale.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[24px] bg-white p-6 text-left shadow-lg"
            >
              {item.icon ? (
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
              ) : (
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-navy text-lg text-white">
                  {trustIcons[index % trustIcons.length]}
                </span>
              )}
              <h3 className="mt-4 text-xl font-semibold text-brand-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              <span className="mt-4 block h-1 w-14 rounded-full bg-brand-navy" />
            </article>
          ))}
        </div>
      </section>

      </div>
      <section className="full-bleed relative overflow-hidden py-16">
        <Image
          src={servicesBackground}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:px-8 lg:grid-cols-[0.85fr,1.15fr]">
          <div className="rounded-[32px] bg-white/90 p-8 shadow-2xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
              Our Services
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-brand-navy">Explore what we offer</h2>
            <p className="mt-4 text-base leading-relaxed text-brand-navy/80">
              For more than two decades, Dhinimex has been a trusted leader in delivering reliable expertise in the repair,
              maintenance, and testing of a wide range of electrical and water supply systems and components. Beyond services
              and maintenance, Dhinimex has also expanded into utilities, powering electrical and water infrastructure across
              provinces in Cambodia.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex rounded-full border border-[#2E388C] px-6 py-3 text-sm font-semibold text-[#2E388C] transition hover:bg-[#2E388C] hover:text-white"
            >
              View More
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredServices.map((service) => (
              <article
                key={service.slug}
                className="flex h-full flex-col rounded-[28px] bg-white p-6 text-brand-navy shadow-xl transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  {service.icon.startsWith("/") ? (
                    <Image
                      src={service.icon}
                      alt={service.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2E388C]/10 text-lg text-[#2E388C]">
                      {service.icon}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold leading-snug">{service.name}</h3>
                </div>
                <p className="mt-4 flex-grow text-sm text-slate-600">{service.description}</p>
                <Link
                  href={`/services#${service.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2E388C]"
                >
                  Read More <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
      <section className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
          Our Brands
        </p>
        <h2 className="text-4xl font-semibold text-brand-navy">Our Brands</h2>
        <p className="mx-auto max-w-3xl text-base text-slate-600">
          We are the official distributor of a wide range of renowned international and corporate brands,
          bringing trusted global quality to the Cambodian market.
        </p>
        <BrandCarousel brands={homePageBrands} />
      </section>

      <section className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
          Latest Blog
        </p>
        <h2 className="text-4xl font-semibold text-brand-navy">Latest Blog</h2>
        <p className="mx-auto max-w-3xl text-base text-slate-600">{blogIntro}</p>
        <div className="grid gap-8 text-left md:grid-cols-3">
          {latestPosts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/95 shadow-sm"
            >
              <div className="relative h-56 w-full overflow-hidden border-b-4 border-brand-red">
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-3 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h3 className="text-xl font-semibold text-brand-navy">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex text-sm font-semibold text-brand-red"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
