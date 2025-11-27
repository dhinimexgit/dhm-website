"use client";

import Image from "next/image";
type Props = {
  brands: { name: string; logo: string }[];
};

export function BrandCarousel({ brands }: Props) {
  const items = [...brands, ...brands];
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 px-6 py-6">
      <div className="brand-marquee items-center gap-12">
        {items.map((brand, index) => (
          <div
            key={`${brand.name}-${index}`}
            className="relative h-16 w-36 shrink-0"
            aria-label={brand.name}
          >
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              fill
              sizes="144px"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

