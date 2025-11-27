import Image from "next/image";
import Link from "next/link";

type HeroCTA = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  media: string;
  ctas: HeroCTA[];
};

export function Hero({ eyebrow, title, description, media, ctas }: Props) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-brand-navy text-white ring-1 ring-brand-navy/20">
      <div className="grid gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
        <div className="space-y-6">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="text-lg text-slate-200">{description}</p>
          <div className="flex flex-wrap gap-3">
            {ctas.map((cta) => {
              const base =
                cta.variant === "secondary"
                  ? "border border-white/30 text-white hover:border-white"
                  : "bg-brand-red text-white hover:bg-brand-red/90";
              return (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${base}`}
                >
                  {cta.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={media}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/60 via-transparent to-transparent" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-navy/40 to-transparent" />
    </section>
  );
}

