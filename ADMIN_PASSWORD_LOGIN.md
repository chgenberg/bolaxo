# 🔐 ADMIN PASSWORD LOGIN - SETUP GUIDE

## ✨ WHAT'S NEW

You can now **log in directly** to the admin dashboard using **email + password** instead of magic links!

```
❌ OLD WAY: Email → Magic Link → /admin
✅ NEW WAY: Email + Password → /admin
```

---

## 🚀 QUICK START

### Step 1: Access Admin Login
```
Go to: https://bolagsplatsen.se/admin/login
```

### Step 2: Enter Credentials
```
Email:    admin@bolagsplatsen.se
Password: YourSecurePassword123!
```

### Step 3: You're In!
✅ Direct access to admin dashboard

---

## 🛠️ PRODUCTION SETUP

### Prerequisites
- Admin user account created in database
- Environment variables configured
- Password hash generated

### Step 1: Configure Environment Variables

Add these to `.env.production`:

```bash
# Admin setup token (use a strong random string)
ADMIN_SETUP_TOKEN=your_extremely_secure_token_here_min_32_chars

# JWT Secret for token signing
JWT_SECRET=your_jwt_secret_key_here_also_strong

# Database URL (already configured)
DATABASE_URL=your_production_db_url
```

### Step 2: Create Admin User

First, create an admin user in your database:

```sql
INSERT INTO "User" (
  id, 
  email, 
  name, 
  role, 
  verified, 
  "bankIdVerified", 
  "createdAt"
) VALUES (
  'admin-001',
  'admin@bolagsplatsen.se',
  'Admin User',
  'admin',
  true,
  true,
  NOW()
);
```

OR use this API call:

```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolagsplatsen.se",
    "name": "Admin User",
    "setupToken": "your_admin_setup_token"
  }'
```

### Step 3: Set Admin Password

Use the set-password endpoint to hash and store the password:

```bash
curl -X POST http://localhost:3000/api/admin/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolagsplatsen.se",
    "password": "YourSecurePassword123!",
    "setupToken": "your_admin_setup_token"
  }'
```

**Password Requirements:**
- Minimum 12 characters
- Mix of letters, numbers, and special characters recommended
- Unique and strong

### Step 4: Test Login

1. Go to `/admin/login`
2. Enter credentials
3. Click "Logga in"
4. Should redirect to `/admin` dashboard

✅ Success!

---

## 📋 DATABASE MIGRATION

### Add passwordHash Field

Run this migration:

```sql
ALTER TABLE "User" ADD COLUMN "passwordHash" VARCHAR;
```

Or use Prisma:

```bash
npx prisma migrate dev --name add_admin_password
```

---

## 🔒 SECURITY FEATURES

### Password Hashing
- ✅ Bcrypt with 12 salt rounds
- ✅ Passwords never stored in plain text
- ✅ Industry-standard encryption

### Token Security
- ✅ JWT tokens (7-day expiry)
- ✅ HTTP-only cookies (no JavaScript access)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite protection against CSRF

### Rate Limiting
Implement rate limiting on login endpoint:

```typescript
// app/api/middleware/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
})

export async function rateLimitMiddleware(ip: string) {
  const { success } = await ratelimit.limit(ip)
  return success
}
```

---

## 📁 FILE STRUCTURE

```
New/Updated Files:
├── app/admin/login/page.tsx              ✅ Admin login UI
├── app/api/admin/login/route.ts          ✅ Login API endpoint
├── app/api/admin/set-password/route.ts   ✅ Set password endpoint
└── prisma/schema.prisma                   ✅ Added passwordHash field
```

---

## 🧪 TESTING

### Local Development

```bash
# 1. Run database
docker-compose up postgres

# 2. Create admin user manually in DB
psql postgres://user:password@localhost:5432/db -c \
  "INSERT INTO User (id, email, name, role) VALUES ('1', 'admin@test.se', 'Admin', 'admin')"

# 3. Set password
curl -X POST http://localhost:3000/api/admin/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.se",
    "password": "TestPassword123!",
    "setupToken": "test-token"
  }'

# 4. Try login
# Go to http://localhost:3000/admin/login
# Enter: admin@test.se / TestPassword123!
```

### Postman Test

```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@bolagsplatsen.se",
  "password": "YourSecurePassword123!"
}
```

Expected Response:

```json
{
  "success": true,
  "message": "Inloggningen lyckades",
  "user": {
    "id": "admin-001",
    "email": "admin@bolagsplatsen.se",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## ⚠️ TROUBLESHOOTING

### Problem: "Ogiltig e-postadress eller lösenord"

**Causes:**
- User doesn't exist
- User is not admin role
- Password is incorrect
- passwordHash is NULL

**Solution:**
```sql
-- Check user exists
SELECT id, email, role, "passwordHash" FROM "User" WHERE email = 'admin@bolagsplatsen.se';

-- If passwordHash is NULL, set it
curl -X POST http://localhost:3000/api/admin/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolagsplatsen.se",
    "password": "NewPassword123!",
    "setupToken": "your_token"
  }'
```

### Problem: "Du har inte behörighet för admin-åtkomst"

**Cause:** User exists but role is not 'admin'

**Solution:**
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'admin@bolagsplatsen.se';
```

### Problem: "Lösenordet måste vara minst 12 tecken långt"

**Solution:** Use a password with 12+ characters

```
✅ Correct: "AdminPass123!@#"
❌ Wrong:   "admin123"
```

---

## 🔄 PASSWORD RESET

### For Admin Users

Admin users can request a password reset. Implement this endpoint:

```typescript
// app/api/admin/reset-password/route.ts
export async function POST(request: NextRequest) {
  const { email } = await request.json()
  
  // Send email with reset link
  // Reset link contains a time-limited token
  // User clicks link → enters new password
}
```

### Manual Reset (For Setup)

```bash
curl -X POST http://localhost:3000/api/admin/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolagsplatsen.se",
    "password": "NewPassword123!",
    "setupToken": "your_token"
  }'
```

---

## 📊 LOGIN FLOW DIAGRAM

```
User visits /admin/login
         ↓
Enters email + password
         ↓
Submit form
         ↓
POST /api/admin/login
         ↓
Verify email & password ← Bcrypt compare
         ↓
Check user is admin
         ↓
Generate JWT token
         ↓
Set HTTP-only cookie
         ↓
Return success
         ↓
Redirect to /admin
         ↓
Admin Dashboard loaded
         ↓
Token verified from cookie
         ↓
All 24 features available ✅
```

---

## 🚀 PRODUCTION DEPLOYMENT CHECKLIST

```
PRE-DEPLOYMENT:
☐ ADMIN_SETUP_TOKEN configured
☐ JWT_SECRET configured
☐ Password hashing enabled
☐ Rate limiting implemented
☐ Admin user created
☐ Password set via /api/admin/set-password
☐ Test login works locally

DEPLOYMENT:
☐ Database migration applied
☐ Environment variables set
☐ HTTPS enabled (required for secure cookies)
☐ Admin login page accessible

POST-DEPLOYMENT:
☐ Test admin login in production
☐ Verify all 24 tabs accessible
☐ Monitor login attempts
☐ Set up password reset mechanism
```

---

## 💡 BEST PRACTICES

### Passwords
- ✅ Use strong, unique passwords (12+ chars)
- ✅ Store passwords securely (hashed with bcrypt)
- ✅ Implement password reset mechanism
- ✅ Require password change on first login

### Security
- ✅ Use HTTPS in production
- ✅ HTTP-only cookies (no JavaScript access)
- ✅ Implement rate limiting on login
- ✅ Log all login attempts
- ✅ Implement 2FA for admin accounts

### Monitoring
- ✅ Track failed login attempts
- ✅ Alert on unusual login patterns
- ✅ Log all admin activities (already implemented! ✅)
- ✅ Regular security audits

---

## 📞 SUPPORT

For issues with admin login:

1. Check that user exists and is admin role
2. Verify password hash is set
3. Ensure credentials are correct
4. Check environment variables
5. Review logs in `/api/admin/audit-trail`

---

## 📚 RELATED DOCUMENTATION

- [ADMIN_LOGIN_GUIDE.md](./ADMIN_LOGIN_GUIDE.md) - Magic link login (alternative)
- [ADMIN_DASHBOARD_COMPLETION.md](./ADMIN_DASHBOARD_COMPLETION.md) - Dashboard features
- [PRODUCTION_READY_GUIDE.md](./PRODUCTION_READY_GUIDE.md) - Production deployment

---

Generated: November 2024
Version: 1.0 - Direct Password Login System

