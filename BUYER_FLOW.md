# Köparflödet - Dokumentation

## 🎯 Komplett köparresa

Köparen leds från första kontakt till LOI genom 10 steg:

```
Hero (köpare-tab) → Skapa konto → Verifiering → Sök & filter → 
Objektdetaljer → NDA-signering → Datarum & Q&A → Jämföra → LOI → Bevakningar
```

## 📍 Sidor & URL:er

### 1. Hero-sida (/)
**Mål:** Få köparen att skapa konto och börja söka

**Innehåll:**
- Tab-toggle mellan "Jag vill sälja" / "Jag vill köpa"
- Rubrik: "Hitta rätt företag att köpa"
- Trust row: Verifierade profiler • BankID • Datarum light
- CTA: [Skapa konto] [Sök företag]
- 3 feature-kort: Filter, Verifierade uppgifter, Bevakningar

### 2. Info-sida (/kopare)
**Mål:** Förklara processen för köpare

**Innehåll:**
- 7-stegs process (från konto till LOI)
- "Varför Bolagsplatsen?" - 4 fördelar
- Trygghet & sekretess - punktlista
- CTA: [Skapa konto nu]

### 3. Skapa konto (/kopare/start)
**Mål:** Samla preferenser för matching

**Formulär:**
- Region(er): Chips för val av flera
- Bransch(er): Chips för val av flera
- Storlek: Min/max omsättning
- Köpartyp: Operativ / Finansiell
- E-post-bevakningar: Checkbox

**CTA:** [Skapa konto →]

### 4. Verifiering (/kopare/verifiering)
**Mål:** Öka trovärdighet med BankID

**Innehåll:**
- BankID-verifiering (stor highlighted box)
- LinkedIn-länk (valfritt)
- Bolagsinfo (valfritt)
- Förklaring: Varför verifiering?

**CTA:** [Verifiera med BankID] [Hoppa över nu]

### 5. Sök & filter (/sok)
**Mål:** Hitta rätt objekt

**Layout:**
- Vänster sidebar: Filters (sortering, region, bransch, omsättning, EBITDA)
- Höger grid: ObjectCard-komponenter (2 kolumner desktop, 1 mobil)
- Sticky jämförelsepanel: "Jämför (2/4)" när objekt valda

**ObjectCard innehåller:**
- Badges: Ny, Verifierad, Mäklare
- Titel (anonymiserad)
- Quick facts: Typ, Region, Omsättning, Anställda
- Beskrivning (2 rader)
- Prisidé (highlighted)
- Knappar: [Spara] [Jämför] [Be om NDA]

### 6. Objektdetalj (/objekt/{id})
**Mål:** Ge översikt före NDA

**Tabs:**
- Översikt: Beskrivning, grundinfo, (låst företagsnamn/adress om ingen NDA)
- Ekonomi: Range-siffror ELLER exakta (om NDA)
- Styrkor & Risker: Listor med checkmarks/varningar

**NDA-notice (om inte signerad):**
- Gul banner: "Vissa uppgifter är låsta"
- [Be om NDA →]

**Efter NDA:**
- Grön banner med upplåsta fält
- Link till datarum
- CTA: [Gå till datarum & Q&A] [Skapa LOI]

**Sticky mobile nav:**
- [Be om NDA] [Ställ fråga]

### 7. NDA-signering (/nda/{id})
**Mål:** Signera sekretessavtal

**3 steg:**

**Steg 1:** Sammanfattning av villkor
- Scrollbar med NDA-text
- Checkbox: "Jag förstår villkoren"
- [Fortsätt till signering →]

**Steg 2:** Välj metod
- BankID (rekommenderas) - stor highlighted card
- Manuell signering - sekundär card
- [Signera med BankID] [Signera manuellt]

**Steg 3:** Bekräftelse
- Grön success-ikon
- "NDA skickad! Säljaren godkänner inom 24-48h"
- Info om vad som händer nu
- [Fortsätt söka] [Tillbaka till objektet]

### 8. Datarum & Q&A (/objekt/{id}/datarum)
**Mål:** Ställa frågor och granska dokument

**Kräver:** NDA signerad

**Tabs:**
- **Q&A:**
  - Formulär: Ställ en fråga (textarea + [Skicka])
  - Trådar: Tidigare frågor med svar
  - Pinnande: Viktiga svar markeras av säljare
  
- **Datarum:**
  - Info-banner: Vattenmärkning & loggning
  - Mappar: Ekonomi, Avtal, Personal
  - Filer: Namn, storlek, datum, [Ladda ner]
  - [Be om fler dokument] → går till Q&A

**Bottom CTA:**
- "Redo att lämna bud?" → [Skapa LOI]

### 9. Jämförelse (/jamfor)
**Mål:** Jämföra 2-4 objekt sida vid sida

**Desktop:**
- Tabell med fält i rader, objekt i kolumner
- Fält: Typ, Region, Omsättning, Anställda, Pris, Styrkor, Risker
- Actions per objekt: [Se detaljer] [Be om NDA] [Ta bort]

**Mobile:**
- Kort per objekt med key facts
- [Detaljer] [NDA] knappar

**Header:**
- "2 av 4 objekt i jämförelse"
- [Rensa alla] [Lägg till fler]

### 10. LOI-formulär (/objekt/{id}/loi)
**Mål:** Skapa indikativt bud

**Kräver:** NDA signerad

**Formulär:**
- **Prisförslag:** Min/Max (MSEK)
- **Överlåtelsesätt:** Radio - Aktier / Inkråm
- **Önskat tillträde:** Datum eller Q
- **Finansiering:** Dropdown (Eget / Lån / Mix / Earn-out)
- **DD-omfattning:** Dropdown (Light / Standard / Full)
- **Villkor:** Textarea för förbehåll
- **Tidsplan:** Textarea för milestones

**Advisory-box:**
- "Behöver du rådgivare?"
- [Boka rådgivare →]

**Actions:**
- [📄 Ladda ner utkast (PDF)] [📨 Skicka LOI]

## 🧩 Komponenter

### ObjectCard
**Props:** `object: BusinessObject`

**Innehåll:**
- Badges (Ny, Verifierad, Mäklare)
- Anonymiserad titel (link till detalj)
- 2x2 grid med quick facts
- Description (2 rader)
- Prisidé (highlighted box)
- Visningar
- Action buttons med state från Zustand

**Interaktivitet:**
- Toggle spara/jämföra med visual feedback
- Disabled jämför om redan 4 st

### SearchFilters
**Props:** `onFilterChange: (filters) => void`

**Innehåll:**
- Sortering: Dropdown
- Region: Chips (multi-select)
- Bransch: Chips (multi-select)
- Omsättning: Min/Max inputs
- EBITDA: Min/Max inputs
- [Rensa alla filter]

**Mobile:**
- Collapsed by default
- [Visa filter] toggle-knapp

### ObjectDetailCard
(Används inte som separat komponent - integrerat i page)

### CompareTable
(Integrerat i /jamfor page)

## 🔄 State Management (Zustand)

### buyerStore.ts

```typescript
interface BuyerPreferences {
  regions: string[]
  industries: string[]
  revenueMin/Max: string
  ebitdaMin/Max: string
  buyerType: 'operational' | 'financial'
  emailAlerts: boolean
}

interface BuyerProfile {
  verified: boolean
  bankIdVerified: boolean
  linkedInUrl: string
  companyInfo: string
}

Actions:
- updatePreferences()
- updateProfile()
- toggleSaved(objectId)
- toggleCompare(objectId) // max 4
- toggleShortlist(objectId)
- signNDA(objectId)
- clearCompare()
- save/loadFromLocalStorage()
```

**Arrays:**
- `savedObjects: string[]` - Sparade favoriter
- `compareList: string[]` - Max 4 för jämförelse
- `shortlist: string[]` - Privata anteckningar
- `ndaSignedObjects: string[]` - Objekt med NDA-access

## 📊 Mock Data

### mockObjects.ts

5 exempel-objekt:
1. IT-konsultbolag Stockholm (verifierad, ny)
2. E-handel Göteborg (verifierad, mäklare)
3. Restaurang Malmö
4. SaaS-företag Stockholm (verifierad, mäklare)
5. Bygg Uppsala

**Varje objekt har:**
- Anonymiserad titel & beskrivning
- Public data: typ, region, ranges
- Locked data (efter NDA): företagsnamn, org.nr, adress, exakta siffror
- Styrkor & risker
- Meta: verified, broker, isNew, views

**Helper-funktioner:**
- `getObjectById(id)`
- `searchObjects(filters)` - filtrering & sortering

## 🎨 Design Patterns

### Before/After NDA
Konsekvent genom hela flödet:
- Före: Anonymiserad titel, ranges, 🔒-ikoner
- Efter: Företagsnamn, exakta siffror, grön unlock-banner

### Verification Badges
- BankID ✓ - Grön badge
- "Verifierad köpare" - Visar i profil
- Ökad synlighet i sökning

### Mobile Optimization
- Sticky bottom nav på objektdetalj
- Filters collapsed som default
- Touch-friendly button sizes
- Responsive grids (1 col mobile, 2-3 desktop)

## 🔔 Notifikationer (Placeholder)

**E-post triggers:**
- Nya objekt matchar dina filter
- NDA godkänd av säljare
- Nytt svar i Q&A
- Nytt dokument i datarum
- Veckosammanfattning

**UI placeholders:**
- Dashboard: "3 nya NDA-godkännanden"
- Notification bell i header (framtida)

## 📱 User Flow Examples

### Happy Path: Första köpet
1. Landet på Hero → tab "Jag vill köpa"
2. [Skapa konto] → fyller i preferenser
3. [Verifiera med BankID] → får "Verifierad köpare" badge
4. Söker → filtrerar på Stockholm + SaaS
5. Ser objekt → klickar detaljer
6. [Be om NDA] → signerar med BankID
7. Väntar 1 dag → får mail "NDA godkänd"
8. Går till datarum → läser finansiella rapporter
9. Ställer 3 frågor i Q&A → får svar
10. [Skapa LOI] → fyller i bud
11. [Skicka LOI] → säljaren tar kontakt

### Quick Browse
1. [Sök företag] från Hero
2. Bläddrar objekt → sparar 3 st
3. Lägger 2 i jämförelse
4. [Jämför] → ser skillnader
5. Väljer det bästa → [Be om NDA]

### Shortlist & Share
1. Sparar 5 objekt över tid
2. Dashboard → "Mina sparade"
3. Väljer 3 → lägger i shortlist
4. [Dela] → skickar till partner/team

## 🚀 Nästa Steg (Produktion)

- [ ] Backend för objects & user management
- [ ] Real BankID integration
- [ ] PDF-generering för LOI
- [ ] E-post notifications
- [ ] File upload i datarum
- [ ] Watermarking av PDFs
- [ ] Activity log (vem laddade ner vad)
- [ ] Video call integration för "Boka samtal"
- [ ] Rådgivare marketplace
- [ ] Payment för premium features

