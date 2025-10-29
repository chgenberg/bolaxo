'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (replace with Sentry/etc in production)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Optionally send to error tracking service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking API
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ error: error.message, stack: error.stack })
      // })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Något gick fel
              </h2>
              <p className="text-gray-600 mb-6">
                Vi beklagar problemet. Vänligen försök igen eller kontakta support om problemet kvarstår.
              </p>
              {this.state.error && process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm text-gray-800 font-mono">
                  <p className="font-bold mb-2">Error:</p>
                  <p>{this.state.error.message}</p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">Stack trace</summary>
                      <pre className="mt-2 text-xs overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined })
                  window.location.href = '/'
                }}
                className="mt-4 w-full bg-[#003366] text-white py-2 px-4 rounded-lg hover:bg-[#002244] transition-colors"
              >
                Tillbaka till startsidan
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

