'use client'

import { useState, useRef, useEffect } from 'react'
import FormField from '@/components/FormField'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ArrowRight, ChevronDown } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  interest: 'buying' | 'selling' | 'partnership' | 'other'
}

const interestOptions = [
  { value: 'buying', label: 'Jag vill köpa', icon: '🛒' },
  { value: 'selling', label: 'Jag vill sälja', icon: '💰' },
  { value: 'partnership', label: 'Samarbete/Partnership', icon: '🤝' },
  { value: 'other', label: 'Övrigt', icon: '💬' },
]

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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const selectedInterest = interestOptions.find(opt => opt.value === formData.interest)

  if (submitted) {
    return (
      <main className="min-h-screen bg-neutral-white py-20 sm:py-32 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white p-12 rounded-lg shadow-card border border-gray-200">
            <div className="w-20 h-20 bg-accent-pink/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-accent-pink" />
            </div>
            <h1 className="text-4xl font-bold text-primary-navy mb-4">Tack för ditt meddelande!</h1>
            <p className="text-lg text-primary-navy leading-relaxed mb-10">
              Vi har tagit emot ditt meddelande och återkommer inom 24 timmar.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false)
                setFormData({ name: '', email: '', phone: '', subject: '', message: '', interest: 'buying' })
              }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Skicka nytt meddelande
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-navy/10 to-accent-pink/10 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-primary-navy mb-6">KONTAKTA OSS</h1>
          <p className="text-2xl text-primary-navy leading-relaxed">
            Vi finns här för att hjälpa dig. Skicka ett meddelande så återkommer vi inom 24 timmar.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-primary-navy mb-8">Kontaktinformation</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-primary-navy mb-1">E-post</h3>
                  <a href="mailto:hej@bolaxo.com" className="text-gray-700 hover:text-accent-pink transition-colors">
                    hej@bolaxo.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-primary-navy mb-1">Telefon</h3>
                  <a href="tel:+46812345678" className="text-gray-700 hover:text-accent-pink transition-colors">
                    +46 (0) 8 123 456 78
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-primary-navy mb-1">Adress</h3>
                  <p className="text-gray-700">
                    Norrmälarstrand 10<br />
                    111 19 Stockholm<br />
                    Sverige
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Clock className="w-6 h-6 text-accent-pink flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-primary-navy mb-1">Öppettider</h3>
                  <p className="text-gray-700">
                    Mån–Fre: 09:00–17:00<br />
                    Lör–Sön: Stängt
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-neutral-off-white p-10 rounded-lg border border-gray-200">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">Namn *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ditt namn"
                    required
                    className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-lg text-primary-navy placeholder-gray-400 focus:outline-none focus:border-[#1F3C58] focus:ring-2 focus:ring-[#1F3C58]/20 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">E-post *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="din@epost.se"
                    required
                    className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-lg text-primary-navy placeholder-gray-400 focus:outline-none focus:border-[#1F3C58] focus:ring-2 focus:ring-[#1F3C58]/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="070-123 45 67"
                    className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-lg text-primary-navy placeholder-gray-400 focus:outline-none focus:border-[#1F3C58] focus:ring-2 focus:ring-[#1F3C58]/20 transition-all shadow-sm"
                  />
                </div>
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-semibold text-primary-navy mb-2">Intresse *</label>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-lg text-primary-navy focus:outline-none focus:border-[#1F3C58] focus:ring-2 focus:ring-[#1F3C58]/20 transition-all shadow-sm flex items-center justify-between hover:border-[#1F3C58]/50"
                  >
                    <span className="flex items-center gap-2">
                      {selectedInterest?.icon && <span>{selectedInterest.icon}</span>}
                      {selectedInterest?.label}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
                      {interestOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData({...formData, interest: option.value as any})
                            setDropdownOpen(false)
                          }}
                          className={`w-full px-5 py-3 text-left flex items-center gap-3 hover:bg-[#1F3C58]/5 transition-colors ${
                            formData.interest === option.value ? 'bg-[#1F3C58]/10 font-semibold' : ''
                          }`}
                        >
                          <span className="text-xl">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-navy mb-2">Ämne *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Vad handlar detta om?"
                  required
                  className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-lg text-primary-navy placeholder-gray-400 focus:outline-none focus:border-[#1F3C58] focus:ring-2 focus:ring-[#1F3C58]/20 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-navy mb-2">Meddelande *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Berätta mer om din fråga..."
                  rows={6}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-lg text-primary-navy placeholder-gray-400 focus:outline-none focus:border-[#1F3C58] focus:ring-2 focus:ring-[#1F3C58]/20 transition-all shadow-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#1F3C58] text-white font-bold rounded-lg hover:bg-[#1F3C58]/90 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Skickar...' : 'Skicka meddelande'}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
