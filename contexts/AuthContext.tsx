'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  verified: boolean
  bankIdVerified: boolean
  phone: string | null
  companyName: string | null
  orgNumber: string | null
  region: string | null
  createdAt: string
  lastLoginAt: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, role: string, acceptedPrivacy: boolean) => Promise<{ success: boolean; message?: string; magicLink?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (email: string, role: string, acceptedPrivacy: boolean) => {
    try {
      const response = await fetch('/api/auth/magic-link/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, acceptedPrivacy })
      })

      const data = await response.json()
      
      if (!response.ok) {
        return { success: false, message: data.error }
      }

      return { 
        success: true, 
        message: data.message,
        magicLink: data.magicLink // Endast i development
      }
    } catch (error) {
      return { success: false, message: 'Något gick fel' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

