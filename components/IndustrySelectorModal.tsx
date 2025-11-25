'use client'

import { useState } from 'react'
import { 
  Code, 
  ShoppingCart, 
  Cloud, 
  HardHat, 
  Wrench,
  SprayCan,
  Truck,
  UtensilsCrossed,
  Store,
  Package,
  Factory,
  Building,
  Megaphone,
  Calculator,
  Sparkles,
  Dumbbell,
  PartyPopper,
  GraduationCap,
  Car,
  TreePine,
  X,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export interface IndustryOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
  gradient: string
}

export const INDUSTRIES: IndustryOption[] = [
  {
    id: 'it-konsult-utveckling',
    label: 'IT-konsult & utveckling',
    description: 'Mjukvaruutveckling, systemintegration, IT-rådgivning',
    icon: <Code className="w-6 h-6" />,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'ehandel-d2c',
    label: 'E-handel/D2C',
    description: 'Webbutiker, direktförsäljning till konsument',
    icon: <ShoppingCart className="w-6 h-6" />,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'saas-licensmjukvara',
    label: 'SaaS & licensmjukvara',
    description: 'Prenumerationstjänster, molnbaserad mjukvara',
    icon: <Cloud className="w-6 h-6" />,
    color: 'text-cyan-600',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'bygg-anlaggning',
    label: 'Bygg & anläggning',
    description: 'Byggentreprenörer, ROT, nybyggnation',
    icon: <HardHat className="w-6 h-6" />,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-amber-600'
  },
  {
    id: 'el-vvs-installation',
    label: 'El, VVS & installation',
    description: 'Elektriker, rörmokare, installationsföretag',
    icon: <Wrench className="w-6 h-6" />,
    color: 'text-yellow-600',
    gradient: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'stad-facility-services',
    label: 'Städ & facility services',
    description: 'Städbolag, fastighetsskötsel, vaktmästeri',
    icon: <SprayCan className="w-6 h-6" />,
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'lager-logistik-3pl',
    label: 'Lager, logistik & 3PL',
    description: 'Lagerhållning, transport, tredjepartslogistik',
    icon: <Truck className="w-6 h-6" />,
    color: 'text-slate-600',
    gradient: 'from-slate-500 to-gray-700'
  },
  {
    id: 'restaurang-cafe',
    label: 'Restaurang & café',
    description: 'Restauranger, caféer, catering',
    icon: <UtensilsCrossed className="w-6 h-6" />,
    color: 'text-red-600',
    gradient: 'from-red-500 to-orange-600'
  },
  {
    id: 'detaljhandel-fysisk',
    label: 'Detaljhandel (fysisk)',
    description: 'Butiker, showrooms, fysisk försäljning',
    icon: <Store className="w-6 h-6" />,
    color: 'text-teal-600',
    gradient: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'grossist-partihandel',
    label: 'Grossist/partihandel',
    description: 'B2B-handel, import/export, distribution',
    icon: <Package className="w-6 h-6" />,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'latt-tillverkning-verkstad',
    label: 'Lätt tillverkning/verkstad',
    description: 'Produktion, verkstadsarbete, legotillverkning',
    icon: <Factory className="w-6 h-6" />,
    color: 'text-gray-600',
    gradient: 'from-gray-500 to-slate-700'
  },
  {
    id: 'fastighetsservice-forvaltning',
    label: 'Fastighetsservice & förvaltning',
    description: 'Fastighetsförvaltning, bostadsrättsförvaltning',
    icon: <Building className="w-6 h-6" />,
    color: 'text-stone-600',
    gradient: 'from-stone-500 to-gray-700'
  },
  {
    id: 'marknadsforing-kommunikation-pr',
    label: 'Marknadsföring, kommunikation & PR',
    description: 'Reklambyråer, PR-företag, marknadsföringsbolag',
    icon: <Megaphone className="w-6 h-6" />,
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'ekonomitjanster-redovisning',
    label: 'Ekonomitjänster & redovisning',
    description: 'Redovisningsbyråer, bokföring, revision',
    icon: <Calculator className="w-6 h-6" />,
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-green-600'
  },
  {
    id: 'halsa-skonhet',
    label: 'Hälsa/skönhet (salonger, kliniker, spa)',
    description: 'Frisörer, hudvård, skönhetsbehandlingar',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'text-fuchsia-600',
    gradient: 'from-fuchsia-500 to-pink-600'
  },
  {
    id: 'gym-fitness-wellness',
    label: 'Gym, fitness & wellness',
    description: 'Gym, PT-studios, wellness-center',
    icon: <Dumbbell className="w-6 h-6" />,
    color: 'text-lime-600',
    gradient: 'from-lime-500 to-green-600'
  },
  {
    id: 'event-konferens-upplevelser',
    label: 'Event, konferens & upplevelser',
    description: 'Eventbyråer, konferensanläggningar, upplevelser',
    icon: <PartyPopper className="w-6 h-6" />,
    color: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 'utbildning-kurser-edtech',
    label: 'Utbildning, kurser & edtech',
    description: 'Kursföretag, utbildningsplattformar, coaching',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'text-sky-600',
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 'bilverkstad-fordonsservice',
    label: 'Bilverkstad & fordonsservice',
    description: 'Verkstäder, däck, bilservice',
    icon: <Car className="w-6 h-6" />,
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-red-600'
  },
  {
    id: 'jord-skog-tradgard-gronyteskotsel',
    label: 'Jord/skog, trädgård & grönyteskötsel',
    description: 'Trädgårdsanläggning, skogsbruk, parkskötsel',
    icon: <TreePine className="w-6 h-6" />,
    color: 'text-green-700',
    gradient: 'from-green-600 to-emerald-700'
  }
]

interface IndustrySelectorModalProps {
  onSelect: (industry: IndustryOption) => void
  onClose?: () => void
}

export default function IndustrySelectorModal({ onSelect, onClose }: IndustrySelectorModalProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null)

  const handleContinue = () => {
    const industry = INDUSTRIES.find(i => i.id === selectedIndustry)
    if (industry) {
      onSelect(industry)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl max-w-6xl w-full shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-navy via-blue-900 to-indigo-900 px-8 py-10 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Steg 0 av 8</span>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <X className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                </button>
              )}
            </div>
            
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
              Vilken bransch verkar ditt företag i?
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Välj den kategori som bäst beskriver er verksamhet. Detta hjälper oss ställa rätt frågor och ge dig en mer träffsäker värdering.
            </p>
          </div>
        </div>

        {/* Industry Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRIES.map((industry) => {
              const isSelected = selectedIndustry === industry.id
              const isHovered = hoveredIndustry === industry.id
              
              return (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  onMouseEnter={() => setHoveredIndustry(industry.id)}
                  onMouseLeave={() => setHoveredIndustry(null)}
                  className={`
                    relative group text-left p-5 rounded-2xl border-2 transition-all duration-300 transform
                    ${isSelected 
                      ? `border-transparent bg-gradient-to-br ${industry.gradient} text-white shadow-xl scale-[1.02]` 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <CheckCircle className={`w-4 h-4 ${industry.color}`} />
                      </div>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
                    ${isSelected 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-br ${industry.gradient} bg-opacity-10`
                    }
                  `}>
                    <div className={isSelected ? 'text-white' : industry.color}>
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
                  
                  {/* Hover effect line */}
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300
                    bg-gradient-to-r ${industry.gradient}
                    ${isSelected ? 'opacity-0' : isHovered ? 'opacity-100' : 'opacity-0'}
                  `} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {selectedIndustry 
                ? <span className="text-gray-900 font-medium">
                    Vald bransch: {INDUSTRIES.find(i => i.id === selectedIndustry)?.label}
                  </span>
                : 'Välj en bransch för att fortsätta'
              }
            </p>
            
            <button
              onClick={handleContinue}
              disabled={!selectedIndustry}
              className={`
                group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg
                transition-all duration-300 transform
                ${selectedIndustry 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-xl hover:scale-105 cursor-pointer' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Fortsätt till frågorna
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${selectedIndustry ? 'group-hover:translate-x-1' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

