import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { updateOrderStatus, OrderStatus } from '@/lib/notion';
import { errorMessage } from '@/lib/error';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body as { status: OrderStatus };

    if (!status) {
      return NextResponse.json({ error: 'Status wajib diisi' }, { status: 400 });
    }

    const result = await updateOrderStatus(id, status);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api] PATCH /admin/orders/[id] error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal mengupdate status pesanan') },
      { status: 500 }
    );
  }
}
