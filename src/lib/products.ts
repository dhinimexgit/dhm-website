import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, getDoc, limit } from "firebase/firestore";
import { getProductCategories, type Product, type ProductCategory } from "@/data/site-content";

// Helper to convert Firestore data to Product type
const docToProduct = (doc: any, lang: 'en' | 'kh' = 'en'): Product => {
  const data = doc.data();
  
  // Clean and filter images array - remove null, undefined, empty strings, and invalid values
  let rawImages = data.images;
  
  // Handle null/undefined - convert to empty array
  if (rawImages === null || rawImages === undefined) {
    rawImages = [];
  }
  
  // Ensure it's an array and filter out invalid entries
  const cleanedImages = Array.isArray(rawImages) 
    ? rawImages
        .filter((img: any) => {
          // Filter out null, undefined, non-strings
          if (img === null || img === undefined || typeof img !== 'string') {
            return false;
          }
          
          // Filter out empty or whitespace-only strings
          const trimmed = img.trim();
          return trimmed.length > 0;
        })
        .map((img: string) => img.trim()) // Clean whitespace
    : [];
  
  return {
    slug: data.slug,
    brand: data.brand,
    model: data.model,
    name: lang === 'kh' && data.nameKh ? data.nameKh : data.name,
    nameKh: data.nameKh || "",
    summary: lang === 'kh' && data.summaryKh ? data.summaryKh : data.summary || "",
    summaryKh: data.summaryKh || "",
    description: lang === 'kh' && data.descriptionKh ? data.descriptionKh : data.description || "",
    descriptionKh: data.descriptionKh || "",
    price: data.price,
    categories: data.categories || [],
    subCategories: data.subCategories || [],
    // Prefer explicit highlights (saved by the admin form); fall back to legacy featuredHighlights.
    featuredHighlights: lang === 'kh' && data.highlightsKh && data.highlightsKh.length > 0 ? data.highlightsKh : (data.highlights || data.featuredHighlights || []),
    featuredHighlightsKh: data.highlightsKh || [],
    specs: data.specs || {},
    images: cleanedImages,
    createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt || null,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt?.toDate?.().toISOString() || data.updatedAt || null,
    updatedBy: data.updatedBy,
  } as Product;
};

export async function getAllProducts(lang: 'en' | 'kh' = 'en'): Promise<ProductCategory[]> {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      // Fallback to static data if DB is empty (for safety/initial load)
      console.warn("No products in Firestore, falling back to static data.");
      return getProductCategories(lang);
    }

    const products = snapshot.docs.map(doc => docToProduct(doc, lang));

    // Reconstruct the category structure expected by the UI
    // We clone the static categories structure but replace the products array
    const categories = getProductCategories(lang).map(cat => ({
      ...cat,
      products: products.filter(p => p.brand === cat.slug)
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching products:", error);
    return getProductCategories(lang); // Fallback on error
  }
}

/**
 * Flat product list for the /products listing, fetched on the server.
 *
 * The listing used to open a client-side `onSnapshot` over the whole
 * collection, which could not start until the JS bundle had booted and
 * hydrated — measured at ~2.9s before the first product request even left the
 * browser. Fetching here instead puts the catalogue in the initial HTML.
 *
 * The mapping intentionally matches `docToProduct` in products-client.tsx so
 * server-rendered and client-rendered products are byte-identical.
 */
export async function getProductsForListing(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map((doc) => {
      // Firestore documents are untyped here, same as docToProduct above.
      const data = doc.data() as any;
      const rawImages = data.images;
      const images = Array.isArray(rawImages)
        ? rawImages
            .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
            .map((img) => img.trim())
        : [];

      const toIso = (v: unknown): string | null => {
        if (v && typeof v === "object" && "toDate" in v) {
          return (v as { toDate: () => Date }).toDate().toISOString();
        }
        return (v as string) ?? null;
      };

      return {
        slug: data.slug,
        brand: data.brand,
        model: data.model,
        name: data.name,
        nameKh: data.nameKh || "",
        summary: data.summary || "",
        summaryKh: data.summaryKh || "",
        price: data.price,
        categories: data.categories || [],
        subCategories: data.subCategories || [],
        featuredHighlights: data.featuredHighlights || [],
        specs: data.specs || {},
        images,
        createdAt: toIso(data.createdAt),
        createdBy: data.createdBy,
        updatedAt: toIso(data.updatedAt),
        updatedBy: data.updatedBy,
      } as Product;
    });
  } catch (error) {
    // Never let a Firestore hiccup break the page — the client refetches.
    console.error("Error fetching products for listing:", error);
    return [];
  }
}

export async function getProduct(brandSlug: string, productSlug: string, lang: 'en' | 'kh' = 'en'): Promise<{ category: ProductCategory; product: Product } | undefined> {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef, 
      where("slug", "==", productSlug),
      where("brand", "==", brandSlug),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
       // Try static data fallback
       const cat = getProductCategories(lang).find(c => c.slug === brandSlug);
       const prod = cat?.products.find(p => p.slug === productSlug);
       if (cat && prod) return { category: cat, product: prod };
       return undefined;
    }

    const product = docToProduct(snapshot.docs[0], lang);
    
    // Find the category metadata (we still need static metadata for colors/descriptions of brands)
    const category = getProductCategories(lang).find(c => c.slug === brandSlug) || {
      slug: brandSlug,
      name: brandSlug.toUpperCase(),
      tagline: "",
      description: "",
      focus: "",
      brandColor: "#000",
      heroImage: "",
      products: []
    };

    return { category, product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return undefined;
  }
}

