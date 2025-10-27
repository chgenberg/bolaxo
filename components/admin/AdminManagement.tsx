'use client'
import { useState, useEffect } from 'react'
import { Shield, Plus, RefreshCw, ChevronLeft, ChevronRight, Search, Lock, Eye, Trash2, Edit, CheckCircle, AlertCircle } from 'lucide-react'
import { useAdminManagement } from '@/lib/api-hooks'

export default function AdminManagement() {
  const { fetchAdmins, updateAdmin, loading, error } = useAdminManagement()
  const [admins, setAdmins] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState<any>({})
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editingAdmin, setEditingAdmin] = useState<any>(null)

  useEffect(() => {
    loadAdmins(1)
  }, [])

  const loadAdmins = async (page: number) => {
    try {
      const result = await fetchAdmins({
        page,
        limit: pagination.limit,
        role: roleFilter || undefined,
        status: statusFilter || undefined
      })
      setAdmins(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleUpdateAdmin = async (adminId: string, updates: any) => {
    try {
      await updateAdmin(adminId, updates)
      loadAdmins(pagination.page)
      setEditingAdmin(null)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'super_admin': return 'bg-red-100 text-red-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'moderator': return 'bg-purple-100 text-purple-800'
      case 'analyst': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6" /> Admin User Management
        </h2>
        <p className="text-gray-600 text-sm">Manage admin users, roles, and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">SUPER ADMIN</div>
          <div className="text-3xl font-bold text-blue-900">{stats.super_admin || 0}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">ADMINS</div>
          <div className="text-3xl font-bold text-blue-900">{stats.admin || 0}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs text-purple-700 font-semibold mb-1">MODERATORS</div>
          <div className="text-3xl font-bold text-purple-900">{stats.moderator || 0}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">ACTIVE</div>
          <div className="text-3xl font-bold text-green-900">{stats.active || 0}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-700 font-semibold mb-1">INACTIVE</div>
          <div className="text-3xl font-bold text-red-900">{stats.inactive || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-2 flex-wrap">
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); loadAdmins(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="analyst">Analyst</option>
          <option value="support">Support</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); loadAdmins(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={() => loadAdmins(pagination.page)} className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-medium">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Role</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">2FA</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Last Login</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Activity</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{admin.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{admin.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(admin.role)}`}>
                    {admin.role.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    {admin.status === 'active' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={admin.status === 'active' ? 'text-green-600' : 'text-red-600'} >
                      {admin.status.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {admin.twoFactorEnabled ? (
                    <Lock className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="text-gray-400 text-xs">disabled</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString().split(',')[0] : 'Never'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{admin.activityCount}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <button onClick={() => setEditingAdmin(admin)} className="p-1 hover:bg-blue-100 rounded text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-red-100 rounded text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-bold text-primary-navy">Edit Admin: {editingAdmin.name}</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
              <select defaultValue={editingAdmin.role} onChange={(e) => setEditingAdmin({...editingAdmin, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="analyst">Analyst</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select defaultValue={editingAdmin.status} onChange={(e) => setEditingAdmin({...editingAdmin, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={editingAdmin.twoFactorEnabled} onChange={(e) => setEditingAdmin({...editingAdmin, twoFactorEnabled: e.target.checked})} />
              <span className="text-sm font-medium">Enable 2FA</span>
            </label>
            <div className="flex gap-2 pt-4">
              <button onClick={() => handleUpdateAdmin(editingAdmin.id, editingAdmin)} className="flex-1 px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 font-medium">
                Save
              </button>
              <button onClick={() => setEditingAdmin(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => loadAdmins(Math.max(1, pagination.page - 1))} disabled={pagination.page === 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">Page {pagination.page} of {pagination.pages}</span>
          <button onClick={() => loadAdmins(Math.min(pagination.pages, pagination.page + 1))} disabled={pagination.page === pagination.pages} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
