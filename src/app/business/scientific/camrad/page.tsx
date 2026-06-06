"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { StickyHeader } from "@/components/home/sticky-header";
import { NavAdminLoginLink } from "@/components/layout/nav-admin-login-link";
import {
import { useLanguage } from '@/lib/i18n';
  NavUtilityCluster,
  NavUtilityDivider,
  NAV_UTILITY_ICON_CLASS,
} from "@/components/layout/nav-utility-cluster";

const heroImage = "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1920&q=80";

export default function CamradPage() {
  const { t, language, setLanguage } = useLanguage();
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
            <Image src={heroImage} alt="CamRad Diagnostic" fill priority className="object-cover" sizes="100vw" />
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
                    <Link href="/about" className="group relative transition hover:text-white/80">{t.nav.about}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <div className="group relative">
                      <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">{t.nav.business}<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </Link>
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
                      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.trading}</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.manufacturing}</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.electricity}</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.water}</Link>
                        <Link href="/business/scientific" className="block rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-brand-red">{t.business.scientific}</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">{t.nav.services}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">{t.nav.products}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">{t.nav.blog}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/careers" className="group relative transition hover:text-white/80">{t.nav.careers}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                  </nav>
                  <div className="flex items-center gap-3">
                    <NavUtilityCluster>
                    <NavAdminLoginLink />
                  </NavUtilityCluster>
                  <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">{t.nav.contact}</Link>
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
                  <Link href="/business" className="font-medium text-white/70 transition hover:text-white">{t.nav.business}</Link>
                  <span className="text-white/40">/</span>
                  <Link href="/business/scientific" className="font-medium text-white/70 transition hover:text-white">{t.business.scientific}</Link>
                  <span className="text-white/40">/</span>
                  <span className="font-medium text-brand-red">{language === 'kh' ? "ខេមរ៉ាដ" : "CamRad"}</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  {language === 'kh' ? "មជ្ឈមណ្ឌលរោគវិនិច្ឆ័យ ខេមរ៉ាដ" : "CamRad Diagnostic"}
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  {language === 'kh' ? "សេវាកម្មរូបភាពរោគវិនិច្ឆ័យវេជ្ជសាស្ត្រកម្រិតខ្ពស់សម្រាប់អ្នកផ្តល់សេវាថែទាំសុខភាព។" : "Advanced medical diagnostic imaging services for healthcare providers."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
              {/* Image Side */}
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl bg-brand-navy/10 lg:-left-6 lg:-top-6" />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image src="/camrad.jpg" alt="CamRad Diagnostic Center" width={720} height={480} className="h-auto w-full object-cover" priority />
                </div>
              </div>

              {/* Content Side */}
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">{language === 'kh' ? "សេវាកម្មវិទ្យាសាស្ត្រ" : "Scientific Services"}</p>
                  <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">{language === 'kh' ? "អំពីមជ្ឈមណ្ឌលរោគវិនិច្ឆ័យ ខេមរ៉ាដ" : "About CamRad Diagnostic"}</h2>
                </div>
                
                <div className="space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    <strong className="text-brand-navy">{language === 'kh' ? "មជ្ឈមណ្ឌលរោគវិនិច្ឆ័យ ខេមរ៉ាដ" : "CamRad Diagnostic"}</strong>{language === 'kh' ? " ផ្តល់នូវសេវាកម្មរូបភាពវេជ្ជសាស្ត្រកម្រិតខ្ពស់ដល់អ្នកផ្តល់សេវាថែទាំសុខភាពទូទាំងប្រទេសកម្ពុជា ដោយផ្តល់ជូននូវបច្ចេកវិទ្យារោគវិនិច្ឆ័យទំនើបចុងក្រោយ។" : " provides advanced medical imaging services to healthcare providers across Cambodia, offering state-of-the-art diagnostic technology."}
                  </p>
                  <p>
                    {language === 'kh' ? "មជ្ឈមណ្ឌលរបស់យើងត្រូវបានបំពាក់ដោយឧបករណ៍រូបភាពទំនើប និងមានបុគ្គលិកជាអ្នកជំនាញដែលបានទទួលការបណ្តុះបណ្តាល ដើម្បីផ្តល់លទ្ធផលរោគវិនិច្ឆ័យត្រឹមត្រូវ និងទាន់ពេលវេលាសម្រាប់អ្នកជំងឺ។" : "Our facility is equipped with modern imaging equipment and staffed by trained professionals to deliver accurate and timely diagnostic results for patients."}
                  </p>
                </div>

                {/* Key Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-brand-navy">{language === 'kh' ? "សេវាកម្មសំខាន់ៗ" : "Key Services"}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy/10">
                        <svg className="h-5 w-5 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-navy">{language === 'kh' ? "ការថត CT ស្កេន" : "CT Scanning"}</p>
                        <p className="text-sm text-slate-600">{language === 'kh' ? "រូបភាពកម្រិតខ្ពស់" : "Advanced imaging"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy/10">
                        <svg className="h-5 w-5 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-navy">{language === 'kh' ? "សេវាកម្ម MRI" : "MRI Services"}</p>
                        <p className="text-sm text-slate-600">{language === 'kh' ? "រោគវិនិច្ឆ័យលម្អិត" : "Detailed diagnostics"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy/10">
                        <svg className="h-5 w-5 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-navy">{language === 'kh' ? "ការថតកាំរស្មីអ៊ិច" : "X-Ray Imaging"}</p>
                        <p className="text-sm text-slate-600">{language === 'kh' ? "លទ្ធផលរហ័ស" : "Quick results"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy/10">
                        <svg className="h-5 w-5 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-navy">{language === 'kh' ? "អេកូសាស្ត្រ" : "Ultrasound"}</p>
                        <p className="text-sm text-slate-600">{language === 'kh' ? "ការស្កេនដោយមិនមានការឈឺចាប់" : "Non-invasive scanning"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">{t.nav.contact}<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>

                {/* Social Media */}
                <div className="flex items-center gap-3 pt-4">
                  <span className="text-sm font-medium text-slate-500">{language === 'kh' ? "តាមដានពួកយើង៖" : "Follow us:"}</span>
                  <a href="https://facebook.com/dhinimex" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-white transition hover:bg-brand-navy/80" aria-label="Facebook">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-navy py-16">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">{language === 'kh' ? "ត្រូវការសេវាកម្មរូបភាពរោគវិនិច្ឆ័យ?" : "Need Diagnostic Imaging Services?"}</h2>
            <p className="mb-8 text-white/80">{language === 'kh' ? "ទាក់ទងខេមរ៉ាដសម្រាប់ដំណោះស្រាយរូបភាពវេជ្ជសាស្ត្រកម្រិតខ្ពស់។" : "Contact CamRad for advanced medical imaging solutions."}</p>
            <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-base font-semibold text-white transition hover:bg-[#c91e21]">
              {language === 'kh' ? "ទំនាក់ទំនងមកយើង" : "Get in Touch"}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
