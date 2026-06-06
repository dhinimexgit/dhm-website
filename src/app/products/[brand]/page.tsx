import { getProductCategories } from "@/data/site-content";
import { ProductsPageClient } from "../products-client";

// Pre-render the known static brands; brands added later via the admin
// dashboard are rendered on demand (dynamicParams defaults to true).
export async function generateStaticParams() {
  return getProductCategories('en').map((category) => ({
    brand: category.slug,
  }));
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;

  // Brands are managed in Firestore and loaded client-side, so we don't gate
  // on the static list here — the client filters products for this brand.
  return <ProductsPageClient initialBrand={brand} />;
}

