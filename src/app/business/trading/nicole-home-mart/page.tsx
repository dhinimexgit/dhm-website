"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/components/home/sticky-header";
import { NavAdminLoginLink } from "@/components/layout/nav-admin-login-link";
import {
import { useLanguage } from '@/lib/i18n';
  NavUtilityCluster,
  NavUtilityDivider,
  NAV_UTILITY_ICON_CLASS,
} from "@/components/layout/nav-utility-cluster";

const heroImage = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80";

const brands = [
  { name: "Mitsubishi Electric", country: "Japan" },
  { name: "Stanley", country: "USA" },
  { name: "Solo", country: "Thailand" },
  { name: "Kyoritsu", country: "Japan" },
  { name: "Greenlawn", country: "Taiwan" },
  { name: "LWD", country: "Malaysia" },
];

const locations = [
  { name: language === 'kh' ? "ទួលទំពូង" : "Toul Tum Pong", detail: language === 'kh' ? "(ជិតផ្សារទួលទំពូង)" : "(near Russian Market)", mapLink: "https://www.google.com/maps/search/Nicole+Home+Mart+Toul+Tum+Pong" },
  { name: language === 'kh' ? "ផ្លូវទេពផន" : "Tep Phan Street", detail: language === 'kh' ? "(នៅការិយាល័យឌីនីម៉ិច)" : "(at Dhinimex Office)", mapLink: "https://www.google.com/maps/search/Dhinimex+Co.,+Ltd" },
  { name: language === 'kh' ? "កៀនស្វាយ" : "Kiensvay", detail: language === 'kh' ? "(នៅការិយាល័យអគ្គិសនីកៀនស្វាយ)" : "(at Kiensvay Electricity Office)", mapLink: "https://www.google.com/maps/search/Electricite+du+Cambodge+Kien+Svay" },
];

export default function NicoleHomeMartDetailPage() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setSearchQuery("");
      }
    };
    if (searchOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [searchOpen]);

  return (
    <>
      <StickyHeader isVisible={isScrolled} />

      <div>
        {/* Hero Banner Section */}
        <section className="relative min-h-[50vh] overflow-hidden lg:min-h-[60vh]">
          <div className="absolute inset-0 z-0">
            <Image src={heroImage} alt="Nicole Home Mart" fill priority className="object-cover" sizes="100vw" />
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
                        <Link href="/business/trading" className="block rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-brand-red">{t.business.trading}</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.manufacturing}</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.electricity}</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.water}</Link>
                        <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.scientific}</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">{t.nav.services}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">{t.nav.products}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">{t.nav.blog}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                    <Link href="/careers" className="group relative transition hover:text-white/80">{t.nav.careers}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" /></Link>
                  </nav>
                  <div className="flex items-center gap-3">
                    <NavUtilityCluster>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(!searchOpen)}
                      className={`${NAV_UTILITY_ICON_CLASS} hover:text-white`}
                      aria-label="Search"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                    <NavUtilityDivider />
                    <NavAdminLoginLink />
                  </NavUtilityCluster>
                    <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">{t.nav.contact}</Link>
                  </div>
                </div>
                {searchOpen && (
                  <div ref={searchPanelRef} className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-2xl">
                    <div className="px-8 py-4">
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none" />
                        </div>
                        <button type="submit" className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white">{t.nav.searchBtn}</button>
                      </form>
                    </div>
                  </div>
                )}
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
                  <Link href="/business/trading" className="font-medium text-white/70 transition hover:text-white">{t.business.trading}</Link>
                  <span className="text-white/40">/</span>
                  <span className="font-medium text-brand-red">Nicole Home Mart</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Nicole Home Mart Co., LTD
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  Official distributor of high-quality mechanical and electrical tools, home appliances, and safety equipment.
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
                  <Image src="/nicole.jpg" alt="Nicole Home Mart" width={720} height={480} className="h-auto w-full object-cover" priority />
                </div>
              </div>

              {/* Content Side */}
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">Trading Division</p>
                  <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">About Nicole Home Mart</h2>
                </div>
                
                <div className="space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    <strong className="text-brand-navy">{language === 'kh' ? "នីកូល ហូមម៉ាត (NHM)" : "Nicole Home Mart (NHM)"}</strong>{language === 'kh' ? " គឺជាអ្នកចែកចាយផ្លូវការនូវឧបករណ៍មេកានិក និងអគ្គិសនី គ្រឿងប្រើប្រាស់ក្នុងផ្ទះ និងឧបករណ៍សុវត្ថិភាពដែលមានគុណភាពខ្ពស់។" : " is the official distributor of high-quality mechanical and electrical tools, home appliances, and safety equipment."}
                  </p>
                  <p>
                    {language === 'kh' ? "ផ្គត់ផ្គង់ម៉ាកយីហោល្បីៗទូទាំងពិភពលោកដូចជា " : "Supplying globally recognized brands like "}<strong>Mitsubishi Electric, Stanley, Solo, {language === 'kh' ? "និង" : "and"} Kyoritsu</strong>{language === 'kh' ? ", NHM ធានាបាននូវផលិតផល និងដំណោះស្រាយដែលអាចទុកចិត្តបានសម្រាប់គេហដ្ឋាន អាជីវកម្ម និងឧស្សាហកម្មទូទាំងប្រទេសកម្ពុជា។" : ", NHM ensures reliable products and solutions for homes, businesses, and industries across Cambodia."}
                  </p>
                  <p>
                    {language === 'kh' ? "ផលប័ត្រផលិតផលរបស់យើងរួមមាន ឧបករណ៍អគ្គិសនី ម៉ាស៊ីនផ្សារ ឧបករណ៍ថែសួន និងឧបករណ៍វាស់វែង ម៉ូទ័រ ម៉ាស៊ីនបូមទឹក កុងតាក់ (MCB, MCCB, ACB) អំពូលភ្លើង ព្រីភ្លើង កុងទ័រភ្លើង បំពង់ពន្លត់អគ្គិភ័យ គ្រឿងប្រើប្រាស់ក្នុងផ្ទះ និងច្រើនទៀត។" : "Our product portfolio includes power tools, welding machines, gardening and measurement tools, motors, pumps, breakers (MCB, MCCB, ACB), lamps, sockets, energy meters, fire extinguishers, home appliances, and more."}
                  </p>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-brand-navy">{language === 'kh' ? "ម៉ាកយីហោដៃគូរបស់យើង" : "Our Partner Brands"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                      <span key={brand.name} className="rounded-full border-2 border-brand-navy/20 bg-white px-4 py-2 text-sm font-medium text-brand-navy shadow-sm">
                        {brand.name} <span className="text-slate-400">({brand.country})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-brand-navy">{language === 'kh' ? "ទីតាំងរបស់យើង" : "Our Locations"}</h3>
                  <div className="space-y-3">
                    {locations.map((location, index) => (
                      <div key={location.name} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">{index + 1}</span>
                          <div>
                            <p className="font-semibold text-brand-navy">{location.name}</p>
                            <p className="text-sm text-slate-500">{location.detail}</p>
                          </div>
                        </div>
                        <a href={location.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-brand-navy transition hover:bg-brand-navy hover:text-white">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {language === 'kh' ? "ផែនទី" : "Map"}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-center gap-3 pt-4">
                  <span className="text-sm font-medium text-slate-500">Follow us:</span>
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
            <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">{language === 'kh' ? "ត្រូវការឧបករណ៍ ឬបរិក្ខារ?" : "Need Tools or Equipment?"}</h2>
            <p className="mb-8 text-white/80">{language === 'kh' ? "ចូលមើលទីតាំងណាមួយរបស់យើង ឬទាក់ទងមកយើងសម្រាប់ការសាកសួរផលិតផល។" : "Visit one of our locations or contact us for product inquiries."}</p>
            <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-base font-semibold text-white transition hover:bg-[#c91e21]">{t.nav.contact}<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
