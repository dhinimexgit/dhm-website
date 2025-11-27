"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

export default function SaekarajTransfoDetailPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image
            src={heroImage}
            alt="Saekaraj Transfo Co., LTD"
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
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Saekaraj Transfo Co., LTD
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-red">Home</Link>
          <span>/</span>
          <Link href="/business/manufacturing" className="hover:text-brand-red">Manufacturing</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">Saekaraj Transfo Co., LTD</span>
        </nav>

        {/* Content Section - Similar to Homepage About Us */}
        <section className="grid gap-16 lg:grid-cols-2 lg:items-start">
          {/* Image Side */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 mt-8">
            <div className="absolute -top-6 right-5 rounded-tl-[50px] bg-[#2E388C] shadow-2xl lg:-left-6 lg:right-auto" style={{ width: 'calc(100% - 32px)', height: 'calc(100% - 32px)' }} />
            <div className="relative ml-8 overflow-hidden rounded-tl-[15px] rounded-br-[15px] shadow-xl" style={{ marginTop: '17px' }}>
              <Image
                src="/saekaraj.jpg"
                alt="Saekaraj Transfo Co., LTD"
                width={720}
                height={480}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
              Manufacturing
            </p>
            <h2 className="text-4xl font-semibold text-brand-navy">
              Saekaraj Transfo Co., LTD
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              <strong>Saekaraj Transfo Co., Ltd.</strong>, established in 2014, is proud to be the <strong>first transformer manufacturing factory in Cambodia</strong>. Operating under the brand name <strong>&quot;RAJ&quot;</strong>, the company specializes in producing high-quality oil-immersed distribution transformers tailored to meet regional energy demands.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Beyond manufacturing, Saekaraj Transfo provides <strong>comprehensive repair and maintenance services</strong> for all brands of power and distribution transformers, ensuring reliable performance both in-factory and on-site. With a strong focus on quality, innovation, and customer support, Saekaraj Transfo continues to drive Cambodia&apos;s electrical infrastructure forward.
            </p>

            {/* Key Highlights */}
            <div className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg bg-[#2E388C]/5 p-4 border-l-4 border-[#2E388C]">
                  <svg className="h-6 w-6 flex-shrink-0 text-[#2E388C]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-brand-navy">First in Cambodia</p>
                    <p className="text-sm text-slate-600">Established in 2014 as Cambodia&apos;s pioneering transformer manufacturer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-[#2E388C]/5 p-4 border-l-4 border-[#2E388C]">
                  <svg className="h-6 w-6 flex-shrink-0 text-[#2E388C]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-brand-navy">Brand: RAJ</p>
                    <p className="text-sm text-slate-600">High-quality oil-immersed distribution transformers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-[#2E388C]/5 p-4 border-l-4 border-[#2E388C]">
                  <svg className="h-6 w-6 flex-shrink-0 text-[#2E388C]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-brand-navy">Full Service</p>
                    <p className="text-sm text-slate-600">Comprehensive repair & maintenance for all transformer brands</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-4">
              <a 
                href="https://facebook.com/dhinimex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white transition hover:bg-[#252f6e]"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/dhinimex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white transition hover:bg-[#252f6e]"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com/@dhinimex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white transition hover:bg-[#252f6e]"
                aria-label="TikTok"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/@dhinimex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white transition hover:bg-[#252f6e]"
                aria-label="YouTube"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

