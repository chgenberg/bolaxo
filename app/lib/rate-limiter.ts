/**
 * In-memory Rate Limiter
 * Tracks requests per IP and user without external services
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  message?: string
}

// Store: key = "ip:timestamp" or "userId:timestamp"
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Get client IP from request
 */
export function getClientIp(request?: Request): string {
  if (!request) {
    return 'unknown'
  }

  // Some build/runtime environments provide a plain object instead of the Headers API.
  const headers = (request as any).headers
  if (!headers) {
    return 'unknown'
  }

  try {
    if (typeof headers.get === 'function') {
      const forwardedFor = headers.get('x-forwarded-for')
      if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
      }
      return headers.get('x-real-ip') || 'unknown'
    }

    // Fall back to object-style headers
    const normalizedHeaders: Record<string, string | string[] | undefined> =
      typeof headers === 'object' ? headers : {}
    const forwardedFor = normalizedHeaders['x-forwarded-for']
    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim()
    }
    if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
      return forwardedFor[0].split(',')[0].trim()
    }
    const realIp = normalizedHeaders['x-real-ip']
    if (typeof realIp === 'string') {
      return realIp
    }
    if (Array.isArray(realIp) && realIp.length > 0) {
      return realIp[0]
    }
  } catch (error) {
    console.warn('[RateLimiter] Failed to read client IP headers:', error)
  }

  return 'unknown'
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const resetTime = now + config.windowMs
  const key = `${identifier}:${Math.floor(now / config.windowMs)}`

  let entry = rateLimitStore.get(key)

  if (!entry) {
    entry = {
      count: 0,
      resetTime
    }
    rateLimitStore.set(key, entry)
  }

  entry.count++

  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)

  return {
    allowed,
    remaining,
    resetTime
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMIT_CONFIGS = {
  // Admin endpoints - strict limits
  admin: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100
  },
  
  // Listing creation/update - moderate
  listingWrite: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10
  },

  // Auth endpoints - very strict
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  },

  // General API endpoints - moderate
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30
  },

  // Search endpoints - moderate-high
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60
  },

  // Upload endpoints - very strict
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3
  }
}

/**
 * Get rate limit stats for monitoring
 */
export function getRateLimitStats() {
  return {
    totalTrackedIdentifiers: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([key, value]) => ({
      key,
      count: value.count,
      resetTime: new Date(value.resetTime).toISOString()
    }))
  }
}
