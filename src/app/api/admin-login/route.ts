import { NextRequest, NextResponse } from 'next/server'
import { adminLogin } from '@/actions/adminLogin'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Call admin login server action
    const result = await adminLogin(email, password)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    // Set the admin session cookie
    if (result.token) {
      const response = NextResponse.json({ success: true })

      // Set the admin auth cookie
      response.cookies.set('admin-auth.session-token', result.token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      })

      return response
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin login API error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
