import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// GET /api/admin/users/[id]
export async function GET(
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
    const user = await db.user.findUnique({
      where: { id },
      include: {
        bookings: {
          include: { horses: { include: { horse: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        pointHistory: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        rewards: {
          include: { reward: true },
          orderBy: { redeemedAt: 'desc' },
        },
        _count: {
          select: { referrals: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error('Admin user detail error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - update user (admin only)
export async function PATCH(
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
    const { role: newRole, points, pointAdjustment, adjustmentReason } = body

    const updateData: Record<string, unknown> = {}
    if (newRole) updateData.role = newRole
    if (points !== undefined) updateData.points = points

    // Admin point adjustment
    if (pointAdjustment && pointAdjustment !== 0) {
      updateData.points = { increment: pointAdjustment }

      await db.pointTransaction.create({
        data: {
          userId: id,
          amount: pointAdjustment,
          type: 'ADMIN_ADJUSTMENT',
          description: adjustmentReason || 'Admin adjustment',
        },
      })
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        points: true,
        referralCode: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error('Admin user update error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
