import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
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
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // Email + Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        // ── Phone OTP login ──
        if (credentials?.phone && credentials?.otp) {
          const phone = credentials.phone as string
          const code = credentials.otp as string

          const otpRecord = await db.otpCode.findFirst({
            where: {
              phone,
              code,
              verified: true,
              expiresAt: { gte: new Date() },
            },
            orderBy: { createdAt: 'desc' },
          })

          if (!otpRecord) return null

          // Find or create user by phone
          let user = await db.user.findUnique({ where: { phone } })
          if (!user) {
            user = await db.user.create({
              data: {
                phone,
                email: `${phone}@phone.local`,
                role: 'USER',
                points: 100, // signup bonus
                referralCode: generateReferralCode(),
              },
            })
            // Record signup bonus
            await db.pointTransaction.create({
              data: {
                userId: user.id,
                amount: 100,
                type: 'SIGNUP_BONUS',
                description: 'Welcome bonus for signing up',
              },
            })
          }

          // Clean up used OTP
          await db.otpCode.deleteMany({ where: { phone } })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            points: user.points,
          }
        }

        // ── Email + Password login ──
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Check DB user with hashed password
        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) return null

        const isValid = await compare(password, user.password)
        if (!isValid) return null

        // Note: Admin users should use /admin/login, not the regular login
        // This ensures separation between user and admin authentication
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
  events: {
    async createUser({ user }) {
      // When a user is created via OAuth (Google), give signup bonus
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: {
            points: 100,
            referralCode: generateReferralCode(),
          },
        })
        await db.pointTransaction.create({
          data: {
            userId: user.id,
            amount: 100,
            type: 'SIGNUP_BONUS',
            description: 'Welcome bonus for signing up',
          },
        })
      }
    },
  },
})

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'MAM-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
