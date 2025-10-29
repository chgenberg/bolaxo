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
      // Demo DD project with realistic tasks and findings
      const demoProject: DDProject = {
        id: 'dd-1',
        listingId,
        startDate: '2025-10-20',
        targetCompleteDate: '2025-11-20',
        status: 'in-progress',
        completionPercent: 47,
        summary: 'DD process ongoing - 7/15 tasks completed. 4 findings identified.',
        overallRiskLevel: 'medium',
        goNogo: 'conditional',
        tasks: [
          // Financial
          { id: 't1', title: 'Review 3-year audited financial statements', category: 'financial', priority: 'high', status: 'completed', dueDate: '2025-10-22', completedAt: '2025-10-22', assignee: 'Köpare AB', notes: 'Revenue growth steady 15% CAGR. EBITDA margin 37%. Conservative.' },
          { id: 't2', title: 'Analyze revenue recognition policies', category: 'financial', priority: 'high', status: 'completed', dueDate: '2025-10-23', completedAt: '2025-10-23', assignee: 'Köpare AB', notes: 'ASC 606 compliant. Timing matches industry standards.' },
          { id: 't3', title: 'Verify cash flow projections vs actuals', category: 'financial', priority: 'high', status: 'in-progress', dueDate: '2025-10-25', assignee: 'Köpare AB' },
          { id: 't4', title: 'Assess working capital requirements', category: 'financial', priority: 'high', status: 'pending', dueDate: '2025-10-28', assignee: 'Köpare AB' },
          
          // Legal
          { id: 't5', title: 'Review all material contracts (top 10)', category: 'legal', priority: 'high', status: 'completed', dueDate: '2025-10-24', completedAt: '2025-10-24', assignee: 'Legal team', notes: 'All contracts in good standing. No adverse clauses.' },
          { id: 't6', title: 'Search for pending litigation', category: 'legal', priority: 'high', status: 'completed', dueDate: '2025-10-23', completedAt: '2025-10-23', assignee: 'Legal team', notes: 'No pending disputes found. Clean litigation history.' },
          { id: 't7', title: 'Verify IP ownership & registrations', category: 'legal', priority: 'high', status: 'in-progress', dueDate: '2025-10-29', assignee: 'IP counsel' },
          { id: 't8', title: 'Review employment agreements', category: 'legal', priority: 'medium', status: 'pending', dueDate: '2025-11-01', assignee: 'HR counsel' },
          
          // IT
          { id: 't9', title: 'Security assessment & penetration testing', category: 'it', priority: 'high', status: 'completed', dueDate: '2025-10-26', completedAt: '2025-10-26', assignee: 'Security team', notes: 'No critical vulnerabilities. 2 medium-risk issues for remediation.' },
          { id: 't10', title: 'Infrastructure & systems audit', category: 'it', priority: 'high', status: 'in-progress', dueDate: '2025-10-28', assignee: 'Tech team' },
          { id: 't11', title: 'Test backup & disaster recovery', category: 'it', priority: 'medium', status: 'pending', dueDate: '2025-11-05', assignee: 'Tech team' },
          
          // Commercial
          { id: 't12', title: 'Customer concentration analysis', category: 'commercial', priority: 'high', status: 'completed', dueDate: '2025-10-25', completedAt: '2025-10-25', assignee: 'Business team', notes: 'Top 2 = 45% revenue. Long-term contracts signed.' },
          { id: 't13', title: 'Churn analysis & retention risk', category: 'commercial', priority: 'high', status: 'pending', dueDate: '2025-10-27', assignee: 'Business team' },
          { id: 't14', title: 'Market & competitive analysis', category: 'commercial', priority: 'medium', status: 'pending', dueDate: '2025-11-02', assignee: 'Analyst' },
          { id: 't15', title: 'Sales pipeline validation', category: 'commercial', priority: 'medium', status: 'pending', dueDate: '2025-11-08', assignee: 'Business team' }
        ],
        findings: [
          {
            id: 'f1',
            title: 'Customer Concentration Risk - Top 2 customers = 45% of revenue',
            description: 'Highest-risk finding. Top 2 customers represent 28M SEK of 60M total annual revenue. Both have long-term contracts (3-5 years) but concentration remains high.',
            category: 'commercial',
            severity: 'high',
            resolved: false,
            riskAssessment: 'Moderate-to-High. Mitigated by long-term contracts and customer satisfaction scores (4.8/5).',
            resolution: 'Recommend: 1) Diversification target 2/3 within 18 months, 2) Key account management program, 3) SLA guarantees'
          },
          {
            id: 'f2',
            title: 'Technology Stack Modernization Required',
            description: 'Core platform built on .NET Framework 4.x (EOL 2026). Requires migration to .NET 8 Core for security and performance.',
            category: 'it',
            severity: 'medium',
            resolved: false,
            riskAssessment: 'Medium. EOL risk 12 months out. Performance impact minimal currently.',
            resolution: 'Estimated cost: 2M SEK, Timeline: 6-9 months. Budget already allocated.'
          },
          {
            id: 'f3',
            title: 'Key Person Dependencies - CEO & CTO',
            description: 'CEO (35% ownership) and CTO (30% ownership) are critical to operations. No formal succession plan or retention agreements.',
            category: 'hr',
            severity: 'high',
            resolved: false,
            riskAssessment: 'High. Departure of either could significantly impact business.',
            resolution: 'Recommend: 1) 2-3 year retention agreements with earnout, 2) Key person insurance, 3) Knowledge transfer program'
          },
          {
            id: 'f4',
            title: 'IP Documentation & Patent Portfolio',
            description: 'Proprietary technology exists but no formal documentation. Estimated 3 patentable innovations identified.',
            category: 'legal',
            severity: 'medium',
            resolved: false,
            riskAssessment: 'Medium. IP value not formalized but technology clearly innovative.',
            resolution: 'Complete IP audit, file 3 patent applications (est. 300-400K SEK), formalize IP procedures'
          }
        ]
      }
      
      const demoMetrics: DDMetrics = {
        totalTasks: demoProject.tasks.length,
        completedTasks: demoProject.tasks.filter(t => t.status === 'completed').length,
        completionPercent: Math.round((demoProject.tasks.filter(t => t.status === 'completed').length / demoProject.tasks.length) * 100),
        totalFindings: demoProject.findings.length,
        unresolvedFindings: demoProject.findings.filter(f => !f.resolved).length,
        criticalFindings: 0,
        highFindings: demoProject.findings.filter(f => f.severity === 'high').length,
        overdueTasks: 0,
        riskLevel: 'medium'
      }
      
      setProject(demoProject)
      setMetrics(demoMetrics)
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
                  <div className={`