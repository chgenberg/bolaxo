# 🧪 End-to-End Testing Guide

Denna guide visar hur du genomför ett komplett test av plattformen från köpare till säljare.

## 📋 Förutsättningar

1. **Node.js** installerat
2. **PostgreSQL** databas running
3. `npm install` körda

## 🚀 Snabbstart (5 minuter)

### Steg 1: Seed databasen med test-data
```bash
npx prisma db seed
```

Detta kommer att:
- ✅ Skapa 4 test-användare (2 köpare, 2 säljare)
- ✅ Skapa 20 listings från mock-data
- ✅ Skapa NDA-requests för testing
- ✅ Visa användar-ID:n i konsolen

### Steg 2: Starta utvecklingsservern
```bash
npm run dev
```

Öppna http://localhost:3000

### Steg 3: Gå till dev-login
```
http://localhost:3000/dev-login
```

Välj en test-användare för att logga in. **Du kan logga in som olika användare snabbt här!**

## 📝 Testflöde: Från Köpare Till Säljare

### Scenario 1: Köpare söker och sparar listing

**Användar-rolle:** Köpare

1. **Logga in som köpare**
   - Gå till `/dev-login`
   - Klicka på "Anna Köpare" eller "Carl Investerare"
   - Du omdirigeras till köpare dashboard

2. **Sök efter företag**
   - Gå till `/sok` (Sök)
   - Du ser 20 listings från seed-data
   - Klicka på ett objekt (t.ex. "Tech Consulting AB")

3. **Spara listing**
   - Klicka på "Spara" knappen
   - Knappen blir "Sparad" (med blå bakgrund)
   - Datan sparas både lokalt och i databasen

4. **Se sparade listings**
   - Gå till `/kopare/start` (Dashboard)
   - Du bör se dina sparade listings

### Scenario 2: Köpare signerar NDA

**Användar-roll:** Köpare

1. **Från objekt-sidan**
   - Gå till ett objekt (t.ex. `/objekt/obj-001`)
   - Klicka "Signera NDA" eller gå till `Ekonomi`-tab
   - Klicka på knappen "Signera NDA"

2. **Signera sekretessavtal**
   - Läs igenom villkoren
   - Fyll i "Varför är du intresserad?" (valfritt)
   - Bocka i "Jag har läst och förstår villkoren"
   - Klicka "Fortsätt till signering"

3. **Välj signeringsmetod**
   - Du kan välja mellan:
     - "Signera med BankID" (rekommenderat)
     - "Signera manuellt"
   - Klicka på en av dem

4. **Bekräftelse**
   - Du får ett "NDA skickad!" meddelande
   - NDA-förfrågan sparas i databasen
   - Status är `pending` tills säljaren godkänner

### Scenario 3: Säljare granskar och godkänner NDA

**Användar-roll:** Säljare

1. **Logga in som säljare**
   - Gå till `/dev-login`
   - Klicka på "Bo Säljare"
   - Du omdirigeras till säljare dashboard

2. **Se NDA-förfrågningar**
   - Gå till `/salja/start` (Dashboard)
   - Du ska se "NDA-förfrågningar" eller "Köparkommunikation"
   - Du ser den köpare som skickade NDA:n
   - Status visar "Väntar på godkännande"

3. **Godkänn NDA**
   - Klicka på "Godkänn" knappen
   - NDA-status uppdateras till `approved`
   - Köparen kan nu chatta med säljaren

### Scenario 4: Köpare och säljare chattar

**Användar-roll:** Köpare + Säljare (växla mellan)

#### Köpare skriver meddelande:
1. **Logga in som köpare** (via `/dev-login`)
2. **Gå till chat**
   - `/kopare/chat` 
   - Eller från dashboard: "Meddelanden"
3. **Skicka meddelande**
   - Välj en konversation
   - Skriv ett meddelande
   - Klicka "Skicka"

#### Säljare svarar:
1. **Logga in som säljare** (via `/dev-login`)
2. **Gå till säljare chat**
   - `/salja/chat`
   - Du ser köparens meddelande
3. **Svara på meddelandet**
   - Skriv svar
   - Klicka "Skicka"

## 🔄 Snabba Testcykler

För att testa många gånger snabbt:

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Seed om du vill rensa och starta om
npx prisma db seed
```

Växla mellan användare genom att:
1. Gå till `/dev-login`
2. Klicka på en annan användare
3. Du loggas in som den användaren direkt

## ✅ Checklista för End-to-End Test

### Köpare Flöde
- [ ] Logga in via dev-login som köpare
- [ ] Se listings på sök-sida
- [ ] Spara ett listing
- [ ] Sparat listing syns i dashboard
- [ ] Signera NDA för ett objekt
- [ ] NDA-förfrågan skapas i databasen
- [ ] Vänta på säljares godkännande

### Säljare Flöde
- [ ] Logga in via dev-login som säljare
- [ ] Se NDA-förfrågningar i dashboard
- [ ] Godkänn köpares NDA
- [ ] NDA-status ändras till "approved"

### Chat Flöde
- [ ] Logga in som köpare
- [ ] Skicka meddelande till säljare
- [ ] Logga in som säljare (använd dev-login)
- [ ] Se köparens meddelande
- [ ] Svara på meddelandet
- [ ] Logga in som köpare igen
- [ ] Se säljarens svar

### Data Persistence
- [ ] Sparade listings finns kvar efter omstart
- [ ] NDA-status sparas i databasen
- [ ] Meddelanden kvarstår mellan sessions

## 🐛 Felsökning

### Problem: Dev-login visar inte användare
**Lösning:** 
- Kontrollera att `process.env.NODE_ENV === 'development'`
- Öppna `/dev-login` i development mode

### Problem: NDA sparas inte
**Lösning:**
- Kontrollera att `user?.id` är definierat (se console)
- Verifiera att listings API returnerar `userId`
- Kolla databas-migrations: `npx prisma migrate status`

### Problem: Chat visar inget
**Lösning:**
- Kontrollera att du är inloggad (AuthContext.user ska vara definierat)
- Verifiera att det finns messages i databasen
- Kolla `/api/messages` endpoint

### Problem: Sparade listings synkas inte
**Lösning:**
- Kontrollera network tab i dev-tools
- Verifiera att `/api/saved-listings` POST/DELETE fungerar
- Kolla att `user.id` skickas med i request

## 📊 Databas-kommando för Testing

```bash
# Kolla säljare (sellers)
npx prisma db execute --stdin < prisma/checks/select_users.sql

# Kolla listings
npx prisma db execute --stdin < prisma/checks/select_listings.sql

# Kolla NDA requests
npx prisma db execute --stdin < prisma/checks/select_ndas.sql

# Kolla messages
npx prisma db execute --stdin < prisma/checks/select_messages.sql

# Nollställ all data
npx prisma db push --force-reset
npx prisma db seed
```

## 🎯 Nästa Steg Efter Testing

1. **Real Authentication**
   - Implementera BankID-integration
   - Ersätt dev-login med real auth

2. **Email Notifications**
   - Skicka email när NDA skapas
   - Notifikationer vid godkännande
   - Chat-meddelande-notifikationer

3. **Admin Dashboard**
   - Se all transaktionsdata
   - Moderera NDA-requests
   - Analytics och reporting

4. **Production Deployment**
   - Säker databas-config
   - SSL-certifikat
   - Rate limiting och security headers

## 📞 Kontakt & Support

Frågor? Kontrollera:
- Logs i terminal/console
- Network tab i dev-tools
- Database state med `npx prisma studio`

Happy testing! 🚀
