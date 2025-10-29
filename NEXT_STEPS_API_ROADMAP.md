# 🚀 NÄSTA STEG - API KOPPLINGAR & IMPLEMENTATION

**Datum:** 2025-10-29  
**Status:** Flödet fungerar → Nästa steg: API-integrationer

---

## 📋 NUVARANDE STATUS

### ✅ **KOMPLETT IMPLEMENTERAT:**
1. ✅ Seller skapar listing → Database
2. ✅ Buyer söker → Hittar anonymiserade listings
3. ✅ Buyer begär NDA → Sparas i database
4. ✅ Seller godkänner NDA → Status uppdateras
5. ✅ Buyer ser full information efter NDA
6. ✅ LOI-sida finns (`/objekt/[id]/loi`)
7. ✅ Transaction creation finns (`/api/transactions/create`)
8. ✅ Datarum & Q&A finns

### ⚠️ **VAD SOM BEHÖVER KOPPLAS TILL DB:**
1. **LOI** - Skapas lokalt men sparas inte som separate LOI i database
2. **Transaction** - Skapas redan men behöver kopplas till LOI
3. **SPA** - Finns men behöver kopplas till Transaction
4. **Due Diligence** - Finns men behöver kopplas till Transaction

---

## 🎯 NÄSTA STEG - FUNKTIONALITET

### **STEP 1: LOI till Database** (Priority: 🔴 CRITICAL)

**Nuvarande:** LOI skapas lokalt i `/objekt/[id]/loi/page.tsx` och skickas direkt till transaction creation.

**Behöver:**
- Skapa LOI som separate entitet i database
- LOI ska sparas innan transaction skapas
- Seller kan godkänna/avslå LOI
- När LOI godkänds → Transaction skapas automatiskt

**Implementation:**

```typescript
// 1. Skapa LOI API endpoint
POST /api/loi/create
Body: {
  listingId, buyerId, sellerId,
  priceMin, priceMax, closingDate,
  conditions, timeline, etc.
}
Response: { loi: { id, status: 'pending' } }

// 2. Seller godkänner LOI
PATCH /api/loi/approve
Body: { loiId }
Response: { loi: { status: 'approved' } }
→ Auto: Skapa Transaction från LOI

// 3. Update LOI page
// Sparar LOI först, väntar på seller approval
// När approved → Transaction skapas
```

**Files att uppdatera:**
- `app/api/loi/create/route.ts` (NEW)
- `app/api/loi/approve/route.ts` (NEW)
- `app/objekt/[id]/loi/page.tsx` (UPDATE)
- `prisma/schema.prisma` (ADD LOI model)

---

### **STEP 2: Transaction Dashboard** (Priority: 🔴 CRITICAL)

**Nuvarande:** Transaction skapas men finns ingen dedikerad dashboard för att följa transaktionen.

**Behöver:**
- Transaction overview page (`/transaktion/[id]`)
- Visar milestones, payments, documents
- Både buyer och seller kan se sin transaktion
- Progress tracking

**Implementation:**

```typescript
// 1. Transaction detail page
GET /api/transactions/[id]
→ Returnerar transaction med milestones, payments, etc.

// 2. Update milestones
PATCH /api/transactions/[id]/milestones/[milestoneId]
Body: { completed: true }
→ Uppdaterar milestone status

// 3. Frontend page
/app/transaktion/[id]/page.tsx (NEW)
→ Visar transaction overview, milestones, payments
```

**Files att skapa:**
- `app/transaktion/[id]/page.tsx` (NEW)
- `app/api/transactions/[id]/route.ts` (NEW)
- `app/api/transactions/[id]/milestones/[milestoneId]/route.ts` (NEW)

---

### **STEP 3: SPA koppling till Transaction** (Priority: 🟡 HIGH)

**Nuvarande:** SPA kan skapas men är inte kopplad till transaction.

**Behöver:**
- SPA skapas från LOI data
- SPA kopplad till Transaction
- SPA signing flow kopplad till Transaction milestones

**Implementation:**

```typescript
// 1. Skapa SPA från LOI
POST /api/sme/spa/create-from-loi
Body: { loiId, transactionId }
→ Skapar SPA från LOI data

// 2. SPA signing updates Transaction milestone
POST /api/sme/spa/finalize
Body: { spaId }
→ När SPA signerad → Update Transaction milestone "SPA signerad"
```

**Files att uppdatera:**
- `app/api/sme/spa/create-from-loi/route.ts` (NEW)
- `app/api/sme/spa/finalize/route.ts` (UPDATE)

---

### **STEP 4: Due Diligence koppling till Transaction** (Priority: 🟡 HIGH)

**Nuvarante:** DD kan skapas men är inte kopplad till transaction.

**Behöver:**
- DD projekt skapas från Transaction
- DD completion uppdaterar Transaction milestone
- DD findings syns i Transaction dashboard

**Implementation:**

```typescript
// 1. Skapa DD från Transaction
POST /api/sme/dd/create-from-transaction
Body: { transactionId }
→ Skapar DD projekt för transaction

// 2. DD completion
PATCH /api/sme/dd/complete
Body: { ddProjectId }
→ Update Transaction milestone "DD-rapport klar"
```

**Files att uppdatera:**
- `app/api/sme/dd/create-from-transaction/route.ts` (NEW)
- `app/api/sme/dd/complete/route.ts` (UPDATE)

---

## 🔌 NÄSTA STEG - API INTEGRATIONER

### **PHASE 1: CRITICAL APIs** (Vecka 1-2)

#### **1. BankID Integration** (Priority: 🔴 CRITICAL)
**Varför:** NDA och SPA signing behöver autentisering

**Implementation:**
```typescript
// lib/bankid.ts (NEW)
export async function initiateBankIDAuth(userId, personalNumber)
export async function checkBankIDStatus(orderRef)

// API endpoints
POST /api/bankid/authenticate
GET /api/bankid/status?orderRef=...

// Update signing pages
app/nda/[id]/page.tsx - Integrera BankID
app/kopare/signing/[spaId]/page.tsx - Integrera BankID
app/salja/signing/[spaId]/page.tsx - Integrera BankID
```

**Kostnad:** ~20,000 SEK (one-time)  
**Effort:** 2-3 dagar

---

#### **2. Scrive ESignature** (Priority: 🔴 CRITICAL)
**Varför:** SPA signing behöver juridisk bindande signatur

**Implementation:**
```typescript
// lib/scrive.ts (UPDATE existing)
export async function initiateScriveSigning(spaId, parties)
export async function handleScriveCallback(data)

// API endpoints
POST /api/sme/spa/initiate-signing (UPDATE)
POST /api/sme/spa/webhook/scrive-callback (NEW)

// Update signing pages
app/kopare/signing/[spaId]/page.tsx - Integrera Scrive
app/salja/signing/[spaId]/page.tsx - Integrera Scrive
```

**Kostnad:** ~20,000 SEK (one-time) + ~5,000 SEK/month  
**Effort:** 3-5 dagar

---

#### **3. Bolagsverket Integration** (Priority: 🔴 CRITICAL)
**Varför:** Automatisk registrering av ägarbyte efter closing

**Implementation:**
```typescript
// lib/bolagsverket.ts (NEW)
export async function verifyOwnership(orgNr, sellerId)
export async function registerShareTransfer(transactionId, transferData)

// API endpoints
POST /api/bolagsverket/verify-ownership
POST /api/bolagsverket/register-transfer

// Update transaction flow
→ När Transaction milestone "SPA signerad" klar
→ Auto: Register share transfer
→ Update milestone "Överlåtelse registrerad"
```

**Kostnad:** ~40,000 SEK (one-time)  
**Effort:** 5-7 dagar

---

### **PHASE 2: HIGH VALUE APIs** (Vecka 3-4)

#### **4. Skatteverket Tax Clearance** (Priority: 🟡 HIGH)
**Varför:** Verifiera ingen skatteskuld före closing

**Implementation:**
```typescript
// lib/skatteverket.ts (NEW)
export async function verifyTaxClearance(orgNr)

// API endpoint
GET /api/tax/verify/{orgNr}

// Update closing checklist
→ Check tax clearance status
→ Show in Transaction dashboard
```

**Kostnad:** ~20,000 SEK (one-time)  
**Effort:** 2-3 dagar

---

#### **5. Stripe Payment Processing** (Priority: 🟡 HIGH)
**Varför:** Automatisk betalningshantering

**Implementation:**
```typescript
// lib/stripe.ts (NEW)
export async function createPaymentIntent(amount, metadata)
export async function handlePaymentWebhook(event)

// API endpoints
POST /api/payment/create-intent
POST /api/payment/webhook

// Update transaction payments
→ När Payment milestone nås → Skapa payment intent
→ När betalning klar → Update milestone
```

**Kostnad:** ~0 SEK (per-transaction fees only)  
**Effort:** 3-4 dagar

---

## 📋 IMPLEMENTATION ROADMAP

### **VEcka 1: Database Kopplingar**
- [ ] LOI API endpoints (create, approve)
- [ ] Transaction detail page
- [ ] Transaction dashboard
- [ ] SPA koppling till Transaction
- [ ] DD koppling till Transaction

### **VEcka 2: Critical APIs**
- [ ] BankID Integration
- [ ] Scrive ESignature Integration
- [ ] Testa full signing flow

### **VEcka 3: High Value APIs**
- [ ] Bolagsverket Integration
- [ ] Skatteverket Integration
- [ ] Stripe Payment Integration

### **VEcka 4: Testing & Polish**
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Documentation

---

## 🎯 PRIORITET ORDNING

### **IMMEDIAT (Idag/Imorgon):**
1. ✅ LOI till Database (kritiskt för flödet)
2. ✅ Transaction Dashboard (kritiskt för användarupplevelsen)

### **DENNA VECKA:**
3. ✅ BankID Integration (kritiskt för produktion)
4. ✅ Scrive Integration (kritiskt för produktion)

### **NÄSTA VECKA:**
5. ✅ Bolagsverket Integration
6. ✅ Skatteverket Integration
7. ✅ Stripe Payment Integration

---

## 💰 TOTAL KOSTNAD ESTIMAT

```
Database Kopplingar:     0 SEK (intern utveckling)
BankID Integration:      ~20,000 SEK
Scrive Integration:      ~20,000 SEK
Bolagsverket:            ~40,000 SEK
Skatteverket:            ~20,000 SEK
Stripe:                  ~0 SEK
───────────────────────────────────
TOTAL:                   ~100,000 SEK (one-time)

+ Recurring:
  Scrive: ~5,000 SEK/month
  Stripe: Per-transaction fees
```

---

## 🚀 STARTAR MED

**Rekommendation:** Börja med LOI till Database och Transaction Dashboard eftersom dessa är kritiska för att få hela flödet att fungera korrekt. Sedan kan vi gå vidare med API-integrationer.

**Vill du att jag börjar implementera LOI till Database nu?**

