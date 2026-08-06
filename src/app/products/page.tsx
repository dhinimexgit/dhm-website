import { getProductsForListing } from "@/lib/products";
import { ProductsPageClient } from "./products-client";

// Serve a CDN-cached page and refresh it in the background every 5 minutes,
// so visitors never wait on Firestore and admin edits still land promptly.
export const revalidate = 300;

export default async function ProductsPage() {
  const initialProducts = await getProductsForListing();

  return <ProductsPageClient initialProducts={initialProducts} />;
}
