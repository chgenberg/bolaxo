'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentStore, UserRole } from '@/store/paymentStore'
import FormField from '@/components/FormField'
import { Building, Handshake, Search, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = usePaymentStore()
  
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [orgNumber, setOrgNumber] = useState('')
  const [region, setRegion] = useState('')
  const [brokerWebsite, setBrokerWebsite] = useState('')

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleEmailPassword = () => {
    setEmailVerified(true)
    setStep(2)
  }

  const handleBankId = () => {
    setEmailVerified(true)
    setStep(2)
  }

  const handleProfileSubmit = () => {
    if (selectedRole === 'broker') {
      setStep(3)
    } else {
      createUserAndProceed(false)
    }
  }

  const handleBankIdVerification = () => {
    createUserAndProceed(true)
  }

  const createUserAndProceed = (bankIdVerified: boolean) => {
    const user = {
      email,
      role: selectedRole!,
      verified: emailVerified,
      bankIdVerified,
      name,
      phone,
      companyName: companyName || undefined,
      orgNumber: orgNumber || undefined,
      region: region || undefined,
      brokerWebsite: brokerWebsite || undefined,
    }

    setUser(user)

    // In development: also save to database via dev-login endpoint
    if (process.env.NODE_ENV === 'development') {
      fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: selectedRole,
          name: name || email.split('@')[0]
        })
      }).catch(err => console.error('Failed to sync user to DB:', err))
    }

    if (selectedRole === 'seller') {
      router.push('/salja/start')
    } else if (selectedRole === 'broker') {
      router.push('/for-maklare')
    } else {
      router.push('/kopare/start')
    }
  }

  return (
    <main className="min-h-screen bg-neutral-white py-8 sm:py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {step === 1 && (
          <div className="bg-white p-8 sm:p-12 rounded-lg shadow-card border border-gray-200">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-primary-navy mb-2 uppercase">SKAPA KONTO</h1>
              <p className="text-lg text-primary-navy">
                Välj din roll för att komma igång
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-4 mb-10">
              {/* Seller */}
              <div
                onClick={() => handleRoleSelect('seller')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'seller'
                    ? 'border-accent-pink bg-accent-pink/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div>
                    <input
                      type="radio"
                      checked={selectedRole === 'seller'}
                      onChange={() => handleRoleSelect('seller')}
                      className="w-5 h-5 accent-accent-pink"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="w-6 h-6 text-primary-navy" />
                      <h3 className="text-lg font-bold text-primary-navy">Jag vill sälja</h3>
                    </div>
                    <p className="text-gray-700">
                      Skapa en annons för ditt företag. Kan vara helt anonymt tills NDA.
                    </p>
                  </div>
                </div>
              </div>

              {/* Broker */}
              <div
                onClick={() => handleRoleSelect('broker')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'broker'
                    ? 'border-accent-pink bg-accent-pink/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div>
                    <input
                      type="radio"
                      checked={selectedRole === 'broker'}
                      onChange={() => handleRoleSelect('broker')}
                      className="w-5 h-5 accent-accent-pink"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Handshake className="w-6 h-6 text-primary-navy" />
                      <h3 className="text-lg font-bold text-primary-navy">Jag är mäklare</h3>
                    </div>
                    <p className="text-gray-700">
                      Hantera flera annonser åt dina kunder. BankID-verifiering krävs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buyer */}
              <div
                onClick={() => handleRoleSelect('buyer')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'buyer'
                    ? 'border-accent-pink bg-accent-pink/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div>
                    <input
                      type="radio"
                      checked={selectedRole === 'buyer'}
                      onChange={() => handleRoleSelect('buyer')}
                      className="w-5 h-5 accent-accent-pink"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Search className="w-6 h-6 text-primary-navy" />
                      <h3 className="text-lg font-bold text-primary-navy">Jag är köpare</h3>
                    </div>
                    <p className="text-gray-700">
                      Sök företag att köpa. Helt gratis att skapa konto och bevaka objekt.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedRole && (
              <div className="space-y-6 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-primary-navy">Logga in eller skapa konto</h2>
                
                <FormField
                  label="E-postadress"
                  name="email"
                  type="email"
                  placeholder="din@epost.se"
                  value={email}
                  onValueChange={setEmail}
                  required
                />

                <FormField
                  label="Lösenord"
                  name="password"
                  type="text"
                  placeholder="Minst 8 tecken"
                  value={password}
                  onValueChange={setPassword}
                  required
                />

                <button
                  onClick={handleEmailPassword}
                  disabled={!email || !password}
                  className="w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  Skapa konto med e-post
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-600 font-medium">eller</span>
                  </div>
                </div>

                <button 
                  onClick={handleBankId} 
                  className="w-full py-3 px-6 border-2 border-accent-orange text-primary-navy font-bold rounded-lg hover:bg-primary-navy/5 transition-all inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  BankID (rekommenderas)
                </button>

                <p className="text-xs text-gray-600 text-center">
                  Genom att skapa konto godkänner du våra användarvillkor och integritetspolicy
                </p>
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedRole && (
          <div className="bg-white p-8 sm:p-12 rounded-lg shadow-card border border-gray-200">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-primary-navy mb-2">Komplettera profil</h1>
              <p className="text-lg text-primary-navy">
                {selectedRole === 'seller' && 'Berätta kort om dig och ditt företag'}
                {selectedRole === 'broker' && 'Uppgifter om din mäklarverksamhet'}
                {selectedRole === 'buyer' && 'Dina preferenser (valfritt, hjälper oss ge bättre förslag)'}
              </p>
            </div>

            <div className="space-y-6">
              <FormField
                label="Ditt namn"
                name="name"
                placeholder="För- och efternamn"
                value={name}
                onValueChange={setName}
                required
              />

              <FormField
                label="Telefon"
                name="phone"
                placeholder="070-123 45 67"
                value={phone}
                onValueChange={setPhone}
                required
              />

              {selectedRole === 'seller' && (
                <>
                  <FormField
                    label="Företagsnamn"
                    name="companyName"
                    placeholder="Ex. Nordic Consulting AB"
                    value={companyName}
                    onValueChange={setCompanyName}
                    tooltip="Kan lämnas tomt om du vill vara helt anonym tills NDA"
                  />

                  <FormField
                    label="Org.nr"
                    name="orgNumber"
                    placeholder="556123-4567"
                    value={orgNumber}
                    onValueChange={setOrgNumber}
                    tooltip="Valfritt - visas endast efter NDA om du väljer det"
                  />

                  <FormField
                    label="Ort/Region"
                    name="region"
                    placeholder="Ex. Stockholm, Göteborg"
                    value={region}
                    onValueChange={setRegion}
                  />
                </>
              )}

              {selectedRole === 'broker' && (
                <>
                  <FormField
                    label="Företag (Mäklarfirma)"
                    name="companyName"
                    placeholder="Ex. Stockholm Business Advisors AB"
                    value={companyName}
                    onValueChange={setCompanyName}
                    required
                  />

                  <FormField
                    label="Org.nr"
                    name="orgNumber"
                    placeholder="556123-4567"
                    value={orgNumber}
                    onValueChange={setOrgNumber}
                    required
                  />

                  <FormField
                    label="Webbplats"
                    name="brokerWebsite"
                    placeholder="https://dinmäklare.se"
                    value={brokerWebsite}
                    onValueChange={setBrokerWebsite}
                  />

                  <div className="bg-primary-navy/5 border border-primary-navy/20 p-5 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary-navy flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary-navy">
                      BankID-verifiering krävs för mäklarlicens (personlig licensiering)
                    </p>
                  </div>
                </>
              )}

              {selectedRole === 'buyer' && (
                <div className="bg-accent-pink/5 p-5 rounded-lg border border-accent-pink/20 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-pink flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-primary-navy">
                    Som köpare är kontot helt gratis. Du fyller i dina preferenser i nästa steg.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setStep(1)} 
                className="flex-1 py-3 px-6 border-2 border-primary-navy text-primary-navy font-bold rounded-lg hover:bg-primary-navy/5 transition-all inline-flex items-center justify-center gap-2"
              >
                ← Tillbaka
              </button>
              <button
                onClick={handleProfileSubmit}
                disabled={!name || !phone || (selectedRole === 'broker' && (!companyName || !orgNumber))}
                className="flex-1 py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {selectedRole === 'broker' ? 'Fortsätt till BankID' : 'Skapa konto'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedRole === 'broker' && (
          <div className="bg-white p-8 sm:p-12 rounded-lg shadow-card border border-gray-200 text-center">
            <div className="w-20 h-20 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-primary-navy mb-3">BankID-verifiering</h1>
            <p className="text-lg text-primary-navy mb-8">
              Mäklarlicenser är personbundna och kräver BankID-verifiering för att säkerställa legitimitet.
            </p>

            <div className="bg-primary-navy/5 p-6 rounded-lg mb-8 text-left border border-primary-navy/20">
              <h3 className="font-bold text-primary-navy mb-4">Vad som verifieras:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-navy flex-shrink-0 mt-0.5" />
                  <span>Personlig identitet (personnummer)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-navy flex-shrink-0 mt-0.5" />
                  <span>Koppling till mäklarföretaget</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-navy flex-shrink-0 mt-0.5" />
                  <span>Behörighet att teckna avtal</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleBankIdVerification} 
                className="w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
              >
                Verifiera med BankID
                <ArrowRight className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setStep(2)} 
                className="w-full py-3 px-6 border-2 border-primary-navy text-primary-navy font-bold rounded-lg hover:bg-primary-navy/5 transition-all inline-flex items-center justify-center gap-2"
              >
                ← Tillbaka
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

