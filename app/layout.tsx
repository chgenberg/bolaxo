import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import ChatWidget from '@/components/ChatWidget'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import PasswordProtection from '@/components/PasswordProtection'

export const metadata: Metadata = {
  title: 'BOLAXO - Sveriges smartaste företagsförmedling',
  description: 'Verifierade uppgifter, NDA innan detaljer, kvalificerade köpare.',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
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
        <PasswordProtection>
          <AuthProvider>
            <ToastProvider>
              <Header />
              {children}
              <Footer />
              <CookieConsent />
              <ChatWidget />
            </ToastProvider>
          </AuthProvider>
        </PasswordProtection>
      </body>
    </html>
  )
}

