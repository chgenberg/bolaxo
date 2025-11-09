# Förbättringar för Bolagsvärdering - Komplett Guide

## Översikt
Detta dokument beskriver alla förbättringar som behövs för att göra bolagsvärderingen så komplett och professionell som möjligt.

---

## 1. FINANSIELL ANALYS - Utöka med balansräkning och kassaflöde

### Nuvarande status:
- ✅ EBITDA-beräkning från omsättning och rörelsekostnader
- ✅ EBITDA-marginal
- ❌ Ingen balansräkning
- ❌ Ingen kassaflödesanalys
- ❌ Ingen working capital-beräkning

### Förbättringar:

#### 1.1 Lägg till balansräkningsfält i formuläret
```typescript
// Nya fält att lägga till i ValuationWizard.tsx
interface ValuationData {
  // ... existing fields
  
  // Balansräkning
  totalAssets?: string
  totalLiabilities?: string
  equity?: string
  cash?: string
  accountsReceivable?: string
  inventory?: string
  accountsPayable?: string
  shortTermDebt?: string
  longTermDebt?: string
  
  // Kassaflöde
  operatingCashFlow?: string
  capitalExpenditures?: string
  freeCashFlow?: string
}
```

#### 1.2 Beräkna working capital
```typescript
// Lägg till i handler.ts
function calculateWorkingCapital(data: any): number {
  const receivables = Number(data.accountsReceivable) || 0
  const inventory = Number(data.inventory) || 0
  const payables = Number(data.accountsPayable) || 0
  
  return receivables + inventory - payables
}

function calculateWorkingCapitalRequirement(data: any, revenue: number): number {
  // Working capital som % av omsättning (branschspecifikt)
  const wcPercentages: Record<string, number> = {
    retail: 0.15,      // 15% av omsättning
    manufacturing: 0.20,
    ecommerce: 0.10,
    services: 0.05,
    consulting: 0.03,
    tech: 0.05,
  }
  
  const wcPercent = wcPercentages[data.industry] || 0.10
  return revenue * wcPercent
}
```

#### 1.3 Justera värdering för working capital
```typescript
// I buildValuationPrompt, lägg till:
if (data.accountsReceivable || data.inventory || data.accountsPayable) {
  const wc = calculateWorkingCapital(data)
  prompt += `\n\n**WORKING CAPITAL:**`
  prompt += `\n- Kundfordringar: ${(Number(data.accountsReceivable) / 1000000).toFixed(1)} MSEK`
  prompt += `\n- Lager: ${(Number(data.inventory) / 1000000).toFixed(1)} MSEK`
  prompt += `\n- Leverantörsskulder: ${(Number(data.accountsPayable) / 1000000).toFixed(1)} MSEK`
  prompt += `\n- Working Capital: ${(wc / 1000000).toFixed(1)} MSEK`
  prompt += `\n⚠️ Justera EV med working capital-behov vid försäljning`
}
```

---

## 2. HISTORISK TRENDANALYS från årsredovisningar

### Nuvarande status:
- ✅ Hämtar årsredovisningar från Bolagsverket
- ✅ Visar 3 senaste åren i prompt
- ❌ Ingen trendanalys (tillväxt, volatilitet, marginutveckling)
- ❌ Ingen viktning av senaste året vs genomsnitt

### Förbättringar:

#### 2.1 Analysera trender från årsredovisningar
```typescript
// Lägg till i handler.ts
function analyzeHistoricalTrends(annualReports: any[]): {
  revenueGrowth: number[]
  marginTrend: number[]
  volatility: number
  recentTrend: 'improving' | 'declining' | 'stable'
} {
  if (annualReports.length < 2) {
    return { revenueGrowth: [], marginTrend: [], volatility: 0, recentTrend: 'stable' }
  }
  
  const sorted = [...annualReports].sort((a, b) => a.year - b.year)
  const revenueGrowth: number[] = []
  const marginTrend: number[] = []
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    
    if (prev.revenue && curr.revenue && prev.revenue > 0) {
      const growth = ((curr.revenue - prev.revenue) / prev.revenue) * 100
      revenueGrowth.push(growth)
    }
    
    if (prev.revenue && curr.revenue && prev.profit !== undefined && curr.profit !== undefined) {
      const prevMargin = (prev.profit / prev.revenue) * 100
      const currMargin = (curr.profit / curr.revenue) * 100
      marginTrend.push(currMargin - prevMargin)
    }
  }
  
  // Beräkna volatilitet (standardavvikelse)
  const avgGrowth = revenueGrowth.reduce((a, b) => a + b, 0) / revenueGrowth.length
  const variance = revenueGrowth.reduce((sum, g) => sum + Math.pow(g - avgGrowth, 2), 0) / revenueGrowth.length
  const volatility = Math.sqrt(variance)
  
  // Bestäm trend
  const recentGrowth = revenueGrowth.slice(-2)
  const recentAvg = recentGrowth.reduce((a, b) => a + b, 0) / recentGrowth.length
  const olderAvg = revenueGrowth.slice(0, -2).reduce((a, b) => a + b, 0) / Math.max(1, revenueGrowth.length - 2)
  
  let recentTrend: 'improving' | 'declining' | 'stable' = 'stable'
  if (recentAvg > olderAvg + 5) recentTrend = 'improving'
  else if (recentAvg < olderAvg - 5) recentTrend = 'declining'
  
  return { revenueGrowth, marginTrend, volatility, recentTrend }
}
```

#### 2.2 Använd trender i värdering
```typescript
// I buildValuationPrompt, efter årsredovisningar:
if (enrichedData.bolagsverketData?.annualReports?.length >= 2) {
  const trends = analyzeHistoricalTrends(enrichedData.bolagsverketData.annualReports)
  
  prompt += `\n\n**HISTORISK TRENDANALYS:**`
  prompt += `\n- Genomsnittlig tillväxt: ${trends.revenueGrowth.reduce((a, b) => a + b, 0) / trends.revenueGrowth.length}%`
  prompt += `\n- Volatilitet: ${trends.volatility.toFixed(1)}% (högre = mer risk)`
  prompt += `\n- Senaste trend: ${trends.recentTrend === 'improving' ? 'FÖRBÄTTRAS' : trends.recentTrend === 'declining' ? 'FÖRSÄMras' : 'STABIL'}`
  
  if (trends.recentTrend === 'improving') {
    prompt += `\n✓ Justera multipel uppåt med 10-15% för positiv trend`
  } else if (trends.recentTrend === 'declining') {
    prompt += `\n⚠ Justera multipel nedåt med 10-15% för negativ trend`
  }
  
  // Viktning: senaste året väger tyngre
  prompt += `\n- Använd 60% vikt på senaste året, 40% på genomsnitt`
}
```

---

## 3. JÄMFÖRELSE MED LIKNANDE TRANSAKTIONER

### Nuvarande status:
- ✅ Branschspecifika multiplar (statiska)
- ❌ Ingen jämförelse med faktiska transaktioner
- ❌ Ingen justering för storlek/tillväxt

### Förbättringar:

#### 3.1 Skapa databas med transaktionsdata
```typescript
// Ny fil: lib/transaction-comparables.ts

interface ComparableTransaction {
  companyName: string
  industry: string
  revenue: number // MSEK
  ebitda: number // MSEK
  ebitdaMargin: number // %
  transactionValue: number // MSEK
  ebitdaMultiple: number
  revenueMultiple: number
  year: number
  dealType: 'strategic' | 'financial' | 'mbo'
}

// Exempeldata (kan utökas med faktiska transaktioner)
const COMPARABLE_TRANSACTIONS: ComparableTransaction[] = [
  // Tech/SaaS
  { companyName: 'Exempel SaaS AB', industry: 'tech', revenue: 15, ebitda: 3, ebitdaMargin: 20, transactionValue: 25, ebitdaMultiple: 8.3, revenueMultiple: 1.7, year: 2023, dealType: 'strategic' },
  // ... fler exempel
]

export function findComparableTransactions(
  industry: string,
  revenue: number,
  ebitdaMargin: number
): ComparableTransaction[] {
  return COMPARABLE_TRANSACTIONS
    .filter(t => t.industry === industry)
    .filter(t => {
      // Hitta transaktioner inom samma storleksordning
      const revenueDiff = Math.abs(t.revenue - revenue) / revenue
      return revenueDiff < 0.5 // Max 50% skillnad
    })
    .sort((a, b) => {
      // Sortera efter likhet i marginal
      const marginDiffA = Math.abs(a.ebitdaMargin - ebitdaMargin)
      const marginDiffB = Math.abs(b.ebitdaMargin - ebitdaMargin)
      return marginDiffA - marginDiffB
    })
    .slice(0, 5) // Top 5 mest liknande
}
```

#### 3.2 Använd comparables i värdering
```typescript
// I buildValuationPrompt:
import { findComparableTransactions } from '@/lib/transaction-comparables'

const revenueMSEK = exactRevenue ? exactRevenue / 1000000 : null
const ebitdaMSEK = ebitda ? ebitda / 1000000 : null

if (revenueMSEK && ebitdaMSEK && ebitdaMargin) {
  const comparables = findComparableTransactions(data.industry, revenueMSEK, ebitdaMargin)
  
  if (comparables.length > 0) {
    prompt += `\n\n**JÄMFÖRELSE MED LIKNANDE TRANSAKTIONER:**`
    const avgMultiple = comparables.reduce((sum, c) => sum + c.ebitdaMultiple, 0) / comparables.length
    
    prompt += `\n- Hittade ${comparables.length} liknande transaktioner`
    prompt += `\n- Genomsnittlig EBITDA-multipel: ${avgMultiple.toFixed(1)}x`
    prompt += `\n- Intervall: ${Math.min(...comparables.map(c => c.ebitdaMultiple)).toFixed(1)}x - ${Math.max(...comparables.map(c => c.ebitdaMultiple)).toFixed(1)}x`
    
    comparables.slice(0, 3).forEach((c, i) => {
      prompt += `\n  ${i + 1}. ${c.companyName} (${c.year}): ${c.ebitdaMultiple.toFixed(1)}x EBITDA`
    })
    
    prompt += `\n⚠️ Använd dessa som referenspunkt, justera för:`
    prompt += `\n  - Tillväxt (högre tillväxt = högre multipel)`
    prompt += `\n  - Storlek (mindre bolag = lägre multipel)`
    prompt += `\n  - Deal type (strategic = högre än financial)`
  }
}
```

---

## 4. SENSITIVITY ANALYSIS - Vad händer om...?

### Nuvarande status:
- ✅ WhatIfScenarios-komponent finns
- ❌ Ingen automatisk sensitivity analysis i värderingen
- ❌ Ingen visualisering av scenarier

### Förbättringar:

#### 4.1 Lägg till sensitivity analysis i resultatet
```typescript
// I handler.ts, lägg till i resultatet:
interface SensitivityScenario {
  name: string
  description: string
  ebitdaChange: number // % förändring
  valuationChange: number // MSEK förändring
  newValuation: number
}

function calculateSensitivityScenarios(
  baseValuation: number,
  baseEBITDA: number,
  multiple: number
): SensitivityScenario[] {
  const scenarios = [
    { name: 'Optimistiskt', ebitdaChange: 20, description: 'EBITDA ökar med 20%' },
    { name: 'Pessimistiskt', ebitdaChange: -20, description: 'EBITDA minskar med 20%' },
    { name: 'Tillväxtscenario', ebitdaChange: 30, description: 'Stark tillväxt, EBITDA +30%' },
    { name: 'Nedgång', ebitdaChange: -30, description: 'Marknadsnedgång, EBITDA -30%' },
  ]
  
  return scenarios.map(s => {
    const newEBITDA = baseEBITDA * (1 + s.ebitdaChange / 100)
    const newValuation = newEBITDA * multiple * 1000000
    const valuationChange = newValuation - baseValuation
    
    return {
      ...s,
      valuationChange: valuationChange / 1000000, // MSEK
      newValuation
    }
  })
}
```

#### 4.2 Lägg till i AI-prompt
```typescript
// I buildValuationPrompt, efter huvudvärdering:
prompt += `\n\n**SENSITIVITY ANALYSIS:**`
prompt += `\nBeräkna hur värderingen påverkas av:`
prompt += `\n- EBITDA ±20%`
prompt += `\n- EBITDA ±30%`
prompt += `\n- Multipel ±1x`
prompt += `\nPresentera som tabell i JSON-resultatet`
```

#### 4.3 Uppdatera JSON-schema
```typescript
// I parseAIResponse, lägg till:
{
  "valuationRange": {...},
  "sensitivityAnalysis": [
    {
      "scenario": "Optimistiskt (+20% EBITDA)",
      "newValuation": X,
      "change": Y
    },
    ...
  ],
  ...
}
```

---

## 5. DEBT ADJUSTMENTS och NET DEBT

### Nuvarande status:
- ✅ totalDebt-fält finns
- ❌ Ingen justering av Enterprise Value för skulder
- ❌ Ingen net debt-beräkning

### Förbättringar:

#### 5.1 Beräkna Enterprise Value vs Equity Value
```typescript
// I handler.ts
function calculateEnterpriseValue(equityValue: number, data: any): {
  enterpriseValue: number
  equityValue: number
  netDebt: number
  totalDebt: number
  cash: number
} {
  const totalDebt = Number(data.totalDebt) || 0
  const cash = Number(data.cash) || 0
  const netDebt = totalDebt - cash
  
  // Enterprise Value = Equity Value + Net Debt
  const enterpriseValue = equityValue + netDebt
  
  return {
    enterpriseValue,
    equityValue,
    netDebt,
    totalDebt,
    cash
  }
}
```

#### 5.2 Uppdatera prompt för att inkludera debt
```typescript
// I buildValuationPrompt:
if (data.totalDebt || data.cash) {
  prompt += `\n\n**SKULDER OCH KASSA:**`
  if (data.totalDebt) {
    prompt += `\n- Totala skulder: ${(Number(data.totalDebt) / 1000000).toFixed(1)} MSEK`
  }
  if (data.cash) {
    prompt += `\n- Kassa: ${(Number(data.cash) / 1000000).toFixed(1)} MSEK`
  }
  
  const netDebt = (Number(data.totalDebt) || 0) - (Number(data.cash) || 0)
  prompt += `\n- Net Debt: ${(netDebt / 1000000).toFixed(1)} MSEK`
  prompt += `\n⚠️ VÄRDERING:`
  prompt += `\n  - Enterprise Value (EV) = Företagsvärde + Net Debt`
  prompt += `\n  - Equity Value = EV - Net Debt`
  prompt += `\n  - Presentera BÅDA värdena i resultatet`
}
```

---

## 6. EDGE CASES - Startups, förlustbolag, cykliska branscher

### Nuvarande status:
- ✅ Fallback för negativ EBITDA
- ❌ Ingen särskild hantering av startups
- ❌ Ingen hantering av cykliska branscher

### Förbättringar:

#### 6.1 Identifiera edge cases
```typescript
// I handler.ts
function identifyEdgeCase(data: any): {
  type: 'startup' | 'loss_making' | 'cyclical' | 'high_growth' | 'normal'
  adjustments: string[]
} {
  const adjustments: string[] = []
  let type: 'startup' | 'loss_making' | 'cyclical' | 'high_growth' | 'normal' = 'normal'
  
  // Startup: <3 år gammalt, låg omsättning, negativ eller låg vinst
  const companyAge = Number(data.companyAge) || 0
  const revenue = Number(data.exactRevenue) || 0
  const ebitda = revenue - (Number(data.operatingCosts) || 0)
  
  if (companyAge < 3 && revenue < 5000000 && ebitda < 0) {
    type = 'startup'
    adjustments.push('Använd revenue-multipel istället för EBITDA')
    adjustments.push('Höj multipel för tillväxtpotential')
    adjustments.push('Sänk multipel för risk (ingen track record)')
  }
  
  // Förlustbolag
  if (ebitda < 0 && revenue > 0) {
    type = 'loss_making'
    adjustments.push('Använd revenue-multipel (0.3-1.5x beroende på bransch)')
    adjustments.push('Sänk multipel kraftigt för negativ EBITDA')
    adjustments.push('Fokusera på tillväxt och path to profitability')
  }
  
  // Cykliska branscher (bygg, bil, etc.)
  const cyclicalIndustries = ['construction', 'manufacturing']
  if (cyclicalIndustries.includes(data.industry)) {
    type = 'cyclical'
    adjustments.push('Använd genomsnittlig EBITDA över flera år')
    adjustments.push('Justera för cykelposition (uppgång/nedgång)')
  }
  
  // Hög tillväxt
  if (data.revenue3Years === 'strong_growth' && Number(data.revenue3Years) > 30) {
    type = 'high_growth'
    adjustments.push('Höj multipel för tillväxt')
    adjustments.push('Värdera på forward-looking EBITDA')
  }
  
  return { type, adjustments }
}
```

#### 6.2 Använd edge case-justeringar
```typescript
// I buildValuationPrompt:
const edgeCase = identifyEdgeCase(data)
if (edgeCase.type !== 'normal') {
  prompt += `\n\n**SPECIELL SITUATION: ${edgeCase.type.toUpperCase()}**`
  prompt += `\nDetta företag kategoriseras som ${edgeCase.type}.`
  edgeCase.adjustments.forEach(adj => {
    prompt += `\n- ${adj}`
  })
}
```

---

## 7. BENCHMARKING MOT BRANSCHGENOMSNITT (SCB-data)

### Nuvarande status:
- ✅ SCB-data hämtas i enrich-company
- ❌ Används inte aktivt i värderingen
- ❌ Ingen jämförelse med branschgenomsnitt

### Förbättringar:

#### 7.1 Använd SCB-data för benchmarking
```typescript
// I buildValuationPrompt, efter SCB-data:
if (enrichedData.scbData) {
  const scb = enrichedData.scbData
  
  prompt += `\n\n**BRANSCHBENCHMARKING (SCB):**`
  if (scb.avgRevenue) {
    const companyRevenue = exactRevenue ? exactRevenue / 1000000 : null
    if (companyRevenue) {
      const vsAverage = (companyRevenue / scb.avgRevenue) * 100
      prompt += `\n- Företagets omsättning: ${companyRevenue.toFixed(1)} MSEK`
      prompt += `\n- Branschgenomsnitt: ${scb.avgRevenue.toFixed(1)} MSEK`
      prompt += `\n- Relativ storlek: ${vsAverage.toFixed(0)}% av genomsnittet`
      
      if (vsAverage < 50) {
        prompt += `\n⚠️ Mycket mindre än genomsnittet - kan motivera lägre multipel`
      } else if (vsAverage > 200) {
        prompt += `\n✓ Betydligt större än genomsnittet - kan motivera högre multipel`
      }
    }
  }
  
  if (scb.avgMargin) {
    const companyMargin = ebitdaMargin
    if (companyMargin !== null) {
      const marginDiff = companyMargin - scb.avgMargin
      prompt += `\n- Företagets EBITDA-marginal: ${companyMargin.toFixed(1)}%`
      prompt += `\n- Branschgenomsnitt: ${scb.avgMargin.toFixed(1)}%`
      prompt += `\n- Skillnad: ${marginDiff > 0 ? '+' : ''}${marginDiff.toFixed(1)}%`
      
      if (marginDiff > 5) {
        prompt += `\n✓ Betydligt bättre lönsamhet än genomsnittet - höj multipel`
      } else if (marginDiff < -5) {
        prompt += `\n⚠️ Sämre lönsamhet än genomsnittet - sänk multipel`
      }
    }
  }
}
```

---

## 8. FÖRBÄTTRAD PDF-EXPORT

### Nuvarande status:
- ✅ Grundläggande PDF med värdering, SWOT, rekommendationer
- ❌ Ingen finansiell analys i PDF
- ❌ Ingen sensitivity analysis i PDF
- ❌ Ingen historisk trendgraf

### Förbättringar:

#### 8.1 Lägg till finansiell analys-sida i PDF
```typescript
// I ValuationPDF.tsx, lägg till ny sida:
<Page size="A4" style={styles.page}>
  <View style={styles.header}>
    <Text style={styles.title}>Finansiell Analys</Text>
  </View>
  
  {/* Historisk utveckling */}
  {companyInfo.annualReports && (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Historisk Utveckling</Text>
      {/* Tabell med årsredovisningar */}
    </View>
  )}
  
  {/* Working Capital */}
  {result.workingCapital && (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Working Capital</Text>
      <Text>Kundfordringar: {result.workingCapital.receivables} MSEK</Text>
      <Text>Lager: {result.workingCapital.inventory} MSEK</Text>
      <Text>Leverantörsskulder: {result.workingCapital.payables} MSEK</Text>
      <Text>Net Working Capital: {result.workingCapital.net} MSEK</Text>
    </View>
  )}
  
  {/* Debt Analysis */}
  {result.debtAnalysis && (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skuldsättning</Text>
      <Text>Totala skulder: {result.debtAnalysis.totalDebt} MSEK</Text>
      <Text>Kassa: {result.debtAnalysis.cash} MSEK</Text>
      <Text>Net Debt: {result.debtAnalysis.netDebt} MSEK</Text>
      <Text>Enterprise Value: {result.debtAnalysis.enterpriseValue} MSEK</Text>
      <Text>Equity Value: {result.debtAnalysis.equityValue} MSEK</Text>
    </View>
  )}
</Page>
```

#### 8.2 Lägg till sensitivity analysis-sida
```typescript
<Page size="A4" style={styles.page}>
  <View style={styles.header}>
    <Text style={styles.title}>Sensitivity Analysis</Text>
  </View>
  
  {result.sensitivityAnalysis && (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Värdering vid olika scenarier</Text>
      {result.sensitivityAnalysis.map((scenario, i) => (
        <View key={i} style={styles.methodBox}>
          <Text style={styles.methodTitle}>{scenario.scenario}</Text>
          <Text style={styles.methodText}>
            Ny värdering: {scenario.newValuation.toFixed(1)} MSEK
            ({scenario.change > 0 ? '+' : ''}{scenario.change.toFixed(1)} MSEK)
          </Text>
        </View>
      ))}
    </View>
  )}
</Page>
```

---

## 9. YTTERLIGARE FÖRBÄTTRINGAR

### 9.1 Immateriella tillgångar
- Lägg till fält för IP, varumärken, kunddatabaser
- Värdera immateriella tillgångar separat
- Lägg till i substansvärde

### 9.2 Synergies och strategiska värden
- Identifiera potentiella synergier för strategiska köpare
- Lägg till "strategic premium" i vissa fall
- Förklara skillnaden mellan financial och strategic value

### 9.3 Kvalitetsindikatorer
- Beräkna "Quality Score" baserat på flera faktorer
- Visualisera kvalitet vs värdering
- Använd för att justera multiplar

### 9.4 Real-time uppdateringar
- Uppdatera värdering när användaren ändrar siffror
- Visa live-preview av hur ändringar påverkar värderingen
- Spara versioner av värderingen

### 9.5 Export-format
- Excel-export med alla beräkningar
- PowerPoint-presentation med värdering
- JSON-export för vidare analys

---

## IMPLEMENTATIONSPRIORITET

### Högsta prioritet (Gör först):
1. ✅ Historisk trendanalys från årsredovisningar
2. ✅ Debt adjustments och net debt
3. ✅ Sensitivity analysis i resultatet
4. ✅ Working capital-beräkningar

### Medel prioritet:
5. ✅ Jämförelse med liknande transaktioner
6. ✅ Benchmarking mot SCB-data
7. ✅ Edge cases (startups, förlustbolag)

### Lägre prioritet (Nice to have):
8. ✅ Förbättrad PDF med finansiell analys
9. ✅ Immateriella tillgångar
10. ✅ Synergies och strategiska värden

---

## NÄSTA STEG

1. Implementera historisk trendanalys (punkt 2)
2. Lägg till debt adjustments (punkt 5)
3. Förbättra sensitivity analysis (punkt 4)
4. Lägg till working capital-fält i formuläret (punkt 1.1)

Vill du att jag börjar implementera någon av dessa förbättringar?

