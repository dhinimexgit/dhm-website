import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCareer } from "@/lib/careers";
import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getCareer(slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt={job.title} fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
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

