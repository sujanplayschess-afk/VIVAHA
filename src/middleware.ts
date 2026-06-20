import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

// Add paths that require authentication
const PROTECTED_PATHS = [
    '/dashboard',
    '/search',
    '/matches',
    '/profile/edit',
    '/messages',
    '/notifications',
    '/settings',
    '/subscription'
];

// Add paths that are only for admin
const ADMIN_PATHS = ['/admin'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;

    // Check if path is protected
    const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));
    const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path));

    if (isProtected || isAdminPath) {
        if (!accessToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        const decoded = verifyAccessToken(accessToken);
        if (!decoded) {
            // Token expired or invalid - the refresh logic should ideally happen on the client 
            // or via a special refresh endpoint, but for middleware we redirect to login
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        if (isAdminPath && decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Redirect authenticated users away from auth pages
    if ((pathname === '/login' || pathname === '/register') && accessToken) {
        const decoded = verifyAccessToken(accessToken);
        if (decoded) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
