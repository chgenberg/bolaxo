# 📧 Email-notifikationssystem (Brevo)

**Senast uppdaterad:** 2025-11-30  
**Status:** ✅ Fullständigt implementerat

---

## Översikt

BOLAXO använder **Brevo (tidigare Sendinblue)** som email-provider. Alla email-funktioner finns i `lib/email.ts` och integreras i relevanta API-endpoints.

## Konfiguration

### Miljövariabler

```env
# Obligatorisk
BREVO_API_KEY=din-brevo-api-nyckel

# Valfria (defaults finns)
EMAIL_FROM=noreply@bolaxo.com
EMAIL_FROM_NAME=BOLAXO
NEXT_PUBLIC_BASE_URL=https://bolaxo.com

# För cron-jobb
CRON_SECRET=en-säker-hemlig-nyckel
```

### Verifiera domän i Brevo

1. Logga in på [Brevo](https://app.brevo.com)
2. Gå till **Senders & IP** → **Domains**
3. Lägg till `bolaxo.com`
4. Lägg till DNS-poster (SPF, DKIM)
5. Verifiera domänen

---

## Implementerade Email-typer

### 1. Autentisering & Registrering

| Email | Funktion | Trigger |
|-------|----------|---------|
| **Magic Link** | `sendMagicLinkEmail()` | Inloggning/registrering |
| **Välkommen** | `sendWelcomeEmail()` | Första verifiering av konto |

### 2. NDA-flöde

| Email | Funktion | Trigger |
|-------|----------|---------|
| **Ny NDA-förfrågan** | `sendNewNDARequestEmail()` | Köpare begär NDA |
| **NDA Godkänd** | `sendNDAApprovalEmail()` | Säljare godkänner NDA |
| **NDA Avslagen** | `sendNDARejectionEmail()` | Säljare avslår NDA |
| **NDA Påminnelse** | `sendNDAPendingReminderEmail()` | Cron-jobb (väntande > 2 dagar) |

### 3. LOI-flöde (Letter of Intent)

| Email | Funktion | Trigger |
|-------|----------|---------|
| **Ny LOI** | `sendLOINotificationEmail()` | Köpare skickar LOI |
| **LOI Godkänd** | `sendLOIApprovalEmail()` | Säljare godkänner LOI |

### 4. Meddelanden

| Email | Funktion | Trigger |
|-------|----------|---------|
| **Nytt meddelande** | `sendNewMessageEmail()` | Nytt meddelande skickat |

### 5. Matchning

| Email | Funktion | Trigger |
|-------|----------|---------|
| **Ny matchning** | `sendMatchNotificationEmail()` | Ny listing matchar köpare |

### 6. Betalning & Faktura

| Email | Funktion | Trigger |
|-------|----------|---------|
| **Betalningsbekräftelse** | `sendPaymentConfirmationEmail()` | Lyckad betalning |
| **Fakturapåminnelse** | `sendInvoiceReminderEmail()` | Förfallodatum närmar sig |

### 7. Transaktioner

| Email | Funktion | Milstolpar |
|-------|----------|------------|
| **Transaktion** | `sendTransactionMilestoneEmail()` | `nda_signed`, `loi_submitted`, `loi_accepted`, `dd_started`, `dd_completed`, `spa_signed`, `deal_closed` |

### 8. Sammanfattningar

| Email | Funktion | Trigger |
|-------|----------|---------|
| **Veckosammanfattning** | `sendWeeklyDigestEmail()` | Cron-jobb (söndagar 10:00) |

---

## API-endpoints

### Admin Email-test

```
GET  /api/admin/email-test
POST /api/admin/email-test
```

**Användning:** Testa alla email-typer från admin-panelen.

```javascript
// Exempel: Testa welcome-email
fetch('/api/admin/email-test', {
  method: 'POST',
  body: JSON.stringify({
    email: 'test@example.com',
    emailType: 'welcome'
  })
})
```

**Tillgängliga testtyper:**
- `test` - Grundläggande test
- `welcome` - Välkommen-email
- `nda_approval` - NDA godkänd
- `nda_rejection` - NDA avslagen
- `nda_request` - Ny NDA-förfrågan
- `new_message` - Nytt meddelande
- `match_buyer` - Matchning (köpare)
- `match_seller` - Matchning (säljare)
- `payment_confirmation` - Betalningsbekräftelse
- `invoice_reminder` - Fakturapåminnelse
- `weekly_digest` - Veckosammanfattning
- `transaction_milestone` - Transaktions-milstolpe
- `nda_pending_reminder` - NDA-påminnelse

### Cron: Email Digest

```
GET /api/cron/email-digest
```

**Konfiguration (vercel.json):**
```json
{
  "crons": [{
    "path": "/api/cron/email-digest",
    "schedule": "0 10 * * 0"
  }]
}
```

**Kräver:** `Authorization: Bearer {CRON_SECRET}` header

---

## Loggning

Alla skickade emails loggas automatiskt i databasen:

```prisma
model EmailLog {
  id                String   @id @default(cuid())
  to                String
  subject           String
  status            String   // 'success' | 'failed'
  providerMessageId String?
  errorMessage      String?
  payload           Json?
  createdAt         DateTime @default(now())
}
```

**Visa loggar i admin:** `/admin/emails`

---

## Felsökning

### Email skickas inte

1. Kontrollera att `BREVO_API_KEY` är satt
2. Verifiera att domänen är verifierad i Brevo
3. Kolla EmailLog-tabellen för felmeddelanden
4. Testa med admin email-test endpoint

### Emails hamnar i spam

1. Verifiera SPF, DKIM och DMARC i DNS
2. Använd en verifierad avsändardomän
3. Undvik spam-triggers i innehållet

### Rate limiting

Brevo har följande begränsningar:
- Free: 300 emails/dag
- Lite: 20,000 emails/månad
- Premium: 150,000 emails/månad

---

## Framtida förbättringar

- [ ] Email-preferenser per användare
- [ ] Lokaliserade templates (engelska)
- [ ] Unsubscribe-funktionalitet
- [ ] Email-statistik dashboard
- [ ] A/B-testning av templates

---

## Kontakt

Vid frågor om email-systemet, kontakta utvecklingsteamet eller se [Brevo dokumentation](https://developers.brevo.com/).

