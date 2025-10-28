# 🚀 SME SALES AUTOMATION - FULLSTÄNDIG INTEGRERINGSGUIDE

**Status:** Implementation Plan för produktionsfärdig integration
**Datum:** Oktober 2025
**Mål:** One-stop-shop för SME-försäljningsförberedelse

---

## 📋 FÖRKLARING AV ARKITEKTUREN

Din befintliga Bolagsplatsen är en **M&A-marknadsplats** (säljare möter köpare).

Vi lägger till en **SME Automation Suite** som en **inbyggd tool** för säljare PRE-listing:

```
Bolagsplatsen (Marketplace)
│
├─ Säljar-flow (befintlig) → Skapa annons → Publicera
│
└─ NEW: SME Automation Kit (PRE-annons)
   ├─ 1. Identitet & Konto ✓ (Redan gjort)
   ├─ 2. Ekonomi-import (Vi gör nu)
   ├─ 3. Avtalsguide
   ├─ 4. Datarum
   ├─ 5. Teaser & IM
   ├─ 6. NDA-portal
   └─ 7. Advisor Handoff
```

Säljare kan **förbereda sitt företag för försäljning** innan den går till marknadsplatsen.

---

## 🔧 VAD VI HAR BYGGT HITTILLS

### ✅ Prisma Schema (Kompleet)
```
FinancialData    - Ekonomisk data med normalisering
FinancialYear    - År-för-år finansiell info
Agreement        - Avtalskataloger med riskanalys
DataRoom         - Säker dokumentlagring
DataRoomAccess   - Åtkomstlogg (audit trail)
TeaserIM         - Genererade presentationer
NDASignature     - NDA-track och signering
HandoffPack      - Samlar allt för rådgivare
```

### ✅ API-rutter (Kompleet)
- `/api/sme/financials/upload` - Ladda upp ekonomisk data
- `/api/sme/financials/normalize` - Normalisera + add-backs
- `/api/sme/agreements/upload` - Ladda upp avtal
- `/api/sme/dataroom/create` - Skapa datarum-struktur
- `/api/sme/teaser/generate` - Generera teaser/IM
- `/api/sme/nda/send` - Skicka NDA
- `/api/sme/handoff/create` - Skapa handoff-pack

### ✅ Utilities (Kompleet)
- `lib/sme-file-handler.ts` - Filhantering, vattenmärkning, validering

---

## 📊 IMPLEMENTERINGSPRIORITETER (DU GÖR DETTA)

### MODUL 1: EKONOMI-IMPORT ⭐ STARTA HÄR
**Syfte:** Säljare laddar upp Excel/SIE-fil → Vi normaliserar ekonomin

**Filer att skapa:**
```
/app/salja/sme-kit/financials/page.tsx      - Main UI
/components/modules/FinancialUpload.tsx      - Upload-komponent
/components/modules/FinancialNormalization.tsx - Add-backs UI
/components/modules/FinancialViewer.tsx      - Visa ekonomi + grafer
/hooks/useFinancials.ts                      - React Query hooks
```

**Flow:**
1. Säljare laddar upp Excel
2. Backend extraherar data
3. UI visar automatisk normalisering förslag
4. Säljare godkänner/redigerar add-backs
5. Sparar normaliserad EBITDA

**Key Features:**
- Drag-drop upload
- Automatisk Excel-parser (mock-data för nu)
- Add-backs suggestion (ägarlön, engångsposter etc)
- Visualisering av resultat + grafer (Recharts)
- PDF-export av rapport

---

### MODUL 2: AVTALSGUIDE
**Syfte:** Samla alla kritiska avtal, identifiera risker

**UI-flow:**
1. Frågeformulär: "Vilka avtal har ni?"
2. Checkbox-lista: kund, leverantör, anställning, IP, leasing osv
3. Upload per avtal
4. Auto-taggning + riskanalys
5. Sammanfattning av alla risker

**Key Features:**
- Fördefinierad malllista av avtalstyper
- Risk-bedömning (låg/medel/hög)
- Kontrapart-tracking
- Upphörnotice-upptracking

---

### MODUL 3: DATARUM
**Syfte:** Säker dokumentlagring för later NDA-signerare

**UI-flow:**
1. Auto-generera mappstruktur (Ekonomi, Avtal, Juridiskt etc)
2. Drag-drop upload av filer
3. Åtkomstlogg (vem laddat ned vad när)
4. Vattenmärka alla PDFs med "CONFIDENTIAL + user email + tid"

**Key Features:**
- Auto-struktur baserad på svenska M&A-standard
- Audit trail per fil
- Watermark på varje PDF
- Access rules (per köpare begränsningar)

---

### MODUL 4: TEASER & IM
**Syfte:** Skapa professionella presentationer automatiskt

**UI-flow:**
1. Guidat Q&A-formulär med 20-30 frågor
2. Auto-populate från tidigare data (ekonomi, avtal etc)
3. Generera PDF/PPTX
4. Två varianter:
   - **Teaser** - anonymiserad (2-3 sidor)
   - **IM** - fullständig (10-15 sidor)

**Key Features:**
- Server-side PDF-generation (pdfkit)
- Auto-grafer från ekonomi-data
- Professionella layouter
- Versionshantering (draft/final/distributed)

---

### MODUL 5: NDA-PORTAL
**Syfte:** Skicka och spåra NDA-signeringar

**UI-flow:**
1. Säljare väljer köpare att skicka NDA till
2. Pre-fylld standard-NDA-mall
3. Skicka via email
4. Köpare signerar med BankID (mock)
5. Tracking: sent → viewed → signed

**Key Features:**
- Email-link till NDA
- BankID-mock signering
- Automatisk åtkomst-öppning när signerad
- Expire efter 30 dagar

---

### MODUL 6: ADVISOR HANDOFF
**Syfte:** Samla allt och skapa en "übergabe" ZIP för rådgivare

**UI-flow:**
1. Knapp: "Skapa Handoff Pack"
2. System samlar:
   - Latest teaser/IM (PDF)
   - Ekonomi-rapport
   - Avtalslista
   - Datarum-index
   - Komplett metadata

3. Skapar ZIP + övergripande PDF-index
4. Säljare kan dela länk med advisor

**Key Features:**
- Automatisk ZIP-generering
- Metadata-index (vilka filer, fil-storlekar, datum)
- Laddningsbar eller mailbar länk
- Advisor-tracking (vem tog emot, när)

---

## 🎯 IMPLEMENTATION STEG

### STEG 1: KÖRA MIGRATION
```bash
cd /Users/christophergenberg/Desktop/bolagsportalen
npx prisma migrate dev --name add_sme_automation
```

### STEG 2: SKAPA SME KIT HUB PAGE
`/app/salja/sme-kit/page.tsx` - Dashboard med alla 7 moduler, progress-bar

### STEG 3: IMPLEMENTERA MODUL 1-7 SEKVENTIELLT
Börja med **Ekonomi-import**, sedan växla till nästa.

**För varje modul:**
1. Skapa `/app/salja/sme-kit/[module]/page.tsx` (UI)
2. Skapa komponenter i `/components/modules/`
3. Skapa hooks i `/hooks/useSmeData.ts`
4. Integrera befintliga API-rutter

### STEG 4: ANSLUT I SÄLJAR-FLOW
Lägg till "SME Kit"-knapp i `/app/salja/page.tsx` CTA-section

### STEG 5: ADMIN-DASHBOARD
Skapa KPI-tracking i admin-panelen

---

## 🎨 UI-KOMPONENTER - DESIGNPRINCIPER

**Konsistent med deras befintliga design:**
- Färger: `primary-navy`, `accent-pink`, `accent-orange`
- Font: Bold rubriker, regular brödtext
- Layout: Max-width 6xl, centered, mobile-first
- Ikoner: `lucide-react`

**Progress-tracking:**
- Varje modul visas med progress-bar
- Grön för complete, orange för pending, grå för inactive
- Overall progress i header

**Modalt/Linear flow:**
- Guidat formulär
- Steg-för-steg
- "Nästa" knapp för att gå vidare
- Möjlighet att gå tillbaka och redigera

---

## 📱 RESPONSIV DESIGN

**Desktop (lg):** 3 kolumner med moduler, full-width form
**Tablet (md):** 2 kolumner
**Mobile (sm):** 1 kolumn, optimerad touch

---

## 🔐 SÄKERHET

- **Auth:** Använd befintlig JWT från Context
- **RBAC:** Bara säljare (role='seller') kan se SME Kit
- **File access:** Vattenmärkta PDFs, logged åtkomst
- **Audit trail:** All aktivitet loggad i DataRoomAccess

---

## ✅ KONTROLLISTA - INNAN "LIVE"

- [ ] Alla 7 moduler implementerade
- [ ] Alla API-rutter testade
- [ ] Prisma-migration körta
- [ ] UI responsiv på mobile/tablet/desktop
- [ ] Auth-kontroll funkar (bara seller kan se)
- [ ] Vattenmärkning på PDFs
- [ ] Åtkomstlogg sparas
- [ ] Error-handling för failed uploads
- [ ] Loading states för async operations
- [ ] Seed-data för testing (3-5 test-listings)
- [ ] E2E-tester med Cypress (optional men rekommenderat)
- [ ] Performance: <3s load time för moduler

---

## 🚀 NEXT STEPS EFTER MVP

1. **Integration med Bolagsverket API** - Auto-hämta företagsdata
2. **BankID real signering** - Integration med BankID API
3. **S3/Supabase Storage** - Production file storage
4. **Email-notifikationer** - Skicka email vid events
5. **Scrive E-signatur** - Integration för SPA-signing
6. **Q&A Center** - Publikt Q&A-bibliotek för alla användare
7. **Värderingsmultipel-kalkyl** - Avancerad värderingsspann

---

## 📊 KPI ATT TRACKA (ADMIN-PANEL)

```
- Account creation → First SME Kit start (dagar)
- Average time in Financial module (minuter)
- % av säljare som completa full kit
- Teaser/IM generation success rate
- NDA send & signature rate
- Advisor handoff completion rate
- Total businesses prepared via kit (månatligt)
```

---

## 📞 SUPPORT & DEBUGGING

**Om något inte funkar:**

1. Check Prisma schema - `npx prisma studio`
2. Check API responses - F12 → Network tab
3. Check Database - Se att tabeller finns
4. Check Auth - Se att `user.role === 'seller'`
5. Logs - `console.log()` i API routes

---

## 🎯 SLUTLIG INTEGRATION

**Integration i säljar-flow:**

```
Bolagsplatsen
├─ /salja (info-page) ← Lägg till SME Kit CTA
├─ /salja/sme-kit ← NEW: Hub med alla 7 moduler
│  ├─ /sme-kit/financials
│  ├─ /sme-kit/agreements
│  ├─ /sme-kit/dataroom
│  ├─ /sme-kit/teaser
│  ├─ /sme-kit/nda
│  ├─ /sme-kit/handoff
│  └─ /sme-kit/advisor
├─ /salja/start ← Befintlig: Skapa annons (wizard)
└─ /salja/settings ← Befintlig
```

**Arbetsflöde för säljare:**
1. Loggar in → Dashboard
2. Klickar "Förbereda försäljning" → Går till `/salja/sme-kit`
3. Fyller i alla 7 moduler (1-2 timmar)
4. Får komplett handoff-pack
5. Kan sedan gå till `/salja/start` för att publicera annons
6. Köpare hämtar data från marketplace → Kan access dataroom direkt

---

## 🎁 BONUSAR - VÅR HÖG QUALITY COMMITMENT

- 100% TypeScript (type-safe)
- Error boundaries + loading states
- Optimistic UI updates
- Confetti animation när user completes kit 🎉
- Exportable timeline för deal progress
- Mobile-first design
- A11y (accessibility) compliance

FINAL:   
EOF

cat /Users/christophergenberg/Desktop/bolagsportalen/SME_PLATFORM_INTEGRATION.md | head -50
