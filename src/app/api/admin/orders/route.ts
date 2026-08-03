import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { getOrders } from '@/lib/notion';
import { errorMessage } from '@/lib/error';

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[api] GET /admin/orders error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal mengambil data pesanan') },
      { status: 500 }
    );
  }
}
