'use client'
import { useState, useEffect } from 'react'
import { FileText, Download, Trash2, RefreshCw, Plus, Filter, BarChart3, FileJson, File } from 'lucide-react'
import { useReports } from '@/lib/api-hooks'

export default function ReportGeneration() {
  const { fetchReports, generateReport, loading, error } = useReports()
  const [reports, setReports] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [stats, setStats] = useState({ total: 0, completed: 0, generating: 0, totalDownloads: 0 })
  const [showGenerator, setShowGenerator] = useState(false)
  const [selectedType, setSelectedType] = useState('financial')
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadReports(1)
  }, [])

  const loadReports = async (page: number) => {
    try {
      const result = await fetchReports({ page, limit: pagination.limit })
      setReports(result.data)
      setPagination(result.pagination)
      setStats(result.stats)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const result = await generateReport(selectedType, selectedFormat)
      if (result.success) {
        loadReports(1)
        setShowGenerator(false)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setGenerating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getFormatIcon = (format: string) => {
    return format === 'pdf' ? <FileText className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy flex items-center gap-2 mb-2">
          <FileText className="w-6 h-6" /> Report Generation
        </h2>
        <p className="text-gray-600 text-sm">Generate and manage PDF/Excel reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">TOTAL REPORTS</div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 font-semibold mb-1">COMPLETED</div>
          <div className="text-3xl font-bold text-green-900">{stats.completed}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-700 font-semibold mb-1">GENERATING</div>
          <div className="text-3xl font-bold text-yellow-900">{stats.generating}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-xs text-orange-700 font-semibold mb-1">TOTAL DOWNLOADS</div>
          <div className="text-3xl font-bold text-orange-900">{stats.totalDownloads}</div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setShowGenerator(!showGenerator)} className="px-4 py-2 bg-accent-pink text-white rounded-lg hover:shadow-md flex items-center gap-2 font-medium text-sm">
          <Plus className="w-4 h-4" /> Generate Report
        </button>
        <button onClick={() => loadReports(pagination.page)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 font-medium text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {showGenerator && (
        <div className="bg-gradient-to-br from-accent-pink/10 to-accent-orange/10 border-2 border-accent-pink rounded-lg p-6">
          <h3 className="text-lg font-bold text-primary-navy mb-4">Create New Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-pink focus:border-transparent">
                <option value="financial">Financial Report</option>
                <option value="users">User Metrics</option>
                <option value="listings">Listing Performance</option>
                <option value="fraud">Fraud Detection</option>
                <option value="transactions">Transaction Summary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
              <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-pink focus:border-transparent">
                <option value="pdf">PDF</option>
                <option value="excel">Excel (XLSX)</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={handleGenerateReport} disabled={generating} className="flex-1 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generating ? 'Generating...' : 'Generate'}
              </button>
              <button onClick={() => setShowGenerator(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reports yet</div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {getFormatIcon(report.format)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{report.name}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-600">
                    <span>📋 {report.type}</span>
                    <span>📦 {report.fileSize} MB</span>
                    <span>👤 {report.createdBy}</span>
                    <span>📥 {report.downloadCount} downloads</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(report.status)}`}>
                  {report.status.toUpperCase()}
                </span>
                {report.status === 'completed' && (
                  <>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => loadReports(Math.max(1, pagination.page - 1))} disabled={pagination.page === 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
            ← Previous
          </button>
          <span className="text-sm font-medium">Page {pagination.page} of {pagination.pages}</span>
          <button onClick={() => loadReports(Math.min(pagination.pages, pagination.page + 1))} disabled={pagination.page === pagination.pages} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
