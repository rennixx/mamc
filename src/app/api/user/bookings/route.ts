import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// GET /api/user/bookings - get bookings for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const [bookings, total] = await Promise.all([
      db.booking.findMany({
        where: { userId: session.user.id },
        include: {
          horses: { include: { horse: true } },
          appliedReward: { include: { reward: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.booking.count({
        where: { userId: session.user.id },
      }),
    ])

    return NextResponse.json({
      data: bookings,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('User bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
