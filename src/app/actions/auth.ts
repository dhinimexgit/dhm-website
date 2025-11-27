'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const adminUsersEnv = process.env.ADMIN_USERS;
  
  if (!adminUsersEnv) {
    console.error('ADMIN_USERS environment variable is not set');
    return { error: 'Server configuration error' };
  }

  let adminUsers = [];
  try {
    adminUsers = JSON.parse(adminUsersEnv);
  } catch (e) {
    console.error('Failed to parse ADMIN_USERS', e);
    return { error: 'Server configuration error' };
  }

  const user = adminUsers.find((u: any) => u.email === email && u.password === password);

  if (user) {
    // Valid credentials
    const cookieStore = await cookies();
    cookieStore.set('dhm_admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    redirect('/dhm-myadmin');
  } else {
    return { error: 'Invalid credentials' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('dhm_admin_session');
  redirect('/dhm-myadmin/login');
}

