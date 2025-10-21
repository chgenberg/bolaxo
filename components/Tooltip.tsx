'use client'

import { useState } from 'react'

interface TooltipProps {
  content: string
}

export default function Tooltip({ content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-primary-blue hover:text-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isVisible && (
        <div className="absolute left-0 top-6 z-10 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
          {content}
          <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  )
}

