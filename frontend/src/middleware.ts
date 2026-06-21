import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // In Next.js middleware, we can't easily read localStorage (Zustand persist).
  // Ideally, tokens should be in HttpOnly cookies, but since we're using localStorage,
  // we'll rely on the client-side to redirect if they don't have a token.
  // However, for route protection, we can check if they have a cookie, 
  // but since our auth is localStorage-based, server-side middleware has limits.
  // So we will implement a basic check here if we decide to move to cookies later,
  // OR we can leave this as a pass-through and let a client-side wrapper handle it.
  // For the sake of the requirement, here is the middleware skeleton.
  
  // Example: If we were using cookies
  // const token = request.cookies.get('token');
  // if (!token) return NextResponse.redirect(new URL('/login', request.url));
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/goals/:path*',
    '/portfolio/:path*',
    '/analytics/:path*',
    '/learning/:path*',
    '/settings/:path*'
  ],
};
