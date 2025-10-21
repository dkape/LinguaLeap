import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLocale, locales, defaultLocale, getLocalizedPath, getLocaleFromPathname } from './lib/i18n';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const currentLocale = getLocaleFromPathname(pathname);
  const hasLocaleInPath = locales.some(locale => pathname.startsWith(`/${locale}`));

  // If no locale in path, redirect to localized version
  if (!hasLocaleInPath) {
    const locale = getLocale(request);
    const localizedPath = getLocalizedPath(pathname, locale);
    
    const response = NextResponse.redirect(new URL(localizedPath, request.url));
    
    // Set locale cookie
    response.cookies.set('locale', locale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  }

  // Set locale cookie if it doesn't match the current path locale
  const response = NextResponse.next();
  const cookieLocale = request.cookies.get('locale')?.value;
  
  if (cookieLocale !== currentLocale) {
    response.cookies.set('locale', currentLocale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)',
  ],
};
