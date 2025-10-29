# 📧 GRATIS EMAIL-TJÄNSTER FÖR BOLAXO.COM

**Datum:** 2025-10-29  
**Syfte:** Alternativ till Resend för att skicka magic link emails och notifications

---

## 🆓 BÄSTA GRATIS ALTERNATIV

### 1. **Sendinblue (Brevo)** ⭐ REKOMMENDERAS

**Gratis plan:**
- ✅ **300 emails/dag** (9,000/månad)
- ✅ **API tillgänglig**
- ✅ **SMTP-tillgänglig**
- ✅ **Ingen kreditkort krävs**

**Setup:**
1. Skapa konto: https://www.brevo.com (tidigare Sendinblue)
2. Gå till Settings → SMTP & API
3. Skapa API Key
4. Lägg till i Railway Variables:
   ```env
   BREVO_API_KEY=your_api_key_here
   ```

**Integration:**
```typescript
// lib/email.ts
async function sendEmail(email: string, magicLink: string) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'BOLAXO', email: 'noreply@bolaxo.com' },
      to: [{ email }],
      subject: 'Din inloggningslänk till BOLAXO',
      htmlContent: `<p>Klicka här: <a href="${magicLink}">Logga in</a></p>`,
    }),
  })
  return response.json()
}
```

**Nackdelar:**
- Begränsad till 300 emails/dag (bra för start)
- Brevo-branding i footer (kan tas bort i betalplan)

---

### 2. **Mailjet** ⭐ BÄST FÖR STÖRRE VOLYM

**Gratis plan:**
- ✅ **6,000 emails/månad** (200/dag)
- ✅ **API tillgänglig**
- ✅ **SMTP-tillgänglig**
- ✅ **Ingen kreditkort krävs**

**Setup:**
1. Skapa konto: https://www.mailjet.com
2. Gå till Account Settings → API Keys
3. Skapa API Key och Secret Key
4. Lägg till i Railway Variables:
   ```env
   MAILJET_API_KEY=your_api_key
   MAILJET_API_SECRET=your_secret_key
   ```

**Integration:**
```typescript
// lib/email.ts
async function sendEmail(email: string, magicLink: string) {
  const credentials = Buffer.from(
    `${process.env.MAILJET_API_KEY}:${process.env.MAILJET_API_SECRET}`
  ).toString('base64')

  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [{
        From: { Email: 'noreply@bolaxo.com', Name: 'BOLAXO' },
        To: [{ Email: email }],
        Subject: 'Din inloggningslänk till BOLAXO',
        HTMLPart: `<p>Klicka här: <a href="${magicLink}">Logga in</a></p>`,
      }],
    }),
  })
  return response.json()
}
```

**Nackdelar:**
- Mer komplext API än Resend
- Kräver både API Key och Secret

---

### 3. **AWS SES** ⭐ BÄST FÖR SCALE

**Gratis plan:**
- ✅ **62,000 emails/månad** (om på EC2)
- ✅ **40,000 emails/månad** (vanlig plan)
- ✅ **1 cent per 1,000 emails** efter gratis tier
- ⚠️ **Kräver AWS-konto** (kreditkort krävs)

**Setup:**
1. Skapa AWS-konto: https://aws.amazon.com
2. Gå till SES (Simple Email Service)
3. Verifiera din domän eller email
4. Skapa IAM User med SES permissions
5. Lägg till i Railway Variables:
   ```env
   AWS_SES_REGION=eu-west-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

**Integration:**
```typescript
// Installera: npm install @aws-sdk/client-ses
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

async function sendEmail(email: string, magicLink: string) {
  const command = new SendEmailCommand({
    Source: 'noreply@bolaxo.com',
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: 'Din inloggningslänk till BOLAXO' },
      Body: {
        Html: { Data: `<p>Klicka här: <a href="${magicLink}">Logga in</a></p>` },
      },
    },
  })
  return await sesClient.send(command)
}
```

**Nackdelar:**
- Mer komplext setup
- Kräver AWS-konto och kreditkort
- Kan kosta pengar efter gratis tier

---

### 4. **SendGrid** (Förr bra, nu sämre)

**Gratis plan:**
- ✅ **100 emails/dag** (3,000/månad)
- ❌ **Kräver kreditkort** för att aktivera
- ✅ **API tillgänglig**

**Nackdelar:**
- Mycket låg gratis gräns
- Kräver kreditkort även för gratis plan

---

### 5. **Mailgun** (Förr bra, nu sämre)

**Gratis plan:**
- ✅ **5,000 emails/månad** (test-läge)
- ❌ **Kräver kreditkort** för production
- ✅ **API tillgänglig**

**Nackdelar:**
- Kräver kreditkort för production
- Begränsad för test-läge

---

### 6. **SMTP med Gmail** (Enklast men begränsat)

**Gratis plan:**
- ✅ **500 emails/dag** (gratis)
- ✅ **Ingen kreditkort krävs**
- ⚠️ **Kräver Google App Password**

**Setup:**
1. Aktivera 2FA på Gmail-konto
2. Skapa App Password: https://myaccount.google.com/apppasswords
3. Lägg till i Railway Variables:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

**Integration:**
```bash
npm install nodemailer
```

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

async function sendEmail(email: string, magicLink: string) {
  return await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Din inloggningslänk till BOLAXO',
    html: `<p>Klicka här: <a href="${magicLink}">Logga in</a></p>`,
  })
}
```

**Nackdelar:**
- Begränsad till 500 emails/dag
- Kan ses som spam om många skickas
- Kräver eget Gmail-konto

---

## 🎯 REKOMMENDATION FÖR BOLAXO.COM

### **För start (0-1000 users/månad):**
**👉 Sendinblue (Brevo)** - Enklast och bäst gratis plan

### **För scale (1000+ users/månad):**
**👉 AWS SES** - Bäst pris och scale

### **För snabb test (under 100 emails/dag):**
**👉 Gmail SMTP** - Enklast att sätta upp

---

## 🔧 IMPLEMENTATION FÖR BOLAXO

### Steg 1: Välj provider
Rekommendation: **Sendinblue (Brevo)**

### Steg 2: Skapa konto och API Key
1. Gå till https://www.brevo.com
2. Skapa gratis konto
3. Gå till Settings → SMTP & API
4. Skapa API Key
5. Kopiera API Key

### Steg 3: Lägg till i Railway Variables
```
BREVO_API_KEY=your_api_key_here
```

### Steg 4: Uppdatera sendMagicLinkEmail funktion
```typescript
// app/api/auth/magic-link/send/route.ts
async function sendMagicLinkEmail(email: string, magicLink: string, name: string) {
  if (!process.env.BREVO_API_KEY) {
    console.log('No email service configured, logging link:', magicLink)
    return
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'BOLAXO', email: 'noreply@bolaxo.com' },
        to: [{ email }],
        subject: 'Din inloggningslänk till BOLAXO',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Välkommen till BOLAXO</h1>
            <p>Hej ${name},</p>
            <p>Klicka på länken nedan för att logga in på ditt konto:</p>
            <a href="${magicLink}" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Logga in
            </a>
            <p style="color: #6b7280; font-size: 14px;">
              Länken är giltig i 1 timme. Om du inte begärt denna länk, ignorera detta mail.
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      console.error('Email send failed:', await response.text())
    }
  } catch (error) {
    console.error('Email send error:', error)
  }
}
```

---

## 📊 JÄMFÖRELSE TABELL

| Tjänst | Gratis Plan | API | Kreditkort | Rekommenderas |
|--------|-------------|-----|------------|---------------|
| **Sendinblue** | 300/dag | ✅ | ❌ | ⭐⭐⭐⭐⭐ |
| **Mailjet** | 200/dag | ✅ | ❌ | ⭐⭐⭐⭐ |
| **AWS SES** | 40k/månad | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **SendGrid** | 100/dag | ✅ | ✅ | ⭐⭐ |
| **Gmail SMTP** | 500/dag | ✅ | ❌ | ⭐⭐⭐ |

---

## ✅ NÄSTA STEG

1. **Skapa Sendinblue-konto** (5 min)
2. **Hämta API Key** (2 min)
3. **Lägg till i Railway Variables** (1 min)
4. **Uppdatera sendMagicLinkEmail funktion** (5 min)
5. **Testa att skicka email** (2 min)

**Totalt:** ~15 minuter för att få emails att fungera!

---

**Status:** 🟡 Email service behöver konfigureras  
**Rekommendation:** Sendinblue (Brevo) för start

