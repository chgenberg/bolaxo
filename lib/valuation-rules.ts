/**
 * Conditional AI prompts and validation rules for valuations
 * Builds smart warnings and adjustments based on user input
 */

interface ValidationResult {
  isValid: boolean
  warnings: string[]
  criticalIssues: string[]
  adjustments: string[]
}

interface ConditionalPrompt {
  warnings: string[]
  adjustments: string[]
  criticalFlags: string[]
}

/**
 * Validates valuation data and returns warnings
 */
export function validateValuationData(data: any): ValidationResult {
  const warnings: string[] = []
  const criticalIssues: string[] = []
  
  // UNIVERSAL VALIDATIONS
  
  // 1. Gross Margin validation
  if (data.grossMargin) {
    const grossMargin = Number(data.grossMargin)
    const industryMinMargins: Record<string, number> = {
      ecommerce: 30,
      saas: 70,
      tech: 60,
      consulting: 40,
      services: 40,
      retail: 25,
      restaurant: 60, // Food cost should be 28-35%, so gross margin 65-72%
      manufacturing: 30,
    }
    
    const minMargin = industryMinMargins[data.industry] || 30
    
    if (grossMargin < minMargin) {
      warnings.push(`Gross margin ${grossMargin}% är LÅG för ${data.industry}. Branschnorm: ${minMargin}%+. Kontrollera siffrorna!`)
    }
    
    if (grossMargin > 90) {
      warnings.push(`Gross margin ${grossMargin}% verkar MYCKET HÖG. Är detta hållbart?`)
    }
    
    if (grossMargin < 10) {
      criticalIssues.push(`KRITISKT: Gross margin under 10% - mycket svårt att driva lönsamt`)
    }
  }
  
  // 2. Customer Concentration Risk
  if (data.customerConcentrationRisk === 'high') {
    criticalIssues.push('HÖGRISK: >50% från en kund - extremt sårbart för förlust')
  } else if (data.customerConcentrationRisk === 'medium') {
    warnings.push('Kundkoncentration 30-50% - betydande risk')
  }
  
  // 3. Debt validation
  if (data.totalDebt && data.exactRevenue) {
    const debtToRevenue = Number(data.totalDebt) / Number(data.exactRevenue)
    if (debtToRevenue > 2) {
      criticalIssues.push(`KRITISKT: Skuldsättning ${(debtToRevenue * 100).toFixed(0)}% av omsättning - mycket hög`)
    } else if (debtToRevenue > 1) {
      warnings.push(`Skuldsättning över 100% av omsättning - högt belånad`)
    }
  }
  
  // 4. Regulatory Risk
  if (data.regulatoryLicenses === 'at_risk') {
    criticalIssues.push('KRITISKT: Risk att förlora licens - kan göra verksamheten värdelös')
  } else if (data.regulatoryLicenses === 'complex') {
    warnings.push('Komplexa tillstånd - regulatorisk risk påverkar värdering')
  }
  
  // 5. Working Capital
  if (data.paymentTerms && Number(data.paymentTerms) > 60) {
    warnings.push(`Långa betaltider (${data.paymentTerms} dagar) - binder mycket kapital`)
  }
  
  return {
    isValid: criticalIssues.length === 0,
    warnings,
    criticalIssues,
    adjustments: [],
  }
}

/**
 * Builds conditional AI prompts based on data patterns
 */
export function buildConditionalPrompts(data: any): ConditionalPrompt {
  const warnings: string[] = []
  const adjustments: string[] = []
  const criticalFlags: string[] = []
  
  // E-COMMERCE SPECIFIC
  if (data.industry === 'ecommerce') {
    // CAC/LTV ratio
    if (data.customerAcquisitionCost && data.lifetimeValue) {
      const cac = Number(data.customerAcquisitionCost)
      const ltv = Number(data.lifetimeValue)
      const ratio = ltv / cac
      
      if (ratio < 3) {
        criticalFlags.push(`🚨 CRITICAL: LTV/CAC ratio ${ratio.toFixed(1)}x är OHÅLLBART (<3x). Detta företag förbränner cash!`)
        adjustments.push('Sänk multipel med 30-40% pga ohållbar CAC-ekonomi')
      } else if (ratio > 5) {
        adjustments.push(`✓ EXCELLENT: LTV/CAC ratio ${ratio.toFixed(1)}x är utmärkt (>5x). Hållbar tillväxtmaskin!`)
        adjustments.push('Höj multipel med 15-20% för excellent unit economics')
      } else {
        warnings.push(`LTV/CAC ratio ${ratio.toFixed(1)}x är acceptabelt men kan förbättras`)
      }
    }
    
    // Repeat customer rate
    if (data.repeatCustomerRate) {
      const repeat = Number(data.repeatCustomerRate)
      if (repeat < 20) {
        warnings.push(`Låg repeat rate (${repeat}%) - högt beroende av ny kundvärvning`)
        adjustments.push('Justera ned multipel 10-15% för hög churn')
      } else if (repeat > 50) {
        adjustments.push(`✓ Hög repeat rate (${repeat}%) - stark kundlojalitet`)
        adjustments.push('Kan motivera 10-15% högre multipel')
      }
    }
    
    // Supplier dependency
    if (data.supplierDependency === 'high') {
      warnings.push('Hög leverantörsberoende (>70% från en) - supply chain risk')
      adjustments.push('Sänk multipel 10% för leverantörsrisk')
    }
    
    // Seasonality
    if (data.seasonality === 'high') {
      warnings.push('Hög säsongsvariering (>60% i en säsong) - working capital utmaning')
      adjustments.push('Sänk multipel 5-10% för säsongsrisk')
    }
  }
  
  // SAAS/TECH SPECIFIC
  if (data.industry === 'tech' || data.businessModel === 'saas') {
    // MRR/ARR analysis
    if (data.monthlyRecurringRevenue && data.exactRevenue) {
      const mrr = Number(data.monthlyRecurringRevenue)
      const arr = mrr * 12
      const totalRevenue = Number(data.exactRevenue)
      const recurringPercent = (arr / totalRevenue) * 100
      
      if (recurringPercent > 80) {
        adjustments.push(`✓ EXCELLENT: ${recurringPercent.toFixed(0)}% recurring revenue - ren SaaS-modell`)
        adjustments.push('Använd SaaS-multiplar (6-12x) istället för standard tech (4-8x)')
      } else if (recurringPercent < 50) {
        warnings.push(`Endast ${recurringPercent.toFixed(0)}% recurring - inte ren SaaS`)
        adjustments.push('Använd lägre multiplar (3-5x) för hybrid-modell')
      }
    }
    
    // Churn analysis
    if (data.customerChurn) {
      const churn = Number(data.customerChurn)
      if (churn > 10) {
        criticalFlags.push(`🚨 CRITICAL: ${churn}% årlig churn är MYCKET HÖG för SaaS (target <5%)`)
        adjustments.push('Sänk multipel med 30-50% pga hög churn - produkt-market fit problem')
      } else if (churn < 5) {
        adjustments.push(`✓ EXCELLENT: ${churn}% churn är excellent för SaaS`)
        adjustments.push('Kan motivera 20-30% högre multipel')
      }
    }
    
    // Net Revenue Retention
    if (data.netRevenueRetention) {
      const nrr = Number(data.netRevenueRetention)
      if (nrr > 110) {
        adjustments.push(`✓ OUTSTANDING: ${nrr}% NRR - negativt churn med expansion!`)
        adjustments.push('Premium multipel motiverad (8-12x) - bästa-i-klassen SaaS')
      } else if (nrr < 90) {
        warnings.push(`Låg NRR (${nrr}%) - kunder minskar spenderingen`)
        adjustments.push('Sänk multipel 15-25%')
      }
    }
    
    // CAC Payback
    if (data.cacPaybackMonths) {
      const payback = Number(data.cacPaybackMonths)
      if (payback > 18) {
        warnings.push(`CAC payback ${payback} mån är långt (target <12). Cash-intensiv tillväxt`)
        adjustments.push('Sänk multipel 10% för lång payback')
      } else if (payback < 6) {
        adjustments.push(`✓ EXCELLENT: CAC payback ${payback} mån - snabb kapitalomsättning`)
      }
    }
  }
  
  // RESTAURANT SPECIFIC
  if (data.industry === 'restaurant') {
    // Food cost
    if (data.foodCostPercentage) {
      const foodCost = Number(data.foodCostPercentage)
      if (foodCost > 38) {
        warnings.push(`Hög food cost (${foodCost}%) - bör vara 28-35%. Prispress eller ineffektivitet?`)
        adjustments.push('Justera ned 10-15% för dålig marginalkontroll')
      } else if (foodCost < 25) {
        adjustments.push(`✓ Utmärkt food cost (${foodCost}%) - stark marginal`)
      }
    }
    
    // Labor cost
    if (data.laborCostPercentage) {
      const laborCost = Number(data.laborCostPercentage)
      if (laborCost > 38) {
        warnings.push(`Hög lönekostnad (${laborCost}%) - bör vara 25-35%`)
      }
    }
    
    // Combined (food + labor should be <70%)
    if (data.foodCostPercentage && data.laborCostPercentage) {
      const total = Number(data.foodCostPercentage) + Number(data.laborCostPercentage)
      if (total > 70) {
        criticalFlags.push(`🚨 CRITICAL: Food + Labor = ${total}% (bör vara <65%). Svårt att gå med vinst!`)
        adjustments.push('Sänk multipel kraftigt (30-40%) - dålig kostnadsstruktur')
      }
    }
    
    // Rent validation
    if (data.locationRent && data.exactRevenue) {
      const annualRent = Number(data.locationRent) * 12
      const revenue = Number(data.exactRevenue)
      const rentPercent = (annualRent / revenue) * 100
      
      if (rentPercent > 12) {
        warnings.push(`Hyra är ${rentPercent.toFixed(1)}% av omsättning (bör vara <10%)`)
        adjustments.push('Hög lokalkostnad minskar lönsamhet')
      }
    }
  }
  
  // CONSULTING/SERVICES SPECIFIC
  if (data.industry === 'consulting' || data.industry === 'services') {
    // Utilization rate
    if (data.utilizationRate) {
      const util = Number(data.utilizationRate)
      if (util < 60) {
        warnings.push(`Låg debiteringsgrad (${util}%) - bör vara 70%+`)
        adjustments.push('Sänk multipel 15-20% för låg utnyttjandegrad')
      } else if (util > 85) {
        adjustments.push(`✓ Hög debiteringsgrad (${util}%) - effektiv verksamhet`)
      }
    }
    
    // Contract renewal
    if (data.contractRenewalRate) {
      const renewal = Number(data.contractRenewalRate)
      if (renewal < 70) {
        warnings.push(`Låg förnyelserate (${renewal}%) - kunderna stannar inte kvar`)
        adjustments.push('Sänk multipel 10-15% för låg retention')
      } else if (renewal > 90) {
        adjustments.push(`✓ EXCELLENT: ${renewal}% förnyelserate - stark kundlojalitet`)
        adjustments.push('Höj multipel 10-15%')
      }
    }
  }
  
  // MANUFACTURING SPECIFIC
  if (data.industry === 'manufacturing') {
    // Capacity utilization
    if (data.productionCapacity) {
      const capacity = Number(data.productionCapacity)
      if (capacity < 50) {
        warnings.push(`Lågt kapacitetsutnyttjande (${capacity}%) - outnyttjad potential eller svag efterfrågan`)
        adjustments.push('Sänk multipel 15-20%')
      } else if (capacity > 95) {
        warnings.push(`Mycket högt kapacitetsutnyttjande (${capacity}%) - svårt att växa utan investeringar`)
        adjustments.push('Justera för expansion-capex behov')
      } else if (capacity >= 70 && capacity <= 85) {
        adjustments.push(`✓ Optimalt kapacitetsutnyttjande (${capacity}%)`)
      }
    }
    
    // Customer concentration
    if (data.customerConcentration === 'yes') {
      criticalFlags.push('🚨 HÖGRISK: >30% från en kund i manufacturing - mycket sårbart')
      adjustments.push('Sänk multipel med 25-35% för kundkoncentration')
    }
    
    // Order backlog
    if (data.orderBacklog) {
      const backlog = Number(data.orderBacklog)
      if (backlog < 3) {
        warnings.push(`Kort orderstock (${backlog} mån) - osäker framtid`)
      } else if (backlog > 12) {
        adjustments.push(`✓ Lång orderstock (${backlog} mån) - mycket förutsägbart`)
        adjustments.push('Höj multipel 10-15%')
      }
    }
  }
  
  // CONSTRUCTION SPECIFIC
  if (data.industry === 'construction') {
    // Project margin
    if (data.projectMargin) {
      const margin = Number(data.projectMargin)
      if (margin < 5) {
        warnings.push(`Låg projektmarginal (${margin}%) - typiskt är 8-15%`)
        adjustments.push('Låg lönsamhet påverkar värdering negativt')
      } else if (margin > 20) {
        warnings.push(`Mycket hög projektmarginal (${margin}%) - är detta hållbart?`)
      }
    }
    
    // Contract type risk
    if (data.contractType === 'fixed') {
      warnings.push('Fastprisavtal har högre risk för överkostand - påverkar stabilitet')
      adjustments.push('Justera för projektrisk i fastprisavtal')
    }
  }
  
  // RETAIL SPECIFIC  
  if (data.industry === 'retail') {
    // Inventory turnover
    if (data.inventoryTurnover) {
      const turnover = Number(data.inventoryTurnover)
      if (turnover < 4) {
        warnings.push(`Låg lageromsättning (${turnover}x/år) - binder mycket kapital`)
        adjustments.push('Justera för högt working capital behov')
      } else if (turnover > 12) {
        adjustments.push(`✓ Hög lageromsättning (${turnover}x/år) - effektiv lagerhantering`)
      }
    }
    
    // Lease risk
    if (data.leaseLength) {
      const lease = Number(data.leaseLength)
      if (lease < 2) {
        warnings.push(`Kort hyresavtal (${lease} år kvar) - risk för ökad hyra eller flyttkrav`)
        adjustments.push('Sänk multipel 10-15% för hyresrisk')
      } else if (lease > 5) {
        adjustments.push(`✓ Långt hyresavtal (${lease} år) - stabilitet`)
      }
    }
  }
  
  return {
    warnings,
    adjustments,
    criticalFlags,
  }
}

/**
 * Builds industry-specific AI instructions
 */
export function getIndustrySpecificInstructions(data: any): string {
  let instructions = '\n\n**BRANSCHSPECIFIKA VÄRDERINGSREGLER:**\n'
  
  switch (data.industry) {
    case 'ecommerce':
      instructions += `
E-HANDEL SPECIFIKT:
- Använd EV/Revenue multipel OM EBITDA negativ eller <5%
- LTV/CAC ratio MÅSTE vara >3x för hållbarhet (optimal >5x)
- Repeat customer rate >40% = excellent retention
- CAC payback <12 mån = bra, <6 mån = excellent
- Trustpilot score viktigt: 4.5+ med 100+ reviews = +15% multipel
- Gross margin för e-handel: 40-60% bra, <30% problem
- Säsongsvariationer: Höga (>60% Q4) = working capital risk

JUSTERING:
- Supplier dependency high: -10% multipel
- Seasonality high: -5-10% multipel
- LTV/CAC <3: -30-40% multipel (kritiskt)
- Repeat customers >50%: +10-15% multipel
`
      break
      
    case 'tech':
      if (data.businessModel === 'saas') {
        instructions += `
SAAS SPECIFIKT:
- ANVÄND ARR-MULTIPLAR istället för EBITDA om recurring >80%
- Typiska ARR-multiplar: 3-8x ARR (beroende på tillväxt & churn)
- NRR (Net Revenue Retention) KRITISKT:
  * >110% = excellent (negativt churn) → 8-12x multipel
  * 90-110% = bra → 4-7x multipel  
  * <90% = problem → 2-4x multipel
- Churn <5% = excellent, >10% = röd flagg
- CAC payback <12 mån = bra, <6 mån = excellent
- Rule of 40: (Growth % + Profit margin %) should be >40%

JUSTERING:
- NRR >110%: +30-50% högre multipel
- Churn >10%: -40-50% multipel (kritiskt)
- Recurring <50%: Använd standard tech multiplar (inte SaaS)
- CAC payback >18 mån: -15% multipel
`
      } else {
        instructions += `
TECH (NON-SAAS) SPECIFIKT:
- Använd EBITDA-multiplar: 4-8x
- Scalability viktigt: High = +20%, Low = -15%
- IP Rights: Patent/unik IP = +25-40% multipel
- Recurring revenue >50% = +15% multipel
`
      }
      break
      
    case 'consulting':
    case 'services':
      instructions += `
KONSULT/TJÄNSTER SPECIFIKT:
- Debiteringsgrad target: 70-80% (excellent >80%)
- Förnyelserate critical: >85% = excellent, <70% = problem
- Key person dependency HIGH = -25-35% multipel
- Gross margin per konsult: 50%+ excellent
- Kund-diversifiering: >20 aktiva kunder = bra

JUSTERING:
- Utilization <60%: -20% multipel
- Renewal rate <70%: -15% multipel
- Renewal rate >90%: +15% multipel
- Key person high + <5 anställda: -30-40% multipel (kritiskt)
`
      break
      
    case 'manufacturing':
      instructions += `
TILLVERKNING SPECIFIKT:
- Kapacitetsutnyttjande optimalt: 70-85%
- Kundkoncentration >30% = -25-35% multipel (kritiskt)
- Långtidskontrakt >60% = +15% multipel
- Orderstock >6 mån = +10-15% multipel
- Equipment value läggs till EV (tangible assets)

JUSTERING:
- Capacity <50%: -20% multipel
- Capacity >95%: Justera för capex-behov
- Customer concentration high: -30% multipel
- Supplier concentration high: -15% multipel
`
      break
      
    case 'restaurant':
      instructions += `
RESTAURANG SPECIFIKT:
- Food cost target: 28-35% (lägre = bättre)
- Labor cost target: 25-35%
- TOTAL operating costs bör vara <65% (food+labor+rent)
- Rent bör vara <10% av revenue
- EBITDA-multiplar: 2.5-4x (lägre än andra branscher)
- Serveringstillstånd FULL = +15-20% värde

JUSTERING:
- Food + Labor >70%: -30-40% multipel (ohållbart)
- Rent >12% revenue: -10-15% multipel
- Liquor license none: -15-20% (begränsat)
- Table turnover <1.5: -10% (ineffektivt)
- Lease <2 år: -15% (hyresrisk)
`
      break
      
    case 'retail':
      instructions += `
RETAIL SPECIFIKT:
- Inventory turnover kritiskt: >8x/år excellent, <4x problem
- Same-store sales growth viktigt (ej bara öppna fler butiker)
- Lease length >5 år = +10% multipel
- Prime location = +15-20% multipel
- Inventory value stor = working capital behov

JUSTERING:
- Lease <2 år: -15% (hyresrisk)
- Inventory turnover <4: -10% (binder cash)
- Competition high + location average: -15%
`
      break
      
    case 'construction':
      instructions += `
BYGG SPECIFIKT:
- Orderstock target: 6-12 månader framåt
- Projektmarginal typiskt: 8-15%
- Fixed-price contracts = högre risk än time & material
- Certifieringar (ISO) = +10-15% multipel
- Working capital ofta negativt (bra!) om kunder betalar snabbt

JUSTERING:
- Backlog <3 mån: -20% (osäker framtid)
- Backlog >12 mån: +15% (mycket säkert)
- Fixed-price dominant: -10% (projektrisk)
- No certifications: -5-10%
`
      break
  }
  
  return instructions
}

/**
 * Validates data combinations that don't make sense
 */
export function validateDataCombinations(data: any): string[] {
  const errors: string[] = []
  
  // Check gross margin vs EBITDA margin
  if (data.grossMargin && data.exactRevenue && data.operatingCosts) {
    const grossMargin = Number(data.grossMargin)
    const ebitda = Number(data.exactRevenue) - Number(data.operatingCosts)
    const ebitdaMargin = (ebitda / Number(data.exactRevenue)) * 100
    
    if (grossMargin < ebitdaMargin) {
      errors.push(`ILLOGISKT: Gross margin (${grossMargin}%) kan inte vara lägre än EBITDA margin (${ebitdaMargin.toFixed(1)}%). Kontrollera siffrorna!`)
    }
  }
  
  // Check CAC vs LTV
  if (data.customerAcquisitionCost && data.lifetimeValue) {
    const cac = Number(data.customerAcquisitionCost)
    const ltv = Number(data.lifetimeValue)
    
    if (ltv < cac) {
      errors.push(`ILLOGISKT: LTV (${ltv} kr) är lägre än CAC (${cac} kr). Företaget förlorar pengar på varje kund!`)
    }
  }
  
  // Check MRR vs total revenue
  if (data.monthlyRecurringRevenue && data.exactRevenue) {
    const mrr = Number(data.monthlyRecurringRevenue)
    const arr = mrr * 12
    const total = Number(data.exactRevenue)
    
    if (arr > total * 1.1) {
      errors.push(`ILLOGISKT: ARR (${arr.toLocaleString()}) är högre än total årsomsättning (${total.toLocaleString()}). Kontrollera MRR!`)
    }
  }
  
  // Check debt vs equity
  if (data.totalDebt && data.exactRevenue && data.operatingCosts) {
    const debt = Number(data.totalDebt)
    const ebitda = Number(data.exactRevenue) - Number(data.operatingCosts)
    
    if (debt > ebitda * 10 && ebitda > 0) {
      errors.push(`VARNING: Skuld är ${(debt/ebitda).toFixed(0)}x EBITDA (mycket högt). Är företaget overleveraged?`)
    }
  }
  
  // Check food + labor cost for restaurants
  if (data.industry === 'restaurant' && data.foodCostPercentage && data.laborCostPercentage) {
    const total = Number(data.foodCostPercentage) + Number(data.laborCostPercentage)
    if (total > 75) {
      errors.push(`KRITISKT: Food cost + Labor cost = ${total}% (bör vara <65%). Omöjligt att gå med vinst!`)
    }
  }
  
  return errors
}

