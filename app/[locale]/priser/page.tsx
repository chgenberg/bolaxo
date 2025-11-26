'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Crown,
  Zap,
  ChevronDown,
  HelpCircle,
  Shield,
  BarChart3,
  MessageSquare,
  FileText,
  Target
} from 'lucide-react'

type TabId = 'overview' | 'freemium' | 'bas' | 'premium' | 'faq'

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Översikt' },
  { id: 'freemium', label: 'Freemium' },
  { id: 'bas', label: 'Bas' },
  { id: 'premium', label: 'Premium' },
  { id: 'faq', label: 'FAQ' }
]

const faqs = [
  {
    question: 'Kostar det något att testa Freemium?',
    answer: 'Nej, Freemium är helt kostnadsfritt. Du kan skapa konto, göra en light-värdering och utforska kunskapsbanken utan att betala.'
  },
  {
    question: 'Kan jag börja i Freemium och uppgradera senare?',
    answer: 'Ja. All data du fyller i i Freemium följer med när du uppgraderar till Bas eller Premium, så du slipper göra om jobbet.'
  },
  {
    question: 'Tar ni procent på köpeskillingen?',
    answer: 'I Bas tar vi ingen procent alls – bara fast pris. I Premium kan en låg success fee förekomma, men alltid på nivåer som ligger långt under traditionella mäklarupplägg.'
  },
  {
    question: 'Vem ser informationen jag laddar upp?',
    answer: 'Du styr vad som visas öppet i annonsen. Mer detaljerat material ligger i datarummet och delas först när du valt att gå vidare med en intressent.'
  },
  {
    question: 'Hur fungerar matchningen?',
    answer: 'Vår matchningsmotor analyserar din profil mot registrerade köpare baserat på bransch, storlek, geografi och andra preferenser. Du får notifikationer när det finns bra matchningar.'
  },
  {
    question: 'Kan jag avbryta när som helst?',
    answer: 'Ja, du kan när som helst pausa eller ta bort din annons. I Freemium finns ingen bindningstid alls.'
  }
]

export default function PriserPage() {
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="bg-navy text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Välj rätt nivå för din företagsförsäljning
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Börja gratis med en light-värdering och uppgradera när du är redo att publicera annons,
            matchas mot investerare och få personlig rådgivning.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="px-4 py-2 bg-white text-navy font-semibold rounded-full text-sm">
              Freemium → Bas → Premium
            </span>
            <span className="px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm">
              Sänkt tröskel
            </span>
            <span className="px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm">
              Mer stöd för varje steg
            </span>
            <span className="px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm">
              Inga dolda procent
            </span>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
                  </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {/* Freemium */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Steg 1 · Testa gratis
                  </span>
                  </div>
                <h3 className="text-2xl font-bold text-navy mb-2">Freemium</h3>
                <div className="text-3xl font-bold text-navy mb-4">0 kr</div>
                <p className="text-gray-600 text-sm mb-6">
                  För dig som vill testa och förstå möjligheterna utan kostnad.
                </p>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Sanity check / light-värdering</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Kunskapsbank – vad du ska göra, steg för steg</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Skapa och spara säljprofil (ej publik)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Se hur många köpare som matchar</span>
                  </li>
                </ul>
                <button
                  onClick={() => setActiveTab('freemium')}
                  className="w-full py-3 px-6 bg-white text-navy font-semibold rounded-full border-2 border-navy/20 hover:border-navy/40 transition-colors mt-auto"
                >
                  Utforska Freemium
                    </button>
              </div>

              {/* Bas */}
              <div className="bg-white rounded-2xl p-8 border-2 border-emerald-500 hover:shadow-xl transition-shadow relative flex flex-col h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase">
                    Rekommenderad
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Steg 2 · Rekommenderad start
                      </span>
                    </div>
                <h3 className="text-2xl font-bold text-navy mb-2">Bas</h3>
                <div className="text-3xl font-bold text-navy mb-4">Fast pris per annons</div>
                <p className="text-gray-600 text-sm mb-6">
                  För dig som vill göra jobbet själv – med stöd i plattformen.
                </p>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Full annons-wizard & publicering</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Avancerad matchning mot köpare</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Datarum light & enkel dashboard</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Bas-support via e-post / chatt</span>
                  </li>
                </ul>
                <button
                  onClick={() => setActiveTab('bas')}
                  className="w-full py-3 px-6 bg-navy text-white font-semibold rounded-full hover:bg-navy/90 transition-colors mt-auto"
                >
                  Se vad som ingår i Bas
                </button>
              </div>

              {/* Premium */}
              <div className="bg-navy text-white rounded-2xl p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 text-white/90 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Steg 3 · Mest stöd
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-3xl font-bold mb-4">Fast pris + ev. låg success fee</div>
                <p className="text-white/70 text-sm mb-6">
                  För dig som vill ha en rådgivare med i processen.
                </p>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Allt i Bas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Personlig rådgivare & uppstartsmöte</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Finputsad annons, teaser & pitchdeck</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Premium-exponering</span>
                  </li>
                </ul>
                <button
                  onClick={() => setActiveTab('premium')}
                  className="w-full py-3 px-6 bg-white text-navy font-semibold rounded-full hover:bg-white/90 transition-colors mt-auto"
                >
                  Utforska Premium
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-navy">Funktion</th>
                      <th className="text-center py-4 px-6 font-semibold text-navy">Freemium</th>
                      <th className="text-center py-4 px-6 font-semibold text-navy">Bas</th>
                      <th className="text-center py-4 px-6 font-semibold text-navy">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-4 px-6 text-gray-700">Light-värdering / sanity check</td>
                      <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-gray-700">Kunskapsbank</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">Freemium-artiklar</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">Full åtkomst</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">Full åtkomst</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-gray-700">Publicerad annons & matchning</td>
                      <td className="py-4 px-6 text-center text-gray-300">–</td>
                      <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-gray-700">Datarum / bilagor</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">Enkelt uppladdningsflöde</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">Datarum light</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">Datarum+</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-gray-700">Personlig rådgivare</td>
                      <td className="py-4 px-6 text-center text-gray-300">–</td>
                      <td className="py-4 px-6 text-center text-gray-300">–</td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 bg-navy text-white text-xs font-semibold rounded-full">Ingår</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-gray-700">Support</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">Community</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">E-post/chatt</td>
                      <td className="py-4 px-6 text-center text-sm text-gray-500">Prioriterad + telefon</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Freemium Tab */}
        {activeTab === 'freemium' && (
          <div className="space-y-8">
            <div>
              <span className="text-sm font-semibold text-navy/60 uppercase tracking-wider">Steg 1</span>
              <h2 className="text-3xl font-bold text-navy mt-2 mb-4">Freemium – testa utan kostnad</h2>
              <p className="text-gray-600 max-w-2xl">
                Första steget för dig som är nyfiken på att sälja bolaget men vill känna på processen
                och få en indikativ bild av värdet innan du går vidare.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-navy mb-6">Det här ingår</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <span className="font-semibold text-navy">Sanity check / light-värdering</span>
                      <p className="text-sm text-gray-600">Baserat på några nyckelfrågor.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <span className="font-semibold text-navy">Kunskapsbank – Freemium</span>
                      <p className="text-sm text-gray-600">Guider om vad du ska göra i varje steg.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <span className="font-semibold text-navy">Skapa konto & spara säljprofil</span>
                      <p className="text-sm text-gray-600">Ej publik, bara för dig.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <span className="font-semibold text-navy">Teaser om köparintresse</span>
                      <p className="text-sm text-gray-600">Se hur många som matchar ditt case.</p>
                    </div>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-6 p-4 bg-gray-50 rounded-xl">
                  All data du lägger in går att återanvända när du uppgraderar till Bas eller Premium.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-navy mb-6">Typiska frågor Freemium besvarar</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-2xl">🤔</span>
                    <span>"Är mitt bolag ens säljbart?"</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-2xl">💰</span>
                    <span>"I vilken storleksordning skulle värdet kunna landa?"</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-2xl">➡️</span>
                    <span>"Vad är nästa steg om jag vill gå vidare?"</span>
                  </li>
                </ul>
                <Link
                  href={`/${locale}/sanitycheck`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-full hover:bg-navy/90 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Skapa gratis Freemium-konto
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Bas Tab */}
        {activeTab === 'bas' && (
          <div className="space-y-8">
            <div>
              <span className="text-sm font-semibold text-navy/60 uppercase tracking-wider">Steg 2</span>
              <h2 className="text-3xl font-bold text-navy mt-2 mb-4">Bas – gör det själv med plattformstöd</h2>
              <p className="text-gray-600 max-w-2xl">
                För dig som vill publicera en professionell annons, bli matchad mot rätt köpare och
                sköta kontakten själv – utan dyr mäklarprovision.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-navy mb-6">Det här ingår i Bas</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-navy">Full annons-wizard</span>
                      <p className="text-sm text-gray-600">Med guidat frågebatteri och AI-stöd för rubrik & pitch.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-navy">Publicering på Bolaxo</span>
                      <p className="text-sm text-gray-600">Med synlighet för relevanta investerare och köpare.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-navy">Avancerad matchning</span>
                      <p className="text-sm text-gray-600">På fler KPI:er än bara omsättning, bransch och lönsamhet.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-navy">Datarum light</span>
                      <p className="text-sm text-gray-600">Med bilagor som bokslut, teaser-PDF och presentation.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-navy">Dashboard</span>
                      <p className="text-sm text-gray-600">Med visningar, intresseanmälningar och rekommendationer.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-navy">Bas-support</span>
                      <p className="text-sm text-gray-600">Via e-post / chatt under kontorstid.</p>
                    </div>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-6 p-4 bg-gray-50 rounded-xl">
                  Pris: fast pris per annons. Exakta nivåer sätts per marknad men utan procent på köpeskillingen.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-navy mb-6">Bas passar dig som...</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                    <span>vill minimera kostnader men ändå jobba strukturerat.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                    <span>är bekväm med att själv sköta dialogen med köpare.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                    <span>vill ha kontroll över vad som visas öppet och vad som delas först efter NDA.</span>
                  </li>
                </ul>
                <Link
                  href={`/${locale}/salja/start`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-full hover:bg-navy/90 transition-colors"
                >
                  Börja med Bas
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Premium Tab */}
        {activeTab === 'premium' && (
          <div className="space-y-8">
            <div>
              <span className="text-sm font-semibold text-navy/60 uppercase tracking-wider">Steg 3</span>
              <h2 className="text-3xl font-bold text-navy mt-2 mb-4">Premium – gör det tillsammans med rådgivare</h2>
              <p className="text-gray-600 max-w-2xl">
                För dig som vill ha en erfaren partner vid din sida genom processen – från första annonsutkast
                till kvalificering av köpare och struktur på affären.
              </p>
        </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-navy text-white rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Det här ingår i Premium</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Allt i Bas</span>
                      <p className="text-sm text-white/70">Annons, publicering, matchning, datarum och dashboard.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Personlig rådgivare</span>
                      <p className="text-sm text-white/70">Med uppstartsmöte (ca 45 min) där ni går igenom målbild, typ av köpare och tidsplan.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Annons- & materialgranskning</span>
                      <p className="text-sm text-white/70">Finputs av rubrik, pitch, teaser och eventuell pitchdeck.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Stöd kring pris & struktur</span>
                      <p className="text-sm text-white/70">Resonemang om prisintervall, earn-out, tillträde och kvarstående ägande.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Matchning & kvalificering</span>
                      <p className="text-sm text-white/70">Hjälp att sortera och prioritera seriösa intressenter.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Premium-exponering</span>
                      <p className="text-sm text-white/70">Högre synlighet och markering om kvalitetssäkrad annons.</p>
                    </div>
                  </li>
                </ul>
                <p className="text-sm text-white/60 mt-6 p-4 bg-white/10 rounded-xl">
                  Pris: högre fast avgift + eventuellt en låg success fee vid genomförd affär – fortfarande långt under traditionella mäklarupplägg.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-navy mb-6">Premium passar dig som...</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                    <span>vill ha en kunnig samtalspartner genom hela processen.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                    <span>har begränsat med tid och vill undvika vanliga misstag.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                    <span>värdesätter struktur och kvalificering av köpare innan ni ses.</span>
                  </li>
                </ul>
                <Link
                  href={`/${locale}/kontakt`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-full hover:bg-navy/90 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Prata med oss om Premium
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-navy">Vanliga frågor om Freemium, Bas och Premium</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="font-semibold text-navy pr-4">{faq.question}</h3>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Redo att komma igång?</h2>
          <p className="text-white/80 mb-8">
            Börja gratis med en sanitycheck och se hur ditt bolag står sig.
          </p>
          <Link
            href={`/${locale}/sanitycheck`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy font-bold rounded-full hover:bg-white/90 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Starta gratis sanitycheck
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
