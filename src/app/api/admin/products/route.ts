import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { getAllProducts } from '@/lib/notion';
import { errorMessage } from '@/lib/error';

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('[api] GET /admin/products error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal mengambil produk') },
      { status: 500 }
    );
  }
}
