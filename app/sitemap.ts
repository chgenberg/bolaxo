import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SWEDISH_CITIES } from '@/lib/cities'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bolaxo.com'

// Static pages with high priority
const staticPages = [
  { url: '', priority: 1.0, changefreq: 'daily' },
  { url: '/sok', priority: 0.9, changefreq: 'daily' },
  { url: '/priser', priority: 0.9, changefreq: 'monthly' },
  { url: '/om-oss', priority: 0.8, changefreq: 'monthly' },
  { url: '/kontakt', priority: 0.7, changefreq: 'monthly' },
  { url: '/faq', priority: 0.8, changefreq: 'weekly' },
  { url: '/blogg', priority: 0.8, changefreq: 'daily' },
  { url: '/success-stories', priority: 0.8, changefreq: 'weekly' },
  { url: '/for-maklare', priority: 0.8, changefreq: 'monthly' },
  { url: '/investor', priority: 0.7, changefreq: 'monthly' },
  { url: '/partners', priority: 0.7, changefreq: 'monthly' },
  { url: '/karriar', priority: 0.6, changefreq: 'monthly' },
  { url: '/onepager', priority: 0.9, changefreq: 'monthly' },
  { url: '/kom-igang', priority: 0.9, changefreq: 'monthly' },
  
  // Köparflöden
  { url: '/kopare', priority: 0.9, changefreq: 'daily' },
  { url: '/kopare/start', priority: 0.8, changefreq: 'monthly' },
  { url: '/kopare/sa-fungerar-det', priority: 0.8, changefreq: 'monthly' },
  { url: '/kopare/preferenser', priority: 0.7, changefreq: 'monthly' },
  { url: '/kopare/verifiering', priority: 0.6, changefreq: 'monthly' },
  
  // Säljarflöden
  { url: '/salja', priority: 0.9, changefreq: 'daily' },
  { url: '/salja/start', priority: 0.8, changefreq: 'monthly' },
  { url: '/salja/onboarding', priority: 0.7, changefreq: 'monthly' },
  { url: '/salja/priser', priority: 0.8, changefreq: 'monthly' },
  { url: '/salja/styrkor-risker', priority: 0.7, changefreq: 'monthly' },
  { url: '/salja/sme-kit', priority: 0.8, changefreq: 'monthly' },
  
  // Juridiska sidor
  { url: '/juridiskt/integritetspolicy', priority: 0.5, changefreq: 'yearly' },
  { url: '/juridiskt/anvandarvillkor', priority: 0.5, changefreq: 'yearly' },
  { url: '/juridiskt/cookies', priority: 0.4, changefreq: 'yearly' },
  { url: '/juridiskt/gdpr', priority: 0.5, changefreq: 'yearly' },
  
  // Värdering
  { url: '/vardering', priority: 0.9, changefreq: 'daily' },
  { url: '/vardering/demo', priority: 0.7, changefreq: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static pages
  staticPages.forEach(page => {
    sitemapEntries.push({
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changefreq as any,
      priority: page.priority,
    })
  })

  // Add city-based routes for köpare och säljare
  SWEDISH_CITIES.forEach(city => {
    sitemapEntries.push({
      url: `${baseUrl}/kopare/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    })
    
    sitemapEntries.push({
      url: `${baseUrl}/saljare/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    })
  })

  // Add active listings (only public, active listings)
  try {
    const activeListings = await prisma.listing.findMany({
      where: {
        status: 'active',
      },
      select: {
        id: true,
        updatedAt: true,
      },
      take: 1000, // Limit to 1000 most recent listings
      orderBy: {
        updatedAt: 'desc',
      },
    })

    activeListings.forEach(listing => {
      sitemapEntries.push({
        url: `${baseUrl}/objekt/${listing.id}`,
        lastModified: listing.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  } catch (error) {
    console.error('Error fetching listings for sitemap:', error)
    // Continue without listings if database fails
  }

  return sitemapEntries
}

