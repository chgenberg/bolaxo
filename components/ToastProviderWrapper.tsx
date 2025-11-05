'use client'

import { ToastProvider } from '@/contexts/ToastContext'

/**
 * Client component wrapper for ToastProvider
 * Must be a client component because ToastProvider uses hooks
 */
export default function ToastProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <ToastProvider>{children}</ToastProvider>
}

