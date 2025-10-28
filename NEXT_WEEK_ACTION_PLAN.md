# 📅 NÄSTA VECKA - KONKRET ACTION PLAN

**Från working MVP → Production-ready system**

---

## 🎯 VECKA 1: PRODUCTION ESSENTIALS

### MÅNDAG - REAL FILE STORAGE (3-4 hours)

**Task 1.1: Setup Supabase**
```bash
# 1. Create account at supabase.com
# 2. Create new project
# 3. Setup storage bucket

# Add to .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
SUPABASE_BUCKET=sme-documents
```

**Task 1.2: Update file handler**
```typescript
// Edit /lib/sme-file-handler.ts

// REMOVE mock implementation
// ADD real Supabase upload

export async function uploadFile(file: File, listingId: string) {
  const { data, error } = await supabase.storage
    .from('sme-documents')
    .upload(`${listingId}/${file.name}`, file)
  
  if (error) throw error
  
  return getSignedUrl(data.path)
}
```

**Task 1.3: Update API route**
```typescript
// Edit /api/sme/financials/upload/route.ts

// Change from mock to real storage upload
// Test with real file upload
```

**Task 1.4: Test**
- [ ] Upload test file via UI
- [ ] Verify file appears in Supabase
- [ ] Test download link
- [ ] Test file deletion

---

### TISDAG - EMAIL INTEGRATION (2-3 hours)

**Task 2.1: Setup SendGrid**
```bash
# 1. Create account at sendgrid.com
# 2. Create API key
# 3. Verify sender email

# Add to .env:
SENDGRID_API_KEY=xxx
EMAIL_FROM=noreply@bolagsplatsen.se
```

**Task 2.2: Create email utility**
```typescript
// Create /lib/email-sender.ts

import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendNDAEmail(
  to: string,
  buyerName: string,
  ndaLink: string
) {
  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM!,
    subject: 'NDA för företagsförsäljning',
    html: `
      <h1>Hallå ${buyerName}!</h1>
      <p>Du är inbjuden att signera ett sekretessavtal.</p>
      <a href="${ndaLink}">Signera NDA</a>
    `
  })
}
```

**Task 2.3: Update NDA-portal API**
```typescript
// Edit /api/sme/nda/send/route.ts

// Replace console log with real email send
const { sendNDAEmail } = await import('@/lib/email-sender')
await sendNDAEmail(email, name, ndaLink)
```

**Task 2.4: Test**
- [ ] Send test email from UI
- [ ] Verify email arrives
- [ ] Check email formatting
- [ ] Test spam folder

---

### ONSDAG - EXCEL PARSER (3-4 hours)

**Task 3.1: Install package**
```bash
npm install xlsx
```

**Task 3.2: Create parser**
```typescript
// Create /lib/excel-parser.ts

import XLSX from 'xlsx'

export function parseFinancialExcel(buffer: Buffer) {
  const workbook = XLSX.read(buffer)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(sheet)
  
  return {
    revenue: data[0]['Revenue'],
    costs: data[0]['Costs'],
    ebitda: data[0]['EBITDA'],
    // ... extract fields
  }
}
```

**Task 3.3: Update financials API**
```typescript
// Edit /api/sme/financials/upload/route.ts

// Add parsing logic when file is uploaded
const parsed = await parseFinancialExcel(buffer)
// Auto-fill form fields with parsed data
```

**Task 3.4: Test**
- [ ] Download test Excel from web
- [ ] Upload to system
- [ ] Verify data extraction
- [ ] Test with bad Excel
- [ ] Test error handling

---

### TORSDAG - BASIC MONITORING (2-3 hours)

**Task 4.1: Setup Sentry**
```bash
# 1. Create account at sentry.io
# 2. Create project for Next.js
# 3. Copy DSN

npm install @sentry/nextjs
```

**Task 4.2: Configure Sentry**
```typescript
// Update next.config.js

const withSentryConfig = require("@sentry/nextjs/cjs/withSentryConfig")

module.exports = withSentryConfig(
  {
    // ... next config
  },
  {
    org: "your-org",
    project: "sme-kit",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  }
)
```

**Task 4.3: Add error tracking**
```typescript
// Update /api/sme/*/route.ts files

import * as Sentry from "@sentry/nextjs"

try {
  // ... code
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

**Task 4.4: Test**
- [ ] Trigger test error
- [ ] Verify appears in Sentry
- [ ] Check error details
- [ ] Test alert notification

---

### FREDAG - SECURITY AUDIT (2-3 hours)

**Task 5.1: OWASP Check**
- [ ] SQL Injection: Check Prisma is used correctly
- [ ] XSS: Verify React escapes output
- [ ] CSRF: Check form tokens
- [ ] Authentication: Verify JWT works
- [ ] Authorization: Check role checks

**Task 5.2: Security Headers**
```typescript
// Edit next.config.js

async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' }
    ]
  }]
}
```

**Task 5.3: Test**
- [ ] Run OWASP ZAP scan
- [ ] Check security headers
- [ ] Test password validation
- [ ] Verify file validation

---

## 📊 VECKA 1 SUMMARY

```
MON: File Storage (4h)      ✅ Real uploads work
TUE: Email (3h)             ✅ Real emails send
WED: Excel Parser (4h)      ✅ Auto-extract financial data
THU: Monitoring (3h)        ✅ Track errors in production
FRI: Security (3h)          ✅ Audit pass

TOTAL: 17 hours
RESULT: MVP → Production Ready
```

---

## 🚀 VECKA 2: REAL INTEGRATIONS

### MÅNDAG - PDF GENERATION

**Install:**
```bash
npm install pdfkit html-to-pdf
```

**Create template:**
```typescript
// Create /lib/pdf-templates/teaser.ts

export async function generateTeaserPDF(questionnaire) {
  const doc = new PDFDocument()
  
  // Title
  doc.fontSize(24).text('Företagspresentation')
  
  // Content
  doc.fontSize(12)
    .text(`Bransch: ${questionnaire.industry}`)
    .text(`Omsättning: ${questionnaire.revenue} MSEK`)
    .text(`EBITDA: ${questionnaire.ebitda} MSEK`)
  
  // Watermark
  addWatermark(doc, 'CONFIDENTIAL')
  
  return doc
}
```

### TISDAG - BANKID REAL

**Setup:**
```bash
# Contact BankID provider for credentials

# Add to .env:
BANKID_USER_ID=xxx
BANKID_PASS=xxx
BANKID_CA_CERT=xxx
```

### ONSDAG - BOLAGSVERKET API

**Setup:**
```bash
# Get API key from bolagsverket.se

# Add to .env:
BOLAGSVERKET_API_KEY=xxx
```

### TORSDAG - E2E TESTING

**Setup Cypress:**
```bash
npm install cypress
npx cypress open
```

**Create test:**
```typescript
// cypress/e2e/sme-kit-flow.cy.ts

describe('SME Kit Flow', () => {
  it('completes all 7 modules', () => {
    // Test full flow
  })
})
```

### FREDAG - DEPLOY TO STAGING

```bash
# Deploy to Railway/Vercel staging
vercel --scope=staging

# Run smoke tests
npx cypress run
```

---

## 💡 TIPS & TRICKS

### 1. Start with hardcoded test data
```typescript
// Don't wait for real API - use test data first
const testData = {
  revenue: 15000000,
  ebitda: 3000000
}
```

### 2. Use environment variables everywhere
```typescript
// GOOD
const apiKey = process.env.SENDGRID_API_KEY

// BAD
const apiKey = 'sg_xxx_hardcoded'
```

### 3. Test locally first
```bash
# Always test in dev before deploying
npm run dev
# Test feature manually
# Check console for errors
```

### 4. Use mock data for testing
```typescript
// Keep mock implementation until real one is ready
export async function uploadFile(file) {
  if (process.env.NODE_ENV === 'development') {
    return mockUpload(file) // Return mock URL
  }
  return realUpload(file) // Return real URL
}
```

---

## ✅ COMPLETION CHECKLIST

By end of week 1:
- [ ] Real file storage working
- [ ] Real emails sending
- [ ] Excel parsing working
- [ ] Error monitoring setup
- [ ] Security audit passed
- [ ] All tests passing
- [ ] Ready to demo to stakeholders

By end of week 2:
- [ ] PDF generation working
- [ ] BankID mock → semi-real (for testing)
- [ ] Company data API working
- [ ] E2E tests passing
- [ ] Staging deployment working
- [ ] Ready for beta users

---

## 📞 BLOCKERS & HOW TO SOLVE

**Blocker 1: "Supabase setup is confusing"**
→ Follow their tutorial: https://supabase.com/docs/guides/storage

**Blocker 2: "SendGrid emails go to spam"**
→ Setup SPF/DKIM records with domain provider

**Blocker 3: "Excel parser doesn't work"**
→ Add error logging: `console.log(data)` to debug

**Blocker 4: "PDF looks ugly"**
→ Use html-to-pdf for better styling

**Blocker 5: "BankID too complicated"**
→ Use mock for MVP, integrate later for production

---

## 🎯 SUCCESS CRITERIA

✅ **System works with real data**
✅ **Emails actually send**
✅ **PDFs are professional**
✅ **No errors in production**
✅ **Users can complete workflow**

---

**Ready to execute? Start Monday! 🚀**

