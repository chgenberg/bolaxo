'use client'
import { useState, useEffect } from 'react'
import { Lock, RefreshCw, Check, X } from 'lucide-react'

export default function PermissionsMatrix() {
  const [permissions, setPermissions] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState('super_admin')
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [localPerms, setLocalPerms] = useState<any>(null)

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/admin/permissions')
      const data = await response.json()
      setPermissions(data)
      setLocalPerms(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePermission = (module: string, action: string) => {
    const actions = localPerms.permissions[selectedRole]?.[module] || []
    if (actions.includes(action)) {
      setLocalPerms({
        ...localPerms,
        permissions: {
          ...localPerms.permissions,
          [selectedRole]: {
            ...localPerms.permissions[selectedRole],
            [module]: actions.filter((a: string) => a !== action)
          }
        }
      })
    } else {
      setLocalPerms({
        ...localPerms,
        permissions: {
          ...localPerms.permissions,
          [selectedRole]: {
            ...localPerms.permissions[selectedRole],
            [module]: [...actions, action]
          }
        }
      })
    }
  }

  const hasPermission = (module: string, action: string) => {
    const actions = localPerms?.permissions[selectedRole]?.[module] || []
    return actions.includes(action)
  }

  if (loading || !permissions) return <div className="text-center py-8">Loading...</div>

  const rolePermissions = permissions.permissions[selectedRole] || {}
  const modules = Object.keys(rolePermissions).sort()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Lock className="w-6 h-6" /> Permissions Matrix
        </h2>
        <p className="text-gray-600 text-sm">Manage role-based access control</p>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <select value={selectedRole} onChange={(e) => { setSelectedRole(e.target.value); setEditMode(false); }} className="px-4 py-2 border border-gray-300 rounded-lg font-medium">
          {permissions.roles.map((role: string) => (
            <option key={role} value={role}>{role.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
        <button onClick={() => setEditMode(!editMode)} className={`px-4 py-2 rounded-lg font-medium ${editMode ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
          {editMode ? 'Cancel' : 'Edit'}
        </button>
        <button onClick={fetchPermissions} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 font-medium">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 min-w-40">MODULE</th>
              {permissions.allActions.slice(0, 12).map((action: string) => (
                <th key={action} className="text-center px-2 py-3 text-xs font-semibold text-gray-700 min-w-20">
                  {action.replace('_', ' ').substring(0, 8)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">{module}</td>
                {permissions.allActions.slice(0, 12).map((action: string) => (
                  <td key={`${module}-${action}`} className="text-center px-2 py-3">
                    {editMode ? (
                      <input
                        type="checkbox"
                        checked={hasPermission(module, action)}
                        onChange={() => handleTogglePermission(module, action)}
                        className="w-5 h-5 rounded border-gray-300 text-accent-pink cursor-pointer"
                      />
                    ) : (
                      hasPermission(module, action) ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Role:</strong> {selectedRole.replace('_', ' ').toUpperCase()}<br />
          <strong>Modules:</strong> {modules.length}<br />
          <strong>Total Actions:</strong> {modules.reduce((sum, m) => sum + (rolePermissions[m]?.length || 0), 0)}
        </p>
      </div>

      {editMode && (
        <div className="flex gap-2">
          <button onClick={() => { /* save logic */ }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Save Changes
          </button>
          <button onClick={() => setEditMode(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
