# 🔧 ONE.COM DNS-FIX FÖR BOLAXO.COM

## ⚠️ PROBLEM: Web-alias ≠ CNAME

One.com använder "Web-alias" som en redirect/forward, men Railway behöver en riktig CNAME DNS-post.

---

## ✅ LÖSNING 1: Uppdatera Web-alias (temporär fix)

Ändra `www.bolaxo.com` Web-alias:
- **Från:** `https://bolaxo-production.up.railway.app`
- **Till:** `by54y0nn.up.railway.app` (utan `https://`)

**OBS:** Detta kan fungera men är inte optimalt. Railway föredrar riktig CNAME.

---

## ✅ LÖSNING 2: Hitta riktig DNS/CNAME-inställning i One.com

One.com har olika sektioner för DNS. Prova dessa steg:

### Steg 1: Sök efter "DNS-poster" eller "DNS Records"
1. I One.com panelen, sök efter: **"DNS"** eller **"DNS-poster"**
2. Leta efter en sektion som heter:
   - "DNS-poster" (DNS Records)
   - "CNAME-poster"
   - "DNS-inställningar" → "DNS-poster"

### Steg 2: Lägg till CNAME-post
Om du hittar DNS-poster-sektionen:
1. Klicka på **"+ Lägg till post"** eller **"+ Add Record"**
2. Välj typ: **CNAME**
3. Ange:
   - **Namn/Host:** `www`
   - **Värd/Hostname:** `by54y0nn.up.railway.app`
4. Spara

### Steg 3: Ta bort Web-alias (efter CNAME är lagd)
När CNAME-posten är verifierad i Railway:
1. Ta bort Web-alias för `www.bolaxo.com` (eller låt den vara som backup)

---

## 🔍 ALTERNATIV: Kontakta One.com Support

Om du inte hittar CNAME-inställningar:
1. Kontakta One.com support
2. Be dem lägga till en CNAME-post:
   - **Type:** CNAME
   - **Name:** `www`
   - **Value:** `by54y0nn.up.railway.app`

---

## ✅ Efter du har uppdaterat:

1. Vänta 10-15 minuter för DNS-spridning
2. Gå tillbaka till Railway Dashboard
3. Vänta tills "Record not yet detected" försvinner
4. Railway genererar SSL-certifikat (tar 5-15 minuter)
5. Testa: `https://www.bolaxo.com`

---

## 🚨 Om Web-alias inte fungerar:

Railway kan ibland acceptera Web-alias, men det är inte garantat. Bästa lösningen är alltid en riktig CNAME-post.

**Temporär lösning:** Använd Railway URL direkt:
- `https://bolaxo-production.up.railway.app`

eller

- `https://by54y0nn.up.railway.app`

tills DNS är fixat.

