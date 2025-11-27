import Link from "next/link";
import type { Service } from "@/data/site-content";

type Props = {
  service: Service;
  compact?: boolean;
};

export function ServiceCard({ service, compact = false }: Props) {
  const initials = service.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-brand-sky/80 px-4 py-2 text-sm font-semibold text-brand-navy">
          {initials}
        </div>
        <h3 className="text-xl font-semibold text-brand-navy">{service.name}</h3>
      </div>
      <p className="mt-4 text-sm text-slate-600">{service.description}</p>
      {!compact && (
        <>
          <p className="mt-4 text-sm text-slate-500">{service.details}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {service.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                {highlight}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-auto pt-5">
        <Link
          href={`/services#${service.slug}`}
          className="text-sm font-semibold text-brand-red hover:text-brand-red/80"
        >
          Learn more →
        </Link>
      </div>
    </article>
  );
}

