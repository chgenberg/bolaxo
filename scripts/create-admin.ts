import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function createAdmin() {
  console.log('\n🔐 SKAPA ADMIN-ANVÄNDARE')
  console.log('========================\n')

  try {
    // Get email
    const email = await question('E-postadress: ')
    if (!email || !email.includes('@')) {
      console.error('❌ Ogiltig e-postadress')
      rl.close()
      return
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      console.error(`❌ Användare med e-posten ${email} finns redan`)
      rl.close()
      return
    }

    // Get name
    const name = await question('Namn (valfritt): ')

    // Get password
    let password = ''
    let valid = false
    while (!valid) {
      password = await question('Lösenord (min 12 tecken): ')
      if (password.length < 12) {
        console.error('❌ Lösenordet måste vara minst 12 tecken långt')
      } else {
        valid = true
      }
    }

    // Confirm password
    const confirmPassword = await question('Bekräfta lösenord: ')
    if (password !== confirmPassword) {
      console.error('❌ Lösenorden matchar inte')
      rl.close()
      return
    }

    // Hash password
    console.log('\n⏳ Skapar admin-användare...')
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        role: 'admin',
        passwordHash,
        verified: true,
        bankIdVerified: true,
        createdAt: new Date()
      }
    })

    console.log('\n✅ Admin-användare skapad framgångsrikt!\n')
    console.log('📋 Inloggningsuppgifter:')
    console.log(`   E-post: ${adminUser.email}`)
    console.log(`   Lösenord: ${password}`)
    console.log(`   URL: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/login\n`)

    rl.close()
  } catch (error) {
    console.error('❌ Fel vid skapande av admin:', error)
    rl.close()
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin().then(() => process.exit(0))
