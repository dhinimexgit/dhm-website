import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit } from "firebase/firestore";
import type { CareerRole } from "@/data/site-content";

const docToCareer = (doc: any): CareerRole => {
  const data = doc.data();
  return {
    slug: data.slug || doc.id, // Use slug from data if available, otherwise use doc ID
    title: data.title || "",
    location: data.location || "",
    position: data.position || "",
    deadline: data.deadline || "",
    url: data.url || "",
    summary: data.summary || "",
    description: data.description || "",
    keyResponsibilities: data.keyResponsibilities || [],
    requirements: data.requirements || [],
    whatWeOffer: data.whatWeOffer || [],
    howToApply: data.howToApply || "",
  };
};

export async function getAllCareers(): Promise<CareerRole[]> {
  try {
    const careersRef = collection(db, "careers");
    const q = query(careersRef, orderBy("deadline", "asc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docToCareer);
  } catch (error) {
    console.error("Error fetching careers:", error);
    return [];
  }
}

export async function getCareer(slug: string): Promise<CareerRole | null> {
  try {
    // Decode URL-encoded slug and normalize
    const decodedSlug = decodeURIComponent(slug).trim();
    
    // First try: Get by document ID
    const careerRef = doc(db, "careers", decodedSlug);
    const careerSnap = await getDoc(careerRef);
    
    if (careerSnap.exists()) {
      return docToCareer(careerSnap);
    }
    
    // Second try: Query by slug field (case-insensitive)
    const careersRef = collection(db, "careers");
    const q = query(careersRef, where("slug", "==", decodedSlug), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return docToCareer(snapshot.docs[0]);
    }
    
    // Third try: Get all careers and find by slug (handles any case/special char issues)
    const allCareersSnapshot = await getDocs(careersRef);
    for (const docSnap of allCareersSnapshot.docs) {
      const data = docSnap.data();
      const docSlug = (data.slug || docSnap.id).toLowerCase().trim();
      if (docSlug === decodedSlug.toLowerCase().trim()) {
        return docToCareer(docSnap);
      }
    }
    
    console.warn(`Career not found with slug: ${decodedSlug}`);
    return null;
  } catch (error) {
    console.error("Error fetching career:", error, "slug:", slug);
    return null;
  }
}

