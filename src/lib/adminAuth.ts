import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { adminAuthConfig } from './adminAuth.config'

/**
 * Admin auth config with PrismaAdapter and credential providers.
 * Uses separate cookies from user auth to allow simultaneous sessions.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...adminAuthConfig,
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'admin-credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Check admin env vars first
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (email === adminEmail && password === adminPassword) {
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
            phone: user.phone,
            points: user.points,
          }
        }

        // Check DB user with hashed password
        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) return null

        const isValid = await compare(password, user.password)
        if (!isValid) return null

        // Only allow ADMIN and STAFF roles for admin panel
        if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          points: user.points,
        }
      },
    }),
  ],
  secret: process.env.ADMIN_NEXTAUTH_SECRET,
})
