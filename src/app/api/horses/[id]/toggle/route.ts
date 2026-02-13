import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/horses/[id]/toggle — toggle horse availability
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const horse = await db.horse.findUnique({ where: { id } })
    if (!horse) {
      return NextResponse.json({ error: 'Horse not found' }, { status: 404 })
    }

    const updated = await db.horse.update({
      where: { id },
      data: { available: !horse.available },
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('Error toggling horse:', error)
    return NextResponse.json({ error: 'Failed to toggle horse' }, { status: 500 })
  }
}
