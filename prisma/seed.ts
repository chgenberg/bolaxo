import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Ta bort gamla demo-transaction om den finns
  try {
    await prisma.transaction.delete({
      where: { id: 'demo-transaction-001' }
    })
    console.log('✓ Removed old demo transaction')
  } catch (e) {
    // Finns inte, fortsätt
  }

  // 1. Skapa demo-users
  const demoSeller = await prisma.user.upsert({
    where: { email: 'demo.seller@bolaxo.se' },
    update: {},
    create: {
      email: 'demo.seller@bolaxo.se',
      name: 'Anna Andersson',
      role: 'seller',
      verified: true,
      bankIdVerified: true,
      phone: '070-123 45 67',
      companyName: 'Digital Konsult AB',
      orgNumber: '556123-4567',
      region: 'Stockholm'
    }
  })

  const demoBuyer = await prisma.user.upsert({
    where: { email: 'demo.buyer@bolaxo.se' },
    update: {},
    create: {
      email: 'demo.buyer@bolaxo.se',
      name: 'Erik Johansson',
      role: 'buyer',
      verified: true,
      bankIdVerified: true,
      phone: '070-987 65 43',
      region: 'Göteborg'
    }
  })

  const demoAdvisor = await prisma.user.upsert({
    where: { email: 'advisor@bolaxo.se' },
    update: {},
    create: {
      email: 'advisor@bolaxo.se',
      name: 'Maria Svensson',
      role: 'advisor',
      verified: true,
      bankIdVerified: true,
      phone: '070-555 55 55',
      companyName: 'Svensson Corporate Finance'
    }
  })

  console.log('✓ Created 3 demo users')

  // 2. Skapa demo-valuations
  const valuations = [
    {
      userId: demoSeller.id,
      email: demoSeller.email,
      companyName: 'Digital Konsult AB',
      industry: 'tech',
      mostLikely: 12500000,
      minValue: 10000000,
      maxValue: 15000000,
      inputJson: {
        companyName: 'Digital Konsult AB',
        industry: 'tech',
        revenue: '5-10',
        profitMargin: '10-20',
        employees: '6-10'
      },
      resultJson: {
        valuationRange: { min: 10000000, max: 15000000, mostLikely: 12500000 },
        method: 'EBITDA-multipel'
      }
    },
    {
      userId: demoSeller.id,
      email: demoSeller.email,
      companyName: 'Webshop Mode AB',
      industry: 'ecommerce',
      mostLikely: 3200000,
      minValue: 2500000,
      maxValue: 4000000,
      inputJson: {
        companyName: 'Webshop Mode AB',
        industry: 'ecommerce',
        revenue: '1-5',
        profitMargin: '5-10',
        employees: '1-5'
      },
      resultJson: {
        valuationRange: { min: 2500000, max: 4000000, mostLikely: 3200000 },
        method: 'Omsättningsmultipel + EBITDA'
      }
    },
    {
      userId: demoBuyer.id,
      email: demoBuyer.email,
      companyName: 'Hantverks AB',
      industry: 'services',
      mostLikely: 8500000,
      minValue: 7000000,
      maxValue: 10000000,
      inputJson: {
        companyName: 'Hantverks AB',
        industry: 'services',
        revenue: '5-10',
        profitMargin: '10-20',
        employees: '11-25'
      },
      resultJson: {
        valuationRange: { min: 7000000, max: 10000000, mostLikely: 8500000 },
        method: 'Vägt genomsnitt (EBITDA + Avkastning)'
      }
    }
  ]

  for (const val of valuations) {
    await prisma.valuation.create({ data: val })
  }

  console.log('✓ Created 3 demo valuations')

  // 3. Skapa demo-transaction med känt ID
  const transaction = await prisma.transaction.create({
    data: {
      id: 'demo-transaction-001', // Känt ID för direkt access
      listingId: 'obj-001',
      buyerId: demoBuyer.id,
      sellerId: demoSeller.id,
      advisorId: demoAdvisor.id,
      stage: 'DD_IN_PROGRESS',
      agreedPrice: 14000000,
      closingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dagar fram
      
      milestones: {
        create: [
          {
            title: 'LOI signerad',
            description: 'Letter of Intent godkänd av båda parter',
            dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            completed: true,
            completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            completedBy: demoBuyer.id,
            assignedTo: demoBuyer.id,
            assignedToName: demoBuyer.name,
            order: 1,
            isRequired: true
          },
          {
            title: 'NDA i kraft',
            description: 'Konfidentialitetsavtal signerat',
            dueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
            completed: true,
            completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
            completedBy: demoBuyer.id,
            assignedTo: demoBuyer.id,
            assignedToName: demoBuyer.name,
            order: 2,
            isRequired: true
          },
          {
            title: 'Due Diligence påbörjad',
            description: 'Köpare startar granskning',
            dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            completed: true,
            completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            completedBy: demoBuyer.id,
            assignedTo: demoBuyer.id,
            assignedToName: demoBuyer.name,
            order: 3,
            isRequired: true
          },
          {
            title: 'DD-rapport klar',
            description: 'Due diligence-rapport färdigställd',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            completed: false,
            assignedTo: demoBuyer.id,
            assignedToName: demoBuyer.name,
            order: 4,
            isRequired: true
          },
          {
            title: 'SPA-förhandling',
            description: 'Förhandling av slutligt köpeavtal',
            dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            completed: false,
            order: 5,
            isRequired: true
          },
          {
            title: 'SPA signerad',
            description: 'Köpeavtal undertecknat',
            dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
            completed: false,
            order: 6,
            isRequired: true
          }
        ]
      },
      
      documents: {
        create: [
          {
            type: 'LOI',
            title: 'Letter of Intent - Digital Konsult AB',
            fileName: 'LOI_DigitalKonsult_2025-10-07.pdf',
            fileUrl: '#',
            fileSize: 245678,
            mimeType: 'application/pdf',
            status: 'SIGNED',
            uploadedBy: demoBuyer.id,
            uploadedByName: demoBuyer.name || demoBuyer.email,
            signedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
          },
          {
            type: 'FINANCIALS',
            title: 'Årsredovisning 2024',
            fileName: 'Arsredovisning_2024.pdf',
            fileUrl: '#',
            fileSize: 1245678,
            mimeType: 'application/pdf',
            status: 'SIGNED',
            uploadedBy: demoSeller.id,
            uploadedByName: demoSeller.name || demoSeller.email,
            signedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          },
          {
            type: 'DD_REPORT',
            title: 'Due Diligence Rapport (utkast)',
            fileName: 'DD_Report_Draft.pdf',
            fileUrl: '#',
            fileSize: 856432,
            mimeType: 'application/pdf',
            status: 'DRAFT',
            uploadedBy: demoBuyer.id,
            uploadedByName: demoBuyer.name || demoBuyer.email
          }
        ]
      },
      
      payments: {
        create: [
          {
            type: 'DEPOSIT',
            amount: 1400000,
            description: 'Handpenning (10% av köpeskilling)',
            status: 'ESCROWED',
            dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          },
          {
            type: 'MAIN_PAYMENT',
            amount: 12600000,
            description: 'Huvudbetalning (90% av köpeskilling)',
            status: 'PENDING',
            dueDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      
      activities: {
        create: [
          {
            type: 'STAGE_CHANGE',
            title: 'Transaktion skapad',
            description: 'LOI godkänd för 14.0 MSEK',
            actorId: demoBuyer.id,
            actorName: demoBuyer.name || demoBuyer.email,
            actorRole: 'buyer'
          },
          {
            type: 'DOCUMENT_UPLOADED',
            title: 'Dokument uppladdat',
            description: 'LOI signerad och uppladdad',
            actorId: demoBuyer.id,
            actorName: demoBuyer.name || demoBuyer.email,
            actorRole: 'buyer'
          },
          {
            type: 'MILESTONE_COMPLETED',
            title: 'Milstolpe klar: LOI signerad',
            actorId: demoBuyer.id,
            actorName: demoBuyer.name || demoBuyer.email,
            actorRole: 'buyer'
          },
          {
            type: 'MILESTONE_COMPLETED',
            title: 'Milstolpe klar: NDA i kraft',
            actorId: demoBuyer.id,
            actorName: demoBuyer.name || demoBuyer.email,
            actorRole: 'buyer'
          },
          {
            type: 'PAYMENT_MADE',
            title: 'Handpenning betald',
            description: '1.4 MSEK deposition mottagen i escrow',
            actorId: demoBuyer.id,
            actorName: demoBuyer.name || demoBuyer.email,
            actorRole: 'buyer'
          },
          {
            type: 'STAGE_CHANGE',
            title: 'Stage uppdaterad: Due Diligence',
            description: 'Transaktion flyttad till DD-fas',
            actorId: demoAdvisor.id,
            actorName: demoAdvisor.name || demoAdvisor.email,
            actorRole: 'advisor'
          }
        ]
      }
    }
  })

  console.log('✓ Created 1 demo transaction (DD in progress)')

  // 4. Skapa demo-listing
  await prisma.listing.create({
    data: {
      userId: demoSeller.id,
      companyName: 'Digital Konsult AB',
      anonymousTitle: 'Etablerat IT-konsultbolag i Stockholm',
      industry: 'tech',
      revenue: '5-10M',
      employees: '6-10',
      location: 'Stockholm',
      status: 'active',
      packageType: 'featured',
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000)
    }
  })

  console.log('✓ Created 1 demo listing')

  console.log('\n✅ Seed completed!')
  console.log('\n📊 Demo accounts:')
  console.log('   Säljare: demo.seller@bolaxo.se')
  console.log('   Köpare:  demo.buyer@bolaxo.se')
  console.log('   Advisor: advisor@bolaxo.se')
  console.log('\n🔗 Direct URLs för investor demo:')
  console.log('   Transaction: /transaktion/demo-transaction-001')
  console.log('   Full URL: https://bolaxo-production.up.railway.app/transaktion/demo-transaction-001')
  console.log('\n💡 Logga in via /login för att se dashboards med data!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

