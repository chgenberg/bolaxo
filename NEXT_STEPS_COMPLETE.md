# 🎯 NÄSTA STEG - KOPPLINGAR SOM BEHÖVS

**Datum:** 2025-10-29  
**Status:** Core flow fungerar → Nästa: Komplettera kopplingar

---

## ✅ VAD SOM ÄR KOMPLETT

### **1. LOI → Transaction Flow**
- ✅ Buyer skapar LOI → Sparas i database
- ✅ Seller godkänner LOI → Transaction skapas automatiskt
- ✅ Milestones skapas automatiskt (inkl. "SPA signerad")

### **2. SPA → Transaction Flow**
- ✅ SPA kan skapas från LOI (`/api/sme/spa/create-from-loi`)
- ✅ SPA kopplas till Transaction (`transactionId`)
- ✅ SPA signing uppdaterar Transaction milestone
- ✅ Transaction stage uppdateras automatiskt (`SPA_NEGOTIATION` → `CLOSING`)

### **3. Transaction Dashboard**
- ✅ Visar Transaction med LOI, SPA, milestones, payments, documents
- ✅ Quick Links till LOI, SPA, Datarum
- ✅ Progress tracking

---

## 🔴 VAD SOM BEHÖVER KOPPLAS

### **STEP 1: Due Diligence → Transaction** (Priority: 🟡 HIGH)

**Nuvarande:**
- ✅ DD kan skapas via `/api/sme/dd/create-project`
- ✅ DDProject har `loiId` men inget `transactionId`
- ✅ DD completion uppdaterar INTE Transaction milestone

**Behöver:**
1. **Lägg till `transactionId` i DDProject schema**
2. **Skapa DD från Transaction:**
   - `POST /api/sme/dd/create-from-transaction`
   - Body: `{ transactionId }`
   - Skapar DDProject kopplad till Transaction
3. **DD completion uppdaterar Transaction milestone:**
   - När DD är klar → Update milestone "DD-rapport klar"
   - Update Transaction stage till `SPA_NEGOTIATION` (om inte redan där)

**Files att uppdatera:**
- `prisma/schema.prisma` - Lägg till `transactionId` i DDProject
- `app/api/sme/dd/create-from-transaction/route.ts` (NEW)
- `app/api/sme/dd/complete/route.ts` (UPDATE) - Uppdatera Transaction milestone

---

### **STEP 2: LOI Listings för Seller** (Priority: 🟡 HIGH)

**Nuvarande:**
- ✅ LOI API finns (`GET /api/loi?sellerId=...`)
- ❌ Ingen dedikerad dashboard för sellers att se LOIs

**Behöver:**
1. **Skapa `/dashboard/lois` page**
   - Visar alla LOIs där seller är ägare av listing
   - Filter på status (proposed, signed, rejected)
   - Sortering på datum, pris, etc.
   - Quick actions: Godkänn/Avslå LOI

**Files att skapa:**
- `app/dashboard/lois/page.tsx` (NEW)
- Använder befintlig `GET /api/loi?sellerId=...`

---

### **STEP 3: Email Notifications** (Priority: 🟢 MEDIUM)

**Nuvarande:**
- ❌ Ingen email när LOI skapas
- ❌ Ingen email när LOI godkänns
- ❌ Ingen email när SPA signeras

**Behöver:**
1. **Email när LOI skapas:**
   - Seller får email: "Ny LOI från köpare"
   - Innehåller köpare info, pris, länkar till LOI
2. **Email när LOI godkänns:**
   - Buyer får email: "Din LOI har godkänts"
   - Innehåller Transaction info, länkar till Transaction dashboard
3. **Email när SPA signeras:**
   - Båda parter får email: "SPA signerad"
   - Innehåller Transaction info, nästa steg

**Files att skapa:**
- `lib/email.ts` (NEW) - Email utility functions
- Uppdatera `app/api/loi/route.ts` - Skicka email när LOI skapas
- Uppdatera `app/api/loi/[id]/approve/route.ts` - Skicka email när LOI godkänns
- Uppdatera `app/api/sme/spa/finalize/route.ts` - Skicka email när SPA signeras

---

### **STEP 4: Externa API Integrationer** (Priority: 🔴 CRITICAL för produktion)

#### **4.1 BankID Integration**
- NDA signing behöver autentisering
- SPA signing behöver autentisering
- **Kostnad:** ~20,000 SEK (one-time)
- **Effort:** 2-3 dagar

#### **4.2 Scrive ESignature**
- SPA signing behöver juridisk bindande signatur
- **Kostnad:** ~20,000 SEK (one-time) + ~5,000 SEK/month
- **Effort:** 3-5 dagar

#### **4.3 Bolagsverket Integration**
- Automatisk registrering av ägarbyte efter closing
- **Kostnad:** ~40,000 SEK (one-time)
- **Effort:** 5-7 dagar

---

## 🎯 REKOMMENDERAD ORDNING

### **IMORGON (Snabba wins):**
1. ✅ **Due Diligence → Transaction koppling**
   - 2-3 timmar
   - Kompletterar core flow
2. ✅ **LOI Listings för Seller**
   - 2-3 timmar
   - Förbättrar seller UX

### **DENNA VECKA:**
3. ✅ **Email Notifications**
   - 4-6 timmar
   - Förbättrar kommunikation
4. ✅ **BankID Integration** (om budget finns)
   - 2-3 dagar
   - Kritiskt för produktion

### **NÄSTA VECKA:**
5. ✅ **Scrive Integration**
   - 3-5 dagar
   - Kritiskt för produktion
6. ✅ **Bolagsverket Integration**
   - 5-7 dagar
   - Automatisering av closing

---

## 💡 MIN REKOMMENDATION

**Starta med Due Diligence → Transaction koppling och LOI Listings för Seller** eftersom dessa:
- ✅ Är snabba att implementera (2-3 timmar vardera)
- ✅ Kompletterar core flow
- ✅ Förbättrar användarupplevelsen direkt
- ✅ Kräver ingen extern integration

**Sedan kan vi gå vidare med:**
- Email notifications (förbättrar kommunikation)
- Externa API integrationer (när budget finns)

---

**Vill du att jag börjar med Due Diligence → Transaction koppling och LOI Listings för Seller nu?**

