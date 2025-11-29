"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import type { CareerRole } from "@/data/site-content";

type Props = {
  onEdit: (career: CareerRole & { id: string }) => void;
};

const ITEMS_PER_PAGE = 10;

export function CareerList({ onEdit }: Props) {
  const [careers, setCareers] = useState<(CareerRole & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "careers"), (snapshot) => {
      const items: (CareerRole & { id: string })[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CareerRole & { id: string });
      });
      setCareers(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "careers", id));
    } catch (err) {
      console.error("Error deleting career:", err);
      alert("Failed to delete career");
    }
  };

  // Filter careers
  const filteredCareers = careers.filter((career) => {
    const matchesSearch =
      !searchQuery ||
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCareers.length / ITEMS_PER_PAGE);
  const paginatedCareers = filteredCareers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-slate-500">Loading careers...</div>
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
            placeholder="Search careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>
        <div className="mt-4 text-sm text-slate-600">
          Showing {paginatedCareers.length} of {filteredCareers.length} careers
        </div>
      </div>

      {/* Careers Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 text-xs uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Position</th>
                <th className="px-6 py-4 font-semibold">Deadline</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedCareers.map((career) => (
                <tr key={career.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand-navy">{career.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{career.summary}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{career.location}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{career.position}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{career.deadline}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(career)}
                        className="rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-3 py-1.5 text-sm font-medium text-brand-navy transition hover:bg-brand-navy/10 hover:border-brand-navy/30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(career.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCareers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {filteredCareers.length === 0 && careers.length > 0
                      ? "No careers match your search. Try adjusting your search criteria."
                      : "No careers found. Click 'Add New Career' to get started."}
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

