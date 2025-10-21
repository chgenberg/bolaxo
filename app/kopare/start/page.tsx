'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBuyerStore } from '@/store/buyerStore'
import FormField from '@/components/FormField'

export default function BuyerStartPage() {
  const router = useRouter()
  const { preferences, updatePreferences, loadFromLocalStorage } = useBuyerStore()
  
  const [regions, setRegions] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])

  useEffect(() => {
    loadFromLocalStorage()
  }, [loadFromLocalStorage])

  const toggleRegion = (region: string) => {
    const newRegions = regions.includes(region)
      ? regions.filter(r => r !== region)
      : [...regions, region]
    setRegions(newRegions)
  }

  const toggleIndustry = (industry: string) => {
    const newIndustries = industries.includes(industry)
      ? industries.filter(i => i !== industry)
      : [...industries, industry]
    setIndustries(newIndustries)
  }

  const handleSubmit = () => {
    updatePreferences({
      regions,
      industries,
      buyerType: preferences.buyerType,
      revenueMin: preferences.revenueMin,
      revenueMax: preferences.revenueMax,
      emailAlerts: preferences.emailAlerts,
    })
    router.push('/kopare/verifiering')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card animate-pulse-soft">
          <h1 className="text-3xl font-bold text-text-dark mb-3">
            Berätta vad du letar efter
          </h1>
          <p className="text-text-gray mb-8">
            Vi använder dina preferenser för att föreslå relevanta objekt och skicka bevakningar.
          </p>

          <div className="space-y-6">
            {/* Regions */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">
                Region(er) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västra Götaland', 'Skåne', 'Hela Sverige'].map((region) => (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      regions.includes(region)
                        ? 'bg-primary-blue text-white'
                        : 'bg-gray-100 text-text-gray hover:bg-gray-200'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">
                Bransch(er) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Konsultbolag', 'E-handel', 'SaaS-företag', 'Restaurang', 'Bygg & Fastighet', 'Tillverkning', 'Tjänsteföretag'].map((industry) => (
                  <button
                    key={industry}
                    onClick={() => toggleIndustry(industry)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      industries.includes(industry)
                        ? 'bg-primary-blue text-white'
                        : 'bg-gray-100 text-text-gray hover:bg-gray-200'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">
                Storlek (omsättning/EBITDA)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Omsättning min (MSEK)"
                  name="revenueMin"
                  type="number"
                  placeholder="Ex. 5"
                  value={preferences.revenueMin}
                  onValueChange={(value) => updatePreferences({ revenueMin: value })}
                />
                <FormField
                  label="Omsättning max (MSEK)"
                  name="revenueMax"
                  type="number"
                  placeholder="Ex. 50"
                  value={preferences.revenueMax}
                  onValueChange={(value) => updatePreferences({ revenueMax: value })}
                />
              </div>
            </div>

            {/* Buyer Type */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">
                Typ av köpare
              </label>
              <div className="space-y-3">
                <div
                  onClick={() => updatePreferences({ buyerType: 'operational' })}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    preferences.buyerType === 'operational'
                      ? 'border-primary-blue bg-light-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      checked={preferences.buyerType === 'operational'}
                      onChange={() => updatePreferences({ buyerType: 'operational' })}
                      className="mt-1 w-4 h-4 text-primary-blue"
                    />
                    <div className="ml-3">
                      <div className="font-semibold">Operativ köpare</div>
                      <p className="text-sm text-text-gray mt-1">
                        Jag vill driva företaget själv eller integrera i befintlig verksamhet
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => updatePreferences({ buyerType: 'financial' })}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    preferences.buyerType === 'financial'
                      ? 'border-primary-blue bg-light-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      checked={preferences.buyerType === 'financial'}
                      onChange={() => updatePreferences({ buyerType: 'financial' })}
                      className="mt-1 w-4 h-4 text-primary-blue"
                    />
                    <div className="ml-3">
                      <div className="font-semibold">Finansiell köpare</div>
                      <p className="text-sm text-text-gray mt-1">
                        Investering via holdingbolag, befintlig ledning fortsätter
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Alerts */}
            <div className="card bg-light-blue">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="emailAlerts"
                  checked={preferences.emailAlerts}
                  onChange={(e) => updatePreferences({ emailAlerts: e.target.checked })}
                  className="mt-1 w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                />
                <div className="ml-3">
                  <label htmlFor="emailAlerts" className="font-semibold text-text-dark cursor-pointer">
                    Jag vill få förslag via e-post
                  </label>
                  <p className="text-sm text-text-gray mt-1">
                    Vi skickar nya objekt som matchar dina filter direkt till din inkorg.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} className="btn-primary flex-1">
              Skapa konto →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

