'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle, 
  CheckCircle2,
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
  HandshakeIcon,
  BookOpen
} from 'lucide-react'

export default function HomePageContent() {
  const locale = useLocale()

  return (
    <main className="bg-gray-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Mascot - Left side */}
            <div className="flex-shrink-0">
              <img 
                src="/Home/maskot.png" 
                alt="Bolaxo maskot" 
                className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
              />
            </div>
            
            {/* Content - Right side */}
            <div className="flex-1 text-center md:text-left">
              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold text-navy leading-tight mb-6">
                <span className="lg:whitespace-nowrap">Sälj, köp och värdera företag</span>
                <span className="block text-navy/70 lg:whitespace-nowrap">på ett trovärdigt och transparent sätt.</span>
            </h1>
              
              {/* Intro Text */}
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed">
                Bolaxo (en del av AIFM) hjälper ägare, köpare och rådgivare genom hela resan: 
                från första tempmätning till annonsering och matchning. <strong>Inga success fees</strong> – bara tydliga paket.
              </p>
              
              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
            <Link
              href={`/${locale}/sanitycheck`}
              className="group relative inline-flex items-center justify-center gap-3 bg-navy text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:scale-105 animate-pulse-box"
            >
              <Sparkles className="w-5 h-5" />
              Starta värderingskoll utan kostnad
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href={`/${locale}/sok`}
              className="group relative inline-flex items-center justify-center gap-3 bg-navy/10 text-navy font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:bg-navy/20 border-2 border-navy/20"
            >
              <Search className="w-5 h-5" />
              Utforska bolag till salu
            </Link>
            </div>
            
              {/* Secondary Links */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <Link 
                  href={`/${locale}/saljarprofil`}
                  className="text-navy font-semibold hover:text-navy/70 transition-colors flex items-center gap-2 group"
                >
                  <Building2 className="w-4 h-4" />
                  Sälja företag
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href={`/${locale}/investerarprofil`}
                  className="text-navy font-semibold hover:text-navy/70 transition-colors flex items-center gap-2 group"
                >
                  <Briefcase className="w-4 h-4" />
                  Köpa företag
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href={`/${locale}/sanitycheck`}
                  className="text-navy font-semibold hover:text-navy/70 transition-colors flex items-center gap-2 group"
                >
                  <BarChart3 className="w-4 h-4" />
                  Snabb genomlysning &amp; indikativ värdering
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Våra tjänster */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold text-navy/60 uppercase tracking-widest mb-4">
              Våra tjänster
              </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">
              Allt du behöver för en lyckad affär
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Link href={`/${locale}/salja/skapa-annons`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy cursor-pointer">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <FileText className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Sälja via annons</h3>
                <p className="text-white/80 leading-relaxed">
                  Bolaxo blir annonstorget där du kan paketera och publicera din försäljning.
                </p>
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Skapa annons</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
            
            {/* Card 2 */}
            <Link href={`/${locale}/investerarprofil`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy cursor-pointer">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <Search className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Hitta rätt bolag</h3>
                <p className="text-white/80 leading-relaxed">
                  Avancerade filter med fler KPI:er än bara omsättning, bransch och lönsamhet.
                </p>
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Skapa investerarprofil</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
            </div>
            </Link>
            
            {/* Card 3 */}
            <Link href={`/${locale}/sanitycheck`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy cursor-pointer">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <BarChart3 className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Få insikter om ditt bolag</h3>
                <p className="text-white/80 leading-relaxed">
                  Gratis tempmätning först – djupare analys och värderingsspann mot betalning.
                </p>
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Starta gratis</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
              </Link>
          </div>
        </div>
      </section>

      {/* Om oss - AIFM Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-navy text-white p-10 md:p-16 rounded-3xl text-center animate-pulse-box-navy">
            <span className="inline-block text-sm font-bold text-white/60 uppercase tracking-widest mb-4">
              Trygghet & kompetens
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">
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

      {/* Kom igång - Välj din väg */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold text-navy/60 uppercase tracking-widest mb-4">
              Kom igång
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">
              Välj din väg
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sälja */}
            <Link href={`/${locale}/saljarprofil`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy cursor-pointer">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <Building2 className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Jag vill sälja mitt bolag</h3>
                <p className="text-white/80 leading-relaxed">
                  Skapa din säljarprofil för att nå rätt köpare och mäklare.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Skapa säljarprofil</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </div>
                  </div>
            </Link>
            
            {/* Köpa */}
            <Link href={`/${locale}/investerarprofil`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy cursor-pointer">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <Briefcase className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                  </div>
                <h3 className="text-xl font-bold mb-4 text-white">Jag vill köpa bolag</h3>
                <p className="text-white/80 leading-relaxed">
                  Skapa din investerarprofil och få matchningar med rätt bolag.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Skapa investerarprofil</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
                  </div>
            </Link>
            
            {/* Rådgivare */}
            <Link href={`/${locale}/kontakt`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy cursor-pointer">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <UserCheck className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                  </div>
                <h3 className="text-xl font-bold mb-4 text-white">Jag är rådgivare/mäklare</h3>
                <p className="text-white/80 leading-relaxed">
                  SME Sales Automation Kit för struktur, scoring och white label-rapporter.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Kontakta oss</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
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
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy cursor-pointer">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <Zap className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-white">Freemium</h3>
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
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Starta gratis</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
            
            {/* Bas */}
            <Link href={`/${locale}/priser`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy relative overflow-hidden cursor-pointer">
                <div className="absolute top-4 right-4">
                  <span className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full font-semibold">Populär</span>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <Target className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Bas</h3>
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
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Se priser</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
                  </div>
            </Link>
            
            {/* Premium */}
            <Link href={`/${locale}/priser`} className="group">
              <div className="h-full bg-navy text-white p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-pulse-box-navy cursor-pointer">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <Crown className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Premium</h3>
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
                <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Se priser</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
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
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Med Bolaxo</h3>
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

      {/* KUNSKAPSBANK Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-bold text-navy/60 uppercase tracking-widest mb-4">
              RESURSER
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-4">
              Kunskapsbank – guider för hela resan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Checklistor, mallar och guider som hjälper dig genom hela försäljningsprocessen.
            </p>
                    </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Link href={`/${locale}/kunskapsbank`} className="group">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-navy/20 transition-all duration-300 cursor-pointer h-full">
                <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy/20 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-navy group-hover:scale-110 transition-transform" />
                        </div>
                <h3 className="font-bold text-navy mb-2">Checklistor</h3>
                <p className="text-sm text-gray-600">12-månaders förberedelser, DD-checklista och överlämningsplan.</p>
                      </div>
            </Link>
            <Link href={`/${locale}/kunskapsbank`} className="group">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-navy/20 transition-all duration-300 cursor-pointer h-full">
                <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy/20 transition-colors">
                  <FileText className="w-6 h-6 text-navy group-hover:scale-110 transition-transform" />
                    </div>
                <h3 className="font-bold text-navy mb-2">Mallar</h3>
                <p className="text-sm text-gray-600">Exit-plan, teaser & IM-mallar, NDA-formulär och mer.</p>
              </div>
            </Link>
            <Link href={`/${locale}/kunskapsbank`} className="group">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-navy/20 transition-all duration-300 cursor-pointer h-full">
                <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-navy group-hover:scale-110 transition-transform" />
                  </div>
                <h3 className="font-bold text-navy mb-2">Guider</h3>
                <p className="text-sm text-gray-600">Värdering, sekretess, skatteplanering och mycket mer.</p>
              </div>
            </Link>
              </div>

          <div className="text-center">
            <Link
              href={`/${locale}/kunskapsbank`}
              className="group inline-flex items-center gap-2 bg-navy text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:bg-navy/90"
            >
              <BookOpen className="w-5 h-5" />
              Utforska kunskapsbanken
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
              </div>
            </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-navy text-white p-10 md:p-16 rounded-3xl text-center animate-pulse-box-navy">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">
              Redo att komma igång?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Börja med en värderingskoll utan kostnad och se hur ditt bolag står sig.
            </p>
            <Link
              href={`/${locale}/sanitycheck`}
              className="group inline-flex items-center justify-center gap-3 bg-white text-navy font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Starta värderingskoll utan kostnad
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
