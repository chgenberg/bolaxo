export interface BusinessObject {
  id: string
  type: string
  region: string
  revenueRange: string
  revenue: number // Exact number (locked behind NDA)
  ebitda: number // Locked behind NDA
  employees: string
  ownerRole: string
  priceMin: number
  priceMax: number
  description: string
  strengths: string[]
  risks: string[]
  whySelling: string
  
  // Meta
  verified: boolean
  broker: boolean
  isNew: boolean
  views: number
  featured?: boolean
  category?: string
  title?: string
  price?: number
  location?: string
  ndaRequired?: boolean
  
  // Locked data (only after NDA)
  companyName: string // Locked
  orgNumber: string // Locked
  address: string // Locked
  detailedFinancials: any // Locked
  customers: string[] // Locked
  
  // Anonymous display
  anonymousTitle: string
  createdAt: Date
}

export const mockObjects: BusinessObject[] = [
  {
    id: 'obj-001',
    type: 'Konsultbolag',
    region: 'Stockholm',
    revenueRange: '5-10M',
    revenue: 7500000,
    ebitda: 1800000,
    employees: '6-10',
    ownerRole: 'VD, operativ',
    priceMin: 12000000,
    priceMax: 15000000,
    description: 'Etablerat IT-konsultbolag med fokus på digitalisering och systemutveckling. Starka relationer med återkommande kunder i offentlig sektor.',
    strengths: [
      'Långa kundkontrakt med 95% retention',
      'Välkänt varumärke inom offentlig sektor',
      'Erfaret team med låg personalomsättning'
    ],
    risks: [
      'Beroende av nyckelpersoner - men överlämning planerad',
      'Begränsat antal kunder - men diversifiering pågår'
    ],
    whySelling: 'Ägaren vill pensionera sig och söker efterträdare som kan ta över och utveckla verksamheten vidare.',
    verified: true,
    broker: false,
    isNew: true,
    views: 145,
    companyName: 'Digital Konsult AB',
    orgNumber: '556123-4567',
    address: 'Storgatan 1, 111 22 Stockholm',
    detailedFinancials: {},
    customers: ['Stockholms kommun', 'Trafikverket', 'Försäkringskassan'],
    anonymousTitle: 'Etablerat IT-konsultbolag i Stockholm',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-002',
    type: 'E-handel',
    region: 'Göteborg',
    revenueRange: '10-25M',
    revenue: 18000000,
    ebitda: 3200000,
    employees: '11-25',
    ownerRole: 'Passiv ägare',
    priceMin: 20000000,
    priceMax: 25000000,
    description: 'Lönsam e-handelsplattform inom heminredning med stark tillväxt. Duktigt team på plats som driver den dagliga verksamheten.',
    strengths: [
      'Stark tillväxt - dubblad omsättning på 3 år',
      'Automatiserad logistik och processer',
      'Etablerad varumärke med 25k följare'
    ],
    risks: [
      'Konkurrensutsatt marknad',
      'Säsongsvariationer - men har stark kontantreserv'
    ],
    whySelling: 'Ägaren vill fokusera på andra investeringar.',
    verified: true,
    broker: true,
    isNew: false,
    views: 289,
    companyName: 'Nordic Home E-handel AB',
    orgNumber: '556234-5678',
    address: 'Avenyn 45, 411 36 Göteborg',
    detailedFinancials: {},
    customers: ['Direktförsäljning B2C'],
    anonymousTitle: 'E-handelsplattform inom heminredning',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-003',
    type: 'Restaurang',
    region: 'Malmö',
    revenueRange: '1-5M',
    revenue: 3200000,
    ebitda: 480000,
    employees: '1-5',
    ownerRole: 'VD, operativ',
    priceMin: 2500000,
    priceMax: 3500000,
    description: 'Välbesökt restaurang i centrala Malmö. Etablerad över 10 år med lojal kundbas. Möjlighet att utöka med catering och events.',
    strengths: [
      'Etablerad plats i populärt område',
      'Starka recensioner (4,5/5 på Google)',
      'Fullt utrustad lokal med 10 års hyreskontrakt kvar'
    ],
    risks: [
      'Beroende av ägarens närvaro',
      'Personalberoende verksamhet'
    ],
    whySelling: 'Familjen flyttar utomlands.',
    verified: false,
    broker: false,
    isNew: true,
    views: 67,
    companyName: 'Malmö Bistro AB',
    orgNumber: '556345-6789',
    address: 'Stortorget 12, 211 22 Malmö',
    detailedFinancials: {},
    customers: ['Walk-in kunder'],
    anonymousTitle: 'Etablerad restaurang i centrala Malmö',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-004',
    type: 'SaaS-företag',
    region: 'Stockholm',
    revenueRange: '25-50M',
    revenue: 38000000,
    ebitda: 8500000,
    employees: '26-50',
    ownerRole: 'VD, delvis operativ',
    priceMin: 80000000,
    priceMax: 100000000,
    description: 'Snabbväxande SaaS-plattform för projektledning. ARR på 35 MSEK med stark retention (>110% NRR). Nordiskt fokus med expansion till EU planerad.',
    strengths: [
      'Återkommande intäkter (SaaS-modell)',
      'Stark produktmarknadpassning',
      'Skalbar affärsmodell'
    ],
    risks: [
      'Konkurrens från större internationella aktörer',
      'Nyckelpersonsberoende i produktutveckling'
    ],
    whySelling: 'Söker strategisk eller finansiell partner för att accelerera internationell tillväxt.',
    verified: true,
    broker: true,
    isNew: false,
    views: 512,
    companyName: 'ProjectFlow Nordic AB',
    orgNumber: '556456-7890',
    address: 'Vasagatan 10, 111 20 Stockholm',
    detailedFinancials: {},
    customers: ['450+ företagskunder i Norden'],
    anonymousTitle: 'SaaS-plattform för projektledning',
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-005',
    type: 'Bygg & Fastighet',
    region: 'Uppsala',
    revenueRange: '10-25M',
    revenue: 15000000,
    ebitda: 2100000,
    employees: '11-25',
    ownerRole: 'VD, operativ',
    priceMin: 15000000,
    priceMax: 18000000,
    description: 'Byggföretag specialiserat på ROT-arbeten och renoveringar. Stabilt orderläge och gott rykte i regionen.',
    strengths: [
      'Etablerat nätverk med underleverantörer',
      'Långsiktiga ramavtal med fastighetsbolag',
      'Erfarna hantverkare med F-skatt'
    ],
    risks: [
      'Konjunkturkänslig bransch',
      'Materialprisrisk'
    ],
    whySelling: 'Ägaren vill satsa på nytt projekt.',
    verified: false,
    broker: false,
    isNew: false,
    views: 98,
    companyName: 'Uppsala Bygg & Renovering AB',
    orgNumber: '556567-8901',
    address: 'Kungsgatan 5, 753 18 Uppsala',
    detailedFinancials: {},
    customers: ['Privatkunder + 3 större fastighetsbolag'],
    anonymousTitle: 'Byggföretag i Uppsala med ROT-fokus',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-006',
    type: 'Redovisningsbyrå',
    region: 'Stockholm',
    revenueRange: '5-10M',
    revenue: 8200000,
    ebitda: 2500000,
    employees: '6-10',
    ownerRole: 'Delägare, delvis operativ',
    priceMin: 18000000,
    priceMax: 22000000,
    description: 'Etablerad redovisningsbyrå med 150+ företagskunder. Specialisering på småföretag och e-handel. Hög retention och återkommande intäkter.',
    strengths: [
      'Återkommande månadsintäkter (MRR-modell)',
      'Digital plattform och moderna verktyg',
      'Erfaret team med auktoriserade redovisningskonsulter'
    ],
    risks: [
      'Konkurrensutsatt marknad',
      'Beroende av nyckelpersoner i kundrelationer'
    ],
    whySelling: 'Delägare vill pensionera sig, söker efterträdare.',
    verified: true,
    broker: true,
    isNew: false,
    views: 234,
    companyName: 'Stockholm Accounting Partners AB',
    orgNumber: '556678-9012',
    address: 'Sveavägen 24, 111 57 Stockholm',
    detailedFinancials: {},
    customers: ['150+ SME-företag'],
    anonymousTitle: 'Redovisningsbyrå i Stockholm med 150+ kunder',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-007',
    type: 'Café & Bageri',
    region: 'Göteborg',
    revenueRange: '1-5M',
    revenue: 4100000,
    ebitda: 620000,
    employees: '1-5',
    ownerRole: 'VD, operativ',
    priceMin: 3000000,
    priceMax: 4000000,
    description: 'Populärt café med egenbakat i centrala Göteborg. Stark kundbas och goda recensioner. Möjlighet att utöka med catering.',
    strengths: [
      'Etablerat läge med hög trafik',
      'Starkt varumärke lokalt',
      'Långa hyreskontrakt (8 år kvar)'
    ],
    risks: [
      'Personalberoende',
      'Begränsad kapacitet i nuvarande lokal'
    ],
    whySelling: 'Ägaren flyttar utomlands.',
    verified: false,
    broker: false,
    isNew: true,
    views: 89,
    companyName: 'Söders Café & Bageri AB',
    orgNumber: '556789-0123',
    address: 'Linnégatan 12, 413 04 Göteborg',
    detailedFinancials: {},
    customers: ['Walk-in + företagskunder'],
    anonymousTitle: 'Café & Bageri i centrala Göteborg',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-008',
    type: 'Marknadsföringsbyrå',
    region: 'Stockholm',
    revenueRange: '10-25M',
    revenue: 16500000,
    ebitda: 3800000,
    employees: '11-25',
    ownerRole: 'VD, delvis operativ',
    priceMin: 28000000,
    priceMax: 35000000,
    description: 'Full-service marknadsföringsbyrå med fokus på digitala kanaler. Starka case inom B2B SaaS. Team av 18 specialister.',
    strengths: [
      'Starka kundcase och portfolio',
      'Återkommande retainer-avtal (70% av intäkter)',
      'Erfaret team med låg omsättning'
    ],
    risks: [
      'Beroende av stora kunder (topp 3 = 40%)',
      'Konkurrensutsatt marknad'
    ],
    whySelling: 'Grundaren vill fokusera på venture building.',
    verified: true,
    broker: true,
    isNew: false,
    views: 445,
    companyName: 'Digital Growth Agency AB',
    orgNumber: '556890-1234',
    address: 'Birger Jarlsgatan 8, 114 34 Stockholm',
    detailedFinancials: {},
    customers: ['35 aktiva kunder, B2B tech-fokus'],
    anonymousTitle: 'Marknadsföringsbyrå med B2B SaaS-fokus',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-009',
    type: 'E-learning plattform',
    region: 'Stockholm',
    revenueRange: '5-10M',
    revenue: 6800000,
    ebitda: 1900000,
    employees: '1-5',
    ownerRole: 'Grundare, operativ',
    priceMin: 12000000,
    priceMax: 15000000,
    description: 'SaaS-plattform för företagsutbildning. 200+ B2B-kunder. Automatiserad plattform med minimal support-behov.',
    strengths: [
      'Skalbar SaaS-modell med hög marginal',
      '95% retention bland kunder',
      'Automatiserad onboarding och support'
    ],
    risks: [
      'Enstaka grundare - överlämning krävs',
      'Teknisk skuld i legacy-kod'
    ],
    whySelling: 'Grundaren vill starta nytt bolag.',
    verified: true,
    broker: false,
    isNew: true,
    views: 312,
    companyName: 'LearnHub Sweden AB',
    orgNumber: '556901-2345',
    address: 'Drottninggatan 95, 113 60 Stockholm',
    detailedFinancials: {},
    customers: ['200+ B2B-kunder'],
    anonymousTitle: 'E-learning SaaS-plattform med 200+ kunder',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-010',
    type: 'Frisörsalong',
    region: 'Malmö',
    revenueRange: '1-5M',
    revenue: 2800000,
    ebitda: 550000,
    employees: '1-5',
    ownerRole: 'Ägare, operativ',
    priceMin: 2000000,
    priceMax: 2800000,
    description: 'Väletablerad frisörsalong med lojal kundbas. 3 stolar, möjlighet att expandera med ytterligare en.',
    strengths: [
      'Centralt läge med god synlighet',
      'Lojal kundbas (60% återkommande)',
      'Moderna lokaler och utrustning'
    ],
    risks: [
      'Personberoende verksamhet',
      'Konkurrens i området'
    ],
    whySelling: 'Ägaren vill flytta till annan stad.',
    verified: false,
    broker: false,
    isNew: false,
    views: 67,
    companyName: 'Salong Elegans AB',
    orgNumber: '557012-3456',
    address: 'Södergatan 8, 211 34 Malmö',
    detailedFinancials: {},
    customers: ['Privatkunder'],
    anonymousTitle: 'Frisörsalong i centrala Malmö',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-011',
    type: 'Träningscenter',
    region: 'Stockholm',
    revenueRange: '5-10M',
    revenue: 7200000,
    ebitda: 1400000,
    employees: '6-10',
    ownerRole: 'Ägare, delvis operativ',
    priceMin: 10000000,
    priceMax: 13000000,
    description: 'Modernt gym i expansivt område. 850 medlemmar med hög retention. Potential för personlig träning och gruppträning.',
    strengths: [
      'Återkommande medlemsintäkter',
      'Modern utrustning (investerat 2M senaste 2 åren)',
      'Lojal medlemsbas med 82% årlig retention'
    ],
    risks: [
      'Konkurrens från kedjor',
      'Hyreskontrakt löper ut om 3 år'
    ],
    whySelling: 'Ägaren vill fokusera på annat projekt.',
    verified: true,
    broker: false,
    isNew: false,
    views: 198,
    companyName: 'StrongFit Stockholm AB',
    orgNumber: '557123-4567',
    address: 'Kungsholmsgatan 21, 112 27 Stockholm',
    detailedFinancials: {},
    customers: ['850 aktiva medlemmar'],
    anonymousTitle: 'Gym i Stockholm med 850 medlemmar',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-012',
    type: 'HR-tech SaaS',
    region: 'Göteborg',
    revenueRange: '10-25M',
    revenue: 14000000,
    ebitda: 4200000,
    employees: '6-10',
    ownerRole: 'Grundare, operativ',
    priceMin: 35000000,
    priceMax: 45000000,
    description: 'Rekryteringsplattform med AI-matchning. 180 B2B-kunder. ARR på 13M med 105% NRR. Stark product-market fit.',
    strengths: [
      'Hög NRR (105%) - expansion revenue',
      'Automatiserad plattform med låga kostnader',
      'Starka kundcase från varumärkesföretag'
    ],
    risks: [
      'Konkurrens från större internationella aktörer',
      'Grundarberoende på produkt & vision'
    ],
    whySelling: 'Söker strategisk partner för internationell expansion.',
    verified: true,
    broker: true,
    isNew: true,
    views: 567,
    companyName: 'TalentMatch AI AB',
    orgNumber: '557234-5678',
    address: 'Kungsportsavenyn 12, 411 36 Göteborg',
    detailedFinancials: {},
    customers: ['180 B2B-kunder, huvudsakligen SME'],
    anonymousTitle: 'HR-tech SaaS med AI-matchning',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-013',
    type: 'Webbyrå',
    region: 'Malmö',
    revenueRange: '5-10M',
    revenue: 6500000,
    ebitda: 1800000,
    employees: '6-10',
    ownerRole: 'VD, operativ',
    priceMin: 12000000,
    priceMax: 15000000,
    description: 'Full-service webbyrå med fokus på e-handel och WordPress. 40+ aktiva kunder. Återkommande underhållsavtal.',
    strengths: [
      'Diversifierad kundbas',
      'Återkommande intäkter från underhållsavtal (35%)',
      'Stark lokal närvaro i Skåne'
    ],
    risks: [
      'Teknologiförändringar',
      'Nyckelpersonsberoende i försäljning'
    ],
    whySelling: 'Grundaren vill starta nytt bolag.',
    verified: false,
    broker: false,
    isNew: false,
    views: 142,
    companyName: 'Webfokus Syd AB',
    orgNumber: '557345-6789',
    address: 'Södra Promenaden 45, 211 38 Malmö',
    detailedFinancials: {},
    customers: ['40+ kunder inom e-handel och service'],
    anonymousTitle: 'Webbyrå i Malmö med e-handelsfokus',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-014',
    type: 'Städbolag',
    region: 'Uppsala',
    revenueRange: '5-10M',
    revenue: 8900000,
    ebitda: 1300000,
    employees: '11-25',
    ownerRole: 'VD, delvis operativ',
    priceMin: 10000000,
    priceMax: 13000000,
    description: 'Kontorsstädning med företagskunder. Långsiktiga avtal och stabil verksamhet. Certifierad enligt miljöstandard.',
    strengths: [
      'Långsiktiga avtal (3-5 år)',
      'Miljöcertifiering ger konkurrensfördel',
      'Erfaren personal med låg omsättning'
    ],
    risks: [
      'Priskänslig marknad',
      'Personalberoende'
    ],
    whySelling: 'Ägaren vill pensionera sig.',
    verified: true,
    broker: false,
    isNew: false,
    views: 187,
    companyName: 'Uppsala Städservice AB',
    orgNumber: '557456-7890',
    address: 'Vaksalagatan 10, 753 31 Uppsala',
    detailedFinancials: {},
    customers: ['25 företagskunder'],
    anonymousTitle: 'Städbolag i Uppsala med företagskunder',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-015',
    type: 'Möbelaffär',
    region: 'Göteborg',
    revenueRange: '10-25M',
    revenue: 19000000,
    ebitda: 2800000,
    employees: '6-10',
    ownerRole: 'Ägare, operativ',
    priceMin: 18000000,
    priceMax: 23000000,
    description: 'Skandinavisk design och hållbara möbler. Kombination av butik och e-handel. Starkt varumärke i regionen.',
    strengths: [
      'Unikt sortiment med höga marginaler',
      'Växande e-handel (30% av intäkter)',
      'Stark varumärkeskännedom lokalt'
    ],
    risks: [
      'Konjunkturkänsligt',
      'Konkurrens från stora kedjor'
    ],
    whySelling: 'Ägaren vill satsa på e-handel endast.',
    verified: false,
    broker: true,
    isNew: false,
    views: 234,
    companyName: 'Nordic Living AB',
    orgNumber: '557567-8901',
    address: 'Magasinsgatan 18, 411 18 Göteborg',
    detailedFinancials: {},
    customers: ['B2C + 15 företagskunder'],
    anonymousTitle: 'Möbelaffär i Göteborg med skandinavisk design',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-016',
    type: 'Tech-support företag',
    region: 'Stockholm',
    revenueRange: '10-25M',
    revenue: 22000000,
    ebitda: 5500000,
    employees: '26-50',
    ownerRole: 'VD, delvis operativ',
    priceMin: 40000000,
    priceMax: 50000000,
    description: 'IT-support och helpdesk för SME-företag. Managed services med återkommande intäkter. 120+ aktiva kunder.',
    strengths: [
      'Återkommande MRR-intäkter (85%)',
      'Skalbar leveransmodell',
      'Starka SLA:er och hög kundnöjdhet (NPS 72)'
    ],
    risks: [
      'Teknikutveckling och automation',
      'Konkurrens från större aktörer'
    ],
    whySelling: 'Grundarna vill fokusera på annat.',
    verified: true,
    broker: true,
    isNew: false,
    views: 389,
    companyName: 'TechCare Solutions AB',
    orgNumber: '557678-9012',
    address: 'Hamngatan 15, 111 47 Stockholm',
    detailedFinancials: {},
    customers: ['120 SME-kunder'],
    anonymousTitle: 'IT-support företag med 120+ kunder',
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-017',
    type: 'Hundtrimning & djuraffär',
    region: 'Uppsala',
    revenueRange: '1-5M',
    revenue: 3400000,
    ebitda: 680000,
    employees: '1-5',
    ownerRole: 'Ägare, operativ',
    priceMin: 3500000,
    priceMax: 4500000,
    description: 'Kombinerad djuraffär och hundsalong. Lojal kundbas och återkommande besök för trimning.',
    strengths: [
      'Återkommande intäkter från trimning',
      'Etablerat läge med god synlighet',
      'Lojal kundbas'
    ],
    risks: [
      'Personberoende verksamhet',
      'Begränsad tillväxtpotential i nuvarande lokal'
    ],
    whySelling: 'Hälsoskäl - ägaren vill trappa ner.',
    verified: false,
    broker: false,
    isNew: true,
    views: 78,
    companyName: 'Valpens Värld AB',
    orgNumber: '557789-0123',
    address: 'Salavägen 18, 753 31 Uppsala',
    detailedFinancials: {},
    customers: ['Privatkunder'],
    anonymousTitle: 'Hundtrimning & djuraffär i Uppsala',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-018',
    type: 'CRM-system SaaS',
    region: 'Stockholm',
    revenueRange: '25-50M',
    revenue: 42000000,
    ebitda: 12000000,
    employees: '11-25',
    ownerRole: 'Grundare & VD',
    priceMin: 120000000,
    priceMax: 150000000,
    description: 'CRM för B2B-säljare. 450+ företagskunder. ARR 40M med 98% retention. Bootstrapped och lönsamt.',
    strengths: [
      'Stark unit economics och lönsamhet',
      'Mycket hög retention (98%)',
      'Produktlett tillväxt - låga CAC'
    ],
    risks: [
      'Konkurrens från Salesforce, HubSpot',
      'Internationell expansion inte påbörjad'
    ],
    whySelling: 'Söker strategisk partner eller private equity för tillväxtkapital.',
    verified: true,
    broker: true,
    isNew: true,
    views: 892,
    companyName: 'SalesBoost CRM AB',
    orgNumber: '557890-1234',
    address: 'Kungsgatan 33, 111 56 Stockholm',
    detailedFinancials: {},
    customers: ['450+ B2B-kunder i Norden'],
    anonymousTitle: 'CRM SaaS med 450+ kunder och 40M ARR',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-019',
    type: 'Bageri & konditori',
    region: 'Malmö',
    revenueRange: '5-10M',
    revenue: 6800000,
    ebitda: 980000,
    employees: '6-10',
    ownerRole: 'Ägare, operativ',
    priceMin: 7000000,
    priceMax: 9000000,
    description: 'Traditionellt bageri med kafé. Egna recept och lokala råvaror. Leveranser till restauranger och hotell.',
    strengths: [
      'Starka lokala kundrelationer',
      'B2B-kontrakt med hotell och restauranger',
      'Unikt sortiment med höga marginaler'
    ],
    risks: [
      'Personalberoende produktion',
      'Tidiga morgontimmar kräver dedikerad personal'
    ],
    whySelling: 'Ägaren vill pensionera sig.',
    verified: false,
    broker: false,
    isNew: false,
    views: 156,
    companyName: 'Malmö Hantverksbageri AB',
    orgNumber: '557901-2345',
    address: 'Möllevångsgatan 8, 214 20 Malmö',
    detailedFinancials: {},
    customers: ['B2C + 12 B2B-kunder (hotell/restauranger)'],
    anonymousTitle: 'Bageri & konditori i Malmö',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-020',
    type: 'Cykelbutik',
    region: 'Göteborg',
    revenueRange: '5-10M',
    revenue: 7600000,
    ebitda: 1100000,
    employees: '1-5',
    ownerRole: 'Ägare, operativ',
    priceMin: 8000000,
    priceMax: 10000000,
    description: 'Specialiserad cykelbutik med verkstad. Fokus på premiumcyklar och service. Växande e-handel.',
    strengths: [
      'Stark marginal på service och reservdelar',
      'Lojal kundbas med återkommande service',
      'Växande e-handel för tillbehör'
    ],
    risks: [
      'Säsongsvariationer',
      'Konkurrens från kedjor'
    ],
    whySelling: 'Ägaren vill flytta utomlands.',
    verified: false,
    broker: false,
    isNew: false,
    views: 167,
    companyName: 'Premium Bikes Göteborg AB',
    orgNumber: '558012-3456',
    address: 'Västra Hamngatan 12, 411 17 Göteborg',
    detailedFinancials: {},
    customers: ['B2C privatpersoner + företagskunder'],
    anonymousTitle: 'Cykelbutik i Göteborg med verkstad',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
  },
]

export function getObjectById(id: string): BusinessObject | undefined {
  return mockObjects.find(obj => obj.id === id)
}

export function searchObjects(filters: {
  regions?: string[]
  industries?: string[]
  revenueMin?: string
  revenueMax?: string
  sort?: string
}): BusinessObject[] {
  let results = [...mockObjects]

  // Filter by region
  if (filters.regions && filters.regions.length > 0) {
    results = results.filter(obj => filters.regions!.includes(obj.region))
  }

  // Filter by industry
  if (filters.industries && filters.industries.length > 0) {
    results = results.filter(obj => filters.industries!.includes(obj.type))
  }

  // Sort
  if (filters.sort === 'new') {
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } else if (filters.sort === 'verified') {
    results.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
  } else if (filters.sort === 'popular') {
    results.sort((a, b) => b.views - a.views)
  }

  return results
}

