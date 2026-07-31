import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminApi } from '@/lib/admin-guard';
import { uploadProductImage } from '@/lib/notion';
import { errorMessage } from '@/lib/error';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB (batas aman di bawah 20MB Notion)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format gambar tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran gambar maksimal 15MB.' },
        { status: 400 }
      );
    }

    const result = await uploadProductImage(id, {
      name: file.name,
      type: file.type,
      data: file, // File extends Blob
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    revalidatePath('/katalog');
    revalidatePath('/');

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api] POST /admin/products/[id]/image error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal mengunggah foto') },
      { status: 500 }
    );
  }
}
