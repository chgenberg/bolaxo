'use client'

import { Lock } from 'lucide-react'

interface ComingSoonProps {
  featureName?: string
  size?: 'sm' | 'md' | 'lg'
  fullOverlay?: boolean
}

export default function ComingSoon({ featureName = 'Den här funktionen', size = 'md', fullOverlay = false }: ComingSoonProps) {
  const baseClasses = 'inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-white bg-gradient-to-r from-gray-400 to-gray-500 backdrop-blur-sm'
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  const badge = (
    <div className={`${baseClasses} ${sizeClasses[size]}`}>
      <Lock className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
      <span>Kommer snart</span>
    </div>
  )

  if (fullOverlay) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center z-40">
          {badge}
        </div>
      </div>
    )
  }

  return badge
}
