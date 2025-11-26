import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true }
    })

    return NextResponse.json({ 
      profile: profile ? {
        name: user?.name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        country: profile.country || 'Sverige',
        city: profile.city || '',
        sellerType: profile.sellerType || '',
        orgId: profile.orgId || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        sellerDescription: profile.sellerDescription || '',
        situationText: profile.situationText || '',
        regions: profile.regions || [],
        branches: profile.branches || [],
        companyStatus: profile.companyStatus || [],
        verificationMethod: profile.verificationMethod || '',
        profileComplete: profile.profileComplete || false
      } : null,
      user 
    })
  } catch (error) {
    console.error('Error fetching seller profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Upsert the seller profile
    const profile = await prisma.sellerProfile.upsert({
      where: { userId: session.user.id },
      update: {
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
        profileComplete: data.profileComplete || false,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
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
    })

    // Also update user name if provided
    if (data.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: data.name }
      })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Error saving seller profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}

