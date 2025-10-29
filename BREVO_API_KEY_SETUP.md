# 🔧 SENDINBLUE (BREVO) API KEY SETUP - STEG-FÖR-STEG

**Datum:** 2025-10-29  
**Status:** ✅ Du ser SMTP-inställningar, men vi behöver API Key istället

---

## ⚠️ VIKTIGT: Vi använder API, INTE SMTP!

Du ser SMTP-inställningar, men vår kod använder **Brevo API** (enklare och bättre för Next.js).

---

## 📋 STEG-FÖR-STEG: HÄMTA API KEY

### Steg 1: Gå till API Settings

1. I Brevo Dashboard, klicka på tabben **"API Settings"** (bredvid "SMTP settings")
2. Eller gå direkt till: **Settings** → **SMTP & API** → **API Keys**

### Steg 2: Skapa API Key

1. Du ser en lista med befintliga API Keys (eller tom lista om inga finns)
2. Klicka på **"Generate a new API key"** eller **"Create API Key"**
3. Ge den ett namn: `BOLAXO Production`
4. Välj permissions: **"Send emails"** (eller alla permissions)
5. Klicka **"Generate"** eller **"Create"**

### Steg 3: Kopiera API Key

1. **VIKTIGT:** API Key visas bara EN gång!
2. Kopiera hela key (börjar ofta med `xkeysib-...`)
3. Spara den säkert (du kan inte se den igen!)

**Exempel på vad API Key ser ut som:**
```
xkeysib-1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## 🔧 STEG 4: LÄGG TILL I RAILWAY

1. **Gå till Railway Dashboard:**
   - Öppna: https://railway.app
   - Logga in
   - Välj ditt projekt (bolaxo)

2. **Gå till Variables:**
   - Klicka på tabben **"Variables"** i projektet
   - Eller gå till: Project → Settings → Variables

3. **Lägg till API Key:**
   - Klicka på **"+ New Variable"**
   - **Name:** `BREVO_API_KEY`
   - **Value:** Klistra in din API Key här
   - Klicka **"Add"**

4. **Verifiera:**
   - Du bör nu se `BREVO_API_KEY` i listan
   - Värdet är maskerat (visas som `••••••••`)

---

## ✅ STEG 5: TESTA

Efter du lagt till API Key:

1. **Vänta på Railway deployment** (2-5 minuter)
   - Railway startar om applikationen automatiskt
   - Du kan se deployment i Railway Dashboard → Deployments

2. **Testa magic link:**
   - Gå till `https://bolaxo.com/login` (eller `https://www.bolaxo.com/login`)
   - Ange din email
   - Kolla din inkorg för magic link!

3. **Kolla Railway Logs:**
   - Gå till Railway Dashboard → Logs
   - Leta efter "Email send" eller eventuella felmeddelanden

---

## 🚨 VANLIGA PROBLEM

### Problem: "API Key not found"
**Lösning:** 
- Verifiera att du kopierade hela API Key
- Kolla att det inte finns extra mellanslag
- Se till att du använder API Key, inte SMTP password

### Problem: "Cannot find API Settings tab"
**Lösning:**
- Gå till: Settings → SMTP & API → API Keys
- Eller: https://app.brevo.com/settings/keys/api

### Problem: "Email not received"
**Lösning:**
- Kolla spam-mappen
- Verifiera att email-adressen är korrekt
- Kolla Brevo Dashboard → Statistics → Transactional emails
- Kolla Railway Logs för felmeddelanden

---

## 📝 SAMMANFATTNING

**Du behöver:**
1. ✅ API Key från Brevo (inte SMTP credentials)
2. ✅ Lägg till `BREVO_API_KEY` i Railway Variables
3. ✅ Vänta på deployment
4. ✅ Testa magic link!

**Du behöver INTE:**
- ❌ SMTP server
- ❌ SMTP port
- ❌ SMTP login/password

---

## 🎯 NÄSTA STEG

1. **Hämta API Key** från Brevo (se Steg 1-3 ovan)
2. **Lägg till i Railway** (se Steg 4 ovan)
3. **Testa** (se Steg 5 ovan)

När du har lagt till API Key i Railway är du klar! Emails kommer börja fungera automatiskt efter deployment.

---

**Hjälp behövs?** Kolla Railway Logs om emails inte fungerar, eller kolla Brevo Dashboard → Statistics för att se om emails skickas.

