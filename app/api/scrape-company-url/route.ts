import { NextResponse } from 'next/server'
import { fetchWebsiteSnapshot } from '@/lib/website-snapshot'
import { searchCompanyWithWebSearch } from '@/lib/webInsights'

export async function POST(request: Request) {
  try {
    const { url, companyName } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL krävs' },
        { status: 400 }
      )
    }

    console.log('[SCRAPE] Starting URL scrape for:', url, companyName)

    // Fetch data from both website scraping and GPT web search in parallel
    const [websiteResult, webSearchResult] = await Promise.allSettled([
      fetchWebsiteSnapshot(url, companyName),
      searchCompanyWithWebSearch({
        companyName: companyName || '',
        website: url
      })
    ])

    // Process website snapshot
    const websiteData = websiteResult.status === 'fulfilled' ? websiteResult.value : null
    if (websiteResult.status === 'rejected') {
      console.error('[SCRAPE] Website snapshot failed:', websiteResult.reason)
    }

    // Process web search data
    const webSearchData = webSearchResult.status === 'fulfilled' ? webSearchResult.value : null
    if (webSearchResult.status === 'rejected') {
      console.error('[SCRAPE] Web search failed:', webSearchResult.reason)
    }

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

