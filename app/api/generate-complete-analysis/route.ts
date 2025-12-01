import { NextResponse } from 'next/server'
import { callOpenAIResponses, OpenAIResponseError } from '@/lib/openai-response-utils'

export async function POST(request: Request) {
  try {
    const { companyData } = await request.json()

    if (!companyData) {
      return NextResponse.json(
        { error: 'Företagsdata krävs' },
        { status: 400 }
      )
    }

    console.log('[COMPLETE-ANALYSIS] Starting comprehensive analysis generation')

    const prompt = buildAnalysisPrompt(companyData)

    const { text } = await callOpenAIResponses({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Du är en senior svensk M&A-rådgivare med 20+ års erfarenhet av att hjälpa företagsägare att förbereda och genomföra företagsförsäljningar.

${companyData.industry ? `Du är SPECIALIST på försäljning av företag inom branschen "${companyData.industry.label}". 
Du förstår de specifika värdedrivare, risker och branschmultiplar som gäller för denna bransch.
Anpassa ALL din analys och alla rekommendationer till branschens särdrag.` : ''}

Din uppgift är att skapa en omfattande, professionell analys som kan användas som underlag för en företagsförsäljning. Rapporten ska vara:

1. KONKRET - Baserad på den specifika information som tillhandahållits
2. PROFESSIONELL - Skriven som om den kommer från en etablerad M&A-rådgivare
3. ÄRLIG - Identifiera både styrkor och svagheter ärligt
4. HANDLINGSORIENTERAD - Ge konkreta rekommendationer
5. UTFÖRLIG - Varje sektion ska vara välskriven och informativ
${companyData.industry ? `6. BRANSCHSPECIFIK - Anpassad till branschen ${companyData.industry.label}` : ''}

Skriv alltid på flytande svenska. Använd professionellt affärsspråk men undvik onödig jargong.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      reasoning: {
        effort: 'high'
      },
      textVerbosity: 'high',
      metadata: {
        feature: 'complete-sales-analysis'
      },
      responseFormat: { type: 'json_object' }
    })

    const analysis = JSON.parse(text || '{}')
    console.log('[COMPLETE-ANALYSIS] Analysis generated successfully')

    return NextResponse.json({
      success: true,
      analysis
    })
  } catch (error) {
    if (error instanceof OpenAIResponseError) {
      console.error('[COMPLETE-ANALYSIS] OpenAI error:', error.status, error.body)
    } else {
      console.error('[COMPLETE-ANALYSIS] Error:', error)
    }
    
    return NextResponse.json(
      { error: 'Ett fel uppstod vid generering av analys' },
      { status: 500 }
    )
  }
}

function buildAnalysisPrompt(companyData: any): string {
  const companyName = companyData.companyName || companyData.scrapedData?.title || 'Företaget'
  const industryInfo = companyData.industry 
    ? `
BRANSCH: ${companyData.industry.label}
BRANSCH-ID: ${companyData.industry.id}

OBS: Anpassa hela analysen till denna specifika bransch. Använd relevanta branschmultiplar, 
identifiera branschspecifika risker och värdedrivare, och ge branschanpassade rekommendationer.`
    : ''
  
  return `Skapa en omfattande försäljningsförberedande analys för följande företag.

=== FÖRETAGSINFORMATION ===
Företagsnamn: ${companyName}
Webbplats: ${companyData.websiteUrl || 'Ej angiven'}
Organisationsnummer: ${companyData.orgNumber || 'Ej angivet'}${industryInfo}

${companyData.scrapedData ? `
FRÅN WEBBSKRAPNING:
Titel: ${companyData.scrapedData.title || 'Ej tillgänglig'}
Beskrivning: ${companyData.scrapedData.description || 'Ej tillgänglig'}
Nyckelord: ${companyData.scrapedData.highlights?.join(', ') || 'Inga'}
Kontakt: ${companyData.scrapedData.contact?.emails?.join(', ') || 'Ej tillgänglig'}
` : ''}

=== FINANSIELL DOKUMENTATION ===
Omsättning (3 år): ${companyData.financialDocs?.revenue3Years || 'Ej angivet'}
Resultat (3 år): ${companyData.financialDocs?.profit3Years || 'Ej angivet'}
Reviderade årsredovisningar: ${companyData.financialDocs?.hasAuditedReports ? 'Ja' : 'Nej'}
Månadsrapporter: ${companyData.financialDocs?.hasMonthlyReports ? 'Ja' : 'Nej'}
Budget/prognoser: ${companyData.financialDocs?.budgetAvailable ? 'Ja' : 'Nej'}
Prognosår: ${companyData.financialDocs?.forecastYears || 'Ej angivet'}
EBITDA-justeringar: ${companyData.financialDocs?.ebitdaNotes || 'Inga'}
Engångsposter: ${companyData.financialDocs?.oneTimeItems || 'Inga'}

TIDIGARE SAMMANFATTNING: ${companyData.generatedSummaries?.financialDocs || 'Ingen'}

=== AFFÄRSRELATIONER ===
Största kunder:
${companyData.businessRelations?.topCustomers?.filter((c: any) => c.name).map((c: any) => `- ${c.name}: ${c.percentage}%`).join('\n') || 'Inga angivna'}

Kundkoncentrationsrisk: ${companyData.businessRelations?.customerConcentrationRisk || 'Ej bedömd'}
Viktiga leverantörer: ${companyData.businessRelations?.keySuppliers || 'Ej angivet'}
Exklusivitetsavtal: ${companyData.businessRelations?.exclusivityAgreements || 'Inga'}
Informella överenskommelser: ${companyData.businessRelations?.informalAgreements || 'Inga'}

TIDIGARE SAMMANFATTNING: ${companyData.generatedSummaries?.businessRelations || 'Ingen'}

=== NYCKELPERSONBEROENDE ===
Ägarens involvering: ${companyData.keyPerson?.ownerInvolvement || 'Ej bedömd'}
Dokumenterade processer: ${companyData.keyPerson?.documentedProcesses ? 'Ja' : 'Nej'}
Backup-personer: ${companyData.keyPerson?.backupPersons ? 'Ja' : 'Nej'}
Ledningsgrupp: ${companyData.keyPerson?.managementTeam || 'Ej beskriven'}
Övergångsplan: ${companyData.keyPerson?.transitionPlan || 'Ej beskriven'}

TIDIGARE SAMMANFATTNING: ${companyData.generatedSummaries?.keyPerson || 'Ingen'}

=== BALANSRÄKNING ===
Lån till ägare/närstående: ${companyData.balanceSheet?.loansToOwners || 'Inga'}
Icke-operativa tillgångar: ${companyData.balanceSheet?.nonOperatingAssets || 'Inga'}
Lagerstatus: ${companyData.balanceSheet?.inventoryStatus || 'Ej beskriven'}
Kundfordringar: ${companyData.balanceSheet?.receivablesStatus || 'Ej beskrivet'}
Skulder att reglera: ${companyData.balanceSheet?.liabilitiesToClean || 'Inga'}

TIDIGARE SAMMANFATTNING: ${companyData.generatedSummaries?.balanceSheet || 'Ingen'}

=== JURIDISK DOKUMENTATION ===
Bolagsordning uppdaterad: ${companyData.legalDocs?.articlesOfAssociationUpdated ? 'Ja' : 'Nej'}
Aktiebok komplett: ${companyData.legalDocs?.shareRegisterComplete ? 'Ja' : 'Nej'}
Styrelsebeslut arkiverade: ${companyData.legalDocs?.boardMinutesArchived ? 'Ja' : 'Nej'}
Ägaravtal granskade: ${companyData.legalDocs?.ownerAgreementsReviewed ? 'Ja' : 'Nej'}
Tillstånd verifierade: ${companyData.legalDocs?.permitsVerified ? 'Ja' : 'Nej'}
Pågående juridiska frågor: ${companyData.legalDocs?.pendingLegalIssues || 'Inga'}

TIDIGARE SAMMANFATTNING: ${companyData.generatedSummaries?.legalDocs || 'Ingen'}

=== INSTRUKTIONER ===
Skapa en omfattande analys i JSON-format. Varje textsektion ska vara MINST 3-4 meningar, gärna längre.
Basera ALL analys på den faktiska information som tillhandahållits - hitta inte på saker.
Var ärlig om brister men konstruktiv i dina rekommendationer.

Returnera följande JSON-struktur:

{
  "executiveSummary": "En övergripande sammanfattning på 4-6 meningar som beskriver företagets nuvarande läge inför försäljning, de viktigaste styrkorna och de mest prioriterade åtgärderna.",
  
  "companyOverview": "En utförlig beskrivning av företaget baserat på tillgänglig information. 4-6 meningar om verksamheten, marknaden och positionen.",
  
  "financialAnalysis": "En djupgående analys av den finansiella situationen. Kommentera historik, dokumentation, och beredskap för due diligence. 5-7 meningar.",
  
  "businessRelationsAnalysis": "Analys av kundbasen och leverantörsrelationer. Diskutera koncentrationsrisker, avtalssituation och stabilitet. 4-6 meningar.",
  
  "keyPersonAnalysis": "Bedömning av nyckelpersonberoendet och organisationens mognad. Diskutera risker och åtgärder. 4-6 meningar.",
  
  "balanceSheetAnalysis": "Analys av balansräkningens skick och vad som behöver åtgärdas före försäljning. 4-6 meningar.",
  
  "legalAnalysis": "Bedömning av juridisk beredskap och dokumentationsstatus. Identifiera luckor. 4-6 meningar.",
  
  "riskAssessment": {
    "overall": "low/medium/high baserat på helhetsbilden",
    "financialRisk": 0-100,
    "operationalRisk": 0-100,
    "keyPersonRisk": 0-100,
    "customerRisk": 0-100,
    "legalRisk": 0-100
  },
  
  "strengths": [
    "Styrka 1 - konkret baserad på datan",
    "Styrka 2",
    "Styrka 3",
    "Styrka 4",
    "Styrka 5"
  ],
  
  "weaknesses": [
    "Förbättringsområde 1 - konkret baserad på datan",
    "Förbättringsområde 2",
    "Förbättringsområde 3",
    "Förbättringsområde 4"
  ],
  
  "recommendations": [
    "Prioriterad åtgärd 1 med förklaring",
    "Prioriterad åtgärd 2 med förklaring",
    "Prioriterad åtgärd 3 med förklaring",
    "Prioriterad åtgärd 4 med förklaring",
    "Prioriterad åtgärd 5 med förklaring"
  ],
  
  "nextSteps": [
    "Nästa steg 1 i försäljningsprocessen",
    "Nästa steg 2",
    "Nästa steg 3",
    "Nästa steg 4",
    "Nästa steg 5"
  ],
  
  "valuationFactors": "En sammanfattning på 4-6 meningar om faktorer som påverkar företagets värdering positivt och negativt baserat på analysen.",
  
  "industrySpecific": {
    "typicalMultiples": "Typiska värderingsmultiplar för branschen (t.ex. 3-5x EBITDA, 1x omsättning)",
    "keyValueDrivers": ["Branschspecifik värdedrivare 1", "Värdedrivare 2", "Värdedrivare 3"],
    "commonRisks": ["Branschspecifik risk 1", "Risk 2", "Risk 3"],
    "buyerTypes": "Vilka typer av köpare som typiskt är intresserade av denna typ av bolag",
    "dueDiligenceFocus": ["DD-fokusområde 1 för branschen", "Fokusområde 2", "Fokusområde 3"]
  }
}`
}

