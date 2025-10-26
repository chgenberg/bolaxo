'use client'

import { useState, useEffect } from 'react'
import {
  Search, ChevronLeft, ChevronRight, MoreVertical, Trash2, RefreshCw,
  Check, X, Clock, Package, Eye, MapPin, DollarSign, Users, Calendar
} from 'lucide-react'
import { useAdminListings } from '@/lib/api-hooks'

interface Listing {
  id: string
  companyName: string | null
  anonymousTitle: string
  type: string
  industry: string
  location: string
  region: string
  revenue: number
  revenueRange: string
  priceMin: number
  priceMax: number
  employees: number
  status: string
  packageType: string
  verified: boolean
  views: number
  broker: boolean
  createdAt: string
  publishedAt: string | null
  expiresAt: string | null
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

export default function ListingManagement() {
  const { fetchListings, updateListing, deleteListing, bulkAction, loading, error } = useAdminListings()
  
  const [listings, setListings] = useState<Listing[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [packageFilter, setPackageFilter] = useState('')
  const [selectedListings, setSelectedListings] = useState<Set<string>>(new Set())
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    loadListings(1)
  }, [])

  const loadListings = async (page: number) => {
    try {
      const result = await fetchListings({
        page,
        limit: pagination.limit,
        search: search || undefined,
        status: statusFilter || undefined,
        industry: industryFilter || undefined,
        location: locationFilter || undefined,
        packageType: packageFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
      setListings(result.data)
      setPagination(result.pagination)
    } catch (err) {
      console.error('Error loading listings:', err)
    }
  }

  const handleSearch = (term: string) => {
    setSearch(term)
    loadListings(1)
  }

  const handleFilterChange = (filter: string, value: string) => {
    if (filter === 'status') setStatusFilter(value)
    else if (filter === 'industry') setIndustryFilter(value)
    else if (filter === 'location') setLocationFilter(value)
    else if (filter === 'package') setPackageFilter(value)
    loadListings(1)
  }

  const handleSelectListing = (listingId: string) => {
    const newSelected = new Set(selectedListings)
    if (newSelected.has(listingId)) {
      newSelected.delete(listingId)
    } else {
      newSelected.add(listingId)
    }
    setSelectedListings(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedListings.size === listings.length) {
      setSelectedListings(new Set())
    } else {
      setSelectedListings(new Set(listings.map(l => l.id)))
    }
  }

  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedListings.size === 0) {
      alert('Please select listings first')
      return
    }

    if (confirm(`Are you sure you want to ${action} for ${selectedListings.size} listings?`)) {
      try {
        await bulkAction(Array.from(selectedListings), action, data)
        setSelectedListings(new Set())
        loadListings(pagination.page)
      } catch (err) {
        console.error('Bulk action failed:', err)
      }
    }
  }

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    try {
      await updateListing(listingId, { status: newStatus })
      loadListings(pagination.page)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleDelete = async (listingId: string) => {
    if (confirm('Are you sure? This will permanently delete the listing.')) {
      try {
        await deleteListing(listingId)
        loadListings(pagination.page)
        setActiveMenu(null)
      } catch (err) {
        console.error('Error deleting listing:', err)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPackageColor = (pkg: string) => {
    switch (pkg) {
      case 'basic': return 'bg-blue-50 text-blue-700'
      case 'pro': return 'bg-purple-50 text-purple-700'
      case 'pro_plus': return 'bg-pink-50 text-pink-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Search className="w-6 h-6" />
          Listing Management
        </h2>
        <p className="text-gray-600 text-sm">
          Total listings: {pagination.total} | Selected: {selectedListings.size}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="paused">Paused</option>
          <option value="sold">Sold</option>
        </select>

        <select
          value={packageFilter}
          onChange={(e) => handleFilterChange('package', e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink text-sm"
        >
          <option value="">All Packages</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="pro_plus">Pro Plus</option>
        </select>

        <button
          onClick={() => loadListings(pagination.page)}
          className="px-3 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedListings.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedListings.size} listing(s) selected
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Activate
            </button>
            <button
              onClick={() => handleBulkAction('pause')}
              className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 flex items-center gap-1"
            >
              <Clock className="w-3 h-3" /> Pause
            </button>
            <button
              onClick={() => handleBulkAction('renew')}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" /> Renew
            </button>
            <button
              onClick={() => handleBulkAction('verify')}
              className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Verify
            </button>
          </div>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedListings.size === listings.length && listings.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Seller</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center hidden lg:table-cell">Package</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Views</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <div className="inline-block w-6 h-6 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                  </td>
                </tr>
              )}
              {!loading && listings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No listings found
                  </td>
                </tr>
              )}
              {!loading && listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedListings.has(listing.id)}
                      onChange={() => handleSelectListing(listing.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold text-gray-900">{listing.anonymousTitle}</div>
                      <div className="text-xs text-gray-500">{listing.industry}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-xs">
                      <div className="font-mono text-gray-700">{listing.user.email}</div>
                      <div className="text-gray-500">{listing.user.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(listing.status)}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getPackageColor(listing.packageType)}`}>
                      {listing.packageType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-semibold">
                      {listing.priceMin && listing.priceMax ? (
                        <>{(listing.priceMin / 1000000).toFixed(1)}—{(listing.priceMax / 1000000).toFixed(1)}M SEK</>
                      ) : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <Eye className="w-3 h-3 text-gray-400" />
                      <span className="font-semibold">{listing.views}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === listing.id ? null : listing.id)}
                      className="p-1 hover:bg-gray-100 rounded inline-block"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenu === listing.id && (
                      <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[180px]">
                        {listing.status !== 'active' && (
                          <button
                            onClick={() => handleStatusChange(listing.id, 'active')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Check className="w-3 h-3" /> Activate
                          </button>
                        )}
                        {listing.status !== 'paused' && (
                          <button
                            onClick={() => handleStatusChange(listing.id, 'paused')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Clock className="w-3 h-3" /> Pause
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(listing.id, 'sold')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Mark as Sold
                        </button>
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => loadListings(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadListings(Math.min(pagination.pages, pagination.page + 1))}
            disabled={pagination.page === pagination.pages}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  )
}
