'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Phone, Mail, User, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ContactFormData {
  name: string
  phone: string
  email: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hej! Jag är din AI-assistent för BOLAXO. Hur kan jag hjälpa dig idag? 🤖',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: ''
  })
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Common questions based on current page
  const getCommonQuestions = () => {
    const baseQuestions = [
      { text: 'Hur fungerar värderingen?', response: 'Vår AI-baserade värdering analyserar ditt företag utifrån flera faktorer som omsättning, bransch, tillväxt och lönsamhet. Du får en professionell värdering på bara 5 minuter - helt gratis! Värderingen baseras på verkliga affärer och branschstandarder.' },
      { text: 'Vad kostar det att sälja?', response: 'Det är gratis att skapa en annons och få värdering! Vi har tre paket: Basic (495 kr/mån), Pro (995 kr/mån) och Enterprise (1995 kr/mån). Du betalar endast när din annons är aktiv. Dessutom finns möjlighet till success-fee på 0,75-1,5% vid genomförd affär.' },
      { text: 'Hur lång tid tar processen?', response: 'Från annons till avslut tar det vanligtvis 90-180 dagar. Värdering tar 5 minuter, NDA-signering 1-2 dagar, due diligence 2-6 veckor och själva transaktionen 60-90 dagar. Vi hjälper dig genom hela processen!' }
    ]

    if (pathname.includes('vardering')) {
      return [
        { text: 'Är värderingen gratis?', response: 'Ja, värderingen är helt gratis och utan förpliktelser! Du får en professionell värdering baserad på AI och verkliga marknadsdata på bara 5 minuter.' },
        ...baseQuestions.slice(1)
      ]
    }

    if (pathname.includes('kopare')) {
      return [
        { text: 'Hur hittar jag rätt företag?', response: 'Vår smarta matchning analyserar dina preferenser och visar företag som passar dig. Du kan filtrera på bransch, region, omsättning och mycket mer. Alla säljare är verifierade med BankID för din trygghet.' },
        { text: 'Vad ser jag innan NDA?', response: 'Innan NDA ser du bransch, region, ungefärlig omsättning, antal anställda och en allmän beskrivning. Efter signerad NDA får du tillgång till företagsnamn, exakta siffror och detaljerad information.' },
        baseQuestions[2]
      ]
    }

    return baseQuestions
  }

  const commonQuestions = getCommonQuestions()

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(text)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Check for common questions
    for (const q of commonQuestions) {
      if (input.includes(q.text.toLowerCase()) || 
          q.text.toLowerCase().includes(input)) {
        return q.response
      }
    }

    // Specific responses
    if (input.includes('hej') || input.includes('hallå')) {
      return 'Hej! Vad kan jag hjälpa dig med idag? 😊'
    }

    if (input.includes('pris') || input.includes('kosta')) {
      return 'Vi har tre prisplaner: Basic (495 kr/mån), Pro (995 kr/mån) och Enterprise (1995 kr/mån). Värdering och att skapa annons är helt gratis! Vill du veta mer om vad som ingår i varje paket?'
    }

    if (input.includes('värdering')) {
      return 'Vår AI-värdering tar bara 5 minuter och är helt gratis! Du får en professionell bedömning baserad på branschstandarder och verkliga affärer. Vill du starta en värdering nu?'
    }

    if (input.includes('sälja')) {
      return 'Perfekt att du vill sälja! Processen är enkel: 1) Gör en gratis värdering, 2) Skapa en annons, 3) Få matchning med köpare, 4) Genomför affären säkert. Ska jag guida dig till värderingen?'
    }

    if (input.includes('köpa') || input.includes('köpare')) {
      return 'Som köpare får du tillgång till verifierade säljare och smarta matchningar. Det är helt gratis för köpare! Du kan filtrera på bransch, region och storlek. Vill du skapa ett köparkonto?'
    }

    if (input.includes('kontakt') || input.includes('hjälp')) {
      return 'Jag hjälper gärna till! Du kan också klicka på "Jag vill bli kontaktad" nedan så ringer vi upp dig. Eller maila oss på kontakt@bolaxo.se.'
    }

    // Default response
    return 'Tack för din fråga! Jag är här för att hjälpa dig med allt som rör företagsförsäljning och köp. Kan du berätta lite mer om vad du behöver hjälp med? Du kan också klicka på "Jag vill bli kontaktad" om du föredrar att prata med en människa.'
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.name || (!contactForm.phone && !contactForm.email)) return

    // Here you would normally send the contact form to your backend
    console.log('Contact form submitted:', contactForm)
    
    setContactFormSubmitted(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowContactForm(false)
      setContactFormSubmitted(false)
      setContactForm({ name: '', phone: '', email: '' })
    }, 3000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-accent-pink to-navy text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
      >
        <div className="flex items-center gap-2 px-4 py-4 md:px-6">
          <MessageCircle className="w-6 h-6" />
          <span className="hidden md:block font-bold">Chatt</span>
        </div>
        
        {/* Pulsing effect */}
        <div className="absolute inset-0 rounded-full bg-accent-pink animate-ping opacity-20" />
      </button>
    )
  }

  return (
    <>
      {/* Chat Window */}
      <div className="fixed bottom-6 right-6 z-40 w-[380px] md:w-[440px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent-pink to-navy text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">BOLAXO Support</h3>
              <p className="text-sm opacity-90">Alltid redo att hjälpa</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-navy text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Common Questions */}
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Vanliga frågor:</p>
          <div className="space-y-2">
            {commonQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(q.text)}
                className="w-full text-left text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {q.text}
              </button>
            ))}
            
            <button
              onClick={() => setShowContactForm(true)}
              className="w-full text-left text-sm px-3 py-2 bg-gradient-to-r from-accent-pink to-navy text-white rounded-lg hover:shadow-md transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Jag vill bli kontaktad
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage(inputValue)
          }} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Skriv ditt meddelande..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-pink"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3 bg-gradient-to-r from-accent-pink to-navy text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {!contactFormSubmitted ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-accent-pink to-navy text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Vi kontaktar dig!</h3>
                  <p className="text-white/90">Fyll i dina uppgifter så ringer vi upp</p>
                </div>

                {/* Form */}
                <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Namn *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-pink focus:outline-none"
                        placeholder="Ditt namn"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonnummer
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-pink focus:outline-none"
                        placeholder="+46 70 123 45 67"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-post
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-pink focus:outline-none"
                        placeholder="din@email.se"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    * Ange minst ett kontaktsätt (telefon eller e-post)
                  </p>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Avbryt
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-pink to-navy text-white rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                      Skicka
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tack!</h3>
                <p className="text-gray-600">
                  Vi kontaktar dig så snart vi har möjlighet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
