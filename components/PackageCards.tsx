'use client'

import { CheckCircle, Star, TrendingUp } from 'lucide-react'

interface Package {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  highlighted?: boolean
  icon: React.ElementType
  gradient: string
}

const packages: Package[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 4900,
    period: 'engångsavgift',
    icon: CheckCircle,
    gradient: 'from-gray-50 to-white',
    features: [
      'Grundläggande annons',
      'Synlig i 90 dagar',
      'Upp till 5 bilder',
      'NDA-hantering',
      'E-postsupport',
    ],
  },
  {
    id: 'featured',
    name: 'Featured',
    price: 9900,
    period: 'engångsavgift',
    highlighted: true,
    icon: Star,
    gradient: 'from-light-blue/20 to-white',
    features: [
      'Allt i Basic',
      'Framhävd placering',
      'Synlig i 180 dagar',
      'Upp till 20 bilder',
      'Prioriterad support',
      'Marknadsföringspaket',
      'Statistik & insikter',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19900,
    period: 'engångsavgift',
    icon: TrendingUp,
    gradient: 'from-primary-blue/5 to-white',
    features: [
      'Allt i Featured',
      'Topplacering',
      'Synlig tills såld',
      'Obegränsat med bilder',
      'Dedikerad rådgivare',
      'Värderingshjälp',
      'Due diligence-stöd',
      'Juridisk granskning',
    ],
  },
]

interface PackageCardsProps {
  selectedPackage?: string
  onPackageSelect?: (packageId: string) => void
  showPeriodToggle?: boolean
}

export default function PackageCards({ 
  selectedPackage, 
  onPackageSelect,
  showPeriodToggle = false 
}: PackageCardsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {packages.map((pkg) => {
        const isSelected = selectedPackage === pkg.id
        const Icon = pkg.icon
        
        return (
          <div
            key={pkg.id}
            className={`relative group ${onPackageSelect ? 'cursor-pointer' : ''}`}
            onClick={() => onPackageSelect?.(pkg.id)}
          >
            {/* Highlight Badge */}
            {pkg.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-primary-blue text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-card">
                  Mest populär
                </span>
              </div>
            )}
            
            {/* Card */}
            <div className={`
              relative h-full bg-gradient-to-b ${pkg.gradient} 
              rounded-card border-2 transition-all duration-300
              ${isSelected 
                ? 'border-primary-blue shadow-card-hover' 
                : 'border-gray-100 hover:border-primary-blue/30 hover:shadow-card'
              }
              ${onPackageSelect ? 'transform hover:-translate-y-1' : ''}
            `}>
              <div className="p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className={`
                    w-16 h-16 mx-auto rounded-full flex items-center justify-center
                    ${pkg.highlighted ? 'bg-primary-blue/10' : 'bg-light-blue/30'}
                  `}>
                    <Icon className={`w-8 h-8 ${pkg.highlighted ? 'text-primary-blue' : 'text-text-dark'}`} />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-text-dark">{pkg.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-primary-blue">
                        {pkg.price.toLocaleString('sv-SE')}
                      </span>
                      <span className="text-text-gray ml-1">kr</span>
                      <div className="text-sm text-text-gray mt-1">{pkg.period}</div>
                    </div>
                  </div>
                </div>
                
                {/* Features */}
                <ul className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-dark">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Selection Indicator */}
                {onPackageSelect && (
                  <div className="pt-4">
                    <div className={`
                      w-full py-3 rounded-button font-semibold text-center transition-all duration-300
                      ${isSelected 
                        ? 'bg-primary-blue text-white' 
                        : 'bg-white border border-gray-200 text-text-dark group-hover:border-primary-blue group-hover:text-primary-blue'
                      }
                    `}>
                      {isSelected ? 'Valt paket' : 'Välj paket'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}