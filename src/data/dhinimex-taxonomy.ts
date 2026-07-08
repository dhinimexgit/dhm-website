/**
 * Dhinimex product taxonomy — manufacturer brands with parent categories
 * and sub-categories per the All Products catalog.
 */

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type BrandDef = {
  slug: string;
  name: string;
  tagline?: string;
  focus?: string;
  brandColor?: string;
  heroImage?: string;
  order?: number;
};

type CategoryDef = {
  label: string;
  parentId?: string | null;
  order: number;
};

// Locally optimized brand hero images (compressed WebP in /public/brands).
// Replaced large external third-party URLs that loaded slowly.
const stanleyImage = "/brands/hero-stanley.webp";
const dewaltImage = "/brands/hero-dewalt.webp";
const blackDeckerImage = "/brands/hero-black-and-decker.webp";

/** Manufacturer brands. */
export const DHINIMEX_BRANDS: BrandDef[] = [
  // Tools
  { slug: "dewalt", name: "DEWALT", brandColor: "#FDB927", heroImage: dewaltImage, order: 0 },
  { slug: "stanley", name: "STANLEY", brandColor: "#FCD60C", heroImage: stanleyImage, order: 1 },
  {
    slug: "black-and-decker",
    name: "BLACK+DECKER",
    brandColor: "#FF5C00",
    heroImage: blackDeckerImage,
    order: 2,
  },
  // Meters
  { slug: "secure", name: "SECURE", brandColor: "#1e40af", order: 3 },
  { slug: "landis-gyr", name: "Landis+Gyr", brandColor: "#0369a1", order: 4 },
  { slug: "mitsubishi-electric", name: "MITSUBISHI ELECTRIC", brandColor: "#dc2626", order: 5 },
  // Cables
  { slug: "vcc", name: "VCC", brandColor: "#1e2a78", order: 6 },
  { slug: "thipha-cable", name: "ThiPha Cable", brandColor: "#334155", order: 7 },
  { slug: "ls-vina-cable-system", name: "LS VINA Cable & System", brandColor: "#0f766e", order: 8 },
  { slug: "hinshitsu", name: "HINSHITSU", brandColor: "#475569", order: 9 },
  // Concrete Products
  { slug: "kcc", name: "KCC", brandColor: "#78716c", order: 10 },
  // Electrical Testing
  { slug: "kyoritsu", name: "KYORITSU", brandColor: "#b45309", order: 11 },
  // Power Distribution
  { slug: "eaton", name: "EATON", brandColor: "#005EB8", order: 12 },
  { slug: "selia-tek", name: "SELIA-TEK", brandColor: "#0891b2", order: 13 },
  // Transformers
  { slug: "precise", name: "PRECISE", brandColor: "#7c3aed", order: 14 },
  { slug: "saekaraj-transfo", name: "Saekaraj Transfo", brandColor: "#6d28d9", order: 15 },
  // Electric Pumps
  { slug: "meath", name: "MEATH", brandColor: "#0284c7", order: 16 },
];

/** Parent categories and sub-categories. */
const CATEGORY_DEFS: CategoryDef[] = [
  // Tools
  { label: "Tools", order: 0 },
  { label: "Power Tools", parentId: "tools", order: 0 },
  { label: "Hand Tools", parentId: "tools", order: 1 },
  { label: "Accessories", parentId: "tools", order: 2 },
  { label: "Battery", parentId: "tools", order: 3 },
  { label: "Charger", parentId: "tools", order: 4 },
  { label: "Spare Part", parentId: "tools", order: 5 },
  { label: "Cordless", parentId: "tools", order: 6 },
  { label: "Cord", parentId: "tools", order: 7 },
  { label: "Storage", parentId: "tools", order: 8 },
  { label: "Measure Tool", parentId: "tools", order: 9 },

  // Meters
  { label: "Meter", order: 1 },
  { label: "Electronic Meter", parentId: "meter", order: 0 },
  { label: "Mechanic Meter", parentId: "meter", order: 1 },

  // Cables
  { label: "Cable", order: 2 },
  { label: "MV Cable", parentId: "cable", order: 0 },
  { label: "LV Cable", parentId: "cable", order: 1 },
  { label: "Building Cable", parentId: "cable", order: 2 },
  { label: "Network Cable", parentId: "cable", order: 3 },

  // Concrete Products
  { label: "Concrete Products", order: 3 },
  { label: "Concrete Pole", parentId: "concrete-products", order: 0 },
  { label: "Cross-Arm", parentId: "concrete-products", order: 1 },
  { label: "Concrete Block", parentId: "concrete-products", order: 2 },
  { label: "CLC Block", parentId: "concrete-products", order: 3 },

  // Electrical Testing
  { label: "Electrical Testing Products", order: 4 },

  // Power Distribution
  { label: "Power Distribution Product", order: 5 },

  // Transformers
  { label: "Transformer", order: 6 },
  { label: "Transformer Accessories", parentId: "transformer", order: 0 },

  // Electric Pumps
  { label: "Electric Pumps", order: 7 },

  // Motors & FA Products
  { label: "Electric Motors", order: 8 },
  { label: "Electric Motor", parentId: "electric-motors", order: 0 },

  { label: "FA Product", order: 9 },
  { label: "FA Product", parentId: "fa-product", order: 0 },
  { label: "Low-voltage Products", parentId: "fa-product", order: 1 },
  { label: "Energy Saving Supporting Devices", parentId: "fa-product", order: 2 },
  { label: "Drive Products", parentId: "fa-product", order: 3 },
  { label: "HDMI", parentId: "fa-product", order: 4 },
];

export const DHINIMEX_CATEGORIES: Array<{
  id: string;
  label: string;
  parentId: string | null;
  order: number;
}> = CATEGORY_DEFS.map((def) => {
  const isChild = !!def.parentId;
  const baseId = slugify(def.label);
  // Avoid id clash: FA Product parent vs its homonymous sub-category.
  const id =
    isChild && def.parentId === "fa-product" && def.label === "FA Product"
      ? "fa-product-general"
      : isChild
        ? baseId
        : baseId;

  return {
    id,
    label: def.label,
    parentId: def.parentId ?? null,
    order: def.order,
  };
});

/** Which category ids each manufacturer brand belongs to. */
export const BRAND_CATEGORY_MAP: Record<string, string[]> = {
  dewalt: ["tools"],
  stanley: ["tools"],
  "black-and-decker": ["tools"],
  secure: ["meter"],
  "landis-gyr": ["meter"],
  "mitsubishi-electric": ["meter", "electric-motors", "fa-product"],
  vcc: ["cable"],
  "thipha-cable": ["cable"],
  "ls-vina-cable-system": ["cable"],
  hinshitsu: ["cable"],
  kcc: ["concrete-products"],
  kyoritsu: ["electrical-testing-products"],
  eaton: ["power-distribution-product"],
  "selia-tek": ["power-distribution-product"],
  precise: ["transformer"],
  "saekaraj-transfo": ["transformer"],
  meath: ["electric-pumps"],
};
