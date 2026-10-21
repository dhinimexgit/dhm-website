import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

const firebaseConfig = {
  apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: env("NEXT_PUBLIC_FIREBASE_APP_ID"),
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  // The browser SDK on the Next.js server talks to Firestore over gRPC/WebChannel.
  // An empty or placeholder projectId produces INVALID_ARGUMENT ("Invalid
  // resource field value"). Even with a real project, Node often needs long
  // polling or the client never reaches the backend.
  if (typeof window === "undefined") {
    try {
      db = initializeFirestore(app, { experimentalForceLongPolling: true });
    } catch {
      db = getFirestore(app);
    }
  } else {
    db = getFirestore(app);
  }

  storage = getStorage(app);
}

export function getFirebaseDb(): Firestore | null {
  return db ?? null;
}

export function requireFirebaseDb(): Firestore {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
  return db;
}

export function requireFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }
  return storage;
}

export { app, db, storage };
