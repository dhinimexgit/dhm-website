import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Brands & Partnerships",
  description:
    "Dhinimex represents global brands across electrical, water, and automation technologies. Explore our trusted partnerships.",
};

// All brand logos with their info - matches actual files in /public/brands/
const brandPartners = [
  { name: "ThiPha Cable", logo: "/brands/ALL-LOGO-01.png" },
  { name: "Mitsubishi Electric", logo: "/brands/ALL-LOGO-02.png" },
  { name: "LS VINA Cable & System", logo: "/brands/ALL-LOGO-03.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-04.png" },
  { name: "Black+Decker", logo: "/brands/ALL-LOGO-05.png" },
  { name: "Stanley", logo: "/brands/ALL-LOGO-06.png" },
  { name: "Hi-Min Solar", logo: "/brands/ALL-LOGO-07.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-10.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-11.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-12.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-13.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-14.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-15.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-16.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-17.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-18.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-20.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-21.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-22.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-23.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-24.png" },
  { name: "Partner Brand", logo: "/brands/ALL-LOGO-25.png" },
  { name: "Kyoritsu", logo: "/brands/ALL-LOGO-26.png" },
  { name: "Fujitsu", logo: "/brands/ALL-LOGO-27.png" },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#1a2066] to-brand-navy py-24 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-red blur-3xl" />
          <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-red">
              
              Partners & Partnerships
              
            </p>
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Brands We Represent
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-white/70 lg:text-xl">
              We are the official distributor of renowned international brands, 
              bringing trusted global quality to the Cambodian market. Our partnerships 
              span electrical, water, automation, and engineering technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Partners Grid */}
      <section className="relative bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-brand-navy sm:text-4xl">
              Our Trusted Partners
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              We collaborate with world-class brands to deliver superior quality 
              products and solutions to our clients.
            </p>
          </div>

          {/* Brand Grid - Full color logos */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {brandPartners.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="group flex flex-col items-center justify-center rounded-xl bg-slate-50 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg hover:ring-1 hover:ring-slate-200"
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-brand-navy sm:text-4xl">
                Why Partner With Dhinimex?
              </h2>
              <p className="mb-8 text-lg text-slate-600">
                As Cambodia&apos;s leading electrical and infrastructure solutions provider, 
                we offer our partners access to a growing market with established 
                distribution networks and professional support.
              </p>
              <ul className="space-y-4">
                {[
                  "21+ years of market experience",
                  "Nationwide distribution network",
                  "Professional sales and technical teams",
                  "After-sales service and support",
                  "Warehousing and logistics capabilities",
                  "Marketing and brand promotion support",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red/10">
                      <svg className="h-4 w-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://www.dhinimex.com/wp-content/uploads/2025/11/Dhinimex-building_e.jpg"
                  alt="Dhinimex headquarters"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 to-transparent" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 -z-10 h-full w-full rounded-2xl bg-brand-navy/10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-brand-navy py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-brand-red blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Interested in Partnership?
          </h2>
          <p className="mb-8 text-lg text-white/70">
            We&apos;re always looking to expand our network of trusted brands and partners. 
            Contact us to discuss distribution opportunities in Cambodia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand-navy transition-all hover:bg-brand-red hover:text-white"
            >
              Contact Us
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
