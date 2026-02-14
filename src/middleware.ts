import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

// Use the edge-compatible config (no PrismaAdapter / no Node.js deps)
export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/admin/:path*'],
}
