import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'

export const metadata: Metadata = {
  title: 'Bolagsplatsen - Sälj ditt företag tryggt och enkelt',
  description: 'Verifierade uppgifter, NDA innan detaljer, kvalificerade köpare.',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (typeof window !== 'undefined') {
    console.log('🔵 [LAYOUT] RootLayout rendering on client')
  }

  return (
    <html lang="sv">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {typeof window !== 'undefined' && console.log('🟢 [LAYOUT] AuthProvider mounted')}
          <ToastProvider>
            {typeof window !== 'undefined' && console.log('🟡 [LAYOUT] ToastProvider mounted')}
            <Header />
            {typeof window !== 'undefined' && console.log('🟣 [LAYOUT] Header rendered')}
            {children}
            {typeof window !== 'undefined' && console.log('🔵 [LAYOUT] Children rendered')}
            <Footer />
            {typeof window !== 'undefined' && console.log('🟠 [LAYOUT] Footer rendered')}
            <CookieConsent />
            {typeof window !== 'undefined' && console.log('🟤 [LAYOUT] CookieConsent rendered')}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

