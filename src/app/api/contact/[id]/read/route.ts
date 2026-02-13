import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/contact/[id]/read — mark message as read/unread
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { read } = await request.json()

    const message = await db.contactMessage.update({
      where: { id },
      data: { read: read ?? true },
    })

    return NextResponse.json({ data: message })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}
