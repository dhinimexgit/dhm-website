"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ProductUploadForm } from "@/components/admin/product-upload-form";
import { ProductList } from "@/components/admin/product-list";
import { PostList } from "@/components/admin/post-list";
import { PostForm } from "@/components/admin/post-form";
import { CareerList } from "@/components/admin/career-list";
import { CareerForm } from "@/components/admin/career-form";
import { SeedButton } from "@/components/admin/seed-button";
import { InquiryList } from "@/components/admin/inquiry-list";
import { InquiryBadge } from "@/components/admin/inquiry-badge";
import { QRCodeManager } from "@/components/admin/qr-code-manager";

type TabType = "products" | "posts" | "careers" | "inquiries" | "qrcode";
type UserRole = "admin" | "marketing";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [view, setView] = useState<"list" | "form">("list");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingCareer, setEditingCareer] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("admin");

  // Get user info from parent element's data attributes
  useEffect(() => {
    const mainElement = document.querySelector('main[data-user-email]');
    if (mainElement) {
      const email = mainElement.getAttribute('data-user-email') || '';
      const role = (mainElement.getAttribute('data-user-role') || 'admin') as UserRole;
      setUserEmail(email);
      setUserRole(role);
      
      // If marketing user, default to QR Code tab
      if (role === 'marketing') {
        setActiveTab('qrcode');
      }
    }
  }, []);

  // Check if a tab is accessible for the current user role
  const isTabAccessible = (tab: TabType): boolean => {
    if (userRole === 'admin') return true;
    // Marketing users can only access QR Code tab
    return tab === 'qrcode';
  };

  const handleTabClick = (tab: TabType) => {
    if (!isTabAccessible(tab)) return;
    setActiveTab(tab);
    if (tab !== 'qrcode' && tab !== 'inquiries') {
      setView("list");
    }
  };

  const handleProductEdit = (product: any) => {
    setEditingProduct(product);
    setView("form");
  };

  const handlePostEdit = (post: any) => {
    setEditingPost(post);
    setView("form");
  };

  const handleCareerEdit = (career: any) => {
    setEditingCareer(career);
    setView("form");
  };

  const handleAddNew = () => {
    if (activeTab === "products") {
      setEditingProduct(null);
    } else if (activeTab === "posts") {
      setEditingPost(null);
    } else if (activeTab === "careers") {
      setEditingCareer(null);
    }
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

  // Tab button component with role-based styling
  const TabButton = ({ 
    tab, 
    label, 
    badge 
  }: { 
    tab: TabType; 
    label: string; 
    badge?: React.ReactNode;
  }) => {
    const accessible = isTabAccessible(tab);
    const isActive = activeTab === tab;
    
    return (
      <button 
        onClick={() => handleTabClick(tab)}
        disabled={!accessible}
        className={`pb-4 text-sm font-medium transition relative ${
          isActive 
            ? "border-b-2 border-brand-red text-brand-navy" 
            : accessible 
              ? "text-slate-500 hover:text-slate-700" 
              : "text-slate-300 cursor-not-allowed"
        }`}
        title={!accessible ? "Access restricted for your role" : undefined}
      >
        <span className="flex items-center gap-2">
          {label}
          {badge}
          {!accessible && (
            <svg className="h-3.5 w-3.5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Main Tab Navigation */}
      <div className="flex gap-8 border-b border-slate-200 overflow-x-auto">
        <TabButton tab="products" label="Products" />
        <TabButton tab="posts" label="News Posts" />
        <TabButton tab="careers" label="Careers" />
        <TabButton tab="inquiries" label="Inquiries" badge={isTabAccessible('inquiries') ? <InquiryBadge /> : undefined} />
        <TabButton tab="qrcode" label="QR Code" />
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
                    <ProductList onEdit={handleProductEdit} />
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
                </div>
            )}
        </>
      ) : activeTab === "posts" ? (
        <>
            <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
                    Content
                </p>
                <h1 className="text-4xl font-semibold text-brand-navy">
                    Manage News Posts
                </h1>
                <p className="max-w-2xl text-lg text-slate-600">
                    Create and manage news posts. Entries are instantly published to the live site.
                </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    {view === "list" ? (
                        <button 
                            onClick={handleAddNew}
                            className="rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90"
                        >
                            + Add New Post
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
                    <PostList onEdit={handlePostEdit} />
                </div>
            ) : (
                <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-xl font-semibold text-brand-navy">
                        {editingPost ? `Edit: ${editingPost.title}` : "New News Post"}
                    </h2>
                    <PostForm 
                        initialData={editingPost} 
                        onSuccess={handleFormSuccess} 
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </>
      ) : activeTab === "careers" ? (
        <>
            <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
                    Content
                </p>
                <h1 className="text-4xl font-semibold text-brand-navy">
                    Manage Careers
                </h1>
                <p className="max-w-2xl text-lg text-slate-600">
                    Create and manage job openings. Entries are instantly published to the live site.
                </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    {view === "list" ? (
                        <button 
                            onClick={handleAddNew}
                            className="rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90"
                        >
                            + Add New Career
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
                    <CareerList onEdit={handleCareerEdit} />
                </div>
            ) : (
                <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-xl font-semibold text-brand-navy">
                        {editingCareer ? `Edit: ${editingCareer.title}` : "New Career"}
                    </h2>
                    <CareerForm 
                        initialData={editingCareer} 
                        onSuccess={handleFormSuccess} 
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </>
      ) : activeTab === "inquiries" ? (
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
      ) : activeTab === "qrcode" ? (
          <QRCodeManager userEmail={userEmail} />
      ) : null}
    </div>
  );
}
