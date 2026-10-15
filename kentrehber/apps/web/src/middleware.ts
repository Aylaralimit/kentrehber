import { NextResponse, type NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const dev = process.env.NODE_ENV !== 'production';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://imagedelivery.net",
    "font-src 'self'",
    "connect-src 'self'" + (dev ? ' ws:' : ''),
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Cache-Control', 'private, no-store');
  if (!dev)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  if (request.nextUrl.pathname.startsWith('/admin'))
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
