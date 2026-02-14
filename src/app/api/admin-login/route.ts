import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/adminAuth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Use admin auth signIn
    const result = await signIn('admin-credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
