import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin, Calendar } from 'lucide-react'

const footerLinks = {
  sellers: {
    title: 'För säljare',
    links: [
      { label: 'Så fungerar det', href: '/salja' },
      { label: 'Börja sälja', href: '/salja/start' },
      { label: 'Priser', href: '/priser' },
      { label: 'Success stories', href: '/success-stories' },
    ],
  },
  buyers: {
    title: 'För köpare',
    links: [
      { label: 'Sök företag', href: '/sok' },
      { label: 'Så fungerar det', href: '/kopare' },
      { label: 'Skapa konto', href: '/kopare/start' },
      { label: 'För mäklare', href: '/for-maklare' },
    ],
  },
  company: {
    title: 'Om BOLAXO',
    links: [
      { label: 'Om oss', href: '/om-oss' },
      { label: 'För investerare', href: '/investor' },
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'Blogg', href: '/blogg' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  legal: {
    title: 'Juridiskt',
    links: [
      { label: 'Användarvillkor', href: '/juridiskt/anvandarvillkor' },
      { label: 'Integritetspolicy', href: '/juridiskt/integritetspolicy' },
      { label: 'Cookies', href: '/juridiskt/cookies' },
      { label: 'GDPR', href: '/juridiskt/gdpr' },
    ],
  },
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
]

const trustBadges = [
  { src: '/bankid.svg', alt: 'BankID' },
  { src: '/gdpr.svg', alt: 'GDPR' },
  { src: '/ssl.svg', alt: 'SSL' },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/BOLAXO_logo.png" 
                alt="BOLAXO" 
                width={140} 
                height={40}
                className="h-10 w-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            <p className="text-text-gray leading-relaxed">
              Automatiserad marknadsplats som förenklar hela affärsprocessen. 
              Från värdering till signering – vi automatiserar det komplexa så du kan fokusera på det viktiga.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a href="tel:+46812345678" className="flex items-center text-text-gray hover:text-primary-blue transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                08-123 456 78
              </a>
              <a href="mailto:info@bolaxo.se" className="flex items-center text-text-gray hover:text-primary-blue transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                info@bolaxo.se
              </a>
              <div className="flex items-start text-text-gray">
                <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                <span>
                  Regeringsgatan 38<br />
                  111 56 Stockholm
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-text-dark mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-text-gray hover:text-primary-blue transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 pt-12 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Boka demo CTA */}
            <div className="bg-primary-blue rounded-2xl p-8 text-white">
              <h3 className="font-semibold text-2xl mb-2">Vill du veta mer?</h3>
              <p className="mb-6 opacity-90">Boka en gratis demo och se hur BOLAXO kan hjälpa dig sälja eller köpa företag.</p>
              <Link
                href="https://cal.com/bolaxo/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-blue rounded-button font-medium hover:shadow-lg transition-all"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Boka en demo
              </Link>
            </div>
            
            {/* Newsletter */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-semibold text-text-dark mb-2">Prenumerera på vårt nyhetsbrev</h3>
              <p className="text-text-gray mb-6">Få tips och nyheter om företagsförsäljning direkt i inkorgen.</p>
              <form className="flex gap-3">
                <input
                  type="email"
                  placeholder="Din e-postadress"
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Prenumerera
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-text-gray">
              © {new Date().getFullYear()} BOLAXO. Alla rättigheter förbehållna.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-light-blue/20 flex items-center justify-center hover:bg-primary-blue hover:text-white transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-gray mr-2">Säkrad av:</span>
              {trustBadges.map((badge) => (
                <div key={badge.alt} className="w-12 h-12 bg-gray-100 rounded-button flex items-center justify-center">
                  <span className="text-xs text-text-gray">{badge.alt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}