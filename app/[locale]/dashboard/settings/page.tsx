'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { User, Shield, Bell, CreditCard, Building, Mail, CheckCircle, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'company', label: 'Företag', icon: Building },
    { id: 'security', label: 'Säkerhet', icon: Shield },
    { id: 'notifications', label: 'Notiser', icon: Bell },
    { id: 'billing', label: 'Fakturering', icon: CreditCard },
  ]

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-navy">Inställningar</h1>
          <p className="text-graphite/70 mt-1">Hantera ditt konto och preferenser</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-navy text-white'
                  : 'text-graphite hover:bg-sand/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-sand/50 p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-navy">Personlig information</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rose to-coral rounded-2xl flex items-center justify-center text-navy text-2xl font-bold">
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <div>
                  <button className="text-sm text-sky hover:text-navy font-medium transition-colors">
                    Ladda upp ny bild
                  </button>
                  <p className="text-xs text-graphite/60 mt-1">JPG, PNG eller GIF. Max 2MB.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Förnamn</label>
                  <input
                    type="text"
                    defaultValue={user?.name?.split(' ')[0] || ''}
                    className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Efternamn</label>
                  <input
                    type="text"
                    defaultValue={user?.name?.split(' ')[1] || ''}
                    className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">E-postadress</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Telefonnummer</label>
                  <input
                    type="tel"
                    placeholder="+46 70 123 45 67"
                    className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-navy">Företagsuppgifter</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Företagsnamn</label>
                  <input type="text" placeholder="ABC Företag AB" className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Org.nummer</label>
                  <input type="text" placeholder="556123-4567" className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-navy mb-2">Adress</label>
                  <input type="text" placeholder="Kungsgatan 1" className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all mb-3" />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" placeholder="111 22" className="px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all" />
                    <input type="text" placeholder="Stockholm" className="col-span-2 px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-navy">Säkerhetsinställningar</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-navy mb-3">Ändra lösenord</h3>
                  <div className="space-y-3 max-w-md">
                    <input type="password" placeholder="Nuvarande lösenord" className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all" />
                    <input type="password" placeholder="Nytt lösenord" className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all" />
                    <input type="password" placeholder="Bekräfta lösenord" className="w-full px-4 py-3 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky transition-all" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-sand/50">
                  <h3 className="text-sm font-medium text-navy mb-3">Tvåfaktorsautentisering</h3>
                  <div className="flex items-center justify-between p-4 bg-sand/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-mint" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">BankID</p>
                        <p className="text-xs text-graphite/60">Säker inloggning</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-navy text-white text-sm rounded-full hover:bg-navy/90 transition-colors">
                      Aktivera
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-navy">Notifieringsinställningar</h2>
              
              <div className="space-y-3">
                {[
                  { id: 'nda', label: 'NDA-förfrågningar', desc: 'När någon vill signera NDA', email: true, push: true },
                  { id: 'message', label: 'Nya meddelanden', desc: 'När du får ett nytt meddelande', email: true, push: false },
                  { id: 'activity', label: 'Aktivitet', desc: 'Visningar och sparningar', email: false, push: true },
                  { id: 'newsletter', label: 'Nyhetsbrev', desc: 'Tips och uppdateringar', email: true, push: false },
                  { id: 'deal', label: 'Affärsuppdateringar', desc: 'Viktiga milstolpar', email: true, push: true },
                ].map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-sand/20 rounded-xl">
                    <div>
                      <h3 className="text-sm font-medium text-navy">{setting.label}</h3>
                      <p className="text-xs text-graphite/60">{setting.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={setting.email} className="w-4 h-4 rounded border-sand text-navy focus:ring-sky" />
                        <Mail className="w-4 h-4 text-graphite/60" />
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={setting.push} className="w-4 h-4 rounded border-sand text-navy focus:ring-sky" />
                        <Bell className="w-4 h-4 text-graphite/60" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-navy">Fakturering & prenumeration</h2>
              
              <div className="bg-gradient-to-r from-sky/20 to-mint/20 rounded-xl p-5 border border-sky/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-sky" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">Pro Plan</h3>
                      <p className="text-sm text-graphite/70">895 kr/månad</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-mint/30 text-navy text-xs font-medium rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Aktiv
                  </span>
                </div>
                <div className="flex gap-4">
                  <button className="text-sm text-sky hover:text-navy font-medium transition-colors">Uppgradera</button>
                  <button className="text-sm text-graphite/60 hover:text-coral font-medium transition-colors">Avsluta</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-navy mb-3">Betalningsmetod</h3>
                <div className="flex items-center justify-between p-4 bg-sand/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-navy rounded flex items-center justify-center text-white text-xs">VISA</div>
                    <div>
                      <p className="text-sm font-medium text-navy">•••• •••• •••• 4242</p>
                      <p className="text-xs text-graphite/60">Utgår 12/25</p>
                    </div>
                  </div>
                  <button className="text-sm text-sky hover:text-navy font-medium transition-colors">Ändra</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-navy mb-3">Faktureringshistorik</h3>
                <div className="space-y-2">
                  {[
                    { date: '2024-06-01', amount: '895 kr' },
                    { date: '2024-05-01', amount: '895 kr' },
                    { date: '2024-04-01', amount: '495 kr' },
                  ].map((invoice, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-sand/20 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-navy">Faktura #{1000 + i}</p>
                        <p className="text-xs text-graphite/60">{invoice.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-navy">{invoice.amount}</span>
                        <button className="text-xs text-sky hover:text-navy font-medium transition-colors">Ladda ner</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="pt-6 mt-6 border-t border-sand/50 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-navy text-white rounded-full font-medium hover:bg-navy/90 transition-all disabled:opacity-50"
            >
              {saving ? 'Sparar...' : 'Spara ändringar'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
