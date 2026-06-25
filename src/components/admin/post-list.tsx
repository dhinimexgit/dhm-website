"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import type { Post } from "@/data/site-content";

type Props = {
  onEdit: (post: Post & { id: string }) => void;
};

const ITEMS_PER_PAGE = 10;

export function PostList({ onEdit }: Props) {
  const [posts, setPosts] = useState<(Post & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const items: (Post & { id: string })[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Post & { id: string });
      });
      // Sort by date descending
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      (post.titleKh?.toLowerCase().includes(q) ?? false) ||
      (post.excerptKh?.toLowerCase().includes(q) ?? false);
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-slate-500">Loading posts...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>
        <div className="mt-4 text-sm text-slate-600">
          Showing {paginatedPosts.length} of {filteredPosts.length} posts
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 text-xs uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Tag</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-slate-100">
                      {post.cover && (
                        <Image
                          src={post.cover}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand-navy">{post.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-brand-red/10 px-2.5 py-0.5 text-xs font-medium text-brand-red">
                      {post.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(post)}
                        className="rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-3 py-1.5 text-sm font-medium text-brand-navy transition hover:bg-brand-navy/10 hover:border-brand-navy/30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {filteredPosts.length === 0 && posts.length > 0
                      ? "No posts match your search. Try adjusting your search criteria."
                      : "No posts found. Click 'Add New Post' to get started."}
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
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

