import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('ff_session')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/incomes', '/expenses', '/settings'];
  const isProtected = protectedPaths.some((p: string) => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === '/login') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/incomes/:path*', '/expenses/:path*', '/settings/:path*', '/login'],
};
