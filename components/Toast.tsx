'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== Infinity) {
      const timer = setTimeout(() => onClose(toast.id), toast.duration || 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  const baseStyle = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border'
  
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900'
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />,
    info: <Info className="w-5 h-5 flex-shrink-0 text-blue-600" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
  }

  return (
    <div className={`${baseStyle} ${styles[toast.type]} animate-in fade-in slide-in-from-top-2 duration-300`}>
      {icons[toast.type]}
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}
