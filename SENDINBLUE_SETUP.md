# 📧 SENDINBLUE (BREVO) SETUP GUIDE

**Datum:** 2025-10-29  
**Status:** ✅ Kod implementerad - Behöver API Key

---

## ✅ VAD SOM ÄR KLART

- ✅ Email utility skapad (`lib/email.ts`)
- ✅ Magic link email funktion implementerad
- ✅ LOI notification emails (för senare)
- ✅ LOI approval emails (för senare)
- ✅ Uppdaterad magic link route för att använda Sendinblue

---

## 🔧 NÄSTA STEG: SÄTT UPP SENDINBLUE

### Steg 1: Skapa Sendinblue-konto

1. Gå till: **https://www.brevo.com** (tidigare Sendinblue)
2. Klicka på **"Sign up free"**
3. Fyll i:
   - Email
   - Lösenord
   - Company name: **BOLAXO**
4. Verifiera din email

### Steg 2: Hämta API Key

1. Efter inloggning, gå till: **Settings** → **SMTP & API**
2. Klicka på fliken **"API Keys"**
3. Klicka på **"Generate a new API key"**
4. Ge den ett namn: `BOLAXO Production`
5. Kopiera API Key (den visas bara en gång!)

### Steg 3: Lägg till i Railway Variables

1. Gå till Railway Dashboard → Ditt projekt
2. Klicka på **Variables** tab
3. Klicka på **"+ New Variable"**
4. Lägg till:
   - **Name:** `BREVO_API_KEY`
   - **Value:** `din-api-key-här` (klistra in API Key från Sendinblue)
5. Klicka **"Add"**

### Steg 4: Verifiera sender domain (Viktigt!)

För att kunna skicka från `noreply@bolaxo.com`:

1. I Sendinblue Dashboard, gå till **Settings** → **Senders & IP**
2. Klicka på **"Add a domain"**
3. Ange: `bolaxo.com`
4. Lägg till DNS-poster som Sendinblue begär:
   - SPF record
   - DKIM record
   - DMARC record (optional)
5. Verifiera domänen

**OBS:** Tills domänen är verifierad kan du använda Sendinblue's test-email: `noreply@sendinblue.com`

### Steg 5: Testa!

1. Vänta på Railway deployment (2-5 min)
2. Testa magic link:
   - Gå till `/login`
   - Ange din email
   - Kolla inkorgen för magic link!

---

## 📋 ENVIRONMENT VARIABLES I RAILWAY

Lägg till dessa i Railway Variables:

```env
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**OBS:** Byt ut `xkeysib-...` med din riktiga API Key från Sendinblue!

---

## 🔍 VERIFYING EMAIL WORKS

Efter du lagt till API Key:

1. **Testa magic link:**
   - Gå till `https://bolaxo.com/login`
   - Ange din email
   - Kolla inkorgen!

2. **Kolla Railway Logs:**
   - Gå till Railway Dashboard → Logs
   - Leta efter "Email send" eller felmeddelanden

3. **Kolla Sendinblue Dashboard:**
   - Gå till **Statistics** → **Campaigns**
   - Du bör se emails som skickats

---

## 🚨 VANLIGA PROBLEM

### Problem: "Email service not configured"
**Lösning:** Lägg till `BREVO_API_KEY` i Railway Variables

### Problem: "Invalid API key"
**Lösning:** 
- Verifiera att API Key är korrekt kopierad
- Se till att du kopierade hela key (börjar med `xkeysib-`)
- Kolla att det inte finns extra mellanslag

### Problem: "Sender not verified"
**Lösning:**
- Använd `noreply@sendinblue.com` temporärt
- Eller verifiera `bolaxo.com` domain i Sendinblue

### Problem: "Email not received"
**Lösning:**
- Kolla spam-mappen
- Verifiera att email-adressen är korrekt
- Kolla Sendinblue Dashboard → Statistics för att se om email skickades

---

## ✅ STATUS

- ✅ Kod implementerad
- ⏳ API Key behöver läggas till i Railway
- ⏳ Domain verification (för `noreply@bolaxo.com`)

---

**Nästa steg:** Följ "NÄSTA STEG" ovan för att sätta upp API Key!

