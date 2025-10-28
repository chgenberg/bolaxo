const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  const email = 'admin@bolaxo.com'
  const newPassword = 'Password123'

  try {
    console.log(`🔄 Attempting to reset password for ${email}...`)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`❌ User ${email} not found. Creating new admin user...`)
      
      // Create new admin user
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(newPassword, saltRounds)

      const newUser = await prisma.user.create({
        data: {
          email,
          name: 'Admin',
          role: 'admin',
          passwordHash,
          verified: true,
          bankIdVerified: true,
          companyName: 'Bolaxo Admin'
        }
      })

      console.log(`✅ Admin user created successfully!`)
      console.log(`📧 Email: ${newUser.email}`)
      console.log(`🔑 Password: ${newPassword}`)
      console.log(`\n🌐 Login at: https://app.bolaxo.com/admin/login`)
      return
    }

    // User exists - update password
    console.log(`✅ User found: ${user.email} (Role: ${user.role})`)
    
    if (user.role !== 'admin') {
      console.log(`❌ User is not an admin (role: ${user.role})`)
      process.exit(1)
    }

    // Hash new password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    })

    console.log(`✅ Password updated successfully!`)
    console.log(`📧 Email: ${updatedUser.email}`)
    console.log(`🔑 New password: ${newPassword}`)
    console.log(`\n🌐 Login at: https://app.bolaxo.com/admin/login`)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
