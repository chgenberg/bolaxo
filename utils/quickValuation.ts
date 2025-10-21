// Snabb värderingskalkylator för live-preview i wizard

export function calculateQuickValuation(
  revenueRange: string,
  profitMarginRange: string,
  industry: string
): string {
  // Parse revenue till MSEK
  const revenue = parseRevenueRange(revenueRange)
  
  // Parse marginal till decimal
  const marginPercent = parseProfitMargin(profitMarginRange)
  
  // Beräkna EBITDA
  const ebitda = revenue * marginPercent
  
  // Hämta EBITDA-multipel för branschen
  const multiple = getQuickMultiple(industry, marginPercent)
  
  // Beräkna värde
  const value = ebitda * multiple
  
  // Formatera
  if (value < 1) {
    return `${(value * 1000).toFixed(0)} tkr`
  } else {
    return `${value.toFixed(1)} MSEK`
  }
}

function parseRevenueRange(range: string): number {
  const ranges: Record<string, number> = {
    '0-1': 0.5,
    '1-5': 3,
    '5-10': 7.5,
    '10-20': 15,
    '20-50': 35,
    '50+': 75,
  }
  return ranges[range] || 5
}

function parseProfitMargin(margin: string): number {
  const margins: Record<string, number> = {
    'negative': -0.05,
    '0-5': 0.025,
    '5-10': 0.075,
    '10-20': 0.15,
    '20+': 0.25,
  }
  return margins[margin] || 0.10
}

function getQuickMultiple(industry: string, marginPercent: number): number {
  const baseMultiples: Record<string, number> = {
    tech: 6.0,
    ecommerce: 3.5,
    saas: 7.0,
    consulting: 4.5,
    manufacturing: 5.5,
    retail: 4.0,
    restaurant: 3.0,
    services: 4.5,
    construction: 5.0,
  }
  
  let multiple = baseMultiples[industry] || 4.0
  
  // Justera för marginal
  if (marginPercent > 0.18) multiple *= 1.1
  if (marginPercent < 0.08) multiple *= 0.9
  if (marginPercent < 0) multiple = 0.3 // Förlustbolag värderas på revenue
  
  return multiple
}

// Färgkodning för live-preview
export function getValuationColor(value: number): string {
  if (value < 1000000) return 'text-gray-600' // < 1M
  if (value < 5000000) return 'text-blue-600'  // 1-5M
  if (value < 10000000) return 'text-primary-blue' // 5-10M
  return 'text-green-600' // 10M+
}

// Beräkna procentuell förändring när användaren fyller i mer
export function calculateValueChange(
  baseValue: number,
  newRevenue?: string,
  newMargin?: string,
  industry?: string
): { newValue: number; percentChange: number } {
  if (!newRevenue || !newMargin || !industry) {
    return { newValue: baseValue, percentChange: 0 }
  }
  
  const revenue = parseRevenueRange(newRevenue)
  const margin = parseProfitMargin(newMargin)
  const ebitda = revenue * margin
  const multiple = getQuickMultiple(industry, margin)
  const newValue = ebitda * multiple * 1000000
  
  const percentChange = ((newValue - baseValue) / baseValue) * 100
  
  return { newValue, percentChange }
}

