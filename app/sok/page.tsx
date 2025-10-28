'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { mockObjects, BusinessObject } from '@/data/mockObjects'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import ObjectCard from '@/components/ObjectCard'
import MultiSelect from '@/components/MultiSelect'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import AdvancedFilterDropdown from '@/components/AdvancedFilterDropdown'
import { Search, SlidersHorizontal, ChevronDown, X, TrendingUp, AlertCircle, MapPin, Briefcase, DollarSign, Users, Calendar, Shield, BarChart3, Filter, Zap } from 'lucide-react'

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
    categories: [] as string[],
    priceRange: [0, 150000000] as [number, number],
    revenueRange: '',
    locations: [] as string[],
    employees: '',
    sortBy: 'newest',
    verified: 'all',
    broker: 'all'
  })

  // Check buyer profile on mount
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        // Allow non-logged-in users to browse
        setProfileChecked(true)
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
  const activeFilterCount = 
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 150000000 ? 1 : 0) +
    (filters.revenueRange ? 1 : 0) +
    (filters.locations.length > 0 ? 1 : 0) +
    (filters.employees ? 1 : 0) +
    (filters.verified !== 'all' ? 1 : 0) +
    (filters.broker !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0)

  // Initialize with listings from database on mount
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
            employees: listing.employees?.toString() || '0',
            image: listing.image,
            verified: listing.verified,
            isNew: listing.isNew,
            broker: listing.broker,
            views: listing.views || 0,
            createdAt: new Date(listing.createdAt),
            ebitda: listing.ebitda || 0,
            ownerRole: '',
            strengths: listing.strengths || [],
            risks: listing.risks || [],
            whySelling: listing.whySelling || '',
            companyName: listing.companyName,
            orgNumber: listing.orgNumber || '',
            address: listing.address || '',
            detailedFinancials: {},
            customers: [],
            ndaRequired: false
          }))
          
          setAllObjects(transformedListings)
          setFilteredObjects(transformedListings)
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
        // Fallback to mock objects if API fails
        setAllObjects(mockObjects)
        setFilteredObjects(mockObjects)
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

      // Categories filter (multi-select)
      if (filters.categories.length > 0) {
        filtered = filtered.filter(obj => filters.categories.includes(obj.type))
      }

      // Price range filter
      const [minPrice, maxPrice] = filters.priceRange
      filtered = filtered.filter(obj => {
        const price = obj.price || obj.priceMin
        return price >= minPrice && price <= maxPrice
      })

      // Revenue range filter
      if (filters.revenueRange) {
        const [min, max] = filters.revenueRange.split('-').map(v => v === '+' ? Infinity : parseInt(v))
        filtered = filtered.filter(obj => {
          const revenueInMSEK = obj.revenue / 1000000
          if (max === Infinity) return revenueInMSEK >= min
          return revenueInMSEK >= min && revenueInMSEK <= max
        })
      }

      // Locations filter (multi-select)
      if (filters.locations.length > 0) {
        filtered = filtered.filter(obj => filters.locations.includes(obj.region))
      }

      // Employees filter
      if (filters.employees) {
        filtered = filtered.filter(obj => obj.employees === filters.employees)
      }

      // Verified filter
      if (filters.verified !== 'all') {
        filtered = filtered.filter(obj => obj.verified === (filters.verified === 'verified'))
      }

      // Broker filter
      if (filters.broker !== 'all') {
        filtered = filtered.filter(obj => obj.broker === (filters.broker === 'broker'))
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
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        default:
          break
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
      categories: [],
      priceRange: [0, 150000000],
      revenueRange: '',
      locations: [],
      employees: '',
      sortBy: 'newest',
      verified: 'all',
      broker: 'all'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-background-off-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark text-center uppercase">
            Sök bland {allObjects.length} företag till salu
          </h1>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-16 sm:top-20 md:top-24 z-20 bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search and Filter Toggle Row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              {/* Enhanced Search Input */}
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/20 to-primary-dark/20 rounded-button blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray group-focus-within:text-primary-blue transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="Sök företag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="relative w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-button text-sm sm:text-base text-text-dark placeholder-text-gray
                      focus:border-primary-blue focus:outline-none focus:shadow-lg focus:shadow-primary-blue/10
                      transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray hover:text-error transition-colors z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  relative px-4 sm:px-6 py-3 sm:py-3.5 rounded-button font-medium text-sm sm:text-base
                  transition-all duration-300 transform
                  flex items-center justify-center gap-2 whitespace-nowrap
                  ${showFilters 
                    ? 'bg-gradient-to-r from-primary-blue to-primary-dark text-white shadow-xl scale-105' 
                    : 'bg-white text-text-dark border-2 border-gray-200 hover:border-primary-blue hover:shadow-lg'
                  }
                `}
              >
                <Filter className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                <span className="hidden sm:inline">Avancerade filter</span>
                <span className="sm:hidden">Filter</span>
                {activeFilterCount > 0 && (
                  <span className={`
                    px-1.5 sm:px-2 py-0.5 rounded-full text-xs sm:text-sm font-bold
                    ${showFilters ? 'bg-white text-primary-blue' : 'bg-primary-blue text-white'}
                    animate-pulse
                  `}>
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Enhanced Collapsible Filters */}
            {showFilters && (
              <div className="animate-slide-down">
                <div className="bg-white rounded-button border border-gray-200 p-4 sm:p-6 shadow-inner">
                  {/* Primary Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {/* Industries Multi-Select */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                      <MultiSelect
                        options={[
                          { value: 'SaaS-företag', label: 'SaaS-företag' },
                          { value: 'E-handel', label: 'E-handel' },
                          { value: 'IT-konsult', label: 'IT-konsult' },
                          { value: 'Konsultbolag', label: 'Konsultbolag' },
                          { value: 'Restaurang', label: 'Restaurang' },
                          { value: 'Träningscenter', label: 'Gym/Träning' },
                          { value: 'Redovisningsbyrå', label: 'Redovisningsbyrå' },
                          { value: 'Marknadsföringsbyrå', label: 'Marknadsföringsbyrå' },
                          { value: 'Bygg & Fastighet', label: 'Bygg & Fastighet' },
                          { value: 'Café & Bageri', label: 'Café & Bageri' },
                          { value: 'E-learning plattform', label: 'E-learning' },
                          { value: 'HR-tech SaaS', label: 'HR-tech' },
                          { value: 'CRM-system SaaS', label: 'CRM-system' },
                          { value: 'Webbyrå', label: 'Webbyrå' },
                          { value: 'Tech-support företag', label: 'Tech-support' },
                          { value: 'Städbolag', label: 'Städbolag' },
                          { value: 'Möbelaffär', label: 'Möbelaffär' },
                          { value: 'Frisörsalong', label: 'Frisörsalong' },
                          { value: 'Hundtrimning & djuraffär', label: 'Djuraffär' },
                          { value: 'Bageri & konditori', label: 'Bageri' },
                          { value: 'Cykelbutik', label: 'Cykelbutik' }
                        ]}
                        value={filters.categories}
                        onChange={(value) => setFilters({...filters, categories: value})}
                        placeholder="Välj branscher"
                      />
                    </div>

                    {/* Locations Multi-Select */}
                    <div>
                      <MultiSelect
                        options={[
                          { value: 'Stockholm', label: 'Stockholm' },
                          { value: 'Göteborg', label: 'Göteborg' },
                          { value: 'Malmö', label: 'Malmö' },
                          { value: 'Uppsala', label: 'Uppsala' }
                        ]}
                        value={filters.locations}
                        onChange={(value) => setFilters({...filters, locations: value})}
                        placeholder="Välj platser"
                      />
                    </div>

                    {/* Revenue Range */}
                    <div>
                      <AdvancedFilterDropdown
                        label="Omsättning"
                        icon={<BarChart3 className="w-4 h-4" />}
                        options={[
                          { value: '', label: 'Alla omsättningar', description: 'Visa alla' },
                          { value: '0-1', label: '0-1 MSEK', description: 'Små företag' },
                          { value: '1-5', label: '1-5 MSEK', description: 'Mindre företag' },
                          { value: '5-10', label: '5-10 MSEK', description: 'Mellanstora' },
                          { value: '10-25', label: '10-25 MSEK', description: 'Större företag' },
                          { value: '25-50', label: '25-50 MSEK', description: 'Stora företag' },
                          { value: '50+', label: '50+ MSEK', description: 'Mycket stora' }
                        ]}
                        value={filters.revenueRange}
                        onChange={(value) => setFilters({...filters, revenueRange: value})}
                      />
                    </div>

                    {/* Sort Options */}
                    <div>
                      <AdvancedFilterDropdown
                        label="Sortera efter"
                        icon={<TrendingUp className="w-4 h-4" />}
                        options={[
                          { value: 'newest', label: 'Nyast först', icon: <Calendar className="w-4 h-4" /> },
                          { value: 'price-low', label: 'Lägsta pris', icon: <DollarSign className="w-4 h-4" /> },
                          { value: 'price-high', label: 'Högsta pris', icon: <DollarSign className="w-4 h-4" /> },
                          { value: 'revenue-high', label: 'Högsta omsättning', icon: <BarChart3 className="w-4 h-4" /> },
                          { value: 'most-viewed', label: 'Mest visade', icon: <TrendingUp className="w-4 h-4" /> }
                        ]}
                        value={filters.sortBy}
                        onChange={(value) => setFilters({...filters, sortBy: value})}
                      />
                    </div>
                  </div>

                  {/* Price Range Slider */}
                  <div className="mb-4 sm:mb-6 bg-gray-50 rounded-button p-3 sm:p-4">
                    <PriceRangeSlider
                      min={0}
                      max={150000000}
                      value={filters.priceRange}
                      onChange={(value) => setFilters({...filters, priceRange: value})}
                      step={500000}
                    />
                  </div>

                  {/* Secondary Filters Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Employees */}
                    <AdvancedFilterDropdown
                      label="Antal anställda"
                      icon={<Users className="w-4 h-4" />}
                      options={[
                        { value: '', label: 'Alla storlekar' },
                        { value: '1-5', label: '1-5 anställda' },
                        { value: '6-10', label: '6-10 anställda' },
                        { value: '11-25', label: '11-25 anställda' },
                        { value: '26-50', label: '26-50 anställda' }
                      ]}
                      value={filters.employees}
                      onChange={(value) => setFilters({...filters, employees: value})}
                    />

                    {/* Verified Status */}
                    <AdvancedFilterDropdown
                      label="Verifiering"
                      icon={<Shield className="w-4 h-4" />}
                      options={[
                        { value: 'all', label: 'Alla annonser' },
                        { value: 'verified', label: 'Endast verifierade', icon: <Shield className="w-4 h-4 text-success" /> },
                        { value: 'unverified', label: 'Ej verifierade' }
                      ]}
                      value={filters.verified}
                      onChange={(value) => setFilters({...filters, verified: value})}
                    />

                    {/* Broker Status */}
                    <AdvancedFilterDropdown
                      label="Förmedlare"
                      icon={<Briefcase className="w-4 h-4" />}
                      options={[
                        { value: 'all', label: 'Alla säljare' },
                        { value: 'broker', label: 'Via mäklare', icon: <Briefcase className="w-4 h-4" /> },
                        { value: 'owner', label: 'Direkt från ägare' }
                      ]}
                      value={filters.broker}
                      onChange={(value) => setFilters({...filters, broker: value})}
                    />

                    {/* Quick Actions */}
                    <div className="flex items-end">
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-error/10 text-error rounded-button hover:bg-error hover:text-white transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                          <X className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="hidden sm:inline">Rensa alla filter</span>
                          <span className="sm:hidden">Rensa</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {activeFilterCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-text-gray">
                        <Zap className="w-4 h-4 text-primary-blue" />
                        <span>Aktiva filter: {activeFilterCount}</span>
                        <span className="text-primary-blue font-medium">• {filteredObjects.length} resultat</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-text-dark">
            {filteredObjects.length} företag {activeFilterCount > 0 && 'matchade'}
          </h2>
          {!loading && filteredObjects.length > 0 && (
            <p className="text-xs sm:text-sm text-text-gray hidden lg:block">
              Alla annonser är verifierade
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card animate-pulse p-4 sm:p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full md:w-2/3" />
                <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && filteredObjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {filteredObjects.map((object) => (
              <ObjectCard key={object.id} object={object} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredObjects.length === 0 && (
          <div className="card text-center py-6 sm:py-8 md:py-12 max-w-md mx-auto">
            <AlertCircle className="w-12 sm:w-16 h-12 sm:h-16 text-text-gray/50 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-2">
              Inga företag hittades
            </h3>
            <p className="text-sm sm:text-base text-text-gray mb-4 sm:mb-6 px-4">
              Prova att justera dina filter eller sökord för att se fler resultat
            </p>
            <button 
              onClick={clearAllFilters}
              className="btn-secondary mx-auto text-sm sm:text-base"
            >
              Rensa alla filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}