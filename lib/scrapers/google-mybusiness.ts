import * as cheerio from 'cheerio'

interface GoogleMyBusinessData {
  companyName: string
  rating?: {
    average: number // 1-5
    totalReviews: number
    distribution?: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
  address?: string
  phone?: string
  website?: string
  category?: string
  hours?: {
    [key: string]: string
  }
  attributes?: string[] // e.g., "Wheelchair accessible", "Good for kids"
  popularTimes?: {
    [day: string]: number[] // Hourly popularity 0-100
  }
  priceLevel?: number // 1-4 ($ to $$$$)
  photos?: number
  claimed?: boolean
  responseRate?: string
  responseTime?: string
  brandStrength?: {
    score: number
    factors: {
      rating: number
      reviews: number
      claimed: number
      engagement: number
    }
  }
  source: 'google_mybusiness'
}

export async function scrapeGoogleMyBusiness(
  companyName: string,
  address?: string
): Promise<GoogleMyBusinessData | null> {
  try {
    // Build search query
    let searchQuery = companyName
    if (address) {
      // Add city/country for better matching
      const addressParts = address.split(',')
      if (addressParts.length > 0) {
        searchQuery += ' ' + addressParts[addressParts.length - 1].trim()
      }
    }
    
    // Google Maps search URL
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`
    
    console.log(`Scraping Google My Business: ${searchUrl}`)
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
        'Referer': 'https://www.google.com/',
      },
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      console.log(`Google Maps returned ${response.status}`)
      return null
    }
    
    const html = await response.text()
    
    return parseGoogleMapsData(html, companyName)
    
  } catch (error) {
    console.error('Google My Business scraping error:', error)
    return null
  }
}

function parseGoogleMapsData(html: string, companyName: string): GoogleMyBusinessData | null {
  const $ = cheerio.load(html)
  
  const result: GoogleMyBusinessData = {
    companyName,
    source: 'google_mybusiness',
  }
  
  // Google Maps uses a lot of JavaScript rendering, but we can extract from:
  // 1. Meta tags
  // 2. Embedded JSON-LD
  // 3. Initial data scripts
  
  // Try to find JSON-LD structured data
  $('script[type="application/ld+json"]').each((_, script) => {
    try {
      const jsonText = $(script).html()
      if (jsonText) {
        const data = JSON.parse(jsonText)
        
        // LocalBusiness schema
        if (data['@type'] === 'LocalBusiness' || data['@type'] === 'Organization') {
          if (data.aggregateRating) {
            result.rating = {
              average: parseFloat(data.aggregateRating.ratingValue) || 0,
              totalReviews: parseInt(data.aggregateRating.reviewCount) || 0,
            }
          }
          
          if (data.address) {
            if (typeof data.address === 'string') {
              result.address = data.address
            } else if (data.address.streetAddress) {
              result.address = `${data.address.streetAddress}, ${data.address.addressLocality || ''}`
            }
          }
          
          if (data.telephone) {
            result.phone = data.telephone
          }
          
          if (data.url || data.website) {
            result.website = data.url || data.website
          }
          
          if (data.priceRange) {
            result.priceLevel = data.priceRange.length // $, $$, $$$, $$$$
          }
        }
      }
    } catch (e) {
      // Skip invalid JSON
    }
  })
  
  // Extract rating from various text patterns
  if (!result.rating) {
    const ratingPatterns = [
      /([\d.]+)\s*(?:stjärnor?|stars?)[^\d]+([\d,]+)\s*(?:recensioner|reviews)/i,
      /([\d.]+)[★⭐].*?([\d,]+)\s*(?:recensioner|reviews)/i,
      /rating[:\s]+([\d.]+).*?([\d,]+)\s*reviews/i,
    ]
    
    for (const pattern of ratingPatterns) {
      const match = html.match(pattern)
      if (match && match[1] && match[2]) {
        result.rating = {
          average: parseFloat(match[1]),
          totalReviews: parseInt(match[2].replace(/,/g, '')),
        }
        break
      }
    }
  }
  
  // Extract from meta description
  const metaDesc = $('meta[name="description"]').attr('content') || ''
  if (!result.rating && metaDesc) {
    const match = metaDesc.match(/([\d.]+).*?([\d,]+)\s*reviews/i)
    if (match) {
      result.rating = {
        average: parseFloat(match[1]),
        totalReviews: parseInt(match[2].replace(/,/g, '')),
      }
    }
  }
  
  // Extract category
  const categoryMatch = html.match(/(?:category|typ)[:\s]*([^·\n|]+)/i) ||
                       metaDesc.match(/^([^·]+)/)
  if (categoryMatch && categoryMatch[1]) {
    const category = categoryMatch[1].trim()
    if (category.length > 3 && category.length < 100) {
      result.category = category
    }
  }
  
  // Extract phone (various formats)
  if (!result.phone) {
    const phonePatterns = [
      /(?:tel|phone|telefon)[:\s]+([\d\s+()-]+)/i,
      /(\+\d{1,3}[\s-]?\d{2,3}[\s-]?\d{3}[\s-]?\d{2,4})/,
      /(\d{3}[\s-]\d{3}[\s-]\d{2}[\s-]\d{2})/,
    ]
    
    for (const pattern of phonePatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        result.phone = match[1].trim()
        break
      }
    }
  }
  
  // Extract attributes (Google My Business attributes)
  const attributes: string[] = []
  const attributePatterns = [
    /wheelchair accessible/i,
    /good for kids/i,
    /outdoor seating/i,
    /takeout/i,
    /delivery/i,
    /dine-in/i,
    /accepts credit cards/i,
    /free wi-fi/i,
    /parking/i,
  ]
  
  attributePatterns.forEach(pattern => {
    if (pattern.test(html)) {
      attributes.push(pattern.source.replace(/\\/g, '').replace(/i$/, ''))
    }
  })
  
  if (attributes.length > 0) {
    result.attributes = attributes
  }
  
  // Extract claimed status
  if (html.includes('Claimed') || html.includes('Verified') || html.includes('Verifierad')) {
    result.claimed = true
  }
  
  // Extract response info (for businesses that respond to reviews)
  const responseMatch = html.match(/responds?\s+in\s+(?:about\s+)?(\d+\s+\w+)/i) ||
                       html.match(/svarar\s+(?:vanligtvis\s+)?inom\s+(\d+\s+\w+)/i)
  if (responseMatch && responseMatch[1]) {
    result.responseTime = responseMatch[1]
  }
  
  // Only return if we have at least a rating
  if (!result.rating || result.rating.totalReviews === 0) {
    console.log('Google My Business: No review data found')
    return null
  }
  
  console.log(`✓ Google My Business scraped for ${companyName}:`, {
    rating: result.rating.average,
    reviews: result.rating.totalReviews,
    category: result.category,
    claimed: result.claimed,
  })
  
  return result
}

// Helper: Calculate brand strength score based on Google data
export function calculateBrandStrength(data: GoogleMyBusinessData): {
  score: number // 0-100
  factors: {
    rating: number
    reviews: number
    claimed: number
    engagement: number
  }
} {
  const factors = {
    rating: 0,
    reviews: 0,
    claimed: 0,
    engagement: 0,
  }
  
  if (data.rating) {
    // Rating score (0-40 points)
    factors.rating = (data.rating.average / 5) * 40
    
    // Review count score (0-30 points)
    // Logarithmic scale: 10 reviews = 15pts, 100 = 25pts, 1000+ = 30pts
    const reviewCount = data.rating.totalReviews
    if (reviewCount >= 1000) {
      factors.reviews = 30
    } else if (reviewCount >= 100) {
      factors.reviews = 25
    } else if (reviewCount >= 50) {
      factors.reviews = 20
    } else if (reviewCount >= 10) {
      factors.reviews = 15
    } else if (reviewCount >= 5) {
      factors.reviews = 10
    } else {
      factors.reviews = 5
    }
  }
  
  // Claimed (0-15 points)
  if (data.claimed) {
    factors.claimed = 15
  }
  
  // Engagement (0-15 points)
  if (data.responseTime) {
    factors.engagement = 15
  } else if (data.attributes && data.attributes.length > 3) {
    factors.engagement = 10
  }
  
  const score = factors.rating + factors.reviews + factors.claimed + factors.engagement
  
  return {
    score: Math.round(score),
    factors,
  }
}

