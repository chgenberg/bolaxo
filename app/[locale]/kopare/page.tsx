'use client'

import Link from 'next/link'
import { SWEDISH_CITIES } from '@/lib/cities'
import { ArrowRight, Search } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

export default function BuyerAllCitiesPage() {
  const t = useTranslations('kopare')
  const locale = useLocale()
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-navy mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <Link
            href={`/${locale}/sok`}
            className="inline-block bg-primary-navy text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center gap-2 justify-center mb-4"
          >
            {t('browseButton')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Cities Grid */}
        <div>
          <h2 className="text-2xl font-bold text-primary-navy mb-8">{t('citiesTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {SWEDISH_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/${locale}/kopare/${city.slug}`}
                className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg hover:border-primary-navy transition group"
              >
                <h3 className="font-semibold text-primary-navy group-hover:text-opacity-80">{city.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{city.region}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Why Buy */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary-navy mb-12 text-center">{t('whyBuyTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {t.raw('benefits').map((item: { title: string; desc: string }, i: number) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-primary-navy mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Cities */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-primary-navy mb-8">{t('popularCitiesTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {SWEDISH_CITIES.slice(0, 9).map((city) => (
          <Link
            href={`/${locale}/kopare/${city.slug}`}
            className="bg-gradient-to-br from-primary-navy/5 to-transparent border border-primary-navy/20 rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg text-primary-navy mb-2">{city.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{city.region} länet</p>
            <span className="inline-block text-primary-navy text-sm font-semibold hover:gap-2">
              {t('seeCompanies')} →
            </span>
          </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-navy text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">{t('ctaTitle')}</h2>
        <p className="text-lg mb-8 opacity-90">
          {t('ctaSubtitle')}
        </p>
        <Link
          href={`/${locale}/registrera`}
          className="inline-block bg-white text-primary-navy px-10 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition"
        >
          {t('ctaButton')}
        </Link>
      </div>
    </div>
  )
}

