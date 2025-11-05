'use client'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function IdentityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/salja/sme-kit" className="inline-flex items-center gap-2 text-primary-navy mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka
          </Link>
          <h1 className="text-3xl font-bold text-primary-navy">Identitet & Konto</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-green-50 rounded-lg border-2 border-green-300 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Redan verifierad!</h2>
          <p className="text-green-800 mb-8">Ditt företag är redan verifierat via ditt befintliga konto.</p>
          <Link href="/salja/sme-kit" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg">Tillbaka till hub</Link>
        </div>
      </div>
    </div>
  )
}
