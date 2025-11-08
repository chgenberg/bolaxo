# 📱 MOBIL-APP SETUP - SAMMA PROJEKTMAPP

**Datum:** 2025-01-27  
**Beslut:** Bygga mobil-app direkt i samma projektmapp

---

## ✅ STRUKTUR (Enkel Version)

```
bolagsportalen/
├── app/                    # Next.js web-app (befintlig)
├── components/             # Web components (befintlig)
├── lib/                    # Web utilities (befintlig)
├── mobile/                 # React Native + Expo app (NY)
│   ├── app/               # Mobile screens
│   ├── components/        # Mobile components
│   ├── services/          # API services
│   ├── store/            # State management
│   ├── package.json      # Mobile dependencies
│   └── app.json          # Expo config
├── prisma/                # Delad databas (befintlig)
├── package.json           # Root (kan lägga till scripts)
└── ...
```

**Fördelar:**
- ✅ Ingen omorganisering behövs
- ✅ Delar samma git repo
- ✅ Enklare att starta
- ✅ Kan dela types/constants senare om behövs

---

## 🚀 SETUP STEG-FÖR-STEG

### Steg 1: Skapa Mobile-mapp och Initiera Expo

```bash
# I root av projektet
mkdir mobile
cd mobile
npx create-expo-app@latest . --template blank-typescript
```

### Steg 2: Installera Dependencies

```bash
cd mobile
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @tanstack/react-query  # För API state management
npm install expo-secure-store      # För token storage
npm install expo-notifications     # För push notifications
npm install expo-location          # För GPS
npm install expo-image-picker      # För kamera
```

### Steg 3: Skapa Grundstruktur

```
mobile/
├── app/                    # Screens
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── magic-link.tsx
│   ├── (buyer)/
│   │   ├── dashboard.tsx
│   │   ├── matches.tsx
│   │   └── preferences.tsx
│   └── (seller)/
│       ├── dashboard.tsx
│       ├── create-listing.tsx
│       └── manage-listings.tsx
├── components/            # Reusable components
│   ├── ListingCard.tsx
│   ├── ChatBubble.tsx
│   └── NotificationBadge.tsx
├── services/              # API & utilities
│   ├── api.ts           # API client
│   ├── auth.ts          # Authentication
│   └── push.ts          # Push notifications
├── store/               # State management
│   └── authStore.ts
├── types/               # TypeScript types (kan dela med web senare)
│   └── index.ts
├── app.json            # Expo config
├── package.json        # Mobile dependencies
└── tsconfig.json       # TypeScript config
```

### Steg 4: Lägg till Scripts i Root package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:mobile": "cd mobile && npm start",
    "build": "next build",
    "build:mobile": "cd mobile && npm run build"
  }
}
```

---

## 🔗 DELA KOD MELLAN WEB OCH MOBILE

### Alternativ 1: Symlinks (Enkelt)

```bash
# Skapa symlink för types
ln -s ../lib/types mobile/shared-types
```

### Alternativ 2: Kopiera Types (Enklast för start)

```typescript
// mobile/types/listing.ts
// Kopiera från web/lib eller skapa gemensamma types
export interface Listing {
  // ... samma som web
}
```

### Alternativ 3: Shared Mapp (Bäst för långsikt)

```bash
# Skapa shared mapp
mkdir shared
mkdir shared/types
mkdir shared/api
mkdir shared/constants

# Lägg till i både web och mobile package.json
"shared": "file:../shared"
```

---

## 📝 EXEMPEL: MOBILE APP STRUCTURE

### mobile/app.json
```json
{
  "expo": {
    "name": "BOLAXO",
    "slug": "bolaxo-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1F3C58"
    },
    "ios": {
      "bundleIdentifier": "com.bolaxo.app"
    },
    "android": {
      "package": "com.bolaxo.app"
    },
    "plugins": [
      "expo-notifications",
      "expo-location",
      "expo-image-picker"
    ]
  }
}
```

### mobile/services/api.ts
```typescript
const API_BASE_URL = 'https://bolaxo-production.up.railway.app'

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  // Hämta token från SecureStore
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

// Använd samma API endpoints som web
export const listings = {
  getAll: () => apiCall('/api/listings'),
  getById: (id: string) => apiCall(`/api/listings/${id}`),
  create: (data: any) => apiCall('/api/listings', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
```

---

## ✅ FÖRDELAR MED DENNA STRUKTUR

1. **Enkel start** - Ingen omorganisering behövs
2. **Samma repo** - Enklare git workflow
3. **Delad databas** - Samma Prisma schema
4. **Samma API** - Använder samma endpoints
5. **Flexibel** - Kan reorganisera senare om behövs

---

## 🎯 REKOMMENDATION

**Ja, bygg direkt i samma projektmapp!**

**Struktur:**
- Lägg till `mobile/` mapp i root
- Behåll allt annat som det är
- Dela types/constants genom att kopiera eller skapa shared mapp senare

**När att reorganisera:**
- Om projektet växer mycket
- Om ni får fler utvecklare
- Om ni behöver mer struktur

**För nu:** Enkel `mobile/` mapp räcker! 🚀

---

## 📞 NÄSTA STEG

1. ✅ Skapa `mobile/` mapp
2. ✅ Initiera Expo-projekt
3. ✅ Installera dependencies
4. ✅ Skapa grundläggande struktur
5. ✅ Börja bygga MVP!

**Vill du att jag hjälper till att sätta upp mobile-mappen nu?** 🚀

