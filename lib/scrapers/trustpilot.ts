import * as cheerio from 'cheerio'

interface TrustpilotData {
  companyName: string
  trustScore?: {
    score: number // 1-5
    stars: number // 1-5 (same as score, for clarity)
    totalReviews: number
    reviewDistribution?: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
  trend?: {
    direction: 'improving' | 'stable' | 'declining'
    recentScore?: number // Last 30 days
  }
  businessInfo?: {
    website?: string
    location?: string
    claimedProfile: boolean
  }
  responseRate?: number // 0-100
  responseTime?: string
  verifiedReviews?: number
  ecommerceTrust?: {
    score: number
    level: 'excellent' | 'good' | 'fair' | 'poor'
    factors: {
      trustpilot: number
      google: number
      volume: number
    }
  }
  source: 'trustpilot'
}

export async function scrapeTrustpilot(
  companyName: string,
  website?: string
): Promise<TrustpilotData | null> {
  try {
    // Trustpilot URL format: trustpilot.com/review/domain.com
    // Or search: trustpilot.com/search?query=company+name
    
    let searchUrl: string
    
    if (website) {
      // Extract domain from website
      const domain = website
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .split('?')[0]
      
      // Try direct review page first
      searchUrl = `https://www.trustpilot.com/review/${domain}`
    } else {
      // Search by company name
      const query = encodeURIComponent(companyName)
      searchUrl = `https://www.trustpilot.com/search?query=${query}`
    }
    
    console.log(`Scraping Trustpilot: ${searchUrl}`)
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,sv;q=0.8',
        'Referer': 'https://www.trustpilot.com/',
      },
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      console.log(`Trustpilot returned ${response.status}`)
      return null
    }
    
    const html = await response.text()
    
    // Check if we're on a company review page or search results
    if (html.includes('TrustScore') || html.includes('star rating')) {
      return parseTrustpilotPage(html, companyName)
    } else if (html.includes('search results')) {
      // Parse search results and try first match
      return parseSearchResults(html, companyName, website)
    }
    
    return null
    
  } catch (error) {
    console.error('Trustpilot scraping error:', error)
    return null
  }
}

function parseTrustpilotPage(html: string, companyName: string): TrustpilotData | null {
  const $ = cheerio.load(html)
  
  const result: TrustpilotData = {
    companyName,
    source: 'trustpilot',
  }
  
  // Extract from JSON-LD structured data (most reliable)
  $('script[type="application/ld+json"]').each((_, script) => {
    try {
      const jsonText = $(script).html()
      if (jsonText) {
        const data = JSON.parse(jsonText)
        
        if (data['@type'] === 'Organization' && data.aggregateRating) {
          const rating = data.aggregateRating
          result.trustScore = {
            score: parseFloat(rating.ratingValue) || 0,
            stars: Math.round(parseFloat(rating.ratingValue) || 0),
            totalReviews: parseInt(rating.reviewCount) || 0,
          }
        }
      }
    } catch (e) {
      // Skip invalid JSON
    }
  })
  
  // Extract TrustScore from various patterns
  if (!result.trustScore) {
    // Pattern 1: "TrustScore 4.5"
    const scoreMatch = html.match(/TrustScore[:\s]+([\d.]+)/i) ||
                      html.match(/score[:\s]+([\d.]+)\s*out of 5/i) ||
                      html.match(/([\d.]+)\s*stars?/i)
    
    if (scoreMatch && scoreMatch[1]) {
      const score = parseFloat(scoreMatch[1])
      
      // Extract review count
      const reviewMatch = html.match(/([\d,]+)\s*(?:reviews?|anmeldelser)/i)
      const totalReviews = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 0
      
      result.trustScore = {
        score,
        stars: Math.round(score),
        totalReviews,
      }
    }
  }
  
  // Extract review distribution (1-5 stars breakdown)
  const distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  } = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  }
  
  // Try to find distribution data
  const distMatches = html.matchAll(/(\d+)\s*%?\s*(?:of|·)\s*(\d+)\s*(?:star|stjärn)/gi)
  for (const match of distMatches) {
    const stars = parseInt(match[2])
    const percentage = parseInt(match[1])
    if (stars >= 1 && stars <= 5) {
      distribution[stars as 1|2|3|4|5] = percentage
    }
  }
  
  if (result.trustScore && Object.values(distribution).some(v => v > 0)) {
    result.trustScore.reviewDistribution = distribution
  }
  
  // Extract claimed profile status
  const claimed = html.includes('Claimed profile') || 
                 html.includes('Verified') ||
                 html.includes('This company has claimed its profile')
  
  result.businessInfo = {
    claimedProfile: claimed,
  }
  
  // Extract website if shown
  const websiteMatch = html.match(/(?:Website|Hemsida)[:\s]+([^\s<"]+)/i) ||
                      html.match(/"url":"(https?:\/\/[^"]+)"/i)
  if (websiteMatch && websiteMatch[1]) {
    result.businessInfo.website = websiteMatch[1]
  }
  
  // Extract location
  const locationMatch = html.match(/(?:Location|Plats)[:\s]+([^<\n]+)/i)
  if (locationMatch && locationMatch[1]) {
    result.businessInfo.location = locationMatch[1].trim()
  }
  
  // Extract response rate
  const responseRateMatch = html.match(/(\d+)%\s*(?:response rate|svarsprocent)/i)
  if (responseRateMatch && responseRateMatch[1]) {
    result.responseRate = parseInt(responseRateMatch[1])
  }
  
  // Extract response time
  const responseTimeMatch = html.match(/(?:responds|svarar)\s+(?:in|inom)\s+([^<\n]+)/i)
  if (responseTimeMatch && responseTimeMatch[1]) {
    result.responseTime = responseTimeMatch[1].trim()
  }
  
  // Extract verified reviews count
  const verifiedMatch = html.match(/(\d+)\s*verified reviews?/i)
  if (verifiedMatch && verifiedMatch[1]) {
    result.verifiedReviews = parseInt(verifiedMatch[1])
  }
  
  // Determine trend (if recent score visible)
  const recentScoreMatch = html.match(/(?:last|senaste)\s+\d+\s+days?[:\s]+([\d.]+)/i)
  if (recentScoreMatch && result.trustScore) {
    const recentScore = parseFloat(recentScoreMatch[1])
    result.trend = {
      recentScore,
      direction: recentScore > result.trustScore.score ? 'improving' :
                recentScore < result.trustScore.score ? 'declining' : 'stable'
    }
  }
  
  // Only return if we got at least a score
  if (!result.trustScore || result.trustScore.totalReviews === 0) {
    console.log('Trustpilot: No review data found')
    return null
  }
  
  console.log(`✓ Trustpilot scraped for ${companyName}:`, {
    score: result.trustScore.score,
    reviews: result.trustScore.totalReviews,
    claimed: result.businessInfo?.claimedProfile,
    responseRate: result.responseRate,
  })
  
  return result
}

async function parseSearchResults(
  html: string,
  companyName: string,
  website?: string
): Promise<TrustpilotData | null> {
  const $ = cheerio.load(html)
  
  // Find first search result that matches company name
  let firstResultUrl: string | null = null
  
  $('a[href*="/review/"]').each((_, elem) => {
    const href = $(elem).attr('href')
    const text = $(elem).text().toLowerCase()
    const nameMatch = text.includes(companyName.toLowerCase())
    
    if (href && nameMatch && !firstResultUrl) {
      firstResultUrl = href.startsWith('http') ? href : `https://www.trustpilot.com${href}`
      return false // break
    }
  })
  
  if (!firstResultUrl) {
    console.log('Trustpilot: No matching company in search results')
    return null
  }
  
  // Fetch the actual review page
  try {
    console.log(`Following Trustpilot result: ${firstResultUrl}`)
    
    const response = await fetch(firstResultUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    })
    
    if (response.ok) {
      const pageHtml = await response.text()
      return parseTrustpilotPage(pageHtml, companyName)
    }
  } catch (err) {
    console.error('Failed to fetch Trustpilot page:', err)
  }
  
  return null
}

// Helper: Calculate e-commerce trust score (combines Trustpilot + Google)
export function calculateEcommerceTrust(
  trustpilot?: TrustpilotData,
  googleRating?: number,
  googleReviews?: number
): {
  score: number // 0-100
  level: 'excellent' | 'good' | 'fair' | 'poor'
  factors: {
    trustpilot: number
    google: number
    volume: number
  }
} {
  const factors = {
    trustpilot: 0,
    google: 0,
    volume: 0,
  }
  
  // Trustpilot score (0-50 points)
  if (trustpilot?.trustScore) {
    factors.trustpilot = (trustpilot.trustScore.score / 5) * 50
    
    // Bonus for high volume
    const reviews = trustpilot.trustScore.totalReviews
    if (reviews >= 500) {
      factors.volume += 15
    } else if (reviews >= 100) {
      factors.volume += 10
    } else if (reviews >= 50) {
      factors.volume += 5
    }
  }
  
  // Google score (0-30 points)
  if (googleRating && googleReviews) {
    factors.google = (googleRating / 5) * 30
    
    // Bonus for volume
    if (googleReviews >= 100) {
      factors.volume += 5
    } else if (googleReviews >= 50) {
      factors.volume += 3
    }
  }
  
  const score = Math.min(100, factors.trustpilot + factors.google + factors.volume)
  
  let level: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 80) level = 'excellent'
  else if (score >= 60) level = 'good'
  else if (score >= 40) level = 'fair'
  else level = 'poor'
  
  return { score: Math.round(score), level, factors }
}

