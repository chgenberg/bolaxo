'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, HelpCircle, Users, Shield, CreditCard, FileText } from 'lucide-react'
import { generateFAQStructuredData } from '@/lib/structured-data'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'sellers' | 'buyers' | 'pricing' | 'security'
}

export default function FAQPage() {
  const t = useTranslations('faq')
  const locale = useLocale()
  const getLocalizedPath = (path: string) => `/${locale}${path}`
  
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [expandedItem, setExpandedItem] = useState<number | null>(0)

  // FAQ data with translations
  const faqData: FAQItem[] = [
    {
      category: 'general',
      question: locale === 'sv' ? 'Vad är BOLAXO?' : 'What is BOLAXO?',
      answer: locale === 'sv' 
        ? 'BOLAXO är en automatiserad marknadsplats för företagsköp och försäljning. Vi kopplar samman säljare och köpare av SME-företag på ett säkert och effektivt sätt, med automatisk värdering, smart matchning och fullständig anonymitet fram till NDA-signering.'
        : 'BOLAXO is an automated marketplace for buying and selling companies. We connect sellers and buyers of SME companies in a secure and efficient way, with automatic valuation, smart matching and complete anonymity until NDA signing.'
    },
    {
      category: 'general',
      question: locale === 'sv' ? 'Hur fungerar processen?' : 'How does the process work?',
      answer: locale === 'sv'
        ? 'Säljare börjar med gratis värdering (5 min), skapar sedan annons och publicerar. Systemet matchar automatiskt med relevanta köpare. Köpare söker, signerar NDA digitalt för fullständig information, och kan sedan skicka LOI. Hela processen från NDA till closing hanteras i vår deal management-plattform.'
        : 'Sellers start with free valuation (5 min), then create an ad and publish. The system automatically matches with relevant buyers. Buyers search, sign NDA digitally for full information, and can then send LOI. The entire process from NDA to closing is handled in our deal management platform.'
    },
    {
      category: 'general',
      question: locale === 'sv' ? 'Vad kostar det att använda BOLAXO?' : 'What does it cost to use BOLAXO?',
      answer: locale === 'sv'
        ? 'Värdering är alltid gratis! För säljare: Free (0 kr - utkast), Basic (495 kr/mån), Pro (895 kr/mån), Pro+ Featured (1,495 kr/mån). För köpare är det helt gratis att söka och titta.'
        : 'Valuation is always free! For sellers: Free (0 SEK - draft), Basic (495 SEK/month), Pro (895 SEK/month), Pro+ Featured (1,495 SEK/month). For buyers it is completely free to search and browse.'
    },
    {
      category: 'sellers',
      question: locale === 'sv' ? 'Hur får jag en gratis värdering?' : 'How do I get a free valuation?',
      answer: locale === 'sv'
        ? 'Klicka på "Gratis värdering" och fyll i vårt formulär. Systemet analyserar ditt företag med 10 datakällor och ger dig en professionell värdering på 5 minuter. Du får en PDF-rapport helt gratis!'
        : 'Click on "Free valuation" and fill in our form. The system analyzes your company with 10 data sources and gives you a professional valuation in 5 minutes. You get a PDF report completely free!'
    },
    {
      category: 'sellers',
      question: locale === 'sv' ? 'Hur lång tid tar det att sälja?' : 'How long does it take to sell?',
      answer: locale === 'sv'
        ? 'Det varierar beroende på företag och bransch, men i genomsnitt 3-9 månader från publicering till avslut. Med vår smarta matchning kan processen gå snabbare.'
        : 'It varies depending on company and industry, but on average 3-9 months from publication to closing. With our smart matching, the process can go faster.'
    },
    {
      category: 'sellers',
      question: locale === 'sv' ? 'Kan jag vara helt anonym?' : 'Can I be completely anonymous?',
      answer: locale === 'sv'
        ? 'Ja! Du väljer själv anonymitetsnivå. Köpare ser bara denna information efter NDA-signering. All kommunikation går via vår NDA-skyddade plattform.'
        : 'Yes! You choose your own anonymity level. Buyers only see this information after NDA signing. All communication goes through our NDA-protected platform.'
    },
    {
      category: 'buyers',
      question: locale === 'sv' ? 'Är det gratis att söka efter företag?' : 'Is it free to search for companies?',
      answer: locale === 'sv'
        ? 'Ja, helt gratis! Att skapa konto, söka, bevaka och få matchningar är helt kostnadsfritt för köpare. Du betalar bara när du vill avsluta en deal och köper Deal Management-tjänsten.'
        : 'Yes, completely free! Creating an account, searching, watching and getting matches is completely free for buyers. You only pay when you want to close a deal and purchase the Deal Management service.'
    },
    {
      category: 'buyers',
      question: locale === 'sv' ? 'Hur hittar jag rätt företag?' : 'How do I find the right company?',
      answer: locale === 'sv'
        ? 'Vår AI-drivna matchningsalgoritm analyserar dina kriterier och rekommenderar relevanta företag. Du kan också söka manuellt med filter på bransch, region, omsättning och EBITDA. Vi hjälper dig hitta rätt match!'
        : 'Our AI-driven matching algorithm analyzes your criteria and recommends relevant companies. You can also search manually with filters on industry, region, revenue and EBITDA. We help you find the right match!'
    },
    {
      category: 'pricing',
      question: locale === 'sv' ? 'Finns det rabatt för långtidskontrakt?' : 'Are there discounts for long-term contracts?',
      answer: locale === 'sv'
        ? 'Ja, kontakta vår säljteam för skräddarsydd offert. Rabatt för årskontrakt är möjligt, speciellt för Pro och Pro+ Featured-paket.'
        : 'Yes, contact our sales team for a customized quote. Discounts for annual contracts are possible, especially for Pro and Pro+ Featured packages.'
    },
    {
      category: 'security',
      question: locale === 'sv' ? 'Hur skydds min data?' : 'How is my data protected?',
      answer: locale === 'sv'
        ? 'Vi använder BankID för all verifiering, HTTPS + AES-256 kryptering för all data, och digitala NDA-avtal signerade av båda parter. Din säkerhet är vår högsta prioritet.'
        : 'We use BankID for all verification, HTTPS + AES-256 encryption for all data, and digital NDA agreements signed by both parties. Your security is our highest priority.'
    }
  ]

  const categories = [
    { id: 'general', label: t('categories.general'), icon: HelpCircle },
    { id: 'sellers', label: t('categories.sellers'), icon: FileText },
    { id: 'buyers', label: t('categories.buyers'), icon: Users },
    { id: 'pricing', label: t('categories.pricing'), icon: CreditCard },
    { id: 'security', label: t('categories.security'), icon: Shield }
  ]

  const filteredFAQ = faqData.filter(item => item.category === selectedCategory)

  // Add FAQ structured data for SEO and LLM optimization
  useEffect(() => {
    const faqStructuredData = generateFAQStructuredData(
      faqData.map(item => ({
        question: item.question,
        answer: item.answer,
      }))
    )

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(faqStructuredData)
    script.id = 'structured-data-faq'

    // Remove existing script if present
    const existing = document.getElementById('structured-data-faq')
    if (existing) {
      existing.remove()
    }

    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById('structured-data-faq')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [])

  return (
    <main className="min-h-screen bg-neutral-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-navy/10 to-accent-pink/10 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-primary-navy mb-6">{t('title')}</h1>
          <p className="text-2xl text-primary-navy leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-accent-pink text-primary-navy'
                    : 'bg-neutral-off-white text-primary-navy border border-gray-200 hover:border-accent-pink'
                }`}
              >
                <Icon className="w-5 h-5" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                className="w-full px-6 py-5 sm:py-6 flex items-start justify-between gap-4 bg-white hover:bg-neutral-off-white transition-colors text-left"
              >
                <h3 className="text-base sm:text-lg font-bold text-primary-navy leading-relaxed pr-4">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-accent-pink flex-shrink-0 transition-transform ${
                    expandedItem === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedItem === index && (
                <div className="px-6 py-6 sm:py-8 bg-neutral-off-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-accent-pink rounded-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-primary-navy mb-4">{t('notFound')}</h2>
          <p className="text-lg text-primary-navy mb-8">
            {t('contactUs')}
          </p>
          <Link
            href={getLocalizedPath('/kontakt')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            {t('contactButton')}
            <ChevronDown className="w-5 h-5 rotate-90" />
          </Link>
        </div>
      </div>
    </main>
  )
}
