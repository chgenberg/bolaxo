'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SelectDropdown from '@/components/dashboard/SelectDropdown'
import { Search, MapPin, Building, TrendingUp, Users, DollarSign, Save, Plus, X } from 'lucide-react'

export default function SearchProfilePage() {
  const [industries, setIndustries] = useState(['E-handel', 'SaaS', 'Teknologi'])
  const [locations, setLocations] = useState(['Stockholm', 'Göteborg'])
  const [revenueMin, setRevenueMin] = useState('5')
  const [revenueMax, setRevenueMax] = useState('50')
  const [priceMin, setPriceMin] = useState('10')
  const [priceMax, setPriceMax] = useState('50')
  const [customIndustry, setCustomIndustry] = useState('')
  const [customLocation, setCustomLocation] = useState('')

  const availableIndustries = [
    'E-handel', 'SaaS', 'Teknologi', 'Konsult', 'Tillverkning', 
    'Restaurang', 'Bygg', 'Fastighet', 'Hälsa', 'Utbildning'
  ]

  const availableLocations = [
    'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås',
    'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Hela Sverige'
  ]

  const addIndustry = (industry: string) => {
    if (!industries.includes(industry)) {
      setIndustries([...industries, industry])
    }
  }

  const removeIndustry = (industry: string) => {
    setIndustries(industries.filter(i => i !== industry))
  }

  const addLocation = (location: string) => {
    if (!locations.includes(location)) {
      setLocations([...locations, location])
    }
  }

  const removeLocation = (location: string) => {
    setLocations(locations.filter(l => l !== location))
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Min sökprofil</h1>
          <p className="text-sm text-text-gray mt-1">Anpassa dina preferenser för att få bättre matchningar</p>
        </div>

        {/* Current profile summary */}
        <div className="bg-primary-blue text-white p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Nuvarande profil</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs opacity-80 mb-1">Branscher</p>
              <p className="text-sm font-medium">{industries.length} valda</p>
            </div>
            <div>
              <p className="text-xs opacity-80 mb-1">Platser</p>
              <p className="text-sm font-medium">{locations.length} områden</p>
            </div>
            <div>
              <p className="text-xs opacity-80 mb-1">Omsättning</p>
              <p className="text-sm font-medium">{revenueMin}-{revenueMax} MSEK</p>
            </div>
            <div>
              <p className="text-xs opacity-80 mb-1">Prisintervall</p>
              <p className="text-sm font-medium">{priceMin}-{priceMax} MSEK</p>
            </div>
          </div>
        </div>

        {/* Industries */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary-blue" />
            Branscher
          </h2>
          
          {/* Selected industries */}
          <div className="flex flex-wrap gap-2 mb-4">
            {industries.map((industry) => (
              <span
                key={industry}
                className="bg-primary-blue text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
              >
                {industry}
                <button
                  onClick={() => removeIndustry(industry)}
                  className="hover:bg-white/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Available industries */}
          <div className="flex flex-wrap gap-2 mb-4">
            {availableIndustries
              .filter(i => !industries.includes(i))
              .map((industry) => (
                <button
                  key={industry}
                  onClick={() => addIndustry(industry)}
                  className="bg-gray-100 text-text-gray px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  + {industry}
                </button>
              ))}
          </div>

          {/* Custom industry */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              placeholder="Annan bransch..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && customIndustry) {
                  addIndustry(customIndustry)
                  setCustomIndustry('')
                }
              }}
            />
            <button
              onClick={() => {
                if (customIndustry) {
                  addIndustry(customIndustry)
                  setCustomIndustry('')
                }
              }}
              className="p-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-blue" />
            Platser
          </h2>
          
          {/* Selected locations */}
          <div className="flex flex-wrap gap-2 mb-4">
            {locations.map((location) => (
              <span
                key={location}
                className="bg-primary-blue text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
              >
                {location}
                <button
                  onClick={() => removeLocation(location)}
                  className="hover:bg-white/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Available locations */}
          <div className="flex flex-wrap gap-2 mb-4">
            {availableLocations
              .filter(l => !locations.includes(l))
              .map((location) => (
                <button
                  key={location}
                  onClick={() => addLocation(location)}
                  className="bg-gray-100 text-text-gray px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  + {location}
                </button>
              ))}
          </div>

          {/* Custom location */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Annan plats..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && customLocation) {
                  addLocation(customLocation)
                  setCustomLocation('')
                }
              }}
            />
            <button
              onClick={() => {
                if (customLocation) {
                  addLocation(customLocation)
                  setCustomLocation('')
                }
              }}
              className="p-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Financial criteria */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-blue" />
            Finansiella kriterier
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Omsättning (MSEK)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={revenueMin}
                  onChange={(e) => setRevenueMin(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <span className="text-text-gray">-</span>
                <input
                  type="number"
                  value={revenueMax}
                  onChange={(e) => setRevenueMax(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Prisintervall (MSEK)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <span className="text-text-gray">-</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional criteria */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-blue" />
            Ytterligare kriterier
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Investeringstyp
              </label>
              <SelectDropdown
                value="full_acquisition"
                onChange={() => {}}
                options={[
                  { value: 'full_acquisition', label: 'Helförvärv' },
                  { value: 'partnership', label: 'Delägande' },
                  { value: 'turnaround', label: 'Turnaround' },
                  { value: 'all', label: 'Alla typer' }
                ]}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Lönsamhetskrav
              </label>
              <SelectDropdown
                value="profitable"
                onChange={() => {}}
                options={[
                  { value: 'profitable', label: 'Endast lönsamma' },
                  { value: 'turnaround', label: 'Accepterar förlust' },
                  { value: 'either', label: 'Inget krav' }
                ]}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Antal anställda
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <span className="text-text-gray">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Spara ändringar
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
