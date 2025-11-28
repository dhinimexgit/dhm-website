'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { ProductCategory, Product } from "@/data/site-content";
import { productCategories } from "@/data/site-content";
import { HeroHeader } from "@/components/layout/hero-header";
import { ContactModal } from "@/components/contact-modal";

const sortOptions = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

const categoryTree = [
  {
    id: "power-tools",
    label: "Power Tools",
    children: [
      { id: "drills", label: "Drills & Drivers" },
      { id: "impact", label: "Impact & Fastening" },
      { id: "rotary", label: "Rotary & Demolition" },
      { id: "multi-tool", label: "Cutting & Multi-Tools" },
      { id: "saws", label: "Saws & Cutting" },
    ],
  },
  {
    id: "automotive-tools",
    label: "Automotive Tools",
    children: [
      { id: "wrenches", label: "Impact Wrenches" },
      { id: "polishers", label: "Polishers & Finishers" },
      { id: "mechanic-sets", label: "Mechanic Sets" },
    ],
  },
  {
    id: "dust-management",
    label: "Dust Management",
    children: [
      { id: "vacuums", label: "Vacuums" },
      { id: "extractors", label: "Silica Extractors" },
      { id: "air-movers", label: "Air Movers" },
      { id: "filters", label: "Filters & Bags" },
    ],
  },
];

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

type Props = {
  initialBrand?: string;
};

export function ProductsPageClient({ initialBrand }: Props) {
  // Real-time products from Firebase (like admin page)
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products client-side using onSnapshot (real-time, no caching)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((doc) => {
        items.push(docToProduct(doc));
      });
      setProducts(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Build categories structure from products
  const categories = useMemo(() => {
    return productCategories.map(cat => ({
      ...cat,
      products: products.filter(p => p.brand === cat.slug)
    }));
  }, [products]);

  // State for View Mode (Landing vs Listing)
  const [viewMode, setViewMode] = useState<'landing' | 'listing'>(initialBrand ? 'listing' : 'landing');

  // Filter State
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState(sortOptions[0].value);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const PRODUCTS_PER_PAGE = 6;
  const productsHeaderRef = useRef<HTMLHeadingElement>(null);

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
    setSelectedCategories([categoryId]);
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
      const catLabel = categoryTree.flatMap(c => [c, ...(c.children || [])]).find(c => c.id === selectedCategories[0])?.label || selectedCategories[0];
      parts.push(catLabel);
    } else if (selectedCategories.length > 1) {
      parts.push(`${selectedCategories.length} Categories`);
    }

    return parts.length > 0 ? parts.join(" / ") : "All Products";
  }, [selectedBrands, selectedCategories, categories]);

  // Updated categories list to remove redundancy and match the user's request
  const displayCategories = [
    { id: "automotive-tools", label: "Automotive Tools", count: 12 },
    { id: "cleaning-drainage", label: "Cleaning & Drainage", count: 8 },
    { id: "decorating-tiling", label: "Decorating & Tiling", count: 15 },
    { id: "detectors-testing", label: "Detectors & Testing", count: 6 },
    { id: "electrical", label: "Electrical", count: 24 },
    { id: "engineering-tools", label: "Engineering Tools", count: 10 },
    { id: "hand-tools", label: "Hand Tools", count: 32 },
    { id: "power-tool-accessories", label: "Accessories", count: 45 },
    { id: "power-tools", label: "Power Tools", count: 28 },
    { id: "tool-boxes-storage", label: "Storage", count: 14 },
    { id: "tool-kits", label: "Tool Kits", count: 9 },
    { id: "workwear", label: "Workwear", count: 18 },
  ];

  // Get featured products (just taking top rated from all brands for the showcase)
  const featuredProducts = useMemo(() => {
    const all = categories.flatMap(c => c.products);
    // Using price as a fallback sort since rating was removed, or just random/first few
    return all.slice(0, 5);
  }, [categories]);

  // Show loading state while fetching products
  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <HeroSection onViewAll={handleViewAllClick} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-r-transparent"></div>
              <p className="mt-4 text-slate-500">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <HeroSection onViewAll={handleViewAllClick} />
      
      {viewMode === 'landing' ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Shop by Categories */}
          <section className="py-10 text-center">
            <h3 className="text-[16px] font-bold uppercase tracking-widest text-brand-red">Shop by Categories</h3>
            <p className="mt-2 text-sm text-slate-500">Check out all the feature categories for simple product discovery.</p>
            
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {displayCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 py-8 transition-all hover:border-[#2E388C] hover:bg-white hover:shadow-md"
                >
                  <CategoryIcon id={cat.id} className="h-10 w-10 text-slate-400 transition-colors group-hover:text-brand-navy" />
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-slate-700 group-hover:text-brand-navy">{cat.label}</span>
                    {/* <span className="text-xs text-slate-400">({cat.count})</span> */}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-2 text-center">
            <h3 className="text-[16px] font-bold uppercase tracking-widest text-brand-red">Featured Products</h3>
            <p className="mt-2 text-sm text-slate-500">Check out our collection of the top Featured Products that encourage conversion.</p>
            
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.slug} product={product} categorySlug={categories.find(c => c.slug === product.brand)?.slug || 'stanley'} />
              ))}
            </div>
          </section>

          {/* Brand Banners */}
          <section className="grid gap-6 py-10 md:grid-cols-3">
            {categories.map((brand) => (
               <div key={brand.slug} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                 <Image 
                   src={brand.heroImage} 
                   alt={brand.name}
                   fill
                   className="object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 <div className="absolute bottom-0 left-0 w-full p-8 text-center">
                   <div className="mb-4 h-12 w-full relative flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-white">{brand.name}</h3>
                   </div>
                   <Link
                      href={`/products/${brand.slug}`}
                      className="inline-block rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-navy"
                   >
                     Shop Brand
                   </Link>
                 </div>
               </div>
            ))}
          </section>
        </div>
      ) : (
        // PLP Layout (Sidebar + Grid)
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-brand-red">Home</Link>
            <span>/</span>
            <button onClick={() => setViewMode('landing')} className="hover:text-brand-red">Products</button>
            <span>/</span>
            <span className="font-semibold text-brand-navy">{breadcrumbText}</span>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Sidebar - Filters Panel */}
            <aside className={`w-full lg:w-1/4 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-brand-navy">Filters</h3>
                  <button onClick={clearFilters} className="text-xs font-semibold text-brand-red hover:underline">
                    Clear All
                  </button>
                </div>

                {/* Categories Filter */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Categories</h4>
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
                              {group.label}
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
                                  <label htmlFor={`cat-${child.id}`} className="text-slate-600 cursor-pointer">{child.label}</label>
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
                  <h4 className="font-semibold text-slate-700">Brands</h4>
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
                        <label htmlFor={`brand-${b.slug}`} className="text-sm text-slate-600 cursor-pointer">{b.name}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Sort Filter (Moved here as requested "Price Sorter" in sidebar) */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <h4 className="font-semibold text-slate-700">Sort By</h4>
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
                        <label htmlFor={`sort-${option.value}`} className="text-sm text-slate-600 cursor-pointer">{option.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden w-full">
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Product Grid */}
            <main className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h2 ref={productsHeaderRef} className="text-2xl font-bold text-brand-navy">
                  Products <span className="text-sm font-normal text-slate-500 ml-2">({filteredProducts.length} items)</span>
                </h2>
                {/* Optional: Top bar sort could also be here if preferred over sidebar */}
              </div>

              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {paginatedProducts.map((product) => (
                      <FeaturedProductCard 
                        key={product.slug} 
                        product={product} 
                        categorySlug={categories.find(c => c.slug === product.brand)?.slug || 'stanley'} 
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                          productsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-navy hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page);
                              productsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-brand-navy text-white"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                          productsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-navy hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                  <p className="text-lg font-medium text-slate-500">No products found</p>
                  <button onClick={clearFilters} className="mt-2 text-sm font-semibold text-brand-red hover:underline">Clear all filters</button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductImageDisplay({ images, productName }: { images: any, productName: string }) {
  const [imageError, setImageError] = useState(false);
  
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
  
  // Reset error state when image changes
  useEffect(() => {
    setImageError(false);
  }, [firstImage]);
  
  if (!firstImage || imageError) {
    return (
      <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg bg-slate-100">
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          <span className="text-xs">No Image</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg bg-slate-100">
      <Image
        src={firstImage}
        alt={productName || 'Product image'}
        fill
        className="object-contain transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => {
          console.warn('Image failed to load:', firstImage);
          setImageError(true);
        }}
      />
    </div>
  );
}

function FeaturedProductCard({ product, categorySlug }: { product: any, categorySlug: string }) {
  return (
    <div className="group relative flex flex-col items-center rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-all hover:border-slate-200 hover:shadow-lg">
      {/* Sale Badge if needed */}
      {/* <span className="absolute left-4 top-4 rounded bg-brand-red px-2 py-1 text-[10px] font-bold text-white">SALE</span> */}
      
      <ProductImageDisplay 
        images={product.images} 
        productName={product.name}
      />
      
      <div className="mb-2 text-xs font-semibold uppercase text-slate-400">{product.brand}</div>
      <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-brand-navy group-hover:text-brand-red">
        {product.name}
      </h3>
      
      {product.price && Number(product.price) > 0 ? (
        <div className="mb-4 text-lg font-bold text-brand-red">
          ${Number(product.price).toFixed(2)}
        </div>
      ) : (
        <div className="mb-4">
          <ContactModal 
            productName={product.name}
            triggerText="Request Quote"
            triggerClassName="inline-block rounded-md bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-navy hover:bg-slate-200 transition-colors"
            initialQuestion={`I would like to request a quotation for ${product.name}.`}
          />
        </div>
      )}
      
      <Link 
        href={`/products/${categorySlug}/${product.slug}`}
        className="mt-auto w-full rounded bg-brand-navy py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-red"
      >
        View Product
      </Link>
    </div>
  );
}

function CategoryIcon({ id, className }: { id: string, className?: string }) {
  // Updated icons for the specific categories requested
  const icons: Record<string, React.ReactNode> = {
    "automotive-tools": <path d="M19 17h2l.64-2.54c.24-.959.24-1.96 0-2.92l-1.07-4.27A2.99 2.99 0 0 0 17.66 5H6.34a2.99 2.99 0 0 0-2.91 2.27L2.36 11.54a3.99 3.99 0 0 0 0 2.92L3 17h2m9-6h-6" />,
    "cleaning-drainage": <path d="M3 3v18h18V3H3zm9 4l2 2-2 2-2-2 2-2zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />, // Broom/Bucket concept
    "decorating-tiling": <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />, // Brush/Roller concept
    "detectors-testing": <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />, // Meter/Detector concept
    "electrical": <path d="M13 2L3 14h7v8l10-12h-7l7-8z" />,
    "engineering-tools": <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />, // Wrench/Caliper
    "hand-tools": <path d="M21 13v-2a2 2 0 0 0-2-2h-2V7a2 2 0 0 0-2-2h-2V3a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v2H1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1v2a2 2 0 0 0 2 2h2v2a2 2 0 0 0 2 2h2v-2h2v-2h2v-2h2v-2h2z" />, // Hammer/Pliers
    "power-tool-accessories": <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />, // Drill Bit/Blade
    "power-tools": <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.9 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
    "tool-boxes-storage": <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z" />,
    "tool-kits": <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" />,
    "workwear": <path d="M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm11 15H4v-2h16v2zm0-4H4V8h16v7z" />, // Vest/Jacket
  };

  const path = icons[id] || <path d="M3 3h18v18H3z" />;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  );
}

function HeroSection({ onViewAll }: { onViewAll: () => void }) {
  // Using the hero image from page.tsx for consistency as requested
  const heroImage = "/products.png";

  return (
    <section className="full-bleed relative overflow-hidden">
      <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
        <HeroHeader />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
          Products
        </p>
        <h1 className="max-w-7xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
          Shop industrial-grade Tools Curated for Utilities and Services
        </h1>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onViewAll}
            className="mt-2 bg-[#2E388C] px-9 py-3 text-[15px] font-semibold text-[#ffffff] transition hover:bg-[#252f6e]"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
