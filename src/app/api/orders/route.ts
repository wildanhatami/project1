import { NextResponse } from 'next/server';
import { createOrder, OrderItemInput } from '@/lib/notion';
import { errorMessage } from '@/lib/error';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const totalAmount = Number(formData.get('totalAmount'));
    const orderMethod = formData.get('orderMethod') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const itemsJson = formData.get('items') as string;
    const paymentProof = formData.get('paymentProof') as File | null;

    if (!customerName?.trim()) {
      return NextResponse.json({ error: 'Nama pelanggan wajib diisi' }, { status: 400 });
    }

    let items: OrderItemInput[] = [];
    if (itemsJson) {
      try {
        items = JSON.parse(itemsJson);
      } catch {
        return NextResponse.json({ error: 'Format item pesanan tidak valid' }, { status: 400 });
      }
    }

    const result = await createOrder({
      customerName: customerName.trim(),
      customerEmail: customerEmail?.trim() || '',
      items,
      totalAmount,
      orderMethod: orderMethod || '',
      paymentMethod: paymentMethod || '',
      paymentProof: paymentProof && paymentProof.size > 0 ? paymentProof : undefined,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    console.error('[api] POST /api/orders error:', error);
    return NextResponse.json(
      { error: errorMessage(error, 'Gagal mencatat pesanan') },
      { status: 500 }
    );
  }
}
