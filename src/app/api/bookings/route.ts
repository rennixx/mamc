import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// GET /api/bookings — list all bookings (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status.toUpperCase()
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        horses: { include: { horse: true } },
        location: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
    })

    return NextResponse.json({ data: bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

// POST /api/bookings — create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { horseIds, location, ...bookingData } = body

    // Link to authenticated user if logged in
    const userId = session?.user?.id || null

    const booking = await db.booking.create({
      data: {
        ...bookingData,
        date: new Date(bookingData.date),
        status: bookingData.status || 'PENDING',
        userId,
        horses: horseIds?.length
          ? { create: horseIds.map((horseId: string) => ({ horseId })) }
          : undefined,
        location: location
          ? { create: location }
          : undefined,
      },
      include: {
        horses: { include: { horse: true } },
        location: true,
      },
    })

    // Book the time slot
    await db.bookedSlot.create({
      data: {
        date: new Date(bookingData.date),
        time: bookingData.time,
        bookingId: booking.id,
      },
    })

    return NextResponse.json({ data: booking }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
