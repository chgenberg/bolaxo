import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractSPAData } from '@/lib/document-analyzer'
import { generateSPAPDF, type SPAPdfData } from '@/lib/spa-pdf-generator'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { listingId, buyerId, uploads, sellerId } = body

    if (!listingId || !buyerId) {
      return NextResponse.json(
        { error: 'Missing listingId or buyerId' },
        { status: 400 }
      )
    }

    // Simulate document processing (in real app, would read from S3)
    // Extract all document contents
    const documents: Array<{ type: string; content: string }> = [
      {
        type: 'company_info',
        content: 'Company registration documents, org structure'
      },
      {
        type: 'financial_statements',
        content: 'Financial statements and revenue data'
      },
      {
        type: 'customer_analysis',
        content: 'Customer contracts and concentration analysis'
      },
      {
        type: 'hr_documentation',
        content: 'HR data and employee information'
      },
      {
        type: 'legal_documentation',
        content: 'Legal documents and compliance info'
      }
    ]

    // Extract SPA data using GPT
    console.log('Extracting SPA data from documents...')
    const spaData = await extractSPAData(documents)

    // Create SPAPdfData object
    const pdfData: SPAPdfData = {
      sellerName: spaData.companyName || 'Säljare AB',
      sellerOrgNumber: spaData.companyOrgNumber || '556000-0000',
      sellerAddress: spaData.companyAddress || 'Stockholm, Sverige',
      buyerName: 'Köpare AB',
      buyerOrgNumber: '556111-1111',
      buyerAddress: 'Stockholm, Sverige',
      companyName: spaData.companyName || 'Målbolaget AB',
      companyOrgNumber: spaData.companyOrgNumber || '556000-0000',
      companyAddress: spaData.companyAddress || 'Stockholm, Sverige',
      numberOfShares: 100,
      percentageOwned: 100,
      purchasePrice: 50000000,
      closingDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: 'wire',
      paymentDueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      cashAtClosing: 40000000,
      escrowAmount: 5000000,
      escrowPeriod: '18 månader',
      earnoutAmount: 5000000,
      earnoutPeriod: '3 år',
      earnoutKPI: 'Revenue > 55M SEK annually',
      representations: [
        'Bolagets finansiella rapporter är korrekta och fullständiga',
        'Inga dolda skulder eller åtaganden existerar',
        'Alla material kontrakt är tillgängliga',
        'Inga pågående tvister eller juridiska ärenden'
      ],
      warranties: [
        'Full äganderätt till aktierna',
        'Aktierna är fria från belastningar',
        'Inga förköpsrätter eller hembudsklausuler gäller',
        'Alla nödvändiga godkännanden erhålls'
      ],
      conditions: [
        'Shareholder godkännande erhålls',
        'Inga väsentliga negativa förändringar',
        'Key person retention agreements signed',
        'Customer contracts reaffirmed'
      ],
      nonCompetePeriod: '3 år',
      financialData: spaData.financialData,
      extractedInfo: spaData
    }

    // Generate PDF
    console.log('Generating SPA PDF...')
    const pdfBuffer = await generateSPAPDF(pdfData)

    // Save to database
    const spaId = uuidv4()
    const spa = await prisma.sPA.create({
      data: {
        id: spaId,
        listingId,
        buyerId,
        template: 'standard',
        purchasePrice: pdfData.purchasePrice,
        closingDate: new Date(pdfData.closingDate),
        cashAtClosing: pdfData.cashAtClosing,
        escrowHoldback: pdfData.escrowAmount,
        earnOutStructure: {
          totalEarnout: pdfData.earnoutAmount,
          period: pdfData.earnoutPeriod,
          kpi: pdfData.earnoutKPI
        },
        representations: JSON.stringify(pdfData.representations),
        warranties: JSON.stringify(pdfData.warranties),
        indemnification: 'Standard terms apply',
        closingConditions: JSON.stringify(pdfData.conditions),
        status: 'draft',
        version: 1
      }
    })

    // Store PDF in memory/S3
    const pdfUrl = `/api/sme/spa/download/${spaId}`

    return NextResponse.json({
      success: true,
      spaId,
      pdfUrl,
      status: 'draft',
      message: 'SPA generated successfully'
    })
  } catch (error) {
    console.error('SPA generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate SPA',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
