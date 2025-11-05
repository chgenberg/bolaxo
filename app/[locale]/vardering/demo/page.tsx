'use client'

import { TrendingUp, Download, Mail, CheckCircle, AlertCircle, Lightbulb, BarChart3, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import WhatIfScenarios from '@/components/WhatIfScenarios'

// DEMO: Mockup-resultat för en verklig bolagsvärdering
export default function ValuationDemoPage() {
  
  // Exempel: Tech-företag med 5-10 Mkr omsättning, 10-20% marginal, 6-10 anställda
  const demoResult = {
    valuationRange: {
      min: 12000000, // 12M kr
      max: 18000000, // 18M kr
      mostLikely: 15000000, // 15M kr
    },
    method: 'Kombinerad multipel- och avkastningsvärdering',
    methodology: {
      multipel: 'Värderingen baseras på en EBIT-multipel på 6.5x för Tech & IT-branschen. Typiska multiplar för SaaS och tech-tjänsteföretag ligger mellan 5-8x beroende på tillväxt och recurring revenue. Ditt företag ligger i mitten av intervallet p.g.a. stabil tillväxt men viss personberoende.',
      avkastningskrav: 'Ett avkastningskrav på 14% har använts baserat på företagets riskprofil. Detta är lägre än genomsnittet för småbolag (15-18%) tack vare stark finansiell historik och etablerad kundbas.',
      substans: 'Substansvärdet (tillgångar minus skulder) uppskattas till cirka 8M kr, vilket ger ett tryggt golv för värderingen.'
    },
    analysis: {
      strengths: [
        'Stark historisk tillväxt på 25% årligen de senaste 3 åren',
        'Hög vinstmarginal på 18% - över branschsnittet (12-15%)',
        'Återkommande intäkter via prenumerationsmodell (65% av omsättning)',
        'Etablerad kundbas med låg churn-rate (8% årligen)',
        'Skalbar teknisk plattform utan stora marginalökningar vid tillväxt'
      ],
      weaknesses: [
        'Beroende av grundare/VD för produktutveckling och nyckelkundrelationer',
        'Begränsad geografisk spridning - 80% av kunder i Stockholmsregionen',
        'Två av top-5 kunder står för 40% av intäkterna (kundkoncentration)',
        'Teknisk skuld i äldre delar av plattformen kan kräva ombyggnad'
      ],
      opportunities: [
        'Expansion till Norge och Finland - liknande marknader med stor potential',
        'Partnerskap med större aktörer för distribution',
        'AI-integration i produkten kan differentiera från konkurrenter',
        'Upsell-potential hos befintliga kunder (endast 30% använder premium-features)'
      ],
      risks: [
        'Hård konkurrens från större internationella aktörer',
        'Beroende av vissa nyckelteknologier/leverantörer',
        'Regulatoriska förändringar kan påverka branschen',
        'Risk för ökade kundanskaffningskostnader i takt med marknadsmättnad'
      ]
    },
    recommendations: [
      {
        title: 'Dokumentera processer och minska VD-beroende',
        description: 'Skapa detaljerad dokumentation för produktutveckling, försäljning och kundhantering. Delegera ansvar till nyckelpersoner i teamet. Detta kan öka värdet med 12-15% genom att minska risken.',
        impact: 'high' as const
      },
      {
        title: 'Diversifiera kundbasen',
        description: 'Aktivt arbeta för att minska beroendet av de 2 största kunderna. Målsättning: Ingen kund över 15% av omsättningen. Detta kan öka värdet med 15-18%.',
        impact: 'high' as const
      },
      {
        title: 'Öka recurring revenue till 80%+',
        description: 'Konvertera fler engångsprojekt till prenumerationer. Högre andel recurring revenue kan öka multipeln från 6.5x till 8-9x, vilket ger 25-40% högre värdering.',
        impact: 'high' as const
      },
      {
        title: 'Geografisk expansion - börja med Norge',
        description: 'Liknande marknad, samma språk, stor potential. Kan öka värdet med 20% genom att visa tydlig tillväxtbana.',
        impact: 'medium' as const
      },
      {
        title: 'Implementera churn-reduction program',
        description: 'Sänk churn från 8% till under 5% genom bättre onboarding och customer success. Detta förbättrar LTV och kan höja värdet med 10%.',
        impact: 'medium' as const
      },
      {
        title: 'Modernisera teknisk plattform',
        description: 'Åtgärda teknisk skuld för att undvika framtida problem. Kan kräva investering men ökar långsiktig hållbarhet.',
        impact: 'low' as const
      }
    ],
    marketComparison: 'Baserat på 7.5 Mkr i omsättning och en 6.5x omsättningsmultipel ligger värderingen något över branschgenomsnittet för tech-tjänsteföretag i storleken 5-10M omsättning. Jämfört med liknande svenska SaaS-bolag som sålts 2024 ligger värderingen i linje med marknaden - de flesta affärer hamnade mellan 5-8x EBIT.',
    keyMetrics: [
      { label: 'EBIT-multipel', value: '6.5x' },
      { label: 'Avkastningskrav', value: '14%' },
      { label: 'Marginal vs bransch', value: '+3%' },
      { label: 'Årlig tillväxt', value: '25%' },
      { label: 'Recurring revenue', value: '65%' },
    ]
  }

  const demoData = {
    revenue: '5-10',
    profitMargin: '10-20',
    industry: 'tech'
  }

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(1)}M kr`
  }

  return (
    <main className="min-h-screen bg-background-off-white py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Demo Banner */}
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl mb-8 text-center">
          <p className="text-yellow-800 font-semibold">
            🎯 DEMO: Detta är ett exempel på hur ett värderingsresultat ser ut
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Baserat på ett fiktivt tech-företag med 7.5M omsättning, 18% marginal, 8 anställda
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto bg-green-100 text-green-800 rounded-full text-sm mb-4">
            <CheckCircle className="w-4 h-4 mr-2" />
            Värdering klar!
          </div>
          <h1 className="heading-1 mb-4">Din Företagsvärdering</h1>
          <p className="text-lg text-text-gray">
            Baserad på AI-analys med professionella värderingsmetoder
          </p>
        </div>

        {/* Main Valuation */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-card mb-8 border-2" style={{ borderColor: '#1F3C58' }}>
          <div className="text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-6" style={{ color: '#1F3C58' }} />
            <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: '#1F3C58' }}>Uppskattat företagsvärde</h2>
            <div className="text-5xl md:text-6xl font-bold mb-4" style={{ color: '#1F3C58' }}>
              {formatCurrency(demoResult.valuationRange.mostLikely)}
            </div>
            <div className="text-lg mb-4" style={{ color: '#1F3C58' }}>
              Intervall: {formatCurrency(demoResult.valuationRange.min)} - {formatCurrency(demoResult.valuationRange.max)}
            </div>
            <div className="mt-6 p-4 rounded-xl inline-block" style={{ backgroundColor: '#F5F0E8' }}>
              <p className="text-sm mb-1" style={{ color: '#666666' }}>Metod använd</p>
              <p className="font-semibold" style={{ color: '#1F3C58' }}>{demoResult.method}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {demoResult.keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-card text-center">
              <div className="text-sm text-text-gray mb-1">{metric.label}</div>
              <div className="text-xl sm:text-2xl font-bold text-primary-blue">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Methodology Explanation */}
        <div className="bg-white p-8 rounded-2xl shadow-card mb-8">
          <div className="flex items-start mb-6">
            <FileText className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="heading-3 mb-2">Beräkningsunderlag</h2>
              <p className="text-text-gray">Så har vi kommit fram till värderingen</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-light-blue p-4 rounded-xl">
              <h3 className="font-semibold text-primary-blue mb-2">Multipelvärdering</h3>
              <p className="text-sm text-text-dark">{demoResult.methodology.multipel}</p>
            </div>
            
            <div className="bg-light-blue p-4 rounded-xl">
              <h3 className="font-semibold text-primary-blue mb-2">Avkastningsvärdering</h3>
              <p className="text-sm text-text-dark">{demoResult.methodology.avkastningskrav}</p>
            </div>
            
            <div className="bg-light-blue p-4 rounded-xl">
              <h3 className="font-semibold text-primary-blue mb-2">Substansvärde</h3>
              <p className="text-sm text-text-dark">{demoResult.methodology.substans}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-text-dark mb-2">Jämförelse med marknaden</h3>
            <p className="text-sm text-text-gray">{demoResult.marketComparison}</p>
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="bg-white p-8 rounded-2xl shadow-card mb-8">
          <div className="flex items-start mb-6">
            <BarChart3 className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="heading-3 mb-2">Analys av företaget</h2>
              <p className="text-text-gray">Styrkor, svagheter, möjligheter och risker</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Strengths */}
            <div>
              <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Styrkor ({demoResult.analysis.strengths.length})
              </h3>
              <ul className="space-y-2">
                {demoResult.analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-green-500 mr-2 flex-shrink-0">•</span>
                    <span className="text-text-gray">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="font-semibold text-orange-700 mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Svagheter ({demoResult.analysis.weaknesses.length})
              </h3>
              <ul className="space-y-2">
                {demoResult.analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-orange-500 mr-2 flex-shrink-0">•</span>
                    <span className="text-text-gray">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div>
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Möjligheter ({demoResult.analysis.opportunities.length})
              </h3>
              <ul className="space-y-2">
                {demoResult.analysis.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-blue-500 mr-2 flex-shrink-0">•</span>
                    <span className="text-text-gray">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Risker ({demoResult.analysis.risks.length})
              </h3>
              <ul className="space-y-2">
                {demoResult.analysis.risks.map((risk, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                    <span className="text-text-gray">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-8 rounded-2xl shadow-card mb-8">
          <div className="flex items-start mb-6">
            <Lightbulb className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="heading-3 mb-2">Så ökar du företagsvärdet</h2>
              <p className="text-text-gray">Konkreta rekommendationer rangordnade efter påverkan</p>
            </div>
          </div>

          <div className="space-y-4">
            {demoResult.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 ${
                  rec.impact === 'high'
                    ? 'bg-green-50 border-green-500'
                    : rec.impact === 'medium'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-text-dark">{rec.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                      rec.impact === 'high'
                        ? 'bg-green-200 text-green-800'
                        : rec.impact === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {rec.impact === 'high' ? 'Hög påverkan' : rec.impact === 'medium' ? 'Medel påverkan' : 'Låg påverkan'}
                  </span>
                </div>
                <p className="text-sm text-text-gray">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Scenarios */}
        <WhatIfScenarios 
          baseValuation={demoResult.valuationRange.mostLikely}
          currentData={demoData}
        />

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8 mt-8">
          <button className="btn-secondary flex items-center justify-center">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Ladda ner som PDF
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Skicka till min e-post
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-primary-blue text-white p-8 rounded-2xl">
          <h2 className="heading-3 text-white mb-4">Nästa steg</h2>
          <p className="mb-6 opacity-90">
            Vill du sälja ditt företag? Vi hjälper dig att hitta rätt köpare och få bästa möjliga pris.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/salja/start" className="btn-secondary bg-white text-primary-blue hover:bg-gray-100 inline-flex items-center justify-center">
              Skapa annons
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
            <Link href="/kontakt" className="btn-secondary bg-white/20 text-white hover:bg-white/30 inline-flex items-center justify-center">
              Kontakta rådgivare
            </Link>
          </div>
        </div>

        {/* Back to real valuation */}
        <div className="mt-8 text-center">
          <Link href="/vardering" className="text-primary-blue hover:underline">
            ← Tillbaka till värderingsverktyget
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-text-gray">
          <p>
            Denna värdering är en indikation baserad på AI-analys och bör inte ses som en formell värdering.
            För en fullständig Due Diligence och professionell värdering, kontakta en auktoriserad värderare.
          </p>
        </div>
      </div>
    </main>
  )
}
