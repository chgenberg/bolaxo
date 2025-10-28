'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, AlertCircle, AlertTriangle, Calendar, BarChart3, FileCheck, Plus } from 'lucide-react'

interface DDTask {
  id: string
  title: string
  description?: string
  category: string
  priority: string
  status: string
  dueDate: string
  completedAt?: string
  assignee?: string
  notes?: string
}

interface DDFinding {
  id: string
  title: string
  description: string
  category: string
  severity: string
  resolved: boolean
  resolvedAt?: string
  riskAssessment?: string
  resolution?: string
}

interface DDProject {
  id: string
  listingId: string
  startDate: string
  targetCompleteDate: string
  actualCompleteDate?: string
  status: string
  completionPercent: number
  summary?: string
  overallRiskLevel?: string
  goNogo?: string
  tasks: DDTask[]
  findings: DDFinding[]
}

interface DDMetrics {
  totalTasks: number
  completedTasks: number
  completionPercent: number
  totalFindings: number
  unresolvedFindings: number
  criticalFindings: number
  highFindings: number
  overdueTasks: number
  riskLevel: string
}

export default function DDProjectPage() {
  const params = useParams()
  const listingId = params.listingId as string
  
  const [project, setProject] = useState<DDProject | null>(null)
  const [metrics, setMetrics] = useState<DDMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<DDTask | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'findings'>('overview')
  const [showNewFinding, setShowNewFinding] = useState(false)

  // New finding form
  const [newFinding, setNewFinding] = useState({
    title: '',
    description: '',
    category: 'financial',
    severity: 'medium',
    riskAssessment: ''
  })

  useEffect(() => {
    fetchDDProject()
  }, [listingId])

  const fetchDDProject = async () => {
    try {
      // Check if project exists, if not create it
      let response = await fetch(`/api/sme/dd/get-project?listingId=${listingId}`)
      
      if (!response.ok || !response.body) {
        // Create new project
        response = await fetch('/api/sme/dd/create-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId,
            buyerId: 'current-user-id', // Get from auth context
            targetCompleteDays: 30
          })
        })
      }

      if (response.ok) {
        const data = await response.json()
        setProject(data.data.project)
        setMetrics(data.data.metrics)
      }
    } catch (error) {
      console.error('Error fetching DD project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/sme/dd/update-task', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          status: newStatus,
          completedAt: newStatus === 'complete' ? new Date().toISOString() : undefined
        })
      })

      if (response.ok) {
        fetchDDProject()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleCreateFinding = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !newFinding.title || !newFinding.description) return

    try {
      const response = await fetch('/api/sme/dd/create-finding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ddProjectId: project.id,
          ...newFinding
        })
      })

      if (response.ok) {
        setShowNewFinding(false)
        setNewFinding({
          title: '',
          description: '',
          category: 'financial',
          severity: 'medium',
          riskAssessment: ''
        })
        fetchDDProject()
      }
    } catch (error) {
      console.error('Error creating finding:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      accounting: '📊',
      legal: '⚖️',
      it: '💻',
      hr: '👥',
      operations: '🏭',
      financial: '💰',
      tax: '🏦',
      other: '📄'
    }
    return icons[category] || '📄'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    }
    return colors[priority] || 'bg-gray-100'
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    }
    return colors[severity] || 'bg-gray-100'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />
      case 'blocked': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!project || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Inget DD-projekt hittat</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href={`/objekt/${listingId}`} className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka till objekt
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Due Diligence Dashboard</h1>
              <p className="text-gray-600">Spåra och hantera DD-processen</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                project.status === 'complete' ? 'bg-green-100 text-green-700' :
                project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                Status: {project.status}
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-navy">{metrics.completionPercent}%</p>
                <p className="text-sm text-gray-600">Genomfört</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Alert */}
      {metrics.criticalFindings > 0 && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <p className="font-semibold text-red-800">
                {metrics.criticalFindings} kritiska fynd kräver omedelbar uppmärksamhet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {(['overview', 'tasks', 'findings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-primary-navy border-primary-navy'
                    : 'text-gray-600 border-transparent hover:text-primary-navy'
                }`}
              >
                {tab === 'overview' ? 'Översikt' : tab === 'tasks' ? 'Uppgifter' : 'Fynd'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Metrics Cards */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">Uppgifter</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Totalt</span>
                    <span className="font-bold">{metrics.totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Genomförda</span>
                    <span className="font-bold text-green-600">{metrics.completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Försenade</span>
                    <span className="font-bold text-red-600">{metrics.overdueTasks}</span>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-navy transition-all"
                    style={{ width: `${metrics.completionPercent}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">Fynd</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Totalt</span>
                    <span className="font-bold">{metrics.totalFindings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kritiska</span>
                    <span className="font-bold text-red-600">{metrics.criticalFindings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Olösta</span>
                    <span className="font-bold text-orange-600">{metrics.unresolvedFindings}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">Tidslinje</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Startdatum</span>
                    <span className="font-semibold">{new Date(project.startDate).toLocaleDateString('sv-SE')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Måldatum</span>
                    <span className="font-semibold">{new Date(project.targetCompleteDate).toLocaleDateString('sv-SE')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dagar kvar</span>
                    <span className="font-bold">
                      {Math.max(0, Math.floor((new Date(project.targetCompleteDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`bg-white rounded-lg border-2 p-6 ${
                metrics.riskLevel === 'critical' ? 'border-red-300' :
                metrics.riskLevel === 'high' ? 'border-orange-300' :
                'border-green-300'
              }`}>
                <h3 className="font-semibold text-gray-700 mb-4">Riskbedömning</h3>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 ${
                    metrics.riskLevel === 'critical' ? 'bg-red-100' :
                    metrics.riskLevel === 'high' ? 'bg-orange-100' :
                    'bg-green-100'
                  }`}>
                    <AlertTriangle className={`w-10 h-10 ${
                      metrics.riskLevel === 'critical' ? 'text-red-600' :
                      metrics.riskLevel === 'high' ? 'text-orange-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <p className={`text-2xl font-bold ${
                    metrics.riskLevel === 'critical' ? 'text-red-600' :
                    metrics.riskLevel === 'high' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {metrics.riskLevel === 'critical' ? 'Kritisk' :
                     metrics.riskLevel === 'high' ? 'Hög' : 'Medel'}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Milestones */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Nästa milstolpar</h3>
              <div className="space-y-3">
                {project.tasks
                  .filter(t => t.status !== 'complete')
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">{getCategoryIcon(task.category)}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{task.title}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(task.dueDate).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Task Categories */}
            {['accounting', 'legal', 'it', 'hr', 'operations', 'financial', 'tax', 'other'].map((category) => {
              const categoryTasks = project.tasks.filter(t => t.category === category)
              if (categoryTasks.length === 0) return null

              return (
                <div key={category} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <h3 className="text-lg font-bold text-primary-navy capitalize">{category}</h3>
                    <span className="text-sm text-gray-600">
                      ({categoryTasks.filter(t => t.status === 'complete').length}/{categoryTasks.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {categoryTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4 hover:border-primary-navy transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(task.status)}
                            <div>
                              <p className="font-semibold text-primary-navy">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(task.dueDate).toLocaleDateString('sv-SE')}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>

                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                            className="px-3 py-1 border rounded-lg text-sm"
                          >
                            <option value="open">Öppen</option>
                            <option value="in-progress">Pågående</option>
                            <option value="complete">Klar</option>
                            <option value="blocked">Blockerad</option>
                            <option value="na">Ej tillämplig</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Findings Tab */}
        {activeTab === 'findings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-primary-navy">DD-fynd</h2>
              <button
                onClick={() => setShowNewFinding(true)}
                className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Rapportera fynd
              </button>
            </div>

            {showNewFinding && (
              <div className="bg-white rounded-lg border-2 border-accent-pink p-6 mb-6">
                <h3 className="text-lg font-bold text-primary-navy mb-4">Rapportera nytt fynd</h3>
                <form onSubmit={handleCreateFinding} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rubrik</label>
                    <input
                      type="text"
                      value={newFinding.title}
                      onChange={(e) => setNewFinding({...newFinding, title: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      placeholder="Ex: Kundkoncentration för hög"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Beskrivning</label>
                    <textarea
                      value={newFinding.description}
                      onChange={(e) => setNewFinding({...newFinding, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      placeholder="Beskriv fyndet i detalj..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                      <select
                        value={newFinding.category}
                        onChange={(e) => setNewFinding({...newFinding, category: e.target.value})}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      >
                        <option value="accounting">Redovisning</option>
                        <option value="legal">Juridik</option>
                        <option value="it">IT</option>
                        <option value="hr">Personal</option>
                        <option value="operations">Operationellt</option>
                        <option value="financial">Finansiellt</option>
                        <option value="tax">Skatt</option>
                        <option value="other">Övrigt</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Allvarlighetsgrad</label>
                      <select
                        value={newFinding.severity}
                        onChange={(e) => setNewFinding({...newFinding, severity: e.target.value})}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      >
                        <option value="low">Låg</option>
                        <option value="medium">Medel</option>
                        <option value="high">Hög</option>
                        <option value="critical">Kritisk</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Riskbedömning</label>
                    <textarea
                      value={newFinding.riskAssessment}
                      onChange={(e) => setNewFinding({...newFinding, riskAssessment: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                      placeholder="Beskriv potentiella risker och konsekvenser..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg"
                    >
                      Rapportera fynd
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewFinding(false)}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Avbryt
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Findings List */}
            <div className="space-y-4">
              {project.findings.length === 0 ? (
                <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
                  <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Inga fynd rapporterade än</p>
                </div>
              ) : (
                project.findings.map((finding) => (
                  <div key={finding.id} className={`bg-white rounded-lg border-2 p-6 ${
                    finding.resolved ? 'border-gray-200' : finding.severity === 'critical' ? 'border-red-300' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getCategoryIcon(finding.category)}</span>
                        <div>
                          <h3 className="font-bold text-primary-navy">{finding.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(finding.severity)}`}>
                              {finding.severity}
                            </span>
                            {finding.resolved && (
                              <span className="text-sm text-green-600 font-semibold">✓ Löst</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!finding.resolved && finding.severity === 'critical' && (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      )}
                    </div>

                    <p className="text-gray-700 mb-4">{finding.description}</p>

                    {finding.riskAssessment && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Riskbedömning:</p>
                        <p className="text-sm text-gray-600">{finding.riskAssessment}</p>
                      </div>
                    )}

                    {finding.resolution && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-green-700 mb-1">Lösning:</p>
                        <p className="text-sm text-green-600">{finding.resolution}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
