import { productCategories } from "@/data/site-content";
import { ProductsPageClient } from "../products-client";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return productCategories.map((category) => ({
    brand: category.slug,
  }));
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const brandData = productCategories.find((c) => c.slug === brand);

  if (!brandData) {
    notFound();
  }

  // Data is now fetched client-side, just pass the initial brand filter
  return <ProductsPageClient initialBrand={brand} />;
}

