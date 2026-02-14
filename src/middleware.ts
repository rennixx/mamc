import { authConfig } from '@/lib/auth.config'
import { adminAuthConfig } from '@/lib/adminAuth.config'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

// Create both middleware functions
const userMiddleware = NextAuth(authConfig).auth
const adminMiddleware = NextAuth(adminAuthConfig).auth

// Custom middleware that routes to appropriate auth
export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl

  // Admin login page - skip auth
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Admin routes - use admin middleware
  if (pathname.startsWith('/admin')) {
    return adminMiddleware(request as any, event as any)
  }

  // User profile routes - use user middleware
  if (pathname.startsWith('/profile')) {
    return userMiddleware(request as any, event as any)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
}
