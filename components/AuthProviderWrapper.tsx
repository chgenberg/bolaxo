'use client'

import { AuthProvider } from '@/contexts/AuthContext'

/**
 * Client component wrapper for AuthProvider
 * Must be a client component because AuthProvider uses hooks
 */
export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}

