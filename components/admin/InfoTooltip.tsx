'use client'

import { CircleHelp } from 'lucide-react'
import type { ReactNode } from 'react'

interface InfoTooltipProps {
  label: ReactNode
  className?: string
}

export default function InfoTooltip({ label, className }: InfoTooltipProps) {
  return (
    <span className={`relative inline-flex items-center group ${className ?? ''}`}>
      <CircleHelp
        className="w-4 h-4 text-gray-400 hover:text-primary-navy cursor-help transition-colors"
        aria-label="Visa instruktion"
      />
      <span 
        className="pointer-events-none absolute top-full mt-2 w-64 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-2xl transition-opacity duration-200 group-hover:opacity-100 z-50"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        {label}
      </span>
    </span>
  )
}

