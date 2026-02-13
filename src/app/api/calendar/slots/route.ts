import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/calendar/slots?date=YYYY-MM-DD — get booked slots for a date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 })
    }

    const bookedSlots = await db.bookedSlot.findMany({
      where: { date: new Date(date) },
      include: { booking: true },
      orderBy: { time: 'asc' },
    })

    return NextResponse.json({ data: bookedSlots })
  } catch (error) {
    console.error('Error fetching slots:', error)
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 })
  }
}
