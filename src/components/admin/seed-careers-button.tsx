"use client";

import { useState } from "react";
import { requireFirebaseDb } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getCareers } from "@/data/site-content";
import { useLanguage } from "@/lib/i18n";

export function SeedCareersButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { language } = useLanguage();

  const handleSeed = async () => {
    if (!confirm("This will populate the database with careers from your static files. Existing careers with the same slug will be updated. Continue?")) {
      return;
    }

    setLoading(true);
    setStatus("Starting seed...");

    try {
      let count = 0;
      const careers = getCareers(language);

      for (const career of careers) {
        setStatus(`Processing ${career.title}...`);

        const careerData = {
          slug: career.slug,
          title: career.title,
          location: career.location,
          position: career.position,
          deadline: career.deadline,
          url: career.url,
          summary: career.summary,
          description: career.description || "",
          keyResponsibilities: career.keyResponsibilities || [],
          requirements: career.requirements || [],
          whatWeOffer: career.whatWeOffer || [],
          howToApply: career.howToApply || "",
          updatedAt: Timestamp.now(),
          updatedBy: 'system',
        };

        // Use setDoc with merge to update or create
        await setDoc(doc(requireFirebaseDb(), "careers", career.slug), {
          ...careerData,
          createdAt: Timestamp.now(),
          createdBy: 'system',
        }, { merge: true });

        console.log(`Seeded ${career.title}`);
        count++;
      }

      setStatus(`Success! Processed ${count} careers.`);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Seeding error:", error);
      setStatus("Error during seeding. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {status && <span className="text-sm text-slate-600 animate-pulse">{status}</span>}
      <button
        onClick={handleSeed}
        disabled={loading}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {loading ? "Seeding..." : "Seed Careers"}
      </button>
    </div>
  );
}
