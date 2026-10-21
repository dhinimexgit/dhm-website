'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseDb } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Product } from "@/data/site-content";
import { StickyHeader } from "@/components/home/sticky-header";
import { ContactModal } from "@/components/contact-modal";
import { useLanguage } from "@/lib/i18n";
import {
  subscribeBrands,
  subscribeCategories,
  buildCategoryTree,
  localized,
  type Brand as TaxonomyBrand,
  type CategoryNode,
} from "@/lib/taxonomy";
import { NavAdminLoginLink } from "@/components/layout/nav-admin-login-link";
import { BrandShowcaseCarousel } from "@/components/products/brand-showcase-carousel";
import { getCategoryIconSrc } from "@/lib/category-icons";
import {
  NavUtilityCluster,
  NavUtilityDivider,
  NAV_UTILITY_ICON_CLASS,
} from "@/components/layout/nav-utility-cluster";

const sortOptions = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

// Brand list and category tree are now loaded dynamically from Firestore
// (see @/lib/taxonomy) so they can be managed from the admin dashboard.

// Helper to convert Firestore data to Product type (same as admin page)
const docToProduct = (doc: any): Product => {
  const data = doc.data ? doc.data() : doc;
  
  // Clean images array
  let rawImages = data.images;
  if (rawImages === null || rawImages === undefined) {
    rawImages = [];
  }
  
  const cleanedImages = Array.isArray(rawImages) 
    ? rawImages
        .filter((img: any) => img && typeof img === 'string' && img.trim().length > 0)
        .map((img: string) => img.trim())
    : [];
  
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
    images: cleanedImages,
    createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt || null,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt?.toDate?.().toISOString() || data.updatedAt || null,
    updatedBy: data.updatedBy,
  } as Product;
};

// Fisher-Yates driven by a seeded PRNG (mulberry32). Seeding it — rather than
// calling Math.random() inline — keeps the order stable across re-renders, so
// the featured strip doesn't reshuffle every time the language toggles or the
// product list updates.
function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let state = seed >>> 0;

  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

type Props = {
  initialBrand?: string;
  initialProducts?: Product[];
};

export function ProductsPageClient({ initialBrand, initialProducts }: Props) {
  const { t, language, setLanguage } = useLanguage();
  // Products are server-rendered (see getProductsForListing) so the catalogue
  // is in the initial HTML. Only fall back to fetching in the browser if the
  // server had nothing to give us.
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(!initialProducts?.length);

  // Dynamic brands & category tree (managed from the admin dashboard).
  const [brandsList, setBrandsList] = useState<TaxonomyBrand[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  
  // Sticky header scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Only fetch in the browser when the server render produced nothing (a
  // Firestore error, or a brand page rendered on demand before revalidation).
  // A public catalogue does not need a live listener: the page is ISR-cached
  // and refreshes every 5 minutes, and onSnapshot held an open channel plus a
  // full-collection read for every visitor.
  useEffect(() => {
    if (initialProducts?.length) return;

    const firestore = getFirebaseDb();
    if (!firestore) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    getDocs(collection(firestore, "products"))
      .then((snapshot) => {
        if (cancelled) return;
        setProducts(snapshot.docs.map((doc) => docToProduct(doc)));
      })
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialProducts]);

  // Subscribe to dynamic brands & categories
  useEffect(() => {
    const unsubBrands = subscribeBrands(setBrandsList);
    const unsubCats = subscribeCategories((cats) => setCategoryTree(buildCategoryTree(cats)));
    return () => {
      unsubBrands();
      unsubCats();
    };
  }, []);

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close on escape key or click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (searchOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Build brand "category" structure (brand + its products) from dynamic brands
  const categories = useMemo(() => {
    return brandsList
      .filter((b) => !b.hidden)
      .map((b) => ({
        slug: b.slug,
        name: localized(language, b.name, b.nameKh),
        tagline: b.tagline || "",
        description: b.description || "",
        focus: b.focus || "",
        brandColor: b.brandColor || "#1e2a78",
        heroImage: b.heroImage || "",
        products: products.filter((p) => p.brand === b.slug),
      }));
  }, [brandsList, products, language]);

  // State for View Mode (Landing vs Listing)
  const [viewMode, setViewMode] = useState<'landing' | 'listing'>(initialBrand ? 'listing' : 'landing');

  // Filter State
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState(sortOptions[0].value);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const PRODUCTS_PER_PAGE = 12;
  const productsHeaderRef = useRef<HTMLHeadingElement>(null);

  // Brand slug -> display name / colour, so cards can show a real brand badge
  // instead of the raw slug.
  const brandBySlug = useMemo(() => {
    const map = new Map<string, { name: string; brandColor: string }>();
    categories.forEach((c) => map.set(c.slug, { name: c.name, brandColor: c.brandColor }));
    return map;
  }, [categories]);

  // Flatten all products for "View All" or multi-brand filtering
  const allProducts = useMemo(() => products, [products]);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let items = allProducts;

    // Filter by Brand
    if (selectedBrands.length > 0) {
      items = items.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by Category
    if (selectedCategories.length > 0) {
      items = items.filter(p => 
        p.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    // Sort
    const sorter = [...items];
    sorter.sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return (new Date(a.createdAt || 0).getTime()) - (new Date(b.createdAt || 0).getTime());
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        // case "rating":
        //   return b.rating - a.rating;
        default: // newest
          return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
      }
    });
    return sorter;
  }, [allProducts, selectedBrands, selectedCategories, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrands, selectedCategories, sortOption]);

  // Handlers
  const handleCategoryClick = (categoryId: string) => {
    // The tile's count covers the parent *and* its children, so the filter it
    // applies has to as well — otherwise a tile reading "12" lands on an empty
    // grid whenever products are tagged only against sub-categories.
    const group = categoryTree.find((g) => g.id === categoryId);
    setSelectedCategories(
      group ? [group.id, ...group.children.map((c) => c.id)] : [categoryId]
    );
    setSelectedBrands([]);
    setViewMode('listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllClick = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setViewMode('listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBrand = (brandSlug: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandSlug) 
        ? prev.filter(b => b !== brandSlug)
        : [...prev, brandSlug]
    );
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => {
      const isCurrentlySelected = prev.includes(catId);
      
      // Find if this is a parent category
      const parentGroup = categoryTree.find(group => group.id === catId);
      
      // Find if this is a child category and get its parent
      let parentGroupOfChild: typeof categoryTree[0] | undefined;
      for (const group of categoryTree) {
        if (group.children?.some(child => child.id === catId)) {
          parentGroupOfChild = group;
          break;
        }
      }
      
      let newSelection = [...prev];
      
      if (parentGroup) {
        // Toggling a parent category
        if (isCurrentlySelected) {
          // Deselect parent and all its children
          newSelection = newSelection.filter(c => c !== catId && !parentGroup.children?.some(child => child.id === c));
        } else {
          // Select parent and all its children
          newSelection.push(catId);
          if (parentGroup.children) {
            parentGroup.children.forEach(child => {
              if (!newSelection.includes(child.id)) {
                newSelection.push(child.id);
              }
            });
          }
        }
      } else if (parentGroupOfChild) {
        // Toggling a child category
        const childIds = parentGroupOfChild.children?.map(c => c.id) || [];
        
        if (isCurrentlySelected) {
          // Deselect child and parent if it was selected
          newSelection = newSelection.filter(c => c !== catId && c !== parentGroupOfChild!.id);
        } else {
          // Select child
          newSelection.push(catId);
          // Check if all children are now selected (including the one we just added)
          const allChildrenSelected = childIds.every(id => {
            if (id === catId) return true; // The one we just selected
            return newSelection.includes(id);
          });
          if (allChildrenSelected && !newSelection.includes(parentGroupOfChild.id)) {
            newSelection.push(parentGroupOfChild.id);
          }
        }
      } else {
        // Fallback: toggle the category normally
        newSelection = isCurrentlySelected
          ? newSelection.filter(c => c !== catId)
          : [...newSelection, catId];
      }
      
      return newSelection;
    });
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSortOption(sortOptions[0].value);
  };

  // Removable chips for whatever is currently filtering the grid.
  const activeFilterChips = useMemo(() => {
    const flat = categoryTree.flatMap((c) => [c, ...(c.children || [])]);
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    selectedBrands.forEach((slug) => {
      const brand = categories.find((c) => c.slug === slug);
      chips.push({
        key: `brand-${slug}`,
        label: brand?.name || slug,
        onRemove: () => toggleBrand(slug),
      });
    });

    selectedCategories.forEach((id) => {
      // A child whose parent is also ticked is already implied by the parent
      // chip, so don't repeat it.
      const parent = categoryTree.find((g) => g.children?.some((child) => child.id === id));
      if (parent && selectedCategories.includes(parent.id)) return;

      const match = flat.find((c) => c.id === id);
      chips.push({
        key: `cat-${id}`,
        label: match ? localized(language, match.label, match.labelKh) : id,
        onRemove: () => toggleCategory(id),
      });
    });

    return chips;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrands, selectedCategories, categories, categoryTree, language]);

  const activeFilterCount = activeFilterChips.length;

  // Breadcrumb Text
  const breadcrumbText = useMemo(() => {
    const parts = [];
    if (selectedBrands.length === 1) {
      const b = categories.find(c => c.slug === selectedBrands[0]);
      if (b) parts.push(b.name);
    } else if (selectedBrands.length > 1) {
      parts.push(`${selectedBrands.length} Brands`);
    }

    if (selectedCategories.length === 1) {
      // Find label from flat list or tree (simplified check)
      const flat = categoryTree.flatMap(c => [c, ...(c.children || [])]);
      const match = flat.find(c => c.id === selectedCategories[0]);
      const catLabel = match ? localized(language, match.label, match.labelKh) : selectedCategories[0];
      parts.push(catLabel);
    } else if (selectedCategories.length > 1) {
      parts.push(`${selectedCategories.length} Categories`);
    }

    return parts.length > 0 ? parts.join(" / ") : t.productsPage.listing.allProducts;
  }, [selectedBrands, selectedCategories, categories, categoryTree, language, t]);

  // Top-level categories shown as "browse by category" tiles on the landing.
  const displayCategories = useMemo(() => {
    return categoryTree.map((group) => {
      const ids = [group.id, ...group.children.map((c) => c.id)];
      const count = products.filter((p) => p.categories?.some((c: string) => ids.includes(c))).length;
      return { id: group.id, label: localized(language, group.label, group.labelKh), count };
    });
  }, [categoryTree, products, language]);

  // Drives the per-visit shuffle of the featured strip and the brand carousel.
  // The seed is set after mount and never during render: the page is
  // server-rendered and ISR-cached, so randomising server-side would mismatch
  // hydration *and* serve one frozen order to everyone until the cache
  // revalidates. Seed 0 = "not mounted yet", which keeps the server HTML and
  // the first client render identical.
  const [shuffleSeed, setShuffleSeed] = useState(0);

  useEffect(() => {
    setShuffleSeed(Math.floor(Math.random() * 0xffffffff) || 1);
  }, []);

  const featuredProducts = useMemo(() => {
    const all = categories.flatMap(c => c.products);
    return (shuffleSeed ? seededShuffle(all, shuffleSeed) : all).slice(0, 5);
  }, [categories, shuffleSeed]);

  const showcaseBrands = useMemo(() => {
    const items = categories.map((brand) => ({
      slug: brand.slug,
      name: brand.name,
      heroImage: brand.heroImage,
    }));
    return shuffleSeed ? seededShuffle(items, shuffleSeed) : items;
  }, [categories, shuffleSeed]);

  // Show loading state while fetching products
  if (loading) {
    return (
      <>
        <StickyHeader isVisible={isScrolled} />
        <div>
          <HeroSection 
            onViewAll={handleViewAllClick}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchInputRef={searchInputRef}
            searchPanelRef={searchPanelRef}
            handleSearchSubmit={handleSearchSubmit}
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-r-transparent"></div>
                <p className="mt-4 text-slate-500">{t.productsPage.loading}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StickyHeader isVisible={isScrolled} />
      <div>
        <HeroSection 
          onViewAll={handleViewAllClick}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchInputRef={searchInputRef}
          searchPanelRef={searchPanelRef}
          handleSearchSubmit={handleSearchSubmit}
        />
      
      {viewMode === 'landing' ? (
        <>
          {/* Shop by Categories */}
          <section className="full-bleed bg-slate-50/50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                  
                  {t.productsPage.browse.sectionTitle}
                </p>
                <h2 className="mb-4 text-3xl font-bold text-brand-navy lg:text-4xl">
                  {t.productsPage.browse.title}
                </h2>
                <p className="mx-auto max-w-2xl text-base text-slate-500">
                  {t.productsPage.browse.description}
                </p>
              </div>
            
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {displayCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white py-8 transition-all hover:border-brand-navy hover:shadow-lg"
                  >
                    <CategoryIcon id={cat.id} className="h-[85px] w-[85px] transition-transform group-hover:scale-105" />
                    <div className="text-center">
                      <span className="block text-sm font-semibold text-slate-700 group-hover:text-brand-navy">{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="mb-3 inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                
                {t.productsPage.featured.sectionTitle}
              </p>
              <h2 className="mb-4 text-3xl font-bold text-brand-navy lg:text-4xl">
                {t.productsPage.featured.title}
              </h2>
              <p className="mx-auto max-w-2xl text-base text-slate-500">
                {t.productsPage.featured.description}
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {featuredProducts.map((product, index) => (
                <FeaturedProductCard
                  key={`${product.slug}-${index}`}
                  product={product}
                  categorySlug={categories.find(c => c.slug === product.brand)?.slug || 'stanley'}
                  brandName={brandBySlug.get(product.brand)?.name}
                  brandColor={brandBySlug.get(product.brand)?.brandColor}
                />
              ))}
            </div>
          </section>

          {/* Brand Banners */}
          <section className="full-bleed bg-slate-50/50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
                  
                  {t.productsPage.brands.sectionTitle}
                </p>
                <h2 className="mb-4 text-3xl font-bold text-brand-navy lg:text-4xl">
                  {t.productsPage.brands.title}
                </h2>
                <p className="mx-auto max-w-2xl text-base text-slate-500">
                  {t.productsPage.brands.description}
                </p>
              </div>

              <BrandShowcaseCarousel
                brands={showcaseBrands}
                shopLabel={t.productsPage.brands.shopBrand}
              />
            </div>
          </section>
        </>
      ) : (
        // PLP Layout (Sidebar + Grid)
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-brand-red">{t.productsPage.listing.home}</Link>
            <span>/</span>
            <button onClick={() => setViewMode('landing')} className="hover:text-brand-red">{t.productsPage.listing.products}</button>
            <span>/</span>
            <span className="font-semibold text-brand-navy">{breadcrumbText}</span>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Mobile Filter Toggle — sits above the panel it controls */}
            <div className="order-1 w-full lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                aria-expanded={mobileFiltersOpen}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-navy hover:text-brand-navy"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                {mobileFiltersOpen ? t.productsPage.listing.hideFilters : t.productsPage.listing.showFilters}
                {activeFilterCount > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-red px-1.5 text-[11px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sidebar - Filters Panel */}
            <aside className={`order-2 w-full lg:order-1 lg:w-1/4 lg:shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-brand-navy">{t.productsPage.listing.filters}</h3>
                  <button onClick={clearFilters} className="text-xs font-semibold text-brand-red hover:underline">
                    {t.productsPage.listing.clearAll}
                  </button>
                </div>

                {/* Categories Filter */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">{t.productsPage.listing.categories}</h4>
                  <ul className="space-y-2 text-sm">
                    {categoryTree.map((group) => {
                      const isExpanded = expandedCategories.has(group.id);
                      const hasChildren = group.children && group.children.length > 0;
                      
                      // Calculate indeterminate state for parent
                      let isIndeterminate = false;
                      if (hasChildren && group.children) {
                        const selectedChildrenCount = group.children.filter(child => 
                          selectedCategories.includes(child.id)
                        ).length;
                        const isParentSelected = selectedCategories.includes(group.id);
                        isIndeterminate = selectedChildrenCount > 0 && selectedChildrenCount < group.children.length && !isParentSelected;
                      }
                      
                      return (
                        <li key={group.id}>
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id={`cat-${group.id}`}
                              ref={(el) => {
                                if (el) el.indeterminate = isIndeterminate;
                              }}
                              checked={selectedCategories.includes(group.id)}
                              onChange={() => toggleCategory(group.id)}
                              className="rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
                            />
                            <label 
                              htmlFor={`cat-${group.id}`} 
                              className="font-medium text-slate-700 cursor-pointer flex-1"
                            >
                              {localized(language, group.label, group.labelKh)}
                            </label>
                            {hasChildren && (
                              <button
                                type="button"
                                onClick={() => toggleCategoryExpand(group.id)}
                                className="flex items-center justify-center p-1 text-slate-500 hover:text-slate-700 transition-colors"
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                              >
                                <svg
                                  className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                          </div>
                          {hasChildren && (
                            <ul 
                              className={`ml-6 space-y-2 border-l border-slate-100 pl-3 transition-all overflow-hidden ${
                                isExpanded ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                              }`}
                            >
                              {group.children.map((child) => (
                                <li key={child.id} className="flex items-center gap-2">
                                  <input 
                                    type="checkbox"
                                    id={`cat-${child.id}`}
                                    checked={selectedCategories.includes(child.id)}
                                    onChange={() => toggleCategory(child.id)}
                                    className="rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
                                  />
                                  <label htmlFor={`cat-${child.id}`} className="text-slate-600 cursor-pointer">{localized(language, child.label, child.labelKh)}</label>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Brands Filter */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <h4 className="font-semibold text-slate-700">{t.productsPage.listing.brands}</h4>
                  <div className="space-y-2">
                    {categories.map((b) => (
                      <div key={b.slug} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`brand-${b.slug}`}
                          checked={selectedBrands.includes(b.slug)}
                          onChange={() => toggleBrand(b.slug)}
                          className="rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
                        />
                        <label
                          htmlFor={`brand-${b.slug}`}
                          className="flex-1 cursor-pointer text-sm font-medium text-slate-700 hover:text-brand-navy"
                        >
                          {b.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Sort Filter (Moved here as requested "Price Sorter" in sidebar) */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <h4 className="font-semibold text-slate-700">{t.productsPage.listing.sortBy}</h4>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <input 
                          type="radio"
                          name="sort"
                          id={`sort-${option.value}`}
                          checked={sortOption === option.value}
                          onChange={() => setSortOption(option.value)}
                          className="text-brand-navy focus:ring-brand-navy"
                        />
                        <label htmlFor={`sort-${option.value}`} className="text-sm text-slate-600 cursor-pointer">
                          {language === 'kh' 
                            ? option.value === "newest" ? "ថ្មីបំផុត → ចាស់បំផុត"
                            : option.value === "oldest" ? "ចាស់បំផុត → ថ្មីបំផុត"
                            : option.value === "price-asc" ? "តម្លៃ: ទាប → ខ្ពស់"
                            : option.value === "price-desc" ? "តម្លៃ: ខ្ពស់ → ទាប"
                            : option.label
                            : option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            {/* min-w-0 is load-bearing: without it this flex item refuses to
                shrink below its widest child and the whole page scrolls
                sideways. */}
            <main className="order-3 min-w-0 flex-1 lg:order-2">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <h2 ref={productsHeaderRef} className="scroll-mt-24 text-2xl font-bold text-brand-navy">
                  {t.productsPage.listing.products} <span className="text-sm font-normal text-slate-500 ml-2">({filteredProducts.length} {t.productsPage.listing.items})</span>
                </h2>
                {totalPages > 1 && (
                  <span className="text-sm text-slate-500">
                    {currentPage} / {totalPages}
                  </span>
                )}
              </div>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  {activeFilterChips.map((chip) => (
                    <button
                      key={chip.key}
                      onClick={chip.onRemove}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-brand-navy/15 bg-brand-navy/5 py-1 pl-3 pr-2 text-xs font-semibold text-brand-navy transition hover:border-brand-red/40 hover:bg-brand-red/5 hover:text-brand-red"
                    >
                      {chip.label}
                      <svg className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="ml-1 text-xs font-semibold text-brand-red hover:underline"
                  >
                    {t.productsPage.listing.clearAll}
                  </button>
                </div>
              )}

              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {paginatedProducts.map((product, index) => (
                      <FeaturedProductCard
                        key={`${product.slug}-${index}`}
                        product={product}
                        categorySlug={categories.find(c => c.slug === product.brand)?.slug || 'stanley'}
                        brandName={brandBySlug.get(product.brand)?.name}
                        brandColor={brandBySlug.get(product.brand)?.brandColor}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <PaginationBar
                      currentPage={currentPage}
                      totalPages={totalPages}
                      previousLabel={t.productsPage.listing.previous}
                      nextLabel={t.productsPage.listing.next}
                      onChange={(page) => {
                        setCurrentPage(page);
                        productsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                  <p className="text-lg font-medium text-slate-500">{t.productsPage.listing.noProducts}</p>
                  <button onClick={clearFilters} className="mt-2 text-sm font-semibold text-brand-red hover:underline">{t.productsPage.listing.clearFilters}</button>
                </div>
              )}
            </main>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="full-bleed relative overflow-hidden bg-brand-navy py-24">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-5 text-3xl font-bold text-white lg:text-4xl">
            {t.productsPage.cta.title}
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-white/70">
            {t.productsPage.cta.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-brand-navy shadow-lg transition hover:bg-slate-100"
            >
              {t.productsPage.cta.contact}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="tel:011753940"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t.productsPage.cta.call}
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

// A compact page window: 1 … 6 [7] 8 … 27. Rendering every page number blows
// the row (and the whole flex layout) wide open once the catalogue is unfiltered.
function getPageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const wanted = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => wanted.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => wanted.add(p));

  const pages = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  return pages.flatMap((page, i) =>
    i > 0 && page - pages[i - 1] > 1 ? (["gap", page] as (number | "gap")[]) : [page]
  );
}

function PaginationBar({
  currentPage,
  totalPages,
  previousLabel,
  nextLabel,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  previousLabel: string;
  nextLabel: string;
  onChange: (page: number) => void;
}) {
  const pageWindow = getPageWindow(currentPage, totalPages);
  const arrowClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-navy hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-600 sm:px-4";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={arrowClass}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">{previousLabel}</span>
      </button>

      {/* Numbers on tablet and up; a plain counter keeps phones tidy. */}
      <div className="hidden items-center gap-1 sm:flex">
        {pageWindow.map((page, i) =>
          page === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-sm text-slate-400 select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <span className="px-2 text-sm font-medium text-slate-600 sm:hidden">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={arrowClass}
      >
        <span className="hidden sm:inline">{nextLabel}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

function ProductImageDisplay({ images, productName }: { images: any, productName: string }) {
  const { t, language, setLanguage } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Get the first valid image with robust validation
  const validImages = useMemo(() => {
    // Handle null, undefined, or non-array
    if (!images) return [];
    if (!Array.isArray(images)) {
      // Try to convert if it's a string
      if (typeof images === 'string' && images.trim().length > 0) {
        return [images.trim()];
      }
      return [];
    }
    
    // Filter and clean the images array
    return images
      .filter((img: any) => {
        // Reject falsy values
        if (!img) return false;
        
        // Accept strings
        if (typeof img === 'string') {
          const trimmed = img.trim();
          return trimmed.length > 0;
        }
        
        return false;
      })
      .map((img: string) => String(img).trim());
  }, [images]);
  
  const firstImage = validImages.length > 0 ? validImages[0] : null;
  
  // Reset error and loading state when image changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [firstImage]);
  
  if (!firstImage || imageError) {
    return (
      <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg bg-slate-100">
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          <span className="text-xs">{t.productsPage.card.noImage}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg bg-slate-100">
      {/* Loading spinner */}
      {imageLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-navy border-t-transparent"></div>
        </div>
      )}
      <Image
        src={firstImage}
        alt={productName || 'Product image'}
        fill
        className={`object-contain transition-all duration-500 group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => setImageLoading(false)}
        onError={() => {
          console.warn('Image failed to load:', firstImage);
          setImageLoading(false);
          setImageError(true);
        }}
      />
    </div>
  );
}

// Partner brand colours run the whole range, from near-black to DeWalt yellow.
// White is the house look for the badge, but it washes out on the light end, so
// flip to near-black whenever white would fall below ~3.5:1 on that fill.
// Expects a validated #rrggbb value.
function badgeTextColor(hex: string): string {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const luminance =
    0.2126 * channel(parseInt(hex.slice(1, 3), 16)) +
    0.7152 * channel(parseInt(hex.slice(3, 5), 16)) +
    0.0722 * channel(parseInt(hex.slice(5, 7), 16));

  // WCAG contrast of white against this fill: 1.05 / (L + 0.05).
  return 1.05 / (luminance + 0.05) >= 3.5 ? "#ffffff" : "#0f172a";
}

// Both card actions share one box model — same height, radius, padding and
// type — so "Request Quote" and "View Product" stack as a matched pair. The
// primary carries a border too, otherwise it would sit 4px shorter.
const CARD_ACTION_BASE =
  "block w-full rounded-lg border-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider transition-colors";
const CARD_ACTION_PRIMARY = `${CARD_ACTION_BASE} border-brand-navy bg-brand-navy text-white hover:border-brand-red hover:bg-brand-red`;
const CARD_ACTION_SECONDARY = `${CARD_ACTION_BASE} border-brand-navy/25 bg-white text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5`;

function FeaturedProductCard({
  product,
  categorySlug,
  brandName,
  brandColor,
}: {
  product: any;
  categorySlug: string;
  brandName?: string;
  brandColor?: string;
}) {
  const { t, language } = useLanguage();
  const hasPrice = product.price && Number(product.price) > 0;

  // Only trust a full hex value for inline tinting; fall back to brand navy.
  const accent = /^#[0-9a-f]{6}$/i.test(brandColor || "") ? brandColor! : "#1e2a78";
  const label = brandName || product.brand;

  return (
    <div className="group relative flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-navy/30 hover:shadow-xl">
      <ProductImageDisplay
        images={product.images}
        productName={product.name}
      />

      {label && (
        <span
          className="inline-flex max-w-full items-center truncate rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: accent, color: badgeTextColor(accent) }}
        >
          {label}
        </span>
      )}

      {/* Absorbs the card's leftover height, so the name sits centred in the
          white space between the badge and the actions instead of hugging the
          badge. Cards in a row still bottom-align their buttons. */}
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 py-5">
        <h3 className="line-clamp-2 text-sm font-bold text-brand-navy group-hover:text-brand-red">
          {language === "kh" && product.nameKh ? product.nameKh : product.name}
        </h3>

        {hasPrice && (
          <div className="text-lg font-bold text-brand-red">
            ${Number(product.price).toFixed(2)}
          </div>
        )}
      </div>

      <div className="w-full space-y-2">
        {!hasPrice && (
          <ContactModal
            productName={product.name}
            triggerText={t.productsPage.card.requestQuote}
            triggerClassName={CARD_ACTION_SECONDARY}
            initialQuestion={language === 'kh' ? `ខ្ញុំចង់ស្នើសុំតម្លៃសម្រាប់ ${product.name}។` : `I would like to request a quotation for ${product.name}.`}
            language={language}
          />
        )}

        <Link
          href={`/products/${categorySlug}/${product.slug}`}
          className={CARD_ACTION_PRIMARY}
        >
          {t.productsPage.card.viewProduct}
        </Link>
      </div>
    </div>
  );
}

function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const src = getCategoryIconSrc(id);

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={85}
        height={85}
        className={`object-contain ${className ?? ""}`}
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-slate-400 ${className ?? ""}`}
      aria-hidden
    >
      <path d="M3 3h18v18H3z" />
    </svg>
  );
}

type HeroSectionProps = {
  onViewAll: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchPanelRef: React.RefObject<HTMLDivElement | null>;
  handleSearchSubmit: (e: React.FormEvent) => void;
};

function HeroSection({ 
  onViewAll,
  searchOpen,
  setSearchOpen,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  searchPanelRef,
  handleSearchSubmit
}: HeroSectionProps) {
  const { t, language, setLanguage } = useLanguage();
  const heroImage = "/product-hero.png";

  return (
    <section className="relative min-h-[70vh] overflow-hidden lg:min-h-[80vh]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Dhinimex Products"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Header - Desktop Only */}
      <div className="relative z-30 hidden lg:block">
        <div className="mx-auto max-w-7xl px-8 pt-6">
          <div className="relative rounded-xl bg-brand-navy shadow-lg">
            <div className="flex items-center justify-between px-8 py-4">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/brands/DHM-WHITE.png"
                  alt="Dhinimex logo"
                  width={160}
                  height={46}
                  priority
                  className="h-auto w-[160px]"
                />
              </Link>
              <nav className="flex items-center gap-8 text-[15px] font-medium text-white">
                <Link href="/about" className="group relative transition hover:text-white/80">{t.nav.about}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                </Link>
                <div className="group relative">
                  <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">{t.nav.business}<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                  <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.trading}</Link>
                    <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.manufacturing}</Link>
                    <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.electricity}</Link>
                    <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.water}</Link>
                    <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">{t.business.scientific}</Link>
                  </div>
                </div>
                <Link href="/services" className="group relative transition hover:text-white/80">{t.nav.services}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                </Link>
                {/* Products - Active */}
                <Link href="/products" className="group relative transition hover:text-white/80">{t.nav.products}<span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
                </Link>
                <Link href="/news" className="group relative transition hover:text-white/80">{t.nav.blog}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                </Link>
                <Link href="/careers" className="group relative transition hover:text-white/80">{t.nav.careers}<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                </Link>
              </nav>
              <div className="flex items-center gap-3">
                    <NavUtilityCluster>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(!searchOpen)}
                      className={`${NAV_UTILITY_ICON_CLASS} ${searchOpen ? "text-white" : ""}`}
                      aria-label="Search"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <NavUtilityDivider />
                    <button
                      type="button"
                      onClick={() => setLanguage(language === 'en' ? 'kh' : 'en')}
                      className={`${NAV_UTILITY_ICON_CLASS} px-1.5`}
                      aria-label="Toggle Language"
                    >
                      <Image
                        src={language === 'en' ? "/kh-flag.png" : "/en-flag.png"}
                        alt={language === 'en' ? "Khmer" : "English"}
                        width={30}
                        height={20}
                        className="h-4 w-auto rounded-sm"
                      />
                    </button>
                    <NavUtilityDivider />
                    <NavAdminLoginLink />
                  </NavUtilityCluster>
                <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">{t.nav.contact}</Link>
              </div>
            </div>

            {/* Search Dropdown */}
            {searchOpen && (
              <div
                ref={searchPanelRef}
                className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-2xl"
              >
                <div className="px-8 py-4">
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.nav.searchPlaceholder}
                        className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner"
                      />
                    </div>
                    <button type="submit" className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy/90">{t.nav.searchBtn}</button>
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">{t.nav.cancel}</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex min-h-[calc(70vh-120px)] items-center py-16 lg:min-h-[calc(80vh-120px)] lg:py-0 lg:pt-4">
          <div className="max-w-2xl space-y-6">
            <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">
              
              {t.nav.products}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-[64px] xl:leading-[1.1]">
              {t.productsPage.hero.title}
            </h1>
            <p className="max-w-xl text-lg text-white/80">
              {t.productsPage.hero.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-4 mb-6">
              <button
                onClick={onViewAll}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#c91e21]"
              >
                {t.productsPage.hero.viewAll}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {t.productsPage.hero.requestQuote}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
