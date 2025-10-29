# ✅ VERIFIERA BOLAXO.COM DOMÄN HOS BREVO

**Datum:** 2025-10-29  
**Syfte:** Verifiera `bolaxo.com` så att emails kan skickas från `noreply@bolaxo.com`

---

## 🎯 VARFÖR VERIFIERA DOMÄN?

**Fördelar:**
- ✅ Emails kommer från din egen domän (`noreply@bolaxo.com`)
- ✅ Mindre risk att hamna i spam
- ✅ Ser mer professionellt ut
- ✅ Bättre email deliverability

**Utan verifiering:**
- ⚠️ Måste använda `noreply@sendinblue.com`
- ⚠️ Högre risk för spam
- ⚠️ Mindre professionellt

---

## 📋 STEG-FÖR-STEG: VERIFIERA DOMÄN

### Steg 1: Logga in på Brevo

1. Gå till: **https://app.brevo.com**
2. Logga in med ditt konto

### Steg 2: Gå till Senders & IP

1. I Brevo Dashboard, klicka på **"Settings"** (kugghjuls-ikonen)
2. I vänstermenyn, klicka på **"Senders & IP"**
3. Eller gå direkt till: **Settings** → **Senders & IP**

### Steg 3: Lägg till Domain

1. Klicka på tabben **"Domains"** (eller "Sender domains")
2. Klicka på **"Add a domain"** eller **"+ Add Domain"**
3. Ange din domän: `bolaxo.com`
4. Klicka **"Add"** eller **"Verify"**

### Steg 4: Lägg till DNS-poster i One.com

Brevo kommer visa **3 DNS-poster** som du måste lägga till i One.com:

#### Post 1: SPF Record
- **Type:** `TXT`
- **Name/Host:** `@` eller `bolaxo.com` (root domain)
- **Value:** `v=spf1 include:spf.brevo.com ~all`

#### Post 2: DKIM Record
- **Type:** `TXT`
- **Name/Host:** `brevo._domainkey` eller `brevo._domainkey.bolaxo.com`
- **Value:** (lång text som Brevo genererar - kopiera hela)

#### Post 3: DMARC Record (Optional men rekommenderas)
- **Type:** `TXT`
- **Name/Host:** `_dmarc` eller `_dmarc.bolaxo.com`
- **Value:** `v=DMARC1; p=none; rua=mailto:dmarc@bolaxo.com`

---

## 🔧 SÅ HÄR LÄGGER DU TILL DNS-POSTER I ONE.COM

### Steg 1: Gå till DNS-inställningar i One.com

1. Logga in på: **https://one.com**
2. Välj domän: **bolaxo.com**
3. Gå till: **DNS-inställningar** eller **DNS Settings**

### Steg 2: Lägg till SPF Record

1. Klicka på **"+ Lägg till post"** eller **"+ Add Record"**
2. Välj typ: **TXT**
3. Fyll i:
   - **Namn/Host:** `@` (eller lämna tomt för root domain)
   - **Värd/Value:** `v=spf1 include:spf.brevo.com ~all`
4. Spara

**OBS:** Om One.com inte tillåter `@` för root domain, använd `bolaxo.com` istället.

### Steg 3: Lägg till DKIM Record

1. Klicka på **"+ Lägg till post"** igen
2. Välj typ: **TXT**
3. Fyll i:
   - **Namn/Host:** `brevo._domainkey` (eller `brevo._domainkey.bolaxo.com`)
   - **Värd/Value:** (klistra in värdet från Brevo - det är en lång text)
4. Spara

**OBS:** Kopiera EXAKT värdet från Brevo - det är unikt för din domän!

### Steg 4: Lägg till DMARC Record (Optional)

1. Klicka på **"+ Lägg till post"** igen
2. Välj typ: **TXT**
3. Fyll i:
   - **Namn/Host:** `_dmarc` (eller `_dmarc.bolaxo.com`)
   - **Värd/Value:** `v=DMARC1; p=none; rua=mailto:dmarc@bolaxo.com`
4. Spara

---

## ⏳ VÄNTA PÅ DNS-SPRIDNING

Efter du lagt till DNS-poster:

1. **DNS kan ta 10 minuter - 24 timmar** att sprida
2. **Vanligtvis:** 15-30 minuter
3. **Brevo verifierar automatiskt** när DNS är klar

### Verifiera DNS-spridning:

Du kan testa om DNS-poster är aktiva:

```bash
# Testa SPF (i terminal)
dig TXT bolaxo.com | grep spf

# Testa DKIM
dig TXT brevo._domainkey.bolaxo.com | grep brevo

# Testa DMARC
dig TXT _dmarc.bolaxo.com | grep DMARC
```

---

## ✅ VERIFIERA I BREVO

### Steg 1: Kolla Status i Brevo

1. Gå tillbaka till Brevo Dashboard → **Senders & IP** → **Domains**
2. Du ser status för `bolaxo.com`:
   - ⏳ **Pending** - DNS sprids fortfarande
   - ✅ **Verified** - Domänen är verifierad!
   - ❌ **Failed** - Något är fel med DNS-poster

### Steg 2: Verifiera Manuellt (om behövs)

1. I Brevo Dashboard, klicka på **"Verify"** eller **"Check status"**
2. Brevo testar DNS-poster automatiskt
3. Om något är fel, visas vilken post som saknas

---

## 🔄 EFTER VERIFIERING

### Steg 1: Uppdatera Email Sender

När domänen är verifierad kan du ändra sender email:

**Uppdatera `lib/email.ts`:**
```typescript
email: options.from || 'noreply@bolaxo.com', // Ändra från sendinblue.com
```

### Steg 2: Testa Email

1. Vänta på Railway deployment (2-5 min)
2. Testa magic link
3. Kolla att email kommer från `noreply@bolaxo.com`

---

## 🚨 VANLIGA PROBLEM

### Problem 1: "Domain not verified"

**Orsak:** DNS-poster har inte spridits ännu

**Lösning:**
- Vänta 15-30 minuter
- Testa DNS med `dig` kommandot ovan
- Verifiera att DNS-poster är korrekt kopierade i One.com

### Problem 2: "SPF record not found"

**Lösning:**
- Kontrollera att SPF-post är lagd i One.com
- Se till att värdet är EXAKT: `v=spf1 include:spf.brevo.com ~all`
- Om One.com inte tillåter `@`, använd `bolaxo.com` som namn

### Problem 3: "DKIM record not found"

**Lösning:**
- Kontrollera att DKIM-post är lagd
- Se till att namn är EXAKT: `brevo._domainkey` (eller `brevo._domainkey.bolaxo.com`)
- Kopiera EXAKT värdet från Brevo (det är unikt för din domän)

### Problem 4: "DNS propagation taking too long"

**Lösning:**
- Vänta upp till 24 timmar (vanligtvis 15-30 min)
- Använd `dig` kommandot för att verifiera DNS lokalt
- Om DNS är korrekt men Brevo inte verifierar: Kontakta Brevo support

---

## 📋 CHECKLIST

- [ ] Loggat in på Brevo Dashboard
- [ ] Gått till Settings → Senders & IP → Domains
- [ ] Lagt till `bolaxo.com` domain
- [ ] Kopierat SPF, DKIM och DMARC värden från Brevo
- [ ] Lagt till SPF TXT-post i One.com
- [ ] Lagt till DKIM TXT-post i One.com
- [ ] Lagt till DMARC TXT-post i One.com (optional)
- [ ] Väntat 15-30 minuter på DNS-spridning
- [ ] Verifierat domänen i Brevo (status: ✅ Verified)
- [ ] Uppdaterat `lib/email.ts` för att använda `noreply@bolaxo.com`

---

## 🎯 NÄSTA STEG EFTER VERIFIERING

1. ✅ Domänen är verifierad i Brevo
2. Uppdatera `lib/email.ts` för att använda `noreply@bolaxo.com`
3. Commit och push till GitHub
4. Vänta på Railway deployment
5. Testa magic link - email ska nu komma från `noreply@bolaxo.com`!

---

**Status:** 🟡 Väntar på att du lägger till DNS-poster i One.com

Säg till när du har lagt till DNS-poster så kan jag hjälpa dig verifiera domänen!

