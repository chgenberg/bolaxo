import { createTimeoutSignal } from '@/lib/scrapers/abort-helper'

const WEB_INSIGHTS_TIMEOUT_MS = 25000
const WEB_INSIGHTS_MAX_ATTEMPTS = 2
const WEB_INSIGHTS_SNIPPET_LENGTH = 800

export type WebInsightFocus =
  | 'enrichment'
  | 'valuation-result'
  | 'listing'
  | 'buyer-match'
  | 'analysis'

interface WebInsightOptions {
  companyName: string
  orgNumber?: string
  website?: string
  industry?: string
  focus: WebInsightFocus
}

export async function fetchWebInsights({
  companyName,
  orgNumber,
  website,
  industry,
  focus
}: WebInsightOptions) {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }

const baseInstructions = `Du är en svensk företagsanalytiker.
Du använder OpenAI web_search-verktyget för att hämta kontrollerbar information om ett svenskt bolag.
Var alltid källkritisk, ange endast fakta som går att verifiera.
Om du inte hittar något, lämna fält som null.

Regler:
- Prioritera externa och oberoende källor (nyhetsmedier, branschportaler, databaser, forum, recensioner). Använd företagets egna kanaler endast om du saknar oberoende källor.
- Varje källa i utdata måste innehålla fälten "domain" (exempel: di.se) och "sourceType" (t.ex. news, review, blog, forum, social, official).
- Ange aldrig samma domän mer än en gång i utdata – välj alltid nästa relevanta källa om du redan använt en domän.
- Ange inga spekulationer.
- Returnera ENBART JSON enligt efterfrågat schema. Inga kommentarer.`

  const inputBlock = `
Företagsnamn: ${companyName}
Organisationsnummer: ${orgNumber || 'okänt'}
Känd webbplats: ${website || 'okänd'}
Bransch (intern kod): ${industry || 'okänd'}
`

  const { schema, focusInstructions } = getSchemaForFocus(focus)
  const maxOutputTokens =
    focus === 'analysis'
      ? 1400
      : focus === 'buyer-match'
        ? 600
        : 900

  const instructions = `${baseInstructions}

${focusInstructions}

JSON-schema (måste följas exakt):
${schema}`

  const payload = {
    model: 'gpt-5.1',
    instructions,
    input: inputBlock,
    tools: [{ type: 'web_search' }],
    reasoning: { effort: 'medium' },
    text: { verbosity: 'high' }
  }

  let lastError: unknown = null

  for (let attempt = 1; attempt <= WEB_INSIGHTS_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
        signal: createTimeoutSignal(WEB_INSIGHTS_TIMEOUT_MS)
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        console.error(
          `OpenAI web_search error (attempt ${attempt}/${WEB_INSIGHTS_MAX_ATTEMPTS}):`,
          response.status,
          errorText
        )
        lastError = new Error(errorText || `HTTP ${response.status}`)
        continue
      }

      const json = await response.json()
      const text = extractTextFromResponses(json)
      if (!text) {
        console.warn(`OpenAI web_search: tomt textblock (försök ${attempt})`)
        continue
      }

      const parsed = tryParseWebInsightsJson(text)
      if (parsed) {
        return parsed
      }

      console.warn(
        `OpenAI web_search: kunde inte tolka JSON (försök ${attempt}).`,
        text.slice(0, WEB_INSIGHTS_SNIPPET_LENGTH)
      )
    } catch (error) {
      lastError = error
      console.error(
        `fetchWebInsights error (attempt ${attempt}/${WEB_INSIGHTS_MAX_ATTEMPTS}):`,
        error
      )
    }
  }

  if (lastError) {
    console.error('fetchWebInsights gav upp efter flera försök:', lastError)
  }

  return null
}

function extractTextFromResponses(responseJson: any): string | null {
  try {
    const outputs = responseJson?.output
    if (!outputs || !Array.isArray(outputs)) {
      return null
    }

    for (const output of outputs) {
      if (output?.content && Array.isArray(output.content)) {
        for (const block of output.content) {
          if (block.type === 'output_text' && typeof block.text === 'string') {
            return block.text
          }
          if (block.type === 'text' && typeof block.text === 'string') {
            return block.text
          }
        }
      }
    }
  } catch (error) {
    console.error('extractTextFromResponses error:', error)
  }

  return null
}

function tryParseWebInsightsJson(raw: string) {
  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim()

  const candidates: string[] = []
  if (cleaned) {
    candidates.push(cleaned)
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      candidates.push(cleaned.slice(firstBrace, lastBrace + 1))
    }
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate)
    } catch (error) {
      // continue to next candidate
    }
  }

  return null
}

function getSchemaForFocus(focus: WebInsightFocus) {
  switch (focus) {
    case 'valuation-result':
      return {
        focusInstructions: `Syfte: komplettera en färdig företagsvärdering med färsk extern information.
Fokusera på marknadssignaler, konkurrenter och relevanta nyheter från senaste 24 månaderna.`,
        schema: `{
  "summary": "Kort helhetsöversikt (max 2 meningar)",
  "marketSignals": ["punkt 1", "punkt 2"],
  "newsHighlights": [
    {
      "headline": "Rubrik",
      "source": "Källa",
      "domain": "exempel.se",
      "sourceType": "news | blog | review | forum | social | official",
      "url": "https://...",
      "tone": "positive | neutral | negative"
    }
  ],
  "competitorSnapshot": [
    {
      "name": "Konkurrentens namn",
      "insight": "Kort beskrivning"
    }
  ],
  "actionCue": "Konkreta tips eller fråga att ta vidare"
}`
      }
    case 'listing':
      return {
        focusInstructions: `Syfte: hjälpa en säljare att skriva en säljande annons.
Fokusera på kundnytta, USP och vilka typer av köpare som kan vara intresserade.`,
        schema: `{
  "uspSuggestions": ["USP 1", "USP 2"],
  "customerAngles": ["kort mening om typkund 1"],
  "proofPoints": ["Exempel eller social proof"],
  "riskNotes": ["Eventuella varningar eller tom array"],
  "sourceLinks": [
    { "label": "Kort källa", "url": "https://...", "domain": "exempel.se", "sourceType": "news | review | blog | forum | social | official" }
  ]
}`
      }
    case 'buyer-match':
      return {
        focusInstructions: `Syfte: ge en köpare snabb research om målföretaget.
Inkludera viktiga positiva signaler och eventuella varningsflaggor.`,
        schema: `{
  "hook": "En mening som fångar intresset",
  "recentSignal": "En relevant nyhet eller datapunkt",
  "riskFlag": "Kort riskbeskrivning eller null",
  "suggestedQuestion": "En kvalificerad fråga att ställa säljaren",
  "sourceLinks": [
    { "label": "Källa", "url": "https://...", "domain": "exempel.se", "sourceType": "news | review | blog | forum | social | official" }
  ]
}`
      }
    case 'enrichment':
    default:
      return {
        focusInstructions: `Syfte: auto-fylla formulärfält i ett värderings-/listingflöde.
Fokusera på hårda fakta som omsättning, anställda, USP:er, kontaktinfo.`,
        schema: `{
  "autoFill": {
    "companyName": "Namnet om hittat eller null",
    "industry": "kort label eller null",
    "website": "https://... eller null",
    "employees": "intervall 1-5, 6-10, 11-25, 25+ eller null",
    "address": "postadress om hittat",
    "exactRevenue": "siffror i SEK som sträng eller null",
    "revenue": "fallback sträng",
    "profit": "senaste vinst i SEK som sträng eller null",
    "totalAssets": "sträng eller null",
    "operatingCosts": "sträng eller null",
    "competitiveAdvantage": "1-2 meningar",
    "customerBase": "1 mening",
    "services": "kort lista",
    "locations": "huvudorter"
  },
  "rawWebData": {
    "mainWebsite": "använd URL om hämtad",
    "notableSources": [
      { "label": "källa", "url": "https://...", "domain": "exempel.se", "sourceType": "news | review | blog | forum | social | official" }
    ],
    "notes": "kort teknisk kommentar"
  }
}`
      }
    case 'analysis':
      return {
        focusInstructions: `Syfte: samla bred webbinformation inför en AI-analys av bolaget.
Fokusera på fakta om affärsmodell, kunder, tillväxt, risker, nyckeltal och nyheter.
Bygg även en enkel tidsserie över branschens utveckling och uppskatta en värdepåverkansprofil för drivkrafter/risker.`,
        schema: `{
  "companyProfile": {
    "description": "Kort beskrivning av verksamheten",
    "industry": "Bransch",
    "customers": "Huvudkundsegment",
    "valueProp": "Huvudvärdeerbjudande",
    "locations": ["plats 1", "plats 2"],
    "estimatedEmployees": "intervall eller null"
  },
  "marketSignals": ["signal 1", "signal 2"],
  "growthNotes": ["tillväxtsignal 1"],
  "riskNotes": ["risk 1"],
  "notableActivities": ["projekt, expansioner, affärer"],
  "sources": [
    { "title": "Källa", "url": "https://...", "domain": "exempel.se", "sourceType": "news | review | blog | forum | social | official", "snippet": "kort citat" }
  ],
  "industryTrend": [
    {
      "label": "År eller period",
      "year": 2020,
      "value": 130.5,
      "unit": "MSEK",
      "growthNote": "kort kommentar",
      "domain": "exempel.se",
      "sourceType": "news | report | official",
      "sourceUrl": "https://..."
    }
  ],
  "companyTrend": [
    {
      "label": "År eller period",
      "year": 2020,
      "value": 12.4,
      "unit": "MSEK",
      "note": "kort kommentar",
      "domain": "exempel.se",
      "sourceType": "official | report | news",
      "sourceUrl": "https://..."
    }
  ],
  "valueDrivers": [
    {
      "label": "Driver",
      "direction": "positive",
      "impactMin": 3,
      "impactMax": 5,
      "impactUnit": "MSEK",
      "rationale": "kort förklaring",
      "domain": "exempel.se",
      "sourceType": "news | report | official",
      "sourceUrl": "https://..."
    }
  ],
  "riskDrivers": [
    {
      "label": "Risk",
      "direction": "negative",
      "impactMin": -2,
      "impactMax": -1,
      "impactUnit": "MSEK",
      "rationale": "kort förklaring",
      "domain": "exempel.se",
      "sourceType": "news | report | official",
      "sourceUrl": "https://..."
    }
  ]
}`
      }
  }
}

type CompanySearchOptions = {
  companyName: string
  orgNumber?: string
  website?: string
  industry?: string
}

export async function searchCompanyWithWebSearch(options: CompanySearchOptions) {
  return fetchWebInsights({
    companyName: options.companyName,
    orgNumber: options.orgNumber,
    website: options.website,
    industry: options.industry,
    focus: 'analysis'
  })
}

