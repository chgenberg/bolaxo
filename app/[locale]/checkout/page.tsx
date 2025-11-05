'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle2, Database, Users, FileCheck, Zap, Shield, TrendingUp } from 'lucide-react';
import Footer from '@/components/Footer';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const [activeStep, setActiveStep] = useState('analysis');
  
  const steps = useMemo(() => [
    {
      id: 'analysis',
      title: t('steps.analysis.title'),
      icon: TrendingUp,
      description: t('steps.analysis.description'),
      details: [
        {
          subtitle: t('steps.analysis.dataCollection.subtitle'),
          items: t.raw('steps.analysis.dataCollection.items')
        },
        {
          subtitle: t('steps.analysis.aiAnalysis.subtitle'),
          items: t.raw('steps.analysis.aiAnalysis.items')
        }
      ]
    },
    {
      id: 'matchmaking',
      title: t('steps.matchmaking.title'),
      icon: Users,
      description: t('steps.matchmaking.description'),
      details: [
        {
          subtitle: t('steps.matchmaking.automaticListing.subtitle'),
          items: t.raw('steps.matchmaking.automaticListing.items')
        },
        {
          subtitle: t('steps.matchmaking.realtimeMatching.subtitle'),
          items: t.raw('steps.matchmaking.realtimeMatching.items')
        }
      ]
    },
    {
      id: 'onboarding',
      title: t('steps.onboarding.title'),
      icon: Shield,
      description: t('steps.onboarding.description'),
      details: [
        {
          subtitle: t('steps.onboarding.verification.subtitle'),
          items: t.raw('steps.onboarding.verification.items')
        },
        {
          subtitle: t('steps.onboarding.confidentiality.subtitle'),
          items: t.raw('steps.onboarding.confidentiality.items')
        }
      ]
    },
    {
      id: 'diligence',
      title: t('steps.diligence.title'),
      icon: FileCheck,
      description: t('steps.diligence.description'),
      details: [
        {
          subtitle: t('steps.diligence.documentManagement.subtitle'),
          items: t.raw('steps.diligence.documentManagement.items')
        },
        {
          subtitle: t('steps.diligence.collaboration.subtitle'),
          items: t.raw('steps.diligence.collaboration.items')
        }
      ]
    },
    {
      id: 'contract',
      title: t('steps.contract.title'),
      icon: Zap,
      description: t('steps.contract.description'),
      details: [
        {
          subtitle: t('steps.contract.automaticContract.subtitle'),
          items: t.raw('steps.contract.automaticContract.items')
        },
        {
          subtitle: t('steps.contract.payment.subtitle'),
          items: t.raw('steps.contract.payment.items')
        }
      ]
    }
  ], [t]);

  const activeContent = steps.find(step => step.id === activeStep);
  const ActiveIcon = activeContent?.icon || TrendingUp;

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Vision Statement */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{t('whatWeSolve')}</h2>
            <ul className="space-y-3">
              {t.raw('solutions').map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-white py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12 text-center">{t('howItWorks')}</h2>

          {/* Step Timeline - Desktop */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-16">
            {steps.map((step, idx) => (
              <div key={step.id}>
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-center transition-all duration-300 ${
                    activeStep === step.id
                      ? 'bg-blue-900 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } rounded-lg p-4 font-semibold text-sm h-full flex flex-col items-center justify-center gap-2`}
                >
                  <span className="text-xl sm:text-2xl">
                    {idx + 1}
                  </span>
                  <span className="text-xs line-clamp-2">{step.title.split(' ').slice(1).join(' ')}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex justify-center items-center pt-4">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 -mx-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Timeline - Mobile */}
          <div className="md:hidden mb-8 space-y-3">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left transition-all duration-300 ${
                  activeStep === step.id
                    ? 'bg-blue-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } rounded-lg p-4 font-semibold flex items-center gap-3`}
              >
                <span className="text-lg font-bold">{idx + 1}</span>
                <span className="text-sm">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Step Content */}
          {activeContent && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-8 md:p-12 border border-blue-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-900 rounded-lg p-3">
                  <ActiveIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{activeContent.title}</h3>
                  <p className="text-gray-600 mt-1">{activeContent.description}</p>
                </div>
              </div>

              <div className="space-y-8">
                {activeContent.details.map((detail, idx) => (
                  <div key={idx}>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                      {detail.subtitle}
                    </h4>
                    <ul className="space-y-3 ml-7">
                      {detail.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3 text-gray-700">
                          <span className="inline-block w-2 h-2 bg-blue-900 rounded-full mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-900 text-white py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-blue-100 text-lg mb-8">
            {t('ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/salja/start`} className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
              {t('ctaSeller')}
            </Link>
            <Link href={`/${locale}/kopare/start`} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-center">
              {t('ctaBuyer')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Prevent static prerendering to avoid build errors
export const dynamic = 'force-dynamic'
export const dynamicParams = true
