'use client'

import { useState, useEffect } from 'react'
import { 
  Building, FileText, DollarSign, Users, Shield, Scale, 
  Globe, TrendingUp, Package, Settings, Database, Lock,
  Award, Heart, Truck, Home, AlertTriangle, FileCheck,
  Target, BarChart3, HelpCircle, ArrowRight, ArrowLeft,
  Save, CheckCircle, X
} from 'lucide-react'
import FormField from './FormField'
import FormTextarea from './FormTextarea'
import ModernSelect from './ModernSelect'

interface PremiumValuationWizardProps {
  initialData?: any
  purchaseId?: string
  isDemo?: boolean
}

interface Section {
  id: number
  title: string
  icon: any
  description: string
  fields: Field[]
}

interface Field {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'date'
  required?: boolean
  options?: { value: string; label: string }[]
  help?: string
  placeholder?: string
}

// 42 sektioner för due diligence
const sections: Section[] = [
  {
    id: 1,
    title: "Företagsöversikt & bolagsformalia",
    icon: Building,
    description: "Juridisk form, org.nr, dotterbolag, historia & milstolpar",
    fields: [
      { name: "legalForm", label: "Juridisk form", type: "select", required: true,
        options: [
          { value: "ab", label: "Aktiebolag (AB)" },
          { value: "filial", label: "Filial" },
          { value: "hb", label: "Handelsbolag" },
          { value: "kb", label: "Kommanditbolag" },
          { value: "ef", label: "Enskild firma" }
        ]
      },
      { name: "registrationNumber", label: "Organisationsnummer", type: "text", required: true },
      { name: "subsidiaries", label: "Dotterbolag/intressebolag", type: "textarea", 
        placeholder: "Lista namn, org.nr och ägarandel för varje bolag" },
      { name: "companyHistory", label: "Historia & milstolpar", type: "textarea", 
        placeholder: "Grundande, större förändringar, pivoter, viktiga händelser" },
      { name: "ownershipStructure", label: "Ägarbild", type: "textarea", 
        placeholder: "Beskriv nuvarande ägare och deras andelar" },
      { name: "boardComposition", label: "Styrelsesammansättning", type: "textarea" },
      { name: "ongoingProcesses", label: "Pågående processer", type: "textarea",
        placeholder: "Omstrukturering, fusion, delning, likvidation etc." }
    ]
  },
  {
    id: 2,
    title: "Finansiell översikt (historik)",
    icon: DollarSign,
    description: "Årsredovisningar, resultat, kassaflöde, nyckeltal",
    fields: [
      { name: "revenue2023", label: "Omsättning 2023 (tkr)", type: "number", required: true },
      { name: "revenue2022", label: "Omsättning 2022 (tkr)", type: "number", required: true },
      { name: "revenue2021", label: "Omsättning 2021 (tkr)", type: "number" },
      { name: "ebitda2023", label: "EBITDA 2023 (tkr)", type: "number", required: true },
      { name: "ebitda2022", label: "EBITDA 2022 (tkr)", type: "number", required: true },
      { name: "netProfit2023", label: "Nettoresultat 2023 (tkr)", type: "number" },
      { name: "freeCashFlow", label: "Fritt kassaflöde senaste året (tkr)", type: "number" },
      { name: "seasonality", label: "Säsongsvariationer", type: "textarea",
        placeholder: "Beskriv eventuella säsongsvariationer i verksamheten" },
      { name: "oneTimeItems", label: "Engångsposter", type: "textarea",
        placeholder: "Lista extraordinära intäkter/kostnader senaste 3 åren" }
    ]
  },
  {
    id: 3,
    title: "Rörelsekapital & balansposter",
    icon: BarChart3,
    description: "Kundfordringar, leverantörsskulder, lager, avsättningar",
    fields: [
      { name: "accountsReceivable", label: "Kundfordringar (tkr)", type: "number", required: true },
      { name: "avgDaysReceivable", label: "Genomsnittlig kredittid kunder (dagar)", type: "number" },
      { name: "badDebtReserve", label: "Reservering osäkra fordringar (tkr)", type: "number" },
      { name: "accountsPayable", label: "Leverantörsskulder (tkr)", type: "number", required: true },
      { name: "avgDaysPayable", label: "Genomsnittlig kredittid leverantörer (dagar)", type: "number" },
      { name: "inventory", label: "Lagervärde (tkr)", type: "number" },
      { name: "inventoryTurnover", label: "Lageromsättningshastighet (ggr/år)", type: "number" },
      { name: "provisions", label: "Avsättningar", type: "textarea",
        placeholder: "Garantier, bonusar, semesterlöneskuld etc." }
    ]
  },
  {
    id: 4,
    title: "Budget, prognoser & affärsplan",
    icon: TrendingUp,
    description: "Metodik, antaganden, orderbok, investeringsbehov",
    fields: [
      { name: "budgetMethodology", label: "Budgetmetodik", type: "textarea",
        placeholder: "Beskriv hur budget tas fram och följs upp" },
      { name: "revenuePrognosis2024", label: "Prognostiserad omsättning 2024 (tkr)", type: "number" },
      { name: "revenuePrognosis2025", label: "Prognostiserad omsättning 2025 (tkr)", type: "number" },
      { name: "orderBacklog", label: "Orderstock (tkr)", type: "number" },
      { name: "pipelineValue", label: "Pipeline värde nästa 12 mån (tkr)", type: "number" },
      { name: "winRate", label: "Win rate (%)", type: "number" },
      { name: "capexNeeds", label: "Investeringsbehov kommande 3 år", type: "textarea" },
      { name: "growthDrivers", label: "Tillväxtdrivare", type: "textarea" }
    ]
  },
  {
    id: 5,
    title: "Intäktsanalys & prissättning",
    icon: Target,
    description: "Intäktsmix, kundkoncentration, prismodell",
    fields: [
      { name: "revenueStreams", label: "Intäktsströmmar", type: "textarea",
        placeholder: "Lista olika intäktskällor och deras andel av total" },
      { name: "recurringRevenue", label: "Återkommande intäkter (%)", type: "number" },
      { name: "top10Customers", label: "Topp 10 kunder", type: "textarea",
        placeholder: "Lista namn och andel av total omsättning" },
      { name: "customerChurn", label: "Customer churn rate (%/år)", type: "number" },
      { name: "pricingModel", label: "Prismodell", type: "textarea" },
      { name: "discountStructure", label: "Rabattstruktur", type: "textarea" },
      { name: "priceIncreases", label: "Historiska prisökningar", type: "textarea" }
    ]
  },
  {
    id: 6,
    title: "Kostnadsstruktur",
    icon: Package,
    description: "COGS, OPEX, skalbarhet, hävstång",
    fields: [
      { name: "cogs", label: "Direkta kostnader/COGS (%)", type: "number" },
      { name: "personnelCosts", label: "Personalkostnader (tkr)", type: "number" },
      { name: "rentCosts", label: "Lokalkostnader (tkr)", type: "number" },
      { name: "marketingCosts", label: "Marknadsföringskostnader (tkr)", type: "number" },
      { name: "itCosts", label: "IT-kostnader (tkr)", type: "number" },
      { name: "fixedVsVariable", label: "Fast vs rörlig kostnadsbas (%)", type: "text",
        placeholder: "Ex: 60% fast, 40% rörlig" },
      { name: "scalability", label: "Skalbarhet", type: "textarea",
        placeholder: "Beskriv möjligheter att skala utan proportionell kostnadsökning" }
    ]
  },
  {
    id: 7,
    title: "Skatt (Tax)",
    icon: FileCheck,
    description: "Moms, arbetsgivaravgifter, inkomstskatt, skatterisker",
    fields: [
      { name: "vatCompliance", label: "Momsstatus", type: "select",
        options: [
          { value: "compliant", label: "Fullständig efterlevnad" },
          { value: "minor_issues", label: "Mindre avvikelser" },
          { value: "major_issues", label: "Större avvikelser" }
        ]
      },
      { name: "employerTaxStatus", label: "Arbetsgivaravgifter status", type: "text" },
      { name: "corporateTax", label: "Bolagsskatt senaste året (tkr)", type: "number" },
      { name: "taxDisputes", label: "Skattetvister", type: "textarea" },
      { name: "taxOptimization", label: "Skatteoptimering", type: "textarea",
        placeholder: "Expansionsfonder, koncernbidrag, R&D-avdrag etc." },
      { name: "transferPricing", label: "Internprissättning", type: "textarea" }
    ]
  },
  {
    id: 8,
    title: "Redovisningsprinciper & intern kontroll",
    icon: Shield,
    description: "Principer, policyer, system, rutiner",
    fields: [
      { name: "accountingStandard", label: "Redovisningsstandard", type: "select",
        options: [
          { value: "k3", label: "K3" },
          { value: "k2", label: "K2" },
          { value: "ifrs", label: "IFRS" }
        ]
      },
      { name: "revenueRecognition", label: "Intäktsredovisning", type: "textarea" },
      { name: "internalControls", label: "Intern kontroll", type: "textarea" },
      { name: "auditFindings", label: "Revisionsanmärkningar", type: "textarea" },
      { name: "erpSystem", label: "ERP-system", type: "text" },
      { name: "financialProcesses", label: "Bokslutsprocess", type: "textarea" }
    ]
  },
  {
    id: 9,
    title: "Bank, finansiering & kapitalstruktur",
    icon: Scale,
    description: "Lån, kovenanter, leasing, aktierelaterat",
    fields: [
      { name: "bankLoans", label: "Banklån (tkr)", type: "number" },
      { name: "interestRate", label: "Genomsnittlig ränta (%)", type: "number" },
      { name: "covenants", label: "Kovenanter", type: "textarea" },
      { name: "creditFacility", label: "Checkkredit (tkr)", type: "number" },
      { name: "leasingCommitments", label: "Leasingåtaganden", type: "textarea" },
      { name: "shareholderLoans", label: "Aktieägarlån (tkr)", type: "number" },
      { name: "optionPrograms", label: "Optionsprogram", type: "textarea" }
    ]
  },
  {
    id: 10,
    title: "Juridisk översikt",
    icon: Scale,
    description: "Tvister, myndighetsärenden, avtalsspärrar",
    fields: [
      { name: "ongoingDisputes", label: "Pågående tvister", type: "textarea" },
      { name: "disputeReserves", label: "Reservering tvister (tkr)", type: "number" },
      { name: "authorityMatters", label: "Myndighetsärenden", type: "textarea" },
      { name: "changeOfControl", label: "Change-of-control klausuler", type: "textarea" },
      { name: "nonCompete", label: "Konkurrensklausuler", type: "textarea" },
      { name: "confidentiality", label: "Sekretessavtal", type: "textarea" }
    ]
  },
  {
    id: 11,
    title: "Bolagsstyrning & compliance",
    icon: Shield,
    description: "Policyer, styrelsearbete, regelefterlevnad",
    fields: [
      { name: "codeOfConduct", label: "Uppförandekod", type: "select",
        options: [
          { value: "yes", label: "Ja, implementerad" },
          { value: "partial", label: "Delvis implementerad" },
          { value: "no", label: "Nej" }
        ]
      },
      { name: "antiCorruption", label: "Antikorruptionspolicy", type: "select",
        options: [
          { value: "yes", label: "Ja" },
          { value: "no", label: "Nej" }
        ]
      },
      { name: "whistleblower", label: "Visselblåsarsystem", type: "select",
        options: [
          { value: "yes", label: "Ja" },
          { value: "no", label: "Nej" }
        ]
      },
      { name: "boardWork", label: "Styrelsearbete", type: "textarea" },
      { name: "industryCompliance", label: "Branschspecifik regelefterlevnad", type: "textarea" }
    ]
  },
  {
    id: 12,
    title: "Kommersiella avtal",
    icon: FileText,
    description: "Kundavtal, leverantörsavtal, partneravtal",
    fields: [
      { name: "majorCustomerContracts", label: "Större kundavtal", type: "textarea",
        placeholder: "Lista avtal, löptid, värde, uppsägningsvillkor" },
      { name: "supplierContracts", label: "Kritiska leverantörsavtal", type: "textarea" },
      { name: "partnerAgreements", label: "Partner/återförsäljaravtal", type: "textarea" },
      { name: "standardTerms", label: "Allmänna villkor", type: "textarea" },
      { name: "exclusivityClauses", label: "Exklusivitetsklausuler", type: "textarea" }
    ]
  },
  {
    id: 13,
    title: "Kunder & marknad",
    icon: Users,
    description: "Segment, kundnöjdhet, marknadsposition",
    fields: [
      { name: "customerSegments", label: "Kundsegment", type: "textarea" },
      { name: "nps", label: "Net Promoter Score", type: "number" },
      { name: "customerRetention", label: "Customer retention rate (%)", type: "number" },
      { name: "marketShare", label: "Marknadsandel (%)", type: "number" },
      { name: "competitors", label: "Huvudkonkurrenter", type: "textarea" },
      { name: "entryBarriers", label: "Inträdesbarriärer", type: "textarea" },
      { name: "marketRisks", label: "Marknadsrisker", type: "textarea" }
    ]
  },
  {
    id: 14,
    title: "Försäljning & distribution",
    icon: Target,
    description: "Säljorganisation, kanaler, marknadsföring",
    fields: [
      { name: "salesTeamSize", label: "Antal säljare", type: "number" },
      { name: "salesProcess", label: "Säljprocess", type: "textarea" },
      { name: "salesCycle", label: "Genomsnittlig säljcykel (dagar)", type: "number" },
      { name: "salesChannels", label: "Försäljningskanaler", type: "textarea" },
      { name: "marketingBudget", label: "Marknadsföringsbudget (tkr)", type: "number" },
      { name: "cac", label: "Customer Acquisition Cost", type: "number" },
      { name: "ltv", label: "Customer Lifetime Value", type: "number" }
    ]
  },
  {
    id: 15,
    title: "Produkt & erbjudande",
    icon: Package,
    description: "Portfölj, roadmap, kvalitet",
    fields: [
      { name: "productPortfolio", label: "Produktportfölj", type: "textarea" },
      { name: "productLifecycle", label: "Produktlivscykel", type: "textarea" },
      { name: "productRoadmap", label: "Produktroadmap", type: "textarea" },
      { name: "qualityMetrics", label: "Kvalitetsmått", type: "textarea" },
      { name: "warrantyProvisions", label: "Garantiavsättningar (tkr)", type: "number" },
      { name: "productReturns", label: "Returgrad (%)", type: "number" }
    ]
  },
  {
    id: 16,
    title: "Teknik & IT",
    icon: Settings,
    description: "Arkitektur, drift, processer, licenser",
    fields: [
      { name: "techStack", label: "Tech stack", type: "textarea" },
      { name: "systemArchitecture", label: "Systemarkitektur", type: "textarea" },
      { name: "hosting", label: "Hosting", type: "select",
        options: [
          { value: "cloud", label: "Cloud" },
          { value: "onprem", label: "On-premise" },
          { value: "hybrid", label: "Hybrid" }
        ]
      },
      { name: "technicalDebt", label: "Teknisk skuld", type: "textarea" },
      { name: "devProcesses", label: "Utvecklingsprocesser", type: "textarea" },
      { name: "softwareLicenses", label: "Programvarulicenser", type: "textarea" }
    ]
  },
  {
    id: 17,
    title: "Informationssäkerhet & cybersäkerhet",
    icon: Lock,
    description: "Policy, åtkomstkontroll, sårbarheter, BCP/DR",
    fields: [
      { name: "securityFramework", label: "Säkerhetsramverk", type: "select",
        options: [
          { value: "iso27001", label: "ISO 27001" },
          { value: "nist", label: "NIST" },
          { value: "other", label: "Annat" },
          { value: "none", label: "Inget formellt" }
        ]
      },
      { name: "accessControl", label: "Åtkomstkontroll", type: "textarea" },
      { name: "penTestDate", label: "Senaste penetrationstest", type: "date" },
      { name: "securityIncidents", label: "Säkerhetsincidenter senaste året", type: "textarea" },
      { name: "backupRoutines", label: "Backup-rutiner", type: "textarea" },
      { name: "disasterRecovery", label: "Disaster recovery plan", type: "textarea" }
    ]
  },
  {
    id: 18,
    title: "Data & integritet (GDPR)",
    icon: Database,
    description: "Datakartläggning, rättslig grund, avtal, register",
    fields: [
      { name: "dataMapping", label: "Datakartläggning genomförd", type: "select",
        options: [
          { value: "yes", label: "Ja" },
          { value: "partial", label: "Delvis" },
          { value: "no", label: "Nej" }
        ]
      },
      { name: "legalBasis", label: "Rättslig grund", type: "textarea" },
      { name: "dpaAgreements", label: "Personbiträdesavtal", type: "textarea" },
      { name: "thirdCountryTransfers", label: "Tredjelandsöverföringar", type: "textarea" },
      { name: "gdprIncidents", label: "GDPR-incidenter", type: "textarea" },
      { name: "privacyNotice", label: "Integritetspolicy uppdaterad", type: "date" }
    ]
  },
  {
    id: 19,
    title: "Immateriella rättigheter (IP)",
    icon: Award,
    description: "Äganderätt, patent, varumärken, open source",
    fields: [
      { name: "trademarks", label: "Varumärken", type: "textarea" },
      { name: "patents", label: "Patent", type: "textarea" },
      { name: "copyrights", label: "Upphovsrätter", type: "textarea" },
      { name: "ipAssignments", label: "IP-överlåtelser från anställda/konsulter", type: "textarea" },
      { name: "openSourceUsage", label: "Open source-användning", type: "textarea" },
      { name: "ipDisputes", label: "IP-tvister", type: "textarea" }
    ]
  },
  {
    id: 20,
    title: "HR & organisation",
    icon: Users,
    description: "Struktur, anställningsformer, villkor, arbetsmiljö",
    fields: [
      { name: "orgChart", label: "Organisationsstruktur", type: "textarea" },
      { name: "employeeCount", label: "Antal anställda", type: "number" },
      { name: "contractors", label: "Antal konsulter", type: "number" },
      { name: "keyPersonnel", label: "Nyckelpersoner", type: "textarea" },
      { name: "employmentContracts", label: "Anställningsavtal", type: "textarea" },
      { name: "incentivePrograms", label: "Incitamentsprogram", type: "textarea" },
      { name: "sickLeaveRate", label: "Sjukfrånvaro (%)", type: "number" }
    ]
  },
  {
    id: 21,
    title: "Kollektivavtal & facklig relation",
    icon: Users,
    description: "Avtalsbundenhet, MBL-processer, tvister",
    fields: [
      { name: "collectiveAgreement", label: "Kollektivavtal", type: "select",
        options: [
          { value: "yes", label: "Ja" },
          { value: "no", label: "Nej" }
        ]
      },
      { name: "unionRelations", label: "Facklig relation", type: "textarea" },
      { name: "laborDisputes", label: "Arbetsrättsliga tvister", type: "textarea" },
      { name: "redundancyHistory", label: "Varselhistorik", type: "textarea" }
    ]
  },
  {
    id: 22,
    title: "Hållbarhet & ESG",
    icon: Heart,
    description: "Miljö, socialt, styrning, rapportering",
    fields: [
      { name: "environmentalImpact", label: "Miljöpåverkan", type: "textarea" },
      { name: "ghgEmissions", label: "CO2-utsläpp (ton/år)", type: "number" },
      { name: "energyConsumption", label: "Energiförbrukning", type: "textarea" },
      { name: "diversityMetrics", label: "Mångfald & jämställdhet", type: "textarea" },
      { name: "socialInitiatives", label: "Sociala initiativ", type: "textarea" },
      { name: "esgReporting", label: "ESG-rapportering", type: "textarea" },
      { name: "csrdCompliance", label: "CSRD-efterlevnad", type: "select",
        options: [
          { value: "applicable", label: "Tillämpligt och efterlevs" },
          { value: "preparing", label: "Förbereder för efterlevnad" },
          { value: "not_applicable", label: "Ej tillämpligt" }
        ]
      }
    ]
  },
  {
    id: 23,
    title: "Miljö & myndighetstillstånd",
    icon: Globe,
    description: "Tillstånd, egenkontroll, EHS",
    fields: [
      { name: "environmentalPermits", label: "Miljötillstånd", type: "textarea" },
      { name: "environmentalCompliance", label: "Miljöefterlevnad", type: "textarea" },
      { name: "ehsIncidents", label: "EHS-incidenter", type: "textarea" },
      { name: "remediationLiabilities", label: "Saneringsansvar", type: "textarea" }
    ]
  },
  {
    id: 24,
    title: "Fastigheter & lokaler",
    icon: Home,
    description: "Ägda/hyrda, avtal, tekniskt skick",
    fields: [
      { name: "ownedProperties", label: "Ägda fastigheter", type: "textarea" },
      { name: "propertyValue", label: "Fastighetsvärde (tkr)", type: "number" },
      { name: "leaseAgreements", label: "Hyresavtal", type: "textarea",
        placeholder: "Adress, hyra, löptid, uppsägning" },
      { name: "totalRentCost", label: "Total årshyra (tkr)", type: "number" },
      { name: "maintenancePlan", label: "Underhållsplan", type: "textarea" },
      { name: "technicalCondition", label: "Tekniskt skick", type: "textarea" }
    ]
  },
  {
    id: 25,
    title: "Produktion & leveranskedja",
    icon: Truck,
    description: "Tillverkning, inköp, logistik",
    fields: [
      { name: "productionCapacity", label: "Produktionskapacitet", type: "textarea" },
      { name: "capacityUtilization", label: "Kapacitetsutnyttjande (%)", type: "number" },
      { name: "oee", label: "OEE (%)", type: "number" },
      { name: "supplierList", label: "Kritiska leverantörer", type: "textarea" },
      { name: "dualSourcing", label: "Dual sourcing", type: "textarea" },
      { name: "leadTimes", label: "Ledtider", type: "textarea" },
      { name: "logisticsSetup", label: "Logistikupplägg", type: "textarea" }
    ]
  },
  {
    id: 26,
    title: "Kvalitet & certifieringar",
    icon: Award,
    description: "System, revisioner, produktansvar",
    fields: [
      { name: "qualityCertifications", label: "Certifieringar", type: "textarea",
        placeholder: "ISO 9001, ISO 14001, etc." },
      { name: "auditFindings", label: "Revisionsavvikelser", type: "textarea" },
      { name: "qualityKPIs", label: "Kvalitets-KPI:er", type: "textarea" },
      { name: "customerComplaints", label: "Kundklagomål/år", type: "number" },
      { name: "productRecalls", label: "Produktåterkallelser", type: "textarea" },
      { name: "productLiabilityInsurance", label: "Produktansvarsförsäkring", type: "textarea" }
    ]
  },
  {
    id: 27,
    title: "Försäkringar",
    icon: Shield,
    description: "Policyer, täckning, skadehistorik",
    fields: [
      { name: "insurancePolicies", label: "Försäkringspolicyer", type: "textarea",
        placeholder: "Lista typ, försäkringsbolag, omfattning" },
      { name: "insuranceCoverage", label: "Täckningsomfattning", type: "textarea" },
      { name: "deductibles", label: "Självrisker", type: "textarea" },
      { name: "claimsHistory", label: "Skadehistorik", type: "textarea" },
      { name: "uninsuredRisks", label: "Oförsäkrade risker", type: "textarea" }
    ]
  },
  {
    id: 28,
    title: "Juridiska tvister & krav",
    icon: AlertTriangle,
    description: "Historik, pågående, möjliga tvister",
    fields: [
      { name: "litigationHistory", label: "Tvisthistorik", type: "textarea" },
      { name: "ongoingLitigation", label: "Pågående tvister", type: "textarea" },
      { name: "litigationReserves", label: "Tvistreserver (tkr)", type: "number" },
      { name: "potentialClaims", label: "Potentiella krav", type: "textarea" },
      { name: "settlements", label: "Förlikningar senaste 3 år", type: "textarea" }
    ]
  },
  {
    id: 29,
    title: "Off-balance & eventualförpliktelser",
    icon: FileText,
    description: "Garantier, åtaganden, hyres/leasing",
    fields: [
      { name: "guarantees", label: "Utställda garantier", type: "textarea" },
      { name: "contingentLiabilities", label: "Eventualförpliktelser", type: "textarea" },
      { name: "operationalCommitments", label: "Operationella åtaganden", type: "textarea" },
      { name: "customerBonuses", label: "Kundbonusar", type: "textarea" },
      { name: "buybackObligations", label: "Återköpsåtaganden", type: "textarea" }
    ]
  },
  {
    id: 30,
    title: "Statliga stöd & bidrag",
    icon: Building,
    description: "Stöd, villkor, återbetalningskrav",
    fields: [
      { name: "governmentGrants", label: "Erhållna stöd", type: "textarea" },
      { name: "grantConditions", label: "Villkor för stöd", type: "textarea" },
      { name: "repaymentRisks", label: "Återbetalningsrisker", type: "textarea" },
      { name: "grantReporting", label: "Rapporteringskrav", type: "textarea" }
    ]
  },
  {
    id: 31,
    title: "Regelefterlevnad per bransch",
    icon: FileCheck,
    description: "Särlagstiftning, tillsyn, sanktioner",
    fields: [
      { name: "industryRegulations", label: "Branschspecifik reglering", type: "textarea" },
      { name: "regulatoryAuthority", label: "Tillsynsmyndighet", type: "text" },
      { name: "complianceStatus", label: "Efterlevnadsstatus", type: "textarea" },
      { name: "regulatorySanctions", label: "Sanktionshistorik", type: "textarea" },
      { name: "pendingRegChanges", label: "Kommande regelförändringar", type: "textarea" }
    ]
  },
  {
    id: 32,
    title: "Interna processer & mognad",
    icon: Settings,
    description: "Dokumentation, förbättring, riskhantering",
    fields: [
      { name: "processDocumentation", label: "Processdokumentation", type: "textarea" },
      { name: "kpiTracking", label: "KPI-uppföljning", type: "textarea" },
      { name: "continuousImprovement", label: "Förbättringsarbete", type: "textarea" },
      { name: "riskManagement", label: "Riskhanteringsprocess", type: "textarea" },
      { name: "riskRegister", label: "Riskregister", type: "textarea" }
    ]
  },
  {
    id: 33,
    title: "Tredjepartsrisk (TPRM)",
    icon: Shield,
    description: "Leverantörsgranskning, avtalsklausuler, övervakning",
    fields: [
      { name: "vendorDueDiligence", label: "Leverantörsgranskning", type: "textarea" },
      { name: "criticalVendors", label: "Kritiska leverantörer", type: "textarea" },
      { name: "vendorRisks", label: "Leverantörsrisker", type: "textarea" },
      { name: "exitPlans", label: "Exit-planer", type: "textarea" }
    ]
  },
  {
    id: 34,
    title: "Export, handel & sanktioner",
    icon: Globe,
    description: "Exportkontroller, sanktioner, tull",
    fields: [
      { name: "exportLicenses", label: "Exportlicenser", type: "textarea" },
      { name: "sanctionScreening", label: "Sanktionsscreening", type: "textarea" },
      { name: "customsCompliance", label: "Tullefterlevnad", type: "textarea" },
      { name: "originRules", label: "Ursprungsregler", type: "textarea" }
    ]
  },
  {
    id: 35,
    title: "Offentlig sektor & upphandling",
    icon: Building,
    description: "LOU/LUF, ramavtal, överprövningar",
    fields: [
      { name: "publicContracts", label: "Offentliga avtal", type: "textarea" },
      { name: "frameworkAgreements", label: "Ramavtal", type: "textarea" },
      { name: "procurementChallenges", label: "Överprövningar", type: "textarea" },
      { name: "publicInvoicing", label: "E-faktureringskrav", type: "textarea" }
    ]
  },
  {
    id: 36,
    title: "Kunddata, analys & KPI:er",
    icon: BarChart3,
    description: "Retention, monetisering, datakvalitet",
    fields: [
      { name: "customerMetrics", label: "Kundmått", type: "textarea",
        placeholder: "DAU/MAU, churn, NDR, GRR" },
      { name: "ltvcac", label: "LTV/CAC ratio", type: "number" },
      { name: "paybackPeriod", label: "Payback period (månader)", type: "number" },
      { name: "arpu", label: "ARPU", type: "number" },
      { name: "dataQuality", label: "Datakvalitet", type: "textarea" },
      { name: "analyticsTools", label: "Analysverktyg", type: "textarea" }
    ]
  },
  {
    id: 37,
    title: "Varumärke & marknadsnärvaro",
    icon: Award,
    description: "IP-portfölj, rykte, brand safety",
    fields: [
      { name: "brandPortfolio", label: "Varumärkesportfölj", type: "textarea" },
      { name: "brandValue", label: "Varumärkesvärde", type: "textarea" },
      { name: "brandReputation", label: "Rykte & recensioner", type: "textarea" },
      { name: "socialMediaPresence", label: "Social media närvaro", type: "textarea" },
      { name: "brandGuidelines", label: "Brand guidelines", type: "textarea" }
    ]
  },
  {
    id: 38,
    title: "Relevanta individer & nyckelberoenden",
    icon: Users,
    description: "Grundare, nyckelpersoner, succession",
    fields: [
      { name: "founders", label: "Grundare & deras roll", type: "textarea" },
      { name: "keyDependencies", label: "Nyckelberoenden", type: "textarea" },
      { name: "successionPlan", label: "Successionsplan", type: "textarea" },
      { name: "retentionAgreements", label: "Bindningsavtal", type: "textarea" },
      { name: "knowledgeDocumentation", label: "Kunskapsdokumentation", type: "textarea" }
    ]
  },
  {
    id: 39,
    title: "Ägarrelaterade transaktioner",
    icon: Users,
    description: "Närståendeköp/sälj, hyres/låneupplägg",
    fields: [
      { name: "relatedPartyTransactions", label: "Närståendetransaktioner", type: "textarea" },
      { name: "marketTerms", label: "Marknadsmässighet", type: "textarea" },
      { name: "ownerLoans", label: "Lån till/från ägare", type: "textarea" },
      { name: "conflictOfInterest", label: "Jävshantering", type: "textarea" }
    ]
  },
  {
    id: 40,
    title: "Conditions precedent & SPA",
    icon: FileCheck,
    description: "Change of control, garantier, köpeskilling",
    fields: [
      { name: "changeOfControlConsents", label: "Change of control-godkännanden", type: "textarea" },
      { name: "warranties", label: "Garantier & friskrivningar", type: "textarea" },
      { name: "purchasePriceAdjustments", label: "Köpeskillingsjusteringar", type: "textarea" },
      { name: "earnOutStructure", label: "Earn-out struktur", type: "textarea" },
      { name: "escrowArrangements", label: "Escrow-arrangemang", type: "textarea" }
    ]
  },
  {
    id: 41,
    title: "Integrationsplan (PMI)",
    icon: Target,
    description: "Synergier, 100-dagarsplan, kommunikation",
    fields: [
      { name: "revenueSynergies", label: "Intäktssynergier", type: "textarea" },
      { name: "costSynergies", label: "Kostnadssynergier", type: "textarea" },
      { name: "integrationTimeline", label: "Integrationstidplan", type: "textarea" },
      { name: "100DayPlan", label: "100-dagarsplan", type: "textarea" },
      { name: "communicationPlan", label: "Kommunikationsplan", type: "textarea" },
      { name: "changeManagement", label: "Förändringsledning", type: "textarea" }
    ]
  },
  {
    id: 42,
    title: "Datarum & dokumentation",
    icon: Database,
    description: "Struktur, kvalitetssäkring, dokumentlista",
    fields: [
      { name: "dataRoomStructure", label: "Datarumsstruktur", type: "textarea" },
      { name: "documentCompleteness", label: "Dokumentkomplethet (%)", type: "number" },
      { name: "redFlags", label: "Röda flaggor", type: "textarea" },
      { name: "missingDocuments", label: "Saknade dokument", type: "textarea" },
      { name: "qaPending", label: "Öppna Q&A-frågor", type: "textarea" }
    ]
  }
]

export default function PremiumValuationWizard({ 
  initialData,
  purchaseId,
  isDemo = false
}: PremiumValuationWizardProps) {
  const [currentSection, setCurrentSection] = useState(1)
  const [formData, setFormData] = useState<any>(initialData || {})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Auto-save every 30 seconds (endast om inte demo)
  useEffect(() => {
    if (isDemo) return // Ingen auto-save i demo-läge
    
    const interval = setInterval(() => {
      handleSave()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [formData, isDemo])

  const handleSave = async () => {
    if (isDemo) {
      // I demo-läge spara bara lokalt
      const demoId = purchaseId || 'demo-' + Date.now()
      localStorage.setItem(`premium-valuation-${demoId}`, JSON.stringify({
        formData,
        currentSection,
        lastSaved: new Date(),
        isDemo: true
      }))
      setLastSaved(new Date())
      return
    }

    setIsSaving(true)
    
    try {
      // Spara till databas
      const response = await fetch('/api/valuation/premium/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseId,
          formData,
          currentSection
        })
      })
      
      if (response.ok) {
        setLastSaved(new Date())
        // Spara även lokalt
        localStorage.setItem(`premium-valuation-${purchaseId}`, JSON.stringify({
          formData,
          currentSection,
          lastSaved: new Date()
        }))
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateSection = () => {
    const section = sections.find(s => s.id === currentSection)
    if (!section) return true

    const newErrors: Record<string, string> = {}
    
    section.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} är obligatoriskt`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateSection()) {
      handleSave()
      if (currentSection < sections.length) {
        setCurrentSection(currentSection + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    if (!validateSection()) return

    // TODO: Anropa GPT-5 API för djupgående analys
    alert('Genererar djupgående analys...')
  }

  const currentSectionData = sections.find(s => s.id === currentSection)
  const progress = (currentSection / sections.length) * 100

  return (
    <div className="bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Del {currentSection} av {sections.length}
          </h2>
          <div className="flex items-center gap-4">
            {isSaving && (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Sparar...
              </span>
            )}
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Senast sparad: {lastSaved.toLocaleTimeString('sv-SE')}
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 text-primary-navy border border-primary-navy rounded-lg hover:bg-primary-navy/10 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Spara
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section tabs (scrollable) */}
      <div className="px-8 py-4 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = section.id === currentSection
            const isCompleted = section.id < currentSection
            
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : isCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden lg:inline">{section.title}</span>
                <span className="lg:hidden">{section.id}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {currentSectionData && (
        <div className="px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <currentSectionData.icon className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                {currentSectionData.title}
              </h3>
            </div>
            <p className="text-gray-600">{currentSectionData.description}</p>
          </div>

          <div className="space-y-6">
            {currentSectionData.fields.map((field) => (
              <div key={field.name}>
                {field.help && (
                  <div className="flex items-start gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600">{field.help}</p>
                  </div>
                )}
                
                {field.type === 'text' || field.type === 'email' || field.type === 'date' ? (
                  <FormField
                    label={field.label}
                    value={formData[field.name] || ''}
                    onValueChange={(value) => updateField(field.name, value)}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    error={errors[field.name]}
                  />
                ) : field.type === 'number' ? (
                  <FormField
                    label={field.label}
                    value={formData[field.name] || ''}
                    onValueChange={(value) => updateField(field.name, value)}
                    type="number"
                    placeholder={field.placeholder}
                    required={field.required}
                    error={errors[field.name]}
                  />
                ) : field.type === 'textarea' ? (
                  <FormTextarea
                    label={field.label}
                    value={formData[field.name] || ''}
                    onChange={(value) => updateField(field.name, value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    error={errors[field.name]}
                    rows={4}
                  />
                ) : field.type === 'select' && field.options ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <ModernSelect
                      value={formData[field.name] || ''}
                      onChange={(value) => updateField(field.name, value)}
                      options={field.options}
                      placeholder={`Välj ${field.label.toLowerCase()}`}
                      error={errors[field.name]}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 1}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2
              ${currentSection === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <ArrowLeft className="h-5 w-5" />
            Föregående
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentSection} / {sections.length} sektioner ifyllda
            </p>
          </div>

          {currentSection < sections.length ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Nästa
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              Generera djupgående analys
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
