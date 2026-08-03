import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ role: null, authenticated: false });
  }
  return NextResponse.json({
    role: session.user.role || 'customer',
    authenticated: true,
    email: session.user.email,
  });
}
