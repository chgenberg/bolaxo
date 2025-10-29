# 🎬 KOMPLETT DEMO-GUIDE: ANNONS TILL FÄRDIG AFFÄR

**Platform:** Bolagsportalen  
**Tid för demo:** ~15 minuter (hela processen från start till slutförande)  
**Status:** Allt förberett med demo-data - klick bara igenom!

---

## 🎯 DEMO-SCENARIEN

Vi visar en komplett M&A-transaktion mellan:
- **SÄLJARE:** IT-konsultbolag från Stockholm (25-30 MSEK omsättning, säljer för 50-65 MSEK)
- **KÖPARE:** Investerare som hittar och köper företaget

---

## 📱 STEG-FÖR-STEG DEMO

### **STEG 1: SÄLJAREN FÖRBEREDER (2 min)**

**1.1 Säljaren loggar in**
```
URL: https://bolagsportalen.com/dashboard
Roll: Säljare
```

**1.2 Klick: "Mina försäljningar"** 
```
Menu vänster → "Mina försäljningar"
Du ser: 3 annonser med statistik
```

**1.3 Visa "Mina försäljningar" sidan**
```
Säljaren ser:
├─ IT-konsultbolag (Aktiv, 124 visningar, 8 NDA, 3 frågor)
├─ E-handelplattform (Aktiv, 87 visningar)
└─ Tjänsteföretag (Pausad)
```

**1.4 Klick: SME Kit**
```
Route: /salja/sme-kit
Visa:
├─ 1️⃣ Identitet & Konto
├─ 2️⃣ Ekonomi-import (visa Excel-parser)
├─ 3️⃣ Avtalsguide
├─ 4️⃣ Datarum (visa alla dokument)
├─ 5️⃣ Teaser & IM Generation (visa PDF-generering)
├─ 6️⃣ NDA-portal (visa NDA requests)
└─ 7️⃣ Advisor Handoff (visa ZIP-paket)

Kommentar till kollega:
"Här förbereder säljaren allt: finanser normaliseras, 
dokument organiseras, och PDFs genereras automatiskt med vattenstämpel"
```

**1.5 Visa Heat Map för säljaren**
```
Route: /salja/heat-map/listing-1
Visa:
├─ Teaser: 12 visningar, 145 min, 85% engagement 🔥
├─ IM: 8 visningar, 320 min, 92% engagement 🔥
├─ Finanser: 6 visningar, 180 min, 78% engagement 🔥
├─ Kontrakt: 4 visningar, 95 min, 62% engagement ⚡
└─ IT-dok: 2 visningar, 45 min, 35% engagement ❄️

Kommentar: "Säljaren ser exakt vilka dokument köparen läser
och hur länge. Det visar köparens intresse i realtid!"
```

---

### **STEG 2: KÖPAREN SÖKER & HITTAR (1 min)**

**2.1 Köparen loggar in**
```
URL: https://bolagsportalen.com/dashboard
Roll: Köpare
```

**2.2 Klick: "Mina affärer"**
```
Menu vänster → "Mina affärer"
Du ser: 3 godkända NDAs (= aktiva affärer)
```

**2.3 Visa första affären: IT-konsultbolag**
```
Visas:
- Företagsnamn: IT-konsultbolag - Växande SaaS-företag
- Region: Stockholm
- Omsättning: 25-30 MSEK
- Pris: 50-65 MSEK
- Status: Godkänd NDA (7 dagar sedan)

Kommentar: "Köparen har redan godkänt NDA och fick
tillgång till allt material. Nu kan vi gå igenom
resten av affärsprocessen!"
```

---

### **STEG 3: Q&A CENTER - FRÅGOR & SVAR (2 min)**

**3.1 Klick: Q&A Center för IT-konsultbolag**
```
Route: /kopare/qa/listing-1
Visa:
├─ FRÅGA 1 (5 dagar sedan, BESVARAD):
│  "Vilka är era största kundsegment?"
│  SVAR: "3 segment: Financial (45%), Retail (35%), Manufacturing (20%)"
│  ResponseTime: 24 timmar
│
├─ FRÅGA 2 (1 dag sedan, VÄNTAR):
│  "Hur är churn-raten för top 2 kunder?"
│  Status: VÄNTAR (23h återstår av 48h SLA)
│
└─ FRÅGA 3 (3 dagar sedan, BESVARAD):
   "Vilka är era konkurrenter?"
   SVAR: "Acme Corp och TechSolutions - vi är 15% billigare..."
   ResponseTime: 18 timmar

Kommentar: "Detta är ett strukturerat Q&A med juridisk SLA.
Köparen kan ställa frågor och säljaren måste svara inom 48 timmar.
Allt spårat och dokumenterat!"
```

---

### **STEG 4: LOI EDITOR - FÖRHANDLING OM PRIS (2 min)**

**4.1 Klick: LoI Editor**
```
Route: /kopare/loi/listing-1
Visa multi-version förhandling:

VERSION 1 (Köpare, 2025-10-20):
├─ Pris: 60 MSEK
├─ Earnout: 3 MSEK
└─ Förslag: "Initial offer"

VERSION 2 (Säljare, 2025-10-22):
├─ Pris: 70 MSEK (motbud!)
├─ Earnout: 2 MSEK
└─ Förslag: "Counter offer"

VERSION 3 (Köpare, 2025-10-28) ✅ CURRENT:
├─ Pris: 65 MSEK (kompromiss!)
├─ Earnout: 5 MSEK
├─ Cash at closing: 58 MSEK
├─ Escrow: 2 MSEK (18 mån)
├─ Non-compete: 3 år
├─ Representations: [Financial, Liabilities, Contracts, Litigation]
└─ Status: NEGOTIATION

Kommentar: "LoI är helt strukturerad med versionhistorik.
Man kan se exakt vad som ändrits i varje runda.
Båda parter förhandlar här om pris, struktur och villkor."
```

---

### **STEG 5: DD MANAGER - DUE DILIGENCE (3 min)**

**5.1 Klick: DD Manager**
```
Route: /kopare/dd/listing-1
Visa checklist:

PROGRESS: 33% Complete (5/15 tasks done)

FINANCIAL (4/4 tasks):
├─ ✅ Review 3-year audited statements (COMPLETE, 2 dagar)
├─ ✅ Analyze revenue recognition (COMPLETE, 1 dag)
├─ ⏳ Verify cash flow projections (IN PROGRESS, 1 dag)
└─ ⭕ Check working capital (PENDING, 2 dagar)

LEGAL (2/4 tasks):
├─ ✅ Review material contracts (COMPLETE, 3 dagar)
├─ ✅ Check for litigation (COMPLETE, 1 dag)
├─ ⏳ Verify IP ownership (IN PROGRESS, 2 dagar)
└─ ⭕ Review employment agreements (PENDING, 2 dagar)

IT (1/3 tasks):
├─ ✅ Security assessment (COMPLETE, 2 dagar)
├─ ⏳ Infrastructure review (IN PROGRESS, 1 dag)
└─ ⭕ Data backup & recovery (PENDING, 3 dagar)

4 DD FINDINGS (högsta prioritet):
├─ 🔴 HIGH: "Kundberoende - Top 2 kunder = 45% revenue"
│   Mitigering: Long-term kontrakt, diversifiering
├─ 🟡 MEDIUM: "Tech stack - Äldre ramverk"
│   Mitigering: Migrera till .NET 8 Core (2M SEK, 6-9 mån)
├─ 🔴 HIGH: "Key person risks - CEO & CTO"
│   Mitigering: Retention agreements
└─ 🟡 MEDIUM: "IP - Ingen formell dokumentation"
   Mitigering: Register 3 patents

Kommentar: "DD är en 11-steg process. Vi tracking allt.
Köparen identifierar risker och säljaren kan svara
på följdfrågor via Q&A Center eller meetings."
```

---

### **STEG 6: SPA EDITOR - JURIDISK ÖVERENSKOMMELSE (2 min)**

**6.1 Klick: SPA Editor**
```
Route: /kopare/spa/listing-1
Visa:

CURRENT VERSION: 3 (auto-updated från LoI)

PURCHASE PRICE SUMMARY:
├─ Total: 65 MSEK
├─ Cash at closing: 58 MSEK
├─ Escrow (18 mån): 2 MSEK
└─ Earnout (3 år KPI-based): 5 MSEK

REPRESENTATIONS & WARRANTIES (auto-populated):
├─ Financial statements accurate
├─ No undisclosed liabilities
├─ All contracts disclosed
├─ No pending litigation
├─ All taxes paid
├─ IP ownership clear
└─ Employment matters OK

INDEMNIFICATION:
├─ Cap: 10% of price (6.5M SEK)
├─ Basket (självrisk): 1% (650K SEK)
├─ Survival: 24 mån (standard)
└─ Exceptions:
   - Tax reps: 7 år
   - IP reps: Unlimited
   - Fraud: Unlimited

VERSION HISTORY:
├─ V1: Köpare - Initial draft
├─ V2: Säljare - Counter with adjusted terms
└─ V3: Köpare - Final version approved

Kommentar: "SPA är det juridiska avtalet.
Här definieras köpeskillingen, villkor, och garantier.
Versioner trackad för full transparency."
```

---

### **STEG 7: DIGITAL SIGNING - JURIDISKT BINDANDE (2 min)**

**7.1 Klick: Digital Signing**
```
Route: /kopare/signing/listing-1
Visa steg:

STEG 1: GRANSKA (Review)
├─ SPA dokument visas
├─ Länk: "Ladda ned PDF"
└─ Button: "Fortsätt till signering"

STEG 2: SIGNERA (Sign) 
├─ "Signera nu med BankID"
├─ Omdirigeras till BankID/Scrive
├─ Autentisering
└─ Digital signatur sparas

STEG 3: KLART (Complete)
├─ ✅ Signering genomförd
├─ Båda parter har signerat
├─ Datum & tid loggat
└─ Button: "Gå till stängningschecklistan"

Kommentar: "Här signeras avtalet digitalt med juridisk giltighet.
Integration med BankID eller Scrive för äkta eSignatur."
```

---

### **STEG 8: CLOSING CHECKLIST - FINAL VERIFICATION (2 min)**

**8.1 Klick: Closing Checklist**
```
Route: /kopare/closing/listing-1
Visa:

PROGRESS: 50% Complete (7/14 tasks)

KÖPARE TASKS (4 av 5 klar):
├─ ✅ Financing confirmed (Closing day)
├─ ✅ Final SPA review with counsel (2 days before)
├─ ⭕ Sign closing documents (Closing day)
└─ ⭕ Wire funds to escrow (Closing day)

SÄLJARE TASKS (3 av 5 klar):
├─ ✅ Shareholder resolution (3 days before)
├─ ✅ Tax clearance obtained (2 days before)
├─ ✅ Prepare share certificates (Closing day)
├─ ⭕ Sign closing documents (Closing day)
└─ ⭕ Employee notifications (Closing day)

BOTH PARTIES (1 av 4 klar):
├─ ✅ Escrow instructions signed (2 days before)
├─ ⭕ Closing coordination call (1 day before)
├─ ⭕ Share certificate transfer (Closing day)
└─ ⭕ Fund release & completion (Closing day)

STATUS: 50% - OBS: Inte helt klar ännu (7% återstår)

KEY DATES:
├─ 3 dagar innan: Shareholder approval ✅
├─ 2 dagar innan: Escrow instructions signed ✅
├─ 1 dag innan: Final coordination call
└─ Closing day: Allt genomförs

Kommentar: "Closing-checklistan säkerställer att inget glöms.
Båda parter kan se exakt vad som behöver göras och när."
```

---

### **STEG 9: PAYMENT & CLOSING - BETALNING (1 min)**

**9.1 Klick: Payment & Closing**
```
Route: /kopare/payment/listing-1

STEG 1: REVIEW (Purchase Summary)
├─ Total: 65 MSEK
├─ Kontant: 45 MSEK (Swedbank)
├─ Escrow: 3 MSEK (Escrow agent)
└─ Earnout: 2 MSEK (3 år KPI-based)

STEG 2: PAYMENT
├─ Betalningsmetod: Banköverföring eller Stripe
├─ IBAN: SE45 5000 0000 0504 4000 7391
├─ Ref: SPA-2024-xxx
└─ Belopp: 48 MSEK (45M + 3M escrow)

STEG 3: COMPLETION ✅
├─ Betalning genomförd
├─ Aktier överförda (köpare är nu ägare 100%)
├─ Escrow-period börjar (18 mån)
└─ Earnout-tracking börjar (3 år)

NÄSTA: "Gå till Earnout Tracker"

Kommentar: "Betalningen är det avgörande steget.
När pengar överförts och Bolagsverket uppdaterat är köpet slutfört.
Earnout-perioden börjar sedan."
```

---

### **STEG 10: EARNOUT TRACKER - POST-CLOSING (1 min)**

**10.1 Klick: Earnout Tracker**
```
Route: /salja/earnout/listing-1

EARNED STRUCTURE:
├─ Total earnout: 5 MSEK
├─ Period: 3 år
├─ Metric: Revenue
└─ Status: ACTIVE (Post-closing)

YEAR 1 (Pending):
├─ Target: 65 MSEK revenue
├─ Actual: (väntar på Year 1 results)
├─ Earned: (beräknas när Year 1 slut)
└─ Status: PENDING

YEAR 2 (Pending):
├─ Target: 72 MSEK revenue
└─ Status: PENDING

YEAR 3 (Pending):
├─ Target: 80 MSEK revenue
└─ Status: PENDING

TIMELINE:
├─ 2025: Year 1 tracking
├─ 2026: Year 2 tracking + Year 1 payment
├─ 2027: Year 3 tracking + Year 2 payment
└─ 2028: Year 3 payment + Final closing

Kommentar: "Efter stängningen spårar vi försäljningsmålen.
Om företaget växer till 65M år 1, får säljaren en del av
earnout. Detta incentiviserar båda parter att lyckas tillsammans."
```

---

## 🎬 DEMO-MANUSCRIPT (Vad du säger till kollegan)

```
INTRO (30 sekunder):
"Det här är Bolagsportalen - en komplett M&A-plattform 
för köp och försäljning av företag. Vi visar nu den 
kompletta flödet från listing till färdig affär."

FASE 1: SÄLJAREN FÖRBEREDER (1 min):
"Säljaren börjar här. Han går till 'Mina försäljningar'
och ser alla sina annonser med real-time statistik - 
visningar, NDA-förfrågningar, och köparengagemang.

Han använder SME Kit för att förbereda - laddar upp
finanser som normaliseras automatiskt, organiserar
dokument i datarum, och genererar PDFs med vattenstämpel.

Heat Map visar honom exakt vilka dokument köparen läser
och hur länge. Det är realtids-insight i köparens intresse."

FASE 2: KÖPAREN SÖKER (30 sekunder):
"Köparen loggar in, söker företag, och har redan
godkänt NDA. Han går till 'Mina affärer' och ser
alla sina aktiva transaktioner med snabbinfo."

FASE 3: Q&A (1 min):
"Q&A Center är en strukturerad process med 48h SLA.
Köpare ställer frågor, säljare svarar. Allt dokumenterat.
Här ser vi ett verkligt exempel med 3 frågor -
2 besvarade inom 18-24 timmar, 1 väntar på svar."

FASE 4: LOI FÖRHANDLING (1 min):
"LoI är Letter of Intent - första budet. Vi ser här
3 versioner av förhandlingen:
- Köpare föreslog 60M
- Säljare motbad 70M
- Nu har de kommit överens på 65M med 5M earnout

Allt helt trackat med versionhistorik."

FASE 5: DUE DILIGENCE (1 min):
"DD är den tuffaste delen - 11 tasks fordela på
Financial, Legal, och IT. Vi ser här status och också
4 kritiska findings som behöver adresseras:
- Kundberoende
- Tech stack modernisering
- Key person risks  
- IP dokumentation

Köparen trackade allt här."

FASE 6: SPA & SIGNERING (1 min):
"SPA är Share Purchase Agreement - det juridiska avtalet.
Det auto-genereras från LoI med alla relevanta villkor:
- Köpeskillingen
- Representationer & warranties (vad säljaren garanterar)
- Indemnification (vad som händer om något går fel)
- Version tracking för full transparens

Sedan signeras det digitalt med BankID - juridiskt bindande."

FASE 7: CLOSING CHECKLIST (30 sekunder):
"Closing är sista dagen. Vi har en checklist med 14 tasks
- köparets tasks, säljarens tasks, och gemensamma tasks.
Man kan se progress in realtid så inget glöms."

FASE 8: PAYMENT & OWNERSHIP (30 sekunder):
"Hit kommer vi nu - betalningen. Köpare överför 48M till
säljaren och 3M till escrow-agenten. Aktier överförs.
Köparen är nu officiell ägare 100%.
Deal är completed!"

FASE 9: EARNOUT TRACKING (30 sekunder):
"Efter stängningen börjar earnout-perioden. Vi trackar
KPI:er (revenue) i 3 år och betalar earnout baserat
på resultat. Båda parter är investerade i framgång."

OUTRO (30 sekunder):
"Det här är den kompletta M&A-processen - från listing
till faktisk överföring av aktier. Allt i en plattform.
Ingen separate tools, ingen pappershantering.
Allt dokumenterat, spårbart, och juridiskt säkert."
```

---

## 🎯 TIPS FÖR DEMO

1. **Start med Säljare Dashboard** → "Mina försäljningar"
2. **Klicka igenom varje feature** i ordning
3. **Fokusera på demo-data** - det är redan fyllda med realistiska siffror
4. **Visa versionshistoriken** - det visar transparens
5. **Poängtera SLA:n** - 48h response time för Q&A
6. **Sluta med Earnout** - visa att det är ett gemensamt intresse

**Tid: 15 minuter totalt**

---

## 📊 KEY METRICS ATT VISA

```
✅ 3 annonser från 0 till försäljning
✅ 124 köp-visningar för vinnaren
✅ 8 NDA-förfrågningar mottagna
✅ 3 köpfrågor besvarade inom 24h
✅ 3 versioner av LoI förhandling
✅ 11 DD tasks med 4 findings
✅ 1 SPA med 3 versioner
✅ 1 komplett closing checklist
✅ 65 MSEK total deal value
✅ 5 MSEK earnout over 3 år
```

---

**LYCKA TILL MED DEMO! 🚀**

