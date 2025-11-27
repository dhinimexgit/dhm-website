import { getAllProducts } from "@/lib/products";
import { ProductsPageClient } from "./products-client";

// Revalidate every hour
export const revalidate = 3600;

export default async function ProductsPage() {
  const categories = await getAllProducts();

  return (
    <ProductsPageClient categories={categories} />
  );
}
