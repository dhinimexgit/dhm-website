import type { SessionUser, StaffOffice } from "@/app/actions/auth";

/** PO `branchName` values stored in Firestore (Submit PO / View PO). */
export const ALL_PO_BRANCHES = [
  "Kien Svay",
  "Touk Meas",
  "EPOSE",
  "Dong Tong",
  "Tuek Saart",
  "Tuek Saart Thpong",
] as const;

export type PoBranchName = (typeof ALL_PO_BRANCHES)[number];

/** Warehouse offices under Kien Svay (user management + PO scope). */
export const KIEN_SVAY_PO_BRANCHES: readonly PoBranchName[] = ["Kien Svay", "EPOSE"];

/** Warehouse offices under Touk Meas. */
export const TOUK_MEAS_PO_BRANCHES: readonly PoBranchName[] = [
  "Touk Meas",
  "Dong Tong",
  "Tuek Saart",
  "Tuek Saart Thpong",
];

const OFFICE_TO_PO_BRANCHES: Partial<Record<StaffOffice, readonly PoBranchName[]>> = {
  KienSvay: KIEN_SVAY_PO_BRANCHES,
  ToukMeas: TOUK_MEAS_PO_BRANCHES,
};

export type ViewPoBranchScope =
  | { kind: "all" }
  | { kind: "branches"; branchNames: readonly string[] }
  | { kind: "none" };

const BRANCH_SCOPE_DELIM = "|";

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
  const n = po.branchName.trim().toLowerCase();
  return scope.branchNames.some((b) => b.trim().toLowerCase() === n);
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
