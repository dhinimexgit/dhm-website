"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { posts, newsHero } from "@/data/site-content";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

export default function BlogPage() {
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Blog hero" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">Blog</p>
          <h1 className="max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Stories From the Teams Powering Cambodia&apos;s Growth
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Latest Blog</p>
            <h2 className="text-4xl font-semibold text-brand-navy lg:text-5xl">Insights, culture, and on-site highlights.</h2>
            <p className="text-lg text-slate-600">{newsHero.description}</p>
          </div>
          {featuredPost && (
            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-blue-100/60">
              <div className="relative h-64 w-full">
                <Image src={featuredPost.cover} alt={featuredPost.title} fill className="object-cover" sizes="100vw" />
              </div>
              <div className="space-y-3 p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red">
                  {new Date(featuredPost.date).toLocaleDateString()}
                </p>
                <h3 className="text-3xl font-semibold text-brand-navy">{featuredPost.title}</h3>
                <p className="text-base leading-relaxed text-slate-600 line-clamp-3">{featuredPost.excerpt}</p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition hover:text-[#b10f12]"
                >
                  Read more →
                </Link>
              </div>
            </article>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red">More stories</p>
              <h3 className="text-3xl font-semibold text-brand-navy">From around the business</h3>
            </div>
            <Link
              href="/contact-us"
              className="hidden rounded-full border border-brand-red px-5 py-2 text-sm font-semibold text-brand-red transition hover:bg-brand-red/10 md:inline-flex"
            >
              Share a story
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {secondaryPosts.map((post) => (
              <article key={post.slug} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 w-full">
                  <Image src={post.cover} alt={post.title} fill className="object-cover" sizes="100vw" />
                </div>
                <div className="flex flex-1 flex-col space-y-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                  <h4 className="text-xl font-semibold text-brand-navy">{post.title}</h4>
                  <p className="flex-grow text-sm leading-relaxed text-slate-600 line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition hover:text-[#b10f12]"
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


