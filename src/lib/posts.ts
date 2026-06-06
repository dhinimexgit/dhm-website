import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from "firebase/firestore";
import type { Post } from "@/data/site-content";

const docToPost = (doc: any, lang: 'en' | 'kh' = 'en'): Post => {
  const data = doc.data();
  return {
    slug: data.slug || doc.id, // Use slug from data if available, otherwise use doc ID
    title: lang === 'kh' && data.titleKh ? data.titleKh : data.title || "",
    date: data.date || "",
    tag: data.tag || "News",
    excerpt: lang === 'kh' && data.excerptKh ? data.excerptKh : data.excerpt || "",
    cover: data.cover || "",
    content: lang === 'kh' && data.contentKh ? data.contentKh : data.content || [],
  };
};

export async function getAllPosts(lang: 'en' | 'kh' = 'en'): Promise<Post[]> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => docToPost(doc, lang));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPost(slug: string, lang: 'en' | 'kh' = 'en'): Promise<Post | null> {
  try {
    // Decode URL-encoded slug and normalize
    const decodedSlug = decodeURIComponent(slug).trim();
    
    // First try: Get by document ID
    const postRef = doc(db, "posts", decodedSlug);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      return docToPost(postSnap, lang);
    }
    
    // Second try: Query by slug field (case-insensitive)
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("slug", "==", decodedSlug), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return docToPost(snapshot.docs[0], lang);
    }
    
    // Third try: Get all posts and find by slug (handles any case/special char issues)
    const allPostsSnapshot = await getDocs(postsRef);
    for (const docSnap of allPostsSnapshot.docs) {
      const data = docSnap.data();
      const docSlug = (data.slug || docSnap.id).toLowerCase().trim();
      if (docSlug === decodedSlug.toLowerCase().trim()) {
        return docToPost(docSnap, lang);
      }
    }
    
    console.warn(`Post not found with slug: ${decodedSlug}`);
    return null;
  } catch (error) {
    console.error("Error fetching post:", error, "slug:", slug);
    return null;
  }
}

export async function getLatestPosts(count: number = 3, lang: 'en' | 'kh' = 'en'): Promise<Post[]> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("date", "desc"), limit(count));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => docToPost(doc, lang));
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }
}

