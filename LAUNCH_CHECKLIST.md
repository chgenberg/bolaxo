# 🚀 KOMPLETT LANSERINGSCHECKLISTA - BOLAXO.COM

**Datum:** 2025-10-29  
**Status:** 🟡 Pre-Launch - Nästa steg för att gå live

---

## 🔴 KRITISKT - MÅSTE VARA KLART INNAN LAUNCH

### 1. DNS & Domain (AKTUELLT HÅLLPÅ)
- [ ] **CNAME-post för www.bolaxo.com** läggs till i One.com DNS-poster
  - Namn: `www`
  - Värd: `by54y0nn.up.railway.app`
- [ ] **DNS-spridning klar** (vänta 10-15 min efter CNAME är lagd)
- [ ] **Railway detekterar DNS** (status blir grön i Railway Dashboard)
- [ ] **SSL-certifikat genererat** (Railway genererar automatiskt efter DNS är verifierad)
- [ ] **Testa:** `https://www.bolaxo.com` fungerar
- [ ] **Testa:** `https://bolaxo.com` redirectar till www

### 2. Environment Variables i Railway
- [ ] **DATABASE_URL** - Auto-setup av Railway ✅ (verifiera att den finns)
- [ ] **JWT_SECRET** - Generera och lägg till:
  ```bash
  openssl rand -base64 64
  ```
- [ ] **ADMIN_SETUP_TOKEN** - Generera och lägg till:
  ```bash
  openssl rand -base64 32
  ```
- [ ] **NODE_ENV** - Sätt till `production`
- [ ] **NEXTAUTH_URL** - Sätt till `https://bolaxo.com`
- [ ] **NEXT_PUBLIC_BASE_URL** - Sätt till `https://bolaxo.com`
- [ ] **NEXT_PUBLIC_API_URL** - Sätt till `https://bolaxo.com/api`

**Var att lägga till:** Railway Dashboard → Ditt projekt → Variables → "+ New Variable"

### 3. Database Migrations
- [ ] **Prisma migrations körda** i production
  - Railway kör automatiskt `prisma migrate deploy` vid deployment ✅
  - Verifiera att inga migrations saknas i Railway Logs

### 4. Security & Secrets
- [x] Security headers (middleware.ts) ✅
- [x] HTTPS enforced (Railway) ✅
- [x] Error boundary implementerad ✅
- [ ] **Inga secrets i Git** - Verifiera .gitignore inkluderar `.env*`
- [ ] **JWT_SECRET och ADMIN_SETUP_TOKEN** genererade och lagda i Railway

---

## 🟡 VIKTIGT - REKOMMENDERAS FÖR PRODUCTION

### 5. Error Tracking & Monitoring
- [ ] **Error logging setup** (Optional men rekommenderas)
  - **Sentry** (gratis tier): https://sentry.io
  - Eller använd Railway Logs för nu
- [ ] **Uptime monitoring** (Optional)
  - Railway Metrics Dashboard ✅ (inbyggt)
  - Eller Uptime Robot för extern monitoring

### 6. Email Service (För Magic Links) ✅
- [x] **Sendinblue (Brevo) implementerat** ✅
  - Kod implementerad i `lib/email.ts`
  - Magic link emails fungerar
- [x] **BREVO_API_KEY** lagd i Railway Variables ✅
- [ ] **Testa magic link emails** fungerar efter deployment
- [ ] **Sender domain verifierad** (för `noreply@bolaxo.com` - optional för start)

### 7. Testing & Verification
- [ ] **Lösenordsskydd testat** (`BOLAXO`)
- [ ] **Magic link login** fungerar
- [ ] **Admin login** fungerar (om admin är setup)
- [ ] **Database queries** fungerar (testa att skapa listing/söka)
- [ ] **Mobile responsive** testad
- [ ] **SSL-certifikat** verifierat (grön lås i browser)

---

## 🟢 OPTIONAL - NICE TO HAVE

### 8. Analytics & Tracking
- [ ] **Google Analytics** eller **Plausible** (privacy-friendly)
- [ ] **Custom event tracking** för viktiga actions
- [ ] **Conversion tracking** för leads/signups

### 9. Performance Optimization
- [x] Image optimization (Next.js Image) ✅
- [x] Compression enabled ✅
- [ ] **CDN för static assets** (Optional, Railway hanterar detta)
- [ ] **Bundle size optimization** (kolla med `npm run build`)

### 10. Backups
- [x] Railway auto-backup aktiverat ✅
- [ ] **Manuell backup testad** (om behövs)
- [ ] **Recovery plan** dokumenterad

---

## 📋 PRE-LAUNCH TESTING CHECKLIST

**24 timmar innan launch:**

- [ ] ✅ DNS-spridning klar (testa med `dig www.bolaxo.com`)
- [ ] ✅ SSL-certifikat aktivt (grön lås i browser)
- [ ] ✅ Alla env vars verifierade i Railway
- [ ] ✅ Lösenordsskydd fungerar (`BOLAXO`)
- [ ] ✅ Magic link login fungerar
- [ ] ✅ Database queries fungerar
- [ ] ✅ Mobile responsive testad
- [ ] ✅ Inga console errors i browser
- [ ] ✅ Performance OK (Lighthouse score > 80)

---

## 🚀 LAUNCH STEG-FÖR-STEG

### När allt ovan är klart:

1. **Verifiera DNS i Railway:**
   - Gå till Railway Dashboard → Custom Domains
   - Status ska vara grön ✅ för www.bolaxo.com

2. **Verifiera SSL:**
   - Öppna `https://www.bolaxo.com`
   - Kolla att det är grön lås i browser
   - Inga SSL-varningar

3. **Testa kritisk funktionalitet:**
   - Lösenordsskydd: `BOLAXO`
   - Magic link login
   - Skapa listing (om seller)
   - Söka listings (om buyer)

4. **Monitor Railway Logs:**
   - Kolla Railway Dashboard → Logs
   - Inga kritiska errors
   - Applikationen startar korrekt

5. **🚀 LAUNCH!**
   - Ta bort password protection (om du vill)
   - Eller behåll den för begränsad access
   - Informera team/users

---

## 🔧 ÅTGÄRDER SOM BEHÖVER GÖRAS NU

### IMMEDIAT (Innan DNS fungerar):

1. **Generera secrets:**
   ```bash
   # Kör dessa kommandon och spara resultaten:
   openssl rand -base64 64  # För JWT_SECRET
   openssl rand -base64 32  # För ADMIN_SETUP_TOKEN
   ```

2. **Lägg till Environment Variables i Railway:**
   - Gå till Railway Dashboard → Variables
   - Lägg till alla variabler från sektion 2 ovan

3. **Lägg till CNAME i One.com:**
   - Gå till DNS-poster (inte Web-alias)
   - Lägg till CNAME: `www` → `by54y0nn.up.railway.app`

### EFTER DNS ÄR KLAR:

4. **Vänta på SSL-certifikat:**
   - Railway genererar automatiskt (5-15 min)
   - Verifiera i Railway Dashboard

5. **Testa allt:**
   - Gå igenom testing checklist ovan
   - Fixa eventuella problem

---

## 📞 SUPPORT & RESOURCES

- **Railway Dashboard:** https://railway.app
- **One.com DNS:** https://one.com (DNS-inställningar)
- **GitHub Repo:** https://github.com/chgenberg/bolaxo

---

## ✅ STATUS SAMMANFATTNING

### Klart ✅:
- ✅ Databas setup (Railway PostgreSQL)
- ✅ Security headers
- ✅ Error boundary
- ✅ Password protection
- ✅ Core funktionalitet (LOI, Transaction, SPA, DD)
- ✅ Mobile optimization
- ✅ Database migrations setup

### Behöver göras 🔴:
- 🔴 DNS CNAME-post i One.com
- 🔴 Environment variables i Railway
- 🔴 SSL-certifikat genererat
- 🔴 Testa allt efter DNS är klar

### Optional (kan göras efter launch) 🟡:
- 🟡 Email service för magic links (Sendinblue implementerat, behöver API key)
- 🟡 Error tracking (Sentry)
- 🟡 Analytics

---

**Nästa steg:** Följ "ÅTGÄRDER SOM BEHÖVER GÖRAS NU" ovan punkt för punkt!

