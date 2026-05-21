"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  resetManagedUserPassword,
  setManagedUserRevoked,
  updateManagedUserAccess,
  updateManagedUserDetails,
  type AdminUser,
  type FunctionAccessKey,
  type StaffDepartment,
  type StaffOffice,
  type StaffTitle,
  type UserRole,
} from "@/app/actions/auth";
import {
  DEPARTMENTS,
  EDIT_ROLES,
  OFFICES,
  PermissionTree,
  TITLES,
  displayName,
  randomPassword8,
  togglePermission,
  withNormalizedPermissions,
} from "./user-management-shared";

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p>: null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function EditUserClient({ initialUser }: { initialUser: AdminUser }) {
  const router = useRouter();
  const enc = encodeURIComponent(initialUser.username);

  const [profile, setProfile] = useState<AdminUser>(() => ({ ...initialUser }));
  const [access, setAccess] = useState<AdminUser>(() => withNormalizedPermissions(initialUser));
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const active = !profile.revoked;

  const flash = (msg: string, err?: string) => {
    setSuccess(err ? "": msg);
    setError(err || "");
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("username", profile.username);
    fd.append("firstName", profile.firstName ?? "");
    fd.append("lastName", profile.lastName ?? "");
    fd.append("email", profile.email ?? "");
    fd.append("office", profile.office ?? "");
    fd.append("title", profile.title ?? "");
    fd.append("department", profile.department ?? "");
    fd.append("role", profile.role);
    const res = await updateManagedUserDetails(fd);
    setLoading(false);
    if (!res.success) {
      flash("", res.error || "Save failed.");
      return;
    }
    flash("Profile saved.");
    setAccess((a) => ({
      ...a,
      username: profile.username,
      office: profile.office,
      title: profile.title,
      department: profile.department,
      role: profile.role,
      revoked: profile.revoked,
    }));
    router.refresh();
  };

  const saveAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("username", access.username);
    fd.append("role", access.role);
    ["internal", "admin"].forEach((m) => fd.append("modes", m));
    (access.permissions || []).forEach((p) => fd.append("permissions", p));
    const res = await updateManagedUserAccess(fd);
    setLoading(false);
    if (!res.success) {
      flash("", res.error || "Save failed.");
      return;
    }
    flash("Role and function access saved.");
    setAccess(withNormalizedPermissions(access));
    setProfile((p) => ({ ...p, role: access.role }));
    router.refresh();
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      flash("", "Enter a new password.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("username", profile.username);
    fd.append("newPassword", newPassword.trim());
    const res = await resetManagedUserPassword(fd);
    setLoading(false);
    if (!res.success) {
      flash("", res.error || "Reset failed.");
      return;
    }
    flash("Password updated.");
    setNewPassword("");
    router.refresh();
  };

  const toggleActive = async (nextActive: boolean) => {
    if (!nextActive) {
      const ok = window.confirm(
        "Mark this user inactive? They will not be able to sign in until you activate the account again."
      );
      if (!ok) return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("username", profile.username);
    fd.append("revoked", nextActive ? "false": "true");
    const res = await setManagedUserRevoked(fd);
    setLoading(false);
    if (!res.success) {
      flash("", res.error || "Update failed.");
      return;
    }
    setProfile((p) => ({ ...p, revoked: !nextActive }));
    setAccess((a) => ({ ...a, revoked: !nextActive }));
    flash(nextActive ? "User is now active.": "User is now inactive.");
    router.refresh();
  };

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
          <h1 className="text-2xl font-semibold text-brand-navy sm:text-3xl">Edit user</h1>
          <p className="mt-1 font-mono text-sm text-slate-600">{profile.username}</p>
        </div>
        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          <Link
            href={`/dhm-myadmin/user-management/${enc}/view`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View profile
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ): null}
      {success ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      ): null}

      <SectionCard
        title="Account status"
        description="Inactive users cannot sign in. This is the same as revoking access from the old screen."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {active ? "This account is allowed to sign in.": "Sign-in is blocked for this account."}
          </p>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <button
              type="button"
              disabled={loading}
              onClick={() => !active && toggleActive(true)}
              className={`min-w-[6rem] rounded-lg px-4 py-2 text-sm font-semibold transition ${
                active ? "bg-white text-emerald-800 shadow-sm": "text-slate-500 hover:text-slate-800"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => active && toggleActive(false)}
              className={`min-w-[6rem] rounded-lg px-4 py-2 text-sm font-semibold transition ${
                !active ? "bg-white text-slate-800 shadow-sm": "text-slate-500 hover:text-slate-800"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Profile" description={`Editing ${displayName(profile)}`}>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Login username
            </label>
            <input
              type="text"
              readOnly
              value={profile.username}
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
            />
            <p className="mt-1 text-xs text-slate-400">Username cannot be changed here.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                First name
              </label>
              <input
                required
                type="text"
                autoComplete="given-name"
                value={profile.firstName ?? ""}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Last name
              </label>
              <input
                required
                type="text"
                autoComplete="family-name"
                value={profile.lastName ?? ""}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email (optional)
            </label>
            <input
              type="email"
              value={profile.email ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value.trim() ? e.target.value.trim(): undefined })
              }
              placeholder="work@company.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Office</label>
              <select
                required
                value={profile.office ?? ""}
                onChange={(e) => setProfile({ ...profile, office: e.target.value as StaffOffice })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                <option value="" disabled>
                  Select office
                </option>
                {OFFICES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
              <select
                required
                value={profile.title ?? ""}
                onChange={(e) => setProfile({ ...profile, title: e.target.value as StaffTitle })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                <option value="" disabled>
                  Select title
                </option>
                {TITLES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Department</label>
              <select
                required
                value={profile.department ?? ""}
                onChange={(e) => setProfile({ ...profile, department: e.target.value as StaffDepartment })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                <option value="" disabled>
                  Select department
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Role</label>
              <select
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value as UserRole })}
                className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                {EDIT_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-60"
            >
              {loading ? "Saving…...": "Save profile"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Role & function access "
        description="Fine-grained tools this user can open. Admin User and Super Admin roles still bypass some checks elsewhere in the app."
      >
        <form onSubmit={saveAccess} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Role</label>
            <select
              value={access.role}
              onChange={(e) => setAccess({ ...access, role: e.target.value as UserRole })}
              className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            >
              {EDIT_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Function access</p>
              <span className="text-xs text-slate-400">
                {(access.permissions || []).length} selected
              </span>
            </div>
            <PermissionTree
              permissions={access.permissions || []}
              onChange={(key) =>
                setAccess((prev) => ({
                  ...prev,
                  permissions: togglePermission(prev.permissions || [], key),
                }))
              }
            />
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-60"
            >
              {loading ? "Saving…...": "Save access"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Reset password" description="Set a new password for this login. Share it securely with the user.">
        <form onSubmit={submitPassword} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">New password</label>
            <div className="flex gap-2">
              <input
                type="text"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
              <button
                type="button"
                onClick={() => setNewPassword(randomPassword8())}
                className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Generate 8 8 
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
          >
            Update password
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
