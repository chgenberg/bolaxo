import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['sv', 'en'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // If locale is undefined, use default locale (sv)
  // This can happen for static files or other edge cases
  const resolvedLocale = locale || 'sv'
  
  // Validate that the incoming `locale` parameter is valid
  if (!resolvedLocale || !locales.includes(resolvedLocale as Locale)) {
    console.error('❌ [i18n] Invalid locale:', resolvedLocale, '(original:', locale, ')')
    // Only call notFound() if we're actually in a locale route context
    // Don't break static files
    if (locale) {
      notFound()
    }
    // Fallback to default locale for edge cases
    return {
      locale: 'sv',
      messages: (await import('./messages/sv.json')).default
    }
  }

  try {
    const messages = (await import(`./messages/${resolvedLocale}.json`)).default
    return {
      locale: resolvedLocale as string,
      messages
    }
  } catch (error) {
    console.error('❌ [i18n] Error loading messages for locale:', resolvedLocale, error)
    // Fallback to default locale instead of crashing
    try {
      return {
        locale: 'sv',
        messages: (await import('./messages/sv.json')).default
      }
    } catch (fallbackError) {
      console.error('❌ [i18n] Critical error loading fallback messages:', fallbackError)
      notFound()
    }
  }
})
