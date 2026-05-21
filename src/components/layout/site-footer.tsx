"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/data/site-content";
import { useLanguage } from "@/lib/i18n";

const ourBusinesses = [
  { label: "Dhinimex", href: "/business/trading" },
  { label: "Nicole Home Mart", href: "/business/trading" },
  { label: "Khmer Concrete", href: "/business/manufacturing" },
  { label: "Vong Chan Cable", href: "/business/manufacturing" },
  { label: "Saekaraj Transfo", href: "/business/manufacturing" },
  { label: "Electricity Distribution", href: "/business/electricity" },
  { label: "Water Supply", href: "/business/water-supply" },
  { label: "CamRad Diagnostic Center", href: "/business/scientific" },
  { label: "Camirrad Irradiation Facility", href: "/business/scientific" },

];

const socialIconMap: Record<string, ReactNode> = {
  Facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="currentColor"
      />
    </svg>
  ),
  Telegram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
        fill="currentColor"
      />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="currentColor"
      />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
        fill="currentColor"
      />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        fill="currentColor"
      />
    </svg>
  ),
};

export function SiteFooter() {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t.nav.about, href: "/about" },
    { label: t.nav.services, href: "/services" },
    { label: t.nav.products, href: "/products" },
    { label: t.nav.careers, href: "/careers" },
    { label: t.nav.blog, href: "/news" },
    { label: t.nav.contact, href: "/contact-us" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#111a73] to-[#090f3c] text-white">
      {/* Decorative elements */}
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />
      <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src="/brands/DHM-WHITE.png"
                alt="Dhinimex logo"
                width={160}
                height={46}
                className="h-auto w-[160px]"
                unoptimized
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              {t.footer.aboutCopy}
            </p>
          </div>

          {/* Our Businesses - Split into 2 columns (5 left, 4 right) */}
          {/* <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              Our Businesses
            </h3>
            <div className="grid grid-cols-2 gap-y-3">
              <ul className="space-y-3">
                {ourBusinesses.slice(0, 5).map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-brand-red"
                    >
                      <span className="h-1 w-1 rounded-full bg-brand-red transition-transform group-hover:scale-150" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {ourBusinesses.slice(5).map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-brand-red"
                    >
                      <span className="h-1 w-1 rounded-full bg-brand-red transition-transform group-hover:scale-150" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div> */}

          {/* Quick Links */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2.5 text-sm text-white/70 transition-colors hover:text-brand-red"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red transition-transform group-hover:scale-125" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-5 lg:pl-4">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {t.footer.contactInfo}
            </h3>

            <ul className="space-y-3.5 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-4 w-4 flex-shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{contactInfo.phones.join(" / ")}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-4 w-4 flex-shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{contactInfo.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-4 w-4 flex-shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{contactInfo.hours}</span>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {contactInfo.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-red hover:scale-110"
                  aria-label={link.label}
                >
                  {socialIconMap[link.label] ?? (
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {link.label.charAt(0)}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/50">
              {t.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
            </p>
            <div className="flex gap-6 text-xs text-white/50">
              <Link href="/privacy" className="transition hover:text-white">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                {t.footer.termsOfService}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
