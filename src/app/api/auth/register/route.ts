import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'MAM-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, referralCode } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Check if phone already exists
    if (phone) {
      const existingPhone = await db.user.findUnique({ where: { phone } })
      if (existingPhone) {
        return NextResponse.json(
          { error: 'Phone number already registered' },
          { status: 409 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Find referrer if code provided
    let referrerId: string | undefined
    if (referralCode) {
      const referrer = await db.user.findUnique({
        where: { referralCode },
      })
      if (referrer) {
        referrerId = referrer.id
      }
    }

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'USER',
        points: 100, // signup bonus
        referralCode: generateReferralCode(),
        referredById: referrerId || null,
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

    // Award referral bonus to both parties
    if (referrerId) {
      // Bonus for referrer
      await db.user.update({
        where: { id: referrerId },
        data: { points: { increment: 200 } },
      })
      await db.pointTransaction.create({
        data: {
          userId: referrerId,
          amount: 200,
          type: 'REFERRAL_BONUS',
          description: `Referral bonus for inviting ${name}`,
        },
      })

      // Bonus for new user
      await db.user.update({
        where: { id: user.id },
        data: { points: { increment: 200 } },
      })
      await db.pointTransaction.create({
        data: {
          userId: user.id,
          amount: 200,
          type: 'REFERRAL_BONUS',
          description: 'Referral bonus for using a referral code',
        },
      })
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          points: referrerId ? 300 : 100, // 100 signup + 200 referral
          referralCode: user.referralCode,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}
