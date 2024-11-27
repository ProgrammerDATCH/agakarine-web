import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/verify',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
]

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("session")
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (authToken && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes - check for auth token
  if (!authToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
}