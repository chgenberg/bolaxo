import { NextRequest, NextResponse } from 'next/server'
import { generateDDReportPDF } from '@/lib/dd-pdf-generator'

const DEMO_DD_DATA = {
  listingId: 'listing-1',
  companyName: 'TechVision AB',
  companyOrgNumber: '556234-5678',
  buyerName: 'Industrikapital Partners',
  ddTeamLead: 'Erik Andersson, Partner',
  ddStartDate: '2024-10-01',
  ddCompletionDate: '2024-10-28',
  
  overallRiskLevel: 'Medium' as const,
  
  topThreeRisks: [
    'Kundberoende: 35% av omsättningen från 3 större kunder',
    'Teknisk skuld: Legacy-system behöver modernisering',
    'Nyckelpersonalberoende: 2 av 5 senior utvecklare kan ge uppsägning'
  ],
  
  dealRecommendation: 'Rekommendation: Genomför förvärvet med följande villkor: (1) Retentions-bonus för nyckelpersonal under 2 år, (2) Diversifiera kundbas genom integration med befintlig portfölj, (3) 6-månaders IT-moderniseringsplan innan full integration.',
  
  financialFindings: [
    {
      title: 'Stark omsättningsökning men sjunkande marginaler',
      severity: 'High' as const,
      description: 'Omsättningen har växt 45% CAGR 2021-2024, men EBITDA-marginalen har sjunkit från 28% till 22% på grund av ökade personalkostnader. Normaliserad EBITDA är ca 8,5 MSEK baserat på jämförbar data.',
      recommendation: 'Implementera kostnadsoptimering genom ökad automatisering och offshore-resurser. Målmarginal 26% är uppnåbar inom 12 månader.'
    },
    {
      title: 'Arbetskapitalberoende',
      severity: 'Medium' as const,
      description: 'Företaget har 60 dagars genomsnittlig betalningsperiod från kunder men 45 dagars till leverantörer. Kräver arbetande kapital på ca 2 MSEK för skalning.',
      recommendation: 'Struktuera financing-arrangemang för arbetande kapital. Implementera faktoring för accelererad kassainsamling.'
    },
    {
      title: 'Skatteeffektivitet',
      severity: 'Low' as const,
      description: 'Företaget utnyttjar inte fullt ut möjliga R&D-skattelättnader. Potentiell skatteåterbäring på 500-800 KSEK över 3 år.',
      recommendation: 'Konsultera specialiserad skattekonsult för R&D-claim-strategi. Implementation kan driva ytterligare 3-5% marginal.'
    }
  ],
  
  legalFindings: [
    {
      title: 'Kundkontrakt kräver konsultering vid överförande',
      severity: 'High' as const,
      description: 'Av de 15 större kundkontrakten kräver 8 st att ändringar i ägande meddelar kundern och 3 st har en "change of control"-klausul som kan trigga uppsägning.',
      recommendation: 'Påbörja dialog med 3 riskkunder omedelbar för att säkra continuation av kontrakt. Budgetera för möjlig prisrabatt 5-10%.'
    },
    {
      title: 'IP-rättigheter korrekt dokumenterade',
      severity: 'Low' as const,
      description: 'Alla utvecklade system och källkod är korrekt registrerade som företagets IP. Ingen tredjepartsrisk identifierad.',
      recommendation: 'Implementera IP-skyddsprotokoll i utvecklingsprocessen post-acquisition.'
    },
    {
      title: 'Tvister: En pågående mindre tvister',
      severity: 'Low' as const,
      description: 'En mindre leverantörskonflikt på ~300 KSEK är under förlikning. Försäkring täcker upp till 1 MSEK.',
      recommendation: 'Avsätt 300-400 KSEK för uppgörelse. Säkerställ att försäkringen förlängs post-acquisition.'
    }
  ],
  
  commercialFindings: [
    {
      title: 'Kundberoende utgör strategisk risk',
      severity: 'High' as const,
      description: 'Top 3 kunder utgör 37% av omsättningen. Största kunden (Televerket) är 18% av omsättningen. Kontrakten förnyades 2023 med 3-årig löptid.',
      recommendation: 'Fokusera på kundexpansion och diversifiering. Implementera account management-program för top-kunder. Målsättning: top 5 under 30% inom 18 månader.'
    },
    {
      title: 'Marknadspotential: SaaS-expansionsmöjlighet',
      severity: 'Low' as const,
      description: 'Företaget erbjuder idag endast tjänster. Det finns möjlighet att leverantörisera lösningen som SaaS. Marknaden värderas till 2-3 BSEK i Norden.',
      recommendation: 'Dedikera 1 FTE för SaaS-produktutveckling. Target: Beta-lansering Q3 2025. Potential recurring revenue model kan öka värdering 2-3x.'
    },
    {
      title: 'Konkurrens intensifieras men defensibel position',
      severity: 'Medium' as const,
      description: 'Två nya konkurrenter har entrat marknaden 2024, men TechVision har stark brand recognition och etablerade relationer.',
      recommendation: 'Fokusera på customer success och retention. Implementera proaktiv försäljning av uppselling-möjligheter.'
    }
  ],
  
  hrFindings: [
    {
      title: 'Nyckelpersonalberoende',
      severity: 'High' as const,
      description: 'CTO och Head of Sales är kritiska personer. CTO äger 5% av företaget och Head of Sales är huvudkontakt för 40% av kunderna. Ingen successionsplan på plats.',
      recommendation: 'Strukturera retention-paket med earn-out/bonus för 2 år post-acquisition. Implementera successionsplan omedelbar. Dokumentera alla key-customer relationships.'
    },
    {
      title: 'Liten ledningsgrupp men stabila medarbetare',
      severity: 'Low' as const,
      description: 'Endast 5 senior anställda men genomsnittlig tenure är 5,2 år, vilket indikerar stabil organisation. Två junior utvecklare anställda 2024.',
      recommendation: 'Implementera development-program för junior anställda för att bygga pipeline för future leadership.'
    },
    {
      title: 'Löner något under marknaden',
      severity: 'Medium' as const,
      description: 'Benchmarking visar att löner ligger 8-12% under marknadsgrad. Risk för poaching post-acquisition.',
      recommendation: 'Planera för 10-15% löneökning för key-talenter som del av retention-strategi. Budget: ca 500 KSEK årligen.'
    }
  ],
  
  itFindings: [
    {
      title: 'Arkitektur är moderna men infrastruktur behöver modernisering',
      severity: 'High' as const,
      description: 'Applikationer använder moderna tech-stacks (Node.js, React, Postgres) men hosting körs på on-premise servrar från 2016. Inte säkrad för skalning.',
      recommendation: 'Migrera till cloud (AWS/Azure) innan större kundtransaktioner. Estimerad kostnad: 200-300 KSEK. Timeline: 3-4 månader.'
    },
    {
      title: 'Data security är grundläggande men behöver förstärkning',
      severity: 'Medium' as const,
      description: 'GDPR-compliance är implementerad men saknar formell security audit och penetration testing.',
      recommendation: 'Implementera formell SOC2 Type II-certifiering för att stärka försäljning. Kostnad: ~150 KSEK.'
    },
    {
      title: 'Backup & disaster recovery fungerar',
      severity: 'Low' as const,
      description: 'Backup-rutiner är på plats med 24-timmar RTO, vilket är acceptabelt för nuvarande kundkritikalitet.',
      recommendation: 'Implementera 4-timmar RTO post-acquisition för enterprise-kunder.'
    }
  ],
  
  taxFindings: [
    {
      title: 'Skattestatus är korrekt',
      severity: 'Low' as const,
      description: 'Företaget är skattemässigt korrekt klassificerat och all rapportering är up-to-date. Inga pågående revisioner.',
      recommendation: 'Implementera proaktiv tax-planning för grupp-struktur post-acquisition.'
    },
    {
      title: 'Värdskattereserver är adekvat',
      severity: 'Low' as const,
      description: 'Reserverna motsvarar ca 15% av vinsten vilket är normalt. Ingen risk för värdskatteskuld.',
      recommendation: 'Planera för optimal källa-struktur baserat på slutgiltigt förvärvsstruktur.'
    }
  ],
  
  envFindings: [
    {
      title: 'Minimal miljörisk - IT-tjänsteföretag',
      severity: 'Low' as const,
      description: 'Ingen fysisk produktion eller kemikaliehantering. Miljöpåverkan begränsad till energiförbrukning från servrar.',
      recommendation: 'Implementera green IT-policy för corporat social responsibility.'
    }
  ]
}

export async function GET(req: NextRequest) {
  try {
    // Generate PDF with demo data
    const pdfBuffer = await generateDDReportPDF(DEMO_DD_DATA)

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="dd-rapport-${DEMO_DD_DATA.companyName.replace(/[^a-z0-9]/gi, '_')}-${new Date().getTime()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('DD Report generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate DD report',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
