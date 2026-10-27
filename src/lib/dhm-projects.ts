/**
 * DHM Projects — sales-to-technical project tickets.
 *
 * Replaces the paper "Product Problem from Sale to Technical" handoff and the
 * Technical Dept workbook's "Projects" sheet. Sales raise a ticket, the group
 * chat is notified, and technical drive it through the lifecycle in the portal.
 *
 * Milestone dates are plain `YYYY-MM-DD` strings (what <input type="date">
 * produces) rather than Firestore Timestamps: they are calendar facts entered
 * by hand, never instants, and keeping them as strings avoids timezone drift
 * when the office is UTC+7 and the serverless functions are not.
 */
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import { requireFirebaseDb } from "@/lib/firebase";

export const DHM_PROJECTS_COLLECTION = "dhmProjects";
export const PROJECT_TYPES_COLLECTION = "projectTypes";

export const PROJECT_STATUSES = ["Ongoing", "Completed", "Cancelled"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/**
 * The 13 distinct types found in the Technical Dept workbook's Projects sheet.
 *
 * These are the seed values and the fallback the form uses until the
 * `projectTypes` collection has been populated — the same
 * static-fallback approach `taxonomy.ts` uses for brands and categories.
 * Once seeded, the list is managed from the portal and this array is only a
 * safety net.
 */
export const PROJECT_TYPES = [
  "Transformer (MV+LV)",
  "Motor Controller Panel",
  "Capacitor Bank",
  "Solar Metering",
  "Solar",
  "Metering",
  "MDB",
  "LVDB + Capacitor Bank",
  "MV+LV Line",
  "Pole Installation",
  "Lightning Protection",
  "Auto recloser",
  "Training",
] as const;

export const QUOTE_STATES = ["", "Pending", "Sent"] as const;
export type QuoteState = (typeof QUOTE_STATES)[number];

export const AGREEMENT_STATES = ["", "Pending", "Pending Customer", "Yes", "No"] as const;
export type AgreementState = (typeof AGREEMENT_STATES)[number];

export type DhmProject = {
  id: string;
  /** Human-readable ticket reference — the "No." on the paper form. */
  ticketNo: string;

  // --- Identity -----------------------------------------------------------
  projectName: string;
  projectType: string;
  projectLead: string;
  status: ProjectStatus;

  // --- Customer (paper form fields 1, 2, 9) -------------------------------
  customerName: string;
  customerPhone: string;
  /** City / area name, e.g. "Kampong Cham" — not GPS coordinates. */
  customerLocation: string;

  // --- What sales heard from the customer (paper form field 6) ------------
  inquiryDetail: string;

  // --- Sales → Technical handoff (paper form footer) ----------------------
  submittedByName: string;
  submittedByUsername: string;
  /** "Sale Team Informed" in the workbook / "Date Submit" on the form. */
  saleTeamInformed: string;
  acknowledgedByName: string;
  acknowledgedByUsername: string;
  /** "Date Received" on the form; set when technical acknowledges. */
  acknowledgedDate: string;

  // --- Lifecycle milestones (workbook columns, in order) ------------------
  contactCustomerDate: string;
  studyDate: string;
  boqDate: string;
  /**
   * Quotation state. The workbook tracked "Labor Quote" and "Quote to
   * Customer" separately, but in practice they are the same step — the quote
   * either has been sent to the customer or has not — so they are one stage.
   */
  quoteToCustomer: QuoteState;
  customerAgreement: AgreementState;
  contractSignedDate: string;
  projectDuration: string;
  deadline: string;
  dateStartProject: string;
  documentProcessedDate: string;
  dateCompletionProject: string;
  remark: string;

  /** Uploaded files, grouped by what they are. */
  documents: ProjectDocument[];
  /** Dated site-progress notes with optional photos. */
  updates: ProjectUpdate[];
  /** Append-only discussion thread. */
  comments: ProjectComment[];

  createdAt?: unknown;
  updatedAt?: unknown;
  createdBy?: string;
  updatedBy?: string;
};

/** Document buckets. The first three hang off their lifecycle stage. */
export const DOCUMENT_CATEGORIES = ["boq", "quote", "contract", "other"] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  boq: "BOQ",
  quote: "Quotation",
  contract: "Contract",
  other: "Other documents",
};

export type ProjectDocument = {
  id: string;
  name: string;
  url: string;
  /** Storage path, kept so the file can be deleted later. */
  path: string;
  size: number;
  contentType: string;
  category: DocumentCategory;
  uploadedByName: string;
  /** ISO instant. */
  uploadedAt: string;
};

export type ProjectPhoto = {
  url: string;
  path: string;
  name: string;
};

export type ProjectUpdate = {
  id: string;
  /** Calendar date of the site visit / progress, `YYYY-MM-DD`. */
  date: string;
  note: string;
  photos: ProjectPhoto[];
  authorName: string;
  /** ISO instant the entry was posted. */
  createdAt: string;
};

/**
 * Append-only discussion on a ticket.
 *
 * Deliberately not an editable field: the intake remark is part of the record
 * sales filed, and overwriting it loses who said what and when. Anything said
 * afterwards is a comment, attributed and timestamped.
 */
export type ProjectComment = {
  id: string;
  text: string;
  authorName: string;
  authorUsername: string;
  /** ISO instant. */
  createdAt: string;
};

/** How many comments the thread shows before "show older". */
export const COMMENTS_PAGE_SIZE = 5;

/**
 * Everything sales supply on create; the rest is defaulted.
 *
 * `projectLead` is deliberately absent — assigning a technical lead is the
 * technical team's call, made when they acknowledge the ticket.
 */
export type NewProjectInput = Pick<
  DhmProject,
  | "projectName"
  | "projectType"
  | "customerName"
  | "customerPhone"
  | "customerLocation"
  | "inquiryDetail"
  | "saleTeamInformed"
  | "remark"
>;

/**
 * The tracked lifecycle, in the order the workbook records it. `key` is the
 * field on DhmProject; `kind` drives which control the detail view renders.
 */
export type StageKind = "date" | "quote" | "agreement" | "text" | "duration";

/** Units offered alongside the duration number field. */
export const DURATION_UNITS = ["days", "weeks", "months", "years"] as const;
export type DurationUnit = (typeof DURATION_UNITS)[number];

/** `"3 months"` -> `{ value: "3", unit: "months" }`; tolerant of legacy free text. */
export function parseDuration(raw: string): { value: string; unit: DurationUnit } {
  const m = /^\s*(\d+(?:\.\d+)?)\s*([a-z]+)/i.exec(raw ?? "");
  if (!m) return { value: "", unit: "months" };
  const unit = m[2].toLowerCase();
  const matched = DURATION_UNITS.find((u) => u === unit || u === `${unit}s`);
  return { value: m[1], unit: matched ?? "months" };
}

export function formatDuration(value: string, unit: DurationUnit): string {
  const n = value.trim();
  if (!n) return "";
  // "1 months" reads badly; singularise when the number is exactly one.
  return Number(n) === 1 ? `${n} ${unit.replace(/s$/, "")}` : `${n} ${unit}`;
}

export type LifecycleStage = {
  key: keyof DhmProject;
  label: string;
  labelKh: string;
  kind: StageKind;
  /** Excluded from progress: descriptive, not a milestone that "completes". */
  informational?: boolean;
};

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  { key: "acknowledgedDate", label: "Received by Technical", labelKh: "ទទួលដោយផ្នែកបច្ចេកទេស", kind: "date" },
  { key: "contactCustomerDate", label: "Contact Customer", labelKh: "ទាក់ទងអតិថិជន", kind: "date" },
  { key: "studyDate", label: "Study", labelKh: "សិក្សា", kind: "date" },
  { key: "boqDate", label: "BOQ", labelKh: "BOQ", kind: "date" },
  { key: "quoteToCustomer", label: "Quotation", labelKh: "ការដាក់តម្លៃ", kind: "quote" },
  { key: "customerAgreement", label: "Customer Agreement", labelKh: "កិច្ចព្រមព្រៀងអតិថិជន", kind: "agreement" },
  { key: "contractSignedDate", label: "Contract Signed", labelKh: "ចុះហត្ថលេខាកិច្ចសន្យា", kind: "date" },
  { key: "projectDuration", label: "Project Duration", labelKh: "រយៈពេលគម្រោង", kind: "duration", informational: true },
  { key: "deadline", label: "Deadline", labelKh: "ថ្ងៃផុតកំណត់", kind: "date", informational: true },
  { key: "dateStartProject", label: "Project Start", labelKh: "ចាប់ផ្តើមគម្រោង", kind: "date" },
  { key: "documentProcessedDate", label: "Document Processed", labelKh: "ដំណើរការឯកសារ", kind: "date" },
  { key: "dateCompletionProject", label: "Project Completion", labelKh: "បញ្ចប់គម្រោង", kind: "date" },
];

/** Stages that count toward the progress bar. */
const MILESTONE_STAGES = LIFECYCLE_STAGES.filter((s) => !s.informational);

const isFilled = (v: unknown) => typeof v === "string" && v.trim().length > 0;

/**
 * A "Sent"/"Yes" answer counts as done; "Pending" does not.
 *
 * The single definition of "cleared" — the progress bar, the timeline steps and
 * the dashboard funnel all read it, so they can never disagree about whether a
 * stage is finished.
 */
export function stageIsComplete(project: DhmProject, stage: LifecycleStage): boolean {
  const value = project[stage.key];
  if (!isFilled(value)) return false;
  if (stage.kind === "quote") return value === "Sent";
  if (stage.kind === "agreement") return value === "Yes";
  return true;
}

/** The milestone stages, i.e. everything that counts toward progress. */
export const MILESTONE_STAGE_COUNT = LIFECYCLE_STAGES.filter((s) => !s.informational).length;

export function projectProgress(project: DhmProject): {
  done: number;
  total: number;
  percent: number;
  currentStage: string;
} {
  const done = MILESTONE_STAGES.filter((s) => stageIsComplete(project, s)).length;
  const total = MILESTONE_STAGES.length;
  const next = MILESTONE_STAGES.find((s) => !stageIsComplete(project, s));
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
    currentStage:
      project.status === "Cancelled"
        ? "Cancelled"
        : project.status === "Completed" || !next
        ? "Completed"
        : next.label,
  };
}

/**
 * Human-readable diff between two versions of a ticket, used to build a single
 * batched Telegram message per save instead of one per changed field.
 */
export type ProjectChange = { label: string; from: string; to: string };

export function diffProject(before: DhmProject, after: DhmProject): ProjectChange[] {
  const changes: ProjectChange[] = [];
  const show = (v: unknown) => (isFilled(v) ? String(v).trim() : "—");

  if (before.status !== after.status) {
    changes.push({ label: "Status", from: show(before.status), to: show(after.status) });
  }
  if (before.projectLead !== after.projectLead) {
    changes.push({ label: "Project Lead", from: show(before.projectLead), to: show(after.projectLead) });
  }
  for (const stage of LIFECYCLE_STAGES) {
    const a = before[stage.key];
    const b = after[stage.key];
    if (String(a ?? "") !== String(b ?? "")) {
      changes.push({ label: stage.label, from: show(a), to: show(b) });
    }
  }
  if ((before.remark ?? "") !== (after.remark ?? "")) {
    changes.push({ label: "Remark", from: show(before.remark), to: show(after.remark) });
  }
  return changes;
}

/** `DHM-PRJ-0042`, continuing from the highest existing number. */
export function nextTicketNo(existing: DhmProject[]): string {
  let max = 0;
  for (const p of existing) {
    const m = /^DHM-PRJ-(\d+)$/.exec(p.ticketNo ?? "");
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `DHM-PRJ-${String(max + 1).padStart(4, "0")}`;
}

const EMPTY_LIFECYCLE = {
  acknowledgedByName: "",
  acknowledgedByUsername: "",
  acknowledgedDate: "",
  contactCustomerDate: "",
  studyDate: "",
  boqDate: "",
  quoteToCustomer: "" as QuoteState,
  customerAgreement: "" as AgreementState,
  contractSignedDate: "",
  projectDuration: "",
  deadline: "",
  dateStartProject: "",
  documentProcessedDate: "",
  dateCompletionProject: "",
};

/**
 * A fully-zeroed project, for building a complete object from a partial one
 * without casting. Keeps callers honest when fields are added or removed.
 */
export const EMPTY_PROJECT: DhmProject = {
  id: "",
  ticketNo: "",
  projectName: "",
  projectType: "",
  projectLead: "",
  status: "Ongoing",
  customerName: "",
  customerPhone: "",
  customerLocation: "",
  inquiryDetail: "",
  submittedByName: "",
  submittedByUsername: "",
  saleTeamInformed: "",
  remark: "",
  documents: [],
  updates: [],
  comments: [],
  ...EMPTY_LIFECYCLE,
};

function rowToProject(id: string, data: Record<string, unknown>): DhmProject {
  const str = (k: string) => (typeof data[k] === "string" ? (data[k] as string) : "");
  return {
    id,
    ticketNo: str("ticketNo"),
    projectName: str("projectName"),
    projectType: str("projectType"),
    projectLead: str("projectLead"),
    status: (PROJECT_STATUSES as readonly string[]).includes(str("status"))
      ? (str("status") as ProjectStatus)
      : "Ongoing",
    customerName: str("customerName"),
    customerPhone: str("customerPhone"),
    customerLocation: str("customerLocation"),
    inquiryDetail: str("inquiryDetail"),
    submittedByName: str("submittedByName"),
    submittedByUsername: str("submittedByUsername"),
    saleTeamInformed: str("saleTeamInformed"),
    acknowledgedByName: str("acknowledgedByName"),
    acknowledgedByUsername: str("acknowledgedByUsername"),
    acknowledgedDate: str("acknowledgedDate"),
    contactCustomerDate: str("contactCustomerDate"),
    studyDate: str("studyDate"),
    boqDate: str("boqDate"),
    quoteToCustomer: str("quoteToCustomer") as QuoteState,
    customerAgreement: str("customerAgreement") as AgreementState,
    contractSignedDate: str("contractSignedDate"),
    projectDuration: str("projectDuration"),
    deadline: str("deadline"),
    dateStartProject: str("dateStartProject"),
    documentProcessedDate: str("documentProcessedDate"),
    dateCompletionProject: str("dateCompletionProject"),
    remark: str("remark"),
    documents: Array.isArray(data.documents) ? (data.documents as ProjectDocument[]) : [],
    updates: Array.isArray(data.updates) ? (data.updates as ProjectUpdate[]) : [],
    comments: Array.isArray(data.comments) ? (data.comments as ProjectComment[]) : [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    createdBy: str("createdBy"),
    updatedBy: str("updatedBy"),
  };
}

export function subscribeProjects(callback: (projects: DhmProject[]) => void): Unsubscribe {
  try {
    const q = query(collection(requireFirebaseDb(), DHM_PROJECTS_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => callback(snapshot.docs.map((d) => rowToProject(d.id, d.data()))),
      (err) => {
        console.error("subscribeProjects error:", err);
        callback([]);
      }
    );
  } catch (err) {
    console.error("subscribeProjects failed:", err);
    callback([]);
    return () => {};
  }
}

/**
 * Live subscription to one ticket, for its own page.
 *
 * Calls back with `null` when the document does not exist so the page can show
 * a not-found state instead of hanging on a spinner.
 */
export function subscribeProject(
  id: string,
  callback: (project: DhmProject | null) => void
): Unsubscribe {
  try {
    return onSnapshot(
      doc(requireFirebaseDb(), DHM_PROJECTS_COLLECTION, id),
      (snap) => callback(snap.exists() ? rowToProject(snap.id, snap.data()) : null),
      (err) => {
        console.error("subscribeProject error:", err);
        callback(null);
      }
    );
  } catch (err) {
    console.error("subscribeProject setup error:", err);
    callback(null);
    return () => {};
  }
}

export async function createProject(
  input: NewProjectInput,
  actor: { name: string; username: string },
  ticketNo: string
): Promise<string> {
  const now = Timestamp.now();
  const ref = await addDoc(collection(requireFirebaseDb(), DHM_PROJECTS_COLLECTION), {
    ticketNo,
    ...input,
    // Assigned by technical on acknowledgement, not by sales.
    projectLead: "",
    status: "Ongoing" as ProjectStatus,
    documents: [],
    updates: [],
    submittedByName: actor.name,
    submittedByUsername: actor.username,
    ...EMPTY_LIFECYCLE,
    createdAt: now,
    updatedAt: now,
    createdBy: actor.username,
    updatedBy: actor.username,
  });
  return ref.id;
}

/** Patch keys are restricted to the editable surface; id/createdAt never move. */
export type ProjectPatch = Partial<Omit<DhmProject, "id" | "ticketNo" | "createdAt" | "createdBy">>;

export async function updateProject(
  id: string,
  patch: ProjectPatch,
  actor: { username: string }
): Promise<void> {
  // Firestore rejects undefined; drop those keys rather than writing nulls.
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) clean[k] = v;
  }
  await updateDoc(doc(requireFirebaseDb(), DHM_PROJECTS_COLLECTION, id), {
    ...clean,
    updatedAt: Timestamp.now(),
    updatedBy: actor.username,
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(requireFirebaseDb(), DHM_PROJECTS_COLLECTION, id));
}

/** Append a comment. Never edits or removes what is already on the thread. */
export async function addProjectComment(
  project: DhmProject,
  text: string,
  actor: { name: string; username: string }
): Promise<void> {
  const body = text.trim();
  if (!body) return;
  const comment: ProjectComment = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    text: body.slice(0, 4000),
    authorName: actor.name,
    authorUsername: actor.username,
    createdAt: new Date().toISOString(),
  };
  await updateProject(project.id, { comments: [...project.comments, comment] }, actor);
}

/** `2026-08-11 14:05` style stamp for comment/audit rows. */
export function formatProjectInstant(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** `2026-08-11` -> `11 Aug 2026`; passes through anything unparseable. */
export function formatProjectDate(value: string): string {
  if (!isFilled(value)) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return value;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** Today as `YYYY-MM-DD` in local time (never UTC — the office is UTC+7). */
export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ---------------------------------------------------------------------------
// Project types — admin-managed list (same shape as brands / categories)
// ---------------------------------------------------------------------------

export type ProjectTypeRecord = {
  /** Firestore document id; absent on the static fallback entries. */
  id?: string;
  name: string;
  order: number;
  /** Hidden types stay on historical tickets but drop out of the picker. */
  hidden?: boolean;
};

export const FALLBACK_PROJECT_TYPES: ProjectTypeRecord[] = PROJECT_TYPES.map((name, i) => ({
  name,
  order: i,
}));

/** Case- and space-insensitive key, so "Solar " and "solar" collide. */
export const projectTypeKey = (name: string) => name.trim().toLowerCase().replace(/\s+/g, " ");

export function subscribeProjectTypes(
  callback: (types: ProjectTypeRecord[]) => void
): Unsubscribe {
  try {
    const q = query(collection(requireFirebaseDb(), PROJECT_TYPES_COLLECTION), orderBy("order", "asc"));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(FALLBACK_PROJECT_TYPES);
          return;
        }
        callback(
          snapshot.docs.map((d) => {
            const data = d.data() as Partial<ProjectTypeRecord>;
            return {
              id: d.id,
              name: typeof data.name === "string" ? data.name : "",
              order: typeof data.order === "number" ? data.order : 0,
              hidden: data.hidden === true,
            };
          })
        );
      },
      (err) => {
        console.error("subscribeProjectTypes error, using fallback:", err);
        callback(FALLBACK_PROJECT_TYPES);
      }
    );
  } catch (err) {
    console.error("subscribeProjectTypes setup error, using fallback:", err);
    callback(FALLBACK_PROJECT_TYPES);
    return () => {};
  }
}

export async function createProjectType(name: string, order: number): Promise<void> {
  await addDoc(collection(requireFirebaseDb(), PROJECT_TYPES_COLLECTION), {
    name: name.trim(),
    order,
    hidden: false,
    createdAt: Timestamp.now(),
  });
}

export async function updateProjectType(
  id: string,
  patch: Partial<Pick<ProjectTypeRecord, "name" | "order" | "hidden">>
): Promise<void> {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) clean[k] = typeof v === "string" ? v.trim() : v;
  }
  await updateDoc(doc(requireFirebaseDb(), PROJECT_TYPES_COLLECTION, id), { ...clean, updatedAt: Timestamp.now() });
}

export async function deleteProjectType(id: string): Promise<void> {
  await deleteDoc(doc(requireFirebaseDb(), PROJECT_TYPES_COLLECTION, id));
}

/** Swap the `order` of two rows so ↑/↓ reordering survives a reload. */
export async function swapProjectTypeOrder(
  a: ProjectTypeRecord,
  b: ProjectTypeRecord
): Promise<void> {
  if (!a.id || !b.id) return;
  const firestore = requireFirebaseDb();
  const batch = writeBatch(firestore);
  batch.update(doc(firestore, PROJECT_TYPES_COLLECTION, a.id), { order: b.order });
  batch.update(doc(firestore, PROJECT_TYPES_COLLECTION, b.id), { order: a.order });
  await batch.commit();
}

/**
 * Append the workbook's types to the collection, skipping any already present.
 *
 * Idempotent by design: it reads what is there first and compares on the
 * normalised key, so running it twice adds nothing and it is safe to use to
 * top up a list that has already been edited by hand.
 */
export async function seedProjectTypesFromSheet(): Promise<{ added: number; skipped: number }> {
  const snapshot = await getDocs(collection(requireFirebaseDb(), PROJECT_TYPES_COLLECTION));
  const existing = new Set(
    snapshot.docs.map((d) => projectTypeKey(String((d.data() as { name?: unknown }).name ?? "")))
  );
  let maxOrder = -1;
  for (const d of snapshot.docs) {
    const o = (d.data() as { order?: unknown }).order;
    if (typeof o === "number") maxOrder = Math.max(maxOrder, o);
  }

  const missing = PROJECT_TYPES.filter((name) => !existing.has(projectTypeKey(name)));
  if (missing.length === 0) {
    return { added: 0, skipped: PROJECT_TYPES.length };
  }

  const firestore = requireFirebaseDb();
  const batch = writeBatch(firestore);
  missing.forEach((name, i) => {
    batch.set(doc(collection(firestore, PROJECT_TYPES_COLLECTION)), {
      name,
      order: maxOrder + 1 + i,
      hidden: false,
      createdAt: Timestamp.now(),
    });
  });
  await batch.commit();

  return { added: missing.length, skipped: PROJECT_TYPES.length - missing.length };
}
