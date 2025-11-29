"use client";

import { SeedButton } from "@/components/admin/seed-button";
import { SeedPostsButton } from "@/components/admin/seed-posts-button";
import { SeedCareersButton } from "@/components/admin/seed-careers-button";
import { SeedPostsFromWPButton } from "@/components/admin/seed-posts-from-wp-button";
import { SeedCareersFromWPButton } from "@/components/admin/seed-careers-from-wp-button";
import { productCategories } from "@/data/product-categories";
import { posts, careers } from "@/data/site-content";
import Link from "next/link";

export default function SeedPage() {
  // Calculate stats
  const totalCategories = productCategories.length;
  const totalProducts = productCategories.reduce(
    (acc, cat) => acc + cat.products.length,
    0
  );

  // Prepare a preview of the data (first product of first category)
  const previewData =
    productCategories.length > 0 && productCategories[0].products.length > 0
      ? productCategories[0].products[0]
      : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
            System
          </p>
          <h1 className="text-4xl font-semibold text-brand-navy">
            Seed Database
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Review static data and populate Firestore. This will overwrite
            existing entries with the same slugs.
          </p>
        </div>
        <div>
          <Link
            href="/dhm-myadmin"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Total Categories</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            {totalCategories}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            {totalProducts}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Total Posts</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            {posts.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Total Careers</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            {careers.length}
          </p>
        </div>
      </div>

      {/* Seed Actions */}
      <div className="space-y-8">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-brand-navy">Seed from Static Files</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-medium text-slate-500 mb-4">Seed Products</p>
              <SeedButton />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-medium text-slate-500 mb-4">Seed Blog Posts</p>
              <SeedPostsButton />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-medium text-slate-500 mb-4">Seed Careers</p>
              <SeedCareersButton />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-brand-navy">Seed from Live WordPress Site</h2>
          <p className="mb-4 text-sm text-slate-600">Fetch and import data directly from https://www.dhinimex.com</p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Seed Blog Posts from WordPress</p>
              <p className="text-xs text-slate-500 mb-4">Fetches from /wp-json/wp/v2/posts</p>
              <SeedPostsFromWPButton />
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Seed Careers from WordPress</p>
              <p className="text-xs text-slate-500 mb-4">Fetches from /careers/ pages</p>
              <SeedCareersFromWPButton />
            </div>
          </div>
        </div>
      </div>

      {/* Data Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-brand-navy">
          Data Preview (First Record)
        </h2>
        <div className="overflow-x-auto rounded-lg bg-slate-50 p-4 border border-slate-200">
          <pre className="text-xs text-slate-700">
            {JSON.stringify(previewData, null, 2)}
          </pre>
        </div>
        <p className="mt-4 text-sm text-slate-500">
            This data is sourced from <code className="bg-slate-100 px-1 py-0.5 rounded">src/data/product-categories.ts</code>. 
            To update the seed data, modify that file and then click the seed button above.
        </p>
      </div>
      
      {/* Category Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-brand-navy">
          Category Breakdown
        </h2>
        <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="px-6 py-3 font-semibold">Brand/Category</th>
                        <th className="px-6 py-3 font-semibold">Slug</th>
                        <th className="px-6 py-3 font-semibold">Product Count</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {productCategories.map((cat) => (
                        <tr key={cat.slug} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-brand-navy">{cat.name}</td>
                            <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                            <td className="px-6 py-4 text-slate-500">{cat.products.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

