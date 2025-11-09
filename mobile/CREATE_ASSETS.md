# 🎨 Skapa Placeholder Assets för Appen

## Varför behövs assets?

Expo kräver att dessa filer finns för att appen ska kunna starta:
- `icon.png` - App-ikon
- `splash.png` - Splash screen
- `adaptive-icon.png` - Android adaptive icon

---

## 🚀 Snabbaste Lösningen

### Alternativ 1: Använd en enkel färgad bild

1. **Skapa en 1024x1024 px bild** med färgen `#1F3C58` (din brand-färg)
2. **Spara som PNG**
3. **Kopiera till:**
   - `mobile/assets/icon.png`
   - `mobile/assets/adaptive-icon.png`
   - `mobile/assets/splash.png` (kan vara samma eller 1242x2436 px)

### Alternativ 2: Använd Figma/Canva

1. **Skapa design i Figma eller Canva:**
   - Storlek: 1024x1024 px
   - Bakgrund: `#1F3C58`
   - Lägg till text "BOLAXO" eller din logo
   - Exportera som PNG

2. **Spara filerna:**
   - `mobile/assets/icon.png`
   - `mobile/assets/adaptive-icon.png`
   - `mobile/assets/splash.png` (1242x2436 px för splash)

### Alternativ 3: Använd online tool

1. Gå till: https://www.favicon-generator.org/ eller liknande
2. Ladda upp din logo
3. Generera alla storlekar
4. Ladda ner och spara i `mobile/assets/`

---

## 📐 Exakta Storlekar

- **icon.png:** 1024x1024 px
- **splash.png:** 1242x2436 px (iPhone X format)
- **adaptive-icon.png:** 1024x1024 px
- **favicon.png:** 48x48 px (för web)

---

## 🎨 Design Tips

- **Ingen transparens** - Använd solid bakgrund
- **Inga rundade hörn** - Apple/Android lägger till dem automatiskt
- **Ingen text** - Logo är OK, men undvik text om möjligt
- **Hög kontrast** - Ska synas på både ljus och mörk bakgrund

---

## ⚡ Temporär Lösning (för att testa snabbt)

Om du bara vill testa appen snabbt, kan du:

1. **Skapa en enkel färgad bild:**
   ```bash
   # Använd ImageMagick (om installerat)
   convert -size 1024x1024 xc:#1F3C58 mobile/assets/icon.png
   ```

2. **Eller kopiera från web-appen:**
   - Om du har en logo i `public/` mappen
   - Konvertera till rätt storlek
   - Kopiera till `mobile/assets/`

---

## 🔄 Efter att Assets är Skapade

När du har skapat assets:

```bash
cd mobile
npm start
```

Appen ska nu starta utan asset-fel! ✅

---

**Tips:** För produktion, anlita en designer för professionella ikoner (~5,000-10,000 SEK).

