# 🚀 BOLAXO - PRODUKTIONSGUIDE KOMPLETT

**Senast uppdaterad:** 2025-10-29  
**Status:** 🟢 Production Ready

---

## 📋 STEP-BY-STEP PRODUCTION SETUP

### STEG 1: Environment Variables ✅

**I Railway Dashboard:**

1. Gå till ditt projekt → **Variables**
2. Lägg till alla REQUIRED variabler:

```env
# Database (Auto-setup av Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:***@***.proxy.rlwy.net:***/railway

# Authentication (Generera nya secrets!)
JWT_SECRET=<generera med: openssl rand -base64 64>
ADMIN_SETUP_TOKEN=<generera med: openssl rand -base64 32>

# Environment
NODE_ENV=production

# Domain
NEXTAUTH_URL=https://bolaxo.com
NEXT_PUBLIC_API_URL=https://bolaxo.com/api
```

**Generera secrets lokalt:**
```bash
# JWT Secret
openssl rand -base64 64

# Admin Setup Token
openssl rand -base64 32
```

### STEG 2: Database Migrations ✅

**Railway kör automatiskt:** `prisma migrate deploy` i start-scriptet ✅

**Verifiera manuellt:**
```bash
# Lokalt (om du vill testa)
npx prisma migrate deploy
```

### STEG 3: Security Headers ✅

**Redan implementerat:**
- ✅ `middleware.ts` - Security headers
- ✅ `next.config.js` - Ytterligare security headers
- ✅ HTTPS enforced (Railway)

**Verifiera:**
```bash
curl -I https://bolaxo.com
# Bör visa: X-Content-Type-Options, X-Frame-Options, etc
```

### STEG 4: Error Handling ✅

**Redan implementerat:**
- ✅ `ErrorBoundary.tsx` - Catches React errors
- ✅ Middleware error handling

**För production error tracking (Optional):**
1. Skapa Sentry account: https://sentry.io
2. Lägg till `SENTRY_DSN` i Railway Variables
3. Installera: `npm install @sentry/nextjs`

### STEG 5: Performance ✅

**Redan konfigurerat:**
- ✅ Image optimization (AVIF, WebP)
- ✅ Compression enabled
- ✅ Static page generation där möjligt

**Verifiera performance:**
```bash
# Testa med Lighthouse
# Öppna Chrome DevTools → Lighthouse → Run audit
```

### STEG 6: Monitoring (Optional men rekommenderas)

**Railway Built-in:**
- ✅ Metrics dashboard
- ✅ Logs
- ✅ Deployment history

**Extra (Optional):**
- [ ] Sentry för error tracking
- [ ] Uptime Robot för uptime monitoring
- [ ] Google Analytics för användarstatistik

### STEG 7: Backups ✅

**Railway auto-backup:**
- ✅ PostgreSQL backups automatiskt
- ✅ Retention: 30 dagar
- ✅ Tillgängliga i Railway Dashboard

**Manuell backup:**
```bash
# Exportera database
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## 🔍 PRE-LAUNCH VERIFICATION

### Testa dessa innan launch:

1. **DNS & Domain:**
   ```bash
   curl -I https://bolaxo.com
   # Bör returnera HTTP 200
   ```

2. **Lösenordsskydd:**
   - Öppna `https://bolaxo.com`
   - Ange lösenord: `BOLAXO`
   - ✅ Bör logga in korrekt

3. **Admin Login:**
   - Gå till `/admin/login`
   - Logga in med admin credentials
   - ✅ Bör komma in på dashboard

4. **Database:**
   ```bash
   # Testa connection (om du har Railway CLI)
   railway db shell
   SELECT 1;
   ```

5. **Security Headers:**
   ```bash
   curl -I https://bolaxo.com | grep -i "x-content-type-options"
   # Bör visa: X-Content-Type-Options: nosniff
   ```

6. **Mobile Responsiveness:**
   - Öppna i mobil browser
   - Testa alla viktiga sidor
   - ✅ Bör vara responsivt

---

## 🚨 CRITICAL SECURITY CHECKLIST

- [x] Inga secrets i Git ✅
- [ ] JWT_SECRET genererat och satt i Railway
- [ ] ADMIN_SETUP_TOKEN genererat och satt i Railway
- [x] Security headers aktiverade ✅
- [x] HTTPS enforced ✅
- [x] Error boundary implementerad ✅
- [ ] Database password ändrat (om exposed tidigare)

---

## 📊 POST-LAUNCH MONITORING

**Första 24 timmarna:**

1. **Kolla Railway Logs:**
   - Gå till Railway Dashboard → Logs
   - Leta efter errors

2. **Testa kritiska flows:**
   - Admin login
   - Password protection
   - Database queries

3. **Performance:**
   - Kolla Railway Metrics (CPU, Memory)
   - Testa page load times

4. **Errors:**
   - Kolla browser console
   - Kolla Railway Logs
   - Setup Sentry för långsiktig tracking

---

## 🛠️ TROUBLESHOOTING

### Problem: "Cannot connect to database"
**Lösning:**
1. Verifiera `DATABASE_URL` i Railway Variables
2. Kolla PostgreSQL status i Railway Dashboard
3. Testa connection: `railway db shell`

### Problem: "Invalid JWT secret"
**Lösning:**
1. Generera ny `JWT_SECRET`: `openssl rand -base64 64`
2. Uppdatera i Railway Variables
3. Redeploy (Railway gör auto)

### Problem: "Password protection not working"
**Lösning:**
1. Verifiera sessionStorage fungerar
2. Testa i incognito mode
3. Kolla browser console för errors

### Problem: "Build fails"
**Lösning:**
1. Kolla Railway Logs för specifikt error
2. Testa build lokalt: `npm run build`
3. Verifiera alla dependencies finns i `package.json`

---

## ✅ PRODUCTION READY CHECKLIST

**Innan du launchar:**

- [ ] Alla REQUIRED env vars satta i Railway
- [ ] Secrets genererade och kopierade korrekt
- [ ] Database migrations körda
- [ ] Security headers verifierade
- [ ] Error boundary testad
- [ ] Lösenordsskydd fungerar
- [ ] Admin login fungerar
- [ ] DNS propagation klar
- [ ] HTTPS fungerar
- [ ] Mobile responsive testad
- [ ] Backups aktiverade
- [ ] Team informerad om launch

---

## 📞 SUPPORT & RESOURCES

- **Railway Dashboard:** https://railway.app
- **Railway Docs:** https://docs.railway.app
- **Domain (One.com):** https://one.com
- **GitHub Repo:** https://github.com/chgenberg/bolaxo

---

## 🎉 NÄR ALLT ÄR KLART

När alla checkpoints är klara:

1. ✅ Committa alla ändringar
2. ✅ Push till main branch
3. ✅ Vänta på Railway deployment (2-5 min)
4. ✅ Testa på `https://bolaxo.com`
5. ✅ 🚀 **LAUNCH!**

---

**Status:** 🟢 Ready for Production  
**Next Steps:** Följ checklist ovan punkt för punkt
