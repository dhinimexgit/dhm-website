"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductUploadForm } from "@/components/admin/product-upload-form";
import { ProductList } from "@/components/admin/product-list";
import { SeedButton } from "@/components/admin/seed-button";
import { InquiryList } from "@/components/admin/inquiry-list";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "inquiries">("products");
  const [view, setView] = useState<"list" | "form">("list");
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setView("form");
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setView("form");
  };

  const handleFormSuccess = () => {
    setView("list");
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setView("list");
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      {/* Main Tab Navigation */}
      <div className="flex gap-8 border-b border-slate-200">
        <button 
            onClick={() => { setActiveTab("products"); setView("list"); }}
            className={`pb-4 text-sm font-medium transition ${activeTab === "products" ? "border-b-2 border-brand-red text-brand-navy" : "text-slate-500 hover:text-slate-700"}`}
        >
            Products
        </button>
        <button 
            onClick={() => setActiveTab("inquiries")}
            className={`pb-4 text-sm font-medium transition ${activeTab === "inquiries" ? "border-b-2 border-brand-red text-brand-navy" : "text-slate-500 hover:text-slate-700"}`}
        >
            Inquiries
        </button>
      </div>

      {activeTab === "products" ? (
        <>
            <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
                    Database
                </p>
                <h1 className="text-4xl font-semibold text-brand-navy">
                    Manage Products
                </h1>
                <p className="max-w-2xl text-lg text-slate-600">
                    Manage your product catalog. Entries are instantly published to the live site.
                </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <Link 
                        href="/dhm-myadmin/seed"
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Prepare & Seed Data
                    </Link>
                    {view === "list" ? (
                        <button 
                            onClick={handleAddNew}
                            className="rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90"
                        >
                            + Add New Product
                        </button>
                    ) : (
                        <button 
                            onClick={handleCancel}
                            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            ← Back to List
                        </button>
                    )}
                </div>
            </div>

            {view === "list" ? (
                <div className="space-y-6">
                    <ProductList onEdit={handleEdit} />
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
                    <div className="space-y-6">
                        <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-xl font-semibold text-brand-navy">
                                {editingProduct ? `Edit: ${editingProduct.name}` : "New Product Entry"}
                            </h2>
                            <ProductUploadForm 
                                initialData={editingProduct} 
                                onSuccess={handleFormSuccess} 
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>

                    {/* Sidebar / Helper */}
                    {/* <div className="space-y-6">
                        <div className="rounded-[24px] bg-brand-navy p-6 text-white shadow-lg">
                            <h3 className="text-lg font-semibold">Quick Tips</h3>
                            <ul className="mt-4 space-y-3 text-sm text-white/80">
                                <li className="flex gap-3">
                                    <span className="text-brand-red">●</span>
                                    Images should be JPG/PNG, ideally 1200x800px.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-brand-red">●</span>
                                    Use the full model number (e.g. DCF887) for better search indexing.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-brand-red">●</span>
                                    Add at least 3 key specs for the comparison table.
                                </li>
                            </ul>
                        </div>
                    </div> */}
                </div>
            )}
        </>
      ) : (
          <>
            <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
                        Inbox
                    </p>
                    <h1 className="text-4xl font-semibold text-brand-navy">
                        Customer Inquiries
                    </h1>
                    <p className="max-w-2xl text-lg text-slate-600">
                        View and manage messages sent via the contact form.
                    </p>
                </div>
            </div>
            <InquiryList />
          </>
      )}
    </div>
  );
}
