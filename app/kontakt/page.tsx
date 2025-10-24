'use client'

import { useState } from 'react'
import FormField from '@/components/FormField'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  interest: 'buying' | 'selling' | 'partnership' | 'other'
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    interest: 'buying'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background-off-white py-6 sm:py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 text-center">
          <div className="bg-white p-12 rounded-2xl shadow-card">
            <div className="w-20 h-20 bg-light-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-primary-blue" />
            </div>
            <h1 className="heading-2 mb-4">Tack för ditt meddelande!</h1>
            <p className="text-text-gray text-lg mb-8">
              Vi har tagit emot ditt meddelande och återkommer inom 24 timmar.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  subject: '',
                  message: '',
                  interest: 'buying'
                })
              }}
              className="btn-secondary"
            >
              Skicka ett nytt meddelande
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background-off-white py-6 sm:py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4">Kontakta oss</h1>
          <p className="text-lg text-text-gray max-w-2xl mx-auto">
            Vi finns här för att hjälpa dig med alla frågor om företagsförmedling. 
            Hör av dig så återkommer vi inom 24 timmar.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-card h-full">
              <h2 className="heading-3 mb-6">Kontaktinformation</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-text-dark">Telefon</p>
                    <p className="text-text-gray">08-123 456 78</p>
                    <p className="text-sm text-text-gray mt-1">Måndag-fredag 9-17</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-text-dark">E-post</p>
                    <p className="text-text-gray">info@bolagsplatsen.se</p>
                    <p className="text-sm text-text-gray mt-1">support@bolagsplatsen.se</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-text-dark">Besöksadress</p>
                    <p className="text-text-gray">Stureplan 15</p>
                    <p className="text-text-gray">114 35 Stockholm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-text-dark">Svarstid</p>
                    <p className="text-text-gray">Vanligtvis inom 2-4 timmar</p>
                    <p className="text-sm text-text-gray mt-1">Senast inom 24 timmar</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Cards */}
              <div className="mt-8 space-y-3">
                <div className="bg-light-blue p-4 rounded-xl">
                  <p className="font-semibold text-primary-blue mb-1">För säljare</p>
                  <p className="text-sm text-text-gray">Få gratis värdering av ditt företag</p>
                </div>
                
                <div className="bg-light-blue p-4 rounded-xl">
                  <p className="font-semibold text-primary-blue mb-1">För köpare</p>
                  <p className="text-sm text-text-gray">Boka personlig genomgång</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-card">
              <h2 className="heading-3 mb-6">Skicka meddelande</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6">
                <FormField
                  label="Namn"
                  value={formData.name}
                  onValueChange={(value) => setFormData({ ...formData, name: value })}
                  required
                />
                
                <FormField
                  label="E-post"
                  type="email"
                  value={formData.email}
                  onValueChange={(value) => setFormData({ ...formData, email: value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6">
                <FormField
                  label="Telefon (valfritt)"
                  type="tel"
                  value={formData.phone || ''}
                  onValueChange={(value) => setFormData({ ...formData, phone: value })}
                />
                
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Jag är intresserad av
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value as ContactFormData['interest'] })}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                  >
                    <option value="buying">Att köpa företag</option>
                    <option value="selling">Att sälja företag</option>
                    <option value="partnership">Partnerskap/Mäklare</option>
                    <option value="other">Annat</option>
                  </select>
                </div>
              </div>

              <FormField
                label="Ämne"
                value={formData.subject}
                onValueChange={(value) => setFormData({ ...formData, subject: value })}
                placeholder="Vad gäller ditt ärende?"
                required
                className="mb-6"
              />

              <div className="mb-8">
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Meddelande
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-3 sm:px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all resize-none"
                  placeholder="Beskriv ditt ärende..."
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Skickar...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Skicka meddelande
                    </>
                  )}
                </button>
                
                <p className="text-sm text-text-gray">
                  Vi hanterar dina uppgifter enligt vår{' '}
                  <a href="/juridiskt/integritetspolicy" className="text-primary-blue hover:underline">
                    integritetspolicy
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-3 sm:gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary-blue" />
              </div>
              <h3 className="font-semibold text-text-dark mb-2">Live Chat</h3>
              <p className="text-sm text-text-gray mb-4">
                Chatta direkt med våra rådgivare vardagar 9-17
              </p>
              <button className="btn-secondary text-sm">
                Starta chat
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary-blue" />
              </div>
              <h3 className="font-semibold text-text-dark mb-2">Boka samtal</h3>
              <p className="text-sm text-text-gray mb-4">
                Boka tid för telefonmöte med våra experter
              </p>
              <button className="btn-secondary text-sm">
                Boka tid
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary-blue" />
              </div>
              <h3 className="font-semibold text-text-dark mb-2">Nyhetsbrev</h3>
              <p className="text-sm text-text-gray mb-4">
                Få tips och nyheter om företagsöverlåtelser
              </p>
              <button className="btn-secondary text-sm">
                Prenumerera
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
