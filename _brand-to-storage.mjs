/**
 * Move the already-compressed local brand hero images (public/brands/hero-*.webp)
 * into Firebase Storage and repoint each brand doc's heroImage at the Storage URL.
 *
 * Why: the products page runs on the deployed site, and local /public files only
 * exist after a deploy. Hosting the compressed images in Storage (like news &
 * products) makes them work immediately, with no deploy dependency.
 *
 * Usage:  node --env-file=.env _brand-to-storage.mjs
 *
 * Safe + reversible: current heroImage values are saved to
 * _brand-storage-backup.json before any change.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);
const storage = getStorage(app);

const updates = JSON.parse(await readFile(path.resolve("_brand-heroimage-updates.json"), "utf8"));
const backup = [];

for (const u of updates) {
  try {
    const localFile = path.resolve("public", u.localPath.replace(/^\//, "")); // public/brands/hero-<slug>.webp
    const buf = await readFile(localFile);
    const snapshot = await uploadBytes(
      ref(storage, `brands/${u.slug}/hero-optimized.webp`),
      buf,
      { contentType: "image/webp" }
    );
    const url = await getDownloadURL(snapshot.ref);
    backup.push({ id: u.id, slug: u.slug, previousHeroImage: u.localPath });
    await updateDoc(doc(db, "brands", u.id), { heroImage: url });
    console.log(`ok   ${u.slug.padEnd(22)} -> Storage (${(buf.length / 1024).toFixed(0)}KB)`);
  } catch (e) {
    console.error(`FAIL ${u.slug.padEnd(22)} ${e.message}`);
  }
}

await writeFile(path.resolve("_brand-storage-backup.json"), JSON.stringify(backup, null, 2));
console.log(`\nDone. ${backup.length} brand(s) now served from Storage. backup: _brand-storage-backup.json`);
process.exit(0);
