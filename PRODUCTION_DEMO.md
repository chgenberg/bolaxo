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

### **KAPITEL 1: KÖPAREN (3 min)**

**Fönster 1 - Köparen gör:**

1. Gå till `https://bolagsportalen.up.railway.app/registrera`
2. Välj "Köpare"
3. Email: `test-buyer-27okt@temp.com` (eller din temp-email)
4. Fyll namn + telefon
5. Klicka "Skapa konto"
   - ✅ **Direkt inloggad! Ingen email-verifiering!**

6. Gå till `/sok`
7. Klicka på första listing (t.ex. "Tech Consulting AB")
8. Klicka "Spara" knappen
   - ✅ **Knappen blir blå "Sparad"**

9. Gå till `/dashboard/saved`
   - ✅ **Visa det sparade listinget**

---

### **KAPITEL 2: KÖPAREN SIGNERAR NDA (3 min)**

**Fönster 1 - Köparen gör:**

1. Gå tillbaka till samma listing från `/sok`
2. Gå till "Ekonomi" tab eller klicka "Signera NDA"
3. Läs igenom
4. Skriv: "Mycket intresserad av detta företag"
5. ✅ Checka: "Jag har läst och förstår villkoren"
6. Klicka "Fortsätt till signering"
7. Välj "Signera med BankID"
   - ✅ **"NDA skickad!" meddelande**

8. Gå till `/dashboard/ndas`
   - ✅ **Visa NDA med status "pending"**

---

### **KAPITEL 3: SÄLJAREN (3 min)**

**Fönster 2 (Privat-läge) - Säljaren gör:**

1. Gå till samma URL: `https://bolagsportalen.up.railway.app/registrera`
2. Välj "Säljare"
3. Email: `test-seller-27okt@temp.com` (eller din temp-email)
4. Fyll namn + företag + org-nummer (kan skriva vad som helst)
5. Klicka "Skapa konto"
   - ✅ **Säljaren är inloggad!**

6. Gå till `/salja/chat` (eller klicka "Köparkommunikation")
7. Du ska se två tabs: "Konversationer" och "Förfrågningar"
8. Under "Förfrågningar" - se köparens NDA
   - ✅ **Status: "signed"**

9. Klicka "Godkänn"
   - ✅ **Förfrågan försvinner från "Förfrågningar"**
   - ✅ **Dyker upp under "Konversationer"**

---

### **KAPITEL 4: CHAT MELLAN KÖPARE & SÄLJARE (3 min)**

**Fönster 1 - Köparen gör:**

1. Gå till `/kopare/chat`
2. Du ska se säljaren i listan
3. Klicka på säljaren
4. Skriv: "Hej! Jag är väldigt intresserad av att diskutera detta vidare."
5. Klicka "Skicka"
   - ✅ **Meddelandet visas med din avatar**
   - ⏳ **Vänta 5-10 sekunder (production latency)**

**Fönster 2 - Säljaren gör:**

1. Fortfarande på `/salja/chat` under "Konversationer"
2. Klicka på köparen
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

### **KAPITEL 5: VERIFIERA I PRODUKTION (2 min)**

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

2. **NDARequest-tabell**
   - Du ser NDA-förfrågan
   - Status: "approved"
   - buyerId och sellerId är länkade
   - ✅ **Verkligt data!**

3. **Message-tabell**
   - Alla chat-meddelanden från testningen
   - senderId, recipientId, content
   - createdAt timestamps
   - ✅ **Persisterat i databas!**

4. **SavedListing-tabell** (optional)
   - Det sparade listinget
   - userId länkad till köparen
   - ✅ **Spara-funktionen fungerar!**

---

## ⏱️ TIDSPLAN

| Tid | Vad |
|-----|-----|
| 0:00 | Intro & setup |
| 0:30 | Köpare registrerar + spara |
| 2:00 | Köpare signerar NDA |
| 3:00 | Säljare registrerar |
| 4:00 | Säljare godkänner NDA |
| 5:30 | Chat mellan båda |
| 8:00 | Visa production-databas |
| 10:00 | Slut & frågor |

---

## 🎤 DEMO TALKING POINTS

**Intro:**
- "Vi testar direkt i production för att visa att det är verkligt och production-ready"
- "Ingen setup behövs - bara två browsers"
- "Allt data sparas permanent i production-databasen"

**Under registrering:**
- "Se hur snabbt användaren är inloggad - ingen email-verifiering behövs i dev-mode"

**Under spara:**
- "Data sparas omedelbar i databasen"

**Under NDA:**
- "NDA-förfrågan skapas i databasen när köparen signerar"

**Under chat:**
- "Både parter kan chatta BARA om NDA är godkänd - det är permission-checking på backend"
- "Network latency visar att det är verkligt system över internet"

**Vid databas:**
- "Här ser ni ALLT data - users, NDAs, meddelanden - allt persistent"
- "Det här är real production data"

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
3. **Avsluta chat-test två gånger** - Visa consistency
4. **Be om tålamod** - "Det kan ta några sekunder pga production"

---

## 🚀 DU ÄR KLAR!

Allt du behöver är:
- ✅ Production URL
- ✅ Två browsers
- ✅ Denna guide

Lycka till med demot! 🎬
