"use client";

import { useState, useEffect } from "react";
import { ProductUploadForm } from "@/components/admin/product-upload-form";
import { ProductList } from "@/components/admin/product-list";
import { BrandManager } from "@/components/admin/brand-manager";
import { CategoryManager } from "@/components/admin/category-manager";
import { PostList } from "@/components/admin/post-list";
import { PostForm } from "@/components/admin/post-form";
import { CareerList } from "@/components/admin/career-list";
import { CareerForm } from "@/components/admin/career-form";
import { InquiryList } from "@/components/admin/inquiry-list";
import { InquiryBadge } from "@/components/admin/inquiry-badge";
import { QRCodeManager } from "@/components/admin/qr-code-manager";
import { ItemCodeManager } from "@/components/admin/item-code-manager";
import { useLanguage } from "@/lib/i18n";
import type { CareerRole, Post } from "@/data/site-content";

type TabType = "products" | "itemcodes" | "brands" | "categories" | "posts" | "careers" | "inquiries" | "qrcode";
type UserRole = "admin" | "marketing";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [view, setView] = useState<"list" | "form">("list");
  const [editingProduct, setEditingProduct] = useState<unknown>(null);
  const [editingPost, setEditingPost] = useState<(Post & { id?: string }) | null>(null);
  const [editingCareer, setEditingCareer] = useState<(CareerRole & { id?: string }) | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const mainElement = document.querySelector("main[data-user-email]");
    if (mainElement) {
      const email = mainElement.getAttribute("data-user-email") || "";
      const role = (mainElement.getAttribute("data-user-role") || "admin") as UserRole;
      const permissionString = mainElement.getAttribute("data-user-permissions") || "";
      const parsed = permissionString.split(",").map((p) => p.trim()).filter(Boolean);
      setUserEmail(email);
      setUserRole(role);
      setPermissions(parsed);
      if (role === "marketing") setActiveTab("qrcode");
    }
  }, []);

  const isTabAccessible = (tab: TabType): boolean => {
    const map: Record<TabType, string> = {
      products: "admin.products",
      itemcodes: "admin.products",
      brands: "admin.products",
      categories: "admin.products",
      posts: "admin.posts",
      careers: "admin.careers",
      inquiries: "admin.inquiries",
      qrcode: "admin.qrcode",
    };
    if (userEmail.toLowerCase() === "admin@dhinimex.com") return true;
    if (userRole === "admin" && permissions.length === 0) return true;
    if (userRole === "marketing" && permissions.length === 0) return tab === "qrcode";
    return permissions.includes(map[tab]);
  };

  const handleTabClick = (tab: TabType) => {
    if (!isTabAccessible(tab)) return;
    setActiveTab(tab);
    if (tab !== "qrcode" && tab !== "inquiries") setView("list");
  };

  const handleAddNew = () => {
    if (activeTab === "products") setEditingProduct(null);
    else if (activeTab === "posts") setEditingPost(null);
    else if (activeTab === "careers") setEditingCareer(null);
    setView("form");
  };

  const handleFormSuccess = () => {
    setView("list");
    setEditingProduct(null);
    setEditingPost(null);
    setEditingCareer(null);
  };

  const handleCancel = () => {
    setView("list");
    setEditingProduct(null);
    setEditingPost(null);
    setEditingCareer(null);
  };

  const TabButton = ({ tab, label, badge }: { tab: TabType; label: string; badge?: React.ReactNode }) => {
    const accessible = isTabAccessible(tab);
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => handleTabClick(tab)}
        disabled={!accessible}
        className={`relative pb-4 text-sm font-medium transition ${
          isActive
            ? "border-b-2 border-brand-red text-brand-navy"
           : accessible
              ? "text-slate-500 hover:text-slate-700"
             : "cursor-not-allowed text-slate-300"
        }`}
        title={!accessible ? "Access restricted": undefined}
      >
        <span className="flex items-center gap-2">
          {label}
          {badge}
          {!accessible ? (
            <svg className="h-3.5 w-3.5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          ): null}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      <div className="-mx-1 flex gap-4 overflow-x-auto border-b border-slate-200 px-1 pb-px [-webkit-overflow-scrolling:touch] sm:gap-8">
        <TabButton tab="products" label={t.admin.dashboard.products} />
        <TabButton tab="itemcodes" label="Item Code" />
        <TabButton tab="brands" label="Brands" />
        <TabButton tab="categories" label="Categories" />
        <TabButton tab="posts" label={t.admin.dashboard.posts} />
        <TabButton tab="careers" label={t.admin.dashboard.careers} />
        <TabButton tab="inquiries" label={t.admin.dashboard.inquiries} badge={isTabAccessible("inquiries") ? <InquiryBadge />: undefined} />
        <TabButton tab="qrcode" label={t.admin.dashboard.qrcode} />
      </div>

      {activeTab === "itemcodes" ? (
        <ItemCodeManager />
      ): activeTab === "products" ? (
        <>
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">{t.admin.dashboard.database}</p>
              <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">{t.admin.dashboard.manageProducts}</h1>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">{t.admin.dashboard.manageProductsDesc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {/* Seed / DB prep tooling hidden — was: Link href="/dhm-myadmin/seed" */}
              {view === "list" ? (
                <button onClick={handleAddNew} className="rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90">
                  {t.admin.dashboard.addNewProduct}
                </button>
              ): (
                <button onClick={handleCancel} className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                  {t.admin.dashboard.backToList}
                </button>
              )}
            </div>
          </div>
          {view === "list" ? (
            <ProductList onEdit={(p) => { setEditingProduct(p); setView("form"); }} />
          ): (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-brand-navy">
                {editingProduct ? `Edit: ${(editingProduct as { name: string }).name}`: "New Product Entry"}
              </h2>
              <ProductUploadForm initialData={editingProduct} onSuccess={handleFormSuccess} onCancel={handleCancel} />
            </div>
          )}
        </>
      ): activeTab === "brands" ? (
        <>
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:pb-8">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">{t.admin.dashboard.database}</p>
              <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">Manage Brands</h1>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">Add or edit the brands that appear in the product form and on the public Brands listing.</p>
            </div>
          </div>
          <BrandManager />
        </>
      ): activeTab === "categories" ? (
        <>
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:pb-8">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">{t.admin.dashboard.database}</p>
              <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">Manage Categories</h1>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">Build the category tree used as checkboxes on products and as filters on the public site.</p>
            </div>
          </div>
          <CategoryManager />
        </>
      ): activeTab === "posts" ? (
        <>
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">{t.admin.dashboard.content}</p>
              <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">{t.admin.dashboard.managePosts}</h1>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">{t.admin.dashboard.managePostsDesc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {view === "list" ? (
                <button onClick={handleAddNew} className="rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90">
                  {t.admin.dashboard.addNewPost}
                </button>
              ): (
                <button onClick={handleCancel} className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                  {t.admin.dashboard.backToList}
                </button>
              )}
            </div>
          </div>
          {view === "list" ? (
            <PostList onEdit={(p) => { setEditingPost(p); setView("form"); }} />
          ): (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-brand-navy">
                {editingPost ? `Edit: ${editingPost.title}`: "New News Post"}
              </h2>
              <PostForm initialData={editingPost ?? undefined} onSuccess={handleFormSuccess} onCancel={handleCancel} />
            </div>
          )}
        </>
      ): activeTab === "careers" ? (
        <>
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">{t.admin.dashboard.content}</p>
              <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">{t.admin.dashboard.manageCareers}</h1>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">{t.admin.dashboard.manageCareersDesc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {view === "list" ? (
                <button onClick={handleAddNew} className="rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90">
                  {t.admin.dashboard.addNewCareer}
                </button>
              ): (
                <button onClick={handleCancel} className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                  {t.admin.dashboard.backToList}
                </button>
              )}
            </div>
          </div>
          {view === "list" ? (
            <CareerList onEdit={(c) => { setEditingCareer(c); setView("form"); }} />
          ): (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-brand-navy">
                {editingCareer ? `Edit: ${editingCareer.title}`: "New Career"}
              </h2>
              <CareerForm initialData={editingCareer ?? undefined} onSuccess={handleFormSuccess} onCancel={handleCancel} />
            </div>
          )}
        </>
      ): activeTab === "inquiries" ? (
        <>
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">{t.admin.dashboard.inbox}</p>
              <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">{t.admin.dashboard.customerInquiries}</h1>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">{t.admin.dashboard.customerInquiriesDesc}</p>
            </div>
          </div>
          <InquiryList />
        </>
      ): activeTab === "qrcode" ? (
        <QRCodeManager userEmail={userEmail} />
      ): null}
    </div>
  );
}
