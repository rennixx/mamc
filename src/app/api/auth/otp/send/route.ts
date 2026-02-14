import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Delete any existing OTPs for this phone
    await db.otpCode.deleteMany({ where: { phone } })

    // Create new OTP
    await db.otpCode.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    })

    // TODO: In production, send OTP via Twilio/SMS service
    // For development, log to console
    console.log(`[OTP] Code for ${phone}: ${code}`)

    return NextResponse.json({
      message: 'OTP sent successfully',
      // Only include code in development for testing
      ...(process.env.NODE_ENV === 'development' && { code }),
    })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
