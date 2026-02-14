import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { authConfig } from './auth.config'

/**
 * Full auth config with PrismaAdapter and credential providers.
 * Only used in Node.js runtime (API routes, server components).
 * Edge-compatible base config lives in auth.config.ts.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          let user = await db.user.findUnique({
            where: { email: adminEmail },
          })

          if (!user) {
            user = await db.user.create({
              data: {
                email: adminEmail,
                name: 'Admin',
                role: 'ADMIN',
              },
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
})
