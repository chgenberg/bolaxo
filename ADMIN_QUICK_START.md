# 🚀 ADMIN SETUP - QUICK START GUIDE

## Option 1: Via CLI Script (Rekommenderat)

Enklaste sättet att skapa en admin-användare direkt från kommandoraden:

```bash
npm run create-admin
```

Du kommer då att bli ombedd att ange:
1. **E-postadress** - Admin användarens e-post
2. **Namn** (valfritt) - Admin användarens namn
3. **Lösenord** (min 12 tecken) - Starkt lösenord
4. **Bekräfta lösenord** - Upprepa lösenordet

### Exempel:
```
🔐 SKAPA ADMIN-ANVÄNDARE
========================

E-postadress: admin@bolagsplatsen.se
Namn (valfritt): Christopher
Lösenord (min 12 tecken): MySecurePass123!
Bekräfta lösenord: MySecurePass123!

✅ Admin-användare skapad framgångsrikt!

📋 Inloggningsuppgifter:
   E-post: admin@bolagsplatsen.se
   Lösenord: MySecurePass123!
   URL: http://localhost:3000/admin/login
```

---

## Option 2: Via API Endpoint

Använd POST-requesta för att skapa admin-användare programmatiskt:

```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolagsplatsen.se",
    "password": "MySecurePass123!",
    "name": "Admin User",
    "setupToken": "YOUR_ADMIN_SETUP_TOKEN"
  }'
```

**Kräver:**
- `ADMIN_SETUP_TOKEN` environment variabel (se guide nedan)
- Giltigt format på lösenord (min 12 tecken)

### Response:
```json
{
  "success": true,
  "message": "Admin-användare skapad framgångsrikt!",
  "user": {
    "id": "clm3f2k1l...",
    "email": "admin@bolagsplatsen.se",
    "name": "Admin User",
    "role": "admin"
  },
  "loginUrl": "/admin/login",
  "credentials": {
    "email": "admin@bolagsplatsen.se",
    "password": "(lösenordet du angav)"
  }
}
```

---

## Option 3: Via Direct Database Insert (Avancerat)

Om du har tillgång till PostgreSQL direkt:

```bash
# Anslut till databasen
psql postgresql://postgres:YOUR_PASSWORD@switchback.proxy.rlwy.net:23773/railway

# Hash lösenordet först (använd Node.js):
node -e "require('bcrypt').hash('MySecurePass123!', 12).then(h => console.log(h))"
# Output: $2b$12$... (använd detta värde nedan)

# Sätt in admin-användaren
INSERT INTO "User" (id, email, name, role, "passwordHash", verified, "bankIdVerified", "createdAt")
VALUES (
  gen_random_uuid(),
  'admin@bolagsplatsen.se',
  'Admin User',
  'admin',
  '$2b$12$...', -- Klistra in hashen här
  true,
  true,
  NOW()
);
```

---

## 🔐 Environment Variables Setup

För att kunna använda Option 2 (API), behöver du sätta upp environment variabler:

### 1. Generera ADMIN_SETUP_TOKEN

```bash
# Använd OpenSSL
openssl rand -base64 32

# Eller Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Eller online: https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html&rnd=new
```

### 2. Generera JWT_SECRET

```bash
# Använd samma metoder som ovan
openssl rand -base64 64
```

### 3. Lägg till i `.env.production`

```env
# Admin Setup
ADMIN_SETUP_TOKEN=your_generated_token_here
JWT_SECRET=your_generated_jwt_secret_here

# Database
DATABASE_URL=postgresql://postgres:EryeygGmUDHJSADKIVjnQBPxtJQOjxRG@switchback.proxy.rlwy.net:23773/railway
```

---

## 🔐 Login Process

Efter att admin-användaren är skapad kan du logga in på:

### URL:
```
http://localhost:3000/admin/login
eller
https://bolagsplatsen.se/admin/login (production)
```

### Inloggningsuppgifter:
- **E-post:** admin@bolagsplatsen.se
- **Lösenord:** (det lösenord du skapade)

---

## ✅ Verifying Admin Creation

Verifiera att admin-användaren skapades framgångsrikt:

### Via Database:
```sql
SELECT id, email, name, role, "passwordHash" IS NOT NULL as has_password, "createdAt"
FROM "User"
WHERE role = 'admin'
ORDER BY "createdAt" DESC;
```

### Via Admin Dashboard:
1. Logga in på `/admin/login`
2. Gå till fliken "Admin Management"
3. Du bör se din admin-användare listad

---

## 🛡️ Security Best Practices

1. **Använd starka lösenord** (min 12 tecken, blanda VERSALER, gemener, siffror, specialtecken)
2. **Skydda environment variabler** - Lagra aldrig tokens i kod eller Git
3. **Använd HTTPS i production** - Cookies är endast säkra med HTTPS
4. **Rotera tokens regelbundet** - Uppdatera ADMIN_SETUP_TOKEN efter setup
5. **Aktivera 2FA** - I Admin Management-panelen kan du aktivera två-faktor-autentisering

---

## 🔧 Troubleshooting

### "Ogiltig setup-token" vid API-anrop
- Verifiera att `ADMIN_SETUP_TOKEN` är korrekt satt i `.env.production`
- Säkerställ att token är helt kopierad (ingen extra mellanslag)

### "Lösenordet måste vara minst 12 tecken långt"
- Använd ett längre lösenord med blandade teckentyper

### "Användare med denna e-postadress finns redan"
- Använd en annan e-postadress, eller uppdatera befintlig användare via Admin Management

### Script kör inte
- Säkerställ att du är i projektets rot-directory
- Kontrollera att `node_modules` är installerad: `npm install`
- Verifiera att `prisma generate` har körts: `npm run postinstall`

---

## 📋 Checklista för Production Setup

- [ ] PostgreSQL-databas är tillgänglig
- [ ] `DATABASE_URL` är satt korrekt
- [ ] `ADMIN_SETUP_TOKEN` är genererad och sparad
- [ ] `JWT_SECRET` är genererad och sparad
- [ ] Admin-användare skapad (Option 1, 2 eller 3)
- [ ] Du kan logga in på `/admin/login`
- [ ] 2FA är aktiverad (rekommenderat)
- [ ] Andra admins är inbjudna (via Admin Management)

---

## 📞 Support

Behöver du hjälp? Kontakta utvecklarteamet eller se:
- API-dokumentation: `GET /api/admin/create`
- Lucia auth-dokumentation: https://lucia-auth.com
- Prisma docs: https://www.prisma.io/docs
