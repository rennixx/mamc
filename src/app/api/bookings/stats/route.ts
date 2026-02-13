import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/bookings/stats
export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [total, pending, confirmed, completed, cancelled, todayCount] = await Promise.all([
      db.booking.count(),
      db.booking.count({ where: { status: 'PENDING' } }),
      db.booking.count({ where: { status: 'CONFIRMED' } }),
      db.booking.count({ where: { status: 'COMPLETED' } }),
      db.booking.count({ where: { status: 'CANCELLED' } }),
      db.booking.count({
        where: {
          date: { gte: today, lt: tomorrow },
        },
      }),
    ])

    return NextResponse.json({
      data: { total, pending, confirmed, completed, cancelled, today: todayCount },
    })
  } catch (error) {
    console.error('Error fetching booking stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
