'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SUPER_ADMIN_LOGIN_ID } from '@/lib/admin-auth-constants';
import { encryptAdminPassword, verifyAdminPassword } from '@/lib/admin-password-crypto';
import {
  ADMIN_SESSION_COOKIE_NAMES,
  getAdminSessionCookieOptions,
  hasValidAdminSession,
  isAdminSessionExpired,
  parseLastActivityMs,
} from '@/lib/admin-session';
import { db, requireFirebaseDb } from '@/lib/firebase';
import { collection, deleteField, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { ALL_PO_BRANCHES, canonicalPoBranchName } from '@/lib/branch-po-view-scope';

// User roles (User = standard staff; legacy: branch, marketing, management)
export type UserRole = 'super_admin' | 'admin' | 'user' | 'branch' | 'marketing' | 'management';
export type LoginMode = 'admin' | 'internal';

/** Warehouse offices: Kien Svay and Touk Meas (each covers multiple PO branch names). */
export type StaffOffice = 'Head Office' | 'KienSvay' | 'ToukMeas';

export type StaffTitle = 'Top Management' | 'Manager' | 'Supervisor' | 'Staff';

export type StaffDepartment =
  | 'Sales'
  | 'Logistics'
  | 'Technical'
  | 'Technology'
  | 'HR & Admin'
  | 'Accounting'
  | 'Operations';

const STAFF_OFFICES: StaffOffice[] = ['Head Office', 'KienSvay', 'ToukMeas'];

/** Legacy Firestore office values → current warehouse office. */
const LEGACY_STAFF_OFFICE: Record<string, StaffOffice> = {
  EPOSE: 'KienSvay',
  DangTong: 'ToukMeas',
  'Kien Svay': 'KienSvay',
  'Touk Meas': 'ToukMeas',
};
const STAFF_TITLES: StaffTitle[] = ['Top Management', 'Manager', 'Supervisor', 'Staff'];
const STAFF_DEPARTMENTS: StaffDepartment[] = [
  'Sales',
  'Logistics',
  'Technical',
  'Technology',
  'HR & Admin',
  'Accounting',
  'Operations',
];

/** Firestore rejects `undefined` field values — strip them before writes. */
function stripUndefinedForFirestore(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

function resolveStaffOffice(raw: string): StaffOffice | undefined {
  const t = raw.trim();
  const legacy = LEGACY_STAFF_OFFICE[t] ?? LEGACY_STAFF_OFFICE[t.toLowerCase()];
  if (legacy) return legacy;
  return STAFF_OFFICES.find((o) => o === t || o.toLowerCase() === t.toLowerCase());
}

function resolveStaffTitle(raw: string): StaffTitle | undefined {
  const t = raw.trim();
  return STAFF_TITLES.find((x) => x === t || x.toLowerCase() === t.toLowerCase());
}

function resolveStaffDepartment(raw: string): StaffDepartment | undefined {
  const t = raw.trim();
  return STAFF_DEPARTMENTS.find((d) => d === t || d.toLowerCase() === t.toLowerCase());
}

/** Validate/canonicalize an optional per-user PO branch; empty or unknown → undefined. */
function resolveUserBranch(raw: string): string | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const canonical = canonicalPoBranchName(t);
  return (ALL_PO_BRANCHES as readonly string[]).includes(canonical) ? canonical : undefined;
}

const VALID_ROLES: UserRole[] = ['super_admin', 'admin', 'user', 'branch', 'marketing', 'management'];
export type FunctionAccessKey =
  | 'admin.products'
  | 'admin.posts'
  | 'admin.careers'
  | 'admin.inquiries'
  | 'admin.qrcode'
  | 'admin.prpo'
  | 'admin.prpo.dashboard'
  | 'admin.prpo.submit'
  | 'admin.prpo.open'
  | 'admin.prpo.view'
  | 'admin.prpo.items'
  | 'projects.view'
  | 'projects.submit'
  | 'projects.update'
  | 'internal.rooms'
  | 'internal.cars'
  | 'internal.resource_management'
  | 'internal.user_management';

/** Managed / env admin account: login with `username` + password; `email` is optional contact only. */
export interface AdminUser {
  /** Unique login id (Firestore document id). May look like an email (e.g. admin@dhinimex.com) but is not required to be one. */
  username: string;
  password: string;
  /** Optional work / contact email — not used for authentication */
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  modes?: LoginMode[];
  permissions?: FunctionAccessKey[];
  office?: StaffOffice;
  title?: StaffTitle;
  department?: StaffDepartment;
  /** Canonical PO branch name; when set, scopes the user's PO visibility to this single branch. */
  branch?: string;
  revoked?: boolean;
}

/** Session shape returned by getCurrentUser */
export type SessionUser = {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  mode: LoginMode;
  permissions: FunctionAccessKey[];
  office?: StaffOffice;
  title?: StaffTitle;
  /** Canonical PO branch name; when set, scopes the user's PO visibility to this single branch. */
  branch?: string;
};

const ALL_FUNCTIONS: FunctionAccessKey[] = [
  'admin.products',
  'admin.posts',
  'admin.careers',
  'admin.inquiries',
  'admin.qrcode',
  'admin.prpo',
  'admin.prpo.dashboard',
  'admin.prpo.submit',
  'admin.prpo.open',
  'admin.prpo.view',
  'projects.view',
  'projects.submit',
  'projects.update',
  'internal.rooms',
  'internal.cars',
  'internal.resource_management',
  'internal.user_management',
];

const ADMIN_USERS_COLLECTION = 'admin_users';
const SUPER_ADMIN_EMAIL = SUPER_ADMIN_LOGIN_ID;

function setAdminAuthCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  user: AdminUser
) {
  const opts = getAdminSessionCookieOptions();
  const now = String(Date.now());

  cookieStore.set('dhm_admin_session', 'true', opts);
  cookieStore.set('dhm_admin_user', user.username, opts);
  cookieStore.set('dhm_admin_role', user.role, opts);
  cookieStore.set('dhm_login_mode', 'admin', opts);
  cookieStore.set('dhm_admin_last_activity', now, opts);
}

function clearAdminAuthCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  for (const name of ADMIN_SESSION_COOKIE_NAMES) {
    cookieStore.delete(name);
    cookieStore.set(name, '', { maxAge: 0, path: '/' });
  }
}

function readAdminSessionFromCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return {
    session: cookieStore.get('dhm_admin_session')?.value,
    user: cookieStore.get('dhm_admin_user')?.value,
    lastActivity: cookieStore.get('dhm_admin_last_activity')?.value,
  };
}

function getDefaultPermissionsByRole(role: UserRole): FunctionAccessKey[] {
  if (role === 'super_admin' || role === 'admin') return ALL_FUNCTIONS;
  if (role === 'marketing') return ['admin.qrcode'];
  // user, branch, management: no default — admin assigns explicitly
  return [];
}

function coerceRole(role: unknown): UserRole {
  return typeof role === 'string' && VALID_ROLES.includes(role as UserRole) ? (role as UserRole) : 'user';
}

function normalizeUser(user: AdminUser): AdminUser {
  const role = coerceRole(user.role);
  const hadExplicitUsername = !!(user.username && String(user.username).trim());
  const loginUsername = (user.username || user.email || '').trim().toLowerCase();

  let contactEmail: string | undefined;
  if (hadExplicitUsername && user.email?.trim()) {
    const em = user.email.trim().toLowerCase();
    contactEmail = em && em !== loginUsername ? em : undefined;
  }

  return {
    ...user,
    role,
    username: loginUsername,
    email: contactEmail,
    modes: user.modes && user.modes.length > 0 ? user.modes : ['internal'],
    permissions:
      user.permissions && user.permissions.length > 0
        ? user.permissions
        : getDefaultPermissionsByRole(role),
  };
}

function dedupeUsersByUsername(users: AdminUser[]): AdminUser[] {
  const merged = new Map<string, AdminUser>();
  for (const user of users) {
    if (!user.username) continue;
    merged.set(user.username, user);
  }
  return Array.from(merged.values());
}

// Get all admin users with their roles
async function getAdminUsers(): Promise<AdminUser[]> {
  const adminUsersEnv = process.env.ADMIN_USERS;
  
  let envUsers: AdminUser[] = [];
  
  if (adminUsersEnv) {
    try {
      const parsed = JSON.parse(adminUsersEnv) as Partial<AdminUser>[];
      envUsers = parsed.map((u) =>
        normalizeUser({
          ...(u as AdminUser),
          username: ((u.username || u.email) ?? '').toString().trim(),
          password: (u.password ?? '').toString(),
          role: (u.role ?? 'user') as UserRole,
        } as AdminUser)
      );
    } catch (e) {
      console.error('Failed to parse ADMIN_USERS', e);
    }
  }

  // Hardcoded master credentials that will ALWAYS work
  const defaultUsers: AdminUser[] = [
    {
      username: SUPER_ADMIN_LOGIN_ID,
      email: SUPER_ADMIN_LOGIN_ID,
      password: 'dhmnewadmin@2025',
      role: 'super_admin',
      modes: ['admin', 'internal'],
    },
  ];

  const users = dedupeUsersByUsername([...defaultUsers, ...envUsers].map(normalizeUser));

  if (!db) return users;

  try {
    const managedUsersSnapshot = await getDocs(collection(db, ADMIN_USERS_COLLECTION));
    const managedUsers = managedUsersSnapshot.docs
      .map((snapshot) => {
        const data = snapshot.data() as AdminUser & { email?: string };
        const merged: AdminUser = {
          ...data,
          username: (data.username || snapshot.id || data.email || '').trim().toLowerCase(),
        };
        return normalizeUser(merged);
      })
      .filter((u) => u.username !== SUPER_ADMIN_LOGIN_ID);

    return dedupeUsersByUsername([...users, ...managedUsers]);
  } catch (error) {
    console.error('Failed to load managed users', error);
    return users;
  }
}

export async function login(formData: FormData) {
  const loginId =
    ((formData.get('username') as string) || (formData.get('email') as string) || '').trim().toLowerCase();
  const passwordRaw = ((formData.get('password') as string) || '').toString();

  if (!loginId) {
    return { error: 'Username is required.' };
  }

  const adminUsers = await getAdminUsers();
  const user = adminUsers.find((u) => u.username === loginId && verifyAdminPassword(u.password, passwordRaw));

  if (user?.revoked) {
    return { error: 'This account has been deactivated. Contact your administrator.' };
  }

  if (user) {
    const cookieStore = await cookies();
    setAdminAuthCookies(cookieStore, user);
    redirect('/dhm-myadmin');
  } else {
    return { error: 'Invalid credentials' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  clearAdminAuthCookies(cookieStore);
  redirect('/dhm-myadmin/login');
}

/** Refresh last-activity timestamp for an active admin session. */
export async function touchAdminSession(): Promise<{ valid: boolean }> {
  const cookieStore = await cookies();
  const { session, user, lastActivity } = readAdminSessionFromCookies(cookieStore);

  if (!hasValidAdminSession(session, user, lastActivity)) {
    clearAdminAuthCookies(cookieStore);
    return { valid: false };
  }

  cookieStore.set(
    'dhm_admin_last_activity',
    String(Date.now()),
    getAdminSessionCookieOptions()
  );
  return { valid: true };
}

/** Verify the current admin session is still within the inactivity window. */
export async function checkAdminSession(): Promise<{ valid: boolean }> {
  const cookieStore = await cookies();
  const { session, user, lastActivity } = readAdminSessionFromCookies(cookieStore);
  const valid = hasValidAdminSession(session, user, lastActivity);

  if (!valid && (session || user)) {
    clearAdminAuthCookies(cookieStore);
  }

  return { valid };
}

// Get current user info from session
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('dhm_admin_session');
  const loginCookie = cookieStore.get('dhm_admin_user');
  const roleCookie = cookieStore.get('dhm_admin_role');
  const modeCookie = cookieStore.get('dhm_login_mode');
  const lastActivityCookie = cookieStore.get('dhm_admin_last_activity');

  if (!session?.value || !loginCookie?.value) {
    return null;
  }

  const lastActivityMs = parseLastActivityMs(lastActivityCookie?.value);
  if (isAdminSessionExpired(lastActivityMs)) {
    return null;
  }

  const loginId = loginCookie.value.toLowerCase();
  const mode = (modeCookie?.value as LoginMode) || 'admin';

  if (loginId === SUPER_ADMIN_LOGIN_ID) {
    return {
      username: SUPER_ADMIN_LOGIN_ID,
      email: SUPER_ADMIN_LOGIN_ID,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      mode,
      permissions: ALL_FUNCTIONS,
      office: undefined,
      title: undefined,
    };
  }

  const adminUsers = await getAdminUsers();
  const storedUser = adminUsers.find((u) => u.username === loginId);

  if (!storedUser) return null;
  if (storedUser.revoked) return null;

  return {
    username: storedUser.username,
    email: storedUser.email,
    firstName: storedUser.firstName,
    lastName: storedUser.lastName,
    role: (roleCookie?.value as UserRole) || storedUser.role,
    mode,
    permissions: storedUser.permissions?.length
      ? storedUser.permissions
      : getDefaultPermissionsByRole(storedUser.role),
    office: storedUser.office,
    title: storedUser.title,
    branch: storedUser.branch,
  };
}

export async function canAccessFunction(functionKey: FunctionAccessKey): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  if (user.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID) return true;
  if (functionKey === 'internal.user_management') {
    return canManageUsersSession(user);
  }
  if (user.role === 'super_admin' || user.role === 'admin') return true;
  return user.permissions.includes(functionKey);
}

/** Bootstrap account always has access. Otherwise Admin or Super Admin role plus explicit permission. */
function canManageUsersSession(user: SessionUser): boolean {
  if (user.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID) return true;
  const elevated = user.role === 'super_admin' || user.role === 'admin';
  return elevated && user.permissions.includes('internal.user_management');
}

function ensureUserManagementAccess(user: SessionUser | null): { ok: boolean; error?: string } {
  if (!user) {
    return { ok: false, error: 'You must be signed in.' };
  }
  if (!canManageUsersSession(user)) {
    return {
      ok: false,
      error: 'You need an Admin or Super Admin role and the User Management permission.',
    };
  }
  return { ok: true };
}

function serializeUser(user: AdminUser): AdminUser {
  // Strip any Firestore Timestamp fields so the object is plain-serializable
  const { ...plain } = user as AdminUser & Record<string, unknown>;
  delete plain.updatedAt;
  delete plain.createdAt;
  return { ...(plain as AdminUser), password: '' };
}

export async function listManagedUsers(): Promise<{ success: boolean; users: AdminUser[]; error?: string }> {
  try {
    const user = await getCurrentUser();
    const superAdminCheck = ensureUserManagementAccess(user);
    if (!superAdminCheck.ok) {
      return { success: false, users: [], error: superAdminCheck.error };
    }

    const users = await getAdminUsers();
    const managedUsers = users
      .filter((entry) => entry.username !== SUPER_ADMIN_LOGIN_ID)
      .map(serializeUser);
    return { success: true, users: managedUsers };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return { success: false, users: [], error: message };
  }
}

/** Single managed user (requires User Management access). `loginId` is the account username (document id). */
export async function getManagedUserByUsername(
  rawLoginId: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const current = await getCurrentUser();
    const superAdminCheck = ensureUserManagementAccess(current);
    if (!superAdminCheck.ok) {
      return { success: false, error: superAdminCheck.error };
    }

    const normalized = rawLoginId.trim().toLowerCase();
    if (!normalized) {
      return { success: false, error: "Username is required." };
    }
    if (normalized === SUPER_ADMIN_LOGIN_ID) {
      return { success: false, error: "This account cannot be opened here." };
    }

    const users = await getAdminUsers();
    const found = users.find((u) => u.username === normalized);
    if (!found) {
      return { success: false, error: "User not found." };
    }

    return { success: true, user: serializeUser(normalizeUser(found)) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { success: false, error: message };
  }
}

function validateLoginUsername(raw: string): { username: string; error?: string } {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return { username: '', error: 'Username is required.' };
  if (trimmed.length > 128) return { username: '', error: 'Username is too long.' };
  if (!/^[a-z0-9@._-]+$/i.test(trimmed)) {
    return {
      username: '',
      error: 'Username may only contain letters, numbers, @, dot, underscore, and hyphen.',
    };
  }
  return { username: trimmed };
}

function validatePersonName(raw: string | undefined, label: string): { value: string; error?: string } {
  const v = (raw ?? '').trim();
  if (!v) return { value: '', error: `${label} is required.` };
  if (v.length > 80) return { value: '', error: `${label} is too long.` };
  return { value: v };
}

function validateOptionalContactEmail(raw: string | undefined): { email?: string; error?: string } {
  if (!raw?.trim()) return { email: undefined };
  const t = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
    return { error: 'Optional email must be a valid address.' };
  }
  return { email: t };
}

export async function createManagedUser(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getCurrentUser();
    const superAdminCheck = ensureUserManagementAccess(current);
    if (!superAdminCheck.ok) return { success: false, error: superAdminCheck.error };

    const usernameRaw = (formData.get('username') as string) || '';
    const { username, error: userError } = validateLoginUsername(usernameRaw);
    if (userError) return { success: false, error: userError };

    const optionalEmailRaw = (formData.get('email') as string) || '';
    const { email: optionalEmail, error: optErr } = validateOptionalContactEmail(optionalEmailRaw);
    if (optErr) return { success: false, error: optErr };
    const contactEmail =
      optionalEmail && optionalEmail !== username ? optionalEmail : undefined;

    const password = (formData.get('password') as string).trim();
    const role = coerceRole(formData.get('role') as string);
    const modes = formData.getAll('modes') as LoginMode[];
    const permissions = formData.getAll('permissions') as FunctionAccessKey[];

    const office = resolveStaffOffice((formData.get('office') as string) || '');
    const title = resolveStaffTitle((formData.get('title') as string) || '');
    const department = resolveStaffDepartment((formData.get('department') as string) || '');
    const branch = resolveUserBranch((formData.get('branch') as string) || '');
    const { value: firstName, error: firstErr } = validatePersonName(
      formData.get('firstName') as string,
      'First name'
    );
    if (firstErr) return { success: false, error: firstErr };
    const { value: lastName, error: lastErr } = validatePersonName(
      formData.get('lastName') as string,
      'Last name'
    );
    if (lastErr) return { success: false, error: lastErr };

    if (!password) {
      return { success: false, error: 'Password is required.' };
    }

    if (username === SUPER_ADMIN_LOGIN_ID) {
      return { success: false, error: 'Super admin account cannot be recreated here.' };
    }

    if (!office) {
      return { success: false, error: 'Office is required.' };
    }
    if (!title) {
      return { success: false, error: 'Title is required.' };
    }
    if (!department) {
      return { success: false, error: 'Department is required.' };
    }

    const normalized = normalizeUser({
      username,
      email: contactEmail,
      firstName,
      lastName,
      password,
      role,
      modes: modes.length > 0 ? modes : ['internal', 'admin'],
      permissions,
      office,
      title,
      department,
      branch,
      revoked: false,
    });

    const payload = stripUndefinedForFirestore({
      ...(normalized as unknown as Record<string, unknown>),
      password: encryptAdminPassword(password),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(requireFirebaseDb(), ADMIN_USERS_COLLECTION, normalized.username), payload, { merge: true });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return { success: false, error: message };
  }
}

export async function resetManagedUserPassword(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getCurrentUser();
    const superAdminCheck = ensureUserManagementAccess(current);
    if (!superAdminCheck.ok) return { success: false, error: superAdminCheck.error };

    const loginId = (formData.get('username') as string).trim().toLowerCase();
    const newPassword = (formData.get('newPassword') as string).trim();

    if (!loginId || !newPassword) {
      return { success: false, error: 'Username and new password are required.' };
    }

    if (loginId === SUPER_ADMIN_LOGIN_ID) {
      return { success: false, error: 'Super admin password should be managed securely in environment defaults.' };
    }

    await setDoc(doc(requireFirebaseDb(), ADMIN_USERS_COLLECTION, loginId), {
      password: encryptAdminPassword(newPassword),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return { success: false, error: message };
  }
}

export async function updateManagedUserAccess(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getCurrentUser();
    const superAdminCheck = ensureUserManagementAccess(current);
    if (!superAdminCheck.ok) return { success: false, error: superAdminCheck.error };

    const loginId = (formData.get('username') as string).trim().toLowerCase();
    const role = coerceRole(formData.get('role') as string);
    const modes = formData.getAll('modes') as LoginMode[];
    const permissions = formData.getAll('permissions') as FunctionAccessKey[];

    if (!loginId) return { success: false, error: 'Username is required.' };
    if (loginId === SUPER_ADMIN_LOGIN_ID) {
      return { success: false, error: 'Super admin access is fixed and cannot be edited here.' };
    }

    const normalized = normalizeUser({
      username: loginId,
      password: '',
      role,
      modes: modes.length > 0 ? modes : ['internal'],
      permissions,
    });

    await setDoc(
      doc(requireFirebaseDb(), ADMIN_USERS_COLLECTION, loginId),
      {
        username: normalized.username,
        role: normalized.role,
        modes: normalized.modes,
        permissions: normalized.permissions,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return { success: false, error: message };
  }
}

export async function updateManagedUserDetails(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getCurrentUser();
    const superAdminCheck = ensureUserManagementAccess(current);
    if (!superAdminCheck.ok) return { success: false, error: superAdminCheck.error };

    const loginId = (formData.get('username') as string).trim().toLowerCase();
    if (!loginId) return { success: false, error: 'Username is required.' };
    if (loginId === SUPER_ADMIN_LOGIN_ID) {
      return { success: false, error: 'Super admin profile cannot be edited here.' };
    }

    const optionalEmailRaw = (formData.get('email') as string) || '';
    const { email: optionalEmail, error: optErr } = validateOptionalContactEmail(optionalEmailRaw);
    if (optErr) return { success: false, error: optErr };

    const office = resolveStaffOffice((formData.get('office') as string) || '');
    const title = resolveStaffTitle((formData.get('title') as string) || '');
    const department = resolveStaffDepartment((formData.get('department') as string) || '');
    const branch = resolveUserBranch((formData.get('branch') as string) || '');
    const role = coerceRole(formData.get('role') as string);
    const { value: firstName, error: firstErr } = validatePersonName(
      formData.get('firstName') as string,
      'First name'
    );
    if (firstErr) return { success: false, error: firstErr };
    const { value: lastName, error: lastErr } = validatePersonName(
      formData.get('lastName') as string,
      'Last name'
    );
    if (lastErr) return { success: false, error: lastErr };

    if (!office) {
      return { success: false, error: 'Select a valid office.' };
    }
    if (!title) {
      return { success: false, error: 'Select a valid title.' };
    }
    if (!department) {
      return { success: false, error: 'Select a valid department.' };
    }

    const patch: Record<string, unknown> = {
      username: loginId,
      firstName,
      lastName,
      office,
      title,
      department,
      branch: branch ?? deleteField(),
      role,
      updatedAt: serverTimestamp(),
    };
    if (optionalEmail && optionalEmail !== loginId) {
      patch.email = optionalEmail;
    } else {
      patch.email = deleteField();
    }

    await setDoc(doc(requireFirebaseDb(), ADMIN_USERS_COLLECTION, loginId), stripUndefinedForFirestore(patch), { merge: true });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return { success: false, error: message };
  }
}

export async function setManagedUserRevoked(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getCurrentUser();
    const superAdminCheck = ensureUserManagementAccess(current);
    if (!superAdminCheck.ok) return { success: false, error: superAdminCheck.error };

    const loginId = (formData.get('username') as string).trim().toLowerCase();
    const revoked = formData.get('revoked') === 'true' || formData.get('revoked') === '1';

    if (!loginId) return { success: false, error: 'Username is required.' };
    if (loginId === SUPER_ADMIN_LOGIN_ID) {
      return { success: false, error: 'Super admin cannot be revoked here.' };
    }

    await setDoc(
      doc(requireFirebaseDb(), ADMIN_USERS_COLLECTION, loginId),
      { revoked, updatedAt: serverTimestamp() },
      { merge: true }
    );

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return { success: false, error: message };
  }
}
