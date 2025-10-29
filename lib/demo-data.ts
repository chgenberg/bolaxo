// Mock demo data for showcasing the platform

export const DEMO_DEALS = [
  {
    id: 'deal-1',
    listingId: 'listing-1',
    buyerId: 'buyer-1',
    status: 'approved',
    approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    listing: {
      id: 'listing-1',
      anonymousTitle: 'IT-konsultbolag - Växande SaaS-företag',
      region: 'Stockholm',
      revenueRange: '25-30 MSEK',
      priceMin: 50000000,
      priceMax: 65000000,
    }
  },
  {
    id: 'deal-2',
    listingId: 'listing-2',
    buyerId: 'buyer-1',
    status: 'approved',
    approvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    listing: {
      id: 'listing-2',
      anonymousTitle: 'E-handelplattform - D2C Brand',
      region: 'Göteborg',
      revenueRange: '40-50 MSEK',
      priceMin: 80000000,
      priceMax: 120000000,
    }
  },
  {
    id: 'deal-3',
    listingId: 'listing-3',
    buyerId: 'buyer-1',
    status: 'approved',
    approvedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
    listing: {
      id: 'listing-3',
      anonymousTitle: 'Tjänsteföretag - Managementkonsultation',
      region: 'Malmö',
      revenueRange: '15-20 MSEK',
      priceMin: 30000000,
      priceMax: 45000000,
    }
  }
]

export const DEMO_QA_QUESTIONS = [
  {
    id: 'q1',
    listingId: 'listing-1',
    buyerId: 'buyer-1',
    question: 'Vilka är era största kundsegment och hur fördelar sig intäkterna?',
    category: 'Commercial',
    priority: 'High',
    status: 'answered',
    answer: 'Vi har tre huvudsakliga kundsegment: Financial Services (45%), Retail (35%), och Manufacturing (20%). Finansbranschen är vår största och mest lönsamme segment.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    answeredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    responseTime: '24 timmar'
  },
  {
    id: 'q2',
    listingId: 'listing-1',
    buyerId: 'buyer-1',
    question: 'Hur är churn-raten för era två största kunder?',
    category: 'Financial',
    priority: 'High',
    status: 'pending',
    answer: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    answeredAt: null,
    responseTime: 'Väntar på svar (23h återstår av 48h SLA)'
  },
  {
    id: 'q3',
    listingId: 'listing-1',
    buyerId: 'buyer-1',
    question: 'Vilka är era huvudsakliga konkurrenter och hur differentiera ni er?',
    category: 'Market',
    priority: 'Medium',
    status: 'answered',
    answer: 'Våra huvudkonkurrenter är Acme Corp och TechSolutions. Vi differentiera oss genom: 1) 15% lägre kostnad, 2) Snabbare implementation (2v vs 4-6v), 3) Dedikerad support team.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    responseTime: '18 timmar'
  }
]

export const DEMO_DD_FINDINGS = [
  {
    id: 'f1',
    title: 'Kundberoende - Två stora kunder representerar 45% av intäkterna',
    severity: 'High',
    category: 'Commercial',
    status: 'open',
    description: 'Top 2 kunder står för 28M av 60M SEK årlig omsättning. Mitigering: Long-term kontrakt på 3-5 år, diversifieringsstrategi.',
    resolution: 'Diversifieringsplan för nächsta 18 månader. Key account management program. SLA-garantier.'
  },
  {
    id: 'f2',
    title: 'Teknikstack - Äldre ramverk, kräver modernisering',
    severity: 'Medium',
    category: 'IT',
    status: 'open',
    description: 'Huvudapplikation byggd på .NET Framework 4.x. Rekommendation: Migrera till .NET 8 Core (6-9 mån projekt, ~2M SEK).',
    resolution: 'Migration till .NET 8 Core. Budget redan allokerat. Timeline 6-9 månader.'
  },
  {
    id: 'f3',
    title: 'Personalnyckelrisker - CEO och CTO',
    severity: 'High',
    category: 'HR',
    status: 'open',
    description: 'CEO (35%) och CTO (30%) är kritiska för verksamheten. Retention agreements saknas. Kräver förhandling med båda.',
    resolution: '2-3 år retention agreements med earnout. Key person insurance. Knowledge transfer program.'
  },
  {
    id: 'f4',
    title: 'IP & Patent - Ingen formell dokumentation',
    severity: 'Medium',
    category: 'Legal',
    status: 'resolved',
    description: 'Ingen patent-dokumentation för egen teknik. Rekommendation: Formalisera IP-portfölj (möjlighet för 3 patent registreringar).',
    resolution: 'IP audit genomfört. 3 patent applications inlämnade. IP procedures formaliserade.'
  }
]

export const DEMO_ENGAGEMENT_DATA = [
  {
    document: 'Teaser (Anonymiserad)',
    views: 12,
    timeSpentMinutes: 145,
    downloaded: true,
    engagementScore: 85,
    status: '🔥 Mycket intresse'
  },
  {
    document: 'Information Memorandum',
    views: 8,
    timeSpentMinutes: 320,
    downloaded: true,
    engagementScore: 92,
    status: '🔥 Mycket intresse'
  },
  {
    document: 'Finansiella rapporter 2022-2024',
    views: 6,
    timeSpentMinutes: 180,
    downloaded: true,
    engagementScore: 78,
    status: '🔥 Mycket intresse'
  },
  {
    document: 'Kundbaser & Kontrakt',
    views: 4,
    timeSpentMinutes: 95,
    downloaded: false,
    engagementScore: 62,
    status: '⚡ Måttligt intresse'
  },
  {
    document: 'IT-dokumentation',
    views: 2,
    timeSpentMinutes: 45,
    downloaded: false,
    engagementScore: 35,
    status: '❄️ Lågt intresse'
  }
]

export const DEMO_LOI_DATA = {
  version: 3,
  status: 'negotiation',
  purchasePrice: 65000000,
  earnout: 5000000,
  earnoutTrigger: 'Revenue > 70M SEK',
  cashAtClosing: 58000000,
  escrowHoldback: 2000000,
  escrowPeriod: '18 månader',
  nonCompete: '3 år',
  representations: [
    'Financial statements accurate and complete',
    'No undisclosed liabilities',
    'All material contracts disclosed',
    'No pending litigation'
  ],
  history: [
    { version: 1, date: '2025-10-20', author: 'Buyer', change: 'Initial offer: 60M SEK, 3M earnout' },
    { version: 2, date: '2025-10-22', author: 'Seller', change: 'Counter offer: 70M SEK, 2M earnout' },
    { version: 3, date: '2025-10-28', author: 'Buyer', change: 'Counter counter: 65M SEK, 5M earnout' }
  ]
}

export const DEMO_DD_TASKS = [
  { id: 't1', category: 'Financial', task: 'Review 3-year audited financial statements', status: 'complete', daysToComplete: 2 },
  { id: 't2', category: 'Financial', task: 'Analyze revenue recognition policies', status: 'complete', daysToComplete: 1 },
  { id: 't3', category: 'Financial', task: 'Verify cash flow projections', status: 'in_progress', daysToComplete: 1 },
  { id: 't4', category: 'Financial', task: 'Check working capital levels', status: 'pending', daysToComplete: 2 },
  
  { id: 't5', category: 'Legal', task: 'Review material contracts', status: 'complete', daysToComplete: 3 },
  { id: 't6', category: 'Legal', task: 'Check for litigation', status: 'complete', daysToComplete: 1 },
  { id: 't7', category: 'Legal', task: 'Verify IP ownership', status: 'in_progress', daysToComplete: 2 },
  { id: 't8', category: 'Legal', task: 'Review employment agreements', status: 'pending', daysToComplete: 2 },
  
  { id: 't9', category: 'IT', task: 'Security assessment', status: 'complete', daysToComplete: 2 },
  { id: 't10', category: 'IT', task: 'Infrastructure review', status: 'in_progress', daysToComplete: 1 },
  { id: 't11', category: 'IT', task: 'Data backup & recovery test', status: 'pending', daysToComplete: 3 },
]

export const DEMO_CLOSING_CHECKLIST = [
  { role: 'buyer', task: 'Financing confirmed', status: true, dueDate: 'Closing day' },
  { role: 'buyer', task: 'Final SPA review with counsel', status: true, dueDate: '2 days before' },
  { role: 'buyer', task: 'Sign closing documents', status: false, dueDate: 'Closing day' },
  { role: 'buyer', task: 'Wire funds to escrow', status: false, dueDate: 'Closing day' },
  
  { role: 'seller', task: 'Shareholder approval', status: true, dueDate: '3 days before' },
  { role: 'seller', task: 'Tax clearance obtained', status: true, dueDate: '2 days before' },
  { role: 'seller', task: 'Sign closing documents', status: false, dueDate: 'Closing day' },
  { role: 'seller', task: 'Prepare share certificates', status: false, dueDate: 'Closing day' },
]

export const DEMO_EARNOUT_DATA = {
  totalEarnout: 5000000,
  period: '3 år',
  metric: 'Revenue',
  year1: { target: 65000000, actual: null, earned: null, status: 'pending' },
  year2: { target: 72000000, actual: null, earned: null, status: 'pending' },
  year3: { target: 80000000, actual: null, earned: null, status: 'pending' },
}

export const DEMO_SPA_FULL_DATA = {
  // PARTIES
  companyName: 'CloudTech Solutions AB',
  orgNumber: '556234-5678',
  legalForm: 'Aktiebolag',
  companyAddress: 'Storgatan 42, 171 00 Stockholm',
  industry: 'Teknologi',
  description: 'CloudTech Solutions AB utvecklar molnbaserad bokföringssoftware för småföretag och medelstora företag i Norden. Företaget erbjuder SaaS-lösningar för finansiell rapportering, fakturering och ekonomiöversikt.',
  
  // SELLER INFO
  sellerName: 'Magnus Lundström',
  sellerIdNumber: '710312-1234',
  sellerAddress: 'Värmlandsgatan 15, 100 54 Stockholm',
  sellerBank: 'SEB',
  sellerBankGiro: '5001-1234567',
  
  // BUYER INFO
  buyerName: 'Industrikapital Partners AB',
  buyerOrgNumber: '559876-5432',
  buyerAddress: 'Blasieholmen 5, 111 48 Stockholm',
  buyerBank: 'Handelsbanken',
  buyerBankGiro: '6000-9876543',
  
  // PURCHASE PRICE
  basePurchasePrice: '150,000,000',
  earnoutAmount: '25,000,000',
  earnoutPercentage: '14.3',
  totalMaxPrice: '175,000,000',
  
  // PAYMENT TERMS
  escrowAmount: '15,000,000',
  escrowPercentage: '10',
  escrowPeriod: '18',
  escrowAgent: 'Enskilda Securities AB',
  
  // EARNOUT STRUCTURE
  earnoutYear1Target: 'EBITDA > 12.5 MSEK',
  earnoutYear1Amount: '8,000,000',
  earnoutYear2Target: 'EBITDA > 13.5 MSEK + Revenue growth 15%',
  earnoutYear2Amount: '9,000,000',
  earnoutYear3Target: 'EBITDA > 14.5 MSEK + Churn < 5%',
  earnoutYear3Amount: '8,000,000',
  totalEarnout: '25,000,000',
  
  // NON-COMPETE
  nonCompetePeriod: '3',
  nonCompeteGeography: 'Norden (Sverige, Norge, Danmark)',
  
  // CLOSING
  closingDate: '2025-01-31',
  
  // KEY EMPLOYEES
  keyEmployee1: 'Anna Pettersson (VD, 10 år tenure)',
  keyEmployee2: 'Erik Svensson (CTO, 8 år tenure)',
  keyEmployee3: 'Sofia Bergström (Head of Sales, 5 år tenure)',
  
  // RETENTION BONUSES
  ceoBonus: '2,500,000',
  ctoBonus: '2,000,000',
  otherBonus: '1,500,000'
}

export const DEMO_DD_FULL_DATA = {
  // COMPANY INFO
  companyName: 'CloudTech Solutions AB',
  orgNumber: '556234-5678',
  industry: 'Teknologi - Cloud-baserad mjukvara',
  description: 'SaaS-plattform för finansiell rapportering',
  employees: 12,
  revenue2024: 52000000,
  revenue2023: 46400000,
  revenue2022: 32000000,
  ebitda2024: 10400000,
  ebitda2023: 10080000,
  ebitda2022: 8960000,
  
  // FINANCIAL METRICS
  grossMargin: 78,
  operatingMargin: 20,
  netMargin: 16,
  daysInventory: 0,
  daysSales: 60,
  daysPayable: 45,
  totalDebt: 5000000,
  cashPosition: 8500000,
  capex: 1200000,
  rd: 8000000,
  
  // CUSTOMERS
  totalCustomers: 47,
  topCustomerRevenue: 18,
  top3Revenue: 35,
  top10Revenue: 65,
  churnRate: 5,
  nps: 72,
  
  // ORGANIZATION
  ceoName: 'Anna Pettersson',
  cfoName: 'Lars Eklund',
  ctoName: 'Erik Svensson',
  avgTenure: 6.8,
  turnover: 8,
  
  // TECHNICAL
  techStack: 'React 18, TypeScript, Next.js 14, Node.js 20, PostgreSQL 15, AWS',
  cloudVsOnpremise: '100% Cloud',
  datacenters: 'AWS eu-north-1 (Stockholm)',
  testCoverage: 72,
  uptime: 99.95,
  backupStrategy: 'RTO 1 hour, RPO 15 minutes, daily incremental backups',
  securityCertification: 'ISO 27001, GDPR compliant, SOC2 Type II in progress',
  
  // COMMERCIAL
  marketShare: 6.5,
  tam: 2500000000,
  
  // RISK ASSESSMENT
  overallRisk: 'MEDIUM',
  recommendation: 'GENOMFÖR MED VILLKOR',
  criticalRisks: [
    {
      title: 'Kundberoende - Top 3 = 35% av omsättning',
      severity: 'HIGH',
      mitigation: 'Pre-closing calls för säkerställande av continuation'
    },
    {
      title: 'Infrastruktur - On-premise servrar från 2016',
      severity: 'HIGH',
      mitigation: 'Omedelbar cloud migration, 3-4 mån timeline'
    },
    {
      title: 'Nyckelpersoner - CTO och Head of Sales kritiska',
      severity: 'HIGH',
      mitigation: '2-år retention bonus for CTO, Head of Sales, CEO'
    }
  ],
  mediumRisks: [
    {
      title: 'Marginalpressing - 28% till 20% på 2 år',
      severity: 'MEDIUM',
      mitigation: 'Kostnadsoptimering, målmarginal 26% inom 12 mån'
    },
    {
      title: 'Arbetande kapital - 2 MSEK behövs för skalning',
      severity: 'MEDIUM',
      mitigation: 'Financing-arrangemang, factoring möjligt'
    }
  ],
  strengths: [
    'Stark marknadspojtion - Top 3 i segment',
    'Solid produkt - 95% NPS, 72 NPS score',
    'Erfaren ledning - 5-8 år tenure',
    '45% CAGR 2021-2024',
    'SaaS-potential - 2-3x värderingsmultipel upside',
    '100% cloud-baserad infrastruktur'
  ]
}
