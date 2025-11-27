"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getCareer } from "@/data/site-content";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

const heroNavLinks = [
  { label: "About Us", href: "/about", caret: false },
  {
    label: "Business Porfolio",
    href: "#",
    caret: true,
    dropdown: [
      { label: "Trading", href: "/business/trading" },
      { label: "Manufacturing", href: "/business/manufacturing" },
      { label: "Electricity Distributions", href: "/business/electricity" },
      { label: "Water Supply", href: "/business/water-supply" },
      { label: "Scientific", href: "/business/scientific" },
    ],
  },
  { label: "Services", href: "/services", caret: false },
  { label: "Products", href: "/products", caret: false },
  { label: "Blog", href: "/blog", caret: false },
  { label: "Careers", href: "/careers", caret: false },
];

export default function JobDetailPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug;

  const job = slug ? getCareer(slug) : undefined;

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-4xl font-semibold text-brand-navy">Job Not Found</h1>
        <p className="mb-8 text-lg text-slate-600">The job listing you're looking for doesn't exist.</p>
        <Link href="/careers" className="inline-flex items-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
          Back to Careers
        </Link>
      </div>
    );
  }

  const handleMouseEnter = (label: string) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
    setHideTimeout(timeout);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt={job.title} fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <div className="flex w-full items-center justify-between bg-[#2E388C] px-14 py-5 shadow-lg">
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo-dhinimex.png" alt="Dhinimex logo" width={170} height={49} priority className="h-auto w-[170px]" />
            </Link>
            <nav className="flex items-center gap-6 text-[15px] font-medium text-white xl:gap-8">
              {heroNavLinks.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.dropdown ? (
                    <button
                      type="button"
                      className="group relative flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-brand-red"
                      onClick={(e) => e.preventDefault()}
                    >
                      {item.label}
                      {item.caret && <span className="text-[11px]">▼</span>}
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="group relative flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-brand-red"
                    >
                      {item.label}
                      {item.caret && <span className="text-[11px]">▼</span>}
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
                    </Link>
                  )}

                  {item.dropdown && openDropdown === item.label && (
                    <div className="absolute left-0 top-full mt-2 w-64 rounded-lg bg-white py-2 shadow-xl">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block px-6 py-3 text-[15px] text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-3 text-white xl:gap-4">
              <button type="button" className="p-1 text-lg transition-opacity hover:opacity-70" aria-label="Search">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <span className="hidden font-light text-white/70 lg:inline">|</span>

              <button type="button" className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
                <Image src="https://flagcdn.com/w20/gb.png" alt="EN" width={20} height={15} className="h-3.5 w-auto" />
                <span className="text-[11px]">▼</span>
              </button>
              <Link href="/contact-us" className="ml-2 whitespace-nowrap bg-brand-red px-6 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#c91e21]">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            {job.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-red">
            Home
          </Link>
          <span>/</span>
          <Link href="/careers" className="hover:text-brand-red">
            Careers
          </Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">{job.title}</span>
        </nav>

        {/* Job Info Header */}
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Location</p>
              <p className="mt-2 text-lg font-semibold text-brand-navy">{job.location}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Position</p>
              <p className="mt-2 text-lg font-semibold text-brand-navy">{job.position}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Deadline</p>
              <p className="mt-2 text-lg font-semibold text-brand-navy">{job.deadline}</p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        {job.description && (
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-brand-navy">Job Description</h2>
            <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-700">
              <p dangerouslySetInnerHTML={{ __html: job.description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </div>
          </section>
        )}

        {/* Key Responsibilities */}
        {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-brand-navy">Key Responsibilities</h2>
            <ul className="space-y-3 text-base leading-relaxed text-slate-700">
              {job.keyResponsibilities.map((responsibility, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-brand-red flex-shrink-0">•</span>
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-brand-navy">Requirements</h2>
            <ul className="space-y-3 text-base leading-relaxed text-slate-700">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-brand-red flex-shrink-0">•</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* What We Offer */}
        {job.whatWeOffer && job.whatWeOffer.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-brand-navy">What We Offer</h2>
            <ul className="space-y-3 text-base leading-relaxed text-slate-700">
              {job.whatWeOffer.map((offer, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-brand-red flex-shrink-0">•</span>
                  <span>{offer}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* How to Apply */}
        {job.howToApply && (
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-8">
            <h2 className="text-3xl font-semibold text-brand-navy">How to Apply</h2>
            <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-700">
              <p dangerouslySetInnerHTML={{ __html: job.howToApply.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/_(.*?)_/g, "<em>$1</em>") }} />
            </div>
            <div className="mt-6">
              <Link
                href="mailto:recruitment@dhinimex.com"
                className="inline-flex items-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91e21]"
              >
                Apply Now →
              </Link>
            </div>
          </section>
        )}

        {/* Back to Careers */}
        <div className="pt-8">
          <Link href="/careers" className="inline-flex items-center gap-2 text-base font-semibold text-brand-navy transition hover:text-brand-red">
            ← Back to Careers
          </Link>
        </div>
      </div>
    </div>
  );
}

