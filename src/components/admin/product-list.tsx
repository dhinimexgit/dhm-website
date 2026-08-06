"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import {
  subscribeBrands,
  subscribeCategories,
  buildCategoryTree,
  type Brand,
  type CategoryNode,
} from "@/lib/taxonomy";

type Product = {
  id: string;
  name: string;
  brand: string;
  model: string;
  images: string[];
  categories?: string[];
  subCategories?: string[];
  hidden?: boolean;
  [key: string]: any;
};

type Props = {
  onEdit: (product: Product) => void;
};

const ITEMS_PER_PAGE = 10;

function productCategoryIds(product: Product): string[] {
  const cats = Array.isArray(product.categories) ? product.categories : [];
  const subs = Array.isArray(product.subCategories) ? product.subCategories : [];
  return [...cats, ...subs];
}

export function ProductList({ onEdit }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden">("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      setProducts(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubBrands = subscribeBrands(setBrandsList);
    const unsubCats = subscribeCategories((cats) => setCategoryTree(buildCategoryTree(cats)));
    return () => {
      unsubBrands();
      unsubCats();
    };
  }, []);

  const brandOptions = useMemo(() => {
    const options = brandsList.map((b) => ({ slug: b.slug, name: b.name }));
    const known = new Set(options.map((b) => b.slug));

    for (const product of products) {
      if (product.brand && !known.has(product.brand)) {
        known.add(product.brand);
        options.push({
          slug: product.brand,
          name: product.brand.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        });
      }
    }

    return options.sort((a, b) => a.name.localeCompare(b.name));
  }, [brandsList, products]);

  const brandNameBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of brandOptions) map.set(b.slug, b.name);
    return map;
  }, [brandOptions]);

  const categoryLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const parent of categoryTree) {
      map.set(parent.id, parent.label);
      for (const child of parent.children) map.set(child.id, child.label);
    }
    return map;
  }, [categoryTree]);

  const subCategoryOptions = useMemo(() => {
    if (selectedParentCategory === "all") return [];
    const parent = categoryTree.find((c) => c.id === selectedParentCategory);
    return parent?.children ?? [];
  }, [categoryTree, selectedParentCategory]);

  const toggleVisibility = async (id: string, currentHidden: boolean) => {
    try {
      await updateDoc(doc(db, "products", id), { hidden: !currentHidden });
    } catch (err) {
      console.error("Error toggling visibility:", err);
      alert("Failed to update visibility");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryIds = productCategoryIds(product);

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (product.name ?? "").toLowerCase().includes(q) ||
        (product.model ?? "").toLowerCase().includes(q) ||
        (product.brand ?? "").toLowerCase().includes(q) ||
        categoryIds.some((id) =>
          (categoryLabelById.get(id) ?? id ?? "").toLowerCase().includes(q)
        );

      const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;

      let matchesCategory = true;
      if (selectedSubCategory !== "all") {
        matchesCategory = categoryIds.includes(selectedSubCategory);
      } else if (selectedParentCategory !== "all") {
        const parent = categoryTree.find((c) => c.id === selectedParentCategory);
        const childIds = parent?.children.map((c) => c.id) ?? [];
        matchesCategory =
          categoryIds.includes(selectedParentCategory) ||
          childIds.some((id) => categoryIds.includes(id));
      }

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "visible" && !product.hidden) ||
        (statusFilter === "hidden" && product.hidden);

      return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
    });
  }, [
    products,
    searchQuery,
    selectedBrand,
    selectedParentCategory,
    selectedSubCategory,
    statusFilter,
    categoryTree,
    categoryLabelById,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrand, selectedParentCategory, selectedSubCategory, statusFilter]);

  useEffect(() => {
    setSelectedSubCategory("all");
  }, [selectedParentCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            >
              <option value="all">All Brands</option>
              {brandOptions.map((brand) => (
                <option key={brand.slug} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Parent Category Filter */}
          <div>
            <select
              value={selectedParentCategory}
              onChange={(e) => setSelectedParentCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            >
              <option value="all">All Categories</option>
              {categoryTree.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Category Filter */}
          <div>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={selectedParentCategory === "all" || subCategoryOptions.length === 0}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="all">All Sub-Categories</option>
              {subCategoryOptions.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "visible" | "hidden")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            >
              <option value="all">All Status</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <span>
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </span>
          {(selectedBrand !== "all" ||
            selectedParentCategory !== "all" ||
            selectedSubCategory !== "all" ||
            searchQuery ||
            statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedBrand("all");
                setSelectedParentCategory("all");
                setSelectedSubCategory("all");
                setStatusFilter("all");
              }}
              className="font-semibold text-brand-red hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 text-xs uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Brand</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedProducts.map((product) => {
                const categoryIds = productCategoryIds(product);
                const categoryLabels = categoryIds
                  .map((id) => categoryLabelById.get(id))
                  .filter(Boolean) as string[];

                return (
                  <tr key={product.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                        {product.images?.[0] && (
                          <Image src={product.images[0]} alt="" fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-brand-navy">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.model}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {brandNameBySlug.get(product.brand) ?? product.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {categoryLabels.length > 0 ? (
                        <div className="flex max-w-xs flex-wrap gap-1">
                          {categoryLabels.map((label) => (
                            <span
                              key={label}
                              className="inline-flex items-center rounded-full bg-brand-navy/5 px-2 py-0.5 text-xs font-medium text-brand-navy"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVisibility(product.id, !!product.hidden)}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                          product.hidden
                            ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {product.hidden ? "Hidden" : "Visible"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-3 py-1.5 text-sm font-medium text-brand-navy transition hover:border-brand-navy/30 hover:bg-brand-navy/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {filteredProducts.length === 0 && products.length > 0
                      ? "No products match your filters. Try adjusting your search criteria."
                      : "No products found. Click 'Add New Product' to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-brand-navy text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
