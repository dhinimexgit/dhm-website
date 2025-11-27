import Image from "next/image";
import type { Brand } from "@/data/site-content";

type Props = {
  brands: Brand[];
};

export function BrandGrid({ brands }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => (
        <article
          key={brand.name}
          className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-100">
              <Image
                src={brand.logo}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <p className="text-base font-semibold text-brand-navy">
                {brand.name}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {brand.sector}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">{brand.description}</p>
        </article>
      ))}
    </div>
  );
}

