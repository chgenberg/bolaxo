# 🌍 PRODUCTION DEMO GUIDE

## ✅ För testing direkt i production utan lokal setup

---

## 🚀 FÖRBEREDELSE (1 min)

### **Allt du behöver:**
```
1. Production URL: https://bolagsportalen.up.railway.app/
   (eller din faktiska production URL)

2. Två browser-fönster:
   - Fönster 1: Normal läge (för köpare)
   - Fönster 2: Privat-läge (för säljare)
   
   ELLER
   
   - Browser 1: Chrome
   - Browser 2: Safari eller Firefox

3. Klar! Ingen local setup behövs! ✅
```

---

## 🎬 PRODUCTION DEMO FLOW (15 minuter)

### **KAPITEL 1: SÄLJAREN SKAPAR KONTO & LÄGGER UPP ANNONS (3 min)**

**Fönster 2 - Säljaren gör:**

1. Gå till `https://bolagsportalen.up.railway.app/registrera`
2. Välj "Säljare"
3. Email: `test-seller-27okt@temp.com` (eller din temp-email)
4. Fyll namn + företag + org-nummer (kan skriva vad som helst)
5. Klicka "Skapa konto"
   - ✅ **Säljaren är inloggad!**

6. Du får ett formulär för att fylla i företagsinformation
   - Fyll i några grundläggande saker (eller bara klicka "Spara och gå vidare")
   - ✅ **Kom till säljare dashboard**

7. Klicka "Lägg upp annons" eller gå till `/salja/listings/ny`
8. Fyll i annonsens detaljer:
   - Titel: "Konsultföretag - Tech & AI"
   - Beskrivning: "Växande IT-konsultföretag specialiserat på AI-lösningar"
   - Kategori: Välj relevant
   - Pris: T.ex. "5 000 000"
   - Employees: "15"
   - Revenue: "10 000 000"
   - Lägg till bild (valfritt)
   
9. Klicka "Publicera" eller "Lägg upp"
   - ✅ **Annonsen är nu live på plattformen!**
   - ✅ **"Annons publicerad" meddelande**

---

### **KAPITEL 2: KÖPAREN REGISTRERAR & HITTAR ANNONSEN (3 min)**

**Fönster 1 - Köparen gör:**

1. Gå till `https://bolagsportalen.up.railway.app/registrera`
2. Välj "Köpare"
3. Email: `test-buyer-27okt@temp.com` (eller din temp-email)
4. Fyll namn + telefon
5. Klicka "Skapa konto"
   - ✅ **Direkt inloggad! Ingen email-verifiering!**

6. Du får ett formulär för köpares preferenser
   - Fyll i några preferenser eller bara "Skapa och gå vidare"
   - ✅ **Kom till söksidan `/sok`**

7. Gå till `/sok` (eller du är redan där)
8. Sök eller scroll tills du hittar säljares annons "Konsultföretag - Tech & AI"
9. Klicka på den
   - ✅ **Se annonsens detaljer som säljaren just lade upp!**

10. Klicka "Spara" knappen
    - ✅ **Knappen blir blå "Sparad"**

11. Gå till `/dashboard/saved`
    - ✅ **Visa det sparade listinget här**

---

### **KAPITEL 3: KÖPAREN SIGNERAR NDA (3 min)**

**Fönster 1 - Köparen gör:**

1. Gå tillbaka till samma listing från `/sok` eller från sparade
2. Gå till "Ekonomi" tab eller klicka "Signera NDA"
3. Läs igenom NDA-texten
4. Skriv: "Mycket intresserad av detta företag och dess affärsmodell"
5. ✅ Checka: "Jag har läst och förstår villkoren"
6. Klicka "Fortsätt till signering"
7. Välj "Signera med BankID"
   - ✅ **"NDA skickad!" meddelande**

8. Gå till `/dashboard/ndas`
   - ✅ **Visa NDA med status "pending"** (väntar på säljares godkännande)

---

### **KAPITEL 4: SÄLJAREN GODKÄNNER NDA (2 min)**

**Fönster 2 - Säljaren gör:**

1. Du är redan inloggad som säljare
2. Gå till `/salja/chat` (eller klicka "Köparkommunikation" i header)
3. Du ska se två tabs: "Konversationer" och "Förfrågningar"
4. Under "Förfrågningar" - se köparens NDA-förfrågan
   - ✅ **Status: "signed"**
   - Du ser köpares namn, email, och vilket listing

5. Klicka "Godkänn"
   - ✅ **Förfrågan försvinner från "Förfrågningar"**
   - ✅ **Dyker upp under "Konversationer"**

6. (Optional) Kontrollera i `/dashboard/ndas` - se NDA-status är "approved"

---

### **KAPITEL 5: CHAT MELLAN KÖPARE & SÄLJARE (3 min)**

**Fönster 1 - Köparen gör:**

1. Gå till `/kopare/chat`
2. Du ska se säljaren i listan
3. Klicka på säljaren för att öppna chatten
4. Skriv: "Hej! Jag är väldigt intresserad av att diskutera detta vidare."
5. Klicka "Skicka"
   - ✅ **Meddelandet visas med din avatar**
   - ⏳ **Vänta 5-10 sekunder (production latency)**

**Fönster 2 - Säljaren gör:**

1. Fortfarande på `/salja/chat` under "Konversationer"
2. Klicka på köparen för att öppna chatten
3. ⏳ **Vänta på att meddelandet dyker upp (eller refresh)**
   - ✅ **Se köparens meddelande**

4. Skriv: "Tack för ditt intresse! Vi kan diskutera nästa steg när som helst."
5. Klicka "Skicka"
   - ✅ **Ditt svar visas**

**Fönster 1 - Köparen ser svaret:**

1. ⏳ **Vänta 5-10 sekunder eller refresh**
   - ✅ **Se säljarens svar**
   - ✅ **Full konversation fungerar!**

---

### **KAPITEL 6: VERIFIERA I PRODUKTION (2 min)**

**Terminal - Visa databas:**

```bash
# Anslut till production-databasen (du behöver DATABASE_URL)
DATABASE_URL="postgresql://..." npx prisma studio

# Öppnas på http://localhost:5555
```

**Prisma Studio - Visa:**

1. **User-tabell**
   - Du ser båda users: köparen och säljaren
   - Status: verified, bankIdVerified osv
   - ✅ **Faktiska users i databasen!**

2. **Listing-tabell**
   - Du ser annonsen som säljaren just skapade
   - Title: "Konsultföretag - Tech & AI"
   - Linked till säljaren via userId
   - ✅ **Listing är lagrat i databas!**

3. **NDARequest-tabell**
   - Du ser NDA-förfrågan
   - Status: "approved"
   - buyerId och sellerId är länkade till rätt users
   - ✅ **NDA är persistent data!**

4. **Message-tabell**
   - Alla chat-meddelanden från testningen
   - senderId, recipientId, content
   - createdAt timestamps
   - ✅ **Chat-meddelanden sparade i databas!**

5. **SavedListing-tabell** (optional)
   - Det sparade listinget från köparen
   - userId länkad till köparen
   - ✅ **Spara-funktionen fungerar!**

---

## ⏱️ TIDSPLAN

| Tid | Vad |
|-----|-----|
| 0:00 | Intro & setup |
| 0:30 | Säljare skapar konto + lägger upp annons |
| 2:30 | Köpare registrerar + hittar annonsen |
| 3:30 | Köpare sparar + signerar NDA |
| 4:30 | Säljare godkänner NDA |
| 5:00 | Chat mellan båda |
| 8:00 | Visa production-databas |
| 10:00 | Slut & frågor |

---

## 🎤 DEMO TALKING POINTS

**Intro:**
- "Vi testar direkt i production för att visa att det är verkligt och production-ready"
- "Ingen setup behövs - bara två browsers"
- "Allt data sparas permanent i production-databasen"
- "Från säljaren lägger upp annons till köpare och säljare chattar - allt fungerar!"

**Under säljare-registrering:**
- "Se hur snabbt säljaren kan komma igång - skapa konto, lägga upp annons direkt"

**Under köpare-registrering:**
- "Köparen hittar redan säljares annons - systemet är real-time!"

**Under spara:**
- "Data sparas omedelbar i databasen"

**Under NDA:**
- "NDA-förfrågan skapas i databasen när köparen signerar"
- "Säljaren ser förfrågan och kan godkänna eller avslå"

**Under chat:**
- "Båda parter kan chatta BARA om NDA är godkänd - det är permission-checking på backend"
- "Network latency visar att det är verkligt system över internet"

**Vid databas:**
- "Här ser ni ALLT data - users, listings, NDAs, meddelanden - allt persistent"
- "Det här är real production data, inte mock!"

---

## ⚠️ PRODUCTION TIPS

### **Vänta på svar:**
- Chat-meddelanden: 5-10 sekunder (network latency)
- Om något verkar långsamt: Det är normalt! Det visar verklig production.

### **Om något "hänger":**
- Refresh sidan (F5)
- Vänta ytterligare 5 sekunder
- Prova igen

### **För smooth demo:**
1. **Testa flödet innan** - Gör det en gång innan demo
2. **Ha emails klara** - Skriv dem ner tidigare
3. **Planera vad du ska säga** - Använd talking points ovan
4. **Be om tålamod** - "Det kan ta några sekunder pga production"
5. **Nämn att du lägger upp annons först** - Det visar fullständigt flöde!

---

## 🚀 DU ÄR KLAR!

Allt du behöver är:
- ✅ Production URL
- ✅ Två browsers
- ✅ Denna guide

**Key selling point: Från noll till fungerande marknadsplats med köp-säljar-chat på ~10 minuter!**

Lycka till med demot! 🎬
