import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/horses — list all horses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const available = searchParams.get('available')
    const experienceLevel = searchParams.get('experienceLevel')

    const where: Record<string, unknown> = {}

    if (available === 'true') {
      where.available = true
    }

    if (experienceLevel) {
      where.suitableFor = { has: experienceLevel.toUpperCase() }
    }

    const horses = await db.horse.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ data: horses })
  } catch (error) {
    console.error('Error fetching horses:', error)
    return NextResponse.json({ error: 'Failed to fetch horses' }, { status: 500 })
  }
}

// POST /api/horses — create a horse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const horse = await db.horse.create({
      data: body,
    })

    return NextResponse.json({ data: horse }, { status: 201 })
  } catch (error) {
    console.error('Error creating horse:', error)
    return NextResponse.json({ error: 'Failed to create horse' }, { status: 500 })
  }
}
