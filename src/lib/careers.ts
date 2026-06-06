import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit } from "firebase/firestore";
import type { CareerRole } from "@/data/site-content";

const docToCareer = (doc: any, lang: 'en' | 'kh' = 'en'): CareerRole => {
  const data = doc.data();
  return {
    slug: data.slug || doc.id, // Use slug from data if available, otherwise use doc ID
    title: lang === 'kh' && data.titleKh ? data.titleKh : data.title || "",
    location: lang === 'kh' && data.locationKh ? data.locationKh : data.location || "",
    position: lang === 'kh' && data.positionKh ? data.positionKh : data.position || "",
    deadline: lang === 'kh' && data.deadlineKh ? data.deadlineKh : data.deadline || "",
    url: data.url || "",
    summary: lang === 'kh' && data.summaryKh ? data.summaryKh : data.summary || "",
    description: lang === 'kh' && data.descriptionKh ? data.descriptionKh : data.description || "",
    keyResponsibilities: lang === 'kh' && data.keyResponsibilitiesKh ? data.keyResponsibilitiesKh : data.keyResponsibilities || [],
    requirements: lang === 'kh' && data.requirementsKh ? data.requirementsKh : data.requirements || [],
    whatWeOffer: lang === 'kh' && data.whatWeOfferKh ? data.whatWeOfferKh : data.whatWeOffer || [],
    howToApply: lang === 'kh' && data.howToApplyKh ? data.howToApplyKh : data.howToApply || "",
  };
};

export async function getAllCareers(lang: 'en' | 'kh' = 'en'): Promise<CareerRole[]> {
  try {
    const careersRef = collection(db, "careers");
    const q = query(careersRef, orderBy("deadline", "asc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => docToCareer(doc, lang));
  } catch (error) {
    console.error("Error fetching careers:", error);
    return [];
  }
}

export async function getCareer(slug: string, lang: 'en' | 'kh' = 'en'): Promise<CareerRole | null> {
  try {
    // Decode URL-encoded slug and normalize
    const decodedSlug = decodeURIComponent(slug).trim();
    
    // First try: Get by document ID
    const careerRef = doc(db, "careers", decodedSlug);
    const careerSnap = await getDoc(careerRef);
    
    if (careerSnap.exists()) {
      return docToCareer(careerSnap, lang);
    }
    
    // Second try: Query by slug field (case-insensitive)
    const careersRef = collection(db, "careers");
    const q = query(careersRef, where("slug", "==", decodedSlug), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return docToCareer(snapshot.docs[0], lang);
    }
    
    // Third try: Get all careers and find by slug (handles any case/special char issues)
    const allCareersSnapshot = await getDocs(careersRef);
    for (const docSnap of allCareersSnapshot.docs) {
      const data = docSnap.data();
      const docSlug = (data.slug || docSnap.id).toLowerCase().trim();
      if (docSlug === decodedSlug.toLowerCase().trim()) {
        return docToCareer(docSnap, lang);
      }
    }
    
    console.warn(`Career not found with slug: ${decodedSlug}`);
    return null;
  } catch (error) {
    console.error("Error fetching career:", error, "slug:", slug);
    return null;
  }
}

