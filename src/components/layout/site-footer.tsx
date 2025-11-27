import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { contactInfo, siteNav } from "@/data/site-content";

const aboutCopy =
  "Dhinimex Co., Ltd has been a registered company since 2003 and is one of the leading providers of electrical equipment supply, installation, and services across Cambodia.";

const socialIconMap: Record<string, ReactNode> = {
  Facebook: (
    <Image
      src="/facebook-icon.png"
      alt="Facebook"
      width={20}
      height={20}
      className="h-5 w-5 object-contain"
    />
  ),
  Telegram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M21.46 4.11a1.2 1.2 0 0 0-1.27-.18L3.52 11.02a1 1 0 0 0 .06 1.87l5.1 1.86 1.97 5.32a1 1 0 0 0 1.78.15l2.42-3.58 4.59 3.35a1 1 0 0 0 1.56-.64l2-13a1.2 1.2 0 0 0-.54-1.24ZM18.3 7.16l-9.4 6.08-3.14-1.14 12.54-5.09Z"
        fill="currentColor"
      />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4.98 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 8.75h3.95V21H3ZM9.5 8.75H13v1.67h.05c.49-.9 1.7-1.85 3.5-1.85 3.74 0 4.43 2.24 4.43 5.17V21H17V15c0-1.43-.03-3.27-2-3.27-2 .01-2.31 1.57-2.31 3.16V21H9.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  TikTok: (
    <Image
      src="/tiktok-icon.png"
      alt="TikTok"
      width={20}
      height={20}
      className="h-5 w-5 object-contain"
    />
  ),
  YouTube: (
    <Image
      src="/youtube-icon.png"
      alt="YouTube"
      width={20}
      height={20}
      className="h-5 w-5 object-contain"
    />
  ),
};

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-br from-brand-navy via-[#111a73] to-[#090f3c] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">About Company</p>
            <p className="mt-4 text-sm text-slate-200">{aboutCopy}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {contactInfo.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-navy transition hover:bg-white/80"
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
          <div>
            <p className="text-lg font-semibold">Quick Links</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {siteNav.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-red">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact-us" className="hover:text-brand-red">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">Contact Information</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {contactInfo.phones.join(" / ")}
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {contactInfo.email}
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {contactInfo.address}
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {contactInfo.hours}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-300 sm:px-6 lg:px-8">
          Copyright © {new Date().getFullYear()} DHINIMEX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

