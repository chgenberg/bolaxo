/**
 * Valuation Helper Functions
 * 
 * Funktioner för historisk trendanalys, debt adjustments och working capital
 */

export interface HistoricalTrends {
  revenueGrowth: number[]
  marginTrend: number[]
  volatility: number
  recentTrend: 'improving' | 'declining' | 'stable'
  averageGrowth: number
  lastYearGrowth: number
}

export interface DebtAnalysis {
  totalDebt: number
  cash: number
  netDebt: number
  enterpriseValue: number
  equityValue: number
  debtToEBITDA: number | null
}

export interface WorkingCapitalAnalysis {
  receivables: number
  inventory: number
  payables: number
  netWorkingCapital: number
  workingCapitalRequirement: number
  wcAsPercentOfRevenue: number
}

/**
 * Analyserar historiska trender från årsredovisningar
 */
export function analyzeHistoricalTrends(annualReports: any[]): HistoricalTrends {
  if (annualReports.length < 2) {
    return {
      revenueGrowth: [],
      marginTrend: [],
      volatility: 0,
      recentTrend: 'stable',
      averageGrowth: 0,
      lastYearGrowth: 0
    }
  }
  
  const sorted = [...annualReports]
    .filter(r => r.revenue && r.revenue > 0)
    .sort((a, b) => parseInt(a.year) - parseInt(b.year))
  
  if (sorted.length < 2) {
    return {
      revenueGrowth: [],
      marginTrend: [],
      volatility: 0,
      recentTrend: 'stable',
      averageGrowth: 0,
      lastYearGrowth: 0
    }
  }
  
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
  let volatility = 0
  let averageGrowth = 0
  let lastYearGrowth = 0
  
  if (revenueGrowth.length > 0) {
    averageGrowth = revenueGrowth.reduce((a, b) => a + b, 0) / revenueGrowth.length
    const variance = revenueGrowth.reduce((sum, g) => sum + Math.pow(g - averageGrowth, 2), 0) / revenueGrowth.length
    volatility = Math.sqrt(variance)
    lastYearGrowth = revenueGrowth[revenueGrowth.length - 1] || 0
  }
  
  // Bestäm trend
  let recentTrend: 'improving' | 'declining' | 'stable' = 'stable'
  if (revenueGrowth.length >= 2) {
    const recentGrowth = revenueGrowth.slice(-2)
    const recentAvg = recentGrowth.reduce((a, b) => a + b, 0) / recentGrowth.length
    const olderAvg = revenueGrowth.slice(0, -2).reduce((a, b) => a + b, 0) / Math.max(1, revenueGrowth.length - 2)
    
    if (recentAvg > olderAvg + 5) recentTrend = 'improving'
    else if (recentAvg < olderAvg - 5) recentTrend = 'declining'
  } else if (revenueGrowth.length === 1) {
    // Bara ett år av tillväxtdata
    if (revenueGrowth[0] > 10) recentTrend = 'improving'
    else if (revenueGrowth[0] < -5) recentTrend = 'declining'
  }
  
  return {
    revenueGrowth,
    marginTrend,
    volatility,
    recentTrend,
    averageGrowth,
    lastYearGrowth
  }
}

/**
 * Beräknar Enterprise Value vs Equity Value baserat på skulder och kassa
 */
export function calculateDebtAdjustments(
  equityValue: number,
  totalDebt: number | null | undefined,
  cash: number | null | undefined,
  ebitda: number | null
): DebtAnalysis {
  const debt = totalDebt || 0
  const cashAmount = cash || 0
  const netDebt = debt - cashAmount
  
  // Enterprise Value = Equity Value + Net Debt
  const enterpriseValue = equityValue + netDebt
  
  // Beräkna debt-to-EBITDA ratio om EBITDA finns
  let debtToEBITDA: number | null = null
  if (ebitda && ebitda > 0) {
    debtToEBITDA = debt / ebitda
  }
  
  return {
    totalDebt: debt,
    cash: cashAmount,
    netDebt,
    enterpriseValue,
    equityValue,
    debtToEBITDA
  }
}

/**
 * Beräknar Working Capital från balansräkningsdata
 */
export function calculateWorkingCapital(
  receivables: number | null | undefined,
  inventory: number | null | undefined,
  payables: number | null | undefined
): WorkingCapitalAnalysis {
  const rec = receivables || 0
  const inv = inventory || 0
  const pay = payables || 0
  
  const netWorkingCapital = rec + inv - pay
  
  return {
    receivables: rec,
    inventory: inv,
    payables: pay,
    netWorkingCapital,
    workingCapitalRequirement: netWorkingCapital, // Samma som net WC
    wcAsPercentOfRevenue: 0 // Beräknas senare när vi har revenue
  }
}

/**
 * Beräknar Working Capital Requirement som % av omsättning (branschspecifikt)
 */
export function calculateWorkingCapitalRequirement(
  revenue: number,
  industry: string
): number {
  // Working capital som % av omsättning (branschspecifikt)
  const wcPercentages: Record<string, number> = {
    retail: 0.15,      // 15% av omsättning
    manufacturing: 0.20,
    ecommerce: 0.10,
    services: 0.05,
    consulting: 0.03,
    tech: 0.05,
    restaurant: 0.08,
    construction: 0.12,
    healthcare: 0.10,
  }
  
  const wcPercent = wcPercentages[industry] || 0.10
  return revenue * wcPercent
}

/**
 * Hämtar senaste årsredovisningens balansräkningsdata från enriched data
 */
export function extractBalanceSheetData(enrichedData: any): {
  totalAssets?: number
  totalLiabilities?: number
  equity?: number
  cash?: number
  accountsReceivable?: number
  inventory?: number
  accountsPayable?: number
  shortTermDebt?: number
  longTermDebt?: number
} {
  if (!enrichedData?.rawData?.bolagsverketData?.annualReports) {
    return {}
  }
  
  const reports = enrichedData.rawData.bolagsverketData.annualReports
  const latestReport = reports
    .filter((r: any) => r.year)
    .sort((a: any, b: any) => parseInt(b.year) - parseInt(a.year))[0]
  
  if (!latestReport) return {}
  
  return {
    equity: latestReport.equity,
    // Notera: Bolagsverkets API kan ha begränsad balansräkningsdata
    // Dessa fält kan behöva hämtas från PDF-parsing eller andra källor
    totalAssets: latestReport.totalAssets,
    totalLiabilities: latestReport.totalLiabilities,
    cash: latestReport.cash,
    accountsReceivable: latestReport.accountsReceivable,
    inventory: latestReport.inventory,
    accountsPayable: latestReport.accountsPayable,
    shortTermDebt: latestReport.shortTermDebt,
    longTermDebt: latestReport.longTermDebt,
  }
}

/**
 * Beräknar total skuld från balansräkningsdata
 */
export function calculateTotalDebt(
  shortTermDebt: number | null | undefined,
  longTermDebt: number | null | undefined,
  totalLiabilities: number | null | undefined
): number {
  if (shortTermDebt !== undefined && longTermDebt !== undefined) {
    return (shortTermDebt || 0) + (longTermDebt || 0)
  }
  
  // Om vi bara har totala skulder, använd det (men det inkluderar också leverantörsskulder)
  // För enkelhetens skull antar vi att 30% är räntebärande skulder
  if (totalLiabilities !== undefined && totalLiabilities !== null) {
    return totalLiabilities * 0.3 // Konservativ uppskattning
  }
  
  return 0
}

