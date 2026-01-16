import { NextResponse } from 'next/server';
import { verifyToken } from './app/lib/auth';

// Only these routes are public
const publicPaths = [
  '/',              // homepage
  '/Auth',          // main auth page
  '/deals',         // deals page
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/verify',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // --- Token handling ---
  const cookieToken = request.cookies.get('accessToken')?.value;
  let token = cookieToken;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  }

  if (!token) {
    if (pathname.startsWith('/api/')|| pathname.startsWith('/products/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } else {
      const loginUrl = new URL('/Auth?mode=signin', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  try {
    const decoded = await verifyToken(token);
    if (!decoded) throw new Error('Invalid token');

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (error) {
    console.error('Middleware auth error:', error);

    const response = (pathname.startsWith('/api/') || pathname.startsWith('/products/'))
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/Auth?mode=signin', request.url));

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
