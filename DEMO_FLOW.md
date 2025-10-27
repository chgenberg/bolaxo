# 🎬 KOMPLETT DEMO FLOW - Steg för steg

## 🎯 Övergripande flöde
Visa hela processen från säljaren lägger upp → köpare hittar → signera NDA → godkännande → chat

---

## 📋 FÖRBEREDELSE FÖR LOKAL TESTING (2 min)

### **Setup:**

```bash
# Terminal 1: Starta servern
npm run build
npm run dev

# Terminal 2 (optional): Visa databas
npx prisma studio
```

### **Browser:**
```
Fönster 1: http://localhost:3000 (för köpare)
Fönster 2: http://localhost:3000 (privat-läge eller nytt fönster för säljare)
```

---

## 🚀 DEMO FLOW (15 minuter total)

### **KAPITEL 1: SÄLJAREN SKAPAR KONTO & LÄGGER UPP ANNONS (3 min)**

#### Säljaren gör:

1. **Registrera sig**
   - Gå till `http://localhost:3000/registrera`
   - Välj "Säljare"
   - Klicka "Fortsätt med email"
   - Skriv email: `seller@example.com`
   - Fyll namn + företag + organisationsnummer
   - Klicka "Skapa konto"
   - ✅ **Direkt inloggad! Ingen email behövs!**

2. **Fylla profil**
   - Du får ett formulär för företagsinformation
   - Fyll i några saker eller bara klicka "Spara och gå vidare"
   - ✅ **Kom till säljare dashboard `/salja/dashboard`**

3. **Lägga upp annons**
   - Klicka "Lägg upp annons" eller gå till `/salja/listings/ny`
   - Fyll i annonsens detaljer:
     - Titel: "Konsultföretag - Tech & AI"
     - Beskrivning: "Växande IT-konsultföretag specialiserat på AI-lösningar"
     - Kategori: Välj relevant
     - Pris: T.ex. "5 000 000"
     - Employees: "15"
     - Revenue: "10 000 000"
     - Lägg till bild (valfritt - eller bara bekräfta utan bild)
   
   - Klicka "Publicera" eller "Lägg upp"
   - ✅ **Annonsen är nu live på plattformen!**
   - ✅ **"Annons publicerad" meddelande**
   - **Visa:** "Se, annonsen är nu på söksidan!"

---

### **KAPITEL 2: KÖPAREN REGISTRERAR & HITTAR ANNONSEN (3 min)**

#### Köparen gör (Fönster 1):

1. **Registrera sig**
   - Gå till `http://localhost:3000/registrera`
   - Välj "Köpare"
   - Klicka "Fortsätt med email"
   - Skriv email: `ch.genberg@gmail.com` (eller annan email)
   - Fyll namn + telefon
   - Klicka "Skapa konto"
   - ✅ **Direkt inloggad! Ingen email behövs!**

2. **Fylla profil (optional - kan hoppa över)**
   - Du får ett formulär för preferenser
   - Du kan bara klicka "Spara och gå vidare" → till `/sok`

3. **Söka och hitta annonsen**
   - Du är nu på `/sok`
   - Sök efter "Konsultföretag" eller scroll för att hitta säljares annons
   - Klicka på den
   - ✅ **Se annonsens detaljer som säljaren just lade upp!**
   - **Visa:** "Se, den är redan här - systemet är real-time!"

4. **Spara annonsen**
   - Klicka "Spara" knappen (högre upp)
   - ✅ **Knappen blir blå "Sparad"**
   - **Visa:** "Data sparas omedelbar i databasen!"

5. **Gå till dashboard för att visa sparad annons**
   - Klicka på ditt namn/profile icon i header
   - Välj "Min Dashboard" eller gå direkt till `/dashboard/saved`
   - ✅ **Visa den sparade annonsen här!**

---

### **KAPITEL 3: KÖPAREN SIGNERAR NDA (3 min)**

#### Köparen gör (Fönster 1):

1. **Gå tillbaka till annonsen**
   - Från `/sok` eller från sparade annonser
   - Klicka på samma annons

2. **Signera NDA**
   - Gå till "Ekonomi" tab eller klicka "Signera NDA"
   - Läs igenom NDA-texten
   - Skriv något i "Varför är du intresserad?" 
     - T.ex. "Mycket intresserad av detta företag och dess affärsmodell"
   - ✅ Checka: "Jag har läst och förstår villkoren"
   - Klicka "Fortsätt till signering"
   - Välj "Signera med BankID" (eller manuell)
   - ✅ **Du får "NDA skickad!" meddelande**
   - **Visa:** "NDA-förfrågan är nu sparad i databasen som 'pending'"

3. **Kontrollera NDA-status i dashboard**
   - Gå till `/dashboard/ndas`
   - ✅ **Visa att NDA är där med status "pending"**
   - Köparen väntar på att säljaren godkänner

---

### **KAPITEL 4: SÄLJAREN GODKÄNNER NDA (2 min)**

#### Säljaren gör (Fönster 2):

1. **Gå till chat-sidan för att se NDA-förfrågan**
   - Du är redan inloggad som säljare
   - Klicka på "Köparkommunikation" i header eller gå till `/salja/chat`
   - Du ska se två tabs: "Konversationer" och "Förfrågningar"
   - Under "Förfrågningar" ska du se köparens förfrågan
   - Du ser: köpares namn, email, vilken annons, status "signed"
   - ✅ **Visa förfrågan**
   - **Visa:** "Här ser säljaren alla nya NDA-förfrågningar!"

2. **Godkänn NDA-förfrågan**
   - Klicka "Godkänn" knappen på förfrågan
   - ✅ **Förfrågan försvinner från "Förfrågningar"**
   - Konversationen flyttas nu automatiskt till "Konversationer" tab
   - ✅ **Visa att den nu finns under "Konversationer"!**
   - **Visa:** "Nu kan de chatta med varandra!"

3. **Kontrollera i dashboard (optional)**
   - Gå till `/dashboard/ndas`
   - ✅ **Visa att NDA är "approved"**

---

### **KAPITEL 5: BÅDA CHATTAR (3 min)**

#### Köparen gör (Fönster 1):

1. **Gå till chat**
   - Gå till `/kopare/chat`
   - Du ska se säljaren i konversationslistan
   - Klicka på säljaren för att öppna chatten
   - ✅ **Visa att det är samma säljare du godkände NDA med**

2. **Skicka meddelande**
   - Skriv i chat-rutan: "Hej! Jag är väldigt intresserad av att diskutera detta vidare."
   - Klicka "Skicka" eller Enter
   - ✅ **Meddelandet visas i chatten med din avatar**
   - **Visa:** "Köparen skickar sitt första meddelande"

#### Säljaren gör (Fönster 2):

1. **Se meddelandet från köparen**
   - Du är redan på `/salja/chat` under "Konversationer"
   - Klicka på köparen i listan
   - ✅ **Du ser köparens meddelande**
   - **Visa:** "Köparens meddelande dyker upp här"

2. **Svara på meddelandet**
   - Skriv: "Tack för ditt intresse! Vi kan diskutera nästa steg när som helst."
   - Klicka "Skicka"
   - ✅ **Ditt svar visas i chatten**

#### Köparen ser svaret (Fönster 1):

1. **Refresh eller vänta (polling var 5 sek)**
   - Säljarens svar dyker upp i chatten
   - ✅ **Visa att det är en fullständig konversation!**
   - **Visa:** "En komplett två-vägs konversation - allt sparas i databasen!"

---

### **KAPITEL 6: VERIFIERA I DATABASEN (2 min)**

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

3. **Visa Listing-tabell**
   - Du ser annonsen som säljaren skapade
   - Title: "Konsultföretag - Tech & AI"
   - userId är länkad till säljaren
   - ✅ **Visa att annonsen är sparad i databasen!**

4. **Visa NDARequest-tabell**
   - Du ser NDA-förfrågan
   - Status: "approved"
   - buyerId: köparens ID
   - sellerId: säljarens ID
   - ✅ **Visa att det är på riktigt!**

5. **Visa Message-tabell**
   - Du ser alla meddelanden från chatten
   - Var och en har senderId, recipientId, content
   - createdAt timestamp för varje meddelande
   - ✅ **Visa att chatt-meddelanden är persisterade!**

6. **Visa SavedListing-tabell** (optional)
   - Du ser det sparade listinget
   - userId: köparens ID
   - listingId: annonsen som sparades
   - ✅ **Visa att spara-funktionen fungerar**

---

## 📊 DEMO TIMELINE

| Tid | Vad | Vem |
|-----|-----|-----|
| 0:00 | Setup & intro | Du |
| 0:30 | Säljare skapar konto & lägger upp annons | Säljare |
| 2:30 | Köpare registrerar & hittar annonsen | Köpare |
| 3:30 | Köpare sparar & signerar NDA | Köpare |
| 4:30 | Säljare godkänner NDA | Säljare |
| 5:00 | Chat mellan båda | Båda |
| 8:00 | Visa databas (Prisma Studio) | Du |
| 10:00 | Slut & Q&A | Du |

---

## 🎬 DEMO-TIPS

### Vad ska du säga/visa?

**Innan demo börjar:**
- "Vi har byggt en komplett end-to-end flöde för företagsöverlåtelser"
- "Från säljaren lägger upp till köpare och säljare chattar - allt fungerar!"
- "Ingen email-verifiering behövs i development - direkt inloggning"
- "Alla data sparas i databasen - detta är production-ready"

**Under säljare-registrering:**
- "Se hur snabbt säljaren kan komma igång - skapa konto, lägga upp annons direkt"

**Under köpare-registrering:**
- "Köparen hittar redan säljares annons - systemet är real-time!"
- "Ingen email-verifiering behövs här"

**Under spara:**
- "Denna annons sparas i databasen - kopplingen är live"
- "Köparen kan se allt de sparade på sin dashboard"

**Under NDA:**
- "NDA-förfrågan skapas i databasen automatiskt när köparen signerar"
- "Status börjar som 'pending' tills säljaren godkänner"

**Under chat:**
- "Både köpare och säljare kan nu chatta - men BARA om NDA är godkänd"
- "Det är permission-checking på backend"
- "Meddelanden sparas i databasen med timestamps"

**Vid databas-visningen:**
- "Här kan du se ALLT - users, listings, NDAs, meddelanden, sparade annonser"
- "Allt är relaterat med foreign keys - ingen data dupliceras"
- "Det här är verklig persistent data!"

---

## ⚠️ POTENTIELLA ISSUES & FIXES

### Problem: Chat visar inte meddelanden omedelbar
**Lösning:** Chat använder polling var 5 sekund, så vänta eller refresh

### Problem: NDA-förfrågan försvinner för säljaren
**Lösning:** Det är korrekt beteende - den moves från "Förfrågningar" till "Konversationer"

### Problem: Can't login twice
**Lösning:** Använd två browser-fönster eller inkognito-läge

### Problem: Databas visar inte nyskapad data
**Lösning:** Refresh Prisma Studio eller använd F5

### Problem: Annons visas inte för köparen
**Lösning:** Gå till söksidan `/sok` och scroll eller sök efter annonsens titel

---

## 🎯 DEMO GOALS

✅ Visa att säljaren kan lägga upp annons snabbt
✅ Visa att köparen kan hitta annonsen
✅ Visa att köparen kan spara och signera NDA
✅ Visa att säljaren kan godkänna NDA
✅ Visa att båda kan chatta
✅ Visa att data är persistent i databasen
✅ Visa att det är production-ready code

---

## 💡 BONUS (om det finns tid)

1. **Visa admin-dashboard** (`/dashboard/listings` för säljare)
2. **Visa sökningen** - hur man filtrerar annonser
3. **Visa preferences** - köpare kan sätta preferenser för matchning
4. **Visa notifications** - när NDA godkänns eller meddelande kommer
5. **Registrera en tredje användare** - visa att systemet skalerar

---

## 🚀 KEY POINTS FÖR DEMOT

- **Real marketplace:** Från säljare publicerar till chat funktionerar
- **Zero friction:** Direkt login, ingen email-verifiering
- **Persistent data:** Allt sparas i databas
- **Permission-based chat:** Kan bara chatta om NDA är godkänd
- **Production-ready:** All kod fungerar i produktion

---

**Du är nu redo att köra en world-class demo!** 🎬
