"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { DHINIMEX_BRANDS, DHINIMEX_CATEGORIES } from "@/data/dhinimex-taxonomy";
import type { Language } from "@/data/translations";

/**
 * Shared taxonomy (brands + categories) for the catalog.
 *
 * Brands and categories are stored in Firestore so they can be managed from the
 * admin dashboard. To keep the live site working even before anything is seeded,
 * every loader falls back to the hardcoded data that previously lived in
 * `product-categories.ts` and `products-client.tsx`.
 */

export type Brand = {
  /** Firestore document id (only present for DB-backed brands). */
  id?: string;
  slug: string;
  name: string;
  nameKh?: string;
  tagline?: string;
  description?: string;
  focus?: string;
  brandColor?: string;
  heroImage?: string;
  order?: number;
  hidden?: boolean;
};

export type Category = {
  /** Firestore document id (only present for DB-backed categories). */
  docId?: string;
  /** Stable identifier used on products (matches what gets stored in product.categories). */
  id: string;
  label: string;
  labelKh?: string;
  /** null / undefined => top-level category. */
  parentId?: string | null;
  order?: number;
  hidden?: boolean;
};

export type CategoryNode = Category & { children: Category[] };

// ---------------------------------------------------------------------------
// Static fallbacks (used when Firestore has no data yet)
// ---------------------------------------------------------------------------

export const FALLBACK_BRANDS: Brand[] = DHINIMEX_BRANDS;

export const FALLBACK_CATEGORIES: Category[] = DHINIMEX_CATEGORIES;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a parent/children tree out of a flat category list. */
export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const visible = categories.filter((c) => !c.hidden);
  const parents = visible
    .filter((c) => !c.parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return parents.map((parent) => ({
    ...parent,
    children: visible
      .filter((c) => c.parentId === parent.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));
}

/** Pick the localized value, falling back to English when a Khmer value is missing. */
export function localized(language: Language, en?: string | null, kh?: string | null): string {
  if (language === "kh" && kh && kh.trim()) return kh;
  return en ?? "";
}

// ---------------------------------------------------------------------------
// Realtime subscriptions
// ---------------------------------------------------------------------------

export function subscribeBrands(callback: (brands: Brand[]) => void): Unsubscribe {
  try {
    const q = query(collection(db, "brands"), orderBy("order", "asc"));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(FALLBACK_BRANDS);
          return;
        }
        const items = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Brand, "id">) }));
        callback(items);
      },
      (err) => {
        console.error("subscribeBrands error, using fallback:", err);
        callback(FALLBACK_BRANDS);
      }
    );
  } catch (err) {
    console.error("subscribeBrands setup error, using fallback:", err);
    callback(FALLBACK_BRANDS);
    return () => {};
  }
}

export function subscribeCategories(callback: (categories: Category[]) => void): Unsubscribe {
  try {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(FALLBACK_CATEGORIES);
          return;
        }
        const items = snapshot.docs.map((d) => ({ docId: d.id, ...(d.data() as Omit<Category, "docId">) }));
        callback(items);
      },
      (err) => {
        console.error("subscribeCategories error, using fallback:", err);
        callback(FALLBACK_CATEGORIES);
      }
    );
  } catch (err) {
    console.error("subscribeCategories setup error, using fallback:", err);
    callback(FALLBACK_CATEGORIES);
    return () => {};
  }
}
