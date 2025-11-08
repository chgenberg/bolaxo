# 📱 MOBIL-APP STRATEGI - BOLAXO

**Datum:** 2025-01-27  
**Status:** Planeringsfas

---

## 🎯 ÖVERSIKT

Skapa en mobil-app som ger användare snabb åtkomst till de viktigaste funktionerna från hemsidan, med fokus på:
- **Köpare:** Notifikationer när matchningar hittas
- **Säljare:** Skapa och hantera annonser på språng
- **Båda:** Snabb kommunikation och uppdateringar

---

## 🛠️ TEKNISKA LÖSNINGAR

### Alternativ 1: React Native + Expo (REKOMMENDERAT) ⭐

**Fördelar:**
- ✅ Delar kod med Next.js (React)
- ✅ En kodbas för iOS och Android
- ✅ Expo ger push-notifikationer out-of-the-box
- ✅ Snabb utveckling och deployment
- ✅ Kan använda befintliga API:er direkt
- ✅ Hot reload för snabb utveckling

**Teknisk stack:**
```
React Native + Expo
├── Expo Router (navigation)
├── React Query (API state management)
├── Expo Notifications (push notifications)
├── Expo SecureStore (authentication tokens)
└── React Native Paper / NativeBase (UI components)
```

**Kostnad:** ~$0-99/månad (Expo EAS Build)

---

### Alternativ 2: Progressive Web App (PWA)

**Fördelar:**
- ✅ Ingen app store approval behövs
- ✅ Samma kodbas som web
- ✅ Snabbare att lansera
- ✅ Uppdateras automatiskt

**Nackdelar:**
- ❌ Begränsade push-notifikationer (iOS)
- ❌ Mindre native-feel
- ❌ Begränsad åtkomst till device features

**Teknisk stack:**
```
Next.js PWA
├── next-pwa (service worker)
├── Web Push API (notifications)
└── Web App Manifest
```

**Kostnad:** $0 (inget extra)

---

### Alternativ 3: Native (Swift + Kotlin)

**Fördelar:**
- ✅ Bästa prestanda
- ✅ Full åtkomst till device features
- ✅ Bästa UX

**Nackdelar:**
- ❌ Två separata kodbaser
- ❌ Längre utvecklingstid
- ❌ Dyrare att underhålla

**Kostnad:** Högre utvecklingskostnad

---

## 🎯 REKOMMENDATION: React Native + Expo

**Varför:**
1. **Snabb utveckling** - Kan återanvända mycket logik från Next.js
2. **Push-notifikationer** - Expo Notifications fungerar perfekt för matchningar
3. **En kodbas** - iOS och Android samtidigt
4. **Befintliga API:er** - Alla endpoints fungerar direkt
5. **Kostnadseffektivt** - Expo free tier räcker för start

---

## 📋 FUNKTIONALITET - DETALJERAD PLAN

### 1. KÖPARE-FUNKTIONER ✅

#### A. Sökkriterier & Preferenser
**Vad:**
- Ställa in sökkriterier (regioner, branscher, prisintervall)
- Uppdatera preferenser när som helst
- Se matchningsscore för varje objekt

**API:**
- `POST /api/buyer-profile` - Spara preferenser
- `GET /api/buyer-profile?userId=` - Hämta preferenser

**UI Flow:**
```
Onboarding → Preferenser → Dashboard → Notifikationer
```

#### B. Push-notifikationer för matchningar 🚨
**Vad:**
- Notifikation när nytt objekt matchar kriterierna
- Notifikation när NDA godkänns
- Notifikation när säljare svarar på meddelande

**Teknisk lösning:**
```typescript
// Backend: Skapa endpoint för push tokens
POST /api/push-tokens
{
  userId: string,
  token: string, // Expo push token
  platform: 'ios' | 'android'
}

// Backend: Skicka push när matchning hittas
// I /api/matches eller separat webhook
import { Expo } from 'expo-server-sdk'
const expo = new Expo()
await expo.sendPushNotificationsAsync([{
  to: buyerPushToken,
  sound: 'default',
  title: 'Ny matchning hittad! 🎯',
  body: `${listingTitle} matchar dina kriterier (${matchScore}%)`,
  data: { listingId, type: 'match' }
}])
```

**Implementation:**
1. Användare loggar in → Spara push token
2. Backend kollar matchningar varje timme (eller real-time)
3. När matchning hittas → Skicka push
4. Användare klickar → Öppna app → Visa objekt

#### C. Objektvisning & NDA
**Vad:**
- Bläddra genom matchningar
- Se matchningsscore
- Signera NDA direkt i appen
- Se full info efter NDA-godkännande

**API:**
- `GET /api/listings` - Lista objekt
- `GET /api/listings/[id]` - Objektdetaljer
- `POST /api/nda-requests` - Skapa NDA-förfrågan
- `GET /api/nda-requests` - Kolla NDA-status

#### D. Sparade objekt
**Vad:**
- Spara objekt för senare
- Se sparade objekt
- Ta bort från sparade

**API:**
- `POST /api/saved-listings` - Spara objekt
- `GET /api/saved-listings` - Hämta sparade
- `DELETE /api/saved-listings` - Ta bort

---

### 2. SÄLJARE-FUNKTIONER ✅

#### A. Skapa annons via app
**Vad:**
- Stegvis guide (samma som web)
- Foto-uppladdning från kamera
- Snabb förhandsgranskning
- Publicera direkt

**API:**
- `POST /api/listings` - Skapa annons
- `POST /api/upload-image` - Ladda upp bilder
- `GET /api/listings/[id]` - Förhandsgranska

**UI Flow:**
```
Ny annons → Steg 1-7 → Förhandsgranska → Publicera → Betalning
```

**Förbättringar för mobil:**
- Kamera-integration för bilder
- GPS för automatisk plats
- Snabbare formulär med autocomplete

#### B. Hantera annonser
**Vad:**
- Se alla annonser
- Aktivera/pausa annonser
- Se statistik (visningar, NDA-förfrågningar)
- Redigera annonser

**API:**
- `GET /api/listings?userId=` - Hämta annonser
- `PUT /api/listings/[id]` - Uppdatera annons
- `PUT /api/listings/[id]/status` - Ändra status

#### C. NDA-förfrågningar
**Vad:**
- Se nya NDA-förfrågningar
- Godkänna/avslå direkt
- Se köparprofil innan godkännande

**API:**
- `GET /api/nda-requests?userId=&role=seller` - Hämta förfrågningar
- `PATCH /api/nda-requests/[id]` - Godkänn/avslå

#### D. Push-notifikationer för säljare 🚨
**Vad:**
- Notifikation när ny NDA-förfrågan kommer
- Notifikation när köpare skickar meddelande
- Notifikation när matchning hittas för deras annonser

---

### 3. GEMENSAMMA FUNKTIONER ✅

#### A. Meddelanden/Chat
**Vad:**
- Real-time chat med köpare/säljare
- Push-notifikationer för nya meddelanden
- Se konversationshistorik

**API:**
- `GET /api/messages` - Hämta meddelanden
- `POST /api/messages` - Skicka meddelande
- `GET /api/chat/conversations` - Hämta konversationer

**Teknisk lösning:**
- WebSocket eller polling varje 5 sekunder
- Push-notifikation när nytt meddelande kommer

#### B. Autentisering
**Vad:**
- Magic link login (samma som web)
- Biometrisk login (Face ID / Touch ID)
- Auto-login med secure token storage

**API:**
- `POST /api/auth/magic-link/send` - Skicka magic link
- `POST /api/auth/magic-link/verify` - Verifiera

**Teknisk lösning:**
```typescript
// Expo SecureStore för tokens
import * as SecureStore from 'expo-secure-store'

// Spara token efter login
await SecureStore.setItemAsync('authToken', token)

// Auto-login vid app-start
const token = await SecureStore.getItemAsync('authToken')
if (token) {
  // Verifiera token och logga in automatiskt
}
```

#### C. Dashboard
**Vad:**
- Snabb översikt över aktivitet
- Statistik och insights
- Snabbnavigation till viktiga funktioner

---

## 🚀 REKOMMENDERADE FEATURES UTÖVER DET NÄMNDA

### 1. Offline-läge 📴
**Vad:**
- Cacha sparade objekt och meddelanden
- Läsa meddelanden offline
- Synka när internet kommer tillbaka

**Varför:** Användare kan vara på resa eller ha dålig uppkoppling

---

### 2. Quick Actions (Widgets) 🎯
**Vad:**
- iOS/Android widgets för snabb åtkomst
- "Skapa ny annons" widget
- "Senaste matchningar" widget

**Varför:** Snabbare åtkomst utan att öppna appen

---

### 3. Kamera-integration 📸
**Vad:**
- Ta bilder direkt i appen för annonser
- OCR för att läsa kvitton/fakturor
- QR-kod scanning för snabb inloggning

**Varför:** Förbättrar UX för säljare som skapar annonser

---

### 4. Location Services 📍
**Vad:**
- Automatisk plats för annonser
- Visa objekt på karta
- "Nära mig" filter för köpare

**Varför:** Geografisk relevans är viktigt

---

### 5. Biometrisk säkerhet 🔐
**Vad:**
- Face ID / Touch ID för login
- Biometrisk verifiering för känsliga åtgärder (NDA-signering)

**Varför:** Säkerhet och bekvämlighet

---

### 6. Dark Mode 🌙
**Vad:**
- Mörkt tema för bättre läsbarhet
- Följer systeminställningar

**Varför:** Modern standard, bättre UX

---

### 7. Share Functionality 📤
**Vad:**
- Dela objekt via länkar
- Dela annonser på sociala medier
- Invite friends funktionalitet

**Varför:** Viral growth och marknadsföring

---

### 8. In-App Notifikationer 🔔
**Vad:**
- In-app notifikationscenter
- Badge count på ikoner
- Kategorisering av notifikationer

**Varför:** Bättre UX än bara push

---

### 9. Analytics & Insights 📊
**Vad:**
- Se statistik för annonser
- Matchningsanalys för köpare
- Aktivitetsoverview

**Varför:** Användare vill se värde och framsteg

---

### 10. Snabbvärdering 🧮
**Vad:**
- Snabb värdering direkt i appen
- Se värderingsresultat direkt
- Dela värdering via appen

**Varför:** Viktig funktion som ska vara tillgänglig

---

## 🏗️ ARKITEKTUR

### Backend (Befintlig)
```
Next.js API Routes
├── /api/auth/* - Autentisering
├── /api/buyer-profile - Köparpreferenser
├── /api/listings - Annonser
├── /api/nda-requests - NDA
├── /api/messages - Meddelanden
├── /api/matches - Matchningar
└── /api/push-tokens - Push tokens (NY)
```

### Frontend (Ny mobil-app)
```
React Native + Expo
├── /screens
│   ├── Auth (Login, Magic Link)
│   ├── Buyer (Dashboard, Matches, Saved)
│   ├── Seller (Dashboard, Create Listing, Manage)
│   └── Shared (Messages, Profile, Settings)
├── /components
│   ├── ListingCard
│   ├── ChatBubble
│   └── NotificationBadge
├── /services
│   ├── api.ts (API calls)
│   ├── push.ts (Push notifications)
│   └── auth.ts (Authentication)
└── /store
    └── Zustand stores (state management)
```

---

## 📱 IMPLEMENTATION ROADMAP

### Fas 1: MVP (4-6 veckor) 🎯
**Prioritet:** Högsta

1. **Setup & Autentisering** (1 vecka)
   - [ ] Expo projekt setup
   - [ ] Magic link login
   - [ ] Token storage (SecureStore)
   - [ ] Auto-login

2. **Köpare - Grundläggande** (1.5 veckor)
   - [ ] Preferenser-formulär
   - [ ] Matchningar-lista
   - [ ] Objektvisning
   - [ ] NDA-signering
   - [ ] Push-notifikationer för matchningar

3. **Säljare - Grundläggande** (1.5 veckor)
   - [ ] Skapa annons (förenklad version)
   - [ ] Hantera annonser
   - [ ] NDA-förfrågningar
   - [ ] Push-notifikationer

4. **Meddelanden** (1 vecka)
   - [ ] Chat-gränssnitt
   - [ ] Meddelande-lista
   - [ ] Push-notifikationer för meddelanden

---

### Fas 2: Förbättringar (3-4 veckor) 🚀
**Prioritet:** Medel

1. **Offline-läge**
   - [ ] Caching av data
   - [ ] Offline-läsning
   - [ ] Sync när online

2. **Kamera & Media**
   - [ ] Foto-uppladdning från kamera
   - [ ] Bildgalleri
   - [ ] Image compression

3. **Location Services**
   - [ ] GPS-integration
   - [ ] Karta-visning
   - [ ] "Nära mig" filter

4. **UI/UX Förbättringar**
   - [ ] Dark mode
   - [ ] Animations
   - [ ] Loading states
   - [ ] Error handling

---

### Fas 3: Avancerat (4-6 veckor) ⭐
**Prioritet:** Låg

1. **Widgets**
   - [ ] iOS widgets
   - [ ] Android widgets

2. **Biometrisk säkerhet**
   - [ ] Face ID / Touch ID
   - [ ] Biometrisk verifiering

3. **Analytics**
   - [ ] In-app analytics
   - [ ] Insights dashboard

4. **Share & Social**
   - [ ] Dela objekt
   - [ ] Social media integration

---

## 🔧 TEKNISK IMPLEMENTATION

### Push Notifikationer Setup

#### Backend (Next.js)
```typescript
// app/api/push-tokens/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Expo } from 'expo-server-sdk'

const expo = new Expo()

// Spara push token
export async function POST(request: NextRequest) {
  const { userId, token, platform } = await request.json()
  
  // Spara i databas (lägg till PushToken model i Prisma)
  await prisma.pushToken.upsert({
    where: { userId },
    update: { token, platform },
    create: { userId, token, platform }
  })
  
  return NextResponse.json({ success: true })
}

// Skicka push (använd i matchning/webhook)
export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data: any
) {
  const pushToken = await prisma.pushToken.findUnique({
    where: { userId }
  })
  
  if (!pushToken || !Expo.isExpoPushToken(pushToken.token)) {
    return
  }
  
  await expo.sendPushNotificationsAsync([{
    to: pushToken.token,
    sound: 'default',
    title,
    body,
    data,
    priority: 'high'
  }])
}
```

#### Frontend (React Native)
```typescript
// services/push.ts
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

export async function registerForPushNotifications(userId: string) {
  if (!Device.isDevice) {
    return null
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    return null
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data

  // Spara token till backend
  await fetch('/api/push-tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      token,
      platform: Platform.OS
    })
  })

  return token
}
```

---

### API Integration

```typescript
// services/api.ts
const API_BASE_URL = 'https://bolaxo-production.up.railway.app'

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = await SecureStore.getItemAsync('authToken')
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

// Användning
export const buyerProfile = {
  get: (userId: string) => apiCall(`/api/buyer-profile?userId=${userId}`),
  update: (data: any) => apiCall('/api/buyer-profile', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
```

---

## 💰 KOSTNAD & RESURSER

### Utveckling
- **React Native Developer:** 2-3 månader (1 utvecklare)
- **Design:** 2-3 veckor (UI/UX)
- **Testing:** 2-3 veckor (QA)

### Löpande kostnader
- **Expo EAS Build:** $0-99/månad (free tier räcker för start)
- **Push Notifications:** $0 (Expo ingår)
- **App Store:** $99/år (Apple), $25 engångs (Google)

### Totalt
- **Utveckling:** ~3-4 månader
- **Månadskostnad:** ~$100-200 (beroende på trafik)

---

## 📊 MÄTPUNKTER FÖR FRAMGÅNG

### Köpare
- Antal sparade objekt
- Antal NDA-signeringar från app
- Antal matchningar som öppnas
- Push-notifikation open rate

### Säljare
- Antal annonser skapade via app
- Antal NDA-förfrågningar hanterade
- Meddelanden skickade via app

### Generellt
- DAU/MAU (Daily/Monthly Active Users)
- App retention rate
- Crash rate
- Average session time

---

## 🎯 REKOMMENDATION: START MED MVP

**Fokusera på:**
1. ✅ Köpare: Preferenser + Push-notifikationer för matchningar
2. ✅ Säljare: Skapa annons + Hantera NDA-förfrågningar
3. ✅ Meddelanden: Basic chat

**Skippa initialt:**
- Widgets
- Offline-läge (kan läggas till senare)
- Avancerad analytics

**Varför:** Snabbare till marknad, testa konceptet, iterera baserat på feedback

---

## 📞 NÄSTA STEG

1. **Beslut:** Välj React Native + Expo (rekommenderat)
2. **Setup:** Skapa Expo-projekt och grundläggande struktur
3. **Backend:** Lägg till `/api/push-tokens` endpoint
4. **MVP:** Implementera Fas 1 (4-6 veckor)
5. **Test:** Beta-testning med 10-20 användare
6. **Launch:** Publicera i App Store och Google Play

---

**Status:** Plan klar, redo att börja implementera när beslut är taget! 🚀

