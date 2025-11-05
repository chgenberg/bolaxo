import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['sv', 'en'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    console.error('❌ [i18n] Invalid locale:', locale)
    notFound()
  }

  try {
    const messages = (await import(`./messages/${locale}.json`)).default
    return {
      locale: locale as string,
      messages
    }
  } catch (error) {
    console.error('❌ [i18n] Error loading messages for locale:', locale, error)
    notFound()
  }
})
