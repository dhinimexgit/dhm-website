"use client";

import { useState } from "react";
import { requireFirebaseDb } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from "firebase/firestore";
import { getProductCategories } from "@/data/site-content";

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSeed = async () => {
    if (!confirm("This will populate the database with test data from your static files. Existing products with the same slug will be updated. Continue?")) {
      return;
    }

    setLoading(true);
    setStatus("Starting seed...");

    try {
      let count = 0;
      const productsRef = collection(requireFirebaseDb(), "products");

      for (const brandCategory of getProductCategories('en')) {
        const brandSlug = brandCategory.slug;
        
        for (const product of brandCategory.products) {
          setStatus(`Processing ${product.name}...`);

          // Check if product exists
          const q = query(productsRef, where("slug", "==", product.slug));
          const snapshot = await getDocs(q);

          const productData = {
            slug: product.slug,
            brand: brandSlug, // Store brand slug for filtering
            name: product.name,
            model: product.model,
            price: product.price,
            categories: product.categories, // Array of strings ["power-tools", "drills"]
            subCategories: product.subCategories || [],
            featuredHighlights: product.featuredHighlights,
            specs: product.specs,
            images: product.images,
            updatedAt: Timestamp.now(),
            updatedBy: 'system',
            // If new, add createdAt
          };

          if (!snapshot.empty) {
            // Update existing
            const docRef = snapshot.docs[0].ref;
            await updateDoc(docRef, productData);
            console.log(`Updated ${product.name}`);
          } else {
            // Create new
            await addDoc(productsRef, {
              ...productData,
              createdAt: Timestamp.now(),
              createdBy: 'system',
              hidden: false,
            });
            console.log(`Created ${product.name}`);
          }
          count++;
        }
      }

      setStatus(`Success! Processed ${count} products.`);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Seeding error:", error);
      setStatus("Error during seeding. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {status && <span className="text-sm text-slate-600 animate-pulse">{status}</span>}
      <button
        onClick={handleSeed}
        disabled={loading}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {loading ? "Seeding..." : "Seed Test Data"}
      </button>
    </div>
  );
}
