# 🚀 BOLAXO - KOMPLETT STARTKLAR CHECKLIST

**Datum:** 2025-10-29  
**Status:** Pre-Launch Full Flow Verification

---

## ✅ FLOW 1: SÄLJARE - KOMPLETT JOURNEY

### Steg 1.1: Registrering som Säljare

**Route:** `/registrera` eller `/login`

1. **Magic Link Registrering:**
   - Gå till `/login` eller `/registrera`
   - Välj "Jag vill sälja"
   - Ange email: `test@seller.com`
   - Klicka "Skicka magic link"
   - **Verifiera:** Magic link skapas i `/api/auth/magic-link/send`
   - **Check:** Console loggar magic link eller email skickas

2. **Alternativ: Direkt Registrering:**
   - Gå till `/registrera`
   - Välj roll: "Säljare"
   - Fyll i formulär (email, namn, telefon, etc.)
   - **Verifiera:** Sparas i database via `/api/auth/dev-login` (dev) eller `/api/auth/magic-link/send`

**Expected Result:** ✅ Användare skapad, redirect till `/salja/start`

---

### Steg 1.2: Bolagsvärdering (Optional)

**Route:** `/vardering`

1. **Starta värdering:**
   - Klicka "Starta värdering" på `/vardering`
   - Fyll i ValuationWizard:
     - Steg 1: Om bolaget (bransch, omsättning, EBITDA)
     - Steg 2: Kunder & kanaler
     - Steg 3: Tillgångar & risk
     - Steg 4: Tillväxt & plan

2. **Verifiera API:**
   - Post till `/api/valuation`
   - **Verifiera:** Värdering skapas och sparas i database
   - **Check:** Resultat visas med värderingsintervall

**Expected Result:** ✅ Värdering genererad, sparad i database

---

### Steg 1.3: Skapa Annons

**Route:** `/salja/start`

1. **Starta Wizard:**
   - Klicka "Starta här" eller öppna `/salja/start`
   - CreateListingWizard öppnas

2. **Fyll i 7 steg:**

   **Steg 1: Grundinformation**
   - Company Name: "TestBolag AB"
   - Org Number: "559000-0001"
   - Industry: Välj bransch
   - Website: "https://testbolag.se"
   - Location: "Stockholm"
   - **Verifiera:** Progress bar visar ~14%

   **Steg 2: Finansiell Data**
   - Revenue: "5000000"
   - Revenue Range: "5-10 MSEK"
   - EBITDA: "1000000"
   - Price Min: "2000000"
   - Price Max: "5000000"
   - Employees: "11-25"
   - **Verifiera:** Progress bar visar ~28%

   **Steg 3: Beskrivning**
   - Description: "Ett framgångsrikt tech-bolag..."
   - Strengths: Fyll i 3 styrkor
   - Risks: Fyll i 3 risker
   - Why Selling: "Ny ägare sökes"
   - **Verifiera:** Progress bar visar ~42%

   **Steg 4: Media (Optional)**
   - Ladda upp bilder (valfritt)
   - **Verifiera:** Progress bar visar ~57%

   **Steg 5: NDA-inställningar**
   - Välj vad som ska vara låst före NDA
   - **Verifiera:** Progress bar visar ~71%

   **Steg 6: Paketval**
   - Välj Basic/Featured/Premium
   - **Verifiera:** Progress bar visar ~85%

   **Steg 7: Förhandsvisning & Publicera**
   - Granska all information
   - Klicka "Publicera"
   - **Verifiera:** POST till `/api/listings`
   - **Check:** Listing skapad med status 'active'

**Expected Result:** ✅ Annons publicerad, redirect till `/salja/klart` eller dashboard

---

## ✅ FLOW 2: KÖPARE - KOMPLETT JOURNEY

### Steg 2.1: Registrering som Köpare

**Route:** `/registrera` eller `/login`

1. **Magic Link Registrering:**
   - Gå till `/login` eller `/registrera`
   - Välj "Jag vill köpa"
   - Ange email: `test@buyer.com`
   - Klicka "Skicka magic link"
   - **Verifiera:** Magic link skapas

2. **Komplettera Profil:**
   - Efter inloggning, fyll i `/kopare/start`:
     - Steg 1: Personlig info
     - Steg 2: Budget & Erfarenhet
     - Steg 3: Preferences (region, bransch)
     - Steg 4: Sammanfattning

**Expected Result:** ✅ Köpare registrerad, profil komplett

---

### Steg 2.2: Söka Annonser

**Route:** `/sok`

1. **Sök & Filtrera:**
   - Gå till `/sok`
   - Använd sökfält eller filter:
     - Region: Stockholm
     - Bransch: Tech & IT
     - Omsättning: 5-10 MSEK
   - **Verifiera:** GET `/api/listings` med filters
   - **Check:** Listings visas (anonymiserade före NDA)

2. **Spara Intressanta:**
   - Klicka "Spara" på en listing
   - **Verifiera:** POST `/api/saved-listings`
   - **Check:** Listing sparas i köparens lista

**Expected Result:** ✅ Listings visas, kan sparas

---

### Steg 2.3: Visa Objektdetaljer

**Route:** `/objekt/[id]`

1. **Före NDA:**
   - Klicka på en listing
   - **Verifiera:** Anonymiserad information visas
   - **Check:** Företagsnamn/adress är dolda
   - **Check:** Gul banner: "Vissa uppgifter är låsta"

2. **Efter NDA:**
   - När NDA är godkänd, samma sida
   - **Verifiera:** Full information visas
   - **Check:** Grön banner: "NDA godkänd"

**Expected Result:** ✅ Objektdetaljer visas korrekt

---

### Steg 2.4: Begär & Signera NDA

**Route:** `/nda/[id]`

1. **Begär NDA:**
   - På objekt-sidan, klicka "Signera NDA"
   - Eller gå till `/nda/[id]`

2. **NDA-signering Flow:**

   **Steg 1: Läs NDA**
   - NDA-text visas
   - Fyll i "Varför är du intresserad?" (valfritt)
   - Checkbox: "Jag förstår villkoren"
   - Klicka "Fortsätt"

   **Steg 2: Signera**
   - Välj "Signera med BankID" (mock)
   - Eller "Signera manuellt"
   - **Verifiera:** POST `/api/nda-requests`
   - **Check:** NDARequest skapad med status 'pending'

   **Steg 3: Bekräftelse**
   - "NDA skickad! Säljaren godkänner inom 24-48h"
   - **Verifiera:** Redirect tillbaka till objekt eller dashboard

**Expected Result:** ✅ NDA request skapad, väntar på säljarens godkännande

---

### Steg 2.5: Säljaren Godkänner NDA

**Route:** `/dashboard/nda-status` (för säljare)

1. **Säljaren ser NDA-förfrågan:**
   - Gå till `/dashboard/nda-status`
   - **Verifiera:** GET `/api/nda-requests?sellerId=...`
   - **Check:** NDA-förfrågningar visas

2. **Godkänn NDA:**
   - Klicka "Godkänn" på en NDA-förfrågan
   - **Verifiera:** PATCH `/api/nda-requests` med status 'approved'
   - **Check:** NDARequest.status = 'approved'
   - **Check:** Köparen får nu tillgång till full information

**Expected Result:** ✅ NDA godkänd, köparen kan se full information

---

### Steg 2.6: Datarum & Q&A

**Route:** `/objekt/[id]/datarum`

1. **Öppna Datarum:**
   - Efter NDA godkänd, klicka "Gå till datarum"
   - **Verifiera:** Köparen är inloggad och har NDA
   - **Check:** Datarum-sidan laddas

2. **Ställa Frågor:**
   - Gå till Q&A-tab
   - Skriv en fråga
   - Klicka "Skicka"
   - **Verifiera:** POST `/api/questions`
   - **Check:** Fråga sparas i database

3. **Se Dokument:**
   - Gå till Datarum-tab
   - **Verifiera:** Dokument visas (om uploadade)
   - **Check:** Kan ladda ner dokument

**Expected Result:** ✅ Datarum fungerar, Q&A fungerar

---

### Steg 2.7: Visa Intresse / Skapa LOI

**Route:** `/objekt/[id]/loi`

1. **Skapa LOI (Letter of Intent):**
   - Klicka "Skapa LOI" på objekt-sidan eller datarum
   - Fyll i LOI-formulär:
     - Pris: "3000000"
     - Betalningsvillkor: "Cash at closing"
     - Closing Date: Välj datum
     - Villkor: "Subject to DD"
   - Klicka "Skicka LOI"
   - **Verifiera:** POST `/api/loi`
   - **Check:** LOI skapad i database

2. **Alternativ: Chatta med Säljare:**
   - Gå till `/dashboard/messages`
   - Välj konversation med säljare
   - Skriv meddelande: "Hej! Jag är intresserad av er bolag."
   - **Verifiera:** POST `/api/messages`
   - **Check:** Meddelande skickat

**Expected Result:** ✅ LOI skapad eller meddelande skickat

---

## 🔧 FIXES & VERIFICATIONS NEEDED

### Kritiska Fixes:

1. **Magic Link Registrering:**
   - [ ] Verifiera att `/api/auth/magic-link/send` fungerar
   - [ ] Verifiera att `/api/auth/magic-link/verify` fungerar
   - [ ] Verifiera att sessions/cookies sätts korrekt

2. **Listing Creation:**
   - [ ] Verifiera att `/api/listings` POST fungerar
   - [ ] Verifiera att listing sparas i database
   - [ ] Verifiera att wizard-flödet fungerar hela vägen

3. **NDA Flow:**
   - [ ] Verifiera att `/api/nda-requests` POST fungerar
   - [ ] Verifiera att säljare kan godkänna NDA
   - [ ] Verifiera att anonymisering fungerar korrekt

4. **Datarum & Q&A:**
   - [ ] Verifiera att `/api/questions` fungerar
   - [ ] Verifiera att datarum visas efter NDA

5. **LOI Creation:**
   - [ ] Verifiera att `/api/loi` POST fungerar
   - [ ] Verifiera att LOI sparas korrekt

---

## 🧪 TESTING CHECKLIST

### Säljare Flow:
- [ ] Kan registrera sig
- [ ] Kan göra bolagsvärdering
- [ ] Kan skapa annons (alla 7 steg)
- [ ] Annons publiceras korrekt
- [ ] Kan se NDA-förfrågningar
- [ ] Kan godkänna NDA
- [ ] Kan svara på frågor i datarum

### Köpare Flow:
- [ ] Kan registrera sig
- [ ] Kan söka annonser
- [ ] Kan spara intressanta annonser
- [ ] Kan begära NDA
- [ ] Kan signera NDA
- [ ] Kan se full information efter NDA
- [ ] Kan ställa frågor i datarum
- [ ] Kan skapa LOI eller visa intresse

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Alla API endpoints fungerar
- [ ] Database migrations körda
- [ ] Testa med riktiga användare
- [ ] Verifiera att alla flows fungerar end-to-end
- [ ] Fixa eventuella buggar

---

**Status:** 🟡 In Progress - Verifiering av alla flows

