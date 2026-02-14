import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// GET /api/user/rewards - get redeemed rewards for current user
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rewards = await db.userReward.findMany({
      where: { userId: session.user.id },
      include: {
        reward: true,
      },
      orderBy: { redeemedAt: 'desc' },
    })

    return NextResponse.json({ data: rewards })
  } catch (error) {
    console.error('User rewards error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user rewards' },
      { status: 500 }
    )
  }
}
