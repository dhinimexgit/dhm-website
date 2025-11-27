import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGallery } from "@/components/product/product-gallery";
import { RatingStars } from "@/components/product/rating-stars";
import { SpecTable } from "@/components/product/spec-table";
import { ContactModal } from "@/components/contact-modal";

export const revalidate = 3600;

type Props = {
  params: Promise<{ brand: string; slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { brand, slug } = await params;
  const data = await getProduct(brand, slug);

  if (!data) {
    notFound();
  }

  const { product, category } = data;

  return (
    <div className="min-h-screen pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/products" className="hover:text-brand-navy">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products/${brand}`} className="hover:text-brand-navy">
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-brand-navy">{product.model}</span>
        </nav>

        {/* Main Content Grid - Strict Two Columns */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Gallery (Fixed Width on Desktop) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <ProductGallery
              images={product.images}
            />
          </div>

          {/* Right Column: Product Details (Fluid Width) */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-red">
                  New Arrival
              </span>
            </div>
            
            <h1 className="text-3xl font-bold leading-tight text-brand-navy sm:text-4xl mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="uppercase tracking-wider">
                Brand: <strong>{product.brand}</strong>
              </span>
              <div className="h-4 w-px bg-slate-300" />
              <span className="uppercase tracking-wider">
                  Model: <strong>{product.model}</strong>
              </span>
            </div>

            {Number(product.price) > 0 && (
              <div className="border-y border-slate-100 py-6 mb-6">
                  <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-brand-navy">
                          ${Number(product.price).toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500">USD</span>
                  </div>
              </div>
            )}

            {/* Highlights */}
            <div className="mb-8">
                <h3 className="font-semibold text-brand-navy mb-4">Key Highlights</h3>
                <ul className="space-y-2">
                    {product.featuredHighlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3 text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                            {highlight}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
                {/* Only show Request Quotation if NO price is available */}
                {(!product.price || Number(product.price) === 0) && (
                  <ContactModal 
                    productName={product.name}
                    triggerText="Request Quotation"
                    triggerClassName="flex-1 rounded-full bg-brand-red px-8 py-4 text-center text-sm font-bold text-white shadow-lg transition hover:bg-[#b10f12]"
                    initialQuestion={`I would like to request a quotation for ${product.name}.`}
                  />
                )}
                
                <ContactModal 
                  productName={product.name} 
                  triggerClassName="flex-1 rounded-full bg-brand-navy px-8 py-4 text-center text-sm font-bold text-white shadow-lg transition hover:bg-[#252f6e]"
                />
            </div>
          </div>
        </div>

        {/* Specifications (Full Width below the two columns) */}
        <div className="mt-16 space-y-6">
            <h3 className="text-2xl font-bold text-brand-navy">Specifications</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <SpecTable product={product} />
            </div>
        </div>
      </div>
    </div>
  );
}
