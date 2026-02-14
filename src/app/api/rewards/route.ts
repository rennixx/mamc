import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// GET /api/rewards - list active rewards (public) or all rewards (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN'
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    const rewards = await db.reward.findMany({
      where: isAdmin && all ? {} : { active: true },
      orderBy: { pointCost: 'asc' },
      include: {
        _count: { select: { redemptions: true } },
      },
    })

    return NextResponse.json({ data: rewards })
  } catch (error) {
    console.error('Rewards fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    )
  }
}

// POST /api/rewards - create reward (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const role = (session?.user as { role?: string })?.role
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title, titleKu, titleAr,
      description, descriptionKu, descriptionAr,
      type, pointCost, discountPercent, freeService,
      active, stock, image,
    } = body

    if (!title || !type || !pointCost) {
      return NextResponse.json(
        { error: 'Title, type, and pointCost are required' },
        { status: 400 }
      )
    }

    const reward = await db.reward.create({
      data: {
        title,
        titleKu: titleKu || null,
        titleAr: titleAr || null,
        description: description || null,
        descriptionKu: descriptionKu || null,
        descriptionAr: descriptionAr || null,
        type,
        pointCost,
        discountPercent: type === 'DISCOUNT' ? discountPercent : null,
        freeService: type === 'FREE_SERVICE' ? freeService : null,
        active: active ?? true,
        stock: stock || null,
        image: image || null,
      },
    })

    return NextResponse.json({ data: reward }, { status: 201 })
  } catch (error) {
    console.error('Reward create error:', error)
    return NextResponse.json(
      { error: 'Failed to create reward' },
      { status: 500 }
    )
  }
}
