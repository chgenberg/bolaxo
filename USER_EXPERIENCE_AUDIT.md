# 🎨 USER EXPERIENCE AUDIT - Vad ser användaren Nu?

**Komplett overview av alla SME-kit moduler och hur de fungerar**

---

## 📍 SIDAN: /salja/sme-kit (HUB)

### UI/UX
```
Layout:     Grid med 7 moduler
Colors:     ✅ Grön (complete), 🔴 Rosa (in-progress), ⚪ Grå (pending)
Icons:      Lucide icons för varje modul
Animation:  Hover effect + scale-up + shadow
Progress:   Visar overall progress (1/7 complete = 14%)
```

### Status Display
```
MODUL 1: Identitet & Konto
  Status:   ✅ COMPLETE (100%)
  Color:    Grön
  Icon:     Checkmark
  
MODUL 2: Ekonomi-import
  Status:   🔴 IN PROGRESS (50%)
  Color:    Rosa (accent-pink)
  Icon:     Zap (pulsing animation)
  
MODUL 3-7: Datatrum, Teaser, NDA, Handoff
  Status:   ⚪ PENDING (0%)
  Color:    Grå
  Icon:     Alert circle
```

### Navigation
```
Var kommer du in?
FROM:  /salja/start eller /salja
       → Ny CTA: "Start SME Kit"
       → Ny sektion i dashboard

Navigation:
- Klicka på modul → Går till /salja/sme-kit/[modul-namn]
- Back button → Tillbaka till /salja/sme-kit
```

### What's New vs Before
```
BEFORE:    Ingen SME-kit, ingen automation
AFTER:     Helt nytt system med 7 guided steg
RESULT:    Säljar kan börja immediately without rådgivare
```

---

## 🔐 MODUL 1: IDENTITET & KONTO

**URL:** `/salja/sme-kit/identity`

### Vad gör den?
```
✅ Verifierar företagsidentitet
✅ Hämtar bolagsdata från Bolagsverket API
✅ Sparar kärndata i databasen
✅ Visar preview av company info
```

### Status: COMPLETE ✅
```
Functionality: 100% implementerad
UI: Polished + animated
DB Integration: ✅ Lagrar i listing.company*
Testing: ✅ Fungerar lokalt
Production: ✅ READY
```

### User Flow
```
1. Klicka på modul → Går till /identity
2. Ser formulär för "Organisationsnummer"
3. Fyller in: 5564123456
4. Klickar "Verifiera"
5. API hämtar bolagsdata
6. Visar resultat: Namn, Adress, VD, Anställda
7. Klickar "Spara & Gå vidare"
8. Sparas i DB
9. Status bliver ✅ COMPLETE
```

### UI Elements
```
Input field: Organisationsnummer (placeholder med exempel)
Button: "Verifiera" (loading state när API körs)
Result card: Visar company preview
Action buttons: "Spara & Gå vidare" eller "Ändra"
Progress: Step 1 of 7
```

---

## 💰 MODUL 2: EKONOMI-IMPORT

**URL:** `/salja/sme-kit/financials`

### Vad gör den?
```
✅ Ladda upp ekonomisk data (Excel/PDF)
✅ Sparar fil i AWS S3 (NYT!)
✅ Normaliserar data (mock preview)
✅ Visar data quality score
```

### Status: IN PROGRESS 🔴 (50%)
```
Functionality: Partiell
- Upload: ✅ Fungerar (AWS S3)
- Storage: ✅ Real files (AWS S3)
- Parser: ⚪ Mock (inte real parsing än)
- Normalization: ⚪ Mock preview
- DB Integration: ✅ Sparar metadata

UI: Polished
Testing: ✅ Fungerar lokalt
Production: 🟡 READY (behöver real parser senare)
```

### User Flow
```
1. Klicka på modul → Går till /financials
2. Ser upload area för Excel/PDF
3. Laddar upp fil (t.ex. Bokslut 2024.xlsx)
4. ⬆️ FIL LADDAS UPP TILL AWS S3 (NYT!)
5. Ser preview med data quality: "Good" (80%)
6. Visar 3 år med omsättning/EBITDA/Resultat
7. Klickar "Godkänn & Gå vidare"
8. Sparas i DB
```

### Vad är nytt sedan file-storage uppdateringen?
```
INNAN:   Mock URL: /api/sme/files/listing-123/file.xlsx
EFTER:   Real S3 URL: https://bucket.s3.amazonaws.com/listing-123/timestamp-file.xlsx

IMPACTS:
✅ Filen sparas permanent i AWS molnet
✅ Kan ladda ned senare från S3
✅ Kan dela via signed URL
✅ Databaskostnad lägre (inte blobar)
✅ Snabbare nedladdning (URL istället för DB)

USER NOTICE:
❌ INGEN - Allt ser likadant ut för användaren!
✅ Upload-dialog ser samma ut
✅ Progress bar ser samma ut
✅ Resultat ser samma ut
```

### UI Elements
```
Upload area: Drag & drop eller browse
Progress bar: Laddar upp...
File info: Filnamn, storlek, status
Data preview: 3 år med nyckeltal
Data quality: Score (0-100%)
Action buttons: "Godkänn" eller "Ladda upp ny"
```

### Behind the Scenes (Tech)
```
FÖRE (Mock):
  User uploads → API gets file → Generates mock URL → Saves URL in DB
  URL: /api/sme/files/listing/file.xlsx

EFTER (AWS S3):
  User uploads → API gets file → Uploads to S3 → Gets real S3 URL → Saves URL in DB
  URL: https://bucket.s3.eu-west-1.amazonaws.com/listing/timestamp-file.xlsx

IMPACT ON CODE:
  app/api/sme/financials/upload/route.ts
    uploadToStorage() → Now uses AWS SDK
    Returns real S3 URL instead of mock

IMPACT ON DATABASE:
  FinancialData.fileUrl
    Before: /api/sme/files/...
    After:  https://bucket.s3.../...
    
  No schema changes - just URL format
```

---

## 📄 MODUL 3: AVTALSGUIDE

**URL:** `/salja/sme-kit/agreements`

### Vad gör den?
```
✅ Katalogisera avtal (7 typer)
✅ Ladda upp avtal-PDFs (AWS S3)
✅ Bedömningsprioritet & risk
✅ Spåra avtal
```

### Status: PENDING ⚪ (0%)
```
UI Status: Polished
Functionality: Guidad form
Upload: ✅ Fungerar (AWS S3)
Storage: ✅ Real files (AWS S3)
DB Integration: ✅ Sparar i database
```

### User Flow
```
1. Klicka på modul → Går till /agreements
2. Ser 7 avtalstyper:
   - Kundkontrakt (👥)
   - Leverantörsavtal (📦)
   - Anställningsavtal (👔)
   - Hyres-/leasingavtal (🏢)
   - IP & licenser (🔐)
   - Låne-/kreditavtal (💳)
   - Övrigt (📄)
3. Klickar "Lägg till" på "Kundkontrakt"
4. Formulär öppnas:
   - Avtalsnamn: "Stora AB leverantörsavtal"
   - Viktighetsnivå: High
   - Riskutvärdring: Medium
   - Upload PDF
5. ⬆️ FIL LADDAS UPP TILL AWS S3 (SAMMA SOM FINANCIALS!)
6. Visar: "Sparad" ✅
7. Kan lägga till fler avtal
8. Klickar "Gå vidare"
```

### Vad är nytt sedan file-storage uppdateringen?
```
SAMMA SOM FINANCIALS:
✅ Files nu i AWS S3 istället för mock
✅ Användaren märker INGET
✅ Backend sparar real S3 URLs
✅ Filer permanent + kan delas
```

### UI Elements
```
Agreement types grid: 7 kort med typ + ikon
Add button: "+ Lägg till"
Form: Namn, viktighet, risk, file upload
File upload: Drag & drop för PDF
Saved items: Lista över uppladdade avtal
Action buttons: "Gå vidare" eller "Lägg till mer"
```

---

## 🔐 MODUL 4: DATARUM

**URL:** `/salja/sme-kit/dataroom`

### Vad gör den?
```
✅ Säker dokumentlagring
✅ Organiserade mappar (7 kategorier)
✅ Åtkomstlogg
✅ Anteckningar per dokument
```

### Status: PENDING ⚪ (0%)
```
UI Status: Polished
Functionality: Folder structure + uploads
Upload: ✅ Fungerar (AWS S3)
Logging: ⚪ Mock (inte real logg än)
```

### Folder Structure
```
💰 Finansiell data
  - Bokslut 2024
  - Skattedeklaration
  - Budgetering
  
📄 Avtal & kontrakt
  - Kunde-avtal
  - Leverantörs-avtal
  
⚖️ Juridisk dokumentation
  - Bolagsordning
  - Domstolsdokument
  
🏦 Skatt & redovisning
  - Momsdokument
  - Skattebeslut
  
👥 Personal & HR
  - Anställningsavtal
  - Organisationsdiagram
  
🔐 IP & licenser
  - Varumärkesregistrering
  - Patentdokument
  
📦 Övrigt
  - Försäljningsöversikt
  - Certifieringar
```

### User Flow
```
1. Klicka på modul → Går till /dataroom
2. Step 1: "Setup"
   - Klickar "Skapa datarum"
3. Step 2: "Files"
   - Väljer en mapp (t.ex. "💰 Finansiell data")
   - Klickar "Lägg till fil"
   - Laddar upp dokument
   - ⬆️ FIL LADDAS UPP TILL AWS S3
   - Kan lägga till notering: "Bokslut för senaste året"
   - Visar: Filnamn, storlek, datum, anteckning
4. Kan lägga till fler filer i andra mappar
5. Step 3: "Review"
   - Visar alla uppladdade filer
   - Totalt antal: 15 filer
6. Step 4: "Complete"
   - "✅ Datarum är klart!"
```

### Vad är nytt sedan file-storage uppdateringen?
```
SAMMA SOM FINANCIALS & AGREEMENTS:
✅ Files nu i AWS S3
✅ Användaren märker INGET
✅ Real S3 URLs sparas
✅ Filer kan nås senare från S3
```

### UI Elements
```
Setup button: "Skapa datarum"
Folder selector: 7 mappar med emoji + färg
File upload: Drag & drop
File list: Tabell med filnamn, storlek, datum
Notes field: Textarea för anteckningar
Progress: Step indicator (1/4)
```

---

## 📊 MODUL 5: TEASER & IM

**URL:** `/salja/sme-kit/teaser`

### Vad gör den?
```
✅ Generera "Teaser" (1-sida pitch)
✅ Generera "IM" (10-sida presentation)
✅ Q&A form med 10+ frågor
✅ PDF export
```

### Status: PENDING ⚪ (0%)
```
UI Status: Polished
Functionality: Form + mock PDF generation
PDF Export: ⚪ Mock (inte real PDF generation än)
DB Integration: ✅ Sparar Q&A svar
```

### Questions Template
```
TEASER (10 frågor):
1. Företagsnamn
2. Bransch
3. Grundat
4. Anställda
5. Senaste årets omsättning
6. EBITDA-marginal
7. Huvudprodukter/tjänster
8. Geografisk räckvidd
9. Varför säljer ni?
10. Framtida potential

IM (15+ frågor - extended):
   (Samma som teaser + fler)
```

### User Flow
```
1. Klicka på modul → Går till /teaser
2. Step 1: "Select"
   - Väljer: "Teaser" eller "IM"
3. Step 2: "Form"
   - Fyller in 10 frågor
   - Kan se preview under
   - Example data redan ifyllt
4. Step 3: "Generate"
   - Knappen: "Generera PDF"
   - ⬆️ SKULLE BYGGA PDF (MOCK NU, REAL SENARE)
   - Hämtar: teaser-xya123.pdf
5. Kan ladda ned eller skicka vidare
```

### Vad är INTE påverkat av file-storage ändringar
```
❌ Denna modul använder INTE fil-upload ännu
❌ PDF:erna skulle sparas i S3 senare
❌ Användaren märker INGET av S3 uppdateringen
```

### UI Elements
```
Selection buttons: "Teaser" eller "IM"
Q&A form: Input fields + textarea
Preview panel: Visar draft teaser
Button: "Generera PDF"
Download area: PDF link
```

---

## 📝 MODUL 6: NDA-PORTAL

**URL:** `/salja/sme-kit/nda`

### Vad gör den?
```
✅ Generera & skicka NDA
✅ Spåra signering
✅ Access control (skapa signed URLs)
```

### Status: PENDING ⚪ (0%)
```
UI Status: Polished
Functionality: Form + email mock
Signing: ⚪ Mock BankID
Access: ⚪ Signed URLs (ready för implementation)
```

### User Flow
```
1. Klicka på modul → Går till /nda
2. Fyller in:
   - NDA-mottagare e-post
   - Vilken typ av NDA
   - Giltighetsperiod
3. Klickar "Skicka NDA"
4. System genererar PDF + signed URL
5. E-post skickas till mottagare
6. Visar status: "Pending signature"
7. Kan spåra när signerad (mock)
```

### Vad är INTE påverkat av file-storage ändringar
```
❌ NDA-PDF:erna skulle sparas i S3 senare
❌ Signed URLs skulle använda S3 (redo nu!)
❌ Användaren märker INGET ännu
```

### UI Elements
```
Form fields: Email, NDA type, period
Send button: "Skicka NDA"
Status tracker: Visar pending/signed
History: List of sent NDAs
```

---

## 📦 MODUL 7: ADVISOR HANDOFF

**URL:** `/salja/sme-kit/handoff`

### Vad gör den?
```
✅ Samlar allt från modules 1-6
✅ Skapar ZIP-fil med alla dokument
✅ Genererar handoff-rapport
✅ Skickar till rådgivare
```

### Status: PENDING ⚪ (0%)
```
UI Status: Polished
Functionality: Aggregator + ZIP creation
ZIP Contents: All files from previous steps
```

### User Flow
```
1. Klicka på modul → Går till /handoff
2. Visar summary av allt gjort:
   ✅ Identitet: Bolagsdata
   ✅ Finansiell: 3 årsx bokslut
   ✅ Avtal: 8 st dokument
   ✅ Datarum: 15 st filer
   ✅ Teaser: Generated PDF
   ✅ NDA: 5 st skickade
3. Klickar "Förbered handoff-pack"
4. System skapar:
   - handoff-pack.zip (alla filer från AWS S3)
   - handoff-rapport.pdf (summary)
5. Klickar "Skicka till rådgivare"
6. Rådgivare får e-post med länk
7. Kan ladda ned ZIP
8. Status: "✅ Handoff complete"
```

### Vad är nytt sedan file-storage uppdateringen?
```
VIKTIGT!
Denna modul hämtar filer FRÅN AWS S3 och skapar ZIP.

FÖRE (Mock):
  - Kunde bara referera till mock URLs
  - Inte möjligt att hämta faktiska filer
  
EFTER (AWS S3):
  - Kan ladda ned faktiska S3-filer via signerad URL
  - Kann skapa verklig ZIP med alla dokument
  - Kan dela ZIP via e-post eller länk
  
RESULT: Handoff blir nu MYCKET MER FUNKTIONELL
```

### UI Elements
```
Summary cards: Status för varje modul
File count: Visar totalt antal filer
Button: "Förbered handoff-pack"
Download area: ZIP + rapport
Send to advisor: E-postform
```

---

## 📊 SAMMANFATTNING - VAD ÄR FÖRÄNDRAT?

### File Storage Changes Impact

| Modul | Påverkan | User Notice |
|-------|----------|-------------|
| Identitet | Ingen | ❌ |
| Financials | Direktpåverkad | ❌ (samme UI) |
| Agreements | Direktpåverkad | ❌ (samme UI) |
| Dataroom | Direktpåverkad | ❌ (samme UI) |
| Teaser | Indirekt (senare) | ❌ |
| NDA | Indirekt (senare) | ❌ |
| Handoff | STOR (nu funktionell!) | ✅ (mer funktionell) |

### Backend Changes

| Komponent | Före | Efter | Impact |
|-----------|------|-------|--------|
| lib/sme-file-handler.ts | Supabase SDK | AWS SDK | URLs ändras från mock till S3 |
| /api/sme/financials/upload | generateFileUrl() | AWS S3 upload | Real S3 storage |
| /api/sme/agreements/upload | generateFileUrl() | AWS S3 upload | Real S3 storage |
| Database URLs | /api/sme/files/... | https://s3.../... | More reliable |
| Handoff pack builder | Can't fetch files | Can fetch from S3 | More functional |

### User Experience

```
FÖRE:  Mock files, limited functionality
EFTER: Real files in AWS, full potential for handoff

VISIBLE CHANGES:
❌ Upload dialogs - samma
❌ Progress bars - samma
❌ Form UI - samma
✅ File storage - nu riktig

INVISIBLE CHANGES:
✅ Files now permanent
✅ URLs now real S3 endpoints
✅ Better reliability
✅ Can be shared/downloaded
✅ Handoff pack now functional
```

---

## 🎯 KONKLUSIONER

```
1. VISUELLA ÄNDRINGAR
   Användaren ser: INGENTING annorlunda
   Alla 7 moduler ser likadana ut
   Samma colors, same icons, samma layout

2. FUNKTIONELLA ÄNDRINGAR
   File upload: Samma UI, men nu real AWS S3
   File access: Kan ladda ned från S3 senare
   Handoff: Blir nu MYCKET mer funktionell

3. BACKEND ÄNDRINGAR
   Supabase → AWS S3
   Mock URLs → Real S3 URLs
   API routes uppdaterade
   Database sparar real URLs

4. NEXT WEEK
   Imorgon: Email (notifications om uploads)
   Onsdag: Parser (real Excel parsing)
   Torsdag: Monitoring (error tracking)
   Fredag: Security audit + launch prep
```

