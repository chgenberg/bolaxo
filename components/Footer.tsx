'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Shield, Users, Building2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-primary-navy text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/BOLAXO_logo.png" 
                alt="BOLAXO" 
                width={130} 
                height={40}
                className="h-10 md:h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 text-base md:text-sm leading-relaxed mb-6">
              Sveriges moderna marknadsplats för företagsöverlåtelser. Vi förenar säljare och köpare med smarta matchningar och säker process.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-base md:text-sm">
              <a href="tel:+46812345678" className="flex items-center gap-3 text-gray-300 hover:text-accent-pink transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+46 (0)8 123 456 78</span>
              </a>
              <a href="mailto:kontakt@bolaxo.se" className="flex items-center gap-3 text-gray-300 hover:text-accent-pink transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>kontakt@bolaxo.se</span>
              </a>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Norrmälarstrand 10<br />114 62 Stockholm<br />Sverige</span>
              </div>
            </div>
          </div>

          {/* För säljare */}
          <div>
            <h3 className="text-white font-bold text-lg md:text-base mb-6">För säljare</h3>
            <ul className="space-y-3">
              <li><Link href="/vardering" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Gratis värdering</Link></li>
              <li><Link href="/salja" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Så funkar det</Link></li>
              <li><Link href="/salja/start" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Börja sälja</Link></li>
              <li><Link href="/saljare" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Sälja i din stad</Link></li>
              <li><Link href="/priser" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Priser & paket</Link></li>
              <li><Link href="/faq" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* För köpare */}
          <div>
            <h3 className="text-white font-bold text-lg md:text-base mb-6">För köpare</h3>
            <ul className="space-y-3">
              <li><Link href="/sok" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Sök företag</Link></li>
              <li><Link href="/kopare" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Så funkar det</Link></li>
              <li><Link href="/kopare/start" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Skapa konto</Link></li>
              <li><Link href="/kopare" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Köp i din stad</Link></li>
              <li><Link href="/success-stories" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Framgångshistorier</Link></li>
              <li><Link href="/blogg" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Blogg</Link></li>
            </ul>
          </div>

          {/* Om oss */}
          <div>
            <h3 className="text-white font-bold text-lg md:text-base mb-6">Om oss</h3>
            <ul className="space-y-3">
              <li><Link href="/om-oss" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Vårt företag</Link></li>
              <li><Link href="/investor" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">För investerare</Link></li>
              <li><Link href="/kontakt" className="text-gray-300 text-base md:text-sm hover:text-accent-pink transition-colors">Kontakt</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-12"></div>

        {/* Trust Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* How it works */}
          <Link href="/salja" className="group">
            <div className="flex items-start gap-4 p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Users className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-bold mb-2 group-hover:text-accent-pink transition-colors">Så funkar Bolaxo</h4>
                <p className="text-gray-400 text-sm">Lär dig hur vår plattform förenar säljare och köpare</p>
              </div>
            </div>
          </Link>

          {/* Security */}
          <Link href="/juridiskt/integritetspolicy" className="group">
            <div className="flex items-start gap-4 p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Shield className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-bold mb-2 group-hover:text-accent-pink transition-colors">Säkerhet & Integritet</h4>
                <p className="text-gray-400 text-sm">Bank-nivå säkerhet för dina uppgifter och data</p>
              </div>
            </div>
          </Link>

          {/* Partners */}
          <Link href="/partners" className="group">
            <div className="flex items-start gap-4 p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Building2 className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-bold mb-2 group-hover:text-accent-pink transition-colors">Våra partners</h4>
                <p className="text-gray-400 text-sm">Samarbeten med ledande aktörer i finansvärlden</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Legal Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs text-gray-400">
            <Link href="/juridiskt/integritetspolicy" className="hover:text-white transition-colors">
              Integritetspolicy
            </Link>
            <Link href="/juridiskt/anvandarvillkor" className="hover:text-white transition-colors">
              Användarvillkor
            </Link>
            <Link href="/juridiskt/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
            <Link href="/juridiskt/gdpr" className="hover:text-white transition-colors">
              GDPR
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
