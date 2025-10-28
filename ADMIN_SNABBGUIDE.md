# 🚀 Admin Snabbguide - Bolaxo

## Hur kommer man in i Admin?

### Snabbstart (3 steg)

#### 1️⃣ Starta servern
```bash
npm run dev
```
Servern startar på: `http://localhost:3000`

#### 2️⃣ Sätt admin-lösenordet

**Viktigt:** Lösenordet måste vara minst 12 tecken långt!

**Alternativ A: Via Script (Rekommenderat)**
```bash
# Kör reset-password scriptet
npx tsx scripts/reset-admin-password.ts
```

Detta skapar/uppdaterar användaren:
- **Email:** `admin@bolaxo.com`
- **Lösenord:** `Password123!` (12 tecken)
- **Roll:** `admin`

**Alternativ B: Via API (Om servern körs)**
```bash
# Först, lägg till ADMIN_SETUP_TOKEN i .env filen:
# ADMIN_SETUP_TOKEN=din-hemliga-nyckel-här

# Sedan kör:
curl -X POST http://localhost:3000/api/admin/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolaxo.com",
    "password": "Password123!",
    "setupToken": "din-hemliga-nyckel-här"
  }'
```

#### 3️⃣ Logga in
```
URL: http://localhost:3000/admin/login

Email: admin@bolaxo.com
Lösenord: Password123!
```

Klicka på "Logga in" → Du kommer till admin-dashboarden på `/admin`!

---

## ⚙️ Troubleshooting

### Problem: Databasen är inte tillgänglig

**Lösning:** Se till att DATABASE_URL är korrekt i `.env` filen:

```bash
# Exempel för lokal Postgres
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Exempel för Railway/Remote
DATABASE_URL="postgresql://postgres:password@host:port/database"
```

Kör sedan migrations:
```bash
npx prisma generate
npx prisma migrate deploy
```

### Problem: "Lösenordet måste vara minst 12 tecken långt"

**Lösning:** Använd ett längre lösenord. Exempel:
- ✅ `Password123!` (12 tecken)
- ✅ `AdminBolaxo2024!` (15 tecken)
- ❌ `Password123` (11 tecken - för kort!)

### Problem: "Användare inte funnen"

**Lösning:** Skapa admin-användaren först:

```bash
# Kör reset-password scriptet - det skapar användaren om den inte finns
npx tsx scripts/reset-admin-password.ts
```

### Problem: "Ogiltig e-post eller lösenord"

**Kontrollera:**
1. Att email är `admin@bolaxo.com` (kolla stavning)
2. Att lösenordet är exakt `Password123!` (versalkänsligt!)
3. Att användaren har `role = 'admin'` i databasen

**Verifiera i databasen:**
```sql
SELECT id, email, role, "passwordHash" IS NOT NULL as has_password 
FROM "User" 
WHERE email = 'admin@bolaxo.com';
```

---

## 🔑 Ändra Lösenord

För att ändra till ett annat lösenord, uppdatera scriptet:

### Metod 1: Redigera reset-admin-password.ts

```typescript
// Rad 8 i scripts/reset-admin-password.ts
const newPassword = 'Password123!'  // Ändra detta till ditt önskade lösenord
```

Kör sedan scriptet igen:
```bash
npx tsx scripts/reset-admin-password.ts
```

### Metod 2: Använd API direkt

```bash
curl -X POST http://localhost:3000/api/admin/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolaxo.com",
    "password": "DittNyaLösenord123!",
    "setupToken": "din-setup-token"
  }'
```

---

## 📌 Viktiga URLs

- **Admin Login:** `http://localhost:3000/admin/login`
- **Admin Dashboard:** `http://localhost:3000/admin`
- **Huvudsida:** `http://localhost:3000`

---

## 🔐 Standard Admin-uppgifter

Efter att ha kört reset-scriptet:

```
Email:    admin@bolaxo.com
Lösenord: Password123!
Roll:     admin
```

**OBS:** Byt lösenord till något säkrare i produktion!

---

## ✅ Verifiering

Efter inloggning bör du se:
- ✅ Admin-dashboard på `/admin`
- ✅ 24 admin-flikar tillgängliga
- ✅ Användarinformation i header
- ✅ Alla admin-funktioner fungerar

---

## 📞 Support

Om du fortfarande har problem:

1. Kontrollera att servern körs (`npm run dev`)
2. Kolla console logs för felmeddelanden
3. Verifiera databas-anslutning
4. Se till att migrations är körda
5. Kontrollera att admin-användaren finns i databasen

**Loggar finns i:**
- Browser Console (F12)
- Terminal där `npm run dev` körs
- `/api/admin/audit-trail` (efter inloggning)

---

Skapad: Oktober 2024
Version: 1.0

