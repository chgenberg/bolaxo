import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Fallback in-memory rate limiter om Upstash inte konfigurerat
class MemoryRateLimiter {
  private cache = new Map<string, { count: number; resetAt: number }>()

  async limit(identifier: string, requests: number, window: number): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now()
    const key = identifier
    const entry = this.cache.get(key)

    // Rensa gamla entries
    if (entry && entry.resetAt < now) {
      this.cache.delete(key)
    }

    const current = this.cache.get(key)

    if (!current) {
      this.cache.set(key, { count: 1, resetAt: now + window })
      return { success: true, remaining: requests - 1 }
    }

    if (current.count >= requests) {
      return { success: false, remaining: 0 }
    }

    current.count++
    this.cache.set(key, current)
    return { success: true, remaining: requests - current.count }
  }
}

// Skapa rate limiters
const memoryLimiter = new MemoryRateLimiter()

// Lazy initialization för Upstash - skapas först när behövs
let redis: Redis | null = null
let ratelimiters: Record<string, Ratelimit> = {}
let initialized = false

function initializeRateLimiters() {
  if (initialized) return
  initialized = true
  
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })

      // API rate limiters (olika limits för olika endpoints)
      ratelimiters = {
        auth: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 min
          analytics: true,
        }),
        valuation: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 värderingar per timme
          analytics: true,
        }),
        api: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 requests per minut
          analytics: true,
        }),
      }

      console.log('✓ Upstash rate limiting enabled')
    } catch (error) {
      console.log('⚠️ Upstash initialization failed, using in-memory rate limiting')
    }
  } else {
    console.log('⚠️ Upstash not configured, using in-memory rate limiting (not suitable for production)')
  }
}

// Helper functions
export async function checkRateLimit(
  identifier: string, 
  type: 'auth' | 'valuation' | 'api' = 'api'
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  
  // Initialize rate limiters on first use (lazy init)
  initializeRateLimiters()
  
  if (redis && ratelimiters[type]) {
    // Använd Upstash
    const result = await ratelimiters[type].limit(identifier)
    return result
  } else {
    // Fallback till memory
    const limits: Record<string, { requests: number; window: number }> = {
      auth: { requests: 5, window: 15 * 60 * 1000 },
      valuation: { requests: 3, window: 60 * 60 * 1000 },
      api: { requests: 30, window: 60 * 1000 },
    }
    
    const config = limits[type]
    const result = await memoryLimiter.limit(identifier, config.requests, config.window)
    
    return { 
      success: result.success, 
      remaining: result.remaining,
      limit: config.requests
    }
  }
}

// Rate limit decorator för API routes
export function withRateLimit(
  handler: (req: Request, ...args: any[]) => Promise<Response>,
  type: 'auth' | 'valuation' | 'api' = 'api'
) {
  return async (req: Request, ...args: any[]) => {
    // Safe header access
    let ip = 'unknown'
    let ua = ''
    
    try {
      if (req?.headers && typeof req.headers.get === 'function') {
        ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
        ua = req.headers.get('user-agent') || ''
      }
    } catch (e) {
      // Fallback if headers access fails
    }
    
    const identifier = `${ip}-${ua.slice(0, 50)}`

    const { success, remaining } = await checkRateLimit(identifier, type)

    if (!success) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          remaining: 0
        }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Add rate limit headers
    const response = await handler(req, ...args)
    
    if (remaining !== undefined) {
      const newResponse = new Response(response.body, response)
      newResponse.headers.set('X-RateLimit-Remaining', String(remaining))
      return newResponse
    }

    return response
  }
}

