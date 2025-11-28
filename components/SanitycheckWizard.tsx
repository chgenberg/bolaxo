'use client'

import { useState, useMemo, useCallback } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Building2,
  Users,
  BarChart3,
  TrendingUp,
  Target,
  Briefcase,
  Settings,
  Shield,
  Sparkles,
  FileText,
  Check,
  Loader2,
  Download,
  AlertTriangle,
  X,
  ChevronDown
} from 'lucide-react'
import { INDUSTRIES } from './IndustrySelectorModal'

// Types
export interface SanitycheckState {
  // Step 1 - Bolagsöversikt & syfte
  companyName: string
  orgNumber: string
  website: string
  industry: string
  whySell: string
  whySellReasons: string[]
  strategyScale: string
  hasPitchdeck: string
  // Step 2 - Ägarberoende & ledning
  ownerIndependent: string
  ownerIndependentComment: string
  leadershipScale: string
  leadershipComment: string
  transferPlanScale: string
  keypersonList: string
  ownerComment: string
  // Step 3 - Intäkter & affärsmodell
  recurringPercent: string
  mainProductShare: string
  otherProductShare: string
  pricingText: string
  revenueDocs: string
  // Step 4 - Lönsamhet & kassaflöde
  ebitdaStabilityScale: string
  cashflowMatchScale: string
  workingCapitalScale: string
  debtComment: string
  financialDocs: string
  // Step 5 - Kundbas & marknad
  concentrationPercent: string
  stabilityPercent: string
  marketPositionText: string
  marketGrowthScale: string
  marketGrowthComment: string
  customerDocs: string
  // Step 6 - Team & organisation
  orgStructureScale: string
  personnelDataCorrect: string
  cultureText: string
  growthReadyScale: string
  hrDocs: string
  // Step 7 - Processer & system
  processDocScale: string
  processDocComment: string
  systemLandscapeScale: string
  systemLandscapeComment: string
  integrationScale: string
  bottlenecks: string
  bottlenecksComment: string
  processDocs: string
  // Step 8 - Risk & compliance
  creditIssues: string
  disputes: string
  policiesScale: string
  riskSummaryText: string
  riskDocs: string
  // Step 9 - Tillväxt & potential
  growthInitiativesText: string
  unusedCapacity: string
  scalabilityScale: string
  competitionText: string
  growthDocs: string
  // Step 10 - Försäljningsberedskap
  dataroomReadyScale: string
  reportingQualityScale: string
  equityStoryScale: string
  timingScale: string
  saleMaterialDocs: string
  // Step 12 - Uppgradering
  upgradeChoice: string
  upgradeComment: string
}

interface AnalysisResult {
  score: number
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  valuationRange: {
    min: number
    max: number
    multipleMin: number
    multipleMax: number
    basis: string
  }
  summary: string
  recommendations: string[]
  pitchdeckSlides: string[]
}

// Demo analysis result for investor presentations
const DEMO_ANALYSIS_RESULT: AnalysisResult = {
  score: 72,
  swot: {
    strengths: [
      "Stark återkommande intäktsmodell med hög kundlojalitet",
      "Erfaren ledningsgrupp med tydlig rollfördelning",
      "Dokumenterade processer och moderna system",
      "God lönsamhet med stabilt kassaflöde"
    ],
    weaknesses: [
      "Viss kundkoncentration på de tre största kunderna",
      "Beroende av nuvarande VD för kundrelationer",
      "Behov av uppdaterad teknisk dokumentation"
    ],
    opportunities: [
      "Stark marknadstillväxt inom segmentet",
      "Möjlighet till geografisk expansion",
      "Potential för produktutveckling och nya tjänster",
      "Synergieffekter vid strategiskt förvärv"
    ],
    threats: [
      "Ökande konkurrens från större aktörer",
      "Konjunkturkänslighet i kundsegmentet",
      "Regulatoriska förändringar kan påverka branschen"
    ]
  },
  valuationRange: {
    min: 25,
    max: 40,
    multipleMin: 4.5,
    multipleMax: 7.0,
    basis: "Baserat på branschspecifika multiplar för SaaS/tjänsteföretag med god tillväxt och stabil lönsamhet. Värderingen tar hänsyn till återkommande intäkter, kundkoncentration och ägaroberoende."
  },
  summary: "Bolaget visar god säljberedskap med starka återkommande intäkter och en erfaren organisation. Vissa förbättringsområden finns kring dokumentation och kundkoncentration som kan adresseras för att maximera värdet.",
  recommendations: [
    "Dokumentera överlämningsplan för VD-funktionen",
    "Diversifiera kundbasen för att minska koncentrationsrisk",
    "Uppdatera teknisk dokumentation och systemlandskap",
    "Förbered datarum med finansiella rapporter och kundavtal",
    "Utveckla en tydlig equity story och tillväxtplan"
  ],
  pitchdeckSlides: [
    "Executive Summary",
    "Marknad & Position",
    "Affärsmodell",
    "Finansiell historik",
    "Tillväxtstrategi",
    "Team & Organisation",
    "Investment Highlights"
  ]
}

const stepMeta = [
  { id: 1, title: "Bolagsöversikt & syfte", icon: Building2 },
  { id: 2, title: "Ägarberoende & ledning", icon: Users },
  { id: 3, title: "Intäkter & affärsmodell", icon: BarChart3 },
  { id: 4, title: "Lönsamhet & kassaflöde", icon: TrendingUp },
  { id: 5, title: "Kundbas & marknad", icon: Target },
  { id: 6, title: "Team & organisation", icon: Briefcase },
  { id: 7, title: "Processer & system", icon: Settings },
  { id: 8, title: "Risk & compliance", icon: Shield },
  { id: 9, title: "Tillväxt & potential", icon: Sparkles },
  { id: 10, title: "Försäljningsberedskap", icon: FileText },
  { id: 11, title: "Sammanfattning & resultat", icon: BarChart3 },
  { id: 12, title: "Uppgradering & nästa steg", icon: TrendingUp }
]

const whySellOptions = [
  "Generationsskifte / succession",
  "Söker tillväxtpartner",
  "Vill göra exit",
  "Vill frigöra tid/kapital",
  "Strategisk avyttring",
  "Annat"
]

const scaleOptions = ["1", "2", "3", "4", "5"]

const initialState: SanitycheckState = {
  companyName: "",
  orgNumber: "",
  website: "",
  industry: "",
  whySell: "",
  whySellReasons: [],
  strategyScale: "",
  hasPitchdeck: "",
  ownerIndependent: "",
  ownerIndependentComment: "",
  leadershipScale: "",
  leadershipComment: "",
  transferPlanScale: "",
  keypersonList: "",
  ownerComment: "",
  recurringPercent: "",
  mainProductShare: "",
  otherProductShare: "",
  pricingText: "",
  revenueDocs: "",
  ebitdaStabilityScale: "",
  cashflowMatchScale: "",
  workingCapitalScale: "",
  debtComment: "",
  financialDocs: "",
  concentrationPercent: "",
  stabilityPercent: "",
  marketPositionText: "",
  marketGrowthScale: "",
  marketGrowthComment: "",
  customerDocs: "",
  orgStructureScale: "",
  personnelDataCorrect: "",
  cultureText: "",
  growthReadyScale: "",
  hrDocs: "",
  processDocScale: "",
  processDocComment: "",
  systemLandscapeScale: "",
  systemLandscapeComment: "",
  integrationScale: "",
  bottlenecks: "",
  bottlenecksComment: "",
  processDocs: "",
  creditIssues: "",
  disputes: "",
  policiesScale: "",
  riskSummaryText: "",
  riskDocs: "",
  growthInitiativesText: "",
  unusedCapacity: "",
  scalabilityScale: "",
  competitionText: "",
  growthDocs: "",
  dataroomReadyScale: "",
  reportingQualityScale: "",
  equityStoryScale: "",
  timingScale: "",
  saleMaterialDocs: "",
  upgradeChoice: "",
  upgradeComment: ""
}

function isStepComplete(state: SanitycheckState, stepId: number): boolean {
  switch (stepId) {
    case 1:
      return !!(state.companyName && state.orgNumber && state.whySell.length >= 10 && state.strategyScale)
    case 2:
      return !!(state.ownerIndependent && state.leadershipScale && state.transferPlanScale)
    case 3:
      return !!(state.recurringPercent && state.mainProductShare && state.pricingText.length >= 10)
    case 4:
      return !!(state.ebitdaStabilityScale && state.cashflowMatchScale && state.workingCapitalScale && state.debtComment.length >= 5)
    case 5:
      return !!(state.concentrationPercent && state.stabilityPercent && state.marketPositionText.length >= 10 && state.marketGrowthScale)
    case 6:
      return !!(state.orgStructureScale && state.personnelDataCorrect && state.growthReadyScale)
    case 7:
      return !!(state.processDocScale && state.systemLandscapeScale && state.integrationScale && state.bottlenecks)
    case 8:
      return !!(state.creditIssues && state.disputes && state.policiesScale && state.riskSummaryText.length >= 10)
    case 9:
      return !!(state.growthInitiativesText.length >= 10 && state.unusedCapacity && state.scalabilityScale && state.competitionText.length >= 10)
    case 10:
      return !!(state.dataroomReadyScale && state.reportingQualityScale && state.equityStoryScale && state.timingScale)
    case 11:
      // Step 11 is complete when steps 1-10 are complete
      return [1,2,3,4,5,6,7,8,9,10].every(id => isStepComplete(state, id))
    case 12:
      return !!state.upgradeChoice
    default:
      return false
  }
}

interface SanitycheckWizardProps {
  onComplete?: (data: SanitycheckState, result: AnalysisResult) => void
}

export default function SanitycheckWizard({ onComplete }: SanitycheckWizardProps) {
  const [state, setState] = useState<SanitycheckState>(initialState)
  const [activeStep, setActiveStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [showIndustryModal, setShowIndustryModal] = useState(false)

  const completionMap = useMemo(() => {
    const map: Record<number, boolean> = {}
    stepMeta.forEach(step => {
      map[step.id] = isStepComplete(state, step.id)
    })
    return map
  }, [state])

  const completedCount = useMemo(
    () => Object.values(completionMap).filter(Boolean).length,
    [completionMap]
  )

  const mainStepsComplete = useMemo(
    () => [1,2,3,4,5,6,7,8,9,10].filter(id => completionMap[id]).length,
    [completionMap]
  )

  const readinessPercent = Math.round((mainStepsComplete / 10) * 100)

  const updateField = (field: keyof SanitycheckState, value: string | string[]) => {
    setState(prev => ({ ...prev, [field]: value }))
  }

  const toggleMultiSelect = (field: keyof SanitycheckState, option: string) => {
    setState(prev => {
      const current = (prev[field] as string[]) || []
      if (current.includes(option)) {
        return { ...prev, [field]: current.filter(o => o !== option) }
      }
      return { ...prev, [field]: [...current, option] }
    })
  }

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const res = await fetch('/api/sanitycheck-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      })
      
      if (!res.ok) {
        throw new Error('Analysen misslyckades')
      }
      
      const result = await res.json()
      setAnalysisResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod')
    } finally {
      setIsAnalyzing(false)
    }
  }, [state])

  const generatePdf = useCallback(async () => {
    if (!analysisResult) return
    
    setIsGeneratingPdf(true)
    
    // Use demo data if no company name is provided
    const companyName = state.companyName || 'Exempelföretag AB'
    const orgNumber = state.orgNumber || '556123-4567'
    const industry = state.industry || 'Teknologi / SaaS'
    const website = state.website || 'www.exempel.se'
    
    try {
      const res = await fetch('/api/sanitycheck-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          orgNumber,
          industry,
          website,
          analysisResult,
          formData: state
        })
      })
      
      if (!res.ok) {
        throw new Error('PDF-genereringen misslyckades')
      }
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sanitycheck-${companyName.replace(/[^a-zA-Z0-9åäöÅÄÖ\s]/g, '').replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte generera PDF')
    } finally {
      setIsGeneratingPdf(false)
    }
  }, [analysisResult, state])

  const goNext = async () => {
    if (activeStep === 10 && !analysisResult) {
      await runAnalysis()
    }
    setActiveStep(s => Math.min(stepMeta.length, s + 1))
  }

  const goPrev = () => {
    setActiveStep(s => Math.max(1, s - 1))
  }

  const renderScalePills = (field: keyof SanitycheckState, label: string) => (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {scaleOptions.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => updateField(field, opt)}
            className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
              state[field] === opt
                ? 'bg-white text-navy'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/50 mt-2">1 = Lågt/Nej, 5 = Högt/Ja</p>
    </div>
  )

  const renderYesNo = (field: keyof SanitycheckState, label: string) => (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-3">{label}</label>
      <div className="flex gap-3">
        {["Ja", "Nej"].map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => updateField(field, opt)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              state[field] === opt
                ? 'bg-white text-navy'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">1. Bolagsöversikt & syfte</h2>
              <p className="text-white/70">Grundläggande bild av bolaget, nyckeltal och varför ni överväger en försäljning.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Bolagsnamn *</label>
                <input
                  type="text"
                  value={state.companyName}
                  onChange={e => updateField("companyName", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Företag AB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Organisationsnummer *</label>
                <input
                  type="text"
                  value={state.orgNumber}
                  onChange={e => updateField("orgNumber", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="556XXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Hemsida</label>
                <input
                  type="text"
                  value={state.website}
                  onChange={e => updateField("website", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Bransch</label>
                <button
                  type="button"
                  onClick={() => setShowIndustryModal(true)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-left text-white focus:outline-none focus:border-white/40 transition-colors flex items-center justify-between hover:bg-white/15"
                >
                  <span className={state.industry ? 'text-white' : 'text-white/40'}>
                    {state.industry || 'Välj bransch...'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Kort om varför ni överväger att sälja *</label>
              <textarea
                value={state.whySell}
                onChange={e => updateField("whySell", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
                placeholder="Beskriv bakgrunden till att ni överväger en försäljning..."
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {whySellOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleMultiSelect("whySellReasons", opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      state.whySellReasons.includes(opt)
                        ? 'bg-white text-navy'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {renderScalePills("strategyScale", "Hur tydlig är bolagets strategi kommande 3 år? *")}
              {renderYesNo("hasPitchdeck", "Har ni redan en bolagspresentation eller pitchdeck?")}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">2. Ägarberoende & ledning</h2>
              <p className="text-white/70">Hur beroende är verksamheten av nuvarande ägare och nyckelpersoner?</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {renderYesNo("ownerIndependent", "Bolaget kan fungera i vardagen utan nuvarande ägare *")}
                <label className="block text-sm font-medium text-white/80 mb-2 mt-4">Kommentar (valfritt)</label>
                <textarea
                  value={state.ownerIndependentComment}
                  onChange={e => updateField("ownerIndependentComment", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[80px]"
                />
              </div>
              <div>
                {renderScalePills("leadershipScale", "Formellt definierat ledningsteam (roller, ansvar) *")}
                <label className="block text-sm font-medium text-white/80 mb-2 mt-4">Kommentar (valfritt)</label>
                <textarea
                  value={state.leadershipComment}
                  onChange={e => updateField("leadershipComment", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[80px]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {renderScalePills("transferPlanScale", "Plan för överlämning av kompetens och ansvar *")}
              {renderYesNo("keypersonList", "Lista över nyckelpersoner (roller, ansvar) är framtagen")}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Kommentar kring sårbarheter kopplat till ägare/nyckelpersoner</label>
              <textarea
                value={state.ownerComment}
                onChange={e => updateField("ownerComment", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[80px]"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">3. Intäkter & affärsmodell</h2>
              <p className="text-white/70">Hur bolaget tjänar pengar och hur stabila intäkterna är över tid.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Andel återkommande intäkter (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={state.recurringPercent}
                  onChange={e => updateField("recurringPercent", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="0-100"
                />
                <p className="text-xs text-white/50 mt-1">Andel av omsättning som är återkommande (avtal/abonnemang)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Andel från huvudprodukter/tjänster (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={state.mainProductShare}
                  onChange={e => updateField("mainProductShare", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="0-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Andel från övriga produkter/tjänster (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={state.otherProductShare}
                  onChange={e => updateField("otherProductShare", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="0-100"
                />
              </div>
              {renderYesNo("revenueDocs", "Underlag för intäktsfördelning är framtaget")}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Beskrivning av prissättningsmodell *</label>
              <textarea
                value={state.pricingText}
                onChange={e => updateField("pricingText", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
                placeholder="Beskriv hur ni prissätter era produkter/tjänster (fast pris, abonnemang, usage-based, etc.)"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">4. Lönsamhet & kassaflöde</h2>
              <p className="text-white/70">Lönsamhet, kassaflöde och rörelsekapital ur en köpares perspektiv.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {renderScalePills("ebitdaStabilityScale", "Stabilitet i EBITDA de senaste 3 åren *")}
              {renderScalePills("cashflowMatchScale", "Hur väl speglar kassaflödet lönsamheten? *")}
              {renderScalePills("workingCapitalScale", "Rörelsekapitalnivå i förhållande till omsättning *")}
              {renderYesNo("financialDocs", "Bokslut, månadsrapporter och prognoser är sammanställda")}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Kommentar kring lån, skulder och eventuella covenants *</label>
              <textarea
                value={state.debtComment}
                onChange={e => updateField("debtComment", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">5. Kundbas & marknad</h2>
              <p className="text-white/70">Kundbas, kundkoncentration och marknadsposition.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Kundkoncentration - andel på toppkunder (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={state.concentrationPercent}
                  onChange={e => updateField("concentrationPercent", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Kundstabilitet - andel återkommande kunder (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={state.stabilityPercent}
                  onChange={e => updateField("stabilityPercent", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Beskriv er marknadsposition *</label>
              <textarea
                value={state.marketPositionText}
                onChange={e => updateField("marketPositionText", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
                placeholder="Nisch, lokal/regional/nationell, konkurrenter, etc."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {renderScalePills("marketGrowthScale", "Marknadens tillväxttakt och framtidsutsikter *")}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Motivering</label>
                <textarea
                  value={state.marketGrowthComment}
                  onChange={e => updateField("marketGrowthComment", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[80px]"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">6. Team & organisation</h2>
              <p className="text-white/70">Organisation, kultur och hur skalbar verksamheten är.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {renderScalePills("orgStructureScale", "Tydlig organisationsstruktur (roller, rapportering) *")}
              {renderYesNo("personnelDataCorrect", "Personaldata (antal, roller) är uppdaterad och korrekt *")}
              {renderScalePills("growthReadyScale", "Hur väl rustad är organisationen för att växa? *")}
              {renderYesNo("hrDocs", "Nyckelavtal (anställning, incitamentsprogram) är sammanställda")}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Hur skulle ni beskriva bolagets kultur och engagemang?</label>
              <textarea
                value={state.cultureText}
                onChange={e => updateField("cultureText", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
              />
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">7. Processer & system</h2>
              <p className="text-white/70">Kärnprocesser och hur väl systemen stödjer affären.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {renderScalePills("processDocScale", "Kärnprocesser är dokumenterade *")}
                <textarea
                  value={state.processDocComment}
                  onChange={e => updateField("processDocComment", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[60px] mt-3"
                  placeholder="Kommentar..."
                />
              </div>
              <div>
                {renderScalePills("systemLandscapeScale", "Systemlandskap (ERP, CRM, etc.) *")}
                <textarea
                  value={state.systemLandscapeComment}
                  onChange={e => updateField("systemLandscapeComment", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[60px] mt-3"
                  placeholder="Kommentar..."
                />
              </div>
              {renderScalePills("integrationScale", "Hur väl integrerade är systemen? *")}
              <div>
                {renderYesNo("bottlenecks", "Finns flaskhalsar som begränsar tillväxt/marginaler? *")}
                <textarea
                  value={state.bottlenecksComment}
                  onChange={e => updateField("bottlenecksComment", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[60px] mt-3"
                  placeholder="Beskriv eventuella flaskhalsar..."
                />
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">8. Risk & compliance</h2>
              <p className="text-white/70">Juridisk, finansiell och operativ risk.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Finns betalningsanmärkningar/skulder? *</label>
                <div className="flex gap-3">
                  {["Ja", "Nej", "Vet ej"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField("creditIssues", opt)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        state.creditIssues === opt
                          ? 'bg-white text-navy'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {renderYesNo("disputes", "Finns kända tvister eller konflikter? *")}
              {renderScalePills("policiesScale", "Dokumenterade policyer (GDPR, säkerhet, AML) *")}
              {renderYesNo("riskDocs", "Risk- eller revisionsrapporter är sammanställda")}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Sammanfattning av de viktigaste riskerna *</label>
              <textarea
                value={state.riskSummaryText}
                onChange={e => updateField("riskSummaryText", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
              />
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">9. Tillväxt & potential</h2>
              <p className="text-white/70">Vilken potential en framtida köpare kan se.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Vilka 2-3 viktigaste tillväxtinitiativ ser ni framåt? *</label>
              <textarea
                value={state.growthInitiativesText}
                onChange={e => updateField("growthInitiativesText", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
                placeholder="Nya produkter, marknader, partnerskap, etc."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {renderYesNo("unusedCapacity", "Finns outnyttjad kapacitet som kan utnyttjas? *")}
              {renderScalePills("scalabilityScale", "Hur skalbar är affärsmodellen vid ökad volym? *")}
              {renderYesNo("growthDocs", "Strategidokument eller tillväxtplaner är framtagna")}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Konkurrenssituation – vad gör er unika? *</label>
              <textarea
                value={state.competitionText}
                onChange={e => updateField("competitionText", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
              />
            </div>
          </div>
        )

      case 10:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">10. Försäljningsberedskap</h2>
              <p className="text-white/70">Hur redo bolaget är att gå in i en strukturerad process.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {renderScalePills("dataroomReadyScale", "Hur nära är ni ett färdigt datarum? *")}
              {renderScalePills("reportingQualityScale", "Kvalitet på rapportering (KPI:er, dashboards) *")}
              {renderScalePills("equityStoryScale", "Hur tydlig är er 'equity story'? *")}
              {renderScalePills("timingScale", "Är timing rätt för er (ägare, bolag, marknad)? *")}
            </div>

            <div>
              {renderYesNo("saleMaterialDocs", "Övrigt material för pitchdeck/teaser är framtaget")}
            </div>

            {mainStepsComplete === 10 && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 mt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Alla steg är ifyllda! Klicka på "Nästa steg" för att se din analys.</span>
                </div>
              </div>
            )}
          </div>
        )

      case 11:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">11. Sammanfattning & resultat</h2>
              <p className="text-white/70">Investeraranpassat sammandrag baserat på dina svar.</p>
            </div>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                <p className="text-white/80 text-lg">Analyserar ditt bolag med AI...</p>
                <p className="text-white/60 text-sm mt-2">Detta kan ta upp till 30 sekunder</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 text-red-300">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={runAnalysis}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Försök igen
                </button>
              </div>
            ) : analysisResult ? (
              <>
                {/* Readiness Score */}
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Samlad säljberedskap</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg className="transform -rotate-90 w-24 h-24">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white/10"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (analysisResult.score / 100) * 251.2}
                          className="text-emerald-400"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                        {analysisResult.score}
                      </span>
                    </div>
                    <div>
                      <p className="text-white/80">{analysisResult.summary}</p>
                    </div>
                  </div>
                </div>

                {/* SWOT */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">SWOT-analys</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
                      <h4 className="font-semibold text-emerald-300 mb-2">Styrkor</h4>
                      <ul className="space-y-1">
                        {analysisResult.swot.strengths.map((s, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
                      <h4 className="font-semibold text-amber-300 mb-2">Svagheter</h4>
                      <ul className="space-y-1">
                        {analysisResult.swot.weaknesses.map((w, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-300 mb-2">Möjligheter</h4>
                      <ul className="space-y-1">
                        {analysisResult.swot.opportunities.map((o, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                      <h4 className="font-semibold text-red-300 mb-2">Hot</h4>
                      <ul className="space-y-1">
                        {analysisResult.swot.threats.map((t, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                            <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Valuation Range */}
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Indikativt värderingsspann</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-navy rounded-xl px-6 py-4 text-center">
                      <p className="text-white/60 text-sm">Spann</p>
                      <p className="text-2xl font-bold text-white">
                        {analysisResult.valuationRange.min}–{analysisResult.valuationRange.max} MSEK
                      </p>
                    </div>
                    <div className="bg-navy rounded-xl px-6 py-4 text-center">
                      <p className="text-white/60 text-sm">Multipel</p>
                      <p className="text-2xl font-bold text-white">
                        {analysisResult.valuationRange.multipleMin}–{analysisResult.valuationRange.multipleMax}× EBITDA
                      </p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">{analysisResult.valuationRange.basis}</p>
                </div>

                {/* Recommendations */}
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Rekommendationer</h3>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pitchdeck Preview */}
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Pitchdeck-struktur</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.pitchdeckSlides.map((slide, i) => (
                      <span key={i} className="bg-navy/50 text-white/80 px-3 py-1.5 rounded-full text-sm">
                        {slide}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Download PDF Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={generatePdf}
                    disabled={isGeneratingPdf}
                    className="relative group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                  >
                    {/* Pulsing shadow effect */}
                    {!isGeneratingPdf && (
                      <span className="absolute inset-0 rounded-2xl bg-emerald-500 animate-ping opacity-20" />
                    )}
                    <span className="relative flex items-center gap-3">
                      {isGeneratingPdf ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Genererar PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Ladda ner rapport (PDF)
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-white/10 rounded-2xl p-8 text-center max-w-md">
                  <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Redo att generera din rapport?</h3>
                  <p className="text-white/60 mb-6">
                    {mainStepsComplete < 10 
                      ? `Fyll i resterande ${10 - mainStepsComplete} steg för att få din fullständiga analys.`
                      : 'Klicka på knappen nedan för att skapa din personliga sanitycheck-rapport.'
                    }
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={runAnalysis}
                      disabled={mainStepsComplete < 10 || isAnalyzing}
                      className={`
                        relative group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
                        ${mainStepsComplete >= 10 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 cursor-pointer'
                          : 'bg-white/20 text-white/50 cursor-not-allowed'
                        }
                      `}
                    >
                      {/* Pulsing shadow effect */}
                      {mainStepsComplete >= 10 && !isAnalyzing && (
                        <span className="absolute inset-0 rounded-2xl bg-emerald-500 animate-ping opacity-25" />
                      )}
                      <span className="relative flex items-center gap-3">
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyserar...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generera rapport
                          </>
                        )}
                      </span>
                    </button>
                    
                    {/* Demo PDF Download Button */}
                    <button
                      onClick={() => {
                        setAnalysisResult(DEMO_ANALYSIS_RESULT)
                      }}
                      className="px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" />
                        Visa exempelrapport
                      </span>
                    </button>
                  </div>
                  
                  {mainStepsComplete < 10 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(mainStepsComplete / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-white/60 text-sm whitespace-nowrap">{mainStepsComplete}/10</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case 12:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">12. Uppgradering & nästa steg</h2>
              <p className="text-white/70">Du använder idag sanitycheck i freemium-läge. Vill du uppgradera?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-4">Val av paket</label>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "freemium", label: "Freemium", desc: "Gratis sanitycheck med grundläggande feedback" },
                  { id: "base", label: "Baspaket", desc: "Full sanitycheck, SWOT och indikativt värderingsspann", price: "4 995 kr" },
                  { id: "premium", label: "Premium", desc: "Bas + fördjupade mallar, pitchdeck-stöd och guidning", price: "14 995 kr" }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField("upgradeChoice", opt.id)}
                    className={`p-6 rounded-2xl text-left transition-all duration-200 ${
                      state.upgradeChoice === opt.id
                        ? 'bg-white text-navy ring-2 ring-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <h4 className={`font-bold mb-1 ${state.upgradeChoice === opt.id ? 'text-navy' : 'text-white'}`}>{opt.label}</h4>
                    <p className={`text-sm mb-2 ${state.upgradeChoice === opt.id ? 'text-navy/70' : 'text-white/80'}`}>
                      {opt.desc}
                    </p>
                    {opt.price && (
                      <p className={`font-bold ${state.upgradeChoice === opt.id ? 'text-navy' : 'text-white'}`}>
                        {opt.price}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Kommentar eller frågor (valfritt)</label>
              <textarea
                value={state.upgradeComment}
                onChange={e => updateField("upgradeComment", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors min-h-[100px]"
              />
            </div>

            {analysisResult && (
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={generatePdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-navy font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Genererar...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Ladda ner PDF-rapport
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-navy tracking-wider">BOLAXO</div>
          <div className="text-sm text-gray-500">
            Värderingskoll · {completedCount} av {stepMeta.length} steg klara
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 lg:sticky lg:top-24">
              <h3 className="font-semibold text-navy mb-1">Snabb genomlysning & indikativ värdering</h3>
              <p className="text-sm text-gray-500 mb-6">Här gör du en snabb genomlysning av bolaget. Dina svar ger både en uppskattning av hur redo ni är att sälja och en indikativ bild av vad företaget kan vara värt.</p>
              
              <div className="space-y-1">
                {stepMeta.map(step => {
                  const Icon = step.icon
                  const isActive = step.id === activeStep
                  const isComplete = completionMap[step.id]
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-navy text-white'
                          : isComplete
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isActive || isComplete
                          ? 'bg-emerald-500 text-white'
                          : 'border border-gray-300 text-gray-400'
                      }`}>
                        {isComplete ? <Check className="w-3 h-3" /> : step.id}
                      </div>
                      <span className="text-left">{step.id}. {step.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-navy rounded-3xl p-8 md:p-10 animate-pulse-box-navy">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={goPrev}
                disabled={activeStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-navy hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Föregående
              </button>

              <div className="text-sm text-gray-500">
                {completedCount} av {stepMeta.length} steg klara
              </div>

              <button
                onClick={goNext}
                disabled={activeStep === stepMeta.length}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeStep === stepMeta.length
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-navy text-white hover:bg-navy/90'
                }`}
              >
                {activeStep === 10 && !analysisResult ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analysera
                  </>
                ) : (
                  <>
                    Nästa steg
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Selector Modal */}
      {showIndustryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl max-w-6xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-navy px-8 py-8 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Välj bransch</span>
                </div>
                <button
                  onClick={() => setShowIndustryModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <X className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                </button>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                Vilken bransch verkar ditt företag i?
              </h2>
              <p className="text-base text-white/70 max-w-2xl">
                Välj den kategori som bäst beskriver er verksamhet.
              </p>
            </div>

            {/* Industry Grid */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {INDUSTRIES.map((industry) => {
                  const isSelected = state.industry === industry.label
                  
                  return (
                    <button
                      key={industry.id}
                      onClick={() => {
                        updateField("industry", industry.label)
                        setShowIndustryModal(false)
                      }}
                      className={`
                        relative group text-left p-4 rounded-xl border-2 transition-all duration-200
                        ${isSelected 
                          ? 'border-navy bg-navy text-white shadow-lg' 
                          : 'border-gray-200 bg-white hover:border-navy/30 hover:shadow-md'
                        }
                      `}
                    >
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                            <CheckCircle className="w-4 h-4 text-navy" />
                          </div>
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className={`
                        w-11 h-11 rounded-lg flex items-center justify-center mb-3 transition-all duration-200
                        ${isSelected 
                          ? 'bg-white/20' 
                          : 'bg-navy'
                        }
                      `}>
                        <div className="text-white">
                          {industry.icon}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {industry.label}
                      </h3>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {industry.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {state.industry 
                    ? <span className="text-gray-900 font-medium">
                        Vald bransch: {state.industry}
                      </span>
                    : 'Klicka på en bransch för att välja'
                  }
                </p>
                
                <button
                  onClick={() => setShowIndustryModal(false)}
                  className="px-6 py-3 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 transition-colors"
                >
                  Stäng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

