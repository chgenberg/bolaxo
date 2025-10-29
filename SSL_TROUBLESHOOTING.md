# 🔒 BOLAXO.COM SSL-FELSÖKNING

**Problem:** Safari kan inte upprätta säker förbindelse till bolaxo.com

---

## 🔍 VANLIGASTE ORSAKER

### 1. Railway Custom Domain inte konfigurerad
Railway måste ha custom domain registrerad för att generera SSL-certifikat.

**Fix:**
1. Gå till Railway Dashboard → ditt projekt
2. Settings → Custom Domains
3. Lägg till: `bolaxo.com` och `www.bolaxo.com`
4. Vänta 5-15 minuter för SSL-certifikat att genereras

### 2. DNS-spridning inte klar
DNS kan ta upp till 24 timmar att sprida globalt.

**Verifiera:**
```bash
# Testa DNS
nslookup bolaxo.com
# Bör visa Railway IP-adress

# Testa HTTPS direkt
curl -I https://bolaxo.com
```

### 3. Railway har inte genererat SSL-certifikat ännu
Efter att custom domain läggs till tar det 5-15 minuter för Let's Encrypt att generera certifikat.

**Vänta:** 5-15 minuter efter att custom domain lagts till

---

## ✅ LÖSNING: STEG-FÖR-STEG

### Steg 1: Verifiera Custom Domain i Railway

1. Gå till: https://railway.app → ditt projekt
2. Klicka på **Settings** → **Custom Domains**
3. Se om `bolaxo.com` och `www.bolaxo.com` finns där
4. Om inte → Klicka **"+ Add"** och lägg till båda

### Steg 2: Verifiera DNS i One.com

1. Logga in på one.com
2. Gå till DNS-inställningar
3. Verifiera att CNAME finns:
   - `www` → `bolaxo-production.up.railway.app`
4. Verifiera att Web-forward finns:
   - `bolaxo.com` → `https://bolaxo-production.up.railway.app`

### Steg 3: Vänta på SSL-certifikat

- Railway genererar automatiskt SSL-certifikat via Let's Encrypt
- Detta tar **5-15 minuter** efter att custom domain lagts till
- Du kan kolla Railway Logs för SSL-status

### Steg 4: Testa igen

```bash
# Testa efter 10-15 minuter
curl -I https://bolaxo.com
# Bör returnera HTTP 200

# Eller öppna i browser
open https://bolaxo.com
```

---

## 🚨 ALTERNATIV LÖSNING

Om SSL fortfarande inte fungerar efter 30 minuter:

### Temporary Fix: Använd Railway URL
Tills SSL är fixat kan du använda:
- `https://bolaxo-production.up.railway.app`

### Kontakta Railway Support
Om problemet kvarstår:
- Railway Dashboard → Support
- Berätta att SSL-certifikat inte genereras för custom domain

---

## 📋 CHECKLIST

- [ ] Custom domain lagt till i Railway
- [ ] DNS-poster korrekta i One.com
- [ ] Väntat 15 minuter efter custom domain setup
- [ ] Testat med `curl -I https://bolaxo.com`
- [ ] Kontrollerat Railway Logs för SSL-status

---

**Status:** 🟡 SSL-certifikat genereras av Railway automatiskt

