type FreeValuationData = Record<string, any>

const numericClean = (value: any) => {
  if (value === null || value === undefined) return ''
  const num = parseFloat(String(value).replace(/[^0-9,\.\-]/g, '').replace(',', '.'))
  return Number.isFinite(num) ? num.toString() : String(value)
}

const appendText = (existing: string | undefined, addition: string) => {
  if (!addition) return existing
  return existing ? `${existing}\n${addition}` : addition
}

const joinBullets = (items?: string[]) => {
  if (!items || items.length === 0) return ''
  return items.filter(Boolean).map(item => `• ${item}`).join('\n')
}

export function mapFreeValuationToPremium(data?: FreeValuationData) {
  if (!data) return {}

  const mapped: Record<string, string> = {}

  const copy = (source: string, target: string, formatter: (value: any) => string = (v) => String(v)) => {
    if (data[source]) {
      mapped[target] = formatter(data[source])
    }
  }

  // Direkt mappning av gemensamma numeriska fält
  copy('orgNumber', 'registrationNumber')
  copy('revenue', 'revenue2023', numericClean)
  copy('ebitda', 'ebitda2023', numericClean)
  copy('recurringRevenuePercentage', 'recurringRevenue', numericClean)
  copy('salaries', 'personnelCosts', numericClean)
  copy('rentCosts', 'rentCosts', numericClean)
  copy('marketingCosts', 'marketingCosts', numericClean)
  copy('cogs', 'cogs', numericClean)
  copy('accountsReceivable', 'accountsReceivable', numericClean)
  copy('inventory', 'inventory', numericClean)
  copy('customerChurnRate', 'customerChurn', numericClean)
  copy('marketShare', 'marketShare', numericClean)
  copy('employees', 'employeeCount', numericClean)
  copy('averageCustomerValue', 'arpu', numericClean)

  // Härled vinst om möjligt
  if (!mapped.netProfit2023 && data.revenue && data.profitMargin) {
    const netProfit =
      parseFloat(numericClean(data.revenue)) *
      (parseFloat(numericClean(data.profitMargin)) / 100)
    if (Number.isFinite(netProfit)) {
      mapped.netProfit2023 = netProfit.toString()
    }
  }

  // Textfält som kan återanvändas
  if (data.customerCount) {
    mapped.customerSegments = `Totalt antal kunder (från snabbvärderingen): ${data.customerCount}`
  }

  if (data.paymentTerms) {
    mapped.standardTerms = appendText(mapped.standardTerms, `Betalningsvillkor: ${data.paymentTerms}`)
  }

  if (data.contractLength) {
    mapped.standardTerms = appendText(mapped.standardTerms, `Genomsnittlig kontraktslängd: ${data.contractLength}`)
  }

  copy('customerConcentrationRisk', 'top10Customers')
  copy('mainCompetitors', 'competitors')
  copy('competitiveAdvantages', 'entryBarriers')
  copy('geographicReach', 'salesChannels')
  copy('keyEmployeeDependency', 'keyPersonnel')
  copy('ownerInvolvement', 'ownershipStructure')
  copy('majorRisks', 'riskRegister')
  copy('regulatoryLicenses', 'industryRegulations')
  copy('growthPotential', 'growthDrivers')
  copy('expansionPlans', 'integrationTimeline')
  copy('investmentNeeds', 'capexNeeds')
  copy('exitStrategy', 'exitPlans')
  copy('marketSize', 'marketTerms')

  if (data.companyAge) {
    mapped.companyHistory = appendText(
      mapped.companyHistory,
      `Bolaget uppskattas vara cirka ${data.companyAge} år enligt snabbvärderingen.`
    )
  }

  if (data.customerChurnRate && !mapped.customerChurn) {
    mapped.customerChurn = numericClean(data.customerChurnRate)
  }

  if (data.customerConcentrationRisk && !mapped.top10Customers) {
    mapped.top10Customers = data.customerConcentrationRisk
  }

  return mapped
}

export function mapWebInsightsToPremium(insights?: any) {
  if (!insights) return {}

  const mapped: Record<string, string> = {}
  const profile = insights.companyProfile || {}

  if (profile.description) {
    mapped.companyHistory = appendText(mapped.companyHistory, profile.description)
  }
  if (profile.industry) {
    mapped.industryCompliance = appendText(mapped.industryCompliance, profile.industry)
  }
  if (profile.customers) {
    mapped.customerSegments = appendText(mapped.customerSegments, profile.customers)
  }
  if (profile.valueProp) {
    mapped.productPortfolio = appendText(mapped.productPortfolio, profile.valueProp)
  }
  if (profile.locations?.length) {
    const list = joinBullets(profile.locations)
    mapped.salesChannels = appendText(mapped.salesChannels, `Primära geografier:\n${list}`)
  }
  if (profile.estimatedEmployees) {
    mapped.employeeCount = numericClean(profile.estimatedEmployees)
  }

  if (insights.marketSignals?.length) {
    const list = joinBullets(insights.marketSignals)
    mapped.marketRisks = appendText(mapped.marketRisks, list)
  }

  if (insights.growthNotes?.length) {
    const list = joinBullets(insights.growthNotes)
    mapped.growthDrivers = appendText(mapped.growthDrivers, list)
  }

  if (insights.riskNotes?.length) {
    const list = joinBullets(insights.riskNotes)
    mapped.riskRegister = appendText(mapped.riskRegister, list)
  }

  if (insights.notableActivities?.length) {
    const list = joinBullets(insights.notableActivities)
    mapped.companyHistory = appendText(mapped.companyHistory, list)
  }

  if (insights.sources?.length) {
    const sourceList = insights.sources
      .filter((s: any) => s?.title && s?.url)
      .map((s: any) => `• ${s.title} (${s.url})`)
      .join('\n')
    if (sourceList) {
      mapped.missingDocuments = appendText(
        mapped.missingDocuments,
        `Automatiskt insamlade källor:\n${sourceList}`
      )
    }
  }

  return mapped
}

