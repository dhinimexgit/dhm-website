import type { SessionUser, StaffOffice } from "@/app/actions/auth";

/** PO `branchName` values used in Branch Functions (must match `BRANCH_OPTIONS` / Firestore). */
const OFFICE_TO_PO_BRANCH: Partial<Record<StaffOffice, string>> = {
  KienSvay: "Kien Svay",
  ToukMeas: "Touk Meas",
  EPOSE: "EPOSE",
  DangTong: "Dong Tong",
};

export type ViewPoBranchScope =
  | { kind: "all" }
  | { kind: "branch"; branchName: string }
  | { kind: "none" };

/**
 * Staff with title "Staff" may only browse View PO for their assigned warehouse branch.
 * Head Office / missing office / unmapped office → no POs (strict).
 */
export function resolveViewPoBranchScope(
  user: Pick<SessionUser, "title" | "office"> | null,
  isPrpoSuperUser: boolean
): ViewPoBranchScope {
  if (!user || isPrpoSuperUser) return { kind: "all" };
  if (user.title !== "Staff") return { kind: "all" };
  const office = user.office;
  if (!office) return { kind: "none" };
  const branch = OFFICE_TO_PO_BRANCH[office];
  if (!branch) return { kind: "none" };
  return { kind: "branch", branchName: branch };
}

export function isPoInViewPoBranchScope(po: { branchName: string }, scope: ViewPoBranchScope): boolean {
  if (scope.kind === "all") return true;
  if (scope.kind === "none") return false;
  return po.branchName.trim().toLowerCase() === scope.branchName.trim().toLowerCase();
}

/** Rehydrate scope from server-passed props on the PR/PO client page. */
export function viewPoScopeFromStaffProps(
  viewPoStaffLock: number,
  viewPoStaffBranchName: string
): ViewPoBranchScope {
  if (!viewPoStaffLock) return { kind: "all" };
  const n = viewPoStaffBranchName.trim();
  if (!n) return { kind: "none" };
  return { kind: "branch", branchName: n };
}
