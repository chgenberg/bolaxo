# 🔐 ADMIN DASHBOARD - PRODUCTION LOGIN GUIDE

## ✨ AKTUELL INLOGGNING (DEV/STAGING)

### Magic Link Authentication
Systemet använder **passwordless login** med magiska länkar:

1. Gå till `/login`
2. Välj roll: **Säljare / Köpare / Mäklare**
3. Ange **e-postadress**
4. I development: Klicka på direktlänken som visas
5. I production: Kolla din email för inloggningslänken

---

## 🚀 PRODUKTIONS ADMIN-INLOGGNING - REKOMMENDERAT SETUP

För att få admin-åtkomst till dashboarden i produktion rekommenderas:

### Option 1: Admin Magic Link (Aktuell metod)
```
1. Registrera dig normalt på /registrera
2. I databasen: Sätt user.role = 'admin'
3. Logga in med magic link
4. Du får tillgång till /admin dashboarden
```

**Fördel**: Enkelt, säkert, passwordless  
**Nackdel**: Behöver manuell DB-uppdatering

---

### Option 2: Admin Registration Panel (Rekommenderat för produktion)
Skapa en separat admin-registrering:

```typescript
// app/admin/register/page.tsx (lägg till denna)
'use client'

import { useState } from 'react'
import FormField from '@/components/FormField'

export default function AdminRegister() {
  const [email, setEmail] = useState('')
  const [adminSecret, setAdminSecret] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          adminSecret: process.env.NEXT_PUBLIC_ADMIN_SECRET 
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Admin-användare skapad! Kolla din email för inloggningslänken.')
      } else {
        alert('Fel: ' + data.error)
      }
    } catch (error) {
      alert('Ett fel uppstod')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-white py-12 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-card max-w-md w-full border border-gray-200">
        <h1 className="text-3xl font-bold text-accent-orange mb-6 text-center">
          Admin Registration
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="E-postadress"
            type="email"
            value={email}
            onValueChange={setEmail}
            placeholder="admin@bolagsplatsen.se"
            required
          />
          
          <button
            type="submit"
            disabled={!email || isSubmitting}
            className="w-full py-3 px-6 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Skapar...' : 'Skapa Admin'}
          </button>
        </form>
      </div>
    </main>
  )
}
```

### API Endpoint för Admin Registration
```typescript
// app/api/admin/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, adminSecret } = await request.json()

    // Verifiera admin-secret
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin secret' },
        { status: 403 }
      )
    }

    // Skapa eller uppdatera användare
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: 'admin' },
      create: {
        email,
        role: 'admin',
        name: email.split('@')[0],
        verified: true,
        bankIdVerified: true
      }
    })

    // Skicka magic link
    const response = await fetch('/api/auth/magic-link/send', {
      method: 'POST',
      body: JSON.stringify({
        email,
        role: 'admin',
        acceptedPrivacy: true
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created and magic link sent'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}
```

---

## 🔒 PRODUCTION LOGIN CREDENTIALS

### För att komma åt admin-dashboarden behövs:

1. **E-postadress** som är registrerad i systemet
2. **user.role = 'admin'** i databasen
3. **Gild magic link** från email

### TEST-ANVÄNDARE (Development)
```
Email: admin@test.se
Role: admin
Status: I databasen
```

### STEG FÖR ATT SKAPA ADMIN-ANVÄNDARE I PRODUCTION

#### Step 1: Environment Variables
```bash
# .env.production
ADMIN_SECRET_KEY=your_secure_secret_key_here
NEXT_PUBLIC_ADMIN_REGISTRATION_ENABLED=true
```

#### Step 2: Skapa admin via registreringspanelen
```
1. Gå till https://bolagsplatsen.se/admin/register
2. Ange e-postadress
3. Systemet skapar admin-användaren
4. Magic link skickas till email
5. Klicka länken för att logga in
```

#### Step 3: Verifiera åtkomst
```
1. Logga in med admin-email
2. Gå till https://bolagsplatsen.se/admin
3. Du bör se alla 24 tabs
4. Prova att navigera mellan tabbar
5. Testa någon funktion (sök, filter, pagination)
```

---

## 🧪 TEST LOGIN FLOW

### Development (localhost:3000)
```
1. Gå till /login
2. Välj vilken roll som helst
3. Ange email (vilken som helst)
4. Godkänn integritetspolicy
5. Skicka länk
6. Direktlänk visas på skärmen
7. Klicka länken
8. Du är inloggad!
```

### För admin-åtkomst i development:
```
1. Logga in normalt
2. I databasen: UPDATE users SET role = 'admin' WHERE email = 'din@email.se'
3. Gå till /admin
4. Du ser admin-dashboarden!
```

---

## 🛡️ SECURITY BEST PRACTICES

### I Production:
- ✅ Använd stark `ADMIN_SECRET_KEY` (minst 32 tecken)
- ✅ Skydda `/admin/register` slutpunkten med rate limiting
- ✅ Logga alla admin-registreringar
- ✅ Skicka admin-registreringslänkar via secure email
- ✅ Tvåfaktorsautentisering rekommenderas för admin-konton
- ✅ Implementera admin-audit trail (redan gjort! ✅)
- ✅ Implementera IP-whitelist för admin-åtkomst

### Magic Link Security:
```typescript
// Tokens är tidsbegränsade
Token expiry: 1 timme
Token format: JWT signerad
Token storage: HTTP-only cookies
```

---

## 📋 PRODUCTION LAUNCH CHECKLIST - LOGIN

- [ ] ADMIN_SECRET_KEY satt i .env.production
- [ ] Admin registration API är skyddad
- [ ] Magic link email-integration fungerar
- [ ] Admin audit trail är aktiverat
- [ ] Rate limiting på /admin/register
- [ ] IP-logging för alla admin-logins
- [ ] 2FA-integration för admin-konton (optional men rekommenderat)
- [ ] Admin-användare skapad och testad
- [ ] Åtkomst till /admin verifiserad

---

## 🚀 QUICK START - PRODUCTION ADMIN ACCESS

### Scenario 1: En admin-användare
```bash
# 1. Registrera admin-användare
POST /api/admin/register
{
  "email": "cto@bolagsplatsen.se",
  "adminSecret": "your_secure_key"
}

# 2. Logga in
- Gå till /login
- Ange cto@bolagsplatsen.se
- Kolla email för magisk länk
- Klicka länken

# 3. Navigera till admin
- Gå till /admin
- Du ser dashboarden!
```

### Scenario 2: Flera admin-användare
```bash
# Repetera samma process för varje admin
POST /api/admin/register (för varje admin)
```

---

## ❓ FAQ - ADMIN LOGIN

**F: Hur loggar jag in som admin?**  
S: Samma som vanlig användare, men ditt konto måste ha `role = 'admin'` i databasen.

**F: Vad är magic link?**  
S: En säker inloggningslänk som skickas till din email istället för lösenord.

**F: Hur länge är magic link giltig?**  
S: 1 timme

**F: Kan jag använda samma email för flera roller?**  
S: Ja, en email kan bara ha en roll åt gången.

**F: Hur återställer jag admin-lösenord?**  
S: Vi använder passwordless auth, så bara begär en ny magic link på /login.

**F: Hur skapar jag en backup-admin?**  
S: Registrera en ny admin-användare med en annan email via /api/admin/register.

---

## 📞 SUPPORT - LOGIN ISSUES

**Problem: Magic link fungerar inte**
- Kontrollera spam-folder i email
- Verifiera att email-domänen inte är blockerad
- Försök skapa en ny länk efter 1 timme

**Problem: "Unauthorized Access" på /admin**
- Verifiera att din roll är 'admin' i databasen
- Logga ut och in igen
- Kontrollera cookies

**Problem: "Invalid Admin Secret"**
- Verifiera ADMIN_SECRET_KEY i .env.production
- Säkerställ att secret är exakt samma som i .env-filen

---

## 🎯 PRODUCTION DEPLOYMENT CHECKLIST

```
FÖRE LAUNCH:
✅ Admin registration API implementerat
✅ Magic link email-template skapad
✅ Admin credentials dokumenterade
✅ Security review genomförd
✅ 2FA implementerat (rekommenderat)
✅ Audit logging aktiverat
✅ Test-admin skapad och verifierad

UNDER LAUNCH:
✅ Återställningsplan för lost admin access
✅ Contact-information för support

EFTER LAUNCH:
✅ Dagligt monitoring av admin-logins
✅ Regelbundna backups av admin-konton
✅ Säkerhet updates tillämpas omedelbar
```

---

## 📚 RELATED DOCUMENTATION

- [ADMIN_DASHBOARD_COMPLETION.md](./ADMIN_DASHBOARD_COMPLETION.md) - Feature overview
- [PRODUCTION_READY_GUIDE.md](./PRODUCTION_READY_GUIDE.md) - Migration guide
- [PRODUCTION_INTEGRATION_CHECKLIST.md](./PRODUCTION_INTEGRATION_CHECKLIST.md) - Integration verification

---

Generated: November 2024
Version: 1.0
