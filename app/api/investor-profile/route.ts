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
    include: { buyerProfile: true }
  })
  
  return user
}

// GET - Fetch investor profile
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Return existing profile or empty object
    return NextResponse.json({
      success: true,
      profile: user.buyerProfile || null,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        bankIdVerified: user.bankIdVerified
      }
    })
  } catch (error) {
    console.error('Error fetching investor profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// POST - Create or update investor profile
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Extract profile data from request
    const profileData = {
      // Step 1: Basic Info
      phone: body.phone || null,
      country: body.country || 'Sverige',
      city: body.city || null,
      buyerType: body.buyerType || null,
      orgNo: body.orgNo || null,
      website: body.website || null,
      linkedin: body.linkedin || null,
      
      // Step 2: Investor Profile
      investorDescription: body.investorDescription || null,
      targetTypeText: body.targetTypeText || null,
      
      // Step 3: Geographic Focus
      preferredRegions: body.regions || [],
      
      // Step 4: Industry & Company Type
      preferredIndustries: body.branches || [],
      companyStatus: body.companyStatus || [],
      
      // Step 5: Size & KPIs
      revenueMin: body.turnoverMin ? parseInt(body.turnoverMin) * 1000000 : null,
      revenueMax: body.turnoverMax ? parseInt(body.turnoverMax) * 1000000 : null,
      ebitdaMin: body.ebitdaMin ? parseInt(body.ebitdaMin) * 1000000 : null,
      ebitdaMax: body.ebitdaMax ? parseInt(body.ebitdaMax) * 1000000 : null,
      employeeCountMin: body.employeesMin ? parseInt(body.employeesMin) : null,
      employeeCountMax: body.employeesMax ? parseInt(body.employeesMax) : null,
      priceMin: body.priceMin ? parseInt(body.priceMin) * 1000000 : null,
      priceMax: body.priceMax ? parseInt(body.priceMax) * 1000000 : null,
      investMin: body.investMin ? parseInt(body.investMin) : null,
      investMax: body.investMax ? parseInt(body.investMax) : null,
      profitabilityLevels: body.profitabilityLevels || [],
      
      // Step 6: Ownership & Role
      ownership: body.ownership || [],
      
      // Step 7: Deal Preferences
      situations: body.situations || [],
      ownerStay: body.ownerStay || null,
      earnOut: body.earnOut || null,
      takeOverLoans: body.takeOverLoans || null,
      
      // Step 8: Verification
      verificationMethod: body.verificationMethod || null,
      
      // Profile completion
      profileComplete: body.profileComplete || false,
      completedSteps: body.completedSteps || 0
    }
    
    // Also update user's name if provided
    if (body.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: body.name }
      })
    }
    
    // Upsert the buyer profile
    const profile = await prisma.buyerProfile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        userId: user.id,
        ...profileData
      }
    })
    
    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile saved successfully'
    })
  } catch (error) {
    console.error('Error saving investor profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}

// PATCH - Partial update (for individual step saves)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { step, data } = body
    
    // Map step data to profile fields
    let updateData: Record<string, any> = {}
    
    switch (step) {
      case 1:
        updateData = {
          phone: data.phone,
          country: data.country,
          city: data.city,
          buyerType: data.buyerType,
          orgNo: data.orgNo,
          website: data.website,
          linkedin: data.linkedin
        }
        if (data.name) {
          await prisma.user.update({
            where: { id: user.id },
            data: { name: data.name }
          })
        }
        break
      case 2:
        updateData = {
          investorDescription: data.investorDescription,
          targetTypeText: data.targetTypeText
        }
        break
      case 3:
        updateData = { preferredRegions: data.regions }
        break
      case 4:
        updateData = {
          preferredIndustries: data.branches,
          companyStatus: data.companyStatus
        }
        break
      case 5:
        updateData = {
          revenueMin: data.turnoverMin ? parseInt(data.turnoverMin) * 1000000 : null,
          revenueMax: data.turnoverMax ? parseInt(data.turnoverMax) * 1000000 : null,
          ebitdaMin: data.ebitdaMin ? parseInt(data.ebitdaMin) * 1000000 : null,
          ebitdaMax: data.ebitdaMax ? parseInt(data.ebitdaMax) * 1000000 : null,
          employeeCountMin: data.employeesMin ? parseInt(data.employeesMin) : null,
          employeeCountMax: data.employeesMax ? parseInt(data.employeesMax) : null,
          priceMin: data.priceMin ? parseInt(data.priceMin) * 1000000 : null,
          priceMax: data.priceMax ? parseInt(data.priceMax) * 1000000 : null,
          investMin: data.investMin ? parseInt(data.investMin) : null,
          investMax: data.investMax ? parseInt(data.investMax) : null,
          profitabilityLevels: data.profitabilityLevels
        }
        break
      case 6:
        updateData = { ownership: data.ownership }
        break
      case 7:
        updateData = {
          situations: data.situations,
          ownerStay: data.ownerStay,
          earnOut: data.earnOut,
          takeOverLoans: data.takeOverLoans
        }
        break
      case 8:
        updateData = {
          verificationMethod: data.verificationMethod,
          profileComplete: true,
          completedSteps: 8
        }
        break
    }
    
    // Update completed steps count
    updateData.completedSteps = Math.max(step, user.buyerProfile?.completedSteps || 0)
    
    // Upsert the profile
    const profile = await prisma.buyerProfile.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        ...updateData
      }
    })
    
    return NextResponse.json({
      success: true,
      profile,
      message: `Step ${step} saved`
    })
  } catch (error) {
    console.error('Error updating investor profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

