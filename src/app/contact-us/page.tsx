"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { contactInfo } from "@/data/site-content";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { StickyHeader } from "@/components/home/sticky-header";

const heroImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80";

const inquiryTypes = [
  "General Inquiry",
  "Product Information",
  "Service Request",
  "Partnership Opportunity",
  "Career Inquiry",
  "Technical Support",
  "Other",
];

export default function ContactPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close on escape key or click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        createdAt: Timestamp.now(),
        status: "new",
      });
      setSubmitStatus("success");
      setFormData({ fullName: "", email: "", phone: "", inquiryType: "", message: "" });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StickyHeader isVisible={isScrolled} />

      <div>
        {/* Hero Banner Section */}
        <section className="relative min-h-[50vh] overflow-hidden lg:min-h-[60vh]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Contact Us"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>

          {/* Header - Desktop Only */}
          <div className="relative z-30 hidden lg:block">
            <div className="mx-auto max-w-7xl px-8 pt-6">
              <div className="relative rounded-xl bg-brand-navy shadow-lg">
                <div className="flex items-center justify-between px-8 py-4">
                  <Link href="/" className="flex-shrink-0">
                    <Image
                      src="/brands/DHM-WHITE.png"
                      alt="Dhinimex logo"
                      width={160}
                      height={46}
                      priority
                      className="h-auto w-[160px]"
                      unoptimized
                    />
                  </Link>
                  <nav className="flex items-center gap-8 text-[15px] font-medium text-white">
                    <Link href="/about" className="group relative transition hover:text-white/80">
                      About Us
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <div className="group relative">
                      <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">
                        Business Portfolio
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Trading</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Manufacturing</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Electricity Distribution</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Water Supply</Link>
                        <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Scientific</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">
                      Services
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">
                      Products
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/news" className="group relative transition hover:text-white/80">
                      News
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/careers" className="group relative transition hover:text-white/80">
                      Careers
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                  </nav>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSearchOpen(!searchOpen)}
                      className={`p-2 transition ${searchOpen ? "text-white" : "text-white/80 hover:text-white"}`}
                      aria-label="Search"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <span className="text-white/30">|</span>
                    <Link href={`mailto:${contactInfo.email}`} className="p-2 text-white/80 transition hover:text-white" aria-label="Email">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </Link>
                    <span className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white">
                      Contact Us
                    </span>
                  </div>
                </div>

                {/* Search Dropdown */}
                {searchOpen && (
                  <div 
                    ref={searchPanelRef}
                    className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-2xl"
                  >
                    <div className="px-8 py-4">
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <svg 
                            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for services, products, careers..."
                            className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner"
                          />
                        </div>
                        <button
                          type="submit"
                          className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
                        >
                          Search
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                          Cancel
                        </button>
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
              <div className="max-w-2xl space-y-6">
                <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">
                  
                  Contact Us
                </p>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-[56px] xl:leading-[1.1]">
                  Get In Touch
                </h1>
                <p className="text-lg text-white/90 sm:text-xl">
                  Have a question or would like to learn more about our group? Get in touch with us and our team will be happy to assist.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section - Inspired by Osome design */}
        <section className="relative overflow-hidden bg-white py-20">
          {/* Decorative Background Elements */}
          <div className="absolute left-0 top-1/4 -z-10 hidden lg:block">
            <svg className="h-80 w-80 text-brand-navy/5" viewBox="0 0 200 200" fill="currentColor">
              <circle cx="100" cy="100" r="80" />
              <circle cx="100" cy="100" r="60" fill="white" />
              <circle cx="100" cy="100" r="40" />
            </svg>
          </div>
          <div className="absolute right-0 top-1/3 -z-10 hidden lg:block">
            <svg className="h-96 w-96 text-brand-red/5" viewBox="0 0 200 200" fill="currentColor">
              <polygon points="100,20 180,180 20,180" />
            </svg>
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Contact Form Card */}
            <div className="mx-auto max-w-3xl">
              {submitStatus === "success" ? (
                <div className="rounded-3xl border border-green-100 bg-green-50 p-12 text-center shadow-sm">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-green-800">Message Sent Successfully!</h3>
                  <p className="mb-6 text-green-700">
                    Thank you for reaching out. Our team will get back to you within one business day.
                  </p>
                  <button 
                    onClick={() => setSubmitStatus("idle")}
                    className="rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-10 lg:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-brand-navy">Your name *</label>
                        <input 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-700 transition placeholder:text-slate-400 focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/10" 
                          placeholder="Sophea Bopha" 
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-brand-navy">Email address *</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-700 transition placeholder:text-slate-400 focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/10" 
                          placeholder="you@email.com" 
                        />
                      </div>
                    </div>

                    {/* Phone and Inquiry Type Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-brand-navy">Phone number</label>
                        <div className="flex">
                          <span className="flex items-center gap-2 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-4 text-sm text-slate-600">
                            <span className="text-lg">🇰🇭</span>
                            <span>+855</span>
                          </span>
                          <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full rounded-r-xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-700 transition placeholder:text-slate-400 focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/10" 
                            placeholder="12 345 678" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-brand-navy">Interested in</label>
                        <div className="relative">
                          <select 
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleInputChange}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-4 pr-12 text-slate-700 transition focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
                          >
                            <option value="">Select an option</option>
                            {inquiryTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <svg className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-brand-navy">How can we help? *</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-700 transition placeholder:text-slate-400 focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/10" 
                        placeholder="Share a few details about your inquiry or project..." 
                      />
                    </div>

                    {/* Error message */}
                    {submitStatus === "error" && (
                      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        <p className="flex items-center gap-2">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Something went wrong. Please try again or contact us directly via email.
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-brand-navy px-8 py-4 text-base font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send your message"
                      )}
                    </button>

                    {/* Terms Notice */}
                    <p className="text-center text-xs text-slate-500">
                      By clicking, you agree to our{" "}
                      <Link href="/terms" className="text-brand-navy underline hover:text-brand-red">
                        Terms & Conditions
                      </Link>
                      ,{" "}
                      <Link href="/privacy" className="text-brand-navy underline hover:text-brand-red">
                        Privacy and Data Protection Policy
                      </Link>
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Location Section - Elegant Light Design */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-14 text-center">
              <p className="mb-3 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-brand-red" />
                Our Location
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-brand-red" />
              </p>
              <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">
                Visit Us in Phnom Penh
              </h2>
            </div>

            {/* Main Content - Map Left, Info Right */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Map - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <iframe
                    src={contactInfo.mapEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[400px] w-full lg:h-full lg:min-h-[500px]"
                    title="Dhinimex Location Map"
                  />
                </div>
              </div>

              {/* Contact Info - Stacked Cards */}
              <div className="space-y-4">
                {/* Address */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Address</h3>
                  </div>
                  <p className="text-base font-semibold leading-relaxed text-brand-navy">
                    #245, St. Tep Phan (182), Tuk Laak 2, Khan Toul Kork, Phnom Penh
                  </p>
                  <Link 
                    href={contactInfo.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red transition hover:gap-2"
                  >
                    Get directions
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                {/* Phone */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</h3>
                  </div>
                  <div className="space-y-1">
                    {contactInfo.phones.map((phone, idx) => (
                      <Link 
                        key={idx} 
                        href={`tel:+855${phone.replace(/\s/g, "")}`} 
                        className="block text-base font-semibold text-brand-navy transition hover:text-brand-red"
                      >
                        +855 {phone}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</h3>
                  </div>
                  <Link href={`mailto:${contactInfo.email}`} className="block text-base font-semibold text-brand-navy transition hover:text-brand-red">
                    {contactInfo.email}
                  </Link>
                  <Link href={`mailto:${contactInfo.salesEmail}`} className="block text-sm text-slate-500 transition hover:text-brand-red">
                    {contactInfo.salesEmail}
                  </Link>
                </div>

                {/* Hours */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Business Hours</h3>
                  </div>
                  <p className="text-base font-semibold text-brand-navy">Monday – Saturday</p>
                  <p className="text-sm text-slate-500">8:00 AM – 5:00 PM</p>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  {contactInfo.social.map((social) => (
                    <Link 
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-brand-red hover:bg-brand-red hover:text-white"
                      aria-label={social.label}
                    >
                      {social.label === "Facebook" && (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                      {social.label === "Telegram" && (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      )}
                      {social.label === "LinkedIn" && (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )}
                      {social.label === "YouTube" && (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )}
                      {social.label === "TikTok" && (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
