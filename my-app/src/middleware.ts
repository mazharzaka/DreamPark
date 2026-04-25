import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next)
  // - Static files (containing a dot, e.g. favicon.ico)
  matcher: [
    // مسار الـ Root
    '/',

    // مسارات اللغات (en/ar)
    '/(ar|en)/:path*',

    // استثناء ملفات السيستم والـ static files
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
