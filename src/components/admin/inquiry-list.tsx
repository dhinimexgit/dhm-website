"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function InquiryList() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
  }

  if (loading) return <div className="p-4 text-center">Loading inquiries...</div>;

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Contact</th>
              <th className="px-6 py-4 font-semibold">Message</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No inquiries found.
                    </td>
                </tr>
            ) : (
                inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {inquiry.createdAt?.toDate().toLocaleDateString() || "N/A"}
                    <div className="text-xs text-slate-400">{inquiry.createdAt?.toDate().toLocaleTimeString() || ""}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-navy">{inquiry.fullName}</td>
                    <td className="px-6 py-4">
                        <div className="text-slate-900">{inquiry.email}</div>
                        <div className="text-slate-500">{inquiry.phone}</div>
                    </td>
                    <td className="max-w-xs px-6 py-4 text-slate-600">
                        <p className="line-clamp-2" title={inquiry.message}>{inquiry.message}</p>
                    </td>
                    <td className="px-6 py-4">
                        <select 
                            value={inquiry.status} 
                            onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                            className={`rounded-full px-2 py-1 text-xs font-medium border-none focus:ring-0 cursor-pointer ${
                                inquiry.status === "new" ? "bg-blue-100 text-blue-700" : 
                                inquiry.status === "read" ? "bg-gray-100 text-gray-700" : 
                                "bg-green-100 text-green-700"
                            }`}
                        >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="contacted">Contacted</option>
                        </select>
                    </td>
                    <td className="px-6 py-4">
                    <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

