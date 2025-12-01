import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { callOpenAIResponses, OpenAIResponseError } from '@/lib/openai-response-utils'

interface DDData {
  [key: string]: string | number | boolean | undefined
}

export async function POST(request: NextRequest) {
  try {
    const { purchaseId, formData } = await request.json()

    if (!purchaseId || !formData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }

    // Get the premium valuation data
    const premiumValuation = await prisma.premiumValuation.findUnique({
      where: { purchaseId },
      include: { user: true }
    })

    if (!premiumValuation) {
      return NextResponse.json(
        { error: 'Premium valuation not found' },
        { status: 404 }
      )
    }

    // Prepare the comprehensive prompt
    const prompt = createComprehensivePrompt(formData as DDData)

    let result: any = {}

    try {
      const { text } = await callOpenAIResponses({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Du är en erfaren M&A-rådgivare och företagsvärderare i Sverige. Du har just genomfört en omfattande due diligence (42 områden) av ett företag. 
            
Din uppgift är att skapa en extremt detaljerad och professionell företagsvärdering och DD-rapport. Inkludera:
1. Exakt företagsvärdering med motivering
2. Detaljerad analys av alla 42 DD-områden
3. Identifierade röda flaggor och risker
4. Affärsmöjligheter och värdeskapande åtgärder
5. Konkreta rekommendationer för försäljningsprocessen
6. Förhandlingspunkter och strategier

Var extremt detaljerad och professionell. Detta är en rapport som ska användas i verkliga förhandlingar.

VIKTIGT: Returnera ALLTID ett giltigt JSON-objekt enligt strukturen nedan.`
          },
          { role: 'user', content: prompt }
        ],
        maxOutputTokens: 60000,
        metadata: {
          feature: 'premium-valuation',
          purchaseId
        }
      })

      const cleaned = (text || '{}').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      result = JSON.parse(cleaned || '{}')
    } catch (error) {
      if (error instanceof OpenAIResponseError) {
        console.error('Premium valuation OpenAI error:', error.status, error.body)
      } else {
        console.error('Premium valuation OpenAI error:', error)
      }
      return NextResponse.json(
        { error: 'Failed to generate premium valuation' },
        { status: 502 }
      )
    }

    // Update the premium valuation with results
    await prisma.premiumValuation.update({
      where: { id: premiumValuation.id },
      data: {
        resultData: result,
        status: 'completed',
        completedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      result,
      purchaseId 
    })

  } catch (error) {
    console.error('Premium valuation generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate premium valuation' },
      { status: 500 }
    )
  }
}

function createComprehensivePrompt(data: DDData): string {
  return `
Genomför en omfattande företagsvärdering baserat på följande due diligence-data:

FÖRETAGSINFORMATION:
${JSON.stringify(data, null, 2)}

Skapa en extremt detaljerad värdering och DD-rapport. Returnera ett JSON-objekt med följande struktur:

{
  "valuation": {
    "range": {
      "min": number,
      "max": number,
      "mostLikely": number,
      "confidence": number (0-1)
    },
    "methodology": {
      "primary": "string",
      "secondary": "string",
      "explanation": "string"
    },
    "adjustments": [
      {
        "type": "string",
        "impact": number,
        "reason": "string"
      }
    ]
  },
  "executiveSummary": "string (minst 500 ord)",
  "ddFindings": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"],
    "redFlags": [
      {
        "severity": "high|medium|low",
        "area": "string",
        "description": "string",
        "mitigation": "string"
      }
    ],
    "quickWins": [
      {
        "action": "string",
        "impact": "string",
        "timeframe": "string",
        "cost": "string"
      }
    ]
  },
  "financialAnalysis": {
    "historicalPerformance": {
      "revenue": { "trend": "string", "cagr": number, "analysis": "string" },
      "profitability": { "margins": object, "trend": "string", "analysis": "string" },
      "cashFlow": { "quality": "string", "conversion": number, "analysis": "string" }
    },
    "projections": {
      "baseCase": { "year1": number, "year2": number, "year3": number },
      "bestCase": { "year1": number, "year2": number, "year3": number },
      "worstCase": { "year1": number, "year2": number, "year3": number }
    },
    "workingCapital": {
      "current": number,
      "optimal": number,
      "improvement": "string"
    }
  },
  "marketPosition": {
    "competitiveAdvantages": ["string"],
    "marketShare": { "current": number, "potential": number },
    "customerAnalysis": {
      "concentration": "string",
      "quality": "string",
      "retention": number,
      "satisfaction": "string"
    }
  },
  "operationalExcellence": {
    "efficiency": { "score": number, "benchmarkComparison": "string" },
    "technology": { "maturity": "string", "investmentNeeded": number },
    "organization": { "keyPersonRisk": "string", "cultureFit": "string" },
    "processes": { "maturity": "string", "improvementAreas": ["string"] }
  },
  "riskAssessment": {
    "overallRiskLevel": "high|medium|low",
    "keyRisks": [
      {
        "category": "string",
        "description": "string",
        "probability": "high|medium|low",
        "impact": "high|medium|low",
        "mitigation": "string"
      }
    ]
  },
  "transactionGuidance": {
    "optimalTiming": "string",
    "buyerProfile": ["string"],
    "negotiationPoints": [
      {
        "topic": "string",
        "yourPosition": "string",
        "expectedCounterpart": "string",
        "strategy": "string"
      }
    ],
    "dealStructure": {
      "recommended": "string",
      "earnOut": { "recommended": boolean, "structure": "string" },
      "warranties": ["string"]
    }
  },
  "actionPlan": {
    "preSale": [
      {
        "action": "string",
        "priority": "high|medium|low",
        "timeframe": "string",
        "responsibleParty": "string"
      }
    ],
    "duringNegotiation": ["string"],
    "postSale": ["string"]
  },
  "appendices": {
    "financialTables": object,
    "benchmarkData": object,
    "assumptions": ["string"],
    "glossary": object
  }
}`
}
