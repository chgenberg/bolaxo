'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Users, Shield, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Metric {
  label: string
  value: string
  subtext: string
  icon: LucideIcon
  color: string
}

export default function MetricsDashboard() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  const metrics: Metric[] = [
    {
      label: 'Aktiva Annonser',
      value: '127',
      subtext: '+18 denna månad',
      icon: BarChart3,
      color: 'bg-blue-50 text-primary-blue'
    },
    {
      label: 'Registrerade Köpare',
      value: '2,847',
      subtext: '+342 denna månad',
      icon: Users,
      color: 'bg-green-50 text-green-600'
    },
    {
      label: 'NDA-signeringar',
      value: '1,234',
      subtext: '+89 denna vecka',
      icon: Shield,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      label: 'Genomförda Affärer',
      value: '47',
      subtext: 'Totalt transaktionsvärde: 580M kr',
      icon: Target,
      color: 'bg-yellow-50 text-yellow-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div
            key={index}
            className={`card-hover transform transition-all duration-500 ${
              animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className={`${metric.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-text-dark mb-2">
              {metric.value}
            </div>
            <div className="text-sm font-semibold text-text-dark mb-1">
              {metric.label}
            </div>
            <div className="text-xs text-text-gray">
              {metric.subtext}
            </div>
          </div>
        )
      })}
    </div>
  )
}

