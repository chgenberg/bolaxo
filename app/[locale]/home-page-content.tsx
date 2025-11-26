'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle, 
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Users,
  Search,
  FileText,
  Briefcase,
  Building2,
  UserCheck,
  Sparkles,
  Zap,
  Crown,
  Clock,
  FileCheck,
  HandshakeIcon
} from 'lucide-react'

export default function HomePageContent() {
  const locale = useLocale()

  return (
    <main className="bg-gray-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-8">
            Sälj, köp och sanitychecka företag
            <span className="block mt-2 text-navy/70">– på ett trovärdigt och transparent sätt.</span>
          </h1>
          
          {/* Intro Text */}
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
            Bolaxo (en del av AIFM) hjälper ägare, köpare och rådgivare genom hela resan: 
            från första tempmätning till annonsering och matchning. <strong>Inga success fees</strong> – bara tydliga paket.
          </p>
          
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href={`/${locale}/sanitycheck`}
              className="group relative inline-flex items-center justify-center gap-3 bg-navy text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:scale-105 animate-pulse-box"
            >
              <Sparkles className="w-5 h-5" />
              Starta gratis sanitycheck
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href={`/${locale}/sok`}
              className="group relative inline-flex items-center justify-center gap-3 bg-navy/10 text-navy font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:bg-navy/20 border-2 border-navy/20"
            >
              <Search className="w-5 h-5" />
              Utforska bolag till salu
              <span className="text-xs bg-navy/20 px-2 py-0.5 rounded-full">kommer snart</span>
            </Link>
          </div>
          
          {/* Secondary Links */}
          <div className="flex flex-wrap gap-6 justify-center">
            <Link 
              href={`/${locale}/salja`}
              className="text-navy font-semibold hover:text-navy/70 transition-colors flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Sälja företag
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href={`/${locale}/kopare`}
              className="text-navy font-semibold hover:text-navy/70 transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Köpa företag
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href={`/${locale}/sanitycheck`}
              className="text-navy font-semibold hover:text-navy/70 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Sanitycheck &amp; värderingsspann
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TRE SAKER INOM 10 SEKUNDER */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold text-navy/60 uppercase tracking-widest mb-4">
              Tre saker inom 10 sekunder
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">
              Det här ska kännas direkt när du landar
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Link href={`/${locale}/salja`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">Sälja via annons</h3>
                <p className="text-white/80 leading-relaxed">
                  Bolaxo blir annonstorget där du kan paketera och publicera din försäljning.
                </p>
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Läs mer</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            
            {/* Card 2 */}
            <Link href={`/${locale}/investerarprofil`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">Köpare hittar rätt case</h3>
                <p className="text-white/80 leading-relaxed">
                  Avancerade filter med fler KPI:er än bara omsättning, bransch och lönsamhet.
                </p>
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Skapa investerarprofil</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            
            {/* Card 3 */}
            <Link href={`/${locale}/sanitycheck`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">Sanitycheck light &amp; premium</h3>
                <p className="text-white/80 leading-relaxed">
                  Gratis tempmätning först – djupare analys och värderingsspann mot betalning.
                </p>
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Starta nu</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST - AIFM Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-navy text-white p-10 md:p-16 rounded-3xl text-center animate-pulse-box-navy">
            <span className="inline-block text-sm font-bold text-white/60 uppercase tracking-widest mb-4">
              Trust
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Bolaxo är en del av AIFM
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Plattformen utvecklas tillsammans med AIFM och erfarna rådgivare. 
              Kombinationen av fintech-logik och klassisk M&A-kompetens gör processen både trygg och effektiv.
            </p>
            <div className="mt-10 flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-white/60">
                <Shield className="w-5 h-5" />
                <span>Trygg process</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <TrendingUp className="w-5 h-5" />
                <span>Fintech-logik</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Users className="w-5 h-5" />
                <span>M&A-kompetens</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRE SPÅR - Välj din väg */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold text-navy/60 uppercase tracking-widest mb-4">
              Tre spår
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">
              Välj din väg
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sälja */}
            <Link href={`/${locale}/saljarprofil`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Jag vill sälja mitt bolag</h3>
                <p className="text-white/80 leading-relaxed">
                  Skapa din säljarprofil för att nå rätt köpare och mäklare.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Skapa säljarprofil</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            
            {/* Köpa */}
            <Link href={`/${locale}/investerarprofil`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Jag vill köpa bolag</h3>
                <p className="text-white/80 leading-relaxed">
                  Skapa din investerarprofil och få matchningar med rätt bolag.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Skapa profil</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            
            {/* Rådgivare */}
            <Link href={`/${locale}/for-maklare`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Jag är rådgivare/mäklare</h3>
                <p className="text-white/80 leading-relaxed">
                  SME Sales Automation Kit för struktur, scoring och white label-rapporter.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Läs mer</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* PAKET - Tre nivåer */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold text-navy/60 uppercase tracking-widest mb-4">
              Paket
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-4">
              Tre nivåer – utan success fees
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Freemium */}
            <Link href={`/${locale}/sanitycheck`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold">Freemium</h3>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Gratis</span>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Sanitycheck light med få frågor och övergripande feedback.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Grundläggande tempmätning
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Snabb överblick
                  </li>
                </ul>
              </div>
            </Link>
            
            {/* Bas */}
            <Link href={`/${locale}/priser`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Populär</span>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">Bas</h3>
                <p className="text-white/80 leading-relaxed">
                  Full sanitycheck, SWOT och indikativt värderingsspann.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Komplett sanitycheck
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    SWOT-analys
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Värderingsspann
                  </li>
                </ul>
              </div>
            </Link>
            
            {/* Premium */}
            <Link href={`/${locale}/priser`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] animate-pulse-box-navy">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Crown className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">Premium</h3>
                <p className="text-white/80 leading-relaxed">
                  Bas + fördjupade mallar, pitchdeck/teaser-stöd och mer guidning.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Allt i Bas
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Pitchdeck-mallar
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Personlig guidning
                  </li>
                </ul>
              </div>
            </Link>
          </div>
          
          {/* Disclaimer */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 text-sm leading-relaxed italic">
              Vi säger "vi anser" och visar intervall – aldrig tvärsäkra exakta belopp. 
              Vi uppmuntrar att ta in rådgivare inför skarpa förhandlingar.
            </p>
          </div>
        </div>
      </section>

      {/* JÄMFÖRELSE Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold text-navy/60 uppercase tracking-widest mb-4">
              Jämförelse
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">
              Hur Bolaxo skiljer sig från traditionella företagsmäklare
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Idag */}
            <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-700">Idag</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-500 text-sm">1</span>
                  </div>
                  <p className="text-gray-600">
                    Konsulter går in tidigt och börjar fakturera timmar.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-500 text-sm">2</span>
                  </div>
                  <p className="text-gray-600">
                    Mycket manuell insamling, svårt att se helheten.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-500 text-sm">3</span>
                  </div>
                  <p className="text-gray-600">
                    Ägaren vet inte alltid om tajmingen är rätt.
                  </p>
                </li>
              </ul>
            </div>
            
            {/* Med Bolaxo */}
            <div className="bg-navy text-white p-8 rounded-3xl animate-pulse-box-navy">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Med Bolaxo</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-white/90">
                    Digital sanitycheck först – en tydlig tempmätning.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-white/90">
                    Standardiserade mallar minskar tid och kostnad.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-white/90">
                    Du kan koppla på rådgivare när du själv vill.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-navy text-white p-10 md:p-16 rounded-3xl text-center animate-pulse-box-navy">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Redo att komma igång?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Starta med en gratis sanitycheck och få en första bild av var ditt företag står.
            </p>
            <Link
              href={`/${locale}/sanitycheck`}
              className="group inline-flex items-center justify-center gap-3 bg-white text-navy font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Starta gratis sanitycheck
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Spacer for footer */}
      <div className="h-16"></div>
    </main>
  )
}
