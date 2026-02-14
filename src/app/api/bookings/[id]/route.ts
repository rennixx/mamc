import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/bookings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        horses: { include: { horse: true } },
        location: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ data: booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}

// PATCH /api/bookings/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if status is changing to COMPLETED - need to award points
    const currentBooking = await db.booking.findUnique({
      where: { id },
      select: { status: true, userId: true },
    })

    const booking = await db.booking.update({
      where: { id },
      data: body,
      include: {
        horses: { include: { horse: true } },
        location: true,
      },
    })

    // Award points when booking is completed and has a linked user
    if (
      body.status === 'COMPLETED' &&
      currentBooking?.status !== 'COMPLETED' &&
      currentBooking?.userId
    ) {
      await db.user.update({
        where: { id: currentBooking.userId },
        data: { points: { increment: 50 } },
      })
      await db.pointTransaction.create({
        data: {
          userId: currentBooking.userId,
          amount: 50,
          type: 'BOOKING_COMPLETED',
          description: 'Points earned for completed booking',
          bookingId: id,
        },
      })
    }

    return NextResponse.json({ data: booking })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

// DELETE /api/bookings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Release booked slots
    await db.bookedSlot.deleteMany({ where: { bookingId: id } })

    // Delete booking (cascades to horses and location)
    await db.booking.delete({ where: { id } })

    return NextResponse.json({ message: 'Booking deleted' })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
