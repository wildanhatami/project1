import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { getAllUsers } from '@/lib/notion-users';
import { errorMessage } from '@/lib/error';

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('[api] GET /admin/users error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal mengambil data pengguna') },
      { status: 500 }
    );
  }
}
