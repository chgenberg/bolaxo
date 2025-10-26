'use client'

import { useState, useEffect } from 'react'
import {
  Search, ChevronDown, Users, Mail, CheckCircle, XCircle,
  MoreVertical, Eye, Lock, Trash2, ZoomIn, RefreshCw, Filter,
  ChevronUp, ChevronLeft, ChevronRight, Copy, Send, Share2
} from 'lucide-react'
import { useAdminUsers } from '@/lib/api-hooks'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  verified: boolean
  bankIdVerified: boolean
  phone: string | null
  companyName: string | null
  orgNumber: string | null
  region: string | null
  referralCode: string | null
  createdAt: string
  lastLoginAt: string | null
  _count: {
    listings: number
    valuations: number
  }
}

interface UserManagementProps {
  onUserSelect?: (user: User) => void
}

export default function UserManagement({ onUserSelect }: UserManagementProps) {
  const { fetchUsers, updateUser, deleteUser, resetPassword, bulkAction, loading, error } = useAdminUsers()
  
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showReferralModal, setShowReferralModal] = useState<User | null>(null)

  // Load users
  useEffect(() => {
    loadUsers(1)
  }, [])

  const loadUsers = async (page: number) => {
    try {
      const result = await fetchUsers({
        page,
        limit: pagination.limit,
        role: roleFilter || undefined,
        search: search || undefined,
        verified: verifiedFilter === '' ? undefined : verifiedFilter === 'true',
        sortBy,
        sortOrder,
      })
      setUsers(result.data)
      setPagination(result.pagination)
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  const handleSearch = (term: string) => {
    setSearch(term)
    loadUsers(1)
  }

  const handleFilterChange = (filter: string, value: string) => {
    if (filter === 'role') setRoleFilter(value)
    else if (filter === 'verified') setVerifiedFilter(value)
    loadUsers(1)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)))
    }
  }

  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedUsers.size === 0) {
      alert('Please select users first')
      return
    }

    if (confirm(`Are you sure you want to ${action} for ${selectedUsers.size} users?`)) {
      try {
        await bulkAction(Array.from(selectedUsers), action, data)
        setSelectedUsers(new Set())
        loadUsers(pagination.page)
      } catch (err) {
        console.error('Bulk action failed:', err)
      }
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser(userId, { role: newRole })
      loadUsers(pagination.page)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error updating role:', err)
    }
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure? This will delete the user account.')) {
      try {
        await deleteUser(userId)
        loadUsers(pagination.page)
        setActiveMenu(null)
      } catch (err) {
        console.error('Error deleting user:', err)
      }
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      const result = await resetPassword(userId)
      alert(`Magic link generated: ${result.data.magicLink}\n\nIn production, this would be sent via email.`)
      setActiveMenu(null)
    } catch (err) {
      console.error('Error resetting password:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Users className="w-6 h-6" />
          User Management
        </h2>
        <p className="text-gray-600 text-sm">
          Total users: {pagination.total} | Selected: {selectedUsers.size}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email, name, company..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => handleFilterChange('role', e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
        >
          <option value="">All Roles</option>
          <option value="seller">Sellers</option>
          <option value="buyer">Buyers</option>
          <option value="broker">Brokers</option>
        </select>

        <select
          value={verifiedFilter}
          onChange={(e) => handleFilterChange('verified', e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
        >
          <option value="">All Statuses</option>
          <option value="true">Email Verified</option>
          <option value="false">Not Verified</option>
        </select>

        <button
          onClick={() => loadUsers(pagination.page)}
          className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedUsers.size} user(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('verify_email')}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Verify Email
            </button>
            <button
              onClick={() => handleBulkAction('change_role', { role: 'seller' })}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Set as Seller
            </button>
            <button
              onClick={() => handleBulkAction('change_role', { role: 'buyer' })}
              className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
            >
              Set as Buyer
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === users.length && users.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-center">Verified</th>
                <th className="px-4 py-3 text-center">BankID</th>
                <th className="px-4 py-3 text-right">Listings</th>
                <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('createdAt')}>
                  Joined {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <div className="inline-block w-6 h-6 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
              {!loading && users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{user.email}</td>
                  <td className="px-4 py-3">{user.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'buyer' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.verified ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.bankIdVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{user._count.listings}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenu === user.id && (
                      <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[200px]">
                        <button
                          onClick={() => {
                            onUserSelect?.(user)
                            setShowReferralModal(user)
                            setActiveMenu(null)
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" /> View Referrals
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Lock className="w-4 h-4" /> Reset Password
                        </button>
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          onClick={() => handleRoleChange(user.id, 'seller')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Set as Seller
                        </button>
                        <button
                          onClick={() => handleRoleChange(user.id, 'buyer')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Set as Buyer
                        </button>
                        <button
                          onClick={() => handleRoleChange(user.id, 'broker')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Set as Broker
                        </button>
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete User
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
            onClick={() => loadUsers(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => loadUsers(Math.min(pagination.pages, pagination.page + 1))}
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

      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal user={showReferralModal} onClose={() => setShowReferralModal(null)} />
      )}
    </div>
  )
}

// Referral Modal Component
function ReferralModal({ user, onClose }: { user: User; onClose: () => void }) {
  const { getReferralTree, loading } = useAdminUsers()
  const [referralData, setReferralData] = useState<any>(null)

  useEffect(() => {
    loadReferralData()
  }, [user.id])

  const loadReferralData = async () => {
    try {
      const result = await getReferralTree(user.id)
      setReferralData(result.data)
    } catch (err) {
      console.error('Error loading referral tree:', err)
    }
  }

  if (loading || !referralData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="w-8 h-8 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const { stats, referrer, directReferrals, indirectReferrals } = referralData

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary-navy">Referral Tree - {user.email}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-navy">{stats.directReferralCount}</div>
              <div className="text-xs text-gray-600 mt-1">Direct Referrals</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.indirectReferralCount}</div>
              <div className="text-xs text-gray-600 mt-1">Indirect Referrals</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalReferrals}</div>
              <div className="text-xs text-gray-600 mt-1">Total</div>
            </div>
          </div>

          {/* Referrer */}
          {referrer && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Referred By</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-mono text-sm text-gray-700">{referrer.email}</div>
                <div className="text-xs text-gray-500 mt-1">{referrer.name}</div>
              </div>
            </div>
          )}

          {/* Direct Referrals */}
          {directReferrals.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Direct Referrals ({directReferrals.length})</h4>
              <div className="space-y-2">
                {directReferrals.map((referral: any) => (
                  <div key={referral.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="font-mono text-gray-700">{referral.email}</div>
                    <div className="text-xs text-gray-500">{referral.name} • {referral.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indirect Referrals */}
          {indirectReferrals.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Indirect Referrals ({indirectReferrals.length})</h4>
              <div className="space-y-2">
                {indirectReferrals.map((referral: any) => (
                  <div key={referral.id} className="bg-blue-50 rounded-lg p-3 text-sm border-l-2 border-blue-300">
                    <div className="font-mono text-gray-700">{referral.email}</div>
                    <div className="text-xs text-gray-500">{referral.name} • {referral.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
