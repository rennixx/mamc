import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authConfig } from '@/lib/auth.config'
import NextAuth from 'next-auth'
import { jwtVerify } from 'jose'

const ADMIN_SECRET = process.env.ADMIN_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret'

// NextAuth middleware for user routes
const userMiddleware = NextAuth(authConfig).auth

// Verify admin JWT token
async function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-auth.session-token')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(ADMIN_SECRET))
    return payload as { sub: string; email: string; name: string; role: string }
  } catch {
    return null
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes - use admin auth
  if (pathname.startsWith('/admin')) {
    // Skip auth check for admin login page
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Verify admin JWT token
    const adminUser = await verifyAdminToken(request)

    if (!adminUser) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Check if user has admin/staff role
    if (adminUser.role !== 'ADMIN' && adminUser.role !== 'STAFF') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // User profile routes - use user auth middleware
  if (pathname.startsWith('/profile')) {
    return userMiddleware(request as any, {} as any)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
}
