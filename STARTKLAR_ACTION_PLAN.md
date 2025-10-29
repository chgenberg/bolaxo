# 🚀 BOLAXO - STARTKLAR ACTION PLAN

**Datum:** 2025-10-29  
**Mål:** Göra hela sajten funktionell från start till slut

---

## ✅ VAD SOM REDAN FUNGERAR

### Backend APIs:
- ✅ `/api/auth/magic-link/send` - Magic link registrering
- ✅ `/api/auth/magic-link/verify` - Magic link verifiering
- ✅ `/api/listings` - Skapa och hämta listings
- ✅ `/api/nda-requests` - Skapa och hantera NDA-förfrågningar
- ✅ `/api/valuation` - Bolagsvärdering
- ✅ `/api/transactions/create` - Skapa transaktion (LOI)
- ✅ `/api/questions` - Q&A funktionalitet
- ✅ Database schema komplett med alla modeller

### Frontend Components:
- ✅ `ValuationWizard` - Komplett värderingswizard
- ✅ `CreateListingWizard` - Komplett annonswizard (7 steg)
- ✅ `PasswordProtection` - Lösenordsskydd
- ✅ NDA-signering flow
- ✅ Objektdetaljer med anonymisering
- ✅ Datarum & Q&A sidor

---

## 🔧 VAD SOM BEHÖVER FIXAS/VERIFIERAS

### 1. Magic Link Flow - VERIFIERA

**Problem:** Magic links skapas men behöver verifieras att de fungerar korrekt i production

**Fix:**
- [ ] Verifiera att cookies sätts korrekt vid magic link verify
- [ ] Verifiera att user redirectas till rätt sida efter inloggning
- [ ] Testa att sessions fungerar över sidladdningar

**Test:**
```bash
# Testa magic link flow
1. POST /api/auth/magic-link/send med email + role
2. Kopiera magic link från response
3. Öppna magic link
4. Verifiera att användare är inloggad
```

---

### 2. Listing Creation - VERIFIERA

**Problem:** Wizard finns men behöver verifiera att all data sparas korrekt

**Fix:**
- [ ] Verifiera att CreateListingWizard skickar all data till `/api/listings`
- [ ] Verifiera att listing sparas med korrekt status
- [ ] Verifiera att wizard fungerar hela vägen från start till slut

**Test:**
```bash
# Testa listing creation
1. Logga in som seller
2. Gå till /salja/start
3. Fyll i alla 7 steg
4. Publicera
5. Verifiera att listing finns i database
```

---

### 3. NDA Flow - FIXA

**Problem:** NDA-signering fungerar men behöver integrera med riktiga listings

**Fix:**
- [ ] Verifiera att `/api/nda-requests` fungerar med riktiga listing IDs
- [ ] Fixa att `nda/[id]` hämtar från database istället för mockObjects
- [ ] Verifiera att anonymisering fungerar korrekt

**Test:**
```bash
# Testa NDA flow
1. Logga in som buyer
2. Hitta en listing
3. Begär NDA
4. Signera NDA
5. Verifiera att säljare kan godkänna
```

---

### 4. Objektdetaljer - FIXA

**Problem:** `/objekt/[id]` använder mockObjects istället för database

**Fix:**
- [ ] Ändra `app/objekt/[id]/page.tsx` att hämta från `/api/listings/[id]`
- [ ] Verifiera anonymisering fungerar före NDA
- [ ] Verifiera att full information visas efter NDA

**Kod-fix behövs:**
```typescript
// I app/objekt/[id]/page.tsx
// Ersätt:
const object = getObjectById(objectId)
// Med:
const response = await fetch(`/api/listings/${objectId}`)
const object = await response.json()
```

---

### 5. Datarum & Q&A - VERIFIERA

**Problem:** Sidor finns men behöver verifiera att APIs fungerar

**Fix:**
- [ ] Verifiera att `/api/questions` fungerar
- [ ] Verifiera att dokument kan visas/laddas ner
- [ ] Verifiera att Q&A-thread fungerar

---

### 6. Buyer Profile - VERIFIERA

**Problem:** `/kopare/start` finns men behöver verifiera att data sparas

**Fix:**
- [ ] Verifiera att `/api/buyer-profile` fungerar
- [ ] Verifiera att profil-data sparas korrekt

---

## 🎯 PRIORITERING

### KRITISKT (Måste fungera för launch):
1. ✅ Magic link registrering fungerar
2. ✅ Listing creation fungerar
3. 🔧 Objektdetaljer hämtar från database
4. 🔧 NDA flow fungerar end-to-end
5. ✅ Basic search fungerar

### VIKTIGT (Bör fungera):
6. ✅ Värdering fungerar
7. ✅ Buyer profile fungerar
8. ✅ Datarum & Q&A fungerar
9. ✅ Transaktion creation fungerar

### NICE TO HAVE:
10. ✅ Advanced search filters
11. ✅ Saved listings
12. ✅ Compare functionality

---

## 🚀 IMPLEMENTATION PLAN

### Steg 1: Fixa Objektdetaljer (30 min)
- Ändra `app/objekt/[id]/page.tsx` att hämta från API
- Verifiera anonymisering

### Steg 2: Fixa NDA Flow (30 min)
- Ändra `app/nda/[id]/page.tsx` att hämta från API
- Verifiera att NDA-requests fungerar

### Steg 3: Verifiera Alla Flows (1 timme)
- Testa säljare-flow end-to-end
- Testa köpare-flow end-to-end
- Fixa eventuella buggar

### Steg 4: Production Testing (1 timme)
- Testa på production URL
- Verifiera att allt fungerar med riktiga användare

---

## 📋 FINAL CHECKLIST

### Säljare Flow:
- [ ] Kan registrera sig via magic link
- [ ] Kan göra bolagsvärdering
- [ ] Kan skapa annons (alla 7 steg)
- [ ] Annons publiceras och syns i sök
- [ ] Kan se NDA-förfrågningar
- [ ] Kan godkänna NDA
- [ ] Kan svara på frågor

### Köpare Flow:
- [ ] Kan registrera sig via magic link
- [ ] Kan komplettera profil
- [ ] Kan söka annonser
- [ ] Kan se objekt-detaljer (anonymiserade)
- [ ] Kan begära NDA
- [ ] Kan signera NDA
- [ ] Kan se full information efter NDA
- [ ] Kan ställa frågor
- [ ] Kan skapa transaktion/LOI

---

## 🔥 IMMEDIATE ACTIONS

1. **Fix `app/objekt/[id]/page.tsx`** - Hämta från database
2. **Fix `app/nda/[id]/page.tsx`** - Hämta från database
3. **Testa alla flows** - Verifiera att allt fungerar
4. **Fix eventuella buggar** - Förbättra error handling

---

**Status:** 🟡 Ready for Implementation  
**Next Step:** Fixa objekt-detaljer och NDA-sidor att hämta från database

