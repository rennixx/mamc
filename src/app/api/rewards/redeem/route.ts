import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// POST /api/rewards/redeem - redeem a reward
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { rewardId } = await request.json()

    if (!rewardId) {
      return NextResponse.json(
        { error: 'Reward ID is required' },
        { status: 400 }
      )
    }

    // Get reward
    const reward = await db.reward.findUnique({ where: { id: rewardId } })
    if (!reward || !reward.active) {
      return NextResponse.json(
        { error: 'Reward not found or inactive' },
        { status: 404 }
      )
    }

    // Check stock
    if (reward.stock !== null && reward.stock <= 0) {
      return NextResponse.json(
        { error: 'Reward is out of stock' },
        { status: 400 }
      )
    }

    // Get user and check points
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user || user.points < reward.pointCost) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      )
    }

    // Perform redemption in a transaction
    const [userReward] = await db.$transaction([
      // Create user reward
      db.userReward.create({
        data: {
          userId,
          rewardId,
        },
      }),
      // Deduct points from user
      db.user.update({
        where: { id: userId },
        data: { points: { decrement: reward.pointCost } },
      }),
      // Record point transaction
      db.pointTransaction.create({
        data: {
          userId,
          amount: -reward.pointCost,
          type: 'REWARD_REDEEMED',
          description: `Redeemed: ${reward.title}`,
          rewardId: reward.id,
        },
      }),
      // Decrement stock if applicable
      ...(reward.stock !== null
        ? [
            db.reward.update({
              where: { id: rewardId },
              data: { stock: { decrement: 1 } },
            }),
          ]
        : []),
    ])

    return NextResponse.json({
      message: 'Reward redeemed successfully',
      data: userReward,
    })
  } catch (error) {
    console.error('Reward redeem error:', error)
    return NextResponse.json(
      { error: 'Failed to redeem reward' },
      { status: 500 }
    )
  }
}
