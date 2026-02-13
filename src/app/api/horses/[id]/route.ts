import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/horses/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const horse = await db.horse.findUnique({ where: { id } })

    if (!horse) {
      return NextResponse.json({ error: 'Horse not found' }, { status: 404 })
    }

    return NextResponse.json({ data: horse })
  } catch (error) {
    console.error('Error fetching horse:', error)
    return NextResponse.json({ error: 'Failed to fetch horse' }, { status: 500 })
  }
}

// PATCH /api/horses/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const horse = await db.horse.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ data: horse })
  } catch (error) {
    console.error('Error updating horse:', error)
    return NextResponse.json({ error: 'Failed to update horse' }, { status: 500 })
  }
}

// DELETE /api/horses/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.horse.delete({ where: { id } })
    return NextResponse.json({ message: 'Horse deleted' })
  } catch (error) {
    console.error('Error deleting horse:', error)
    return NextResponse.json({ error: 'Failed to delete horse' }, { status: 500 })
  }
}
