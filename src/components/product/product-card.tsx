import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/site-content";
import { RatingStars } from "./rating-stars";

type Props = {
  product: Product;
  categorySlug: string;
};

export function ProductCard({ product, categorySlug }: Props) {
  const href = `/products/${categorySlug}/${product.slug}`;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
        {product.images && 
         Array.isArray(product.images) && 
         product.images.length > 0 && 
         product.images[0] && 
         typeof product.images[0] === 'string' && 
         product.images[0].trim().length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        <span>{product.brand}</span>
        <span className="tracking-normal text-slate-400">{product.model}</span>
      </div>
      <h3 className="mt-2 text-xl font-semibold text-brand-navy">{product.name}</h3>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
        {product.featuredHighlights.slice(0, 2).map((highlight) => (
          <span key={highlight} className="rounded-full bg-slate-100 px-3 py-1">
            {highlight}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-5">
        {product.price ? (
          <span className="text-base font-semibold text-brand-navy">${product.price.toLocaleString()}</span>
        ) : (
          <span className="text-sm font-semibold text-slate-500">Contact for Quote</span>
        )}
        <Link
          href={href}
          className="text-sm font-semibold text-brand-red hover:text-brand-red/80"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}

