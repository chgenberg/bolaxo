'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePaymentStore } from '@/store/paymentStore'
import PaymentStatusBanner from '@/components/PaymentStatusBanner'
import SubscriptionStatus from '@/components/SubscriptionStatus'
import { 
  TrendingUp, Eye, MessageCircle, Clock, 
  Plus, Settings, FileText, Users,
  Star, ArrowRight, BarChart3, 
  Building, Shield, Calendar
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller')
  const { subscription, invoices, loadFromLocalStorage } = usePaymentStore()

  useEffect(() => {
    loadFromLocalStorage()
  }, [loadFromLocalStorage])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/10">
      <PaymentStatusBanner invoices={invoices} />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="heading-2">Min översikt</h1>
              <p className="text-text-gray mt-1">Välkommen tillbaka! Här är din aktivitet.</p>
            </div>
            
            {/* Tab Toggle */}
            <div className="flex bg-white rounded-card shadow-soft p-1.5">
              <button
                onClick={() => setActiveTab('seller')}
                className={`px-6 py-2.5 rounded-button font-medium transition-all duration-300 ${
                  activeTab === 'seller'
                    ? 'bg-primary-blue text-white shadow-card'
                    : 'text-text-gray hover:text-text-dark'
                }`}
              >
                Som säljare
              </button>
              <button
                onClick={() => setActiveTab('buyer')}
                className={`px-6 py-2.5 rounded-button font-medium transition-all duration-300 ${
                  activeTab === 'buyer'
                    ? 'bg-primary-blue text-white shadow-card'
                    : 'text-text-gray hover:text-text-dark'
                }`}
              >
                Som köpare
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'seller' ? <SellerDashboard /> : <BuyerDashboard />}
      </div>
    </main>
  )
}

function SellerDashboard() {
  const { subscription } = usePaymentStore()
  
  const stats = [
    { 
      icon: Eye, 
      label: 'Visningar denna vecka', 
      value: '1,234', 
      change: '+12%',
      color: 'text-success' 
    },
    { 
      icon: MessageCircle, 
      label: 'Nya meddelanden', 
      value: '8', 
      change: '3 olästa',
      color: 'text-primary-blue' 
    },
    { 
      icon: Users, 
      label: 'Intresserade köpare', 
      value: '24', 
      change: '+5 denna vecka',
      color: 'text-warning' 
    },
    { 
      icon: Clock, 
      label: 'Genomsnittlig svarstid', 
      value: '2.5h', 
      change: '-30 min',
      color: 'text-success' 
    },
  ]

  const activities = [
    { 
      type: 'view', 
      message: 'Ny visning från verifierad köpare', 
      time: '5 min sedan',
      icon: Eye 
    },
    { 
      type: 'message', 
      message: 'Nytt meddelande angående ditt företag', 
      time: '1 timme sedan',
      icon: MessageCircle 
    },
    { 
      type: 'nda', 
      message: 'NDA signerat av Invest AB', 
      time: '3 timmar sedan',
      icon: Shield 
    },
    { 
      type: 'view', 
      message: '15 nya visningar idag', 
      time: '5 timmar sedan',
      icon: TrendingUp 
    },
  ]

  return (
    <div className="space-y-8">
      {/* Subscription Status */}
      <SubscriptionStatus subscription={subscription} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-card bg-light-blue/20 flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-primary-blue" />
                </div>
                <span className={`text-sm font-medium ${stat.color}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-text-dark">{stat.value}</div>
              <div className="text-sm text-text-gray mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-dark">Prestandaöversikt</h3>
              <select className="select-field w-32">
                <option>Denna vecka</option>
                <option>Denna månad</option>
                <option>Detta år</option>
              </select>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 bg-gradient-to-t from-light-blue/10 to-white rounded-card flex items-end justify-around p-4">
              {[40, 65, 45, 80, 95, 70, 85].map((height, i) => (
                <div key={i} className="flex-1 mx-1">
                  <div 
                    className="bg-primary-blue rounded-t-md hover:bg-blue-700 transition-all duration-300 cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-text-gray text-center mt-2">
                    {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'][i]}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-dark">8,456</div>
                <div className="text-sm text-text-gray">Totala visningar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-blue">324</div>
                <div className="text-sm text-text-gray">Unika besökare</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">4.2%</div>
                <div className="text-sm text-text-gray">Konvertering</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-text-dark mb-6">Senaste aktivitet</h3>
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-light-blue/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-dark">{activity.message}</p>
                      <p className="text-xs text-text-gray mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Link href="#" className="block text-center text-primary-blue hover:text-blue-700 font-medium mt-4">
              Visa all aktivitet →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link href="/salja/start" className="card-interactive text-center group">
          <Plus className="w-8 h-8 text-primary-blue mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-text-dark">Ny annons</span>
        </Link>
        <Link href="#" className="card-interactive text-center group">
          <MessageCircle className="w-8 h-8 text-primary-blue mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-text-dark">Meddelanden</span>
        </Link>
        <Link href="#" className="card-interactive text-center group">
          <BarChart3 className="w-8 h-8 text-primary-blue mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-text-dark">Statistik</span>
        </Link>
        <Link href="#" className="card-interactive text-center group">
          <Settings className="w-8 h-8 text-primary-blue mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-text-dark">Inställningar</span>
        </Link>
      </div>

      {/* My Listings */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-dark">Mina annonser</h3>
          <Link href="/salja/start" className="btn-ghost text-sm">
            Skapa ny →
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-card p-6 hover:shadow-card transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-text-dark">TechStart AB</h4>
                  <span className="px-3 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                    Aktiv
                  </span>
                  <span className="px-3 py-1 bg-primary-blue/10 text-primary-blue text-xs rounded-full font-medium">
                    Featured
                  </span>
                </div>
                <p className="text-sm text-text-gray mb-3">E-handel • Stockholm • 15 MSEK</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center text-text-gray">
                    <Eye className="w-4 h-4 mr-1" />
                    1,234 visningar
                  </div>
                  <div className="flex items-center text-text-gray">
                    <Users className="w-4 h-4 mr-1" />
                    24 intresserade
                  </div>
                  <div className="flex items-center text-text-gray">
                    <Calendar className="w-4 h-4 mr-1" />
                    45 dagar kvar
                  </div>
                </div>
              </div>
              <Link href="#" className="btn-ghost text-sm">
                Hantera →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BuyerDashboard() {
  const savedObjects = [
    {
      id: '1',
      title: 'E-handelsföretag inom mode',
      price: '15 MSEK',
      location: 'Stockholm',
      category: 'E-handel',
      saved: true,
    },
    {
      id: '2',
      title: 'SaaS-bolag inom HR-tech',
      price: '25 MSEK',
      location: 'Göteborg',
      category: 'Teknologi',
      saved: true,
    },
  ]

  const recommendations = [
    {
      id: '3',
      title: 'Konsultbolag inom IT',
      price: '8 MSEK',
      location: 'Malmö',
      category: 'Tjänster',
      match: '92%',
    },
    {
      id: '4',
      title: 'Tillverkningsföretag',
      price: '35 MSEK',
      location: 'Uppsala',
      category: 'Tillverkning',
      match: '88%',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Buyer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <Building className="w-10 h-10 text-primary-blue" />
            <span className="text-xs text-success font-medium">+5 nya</span>
          </div>
          <div className="text-2xl font-bold text-text-dark">12</div>
          <div className="text-sm text-text-gray">Sparade objekt</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-10 h-10 text-primary-blue" />
            <span className="text-xs text-primary-blue font-medium">Aktiva</span>
          </div>
          <div className="text-2xl font-bold text-text-dark">3</div>
          <div className="text-sm text-text-gray">Signerade NDAs</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="w-10 h-10 text-primary-blue" />
            <span className="text-xs text-warning font-medium">2 olästa</span>
          </div>
          <div className="text-2xl font-bold text-text-dark">8</div>
          <div className="text-sm text-text-gray">Pågående dialoger</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-10 h-10 text-primary-blue" />
            <span className="text-xs text-text-gray font-medium">Denna vecka</span>
          </div>
          <div className="text-2xl font-bold text-text-dark">15</div>
          <div className="text-sm text-text-gray">Nya matchningar</div>
        </div>
      </div>

      {/* Saved Objects */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-dark">Sparade företag</h3>
          <Link href="/sok" className="btn-ghost text-sm">
            Sök fler →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {savedObjects.map((object) => (
            <div key={object.id} className="border border-gray-100 rounded-card p-6 hover:shadow-card transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-text-dark flex-1">{object.title}</h4>
                <Star className="w-5 h-5 text-warning fill-current" />
              </div>
              <p className="text-sm text-text-gray mb-3">
                {object.category} • {object.location}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-blue">{object.price}</span>
                <Link href={`/objekt/${object.id}`} className="text-primary-blue hover:text-blue-700 font-medium text-sm">
                  Visa detaljer →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-dark mb-2">Rekommendationer för dig</h3>
          <p className="text-sm text-text-gray">Baserat på dina sökningar och preferenser</p>
        </div>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border border-gray-100 rounded-card p-6 hover:shadow-card transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-text-dark">{rec.title}</h4>
                    <span className="px-3 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                      {rec.match} match
                    </span>
                  </div>
                  <p className="text-sm text-text-gray">
                    {rec.category} • {rec.location} • {rec.price}
                  </p>
                </div>
                <Link href={`/objekt/${rec.id}`} className="btn-primary text-sm">
                  Visa objekt
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/sok" className="card-interactive group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-card bg-light-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building className="w-6 h-6 text-primary-blue" />
            </div>
            <div>
              <div className="font-semibold text-text-dark">Sök företag</div>
              <div className="text-sm text-text-gray">Hitta nya möjligheter</div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary-blue ml-auto" />
          </div>
        </Link>
        
        <Link href="/jamfor" className="card-interactive group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-card bg-light-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-primary-blue" />
            </div>
            <div>
              <div className="font-semibold text-text-dark">Jämför objekt</div>
              <div className="text-sm text-text-gray">Analysera alternativ</div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary-blue ml-auto" />
          </div>
        </Link>
        
        <Link href="/kopare" className="card-interactive group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-card bg-light-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-primary-blue" />
            </div>
            <div>
              <div className="font-semibold text-text-dark">Köparguide</div>
              <div className="text-sm text-text-gray">Lär dig processen</div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary-blue ml-auto" />
          </div>
        </Link>
      </div>
    </div>
  )
}