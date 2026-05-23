"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createManagedUser,
  listManagedUsers,
  type AdminUser,
  type FunctionAccessKey,
  type StaffDepartment,
  type StaffOffice,
  type StaffTitle,
  type UserRole,
} from "@/app/actions/auth";
import {
  AccountStatusPill,
  CREATE_ROLES,
  DEPARTMENTS,
  OFFICES,
  OFFICE_LABELS,
  formatStaffOfficeLabel,
  PermissionTree,
  RolePill,
  TITLES,
  displayName,
  randomPassword8,
  togglePermission,
  withNormalizedPermissions,
} from "./user-management-shared";
import { useLanguage } from "@/lib/i18n";

const PAGE_SIZE = 10;

function IconView() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

export function UserManagementClient({
  initialUsers,
  initialError,
}: {
  initialUsers: AdminUser[];
  initialError: string;
}) {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers.map(withNormalizedPermissions));
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newOffice, setNewOffice] = useState<StaffOffice>("Head Office");
  const [newTitle, setNewTitle] = useState<StaffTitle>("Staff");
  const [newDepartment, setNewDepartment] = useState<StaffDepartment>("Sales");
  const [newRole, setNewRole] = useState<UserRole>("user");
  const [newPermissions, setNewPermissions] = useState<FunctionAccessKey[]>([]);

  const [page, setPage] = useState(1);

  const loadUsers = async () => {
    setLoading(true);
    const result = await listManagedUsers();
    if (!result.success) {
      setError(result.error || "Failed to load users.");
      setUsers([]);
    } else {
      setUsers(result.users.map(withNormalizedPermissions));
      setError("");
    }
    setLoading(false);
  };

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.username.localeCompare(b.username)),
    [users]
  );

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const effectivePage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return sortedUsers.slice(start, start + PAGE_SIZE);
  }, [sortedUsers, effectivePage]);

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("username", newUsername.trim());
    formData.append("firstName", newFirstName.trim());
    formData.append("lastName", newLastName.trim());
    if (newContactEmail.trim()) {
      formData.append("email", newContactEmail.trim());
    }
    formData.append("password", newPassword);
    formData.append("role", newRole);
    ["internal", "admin"].forEach((mode) => formData.append("modes", mode));
    newPermissions.forEach((permission) => formData.append("permissions", permission));
    formData.append("office", newOffice);
    formData.append("title", newTitle);
    formData.append("department", newDepartment);

    const result = await createManagedUser(formData);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Failed to create user.");
      setSuccess("");
      return;
    }

    setSuccess(`Account created for ${newUsername.trim()}.`);
    setError("");
    setNewUsername("");
    setNewFirstName("");
    setNewLastName("");
    setNewContactEmail("");
    setNewPassword("");
    setNewOffice("Head Office");
    setNewTitle("Staff");
    setNewDepartment("Sales");
    setNewRole("user");
    setNewPermissions([]);
    setPage(1);
    await loadUsers();
  };

  return (
    <div className="space-y-10">
      {error ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      ): null}
      {success ? (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </div>
      ): null}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">{t.admin.userMgmt.createNewUser}</h2>
          <p className="text-sm text-slate-500">
            {t.admin.userMgmt.loginUses}
          </p>
        </div>

        <form onSubmit={handleCreateUser} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-4 border-b border-slate-100 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t.admin.userMgmt.username}</label>
              <input
                required
                type="text"
                autoComplete="off"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. jdoe (used to sign in)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t.admin.userMgmt.firstName}
              </label>
              <input
                required
                type="text"
                autoComplete="given-name"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                placeholder="e.g. Sok"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t.admin.userMgmt.lastName}
              </label>
              <input
                required
                type="text"
                autoComplete="family-name"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                placeholder="e.g. Chan"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t.admin.userMgmt.emailOpt}
              </label>
              <input
                type="email"
                autoComplete="off"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                placeholder="work@company.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t.admin.userMgmt.password}</label>
              <div className="flex gap-2">
                <input
                  required
                  type="text"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.admin.userMgmt.setPassword}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
                <button
                  type="button"
                  onClick={() => setNewPassword(randomPassword8())}
                  className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Generate 8
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t.admin.userMgmt.office}</label>
              <select
                required
                value={newOffice}
                onChange={(e) => setNewOffice(e.target.value as StaffOffice)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                {OFFICES.map((o) => (
                  <option key={o} value={o}>
                    {OFFICE_LABELS[o]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t.admin.userMgmt.roleTitle}</label>
              <select
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value as StaffTitle)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                {TITLES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t.admin.userMgmt.department}</label>
              <select
                required
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value as StaffDepartment)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t.admin.userMgmt.role}</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                {CREATE_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.admin.userMgmt.functionAccess}</p>
              <span className="text-xs text-slate-400">
                {newPermissions.length} permission{newPermissions.length !== 1 ? "s": ""} selected
              </span>
            </div>
            <PermissionTree
              permissions={newPermissions}
              onChange={(key) => setNewPermissions((prev) => togglePermission(prev, key))}
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 px-4 py-4 sm:px-6">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t.admin.userMgmt.creating : t.admin.userMgmt.createUser}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{t.admin.userMgmt.manageUsers}</h2>
            <p className="text-sm text-slate-500">
              Open a profile to review details, or edit to change access, password, and active status.
            </p>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center justify-center gap-2 self-start rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 sm:self-auto"
          >
            <svg className={`h-3.5 w-3.5 ${loading ? "animate-spin": ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t.admin.userMgmt.refresh}
          </button>
        </div>

        {sortedUsers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <p className="text-sm text-slate-500">{loading ? "Loading users...": "No managed users yet."}</p>
          </div>
        ): (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 touch-pan-x [-webkit-overflow-scrolling:touch]">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">{t.admin.userMgmt.user}</th>
                    <th className="px-4 py-3">{t.admin.userMgmt.email}</th>
                    <th className="px-4 py-3">{t.admin.userMgmt.office}</th>
                    <th className="px-4 py-3">{t.admin.userMgmt.roleTitle}</th>
                    <th className="px-4 py-3">{t.admin.userMgmt.department}</th>
                    <th className="px-4 py-3">{t.admin.userMgmt.role}</th>
                    <th className="px-4 py-3">{t.admin.userMgmt.status}</th>
                    <th className="px-4 py-3 text-right">{t.admin.userMgmt.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageSlice.map((user) => {
                    const permCount = (user.permissions || []).length;
                    const enc = encodeURIComponent(user.username);
                    const isActive = !user.revoked;
                    return (
                      <tr key={user.username} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-xs font-bold text-brand-navy">
                              {displayName(user).charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800">{displayName(user)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle font-mono text-xs text-slate-600">{user.email ?? "—"}</td>
                        <td className="px-4 py-3 align-middle text-slate-600">
                          {formatStaffOfficeLabel(user.office)}
                        </td>
                        <td className="px-4 py-3 align-middle text-slate-600">{user.title ?? "—"}</td>
                        <td className="px-4 py-3 align-middle text-slate-600">{user.department ?? "—"}</td>
                        <td className="px-4 py-3 align-middle">
                          <RolePill role={user.role} />
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <AccountStatusPill active={isActive} />
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dhm-myadmin/user-management/${enc}/view`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand-navy hover:bg-brand-navy/5 hover:text-brand-navy"
                              title="View user"
                              aria-label="View user"
                            >
                              <IconView />
                            </Link>
                            <Link
                              href={`/dhm-myadmin/user-management/${enc}/edit`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand-navy hover:bg-brand-navy/5 hover:text-brand-navy"
                              title="Edit user"
                              aria-label="Edit user"
                            >
                              <IconEdit />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-stretch justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                {t.admin.userMgmt.showing} {(effectivePage - 1) * PAGE_SIZE + 1}–{Math.min(effectivePage * PAGE_SIZE, sortedUsers.length)} {t.admin.userMgmt.of}{" "}
                {sortedUsers.length}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={effectivePage <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, Math.min(p, totalPages) - 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  {t.admin.userMgmt.previous}
                </button>
                <span className="text-xs font-medium text-slate-600">
                  {t.admin.userMgmt.page} {effectivePage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={effectivePage >= totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, Math.max(1, Math.min(p, totalPages)) + 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  {t.admin.userMgmt.next}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
