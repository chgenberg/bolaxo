# 📱 MOBIL-APP PROJEKTSTRUKTUR - REKOMMENDATION

**Datum:** 2025-01-27  
**Beslut:** Projektstruktur för mobil-app

---

## 🎯 REKOMMENDATION: MONOREPO (Samma projekt, separata mappar)

**Struktur:**
```
bolagsportalen/
├── web/                    # Next.js web-app (nuvarande kod)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── mobile/                 # React Native + Expo app (NY)
│   ├── app/
│   ├── components/
│   ├── services/
│   └── ...
├── shared/                 # Delad kod (NY)
│   ├── types/             # TypeScript types/interfaces
│   ├── api/               # API client utilities
│   └── constants/         # Konstant värden
├── prisma/                # Delad databas schema
└── package.json           # Root package.json med workspaces
```

---

## ✅ FÖRDELAR MED MONOREPO

### 1. Delad Kod
- ✅ **Types/Interfaces** - Samma TypeScript types för Listing, User, NDA, etc.
- ✅ **API Contracts** - Samma API endpoints och strukturer
- ✅ **Validation Logic** - Delad validering mellan web och mobile
- ✅ **Constants** - Samma konstanter (industries, regions, etc.)

**Exempel:**
```typescript
// shared/types/listing.ts
export interface Listing {
  id: string
  companyName: string
  industry: string
  // ... samma interface för både web och mobile
}

// shared/api/client.ts
export const API_BASE_URL = 'https://bolaxo-production.up.railway.app'
export async function apiCall(endpoint: string, options?: RequestInit) {
  // ... samma API client logik
}
```

### 2. Enklare Synkning
- ✅ API-ändringar synkas automatiskt
- ✅ Types uppdateras på en plats
- ✅ En git history för allt
- ✅ Enklare code review

### 3. Utvecklingsarbetsflöde
- ✅ En `npm install` för allt
- ✅ Enklare att testa API-ändringar mot både web och mobile
- ✅ Delad CI/CD pipeline möjlig

### 4. Kostnadseffektivt
- ✅ En repository
- ✅ Enklare att underhålla
- ✅ Mindre overhead

---

## ❌ NACKDELAR MED MONOREPO

### 1. Större Repository
- ⚠️ Större repo-storlek
- ⚠️ Längre clone-tid (men kan använda shallow clone)

### 2. Mer Komplext Setup
- ⚠️ Behöver workspaces konfiguration
- ⚠️ Mer komplex build-process

---

## 🔄 ALTERNATIV: SEPARAT PROJEKT

**Struktur:**
```
bolagsportalen/          # Web-app
bolagsportalen-mobile/   # Mobil-app (separat repo)
```

### Fördelar:
- ✅ Tydligare separation
- ✅ Oberoende deployment
- ✅ Mindre repo-storlek per projekt

### Nackdelar:
- ❌ Måste synka types manuellt
- ❌ Duplicerad kod (API clients, types)
- ❌ Två repositories att underhålla
- ❌ Svårare att hålla API:er synkade

---

## 🛠️ IMPLEMENTATION: MONOREPO SETUP

### Steg 1: Reorganisera Nuvarande Struktur

```bash
# Skapa ny struktur
mkdir -p web mobile shared/types shared/api shared/constants

# Flytta nuvarande kod till web/
mv app web/
mv components web/
mv lib web/
mv contexts web/
mv store web/
mv utils web/
mv public web/
mv messages web/
mv middleware.ts web/
mv next.config.js web/
mv tailwind.config.ts web/
mv tsconfig.json web/
```

### Steg 2: Skapa Root package.json med Workspaces

```json
{
  "name": "bolagsportalen-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "web",
    "mobile",
    "shared"
  ],
  "scripts": {
    "dev:web": "npm run dev --workspace=web",
    "dev:mobile": "npm run start --workspace=mobile",
    "build:web": "npm run build --workspace=web",
    "build:mobile": "npm run build --workspace=mobile"
  }
}
```

### Steg 3: Skapa Shared Types

```typescript
// shared/types/listing.ts
export interface Listing {
  id: string
  companyName: string
  anonymousTitle: string
  industry: string
  region: string
  revenue: number
  priceMin: number
  priceMax: number
  // ... resten av fälten
}

// shared/types/user.ts
export interface User {
  id: string
  email: string
  name: string
  role: 'seller' | 'buyer' | 'broker'
  // ...
}

// shared/types/index.ts
export * from './listing'
export * from './user'
export * from './nda'
export * from './message'
```

### Steg 4: Skapa Shared API Client

```typescript
// shared/api/client.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  'https://bolaxo-production.up.railway.app'

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getAuthToken() // Implementera token-hämtning
  
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

// shared/api/endpoints.ts
import { apiCall } from './client'
import type { Listing, User, NDARequest } from '../types'

export const listings = {
  getAll: (params?: any) => apiCall('/api/listings', { 
    method: 'GET',
    // Lägg till query params
  }),
  getById: (id: string) => apiCall(`/api/listings/${id}`),
  create: (data: Partial<Listing>) => apiCall('/api/listings', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const buyerProfile = {
  get: (userId: string) => apiCall(`/api/buyer-profile?userId=${userId}`),
  update: (data: any) => apiCall('/api/buyer-profile', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
```

### Steg 5: Uppdatera Web för att Använda Shared

```typescript
// web/lib/api-client.ts (uppdatera)
import { listings, buyerProfile } from '../../shared/api/endpoints'
import type { Listing } from '../../shared/types'

// Använd shared API clients
export async function getListings(): Promise<Listing[]> {
  return listings.getAll()
}
```

### Steg 6: Skapa Mobile App med Shared

```typescript
// mobile/services/api.ts
import { listings, buyerProfile } from '../../shared/api/endpoints'
import type { Listing } from '../../shared/types'

// Samma API clients som web!
export const api = {
  listings,
  buyerProfile
}
```

---

## 📦 PACKAGE.JSON STRUKTUR

### Root package.json
```json
{
  "name": "bolagsportalen-monorepo",
  "private": true,
  "workspaces": ["web", "mobile", "shared"],
  "scripts": {
    "dev": "npm run dev --workspace=web",
    "dev:mobile": "npm run start --workspace=mobile",
    "build": "npm run build --workspace=web",
    "install:all": "npm install && npm install --workspace=web && npm install --workspace=mobile"
  }
}
```

### web/package.json
```json
{
  "name": "bolagsportalen-web",
  "version": "0.1.0",
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "shared": "*"  // Referera till shared workspace
  }
}
```

### mobile/package.json
```json
{
  "name": "bolagsportalen-mobile",
  "version": "0.1.0",
  "dependencies": {
    "expo": "~50.0.0",
    "react-native": "0.73.0",
    "shared": "*"  // Referera till shared workspace
  }
}
```

### shared/package.json
```json
{
  "name": "shared",
  "version": "0.1.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    // Inga dependencies, bara types och utilities
  }
}
```

---

## 🎯 REKOMMENDATION: START MED MONOREPO

**Varför:**
1. ✅ **Delad kod** - Types och API clients delas automatiskt
2. ✅ **Enklare synkning** - API-ändringar synkas direkt
3. ✅ **Bättre DX** - Enklare att utveckla och testa
4. ✅ **Framtiden** - Lättare att lägga till fler plattformar (admin panel, etc.)

**När att välja separat projekt:**
- Om teamet är helt separerat (olika utvecklare)
- Om deployment behöver vara helt oberoende
- Om projektet blir för stort för monorepo

---

## 🚀 NÄSTA STEG

1. **Beslut:** Välj monorepo eller separat projekt
2. **Om monorepo:** Reorganisera struktur (jag kan hjälpa!)
3. **Om separat:** Skapa nytt repo och synka types manuellt

---

## 💡 MITT FÖRSLAG

**Starta med MONOREPO** eftersom:
- Du har redan delad kod (types, API logic)
- Enklare att hålla synkroniserat
- Kan alltid separera senare om det behövs
- Bättre för små/medelstora team

**Vill du att jag hjälper till att reorganisera strukturen?** 🚀

