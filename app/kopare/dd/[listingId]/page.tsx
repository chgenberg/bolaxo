'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { DEMO_DD_TASKS, DEMO_DD_FINDINGS } from '@/lib/demo-data'

export default function DDProjectPage() {
  const params = useParams()
  const listingId = params.listingId as string
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'findings'>('overview')

  const tasks = DEMO_DD_TASKS || []
  const findings = DEMO_DD_FINDINGS || []
  const completedTasks = tasks.filter(t => t.status === 'complete').length
  const completionPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Due Diligence Manager</h1>
              <p className="text-gray-600">Spåra och hantera DD-processen</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-navy">{completionPercent}%</p>
              <p className="text-sm text-gray-600">Genomfört</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'text-primary-navy border-primary-navy'
                  : 'text-gray-600 border-transparent hover:text-primary-navy'
              }`}
            >
              Översikt
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'tasks'
                  ? 'text-primary-navy border-primary-navy'
                  : 'text-gray-600 border-transparent hover:text-primary-navy'
              }`}
            >
              Uppgifter ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('findings')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'findings'
                  ? 'text-primary-navy border-primary-navy'
                  : 'text-gray-600 border-transparent hover:text-primary-navy'
              }`}
            >
              Fynd ({findings.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Uppgifter</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Totalt</span>
                  <span className="font-bold">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Genomförda</span>
                  <span className="font-bold text-green-600">{completedTasks}</span>
                </div>
              </div>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-navy transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Fynd</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Totalt</span>
                  <span className="font-bold">{findings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Höga</span>
                  <span className="font-bold text-orange-600">{findings.filter(f => f.severity === 'High').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-primary-navy transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {task.status === 'complete' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className={`font-semibold ${task.status === 'complete' ? 'line-through text-gray-500' : 'text-primary-navy'}`}>
                        {task.task}
                      </p>
                      <p className="text-sm text-gray-600">{task.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    task.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status === 'complete' ? '✓ Klar' : 'Pågår'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'findings' && (
          <div className="space-y-4">
            {findings.map((finding) => (
              <div key={finding.id} className={`bg-white rounded-lg border-2 p-4 ${
                finding.severity === 'High' ? 'border-orange-300' : 'border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-primary-navy">{finding.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{finding.description.substring(0, 150)}...</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    finding.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {finding.severity}
                  </span>
                </div>
                {finding.resolution && (
                  <div className="bg-green-50 rounded p-3 mt-3">
                    <p className="text-sm text-green-700"><strong>Mitigering:</strong> {finding.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
