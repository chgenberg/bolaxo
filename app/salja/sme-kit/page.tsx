'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, DollarSign, Lock, BookOpen, Users, Package, CheckCircle, AlertCircle, ArrowRight, Zap } from 'lucide-react'

export default function SMEKitPage() {
  const modules = [
    {
      id: 'identity',
      title: 'Identitet & Konto',
      description: 'Verifiera företag och hämta bolagsdata automatiskt',
      icon: Users,
      progress: 100,
      status: 'complete',
      href: '/salja/sme-kit/identity'
    },
    {
      id: 'financials',
      title: 'Ekonomi-import',
      description: 'Ladda upp ekonomisk data, normalisera och analysera',
      icon: DollarSign,
      progress: 50,
      status: 'in_progress',
      href: '/salja/sme-kit/financials'
    },
    {
      id: 'agreements',
      title: 'Avtalsguide',
      description: 'Katalogisera viktiga avtal och identifiera risker',
      icon: FileText,
      progress: 0,
      status: 'pending',
      href: '/salja/sme-kit/agreements'
    },
    {
      id: 'dataroom',
      title: 'Datarum',
      description: 'Säker dokumentlagring med åtkomstlogg',
      icon: Lock,
      progress: 0,
      status: 'pending',
      href: '/salja/sme-kit/dataroom'
    },
    {
      id: 'teaser',
      title: 'Teaser & IM',
      description: 'Generera professionella presentationer automatiskt',
      icon: BookOpen,
      progress: 0,
      status: 'pending',
      href: '/salja/sme-kit/teaser'
    },
    {
      id: 'nda',
      title: 'NDA-portal',
      description: 'Skicka och spåra NDA-signeringar',
      icon: Lock,
      progress: 0,
      status: 'pending',
      href: '/salja/sme-kit/nda'
    },
    {
      id: 'handoff',
      title: 'Advisor Handoff',
      description: 'Samla allt och skicka till rådgivare',
      icon: Package,
      progress: 0,
      status: 'pending',
      href: '/salja/sme-kit/handoff'
    }
  ]

  const totalProgress = Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)
  const completeCount = modules.filter(m => m.status === 'complete').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-navy to-primary-navy/80">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/salja" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Tillbaka
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-accent-pink/20 rounded-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">SME Automation Kit</h1>
              <p className="text-white/70">Automatisera 80% av förarbetet innan försäljningen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Övergripande framsteg</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary-navy">{totalProgress}%</span>
                <span className="text-lg text-gray-600">färdigstäld</span>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent-pink to-primary-navy transition-all duration-500"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Moduler färdiga</p>
              <p className="text-4xl font-black text-green-600">{completeCount}/7</p>
              <p className="text-sm text-gray-600 mt-2">{7 - completeCount} återstår</p>
            </div>

            <div className="bg-accent-pink/10 border-2 border-accent-pink rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">💡 Tips</p>
              <p className="text-sm text-gray-700">Du är ungefär <strong>15 minuter</strong> från att kunna skapa din handoff-pack!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {modules.map((module) => {
            const IconComponent = module.icon
            const isComplete = module.status === 'complete'
            const isPending = module.status === 'pending'
            const isInProgress = module.status === 'in_progress'

            return (
              <Link key={module.id} href={module.href}>
                <div className={`h-full p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  isComplete 
                    ? 'bg-green-50 border-green-300 hover:shadow-lg hover:scale-105' 
                    : isInProgress
                    ? 'bg-accent-pink/10 border-accent-pink hover:shadow-lg hover:scale-105'
                    : isPending
                    ? 'bg-white border-gray-200 hover:border-primary-navy hover:shadow-lg'
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${isComplete ? 'bg-green-100' : isInProgress ? 'bg-accent-pink/20' : 'bg-primary-navy/10'}`}>
                      <IconComponent className={`w-6 h-6 ${isComplete ? 'text-green-600' : isInProgress ? 'text-accent-pink' : 'text-primary-navy'}`} />
                    </div>
                    {isComplete && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {isInProgress && <Zap className="w-6 h-6 text-accent-pink animate-pulse" />}
                    {isPending && <AlertCircle className="w-6 h-6 text-gray-400" />}
                  </div>
                  
                  <h3 className="text-lg font-bold text-primary-navy mb-1">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  
                  {module.progress > 0 && (
                    <>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full bg-accent-pink rounded-full transition-all"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{module.progress}% färdigstäld</span>
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-3">📊 Vad du kommer kunna göra:</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Automatisk ekonomi-normalisering</li>
              <li>✓ Generera professionella presentationer</li>
              <li>✓ Säker dokumentlagring</li>
              <li>✓ Spåra NDA-signeringar</li>
              <li>✓ Skapa advisor handoff-pack</li>
            </ul>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="font-bold text-green-900 mb-3">⏱️ Tidsestimat:</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>Ekonomi-import: 5-10 min</li>
              <li>Avtalsguide: 10-15 min</li>
              <li>Datarum setup: 2-3 min</li>
              <li>Teaser & IM: 15-20 min</li>
              <li><strong>Totalt: ~45-60 minuter</strong></li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-accent-pink/20 to-primary-navy/20 border-2 border-accent-pink rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-primary-navy mb-3">Redo att börja?</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Börja med den första modulen för att verifiera ditt företag. Det tar bara några minuter!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/salja/sme-kit/financials" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all">
              Starta med Ekonomi-import
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/salja" className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-primary-navy text-primary-navy font-bold rounded-lg hover:bg-primary-navy/5 transition-all">
              Gå tillbaka
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
