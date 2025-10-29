import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Cleaning up database...')
  
  // Delete all data in order (respecting foreign keys)
  await prisma.earnoutPayment.deleteMany({})
  await prisma.earnOut.deleteMany({})
  await prisma.sPARevision.deleteMany({})
  await prisma.sPA.deleteMany({})
  await prisma.dDFinding.deleteMany({})
  await prisma.dDTask.deleteMany({})
  await prisma.dDProject.deleteMany({})
  await prisma.lOI.deleteMany({})
  await prisma.documentEngagement.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.milestone.deleteMany({})
  await prisma.transaction.deleteMany({})
  await prisma.nDARequest.deleteMany({})
  await prisma.listing.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('✅ Database cleaned')

  console.log('👤 Creating demo users...')

  const password = 'Password1!'
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create Seller
  const seller = await prisma.user.create({
    data: {
      email: 'saljare@bolaxo.com',
      hashedPassword: hashedPassword,
      role: 'seller',
      firstName: 'Säljaren',
      lastName: 'Demo',
      company: 'Tech Company AB',
      isVerified: true,
    },
  })
  console.log(`✅ Seller created: ${seller.email}`)

  // Create Buyer
  const buyer = await prisma.user.create({
    data: {
      email: 'kopare@bolaxo.com',
      hashedPassword: hashedPassword,
      role: 'buyer',
      firstName: 'Köparen',
      lastName: 'Demo',
      company: 'Investment Partners',
      isVerified: true,
    },
  })
  console.log(`✅ Buyer created: ${buyer.email}`)

  // Create Advisor/Broker
  const advisor = await prisma.user.create({
    data: {
      email: 'maklare@bolaxo.com',
      hashedPassword: hashedPassword,
      role: 'advisor',
      firstName: 'Mäklaren',
      lastName: 'Demo',
      company: 'M&A Advisors',
      isVerified: true,
    },
  })
  console.log(`✅ Advisor created: ${advisor.email}`)

  console.log(`
═══════════════════════════════════════════════════════════════
✅ DEMO USERS SETUP COMPLETE
═══════════════════════════════════════════════════════════════

📧 LOGIN CREDENTIALS:

1️⃣  SÄLJARE (Seller):
    Email: saljare@bolaxo.com
    Password: ${password}
    Role: seller

2️⃣  KÖPARE (Buyer):
    Email: kopare@bolaxo.com
    Password: ${password}
    Role: buyer

3️⃣  MÄKLARE (Advisor):
    Email: maklare@bolaxo.com
    Password: ${password}
    Role: advisor

═══════════════════════════════════════════════════════════════

🚀 NEXT STEPS:
1. Go to http://localhost:3000/login
2. Login with any of the above credentials
3. Test the M&A workflow:
   - Säljaren: Create listing, upload documents
   - Köparen: Find listing, ask questions, generate SPA
   - Mäklaren: Oversee the process

═══════════════════════════════════════════════════════════════
  `)

  console.log('✨ Setup complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
