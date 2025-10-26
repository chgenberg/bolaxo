# 🔐 GUIDE TO GENERATING SECRET TOKENS

## QUICK START - 3 WAYS

### Method 1: OpenSSL (Easiest - macOS/Linux)
```bash
openssl rand -hex 32
# Output: a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5
```

✅ Copy that long string and use it!

---

### Method 2: Node.js (If you have Node installed)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: 8f3c2a1e9d7b5f3c1a9e7d5b3f1c9a7e5d3b1f9e7c5a3b1d9f7e5c3a1b9d7f
```

✅ Copy that string!

---

### Method 3: Online Generator (Quickest)
Go to: https://generate-random.org/encryption-key-generator

- Select "Key Size": 256 bits
- Select "Output Format": Hexadecimal
- Click "Generate"
- Copy the result

---

## 🎯 WHAT YOU NEED

### Token Types & Usage

| Token | Size | Where | Example |
|-------|------|-------|---------|
| ADMIN_SETUP_TOKEN | 32+ chars | .env.production | `a1f4e2c9d8b3f1e7a...` |
| JWT_SECRET | 32+ chars | .env.production | `8f3c2a1e9d7b5f3c1a...` |
| Database Password | 16+ chars | Database setup | Specific format |

---

## ✨ RECOMMENDED: Using Docker/OpenSSL

### For macOS/Linux:

```bash
# Generate ADMIN_SETUP_TOKEN
openssl rand -hex 32

# Generate JWT_SECRET
openssl rand -hex 32

# Generate Database password
openssl rand -base64 16
```

### For Windows (PowerShell):

```powershell
# Generate ADMIN_SETUP_TOKEN
[Convert]::ToHexString((Get-Random -InputObject (0..255) -Count 32))

# Or use a simpler method:
# Just go to: https://generate-random.org/encryption-key-generator
```

---

## 🚀 PRODUCTION SETUP - COMPLETE EXAMPLE

### Step 1: Generate All Tokens

```bash
# Terminal/PowerShell

# Generate ADMIN_SETUP_TOKEN (32 hex chars = 64 character string)
ADMIN_TOKEN=$(openssl rand -hex 32)
echo "ADMIN_SETUP_TOKEN=$ADMIN_TOKEN"

# Generate JWT_SECRET
JWT_TOKEN=$(openssl rand -hex 32)
echo "JWT_SECRET=$JWT_TOKEN"

# Output example:
# ADMIN_SETUP_TOKEN=a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5
# JWT_SECRET=8f3c2a1e9d7b5f3c1a9e7d5b3f1c9a7e5d3b1f9e7c5a3b1d9f7e5c3a1b9d7f
```

### Step 2: Add to `.env.production`

```bash
# Admin Authentication
ADMIN_SETUP_TOKEN=a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5
JWT_SECRET=8f3c2a1e9d7b5f3c1a9e7d5b3f1c9a7e5d3b1f9e7c5a3b1d9f7e5c3a1b9d7f

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Server
NODE_ENV=production
```

### Step 3: Store Securely

✅ Add to `.gitignore` (already done):
```bash
.env.production
.env.production.local
```

✅ Store in password manager:
```
Service: Bolagsplatsen Production
Admin Token: a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5
JWT Secret: 8f3c2a1e9d7b5f3c1a9e7d5b3f1c9a7e5d3b1f9e7c5a3b1d9f7e5c3a1b9d7f
```

---

## 🔒 SECURITY CHECKLIST

### When Generating Tokens:
- ✅ Use cryptographically secure random generation
- ✅ Minimum 32 characters (256 bits)
- ✅ Never use simple/guessable values
- ✅ Never hardcode in source code
- ✅ Never share in email/chat
- ✅ Never commit to git
- ✅ Store in `.env.production` only
- ✅ Rotate periodically (every 3-6 months)

### Example of BAD tokens (DON'T USE):
```
❌ admin123
❌ password
❌ secret
❌ 12345678
❌ bolagsplatsen123
❌ Any easily guessable string
```

### Example of GOOD tokens (USE THESE):
```
✅ a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5
✅ 8f3c2a1e9d7b5f3c1a9e7d5b3f1c9a7e5d3b1f9e7c5a3b1d9f7e5c3a1b9d7f
✅ f7e5d3c1b9a7f5e3d1c9b7a5f3e1d9c7b5a3f1e9d7c5b3a1f9e7d5c3b1a9f7
```

---

## 📋 STEP-BY-STEP FOR PRODUCTION

### On Your Local Machine:

```bash
# 1. Generate tokens
ADMIN_TOKEN=$(openssl rand -hex 32)
JWT_TOKEN=$(openssl rand -hex 32)

# 2. Show them (copy these!)
echo "Admin Setup Token:"
echo $ADMIN_TOKEN
echo ""
echo "JWT Secret:"
echo $JWT_TOKEN

# 3. Output example:
# Admin Setup Token:
# a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5
#
# JWT Secret:
# 8f3c2a1e9d7b5f3c1a9e7d5b3f1c9a7e5d3b1f9e7c5a3b1d9f7e5c3a1b9d7f
```

### On Your Server:

```bash
# 1. SSH into production server
ssh user@production-server.com

# 2. Edit .env file
nano .env.production

# 3. Add the tokens:
ADMIN_SETUP_TOKEN=a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5
JWT_SECRET=8f3c2a1e9d7b5f3c1a9e7d5b3f1c9a7e5d3b1f9e7c5a3b1d9f7e5c3a1b9d7f

# 4. Save (Ctrl+X, then Y, then Enter)

# 5. Restart app
npm run build && npm run start
```

---

## 🛠️ VERIFICATION

### Check if tokens are loaded:

```bash
# On your server, run:
node -e "console.log('ADMIN_TOKEN:', process.env.ADMIN_SETUP_TOKEN?.substring(0, 10) + '...')"
node -e "console.log('JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 10) + '...')"

# Should output:
# ADMIN_TOKEN: a1f4e2c9d8...
# JWT_SECRET: 8f3c2a1e9d...
```

---

## 🔄 TOKEN ROTATION (Every 3-6 Months)

### Step 1: Generate New Token
```bash
openssl rand -hex 32
```

### Step 2: Update .env.production
```bash
ADMIN_SETUP_TOKEN=new_token_here
```

### Step 3: Restart Application
```bash
npm run build && npm run start
```

### Step 4: Old tokens become invalid ✅

---

## 💾 PASSWORD MANAGER SETUP

### Recommended: Use 1Password, LastPass, or Bitwarden

Store this info:
```
Website/Service: bolagsplatsen.se (Production)
Username: admin@bolagsplatsen.se
Password: [Save the actual admin password]
Notes:
  - Admin Setup Token: a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5...
  - JWT Secret: 8f3c2a1e9d7b5f3c1a9e7d5b3f1c9a7e5d3...
  - Last rotated: 2024-11-26
```

---

## 🚨 IF TOKEN IS COMPROMISED

### Immediate Action:
```bash
# 1. Generate new token immediately
openssl rand -hex 32

# 2. Update .env.production with new token
ADMIN_SETUP_TOKEN=new_generated_token

# 3. Restart app
npm run start

# 4. Update password manager

# 5. Notify team members
```

---

## 📚 RELATED SETUP

### 1. Create Admin User
```bash
curl -X POST http://localhost:3000/api/admin/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bolagsplatsen.se",
    "password": "StrongPassword123!",
    "setupToken": "a1f4e2c9d8b3f1e7a9c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5"
  }'
```

### 2. Test Login
```
Go to: https://bolagsplatsen.se/admin/login
Email: admin@bolagsplatsen.se
Password: StrongPassword123!
```

---

## ✅ PRODUCTION CHECKLIST

- [ ] Tokens generated using secure method
- [ ] Tokens are 32+ characters (64+ hex chars)
- [ ] Tokens added to .env.production
- [ ] .env.production in .gitignore
- [ ] Tokens stored in password manager
- [ ] Tokens NOT committed to git
- [ ] Tokens NOT shared in emails/chat
- [ ] Admin user created
- [ ] Admin password set
- [ ] Login tested and working
- [ ] Rate limiting enabled
- [ ] HTTPS enabled
- [ ] Audit logging active

---

## 🎯 FINAL COMMAND - ONE LINER

Copy and paste this to generate everything at once:

```bash
echo "ADMIN_SETUP_TOKEN=$(openssl rand -hex 32)" && echo "JWT_SECRET=$(openssl rand -hex 32)"
```

Save the output! 🎉

---

Generated: November 2024
Version: 1.0
