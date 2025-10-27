import type { Metadata } from 'next'
import './globals.css'

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
  return (
    <html lang="sv">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

