export const COMPREHENSIVE_DD_DATA = {
  // Executive Summary & Metrics
  metrics: {
    revenue: [52000000, 46400000, 32000000],
    ebitda: [10400000, 10080000, 8960000],
    employees: 12,
    customers: 47,
    avgContractValue: 1100000,
    churnRate: 0.05,
    nps: 72,
  },
  
  // Financial Findings - Detailed
  financialFindings: [
    {
      title: "Stark omsättningsökning men sjunkande marginaler",
      severity: "HIGH",
      description: "Omsättningen har växt 45% CAGR 2021-2024, men EBITDA-marginalen har sjunkit från 28% till 20% på grund av ökade personalkostnader och marknadspressing.",
      details: [
        "2024 revenue: 52.0 MSEK (+12% YoY)",
        "2024 EBITDA: 10.4 MSEK (20.0% margin)",
        "2023 revenue: 46.4 MSEK",
        "2023 EBITDA: 10.1 MSEK (21.7% margin)",
        "2022 revenue: 32.0 MSEK",
        "2022 EBITDA: 9.0 MSEK (28.1% margin)",
        "Root cause: Personnel costs +15% YoY, competitive pricing pressure"
      ],
      recommendation: "Implementera kostnadsoptimering genom ökad automatisering och offshore-resurser. Målmarginal 26% är uppnåbar inom 12 månader."
    },
    {
      title: "Arbetskapitalberoende och kassaflödestryck",
      severity: "MEDIUM",
      description: "Företaget har 60 dagars betalningsperiod från kunder men 45 dagars till leverantörer. Kräver arbetande kapital på ca 2 MSEK för skalning.",
      details: [
        "DSO (Days Sales Outstanding): 60 dagar",
        "DPO (Days Payable Outstanding): 45 dagar",
        "DIO (Days Inventory Outstanding): 0 dagar",
        "Cash Conversion Cycle: 75 dagar",
        "Required WC for 100 MSEK revenue: 2.0 MSEK",
        "Current WC position: Neutral"
      ],
      recommendation: "Struktuera financing-arrangemang för arbetande kapital. Implementera faktoring för accelererad kassainsamling. Förhandla längre betalningsvillkor med leverantörer."
    },
    {
      title: "Skatteeffektivitet - Unrealized Potential",
      severity: "LOW",
      description: "Företaget utnyttjar inte fullt ut möjliga R&D-skattelättnader. Potentiell skatteåterbäring på 500-800 KSEK över 3 år.",
      details: [
        "Current R&D expenses: ca 8 MSEK annually",
        "Potential R&D tax credit: 20-25% = 1.6-2.0 MSEK over 3 years",
        "Estimated annual benefit: 500-700 KSEK",
        "Implementation complexity: Medium"
      ],
      recommendation: "Konsultera specialiserad skattekonsult för R&D-claim-strategi. Implementation kan driva ytterligare 3-5% marginal."
    }
  ],
  
  // Legal Findings - Very Detailed
  legalFindings: [
    {
      title: "Kundkontrakt - Change of Control Risk",
      severity: "HIGH",
      description: "Av de 15 större kundkontrakten kräver 8 st att ändringar i ägande meddelas kunden och 3 st har en 'change of control'-klausul som kan trigga uppsägning.",
      details: [
        "Total 47 customers",
        "Top 15 customers = 80% of revenue",
        "8 contracts require notification of ownership change",
        "3 contracts have automatic termination rights",
        "Top 3 customers (35% revenue): All require notification",
        "Average contract term: 3 years"
      ],
      contractDetails: [
        {
          customer: "Televerket",
          revenue: "18%",
          contractTerm: "3 years (renewed 2023, valid until 2026)",
          coC: "Requires notification, auto-termination possible",
          risk: "HIGH"
        },
        {
          customer: "Vattenfall Digital", 
          revenue: "12%",
          contractTerm: "2 years (expires 2025)",
          coC: "Standard change of control clause",
          risk: "MEDIUM"
        },
        {
          customer: "Scania Digital",
          revenue: "5%", 
          contractTerm: "1 year (up for renewal Q4 2024)",
          coC: "No specific CoC clause",
          risk: "LOW"
        }
      ],
      recommendation: "Påbörja dialog med 3 riskkunder omedelbar för att säkra continuation av kontrakt. Budgetera för möjlig prisrabatt 5-10%. Pre-closing customer communications critical."
    },
    {
      title: "IP-rättigheter och licensiering",
      severity: "LOW",
      description: "Alla utvecklade system och källkod är korrekt registrerade som företagets IP. Ingen tredjepartsrisk identifierad.",
      details: [
        "All source code owned by company",
        "Proprietary algorithms: 3 patentable",
        "Open source compliance: Audit performed (clean)",
        "Customer data separation: Properly sandboxed",
        "No outstanding licensing disputes"
      ],
      recommendation: "Implementera IP-skyddsprotokoll i utvecklingsprocessen post-acquisition. Överväg patent filing för 3 algoritmer (+100 KSEK investment)."
    },
    {
      title: "Tvister och juridiska åtaganden",
      severity: "LOW", 
      description: "En pågående mindre leverantörskonflikt på ~300 KSEK är under förlikning. Försäkring täcker upp till 1 MSEK.",
      details: [
        "Active disputes: 1",
        "Amount in question: 300 KSEK",
        "Status: Under mediation",
        "Insurance coverage: 1 MSEK D&O policy",
        "Probability of loss: 40-50%",
        "Expected settlement: 150-200 KSEK"
      ],
      recommendation: "Avsätt 300-400 KSEK för uppgörelse. Säkerställ att försäkringen förlängs post-acquisition. Sannolik slutsats inom 30 dagar."
    }
  ],
  
  // Commercial Analysis - Deep Dive
  commercialAnalysis: {
    marketSize: {
      tam: 2500000000,
      sam: 800000000,
      som: 200000000,
      description: "Cloud-based business systems for mid-market companies in Nordics"
    },
    competition: [
      {
        name: "Competitor A",
        share: "15%",
        strengths: ["Larger team", "More integrations"],
        weaknesses: ["Higher prices", "Slower product development"]
      },
      {
        name: "Competitor B",
        share: "8%",
        strengths: ["Low cost", "Simple interface"],
        weaknesses: ["Limited features", "Poor support"]
      },
      {
        name: "TechVision",
        share: "6.5%",
        strengths: ["Best tech", "95% NPS", "Fastest deployment"],
        weaknesses: ["Smaller marketing team", "Limited integrations"]
      }
    ],
    customers: {
      total: 47,
      bySize: {
        enterprise: 5,
        midmarket: 28,
        smb: 14
      },
      byIndustry: {
        manufacturing: 12,
        logistics: 10,
        retail: 8,
        services: 10,
        other: 7
      },
      topCustomers: [
        { name: "Televerket", revenue: "9.4 MSEK", share: "18%" },
        { name: "Vattenfall Digital", revenue: "6.2 MSEK", share: "12%" },
        { name: "Scania Digital", revenue: "2.6 MSEK", share: "5%" }
      ]
    },
    salesPipeline: {
      current: 15000000,
      weighted: 8000000,
      avgDealSize: 800000,
      winRate: 0.35,
      salesCycle: 120,
      forecastQ42024: 2500000,
      forecast2025: 12000000
    }
  },
  
  // HR Deep Dive
  hrAnalysis: {
    organization: {
      total: 12,
      breakdown: [
        { role: "CEO", count: 1, avgTenure: "8 år" },
        { role: "CTO", count: 1, avgTenure: "8 år" },
        { role: "Head of Sales", count: 1, avgTenure: "4 år" },
        { role: "Senior Developers", count: 3, avgTenure: "5.5 år" },
        { role: "Junior Developers", count: 2, avgTenure: "1.5 år" },
        { role: "Operations", count: 2, avgTenure: "3 år" },
        { role: "Finance/Admin", count: 2, avgTenure: "2 år" }
      ]
    },
    compensation: {
      ceo: { salary: 800000, benefits: 100000 },
      cto: { salary: 700000, benefits: 80000 },
      hoSales: { salary: 650000, benefits: 80000 },
      avgSenior: { salary: 550000, benefits: 50000 },
      avgJunior: { salary: 350000, benefits: 30000 }
    },
    retention: {
      avgTenure: 5.2,
      turnover: 0.08,
      keyPersonRisk: "HIGH - CTO and Head of Sales critical"
    }
  },
  
  // Technical Deep Dive
  technicalAnalysis: {
    architecture: {
      frontend: "React 18, TypeScript, Next.js 14",
      backend: "Node.js 20, Express.js, PostgreSQL 15",
      infrastructure: "On-premise (MAJOR ISSUE)",
      cicd: "Jenkins, Docker, basic monitoring"
    },
    codeMetrics: {
      linesOfCode: 250000,
      testCoverage: 0.42,
      avgCyclomaticComplexity: 4.2,
      technicalDebtDays: 180
    },
    security: {
      gdpr: "Compliant",
      soc2Type2: false,
      penetrationTest: false,
      dataBackup: { rto: 86400, rpo: 86400 }
    }
  }
}
