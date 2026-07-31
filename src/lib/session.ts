import 'server-only';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/lib/notion-users';

/**
 * Dapatkan session saat ini. Returns null jika tidak ada session.
 */
export async function getSession() {
  return auth();
}

/**
 * Dapatkan user dari session. Redirect ke /login jika tidak authenticated.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

/**
 * Dapatkan user dengan role admin. Redirect ke /unauthorized jika bukan admin.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  if (session.user.role !== 'admin') {
    redirect('/unauthorized');
  }
  return session;
}

/**
 * Cek apakah user saat ini adalah admin (untuk server components).
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'admin';
}

/**
 * Cek role user saat ini.
 */
export async function getCurrentRole(): Promise<UserRole | null> {
  const session = await auth();
  return (session?.user?.role as UserRole) ?? null;
}
