"use client";

/**
 * Firebase Storage helpers for DHM Projects attachments.
 *
 * Documents (BOQ / quotation / contract / other) are stored as-is — a PDF or
 * spreadsheet must not be re-encoded. Progress photos go through the shared
 * `compressImage` helper first, the same way every other admin upload does, so
 * a 6 MB phone photo does not land in Storage at full size.
 *
 * Files live under `dhm-projects/<projectId>/…` so a project's attachments can
 * be found (and cleaned up) as a unit.
 */
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { requireFirebaseStorage } from "@/lib/firebase";
import { compressImage } from "@/lib/image-compress";
import {
  updateProject,
  type DhmProject,
  type DocumentCategory,
  type ProjectDocument,
  type ProjectPhoto,
  type ProjectUpdate,
} from "@/lib/dhm-projects";

/** Storage object names must not contain path separators or control chars. */
function safeFileName(name: string): string {
  return name.replace(/[^\w.\-() ]+/g, "_").slice(0, 120) || "file";
}

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Upload one document and append it to the project.
 *
 * The Firestore write is a whole-array replace built from the caller's copy of
 * the project rather than arrayUnion, because arrayUnion compares objects by
 * deep equality and would silently drop a genuine duplicate re-upload.
 */
export async function uploadProjectDocument(
  project: DhmProject,
  file: File,
  category: DocumentCategory,
  actor: { name: string; username: string }
): Promise<ProjectDocument> {
  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new Error(`"${file.name}" is larger than ${formatFileSize(MAX_DOCUMENT_BYTES)}.`);
  }

  const id = randomId();
  const path = `dhm-projects/${project.id}/documents/${category}/${id}-${safeFileName(file.name)}`;
  const snapshot = await uploadBytes(ref(requireFirebaseStorage(), path), file, {
    contentType: file.type || "application/octet-stream",
  });
  const url = await getDownloadURL(snapshot.ref);

  const record: ProjectDocument = {
    id,
    name: file.name.slice(0, 160),
    url,
    path,
    size: file.size,
    contentType: file.type || "application/octet-stream",
    category,
    uploadedByName: actor.name,
    uploadedAt: new Date().toISOString(),
  };

  await updateProject(project.id, { documents: [...project.documents, record] }, actor);
  return record;
}

export async function removeProjectDocument(
  project: DhmProject,
  document: ProjectDocument,
  actor: { username: string }
): Promise<void> {
  // Drop the Firestore reference first: an orphaned Storage object is harmless,
  // a row pointing at a deleted file is a broken link in the UI.
  await updateProject(
    project.id,
    { documents: project.documents.filter((d) => d.id !== document.id) },
    actor
  );
  try {
    await deleteObject(ref(requireFirebaseStorage(), document.path));
  } catch (err) {
    console.error("removeProjectDocument: storage delete failed (row already removed)", err);
  }
}

/** Upload progress photos and post them as one dated update entry. */
export async function addProjectUpdate(
  project: DhmProject,
  input: { date: string; note: string; files: File[] },
  actor: { name: string; username: string }
): Promise<ProjectUpdate> {
  const photos: ProjectPhoto[] = [];

  for (const file of input.files) {
    const optimized = await compressImage(file);
    const id = randomId();
    const path = `dhm-projects/${project.id}/updates/${id}-${safeFileName(optimized.name)}`;
    const snapshot = await uploadBytes(ref(requireFirebaseStorage(), path), optimized, {
      contentType: optimized.type || "image/webp",
    });
    photos.push({ url: await getDownloadURL(snapshot.ref), path, name: file.name.slice(0, 160) });
  }

  const entry: ProjectUpdate = {
    id: randomId(),
    date: input.date,
    note: input.note.trim().slice(0, 2000),
    photos,
    authorName: actor.name,
    createdAt: new Date().toISOString(),
  };

  await updateProject(project.id, { updates: [...project.updates, entry] }, actor);
  return entry;
}

export async function removeProjectUpdate(
  project: DhmProject,
  update: ProjectUpdate,
  actor: { username: string }
): Promise<void> {
  await updateProject(
    project.id,
    { updates: project.updates.filter((u) => u.id !== update.id) },
    actor
  );
  for (const photo of update.photos) {
    try {
      await deleteObject(ref(requireFirebaseStorage(), photo.path));
    } catch (err) {
      console.error("removeProjectUpdate: storage delete failed", err);
    }
  }
}
