'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, DollarSign, Calendar, Shield, AlertCircle, CheckCircle, Edit, Send, Download, Scale } from 'lucide-react'

interface SPAData {
  id?: string
  listingId: string
  loiId?: string
  buyerId: string
  template: string
  purchasePrice: number
  closingDate: string
  cashAtClosing: number
  escrowHoldback: number
  earnOutAmount?: number
  sellerFinancing?: number
  representations?: any
  warranties?: any
  indemnification?: any
  closingConditions?: any
  status: string
  version: number
  listing?: {
    anonymousTitle: string
    user: {
      name: string
      companyName: string
    }
  }
  buyer?: {
    name: string
    companyName: string
  }
}

export default function SPAEditorPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.listingId as string
  
  const [spa, setSpa] = useState<SPAData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'terms' | 'reps' | 'conditions' | 'indemnity'>('terms')
  
  // Form state
  const [formData, setFormData] = useState({
    purchasePrice: 0,
    closingDate: '',
    cashAtClosing: 0,
    escrowHoldback: 0,
    earnOutAmount: 0,
    sellerFinancing: 0,
    escrowPeriodMonths: 18,
    indemnityCapPercent: 10,
    survivalPeriodMonths: 24
  })

  // Standard representations & warranties
  const standardReps = [
    { id: 'organization', label: 'Organization & Authority', checked: true },
    { id: 'financials', label: 'Financial Statements Accuracy', checked: true },
    { id: 'assets', label: 'Title to Assets', checked: true },
    { id: 'contracts', label: 'Material Contracts', checked: true },
    { id: 'litigation', label: 'No Pending Litigation', checked: true },
    { id: 'compliance', label: 'Legal Compliance', checked: true },
    { id: 'ip', label: 'Intellectual Property', checked: true },
    { id: 'employees', label: 'Employment Matters', checked: true },
    { id: 'tax', label: 'Tax Compliance', checked: true },
    { id: 'environmental', label: 'Environmental Compliance', checked: false }
  ]

  const [selectedReps, setSelectedReps] = useState(standardReps)

  // Standard closing conditions
  const standardConditions = [
    { id: 'dd_complete', label: 'Satisfactory Due Diligence Completion', checked: true },
    { id: 'no_mac', label: 'No Material Adverse Change', checked: true },
    { id: 'consents', label: 'Third Party Consents Obtained', checked: true },
    { id: 'permits', label: 'Permits & Licenses Valid', checked: true },
    { id: 'employment', label: 'Key Employee Agreements', checked: true },
    { id: 'financing', label: 'Buyer Financing Secured', checked: false },
    { id: 'lease', label: 'Lease Assignment/Renewal', checked: false }
  ]

  const [selectedConditions, setSelectedConditions] = useState(standardConditions)

  useEffect(() => {
    fetchSPAData()
  }, [listingId])

  const fetchSPAData = async () => {
    try {
      // Check if SPA exists
      const spaRes = await fetch(`/api/sme/spa/get?listingId=${listingId}`)
      if (spaRes.ok) {
        const data = await spaRes.json()
        if (data.data) {
          setSpa(data.data)
          setFormData({
            purchasePrice: data.data.purchasePrice,
            closingDate: data.data.closingDate.split('T')[0],
            cashAtClosing: data.data.cashAtClosing,
            escrowHoldback: data.data.escrowHoldback,
            earnOutAmount: data.data.earnOutAmount || 0,
            sellerFinancing: data.data.sellerFinancing || 0,
            escrowPeriodMonths: 18,
            indemnityCapPercent: 10,
            survivalPeriodMonths: 24
          })
          if (data.data.representations) {
            setSelectedReps(data.data.representations)
          }
          if (data.data.closingConditions) {
            setSelectedConditions(data.data.closingConditions)
          }
        }
      }
      
      // Get LoI data if no SPA exists
      const loiRes = await fetch(`/api/sme/loi/get?listingId=${listingId}`)
      if (loiRes.ok && !spa) {
        const loiData = await loiRes.json()
        if (loiData.data) {
          setFormData({
            ...formData,
            purchasePrice: loiData.data.proposedPrice,
            cashAtClosing: loiData.data.cashAtClosing,
            escrowHoldback: loiData.data.escrowHoldback,
            earnOutAmount: loiData.data.earnOutAmount || 0
          })
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSPA = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/sme/spa/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerId: 'current-user-id', // Get from auth context
          ...formData,
          representations: selectedReps,
          warranties: selectedReps, // Same as reps for now
          closingConditions: selectedConditions,
          indemnification: {
            cap: formData.purchasePrice * (formData.indemnityCapPercent / 100),
            basket: formData.purchasePrice * 0.01, // 1% basket
            survivalPeriod: formData.survivalPeriodMonths
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSpa(data.data)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error creating SPA:', error)
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const indemnityAmount = formData.purchasePrice * (formData.indemnityCapPercent / 100)
  const basketAmount = formData.purchasePrice * 0.01

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href={`/objekt/${listingId}`} className="inline-flex items-center gap-2 text-primary-navy hover:text-accent-pink mb-4">
            <ArrowLeft className="w-5 h-5" /> Tillbaka till objekt
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Share Purchase Agreement (SPA)</h1>
              <p className="text-gray-600">Aktieöverlåtelseavtal - Det juridiska avtalet för företagsköpet</p>
            </div>
            <div className="flex items-center gap-4">
              {spa && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:shadow-lg flex items-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Redigera
                </button>
              )}
              {spa?.status === 'draft' && (
                <button className="px-4 py-2 bg-accent-pink text-white rounded-lg hover:shadow-lg flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Skicka till säljare
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!spa || editing ? (
          // Edit/Create Form
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Section Tabs */}
              <div className="bg-white rounded-lg border-2 border-gray-200 mb-6">
                <div className="flex border-b border-gray-200">
                  {(['terms', 'reps', 'conditions', 'indemnity'] as const).map((section) => (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`flex-1 py-3 font-semibold transition-colors ${
                        activeSection === section
                          ? 'text-primary-navy border-b-2 border-primary-navy'
                          : 'text-gray-600 hover:text-primary-navy'
                      }`}
                    >
                      {section === 'terms' ? 'Villkor' :
                       section === 'reps' ? 'Garantier' :
                       section === 'conditions' ? 'Villkor för tillträde' :
                       'Skadestånd'}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* Terms Section */}
                  {activeSection === 'terms' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-primary-navy mb-4">Köpevillkor</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total köpeskilling (SEK)
                        </label>
                        <input
                          type="number"
                          value={formData.purchasePrice}
                          onChange={(e) => setFormData({...formData, purchasePrice: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tillträdesdag
                        </label>
                        <input
                          type="date"
                          value={formData.closingDate}
                          onChange={(e) => setFormData({...formData, closingDate: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Kontant vid tillträde (SEK)
                          </label>
                          <input
                            type="number"
                            value={formData.cashAtClosing}
                            onChange={(e) => setFormData({...formData, cashAtClosing: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Escrow/Deposition (SEK)
                          </label>
                          <input
                            type="number"
                            value={formData.escrowHoldback}
                            onChange={(e) => setFormData({...formData, escrowHoldback: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tilläggsköpeskilling (SEK)
                          </label>
                          <input
                            type="number"
                            value={formData.earnOutAmount}
                            onChange={(e) => setFormData({...formData, earnOutAmount: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Säljarfinansiering (SEK)
                          </label>
                          <input
                            type="number"
                            value={formData.sellerFinancing}
                            onChange={(e) => setFormData({...formData, sellerFinancing: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Escrow-period (månader)
                        </label>
                        <input
                          type="number"
                          value={formData.escrowPeriodMonths}
                          onChange={(e) => setFormData({...formData, escrowPeriodMonths: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Representations & Warranties */}
                  {activeSection === 'reps' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-primary-navy mb-4">Garantier & Utfästelser</h3>
                      
                      <div className="space-y-3">
                        {selectedReps.map((rep, index) => (
                          <label key={rep.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={rep.checked}
                              onChange={(e) => {
                                const newReps = [...selectedReps]
                                newReps[index].checked = e.target.checked
                                setSelectedReps(newReps)
                              }}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{rep.label}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {rep.id === 'organization' && 'Säljaren är korrekt organiserat och har full behörighet att genomföra transaktionen.'}
                                {rep.id === 'financials' && 'Alla finansiella rapporter är korrekta och ger en rättvisande bild av verksamheten.'}
                                {rep.id === 'assets' && 'Säljaren äger alla tillgångar fria från panträtter och belastningar.'}
                                {rep.id === 'contracts' && 'Alla väsentliga avtal har avslöjats och är giltiga.'}
                                {rep.id === 'litigation' && 'Det finns inga pågående eller hotande rättsliga tvister.'}
                                {rep.id === 'compliance' && 'Verksamheten följer alla tillämpliga lagar och regler.'}
                                {rep.id === 'ip' && 'All immateriell egendom ägs av bolaget eller licensieras korrekt.'}
                                {rep.id === 'employees' && 'Alla anställningsförhållanden är korrekt redovisade.'}
                                {rep.id === 'tax' && 'Alla skatter är betalda och deklarationer inlämnade.'}
                                {rep.id === 'environmental' && 'Verksamheten följer alla miljölagar och har inga miljöskulder.'}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Closing Conditions */}
                  {activeSection === 'conditions' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-primary-navy mb-4">Villkor för tillträde</h3>
                      
                      <div className="space-y-3">
                        {selectedConditions.map((condition, index) => (
                          <label key={condition.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={condition.checked}
                              onChange={(e) => {
                                const newConditions = [...selectedConditions]
                                newConditions[index].checked = e.target.checked
                                setSelectedConditions(newConditions)
                              }}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{condition.label}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {condition.id === 'dd_complete' && 'Due diligence-processen ska vara slutförd med tillfredställande resultat.'}
                                {condition.id === 'no_mac' && 'Ingen väsentlig negativ förändring i verksamheten ska ha inträffat.'}
                                {condition.id === 'consents' && 'Alla nödvändiga godkännanden från tredje part ska ha erhållits.'}
                                {condition.id === 'permits' && 'Alla tillstånd och licenser ska vara giltiga och överförbara.'}
                                {condition.id === 'employment' && 'Nyckelmedarbetare ska ha tecknat nya anställningsavtal.'}
                                {condition.id === 'financing' && 'Köparen ska ha säkerställt nödvändig finansiering.'}
                                {condition.id === 'lease' && 'Hyresavtal ska vara förnyade eller överlåtna.'}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Indemnification */}
                  {activeSection === 'indemnity' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-primary-navy mb-4">Skadeståndsbestämmelser</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Skadeståndstak (% av köpeskilling)
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="5"
                            max="25"
                            value={formData.indemnityCapPercent}
                            onChange={(e) => setFormData({...formData, indemnityCapPercent: parseInt(e.target.value)})}
                            className="flex-1"
                          />
                          <span className="w-16 text-right font-semibold">{formData.indemnityCapPercent}%</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Maxbelopp: {formatCurrency(indemnityAmount)}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Självrisk/Basket (fast 1% av köpeskilling)
                        </label>
                        <div className="px-4 py-2 bg-gray-100 rounded-lg">
                          <p className="font-semibold">{formatCurrency(basketAmount)}</p>
                          <p className="text-sm text-gray-600">Skadestånd utgår endast för belopp överstigande självrisken</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preskriptionstid (månader)
                        </label>
                        <input
                          type="number"
                          value={formData.survivalPeriodMonths}
                          onChange={(e) => setFormData({...formData, survivalPeriodMonths: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-navy focus:outline-none"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Garantier gäller i {formData.survivalPeriodMonths} månader efter tillträde (skattegarantier längre)
                        </p>
                      </div>

                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Standard undantag:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Skattegarantier: 7 år</li>
                          <li>• Miljögarantier: 10 år</li>
                          <li>• Äganderättsgarantier: Obegränsad tid</li>
                          <li>• Bedrägeri/uppsåt: Obegränsad tid och belopp</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCreateSPA}
                  disabled={saving || !formData.purchasePrice || !formData.closingDate}
                  className="flex-1 px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? 'Sparar...' : spa ? 'Uppdatera SPA' : 'Skapa SPA'}
                </button>
                {spa && (
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                  >
                    Avbryt
                  </button>
                )}
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-primary-navy mb-4">Sammanfattning</h3>
                
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Total köpeskilling</p>
                    <p className="text-2xl font-bold text-primary-navy">{formatCurrency(formData.purchasePrice)}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kontant vid tillträde</span>
                      <span className="font-semibold">{formatCurrency(formData.cashAtClosing)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Escrow/Deposition</span>
                      <span className="font-semibold">{formatCurrency(formData.escrowHoldback)}</span>
                    </div>
                    {formData.earnOutAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tilläggsköpeskilling</span>
                        <span className="font-semibold">{formatCurrency(formData.earnOutAmount)}</span>
                      </div>
                    )}
                    {formData.sellerFinancing > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Säljarfinansiering</span>
                        <span className="font-semibold">{formatCurrency(formData.sellerFinancing)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Tillträdesdag</p>
                    <p className="font-semibold">
                      {formData.closingDate ? new Date(formData.closingDate).toLocaleDateString('sv-SE') : 'Ej satt'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Skydd för köparen</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skadeståndstak</span>
                        <span className="font-semibold">{formData.indemnityCapPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Garantitid</span>
                        <span className="font-semibold">{formData.survivalPeriodMonths} mån</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow-period</span>
                        <span className="font-semibold">{formData.escrowPeriodMonths} mån</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Status */}
              <div className={`p-4 rounded-lg border-2 ${
                spa.status === 'draft' ? 'bg-gray-50 border-gray-300' :
                spa.status === 'negotiation' ? 'bg-yellow-50 border-yellow-300' :
                spa.status === 'signed' ? 'bg-green-50 border-green-300' :
                'bg-blue-50 border-blue-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Scale className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-semibold">
                        Status: {spa.status === 'draft' ? 'Utkast' : spa.status}
                      </p>
                      <p className="text-sm text-gray-600">Version {spa.version}</p>
                    </div>
                  </div>
                  {spa.status === 'signed' && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </div>

              {/* Document Preview */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-primary-navy mb-2">AKTIEÖVERLÅTELSEAVTAL</h2>
                  <p className="text-gray-600">Share Purchase Agreement</p>
                </div>

                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="font-bold text-primary-navy mb-2">PARTER</h3>
                    <p className="mb-2">
                      <strong>Säljare:</strong> {spa.listing?.user?.companyName || 'Säljaren'}<br />
                      Org.nr: XXXXXX-XXXX
                    </p>
                    <p>
                      <strong>Köpare:</strong> {spa.buyer?.companyName || 'Köparen'}<br />
                      Org.nr: XXXXXX-XXXX
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-primary-navy mb-2">§1 ÖVERLÅTELSE</h3>
                    <p>
                      Säljaren överlåter härmed samtliga aktier i {spa.listing?.anonymousTitle || 'Målbolaget'} 
                      ("Bolaget") till Köparen på de villkor som anges i detta avtal.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-primary-navy mb-2">§2 KÖPESKILLING</h3>
                    <p className="mb-2">
                      Den totala köpeskillingen för aktierna uppgår till <strong>{formatCurrency(spa.purchasePrice)}</strong> 
                      och ska erläggas enligt följande:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Kontant vid tillträde: {formatCurrency(spa.cashAtClosing)}</li>
                      <li>Deposition (escrow): {formatCurrency(spa.escrowHoldback)}</li>
                      {spa.earnOutAmount && spa.earnOutAmount > 0 && (
                        <li>Tilläggsköpeskilling: {formatCurrency(spa.earnOutAmount)}</li>
                      )}
                      {spa.sellerFinancing && spa.sellerFinancing > 0 && (
                        <li>Säljarfinansiering: {formatCurrency(spa.sellerFinancing)}</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-primary-navy mb-2">§3 TILLTRÄDE</h3>
                    <p>
                      Tillträde till aktierna ska ske den <strong>{new Date(spa.closingDate).toLocaleDateString('sv-SE')}</strong>.
                      På tillträdesdagen ska köpeskillingen erläggas och aktierna överlämnas.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 italic">
                      Detta är en förenklad förhandsvisning. Det fullständiga avtalet innehåller detaljerade 
                      bestämmelser om garantier, skadestånd, villkor för tillträde och övriga standardklausuler.
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <div className="mt-8 text-center">
                  <button className="px-6 py-3 bg-primary-navy text-white font-semibold rounded-lg hover:shadow-lg inline-flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Ladda ned fullt avtal (Word)
                  </button>
                </div>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Key Terms Summary */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-bold text-primary-navy mb-4">Nyckelvillkor</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Köpeskilling</p>
                    <p className="font-bold text-xl">{formatCurrency(spa.purchasePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tillträdesdag</p>
                    <p className="font-semibold">{new Date(spa.closingDate).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Garantier</p>
                    <p className="font-semibold">{spa.representations?.filter((r: any) => r.checked).length || 0} st</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tillträdesvillkor</p>
                    <p className="font-semibold">{spa.closingConditions?.filter((c: any) => c.checked).length || 0} st</p>
                  </div>
                </div>
              </div>

              {/* What is SPA? */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-3">Vad är ett SPA?</h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p>
                    Ett Share Purchase Agreement (SPA) är det juridiska avtalet som reglerar 
                    överlåtelsen av aktier från säljare till köpare.
                  </p>
                  <p className="font-semibold">Avtalet innehåller:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Köpeskilling och betalningsvillkor</li>
                    <li>Garantier från säljaren</li>
                    <li>Skadeståndsbestämmelser</li>
                    <li>Villkor som måste uppfyllas</li>
                    <li>Konkurrensförbud</li>
                    <li>Sekretessbestämmelser</li>
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-3">Nästa steg</h3>
                <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                  <li>Granska avtalet med din jurist</li>
                  <li>Förhandla eventuella ändringar</li>
                  <li>Uppfyll tillträdesvillkoren</li>
                  <li>Underteckna avtalet digitalt</li>
                  <li>Genomför betalning på tillträdesdagen</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
