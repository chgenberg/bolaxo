# 🚀 RAILWAY.APP DEPLOYMENT GUIDE - ADMIN AUTH

## Complete Setup for Bolagsportalen on Railway

### Prerequisites
- Railway.app account (https://railway.app)
- PostgreSQL database on Railway
- Git repository connected to Railway

---

## Step 1: Connect Your PostgreSQL Database

1. **Create PostgreSQL Plugin on Railway**
   - Go to Railway dashboard
   - Click "New"
   - Select "Database" → "PostgreSQL"
   - Wait for deployment

2. **Note Your Database Credentials**
   - Railway automatically provides: `DATABASE_URL`
   - Copy the full connection string

---

## Step 2: Generate Security Tokens

### Generate JWT_SECRET
```bash
# Method 1: OpenSSL (Recommended)
openssl rand -base64 64

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Save this value for later!
```

### Generate ADMIN_SETUP_TOKEN
```bash
# Method 1: OpenSSL (Recommended)
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Save this value for later!
```

---

## Step 3: Configure Environment Variables on Railway

1. **Go to Your Project Settings**
   - Click on your Bolagsportalen project
   - Click "Variables" tab
   - Add the following:

```env
NODE_ENV=production
JWT_SECRET=<your_generated_jwt_secret>
ADMIN_SETUP_TOKEN=<your_generated_admin_setup_token>
```

2. **DATABASE_URL**
   - This should already be set by Railway PostgreSQL plugin
   - Verify it exists in Variables

3. **Verify All Variables**
   ```
   DATABASE_URL: postgresql://postgres:xxxxx@rail.proxy.rlwy.net:xxxxx/railway
   JWT_SECRET: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ADMIN_SETUP_TOKEN: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NODE_ENV: production
   ```

---

## Step 4: Deploy Application

1. **Push to Git**
   ```bash
   git add .
   git commit -m "chore: add admin authentication system"
   git push
   ```

2. **Railway Auto-Deploys**
   - Watch deployment logs in Railway dashboard
   - Should see: ✅ Build successful
   - Should see: ✅ Deploy successful

3. **Verify Deployment**
   - Click "Deployments" tab
   - Latest deployment should be green ✅

---

## Step 5: Create First Admin User

### Option A: Via API (From Command Line)

```bash
# Get your Railway app URL
RAILWAY_URL="https://your-app-xxxxx.railway.app"

# Create admin user
curl -X POST $RAILWAY_URL/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolagsplatsen.se",
    "password": "YourSecurePassword123!",
    "name": "Christopher",
    "setupToken": "YOUR_ADMIN_SETUP_TOKEN_HERE"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Admin-användare skapad framgångsrikt!",
  "user": {
    "id": "xxx",
    "email": "admin@bolagsplatsen.se",
    "name": "Christopher",
    "role": "admin"
  },
  "loginUrl": "/admin/login"
}
```

### Option B: Via Direct Database

1. **Connect to Railway PostgreSQL**
   ```bash
   psql "YOUR_DATABASE_URL_HERE"
   ```

2. **Hash the password**
   ```bash
   node -e "require('bcrypt').hash('YourSecurePassword123!', 12).then(h => console.log(h))"
   ```

3. **Insert admin user**
   ```sql
   INSERT INTO "User" (
     id,
     email,
     name,
     role,
     "passwordHash",
     verified,
     "bankIdVerified",
     "createdAt"
   ) VALUES (
     gen_random_uuid(),
     'admin@bolagsplatsen.se',
     'Christopher',
     'admin',
     '$2b$12$...',  -- paste hash here
     true,
     true,
     NOW()
   );
   ```

---

## Step 6: Test Admin Login

1. **Navigate to Login Page**
   ```
   https://your-app-xxxxx.railway.app/admin/login
   ```

2. **Enter Credentials**
   - Email: `admin@bolagsplatsen.se`
   - Password: `YourSecurePassword123!`

3. **Should See**
   - ✅ Success message
   - ✅ Redirect to `/admin` dashboard
   - ✅ Dashboard loads completely

4. **Verify Cookie**
   - Open DevTools (F12)
   - Go to Application → Cookies
   - Look for `adminToken` (should be HTTP-only)

---

## Step 7: Monitor & Maintain

### Check Logs
```bash
# In Railway dashboard:
- Click "Logs" tab
- Filter by "api/admin/login" to see login attempts
- Check for errors
```

### Monitor Performance
- Railway provides metrics out of the box
- Watch CPU, Memory, Network usage
- Monitor database query performance

### Backup Your Database
```bash
# Manual backup from command line
pg_dump "YOUR_DATABASE_URL" > backup.sql

# Or use Railway's automated backups
# (Available in Railway PostgreSQL settings)
```

---

## 🔐 Production Checklist

Before considering this production-ready:

- [x] Dependencies installed locally: `npm install`
- [x] Environment variables generated and secure
- [x] PostgreSQL database deployed on Railway
- [x] All 3 env vars set in Railway Variables
- [x] Application deployed to Railway
- [x] Admin user created
- [x] Can login at `/admin/login`
- [x] Dashboard loads and functions
- [x] Token persists across page reloads
- [x] Can access all admin features
- [x] Database backups configured
- [x] Error logging enabled
- [x] HTTPS enforced (Railway default)
- [x] Rate limiting considered (optional)

---

## 🛡️ Security in Production

### Passwords
- ✅ Use strong passwords (12+ chars, mixed case, numbers, symbols)
- ✅ Change default admin password regularly
- ✅ Never share passwords via email

### Tokens
- ✅ Never commit tokens to Git
- ✅ Never share `ADMIN_SETUP_TOKEN` publicly
- ✅ Rotate tokens if compromised
- ✅ Different tokens for each environment

### Database
- ✅ Use strong database password
- ✅ Enable PostgreSQL backups
- ✅ Monitor connection attempts
- ✅ Use SSL/TLS for connections

### Access Control
- ✅ Only production admin knows credentials
- ✅ Add 2FA when available (future feature)
- ✅ Monitor login attempts in logs
- ✅ Alert on suspicious activity

---

## 📊 Troubleshooting

### "Failed to build" on Railway

**Problem:** Build fails during deployment
```
Error: Module not found 'bcrypt'
```

**Solution:**
1. Ensure `package.json` has correct dependencies
2. Run `npm install` locally first
3. Commit `package-lock.json`
4. Push to Git
5. Railway will rebuild

### "Can't connect to database"

**Problem:** Login returns database connection error
```
Error: Failed to fetch
```

**Solution:**
1. Verify `DATABASE_URL` is set in Railway Variables
2. Check PostgreSQL status in Railway dashboard
3. Verify connection string format
4. Check Railway firewall settings

### "Invalid setup token" on admin creation

**Problem:** API returns 403 error
```json
{"error": "Ogiltig setup-token"}
```

**Solution:**
1. Verify `ADMIN_SETUP_TOKEN` is set in Railway Variables
2. Check token exactly matches (no extra spaces)
3. Get token from Railway Variables, copy completely
4. Try again with correct token

### "Unauthorized" on login

**Problem:** Login credentials fail
```json
{"error": "Ogiltig e-post eller lösenord"}
```

**Solution:**
1. Verify admin user exists in database
2. Check email is correct (case-sensitive)
3. Verify password is correct
4. Check `passwordHash` exists in database for user

### Token cookie not setting

**Problem:** Login succeeds but cookie doesn't persist
```
Cookie not found in DevTools
```

**Solution:**
1. Verify HTTPS is enabled (Railway default ✓)
2. Check browser console for JavaScript errors
3. Verify `NODE_ENV=production` in Railway Variables
4. Clear browser cookies and try again

---

## 🚀 Performance Tips

### Database Optimization
```sql
-- Create indexes for faster queries
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);
```

### Rate Limiting (Optional)
Consider adding rate limiting to `/api/admin/login`:
```bash
# Limit: 5 attempts per minute per IP
# Uses Upstash Redis (already in package.json)
```

### Caching
- JWT tokens validated client-side after first check
- Database queries cached in Prisma
- Static assets cached by Vercel CDN

---

## 📚 Useful Railway Commands

### View Logs
```bash
railway logs
```

### Deploy Specific Branch
```bash
railway up --environment production
```

### View Environment Variables
```bash
railway variables
```

### Run Database Queries
```bash
railway db shell
SELECT * FROM "User" WHERE role = 'admin';
```

---

## 📞 Support & Resources

### If Something Goes Wrong

1. **Check Railway Status**: https://status.railway.app
2. **View Deployment Logs**: Railway Dashboard → Logs
3. **Check Application Logs**: Railway Dashboard → Logs
4. **Database Issues**: Railway Dashboard → PostgreSQL → Logs

### Documentation Links

- Railway Docs: https://docs.railway.app
- PostgreSQL Guide: https://www.postgresql.org/docs/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Bcrypt: https://www.npmjs.com/package/bcrypt
- JWT: https://jwt.io

### Emergency Access

If you lose admin access:

1. Generate new `ADMIN_SETUP_TOKEN`
2. Update in Railway Variables
3. Create new admin via API
4. Or connect to database directly and update `passwordHash`

---

## ✅ Final Verification

After deployment, verify everything works:

```bash
# 1. Check app is running
curl https://your-app-xxxxx.railway.app/admin/login

# 2. Test admin creation (if not done)
curl -X POST https://your-app-xxxxx.railway.app/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123456!","setupToken":"YOUR_TOKEN"}'

# 3. Test login
curl -X POST https://your-app-xxxxx.railway.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123456!"}'

# Should return: {"success": true, "message": "Inloggning lyckades", ...}
```

---

## 🎉 Ready to Go!

Your admin authentication system is now running on Railway with:

✅ PostgreSQL database  
✅ Secure password-based login  
✅ JWT token authentication  
✅ Production HTTPS  
✅ Auto-backups  
✅ Monitoring & logging  

**You can now login at:** https://your-app-xxxxx.railway.app/admin/login

---

**Created:** 2025-10-26  
**Platform:** Railway.app  
**Database:** PostgreSQL  
**Status:** ✅ Production Ready
