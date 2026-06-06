"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { StickyHeader } from "@/components/home/sticky-header";
import { NavAdminLoginLink } from "@/components/layout/nav-admin-login-link";
import { useLanguage } from '@/lib/i18n';
import {
  NavUtilityCluster,
  NavUtilityDivider,
  NAV_UTILITY_ICON_CLASS,
} from "@/components/layout/nav-utility-cluster";

// Hero: Engineer using testing equipment on electrical panel
const heroImage = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&q=80";
// Content: Electrical testing/diagnostic equipment
const contentImage = "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80";

export default function TestingAndEngineeringConsultationDetailPage() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const diagnostics = language === 'kh' ? [
    "ការកំណត់រ៉ឺឡេ ការដាក់ឱ្យដំណើរការ និងការសម្របសម្រួលប្រព័ន្ធការពារសម្រាប់ប្រព័ន្ធ MV និង LV ។",
    "ការបន្សុទ្ធប្រេងត្រង់ស្វ័រ ការត្រួតពិនិត្យកម្តៅ និងការធ្វើរោគវិនិច្ឆ័យព្យាករណ៍ជាមុន។",
    "មន្ទីរពិសោធន៍នៅតាមទីតាំងដែលបំពាក់សម្រាប់វិភាគការបាត់បង់ថាមពល ការធ្វើតេស្តខ្សែកាប និងការធ្វើសវនកម្មគុណភាពថាមពល។",
  ] : [
    "Relay setting, commissioning, and protection coordination for MV and LV systems.",
    "Transformer oil purification, thermographic inspections, and predictive diagnostics.",
    "Field laboratories equipped for loss analysis, cable testing, and power quality audits.",
  ];

  const consultingTracks = language === 'kh' ? [
    "ការរចនាវិស្វកម្ម និងការពិគ្រោះយោបល់គ្រប់ជ្រុងជ្រោយសម្រាប់ស្ថានីយរង ត្រង់ស្វ័រ និងបណ្តាញចែកចាយ។",
    "ដំណោះស្រាយរួមបញ្ចូលគ្នាដែលគ្របដណ្តប់លើប្រព័ន្ធអាកាស ក្រោមដី និងក្រោមសមុទ្រ ជាមួយនឹងការត្រួតពិនិត្យពីចម្ងាយ។",
    "កម្មវិធីថែទាំឆ្លាតវៃដែលរួមបញ្ចូលគ្នានូវការកត់ត្រាទិន្នន័យ ជាមួយនឹងក្រុមសេវាកម្មឆ្លើយតបរហ័ស។",
  ] : [
    "Engineering design and turnkey consultation for substations, transformers, and distribution networks.",
    "Integrated solutions covering overhead, underground, and submarine corridors with remote monitoring.",
    "Smart maintenance programs that combine data logging with rapid-response service teams.",
  ];

  return (
    <>
      <StickyHeader isVisible={isScrolled} />

      <div>
        {/* Hero Banner Section */}
        <section className="relative min-h-[50vh] overflow-hidden lg:min-h-[60vh]">
          <div className="absolute inset-0 z-0">
            <Image src={heroImage} alt={language === 'kh' ? "ការធ្វើតេស្ត និងពិគ្រោះយោបល់វិស្វកម្ម" : "Testing and Engineering Consultation"} fill priority className="object-cover" sizes="100vw" />
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
                      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.trading}</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.manufacturing}</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.electricity}</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.water}</Link>
                        <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.scientific}</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">{t.nav.services}<span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" /></Link>
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
                  <Link href="/" className="font-medium text-white/70 transition hover:text-white">{language === 'kh' ? 'ទំព័រដើម' : 'Home'}</Link>
                  <span className="text-white/40">/</span>
                  <Link href="/services" className="font-medium text-white/70 transition hover:text-white">{t.nav.services}</Link>
                  <span className="text-white/40">/</span>
                  <span className="font-medium text-brand-red">{language === 'kh' ? 'ការធ្វើតេស្ត និងពិគ្រោះយោបល់' : 'Testing & Consultation'}</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  {language === 'kh' ? 'ការធ្វើតេស្ត និងពិគ្រោះយោបល់វិស្វកម្ម' : 'Testing & Engineering Consultation'}
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  {language === 'kh' ? 'ការធ្វើតេស្តដោយភាពច្បាស់លាស់ និងការពិគ្រោះយោបល់ដោយអ្នកជំនាញ ដើម្បីពង្រឹងប្រសិទ្ធភាពឧបករណ៍ឱ្យបានអតិបរមា។' : 'Precision testing and expert consultation to maximize equipment performance.'}
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
                  <Image src={contentImage} alt={language === 'kh' ? "ការធ្វើតេស្ត និងវិស្វកម្ម" : "Testing and Engineering"} width={720} height={480} className="h-auto w-full object-cover" priority />
                </div>
              </div>

              {/* Content Side */}
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">{language === 'kh' ? 'សេវាកម្មរបស់យើង' : 'Our Services'}</p>
                  <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">{language === 'kh' ? 'ការធ្វើតេស្ត និងពិគ្រោះយោបល់' : 'Testing & Consultation'}</h2>
                </div>
                
                <div className="space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    {language === 'kh' ? 'ចាប់ពីការកំណត់រ៉ឺឡេ និងការបន្សុទ្ធប្រេងត្រង់ស្វ័រ រហូតដល់ការធ្វើរោគវិនិច្ឆ័យប្រព័ន្ធ ' : 'From relay setting and transformer oil purification to system diagnostics, our '} <strong className="text-brand-navy">{language === 'kh' ? 'សេវាកម្មធ្វើតេស្តរបស់យើង' : 'testing services'}</strong> {language === 'kh' ? 'ត្រូវបានរចនាឡើងដើម្បីពង្រឹងប្រសិទ្ធភាព និងពន្យារអាយុកាលឧបករណ៍។ យើងផ្តល់នូវលទ្ធផលច្បាស់លាស់ និងគួរឱ្យទុកចិត្ត ដើម្បីគាំទ្រដល់ប្រតិបត្តិការរលូន។' : 'are designed to maximize performance and extend equipment lifespan. We deliver precise, trusted results to support smooth operations.'}
                  </p>
                  <p>
                    {language === 'kh' ? 'យើងក៏ផ្តល់នូវដំណោះស្រាយថាមពល និងការចែកចាយគ្រប់ជ្រុងជ្រោយ ដែលគ្របដណ្តប់លើប្រព័ន្ធ MV & LV រួមមានប្រព័ន្ធអាកាស ក្រោមដី និងក្រោមសមុទ្រ។ ជំនាញរបស់យើងរួមបញ្ចូលការរចនាវិស្វកម្ម ការពិគ្រោះយោបល់លើគម្រោង និងការអនុវត្តប្រកបដោយប្រសិទ្ធភាពខ្ពស់។' : 'We also provide end-to-end power and distribution solutions, covering MV & LV systems—overhead, underground, and submarine. Our expertise spans engineering design, project consultation, and turnkey implementation.'}
                  </p>
                </div>

                {/* Service Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-6 shadow-md">
                    <h3 className="mb-3 text-lg font-semibold text-brand-navy">{language === 'kh' ? 'រោគវិនិច្ឆ័យ' : 'Diagnostics'}</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {diagnostics.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-red" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-white p-6 shadow-md">
                    <h3 className="mb-3 text-lg font-semibold text-brand-navy">{language === 'kh' ? 'ការពិគ្រោះយោបល់' : 'Consulting Tracks'}</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {consultingTracks.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-red" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                    {language === 'kh' ? 'រៀបចំកាលវិភាគវិនិច្ឆ័យ' : 'Schedule Diagnostics'}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>

                {/* Social Media */}
                <div className="flex items-center gap-3 pt-4">
                  <span className="text-sm font-medium text-slate-500">{language === 'kh' ? 'តាមដានពួកយើង៖' : 'Follow us:'}</span>
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
            <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">{language === 'kh' ? 'ត្រូវការសេវាកម្មធ្វើតេស្ត ឬពិគ្រោះយោបល់?' : 'Need Testing or Consultation Services?'}</h2>
            <p className="mb-8 text-white/80">{language === 'kh' ? 'ទាក់ទងមកយើងដើម្បីរៀបចំកាលវិភាគធ្វើរោគវិនិច្ឆ័យ ឬពិភាក្សាអំពីតម្រូវការវិស្វកម្មរបស់អ្នក។' : 'Contact us to schedule diagnostics or discuss your engineering needs.'}</p>
            <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-base font-semibold text-white transition hover:bg-[#c91e21]">
              {language === 'kh' ? 'ទំនាក់ទំនងមកយើង' : 'Get in Touch'}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
