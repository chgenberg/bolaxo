import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  // Remove dangerous HTML/scripts
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML allowed in user input
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true // Keep text content
  })
  
  // Trim whitespace
  return cleaned.trim()
}

/**
 * Sanitize HTML content (allows some safe tags)
 */
export function sanitizeHTML(html: string): string {
  if (!html) return ''
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  })
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    const value = sanitized[key]
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value) as any
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value) as any
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: any) => 
        typeof item === 'string' ? sanitizeInput(item) : 
        typeof item === 'object' ? sanitizeObject(item) : item
      ) as any
    }
  }
  
  return sanitized
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate Swedish org number
 */
export function isValidOrgNumber(orgNumber: string): boolean {
  const cleaned = orgNumber.replace(/\D/g, '')
  return cleaned.length === 10
}

/**
 * Validate URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize and validate common inputs
 */
export function validateAndSanitize(data: {
  email?: string
  orgNumber?: string
  website?: string
  [key: string]: any
}): { valid: boolean; errors: string[]; sanitized: any } {
  const errors: string[] = []
  const sanitized = sanitizeObject(data)

  if (data.email && !isValidEmail(data.email)) {
    errors.push('Ogiltig e-postadress')
  }

  if (data.orgNumber && !isValidOrgNumber(data.orgNumber)) {
    errors.push('Ogiltigt organisationsnummer (ska vara 10 siffror)')
  }

  if (data.website && data.website.trim() && !isValidURL(data.website)) {
    errors.push('Ogiltig URL')
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized
  }
}

