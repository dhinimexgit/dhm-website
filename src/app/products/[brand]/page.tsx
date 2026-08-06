import { DHINIMEX_BRANDS } from "@/data/dhinimex-taxonomy";
import { getProductsForListing } from "@/lib/products";
import { ProductsPageClient } from "../products-client";

// Serve a CDN-cached page and refresh it in the background every 5 minutes,
// so visitors never wait on Firestore and admin edits still land promptly.
export const revalidate = 300;

// Pre-render the known static brands; brands added later via the admin
// dashboard are rendered on demand (dynamicParams defaults to true).
export async function generateStaticParams() {
  return DHINIMEX_BRANDS.map((brand) => ({
    brand: brand.slug,
  }));
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;

  // Brands are managed in Firestore and loaded client-side, so we don't gate
  // on the static list here — the client filters products for this brand.
  const initialProducts = await getProductsForListing();

  return <ProductsPageClient initialBrand={brand} initialProducts={initialProducts} />;
}
