import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import ChatWidget from '@/components/ChatWidget'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { GlobalStructuredData } from '@/components/GlobalStructuredData'

export const metadata: Metadata = {
  title: {
    default: 'BOLAXO - Sveriges smartaste företagsförmedling',
    template: '%s | BOLAXO',
  },
  description: 'Sveriges smartaste företagsförmedling med AI-driven värdering, smart matchning och säker transaktionshantering. Verifierade uppgifter, NDA innan detaljer, kvalificerade köpare.',
  keywords: [
    'företagsförmedling',
    'köp företag',
    'sälj företag',
    'företagsvärdering',
    'SME försäljning',
    'företagsöverlåtelse',
    'företagsmäklare',
    'köpa företag Stockholm',
    'sälja företag Göteborg',
    'företagsvärdering gratis',
    'due diligence',
    'LOI',
    'SPA',
    'företagsaffär',
  ],
  authors: [{ name: 'BOLAXO' }],
  creator: 'BOLAXO',
  publisher: 'BOLAXO',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://bolaxo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://bolaxo.com',
    siteName: 'BOLAXO',
    title: 'BOLAXO - Sveriges smartaste företagsförmedling',
    description: 'Sveriges smartaste företagsförmedling med AI-driven värdering, smart matchning och säker transaktionshantering.',
    images: [
      {
        url: '/bolagsplatsen.png',
        width: 1200,
        height: 630,
        alt: 'BOLAXO - Företagsförmedling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOLAXO - Sveriges smartaste företagsförmedling',
    description: 'Sveriges smartaste företagsförmedling med AI-driven värdering och smart matchning.',
    images: ['/bolagsplatsen.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Lägg till verification codes här när de finns
    // google: 'verification-code',
    // yandex: 'verification-code',
    // bing: 'verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className="antialiased">
        <GlobalStructuredData />
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <Header />
              <div className="pt-24 md:pt-20 lg:pt-16">
                {children}
              </div>
              <Footer />
              <CookieConsent />
              <ChatWidget />
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

