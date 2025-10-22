'use client'

import { useState } from 'react'
import { MapPin, Building2, TrendingUp, Plus, X } from 'lucide-react'

interface BuyerPreferencesProps {
  onSave?: (preferences: any) => void
}

export default function BuyerPreferences({ onSave }: BuyerPreferencesProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [customIndustry, setCustomIndustry] = useState('')
  const [showCustomIndustry, setShowCustomIndustry] = useState(false)
  const [revenueRange, setRevenueRange] = useState({ min: '', max: '' })
  
  const regions = [
    'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västra Götaland',
    'Skåne', 'Hela Sverige'
  ]
  
  const industries = [
    'Konsultbolag', 'E-handel', 'SaaS-företag', 'Restaurang',
    'Bygg & Fastighet', 'Tillverkning', 'Tjänsteföretag'
  ]

  const toggleRegion = (region: string) => {
    if (region === 'Hela Sverige') {
      setSelectedRegions(['Hela Sverige'])
    } else {
      setSelectedRegions(prev => {
        const filtered = prev.filter(r => r !== 'Hela Sverige')
        return filtered.includes(region)
          ? filtered.filter(r => r !== region)
          : [...filtered, region]
      })
    }
  }

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    )
  }

  const addCustomIndustry = () => {
    if (customIndustry.trim()) {
      setSelectedIndustries(prev => [...prev, customIndustry.trim()])
      setCustomIndustry('')
      setShowCustomIndustry(false)
    }
  }

  const removeIndustry = (industry: string) => {
    setSelectedIndustries(prev => prev.filter(i => i !== industry))
  }

  const handleSave = () => {
    const preferences = {
      regions: selectedRegions,
      industries: selectedIndustries,
      revenueRange
    }
    onSave?.(preferences)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-text-dark mb-2">Berätta vad du letar efter</h2>
      <p className="text-text-gray mb-8">
        Vi använder dina preferenser för att föreslå relevanta objekt och skicka bevakningar.
      </p>

      {/* Region Selection */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-lg font-semibold text-text-dark mb-4">
          <MapPin className="w-5 h-5" />
          Region(er) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => toggleRegion(region)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedRegions.includes(region)
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Industry Selection */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-lg font-semibold text-text-dark mb-4">
          <Building2 className="w-5 h-5" />
          Bransch(er) *
        </label>
        
        {/* Selected Industries */}
        {selectedIndustries.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedIndustries.map((industry) => (
              <div
                key={industry}
                className="bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span className="text-sm font-medium">{industry}</span>
                <button
                  onClick={() => removeIndustry(industry)}
                  className="hover:bg-primary-blue/20 rounded-full p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => toggleIndustry(industry)}
              disabled={selectedIndustries.includes(industry)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedIndustries.includes(industry)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              {industry}
            </button>
          ))}
          
          {/* Add Custom Industry */}
          {!showCustomIndustry ? (
            <button
              onClick={() => setShowCustomIndustry(true)}
              className="px-4 py-3 rounded-xl font-medium bg-gray-100 text-text-gray hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Annan bransch
            </button>
          ) : (
            <div className="col-span-2 md:col-span-3 flex gap-2">
              <input
                type="text"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomIndustry()}
                placeholder="Ange bransch..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue focus:outline-none"
                autoFocus
              />
              <button
                onClick={addCustomIndustry}
                className="px-6 py-3 bg-primary-blue text-white rounded-xl font-medium hover:bg-blue-700"
              >
                Lägg till
              </button>
              <button
                onClick={() => {
                  setShowCustomIndustry(false)
                  setCustomIndustry('')
                }}
                className="px-4 py-3 bg-gray-100 text-text-gray rounded-xl hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-primary-blue">
            <span className="font-semibold">Tips:</span> Branscher är en sak men kan också vara andra parametrar som KPI på olika saker, generationsskifte-dvs anledning till försäljning.
          </p>
        </div>
      </div>

      {/* Revenue Range */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-lg font-semibold text-text-dark mb-4">
          <TrendingUp className="w-5 h-5" />
          Storlek (omsättning/EBITDA)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-gray mb-2">Omsättning min (MSEK)</label>
            <input
              type="number"
              value={revenueRange.min}
              onChange={(e) => setRevenueRange(prev => ({ ...prev, min: e.target.value }))}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-text-gray mb-2">Omsättning max (MSEK)</label>
            <input
              type="number"
              value={revenueRange.max}
              onChange={(e) => setRevenueRange(prev => ({ ...prev, max: e.target.value }))}
              placeholder="100"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Additional preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-text-dark mb-4">Fler valmöjligheter</h3>
        <div className="space-y-4">
          <a href="#" className="text-primary-blue hover:underline text-sm">
            → Ruta med frivillig text som gör om till relevanta sökord
          </a>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-text-gray">
              För att investera och ta del av ägarskap ska även kunna välja ett alternativ (länk till vilka alternativ vi ska ha).
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl">
            <p className="text-sm text-text-gray">
              <span className="font-semibold">Lönsamma eller icke lönsamma</span> (turn aroud bolag)
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={selectedRegions.length === 0 || selectedIndustries.length === 0}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
            selectedRegions.length > 0 && selectedIndustries.length > 0
              ? 'bg-primary-blue text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Spara preferenser
        </button>
      </div>
    </div>
  )
}
