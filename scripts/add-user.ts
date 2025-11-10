import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'philipsonpar@gmail.com'
  
  console.log(`👤 Creating/updating user: ${email}`)
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })
  
  if (existingUser) {
    // Update existing user to have both roles
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: 'seller,buyer', // Store both roles as comma-separated string
        verified: true,
        bankIdVerified: true,
      }
    })
    console.log(`✅ User updated: ${updatedUser.email} with role: ${updatedUser.role}`)
  } else {
    // Create new user with both roles
    const newUser = await prisma.user.create({
      data: {
        email,
        name: 'Philip Sonpar',
        role: 'seller,buyer', // Store both roles as comma-separated string
        verified: true,
        bankIdVerified: true,
      }
    })
    console.log(`✅ User created: ${newUser.email} with role: ${newUser.role}`)
  }
  
  console.log(`
═══════════════════════════════════════════════════════════════
✅ USER SETUP COMPLETE
═══════════════════════════════════════════════════════════════

📧 USER DETAILS:
   Email: ${email}
   Role: seller,buyer (both seller and buyer)

═══════════════════════════════════════════════════════════════
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

