import { getFirebaseDb } from "./firebase";
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from "firebase/firestore";
import { getPosts as getStaticPosts, type Post } from "@/data/site-content";

const docToPost = (doc: any, lang: "en" | "kh" = "en"): Post => {
  const data = doc.data();
  return {
    slug: data.slug || doc.id, // Use slug from data if available, otherwise use doc ID
    title: lang === "kh" && data.titleKh ? data.titleKh : data.title || "",
    titleKh: data.titleKh,
    date: data.date || "",
    tag: data.tag || "News",
    excerpt: lang === "kh" && data.excerptKh ? data.excerptKh : data.excerpt || "",
    excerptKh: data.excerptKh,
    cover: data.cover || "",
    content: lang === "kh" && data.contentKh ? data.contentKh : data.content || [],
    contentKh: data.contentKh,
    images: data.images || [],
  };
};

export async function getAllPosts(lang: "en" | "kh" = "en"): Promise<Post[]> {
  const db = getFirebaseDb();
  if (!db) {
    return getStaticPosts(lang);
  }

  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return getStaticPosts(lang);
    }

    return snapshot.docs.map((docSnap) => docToPost(docSnap, lang));
  } catch {
    return getStaticPosts(lang);
  }
}

export async function getPost(slug: string, lang: "en" | "kh" = "en"): Promise<Post | null> {
  const decodedSlug = decodeURIComponent(slug).trim();
  const db = getFirebaseDb();
  if (!db) {
    return getStaticPosts(lang).find((post) => post.slug === decodedSlug) ?? null;
  }

  try {
    const postRef = doc(db, "posts", decodedSlug);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      return docToPost(postSnap, lang);
    }

    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("slug", "==", decodedSlug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return docToPost(snapshot.docs[0], lang);
    }

    const allPostsSnapshot = await getDocs(postsRef);
    for (const docSnap of allPostsSnapshot.docs) {
      const data = docSnap.data();
      const docSlug = (data.slug || docSnap.id).toLowerCase().trim();
      if (docSlug === decodedSlug.toLowerCase().trim()) {
        return docToPost(docSnap, lang);
      }
    }

    return getStaticPosts(lang).find((post) => post.slug === decodedSlug) ?? null;
  } catch {
    return getStaticPosts(lang).find((post) => post.slug === decodedSlug) ?? null;
  }
}

export async function getLatestPosts(count: number = 3, lang: "en" | "kh" = "en"): Promise<Post[]> {
  const db = getFirebaseDb();
  if (!db) {
    return getStaticPosts(lang).slice(0, count);
  }

  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("date", "desc"), limit(count));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return getStaticPosts(lang).slice(0, count);
    }

    return snapshot.docs.map((docSnap) => docToPost(docSnap, lang));
  } catch {
    return getStaticPosts(lang).slice(0, count);
  }
}

