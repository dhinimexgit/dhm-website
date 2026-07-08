/**
 * One-time optimizer for ALREADY-UPLOADED images in Firestore.
 *
 * Usage:
 *   node --env-file=.env _media-optimize.mjs posts
 *   node --env-file=.env _media-optimize.mjs products
 *   node --env-file=.env _media-optimize.mjs brands
 *
 * For each doc it downloads remote images, compresses them to WebP, re-uploads
 * to Storage under `optimized/...`, and rewrites the Firestore field(s).
 * Originals in Storage are left untouched, and every changed field is saved to
 * `_<collection>-media-backup.json` first, so this is fully reversible.
 * Re-running is safe: images already under `optimized/` are skipped.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

// collection -> which fields hold images and whether each is a string or array
const CONFIG = {
  posts: { fields: { cover: "string", images: "array" } },
  products: { fields: { images: "array" } },
  brands: { fields: { heroImage: "string" } },
};

const col = process.argv[2];
if (!col || !CONFIG[col]) {
  console.error(`Pass a collection: ${Object.keys(CONFIG).join(" | ")}`);
  process.exit(1);
}

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

const MAX = 1600; // longest side
const isRemote = (u) => typeof u === "string" && u.trim().startsWith("http");
const alreadyOptimized = (u) => u.includes("/optimized%2F") || u.includes("/optimized/");

let totalIn = 0;
let totalOut = 0;
let changed = 0;

async function optimizeUrl(url, storagePath) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (media-opt/1.0)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const srcBuf = Buffer.from(await res.arrayBuffer());
  const outBuf = await sharp(srcBuf)
    .resize(MAX, MAX, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const snapshot = await uploadBytes(ref(storage, storagePath), outBuf, {
    contentType: "image/webp",
  });
  const newUrl = await getDownloadURL(snapshot.ref);
  totalIn += srcBuf.length;
  totalOut += outBuf.length;
  return { newUrl, inKB: srcBuf.length / 1024, outKB: outBuf.length / 1024 };
}

const snap = await getDocs(collection(db, col));
const backup = [];
console.log(`${col}: ${snap.size} docs\n`);

for (const d of snap.docs) {
  const data = d.data();
  const fieldUpdates = {};
  const originalSnapshot = {};

  for (const [field, kind] of Object.entries(CONFIG[col].fields)) {
    const value = data[field];

    if (kind === "string") {
      if (!isRemote(value) || alreadyOptimized(value)) continue;
      try {
        const { newUrl, inKB, outKB } = await optimizeUrl(
          value,
          `optimized/${col}/${d.id}/${field}.webp`
        );
        originalSnapshot[field] = value;
        fieldUpdates[field] = newUrl;
        console.log(`  ${d.id} ${field}: ${inKB.toFixed(0)}KB -> ${outKB.toFixed(0)}KB`);
      } catch (e) {
        console.error(`  ${d.id} ${field}: FAILED ${e.message}`);
      }
    } else if (kind === "array" && Array.isArray(value)) {
      const out = [];
      let touched = false;
      for (let i = 0; i < value.length; i++) {
        const u = value[i];
        if (!isRemote(u) || alreadyOptimized(u)) {
          out.push(u);
          continue;
        }
        try {
          const { newUrl, inKB, outKB } = await optimizeUrl(
            u,
            `optimized/${col}/${d.id}/${field}-${i}.webp`
          );
          out.push(newUrl);
          touched = true;
          console.log(`  ${d.id} ${field}[${i}]: ${inKB.toFixed(0)}KB -> ${outKB.toFixed(0)}KB`);
        } catch (e) {
          out.push(u);
          console.error(`  ${d.id} ${field}[${i}]: FAILED ${e.message}`);
        }
      }
      if (touched) {
        originalSnapshot[field] = value;
        fieldUpdates[field] = out;
      }
    }
  }

  if (Object.keys(fieldUpdates).length > 0) {
    backup.push({ id: d.id, ...originalSnapshot });
    await updateDoc(doc(db, col, d.id), fieldUpdates);
    changed++;
  }
}

if (backup.length) {
  await writeFile(
    path.resolve(`_${col}-media-backup.json`),
    JSON.stringify(backup, null, 2)
  );
}

console.log(
  `\nDone. ${changed} doc(s) updated. ` +
    `${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(1)}MB` +
    (backup.length ? `  (backup: _${col}-media-backup.json)` : "")
);
process.exit(0);
