'use client'

import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'

interface InfoPopupProps {
  title: string
  content: string
  size?: 'sm' | 'md' | 'lg'
}

export default function InfoPopup({ title, content, size = 'sm' }: InfoPopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center text-text-gray hover:text-primary-blue transition-colors"
        aria-label="Mer information"
      >
        <HelpCircle className={iconSize} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-text-gray hover:text-text-dark transition-colors"
              aria-label="Stäng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="pr-8">
              <h3 className="text-xl font-semibold text-text-dark mb-3">
                {title}
              </h3>
              <p className="text-text-gray leading-relaxed">
                {content}
              </p>
            </div>

            {/* OK Button */}
            <div className="mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full"
              >
                Okej, förstår
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


