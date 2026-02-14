'use server'

import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { SignJWT } from 'jose'

const ADMIN_SECRET = process.env.ADMIN_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export async function adminLogin(email: string, password: string) {
  try {
    // Check admin env vars first
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    let user: AdminUser | null = null

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      // Admin credentials from env
      const dbUser = await db.user.findUnique({
        where: { email: adminEmail },
      })

      if (!dbUser) {
        const newUser = await db.user.create({
          data: {
            email: adminEmail,
            name: 'Admin',
            role: 'ADMIN',
          },
        })
        user = { id: newUser.id, email: newUser.email!, name: newUser.name || 'Admin', role: newUser.role! }
      } else {
        user = { id: dbUser.id, email: dbUser.email!, name: dbUser.name || 'Admin', role: dbUser.role! }
      }
    } else {
      // Check DB user with hashed password
      const dbUser = await db.user.findUnique({
        where: { email },
      })

      if (!dbUser || !dbUser.password) {
        return { error: 'Invalid email or password' }
      }

      const isValid = await compare(password, dbUser.password)
      if (!isValid) {
        return { error: 'Invalid email or password' }
      }

      // Only allow ADMIN and STAFF roles
      if (dbUser.role !== 'ADMIN' && dbUser.role !== 'STAFF') {
        return { error: 'Not authorized for admin access' }
      }

      user = { id: dbUser.id, email: dbUser.email!, name: dbUser.name || 'Admin', role: dbUser.role! }
    }

    if (!user) {
      return { error: 'Invalid email or password' }
    }

    // Create JWT token for admin session
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(new TextEncoder().encode(ADMIN_SECRET))

    // Return the token to be set by the API route
    return { success: true, token }
  } catch (error) {
    console.error('Admin login error:', error)
    return { error: 'Login failed. Please try again.' }
  }
}
