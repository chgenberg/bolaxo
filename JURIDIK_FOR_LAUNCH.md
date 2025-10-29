# ⚖️ JURIDIK FÖR INITIAL LAUNCH

**Status:** Fokuserat på kärnflöde (annonsering + NDA)  
**Tidsplan:** 1-2 veckor  
**Budget:** ~20-40k SEK

---

## ✅ REDAN KLART

- [x] Terms of Service (`/juridiskt/anvandarvillkor`)
- [x] Privacy Policy (`/juridiskt/integritetspolicy`)
- [x] Cookie Policy (`/juridiskt/cookies`)
- [x] GDPR compliance

---

## ❌ BEHÖVS INNAN LAUNCH (KÄRNFLÖDE ENDAST)

### 1. **Seller Agreement** (1-2 sidor)
Vad säljare godkänner när de annonserar:
- De kan annonsera sitt företag gratis
- De godkänner att köpare kan se basic info
- De accepterar NDA-processen
- Bolagsportalen kan visa deras objekt i sökning

**Template:** Du kan själv skriva detta enkelt eller hämta från legalpanda.se

---

### 2. **Buyer Agreement** (1-2 sidor)
Vad köpare godkänner när de registrerar:
- De kan söka och se företag anonymt
- De måste signera NDA för att se detaljer
- De accepterar villkoren för att skicka LOI

**Template:** Simpel, 2-3 paragrafer

---

### 3. **Broker Agreement** (1-2 sidor)
Vad mäklare godkänner:
- De kan annonsera sina kunders företag
- De accepterar samma villkor som säljare

**Template:** Nästan identisk med Seller Agreement

---

### 4. **NDA-mall** (2-3 sidor)
**KRITISKT** - Användarna signerar detta digitalt

En enkel, standard Swedish NDA med:
- Mutual confidentiality (båda parter skyddade)
- 2-3 år giltighetstid
- Undantag för allmän kunskap
- Svensk lag (Stockholm tingsrätt)

**Option A:** Hämta från legalpanda.se (~500 kr)  
**Option B:** ChatGPT-genererad + advokat quick-check (~2-3 timmar)  
**Option C:** Advokat från scratch (~10-15k SEK)

---

## 🎯 VÄGVISARE

### **Dessa kan du göra själv på 2-3 timmar:**
1. Skriva Seller/Buyer/Broker Agreements (kopiera från Terms)
2. Anpassa dessa efter ditt use case
3. Publicera på `/juridiskt/seller-agreement` osv

### **NDA-mallen - 2 vägar:**
1. **Billigt (~500-1000 kr):** Hämta från legalpanda.se eller Boilerplate
2. **Gratis:** Låt ChatGPT generera en + din snabba review

### **Advokat-granskning:**
- Kan skippas för launch (men bör göras senare)
- Eller book 1-2 timmar med advokat för quick review (~5-7k SEK)

---

## ✨ VÄGVISARE FÖR IMPLEMENTERING

### Lägg till nya juridik-sidor:
```
/app/juridiskt/seller-agreement/page.tsx
/app/juridiskt/buyer-agreement/page.tsx
/app/juridiskt/broker-agreement/page.tsx
/app/juridiskt/nda-template/page.tsx
```

### Uppdatera Footer-links:
Lägg till länkarna under "Juridiskt" sektion

---

## ❌ DETTA BLURRAR VI ("KOMMER SNART"):

- SPA (Share Purchase Agreement)
- Due Diligence dokument
- Transaction agreements
- Payment T&Cs
- Dispute resolution procedures
- Allt annat avancerat

---

## 📊 TIMELINE REALISTISK

- **Idag-Imorgon:** Skriv/kopiera Seller/Buyer/Broker Agreements (2 tim)
- **Imorgon:** Sätta upp NDA-mall (1 tim via legalpanda/ChatGPT)
- **Dag 3:** Implementera i app som nya juridik-sidor (1 tim)
- **Dag 4:** Test at allt ser bra ut

**Total: 5-6 timmar arbete = KLART INNAN WEEKEND** ✅

---

## 💡 MY RECOMMENDATION

1. **Skriv själv** (30 min):
   - Seller Agreement (copy från Terms)
   - Buyer Agreement (simplified version)
   - Broker Agreement (copy från Seller)

2. **Hämta NDA** (15 min):
   - Gå till legalpanda.se
   - Sök "NDA Swedish"
   - Köp template (~500 kr)

3. **Implementera** (1 tim):
   - Lägg till nya sidor i `/juridiskt/`
   - Uppdatera footer

4. **Test** (15 min):
   - Verifiera alla links fungerar
   - Läs igenom för typos

**Total tid: ~2.5 timmar = Du är DONE** 🎉

---

## 📝 EXEMPEL SELLER AGREEMENT (2 MINUTER ATT SKRIVA)

```
# Villkor för Säljare

Genom att annonsera ett företag på Bolagsportalen godkänner du:

1. Du är behörig att sälja detta företag (äger det eller har mandat)
2. Informationen du ger är korrekt och sanningsenlig
3. Du accepterar att köpare kan se:
   - Företagsnamn (anonymiserat innan NDA)
   - Bransch, omsättning, medarbetare
   - Övrig info du väljer att dela

4. Köpare måste signera NDA för att se känslig info
5. Du godkänner Bolagsportalens användarvillkor
6. Bolagsportalen är en plattform - vi är INTE din advokat
7. Du står själv för juridisk rådgivning

Giltighetstid: Tills du tar ned annonsen
Lag: Svensk lag, Stockholms tingsrätt
```

Klart på 2 minuter! ✅

---

## 🚀 NÄSTA STEG - DU VÄLJER

**OPTION 1: Gör det själv denna vecka**
- Skriv agreements (30 min)
- Hämta NDA från legalpanda (15 min)
- Implementera i app (1 tim)
- **DONE - KAN LAUCHA DENNA VECKA**

**OPTION 2: Anlita advokat för full granskning**
- Ringer Setterwalls (30 min call)
- De granskar och justerar (3-5 dagar)
- Du publicerar + LAUCHAR
- **DONE - EN VECKA MED ADVOKAT-GODKÄND JURIDIK**

**Min rekommendation:** OPTION 1 nu, OPTION 2 senare när du har kapital
