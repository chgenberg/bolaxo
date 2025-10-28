# 🚀 SUPABASE SETUP GUIDE - Real File Storage

**Gör detta för att aktivera real file storage**

---

## STEG 1: Skapa Supabase Projekt (10 min)

### 1.1 Gå till supabase.com
```
https://supabase.com
```

### 1.2 Skapa nytt projekt
```
1. Click "New project"
2. Välj organization (create if needed)
3. Project name: "bolagsplatsen-sme"
4. Database password: (säker lösenord)
5. Region: eu-west-1 (Sverige)
6. Click "Create new project" (vänta 2-3 min)
```

### 1.3 Kopiera API Keys
```
Settings → API → Project URL & Keys

Kopiera:
- Project URL → NEXT_PUBLIC_SUPABASE_URL
- anon public key → SUPABASE_KEY  
- service_role key → SUPABASE_SERVICE_ROLE_KEY
```

---

## STEG 2: Skapa Storage Bucket (5 min)

### 2.1 Gå till Storage
```
1. Click "Storage" i vänster meny
2. Click "New Bucket"
3. Name: "sme-documents"
4. Uncheck "Private bucket" (public read access)
5. Click "Create bucket"
```

### 2.2 Setup Policies
```
1. Click bucket "sme-documents"
2. Click "Policies" tab
3. Click "New Policy" → "For queries"

Policy 1 - Allow public read:
SELECT: Everyone can read
  ✓ Authenticated users
  ✓ Anonymous users

Policy 2 - Allow authenticated upload:
INSERT: Only authenticated users
  ✓ authenticated (role)
  
Policy 3 - Allow updates:
UPDATE: Only authenticated users
  ✓ authenticated (role)
```

---

## STEG 3: Lägg in API Keys i .env

### 3.1 Skapa .env.local
```bash
cp .env.example .env.local
```

### 3.2 Fyll i Supabase values
```
# From Supabase Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_BUCKET_NAME=sme-documents
```

---

## STEG 4: Installera Supabase SDK

```bash
cd /Users/christophergenberg/Desktop/bolagsportalen

npm install @supabase/supabase-js
```

---

## STEG 5: Testa File Upload

### 5.1 Starta dev server
```bash
npm run dev
```

### 5.2 Testa ekonomi-import
```
1. Besök: http://localhost:3000/salja/sme-kit
2. Klicka "Ekonomi-import"
3. Ladda upp en test Excel-fil
4. Kolla att filen sparas
```

### 5.3 Verifiera i Supabase
```
1. Gå till supabase.com → Storage
2. Öppna "sme-documents" bucket
3. Skulle du se en mapp med listing ID
4. Inuti mappen: din test-fil
```

---

## STEG 6: Verifiera File URL

### 6.1 Efter upload, kopiera file URL från response
```
Går till: https://xxxxx.supabase.co/storage/v1/object/public/sme-documents/[listingId]/[filename]
```

### 6.2 Testa länken
```
1. Öppna URL i ny flik
2. Filen bör visas
```

---

## 🧪 TROUBLESHOOTING

### Problem: "SUPABASE_KEY is undefined"
**Solution:**
```
1. Verifiera .env.local är skapad
2. Verifiera rätt värden är inlagda
3. Restart dev server: Ctrl+C, npm run dev
```

### Problem: "403 Forbidden"
**Solution:**
```
1. Bucket policies inte rätt satta
2. Gå till Storage → Policies
3. Verifiera "Everyone can read" är på
```

### Problem: "Bucket not found"
**Solution:**
```
1. Skapa bucket igen
2. Namn: exakt "sme-documents"
3. Uncheck "Private bucket"
```

### Problem: "File upload slow"
**Solution:**
```
1. Normal - första upload är långsam
2. Supabase köar fileupload
3. Vänta 5-10 sekunder
```

---

## ✅ VERIFIKATION CHECKLIST

- [ ] Supabase projekt skapat
- [ ] API keys kopierade
- [ ] Bucket "sme-documents" skapad
- [ ] Policies satta
- [ ] .env.local fylld
- [ ] npm install @supabase/supabase-js körda
- [ ] Dev server restartat
- [ ] Test-fil uppladdad
- [ ] Fil visas i Supabase
- [ ] File URL fungerar

---

## 🎉 NÄSTA STEG

När file storage fungerar, fortsätt med:

1. **Email Integration** (tisdag)
2. **Excel Parser** (onsdag)
3. **Error Monitoring** (torsdag)

---

## 📞 SUPPORT

Supabase dokumentation: https://supabase.com/docs/guides/storage

