import { NextRequest, NextResponse } from 'next/server'
import { generateSPAPDF, type SPAPdfData } from '@/lib/spa-pdf-generator'

const DEMO_SPA_DATA: SPAPdfData = {
  sellerName: 'Tech Founders AB',
  sellerOrgNumber: '556234-5678',
  sellerAddress: 'Stureplan 2, 114 35 Stockholm',
  buyerName: 'Industrikapital Partners AB',
  buyerOrgNumber: '556100-1234',
  buyerAddress: 'Norrlandsgatan 15, 113 41 Stockholm',
  companyName: 'TechVision AB',
  companyOrgNumber: '556234-5678',
  companyAddress: 'Stureplan 2, 114 35 Stockholm',
  numberOfShares: 1000,
  percentageOwned: 100,
  purchasePrice: 150000000, // 150 MSEK
  closingDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  paymentMethod: 'wire',
  paymentDueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  
  // Payment structure
  cashAtClosing: 115000000,      // 76.7%
  escrowAmount: 20000000,         // 13.3% (18 months holdback)
  escrowPeriod: '18 månader',
  earnoutAmount: 15000000,        // 10% (3-year earnout)
  earnoutPeriod: '3 år',
  earnoutKPI: 'Revenue growth: Annual revenue must exceed 55 MSEK in years 2-3 of measurement period',
  
  // Representations from seller
  representations: [
    'Organisationen: Bolaget är korrekt registrerat hos Bolagsverket och är en aktiebolaget enligt svensk lag',
    'Äganderätt: Säljaren äger 100% av aktierna och dessa är helt obundna',
    'Finansiella rapporter: Årsredovisningar för 2021-2024 är korrekta, fullständiga och följer god redovisningssed',
    'Inga dolda skulder: Inga skulder eller åtaganden existerar utanför balansräkningen',
    'Kontrakt: Alla material kontrakt är tillgängliga för inspektion och är giltiga',
    'Tvister: Inga pågående eller hotande tvister existerar',
    'Anställda: Alla anställningsförhållanden är lagliga och alla löner är betalt',
    'Skatter: Alla skatter är betalda och all rapportering är korrekt genomförd',
    'Intellektuell egendom: Bolaget äger all IP och ingen tredjepartsrisk existerar',
    'Miljö: Inga miljöföroreningar eller miljörättsliga åtaganden föreligger'
  ],
  
  // Warranties from seller
  warranties: [
    'Full äganderätt: Säljaren äger aktierna utan belastning och kan överlåta dem fritt',
    'Ingen belastning: Aktierna är fria från pant, säkerhet, eller annat rättighetstillfälle',
    'Förköpsrätter: Inga förköpsrätter, hembudsklausuler eller andra transferrestriktioner gäller',
    'Godkännanden: Alla nödvändiga godkännanden från Bolagsverket, skatteverket och andra myndigheter kan erhållas',
    'Riktighet: All information som lämnats i due diligence är sanningsenlig och fullständig',
    'Väsentlighet: Ingen väsentlig förändring i bolagets verksamhet eller ekonomi har inträffat'
  ],
  
  // Closing conditions
  conditions: [
    'Bolagsstämmebeslut: Stämmobeslut från båda parter fattas under normala omständigheter',
    'Väsentlig förändring: Inga väsentliga negativa förändringar i bolaget eller marknaden',
    'Nyckeltal: Key person retention agreements är undertecknade av CTO och Head of Sales',
    'Kundkontrakt: Top 10 kundkontrakt är bekräftade att fortsätta post-closing',
    'Banker: Financing arrangeras enligt överenskommet',
    'Rättsligt stöd: Erfordrade juridiska godkännanden erhålls',
    'Tredje part: Alla erforderliga godkännanden från tredje parter erhålls'
  ],
  
  // Additional terms
  nonCompetePeriod: '3 år',
  indemnification: 'Seller indemnification: 18 months from closing, capped at 10% of purchase price (15 MSEK), minimum claim 100 KSEK. Escrow amount serves as source for indemnification claims.',
  
  // Financial data for the SPA
  financialData: {
    latestYear: 2024,
    revenue: 52000000,
    ebitda: 10400000,
    ebitdaMargin: 20,
    employees: 12,
    yearlyBreakdown: [
      { year: 2022, revenue: 32000000, ebitda: 5120000 },
      { year: 2023, revenue: 46400000, ebitda: 8352000 },
      { year: 2024, revenue: 52000000, ebitda: 10400000 }
    ]
  },
  
  // Additional info
  extractedInfo: {
    companyName: 'TechVision AB',
    companyOrgNumber: '556234-5678',
    companyAddress: 'Stureplan 2, 114 35 Stockholm',
    businessDescription: 'TechVision är en ledande leverantör av molnbaserade affärssystem för medelstora företag i Norden. Företaget erbjuder konsultation, implementering och support för enterprise-lösningar.',
    keyCustomers: ['Televerket', 'Vattenfall Digital', 'Scania Digital Services', 'Volvo Connected Solutions'],
    keyPersonnel: [
      { name: 'Anders Jönsson', title: 'CEO & Founder', tenure: '8 år' },
      { name: 'Sofia Bergström', title: 'CTO & Co-founder', tenure: '8 år' },
      { name: 'Magnus Eriksson', title: 'Head of Sales', tenure: '4 år' }
    ],
    financialData: {
      latestYear: 2024,
      revenue: 52000000,
      ebitda: 10400000,
      ebitdaMargin: 20,
      employees: 12,
      yearlyBreakdown: [
        { year: 2022, revenue: 32000000, ebitda: 5120000 },
        { year: 2023, revenue: 46400000, ebitda: 8352000 },
        { year: 2024, revenue: 52000000, ebitda: 10400000 }
      ]
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    // Generate PDF with demo data
    const pdfBuffer = await generateSPAPDF(DEMO_SPA_DATA)

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="spa-avtalet-${DEMO_SPA_DATA.companyName.replace(/[^a-z0-9]/gi, '_')}-${new Date().getTime()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('SPA PDF generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate SPA PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
