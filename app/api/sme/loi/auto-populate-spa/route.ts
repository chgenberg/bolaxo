import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface LoITerms {
  listingId: string
  buyerName: string
  sellerName: string
  purchasePrice: number
  cashAtClosing: number
  escrowAmount: number
  escrowPeriod: number
  earnoutAmount: number
  earnoutTerms?: {
    year1?: { target: number; amount: number }
    year2?: { target: number; amount: number }
    year3?: { target: number; amount: number }
  }
  nonCompetePeriod?: number
  nonCompeteGeography?: string
  keyPersonRetention?: Array<{ name: string; amount: number; period: number }>
  closingDate?: string
}

interface PopulatedSPAData {
  // Party Info
  buyerName: string
  sellerName: string
  companyName: string
  
  // Pricing & Payment
  basePurchasePrice: number
  cashAtClosing: number
  escrowAmount: number
  escrowPeriod: number
  earnoutAmount: number
  earnoutPercentage: number
  totalMaxPrice: number
  totalEarnout: number
  
  // Earnout Details
  earnoutYear1Target?: number
  earnoutYear1Amount?: number
  earnoutYear2Target?: number
  earnoutYear2Amount?: number
  earnoutYear3Target?: number
  earnoutYear3Amount?: number
  
  // Representations & Warranties
  representations: {
    organization: string[]
    capitalization: string[]
    financial: string[]
    assets: string[]
    liabilities: string[]
    contracts: string[]
  }
  
  // Covenants
  covenants: {
    seller: string[]
    buyer: string[]
  }
  
  // Non-Compete
  nonCompetePeriod: number
  nonCompeteGeography: string
  
  // Key Person Retention
  ceoBonus: number
  ctoBonus: number
  otherBonus: number
  
  // Closing Info
  closingDate: string
  
  // Schedules
  schedules: {
    customers: Array<{ name: string; revenue: string; share: string; status: string }>
    suppliers: Array<{ name: string; category: string; annual: string; terms: string }>
    employees: Array<{ name: string; role: string; salary: string; bonus: string; tenure: string }>
  }
  
  // Material Contracts
  material_contracts: Array<{ contract: string; value: string; term: string; coc_risk: string; status: string }>
  
  // Legal Issues
  legal_issues: Array<{ issue: string; amount: string; status: string; probability: string; recommendation: string }>
}

// Default representations & warranties template
const DEFAULT_REPRESENTATIONS = {
  organization: [
    'Säljaren är juridiskt befogad att sälja bolaget',
    'Alla styrelseprotokoll för försäljning är godkända',
    'Ingen tredjepartsgodkännande krävs'
  ],
  capitalization: [
    'Aktiestrukturen är korrekt dokumenterad',
    'Inga optioner eller konvertibler utestående',
    'Säljaren äger 100% av aktierna'
  ],
  financial: [
    'Finansiella rapporter är korrekta och kompletta',
    'Inga dolda skulder eller åtaganden',
    'Working Capital är normalt för branschen',
    'Inget material adverse change sedan rapporterna'
  ],
  assets: [
    'Alla materiella tillgångar är ägt av bolaget',
    'Ingen säkerhet är belånad',
    'Alla fastigheter är försäkrade'
  ],
  liabilities: [
    'Alla skulder är dokumenterade',
    'Inga pågående tvister eller rättegångar',
    'Alla skatter är betalda'
  ],
  contracts: [
    'Alla material contracts är giltiga',
    'Inga material kontrakt förfaller inom 12 mån',
    'Ingen change of control-klausul kräver tredjepartsgodkännande'
  ]
}

const DEFAULT_COVENANTS = {
  seller: [
    'Säljaren ska föra verksamheten i normal ordning',
    'Säljaren ska inte göra väsentliga ändringar utan godkännande',
    'Säljaren ska underrätta om väsentliga förändringar',
    'Säljaren ska säkra kunders kontinuerliga affärer',
    'Säljaren ska inte försälja andra tillgångar'
  ],
  buyer: [
    'Köparen ska genomföra due diligence med omsorg',
    'Köparen ska ansöka om nödvändiga myndighetsgodkännanden',
    'Köparen ska hålla information konfidentiell',
    'Köparen ska göra rimliga försök att uppfylla villkor'
  ]
}

// Demo schedules (in production, would fetch from database)
const DEMO_SCHEDULES = {
  customers: [
    { name: 'BigCorp Sverige', revenue: '3.5 MSEK', share: '23%', status: 'Active' },
    { name: 'MediumCorp AB', revenue: '2.8 MSEK', share: '19%', status: 'Active' },
    { name: 'SmallBiz Ltd', revenue: '1.2 MSEK', share: '8%', status: 'Active' },
    { name: 'Freelance Network', revenue: '0.8 MSEK', share: '5%', status: 'Active' }
  ],
  suppliers: [
    { name: 'AWS', category: 'Cloud', annual: '800 KSEK', terms: 'Monthly' },
    { name: 'Stripe', category: 'Payments', annual: '200 KSEK', terms: 'Monthly' },
    { name: 'Office Supplies Co', category: 'Materials', annual: '150 KSEK', terms: '30 days' }
  ],
  employees: [
    { name: 'Anna Andersson', role: 'VD', salary: '600 KSEK', bonus: '100 KSEK', tenure: '10 år' },
    { name: 'Erik Svensson', role: 'CTO', salary: '550 KSEK', bonus: '80 KSEK', tenure: '8 år' },
    { name: 'Sofia Bergström', role: 'Head of Sales', salary: '500 KSEK', bonus: '60 KSEK', tenure: '5 år' }
  ]
}

const DEMO_MATERIAL_CONTRACTS = [
  { contract: 'AWS Enterprise Agreement', value: '800 KSEK/år', term: '3 years', coc_risk: 'High', status: 'Confirmed' },
  { contract: 'Key Customer Contract - BigCorp', value: '3.5 MSEK/år', term: 'Evergreen', coc_risk: 'Critical', status: 'Confirmed' },
  { contract: 'Office Lease - Stockholm', value: '2.4 MSEK/år', term: '5 years', coc_risk: 'Medium', status: 'Active' }
]

const DEMO_LEGAL_ISSUES = [
  { issue: 'Pending lawsuit from former employee', amount: '250 KSEK', status: 'Settlement negotiation', probability: 'Medium', recommendation: 'Set aside for settlement' },
  { issue: 'Tax audit for 2022 fiscal year', amount: '150 KSEK', status: 'Under review', probability: 'Low', recommendation: 'Monitor closely' }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId, loiId } = body

    if (!listingId || !loiId) {
      return NextResponse.json(
        { error: 'listingId and loiId required' },
        { status: 400 }
      )
    }

    // Fetch LoI from database
    const loi = await prisma.lOI.findUnique({
      where: { id: loiId }
    })

    if (!loi) {
      return NextResponse.json(
        { error: 'LoI not found' },
        { status: 404 }
      )
    }

    // Fetch listing for company info
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Extract LoI terms
    const loiTerms: LoITerms = {
      listingId,
      buyerName: loi.buyerName || 'Köpare AB',
      sellerName: loi.sellerName || 'Säljare',
      purchasePrice: loi.purchasePrice || 50000000,
      cashAtClosing: loi.cashAtClosing || 35000000,
      escrowAmount: loi.escrowAmount || 10000000,
      escrowPeriod: loi.escrowPeriod || 18,
      earnoutAmount: loi.earnoutAmount || 5000000,
      earnoutTerms: loi.earnoutTerms as any,
      nonCompetePeriod: loi.nonCompetePeriod || 3,
      nonCompeteGeography: loi.nonCompeteGeography || 'Sweden',
      closingDate: loi.proposedClosingDate?.toISOString().split('T')[0] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    // Populate SPA data from LoI
    const populatedSPA: PopulatedSPAData = {
      // Party Info
      buyerName: loiTerms.buyerName,
      sellerName: loiTerms.sellerName,
      companyName: listing.companyName || 'Target Company',
      
      // Pricing & Payment
      basePurchasePrice: loiTerms.purchasePrice,
      cashAtClosing: loiTerms.cashAtClosing,
      escrowAmount: loiTerms.escrowAmount,
      escrowPeriod: loiTerms.escrowPeriod,
      earnoutAmount: loiTerms.earnoutAmount,
      earnoutPercentage: (loiTerms.earnoutAmount / loiTerms.purchasePrice) * 100,
      totalMaxPrice: loiTerms.purchasePrice + loiTerms.earnoutAmount,
      totalEarnout: loiTerms.earnoutAmount,
      
      // Earnout Details - Extract from LoI
      earnoutYear1Target: (loiTerms.earnoutTerms?.year1?.target || 0),
      earnoutYear1Amount: (loiTerms.earnoutTerms?.year1?.amount || 0),
      earnoutYear2Target: (loiTerms.earnoutTerms?.year2?.target || 0),
      earnoutYear2Amount: (loiTerms.earnoutTerms?.year2?.amount || 0),
      earnoutYear3Target: (loiTerms.earnoutTerms?.year3?.target || 0),
      earnoutYear3Amount: (loiTerms.earnoutTerms?.year3?.amount || 0),
      
      // Representations & Warranties
      representations: DEFAULT_REPRESENTATIONS,
      
      // Covenants
      covenants: DEFAULT_COVENANTS,
      
      // Non-Compete
      nonCompetePeriod: loiTerms.nonCompetePeriod,
      nonCompeteGeography: loiTerms.nonCompeteGeography,
      
      // Key Person Retention
      ceoBonus: 1000000,
      ctoBonus: 800000,
      otherBonus: 500000,
      
      // Closing Date
      closingDate: loiTerms.closingDate,
      
      // Schedules
      schedules: DEMO_SCHEDULES,
      material_contracts: DEMO_MATERIAL_CONTRACTS,
      legal_issues: DEMO_LEGAL_ISSUES
    }

    return NextResponse.json({
      success: true,
      message: 'LoI terms extracted and SPA populated',
      spaData: populatedSPA,
      extractedTerms: loiTerms,
      nextSteps: [
        'Review populated SPA',
        'Make any adjustments',
        'Generate SPA PDF',
        'Both parties sign'
      ]
    })
  } catch (error) {
    console.error('LoI to SPA population error:', error)
    return NextResponse.json(
      { error: 'Failed to populate SPA from LoI', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const loiId = searchParams.get('loiId')
  const listingId = searchParams.get('listingId')

  if (!loiId || !listingId) {
    return NextResponse.json(
      { error: 'loiId and listingId query parameters required' },
      { status: 400 }
    )
  }

  // Call POST logic
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ loiId, listingId })
    })
  )
}
