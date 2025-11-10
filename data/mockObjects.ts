export interface BusinessObject {
  id: string
  type: string
  region: string
  revenueRange: string
  revenue: number // Exact number
  revenue3Years?: number // Average revenue over 3 years
  revenueGrowthRate?: number // Revenue growth rate percentage
  revenueYear1?: number
  revenueYear2?: number
  revenueYear3?: number
  ebitda: number
  profitMargin?: number
  grossMargin?: number
  employees: string
  ownerRole: string
  priceMin: number
  priceMax: number
  askingPrice?: number
  abstainPriceMin?: boolean // User opted out of providing min price
  abstainPriceMax?: boolean // User opted out of providing max price
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
  industry?: string
  title?: string
  price?: number
  location?: string
  ndaRequired?: boolean
  foundedYear?: number
  companyAge?: number
  
  // Balance Sheet & Assets
  cash?: number
  accountsReceivable?: number
  inventory?: number
  totalAssets?: number
  totalLiabilities?: number
  shortTermDebt?: number
  longTermDebt?: number
  
  // Operating Costs
  operatingCosts?: number
  salaries?: number
  rentCosts?: number
  marketingCosts?: number
  otherOperatingCosts?: number
  
  // Qualitative fields
  competitiveAdvantages?: string
  regulatoryLicenses?: string
  paymentTerms?: string
  idealBuyer?: string
  customerConcentrationRisk?: 'low' | 'medium' | 'high'
  
  // Image
  image?: string
  images?: string[]
  
  // Locked data (only after NDA)
  companyName: string
  orgNumber: string
  address: string
  website?: string
  detailedFinancials: any
  customers: string[]
  
  // Anonymous display
  anonymousTitle: string
  createdAt: Date
  
  // Match score for buyers
  matchScore?: number
  matchReasons?: string[]
}

export const mockObjects: BusinessObject[] = [
  {
    id: 'obj-001',
    type: 'Konsultbolag',
    industry: 'consulting',
    region: 'Stockholm',
    revenueRange: '5-10M',
    revenue: 7500000,
    revenue3Years: 7200000,
    revenueGrowthRate: 8.5,
    revenueYear1: 6500000,
    revenueYear2: 7000000,
    revenueYear3: 7500000,
    ebitda: 1800000,
    profitMargin: 15.2,
    grossMargin: 42.5,
    employees: '6-10',
    ownerRole: 'VD, operativ',
    priceMin: 12000000,
    priceMax: 15000000,
    askingPrice: 13500000,
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
    foundedYear: 2012,
    companyAge: 12,
    // Balance Sheet
    cash: 2500000,
    accountsReceivable: 1200000,
    totalAssets: 4200000,
    totalLiabilities: 1800000,
    shortTermDebt: 800000,
    longTermDebt: 1000000,
    // Operating Costs
    salaries: 4200000,
    rentCosts: 480000,
    marketingCosts: 250000,
    otherOperatingCosts: 320000,
    // Qualitative
    competitiveAdvantages: 'Specialistkompetens inom offentlig sektor, ramavtal med flera myndigheter, ISO-certifierad verksamhet',
    regulatoryLicenses: 'ISO 9001:2015, ISO 27001',
    paymentTerms: '30 dagar netto',
    idealBuyer: 'Större konsultbolag som vill expandera inom offentlig sektor eller entreprenör med branschbakgrund',
    customerConcentrationRisk: 'medium',
    companyName: 'Digital Konsult AB',
    orgNumber: '556123-4567',
    address: 'Storgatan 1, 111 22 Stockholm',
    website: 'www.digitalkonsult.se',
    detailedFinancials: {},
    customers: ['Stockholms kommun', 'Trafikverket', 'Försäkringskassan'],
    anonymousTitle: 'Etablerat IT-konsultbolag i Stockholm',
    image: '/Annonsbilder/IT-konsult.png',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-002',
    type: 'E-handel',
    industry: 'webshop',
    region: 'Göteborg',
    revenueRange: '10-25M',
    revenue: 18000000,
    revenue3Years: 15500000,
    revenueGrowthRate: 22.3,
    revenueYear1: 12000000,
    revenueYear2: 15000000,
    revenueYear3: 18000000,
    ebitda: 3200000,
    profitMargin: 12.8,
    grossMargin: 45.2,
    employees: '11-25',
    ownerRole: 'Passiv ägare',
    priceMin: 20000000,
    priceMax: 25000000,
    askingPrice: 22500000,
    description: 'Lönsam e-handelsplattform inom heminredning med stark tillväxt. Duktigt team på plats som driver den dagliga verksamheten.',
    strengths: [
      'Stark tillväxt - dubblad omsättning på 3 år',
      'Automatiserad logistik och processer',
      'Höga kundbetyg och låg returratio'
    ],
    risks: [
      'Konkurrens från stora aktörer',
      'Säsongsvariation i försäljning'
    ],
    whySelling: 'Ägaren vill realisera värde och fokusera på andra investeringar.',
    verified: true,
    broker: false,
    isNew: false,
    views: 312,
    foundedYear: 2015,
    companyAge: 9,
    // Balance Sheet
    cash: 3800000,
    accountsReceivable: 900000,
    inventory: 3500000,
    totalAssets: 9200000,
    totalLiabilities: 4100000,
    shortTermDebt: 2800000,
    longTermDebt: 1300000,
    // Operating Costs
    operatingCosts: 14800000,
    salaries: 5400000,
    rentCosts: 840000,
    marketingCosts: 2200000,
    otherOperatingCosts: 6360000,
    // Qualitative
    competitiveAdvantages: 'Starka leverantörsavtal, egen produktlinje med exklusiva design, avancerad e-handelsplattform',
    paymentTerms: 'Direkt vid köp för konsumenter',
    idealBuyer: 'E-handelsgrupp eller finansiell köpare med erfarenhet av skalning',
    customerConcentrationRisk: 'low',
    companyName: 'Nordic Living AB',
    orgNumber: '556234-5678',
    address: 'Hamngatan 10, 411 14 Göteborg',
    website: 'www.nordicliving.se',
    detailedFinancials: {},
    customers: ['B2C konsumenter', 'Återförsäljare'],
    anonymousTitle: 'Ledande e-handel inom heminredning',
    image: '/Annonsbilder/Ehandel.png',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-003',
    type: 'Restaurang',
    region: 'Malmö',
    revenueRange: '1-5M',
    revenue: 3200000,
    revenueYear1: 2800000,
    revenueYear2: 3000000,
    revenueYear3: 3200000,
    revenueGrowthRate: 6.7,
    ebitda: 480000,
    profitMargin: 8.5,
    grossMargin: 65.0,
    employees: '1-5',
    ownerRole: 'VD, operativ',
    priceMin: 2500000,
    priceMax: 3500000,
    askingPrice: 3000000,
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
    foundedYear: 2013,
    companyAge: 11,
    // Balance Sheet
    cash: 280000,
    inventory: 120000,
    totalAssets: 850000,
    totalLiabilities: 420000,
    shortTermDebt: 320000,
    longTermDebt: 100000,
    // Operating Costs
    salaries: 1200000,
    rentCosts: 360000,
    marketingCosts: 80000,
    otherOperatingCosts: 680000,
    // Qualitative
    competitiveAdvantages: 'Unik menykonceptet, central läge, stark lokal förankring',
    regulatoryLicenses: 'Alkoholtillstånd, Livsmedelshantering',
    paymentTerms: 'Kontant och kort',
    idealBuyer: 'Erfaren restauratör eller par som vill driva egen verksamhet',
    customerConcentrationRisk: 'low',
    companyName: 'Malmö Bistro AB',
    orgNumber: '556345-6789',
    address: 'Stortorget 12, 211 22 Malmö',
    website: 'www.malmobistro.se',
    detailedFinancials: {},
    customers: ['Walk-in kunder'],
    anonymousTitle: 'Etablerad restaurang i centrala Malmö',
    image: '/Annonsbilder/Restaurang.png',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-004',
    type: 'SaaS-företag',
    industry: 'saas',
    region: 'Stockholm',
    revenueRange: '5-10M',
    revenue: 8900000,
    revenue3Years: 6500000,
    revenueGrowthRate: 45.8,
    revenueYear1: 3200000,
    revenueYear2: 5800000,
    revenueYear3: 8900000,
    ebitda: 2100000,
    profitMargin: 18.5,
    grossMargin: 82.0,
    employees: '11-25',
    ownerRole: 'VD, ej operativ',
    priceMin: 35000000,
    priceMax: 45000000,
    askingPrice: 40000000,
    description: 'Växande SaaS-bolag med återkommande intäkter. Fokus på B2B-marknaden med stark produktutveckling.',
    strengths: [
      'Hög andel återkommande intäkter (ARR)',
      'Låg churn rate (<5%)',
      'Skalbar affärsmodell'
    ],
    risks: [
      'Teknisk skuld behöver adresseras',
      'Konkurrens från internationella aktörer'
    ],
    whySelling: 'Grundarna vill sälja till strategisk köpare för att accelerera tillväxt.',
    verified: true,
    broker: true,
    isNew: false,
    views: 423,
    foundedYear: 2018,
    companyAge: 6,
    // Balance Sheet
    cash: 4200000,
    accountsReceivable: 1800000,
    totalAssets: 7500000,
    totalLiabilities: 2100000,
    shortTermDebt: 1500000,
    longTermDebt: 600000,
    // Operating Costs
    salaries: 5200000,
    marketingCosts: 1500000,
    otherOperatingCosts: 600000,
    // Qualitative
    competitiveAdvantages: 'Patenterad teknologi, starka kundrelationer, marknadsledande position i Norden',
    paymentTerms: 'Månads- och årsabonnemang',
    idealBuyer: 'Tech-bolag eller PE-firma med erfarenhet av SaaS',
    customerConcentrationRisk: 'medium',
    companyName: 'CloudTech Solutions AB',
    orgNumber: '556789-0123',
    address: 'Kungsgatan 50, 111 35 Stockholm',
    website: 'www.cloudtechsolutions.se',
    detailedFinancials: {},
    customers: ['B2B företagskunder'],
    anonymousTitle: 'Framgångsrikt SaaS-bolag med hög tillväxt',
    image: '/Annonsbilder/Tech.png',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-005',
    type: 'Byggföretag',
    region: 'Uppsala',
    revenueRange: '25-50M',
    revenue: 35000000,
    revenue3Years: 32000000,
    revenueGrowthRate: 9.4,
    revenueYear1: 29000000,
    revenueYear2: 32000000,
    revenueYear3: 35000000,
    ebitda: 4200000,
    profitMargin: 8.6,
    grossMargin: 22.5,
    employees: '26-50',
    ownerRole: 'Styrelseordförande',
    priceMin: 28000000,
    priceMax: 35000000,
    askingPrice: 32000000,
    description: 'Välrenommerat byggföretag specialiserat på ROT-renovering. Stark orderbok och goda relationer med beställare.',
    strengths: [
      'Fullbokad orderstock 12 månader framåt',
      'Certifierad för offentlig upphandling',
      'Erfaren projektledning'
    ],
    risks: [
      'Konjunkturkänslig bransch',
      'Beroende av underleverantörer'
    ],
    whySelling: 'Generationsskifte - ägaren går i pension.',
    verified: true,
    broker: false,
    isNew: false,
    views: 189,
    foundedYear: 1998,
    companyAge: 26,
    // Balance Sheet
    cash: 5600000,
    accountsReceivable: 8200000,
    inventory: 2100000,
    totalAssets: 18500000,
    totalLiabilities: 11200000,
    shortTermDebt: 7800000,
    longTermDebt: 3400000,
    // Operating Costs
    salaries: 16800000,
    marketingCosts: 500000,
    otherOperatingCosts: 10200000,
    // Qualitative
    competitiveAdvantages: 'Långvariga kundrelationer, specialistkompetens inom kulturfastigheter, egen maskinpark',
    regulatoryLicenses: 'Bygglov, Arbetsmiljöcertifiering, ISO 14001',
    paymentTerms: '30 dagar, delbetalning vid större projekt',
    idealBuyer: 'Byggkoncern eller entreprenör med branschvana',
    customerConcentrationRisk: 'medium',
    companyName: 'Uppsala Bygg & Renovering AB',
    orgNumber: '556456-7890',
    address: 'Industrivägen 15, 753 23 Uppsala',
    detailedFinancials: {},
    customers: ['Fastighetsbolag', 'Kommuner', 'Privatpersoner'],
    anonymousTitle: 'Etablerat byggföretag i Uppsala',
    image: '/Annonsbilder/Bygg.png',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-006',
    type: 'Städföretag',
    region: 'Linköping',
    revenueRange: '1-5M',
    revenue: 4200000,
    revenue3Years: 3800000,
    revenueGrowthRate: 10.5,
    revenueYear1: 3400000,
    revenueYear2: 3800000,
    revenueYear3: 4200000,
    ebitda: 580000,
    profitMargin: 9.5,
    grossMargin: 35.0,
    employees: '11-25',
    ownerRole: 'VD, operativ',
    priceMin: 3500000,
    priceMax: 4500000,
    askingPrice: 4000000,
    description: 'Lönsamt städföretag med långvariga avtal. Miljöcertifierad verksamhet med fokus på kontor och vårdlokaler.',
    strengths: [
      'Långvariga ramavtal med kommunen',
      'Miljöcertifierad verksamhet',
      'Låg personalomsättning'
    ],
    risks: [
      'Prispress från konkurrenter',
      'Svårt att rekrytera personal'
    ],
    whySelling: 'Ägaren vill gå vidare till andra projekt.',
    verified: true,
    broker: false,
    isNew: true,
    views: 98,
    foundedYear: 2008,
    companyAge: 16,
    // Balance Sheet
    cash: 680000,
    accountsReceivable: 520000,
    totalAssets: 1800000,
    totalLiabilities: 950000,
    shortTermDebt: 750000,
    longTermDebt: 200000,
    // Operating Costs
    salaries: 2400000,
    rentCosts: 180000,
    marketingCosts: 60000,
    otherOperatingCosts: 580000,
    // Qualitative
    competitiveAdvantages: 'Miljöcertifiering, nöjda kunder med långa avtal, effektiva arbetsprocesser',
    regulatoryLicenses: 'Miljöcertifiering, Arbetsmiljöcertifiering',
    paymentTerms: '30 dagar netto',
    idealBuyer: 'Befintligt städföretag för expansion eller entreprenör',
    customerConcentrationRisk: 'high',
    companyName: 'Eko-Städ Östergötland AB',
    orgNumber: '556567-8901',
    address: 'Företagsvägen 8, 581 42 Linköping',
    detailedFinancials: {},
    customers: ['Linköpings kommun', 'Region Östergötland', 'Privata företag'],
    anonymousTitle: 'Miljöcertifierat städföretag i Östergötland',
    image: '/Annonsbilder/Stad.png',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-007',
    type: 'Transportföretag',
    region: 'Jönköping',
    revenueRange: '10-25M',
    revenue: 16000000,
    revenue3Years: 14500000,
    revenueGrowthRate: 10.3,
    revenueYear1: 13000000,
    revenueYear2: 14500000,
    revenueYear3: 16000000,
    ebitda: 2400000,
    profitMargin: 11.3,
    grossMargin: 28.5,
    employees: '11-25',
    ownerRole: 'VD, delvis operativ',
    priceMin: 18000000,
    priceMax: 22000000,
    askingPrice: 20000000,
    description: 'Transportföretag med moderna fordon och fasta transportavtal. Specialiserat på tempererade transporter.',
    strengths: [
      'Modern fordonsflotta (snittålder 3 år)',
      'Långvariga kundavtal',
      'Egen verkstad minskar kostnaderna'
    ],
    risks: [
      'Bränsleprisernas utveckling',
      'Behov av chaufförer'
    ],
    whySelling: 'Ägaren vill fokusera på fastighetsportfölj.',
    verified: true,
    broker: true,
    isNew: false,
    views: 267,
    foundedYear: 2005,
    companyAge: 19,
    // Balance Sheet
    cash: 2100000,
    accountsReceivable: 2800000,
    totalAssets: 12500000,
    totalLiabilities: 8900000,
    shortTermDebt: 3200000,
    longTermDebt: 5700000,
    // Operating Costs
    salaries: 6200000,
    marketingCosts: 200000,
    otherOperatingCosts: 5400000,
    // Qualitative
    competitiveAdvantages: 'Specialisering på tempererade transporter, egen verkstad, miljövänlig fordonsflotta',
    regulatoryLicenses: 'Yrkestrafiktillstånd, ADR-tillstånd',
    paymentTerms: '30-60 dagar',
    idealBuyer: 'Transportkoncern eller investerare med branschkunskap',
    customerConcentrationRisk: 'medium',
    companyName: 'Smålands Transport & Logistik AB',
    orgNumber: '556678-9012',
    address: 'Logistikvägen 25, 553 05 Jönköping',
    website: 'www.smalandstransport.se',
    detailedFinancials: {},
    customers: ['Livsmedelsgrossister', 'E-handelsföretag', 'Industrier'],
    anonymousTitle: 'Specialiserat transportföretag i Småland',
    image: '/Annonsbilder/Transport.png',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-008',
    type: 'Frisörsalong',
    region: 'Helsingborg',
    revenueRange: '1-5M',
    revenue: 2800000,
    revenueYear1: 2400000,
    revenueYear2: 2600000,
    revenueYear3: 2800000,
    revenueGrowthRate: 7.7,
    ebitda: 420000,
    profitMargin: 10.7,
    grossMargin: 58.0,
    employees: '1-5',
    ownerRole: 'Ägare, operativ',
    priceMin: 2000000,
    priceMax: 2800000,
    askingPrice: 2400000,
    description: 'Välrenommerad frisörsalong i centralt läge. Trogen kundkrets och duktigt team av frisörer.',
    strengths: [
      'Centralt läge med bra kundflöde',
      'Etablerat varumärke lokalt',
      'Flexibla öppettider ger konkurrensfördelar'
    ],
    risks: [
      'Lokalhyran kan komma att höjas',
      'Konkurrens från lågpriskedjor'
    ],
    whySelling: 'Personliga skäl - flytt till annan ort.',
    verified: false,
    broker: false,
    isNew: true,
    views: 56,
    foundedYear: 2010,
    companyAge: 14,
    // Balance Sheet
    cash: 320000,
    totalAssets: 680000,
    totalLiabilities: 280000,
    shortTermDebt: 280000,
    // Operating Costs
    salaries: 1400000,
    rentCosts: 360000,
    marketingCosts: 80000,
    otherOperatingCosts: 220000,
    // Qualitative
    competitiveAdvantages: 'Starkt lokalt varumärke, skickliga frisörer, bra läge',
    paymentTerms: 'Kontant och kort',
    idealBuyer: 'Frisör som vill bli egen eller befintlig kedja',
    customerConcentrationRisk: 'low',
    companyName: 'Salong Excellence',
    orgNumber: '556789-0234',
    address: 'Drottninggatan 45, 252 21 Helsingborg',
    detailedFinancials: {},
    customers: ['Privatpersoner'],
    anonymousTitle: 'Centralt belägen frisörsalong i Helsingborg',
    image: '/Annonsbilder/Frisor.png',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-009',
    type: 'Redovisningsbyrå',
    region: 'Växjö',
    revenueRange: '5-10M',
    revenue: 6200000,
    revenue3Years: 5800000,
    revenueGrowthRate: 6.9,
    revenueYear1: 5400000,
    revenueYear2: 5800000,
    revenueYear3: 6200000,
    ebitda: 1400000,
    profitMargin: 18.4,
    grossMargin: 72.0,
    employees: '6-10',
    ownerRole: 'Delägare',
    priceMin: 8000000,
    priceMax: 10000000,
    askingPrice: 9000000,
    description: 'Etablerad redovisningsbyrå med bred kundbas. Auktoriserade redovisningskonsulter och modern digital hantering.',
    strengths: [
      'Återkommande intäkter från befintliga kunder',
      'Auktoriserad personal',
      'Digitaliserade processer'
    ],
    risks: [
      'Ökad konkurrens från automatiserade lösningar',
      'Svårt att rekrytera kvalificerad personal'
    ],
    whySelling: 'Delägare vill gå i pension, övriga vill sälja.',
    verified: true,
    broker: true,
    isNew: false,
    views: 178,
    foundedYear: 1995,
    companyAge: 29,
    // Balance Sheet
    cash: 1800000,
    accountsReceivable: 980000,
    totalAssets: 3200000,
    totalLiabilities: 1100000,
    shortTermDebt: 1100000,
    // Operating Costs
    salaries: 3600000,
    rentCosts: 240000,
    marketingCosts: 120000,
    otherOperatingCosts: 480000,
    // Qualitative
    competitiveAdvantages: 'Auktorisation, lång historik, moderna system, bred kompetens',
    regulatoryLicenses: 'Auktoriserade redovisningskonsulter (FAR)',
    paymentTerms: 'Månadsvis i förskott',
    idealBuyer: 'Annan byrå eller ekonomikoncern',
    customerConcentrationRisk: 'low',
    companyName: 'Växjö Redovisning & Konsult AB',
    orgNumber: '556890-1234',
    address: 'Kungsgatan 12, 352 31 Växjö',
    website: 'www.vaxjoredovisning.se',
    detailedFinancials: {},
    customers: ['SME företag', 'Enskilda firmor'],
    anonymousTitle: 'Auktoriserad redovisningsbyrå i Småland',
    image: '/Annonsbilder/Redovisning.png',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-010',
    type: 'Bilverkstad',
    region: 'Örebro',
    revenueRange: '10-25M',
    revenue: 12000000,
    revenue3Years: 11200000,
    revenueGrowthRate: 7.1,
    revenueYear1: 10500000,
    revenueYear2: 11200000,
    revenueYear3: 12000000,
    ebitda: 1800000,
    profitMargin: 11.7,
    grossMargin: 42.0,
    employees: '11-25',
    ownerRole: 'VD, delvis operativ',
    priceMin: 12000000,
    priceMax: 15000000,
    askingPrice: 13500000,
    description: 'Fullservice bilverkstad med märkesauktorisation. Hög kundnöjdhet och moderna lokaler.',
    strengths: [
      'Auktoriserad för flera märken',
      'Modern utrustning och lokaler',
      'Erfarna mekaniker'
    ],
    risks: [
      'Ökande konkurrens från märkesverkstäder',
      'Investeringsbehov i ny teknik för elbilar'
    ],
    whySelling: 'Ägaren vill trappa ner och söker efterträdare.',
    verified: true,
    broker: false,
    isNew: false,
    views: 201,
    foundedYear: 2000,
    companyAge: 24,
    // Balance Sheet
    cash: 1600000,
    accountsReceivable: 1100000,
    inventory: 800000,
    totalAssets: 6200000,
    totalLiabilities: 3800000,
    shortTermDebt: 2200000,
    longTermDebt: 1600000,
    // Operating Costs
    salaries: 5200000,
    rentCosts: 600000,
    marketingCosts: 180000,
    otherOperatingCosts: 3420000,
    // Qualitative
    competitiveAdvantages: 'Märkesauktorisation, central lokalisering, modern verkstad',
    regulatoryLicenses: 'Verkstadsauktorisation för VW, Audi, Skoda',
    paymentTerms: 'Kontant vid hämtning',
    idealBuyer: 'Mekaniker eller investerare med branschintresse',
    customerConcentrationRisk: 'low',
    companyName: 'Örebro Bilservice AB',
    orgNumber: '556901-2345',
    address: 'Verkstadsgatan 18, 702 23 Örebro',
    detailedFinancials: {},
    customers: ['Privatpersoner', 'Företag med bilflottor'],
    anonymousTitle: 'Auktoriserad bilverkstad i Örebro',
    image: '/Annonsbilder/Bilverkstad.png',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'obj-020',
    type: 'Cykelbutik',
    region: 'Göteborg',
    revenueRange: '5-10M',
    revenue: 7600000,
    revenue3Years: 7000000,
    revenueGrowthRate: 8.6,
    revenueYear1: 6400000,
    revenueYear2: 7000000,
    revenueYear3: 7600000,
    ebitda: 1100000,
    profitMargin: 10.5,
    grossMargin: 38.0,
    employees: '1-5',
    ownerRole: 'Ägare, operativ',
    priceMin: 8000000,
    priceMax: 10000000,
    askingPrice: 9000000,
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
    foundedYear: 2012,
    companyAge: 12,
    // Balance Sheet
    cash: 920000,
    inventory: 1800000,
    accountsReceivable: 320000,
    totalAssets: 3400000,
    totalLiabilities: 1900000,
    shortTermDebt: 1400000,
    longTermDebt: 500000,
    // Operating Costs
    salaries: 2800000,
    rentCosts: 480000,
    marketingCosts: 240000,
    otherOperatingCosts: 2680000,
    // Qualitative
    competitiveAdvantages: 'Specialistkunskap, brett sortiment av premiumcyklar, etablerad verkstad',
    paymentTerms: 'Kontant och kort, avbetalning via partner',
    idealBuyer: 'Cykelentusiast eller befintlig aktör inom cykelbranschen',
    customerConcentrationRisk: 'low',
    companyName: 'Premium Bikes Göteborg AB',
    orgNumber: '558012-3456',
    address: 'Västra Hamngatan 12, 411 17 Göteborg',
    website: 'www.premiumbikes.se',
    detailedFinancials: {},
    customers: ['B2C privatpersoner + företagskunder'],
    anonymousTitle: 'Cykelbutik i Göteborg med verkstad',
    image: '/Annonsbilder/Cykel.png',
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