import { PrismaClient } from '@prisma/client'
import { mockObjects } from '../data/mockObjects'

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

  // 4. Skapa säljare och listings för alla 20 mock-objekt
  console.log('\n🏢 Seeding 20 listings from mock objects...')
  
  for (const mockObj of mockObjects) {
    // Skapa en unik säljare för varje objekt
    const seller = await prisma.user.upsert({
      where: { email: `seller-${mockObj.id}@bolaxo.se` },
      update: {},
      create: {
        email: `seller-${mockObj.id}@bolaxo.se`,
        name: mockObj.companyName,
        role: 'seller',
        verified: mockObj.verified,
        bankIdVerified: mockObj.verified,
        phone: '070-' + Math.floor(Math.random() * 9000000 + 1000000),
        companyName: mockObj.companyName,
        orgNumber: mockObj.orgNumber,
        region: mockObj.region
      }
    })

    // Skapa listing från mock-objektet
    await prisma.listing.upsert({
      where: { id: mockObj.id },
      update: {
        // Uppdatera befintlig med nya värden
        userId: seller.id,
        companyName: mockObj.companyName,
        anonymousTitle: mockObj.anonymousTitle,
        type: mockObj.type,
        industry: mockObj.type.toLowerCase().replace(/\s+/g, '-'),
        revenue: mockObj.revenue,
        revenueRange: mockObj.revenueRange,
        employees: parseInt(mockObj.employees?.split('-')[0] || '1'),
        location: mockObj.location || mockObj.region,
        region: mockObj.region,
        address: mockObj.address,
        priceMin: mockObj.priceMin,
        priceMax: mockObj.priceMax,
        description: mockObj.description,
        strengths: mockObj.strengths,
        risks: mockObj.risks,
        whySelling: mockObj.whySelling,
        image: mockObj.image,
        verified: mockObj.verified,
        broker: mockObj.broker,
        isNew: mockObj.isNew,
        status: 'active',
        packageType: 'pro',
        publishedAt: new Date(mockObj.createdAt),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      create: {
        id: mockObj.id,
        userId: seller.id,
        companyName: mockObj.companyName,
        anonymousTitle: mockObj.anonymousTitle,
        type: mockObj.type,
        industry: mockObj.type.toLowerCase().replace(/\s+/g, '-'),
        revenue: mockObj.revenue,
        revenueRange: mockObj.revenueRange,
        employees: parseInt(mockObj.employees?.split('-')[0] || '1'),
        location: mockObj.location || mockObj.region,
        region: mockObj.region,
        address: mockObj.address,
        priceMin: mockObj.priceMin,
        priceMax: mockObj.priceMax,
        description: mockObj.description,
        strengths: mockObj.strengths,
        risks: mockObj.risks,
        whySelling: mockObj.whySelling,
        image: mockObj.image,
        verified: mockObj.verified,
        broker: mockObj.broker,
        isNew: mockObj.isNew,
        status: 'active',
        packageType: 'pro',
        publishedAt: new Date(mockObj.createdAt),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    })
  }

  console.log(`✓ Created/updated ${mockObjects.length} listings from mock objects`)

  // 5. Skapa NDA requests för test
  console.log('\n📋 Seeding NDA requests...')
  
  // Skapa ett par test-köpare
  const testBuyer1 = await prisma.user.upsert({
    where: { email: 'testbuyer1@bolaxo.se' },
    update: {},
    create: {
      email: 'testbuyer1@bolaxo.se',
      name: 'Test Köpare 1',
      role: 'buyer',
      verified: true,
      bankIdVerified: true,
      phone: '070-111 11 11',
      region: 'Stockholm'
    }
  })

  const testBuyer2 = await prisma.user.upsert({
    where: { email: 'testbuyer2@bolaxo.se' },
    update: {},
    create: {
      email: 'testbuyer2@bolaxo.se',
      name: 'Test Köpare 2',
      role: 'buyer',
      verified: true,
      bankIdVerified: true,
      phone: '070-222 22 22',
      region: 'Göteborg'
    }
  })

  // Skapa NDA requests för första två listings
  const firstTwoListings = mockObjects.slice(0, 2)
  for (const mockObj of firstTwoListings) {
    const seller = await prisma.user.findFirst({
      where: { email: `seller-${mockObj.id}@bolaxo.se` }
    })

    if (seller) {
      // Skapa en pending NDA request
      try {
        await prisma.nDARequest.create({
          data: {
            listingId: mockObj.id,
            buyerId: testBuyer1.id,
            sellerId: seller.id,
            status: 'pending',
            message: 'Jag är intresserad av denna verksamhet och skulle vilja få mer information.',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        })
      } catch (e) {
        // Already exists, ignore
      }

      // Skapa en approved NDA request för andra köparen
      try {
        await prisma.nDARequest.create({
          data: {
            listingId: mockObj.id,
            buyerId: testBuyer2.id,
            sellerId: seller.id,
            status: 'approved',
            message: 'Intresserad av att köpa denna verksamhet.',
            signedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
          }
        })
      } catch (e) {
        // Already exists, ignore
      }
    }
  }

  console.log('✓ Created NDA requests for testing')

  // 6. Skapa chat-meddelanden mellan köpare och säljare (efter godkända NDA:er)
  console.log('Creating chat messages...')
  
  // Hämta godkända NDA:er för att skapa chat-historik
  const approvedNDAs = await prisma.nDARequest.findMany({
    where: { status: 'approved' },
    take: 5 // Skapa chat för de första 5 godkända NDA:erna
  })

  for (const nda of approvedNDAs) {
    const listing = await prisma.listing.findUnique({
      where: { id: nda.listingId }
    })

    if (!listing) continue

    // Skapa en realistisk chat-konversation
    const chatMessages = [
      {
        senderId: nda.buyerId,
        recipientId: nda.sellerId,
        content: 'Hej! Tack för att du godkände NDA:n. Jag är mycket intresserad av verksamheten.',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 dagar sen
        read: true
      },
      {
        senderId: nda.sellerId,
        recipientId: nda.buyerId,
        content: 'Hej och välkommen! Vad roligt att du är intresserad. Vad skulle du vilja veta mer om?',
        createdAt: new Date(Date.now() - 47 * 60 * 60 * 1000),
        read: true
      },
      {
        senderId: nda.buyerId,
        recipientId: nda.sellerId,
        content: 'Jag undrar över personalstyrkan - hur är kompetensen och hur lång tid har nyckelmedarbetarna varit i företaget?',
        createdAt: new Date(Date.now() - 46 * 60 * 60 * 1000),
        read: true
      },
      {
        senderId: nda.sellerId,
        recipientId: nda.buyerId,
        content: 'Vi har 8 medarbetare totalt. Våra nyckelmedarbetare har varit här i snitt 5+ år och är mycket kunniga. Två seniora konsulter som är ryggraden i verksamheten.',
        createdAt: new Date(Date.now() - 45 * 60 * 60 * 1000),
        read: true
      },
      {
        senderId: nda.buyerId,
        recipientId: nda.sellerId,
        content: 'Låter bra! Hur ser kundbasen ut? Är det många återkommande kunder eller projektbaserat?',
        createdAt: new Date(Date.now() - 44 * 60 * 60 * 1000),
        read: true
      },
      {
        senderId: nda.sellerId,
        recipientId: nda.buyerId,
        content: 'Ca 70% är återkommande kunder med längre ramavtal. De senaste 3 åren har omsättningen varit stabil tack vare detta. Resten är nya projekt.',
        createdAt: new Date(Date.now() - 43 * 60 * 60 * 1000),
        read: true
      },
      {
        senderId: nda.buyerId,
        recipientId: nda.sellerId,
        content: 'Perfekt. Skulle det vara möjligt att få se lite mer detaljerad finansiell info och kanske en kundlista (anonymiserad)?',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dag sen
        read: true
      },
      {
        senderId: nda.sellerId,
        recipientId: nda.buyerId,
        content: 'Absolut! Jag kan skicka över finansiella rapporter för senaste 3 åren samt en översikt över kundbasen. Kan vi boka ett möte för att gå igenom allt?',
        createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        read: true
      },
      {
        senderId: nda.buyerId,
        recipientId: nda.sellerId,
        content: 'Ja gärna! Jag är ledig nästa vecka. Tisdag eller onsdag passar bra för mig.',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12h sen
        read: true
      },
      {
        senderId: nda.sellerId,
        recipientId: nda.buyerId,
        content: 'Tisdag kl 10:00 passar utmärkt! Jag skickar över ett Teams-möte. Ser fram emot att prata mer!',
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10h sen
        read: false // Oläst för att visa funktionalitet
      }
    ]

    // Skapa alla meddelanden för denna konversation
    for (const msg of chatMessages) {
      try {
        await prisma.message.create({
          data: {
            listingId: nda.listingId,
            senderId: msg.senderId,
            recipientId: msg.recipientId,
            content: msg.content,
            createdAt: msg.createdAt,
            read: msg.read
          }
        })
      } catch (e) {
        // Meddelande finns redan, fortsätt
      }
    }
  }

  console.log(`✓ Created chat conversations for ${approvedNDAs.length} approved NDAs`)

  console.log('\n✅ Seed completed!')
  console.log('\n📊 Demo accounts:')
  console.log('   Säljare: demo.seller@bolaxo.se')
  console.log('   Köpare:  demo.buyer@bolaxo.se')
  console.log('   Advisor: advisor@bolaxo.se')
  console.log('\n👥 Test users for dev-login:')
  console.log(`   Test Buyer 1 ID: ${testBuyer1.id}`)
  console.log(`   Test Buyer 2 ID: ${testBuyer2.id}`)
  console.log('   (Use these IDs in /dev-login page)')
  console.log('\n🏢 Plus 20 seller accounts created for mock objects:')
  console.log('   Format: seller-obj-XXX@bolaxo.se (same password as above)')
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

