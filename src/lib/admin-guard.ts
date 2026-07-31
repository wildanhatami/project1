import 'server-only';
import { auth } from '@/lib/auth';

/**
 * Helper untuk API routes admin: pastikan user terautentikasi & ber-role admin.
 * Return null jika tidak berhak.
 */
export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }
  return session;
}
