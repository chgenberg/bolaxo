'use client'

import { useState } from 'react'
import { 
  X, Check, FileText, TrendingUp, Shield, BarChart3, 
  Users, Building, Briefcase, PieChart, ArrowRight,
  CheckCircle, Star, Award, BookOpen
} from 'lucide-react'

interface PurchasePremiumValuationModalProps {
  onClose: () => void
  onPurchase: () => void
  companyName?: string
}

export default function PurchasePremiumValuationModal({
  onClose,
  onPurchase,
  companyName
}: PurchasePremiumValuationModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const features = [
    {
      icon: FileText,
      title: "42 områden för Due Diligence",
      description: "Komplett genomgång av alla kritiska affärsområden"
    },
    {
      icon: TrendingUp,
      title: "Exakt värderingsanalys",
      description: "Professionell värdering baserad på djupgående data"
    },
    {
      icon: Shield,
      title: "Riskanalys & framtidsutsikter",
      description: "Identifiering av risker och möjligheter"
    },
    {
      icon: BookOpen,
      title: "Omfattande PDF-rapport",
      description: "30-50 sidor detaljerad analys för förhandling"
    }
  ]

  const includedSections = [
    "Finansiell djupanalys (3-5 år)",
    "Kundanalys & marknadsposition",
    "ESG & hållbarhetsanalys",
    "Juridisk & skattemässig genomgång",
    "Organisationsanalys & nyckelpersoner",
    "Teknisk due diligence",
    "Immateriella tillgångar",
    "Framtidsprognoser & scenarioanalys"
  ]

  const handlePurchase = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    onPurchase()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-10 w-10 text-yellow-400" />
            <div>
              <h2 className="text-3xl font-bold">Professionell Företagsvärdering</h2>
              {companyName && (
                <p className="text-blue-100 text-lg">för {companyName}</p>
              )}
            </div>
          </div>
          
          <p className="text-lg text-blue-50 max-w-3xl">
            Få en komplett och marknadsmässig värdering som ger dig alla verktyg för en framgångsrik försäljning eller förvärv.
          </p>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - What's included */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Vad ingår?</h3>
              
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Analysen omfattar:</h4>
                <ul className="space-y-2">
                  {includedSections.map((section, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{section}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Benefits & CTA */}
            <div>
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Varför professionell värdering?
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Maximera försäljningspriset</p>
                      <p className="text-sm text-gray-600">
                        Professionella värderingar ger i snitt 15-25% högre försäljningspris
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Snabbare affärsprocess</p>
                      <p className="text-sm text-gray-600">
                        Med all dokumentation redo går affären 40% snabbare
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Professionell trovärdighet</p>
                      <p className="text-sm text-gray-600">
                        Köpare tar dig på allvar med en gedigen analys
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-blue-100">Pris</p>
                    <p className="text-4xl font-bold">4 995 kr</p>
                    <p className="text-sm text-blue-100">Engångsbetalning</p>
                  </div>
                  <div className="bg-green-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    Bästa pris
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4" />
                    <span>Resultat inom 48 timmar</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4" />
                    <span>100% nöjd-kund-garanti</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4" />
                    <span>Obegränsad support i 30 dagar</span>
                  </li>
                </ul>

                <button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="w-full bg-white text-blue-600 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Behandlar betalning...
                    </>
                  ) : (
                    <>
                      Köp djupgående analys
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-blue-100 text-center mt-4">
                  Säker betalning med Stripe • Moms tillkommer
                </p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Frågor? Ring oss på{' '}
                  <a href="tel:+46812345678" className="font-semibold text-blue-600 hover:underline">
                    08-123 456 78
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
