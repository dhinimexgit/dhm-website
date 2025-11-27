import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, getDoc, limit } from "firebase/firestore";
import { productCategories, type Product, type ProductCategory } from "@/data/site-content";

// Helper to convert Firestore data to Product type
const docToProduct = (doc: any): Product => {
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
    name: data.name,
    price: data.price,
    categories: data.categories || [],
    subCategories: data.subCategories || [],
    featuredHighlights: data.featuredHighlights || [],
    specs: data.specs || {},
    images: cleanedImages,
    createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt || null,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt?.toDate?.().toISOString() || data.updatedAt || null,
    updatedBy: data.updatedBy,
  };
};

export async function getAllProducts(): Promise<ProductCategory[]> {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      // Fallback to static data if DB is empty (for safety/initial load)
      console.warn("No products in Firestore, falling back to static data.");
      return productCategories;
    }

    const products = snapshot.docs.map(docToProduct);

    // Reconstruct the category structure expected by the UI
    // We clone the static categories structure but replace the products array
    const categories = productCategories.map(cat => ({
      ...cat,
      products: products.filter(p => p.brand === cat.slug)
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching products:", error);
    return productCategories; // Fallback on error
  }
}

export async function getProduct(brandSlug: string, productSlug: string): Promise<{ category: ProductCategory; product: Product } | undefined> {
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
       const cat = productCategories.find(c => c.slug === brandSlug);
       const prod = cat?.products.find(p => p.slug === productSlug);
       if (cat && prod) return { category: cat, product: prod };
       return undefined;
    }

    const product = docToProduct(snapshot.docs[0]);
    
    // Find the category metadata (we still need static metadata for colors/descriptions of brands)
    const category = productCategories.find(c => c.slug === brandSlug) || {
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

