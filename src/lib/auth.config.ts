import type { NextAuthConfig } from 'next-auth'

/**
 * Edge-compatible auth config (no Node.js dependencies).
 * Used by middleware for session checks only.
 * The full config with PrismaAdapter lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  providers: [], // Providers are added in the full auth.ts config
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdmin = nextUrl.pathname.startsWith('/admin')
      const isProfile = nextUrl.pathname.startsWith('/profile')

      if (isAdmin) {
        if (!isLoggedIn) return false
        const role = (auth?.user as { role?: string })?.role
        if (role !== 'ADMIN' && role !== 'STAFF') return false
        return true
      }

      if (isProfile && !isLoggedIn) {
        return false
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
    signIn: '/login',
    error: '/login',
  },
}
