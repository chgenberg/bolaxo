'use client'

import { useState, useEffect } from 'react'
import { mockObjects } from '@/data/mockObjects'
import ObjectCard from '@/components/ObjectCard'
import { Search, SlidersHorizontal, ChevronDown, X, TrendingUp, AlertCircle } from 'lucide-react'

export default function SearchPage() {
  const [filteredObjects, setFilteredObjects] = useState(mockObjects)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    revenueRange: '',
    location: '',
    employees: '',
    sortBy: 'newest'
  })

  // Active filter count
  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'newest').length + (searchQuery ? 1 : 0)

  const applyFilters = () => {
    setLoading(true)
    
    setTimeout(() => {
      let filtered = [...mockObjects]

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        filtered = filtered.filter(obj => 
          (obj.title || obj.anonymousTitle || '').toLowerCase().includes(searchLower) ||
          obj.description.toLowerCase().includes(searchLower) ||
          obj.type.toLowerCase().includes(searchLower)
        )
      }

      // Category filter
      if (filters.category) {
        filtered = filtered.filter(obj => obj.type === filters.category)
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(v => v === '+' ? Infinity : parseInt(v))
        filtered = filtered.filter(obj => {
          const priceInMSEK = (obj.price || obj.priceMin) / 1000000
          if (max === Infinity) return priceInMSEK >= min
          return priceInMSEK >= min && priceInMSEK <= max
        })
      }

      // Revenue range filter
      if (filters.revenueRange) {
        const [min, max] = filters.revenueRange.split('-').map(v => v === '+' ? Infinity : parseInt(v))
        filtered = filtered.filter(obj => {
          const revenueInMSEK = obj.revenue / 1000000
          if (max === Infinity) return revenueInMSEK >= min
          return revenueInMSEK >= min && revenueInMSEK <= max
        })
      }

      // Location filter
      if (filters.location && filters.location !== 'ovriga') {
        filtered = filtered.filter(obj => 
          obj.region.toLowerCase().includes(filters.location.toLowerCase())
        )
      }

      // Sort
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => (a.price || a.priceMin) - (b.price || b.priceMin))
          break
        case 'price-high':
          filtered.sort((a, b) => (b.price || b.priceMin) - (a.price || a.priceMin))
          break
        case 'revenue-high':
          filtered.sort((a, b) => b.revenue - a.revenue)
          break
        case 'most-viewed':
          filtered.sort((a, b) => b.views - a.views)
          break
        default:
          // Sort by newest (mock random order)
          filtered.sort(() => Math.random() - 0.5)
      }

      setFilteredObjects(filtered)
      setLoading(false)
    }, 300)
  }

  // Apply filters on change
  useEffect(() => {
    applyFilters()
  }, [searchQuery, filters])

  const clearAllFilters = () => {
    setSearchQuery('')
    setFilters({
      category: '',
      priceRange: '',
      revenueRange: '',
      location: '',
      employees: '',
      sortBy: 'newest'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simplified Header */}
      <div className="bg-background-off-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-text-dark text-center">
            Sök bland {mockObjects.length} företag till salu
          </h1>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-28 md:top-32 z-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray" />
                <input
                  type="text"
                  placeholder="Sök på bransch, beskrivning eller plats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12 pr-4 w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center justify-center px-6 py-3 rounded-button font-medium
                transition-all duration-200 border-2
                ${showFilters 
                  ? 'bg-primary-blue text-white border-primary-blue' 
                  : 'bg-white text-text-dark border-gray-200 hover:border-primary-blue'
                }
              `}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-white text-primary-blue px-2 py-0.5 rounded-full text-sm">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-down">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Category */}
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="select-field"
                >
                  <option value="">Alla branscher</option>
                  <option value="E-handel">E-handel</option>
                  <option value="Teknologi">Teknologi</option>
                  <option value="Konsultbolag">Konsultbolag</option>
                  <option value="Tillverkning">Tillverkning</option>
                  <option value="Restaurang">Restaurang</option>
                </select>

                {/* Price Range */}
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="select-field"
                >
                  <option value="">Alla priser</option>
                  <option value="0-5">0-5 MSEK</option>
                  <option value="5-10">5-10 MSEK</option>
                  <option value="10-25">10-25 MSEK</option>
                  <option value="25-50">25-50 MSEK</option>
                  <option value="50+">50+ MSEK</option>
                </select>

                {/* Revenue Range */}
                <select
                  value={filters.revenueRange}
                  onChange={(e) => setFilters({...filters, revenueRange: e.target.value})}
                  className="select-field"
                >
                  <option value="">All omsättning</option>
                  <option value="0-10">0-10 MSEK</option>
                  <option value="10-50">10-50 MSEK</option>
                  <option value="50-100">50-100 MSEK</option>
                  <option value="100+">100+ MSEK</option>
                </select>

                {/* Location */}
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="select-field"
                >
                  <option value="">Hela Sverige</option>
                  <option value="stockholm">Stockholm</option>
                  <option value="göteborg">Göteborg</option>
                  <option value="malmö">Malmö</option>
                  <option value="uppsala">Uppsala</option>
                  <option value="ovriga">Övriga</option>
                </select>

                {/* Sort By */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="select-field"
                >
                  <option value="newest">Nyast först</option>
                  <option value="price-low">Lägsta pris</option>
                  <option value="price-high">Högsta pris</option>
                  <option value="revenue-high">Högsta omsättning</option>
                  <option value="most-viewed">Mest visade</option>
                </select>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="btn-ghost text-error hover:bg-error/10 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rensa filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-dark">
            {filteredObjects.length} företag {activeFilterCount > 0 && 'matchade din sökning'}
          </h2>
          {!loading && filteredObjects.length > 0 && (
            <p className="text-sm text-text-gray hidden md:block">
              Alla annonser är verifierade och uppdaterade
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && filteredObjects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObjects.map((object) => (
              <ObjectCard key={object.id} object={object} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredObjects.length === 0 && (
          <div className="card text-center py-16 max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-text-gray/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-dark mb-2">
              Inga företag hittades
            </h3>
            <p className="text-text-gray mb-6">
              Prova att justera dina filter eller sökord för att se fler resultat
            </p>
            <button 
              onClick={clearAllFilters}
              className="btn-secondary mx-auto"
            >
              Rensa alla filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}