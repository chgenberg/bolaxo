# 🎯 NÄSTA STEG FÖR ATT GÅ LIVE - BOLAXO.COM

**Datum:** 2025-10-29  
**Status:** 🟡 80% Klart - Nästa steg för launch

---

## ✅ VAD SOM ÄR KLART

- ✅ Brevo API Key lagd i Railway
- ✅ Brevo domain (`bolaxo.com`) verifierad
- ✅ Email sender uppdaterad till `noreply@bolaxo.com`
- ✅ Kod pushad till GitHub
- ✅ Database setup (Railway PostgreSQL)
- ✅ Security headers implementerade
- ✅ Core funktionalitet komplett

---

## 🔴 KRITISKT - MÅSTE GÖRAS NU

### 1. Environment Variables i Railway ⚠️ VIKTIGAST

**Gå till Railway Dashboard → Variables**

Lägg till dessa variabler (i ordning):

#### A. JWT_SECRET
```bash
# Generera först:
openssl rand -base64 64
```
- **Name:** `JWT_SECRET`
- **Value:** (klistra in resultatet från kommandot ovan)

#### B. ADMIN_SETUP_TOKEN
```bash
# Generera:
openssl rand -base64 32
```
- **Name:** `ADMIN_SETUP_TOKEN`
- **Value:** (klistra in resultatet från kommandot ovan)

#### C. Domain Variables
- **Name:** `NODE_ENV`
- **Value:** `production`

- **Name:** `NEXTAUTH_URL`
- **Value:** `https://bolaxo.com`

- **Name:** `NEXT_PUBLIC_BASE_URL`
- **Value:** `https://bolaxo.com`

- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://bolaxo.com/api`

**Verifiera att dessa redan finns:**
- ✅ `DATABASE_URL` (Railway auto-setup)
- ✅ `BREVO_API_KEY` (du lagt till)

---

### 2. DNS CNAME-post i One.com ⚠️ VIKTIGT

**Fortfarande behöver göras:**

1. Gå till One.com → DNS-inställningar
2. Hitta sektionen för **DNS-poster** (inte Web-alias)
3. Lägg till CNAME-post:
   - **Typ:** `CNAME`
   - **Namn:** `www`
   - **Värd:** `by54y0nn.up.railway.app`
4. Spara

**Om du inte hittar DNS-poster:**
- Kontakta One.com support och be dem lägga till CNAME
- Eller använd Web-forward temporärt (men CNAME är bättre)

---

### 3. Vänta på DNS & SSL

**Efter CNAME är lagd:**

1. **Vänta 10-15 minuter** på DNS-spridning
2. **Kolla Railway Dashboard** → Custom Domains
   - Status ska bli grön ✅ för `www.bolaxo.com`
3. **Vänta 5-15 minuter** på SSL-certifikat
   - Railway genererar automatiskt
4. **Testa:** `https://www.bolaxo.com`
   - Bör fungera med grön lås

---

## 🧪 TESTING EFTER ALLT ÄR KLART

### Steg 1: Verifiera Environment Variables

1. Gå till Railway Dashboard → Variables
2. Verifiera att alla variabler finns:
   - ✅ DATABASE_URL
   - ✅ BREVO_API_KEY
   - ✅ JWT_SECRET
   - ✅ ADMIN_SETUP_TOKEN
   - ✅ NODE_ENV
   - ✅ NEXTAUTH_URL
   - ✅ NEXT_PUBLIC_BASE_URL
   - ✅ NEXT_PUBLIC_API_URL

### Steg 2: Testa DNS & SSL

```bash
# Testa DNS (i terminal)
dig www.bolaxo.com +short
# Bör visa Railway IP eller hostname

# Testa HTTPS
curl -I https://www.bolaxo.com
# Bör returnera HTTP 200 eller 301
```

### Steg 3: Testa Kritisk Funktionalitet

1. **Lösenordsskydd:**
   - Öppna `https://www.bolaxo.com`
   - Ange lösenord: `BOLAXO`
   - ✅ Bör logga in korrekt

2. **Magic link login:**
   - Gå till `/login`
   - Ange din email
   - Kolla inkorgen för magic link
   - Klicka på länken
   - ✅ Bör logga in korrekt

3. **Database queries:**
   - Testa att skapa en listing (om seller)
   - Testa att söka listings (om buyer)
   - ✅ Bör fungera utan errors

4. **Mobile responsive:**
   - Öppna på mobil
   - Testa viktiga sidor
   - ✅ Bör vara responsivt

### Steg 4: Kolla Railway Logs

1. Gå till Railway Dashboard → Logs
2. Leta efter:
   - ✅ Inga kritiska errors
   - ✅ Applikationen startar korrekt
   - ✅ Database connection OK
   - ✅ Email sending OK

---

## 📋 CHECKLIST FÖR LAUNCH

### KRITISKT (måste vara klart):
- [ ] **JWT_SECRET** lagd i Railway
- [ ] **ADMIN_SETUP_TOKEN** lagd i Railway
- [ ] **NODE_ENV=production** lagd i Railway
- [ ] **NEXTAUTH_URL** lagd i Railway
- [ ] **NEXT_PUBLIC_BASE_URL** lagd i Railway
- [ ] **NEXT_PUBLIC_API_URL** lagd i Railway
- [ ] **CNAME-post** lagd i One.com DNS-poster
- [ ] **DNS-spridning klar** (Railway visar grön status)
- [ ] **SSL-certifikat aktivt** (grön lås i browser)

### VIKTIGT (bör vara klart):
- [x] **BREVO_API_KEY** lagd ✅
- [x] **Brevo domain verifierad** ✅
- [ ] **Magic link emails fungerar** (testa efter deployment)
- [ ] **Lösenordsskydd fungerar** (testa `BOLAXO`)
- [ ] **Database queries fungerar** (testa skapa/söka)

### OPTIONAL (kan göras efter launch):
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring (Uptime Robot)

---

## 🚀 SÅ HÄR GÖR DU NU

### Steg 1: Generera Secrets (2 min)

Kör dessa kommandon i terminalen:

```bash
# Generera JWT_SECRET
openssl rand -base64 64

# Generera ADMIN_SETUP_TOKEN
openssl rand -base64 32
```

**Spara resultaten!** Du behöver dem för Railway Variables.

### Steg 2: Lägg till i Railway Variables (5 min)

1. Gå till Railway Dashboard → Variables
2. Lägg till varje variabel (se lista ovan)
3. Verifiera att alla finns

### Steg 3: Lägg till CNAME i One.com (5 min)

1. Gå till One.com → DNS-inställningar
2. Lägg till CNAME: `www` → `by54y0nn.up.railway.app`
3. Spara

### Steg 4: Vänta & Verifiera (15-30 min)

1. Vänta 10-15 minuter på DNS-spridning
2. Kolla Railway Dashboard → Custom Domains
3. Status ska bli grön ✅
4. Vänta 5-15 minuter på SSL-certifikat
5. Testa `https://www.bolaxo.com`

### Steg 5: Testa Allt (10 min)

1. Testa lösenordsskydd (`BOLAXO`)
2. Testa magic link login
3. Testa database queries
4. Kolla Railway Logs för errors

### Steg 6: 🚀 LAUNCH!

När allt ovan är klart och testat:
- ✅ Du är redo att gå live!
- ✅ Ta bort password protection (om du vill)
- ✅ Eller behåll den för begränsad access

---

## ⏰ TIDSESTIMAT

- **Environment Variables:** 5-10 minuter
- **DNS CNAME:** 5 minuter
- **DNS-spridning:** 10-15 minuter
- **SSL-certifikat:** 5-15 minuter
- **Testing:** 10-15 minuter

**Totalt:** ~30-60 minuter till launch! 🚀

---

## 📞 BEHÖVER DU HJÄLP?

**Om DNS-poster:**
- Kontakta One.com support om du inte hittar CNAME-inställningar

**Om Environment Variables:**
- Kolla Railway Dashboard → Variables
- Se till att alla variabler är korrekt kopierade

**Om Testing:**
- Kolla Railway Logs för errors
- Testa magic link och kolla inkorgen

---

**Nästa steg:** Börja med Steg 1 ovan - generera secrets och lägg till i Railway!

