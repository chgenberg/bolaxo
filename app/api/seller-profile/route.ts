import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper to get user from session
async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value
  
  if (!sessionToken) {
    return null
  }
  
  const user = await prisma.user.findFirst({
    where: { magicLinkToken: sessionToken },
    include: { sellerProfile: true }
  })
  
  return user
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true,
      profile: user.sellerProfile ? {
        name: user.name || '',
        email: user.email || '',
        phone: user.sellerProfile.phone || '',
        country: user.sellerProfile.country || 'Sverige',
        city: user.sellerProfile.city || '',
        sellerType: user.sellerProfile.sellerType || '',
        orgId: user.sellerProfile.orgId || '',
        website: user.sellerProfile.website || '',
        linkedin: user.sellerProfile.linkedin || '',
        sellerDescription: user.sellerProfile.sellerDescription || '',
        situationText: user.sellerProfile.situationText || '',
        regions: user.sellerProfile.regions || [],
        branches: user.sellerProfile.branches || [],
        companyStatus: user.sellerProfile.companyStatus || [],
        verificationMethod: user.sellerProfile.verificationMethod || '',
        profileComplete: user.sellerProfile.profileComplete || false
      } : null,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        bankIdVerified: user.bankIdVerified
      }
    })
  } catch (error) {
    console.error('Error fetching seller profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const profileData = {
      phone: data.phone || null,
      country: data.country || 'Sverige',
      city: data.city || null,
      sellerType: data.sellerType || null,
      orgId: data.orgId || null,
      website: data.website || null,
      linkedin: data.linkedin || null,
      sellerDescription: data.sellerDescription || null,
      situationText: data.situationText || null,
      regions: data.regions || [],
      branches: data.branches || [],
      companyStatus: data.companyStatus || [],
      verificationMethod: data.verificationMethod || null,
      profileComplete: data.profileComplete || false
    }

    // Upsert the seller profile
    const profile = await prisma.sellerProfile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        userId: user.id,
        ...profileData
      }
    })

    // Also update user name if provided
    if (data.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: data.name }
      })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Error saving seller profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
