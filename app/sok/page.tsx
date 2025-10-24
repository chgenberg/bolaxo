'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { mockObjects, BusinessObject } from '@/data/mockObjects'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import ObjectCard from '@/components/ObjectCard'
import { Search, SlidersHorizontal, ChevronDown, X, TrendingUp, AlertCircle } from 'lucide-react'

export default function SearchPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { error: showError, info } = useToast()
  const [profileChecked, setProfileChecked] = useState(false)
  const [allObjects, setAllObjects] = useState<BusinessObject[]>(mockObjects)
  const [filteredObjects, setFilteredObjects] = useState<BusinessObject[]>(mockObjects)
  const [loading, setLoading] = useState(true)
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

  // Check buyer profile on mount
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch(`/api/buyer-profile?userId=${user.id}`)
        if (!response.ok) {
          info('Du behöver slutföra din profil innan du kan söka')
          router.push('/kopare/start')
          return
        }
        setProfileChecked(true)
      } catch (error) {
        console.error('Error checking profile:', error)
        setProfileChecked(true) // Allow anyway
      }
    }

    checkProfile()
  }, [user, router, info])

  // Active filter count
  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'newest').length + (searchQuery ? 1 : 0)

  // Fetch listings on mount
  useEffect(() => {
    if (!profileChecked) return

    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings?status=active')
        if (response.ok) {
          const listings = await response.json()
          
          // Transform API listings to BusinessObject format
          const transformedListings: BusinessObject[] = listings.map((listing: any) => ({
            id: listing.id,
            title: listing.companyName,
            anonymousTitle: listing.anonymousTitle,
            type: listing.type,
            category: listing.category,
            description: listing.description,
            region: listing.region,
            location: listing.location,
            revenue: listing.revenue,
            revenueRange: listing.revenueRange,
            priceMin: listing.priceMin,
            priceMax: listing.priceMax,
            employees: listing.employees,
            image: listing.image,
            verified: listing.verified,
            isNew: listing.isNew,
            broker: listing.broker,
            views: listing.views,
            createdAt: listing.createdAt
          }))
          
          // Combine with mock objects for now (mock objects have more data)
          setAllObjects([...transformedListings, ...mockObjects])
          setFilteredObjects([...transformedListings, ...mockObjects])
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
        // Fallback to mock objects if API fails
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [profileChecked])

  const applyFilters = () => {
    setLoading(true)
    
    setTimeout(() => {
      let filtered = [...allObjects]

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
      if (filters.location) {
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
      {/* Header Section */}
      <div className="bg-background-off-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark text-center uppercase">
            Sök bland {allObjects.length} företag till salu
          </h1>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-20 sm:top-28 md:top-32 z-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-gray" />
                <input
                  type="text"
                  placeholder="Sök bransch, beskrivning..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 sm:pl-12 pr-10 sm:pr-4 w-full text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-button font-medium text-sm sm:text-base min-h-11 sm:min-h-12
                transition-all duration-200 border-2 w-full sm:w-auto
                ${showFilters 
                  ? 'bg-primary-blue text-white border-primary-blue' 
                  : 'bg-white text-text-dark border-gray-200 hover:border-primary-blue'
                }
              `}
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-white text-primary-blue px-2 py-0.5 rounded-full text-xs sm:text-sm">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 animate-slide-down">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {/* Category - Simplified */}
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="select-field text-xs sm:text-sm py-2 sm:py-3"
                >
                  <option value="">Alla branscher</option>
                  <option value="SaaS-företag">SaaS-företag</option>
                  <option value="E-handel">E-handel</option>
                  <option value="IT-konsult">IT-konsult</option>
                  <option value="Restaurang">Restaurang</option>
                  <option value="Träningscenter">Gym/Träning</option>
                  <option value="Redovisningsbyrå">Redovisning</option>
                </select>

                {/* Price Range */}
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="select-field text-xs sm:text-sm py-2 sm:py-3"
                >
                  <option value="">Alla priser</option>
                  <option value="0-500">0-500k</option>
                  <option value="500-1m">500k-1M</option>
                  <option value="1m-5m">1M-5M</option>
                  <option value="5m-10m">5M-10M</option>
                  <option value="10m+">10M+</option>
                </select>

                {/* Sort By */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="select-field text-xs sm:text-sm py-2 sm:py-3"
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
                    className="btn-ghost text-error hover:bg-error/10 flex items-center justify-center text-xs sm:text-sm py-2 sm:py-3 col-span-1"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Rensa
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-text-dark">
            {filteredObjects.length} företag {activeFilterCount > 0 && 'matchade'}
          </h2>
          {!loading && filteredObjects.length > 0 && (
            <p className="text-xs sm:text-sm text-text-gray hidden md:block">
              Alla annonser är verifierade
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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