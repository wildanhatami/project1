import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  const fallbackUrl = url.searchParams.get('callbackUrl');

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session.user.role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  const destination = fallbackUrl && fallbackUrl !== '/' ? fallbackUrl : '/';
  return NextResponse.redirect(new URL(destination, request.url));
}
