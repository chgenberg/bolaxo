import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {

    console.log('🌱 Seeding database...')

    // 1. Skapa demo-users (passwordless - använder magic links)
    const demoSeller = await prisma.user.upsert({
      where: { email: 'demo@seller.com' },
      update: {},
      create: {
        email: 'demo@seller.com',
        name: 'Demo Säljare AB',
        role: 'seller',
        emailVerified: new Date(),
      },
    })
    console.log('✅ Demo seller created:', demoSeller.email)

    const demoBuyer = await prisma.user.upsert({
      where: { email: 'demo@buyer.com' },
      update: {},
      create: {
        email: 'demo@buyer.com',
        name: 'Demo Köpare',
        role: 'buyer',
        emailVerified: new Date(),
      },
    })
    console.log('✅ Demo buyer created:', demoBuyer.email)

    // 2. Skapa demo-transaktion med känt ID
    const demoTransaction = await prisma.transaction.upsert({
      where: { id: 'demo-transaction-001' },
      update: {},
      create: {
        id: 'demo-transaction-001',
        sellerId: demoSeller.id,
        buyerId: demoBuyer.id,
        companyName: 'TechVision Solutions AB',
        status: 'due_diligence',
        askingPrice: 15000000,
        agreedPrice: 14500000,
        currentMilestone: 'due_diligence_started',
        progress: 45,
      },
    })
    console.log('✅ Demo transaction created:', demoTransaction.id)

    // 3. Skapa milestones för transaktionen
    const milestones = [
      {
        transactionId: demoTransaction.id,
        title: 'NDA Signerad',
        description: 'Sekretessavtal undertecknat av båda parter',
        status: 'completed' as const,
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dagar sedan
        completedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      },
      {
        transactionId: demoTransaction.id,
        title: 'Due Diligence Påbörjad',
        description: 'Genomgång av finansiella dokument och företagsdata',
        status: 'in_progress' as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dagar framåt
      },
      {
        transactionId: demoTransaction.id,
        title: 'Aktieöverlåtelseavtal',
        description: 'Förhandling och signering av överlåtelseavtal',
        status: 'pending' as const,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 dagar framåt
      },
      {
        transactionId: demoTransaction.id,
        title: 'Betalning Genomförd',
        description: 'Överföring av köpeskilling',
        status: 'pending' as const,
        dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 dagar framåt
      },
    ]

    for (const milestone of milestones) {
      await prisma.milestone.upsert({
        where: {
          transactionId_title: {
            transactionId: milestone.transactionId,
            title: milestone.title,
          },
        },
        update: {},
        create: milestone,
      })
    }
    console.log('✅ Milestones created')

    return {
      success: true,
      message: '✨ Database seeded successfully!',
      data: {
        seller: demoSeller.email,
        buyer: demoBuyer.email,
        transaction: demoTransaction.id,
        transactionUrl: `/transaktion/${demoTransaction.id}`,
      },
    }

  } catch (error) {
    console.error('❌ Seed error:', error)
    return {
      success: false,
      error: 'Seed failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Support both GET and POST for easy browser access
export async function GET(request: NextRequest) {
  const result = await seedDatabase()
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}

export async function POST(request: NextRequest) {
  const result = await seedDatabase()
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}

