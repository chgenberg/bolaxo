import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; milestoneId: string }> }
) {
  const params = await context.params
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('bolaxo_user_id')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Hämta transaktion för att verifiera access
    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    if (transaction.buyerId !== userId && 
        transaction.sellerId !== userId && 
        transaction.advisorId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Hämta user-info för loggning
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    // Markera milestone som klar
    const milestone = await prisma.milestone.update({
      where: { id: params.milestoneId },
      data: {
        completed: true,
        completedAt: new Date(),
        completedBy: userId
      }
    })

    // Lägg till aktivitet
    await prisma.activity.create({
      data: {
        transactionId: params.id,
        type: 'MILESTONE_COMPLETED',
        title: `Milstolpe klar: ${milestone.title}`,
        description: milestone.description || undefined,
        actorId: userId,
        actorName: user?.name || user?.email || 'Användare',
        actorRole: transaction.buyerId === userId ? 'buyer' : transaction.sellerId === userId ? 'seller' : 'advisor'
      }
    })

    return NextResponse.json({ milestone })

  } catch (error) {
    console.error('Complete milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to complete milestone' },
      { status: 500 }
    )
  }
}

