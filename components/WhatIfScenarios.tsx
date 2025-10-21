'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, Users, Target, Zap } from 'lucide-react'

interface Scenario {
  revenueChange: number // -50 till +100 (procent)
  marginChange: number // -10 till +20 (procentenheter)
  hasLongTermContract: boolean
  reducedKeyPersonDependency: boolean
  customerDiversification: number // 0-100 (procent förbättring)
  marketExpansion: boolean
}

interface WhatIfScenariosProps {
  baseValuation: number // Bas-värdering i kronor
  currentData: {
    revenue?: string
    profitMargin?: string
    industry?: string
  }
}

export default function WhatIfScenarios({ baseValuation, currentData }: WhatIfScenariosProps) {
  const [scenario, setScenario] = useState<Scenario>({
    revenueChange: 0,
    marginChange: 0,
    hasLongTermContract: false,
    reducedKeyPersonDependency: false,
    customerDiversification: 0,
    marketExpansion: false,
  })

  const [newValuation, setNewValuation] = useState(baseValuation)
  const [breakdown, setBreakdown] = useState<Array<{factor: string, impact: number, description: string}>>([])

  // Beräkna ny värdering när scenario ändras
  useEffect(() => {
    calculateNewValuation()
  }, [scenario, baseValuation])

  const calculateNewValuation = () => {
    let multiplier = 1.0
    const impacts: Array<{factor: string, impact: number, description: string}> = []

    // 1. Omsättningsförändring (direkt påverkan)
    if (scenario.revenueChange !== 0) {
      const revenueImpact = scenario.revenueChange / 100
      multiplier += revenueImpact * 0.8 // 80% av omsättningsökning går till värde
      impacts.push({
        factor: 'Omsättning',
        impact: revenueImpact * 0.8,
        description: `${scenario.revenueChange > 0 ? '+' : ''}${scenario.revenueChange}% omsättning`
      })
    }

    // 2. Marginalförändring (hög påverkan på värde)
    if (scenario.marginChange !== 0) {
      const marginImpact = scenario.marginChange * 0.03 // 3% värdeökning per procentenhet marginal
      multiplier += marginImpact
      impacts.push({
        factor: 'Vinstmarginal',
        impact: marginImpact,
        description: `${scenario.marginChange > 0 ? '+' : ''}${scenario.marginChange}%-enheter marginal`
      })
    }

    // 3. Långsiktigt avtal (minskar risk)
    if (scenario.hasLongTermContract) {
      multiplier += 0.15 // +15% värde
      impacts.push({
        factor: 'Långsiktigt avtal',
        impact: 0.15,
        description: '3+ år avtal minskar risk'
      })
    }

    // 4. Minskat personberoende (minskar risk)
    if (scenario.reducedKeyPersonDependency) {
      multiplier += 0.12 // +12% värde
      impacts.push({
        factor: 'Processdokumentation',
        impact: 0.12,
        description: 'Minskat beroende av nyckelpersoner'
      })
    }

    // 5. Kunddiversifiering (minskar risk)
    if (scenario.customerDiversification > 0) {
      const diversificationImpact = (scenario.customerDiversification / 100) * 0.18 // Upp till +18%
      multiplier += diversificationImpact
      impacts.push({
        factor: 'Kunddiversifiering',
        impact: diversificationImpact,
        description: `${scenario.customerDiversification}% bredare kundbas`
      })
    }

    // 6. Marknadsexpansion (tillväxtpotential)
    if (scenario.marketExpansion) {
      multiplier += 0.20 // +20% värde
      impacts.push({
        factor: 'Marknadsexpansion',
        impact: 0.20,
        description: 'Ny marknad/geografisk expansion'
      })
    }

    const calculatedValuation = baseValuation * multiplier
    setNewValuation(calculatedValuation)
    setBreakdown(impacts)
  }

  const valuationChange = newValuation - baseValuation
  const valuationChangePercent = ((newValuation - baseValuation) / baseValuation) * 100

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(1)}M kr`
  }

  const resetScenarios = () => {
    setScenario({
      revenueChange: 0,
      marginChange: 0,
      hasLongTermContract: false,
      reducedKeyPersonDependency: false,
      customerDiversification: 0,
      marketExpansion: false,
    })
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-card">
      <div className="flex items-start mb-6">
        <Zap className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0 mt-1" />
        <div>
          <h2 className="heading-3 mb-2">What-If Scenarier</h2>
          <p className="text-text-gray">Testa hur olika förändringar påverkar företagsvärdet</p>
        </div>
      </div>

      {/* Current vs New Valuation */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-gradient-to-br from-light-blue to-blue-50 rounded-2xl">
        <div>
          <div className="text-sm text-text-gray mb-1">Nuvarande värdering</div>
          <div className="text-3xl font-bold text-text-dark">{formatCurrency(baseValuation)}</div>
        </div>
        <div>
          <div className="text-sm text-text-gray mb-1">Ny värdering med förändringar</div>
          <div className={`text-3xl font-bold ${valuationChange > 0 ? 'text-green-600' : valuationChange < 0 ? 'text-red-600' : 'text-text-dark'}`}>
            {formatCurrency(newValuation)}
          </div>
          {valuationChange !== 0 && (
            <div className="flex items-center mt-2">
              {valuationChange > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span className={`font-semibold ${valuationChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {valuationChange > 0 ? '+' : ''}{formatCurrency(Math.abs(valuationChange))} ({valuationChangePercent > 0 ? '+' : ''}{valuationChangePercent.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Controls */}
      <div className="space-y-6 mb-8">
        {/* Revenue Change */}
        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-primary-blue mr-2" />
              <label className="font-semibold text-text-dark">Omsättningsförändring</label>
            </div>
            <span className="text-primary-blue font-bold">{scenario.revenueChange > 0 ? '+' : ''}{scenario.revenueChange}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="100"
            value={scenario.revenueChange}
            onChange={(e) => setScenario({ ...scenario, revenueChange: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-text-gray mt-1">
            <span>-50%</span>
            <span>0%</span>
            <span>+100%</span>
          </div>
        </div>

        {/* Margin Change */}
        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-primary-blue mr-2" />
              <label className="font-semibold text-text-dark">Vinstmarginalförändring</label>
            </div>
            <span className="text-primary-blue font-bold">{scenario.marginChange > 0 ? '+' : ''}{scenario.marginChange} %-enheter</span>
          </div>
          <input
            type="range"
            min="-10"
            max="20"
            value={scenario.marginChange}
            onChange={(e) => setScenario({ ...scenario, marginChange: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-text-gray mt-1">
            <span>-10%</span>
            <span>0%</span>
            <span>+20%</span>
          </div>
        </div>

        {/* Customer Diversification */}
        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-primary-blue mr-2" />
              <label className="font-semibold text-text-dark">Kunddiversifiering</label>
            </div>
            <span className="text-primary-blue font-bold">{scenario.customerDiversification}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={scenario.customerDiversification}
            onChange={(e) => setScenario({ ...scenario, customerDiversification: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-text-gray mt-1">
            <span>Ingen förbättring</span>
            <span>Bred kundbas</span>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4">
          <label className="flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-blue transition-all">
            <input
              type="checkbox"
              checked={scenario.hasLongTermContract}
              onChange={(e) => setScenario({ ...scenario, hasLongTermContract: e.target.checked })}
              className="mt-1 w-5 h-5 text-primary-blue"
            />
            <div className="ml-3">
              <div className="font-semibold text-text-dark">Långsiktigt kundavtal (3+ år)</div>
              <div className="text-sm text-text-gray">Minskar risk, ökar förutsägbarhet</div>
              {scenario.hasLongTermContract && (
                <div className="text-sm text-green-600 mt-1 font-medium">+15% värdeökning</div>
              )}
            </div>
          </label>

          <label className="flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-blue transition-all">
            <input
              type="checkbox"
              checked={scenario.reducedKeyPersonDependency}
              onChange={(e) => setScenario({ ...scenario, reducedKeyPersonDependency: e.target.checked })}
              className="mt-1 w-5 h-5 text-primary-blue"
            />
            <div className="ml-3">
              <div className="font-semibold text-text-dark">Dokumenterade processer & reducerat personberoende</div>
              <div className="text-sm text-text-gray">Väldokumenterade rutiner, mindre beroende av enskilda personer</div>
              {scenario.reducedKeyPersonDependency && (
                <div className="text-sm text-green-600 mt-1 font-medium">+12% värdeökning</div>
              )}
            </div>
          </label>

          <label className="flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-blue transition-all">
            <input
              type="checkbox"
              checked={scenario.marketExpansion}
              onChange={(e) => setScenario({ ...scenario, marketExpansion: e.target.checked })}
              className="mt-1 w-5 h-5 text-primary-blue"
            />
            <div className="ml-3">
              <div className="font-semibold text-text-dark">Marknadsexpansion planerad</div>
              <div className="text-sm text-text-gray">Ny geografisk marknad eller produktlansering</div>
              {scenario.marketExpansion && (
                <div className="text-sm text-green-600 mt-1 font-medium">+20% värdeökning</div>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Impact Breakdown */}
      {breakdown.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-text-dark mb-4">Värdeförändringar:</h3>
          <div className="space-y-2">
            {breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-text-dark">{item.factor}</div>
                  <div className="text-sm text-text-gray">{item.description}</div>
                </div>
                <div className={`font-bold ${item.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.impact > 0 ? '+' : ''}{(item.impact * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {breakdown.length > 0 && (
        <button
          onClick={resetScenarios}
          className="btn-ghost w-full"
        >
          <Minus className="w-5 h-5 mr-2" />
          Återställ alla scenarier
        </button>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Använd dessa scenarier för att förstå vilka förändringar som ger störst värdeökning. 
          Detta kan hjälpa dig prioritera förbättringar innan försäljning.
        </p>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #003366;
          cursor: pointer;
          border-radius: 50%;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #003366;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  )
}
