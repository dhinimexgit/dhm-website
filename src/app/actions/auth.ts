'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const adminUsersEnv = process.env.ADMIN_USERS;
  
  let adminUsers = [];
  
  if (adminUsersEnv) {
    try {
      adminUsers = JSON.parse(adminUsersEnv);
    } catch (e) {
      console.error('Failed to parse ADMIN_USERS', e);
      // Fallback to default users if parsing fails
    }
  }
  
  // Fallback credentials if env var is missing or parsing failed
  if (adminUsers.length === 0) {
    console.log('Using fallback credentials');
    adminUsers = [
      { email: "admin@dhinimex.com", password: "dhmnewadmin@2025" },
      { email: "marketing@dhinimex.com", password: "marketing123" }
    ];
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
  // Explicitly delete with path to ensure it clears correctly
  cookieStore.delete('dhm_admin_session');
  // Also try deleting with path options if the above simple delete doesn't catch it in some environments
  cookieStore.set('dhm_admin_session', '', { maxAge: 0, path: '/' });
  
  redirect('/dhm-myadmin/login');
}
