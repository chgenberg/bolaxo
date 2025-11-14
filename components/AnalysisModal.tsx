'use client'

import { useState, useMemo } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

interface AnalysisModalProps {
  onClose: () => void
}

const copy = {
  sv: {
    title: 'Analysera ditt företag',
    labels: {
      companyName: 'Företagsnamn',
      domain: 'Domännamn (valfritt)'
    },
    placeholders: {
      companyName: 'T.ex. Nordisk Tech AB',
      domain: 'T.ex. nordisktech.se'
    },
    errors: {
      missingName: 'Vänligen ange företagsnamn',
      generic: 'Ett fel uppstod',
      analysisFailed: 'Analysen misslyckades'
    },
    button: 'Analysera',
    infoText:
      'Analysen tar vanligtvis 2-3 minuter. Vi söker igenom öppna källor för att ge dig värdefulla insikter om ditt företag.',
    loadingTitle: (company: string) => `Analyserar ${company}`,
    loadingTitleFallback: 'Analyserar företaget',
    loadingDescription: 'Vi söker igenom webben efter information om ditt företag...',
    progressLabel: (progress: number) => `${progress}% klart`,
    statusMessages: [
      'Söker företagsinformation...',
      'Analyserar marknadsposition...',
      'Granskar konkurrenter...',
      'Identifierar styrkor och möjligheter...',
      'Sammanställer rekommendationer...'
    ],
    requiredAsterisk: 'Företagsnamn *'
  },
  en: {
    title: 'Analyze your company',
    labels: {
      companyName: 'Company name',
      domain: 'Domain name (optional)'
    },
    placeholders: {
      companyName: 'e.g. Nordic Tech Ltd',
      domain: 'e.g. nordictech.com'
    },
    errors: {
      missingName: 'Please enter a company name',
      generic: 'Something went wrong',
      analysisFailed: 'Analysis failed'
    },
    button: 'Analyze',
    infoText:
      'The analysis usually takes 2-3 minutes. We scan public sources to deliver valuable insights about your company.',
    loadingTitle: (company: string) => `Analyzing ${company}`,
    loadingTitleFallback: 'Analyzing your company',
    loadingDescription: 'We are scanning the web for information about your business…',
    progressLabel: (progress: number) => `${progress}% complete`,
    statusMessages: [
      'Gathering company information…',
      'Analyzing market position…',
      'Reviewing competitors…',
      'Identifying strengths and opportunities…',
      'Compiling recommendations…'
    ],
    requiredAsterisk: 'Company name *'
  }
}

export default function AnalysisModal({ onClose }: AnalysisModalProps) {
  const router = useRouter()
  const locale = useLocale()
  const text = useMemo(() => {
    if (locale.startsWith('sv')) return copy.sv
    return copy.en
  }, [locale])
  const [companyName, setCompanyName] = useState('')
  const [domain, setDomain] = useState('')
  const [revenue, setRevenue] = useState('')
  const [grossProfit, setGrossProfit] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!companyName.trim()) {
      setError(text.errors.missingName)
      return
    }

    setError('')
    setIsAnalyzing(true)
    setProgress(0)

    // Start progress animation (200 seconds = 200000ms)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99) {
          clearInterval(progressInterval)
          return 99
        }
        return prev + 0.5 // Increase by 0.5% every second
      })
    }, 1000)

    try {
      // Call the analysis API
      const response = await fetch('/api/analyze-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          domain: domain.trim(),
          revenue: revenue.trim(),
          grossProfit: grossProfit.trim(),
          locale
        })
      })

      if (!response.ok) {
        throw new Error(text.errors.analysisFailed)
      }

      const data = await response.json()
      clearInterval(progressInterval)
      
      // Store results in sessionStorage for the results page
      if (data?.results) {
        sessionStorage.setItem('analysisResults', JSON.stringify(data.results))
      }
      
      // Navigate to results page
      if (data?.analysisId) {
        router.push(`/${locale}/analysera/resultat?id=${data.analysisId}`)
      } else {
        router.push(`/${locale}/analysera/resultat`)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : text.errors.generic)
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
        {!isAnalyzing ? (
          <>
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary-navy">
                {text.title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {text.labels.companyName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={text.placeholders.companyName}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {text.labels.domain}
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder={text.placeholders.domain}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Omsättning förra året (kr)
                </label>
                <input
                  type="text"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="10 000 000"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bruttoresultat förra året (kr)
                </label>
                <input
                  type="text"
                  value={grossProfit}
                  onChange={(e) => setGrossProfit(e.target.value)}
                  placeholder="3 000 000"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                className="w-full bg-primary-navy text-white py-4 rounded-lg font-semibold hover:bg-primary-navy/90 transition-all transform hover:scale-[1.02]"
              >
                {text.button}
              </button>

              <p className="text-xs text-center text-gray-500">
                {text.infoText}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Loading State */}
            <div className="p-8 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto bg-primary-navy rounded-full flex items-center justify-center animate-pulse">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-primary-navy mb-4">
                {companyName ? text.loadingTitle(companyName) : text.loadingTitleFallback}
              </h3>

              <p className="text-gray-600 mb-8">
                {text.loadingDescription}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-primary-navy rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm font-semibold text-gray-700">
                {text.progressLabel(Math.round(progress))}
              </p>

              {/* Status Messages */}
              <div className="mt-6 text-sm text-gray-600">
                {progress < 20 && text.statusMessages[0]}
                {progress >= 20 && progress < 40 && text.statusMessages[1]}
                {progress >= 40 && progress < 60 && text.statusMessages[2]}
                {progress >= 60 && progress < 80 && text.statusMessages[3]}
                {progress >= 80 && text.statusMessages[4]}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
