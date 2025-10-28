# Flödesverifikation: Värdering → Annons Skapande

## Status: ✅ FUNGERAR MED NÅGRA ANMÄRKNINGAR

### Process Flöde

#### 1️⃣ VÄRDERING (ValuationWizard)
- **Lagrad i**: localStorage (temporär)
- **API-anrop**: Ingen API-anrop än (simulerad 2-sek delay)
- **Output**: JSON-data + navigering till `/vardering/resultat`
- **Databas**: Inte sparad ännu

```
Steg 1: Grunduppgifter (email, companyName, industry)
    ↓
Steg 2: Finansiell data (revenue, employees, profitMargin)
    ↓
Steg 3: Branschspecifika frågor (dynamisk baserat på industri)
    ↓
Steg 4: Acceptera integritetspolicy
    ↓
Resultat: Visar värdering & möjlighet att skapa annons
```

#### 2️⃣ SKAPA ANNONS (CreateListingWizard)
- **Lagrad i**: PostgreSQL Listing-tabell
- **API-endpoint**: `POST /api/listings`
- **Output**: Listing ID + navigering till `/dashboard/listings`
- **Databas**: ✅ SPARAD

```
Steg 1: Grunduppgifter (email, companyName, industry)
    ↓
Steg 2: Företagsdata (revenue, employees, profitMargin)
    ↓
Steg 3: Branschspecifika frågor (samma som värdering)
    ↓
Steg 4: Annonsinformation (description, strengths, risks)
    ↓
Steg 5: Bilder (valfritt)
    ↓
Steg 6: FÖRHANDSGRANSKNING (visar hur annonsen ser ut)
    ↓
Steg 7: Bekräftelse & Publicering (Pro-paket 4990 kr)
    ↓
Resultat: Annons skapad & publicerad
```

## API-Integration ✅

### POST /api/listings - Skapar annons
**Hanterar:**
- ✅ userId, companyName, industry
- ✅ revenue, priceMin, priceMax, employees
- ✅ description, strengths, risks, whySelling, whatIncluded
- ✅ images, packageType
- ✅ status (auto-publish till 'active' eller 'draft')

**Databaskola:**
```javascript
{
  userId: string,           // required
  companyName?: string,
  anonymousTitle: string,   // required
  industry: string,         // required
  location: string,         // required
  description: string,      // required
  revenue: integer,
  priceMin: integer,
  priceMax: integer,
  employees: integer,
  strengths: string[],      // Array av styrkor
  risks: string[],          // Array av risker
  whySelling?: string,
  whatIncluded?: string,
  images: string[],
  status: 'draft' | 'active',
  packageType: 'basic' | 'pro' | 'pro_plus',
  publishedAt: datetime,
  expiresAt: datetime (baserat på paket)
}
```

## Autentisering ✅

**CreateListingWizard:**
- Använder `useAuth()` context för att hämta `user?.id`
- Skickar `userId` till API:n för att länka annons till användare

**ValuationWizard:**
- Auto-skapar konto om användare inte är inloggad
- Använder `login()` funktionen från AuthContext

## Databaskopa ✅

**Listing-modellen är korrekt:**
```prisma
model Listing {
  id                String
  userId            String        // Länk till User
  companyName       String?
  anonymousTitle    String        // Required
  industry          String        // Required
  location          String        // Required
  description       String        // Required
  strengths         String[]      // Array av styrkor
  risks             String[]      // Array av risker
  whySelling        String?
  whatIncluded      String?
  images            String[]      // Array av bilder
  status            String        // 'draft' | 'active' | 'sold' | 'paused'
  packageType       String        // 'free' | 'basic' | 'pro' | 'pro_plus'
  publishedAt       DateTime?
  expiresAt         DateTime?
  createdAt         DateTime
  updatedAt         DateTime
}
```

## Testning

### Manuell testning - Skapa annons
1. Gå till `/salja/start`
2. Klicka "Starta här"
3. Fyll i alla 7 steg
4. Förhandsgranska på steg 6
5. Bekräfta & publicera på steg 7
6. ✅ Annons sparas i databasen
7. ✅ Redirect till `/dashboard/listings?success=published&id={listingId}`

### Manuell testning - Värdering
1. Gå till `/vardering`
2. Fyll i alla steg
3. ✅ Resultatet visar värdering
4. ✅ Data sparas i localStorage

## Möjliga Förbättringar

1. **Värderingssparande**: Integrera ValueWizard resultat direkt i DB (Valuation-tabell)
   - Skapa endpoint: `POST /api/valuations`
   - Länka valuations till users

2. **Sömlös övergång**: Låt användare gå från värdering direkt till annons-skapning
   - Förfylla fält från värderingen
   - Spara referens till valuation i listing

3. **Varningsmeddelanden**: Lägg till toast-notifikationer för API-fel
   - Implementera error-handling i CreateListingWizard handlePublish

4. **Validering**: Lägg till backend-validering för alle required fields
   - Kontrollera userId existerar
   - Kontrollera industry finns i tillåten lista

## Konklusion

✅ **JA, det fungerar!**

Du kan:
1. Fylla i hela processen för att skapa en annons
2. Se förhandsgranskningen
3. Publicera annonsen
4. Annonsen sparas i databasen
5. Andra användare kan se den i söken

Det enda som saknas är:
- API-anrop från ValuationWizard till databasen (sparas bara i localStorage)
- Men CreateListingWizard fungerar fullt ut med DB
