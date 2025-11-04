# 💬 BOLAXO CHATTFUNKTION - DIUPGÅENDE BESKRIVNING

**Datum:** 2025-01-29  
**Syfte:** Dokumentation för att implementera liknande chattfunktion i annat projekt

---

## 📋 ÖVERSIKT

BOLAXO har **två separata chattfunktioner**:

1. **ChatWidget** - AI-assistent/Customer support (flytande widget längst ner till höger)
2. **Chat** - Person-to-person meddelanden mellan köpare och säljare (efter godkänd NDA)

---

## 🤖 1. CHATWIDGET (AI-Assistent / Customer Support)

### **Vad är det?**
En flytande chatt-widget som syns på alla sidor längst ner till höger. Fungerar som en AI-assistent och customer support-kanal.

### **Placering**
- **Komponent:** `components/ChatWidget.tsx`
- **Integrering:** Importeras i `app/layout.tsx` och renderas på alla sidor
- **Position:** `fixed bottom-4 right-4` (mobil) / `fixed bottom-6 right-6` (desktop)
- **Z-index:** `z-40` (syns över innehåll men under modaler)

**Integration i layout.tsx:**
```tsx
import ChatWidget from '@/components/ChatWidget'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
        <CookieConsent />
        <ChatWidget /> {/* Renderas på alla sidor */}
      </body>
    </html>
  )
}
```

### **Funktionalitet**

#### **1.1 Widget-knapp (När stängd)**
```tsx
- Flytande knapp längst ner till höger
- Ikon: MessageCircle
- Text: "Chatt"
- Pulsing animation-effekt
- Hover-effekt med scale-110
```

#### **1.2 Chat-fönster (När öppen)**
```
Dimensioner:
- Mobil: Fullscreen (w-full h-screen)
- Desktop: 440px bredd, 600px höjd
- Rounded corners: rounded-3xl (desktop)
```

**Delar:**
1. **Header**
   - Titel: "BOLAXO Support"
   - Undertext: "Alltid redo att hjälpa"
   - Stäng-knapp (X)

2. **Meddelanden**
   - Scrollbar container
   - Grupperade meddelanden (user/bot)
   - Typing-indicator när bot svarar
   - Auto-scroll till botten

3. **Vanliga frågor**
   - Visa 3-5 vanliga frågor baserat på aktuell sida
   - Klickbar knapp "Jag vill bli kontaktad"

4. **Input-fält**
   - Text-input med placeholder
   - Send-knapp (ikon)
   - Disabled när inget text

### **1.3 AI-svar-logik**

**Funktion:** `getBotResponse(userInput: string)`

**Svar baseras på:**
- **Vanliga frågor** (från `getCommonQuestions()`)
- **Keywords** i användarens input:
  - "hej"/"hallå" → Generellt svar
  - "pris"/"kosta" → Prisinformation
  - "värdering" → Info om värdering
  - "sälja" → Guide för säljare
  - "köpa"/"köpare" → Info för köpare
  - "kontakt"/"hjälp" → Kontaktinformation
- **Default:** Generellt hjälpsamt svar

**Vanliga frågor per sida:**
- **Generellt:** Värdering, kostnad, process
- **Värdering-sida:** Fokus på värdering
- **Köpare-sida:** Fokus på köpprocess

### **1.4 Kontaktformulär**

**Öppnas när:** Användare klickar "Jag vill bli kontaktad"

**Fält:**
- **Kontaktmetod:** E-post, Telefon, Demo
- **Intresse:** Köpa, Sälja, Partnership, Övrigt
- **Namn:** *Krävs*
- **E-post:** *Krävs om e-post väljs*
- **Telefon:** *Krävs om telefon/demo väljs*
- **Beskrivning:** *Krävs för telefon/demo*
- **Datum:** Välj från nästa 7 dagar (exkl. helger)
- **Tid:** Välj tid (09:00-16:00, 30-minuters intervall)

**Validering:**
- Olika fält krävs beroende på kontaktmetod
- Formulär visas endast när relevant

**Efter submit:**
- Visar success-meddelande
- Stänger formulär efter 3 sekunder
- Resetar formulär

### **1.5 State Management**

```typescript
const [isOpen, setIsOpen] = useState(false)
const [messages, setMessages] = useState<Message[]>([])
const [inputValue, setInputValue] = useState('')
const [isTyping, setIsTyping] = useState(false)
const [showContactForm, setShowContactForm] = useState(false)
const [contactForm, setContactForm] = useState<ContactFormData>({...})
```

### **1.6 Tekniska detaljer**

**Dependencies:**
- React hooks (`useState`, `useEffect`, `useRef`)
- Next.js `usePathname` för att avgöra aktuell sida
- Lucide React icons

**Styling:**
- Tailwind CSS
- Custom colors: `bg-navy`, `text-navy`
- Responsive design (mobile-first)

**Performance:**
- Auto-scroll till botten vid nya meddelanden
- Focus på input när widget öppnas
- Close dropdown när klick utanför

---

## 💬 2. PERSON-TO-PERSON CHAT

### **Vad är det?**
En chattfunktion för kommunikation mellan köpare och säljare efter godkänd NDA.

### **Placering**
- **Komponent:** `components/Chat.tsx`
- **Sidor:** `/kopare/chat` och `/salja/chat`
- **API:** `/api/messages` och `/api/chat/conversations`

### **2.1 Databasstruktur**

**Message Model (Prisma):**
```prisma
model Message {
  id              String   @id @default(cuid())
  listingId      String   // Kopplad till annons
  senderId        String   // Avsändare
  recipientId     String   // Mottagare
  subject         String?  // Valfritt ämne
  content         String   @db.Text
  read            Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  // Relations
  listing         Listing  @relation(...)
  sender          User     @relation("SentMessages", ...)
  recipient       User     @relation("ReceivedMessages", ...)
  
  @@index([listingId])
  @@index([senderId])
  @@index([recipientId])
  @@index([createdAt])
}
```

### **2.2 Säkerhetskontroll**

**Krav för att chatta:**
- ✅ Godkänd NDA mellan köpare och säljare
- ✅ NDA-status: `approved` eller `signed`
- ✅ Kontroll sker i `checkContactPermission()`

**API-validering:**
```typescript
// Kontrollerar om godkänd NDA finns
const approvedNDA = await prisma.nDARequest.findFirst({
  where: {
    buyerId,
    sellerId,
    listingId,
    status: { in: ['approved', 'signed'] }
  }
})
```

### **2.3 API Endpoints**

#### **GET /api/messages**
**Syfte:** Hämta meddelanden för en konversation

**Query parameters:**
- `peerId` - Den andra personens ID
- `listingId` - Valfritt: Filtrera på specifik annons
- `page` - Sidnummer (default: 1)
- `limit` - Antal per sida (default: 50, max: 100)

**Headers:**
- `x-user-id` - Inloggad användares ID

**Response:**
```json
{
  "messages": [
    {
      "id": "string",
      "senderId": "string",
      "recipientId": "string",
      "content": "string",
      "read": boolean,
      "createdAt": "ISO date",
      "sender": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "avatarUrl": "string?"
      },
      "recipient": { ... }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2,
    "hasMore": true
  },
  "unreadCount": 5
}
```

**Funktionalitet:**
- Hämtar meddelanden där användaren är sender eller recipient
- Filtrerar på peerId om angiven
- Filtrerar på listingId om angiven
- Sorterar efter createdAt (desc)
- Returnerar med senders/recipients user-info
- Räknar unread messages

---

#### **POST /api/messages**
**Syfte:** Skicka ett nytt meddelande

**Headers:**
- `x-user-id` - Avsändarens ID
- `Content-Type: application/json`

**Body:**
```json
{
  "recipientId": "string",
  "content": "string",
  "listingId": "string (optional)",
  "subject": "string (optional)"
}
```

**Validering:**
1. Verifierar att användare är inloggad
2. Kontrollerar att `recipientId` och `content` finns
3. Kontrollerar NDA-permission (via `checkContactPermission`)
4. Rate limiting (via `checkRateLimit`)

**Response:**
```json
{
  "message": {
    "id": "string",
    "senderId": "string",
    "recipientId": "string",
    "content": "string",
    "read": false,
    "createdAt": "ISO date",
    "sender": { ... },
    "recipient": { ... }
  }
}
```

**Felhantering:**
- `400` - Saknade fält
- `401` - Ej autentiserad
- `403` - Ingen NDA-permission
- `429` - Rate limit överskriden

---

#### **PATCH /api/messages**
**Syfte:** Markera meddelanden som lästa

**Headers:**
- `x-user-id` - Användarens ID
- `Content-Type: application/json`

**Body:**
```json
{
  "ids": ["message-id-1", "message-id-2"]
}
```

**Funktionalitet:**
- Markerar endast meddelanden där användaren är recipient
- Uppdaterar `read` till `true`
- Returnerar antal uppdaterade meddelanden

---

#### **GET /api/chat/conversations**
**Syfte:** Hämta alla konversationer för en användare

**Headers:**
- `x-user-id` - Användarens ID

**Response (Köpare):**
```json
{
  "conversations": [
    {
      "peerId": "seller-id",
      "peerName": "Seller Name",
      "peerRole": "seller",
      "listingId": "listing-id",
      "listingTitle": "Company Name",
      "lastMessage": "Senaste meddelandet...",
      "lastMessageTime": "ISO date",
      "unread": 2
    }
  ]
}
```

**Response (Säljare):**
```json
{
  "conversations": [
    {
      "peerId": "buyer-id",
      "peerName": "Buyer Name",
      "peerRole": "buyer",
      "listingId": "listing-id",
      "listingTitle": "Company Name",
      "lastMessage": "Senaste meddelandet...",
      "lastMessageTime": "ISO date",
      "unread": 3,
      "approved": true
    }
  ],
  "contactRequests": [
    {
      "buyerId": "buyer-id",
      "buyerName": "Buyer Name",
      "buyerEmail": "buyer@email.com",
      "listingId": "listing-id",
      "listingTitle": "Company Name",
      "ndaStatus": "pending",
      "requestDate": "ISO date",
      "message": "Optional message"
    }
  ]
}
```

**Logik:**
- **För köpare:** Hittar alla godkända NDAs → Listar konversationer med säljare
- **För säljare:** Hittar alla godkända NDAs → Listar konversationer med köpare + Pending NDA requests

---

### **2.4 Chat-komponenten**

**Props:**
```typescript
interface ChatProps {
  currentUserId: string
  currentUserAvatar?: string
  peerId: string
  peerName: string
  peerAvatar?: string
  peerRole: string
  listingId?: string
  listingTitle?: string
}
```

**Funktionalitet:**

#### **State:**
```typescript
const [messages, setMessages] = useState<Message[]>([])
const [newMessage, setNewMessage] = useState('')
const [loading, setLoading] = useState(true)
const [sending, setSending] = useState(false)
const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(false)
const [unreadCount, setUnreadCount] = useState(0)
```

#### **Funktioner:**

**1. fetchMessages()**
- Hämtar meddelanden från API
- Pagination support (50 per sida)
- Auto-markerar nya meddelanden som lästa
- Uppdaterar unread count

**2. sendMessage()**
- Validerar att meddelande inte är tomt
- Skickar POST till `/api/messages`
- Lägger till nytt meddelande i state
- Scrollar till botten
- Error handling (visar alert vid 403)

**3. markAsRead(ids[])**
- Markerar flera meddelanden som lästa
- PATCH till `/api/messages`

**4. formatTime(dateString)**
- Formaterar tid baserat på hur gammal:
  - < 24h: "HH:MM"
  - < 48h: "Igår HH:MM"
  - > 48h: "DD MMM"

**5. groupMessagesByDate(messages)**
- Grupperar meddelanden per datum
- Returnerar objekt med datum som key

#### **Polling:**
```typescript
useEffect(() => {
  fetchMessages()
  const interval = setInterval(fetchMessages, 5000) // Poll var 5:e sekund
  return () => clearInterval(interval)
}, [page])
```

#### **UI-struktur:**

**Header:**
- Peer avatar/initials
- Peer name
- Peer role (Säljare/Köpare)
- Listing title
- Action buttons (Phone, Video, Info, More)

**Meddelanden:**
- Grupperade per datum med separator
- Visar avatar endast för första meddelandet från samma person
- Olika styling för egen/andras meddelanden
- Read receipts (Check/CheckCheck ikoner)
- Timestamp per meddelande
- Empty state om inga meddelanden

**Input:**
- Text input med placeholder
- Send-knapp (ikon)
- Disabled när skickar eller tomt
- Auto-focus när öppnas

### **2.5 Chat-sidor**

#### **Köpare (`/kopare/chat`)**
**Struktur:**
- Vänster: Lista med konversationer
- Höger: Chat-fönster för vald konversation

**Konversationslista:**
- Visar alla konversationer från `/api/chat/conversations`
- Visar peer name, listing title, last message preview
- Unread badge om olästa meddelanden
- Empty state: "Signera en NDA för att börja chatta"

**Chat-fönster:**
- Visar `Chat`-komponenten när konversation vald
- Empty state: "Välj en konversation för att börja chatta"

#### **Säljare (`/salja/chat`)**
- Liknande struktur som köpare
- Kan även visa pending NDA requests

---

## 🔐 SÄKERHET & PERMISSIONS

### **NDA-kontroll**
```typescript
async function checkContactPermission(buyerId: string, sellerId: string, listingId?: string) {
  const approvedNDA = await prisma.nDARequest.findFirst({
    where: {
      buyerId,
      sellerId,
      listingId,
      status: { in: ['approved', 'signed'] }
    }
  })
  return !!approvedNDA
}
```

**Används i:**
- POST /api/messages - Kontrollerar innan meddelande skickas
- Om ingen NDA → 403 Forbidden

### **Rate Limiting**
- Använder `checkRateLimit()` från `@/app/lib/rate-limiter`
- Rate limit config: `RATE_LIMIT_CONFIGS.general`
- Returnerar 429 om överskriden

### **Autentisering**
- User ID från header: `x-user-id`
- Verifieras i `verifyUserAuth()`
- Returnerar 401 om ej autentiserad

---

## 📱 RESPONSIVE DESIGN

### **ChatWidget**
- **Mobil:** Fullscreen
- **Desktop:** 440px × 600px, flytande längst ner till höger

### **Chat (Person-to-person)**
- **Mobil:** Stackad layout (konversationer ovanför chat)
- **Desktop:** Side-by-side (konversationer vänster, chat höger)

---

## 🎨 DESIGN & UX

### **Färger**
- **Primary:** `primary-navy` (#1F3C58)
- **Background:** `bg-gray-50` för meddelanden
- **Own message:** `bg-primary-navy text-white`
- **Other message:** `bg-white border border-gray-200`

### **Ikoner**
- Lucide React icons
- MessageCircle, Send, Check, CheckCheck, Phone, Video, etc.

### **Animeringar**
- Smooth scroll till botten
- Typing indicator med bouncing dots
- Hover-effekter på knappar
- Transition på dropdowns

---

## 🔄 REAL-TIME UPPDATERINGAR

### **Polling-strategi**
- **ChatWidget:** Ingen polling (statisk AI-chat)
- **Person-to-person Chat:** Polling var 5:e sekund
  ```typescript
  setInterval(fetchMessages, 5000)
  ```

### **Optimeringar**
- Auto-markera som läst när öppnas
- Pagination för att ladda fler meddelanden
- Reverse sorting (äldsta först i UI)

---

## 📊 MESSAGE FLOW

### **Skicka meddelande:**
```
1. Användare skriver meddelande
2. Klickar Send
3. POST /api/messages
4. API kontrollerar NDA
5. API skapar Message i databas
6. API returnerar skapat meddelande
7. Frontend lägger till i state
8. Auto-scroll till botten
```

### **Läsa meddelanden:**
```
1. Komponenten mountar
2. fetchMessages() körs
3. GET /api/messages?peerId=...
4. API returnerar meddelanden + pagination
5. Frontend visar meddelanden
6. Auto-markera olästa som lästa
7. Polling startar (var 5:e sekund)
```

---

## 🛠️ IMPLEMENTATION CHECKLIST

För att implementera liknande i annat projekt:

### **Backend (API)**
- [ ] Skapa Message model i databas
- [ ] Implementera GET /api/messages (med pagination)
- [ ] Implementera POST /api/messages (med permission check)
- [ ] Implementera PATCH /api/messages (mark as read)
- [ ] Implementera GET /api/chat/conversations
- [ ] Rate limiting på alla endpoints
- [ ] Autentisering (user ID från header/session)

### **Frontend (Components)**
- [ ] ChatWidget-komponent (AI-assistent)
- [ ] Chat-komponent (Person-to-person)
- [ ] Chat-sida med konversationslista
- [ ] State management (useState hooks)
- [ ] Polling för real-time updates
- [ ] Auto-mark as read
- [ ] Responsive design

### **Features**
- [ ] Message grouping per datum
- [ ] Read receipts
- [ ] Unread count badges
- [ ] Typing indicators
- [ ] Auto-scroll
- [ ] Empty states
- [ ] Error handling

### **Security**
- [ ] Permission checks (NDA eller liknande)
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] User authentication

---

## 📝 EXEMPEL IMPLEMENTATION

### **Minimal ChatWidget**
```tsx
'use client'
import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  return (
    <>
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 z-40">
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="fixed bottom-0 right-0 z-40 w-full md:w-[440px] h-[600px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl">
          {/* Header, Messages, Input */}
        </div>
      )}
    </>
  )
}
```

### **Minimal Chat API**
```typescript
// GET /api/messages
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const peerId = request.searchParams.get('peerId')
  
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: peerId },
        { senderId: peerId, recipientId: userId }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: { sender: true, recipient: true }
  })
  
  return NextResponse.json({ messages: messages.reverse() })
}

// POST /api/messages
export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const { recipientId, content } = await request.json()
  
  // Permission check här
  
  const message = await prisma.message.create({
    data: {
      senderId: userId,
      recipientId,
      content
    },
    include: { sender: true, recipient: true }
  })
  
  return NextResponse.json({ message })
}
```

---

## 🔍 KEY TAKEAWAYS

1. **Två separata system:** AI-assistent vs Person-to-person
2. **Permission-based:** Ingen chatt utan godkänd NDA
3. **Polling:** 5 sekunders intervall för real-time känsla
4. **Pagination:** Ladda 50 meddelanden per sida
5. **Auto-read:** Markera som läst när öppnas
6. **Rate limiting:** Skydda mot spam
7. **Responsive:** Olika layouts för mobil/desktop

---

**Dokument skapat:** 2025-01-29  
**För:** BOLAXO Development Team & External Projects
