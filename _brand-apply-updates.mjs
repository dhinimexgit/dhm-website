import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { readFile } from "node:fs/promises";
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

const updates = JSON.parse(await readFile(path.resolve("_brand-heroimage-updates.json"), "utf8"));
for (const u of updates) {
  await updateDoc(doc(db, "brands", u.id), { heroImage: u.localPath });
  console.log(`updated  ${u.slug.padEnd(22)} heroImage -> ${u.localPath}`);
}
console.log(`\nDone. Updated ${updates.length} brand doc(s) in Firestore.`);
process.exit(0);
