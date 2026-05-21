"use client";

import { useState } from "react";
import type { AdminUser, FunctionAccessKey, StaffDepartment, StaffOffice, StaffTitle, UserRole } from "@/app/actions/auth";
import { formatUserDisplayName } from "@/lib/user-display-name";

export const OFFICES: StaffOffice[] = ["Head Office", "KienSvay", "EPOSE", "ToukMeas", "DangTong"];
export const TITLES: StaffTitle[] = ["Top Management", "Manager", "Supervisor", "Staff"];
export const DEPARTMENTS: StaffDepartment[] = [
  "Sales",
  "Logistics",
  "Technical",
  "Technology",
  "HR & Admin",
  "Accounting",
];

export const CREATE_ROLES: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin User" },
  { value: "super_admin", label: "Super Admin" },
];

export const EDIT_ROLES: { value: UserRole; label: string }[] = [
  ...CREATE_ROLES,
  { value: "branch", label: "Branch (legacy)" },
  { value: "marketing", label: "Marketing (legacy)" },
  { value: "management", label: "Management (legacy)" },
];

export type PermissionNode = {
  key: string;
  label: string;
  description?: string;
  children?: PermissionNode[];
};

export const PERMISSION_TREE: PermissionNode[] = [
  {
    key: "_admin",
    label: "Admin Dashboard",
    description: "Content and product management tools ",
    children: [
      { key: "admin.products", label: "Products", description: "Manage product listings" },
      { key: "admin.posts", label: "News Posts", description: "Create and edit news posts " },
      { key: "admin.careers", label: "Careers", description: "Manage job postings" },
      { key: "admin.inquiries", label: "Inquiries", description: "View and respond to customer inquiries " },
      { key: "admin.qrcode", label: "QR Code QR", description: "Generate and manage QR codes  QR" },
    ],
  },
  {
    key: "_prpo",
    label: "Branch Functions",
    description: "Purchase Request and Purchase Order management ",
    children: [
      {
        key: "admin.prpo.dashboard",
        label: "Dashboard",
        description: "Branch Functions dashboard tab (summary and charts).",
      },
      {
        key: "admin.prpo.submit",
        label: "Submit PO",
        description: "Submit PO tab — upload PR/PO files and submit purchase orders.",
      },
      {
        key: "admin.prpo.open",
        label: "Create SO",
        description: "Create SO tab — record sales orders from open purchase orders.",
      },
      {
        key: "admin.prpo.view",
        label: "View PO",
        description: "View PO tab — browse PO history and details.",
      },
    ],
  },
  {
    key: "_internal",
    label: "Internal Tooling",
    description: "Staff tools for booking and resource management ",
    children: [
      { key: "internal.rooms", label: "Room Booking", description: "Book and manage meeting rooms " },
      { key: "internal.cars", label: "Car Booking", description: "Book and manage company vehicles " },
    ],
  },
  {
    key: "_usermgmt",
    label: "User Management",
    description: "Create and manage staff accounts and access  ",
    children: [
      {
        key: "internal.user_management",
        label: "User Management",
        description: "Full access to create users and assign permissions ",
      },
    ],
  },
];

import { useLanguage } from "@/lib/i18n";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin User",
  user: "User",
  branch: "Branch",
  marketing: "Marketing",
  management: "Management",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-brand-red text-white",
  admin: "bg-brand-navy text-white",
  user: "bg-slate-100 text-slate-700",
  management: "bg-violet-100 text-violet-800",
  marketing: "bg-amber-100 text-amber-800",
  branch: "bg-emerald-100 text-emerald-800",
};

/** Centered pill: flex + leading-none fixes vertical alignment inside badges */
const pillBase =
  "inline-flex min-h-[1.75rem] select-none items-center justify-center rounded-full px-3 text-xs font-semibold leading-none tracking-tight";

export function RolePill({ role }: { role: string }) {
  return (
    <span className={`${pillBase} ${ROLE_COLORS[role] ?? "bg-slate-100 text-slate-600"}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

/** Active = can log in; inactive = account disabled (stored as `revoked` in backend). */
export function AccountStatusPill({ active }: { active: boolean }) {
  const { t } = useLanguage();
  if (active) {
    return (
      <span className={`${pillBase} bg-emerald-100 text-emerald-800`}>{t.admin.userMgmt.active}</span>
    );
  }
  return <span className={`${pillBase} bg-slate-200 text-slate-700`}>{t.admin.userMgmt.inactive}</span>;
}

export function collectDescendantKeys(node: PermissionNode): string[] {
  if (!node.children) return [node.key];
  return node.children.flatMap(collectDescendantKeys);
}

export function togglePermission(values: FunctionAccessKey[], value: string): FunctionAccessKey[] {
  const key = value as FunctionAccessKey;
  return values.includes(key) ? values.filter((v) => v !== key): [...values, key];
}

export function normalizeLegacyPermissions(
  perms: FunctionAccessKey[] | string[] | undefined
): FunctionAccessKey[] {
  const list = (perms ?? []) as string[];
  if (!list.includes("admin.prpo")) return list as FunctionAccessKey[];
  const without = list.filter((p) => p !== "admin.prpo");
  const upgraded = new Set([
    ...without,
    "admin.prpo.dashboard",
    "admin.prpo.submit",
    "admin.prpo.open",
    "admin.prpo.view",
  ]);
  return Array.from(upgraded) as FunctionAccessKey[];
}

export function withNormalizedPermissions(u: AdminUser): AdminUser {
  return { ...u, permissions: normalizeLegacyPermissions(u.permissions) };
}

export function randomPassword8(): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i += 1) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export function displayName(u: AdminUser): string {
  return formatUserDisplayName({
    firstName: u.firstName,
    lastName: u.lastName,
    username: u.username,
  });
}

const PERMISSION_LABELS: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const g of PERMISSION_TREE) {
    for (const c of g.children ?? []) {
      m[c.key] = c.label;
    }
  }
  return m;
})();

export function humanizePermissionKey(key: string): string {
  return PERMISSION_LABELS[key] ?? key;
}

function PermissionGroup({
  node,
  permissions,
  onChange,
  defaultOpen = false,
}: {
  node: PermissionNode;
  permissions: FunctionAccessKey[];
  onChange: (key: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const descendants = collectDescendantKeys(node).filter((k) => !k.startsWith("_"));
  const allChecked =
    descendants.length > 0 && descendants.every((k) => permissions.includes(k as FunctionAccessKey));
  const someChecked = !allChecked && descendants.some((k) => permissions.includes(k as FunctionAccessKey));

  const toggleAll = () => {
    if (allChecked) {
      descendants.forEach((k) => {
        if (permissions.includes(k as FunctionAccessKey)) onChange(k);
      });
    } else {
      descendants.forEach((k) => {
        if (!permissions.includes(k as FunctionAccessKey)) onChange(k);
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <input
          type="checkbox"
          checked={allChecked}
          ref={(el) => {
            if (el) el.indeterminate = someChecked;
          }}
          onChange={toggleAll}
          className="h-4 w-4 shrink-0 rounded border-slate-300 accent-brand-navy"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">{node.label}</p>
            {node.description ? <p className="text-xs text-slate-400">{node.description}</p>: null}
          </div>
          <svg
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180": ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium leading-none text-slate-500">
          {descendants.filter((k) => permissions.includes(k as FunctionAccessKey)).length}/{descendants.length}
        </span>
      </div>
      {open ? (
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {(node.children ?? []).map((child) => {
            const isChecked = permissions.includes(child.key as FunctionAccessKey);
            return (
              <label
                key={child.key}
                className="flex cursor-pointer items-start gap-3 px-6 py-3 transition hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onChange(child.key)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand-navy"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700">{child.label}</p>
                  {child.description ? <p className="text-xs text-slate-400">{child.description}</p>: null}
                </div>
              </label>
            );
          })}
        </div>
      ): null}
    </div>
  );
}

/** Groups hidden while internal tooling is disabled (see dhm-myadmin/internal/layout). */
const PERMISSION_TREE_WITHOUT_INTERNAL_TOOLING = PERMISSION_TREE.filter((g) => g.key !== "_internal");

export function PermissionTree({
  permissions,
  onChange,
}: {
  permissions: FunctionAccessKey[];
  onChange: (key: string) => void;
}) {
  return (
    <div className="space-y-2">
      {PERMISSION_TREE_WITHOUT_INTERNAL_TOOLING.map((group) => (
        <PermissionGroup key={group.key} node={group} permissions={permissions} onChange={onChange} />
      ))}
    </div>
  );
}
