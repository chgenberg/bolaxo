export const PROFESSIONAL_DD_CONTENT = {
  title: "DUE DILIGENCE RAPPORT",
  subtitle: "FÖRETAGSBESIKTNING - KONFIDENTIELL",
  
  metadata: {
    target: "TechVision AB",
    orgNumber: "556234-5678", 
    buyer: "Industrikapital Partners AB",
    ddTeam: {
      lead: "Erik Andersson, Senior Partner",
      financial: "Johan Berg, CFO",
      legal: "Anna Lindqvist, Legal Counsel",
      commercial: "Maria Nilsson, Director",
      technical: "Peter Svensson, CTO"
    },
    timeline: {
      start: "2024-10-01",
      end: "2024-10-28",
      reportDate: "2024-10-29"
    }
  },
  
  executiveSummary: {
    overallRating: "MEDIUM RISK - PROCEED WITH MITIGATION",
    dealRecommendation: "REKOMMENDATION: Genomför förvärvet med strukturerade riskmitigerande åtgärder",
    valuation: {
      enterprise: "150 MSEK",
      evEbitda: "14.4x",
      evRevenue: "2.9x",
      dcfRange: "145-165 MSEK"
    },
    keyMetrics: {
      revenue2024: "52 MSEK",
      ebitda2024: "10.4 MSEK", 
      cagr3Year: "45%",
      employees: 12,
      customers: 47,
      churnRate: "5%"
    }
  },
  
  risks: {
    critical: [
      {
        area: "Kundkoncentration",
        description: "35% av omsättningen från 3 kunder (Televerket 18%, Vattenfall 12%, Scania 5%)",
        impact: "Förlust av en stor kund skulle ha betydande påverkan",
        mitigation: "Implementera kundexpansionsplan, cross-selling till befintlig portfölj",
        probabilityOfOccurrence: "Medium",
        financialImpact: "8-10 MSEK årlig omsättning"
      }
    ],
    high: [
      {
        area: "Teknisk infrastruktur", 
        description: "Legacy on-premise servrar från 2016, ej skalbart för tillväxt",
        impact: "Begränsar tillväxtpotential och ökar operationella risker",
        mitigation: "6-månaders cloud migration plan (AWS/Azure)",
        cost: "200-300 KSEK",
        timeline: "Q1-Q2 2025"
      },
      {
        area: "Nyckelpersonberoende",
        description: "CTO (5% ägare) och Head of Sales kritiska, ingen succession plan",
        impact: "Operationell disruption vid avgång",
        mitigation: "2-års retention bonus, dokumenterad succession planning",
        cost: "2-3 MSEK över 2 år"
      }
    ],
    medium: [
      {
        area: "Marginalpress",
        description: "EBITDA-marginal sjunkit från 28% till 20%",
        impact: "Reducerad lönsamhet",
        mitigation: "Kostnadsoptimering genom automation och offshore",
        potential: "+6% marginalförbättring"
      }
    ]
  },
  
  findings: {
    financial: {
      summary: "Stark tillväxt men sjunkande marginaler",
      details: [
        {
          title: "Omsättningsutveckling",
          finding: "45% CAGR 2021-2024, från 20 MSEK till 52 MSEK",
          quality: "POSITIVE",
          verification: "Reviderade årsredovisningar bekräftar siffror"
        },
        {
          title: "Lönsamhet",
          finding: "EBITDA 10.4 MSEK (20%), ned från 28% 2022",
          quality: "CONCERN",
          action: "Implementera kostnadsbesparingsprogram"
        },
        {
          title: "Working Capital",
          finding: "DSO 60 dagar, DPO 45 dagar, behov av 2 MSEK WC för tillväxt",
          quality: "NEUTRAL",
          recommendation: "Överväg factoring-lösning"
        },
        {
          title: "Skattesituation",
          finding: "Ej optimerad för R&D-avdrag, 500-800 KSEK potential",
          quality: "OPPORTUNITY",
          action: "Engagera skattespecialist omgående"
        }
      ],
      historicals: {
        revenue: [
          { year: 2022, amount: 32000000 },
          { year: 2023, amount: 42000000 },
          { year: 2024, amount: 52000000 }
        ],
        ebitda: [
          { year: 2022, amount: 8960000, margin: 0.28 },
          { year: 2023, amount: 10080000, margin: 0.24 },
          { year: 2024, amount: 10400000, margin: 0.20 }
        ]
      }
    },
    
    legal: {
      summary: "Välstrukturerat men change-of-control risker",
      findings: [
        {
          category: "Kundavtal",
          issue: "8 av 15 större avtal kräver notifiering, 3 har CoC-klausul",
          risk: "HIGH",
          action: "Proaktiv kundkommunikation före closing"
        },
        {
          category: "IP-rättigheter",
          issue: "All källkod och IP korrekt registrerad på bolaget",
          risk: "LOW",
          status: "OK"
        },
        {
          category: "Tvister",
          issue: "En mindre leverantörstvist 300 KSEK",
          risk: "LOW",
          resolution: "Förlikning pågår, försäkring täcker"
        },
        {
          category: "Anställningsavtal",
          issue: "Standardavtal, 3-6 månaders uppsägningstid",
          risk: "MEDIUM",
          note: "Nyckelpersoner behöver nya avtal"
        }
      ]
    },
    
    commercial: {
      summary: "Stark marknadsposition men ökande konkurrens",
      marketAnalysis: {
        tam: "2.5 BSEK i Norden",
        sam: "800 MSEK",
        som: "200 MSEK",
        marketShare: "6.5%",
        growth: "12% årlig marknadstillväxt"
      },
      competitive: {
        position: "Top 3 i segmentet",
        competitors: [
          { name: "Competitor A", share: "15%", strength: "Större organisation" },
          { name: "Competitor B", share: "8%", strength: "Lägre priser" },
          { name: "TechVision", share: "6.5%", strength: "Bäst teknik & kundnöjdhet" }
        ],
        moat: "Teknisk överlägsenhet, 95% kundnöjdhet"
      },
      customers: {
        total: 47,
        concentration: "Top 10 = 65% av omsättning",
        nps: 72,
        churn: "5% årlig",
        arpu: "1.1 MSEK"
      },
      salesPipeline: {
        current: "15 MSEK",
        weighted: "8 MSEK",
        conversionRate: "35%",
        averageDealSize: "800 KSEK"
      }
    },
    
    technical: {
      summary: "Modern tech stack men föråldrad infrastruktur",
      architecture: {
        frontend: "React 18, TypeScript, Next.js",
        backend: "Node.js, Express, PostgreSQL",
        infrastructure: "On-premise servrar (PROBLEM)",
        cicd: "Jenkins, Docker",
        monitoring: "Basic logging only"
      },
      codeQuality: {
        linesOfCode: "250,000",
        testCoverage: "42%",
        technicalDebt: "MEDIUM",
        documentation: "POOR"
      },
      security: {
        gdpr: "Compliant",
        soc2: "Not implemented (RISK)",
        penetrationTest: "Never done (RISK)",
        dataBackup: "24h RTO/RPO"
      },
      recommendations: [
        "Migrera till cloud (AWS/Azure) - 3-4 månader",
        "Implementera SOC2 Type II - 150 KSEK",
        "Förbättra test coverage till 80%",
        "Implementera proper monitoring (Datadog)"
      ]
    },
    
    hr: {
      summary: "Stabil organisation men underbetald",
      organization: {
        total: 12,
        developers: 5,
        sales: 3,
        admin: 2,
        management: 2
      },
      keyPersonnel: [
        { name: "Anders Jönsson", role: "CEO", tenure: "8 år", critical: "HIGH" },
        { name: "Sofia Bergström", role: "CTO", tenure: "8 år", critical: "CRITICAL", ownership: "5%" },
        { name: "Magnus Eriksson", role: "Head of Sales", tenure: "4 år", critical: "CRITICAL" }
      ],
      compensation: {
        vs_market: "-10%",
        totalCost: "8.5 MSEK årligen",
        recommendation: "10-15% justering för retention"
      },
      culture: {
        engagement: "HIGH",
        turnover: "8% (låg)",
        avgTenure: "5.2 år"
      }
    }
  },
  
  valuation: {
    methodology: {
      dcf: {
        value: "155 MSEK",
        assumptions: "WACC 12%, Terminal growth 3%"
      },
      multiples: {
        evRevenue: "150 MSEK (2.9x)",
        evEbitda: "150 MSEK (14.4x)"
      },
      precedentTransactions: [
        { company: "Similar Tech AB", multiple: "15.2x EBITDA" },
        { company: "Nordic SaaS AB", multiple: "13.8x EBITDA" }
      ]
    },
    sensitivityAnalysis: {
      bear: "135 MSEK (-10%)",
      base: "150 MSEK",
      bull: "170 MSEK (+13%)"
    }
  },
  
  postMergerPlan: {
    day1: [
      "Kommunikation till alla anställda",
      "Retention bonus agreements",
      "Kundkommunikation top 10"
    ],
    first100Days: [
      "Cloud migration initiated",
      "Sales integration planning",
      "Cost synergy implementation",
      "Culture integration workshops"
    ],
    year1: [
      "Full systems integration", 
      "Revenue synergies realized",
      "Organization optimization",
      "SaaS product launch"
    ],
    synergies: {
      revenue: "15-20 MSEK från cross-selling",
      cost: "3-5 MSEK från shared services",
      total: "18-25 MSEK årligen från år 2"
    }
  },
  
  conclusion: {
    recommendation: "PROCEED WITH ACQUISITION",
    conditions: [
      "Implement retention program for key personnel",
      "Secure top 3 customer relationships pre-closing",
      "Detailed 100-day integration plan",
      "Cloud migration budget approved"
    ],
    expectedReturn: "35% IRR över 5 år",
    exitOptions: [
      "Strategic buyer (3-5 år): 3-4x MOIC",
      "Financial buyer (5-7 år): 2.5-3x MOIC",
      "IPO (7+ år): Potentiell option vid >200 MSEK omsättning"
    ]
  }
}
