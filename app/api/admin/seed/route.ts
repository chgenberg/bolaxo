import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Simple auth check - endast i development eller med secret
    const authHeader = request.headers.get('authorization')
    const isDev = process.env.NODE_ENV === 'development'
    const validSecret = authHeader === `Bearer ${process.env.ADMIN_SECRET || 'demo-secret-2024'}`
    
    if (!isDev && !validSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🌱 Seeding database...')

    // 1. Skapa demo-users
    const demoSeller = await prisma.user.upsert({
      where: { email: 'demo@seller.com' },
      update: {},
      create: {
        email: 'demo@seller.com',
        name: 'Demo Säljare AB',
        password: await hash('demo123', 12),
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
        password: await hash('demo123', 12),
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

    return NextResponse.json({
      success: true,
      message: '✨ Database seeded successfully!',
      data: {
        seller: demoSeller.email,
        buyer: demoBuyer.email,
        transaction: demoTransaction.id,
        transactionUrl: `/transaktion/${demoTransaction.id}`,
      },
    })

  } catch (error) {
    console.error('❌ Seed error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Seed failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

