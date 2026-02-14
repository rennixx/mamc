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

  // DEBUG: Log all requests to see if proxy is working
  console.log('[PROXY] Request:', pathname, 'Cookies:', request.cookies.getAll().map(c => c.name))

  // Admin routes - use admin auth
  if (pathname.startsWith('/admin')) {
    console.log('[PROXY] Admin route detected')

    // Skip auth check for admin login page
    if (pathname === '/admin/login') {
      console.log('[PROXY] Skipping auth for /admin/login')
      return NextResponse.next()
    }

    // Verify admin JWT token
    const adminUser = await verifyAdminToken(request)
    console.log('[PROXY] Admin user:', adminUser)

    if (!adminUser) {
      console.log('[PROXY] No admin token, redirecting to /admin/login')
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Check if user has admin/staff role
    if (adminUser.role !== 'ADMIN' && adminUser.role !== 'STAFF') {
      console.log('[PROXY] Invalid role:', adminUser.role)
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    console.log('[PROXY] Access granted for', adminUser.email)
    return NextResponse.next()
  }

  // User profile routes - use user auth middleware
  if (pathname.startsWith('/profile')) {
    return userMiddleware(request as any, {} as any)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths starting with /admin except /admin/login
    '/admin/:path*',
    // Match all paths starting with /profile
    '/profile/:path*',
  ],
}
