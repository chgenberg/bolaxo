// Industry-specific questions for all 20 industries
// Each industry has customized questions for all 8 steps

export interface IndustryQuestion {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'currency' | 'percent'
  placeholder?: string
  helpText?: string
  tooltip?: string
  options?: { value: string; label: string }[]
  required?: boolean
}

export interface IndustryStepQuestions {
  step2?: IndustryQuestion[]  // Finansiell information
  step3?: IndustryQuestion[]  // Kostnadsstruktur
  step4?: IndustryQuestion[]  // Tillgångar & Skulder
  step5?: IndustryQuestion[]  // Kundbas & Affärsmodell
  step6?: IndustryQuestion[]  // Marknadsposition
  step7?: IndustryQuestion[]  // Organisation & Risker
  step8?: IndustryQuestion[]  // Framtidsutsikter
}

// ========================================
// IT-KONSULT & UTVECKLING
// ========================================
const itKonsultQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'hourlyRate', label: 'Genomsnittligt timpris (kr)', type: 'currency', placeholder: 'T.ex. 1200' },
    { key: 'utilizationRate', label: 'Debiteringsgrad (%)', type: 'percent', helpText: 'Andel av arbetstid som kan faktureras. 70%+ är bra.' },
  ],
  step5: [
    { key: 'consultantCount', label: 'Antal konsulter', type: 'number' },
    { key: 'avgProjectDuration', label: 'Genomsnittlig projektlängd', type: 'select', options: [
      { value: '1-3m', label: '1-3 månader' },
      { value: '3-6m', label: '3-6 månader' },
      { value: '6-12m', label: '6-12 månader' },
      { value: '12m+', label: 'Över 12 månader' }
    ]},
    { key: 'contractTypes', label: 'Vanligaste avtalstyp', type: 'select', options: [
      { value: 'time-material', label: 'Löpande räkning' },
      { value: 'fixed-price', label: 'Fastpris' },
      { value: 'retainer', label: 'Månadsavtal' },
      { value: 'mixed', label: 'Blandad' }
    ]},
  ],
  step6: [
    { key: 'techSpecialization', label: 'Teknisk specialisering', type: 'textarea', placeholder: 'T.ex. .NET, React, AWS, SAP' },
    { key: 'certifications', label: 'Certifieringar', type: 'textarea', placeholder: 'T.ex. Microsoft Partner, AWS Certified' },
  ],
  step7: [
    { key: 'seniorRatio', label: 'Andel seniora konsulter (%)', type: 'percent' },
    { key: 'subcontractorShare', label: 'Andel underkonsulter (%)', type: 'percent' },
  ],
}

// ========================================
// E-HANDEL / D2C
// ========================================
const ehandelQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'monthlyVisitors', label: 'Besökare per månad', type: 'number', placeholder: 'T.ex. 50000' },
    { key: 'conversionRate', label: 'Konverteringsgrad (%)', type: 'percent', helpText: 'Andel besökare som köper' },
    { key: 'avgOrderValue', label: 'Genomsnittligt ordervärde (kr)', type: 'currency' },
  ],
  step3: [
    { key: 'marketingSpend', label: 'Marknadsföringskostnad/månad (kr)', type: 'currency' },
    { key: 'shippingCosts', label: 'Fraktkostnader/månad (kr)', type: 'currency' },
    { key: 'returnsCost', label: 'Returkostnader/månad (kr)', type: 'currency' },
  ],
  step4: [
    { key: 'inventoryValue', label: 'Lagervärde (kr)', type: 'currency' },
    { key: 'inventoryTurnover', label: 'Lageromsättningshastighet', type: 'select', options: [
      { value: '2-4', label: '2-4 ggr/år' },
      { value: '4-6', label: '4-6 ggr/år' },
      { value: '6-10', label: '6-10 ggr/år' },
      { value: '10+', label: '10+ ggr/år' }
    ]},
  ],
  step5: [
    { key: 'repeatPurchaseRate', label: 'Återköpsfrekvens (%)', type: 'percent' },
    { key: 'customerAcquisitionCost', label: 'Kundanskaffningskostnad (kr)', type: 'currency' },
    { key: 'emailListSize', label: 'E-postlista (antal)', type: 'number' },
  ],
  step6: [
    { key: 'salesChannels', label: 'Försäljningskanaler', type: 'textarea', placeholder: 'T.ex. egen webshop, Amazon, CDON' },
    { key: 'returnRate', label: 'Returgrad (%)', type: 'percent' },
  ],
}

// ========================================
// SAAS & LICENSMJUKVARA
// ========================================
const saasQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'mrr', label: 'MRR - Monthly Recurring Revenue (kr)', type: 'currency', helpText: 'Månatliga återkommande intäkter' },
    { key: 'arr', label: 'ARR - Annual Recurring Revenue (kr)', type: 'currency' },
    { key: 'arpu', label: 'ARPU - Genomsnittlig intäkt per användare/månad (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'totalUsers', label: 'Antal betalande kunder', type: 'number' },
    { key: 'churnRate', label: 'Månatlig churn rate (%)', type: 'percent', helpText: 'Andel kunder som avslutar per månad' },
    { key: 'nrr', label: 'Net Revenue Retention (%)', type: 'percent', helpText: '>100% = expansion, <100% = kontraktion' },
    { key: 'ltv', label: 'LTV - Lifetime Value per kund (kr)', type: 'currency' },
    { key: 'cac', label: 'CAC - Customer Acquisition Cost (kr)', type: 'currency' },
  ],
  step6: [
    { key: 'freeTrialConversion', label: 'Trial-to-paid konvertering (%)', type: 'percent' },
    { key: 'pricingModel', label: 'Prismodell', type: 'select', options: [
      { value: 'per-user', label: 'Per användare' },
      { value: 'tiered', label: 'Nivåbaserad' },
      { value: 'usage', label: 'Förbrukningsbaserad' },
      { value: 'flat', label: 'Fast pris' }
    ]},
  ],
  step7: [
    { key: 'techStack', label: 'Teknisk stack', type: 'textarea', placeholder: 'T.ex. React, Node.js, AWS' },
    { key: 'uptime', label: 'Uptime senaste 12 mån (%)', type: 'percent' },
  ],
}

// ========================================
// BYGG & ANLÄGGNING
// ========================================
const byggQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'orderBacklog', label: 'Orderstock (kr)', type: 'currency', helpText: 'Värde av bekräftade projekt' },
    { key: 'avgProjectSize', label: 'Genomsnittlig projektstorlek (kr)', type: 'currency' },
  ],
  step3: [
    { key: 'subcontractorCosts', label: 'Underentreprenörskostnader/år (kr)', type: 'currency' },
    { key: 'materialCosts', label: 'Materialkostnader/år (kr)', type: 'currency' },
  ],
  step4: [
    { key: 'machineValue', label: 'Värde maskiner & utrustning (kr)', type: 'currency' },
    { key: 'vehicleValue', label: 'Värde fordon (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'projectCompletionRate', label: 'Projekt i tid (%)', type: 'percent' },
    { key: 'publicPrivateMix', label: 'Offentlig/privat fördelning', type: 'select', options: [
      { value: 'mostly-public', label: 'Mestadels offentliga' },
      { value: 'mixed', label: 'Blandad' },
      { value: 'mostly-private', label: 'Mestadels privata' }
    ]},
  ],
  step6: [
    { key: 'geographicReach', label: 'Geografisk räckvidd', type: 'select', options: [
      { value: 'local', label: 'Lokal (inom kommunen)' },
      { value: 'regional', label: 'Regional (inom länet)' },
      { value: 'national', label: 'Nationell' }
    ]},
    { key: 'specializations', label: 'Specialiseringar', type: 'textarea', placeholder: 'T.ex. ROT, nybyggnation, kommersiellt' },
  ],
  step7: [
    { key: 'warranties', label: 'Garantiåtaganden', type: 'textarea' },
    { key: 'insuranceCoverage', label: 'Försäkringsskydd', type: 'textarea' },
  ],
}

// ========================================
// EL, VVS & INSTALLATION
// ========================================
const elVvsQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'serviceShare', label: 'Andel serviceuppdrag (%)', type: 'percent' },
    { key: 'installationShare', label: 'Andel installationsuppdrag (%)', type: 'percent' },
  ],
  step4: [
    { key: 'toolValue', label: 'Värde verktyg & utrustning (kr)', type: 'currency' },
    { key: 'vehicleFleet', label: 'Antal servicebilar', type: 'number' },
  ],
  step5: [
    { key: 'serviceContracts', label: 'Antal aktiva serviceavtal', type: 'number' },
    { key: 'avgResponseTime', label: 'Genomsnittlig responstid', type: 'select', options: [
      { value: 'same-day', label: 'Samma dag' },
      { value: '24h', label: 'Inom 24 timmar' },
      { value: '48h', label: 'Inom 48 timmar' },
      { value: 'scheduled', label: 'Planerat besök' }
    ]},
  ],
  step7: [
    { key: 'certifications', label: 'Certifieringar & behörigheter', type: 'textarea', placeholder: 'T.ex. elinstallatörsbehörighet, VVS-certifiering' },
    { key: 'safetyRecord', label: 'Arbetsmiljöincidenter senaste 3 år', type: 'number' },
  ],
}

// ========================================
// STÄD & FACILITY SERVICES
// ========================================
const stadQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'contractValue', label: 'Totalt värde återkommande kontrakt/månad (kr)', type: 'currency' },
    { key: 'avgContractLength', label: 'Genomsnittlig avtalslängd', type: 'select', options: [
      { value: '1y', label: '1 år' },
      { value: '2y', label: '2 år' },
      { value: '3y', label: '3 år' },
      { value: '3y+', label: 'Över 3 år' }
    ]},
  ],
  step3: [
    { key: 'laborCostShare', label: 'Lönekostnader (% av omsättning)', type: 'percent' },
    { key: 'equipmentCosts', label: 'Utrustning & material/år (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'numberOfContracts', label: 'Antal aktiva kontrakt', type: 'number' },
    { key: 'contractRenewalRate', label: 'Avtalsförnyelserate (%)', type: 'percent' },
    { key: 'customerTypes', label: 'Kundtyper', type: 'select', options: [
      { value: 'residential', label: 'Privat (hemstäd)' },
      { value: 'commercial', label: 'Företag' },
      { value: 'mixed', label: 'Blandad' }
    ]},
  ],
  step7: [
    { key: 'qualityCertifications', label: 'Kvalitetscertifieringar', type: 'textarea' },
    { key: 'staffTurnover', label: 'Personalomsättning/år (%)', type: 'percent' },
  ],
}

// ========================================
// LAGER, LOGISTIK & 3PL
// ========================================
const logistikQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'warehouseSpace', label: 'Lageryta (kvm)', type: 'number' },
    { key: 'occupancyRate', label: 'Beläggningsgrad (%)', type: 'percent' },
  ],
  step4: [
    { key: 'rackingValue', label: 'Värde inredning & ställage (kr)', type: 'currency' },
    { key: 'forkliftsValue', label: 'Värde truckar & maskiner (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'pickAccuracy', label: 'Plockprecision (%)', type: 'percent' },
    { key: 'onTimeDelivery', label: 'Leverans i tid (%)', type: 'percent' },
    { key: 'avgOrdersPerDay', label: 'Ordrar per dag', type: 'number' },
  ],
  step6: [
    { key: 'wmsSystem', label: 'WMS-system', type: 'text', placeholder: 'T.ex. SAP, Ongoing, Consafe' },
    { key: 'integrations', label: 'Systemintegrationer', type: 'textarea' },
  ],
  step7: [
    { key: 'leaseTerms', label: 'Hyresvillkor lokal', type: 'textarea' },
  ],
}

// ========================================
// RESTAURANG & CAFÉ
// ========================================
const restaurangQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'seatingCapacity', label: 'Antal sittplatser', type: 'number' },
    { key: 'avgCheckSize', label: 'Genomsnittlig nota (kr)', type: 'currency' },
    { key: 'coversPerDay', label: 'Antal gäster per dag', type: 'number' },
  ],
  step3: [
    { key: 'foodCost', label: 'Råvarukostnad (% av försäljning)', type: 'percent', helpText: 'Typiskt 25-35%' },
    { key: 'beverageCost', label: 'Dryckeskostnad (% av dryckesförsäljning)', type: 'percent' },
  ],
  step5: [
    { key: 'deliveryShare', label: 'Andel take-away/delivery (%)', type: 'percent' },
    { key: 'reviewScore', label: 'Snittbetyg Google/TripAdvisor', type: 'text', placeholder: 'T.ex. 4.5/5' },
  ],
  step6: [
    { key: 'concept', label: 'Koncept/typ av restaurang', type: 'text' },
    { key: 'uniqueSellingPoints', label: 'Unika säljargument', type: 'textarea' },
  ],
  step7: [
    { key: 'liquorLicense', label: 'Alkoholtillstånd', type: 'select', options: [
      { value: 'full', label: 'Fullständiga rättigheter' },
      { value: 'beer-wine', label: 'Öl och vin' },
      { value: 'none', label: 'Inget alkoholtillstånd' }
    ]},
    { key: 'leaseRemaining', label: 'År kvar på hyresavtal', type: 'number' },
    { key: 'monthlyRent', label: 'Månadshyra (kr)', type: 'currency' },
  ],
}

// ========================================
// DETALJHANDEL (FYSISK)
// ========================================
const detaljhandelQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'storeCount', label: 'Antal butiker', type: 'number' },
    { key: 'avgTransactionSize', label: 'Genomsnittligt köp (kr)', type: 'currency' },
    { key: 'footTraffic', label: 'Besökare per dag', type: 'number' },
  ],
  step3: [
    { key: 'monthlyRent', label: 'Total månadshyra alla butiker (kr)', type: 'currency' },
    { key: 'staffCosts', label: 'Personalkostnader/månad (kr)', type: 'currency' },
  ],
  step4: [
    { key: 'inventoryValue', label: 'Lagervärde (kr)', type: 'currency' },
    { key: 'fixturesValue', label: 'Värde inredning & inventarier (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'sameStoreSalesGrowth', label: 'Butiksförsäljning tillväxt (%)', type: 'percent' },
    { key: 'loyaltyMembers', label: 'Antal medlemmar i kundklubb', type: 'number' },
  ],
  step6: [
    { key: 'storeLocations', label: 'Typ av lägen', type: 'select', options: [
      { value: 'prime', label: 'Toppläge (centrum/galleria)' },
      { value: 'good', label: 'Bra läge' },
      { value: 'average', label: 'Genomsnittligt läge' }
    ]},
    { key: 'brandStrength', label: 'Varumärkesstyrka', type: 'select', options: [
      { value: 'strong', label: 'Starkt - välkänt' },
      { value: 'medium', label: 'Medel - etablerat' },
      { value: 'weak', label: 'Svagt - nytt/okänt' }
    ]},
  ],
  step7: [
    { key: 'leaseTerms', label: 'Hyresavtalsvillkor', type: 'textarea' },
  ],
}

// ========================================
// GROSSIST / PARTIHANDEL
// ========================================
const grossistQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'avgOrderSize', label: 'Genomsnittlig orderstorlek (kr)', type: 'currency' },
    { key: 'ordersPerMonth', label: 'Ordrar per månad', type: 'number' },
  ],
  step4: [
    { key: 'inventoryValue', label: 'Lagervärde (kr)', type: 'currency' },
    { key: 'inventoryTurnover', label: 'Lageromsättningshastighet', type: 'number', helpText: 'Gånger per år' },
  ],
  step5: [
    { key: 'numberOfCustomers', label: 'Antal aktiva kunder', type: 'number' },
    { key: 'topCustomerShare', label: 'Största kundens andel (%)', type: 'percent' },
  ],
  step6: [
    { key: 'productCategories', label: 'Produktkategorier', type: 'textarea' },
    { key: 'supplierRelations', label: 'Antal leverantörer', type: 'number' },
    { key: 'exclusiveAgreements', label: 'Exklusiva avtal', type: 'textarea' },
  ],
  step7: [
    { key: 'warehouseOwnership', label: 'Äger ni lagret?', type: 'select', options: [
      { value: 'owned', label: 'Ja, ägt' },
      { value: 'leased', label: 'Nej, hyrt' },
      { value: 'mixed', label: 'Delvis' }
    ]},
  ],
}

// ========================================
// LÄTT TILLVERKNING / VERKSTAD
// ========================================
const tillverkningQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'productionCapacity', label: 'Kapacitetsutnyttjande (%)', type: 'percent' },
    { key: 'avgOrderValue', label: 'Genomsnittligt ordervärde (kr)', type: 'currency' },
  ],
  step3: [
    { key: 'materialCosts', label: 'Materialkostnader/år (kr)', type: 'currency' },
    { key: 'utilityCosts', label: 'Energikostnader/år (kr)', type: 'currency' },
  ],
  step4: [
    { key: 'machineValue', label: 'Värde maskiner & utrustning (kr)', type: 'currency' },
    { key: 'avgMachineAge', label: 'Genomsnittlig ålder maskiner (år)', type: 'number' },
  ],
  step5: [
    { key: 'customVsStandard', label: 'Kundanpassat vs standard', type: 'select', options: [
      { value: 'custom', label: 'Mestadels kundanpassat' },
      { value: 'standard', label: 'Mestadels standardprodukter' },
      { value: 'mixed', label: 'Blandad' }
    ]},
    { key: 'leadTime', label: 'Genomsnittlig leveranstid', type: 'text' },
  ],
  step6: [
    { key: 'qualityCertifications', label: 'Kvalitetscertifieringar', type: 'textarea', placeholder: 'T.ex. ISO 9001' },
    { key: 'exportShare', label: 'Exportandel (%)', type: 'percent' },
  ],
  step7: [
    { key: 'maintenanceCosts', label: 'Underhållskostnader/år (kr)', type: 'currency' },
    { key: 'environmentalPermits', label: 'Miljötillstånd', type: 'textarea' },
  ],
}

// ========================================
// FASTIGHETSSERVICE & FÖRVALTNING
// ========================================
const fastighetsQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'propertiesManaged', label: 'Antal förvaltade fastigheter', type: 'number' },
    { key: 'sqmManaged', label: 'Förvaltad yta (kvm)', type: 'number' },
    { key: 'avgFeePerProperty', label: 'Genomsnittlig avgift/fastighet/månad (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'contractRenewalRate', label: 'Avtalsförnyelserate (%)', type: 'percent' },
    { key: 'avgContractLength', label: 'Genomsnittlig avtalslängd (år)', type: 'number' },
  ],
  step6: [
    { key: 'serviceScope', label: 'Tjänsteomfång', type: 'textarea', placeholder: 'T.ex. ekonomisk förvaltning, teknisk förvaltning, uthyrning' },
    { key: 'systemsUsed', label: 'Förvaltningssystem', type: 'text' },
  ],
  step7: [
    { key: 'liabilityInsurance', label: 'Ansvarsförsäkring', type: 'textarea' },
  ],
}

// ========================================
// MARKNADSFÖRING, KOMMUNIKATION & PR
// ========================================
const marknadsforingQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'avgProjectValue', label: 'Genomsnittligt projektvärde (kr)', type: 'currency' },
    { key: 'retainerShare', label: 'Andel retainer-kunder (%)', type: 'percent' },
  ],
  step5: [
    { key: 'activeClients', label: 'Antal aktiva kunder', type: 'number' },
    { key: 'avgClientTenure', label: 'Genomsnittlig kundrelation (år)', type: 'number' },
    { key: 'topClientShare', label: 'Största kundens andel (%)', type: 'percent' },
  ],
  step6: [
    { key: 'specializations', label: 'Specialiseringar', type: 'textarea', placeholder: 'T.ex. digital marknadsföring, PR, varumärkesstrategi' },
    { key: 'awardWins', label: 'Utmärkelser', type: 'textarea' },
  ],
  step7: [
    { key: 'seniorStaffRatio', label: 'Andel seniora medarbetare (%)', type: 'percent' },
    { key: 'freelancerShare', label: 'Andel frilansare (%)', type: 'percent' },
  ],
}

// ========================================
// EKONOMITJÄNSTER & REDOVISNING
// ========================================
const ekonomiQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'monthlyClients', label: 'Antal kunder med månadsavtal', type: 'number' },
    { key: 'avgMonthlyFee', label: 'Genomsnittlig månadsavgift (kr)', type: 'currency' },
    { key: 'annualServiceRevenue', label: 'Årstjänster (bokslut, deklaration)/år (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'clientRetention', label: 'Kundbehållning (%)', type: 'percent' },
    { key: 'clientGrowth', label: 'Kundtillväxt senaste året (%)', type: 'percent' },
  ],
  step6: [
    { key: 'accountingSoftware', label: 'Bokföringssystem', type: 'text', placeholder: 'T.ex. Fortnox, Visma, Björn Lundén' },
    { key: 'authorizedAccountant', label: 'Auktoriserad redovisningskonsult?', type: 'select', options: [
      { value: 'yes', label: 'Ja' },
      { value: 'no', label: 'Nej' },
      { value: 'some', label: 'Vissa medarbetare' }
    ]},
  ],
  step7: [
    { key: 'partnerCount', label: 'Antal delägare/partners', type: 'number' },
    { key: 'professionalLiability', label: 'Ansvarsförsäkring (belopp kr)', type: 'currency' },
  ],
}

// ========================================
// HÄLSA/SKÖNHET (SALONGER, KLINIKER, SPA)
// ========================================
const halsaSkonhetQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'treatmentRooms', label: 'Antal behandlingsrum', type: 'number' },
    { key: 'avgTreatmentPrice', label: 'Genomsnittlig behandling (kr)', type: 'currency' },
    { key: 'customersPerDay', label: 'Kunder per dag', type: 'number' },
  ],
  step3: [
    { key: 'productCosts', label: 'Produktkostnader/månad (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'rebookingRate', label: 'Ombokningsfrekvens (%)', type: 'percent' },
    { key: 'membershipRevenue', label: 'Andel medlemskap/abonnemang (%)', type: 'percent' },
  ],
  step6: [
    { key: 'treatments', label: 'Behandlingar som erbjuds', type: 'textarea' },
    { key: 'premiumBrands', label: 'Premiummärken ni arbetar med', type: 'textarea' },
  ],
  step7: [
    { key: 'licenses', label: 'Licenser & tillstånd', type: 'textarea' },
    { key: 'equipmentValue', label: 'Värde utrustning (kr)', type: 'currency' },
  ],
}

// ========================================
// GYM, FITNESS & WELLNESS
// ========================================
const gymQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'memberCount', label: 'Antal medlemmar', type: 'number' },
    { key: 'avgMembershipFee', label: 'Genomsnittlig månadsavgift (kr)', type: 'currency' },
    { key: 'facilitySize', label: 'Yta (kvm)', type: 'number' },
  ],
  step5: [
    { key: 'memberRetention', label: 'Medlemsbehållning/år (%)', type: 'percent' },
    { key: 'ptRevenue', label: 'PT-intäkter/månad (kr)', type: 'currency' },
    { key: 'classRevenue', label: 'Gruppträning-intäkter/månad (kr)', type: 'currency' },
  ],
  step6: [
    { key: 'equipmentBrands', label: 'Utrustningstyp', type: 'textarea' },
    { key: 'uniqueOfferings', label: 'Unika erbjudanden', type: 'textarea' },
  ],
  step7: [
    { key: 'equipmentValue', label: 'Värde träningsutrustning (kr)', type: 'currency' },
    { key: 'avgEquipmentAge', label: 'Genomsnittlig ålder utrustning (år)', type: 'number' },
    { key: 'leaseRemaining', label: 'År kvar på hyresavtal', type: 'number' },
  ],
}

// ========================================
// EVENT, KONFERENS & UPPLEVELSER
// ========================================
const eventQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'eventsPerYear', label: 'Antal event per år', type: 'number' },
    { key: 'avgEventValue', label: 'Genomsnittligt eventvärde (kr)', type: 'currency' },
    { key: 'venueCapacity', label: 'Kapacitet (antal personer)', type: 'number' },
  ],
  step5: [
    { key: 'repeatClientShare', label: 'Andel återkommande kunder (%)', type: 'percent' },
    { key: 'corporateShare', label: 'Andel företagskunder (%)', type: 'percent' },
  ],
  step6: [
    { key: 'eventTypes', label: 'Typer av event', type: 'textarea', placeholder: 'T.ex. konferenser, bröllop, företagsevent' },
    { key: 'seasonality', label: 'Säsongsvariation', type: 'select', options: [
      { value: 'low', label: 'Låg - jämn beläggning' },
      { value: 'medium', label: 'Medel - viss säsong' },
      { value: 'high', label: 'Hög - stark säsongsberoende' }
    ]},
  ],
  step7: [
    { key: 'venueOwnership', label: 'Äger ni lokalen?', type: 'select', options: [
      { value: 'owned', label: 'Ja, ägt' },
      { value: 'leased', label: 'Nej, hyrt' },
      { value: 'no-venue', label: 'Vi har ingen egen lokal' }
    ]},
    { key: 'insuranceCoverage', label: 'Försäkringsskydd', type: 'textarea' },
  ],
}

// ========================================
// UTBILDNING, KURSER & EDTECH
// ========================================
const utbildningQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'studentsPerYear', label: 'Antal deltagare/år', type: 'number' },
    { key: 'avgCoursePrice', label: 'Genomsnittligt kurspris (kr)', type: 'currency' },
    { key: 'onlineShare', label: 'Andel online (%)', type: 'percent' },
  ],
  step5: [
    { key: 'completionRate', label: 'Genomförandegrad (%)', type: 'percent' },
    { key: 'npsScore', label: 'NPS-score', type: 'number' },
    { key: 'b2bShare', label: 'Andel företagskunder (%)', type: 'percent' },
  ],
  step6: [
    { key: 'courseOfferings', label: 'Kursutbud', type: 'textarea' },
    { key: 'accreditations', label: 'Ackrediteringar', type: 'textarea' },
    { key: 'platform', label: 'Plattform (om digital)', type: 'text' },
  ],
  step7: [
    { key: 'instructorModel', label: 'Instruktörsmodell', type: 'select', options: [
      { value: 'employed', label: 'Anställda' },
      { value: 'freelance', label: 'Frilansare' },
      { value: 'mixed', label: 'Blandad' }
    ]},
    { key: 'contentOwnership', label: 'Äger ni kursmaterialet?', type: 'select', options: [
      { value: 'full', label: 'Ja, helt' },
      { value: 'partial', label: 'Delvis' },
      { value: 'licensed', label: 'Nej, licensierat' }
    ]},
  ],
}

// ========================================
// BILVERKSTAD & FORDONSSERVICE
// ========================================
const bilverkstadQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'serviceBays', label: 'Antal verkstadsplatser', type: 'number' },
    { key: 'carsPerMonth', label: 'Bilar per månad', type: 'number' },
    { key: 'avgRepairValue', label: 'Genomsnittlig reparation (kr)', type: 'currency' },
  ],
  step3: [
    { key: 'partsCost', label: 'Reservdelskostnader/månad (kr)', type: 'currency' },
  ],
  step4: [
    { key: 'equipmentValue', label: 'Värde verkstadsutrustning (kr)', type: 'currency' },
    { key: 'diagnosticEquipment', label: 'Värde diagnosutrustning (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'fleetContracts', label: 'Antal företagsflotteavtal', type: 'number' },
    { key: 'warrantyRepairs', label: 'Andel garantiarbeten (%)', type: 'percent' },
  ],
  step6: [
    { key: 'brandAuthorization', label: 'Märkesauktorisation', type: 'textarea', placeholder: 'T.ex. Volvo, BMW, universell' },
    { key: 'specializations', label: 'Specialiseringar', type: 'textarea' },
  ],
  step7: [
    { key: 'certifications', label: 'Certifieringar', type: 'textarea' },
    { key: 'environmentalPermits', label: 'Miljötillstånd', type: 'textarea' },
  ],
}

// ========================================
// JORD/SKOG, TRÄDGÅRD & GRÖNYTESKÖTSEL
// ========================================
const jordSkogQuestions: IndustryStepQuestions = {
  step2: [
    { key: 'contractsValue', label: 'Värde skötselavtal/år (kr)', type: 'currency' },
    { key: 'projectShare', label: 'Andel projektarbeten (%)', type: 'percent' },
  ],
  step4: [
    { key: 'machineValue', label: 'Värde maskiner (kr)', type: 'currency' },
    { key: 'vehicleValue', label: 'Värde fordon (kr)', type: 'currency' },
  ],
  step5: [
    { key: 'numberOfContracts', label: 'Antal skötselavtal', type: 'number' },
    { key: 'avgContractValue', label: 'Genomsnittligt avtalsvärde/år (kr)', type: 'currency' },
    { key: 'municipalShare', label: 'Andel kommunala uppdrag (%)', type: 'percent' },
  ],
  step6: [
    { key: 'services', label: 'Tjänster som erbjuds', type: 'textarea', placeholder: 'T.ex. gräsklippning, häckklippning, snöröjning' },
    { key: 'equipmentType', label: 'Typ av utrustning', type: 'textarea' },
  ],
  step7: [
    { key: 'seasonalStaff', label: 'Antal säsongsanställda', type: 'number' },
    { key: 'environmentalCertifications', label: 'Miljöcertifieringar', type: 'textarea' },
  ],
}

// ========================================
// EXPORT ALL INDUSTRY QUESTIONS
// ========================================
export const INDUSTRY_QUESTIONS: Record<string, IndustryStepQuestions> = {
  'it-konsult-utveckling': itKonsultQuestions,
  'ehandel-d2c': ehandelQuestions,
  'saas-licensmjukvara': saasQuestions,
  'bygg-anlaggning': byggQuestions,
  'el-vvs-installation': elVvsQuestions,
  'stad-facility-services': stadQuestions,
  'lager-logistik-3pl': logistikQuestions,
  'restaurang-cafe': restaurangQuestions,
  'detaljhandel-fysisk': detaljhandelQuestions,
  'grossist-partihandel': grossistQuestions,
  'latt-tillverkning-verkstad': tillverkningQuestions,
  'fastighetsservice-forvaltning': fastighetsQuestions,
  'marknadsforing-kommunikation-pr': marknadsforingQuestions,
  'ekonomitjanster-redovisning': ekonomiQuestions,
  'halsa-skonhet': halsaSkonhetQuestions,
  'gym-fitness-wellness': gymQuestions,
  'event-konferens-upplevelser': eventQuestions,
  'utbildning-kurser-edtech': utbildningQuestions,
  'bilverkstad-fordonsservice': bilverkstadQuestions,
  'jord-skog-tradgard-gronyteskotsel': jordSkogQuestions,
}

export function getIndustryQuestions(industryId: string): IndustryStepQuestions {
  return INDUSTRY_QUESTIONS[industryId] || {}
}

export function getQuestionsForStep(industryId: string, step: number): IndustryQuestion[] {
  const questions = INDUSTRY_QUESTIONS[industryId]
  if (!questions) return []
  
  const stepKey = `step${step}` as keyof IndustryStepQuestions
  return questions[stepKey] || []
}

