import Image from "next/image";
import Link from "next/link";
import { getAllCareers } from "@/lib/careers";
import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "/career.png";

export default async function CareersPage() {
  const careers = await getAllCareers();
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Careers" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">Careers</p>
          <h1 className="max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            Be Part of Cambodia&apos;s Next Generation of Infrastructure Leaders
          </h1>
        </div>
      </section>

      <div className="text-center px-4">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">Career Opportunities</p>
        <h2 className="mb-6 text-4xl font-semibold text-brand-navy lg:text-5xl">Join a team that builds essential services.</h2>
        <div className="mx-auto max-w-4xl space-y-5 text-lg text-slate-600">
          <p>
            With over 21 years of experience across energy, water supply, manufacturing, and technology, Dhinimex offers a platform to grow alongside
            Cambodia&apos;s most ambitious infrastructure projects. We welcome experienced professionals and fresh graduates who value excellence, safety,
            and innovation.
          </p>
          <p>
            If you’re ready to be part of a company that values excellence and innovation, we’d love to hear from you. Send your CV and cover letter to{" "}
            <a href="mailto:recruitment@dhinimex.com" className="font-semibold text-brand-navy underline-offset-4 hover:underline">
              recruitment@dhinimex.com
            </a>{" "}
            and please indicate the position you are applying for in the subject line of your email.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">

        <section className="space-y-8" id="open-roles">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">Open roles</p>
            <h3 className="text-4xl font-semibold text-brand-navy">Current opportunities</h3>
            <p className="mx-auto mt-3 max-w-3xl text-lg text-slate-600">
              Browse our latest openings and apply via email with your CV, cover letter, and the role in the subject line.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {careers.map((role) => (
              <article key={role.title} className="flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="space-y-2">
                  <h4 className="text-2xl font-semibold text-brand-navy">{role.title}</h4>
                  <p className="text-sm font-semibold text-slate-500">
                    Location: <span className="text-slate-600">{role.location}</span>
                  </p>
                  <p className="text-sm font-semibold text-slate-500">
                    Deadline: <span className="text-slate-600">{role.deadline}</span>
                  </p>
                </div>
                <p className="mt-4 flex-grow text-base leading-relaxed text-slate-600">{role.summary}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/careers/${role.slug}`}
                    className="inline-flex items-center rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c91e21]"
                  >
                    View role →
                  </Link>
                  {/* <Link
                    href="mailto:recruitment@dhinimex.com"
                    className="inline-flex items-center rounded-full border border-brand-red px-5 py-2 text-sm font-semibold text-brand-red transition hover:bg-brand-red/10"
                  >
                    Apply now
                  </Link> */}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
