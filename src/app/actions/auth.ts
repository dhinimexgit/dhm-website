'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// User roles
export type UserRole = 'admin' | 'marketing';

export interface AdminUser {
  email: string;
  password: string;
  role: UserRole;
}

// Get all admin users with their roles
function getAdminUsers(): AdminUser[] {
  const adminUsersEnv = process.env.ADMIN_USERS;
  
  let envUsers: AdminUser[] = [];
  
  if (adminUsersEnv) {
    try {
      envUsers = JSON.parse(adminUsersEnv);
    } catch (e) {
      console.error('Failed to parse ADMIN_USERS', e);
    }
  }

  // Hardcoded master credentials that will ALWAYS work
  const defaultUsers: AdminUser[] = [
    { email: "admin@dhinimex.com", password: "dhmnewadmin@2025", role: "admin" },
    { email: "marketing@dhinimex.com", password: "marketing123", role: "marketing" }
  ];
  
  return [...defaultUsers, ...envUsers];
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const adminUsers = getAdminUsers();
  const user = adminUsers.find((u) => u.email === email && u.password === password);

  if (user) {
    // Valid credentials
    const cookieStore = await cookies();
    
    // Store session status
    cookieStore.set('dhm_admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });
    
    // Store user email for role checking
    cookieStore.set('dhm_admin_user', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });
    
    // Store user role
    cookieStore.set('dhm_admin_role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });
    
    redirect('/dhm-myadmin');
  } else {
    return { error: 'Invalid credentials' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  
  // Clear all auth cookies
  cookieStore.delete('dhm_admin_session');
  cookieStore.delete('dhm_admin_user');
  cookieStore.delete('dhm_admin_role');
  
  // Also set empty values with maxAge 0 for thorough cleanup
  cookieStore.set('dhm_admin_session', '', { maxAge: 0, path: '/' });
  cookieStore.set('dhm_admin_user', '', { maxAge: 0, path: '/' });
  cookieStore.set('dhm_admin_role', '', { maxAge: 0, path: '/' });
  
  redirect('/dhm-myadmin/login');
}

// Get current user info from session
export async function getCurrentUser(): Promise<{ email: string; role: UserRole } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('dhm_admin_session');
  const email = cookieStore.get('dhm_admin_user');
  const role = cookieStore.get('dhm_admin_role');
  
  if (!session || !email || !role) {
    return null;
  }
  
  return {
    email: email.value,
    role: role.value as UserRole
  };
}
