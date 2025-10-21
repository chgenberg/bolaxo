import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

// GDPR Article 15 & 20: Right to Data Portability
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('bolaxo_user_id')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Hämta ALL användardata
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        valuations: true,
        listings: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Ta bort känslig data (tokens, passwords om de fanns)
    const exportData = {
      personalInformation: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        companyName: user.companyName,
        orgNumber: user.orgNumber,
        region: user.region,
        role: user.role,
        verified: user.verified,
        bankIdVerified: user.bankIdVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      },
      valuations: user.valuations.map(v => ({
        id: v.id,
        createdAt: v.createdAt,
        companyName: v.companyName,
        industry: v.industry,
        valuationRange: {
          min: v.minValue,
          max: v.maxValue,
          mostLikely: v.mostLikely
        },
        inputData: v.inputJson,
        resultData: v.resultJson
      })),
      listings: user.listings.map(l => ({
        id: l.id,
        createdAt: l.createdAt,
        publishedAt: l.publishedAt,
        status: l.status,
        companyName: l.companyName,
        anonymousTitle: l.anonymousTitle,
        industry: l.industry,
        revenue: l.revenue,
        employees: l.employees,
        location: l.location,
        packageType: l.packageType
      })),
      metadata: {
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0',
        exportFormat: 'JSON',
        gdprCompliant: true
      }
    }

    // Logga export (audit trail)
    console.log(`GDPR Data Export for user ${user.email}`)

    // Returnera som downloadbar JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="bolaxo_data_export_${user.id}_${new Date().toISOString().split('T')[0]}.json"`
      }
    })

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}

