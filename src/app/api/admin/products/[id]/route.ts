import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminApi } from '@/lib/admin-guard';
import { deleteProduct, updateProduct } from '@/lib/notion';
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
    const result = await updateProduct(id, {
      description: body.description,
      isActive: body.isActive,
      isBestseller: body.isBestseller,
      sizes: body.sizes,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Segarkan cache halaman katalog & beranda (ISR)
    revalidatePath('/katalog');
    revalidatePath('/');

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api] PATCH /admin/products/[id] error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal memperbarui produk') },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await deleteProduct(id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    revalidatePath('/katalog');
    revalidatePath('/');

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api] DELETE /admin/products/[id] error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal menghapus produk') },
      { status: 500 }
    );
  }
}
