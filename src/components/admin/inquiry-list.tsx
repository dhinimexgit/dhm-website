"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper to format phone number with space after +855
function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  // If it starts with +855, add space after it
  if (phone.startsWith("+855")) {
    return `+855 ${phone.substring(4)}`;
  }
  return phone;
}

export function InquiryList() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "contacted">("all");

  useEffect(() => {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    await deleteDoc(doc(db, "inquiries", id));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, "inquiries", id), { status: newStatus });
    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (statusFilter === "all") return true;
    return inquiry.status === statusFilter;
  });

  const newCount = inquiries.filter((i) => i.status === "new" || !i.status).length;

  if (loading) return <div className="p-4 text-center">Loading inquiries...</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "new" | "read" | "contacted")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        >
          <option value="all">All Inquiries</option>
          <option value="new">New Only</option>
          <option value="read">Read</option>
          <option value="contacted">Contacted</option>
        </select>
        <div className="text-sm text-slate-600">
          Showing {filteredInquiries.length} of {inquiries.length} inquiries
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        {/* Inquiry List */}
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-500">No inquiries found.</p>
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => {
                  // Toggle: if already selected, deselect; otherwise select
                  if (selectedInquiry?.id === inquiry.id) {
                    setSelectedInquiry(null);
                  } else {
                    setSelectedInquiry(inquiry);
                  }
                }}
                className={`cursor-pointer rounded-xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                  selectedInquiry?.id === inquiry.id
                    ? "border-brand-navy bg-brand-navy/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-brand-navy">
                        {inquiry.fullName || inquiry.name || "Anonymous"}
                      </h3>
                      {/* {(inquiry.status === "new" || !inquiry.status) && (
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          New
                        </span>
                      )} */}
                      <select
                        onClick={(e) => e.stopPropagation()}
                        value={inquiry.status || "new"}
                        onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium border-none focus:ring-2 focus:ring-brand-navy/20 cursor-pointer ${
                          inquiry.status === "new" || !inquiry.status
                            ? "bg-blue-100 text-blue-700"
                            : inquiry.status === "read"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="contacted">Contacted</option>
                      </select>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      {inquiry.phone && (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${inquiry.phone}`} className="hover:text-brand-navy" onClick={(e) => e.stopPropagation()}>
                            {formatPhoneNumber(inquiry.phone)}
                          </a>
                        </div>
                      )}

                      {inquiry.email && (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${inquiry.email}`} className="hover:text-brand-navy" onClick={(e) => e.stopPropagation()}>
                            {inquiry.email}
                          </a>
                        </div>
                      )}

                      {inquiry.productName && (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="font-medium text-brand-navy">{inquiry.productName}</span>
                        </div>
                      )}
                    </div>

                    {inquiry.message && (
                      <p className="line-clamp-2 text-sm text-slate-600">{inquiry.message}</p>
                    )}

                    <div className="text-xs text-slate-400">
                      {inquiry.createdAt?.toDate
                        ? inquiry.createdAt.toDate().toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Date unknown"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <svg 
                      className={`h-5 w-5 text-slate-400 transition-transform ${selectedInquiry?.id === inquiry.id ? "rotate-180" : ""}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(inquiry.id);
                      }}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300"
                    >
                      Delete
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Inquiry Detail Panel */}
        {selectedInquiry ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sticky top-4 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-brand-navy">Inquiry Details</h2>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Customer Name</label>
                  <p className="mt-1 text-base font-medium text-brand-navy">
                    {selectedInquiry.fullName || selectedInquiry.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone Number</label>
                  <p className="mt-1 text-base text-slate-700">
                    {selectedInquiry.phone ? (
                      <a href={`tel:${selectedInquiry.phone}`} className="text-brand-navy hover:text-brand-red">
                        {formatPhoneNumber(selectedInquiry.phone)}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</label>
                  <p className="mt-1 text-base text-slate-700">
                    {selectedInquiry.email ? (
                      <a href={`mailto:${selectedInquiry.email}`} className="text-brand-navy hover:text-brand-red">
                        {selectedInquiry.email}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                {selectedInquiry.productName && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Product</label>
                    <p className="mt-1 text-base font-medium text-brand-navy">{selectedInquiry.productName}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</label>
                  <div className="mt-2">
                    <select
                      value={selectedInquiry.status || "new"}
                      onChange={(e) => handleStatusUpdate(selectedInquiry.id, e.target.value)}
                      className={`w-full rounded-lg px-4 py-2 text-sm font-medium border-none focus:ring-2 focus:ring-brand-navy/20 ${
                        selectedInquiry.status === "new" || !selectedInquiry.status
                          ? "bg-blue-100 text-blue-700"
                          : selectedInquiry.status === "read"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="contacted">Contacted</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Message</label>
                  <div className="mt-2 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                      {selectedInquiry.message || "No message provided."}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Submitted</label>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedInquiry.createdAt?.toDate
                      ? selectedInquiry.createdAt.toDate().toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Date unknown"}
                  </p>
                </div>
              </div>

              {selectedInquiry.email && (
                <div className="pt-4 border-t border-slate-200">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="block w-full rounded-lg border border-brand-navy bg-white px-4 py-2.5 text-center text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/5"
                  >
                    Send Email
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          // <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          //   <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          //   </svg>
          //   <p className="mt-4 text-sm font-medium text-slate-600">Select an inquiry to view details</p>
          // </div>
          <div></div>
        )}
      </div>
    </div>
  );
}
