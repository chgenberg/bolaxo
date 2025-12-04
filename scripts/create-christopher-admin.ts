import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createChristopherAdmin() {
  const email = 'christopher@trestorgroup.se'
  const password = 'Trestor Group2025!Admin' // Starkt lösenord

  try {
    console.log(`🔐 Creating admin user: ${email}...`)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log(`⚠️ User ${email} already exists.`)
      
      if (existingUser.role !== 'admin') {
        // Update to admin
        const saltRounds = 12
        const passwordHash = await bcrypt.hash(password, saltRounds)
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { 
            role: 'admin',
            passwordHash,
            verified: true,
            bankIdVerified: true
          }
        })
        console.log(`✅ User promoted to admin and password updated!`)
      } else {
        // Just update password
        const saltRounds = 12
        const passwordHash = await bcrypt.hash(password, saltRounds)
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { passwordHash }
        })
        console.log(`✅ Password updated for existing admin!`)
      }
    } else {
      // Create new admin user
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      await prisma.user.create({
        data: {
          email,
          name: 'Christopher',
          role: 'admin',
          passwordHash,
          verified: true,
          bankIdVerified: true,
          companyName: 'Trestor Group'
        }
      })
      console.log(`✅ Admin user created successfully!`)
    }

    console.log(`\n📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log(`\n🌐 Login at: https://bolaxo-production.up.railway.app/admin/login`)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createChristopherAdmin()


