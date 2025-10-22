/**
 * Google Custom Search API Integration
 * 
 * Fetches web search results about a company to enrich valuation data.
 * 
 * Setup:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable "Custom Search API"
 * 4. Create API credentials (API Key)
 * 5. Go to https://programmablesearchengine.google.com/
 * 6. Create a new search engine (search the entire web)
 * 7. Get the Search Engine ID
 * 
 * Free tier: 100 searches/day
 * Paid: $5 per 1,000 queries
 */

export interface GoogleSearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
}

export interface GoogleSearchData {
  companyName: string
  totalResults: number
  searchTime: number
  results: GoogleSearchResult[]
  insights: {
    newsCount: number
    socialMentions: number
    industryMentions: number
    hasRecentNews: boolean // Within last 6 months
    sentimentIndicators: {
      positive: string[] // "award", "expansion", "growth"
      negative: string[] // "lawsuit", "bankruptcy", "scandal"
      neutral: string[] // "announces", "launches"
    }
  }
  timestamp: string
}

/**
 * Search Google for company information
 */
export async function searchGoogle(
  companyName: string,
  orgNumber?: string
): Promise<GoogleSearchData | null> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID

  if (!apiKey || !searchEngineId) {
    console.log('[Google Search] API key or Search Engine ID not configured, skipping...')
    return null
  }

  try {
    // Build search query
    const searchQuery = orgNumber 
      ? `${companyName} ${orgNumber}`
      : `${companyName} Sweden företag`

    const url = new URL('https://www.googleapis.com/customsearch/v1')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('cx', searchEngineId)
    url.searchParams.set('q', searchQuery)
    url.searchParams.set('num', '10') // Get top 10 results
    url.searchParams.set('lr', 'lang_sv') // Prefer Swedish results
    url.searchParams.set('dateRestrict', 'm6') // Last 6 months

    console.log(`[Google Search] Searching for: "${searchQuery}"`)

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000), // 8s timeout
    })

    if (!response.ok) {
      if (response.status === 429) {
        console.log('[Google Search] Rate limit exceeded (100 searches/day)')
      } else {
        console.log(`[Google Search] API error: ${response.status}`)
      }
      return null
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      console.log('[Google Search] No results found')
      return null
    }

    const results: GoogleSearchResult[] = data.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }))

    // Analyze results for insights
    const insights = analyzeSearchResults(results)

    const searchData: GoogleSearchData = {
      companyName,
      totalResults: parseInt(data.searchInformation?.totalResults || '0'),
      searchTime: parseFloat(data.searchInformation?.searchTime || '0'),
      results,
      insights,
      timestamp: new Date().toISOString(),
    }

    console.log(`[Google Search] Found ${results.length} results (${searchData.totalResults} total)`)
    
    return searchData
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('[Google Search] Request timed out')
      } else {
        console.log(`[Google Search] Error: ${error.message}`)
      }
    }
    return null
  }
}

/**
 * Analyze search results for sentiment and insights
 */
function analyzeSearchResults(results: GoogleSearchResult[]): GoogleSearchData['insights'] {
  const allText = results.map(r => `${r.title} ${r.snippet}`.toLowerCase()).join(' ')
  
  // Keywords for sentiment analysis
  const positiveKeywords = [
    'tillväxt', 'expansion', 'framgång', 'prisad', 'vinnare', 'award',
    'ökar', 'stärker', 'lanserar', 'investering', 'rekord', 'succé',
    'excellent', 'bäst', 'ledande', 'innovativ', 'breakthrough'
  ]
  
  const negativeKeywords = [
    'konkurs', 'bankruptcy', 'stämning', 'lawsuit', 'skandal', 'scandal',
    'problem', 'kris', 'varsel', 'nedläggning', 'förlust', 'loss',
    'kritik', 'controversy', 'investigation', 'fraud', 'complaint'
  ]
  
  const neutralKeywords = [
    'meddelar', 'announces', 'lanserar', 'launches', 'presenterar',
    'ny', 'new', 'uppdatering', 'update', 'ändring', 'change'
  ]

  const newsKeywords = ['nyhet', 'news', 'pressmeddelande', 'press release', 'rapport', 'report']
  const socialKeywords = ['linkedin', 'facebook', 'twitter', 'instagram', 'social']
  const industryKeywords = ['bransch', 'industry', 'sektor', 'sector', 'marknad', 'market']

  const foundPositive = positiveKeywords.filter(kw => allText.includes(kw))
  const foundNegative = negativeKeywords.filter(kw => allText.includes(kw))
  const foundNeutral = neutralKeywords.filter(kw => allText.includes(kw))

  const newsCount = newsKeywords.reduce((count, kw) => 
    count + (allText.match(new RegExp(kw, 'g')) || []).length, 0
  )
  
  const socialMentions = socialKeywords.reduce((count, kw) => 
    count + (allText.match(new RegExp(kw, 'g')) || []).length, 0
  )
  
  const industryMentions = industryKeywords.reduce((count, kw) => 
    count + (allText.match(new RegExp(kw, 'g')) || []).length, 0
  )

  // Check if there's recent news (results are already filtered to last 6 months)
  const hasRecentNews = results.length > 3 && newsCount > 0

  return {
    newsCount,
    socialMentions,
    industryMentions,
    hasRecentNews,
    sentimentIndicators: {
      positive: foundPositive,
      negative: foundNegative,
      neutral: foundNeutral,
    },
  }
}

/**
 * Format Google Search data for AI prompt
 */
export function formatGoogleSearchForAI(data: GoogleSearchData | null): string {
  if (!data) return 'Google Search: Ej tillgänglig'

  const { results, insights } = data

  let summary = `Google Search Results (${results.length} av ${data.totalResults} resultat):\n\n`

  // Top results
  summary += 'TOP RESULTAT:\n'
  results.slice(0, 5).forEach((result, i) => {
    summary += `${i + 1}. ${result.title}\n`
    summary += `   ${result.snippet}\n`
    summary += `   Källa: ${result.displayLink}\n\n`
  })

  // Insights
  summary += '\nSEARCH INSIGHTS:\n'
  summary += `- Totalt antal träffar: ${data.totalResults.toLocaleString()}\n`
  summary += `- Nyhetsartiklar: ${insights.newsCount}\n`
  summary += `- Social media omnämnanden: ${insights.socialMentions}\n`
  summary += `- Branschrelaterade träffar: ${insights.industryMentions}\n`
  summary += `- Senaste nyheter (6 mån): ${insights.hasRecentNews ? 'Ja' : 'Nej'}\n\n`

  // Sentiment
  if (insights.sentimentIndicators.positive.length > 0) {
    summary += `POSITIVA SIGNALER: ${insights.sentimentIndicators.positive.join(', ')}\n`
  }
  if (insights.sentimentIndicators.negative.length > 0) {
    summary += `⚠️ NEGATIVA SIGNALER: ${insights.sentimentIndicators.negative.join(', ')}\n`
  }

  // AI guidance based on findings
  summary += '\nAI GUIDANCE:\n'
  if (insights.sentimentIndicators.negative.length > 2) {
    summary += '⚠️ VARNING: Flera negativa nyckelord hittade. Undersök noggrannt!\n'
  }
  if (data.totalResults < 100) {
    summary += '⚠️ Låg online-närvaro (< 100 sökträffar). Kan indikera begränsad varumärkesstyrka.\n'
  }
  if (!insights.hasRecentNews) {
    summary += '⚠️ Inga senaste nyheter (6 mån). Företaget kan vara inaktivt eller ha låg PR-aktivitet.\n'
  }
  if (insights.sentimentIndicators.positive.length > 3 && insights.hasRecentNews) {
    summary += '✓ Starkt varumärke med positiv publicitet och recent aktivitet.\n'
  }

  return summary
}

