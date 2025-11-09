# Hur BOLAXO Appen Fungerar - Komplett Guide

## 🎯 Vad är BOLAXO?

**BOLAXO** är en marknadsplats för företagsförsäljning där:
- **Säljare** kan lista sina företag till försäljning
- **Köpare** kan söka och köpa företag
- **Mäklare** kan hantera flera annonser
- **AI-driven värdering** hjälper säljare att få rätt pris

---

## 🏗️ Arkitektur & Teknik

### Tech Stack
- **Next.js 15** (App Router) - React-framework med server-side rendering
- **TypeScript** - Type-safe kod
- **TailwindCSS** - Styling
- **Zustand** - State management (lightweight Redux-alternativ)
- **Prisma** - Database ORM
- **PostgreSQL** - Databas (via Railway/Heroku)
- **OpenAI GPT** - AI-värderingar
- **Stripe** - Betalningar
- **BankID** - Verifiering (planerat)

### Databasstruktur
- **Users** - Användare (säljare, köpare, mäklare)
- **Listings** - Annonser för försäljning
- **Valuations** - AI-värderingar
- **NDAs** - Sekretessavtal
- **LOIs** - Indikativa anbud
- **Transactions** - Pågående affärer
- **Payments** - Betalningar och prenumerationer

---

## 👥 Användarroller

### 1. Säljare (Seller)
**Mål:** Sälja sitt företag

**Flöde:**
1. Skapar konto → väljer "Säljare"
2. Får **gratis AI-värdering** (ny funktion!)
3. Skapar annons via 7-stegs wizard
4. Väljer paket (Basic/Featured/Premium)
5. Publicerar annons
6. Får NDA-förfrågningar från köpare
7. Godkänner NDA → köpare får tillgång till datarum
8. Får LOI (indikativa anbud)
9. Förhandlar och slutför affär

**Viktiga funktioner:**
- ✅ **Gratis värdering** - AI analyserar företaget baserat på org.nr
- ✅ **Auto-fyllning** - Hämtar data från Bolagsverket automatiskt
- ✅ **NDA-skydd** - Kontrollerar vad som visas före/efter NDA
- ✅ **Datarum** - Säker dokumentdelning
- ✅ **Q&A** - Svarar på köpares frågor

---

### 2. Köpare (Buyer)
**Mål:** Hitta och köpa rätt företag

**Flöde:**
1. Skapar konto → väljer "Köpare"
2. Sätter preferenser (region, bransch, storlek)
3. Verifierar med BankID (valfritt, men ökar trovärdighet)
4. Söker och filtrerar företag
5. Sparar favoriter och jämför objekt
6. Begär NDA för intressanta objekt
7. Signerar NDA → får tillgång till datarum
8. Granskar dokument och ställer frågor
9. Skapar LOI (indikativt bud)
10. Förhandlar och slutför affär

**Viktiga funktioner:**
- ✅ **Smart sökning** - Filter på region, bransch, omsättning, EBITDA
- ✅ **Jämförelse** - Jämför upp till 4 objekt sida vid sida
- ✅ **Bevakningar** - Får notiser när nya objekt matchar preferenser
- ✅ **Datarum** - Säker dokumentåtkomst efter NDA
- ✅ **LOI-generator** - Guidad form för indikativa anbud

---

### 3. Mäklare (Broker)
**Mål:** Hantera flera annonser för kunder

**Flöde:**
1. Skapar konto → väljer "Mäklare"
2. Verifierar med BankID (krävs)
3. Får mäklarlicens
4. Skapar annonser för kunder
5. Hanterar NDA-förfrågningar
6. Svarar på frågor i Q&A
7. Får LOI och förhandlar
8. Slutför affärer

**Viktiga funktioner:**
- ✅ **Multi-listing** - Hantera flera annonser samtidigt
- ✅ **Kundhantering** - Se alla kunders objekt på ett ställe
- ✅ **Mäklarlicens** - Verifierad badge ökar trovärdighet

---

## 🔄 Huvudflöden

### Flöde 1: Säljare skapar annons

```
1. Landing Page (/)
   ↓
2. "Jag vill sälja" → Info-sida (/salja)
   ↓
3. "Skapa annons" → Wizard Step 1 (/salja/start)
   - Företagsnamn, org.nr, bransch
   - Auto-hämtning från Bolagsverket när org.nr anges
   ↓
4. Step 2: Affärsdata (/salja/affarsdata)
   - Omsättning, EBITDA, anställda
   - Auto-fylls från årsredovisningar
   ↓
5. Step 3: Styrkor & Risker (/salja/styrkor-risker)
   - Konkurrensfördelar, utmaningar
   ↓
6. Step 4: Media (/salja/media)
   - Ladda upp bilder, dokument
   - Anonymiseringsinställningar
   ↓
7. Step 5: NDA-inställningar (/salja/nda)
   - Välj vad som ska vara låst före NDA
   - Standard eller anpassad NDA
   ↓
8. Step 6: Paketval (/salja/priser)
   - Basic (4,995 kr)
   - Featured (9,995 kr)
   - Premium (19,995 kr)
   ↓
9. Step 7: Preview (/salja/preview)
   - Se före/efter NDA-vy
   - Checklista
   ↓
10. Publicera → Annons live!
```

**Auto-save:** Alla steg sparas automatiskt var 10:e sekund till localStorage

---

### Flöde 2: Köpare hittar och köper

```
1. Landing Page (/)
   ↓
2. "Jag vill köpa" → Info-sida (/kopare)
   ↓
3. Skapa konto (/kopare/start)
   - Preferenser: region, bransch, storlek
   ↓
4. Verifiering (/kopare/verifiering)
   - BankID (valfritt)
   ↓
5. Sök & Filter (/sok)
   - Filtrera på region, bransch, omsättning
   - Spara favoriter
   - Lägg i jämförelse (max 4)
   ↓
6. Objektdetaljer (/objekt/[id])
   - Se grundinfo (före NDA)
   - Vissa fält låsta 🔒
   ↓
7. Begär NDA (/nda/[id])
   - Läs villkor
   - Signera med BankID eller manuellt
   ↓
8. Vänta på godkännande (24-48h)
   ↓
9. NDA godkänd → Datarum & Q&A (/objekt/[id]/datarum)
   - Ladda ner dokument
   - Ställ frågor
   ↓
10. Skapa LOI (/objekt/[id]/loi)
    - Prisförslag
    - Överlåtelsesätt
    - Finansiering
    ↓
11. Skicka LOI → Säljaren kontaktar
```

---

### Flöde 3: AI-värdering (NY FUNKTION!)

```
1. Säljare går till /vardering
   ↓
2. ValuationWizard öppnas
   ↓
3. Step 1: Grunduppgifter
   - Företagsnamn
   - Org.nr (viktigt!)
   - E-post
   ↓
4. Auto-hämtning från Bolagsverket:
   ✅ Företagsnamn
   ✅ Registreringsdatum
   ✅ Antal anställda
   ✅ Årsredovisningar (3-5 år)
   ✅ Balansräkningsdata (nytt!)
   ✅ Skulder och kassa
   ✅ Working Capital
   ↓
5. Step 2-6: Fyll i kompletterande info
   - Finansiella siffror (auto-fyllda om tillgängliga)
   - Branschspecifika frågor
   ↓
6. Skicka → AI analyserar:
   ✅ Historisk trendanalys (tillväxt, volatilitet)
   ✅ EBITDA-beräkning
   ✅ Working Capital-analys
   ✅ Debt adjustments (EV vs Equity Value)
   ✅ Branschjämförelse
   ✅ SWOT-analys
   ✅ Rekommendationer
   ↓
7. Resultat-sida (/vardering/resultat)
   - Värderingsintervall (min, max, mest sannolikt)
   - Enterprise Value & Equity Value
   - Working Capital-analys
   - Historiska trender
   - PDF-export
   ↓
8. Använd värderingen för att sätta pris på annons
```

**Viktiga förbättringar (nyligen implementerade):**
- ✅ **Historisk trendanalys** - Analyserar 3-5 års årsredovisningar
- ✅ **Debt adjustments** - Beräknar både EV och Equity Value
- ✅ **Working Capital** - Analyserar kapitalbehov
- ✅ **Auto-hämtning** - Så mycket som möjligt från Bolagsverket

---

## 💰 Betalningssystem

### Prenumerationer
- **Säljare:** Basic/Featured/Premium paket
- **Mäklare:** Månads- eller årslicens
- **Köpare:** Gratis (premium features framtida)

### Betalmetoder
1. **Kortbetalning** - Stripe med 3D Secure
2. **Faktura** - 10 dagars netto, Peppol e-faktura

### Grace Period
- 20 dagars grace period vid förfallna betalningar
- Automatiska påminnelser
- Payment status banners i UI

---

## 🔒 Säkerhet & Sekretess

### NDA (Non-Disclosure Agreement)
- **Före NDA:** Anonymiserad info, ranges, låsta fält
- **Efter NDA:** Företagsnamn, exakta siffror, dokument
- **Signering:** BankID eller manuellt
- **Godkännande:** Säljare godkänner inom 24-48h

### Datarum
- Vattenmärkning av dokument
- Loggning av nedladdningar
- Säker filhantering
- Q&A för frågor

---

## 🤖 AI & Automatisering

### AI-värdering
**Använder OpenAI GPT-4:**
- Analyserar företagsdata
- Beräknar värdering baserat på bransch
- Genererar SWOT-analys
- Ger rekommendationer

**Data som används:**
- Årsredovisningar från Bolagsverket
- Branschspecifika multiplar
- Historiska trender
- Working Capital
- Skuldsättning

### Auto-enrichment
**När användare anger org.nr:**
1. Hämtar från Bolagsverket API
2. Hämtar från LinkedIn (anställda)
3. Hämtar från Ratsit (kreditbetyg)
4. Hämtar från Google My Business (recensioner)
5. Hämtar från Trustpilot (e-handel)
6. Auto-fyller formulär

**Cache:** Data cachas i 30 dagar för snabbare laddning

---

## 📊 Dashboard & Analytics

### Säljare Dashboard
- **Mina annonser** - Alla listade objekt
- **Mottagna LOI** - Indikativa anbud
- **Statistik** - Visningar, NDA-förfrågningar
- **Värderingar** - Tidigare AI-värderingar

### Köpare Dashboard
- **Mina affärer** - Pågående transaktioner
- **Sparade objekt** - Favoriter
- **Bevakningar** - Notiser om nya objekt
- **Mina LOI** - Skickade anbud

### Mäklare Dashboard
- **Kundannonser** - Alla objekt för alla kunder
- **Statistik** - Översikt över alla affärer
- **Pipeline** - Affärer i olika stadier

---

## 🔄 State Management

### Zustand Stores
1. **formStore** - Säljarformulär (auto-save)
2. **buyerStore** - Köparepreferenser, sparade objekt
3. **paymentStore** - Betalningar, prenumerationer

### localStorage
- Auto-save av formulär var 10:e sekund
- Återställning vid reload
- "Senast sparad" timestamp

---

## 🌐 Internationell Support

### Språk
- **Svenska** (standard)
- **Engelska** (via next-intl)

### Lokalisering
- Alla texter i `messages/sv.json` och `messages/en.json`
- Automatisk språkdetektering
- URL-baserad routing (`/sv/`, `/en/`)

---

## 📱 Mobile Optimization

- **Responsive design** - Mobile-first approach
- **Sticky navigation** - Bottom nav på mobil
- **Touch-friendly** - Stora knappar, enkel navigation
- **Progressive Web App** - Kan installeras som app

---

## 🚀 Deployment

### Production
- **Hosting:** Railway eller Heroku
- **Database:** PostgreSQL
- **CDN:** Vercel Edge Network
- **File Storage:** S3 eller liknande (planerat)

### Environment Variables
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
BOLAGSVERKET_API_KEY=...
NEXT_PUBLIC_APP_URL=https://...
```

---

## 📈 Framtida Funktioner

### Planerade Förbättringar
- [ ] **Chat/Messaging** - Direktkommunikation mellan köpare/säljare
- [ ] **Video Calls** - Integrering med Zoom/Teams
- [ ] **Rådgivare Marketplace** - Hitta M&A-rådgivare
- [ ] **Advanced Analytics** - Djupare insights
- [ ] **API Integration** - För tredjepartstjänster
- [ ] **White Label** - För mäklare som vill ha egen plattform

---

## 🎯 Sammanfattning

**BOLAXO är en komplett plattform för företagsförsäljning som:**

1. ✅ **Förenklar processen** - Guidad wizard, auto-fyllning
2. ✅ **Ökar säkerheten** - NDA, datarum, verifiering
3. ✅ **Ger rätt värdering** - AI-driven analys med historiska data
4. ✅ **Sparar tid** - Auto-hämtning från Bolagsverket
5. ✅ **Bygger förtroende** - Verifierade profiler, transparens

**Huvudvärde:**
- För **säljare:** Få rätt pris, hitta seriösa köpare
- För **köpare:** Hitta rätt objekt, säker process
- För **mäklare:** Effektiv hantering av flera affärer

---

## 📞 Support & Hjälp

- **FAQ:** `/faq`
- **Kontakt:** `/kontakt`
- **Juridisk info:** `/juridiskt`
- **Om oss:** `/om-oss`

---

**Status:** ✅ Production-ready MVP med alla kärnfunktioner implementerade!

