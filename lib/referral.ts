import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Genererar en unik referral code för en användare
 * Format: 6 tecken, uppercase, alfanumerisk
 */
export async function generateReferralCode(): Promise<string> {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Utan O, 0, I, 1 för att undvika förvirring
  let code = ''
  let isUnique = false
  
  while (!isUnique) {
    // Generera 6-tecken kod
    code = ''
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    
    // Kolla om koden redan finns
    const existing = await prisma.user.findUnique({
      where: { referralCode: code }
    })
    
    if (!existing) {
      isUnique = true
    }
  }
  
  return code
}

/**
 * Hämtar en användare via referral code
 */
export async function getUserByReferralCode(code: string) {
  if (!code) return null
  
  return await prisma.user.findUnique({
    where: { referralCode: code.toUpperCase() },
    select: {
      id: true,
      email: true,
      name: true,
      referralCode: true
    }
  })
}

/**
 * Räknar antalet användare som refererats av en viss användare
 */
export async function countReferrals(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true }
  })
  
  if (!user?.referralCode) return 0
  
  return await prisma.user.count({
    where: { referredBy: user.referralCode }
  })
}

