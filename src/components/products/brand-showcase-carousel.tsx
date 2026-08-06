"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { resolveBrandHeroImage } from "@/lib/image-url";

export type BrandShowcaseItem = {
  slug: string;
  name: string;
  heroImage?: string;
};

type Props = {
  brands: BrandShowcaseItem[];
  shopLabel: string;
};

const GAP_PX = 24;

function getVisibleCount(width: number) {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

export function BrandShowcaseCarousel({ brands, shopLabel }: Props) {
  // A callback ref, not useRef: this component renders `null` until `brands`
  // arrives, so a mount-time effect would run while there is no element to
  // measure and never get another chance — leaving cardWidth at 0 and every
  // card falling back to width:100%. Tracking the node as state re-runs the
  // measurement exactly when the viewport actually appears.
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const uniqueBrands = useMemo(() => {
    const seen = new Set<string>();
    return brands.filter((b) => {
      if (seen.has(b.slug)) return false;
      seen.add(b.slug);
      return true;
    });
  }, [brands]);

  const pageCount = Math.max(1, Math.ceil(uniqueBrands.length / visibleCount));
  const maxPage = pageCount - 1;

  const measure = useCallback(() => {
    if (!viewport) return;
    const width = viewport.offsetWidth;
    // A detached or zero-width viewport would compute a nonsense card width.
    if (width <= 0) return;
    const count = getVisibleCount(width);
    setVisibleCount(count);
    const totalGaps = GAP_PX * Math.max(0, count - 1);
    setCardWidth((width - totalGaps) / count);
  }, [viewport]);

  useEffect(() => {
    if (!viewport) return;
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [viewport, measure]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, maxPage));
  }, [maxPage]);

  const offsetPx = currentPage * visibleCount * (cardWidth + GAP_PX);

  const goToPage = (page: number) => {
    const next = Math.max(0, Math.min(page, maxPage));
    if (next === currentPage || isAnimating) return;
    setIsAnimating(true);
    setCurrentPage(next);
  };

  const handleTransitionEnd = () => setIsAnimating(false);

  if (uniqueBrands.length === 0) return null;

  const showControls = uniqueBrands.length > visibleCount;

  return (
    <div className="relative">
      <div ref={setViewport} className="overflow-hidden">
        <div
          className="flex will-change-transform"
          style={{
            gap: GAP_PX,
            transform: cardWidth > 0 ? `translateX(-${offsetPx}px)` : undefined,
            transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {uniqueBrands.map((brand) => (
            <div
              key={brand.slug}
              className="group relative aspect-[3/4] flex-shrink-0 overflow-hidden rounded-2xl"
              style={cardWidth > 0 ? { width: cardWidth } : { width: "100%" }}
            >
              <Image
                src={resolveBrandHeroImage(brand.heroImage)}
                alt={brand.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-center sm:p-8">
                <div className="mb-4 flex h-12 w-full items-center justify-center">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{brand.name}</h3>
                </div>
                <Link
                  href={`/products/${brand.slug}`}
                  className="inline-block rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-navy"
                >
                  {shopLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0 || isAnimating}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:border-brand-navy hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous brands"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                disabled={isAnimating}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentPage ? "w-6 bg-brand-navy" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to page ${i + 1}`}
                aria-current={i === currentPage ? "true" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= maxPage || isAnimating}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:border-brand-navy hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next brands"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
