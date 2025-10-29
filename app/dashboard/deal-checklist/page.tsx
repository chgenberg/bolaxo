'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2, Circle, AlertCircle, Lock, Users, Calendar,
  ArrowRight, Clock, FileText, PenTool, DollarSign, Home
} from 'lucide-react'

interface ChecklistItem {
  id: string
  title: string
  description: string
  responsible: 'buyer' | 'seller' | 'joint'
  status: 'completed' | 'in-progress' | 'pending' | 'blocked'
  dueDate?: string
  phase: 'discovery' | 'due-diligence' | 'negotiation' | 'legal' | 'closing'
  notes?: string
}

const PHASES = [
  { id: 'discovery', label: 'Discovery', icon: '🔍', color: 'blue' },
  { id: 'due-diligence', label: 'Due Diligence', icon: '📊', color: 'cyan' },
  { id: 'negotiation', label: 'Negotiation', icon: '🤝', color: 'purple' },
  { id: 'legal', label: 'Legal Review', icon: '⚖️', color: 'orange' },
  { id: 'closing', label: 'Closing', icon: '✅', color: 'green' }
]

const DEMO_CHECKLIST: ChecklistItem[] = [
  // DISCOVERY PHASE
  {
    id: 'c1',
    title: 'NDA Signed',
    description: 'Both parties have executed the Non-Disclosure Agreement',
    responsible: 'joint',
    status: 'completed',
    phase: 'discovery',
    dueDate: 'Oct 29, 2024',
    notes: 'Completed on Oct 29 - both parties signed digitally'
  },
  {
    id: 'c2',
    title: 'Dataroom Access Granted',
    description: 'Buyer has been granted access to seller dataroom with all documents',
    responsible: 'seller',
    status: 'completed',
    phase: 'discovery',
    dueDate: 'Oct 29, 2024',
    notes: 'Access granted 1 hour after NDA signature'
  },
  {
    id: 'c3',
    title: 'Initial Management Presentation',
    description: 'Seller provides overview of business, strategy, and key metrics',
    responsible: 'seller',
    status: 'completed',
    phase: 'discovery',
    dueDate: 'Oct 30, 2024',
    notes: 'Presentation delivered - 60 slides covering business overview'
  },

  // DUE DILIGENCE PHASE
  {
    id: 'c4',
    title: 'DD Report Generated',
    description: 'Automated due diligence report created from seller data',
    responsible: 'seller',
    status: 'completed',
    phase: 'due-diligence',
    dueDate: 'Oct 30, 2024',
    notes: '25+ page professional DD report auto-generated'
  },
  {
    id: 'c5',
    title: 'Buyer DD Review Started',
    description: 'Buyer begins comprehensive review of due diligence findings',
    responsible: 'buyer',
    status: 'in-progress',
    phase: 'due-diligence',
    dueDate: 'Nov 3, 2024',
    notes: 'Buyer team reviewing financial statements and customer contracts'
  },
  {
    id: 'c6',
    title: 'Financial Deep-Dive Questions',
    description: 'Buyer submits detailed questions about financials, revenue, margins',
    responsible: 'buyer',
    status: 'in-progress',
    phase: 'due-diligence',
    dueDate: 'Nov 3, 2024',
    notes: '5 questions submitted - waiting for seller responses'
  },
  {
    id: 'c7',
    title: 'Q&A Responses from Seller',
    description: 'Seller responds to buyer questions and clarifications',
    responsible: 'seller',
    status: 'pending',
    phase: 'due-diligence',
    dueDate: 'Nov 4, 2024',
    notes: 'SLA: 24 hours to respond'
  },
  {
    id: 'c8',
    title: 'Technical Audit (if applicable)',
    description: 'Independent technical assessment of IT systems, data security',
    responsible: 'joint',
    status: 'pending',
    phase: 'due-diligence',
    dueDate: 'Nov 6, 2024',
    notes: 'Scheduled for Nov 6 - 3rd party auditor'
  },
  {
    id: 'c9',
    title: 'Customer/Supplier Verification',
    description: 'Buyer verifies key customer and supplier relationships',
    responsible: 'buyer',
    status: 'pending',
    phase: 'due-diligence',
    dueDate: 'Nov 8, 2024',
    notes: 'Contacting top 5 customers to confirm business relationship'
  },

  // NEGOTIATION PHASE
  {
    id: 'c10',
    title: 'LoI Proposed',
    description: 'Buyer proposes Letter of Intent with preliminary deal terms',
    responsible: 'buyer',
    status: 'pending',
    phase: 'negotiation',
    dueDate: 'Nov 8, 2024',
    notes: 'LoI will include price, earnout, non-compete terms'
  },
  {
    id: 'c11',
    title: 'LoI Negotiation & Agreement',
    description: 'Both parties negotiate and agree on Letter of Intent terms',
    responsible: 'joint',
    status: 'pending',
    phase: 'negotiation',
    dueDate: 'Nov 12, 2024',
    notes: 'Expected 2-3 rounds of negotiation'
  },
  {
    id: 'c12',
    title: 'SPA Auto-Populated',
    description: 'LoI terms automatically populate Share Purchase Agreement template',
    responsible: 'seller',
    status: 'pending',
    phase: 'negotiation',
    dueDate: 'Nov 13, 2024',
    notes: 'SPA generated from LoI - will include all agreed terms'
  },
  {
    id: 'c13',
    title: 'Price & Payment Terms Finalized',
    description: 'Agreement on purchase price, earnout, escrow, and payment schedule',
    responsible: 'joint',
    status: 'pending',
    phase: 'negotiation',
    dueDate: 'Nov 15, 2024',
    notes: 'Includes cash at closing, escrow amount, earnout structure'
  },

  // LEGAL REVIEW PHASE
  {
    id: 'c14',
    title: 'SPA Legal Review',
    description: 'Both parties review SPA with legal counsel',
    responsible: 'joint',
    status: 'pending',
    phase: 'legal',
    dueDate: 'Nov 20, 2024',
    notes: 'Each party appoints legal advisor for review'
  },
  {
    id: 'c15',
    title: 'SPA Negotiation Rounds',
    description: 'Back-and-forth negotiation of SPA terms and conditions',
    responsible: 'joint',
    status: 'pending',
    phase: 'legal',
    dueDate: 'Nov 25, 2024',
    notes: 'Expected 3-5 redline rounds'
  },
  {
    id: 'c16',
    title: 'Representations & Warranties Finalized',
    description: 'Agreement on seller reps/warranties and indemnification terms',
    responsible: 'joint',
    status: 'pending',
    phase: 'legal',
    dueDate: 'Nov 27, 2024',
    notes: 'Including baskets, caps, and survival periods'
  },
  {
    id: 'c17',
    title: 'Conditions Precedent Satisfied',
    description: 'All closing conditions have been met or waived',
    responsible: 'joint',
    status: 'pending',
    phase: 'legal',
    dueDate: 'Nov 29, 2024',
    notes: 'Employee retention, customer confirmations, financing in place'
  },

  // CLOSING PHASE
  {
    id: 'c18',
    title: 'Final SPA Signature',
    description: 'Both parties execute final Share Purchase Agreement',
    responsible: 'joint',
    status: 'pending',
    phase: 'closing',
    dueDate: 'Nov 30, 2024',
    notes: 'Digital signatures via BankID'
  },
  {
    id: 'c19',
    title: 'Payment Settlement',
    description: 'Buyer transfers purchase price to seller',
    responsible: 'buyer',
    status: 'pending',
    phase: 'closing',
    dueDate: 'Nov 30, 2024',
    notes: 'Wire transfer + escrow arrangement'
  },
  {
    id: 'c20',
    title: 'Share Transfer',
    description: 'Shares transferred from seller to buyer via VPC',
    responsible: 'seller',
    status: 'pending',
    phase: 'closing',
    dueDate: 'Nov 30, 2024',
    notes: 'Electronic transfer via Swedish Securities Depository'
  },
  {
    id: 'c21',
    title: 'Closing Checklist Completion',
    description: 'All closing deliverables received and verified',
    responsible: 'joint',
    status: 'pending',
    phase: 'closing',
    dueDate: 'Nov 30, 2024',
    notes: 'Board minutes, share certificates, employment agreements'
  },
  {
    id: 'c22',
    title: 'Post-Closing Documentation',
    description: 'Earnout tracking, key employee retention agreements activated',
    responsible: 'seller',
    status: 'pending',
    phase: 'closing',
    dueDate: 'Dec 1, 2024',
    notes: '3-year earnout period begins'
  }
]

interface Phase {
  id: string
  label: string
  icon: string
  color: string
  items: ChecklistItem[]
  completed: number
  total: number
}

function getResponsibleIcon(responsible: string) {
  switch (responsible) {
    case 'buyer':
      return <Users className="w-4 h-4 text-blue-600" />
    case 'seller':
      return <Users className="w-4 h-4 text-orange-600" />
    case 'joint':
      return <Users className="w-4 h-4 text-purple-600" />
    default:
      return null
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />
    case 'in-progress':
      return <Clock className="w-5 h-5 text-blue-600 animate-spin" />
    case 'pending':
      return <Circle className="w-5 h-5 text-gray-400" />
    case 'blocked':
      return <AlertCircle className="w-5 h-5 text-red-600" />
    default:
      return null
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-50'
    case 'in-progress':
      return 'bg-blue-50'
    case 'pending':
      return 'bg-gray-50'
    case 'blocked':
      return 'bg-red-50'
    default:
      return 'bg-white'
  }
}

function PhaseSection({ phase }: { phase: Phase }) {
  const progressPercent = (phase.completed / phase.total) * 100

  return (
    <div className="mb-8">
      {/* Phase Header */}
      <div className="bg-white rounded-lg border-2 border-primary-navy p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{phase.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-primary-navy">{phase.label}</h2>
              <p className="text-sm text-gray-600">
                {phase.completed} of {phase.total} tasks completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-navy">{progressPercent.toFixed(0)}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-navy to-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {phase.items.map((item) => (
          <div key={item.id} className={`rounded-lg border-l-4 p-4 ${getStatusBg(item.status)}`}>
            <div className="flex gap-4">
              {/* Status Icon */}
              <div className="flex-shrink-0 pt-1">
                {getStatusIcon(item.status)}
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`font-semibold ${
                      item.status === 'completed' ? 'text-green-700 line-through' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>

                  {/* Responsible Badge */}
                  <div className="ml-4 flex-shrink-0">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.responsible === 'buyer' 
                        ? 'bg-blue-100 text-blue-700'
                        : item.responsible === 'seller'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {getResponsibleIcon(item.responsible)}
                      {item.responsible === 'buyer' ? 'Buyer' : item.responsible === 'seller' ? 'Seller' : 'Both'}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {item.notes && (
                  <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-2 rounded mb-2 italic">
                    💡 {item.notes}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <span>
                    {item.status === 'completed' ? '✓ Completed' : 
                     item.status === 'in-progress' ? '⏳ In Progress' :
                     item.status === 'blocked' ? '🚫 Blocked' :
                     '⬜ Not Started'}
                  </span>
                  {item.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.dueDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DealChecklistPage() {
  const searchParams = useSearchParams()
  const dealId = searchParams.get('dealId') || 'listing-1'
  
  const [phases, setPhases] = useState<Phase[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    // Group items by phase
    const phasesData = PHASES.map(p => {
      const items = DEMO_CHECKLIST.filter(item => item.phase === p.id)
      const completed = items.filter(item => item.status === 'completed').length

      return {
        ...p,
        items,
        completed,
        total: items.length
      }
    })

    setPhases(phasesData)

    const total = DEMO_CHECKLIST.length
    const completed = DEMO_CHECKLIST.filter(item => item.status === 'completed').length
    
    setTotalCount(total)
    setCompletedCount(completed)
    setOverallProgress((completed / total) * 100)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary-navy mb-2">
                📋 Shared Deal Checklist
              </h1>
              <p className="text-gray-600">
                Follow the complete M&A journey from discovery to closing
              </p>
            </div>
            <Link href="/dashboard/deal-pipeline">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90">
                <ArrowRight className="w-4 h-4" />
                Back to Pipeline
              </button>
            </Link>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-primary-navy to-blue-600 text-white rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg opacity-90">Overall Progress</p>
              <p className="text-4xl font-bold mt-2">
                {completedCount} of {totalCount} tasks completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold">{overallProgress.toFixed(0)}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white bg-opacity-20 rounded-full h-4">
            <div
              className="bg-white h-4 rounded-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          {/* Timeline Info */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
            <div>
              <p className="text-sm opacity-75">Started</p>
              <p className="text-lg font-semibold">Oct 29, 2024</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Current Phase</p>
              <p className="text-lg font-semibold">Due Diligence</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Expected Closing</p>
              <p className="text-lg font-semibold">Nov 30, 2024</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Legend:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-gray-400" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Blocked</span>
            </div>
          </div>
        </div>

        {/* Phases */}
        {phases.map((phase) => (
          <PhaseSection key={phase.id} phase={phase} />
        ))}

        {/* Closing Summary */}
        <div className="bg-white rounded-lg border-2 border-primary-navy p-8 mt-12">
          <h2 className="text-2xl font-bold text-primary-navy mb-4">🎯 Deal Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Deal Value</p>
              <p className="text-2xl font-bold text-primary-navy">45 MSEK</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Earnout Potential</p>
              <p className="text-2xl font-bold text-green-600">5 MSEK</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Process Timeline</p>
              <p className="text-2xl font-bold text-purple-600">32 days</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Both parties have signed the NDA and are now in the Due Diligence phase. The buyer is reviewing the comprehensive
            DD report and has submitted initial questions. Expected timeline to closing is November 30, 2024.
          </p>

          <div className="flex gap-3">
            <Link href="/dashboard/deal-pipeline">
              <button className="px-6 py-2 bg-primary-navy text-white rounded-lg font-medium hover:bg-opacity-90">
                Back to Deal Pipeline
              </button>
            </Link>
            <Link href="/dashboard/messages">
              <button className="px-6 py-2 border-2 border-primary-navy text-primary-navy rounded-lg font-medium hover:bg-gray-50">
                View Messages
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
