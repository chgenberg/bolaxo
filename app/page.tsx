'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronRight, Building2, FileText, Users, TrendingUp, Shield, Clock, ArrowRight, Menu, X } from 'lucide-react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="bg-white">
      {/* Hero Section - Clean and Professional */}
      <section className="bg-gradient-to-b from-[#E8F4F8] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-[#003366] mb-4">
              Sveriges marknadsledande plattform för företagsöverlåtelser
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Köp eller sälj företag – snabbt, säkert och transparent
            </p>
              </div>
              
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sök bland företag till salu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#1F3C58] focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1F3C58] text-white px-6 py-2 rounded-md hover:bg-[#2D4A66] transition-colors">
                Sök
              </button>
            </div>
              </div>
              
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <Link 
              href="/salja" 
              className="w-full sm:w-auto bg-[#1F3C58] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2D4A66] transition-colors flex items-center justify-center gap-2"
            >
              Sälj ditt företag
              <ArrowRight className="w-5 h-5" />
            </Link>
                <Link 
                  href="/kopare" 
              className="w-full sm:w-auto bg-white text-[#1F3C58] border-2 border-[#1F3C58] px-8 py-4 rounded-lg font-semibold hover:bg-[#F0F7FA] transition-colors flex items-center justify-center gap-2"
            >
              Köp företag
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/vardering" 
              className="w-full sm:w-auto bg-[#E8F4F8] text-[#1F3C58] px-8 py-4 rounded-lg font-semibold hover:bg-[#D5E9F0] transition-colors flex items-center justify-center gap-2"
            >
              Värdera gratis
              <ArrowRight className="w-5 h-5" />
                </Link>
          </div>
        </div>
      </section>

      {/* Services Grid - Clean Cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003366] text-center mb-12">
            Vad vill du göra?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Cards */}
            <Link href="/salja/start" className="group">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-[#1F3C58]">
                <div className="w-12 h-12 bg-[#E8F4F8] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1F3C58] transition-colors">
                  <Building2 className="w-6 h-6 text-[#1F3C58] group-hover:text-white" />
                  </div>
                <h3 className="font-semibold text-lg mb-2 text-[#003366]">Starta säljprocess</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Kom igång med att sälja ditt företag på bara några minuter
                </p>
                <span className="text-[#1F3C58] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Kom igång
                  <ChevronRight className="w-4 h-4" />
                </span>
                  </div>
            </Link>

            <Link href="/vardering" className="group">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-[#1F3C58]">
                <div className="w-12 h-12 bg-[#E8F4F8] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1F3C58] transition-colors">
                  <TrendingUp className="w-6 h-6 text-[#1F3C58] group-hover:text-white" />
                  </div>
                <h3 className="font-semibold text-lg mb-2 text-[#003366]">Värdera företaget</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Få en professionell värdering av ditt företag kostnadsfritt
                </p>
                <span className="text-[#1F3C58] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Starta värdering
                  <ChevronRight className="w-4 h-4" />
                </span>
                  </div>
            </Link>

            <Link href="/sok" className="group">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-[#1F3C58]">
                <div className="w-12 h-12 bg-[#E8F4F8] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1F3C58] transition-colors">
                  <Search className="w-6 h-6 text-[#1F3C58] group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#003366]">Sök företag</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Hitta företag till salu som matchar dina kriterier
                </p>
                <span className="text-[#1F3C58] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Börja söka
                  <ChevronRight className="w-4 h-4" />
                </span>
                  </div>
            </Link>

            <Link href="/kom-igang" className="group">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-[#1F3C58]">
                <div className="w-12 h-12 bg-[#E8F4F8] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1F3C58] transition-colors">
                  <FileText className="w-6 h-6 text-[#1F3C58] group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#003366]">Guider & mallar</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Allt du behöver veta om företagsöverlåtelser
                </p>
                <span className="text-[#1F3C58] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Läs mer
                  <ChevronRight className="w-4 h-4" />
                </span>
          </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24 bg-[#F8FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003366] text-center mb-12">
            Varför välja BOLAXO?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#1F3C58] mb-2">500+</div>
              <div className="text-gray-600">Genomförda affärer</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#1F3C58] mb-2">98%</div>
              <div className="text-gray-600">Nöjda användare</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#1F3C58] mb-2">60</div>
              <div className="text-gray-600">Dagar till avslut i snitt</div>
            </div>
          </div>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <Shield className="w-10 h-10 text-[#1F3C58] mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-[#003366]">100% Säkert</h3>
              <p className="text-gray-600 text-sm">
                Bank-ID verifiering, krypterad kommunikation och säker dokumenthantering
              </p>
                  </div>
            <div className="bg-white p-6 rounded-lg">
              <Clock className="w-10 h-10 text-[#1F3C58] mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-[#003366]">Snabb process</h3>
              <p className="text-gray-600 text-sm">
                Från registrering till avslut på rekordtid med våra digitala verktyg
              </p>
                  </div>
            <div className="bg-white p-6 rounded-lg">
              <Users className="w-10 h-10 text-[#1F3C58] mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-[#003366]">Smart matchning</h3>
              <p className="text-gray-600 text-sm">
                AI-driven matchning hittar rätt köpare för just ditt företag
              </p>
                </div>
          </div>
        </div>
      </section>

      {/* Information Sections */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-6">
                Professionell företagsvärdering på 5 minuter
            </h2>
              <p className="text-gray-600 mb-6">
                Vår AI-drivna värderingsmotor analyserar ditt företag från flera perspektiv och ger dig ett marknadsmässigt värdeintervall direkt. Perfekt som utgångspunkt för din försäljning.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700">Baserat på verkliga transaktioner</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                  <span className="text-gray-700">Branschanpassade multiplar</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700">Detaljerad PDF-rapport</span>
                </li>
              </ul>
              <Link 
                href="/vardering" 
                className="inline-flex items-center gap-2 bg-[#1F3C58] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2D4A66] transition-colors"
              >
                Starta värdering
                <ArrowRight className="w-5 h-5" />
              </Link>
                </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="/hero.png"
                alt="Företagsvärdering"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 md:py-24 bg-[#F8FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003366] text-center mb-12">
            Så fungerar det
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#1F3C58]">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2 text-[#003366]">Registrera</h3>
              <p className="text-gray-600 text-sm">
                Skapa konto med BankID på 2 minuter
                      </p>
                    </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#1F3C58]">
                2
                        </div>
              <h3 className="font-semibold text-lg mb-2 text-[#003366]">Värdera</h3>
              <p className="text-gray-600 text-sm">
                Få professionell värdering direkt
                      </p>
                    </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#1F3C58]">
                3
                        </div>
              <h3 className="font-semibold text-lg mb-2 text-[#003366]">Matcha</h3>
              <p className="text-gray-600 text-sm">
                Vi hittar rätt köpare åt dig
                      </p>
                    </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#1F3C58]">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2 text-[#003366]">Genomför</h3>
              <p className="text-gray-600 text-sm">
                Säker process hela vägen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#1F3C58]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Redo att komma igång?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Registrera dig gratis och börja din resa mot en lyckad företagsaffär
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/registrera" 
              className="bg-white text-[#1F3C58] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Skapa konto
            </Link>
            <Link 
              href="/kontakt" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Kontakta oss
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}