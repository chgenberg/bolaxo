'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { User, Shield, Bell, CreditCard, Building, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'company', label: 'Företagsuppgifter', icon: Building },
    { id: 'security', label: 'Säkerhet', icon: Shield },
    { id: 'notifications', label: 'Notifieringar', icon: Bell },
    { id: 'billing', label: 'Fakturering', icon: CreditCard },
  ]

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-blue text-primary-blue'
                      : 'border-transparent text-text-gray hover:text-text-dark'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-dark mb-6">Personlig information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Förnamn
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name?.split(' ')[0] || ''}
                        className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Efternamn
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name?.split(' ')[1] || ''}
                        className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        E-postadress
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Telefonnummer
                      </label>
                      <input
                        type="tel"
                        placeholder="+46 70 123 45 67"
                        className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Roll
                      </label>
                      <select className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue">
                        <option value="seller" selected={user?.role === 'seller'}>Säljare</option>
                        <option value="buyer" selected={user?.role === 'buyer'}>Köpare</option>
                        <option value="advisor" selected={user?.role === 'advisor' || user?.role === 'broker'}>Mäklare</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Språk
                      </label>
                      <select className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue">
                        <option value="sv">Svenska</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-semibold text-text-dark mb-4">Profilbild</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-semibold">
                      {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <div>
                      <button className="text-sm text-primary-blue hover:underline">
                        Ladda upp ny bild
                      </button>
                      <p className="text-xs text-text-gray mt-1">JPG, PNG eller GIF. Max 2MB.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-text-dark mb-6">Företagsuppgifter</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Företagsnamn
                    </label>
                    <input
                      type="text"
                      placeholder="ABC Företag AB"
                      className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Organisationsnummer
                    </label>
                    <input
                      type="text"
                      placeholder="556123-4567"
                      className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Adress
                    </label>
                    <input
                      type="text"
                      placeholder="Kungsgatan 1"
                      className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue mb-3"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="111 22"
                        className="px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                      <input
                        type="text"
                        placeholder="Stockholm"
                        className="px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue col-span-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-text-dark mb-6">Säkerhetsinställningar</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-text-dark mb-3">Ändra lösenord</h3>
                    <div className="space-y-3 max-w-md">
                      <input
                        type="password"
                        placeholder="Nuvarande lösenord"
                        className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                      <input
                        type="password"
                        placeholder="Nytt lösenord"
                        className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                      <input
                        type="password"
                        placeholder="Bekräfta nytt lösenord"
                        className="w-full px-3 sm:px-3 sm:px-4 py-2 min-h-10 sm:min-h-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-md font-medium text-text-dark mb-3">Tvåfaktorsautentisering</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-text-dark">BankID</p>
                        <p className="text-xs text-text-gray mt-1">Använd BankID för säker inloggning</p>
                      </div>
                      <button className="text-sm text-primary-blue hover:underline">
                        Aktivera
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-md font-medium text-text-dark mb-3">Inloggningshistorik</h3>
                    <div className="space-y-2">
                      {[
                        { device: 'Chrome - Windows', location: 'Stockholm', time: '2024-06-20 14:32' },
                        { device: 'Safari - iPhone', location: 'Göteborg', time: '2024-06-19 09:15' },
                        { device: 'Firefox - Mac', location: 'Stockholm', time: '2024-06-18 16:45' },
                      ].map((login, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                          <div>
                            <p className="font-medium text-text-dark">{login.device}</p>
                            <p className="text-xs text-text-gray">{login.location} • {login.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-text-dark mb-6">Notifieringsinställningar</h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'email_nda', label: 'NDA-förfrågningar', description: 'När någon vill signera NDA', email: true, push: true },
                    { id: 'email_message', label: 'Nya meddelanden', description: 'När du får ett nytt meddelande', email: true, push: false },
                    { id: 'email_activity', label: 'Aktivitet på annonser', description: 'Visningar, sparningar och andra händelser', email: false, push: true },
                    { id: 'email_newsletter', label: 'Nyhetsbrev', description: 'Tips, nyheter och uppdateringar', email: true, push: false },
                    { id: 'email_deal', label: 'Affärsuppdateringar', description: 'Viktiga milstolpar i dina affärer', email: true, push: true },
                  ].map((setting) => (
                    <div key={setting.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-text-dark">{setting.label}</h3>
                          <p className="text-xs text-text-gray mt-1">{setting.description}</p>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" defaultChecked={setting.email} className="rounded" />
                            <Mail className="w-4 h-4 text-text-gray" />
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" defaultChecked={setting.push} className="rounded" />
                            <Bell className="w-4 h-4 text-text-gray" />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-text-dark mb-6">Fakturering & prenumeration</h2>
                
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-dark">Pro Plan</h3>
                      <p className="text-sm text-text-gray">895 kr/månad</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Aktiv</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-sm text-primary-blue hover:underline">Uppgradera plan</button>
                    <button className="text-sm text-text-gray hover:underline">Avsluta prenumeration</button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-text-dark mb-4">Betalningsmetod</h3>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-primary-blue rounded"></div>
                        <div>
                          <p className="text-sm font-medium text-text-dark">•••• •••• •••• 4242</p>
                          <p className="text-xs text-text-gray">Utgår 12/25</p>
                        </div>
                      </div>
                      <button className="text-sm text-primary-blue hover:underline">Ändra</button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-text-dark mb-4">Faktureringshistorik</h3>
                  <div className="space-y-2">
                    {[
                      { date: '2024-06-01', amount: '895 kr', status: 'Betald' },
                      { date: '2024-05-01', amount: '895 kr', status: 'Betald' },
                      { date: '2024-04-01', amount: '495 kr', status: 'Betald' },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-text-dark">Faktura #{1000 + i}</p>
                          <p className="text-xs text-text-gray">{invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-text-dark">{invoice.amount}</span>
                          <button className="text-xs text-primary-blue hover:underline">Ladda ner</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Sparar...' : 'Spara ändringar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
