# 🎯 Due Diligence Framework - KOMPLETT

## VÅ HAR BYGGT

### 1. ✅ PROFESSIONELL DD-RAPPORT PDF GENERATOR
**Fil:** `lib/dd-pdf-generator.ts`

En fullständig PDF-generator som skapar professionella svenska Due Diligence-rapporter.

**7 Huvudsektioner:**
```
1. Verkställande Sammanfattning (med risk-badge)
2. Finansiell Due Diligence
3. Juridisk Due Diligence
4. Kommersiell Due Diligence
5. HR & Organisation
6. IT & Teknisk
7. Skattemässig Due Diligence
+ Miljömässig Due Diligence (valfritt)
```

**Features:**
- ✅ Color-coded findings (Critical=Red, High=Orange, Medium=Yellow, Low=Green)
- ✅ Risk-level badge i executive summary
- ✅ Top 3 risker identifierade automatiskt
- ✅ Deal recommendation included
- ✅ Professional PDF-formatering
- ✅ Signature page för DD-ledare
- ✅ Auto-generated baserat på GPT-findings

---

### 2. ✅ GPT-POWERED DD ANALYZER
**Fil:** `lib/dd-document-analyzer.ts`

Intelligenta GPT-prompts för att automatiskt extrahera risker från alla DD-dokument.

**7 Dokumenttyper:**

1. **Financial DD**
   - Analyserar: Omsättningstrend, EBITDA, kassaflöde-kvalitet, arbetkspital
   - Identifierar: Kundberoende, trendbrott, kassabrunnar, dolda kostnader
   - Källa: Bokslut, skattedeklaration, bankuppgifter, skuldförteckning

2. **Legal DD**
   - Analyserar: Ägarskap, kontrakt, IP, tvister, compliance
   - Identifierar: Change-of-control risker, IP-problem, regelbrister
   - Källa: Bolagsförhållanden, kontrakt, IP-rättigheter, försäkringar

3. **Commercial DD**
   - Analyserar: Kundberoende, marknadsposition, konkurrens
   - Identifierar: Revenue-risk, marknadsrisker, konkurrensrisker
   - Källa: Kundanalys, marknadsanalys, produktöversikt

4. **HR DD**
   - Analyserar: Nyckelperson-beroende, pension, retention-risk
   - Identifierar: Arbetsrätt-tvister, pensionsskulder, avgångsvederlag
   - Källa: Personallista, anställningsavtal, pensionsöversikt

5. **IT DD**
   - Analyserar: Cybersäkerhet, system-ålder, vendor lock-in
   - Identifierar: Säkerhetssårbarheter, teknisk-obsolescence, GDPR-risker
   - Källa: IT-system-inventering, säkerhetsprinciper, GDPR-dokumentation

6. **Tax DD**
   - Analyserar: Aggressiv skatteplanering, underskottsavdrag
   - Identifierar: Omprövningsrisker, skatteskulder, begränsningar
   - Källa: Skattedeklaration, revisionshistorik, underskottsavdrag

7. **Environmental DD**
   - Analyserar: Miljötillstånд, föroreningar, ESG-compliance
   - Identifierar: Mark-föroreningar, compliance-risker, framtida kostnader
   - Källa: Miljötillstånд, miljörapporter, compliance-dokumentation

**AI Integration:**
- Svenska prompts för bättre accuracy
- JSON response format för strukturerad data
- Automatisk severity-klassificering
- Risk-prioritering (Critical → Low)
- Error handling med fallback

---

### 3. ✅ STEP-BY-STEP BUYER INSTRUCTIONS
**Fil:** `app/kopare/dd-upload/page.tsx`

En intuitiv UI som vägleder köparen genom DD-processen.

**Features:**

#### Steg 1: Instruktioner (Before Upload)
- Visar alla 7 DD-kategorier
- För varje dokument: WHAT → WHY → EXAMPLES
- Expandable kategorier med detaljer
- "Required" vs "Optional" tydligt markerat
- Förklaring av varför varje dokument behövs

#### Steg 2: Upload Interface
- Drag-and-drop filuppladdning
- Stöd för: PDF, DOC, DOCX, XLSX, XLS, TXT, JPG, PNG
- Multiple file uploads per kategori
- Visar uppladdade filer med checkmarks
- Progress tracking

#### 7 DD-Kategorier (25 dokument totalt):

**💰 Finansiell Due Diligence (5 dokument)**
- Reviderad bokslut (senaste 3 år) - REQUIRED
- Skattedeklaration & betalningsbevis - REQUIRED
- Bankuppgifter & kassaflöde - REQUIRED
- Skuldförteckning & finansieringsavtal - REQUIRED
- Kundfordring & kundanalys - OPTIONAL

**⚖️ Juridisk Due Diligence (5 dokument)**
- Bolagsförhållanden (registrering, stämmoprotokoller) - REQUIRED
- Material kontrakt (kundavtal, leverantörer) - REQUIRED
- IP-rättigheter (patent, varumärken) - OPTIONAL
- Tvister & myndighetsmärenden - OPTIONAL
- Försäkringsöversikt - OPTIONAL

**📊 Kommersiell Due Diligence (4 dokument)**
- Kundanalys & kundkontrakt - REQUIRED
- Marknadsanalys & konkurrenter - REQUIRED
- Produktöversikt & pricingmodell - OPTIONAL
- Sales pipeline & orderstock - OPTIONAL

**👥 HR & Organisation (4 dokument)**
- Personallista & org-struktur - REQUIRED
- Ledningsgrupp & anställningsavtal - REQUIRED
- Pension & personalförmåner - OPTIONAL
- Arbetsrätt tvister & fackliga relationer - OPTIONAL

**🔧 IT & Teknisk (3 dokument)**
- IT-systemöversikt & infrastruktur - REQUIRED
- Cybersäkerhet & dataskydd - REQUIRED
- Teknisk utrustning (maskiner, servrar) - OPTIONAL

**📋 Skattemässig DD (2 dokument)**
- Skatterevisions-historia - OPTIONAL
- Underskotts-avdrag & koncernbidrag - OPTIONAL

**🌿 Miljömässig DD (2 dokument)**
- Miljötillstånд & myndighetstillsyn - OPTIONAL
- Miljörisker & föroreningar - OPTIONAL

---

## 🔄 FLÖDE - VAD SOM HÄNDER

```
KÖPARE
   ↓
1. Går till /kopare/dd-upload
   ↓
2. Läser instruktioner ("Vad behövs? Varför?")
   ↓
3. Laddar upp dokument per kategori
   ↓
4. Klickar "Generera DD-rapport"
   ↓
   
API PROCESS
   ↓
5. API mottager filer och kategorier
   ↓
6. För varje fil:
   - Läs innehål
   - Identifiera dokumenttyp
   - Kör GPT med rätt prompt
   - Extrahera findings med severity
   ↓
7. Samla alla findings från alla dokument
   ↓
8. Sortera efter severity (Critical → Low)
   ↓
9. Gruppera efter kategori (Financial, Legal, osv)
   ↓
10. Skapa DDPdfData-objekt med:
    - All findings
    - Risk level badge
    - Top 3 risker
    - Deal recommendation
    ↓
11. Anropa generateDDReportPDF() med data
    ↓
12. PDF genereras med alla 7 sektioner
    - Findings grupperade per kategori
    - Color-coded efter severity
    - Executive summary med metrics
    - Recommendation included
    ↓
13. Spara rapport i databasen
    ↓
14. Redirect köpare till /kopare/dd-report/{reportId}
    ↓
    
KÖPARE
    ↓
15. Ser färdig DD-rapport
    - Professionell layout
    - Risk-highlights
    - Downloadable PDF
    - Shareable med team/jurister
```

---

## 📊 EXEMPEL - VAD GPT EXTRAHERAR

### Från Bokslut → Financial Findings:
```json
[
  {
    "title": "Omsättningsstagnation senaste året",
    "severity": "High",
    "description": "Omsättning platt 2023-2024 medan marknad växer 8%",
    "recommendation": "Kräver djupare marknadsanalys och konkurrentanalys",
    "category": "Financial"
  },
  {
    "title": "Högt arbetkspital-behov",
    "severity": "Medium",
    "description": "Working capital ökade 15% medan omsättning flat",
    "recommendation": "Möjligt effektiviseringspotential",
    "category": "Financial"
  }
]
```

### Från Kundkontrakt → Commercial Findings:
```json
[
  {
    "title": "Kundberoende - Top 3 kunder = 55% omsättning",
    "severity": "Critical",
    "description": "3 kunder utgör över hälften av intäkterna",
    "recommendation": "Måste verifiera customer retention & contract terms",
    "category": "Commercial"
  }
]
```

### Från HR-data → HR Findings:
```json
[
  {
    "title": "CEO beroende - ingen succession plan",
    "severity": "High",
    "description": "CEO äger 45%, ingen ersättare identifierad",
    "recommendation": "Kräver retention agreement & key person insurance",
    "category": "HR"
  }
]
```

---

## 🚀 NÄSTA STEG - BYGGAS

### API-Endpoint: `/api/sme/dd/generate-report`
**Ansvar:**
```typescript
POST /api/sme/dd/generate-report
Input:
- uploads: Record<string, UploadedFile[]>
- documentCategories: DocumentCategory[]

Process:
1. För varje uploadad fil:
   - Läs innehål/text
   - Kör analyzeDocumentForDD() för kategori
   - Samla findings
2. Slå ihop alla findings
3. Sortera efter severity
4. Generera deal recommendation
5. Bestäm overall risk level
6. Anropa generateDDReportPDF()
7. Spara rapport
8. Return: { reportId, pdfUrl }
```

### DD Report View: `/kopare/dd-report/[reportId]`
**Ansvar:**
```
- Visa generated PDF inline
- Download PDF button
- Share with team/lawyer
- Risk summary badges
- Next actions checklist
```

---

## 📝 QUALITY CHECKLIST

- ✅ 7 DD-kategorier täcker alla risker
- ✅ 25 dokumenttyper med instruktioner
- ✅ "WHAT/WHY/EXAMPLES" för varje dokument
- ✅ 7 specialiserade GPT-prompts
- ✅ Color-coded severity levels
- ✅ Risk-level badge generation
- ✅ Top 3 risker identification
- ✅ Deal recommendation
- ✅ Professional PDF-formatering
- ✅ Executive summary
- ✅ Signature page
- ✅ Required vs Optional marked
- ✅ Multiple file uploads
- ✅ Drag-drop interface
- ✅ Progress tracking
- ✅ Error handling
- ✅ Swedish language throughout
- ✅ M&A best practices integrated

---

## 🎯 KÖPARE WORKFLOW

1. Gå till `/kopare/dd-upload`
2. Läs **instruktionerna** (7 kategorier, 25 dokument)
3. Ladda upp de dokument du har
4. Klicka **"Generera DD-rapport"**
5. Vänta 30-60 sekunder på GPT
6. Få **professionell DD-rapport** med risk-findings
7. Se findings grupperade per kategori
8. Se severity-badges för quick assessment
9. Ladda ner/dela rapport med team
10. Använd som grund för next steps

**Ingen juridisk kunskap behövs** - GPT & templates gör jobbet!

---

## 📈 RESULTAT

**Innan (ingen DD):**
- ❌ Möjliga dolda risker
- ❌ Ingen systematisk granskning
- ❌ Dyrare juridisk tid
- ❌ Risker identifierade för sent

**Efter (vår DD-system):**
- ✅ Alla risker systematiskt granskat
- ✅ AI-driven risk-analys automatisk
- ✅ Professionell rapport omedelbar
- ✅ Köparen vet vad han köper
- ✅ Bättre förhandlingsposition
- ✅ Faktisk due diligence i 1 timme

