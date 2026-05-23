import type { SessionUser, StaffOffice } from "@/app/actions/auth";

/** Current PO `branchName` values (Submit PO dropdown / Firestore). */
export const ALL_PO_BRANCHES = [
  "Akissini Kien Svay",
  "Akissini EPOSE",
  "Akissini Touk Meas",
  "Akissini Dong Tong",
  "Tuek Saart Touk Meas",
  "Teuk Thpong",
  "Tuek Saart Chhouk",
  "Tuek Pongtraj",
  "Tuek Pong Teuk",
] as const;

export type PoBranchName = (typeof ALL_PO_BRANCHES)[number];

/** Warehouse office — Kien Svay group. */
export const KIEN_SVAY_PO_BRANCHES: readonly PoBranchName[] = [
  "Akissini Kien Svay",
  "Akissini EPOSE",
];

/** Warehouse office — Touk Meas group. */
export const TOUK_MEAS_PO_BRANCHES: readonly PoBranchName[] = [
  "Akissini Touk Meas",
  "Akissini Dong Tong",
  "Tuek Saart Touk Meas",
  "Teuk Thpong",
  "Tuek Saart Chhouk",
  "Tuek Pongtraj",
  "Tuek Pong Teuk",
];

/** Previous `branchName` labels still stored on older PO records. */
const LEGACY_TO_CANONICAL_PO_BRANCH: Record<string, PoBranchName> = {
  "Kien Svay": "Akissini Kien Svay",
  EPOSE: "Akissini EPOSE",
  "Touk Meas": "Akissini Touk Meas",
  "Dong Tong": "Akissini Dong Tong",
  "Tuek Saart": "Tuek Saart Touk Meas",
  "Teuk Saart": "Tuek Saart Touk Meas",
  "Tuek Saart Thpong": "Teuk Thpong",
  "Teuk Saart Thpong": "Teuk Thpong",
};

const OFFICE_TO_PO_BRANCHES: Partial<Record<StaffOffice, readonly PoBranchName[]>> = {
  KienSvay: KIEN_SVAY_PO_BRANCHES,
  ToukMeas: TOUK_MEAS_PO_BRANCHES,
};

export type ViewPoBranchScope =
  | { kind: "all" }
  | { kind: "branches"; branchNames: readonly string[] }
  | { kind: "none" };

const BRANCH_SCOPE_DELIM = "|";

function branchLookupKey(name: string): string {
  return name.trim().toLowerCase();
}

/** Map stored or legacy branch label to the current canonical name (for display and matching). */
export function canonicalPoBranchName(raw: string): string {
  const t = raw.trim();
  if (!t) return t;

  const legacy = LEGACY_TO_CANONICAL_PO_BRANCH[t];
  if (legacy) return legacy;

  const legacyInsensitive = Object.entries(LEGACY_TO_CANONICAL_PO_BRANCH).find(
    ([key]) => key.toLowerCase() === t.toLowerCase(),
  )?.[1];
  if (legacyInsensitive) return legacyInsensitive;

  const current = (ALL_PO_BRANCHES as readonly string[]).find(
    (b) => b.toLowerCase() === t.toLowerCase(),
  );
  return current ?? t;
}

/** True when two branch labels refer to the same branch (legacy or current spelling). */
export function poBranchNamesMatch(a: string, b: string): boolean {
  return branchLookupKey(canonicalPoBranchName(a)) === branchLookupKey(canonicalPoBranchName(b));
}

/**
 * Users at a warehouse office (Kien Svay / Touk Meas) may only work with POs for branches in that group.
 * Head Office and PR/PO super-users see all branches. Head Office staff with no warehouse mapping see none.
 */
export function resolveViewPoBranchScope(
  user: Pick<SessionUser, "title" | "office"> | null,
  isPrpoSuperUser: boolean
): ViewPoBranchScope {
  if (!user || isPrpoSuperUser) return { kind: "all" };

  const office = user.office;
  if (!office || office === "Head Office") {
    if (user.title === "Staff") return { kind: "none" };
    return { kind: "all" };
  }

  const branches = OFFICE_TO_PO_BRANCHES[office];
  if (!branches?.length) return { kind: "none" };
  return { kind: "branches", branchNames: branches };
}

export function isPoInViewPoBranchScope(po: { branchName: string }, scope: ViewPoBranchScope): boolean {
  if (scope.kind === "all") return true;
  if (scope.kind === "none") return false;
  return scope.branchNames.some((b) => poBranchNamesMatch(po.branchName, b));
}

export function selectablePoBranchesForScope(scope: ViewPoBranchScope): readonly string[] {
  if (scope.kind === "all") return ALL_PO_BRANCHES;
  if (scope.kind === "branches") return scope.branchNames;
  return [];
}

/** Serialize allowed branches for server → client props (branch names must not contain `|`). */
export function encodeAllowedBranchesForProps(branchNames: readonly string[]): string {
  return branchNames.join(BRANCH_SCOPE_DELIM);
}

/** Rehydrate scope from server-passed props on the PR/PO client page. */
export function viewPoScopeFromStaffProps(
  viewPoStaffLock: number,
  viewPoAllowedBranchesCsv: string
): ViewPoBranchScope {
  if (!viewPoStaffLock) return { kind: "all" };
  const names = viewPoAllowedBranchesCsv
    .split(BRANCH_SCOPE_DELIM)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!names.length) return { kind: "none" };
  return { kind: "branches", branchNames: names };
}
