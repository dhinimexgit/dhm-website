"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function InquiryBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "inquiries"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newCount = snapshot.docs.filter((doc) => {
        const data = doc.data();
        return data.status === "new" || !data.status;
      }).length;
      setCount(newCount);
    });
    return () => unsubscribe();
  }, []);

  if (count === 0) return null;

  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

