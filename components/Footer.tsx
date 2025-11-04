'use client'

import Link from 'next/link'
import { Facebook, Linkedin, Youtube, Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-[#00524B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Kontakt och hjälp */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontakt och hjälp</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kontakt" className="text-sm hover:underline">
                  Kontakta oss
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:underline">
                  Vanliga frågor
                </Link>
              </li>
              <li>
                <Link href="/juridiskt/support" className="text-sm hover:underline">
                  Support & rådgivning
                </Link>
              </li>
            </ul>
          </div>

          {/* Tjänster */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Våra tjänster</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vardering" className="text-sm hover:underline">
                  Företagsvärdering
                </Link>
              </li>
              <li>
                <Link href="/juridiskt/due-diligence" className="text-sm hover:underline">
                  Due Diligence-stöd
                </Link>
              </li>
              <li>
                <Link href="/juridiskt/mallar" className="text-sm hover:underline">
                  Juridiska mallar
                </Link>
              </li>
              <li>
                <Link href="/priser" className="text-sm hover:underline">
                  Priser & paket
                </Link>
              </li>
            </ul>
          </div>

          {/* Om oss */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Om oss</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/om-oss" className="text-sm hover:underline">
                  Om BOLAXO
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-sm hover:underline">
                  Success stories
                </Link>
              </li>
              <li>
                <Link href="/juridiskt/integritetspolicy" className="text-sm hover:underline">
                  Behandling av personuppgifter
                </Link>
              </li>
              <li>
                <Link href="/juridiskt/anvandarvillkor" className="text-sm hover:underline">
                  Användarvillkor
                </Link>
              </li>
              <li>
                <Link href="/juridiskt/gdpr" className="text-sm hover:underline">
                  GDPR & säkerhet
                </Link>
              </li>
              <li>
                <Link href="/juridiskt/cookies" className="text-sm hover:underline">
                  Kakor (cookies)
                </Link>
              </li>
            </ul>
          </div>

          {/* Följ oss */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Följ oss</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://facebook.com/bolaxo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:underline flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/bolaxo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:underline flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/bolaxo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:underline flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://youtube.com/@bolaxo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:underline flex items-center gap-2"
                >
                  <Youtube className="w-4 h-4" />
                  YouTube
                </a>
              </li>
              <li>
                <Link href="/blogg" className="text-sm hover:underline">
                  Företagsbloggen
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/20 pt-8">
          <div className="text-center text-sm">
            <p className="mb-4">Ett samarbete mellan</p>
            <div className="flex justify-center items-center gap-8 mb-4">
              <span className="font-semibold text-lg">BOLAXO</span>
              <span className="text-white/60">•</span>
              <span className="font-semibold">Sveriges ledande plattform för företagsöverlåtelser</span>
            </div>
            <p className="text-xs text-white/80">
              © {currentYear} BOLAXO AB. Org.nr: 559123-4567. Norrmälarstrand 10, 114 62 Stockholm
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}