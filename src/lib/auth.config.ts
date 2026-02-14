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

      if (isAdmin && !isLoggedIn) {
        return false // NextAuth will redirect to signIn page
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}
