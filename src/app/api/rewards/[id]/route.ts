import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// GET /api/rewards/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reward = await db.reward.findUnique({
      where: { id },
      include: {
        _count: { select: { redemptions: true } },
      },
    })

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
    }

    return NextResponse.json({ data: reward })
  } catch (error) {
    console.error('Reward fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reward' },
      { status: 500 }
    )
  }
}

// PUT /api/rewards/[id] - update reward (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const role = (session?.user as { role?: string })?.role
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const reward = await db.reward.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ data: reward })
  } catch (error) {
    console.error('Reward update error:', error)
    return NextResponse.json(
      { error: 'Failed to update reward' },
      { status: 500 }
    )
  }
}

// DELETE /api/rewards/[id] - delete reward (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const role = (session?.user as { role?: string })?.role
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    await db.reward.delete({ where: { id } })

    return NextResponse.json({ message: 'Reward deleted' })
  } catch (error) {
    console.error('Reward delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete reward' },
      { status: 500 }
    )
  }
}
