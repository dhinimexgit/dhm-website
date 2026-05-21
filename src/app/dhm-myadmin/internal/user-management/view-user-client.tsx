"use client";

import Link from "next/link";
import type { AdminUser } from "@/app/actions/auth";
import {
  AccountStatusPill,
  RolePill,
  displayName,
  humanizePermissionKey,
  normalizeLegacyPermissions,
} from "./user-management-shared";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function ViewUserClient({ user }: { user: AdminUser }) {
  const perms = normalizeLegacyPermissions(user.permissions);
  const enc = encodeURIComponent(user.username);
  const active = !user.revoked;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dhm-myadmin/user-management"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to users
          </Link>
          <h1 className="text-2xl font-semibold text-brand-navy sm:text-3xl">User profile</h1>
          <p className="mt-1 text-slate-600">Read-only overview of this account.</p>
        </div>
        <Link
          href={`/dhm-myadmin/user-management/${enc}/edit`}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy/90 sm:self-auto"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit user
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy/10 text-lg font-bold text-brand-navy">
          {displayName(user).charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-900">{displayName(user)}</p>
          <p className="font-mono text-sm text-slate-500">Username: {user.username}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <RolePill role={user.role} />
          <AccountStatusPill active={active} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Username" value={user.username} />
        <Field label="First name" value={user.firstName ?? ""} />
        <Field label="Last name" value={user.lastName ?? ""} />
        <Field label="Email (optional)" value={user.email ?? ""} />
        <Field label="Office" value={user.office ?? ""} />
        <Field label="Title" value={user.title ?? ""} />
        <Field label="Department" value={user.department ?? ""} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800">Function access</h2>
        <p className="mt-1 text-sm text-slate-500">
          {perms.length === 0
            ? "No individual feature permissions are assigned. Role-based access may still apply for Admin roles."
           : `${perms.length} feature permission${perms.length === 1 ? "": "s"} granted:`}
        </p>
        {perms.length > 0 ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {(perms).map((key) => (
              <li
                key={key}
                className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-800"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                <span>{humanizePermissionKey(key)}</span>
                <span className="ml-auto font-mono text-[10px] text-slate-400">{key}</span>
              </li>
            ))}
          </ul>
        ): null}
      </section>
    </div>
  );
}
