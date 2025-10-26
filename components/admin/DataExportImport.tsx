'use client'
import { useState, useEffect } from 'react'
import { Download, Upload, RefreshCw, Trash2 } from 'lucide-react'

export default function DataExportImport() {
  const [exports, setExports] = useState<any[]>([])
  const [dataType, setDataType] = useState('users')
  const [format, setFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadExports()
  }, [])

  const loadExports = async () => {
    try {
      const response = await fetch('/api/admin/data-export')
      const data = await response.json()
      setExports(data.exports)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/admin/data-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataType, format })
      })
      const data = await response.json()
      if (data.success) {
        loadExports()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <Download className="w-6 h-6" /> Data Export & Import
        </h2>
        <p className="text-gray-600 text-sm">Export and import bulk data</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
        <h3 className="font-bold text-primary-navy">Export Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Data Type</label>
            <select value={dataType} onChange={(e) => setDataType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="users">Users</option>
              <option value="listings">Listings</option>
              <option value="transactions">Transactions</option>
              <option value="payments">Payments</option>
              <option value="messages">Messages</option>
              <option value="ndas">NDAs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleExport} disabled={exporting} className="w-full px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
              {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-primary-navy">Export History</h3>
        {exports.map((exp) => (
          <div key={exp.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="font-semibold text-gray-900">{exp.dataType.toUpperCase()} - {exp.format.toUpperCase()}</p>
              <p className="text-xs text-gray-600 mt-1">{exp.recordCount} records · {exp.fileSize} MB · {new Date(exp.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-blue-100 rounded text-blue-600"><Download className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-red-100 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
        <h3 className="font-bold text-primary-navy mb-2 flex items-center gap-2">
          <Upload className="w-5 h-5" /> Import Data
        </h3>
        <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 cursor-pointer transition-colors">
          <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-700">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">CSV, JSON or Excel files</p>
        </div>
      </div>
    </div>
  )
}
