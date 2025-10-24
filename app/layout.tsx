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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Header />
            {children}
            <Footer />
            <CookieConsent />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

