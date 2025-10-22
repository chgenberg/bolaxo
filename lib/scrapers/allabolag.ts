import * as cheerio from 'cheerio'

interface AllabolagData {
  companyName: string
  orgNumber: string
  financials: {
    latestYear?: number
    revenue?: number // kr
    profit?: number // kr
    equity?: number // kr
    assets?: number // kr
    liabilities?: number // kr
    employees?: number
    revenueGrowth?: number // %
    profitMargin?: number // %
  }
  history?: Array<{
    year: number
    revenue?: number
    profit?: number
    employees?: number
  }>
  creditRating?: string
  status: string
  registrationDate?: string
  ceo?: string
  address?: string
  source: 'allabolag'
}

export async function scrapeAllabolag(orgNumber: string): Promise<AllabolagData | null> {
  try {
    const cleanOrgNumber = orgNumber.replace(/\D/g, '')
    
    // Allabolag URL format: /XXXXXX-XXXX/company-name
    // Men vi kan söka direkt med org.nr
    const searchUrl = `https://www.allabolag.se/what/${cleanOrgNumber}`
    
    console.log(`Scraping Allabolag: ${searchUrl}`)
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'sv-SE,sv;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      console.log(`Allabolag returned ${response.status}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extrahera företagsnamn
    const companyName = $('h1').first().text().trim() || 
                       $('.company-name').first().text().trim() ||
                       $('title').text().split('-')[0]?.trim() || 
                       'Okänt företag'

    // Extrahera grundläggande info
    const status = extractTextByLabel($, 'Status') || 'Aktiv'
    const registrationDate = extractTextByLabel($, 'Registrerat') || 
                            extractTextByLabel($, 'Registreringsdatum')
    const ceo = extractTextByLabel($, 'Verkställande direktör') || 
               extractTextByLabel($, 'VD')
    const address = extractTextByLabel($, 'Adress') || 
                   extractTextByLabel($, 'Postadress')

    // Extrahera finansiella nyckeltal
    const financials: AllabolagData['financials'] = {}
    
    // Försök hitta senaste året
    const yearMatch = html.match(/(\d{4})(?:\s*-\s*\d{2})?/g)
    if (yearMatch && yearMatch.length > 0) {
      const years = yearMatch.map(y => parseInt(y)).filter(y => y > 2000 && y < 2030)
      if (years.length > 0) {
        financials.latestYear = Math.max(...years)
      }
    }

    // Extrahera omsättning (olika format)
    const revenuePatterns = [
      /Omsättning[:\s]+(\d[\d\s]*)\s*(?:tkr|TSEK|kr)?/i,
      /Nettoomsättning[:\s]+(\d[\d\s]*)\s*(?:tkr|TSEK|kr)?/i,
      /Intäkter[:\s]+(\d[\d\s]*)\s*(?:tkr|TSEK|kr)?/i,
    ]
    
    for (const pattern of revenuePatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        const value = parseInt(match[1].replace(/\s/g, ''))
        // Allabolag visar ofta i tkr (tusentals kronor)
        financials.revenue = value * 1000
        break
      }
    }

    // Extrahera resultat
    const profitPatterns = [
      /Resultat[:\s]+(-?\d[\d\s]*)\s*(?:tkr|TSEK|kr)?/i,
      /Årets resultat[:\s]+(-?\d[\d\s]*)\s*(?:tkr|TSEK|kr)?/i,
      /Rörelseresultat[:\s]+(-?\d[\d\s]*)\s*(?:tkr|TSEK|kr)?/i,
    ]
    
    for (const pattern of profitPatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        const value = parseInt(match[1].replace(/\s/g, ''))
        financials.profit = value * 1000
        break
      }
    }

    // Extrahera eget kapital
    const equityMatch = html.match(/Eget kapital[:\s]+(-?\d[\d\s]*)\s*(?:tkr|TSEK)?/i)
    if (equityMatch && equityMatch[1]) {
      financials.equity = parseInt(equityMatch[1].replace(/\s/g, '')) * 1000
    }

    // Extrahera antal anställda
    const employeesPatterns = [
      /Antal anställda[:\s]+(\d+)/i,
      /Anställda[:\s]+(\d+)/i,
      /(\d+)\s+anställda/i,
    ]
    
    for (const pattern of employeesPatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        financials.employees = parseInt(match[1])
        break
      }
    }

    // Beräkna vinstmarginal om vi har både omsättning och resultat
    if (financials.revenue && financials.profit) {
      financials.profitMargin = (financials.profit / financials.revenue) * 100
    }

    // Försök extrahera historisk data (om tillgänglig)
    const history: AllabolagData['history'] = []
    
    // Allabolag har ofta tabeller med historiska data
    $('table').each((_, table) => {
      const $table = $(table)
      const headers = $table.find('th').map((_, th) => $(th).text().trim()).get()
      
      // Leta efter år i headers
      headers.forEach((header, index) => {
        const yearMatch = header.match(/(\d{4})/)
        if (yearMatch) {
          const year = parseInt(yearMatch[1])
          const $rows = $table.find('tr')
          
          $rows.each((_, row) => {
            const $cells = $(row).find('td')
            const label = $cells.first().text().trim()
            const value = $cells.eq(index).text().trim()
            
            if (!history.find(h => h.year === year)) {
              history.push({ year })
            }
            
            const historyEntry = history.find(h => h.year === year)!
            
            if (label.includes('Omsättning') && value) {
              const num = parseInt(value.replace(/\D/g, ''))
              if (num) historyEntry.revenue = num * 1000
            }
            
            if (label.includes('Resultat') && value) {
              const num = parseInt(value.replace(/[^\d-]/g, ''))
              if (num) historyEntry.profit = num * 1000
            }
            
            if (label.includes('Anställda') && value) {
              const num = parseInt(value.replace(/\D/g, ''))
              if (num) historyEntry.employees = num
            }
          })
        }
      })
    })

    // Beräkna tillväxt om vi har historisk data
    if (history.length >= 2) {
      const sorted = history.sort((a, b) => b.year - a.year)
      const latest = sorted[0]
      const previous = sorted[1]
      
      if (latest.revenue && previous.revenue) {
        financials.revenueGrowth = ((latest.revenue - previous.revenue) / previous.revenue) * 100
      }
    }

    console.log(`✓ Allabolag scraped for ${companyName}:`, {
      revenue: financials.revenue,
      profit: financials.profit,
      employees: financials.employees,
      historyYears: history.length
    })

    return {
      companyName,
      orgNumber: cleanOrgNumber,
      financials,
      history: history.length > 0 ? history : undefined,
      status,
      registrationDate,
      ceo,
      address,
      source: 'allabolag',
    }
  } catch (error) {
    console.error('Allabolag scraping error:', error)
    return null
  }
}

// Helper function to extract text by label
function extractTextByLabel($: cheerio.CheerioAPI, label: string): string | undefined {
  let result: string | undefined

  // Try different patterns
  $('dt, th, td, strong, b').each((_, elem) => {
    const $elem = $(elem)
    const text = $elem.text().trim()
    
    if (text.includes(label)) {
      // Get next sibling or parent's next sibling
      let $next = $elem.next()
      if ($next.length === 0) {
        $next = $elem.parent().next()
      }
      
      if ($next.length > 0) {
        const value = $next.text().trim()
        if (value && value !== label) {
          result = value
          return false // break
        }
      }
    }
  })

  return result
}

