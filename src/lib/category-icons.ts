/** Top-level product category icons in /public/product-icons */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  tools: "/product-icons/tools-icon.png",
  meter: "/product-icons/meter-icon.png",
  cable: "/product-icons/cable-icon.png",
  "concrete-products": "/product-icons/concrete-product-icon.png",
  "electrical-testing-products": "/product-icons/electrical-testing-product-icon.png",
  "power-distribution-product": "/product-icons/power-distribution-product-icon.png",
  transformer: "/product-icons/transformer-icon.png",
  "electric-pumps": "/product-icons/electric-pumps-icon.png",
  "electric-motors": "/product-icons/electric-motor-icon.png",
  "fa-product": "/product-icons/fa-product-icons.png",
};

export function getCategoryIconSrc(categoryId: string): string | null {
  return CATEGORY_ICON_MAP[categoryId] ?? null;
}
