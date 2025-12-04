# 🚀 Trestor Group - Produktionslansering Checklista

## ✅ Tekniskt klart
- [x] Startsida - fokuserad på företagsförmedling
- [x] Sök bolag med filter
- [x] Objektsidor med anonym visning
- [x] NDA-flöde för att låsa upp information
- [x] Registrering och inloggning (magic link)
- [x] Säljarprofil och annonsering
- [x] Köparprofil och matchning
- [x] Datarum för dokument
- [x] Chatt mellan köpare/säljare
- [x] Dashboard för båda roller
- [x] Admin-panel
- [x] Prissida
- [x] Kontaktsida
- [x] Juridiska sidor (GDPR, villkor, etc.)
- [x] SEO (sitemap, robots, structured data)
- [x] Flerspråkig (svenska/engelska)

## 🔧 Miljövariabler att konfigurera i Railway

```env
# REQUIRED
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
BREVO_API_KEY=xkeysib-your-brevo-api-key
OPENAI_API_KEY=sk-your-openai-key

# EMAIL
EMAIL_FROM=noreply@trestorgroup.se

# BASE URL
NEXT_PUBLIC_BASE_URL=https://trestorgroup.se
```

## 🌐 Domänkonfiguration

### Steg 1: Köp domän
- [ ] Registrera `trestorgroup.se` hos Loopia, Binero eller liknande

### Steg 2: Konfigurera i Railway
1. Gå till projekt → Settings → Domains
2. Klicka "Add Domain"
3. Ange `trestorgroup.se` och `www.trestorgroup.se`
4. Kopiera CNAME-records som Railway visar

### Steg 3: DNS-inställningar
Lägg till dessa records hos din domänleverantör:
```
Type: CNAME
Name: @
Value: [railway-cname].railway.app

Type: CNAME  
Name: www
Value: [railway-cname].railway.app
```

## 📧 E-postkonfiguration (Brevo)

### Steg 1: Skapa Brevo-konto
1. Gå till brevo.com och skapa konto
2. Gå till Settings → API Keys
3. Skapa ny API-nyckel
4. Kopiera till Railway som `BREVO_API_KEY`

### Steg 2: Verifiera domän
1. I Brevo: Settings → Senders & IP → Domains
2. Lägg till `trestorgroup.se`
3. Lägg till DNS-records (SPF, DKIM) som Brevo visar
4. Vänta på verifiering (kan ta några timmar)

### Steg 3: Testa e-post
- [ ] Testa registrering (magic link ska skickas)
- [ ] Testa kontaktformulär
- [ ] Testa NDA-förfrågningar

## 💳 Betalning (Stripe - valfritt)

Om du vill aktivera betalning för säljare:
1. Skapa Stripe-konto på stripe.com
2. Hämta API-nycklar (test + live)
3. Lägg till i Railway:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🧪 Testa innan lansering

### Köparflöde
- [ ] Registrera som köpare
- [ ] Skapa investerarprofil
- [ ] Sök bland annonser
- [ ] Begär NDA för en annons
- [ ] (Som säljare) Godkänn NDA
- [ ] Se datarum efter NDA

### Säljarflöde
- [ ] Registrera som säljare
- [ ] Skapa säljarprofil
- [ ] Skapa annons (gå igenom wizard)
- [ ] Publicera annons
- [ ] Se annonsen i sökningen
- [ ] Hantera NDA-förfrågningar

### Admin
- [ ] Logga in på /admin
- [ ] Granska annonser
- [ ] Hantera användare

## 📊 Testdata att skapa

Innan lansering, skapa några demo-annonser:
1. Gå till admin-panelen
2. Skapa 3-5 olika annonser i olika branscher
3. Lägg till bilder och beskrivningar
4. Publicera dem som "active"

## 🔒 Säkerhet

- [x] HTTPS (automatiskt via Railway)
- [x] CORS-headers konfigurerade
- [x] Rate limiting på API:er
- [x] Input-validering
- [x] SQL injection-skydd (Prisma)
- [ ] Backup-rutin för databas

## 📱 Mobiloptimering

- [x] Responsiv design
- [x] Mobilvänlig navigation
- [x] Touch-vänliga knappar

## 🎯 Lansering

1. [ ] Konfigurera alla miljövariabler
2. [ ] Koppla domän
3. [ ] Verifiera e-postdomän
4. [ ] Testa alla flöden
5. [ ] Skapa testannonser
6. [ ] Gå live! 🚀

---

## Kontaktinfo för support

- **E-post:** kontakt@trestorgroup.se
- **Tel:** +46 (0)8 123 456 78

