import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the path
    const path = request.nextUrl.pathname;

    // Define protected routes
    const isProtectedRoute =
        path.startsWith('/dashboard') ||
        path.startsWith('/create') ||
        path.startsWith('/queue') ||
        path.startsWith('/accounts') ||
        path.startsWith('/analytics') ||
        path.startsWith('/settings');

    // Check for auth cookie
    const userId = request.cookies.get('userId')?.value;

    // 1. Protect Admin Routes
    if (isProtectedRoute && !userId) {
        const loginUrl = new URL('/login', request.url);
        // loginUrl.searchParams.set('from', path); // optional: redirect back
        return NextResponse.redirect(loginUrl);
    }

    // 2. Redirect logged-in users away from /login
    if (path === '/login' && userId) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 3. Redirect root / to /dashboard (or landing page if we had one)
    if (path === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
