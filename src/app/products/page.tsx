import { ProductsPageClient } from "./products-client";

// This page now fetches data client-side (like the admin page) for real-time updates
export default function ProductsPage() {
  return (
    <ProductsPageClient />
  );
}
