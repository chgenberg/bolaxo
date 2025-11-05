'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, DollarSign, FileText, Users, Shield, Send } from 'lucide-react'

interface ClosingTask {
  id: string
  title: string
  description: string
  category: 'buyer' | 'seller' | 'both'
  status: 'pending' | 'complete'
  dueDate: string
  documentation?: string
}

const CLOSING_CHECKLIST: ClosingTask[] = [
  // Buyer tasks
  {
    id: 'buyer-1',
    title: 'Confirm Financing',
    description: 'Verify all purchase financing is secured and ready to wire',
    category: 'buyer',
    status: 'pending',
    dueDate: 'Day of closing'
  },
  {
    id: 'buyer-2',
    title: 'Prepare Wire Instructions',
    description: 'Get wire instructions from seller and prepare payment',
    category: 'buyer',
    status: 'pending',
    dueDate: '1 day before'
  },
  {
    id: 'buyer-3',
    title: 'Review Final SPA',
    description: 'Final review of signed SPA with counsel',
    category: 'buyer',
    status: 'pending',
    dueDate: '2 days before'
  },
  {
    id: 'buyer-4',
    title: 'Sign Closing Documents',
    description: 'Sign purchase agreement and other closing docs',
    category: 'buyer',
    status: 'pending',
    dueDate: 'Day of closing',
    documentation: 'SPA, Closing certificate, Indemnification letter'
  },
  {
    id: 'buyer-5',
    title: 'Fund Escrow',
    description: 'Transfer earnout escrow amount to designated account',
    category: 'buyer',
    status: 'pending',
    dueDate: 'Day of closing'
  },

  // Seller tasks
  {
    id: 'seller-1',
    title: 'Shareholder Resolution',
    description: 'Board/shareholder approval of share sale',
    category: 'seller',
    status: 'pending',
    dueDate: '3 days before',
    documentation: 'Board minutes, Shareholder approval'
  },
  {
    id: 'seller-2',
    title: 'Prepare Wire Instructions',
    description: 'Provide bank details for payment receipt',
    category: 'seller',
    status: 'pending',
    dueDate: '5 days before'
  },
  {
    id: 'seller-3',
    title: 'Tax Clearance',
    description: 'Obtain tax clearance certificate from authorities',
    category: 'seller',
    status: 'pending',
    dueDate: '2 days before',
    documentation: 'Tax authority clearance'
  },
  {
    id: 'seller-4',
    title: 'Employee Notifications',
    description: 'Notify key employees of transaction completion',
    category: 'seller',
    status: 'pending',
    dueDate: 'Day of closing'
  },
  {
    id: 'seller-5',
    title: 'Sign Closing Documents',
    description: 'Sign SPA and other required documents',
    category: 'seller',
    status: 'pending',
    dueDate: 'Day of closing',
    documentation: 'SPA, Closing certificate, Rep & warranties letter'
  },

  // Both parties
  {
    id: 'both-1',
    title: 'Closing Coordination Call',
    description: 'Final call with all parties to confirm readiness',
    category: 'both',
    status: 'pending',
    dueDate: '1 day before'
  },
  {
    id: 'both-2',
    title: 'Escrow Instructions Signed',
    description: 'Both parties sign escrow agent instructions',
    category: 'both',
    status: 'pending',
    dueDate: '2 days before',
    documentation: 'Escrow instructions'
  },
  {
    id: 'both-3',
    title: 'Share Certificate Transfer',
    description: 'Transfer of physical share certificates or book entry',
    category: 'both',
    status: 'pending',
    dueDate: 'Day of closing',
    documentation: 'Share transfer form, Buyer confirmation'
  },
  {
    id: 'both-4',
    title: 'Fund Release & Completion',
    description: 'Release funds and mark deal complete',
    category: 'both',
    status: 'pending',
    dueDate: 'Day of closing'
  }
]

export default function ClosingChecklist() {
  const params = useParams()
  const listingId = params.listingId as string
  
  const [tasks, setTasks] = useState<ClosingTask[]>(CLOSING_CHECKLIST)
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer')
  const [completionPercent, setCompletionPercent] = useState(0)

  useEffect(() => {
    const completed = tasks.filter(t => t.status === 'complete').length
    setCompletionPercent(Math.round((completed / tasks.length) * 100))
  }, [tasks])

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, status: t.status === 'complete' ? 'pending' : 'complete' }
        : t
    ))
  }

  const userTasks = tasks.filter(t => 
    t.category === userRole || t.category === 'both'
  )

  const otherPartyTasks = tasks.filter(t => 
    (t.category === (userRole === 'buyer' ? 'seller' : 'buyer')) ||
    t.category === 'both'
  )

  const completedByOther = otherPartyTasks.filter(t => t.status === 'complete').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href={`/objekt/${listingId}`} className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka till affären
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Closing Day Checklist</h1>
              <p className="text-gray-600">Verifiera allt innan tillträde</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-navy">{completionPercent}%</div>
              <p className="text-sm text-gray-600">genomfört</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            <button
              onClick={() => setUserRole('buyer')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                userRole === 'buyer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Köpare
            </button>
            <button
              onClick={() => setUserRole('seller')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                userRole === 'seller'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Säljare
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-primary-navy mb-6">
                {userRole === 'buyer' ? 'Dina uppgifter som köpare' : 'Dina uppgifter som säljare'}
              </h2>

              <div className="space-y-3">
                {userTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border-2 rounded-lg p-4 transition-colors ${
                      task.status === 'complete'
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-primary-navy'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                          task.status === 'complete'
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300 hover:border-primary-navy'
                        }`}
                      >
                        {task.status === 'complete' && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${
                              task.status === 'complete'
                                ? 'line-through text-gray-500'
                                : 'text-primary-navy'
                            }`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            
                            {task.documentation && (
                              <div className="mt-2 text-sm text-gray-600">
                                <p className="font-semibold text-gray-700">Dokument:</p>
                                <p>{task.documentation}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right text-xs text-gray-500 flex-shrink-0">
                            {task.dueDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checklist Progress & Other Party */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="font-bold text-primary-navy mb-4">Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Dina uppgifter</span>
                    <span className="font-semibold">
                      {userTasks.filter(t => t.status === 'complete').length}/{userTasks.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-navy transition-all"
                      style={{ width: `${(userTasks.filter(t => t.status === 'complete').length / userTasks.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Motparten</span>
                    <span className="font-semibold">
                      {completedByOther}/{otherPartyTasks.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-pink transition-all"
                      style={{ width: `${(completedByOther / otherPartyTasks.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Totalt</span>
                    <span className="font-semibold">{completionPercent}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ready to Close? */}
            {completionPercent === 100 && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-green-900">Redo för tillträde!</h3>
                </div>
                <p className="text-sm text-green-800 mb-4">
                  Alla uppgifter är genomförda. Du kan nu genomföra betalning och aktieöverlåtelse.
                </p>
                <button className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:shadow-lg">
                  Bekräfta tillträde
                </button>
              </div>
            )}

            {completionPercent < 100 && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <h3 className="font-bold text-yellow-900">Inte helt klar ännu</h3>
                </div>
                <p className="text-sm text-yellow-800">
                  {100 - completionPercent}% av uppgifterna återstår. Genomför alla innan tillträde.
                </p>
              </div>
            )}

            {/* Key Dates */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="font-bold text-primary-navy mb-4">Viktiga datum</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">3 dagar innan</p>
                  <p className="font-semibold text-gray-900">Shareholder approval</p>
                </div>
                <div>
                  <p className="text-gray-600">2 dagar innan</p>
                  <p className="font-semibold text-gray-900">Escrow instructions signed</p>
                </div>
                <div>
                  <p className="text-gray-600">1 dag innan</p>
                  <p className="font-semibold text-gray-900">Final coordination call</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600">Closing day</p>
                  <p className="font-bold text-primary-navy">Allt genomförs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
