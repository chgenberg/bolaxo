import { NextResponse } from 'next/server'
import { fetchWebsiteSnapshot } from '@/lib/website-snapshot'
import { searchCompanyWithWebSearch } from '@/lib/webInsights'

// Railway has ~30s timeout, we need to finish within that
const MAX_TOTAL_TIME_MS = 25000

export async function POST(request: Request) {
  const startTime = Date.now()
  
  try {
    const { url, companyName } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL krävs' },
        { status: 400 }
      )
    }

    console.log('[SCRAPE] Starting URL scrape for:', url, companyName)

    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), MAX_TOTAL_TIME_MS)
    })

    // Race against timeout - only do website scraping for speed
    // Web search takes too long and can cause timeouts
    const websitePromise = fetchWebsiteSnapshot(url, companyName)
    
    let websiteData = null
    let webSearchData = null
    
    try {
      // First try to get website data quickly
      websiteData = await Promise.race([websitePromise, timeoutPromise])
      console.log('[SCRAPE] Website snapshot completed in', Date.now() - startTime, 'ms')
      
      // Only do web search if we have time left (at least 10 seconds)
      const timeRemaining = MAX_TOTAL_TIME_MS - (Date.now() - startTime)
      if (timeRemaining > 10000 && companyName) {
        try {
          const webSearchPromise = searchCompanyWithWebSearch({
            companyName: companyName || '',
            website: url
          })
          webSearchData = await Promise.race([
            webSearchPromise, 
            new Promise<null>((resolve) => setTimeout(() => resolve(null), timeRemaining - 2000))
          ])
          console.log('[SCRAPE] Web search completed in', Date.now() - startTime, 'ms')
        } catch (webSearchError) {
          console.error('[SCRAPE] Web search failed (non-critical):', webSearchError)
        }
      }
    } catch (error) {
      console.error('[SCRAPE] Website scrape failed:', error)
    }

    // If we got no data at all, return error
    if (!websiteData && !webSearchData) {
      console.log('[SCRAPE] No data retrieved, returning error')
      return NextResponse.json(
        { success: false, error: 'Kunde inte hämta information från URL:en' },
        { status: 200 }
      )
    }

    console.log('[SCRAPE] Total time:', Date.now() - startTime, 'ms')

    // Combine the data
    const result = {
      success: websiteData || webSearchData,
      website: websiteData ? {
        title: websiteData.title,
        description: websiteData.metaDescription,
        highlights: websiteData.keyHighlights,
        contact: websiteData.contact,
        summary: websiteData.summary?.slice(0, 500),
        pagesAnalyzed: websiteData.pagesAnalyzed
      } : null,
      webSearch: webSearchData ? {
        companyProfile: webSearchData.companyProfile,
        marketSignals: webSearchData.marketSignals,
        growthNotes: webSearchData.growthNotes,
        riskNotes: webSearchData.riskNotes,
        sources: webSearchData.sources?.slice(0, 5)
      } : null,
      combined: {
        companyName: webSearchData?.companyProfile?.description ? 
          extractCompanyName(webSearchData.companyProfile.description) : 
          websiteData?.title?.split('|')[0]?.split('-')[0]?.trim() || companyName,
        industry: webSearchData?.companyProfile?.industry || 'Okänd',
        description: webSearchData?.companyProfile?.description || websiteData?.metaDescription,
        employees: webSearchData?.companyProfile?.estimatedEmployees,
        locations: webSearchData?.companyProfile?.locations,
        customers: webSearchData?.companyProfile?.customers,
        valueProp: webSearchData?.companyProfile?.valueProp,
        contact: websiteData?.contact
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[SCRAPE] Error:', error)
    return NextResponse.json(
      { error: 'Ett fel uppstod vid skrapning av URL' },
      { status: 500 }
    )
  }
}

function extractCompanyName(description: string): string {
  // Try to extract company name from the description
  const patterns = [
    /^([A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)*)\s+(?:är|AB|AB\.|erbjuder|utvecklar|levererar)/,
    /^([A-ZÅÄÖ][A-Za-zåäöÅÄÖ\s&]+?)(?:\s+är|\s+AB|\s+-)/
  ]
  
  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return ''
}

