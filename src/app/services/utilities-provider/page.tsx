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

// Hero: Power lines/electrical grid infrastructure
const heroImage = "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80";
// Content: Utility infrastructure - power distribution
const contentImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";

export default function UtilitiesProviderDetailPage() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const infrastructureFocus = language === 'kh' ? [
    "បណ្តាញចែកចាយអគ្គិសនីដែលភ្ជាប់ទីប្រជុំជនតាមខេត្ត និងតំបន់ឧស្សាហកម្ម។",
    "រោងចក្រប្រព្រឹត្តកម្មទឹក ស្ថានីយបូមទឹក និងប្រព័ន្ធម៉ែត្រឆ្លាតវៃដែលរចនាឡើងសម្រាប់កំណើនប្រកបដោយចីរភាព។",
    "មជ្ឈមណ្ឌលត្រួតពិនិត្យដំណើរការ 24/7 ដើម្បីគាំទ្រដល់សេវាកម្មដែលអាចទុកចិត្តបាននៅតំបន់ដាច់ស្រយាល។",
  ] : [
    "Electrical distribution networks that connect provincial towns and industrial corridors.",
    "Water treatment plants, pumping stations, and smart metering designed for sustainable growth.",
    "Monitoring centers staffed 24/7 to support reliable service across remote regions.",
  ];

  const communityCommitments = language === 'kh' ? [
    "ការពង្រីកលទ្ធភាពទទួលបានសម្រាប់សហគមន៍ជនបទដែលនៅតែប្រឈមនឹងបណ្តាញអគ្គិសនីមិនមានស្ថេរភាព ឬកង្វះទឹកស្អាត។",
    "ការវិនិយោគលើបច្ចេកវិទ្យាប្រកបដោយចីរភាពដែលកាត់បន្ថយថ្លៃប្រតិបត្តិការ និងផលប៉ះពាល់បរិស្ថាន។",
    "ការសម្របសម្រួលជាមួយអាជ្ញាធរមូលដ្ឋានដើម្បីពន្លឿនការអនុញ្ញាត ការត្រួតពិនិត្យ និងផែនការពង្រីក។",
  ] : [
    "Expanding access for rural communities that still face unstable grids or limited potable water.",
    "Investing in sustainable technologies that lower operating costs and environmental impact.",
    "Coordinating with local authorities to accelerate permits, inspections, and expansion plans.",
  ];

  return (
    <>
      <StickyHeader isVisible={isScrolled} />

      <div>
        {/* Hero Banner Section */}
        <section className="relative min-h-[50vh] overflow-hidden lg:min-h-[60vh]">
          <div className="absolute inset-0 z-0">
            <Image src={heroImage} alt={language === 'kh' ? "អ្នកផ្គត់ផ្គង់សេវាទឹកនិងភ្លើង" : "Utilities Provider"} fill priority className="object-cover" sizes="100vw" />
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
                  <span className="font-medium text-brand-red">{language === 'kh' ? 'អ្នកផ្គត់ផ្គង់សេវាទឹកនិងភ្លើង' : 'Utilities Provider'}</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  {language === 'kh' ? 'អ្នកផ្គត់ផ្គង់សេវាទឹកនិងភ្លើង' : 'Utilities Provider'}
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  {language === 'kh' ? 'ការផ្គត់ផ្គង់ហេដ្ឋារចនាសម្ព័ន្ធអគ្គិសនី និងទឹកនៅទូទាំងខេត្តនានាក្នុងប្រទេសកម្ពុជា។' : 'Delivering electrical and water infrastructure across provinces in Cambodia.'}
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
                  <Image src={contentImage} alt={language === 'kh' ? "អ្នកផ្គត់ផ្គង់សេវាទឹកនិងភ្លើង" : "Utilities Provider"} width={720} height={480} className="h-auto w-full object-cover" priority />
                </div>
              </div>

              {/* Content Side */}
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">{language === 'kh' ? 'សេវាកម្មរបស់យើង' : 'Our Services'}</p>
                  <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">{language === 'kh' ? 'អ្នកផ្គត់ផ្គង់សេវាទឹកនិងភ្លើង' : 'Utilities Provider'}</h2>
                </div>
                
                <div className="space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    {language === 'kh' ? 'លើសពីឧបករណ៍ និងសេវាកម្ម ' : 'Beyond equipment and services, '} <strong className="text-brand-navy">{language === 'kh' ? 'ធិនីម៉ិចគឺជាអ្នកផ្គត់ផ្គង់សេវាកម្មអគ្គិសនីនិងទឹកដ៏គួរឱ្យទុកចិត្ត' : 'Dhinimex is a trusted utilities provider'}</strong>{language === 'kh' ? ' ដែលផ្តល់នូវហេដ្ឋារចនាសម្ព័ន្ធអគ្គិសនី និងទឹកនៅទូទាំងខេត្តនានាក្នុងប្រទេសកម្ពុជា។ យើងប្តេជ្ញាគាំទ្រសហគមន៍ជាមួយនឹងសេវាកម្មប្រកបដោយចីរភាព និងអាចពឹងផ្អែកបាន ជាពិសេសនៅតំបន់ជនបទ ដែលការទទួលបានសេវាកម្មស្ថេរភាពនៅមានកម្រិតនៅឡើយ។' : ', delivering both electrical and water infrastructure across provinces in Cambodia. We are dedicated to supporting communities with sustainable and reliable utilities—especially in rural areas where stable access is still limited.'}
                  </p>
                  <p>
                    {language === 'kh' ? 'ក្រុមការងាររបស់យើងរចនា សាងសង់ និងគ្រប់គ្រងបណ្តាញដែលភ្ជាប់គ្រួសារ កសិដ្ឋាន និងអាជីវកម្ម ទៅកាន់ថាមពល និងទឹកដែលមានសុវត្ថិភាព និងតម្លៃសមរម្យ—គាំទ្រដោយការត្រួតពិនិត្យ 24/7 និងការថែទាំតាមការហៅទូរស័ព្ទ។' : 'Our teams design, build, and manage networks that connect households, farms, and businesses to safe, affordable energy and water—supported by 24/7 monitoring and on-call maintenance.'}
                  </p>
                </div>

                {/* Service Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-6 shadow-md">
                    <h3 className="mb-3 text-lg font-semibold text-brand-navy">{language === 'kh' ? 'ការផ្តោតលើហេដ្ឋារចនាសម្ព័ន្ធ' : 'Infrastructure Focus'}</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {infrastructureFocus.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-red" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-white p-6 shadow-md">
                    <h3 className="mb-3 text-lg font-semibold text-brand-navy">{language === 'kh' ? 'ការប្តេជ្ញាចិត្តចំពោះសហគមន៍' : 'Community Commitments'}</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {communityCommitments.map((item, index) => (
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
                    {language === 'kh' ? 'ចាប់ផ្តើមគម្រោងសម្បទាន' : 'Start a Concession'}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                  <Link href="/business/water-supply" className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white">
                    {language === 'kh' ? 'មើលអាជ្ញាប័ណ្ណទឹក' : 'View Water Licenses'}
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
            <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">{language === 'kh' ? 'មានសំណួរអំពីសេវាកម្មទឹកនិងភ្លើងមែនទេ?' : 'Questions About Utilities Services?'}</h2>
            <p className="mb-8 text-white/80">{language === 'kh' ? 'ទាក់ទងមកយើងដើម្បីស្វែងយល់បន្ថែមអំពីសេវាកម្មចែកចាយអគ្គិសនី និងទឹករបស់យើង។' : 'Contact us to learn more about our electricity and water distribution services.'}</p>
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
