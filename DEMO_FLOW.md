# 🎬 KOMPLETT DEMO FLOW - Steg för steg

## 🎯 Övergripande flöde
Visa hela processen från registrering → spara listing → signera NDA → godkännande → chat

---

## 📋 FÖRBEREDELSE (5 min innan demo)

```bash
# Terminal 1: Starta servern
npm run build
npm run dev

# Terminal 2 (optional): Visa databas
npx prisma studio

# Browser: Öppna två fönster
# Fönster 1: http://localhost:3000
# Fönster 2: http://localhost:3000 (eller nytt fönster senare)
```

---

## 🚀 DEMO FLOW (15 minuter total)

### **KAPITEL 1: KÖPAREN REGISTRERAR & SÖKER (3 min)**

#### Köparen gör:
1. **Registrera sig**
   - Gå till `http://localhost:3000/registrera`
   - Välj "Köpare"
   - Klicka "Fortsätt med email"
   - Skriv email: `ch.genberg@gmail.com`
   - Fyll namn + telefon
   - Klicka "Skapa konto"
   - ✅ **Direkt inloggad! Ingen email behövs!**

2. **Fylla profil (optional - kan hoppa över)**
   - Du får ett formulär för preferenser
   - Du kan bara klicka "Spara och gå vidare" → till `/sok`

3. **Söka och spara ett listing**
   - Du är nu på `/sok`
   - Du ser 20 listings
   - Klicka på första: "Tech Consulting AB" eller liknande
   - Klicka "Spara" knappen (högre upp)
   - ✅ **Knappen blir blå "Sparad"**
   - **Visa:** "Se, det sparades i databasen!"

4. **Gå till dashboard för att visa sparad listing**
   - Klicka på ditt namn/profile icon i header
   - Välj "Min Dashboard" eller gå direkt till `/dashboard/saved`
   - ✅ **Visa den sparade listningen här!**

---

### **KAPITEL 2: KÖPAREN SIGNERAR NDA (3 min)**

#### Köparen gör:
1. **Gå tillbaka till listing**
   - Från `/sok` eller från sparade listings
   - Klicka på samma listing
   - Eller gå till `/objekt/[id]`

2. **Signera NDA**
   - Gå till "Ekonomi" tab eller klicka "Signera NDA"
   - Läs igenom NDA-texten
   - Skriv någonting i "Varför är du intresserad?" (t.ex. "Mycket intresserad av detta företag")
   - ✅ Checka: "Jag har läst och förstår villkoren"
   - Klicka "Fortsätt till signering"
   - Välj "Signera med BankID" (eller manuell)
   - ✅ **Du får "NDA skickad!" meddelande**
   - **Visa:** "Sparad i databasen som 'pending'"

3. **Kontrollera NDA-status i dashboard**
   - Gå till `/dashboard/ndas`
   - ✅ **Visa att NDA är där med status "pending"**

---

### **KAPITEL 3: SÄLJAREN GODKÄNNER NDA (3 min)**

#### Säljaren gör:
1. **Öppna nytt fönster / Ny tab**
   - Eller använd Fönster 2 som du förberedde
   - Gå till `http://localhost:3000/registrera`
   - Välj "Säljare"
   - Klicka "Fortsätt med email"
   - Skriv email: `seller@example.com`
   - Fyll namn + företag + organisationsnummer (kan skriva vad som helst)
   - Klicka "Skapa konto"
   - ✅ **Säljaren är nu inloggad!**

2. **Gå till chat-sidan för att se NDA-förfrågan**
   - Klicka på "Köparkommunikation" eller gå direkt till `/salja/chat`
   - Du ska se två tabs: "Konversationer" och "Förfrågningar"
   - Under "Förfrågningar" ska du se köparens förfrågan
   - Du ser: köpares namn, email, vilken listing, status "signed"
   - ✅ **Visa förfrågan**

3. **Godkänn NDA-förfrågan**
   - Klicka "Godkänn" knappen på förfrågan
   - ✅ **Förfrågan försvinner från "Förfrågningar"**
   - Konversationen flyttas nu till "Konversationer" tab
   - ✅ **Visa att den nu finns under "Konversationer"!**

4. **Kontrollera i dashboard (optional)**
   - Gå till `/dashboard/ndas`
   - ✅ **Visa att NDA är "approved"**

---

### **KAPITEL 4: BÅDA CHATTAR (3 min)**

#### Köparen gör:
1. **Gå till chat**
   - Gå till `/kopare/chat`
   - Du ska se säljaren i konversationslistan
   - Klicka på säljaren för att öppna chatten
   - ✅ **Visa att det är samma säljare du godkände NDA med**

2. **Skicka meddelande**
   - Skriv i chat-rutan: "Hej! Jag är väldigt intresserad av att diskutera detta vidare."
   - Klicka "Skicka" eller Enter
   - ✅ **Meddelandet visas i chatten med din avatar**

#### Säljaren gör:
1. **Se meddelandet från köparen**
   - I samma chat-session kan du se meddelandet från köparen
   - Eller refresh sidan för att se det uppdaterat
   - ✅ **Meddelandet visas med köparens avatar**

2. **Svara på meddelandet**
   - Skriv: "Tack för ditt intresse! Vi kan diskutera nästa steg när som helst."
   - Klicka "Skicka"
   - ✅ **Ditt svar visas i chatten**

#### Köparen ser svaret:
1. **Refresh eller vänta (polling var 5 sek)**
   - Säljarens svar dyker upp i chatten
   - ✅ **Visa att det är en fullständig konversation!**

---

### **KAPITEL 5: VERIFIERA I DATABAS (2 min)**

#### Visa databas-integrationen:
1. **Öppna Prisma Studio**
   ```bash
   npx prisma studio
   # Öppnas på http://localhost:5555
   ```

2. **Visa User-tabell**
   - Du ser båda användare: köparen och säljaren
   - Du ser deras roles, emails, verified status
   - ✅ **Visa att de är faktiska users i databasen!**

3. **Visa NDARequest-tabell**
   - Du ser NDA-förfrågan
   - Status: "approved"
   - buyerId: köparens ID
   - sellerId: säljarens ID
   - ✅ **Visa att det är på riktigt!**

4. **Visa Message-tabell**
   - Du ser alla meddelanden från chatten
   - Var och en har senderId, recipientId, content
   - createdAt timestamp
   - ✅ **Visa att chatt-meddelanden är persisterade!**

5. **Visa SavedListing-tabell (optional)**
   - Du ser det sparade listinget
   - userId: köparens ID
   - listingId: listing-ID:t
   - ✅ **Visa att spara-funktionen fungerar**

---

## 📊 DEMO TIMELINE

| Tid | Vad | Vem |
|-----|-----|-----|
| 0:00 | Setup & intro | Du |
| 0:30 | Köpare registrerar + spara listing | Köpare |
| 2:00 | Köpare signerar NDA | Köpare |
| 3:00 | Säljare registrerar | Säljare |
| 4:00 | Säljare godkänner NDA | Säljare |
| 5:30 | Chat mellan köpare & säljare | Båda |
| 8:00 | Visa databas (Prisma Studio) | Du |
| 10:00 | Slut & Q&A | Du |

---

## 🎬 DEMO-TIPS

### Vad ska du säga/visa?

**Innan demo börjar:**
- "Vi har byggt en komplett end-to-end flow för företagsöverlåtelser"
- "Ingen email-verifiering behövs i development - direkt inloggning"
- "Alla data sparas i databasen - detta är production-ready"

**Under registrering:**
- "Se hur snabbt användaren är inloggad - ingen magic link behövs här"
- "I produktion använder vi BankID, men i development har vi direktlogin"

**Under spara:**
- "Denna listing sparas i databasen - kopplingen är live"
- "Köparen kan se allt de sparade på sin dashboard"

**Under NDA:**
- "NDA-förfrågan skapas i databasen automatiskt när köparen signerar"
- "Status börjar som 'pending' tills säljaren godkänner"

**Under chat:**
- "Både köpare och säljare kan nu chatta - men BARA om NDA är godkänd"
- "Det är permission-checking på backend"
- "Meddelanden sparas i databasen med timestamps"

**Vid databas-visningen:**
- "Här kan du se ALLT - users, NDAs, meddelanden, sparade listings"
- "Allt är relaterat med förvalskyrka - ingen data dupliceras"

---

## ⚠️ POTENTIELLA ISSUES & FIXES

### Problem: Chat visar inte meddelanden omedelbar
**Lösning:** Chat använder polling var 5 sekund, så vänta eller refresh

### Problem: NDA-förfrågan försvinner för säljaren
**Lösning:** Det är korrekt beteende - den moved från "Förfrågningar" till "Konversationer"

### Problem: Can't login twice
**Lösning:** Använd två browser-fönster eller inkognito-läge

### Problem: Databas visar inte nyskapad data
**Lösning:** Refresh Prisma Studio eller använd F5

---

## 🎯 DEMO GOALS

✅ Visa att ni kan registrera två användare
✅ Visa att köparen kan spara och signera NDA
✅ Visa att säljaren kan godkänna NDA
✅ Visa att båda kan chatta
✅ Visa att data är persistent i databasen
✅ Visa att det är production-ready code

---

## 💡 BONUS (om det finns tid)

1. **Visa admin-dashboard** (`/dashboard/listings` för säljare)
2. **Visa sökningen** - hur listing-matchning fungerar
3. **Visa preferences** - köpare kan sätta preferenser
4. **Visa notifications** - när NDA godkänns eller meddelande kommer

---

**Du är nu redo att köra en world-class demo!** 🚀
