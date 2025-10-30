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
  referralCode: string | null
  referredBy: string | null
  createdAt: string
  lastLoginAt: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, role: string, acceptedPrivacy: boolean, referralCode?: string) => Promise<{ success: boolean; message?: string; magicLink?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      // Check for dev login first (localStorage)
      if (typeof window !== 'undefined') {
        const devUserStr = localStorage.getItem('dev-auth-user')
        if (devUserStr) {
          try {
            const devUser = JSON.parse(devUserStr)
            setUser({
              id: devUser.id,
              email: devUser.email,
              name: devUser.name,
              role: devUser.role,
              verified: true,
              bankIdVerified: true,
              phone: null,
              companyName: null,
              orgNumber: null,
              region: null,
              referralCode: null,
              referredBy: null,
              createdAt: devUser.loginTime,
              lastLoginAt: devUser.loginTime
            })
            setLoading(false)
            return
          } catch (e) {
            console.log('Dev user parse error:', e)
          }
        }
      }
      
      // Fall back to regular auth API (checks session cookie)
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Important: include cookies
        cache: 'no-store', // Don't cache auth check
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    
    // Refresh user when window gains focus (helps catch cookies after redirect)
    const handleFocus = () => {
      // Small delay to ensure cookies are available
      setTimeout(() => {
        fetchUser()
      }, 100)
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])
  
  // Also refresh after a short delay to catch cookies set during redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user && !loading) {
        console.log('🔄 [AUTH] No user found after delay, refreshing...')
        fetchUser()
      }
    }, 1000) // Increased delay to catch cookies after redirect
    return () => clearTimeout(timer)
  }, [])
  
  // Check if we're on a page that just did magic link verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check URL params for magic link success
      const urlParams = new URLSearchParams(window.location.search)
      const fromMagicLink = sessionStorage.getItem('from_magic_link')
      
      if (fromMagicLink === 'true' || urlParams.get('logged_in') === 'true') {
        console.log('🔄 [AUTH] Detected magic link redirect, refreshing auth...')
        setTimeout(() => {
          fetchUser()
          sessionStorage.removeItem('from_magic_link')
        }, 500)
      }
    }
  }, [])

  const login = async (email: string, role: string, acceptedPrivacy: boolean, referralCode?: string) => {
    try {
      const response = await fetch('/api/auth/magic-link/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, acceptedPrivacy, referralCode })
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
      // Clear dev auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dev-auth-user')
        localStorage.removeItem('dev-auth-token')
      }
      
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

