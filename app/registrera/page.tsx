'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentStore, UserRole } from '@/store/paymentStore'
import FormField from '@/components/FormField'
import { Building, Handshake, Search } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = usePaymentStore()
  
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  
  // Profile data
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
    // Mock email verification
    setEmailVerified(true)
    setStep(2)
  }

  const handleBankId = () => {
    // Mock BankID login
    setEmailVerified(true)
    setStep(2)
  }

  const handleProfileSubmit = () => {
    if (selectedRole === 'broker') {
      // Broker requires BankID
      setStep(3)
    } else {
      // Create user and proceed
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

    // Redirect based on role
    if (selectedRole === 'seller') {
      router.push('/salja/start')
    } else if (selectedRole === 'broker') {
      router.push('/for-maklare')
    } else {
      router.push('/kopare/start')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-light-blue/20 py-16">
      <div className="max-w-2xl mx-auto px-4">
        {step === 1 && (
          <div className="card animate-pulse-soft">
            <h1 className="text-3xl font-bold text-text-dark mb-3 text-center">
              Skapa konto
            </h1>
            <p className="text-text-gray mb-8 text-center">
              Välj vem du är för att komma igång
            </p>

            {/* Role Selection */}
            <div className="space-y-4 mb-8">
              <div
                onClick={() => handleRoleSelect('seller')}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRole === 'seller'
                    ? 'border-primary-blue bg-light-blue'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={selectedRole === 'seller'}
                    onChange={() => handleRoleSelect('seller')}
                    className="mt-1 w-5 h-5 text-primary-blue"
                  />
                  <div className="ml-4 flex items-center">
                    <Building className="w-6 h-6 text-primary-blue mr-3" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Jag vill sälja</h3>
                      <p className="text-sm text-text-gray">
                        Skapa en annons för ditt företag. Kan vara helt anonymt tills NDA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleRoleSelect('broker')}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRole === 'broker'
                    ? 'border-primary-blue bg-light-blue'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={selectedRole === 'broker'}
                    onChange={() => handleRoleSelect('broker')}
                    className="mt-1 w-5 h-5 text-primary-blue"
                  />
                  <div className="ml-4 flex items-center">
                    <Handshake className="w-6 h-6 text-primary-blue mr-3" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Jag är företagsmäklare</h3>
                      <p className="text-sm text-text-gray">
                        Hantera flera annonser åt dina kunder. BankID-verifiering krävs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleRoleSelect('buyer')}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRole === 'buyer'
                    ? 'border-primary-blue bg-light-blue'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={selectedRole === 'buyer'}
                    onChange={() => handleRoleSelect('buyer')}
                    className="mt-1 w-5 h-5 text-primary-blue"
                  />
                  <div className="ml-4 flex items-center">
                    <Search className="w-6 h-6 text-primary-blue mr-3" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Jag är köpare</h3>
                      <p className="text-sm text-text-gray">
                        Sök företag att köpa. Helt gratis att skapa konto och bevaka objekt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedRole && (
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h2 className="font-semibold text-lg mb-4">Logga in eller skapa konto</h2>
                
                <FormField
                  label="E-post"
                  name="email"
                  type="email"
                  placeholder="din@epost.se"
                  value={email}
                  onChange={setEmail}
                  required
                />

                <FormField
                  label="Lösenord"
                  name="password"
                  type="text"
                  placeholder="Minst 8 tecken"
                  value={password}
                  onChange={setPassword}
                  required
                />

                <button
                  onClick={handleEmailPassword}
                  disabled={!email || !password}
                  className="btn-primary w-full"
                >
                  Skapa konto med e-post →
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-text-gray">eller</span>
                  </div>
                </div>

                <button onClick={handleBankId} className="w-full btn-secondary">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  BankID (rekommenderas)
                </button>

                <p className="text-xs text-text-gray text-center">
                  Genom att skapa konto godkänner du våra användarvillkor och integritetspolicy
                </p>
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedRole && (
          <div className="card">
            <h1 className="text-3xl font-bold text-text-dark mb-3">
              Komplettera din profil
            </h1>
            <p className="text-text-gray mb-8">
              {selectedRole === 'seller' && 'Berätta kort om dig och ditt företag'}
              {selectedRole === 'broker' && 'Uppgifter om din mäklarverksamhet'}
              {selectedRole === 'buyer' && 'Dina preferenser (valfritt, hjälper oss ge bättre förslag)'}
            </p>

            <div className="space-y-6">
              <FormField
                label="Ditt namn"
                name="name"
                placeholder="För- och efternamn"
                value={name}
                onChange={setName}
                required
              />

              <FormField
                label="Telefon"
                name="phone"
                placeholder="070-123 45 67"
                value={phone}
                onChange={setPhone}
                required
              />

              {selectedRole === 'seller' && (
                <>
                  <FormField
                    label="Företagsnamn"
                    name="companyName"
                    placeholder="Ex. Nordic Consulting AB"
                    value={companyName}
                    onChange={setCompanyName}
                    tooltip="Kan lämnas tomt om du vill vara helt anonym tills NDA"
                  />

                  <FormField
                    label="Org.nr"
                    name="orgNumber"
                    placeholder="556123-4567"
                    value={orgNumber}
                    onChange={setOrgNumber}
                    tooltip="Valfritt - visas endast efter NDA om du väljer det"
                  />

                  <FormField
                    label="Ort/Region"
                    name="region"
                    placeholder="Ex. Stockholm, Göteborg"
                    value={region}
                    onChange={setRegion}
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
                    onChange={setCompanyName}
                    required
                  />

                  <FormField
                    label="Org.nr"
                    name="orgNumber"
                    placeholder="556123-4567"
                    value={orgNumber}
                    onChange={setOrgNumber}
                    required
                  />

                  <FormField
                    label="Webbplats"
                    name="brokerWebsite"
                    placeholder="https://dinmäklare.se"
                    value={brokerWebsite}
                    onChange={setBrokerWebsite}
                  />

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      BankID-verifiering krävs för mäklarlicens (personlig licensiering)
                    </p>
                  </div>
                </>
              )}

              {selectedRole === 'buyer' && (
                <div className="bg-light-blue p-4 rounded-xl">
                  <p className="text-sm text-text-gray">
                    Som köpare är kontot helt gratis. Du fyller i dina preferenser i nästa steg.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1">
                ← Tillbaka
              </button>
              <button
                onClick={handleProfileSubmit}
                className="btn-primary flex-1"
                disabled={!name || !phone || (selectedRole === 'broker' && (!companyName || !orgNumber))}
              >
                {selectedRole === 'broker' ? 'Fortsätt till BankID' : 'Skapa konto'} →
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedRole === 'broker' && (
          <div className="card text-center">
            <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-text-dark mb-4">
              BankID-verifiering krävs
            </h1>
            <p className="text-text-gray mb-8">
              Mäklarlicenser är personbundna och kräver BankID-verifiering för att säkerställa legitimitet.
            </p>

            <div className="bg-light-blue p-6 rounded-xl mb-8 text-left">
              <h3 className="font-semibold mb-3">Vad som verifieras:</h3>
              <ul className="space-y-2 text-sm text-text-gray">
                <li>• Personlig identitet (personnummer)</li>
                <li>• Koppling till mäklarföretaget</li>
                <li>• Behörighet att teckna avtal</li>
              </ul>
            </div>

            <button onClick={handleBankIdVerification} className="btn-primary w-full mb-4">
              Verifiera med BankID
            </button>

            <button onClick={() => setStep(2)} className="btn-ghost w-full">
              ← Tillbaka
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

