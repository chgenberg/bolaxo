# 📋 SÅ LÄGGER DU TILL CNAME I ONE.COM

## Steg-för-steg instruktioner

### **1. Logga in på One.com**
- Gå till: https://www.one.com
- Logga in med dina uppgifter

### **2. Gå till DNS-inställningar**
1. Klicka på **"Domän"** eller **"Domain"** i menyn
2. Välj **bolaxo.com**
3. Klicka på **"DNS-inställningar"** eller **"DNS Settings"**

### **3. Lägg till CNAME-posten**

**Om det redan finns en CNAME för `www`:**
1. Hitta den befintliga CNAME-posten för `www`
2. Klicka på **"Redigera"** eller **"Edit"**
3. Ändra **"Värd"** eller **"Host"** till: `by54y0nn.up.railway.app`
4. Spara

**Om det INTE finns en CNAME för `www`:**
1. Klicka på **"+ Lägg till post"** eller **"+ Add Record"**
2. Välj typ: **CNAME**
3. Ange:
   - **Namn/Host:** `www`
   - **Värd/Hostname:** `by54y0nn.up.railway.app`
4. Spara

### **4. Verifiera Web-forward (för root domain)**

För `bolaxo.com` (utan www) behöver du också:
1. Gå till **"Web-forward"** eller **"Web Redirect"**
2. Kontrollera att det finns en redirect:
   - Från: `bolaxo.com`
   - Till: `https://bolaxo-production.up.railway.app` (eller `https://www.bolaxo.com`)

---

## ✅ Efter du har lagt till CNAME-posten:

1. **Vänta 5-15 minuter** för DNS-spridning
2. Vänta **5-15 minuter** för Railway att generera SSL-certifikat
3. Testa: `https://www.bolaxo.com`
4. Testa: `https://bolaxo.com`

---

## 🔍 Vad du ska se i One.com DNS:

```
Type      Name      Value
------------------------------------------
CNAME     www       by54y0nn.up.railway.app
```

**OBS:** För root domain (`bolaxo.com`) behöver du använda **Web-forward** om One.com inte stödjer CNAME på root.

---

## ⚠️ Vanliga problem:

1. **"Record not yet detected"** i Railway
   - Vänta 10-15 minuter efter att du lagt till DNS-posten
   - DNS kan ta upp till 72 timmar att sprida globalt

2. **SSL-certifikat genereras inte**
   - Railway genererar SSL automatiskt efter DNS är verifierad
   - Detta tar ytterligare 5-15 minuter

3. **"Safari kan inte upprätta säker förbindelse"**
   - Detta är normalt tills SSL-certifikatet är genererat
   - Vänta tills Railway visar "SSL Active" eller grön status

---

**Nästa steg efter du lagt till CNAME:**
1. Gå tillbaka till Railway Dashboard
2. Vänta tills "Record not yet detected" försvinner (10-15 min)
3. Vänta tills SSL-certifikat genereras (ytterligare 5-15 min)
4. Testa `https://www.bolaxo.com` i Safari

