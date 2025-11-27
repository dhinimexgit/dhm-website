"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { contactInfo } from "@/data/site-content";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

const touchPoints = [
  {
    label: "Address",
    value: contactInfo.address,
    icon: (
      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: contactInfo.email,
    icon: (
      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: contactInfo.phones.join(" / "),
    icon: (
      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: "Business Hours",
    value: contactInfo.hours,
    icon: (
      <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        status: "new", // You can use this to track if an admin has read it
      });
      setSubmitStatus("success");
      setFormData({ fullName: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Contact" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">Contact Us</p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Get In Touch With the Team Powering Cambodia&apos;s Infrastructure
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Get in touch</p>
            <h2 className="text-4xl font-semibold text-brand-navy lg:text-5xl">We&apos;re here to help.</h2>
            <p className="text-lg text-slate-600">
              At Dhinimex, we value strong communication and dependable support. Whether you have a question, need project assistance, or want to explore
              our solutions, our team is ready to assist.
            </p>
            <div className="space-y-4">
              {touchPoints.map((item) => (
                <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-brand-navy shadow-sm">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                    <p className="text-lg font-semibold text-brand-navy">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-blue-100/50">
            <h3 className="text-2xl font-semibold text-brand-navy">Send a message</h3>
            <p className="mt-2 text-sm text-slate-600">Use the form below and we&apos;ll reply within one business day.</p>
            
            {submitStatus === "success" ? (
                <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <h4 className="mt-2 text-lg font-semibold text-green-800">Message Sent!</h4>
                    <p className="text-green-700">Thank you for contacting us. We'll get back to you shortly.</p>
                    <button 
                        onClick={() => setSubmitStatus("idle")}
                        className="mt-4 text-sm font-semibold text-green-800 underline hover:text-green-900"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy">Full Name</label>
                    <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 focus:border-brand-red focus:outline-none" 
                        placeholder="Sophea Bopha" 
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-brand-navy">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 focus:border-brand-red focus:outline-none" 
                        placeholder="you@email.com" 
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-navy">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 focus:border-brand-red focus:outline-none" 
                        placeholder="+855 12 345 678" 
                    />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy">How can we help?</label>
                    <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 focus:border-brand-red focus:outline-none" 
                        placeholder="Share a few details about your request." 
                    />
                  </div>
                  {submitStatus === "error" && (
                      <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
                  )}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b10f12] disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Our location</p>
          <h3 className="text-3xl font-semibold text-brand-navy">Here&apos;s where to find us</h3>
          <p className="text-base text-slate-600">
            Visit our office at a location that&apos;s easy to access and close to major roads. We look forward to seeing you!
          </p>
          <div className="rounded-2xl border border-slate-200">
            <iframe
              src={contactInfo.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full rounded-2xl"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
