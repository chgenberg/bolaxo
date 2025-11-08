/**
 * Bolagsverket API Integration
 * 
 * Hämtar företagsdata och årsredovisningar från Bolagsverket
 * Använder officiella API:er där möjligt, fallback till scraping
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
  source: 'bolagsverket-api' | 'allabolag' | 'estimated'
  note?: string
}

interface AnnualReport {
  year: string
  filingDate: string
  documentUrl?: string
  revenue?: number
  profit?: number
  equity?: number
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

    // Försök först med Bolagsverkets officiella API (om tillgängligt)
    // Notera: Detta kräver API-nyckel och registrering
    const apiKey = process.env.BOLAGSVERKET_API_KEY
    if (apiKey) {
      try {
        const officialData = await fetchFromOfficialAPI(cleanOrgNumber, apiKey)
        if (officialData) {
          return officialData
        }
      } catch (error) {
        console.log('[Bolagsverket] Official API failed, trying fallback:', error)
      }
    }

    // Fallback 1: Allabolag.se scraping (public data)
    const allabolagData = await fetchFromAllabolag(cleanOrgNumber)
    if (allabolagData) {
      return allabolagData
    }

    // Fallback 2: Generera uppskattning baserat på org.nr
    return generateEstimatedData(cleanOrgNumber)
    
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
          equity: report.equity || report.egetKapital || report.egenkapital
        }))
      }
    } catch (error) {
      console.log('[Bolagsverket] Failed to fetch annual reports:', error)
    }

    return {
      name: companyData.name || companyData.foretagsnamn || companyData.namn || '',
      orgNumber: orgNumber,
      registrationDate: companyData.registrationDate || companyData.registreringsdatum || companyData.registrerat || '',
      legalForm: companyData.legalForm || companyData.juridiskForm || companyData.bolagsform || 'Aktiebolag',
      status: companyData.status || companyData.status || 'Aktiv',
      address: companyData.address || companyData.adress || companyData.postadress,
      employees: companyData.employees || companyData.antalAnstallda || companyData.anstallda,
      industryCode: companyData.industryCode || companyData.branschkod || companyData.sniKod,
      annualReports,
      source: 'bolagsverket-api'
    }
  } catch (error) {
    console.error('[Bolagsverket] Error parsing company data:', error)
    return null
  }
}

/**
 * Hämtar data från Allabolag.se (public scraping)
 */
async function fetchFromAllabolag(orgNumber: string): Promise<BolagsverketCompanyData | null> {
  try {
    const cheerio = await import('cheerio')
    
    const response = await fetch(`https://www.allabolag.se/what/${orgNumber}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: createTimeoutSignal(8000)
    })
    
    if (!response.ok) {
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Extrahera grundläggande info
    const companyName = $('h1').first().text().trim() || 
                       $('[data-testid="company-name"]').text().trim() ||
                       $('.company-name').text().trim()
    
    // Försök hitta registreringsdatum
    const registrationDateText = html.match(/Registrerat[:\s]+(\d{4}-\d{2}-\d{2})/i)?.[1] ||
                                 html.match(/(\d{4}-\d{2}-\d{2})/)?.[1]
    
    // Försök hitta antal anställda
    const employeesMatch = html.match(/Antal\s+anställda[:\s]+(\d+)/i) ||
                          html.match(/(\d+)\s+anställda/i)
    const employees = employeesMatch ? parseInt(employeesMatch[1]) : undefined
    
    // Försök hitta adress
    const address = $('[data-testid="address"]').text().trim() ||
                   $('.company-address').text().trim() ||
                   undefined

    if (!companyName || companyName === '') {
      return null
    }

    return {
      name: companyName,
      orgNumber: orgNumber,
      registrationDate: registrationDateText || '',
      legalForm: 'Aktiebolag', // Allabolag visar ofta bara AB
      status: 'Aktiv',
      employees,
      address,
      source: 'allabolag'
    }
  } catch (error) {
    console.log('[Bolagsverket] Allabolag fetch failed:', error)
    return null
  }
}

/**
 * Genererar uppskattad data baserat på organisationsnummer
 */
function generateEstimatedData(orgNumber: string): BolagsverketCompanyData {
  // Extrahera år från org.nr (första två siffrorna)
  const century = orgNumber.substring(0, 2)
  const year = parseInt(century) > 50 ? `19${century}` : `20${century}`
  
  return {
    name: 'Företagsnamn (vänligen kontrollera)',
    orgNumber: orgNumber,
    registrationDate: `${year}-06-15`,
    legalForm: 'Aktiebolag',
    status: 'Aktiv (uppskattning)',
    source: 'estimated',
    note: 'Uppskattad data - kontrollera med Bolagsverket för exakt information'
  }
}

/**
 * Hämtar årsredovisningar för ett företag
 */
export async function fetchAnnualReports(orgNumber: string): Promise<AnnualReport[]> {
  try {
    const cleanOrgNumber = orgNumber.replace(/\D/g, '')
    
    // Försök hämta från officiellt API om tillgängligt
    const apiKey = process.env.BOLAGSVERKET_API_KEY
    if (apiKey) {
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
    }

    // Fallback: Försök hämta från Allabolag
    return await fetchReportsFromAllabolag(cleanOrgNumber)
    
  } catch (error) {
    console.error('[Bolagsverket] Error fetching annual reports:', error)
    return []
  }
}

/**
 * Hämtar årsredovisningar från Allabolag.se
 */
async function fetchReportsFromAllabolag(orgNumber: string): Promise<AnnualReport[]> {
  try {
    const cheerio = await import('cheerio')
    
    const response = await fetch(`https://www.allabolag.se/what/${orgNumber}/arsredovisningar`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: createTimeoutSignal(8000)
    })

    if (!response.ok) {
      return []
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    
    const reports: AnnualReport[] = []
    
    // Försök extrahera årsredovisningar från tabell eller lista
    $('.annual-report, .arsredovisning, [data-year]').each((_, element) => {
      const year = $(element).attr('data-year') || 
                   $(element).find('.year').text().trim() ||
                   $(element).text().match(/(\d{4})/)?.[1]
      
      if (year) {
        const filingDate = $(element).find('.date').text().trim() || ''
        const documentUrl = $(element).find('a').attr('href') || undefined
        
        reports.push({
          year,
          filingDate,
          documentUrl
        })
      }
    })

    return reports
  } catch (error) {
    console.log('[Bolagsverket] Failed to fetch reports from Allabolag:', error)
    return []
  }
}

