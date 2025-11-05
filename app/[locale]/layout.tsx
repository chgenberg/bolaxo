import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import ChatWidget from '@/components/ChatWidget'
import ErrorBoundary from '@/components/ErrorBoundary'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Load messages for the locale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            <Header />
            <main>{children}</main>
            <Footer />
            <CookieConsent />
            <ChatWidget />
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}