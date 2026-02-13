import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/calendar — get calendar config for a date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (date) {
      const dayConfig = await db.calendarDay.findUnique({
        where: { date: new Date(date) },
      })
      return NextResponse.json({ data: dayConfig })
    }

    const where: Record<string, unknown> = {}
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const days = await db.calendarDay.findMany({
      where,
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ data: days })
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 })
  }
}

// POST /api/calendar — block/configure a date
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, blocked, blockReason, availableSlots, capacity } = body

    const dayConfig = await db.calendarDay.upsert({
      where: { date: new Date(date) },
      update: { blocked, blockReason, availableSlots, capacity },
      create: {
        date: new Date(date),
        blocked: blocked ?? false,
        blockReason,
        availableSlots: availableSlots ?? [],
        capacity,
      },
    })

    return NextResponse.json({ data: dayConfig })
  } catch (error) {
    console.error('Error updating calendar:', error)
    return NextResponse.json({ error: 'Failed to update calendar' }, { status: 500 })
  }
}
