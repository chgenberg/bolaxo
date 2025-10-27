'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Footer() {
  console.log('🔵 [FOOTER] Rendering...')
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-primary-navy text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/BOLAXO_logo.png" 
                alt="BOLAXO" 
                width={130} 
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Sveriges moderna marknadsplats för företagsöverlåtelser. Vi förenar säljare och köpare med smarta matchningar och säker process.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a href="tel:+46123456789" className="flex items-center gap-3 text-gray-300 hover:text-accent-pink transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+46 (0) 123 456 789</span>
              </a>
              <a href="mailto:hej@bolaxo.se" className="flex items-center gap-3 text-gray-300 hover:text-accent-pink transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hej@bolaxo.se</span>
              </a>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Norrmälarstrand 10<br />Stockholm, 111 19<br />Sverige</span>
              </div>
            </div>
          </div>

          {/* För säljare */}
          <div>
            <h3 className="text-white font-bold text-base mb-6">För säljare</h3>
            <ul className="space-y-3">
              <li><Link href="/vardering" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Gratis värdering</Link></li>
              <li><Link href="/salja" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Så funkar det</Link></li>
              <li><Link href="/salja/start" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Börja sälja</Link></li>
              <li><Link href="/priser" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Priser & paket</Link></li>
              <li><Link href="/faq" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* För köpare */}
          <div>
            <h3 className="text-white font-bold text-base mb-6">För köpare</h3>
            <ul className="space-y-3">
              <li><Link href="/sok" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Sök företag</Link></li>
              <li><Link href="/kopare" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Så funkar det</Link></li>
              <li><Link href="/kopare/start" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Skapa konto</Link></li>
              <li><Link href="/success-stories" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Framgångshistorier</Link></li>
              <li><Link href="/blogg" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Blogg</Link></li>
            </ul>
          </div>

          {/* Om oss */}
          <div>
            <h3 className="text-white font-bold text-base mb-6">Om oss</h3>
            <ul className="space-y-3">
              <li><Link href="/om-oss" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Vårt företag</Link></li>
              <li><Link href="/for-maklare" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">För mäklare</Link></li>
              <li><Link href="/investor" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">För investerare</Link></li>
              <li><Link href="/kontakt" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Kontakt</Link></li>
              <li><Link href="/press" className="text-gray-300 text-sm hover:text-accent-pink transition-colors">Press</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Legal Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs text-gray-400">
            <Link href="/juridiskt" className="hover:text-white transition-colors">
              Juridiskt
            </Link>
            <Link href="/integritet" className="hover:text-white transition-colors">
              Integritetspolicy
            </Link>
            <Link href="/användarvillkor" className="hover:text-white transition-colors">
              Användarvillkor
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a 
              href="https://facebook.com/bolaxo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-pink transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/company/bolaxo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-pink transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/bolaxo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-pink transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs text-gray-400">
          <p>© {currentYear} BOLAXO AB. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  )
}