'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { FileText, Folder, Download, Upload, Search, Grid, List, Plus, MoreVertical } from 'lucide-react'

export default function DocumentsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  
  const folders = [
    {
      id: 'folder-001',
      name: 'E-handelsföretag Stockholm',
      type: 'listing',
      documents: 12,
      size: '45.2 MB',
      lastModified: '2024-06-19',
      shared: 3
    },
    {
      id: 'folder-002',
      name: 'SaaS-bolag ARR 8 MSEK',
      type: 'listing',
      documents: 8,
      size: '28.7 MB',
      lastModified: '2024-06-18',
      shared: 5
    },
    {
      id: 'folder-003',
      name: 'Mallar och avtal',
      type: 'templates',
      documents: 15,
      size: '12.3 MB',
      lastModified: '2024-06-15',
      shared: 0
    }
  ]

  const recentDocuments = [
    {
      id: 'doc-001',
      name: 'NDA_Tech_Innovations.pdf',
      type: 'pdf',
      size: '245 KB',
      folder: 'E-handelsföretag Stockholm',
      uploadedBy: 'Johan Svensson',
      uploadedAt: '2024-06-20 14:30',
      status: 'signed'
    },
    {
      id: 'doc-002',
      name: 'Finansiell_rapport_2023.xlsx',
      type: 'excel',
      size: '1.2 MB',
      folder: 'SaaS-bolag ARR 8 MSEK',
      uploadedBy: 'Anna Lindberg',
      uploadedAt: '2024-06-19 11:15',
      status: 'shared'
    },
    {
      id: 'doc-003',
      name: 'LOI_draft_v2.docx',
      type: 'word',
      size: '78 KB',
      folder: 'E-handelsföretag Stockholm',
      uploadedBy: 'Maria Eriksson',
      uploadedAt: '2024-06-19 09:45',
      status: 'draft'
    },
    {
      id: 'doc-004',
      name: 'Teaser_presentation.pptx',
      type: 'powerpoint',
      size: '3.4 MB',
      folder: 'SaaS-bolag ARR 8 MSEK',
      uploadedBy: 'Johan Svensson',
      uploadedAt: '2024-06-18 16:20',
      status: 'final'
    }
  ]

  const getFileIcon = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'text-primary-blue',
      excel: 'text-primary-blue',
      word: 'text-primary-blue',
      powerpoint: 'text-primary-blue',
    }
    const colorClass = colors[type] ?? 'text-primary-blue'
    return <FileText className={`w-4 h-4 sm:w-5 sm:h-5 ${colorClass}`} />
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      signed: 'bg-green-100 text-green-700',
      shared: 'bg-blue-100 text-blue-700',
      draft: 'bg-gray-100 text-gray-700',
      final: 'bg-purple-100 text-purple-700',
    }
    const labels: Record<string, string> = {
      signed: 'Signerad',
      shared: 'Delad',
      draft: 'Utkast',
      final: 'Slutgiltig',
    }
    const styleClass = styles[status] ?? 'bg-gray-100 text-gray-700'
    const label = labels[status] ?? status
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${styleClass}`}>
        {label}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-dark">Dokument</h1>
            <p className="text-sm text-text-gray mt-1">Hantera datarum och delade dokument</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Ladda upp
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ny mapp
            </button>
          </div>
        </div>

        {/* Search and view toggle */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök dokument eller mappar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'grid' 
                    ? 'bg-primary-blue text-white' 
                    : 'text-text-gray hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'list' 
                    ? 'bg-primary-blue text-white' 
                    : 'text-text-gray hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Folders */}
        <div>
          <h2 className="text-lg font-semibold text-text-dark mb-4">Mappar</h2>
          
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <div key={folder.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-blue transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Folder className="w-6 h-6 text-primary-blue" />
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-text-gray" />
                    </button>
                  </div>
                  <h3 className="font-medium text-text-dark mb-2">{folder.name}</h3>
                  <div className="space-y-1 text-sm text-text-gray">
                    <p>{folder.documents} dokument • {folder.size}</p>
                    <p>Uppdaterad {new Date(folder.lastModified).toLocaleDateString('sv-SE')}</p>
                    {folder.shared > 0 && (
                      <p className="text-primary-blue">Delad med {folder.shared} personer</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                      Namn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                      Dokument
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                      Storlek
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                      Senast ändrad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                      Delad med
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {folders.map((folder) => (
                    <tr key={folder.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue mr-3" />
                          <span className="text-sm font-medium text-text-dark">{folder.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                        {folder.documents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                        {folder.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                        {new Date(folder.lastModified).toLocaleDateString('sv-SE')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                        {folder.shared > 0 ? `${folder.shared} personer` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent documents */}
        <div>
          <h2 className="text-lg font-semibold text-text-dark mb-4">Senaste dokument</h2>
          
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                    Dokument
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                    Mapp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                    Uppladdad av
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
                    Åtgärder
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(doc.type)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-text-dark">{doc.name}</p>
                          <p className="text-xs text-text-gray">{doc.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-gray">
                      {doc.folder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-text-dark">{doc.uploadedBy}</p>
                        <p className="text-xs text-text-gray">{doc.uploadedAt}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-text-gray hover:text-primary-blue transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-text-gray hover:text-primary-blue transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
