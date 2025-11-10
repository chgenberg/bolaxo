/**
 * Bolagsverket API Integration
 * 
 * Hämtar företagsdata och årsredovisningar från Bolagsverket
 * Använder enbart officiella Bolagsverket API:er
 */

import { createTimeoutSignal } from './scrapers/abort-helper'

interface BolagsverketCompanyData {
  name: string
  orgNumber: string
  registrationDate: string
  legalForm: string
  status: string
  address?: string
  employees?: number
  industryCode?: string
  annualReports?: AnnualReport[]
  source: 'bolagsverket-api'
  note?: string
}

interface AnnualReport {
  year: string
  filingDate?: string
  documentUrl?: string
  revenue?: number
  profit?: number
  equity?: number
  // Balansräkningsdata (om tillgängligt från API)
  totalAssets?: number
  totalLiabilities?: number
  cash?: number
  accountsReceivable?: number
  inventory?: number
  accountsPayable?: number
  shortTermDebt?: number
  longTermDebt?: number
}

/**
 * Hämtar företagsdata från Bolagsverket baserat på organisationsnummer
 */
export async function fetchBolagsverketCompanyData(orgNumber: string): Promise<BolagsverketCompanyData | null> {
  try {
    const cleanOrgNumber = orgNumber.replace(/\D/g, '')
    
    if (!cleanOrgNumber || cleanOrgNumber.length !== 10) {
      console.log('[Bolagsverket] Invalid org number format')
      return null
    }

    // Hämta från Bolagsverkets officiella API
    const apiKey = process.env.BOLAGSVERKET_API_KEY
    if (!apiKey) {
      console.log('[Bolagsverket] API key not configured - set BOLAGSVERKET_API_KEY environment variable')
      return null
    }

    try {
      const officialData = await fetchFromOfficialAPI(cleanOrgNumber, apiKey)
      if (officialData) {
        return officialData
      }
      
      console.log('[Bolagsverket] No data found for org number:', cleanOrgNumber)
      return null
    } catch (error) {
      console.error('[Bolagsverket] Official API error:', error)
      return null
    }
    
  } catch (error) {
    console.error('[Bolagsverket] Error fetching data:', error)
    return null
  }
}

/**
 * Hämtar data från Bolagsverkets officiella API
 * Kräver API-nyckel från Bolagsverket
 */
async function fetchFromOfficialAPI(orgNumber: string, apiKey: string): Promise<BolagsverketCompanyData | null> {
  try {
    // Bolagsverkets API endpoint för värdefulla datamängder
    // Dokumentation: https://vardefulla-datamangder.bolagsverket.se/
    // API-nyckel skickas som query parameter eller header enligt Bolagsverkets specifikation
    const baseUrl = 'https://data.bolagsverket.se/v1'
    
    // Format org number (XXXXXX-XXXX)
    const formattedOrgNumber = orgNumber.length === 10 
      ? `${orgNumber.slice(0, 6)}-${orgNumber.slice(6)}`
      : orgNumber
    
    // Hämta grundläggande företagsdata
    // Notera: API-endpoint kan variera - kontrollera Bolagsverkets dokumentation
    const companyResponse = await fetch(`${baseUrl}/foretag/${formattedOrgNumber}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: createTimeoutSignal(10000)
    })

    if (!companyResponse.ok) {
      // Om Bearer auth inte fungerar, prova med API key som query parameter
      if (companyResponse.status === 401 || companyResponse.status === 403) {
        const altResponse = await fetch(`${baseUrl}/foretag/${formattedOrgNumber}?api_key=${encodeURIComponent(apiKey)}`, {
          headers: {
            'Accept': 'application/json'
          },
          signal: createTimeoutSignal(10000)
        })
        
        if (altResponse.ok) {
          const companyData = await altResponse.json()
          return parseCompanyData(companyData, orgNumber, apiKey)
        }
      }
      
      console.log(`[Bolagsverket] API returned ${companyResponse.status}`)
      return null
    }

    const companyData = await companyResponse.json()
    return parseCompanyData(companyData, orgNumber, apiKey)
    
  } catch (error) {
    console.error('[Bolagsverket] Official API error:', error)
    return null
  }
}

/**
 * Parse company data from Bolagsverket API response
 */
async function parseCompanyData(companyData: any, orgNumber: string, apiKey: string): Promise<BolagsverketCompanyData | null> {
  try {
    // Log raw response to debug
    console.log('[Bolagsverket] Raw API response:', JSON.stringify(companyData, null, 2))
    
    // Hämta årsredovisningar om tillgängligt
    const baseUrl = 'https://data.bolagsverket.se/v1'
    const formattedOrgNumber = orgNumber.length === 10 
      ? `${orgNumber.slice(0, 6)}-${orgNumber.slice(6)}`
      : orgNumber
    
    let annualReports: AnnualReport[] = []
    try {
      const reportsResponse = await fetch(`${baseUrl}/foretag/${formattedOrgNumber}/arsredovisningar`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        signal: createTimeoutSignal(10000)
      })

      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        annualReports = (reportsData.reports || reportsData || []).map((report: any) => ({
          year: report.year || report.arsredovisningsar || '',
          filingDate: report.filingDate || report.inlamningsdatum || '',
          documentUrl: report.documentUrl || report.dokumentUrl,
          revenue: report.revenue || report.omsattning || report.nettoomsattning,
          profit: report.profit || report.resultat || report.arsresultat,
          equity: report.equity || report.egetKapital || report.egenkapital,
          // Balansräkningsdata (om tillgängligt)
          totalAssets: report.totalAssets || report.totalaTillgangar || report.tillgangar,
          totalLiabilities: report.totalLiabilities || report.totalaSkulder || report.skulder,
          cash: report.cash || report.kassa || report.kontanter || report.likvidaMedel,
          accountsReceivable: report.accountsReceivable || report.kundfordringar || report.fordringar,
          inventory: report.inventory || report.lager || report.varulager,
          accountsPayable: report.accountsPayable || report.leverantorsskulder || report.skulderTillLeverantorer,
          shortTermDebt: report.shortTermDebt || report.kortfristigaSkulder || report.kortfristigaLan,
          longTermDebt: report.longTermDebt || report.langfristigaSkulder || report.langfristigaLan
        }))
      }
    } catch (error) {
      console.log('[Bolagsverket] Failed to fetch annual reports:', error)
    }

    return {
      name: companyData.name || companyData.foretagsnamn || companyData.namn || companyData.companyName || companyData.företagsnamn || companyData.bolagsnamn || '',
      orgNumber: orgNumber,
      registrationDate: companyData.registrationDate || companyData.registreringsdatum || companyData.registrerat || '',
      legalForm: companyData.legalForm || companyData.juridiskForm || companyData.bolagsform || 'Aktiebolag',
      status: companyData.status || companyData.status || 'Aktiv',
      address: companyData.address || companyData.adress || companyData.postadress || companyData.besoksadress,
      employees: companyData.employees || companyData.antalAnstallda || companyData.anstallda,
      industryCode: companyData.industryCode || companyData.branschkod || companyData.sniKod || companyData.sni,
      annualReports,
      source: 'bolagsverket-api'
    }
  } catch (error) {
    console.error('[Bolagsverket] Error parsing company data:', error)
    return null
  }
}

/**
 * Hämtar årsredovisningar för ett företag
 */
export async function fetchAnnualReports(orgNumber: string): Promise<AnnualReport[]> {
  try {
    const cleanOrgNumber = orgNumber.replace(/\D/g, '')
    
    // Hämta från officiellt API
    const apiKey = process.env.BOLAGSVERKET_API_KEY
    if (!apiKey) {
      console.log('[Bolagsverket] API key not configured')
      return []
    }

    try {
      const response = await fetch(`https://data.bolagsverket.se/v1/foretag/${cleanOrgNumber}/arsredovisningar`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        signal: createTimeoutSignal(10000)
      })

      if (response.ok) {
        const data = await response.json()
        return (data.reports || []).map((report: any) => ({
          year: report.year,
          filingDate: report.filingDate,
          documentUrl: report.documentUrl,
          revenue: report.revenue,
          profit: report.profit,
          equity: report.equity
        }))
      }
    } catch (error) {
      console.log('[Bolagsverket] Failed to fetch reports from API:', error)
    }

    return []
    
  } catch (error) {
    console.error('[Bolagsverket] Error fetching annual reports:', error)
    return []
  }
}
