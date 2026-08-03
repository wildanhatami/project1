import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { getAllProducts, createProduct } from '@/lib/notion';
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

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const isActive = formData.get('isActive') === 'true';
    const isBestseller = formData.get('isBestseller') === 'true';
    const sizesJson = formData.get('sizes') as string | null;
    const image = formData.get('image') as File | null;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nama produk wajib diisi' }, { status: 400 });
    }

    let sizes: { size: string; price: number }[] = [];
    if (sizesJson) {
      try {
        sizes = JSON.parse(sizesJson);
      } catch {
        return NextResponse.json({ error: 'Format varian ukuran tidak valid' }, { status: 400 });
      }
    }

    const result = await createProduct({
      name: name.trim(),
      description: description?.trim() || undefined,
      isActive,
      isBestseller,
      sizes: sizes.length > 0 ? sizes : undefined,
      image: image && image.size > 0 ? image : undefined,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Revalidate cache
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/katalog');
    revalidatePath('/');

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    console.error('[api] POST /admin/products error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal membuat produk') },
      { status: 500 }
    );
  }
}
