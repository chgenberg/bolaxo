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
    description: 'Top 2 kunder står för 28M av 60M SEK årlig omsättning. Mitigering: Long-term kontrakt på 3-5 år, diversifieringsstrategi.'
  },
  {
    id: 'f2',
    title: 'Teknikstack - Äldre ramverk, kräver modernisering',
    severity: 'Medium',
    category: 'IT',
    status: 'open',
    description: 'Huvudapplikation byggd på .NET Framework 4.x. Rekommendation: Migrera till .NET 8 Core (6-9 mån projekt, ~2M SEK).'
  },
  {
    id: 'f3',
    title: 'Personalnyckelrisker - CEO och CTO',
    severity: 'High',
    category: 'HR',
    status: 'open',
    description: 'CEO (35%) och CTO (30%) är kritiska för verksamheten. Retention agreements saknas. Kräver förhandling med båda.'
  },
  {
    id: 'f4',
    title: 'IP & Patent - Ingen formell dokumentation',
    severity: 'Medium',
    category: 'Legal',
    status: 'resolved',
    description: 'Ingen patent-dokumentation för egen teknik. Rekommendation: Formalisera IP-portfölj (möjlighet för 3 patent registreringar).'
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
