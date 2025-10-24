import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; milestoneId: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    const { userId, userName } = body

    const milestone = await prisma.milestone.findUnique({
      where: { id: params.milestoneId }
    })

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }

    if (milestone.transactionId !== params.id) {
      return NextResponse.json({ error: 'Milestone does not belong to this transaction' }, { status: 400 })
    }

    const updated = await prisma.milestone.update({
      where: { id: params.milestoneId },
      data: {
        completed: true,
        completedAt: new Date(),
        completedBy: userId
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        transactionId: params.id,
        type: 'MILESTONE_COMPLETED',
        title: `Milstolpe slutförd: ${milestone.title}`,
        description: `${userName} markerade "${milestone.title}" som slutförd`,
        actorId: userId,
        actorName: userName || 'Unknown',
        actorRole: 'seller'
      }
    })

    return NextResponse.json({ milestone: updated })
  } catch (error) {
    console.error('Error completing milestone:', error)
    return NextResponse.json({ error: 'Failed to complete milestone' }, { status: 500 })
  }
}

