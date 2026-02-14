import type { NextAuthConfig } from 'next-auth'

/**
 * Admin-specific auth config with separate cookies.
 * Uses custom cookie name to avoid conflicts with user auth.
 * Edge-compatible (no Node.js dependencies).
 */
export const adminAuthConfig: NextAuthConfig = {
  providers: [], // Providers added in adminAuth.ts
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: 'admin-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminPath = nextUrl.pathname.startsWith('/admin')

      if (isAdminPath) {
        if (!isLoggedIn) return false
        const role = (auth?.user as { role?: string })?.role
        if (role !== 'ADMIN' && role !== 'STAFF') return false
        return true
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.phone = (user as { phone?: string }).phone
        token.points = (user as { points?: number }).points
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>
        u.id = token.sub as string
        u.role = token.role as string
        u.phone = token.phone as string
        u.points = token.points as number
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
}
