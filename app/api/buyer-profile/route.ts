import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Hämta köparprofil
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'userId eller email krävs' },
        { status: 400 }
      )
    }

    // Hitta användare
    let user
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { buyerProfile: true }
      })
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { buyerProfile: true }
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Användare ej funnen' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      profile: user.buyerProfile || null,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error fetching buyer profile:', error)
    return NextResponse.json(
      { error: 'Kunde inte hämta köparprofil' },
      { status: 500 }
    )
  }
}

// POST - Skapa eller uppdatera köparprofil
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      email,
      preferredRegions,
      preferredIndustries,
      revenueMin,
      revenueMax,
      ebitdaMin,
      ebitdaMax,
      priceMin,
      priceMax,
      investmentType,
      profitabilityPreference,
      buyerType,
      investmentExperience,
      financingReady,
      timeframe,
      employeeCountMin,
      employeeCountMax,
      companyAgeMin,
      ownerInvolvement,
      additionalCriteria,
      dealBreakers,
      emailAlerts,
      smsAlerts,
      alertFrequency,
      // User info (om ny användare)
      name,
      phone,
      companyName
    } = body

    // Hitta eller skapa användare
    let user
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    } else if (email) {
      // Skapa användare om de inte finns
      user = await prisma.user.upsert({
        where: { email },
        update: {
          name: name || undefined,
          phone: phone || undefined,
          companyName: companyName || undefined,
          lastLoginAt: new Date()
        },
        create: {
          email,
          name: name || null,
          phone: phone || null,
          companyName: companyName || null,
          role: 'buyer',
          verified: false,
          bankIdVerified: false
        }
      })
    } else {
      return NextResponse.json(
        { error: 'userId eller email krävs' },
        { status: 400 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Kunde inte hitta eller skapa användare' },
        { status: 404 }
      )
    }

    // Konvertera MSEK till SEK för revenue
    const convertMSEKtoSEK = (value: number | undefined | null) => {
      if (!value) return null
      return Math.round(value * 1000000)
    }

    // Skapa eller uppdatera köparprofil
    const buyerProfile = await prisma.buyerProfile.upsert({
      where: { userId: user.id },
      update: {
        preferredRegions: preferredRegions || [],
        preferredIndustries: preferredIndustries || [],
        revenueMin: convertMSEKtoSEK(revenueMin),
        revenueMax: convertMSEKtoSEK(revenueMax),
        ebitdaMin: convertMSEKtoSEK(ebitdaMin),
        ebitdaMax: convertMSEKtoSEK(ebitdaMax),
        priceMin: convertMSEKtoSEK(priceMin),
        priceMax: convertMSEKtoSEK(priceMax),
        investmentType,
        profitabilityPreference,
        buyerType,
        investmentExperience,
        financingReady: financingReady || false,
        timeframe,
        employeeCountMin,
        employeeCountMax,
        companyAgeMin,
        ownerInvolvement,
        additionalCriteria,
        dealBreakers,
        emailAlerts: emailAlerts !== false,
        smsAlerts: smsAlerts || false,
        alertFrequency: alertFrequency || 'daily',
        lastSearchAt: new Date()
      },
      create: {
        userId: user.id,
        preferredRegions: preferredRegions || [],
        preferredIndustries: preferredIndustries || [],
        revenueMin: convertMSEKtoSEK(revenueMin),
        revenueMax: convertMSEKtoSEK(revenueMax),
        ebitdaMin: convertMSEKtoSEK(ebitdaMin),
        ebitdaMax: convertMSEKtoSEK(ebitdaMax),
        priceMin: convertMSEKtoSEK(priceMin),
        priceMax: convertMSEKtoSEK(priceMax),
        investmentType,
        profitabilityPreference,
        buyerType,
        investmentExperience,
        financingReady: financingReady || false,
        timeframe,
        employeeCountMin,
        employeeCountMax,
        companyAgeMin,
        ownerInvolvement,
        additionalCriteria,
        dealBreakers,
        emailAlerts: emailAlerts !== false,
        smsAlerts: smsAlerts || false,
        alertFrequency: alertFrequency || 'daily'
      }
    })

    return NextResponse.json({
      success: true,
      profile: buyerProfile,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      message: 'Köparprofil sparad!'
    })
  } catch (error) {
    console.error('Error saving buyer profile:', error)
    return NextResponse.json(
      { error: 'Kunde inte spara köparprofil', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Ta bort köparprofil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId krävs' },
        { status: 400 }
      )
    }

    await prisma.buyerProfile.delete({
      where: { userId }
    })

    return NextResponse.json({
      success: true,
      message: 'Köparprofil borttagen'
    })
  } catch (error) {
    console.error('Error deleting buyer profile:', error)
    return NextResponse.json(
      { error: 'Kunde inte ta bort köparprofil' },
      { status: 500 }
    )
  }
}
