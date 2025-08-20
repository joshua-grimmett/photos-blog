import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from './app/utils/env';

const BYPASS_PATHS = [
  '/unlock',
  '/api/unlock',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    BYPASS_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const hasCookie = req.cookies.get('site_pass')?.value === env.SITE_PASSCODE;
  if (hasCookie) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/unlock';
  url.searchParams.set('from', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/:path*',
};
