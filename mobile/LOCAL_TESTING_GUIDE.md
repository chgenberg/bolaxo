# 📱 Testa Appen Lokalt - Komplett Guide

## ✅ Expo SDK Uppgraderad!

**Status:** Expo SDK har uppgraderats från 50 → 54! 🎉

---

## 🚀 Snabbstart (5 minuter)

### Steg 1: Installera dependencies
```bash
cd mobile
npm install --legacy-peer-deps
```

### Steg 2: Skapa placeholder assets (viktigt!)

Appen behöver ikoner för att starta. Skapa dessa filer:

**`mobile/assets/icon.png`** - 1024x1024 px
- Enkel färgad kvadrat med text "BOLAXO"
- Eller använd din logotyp

**`mobile/assets/splash.png`** - 1242x2436 px  
- Splash screen med logo
- Bakgrundsfärg: `#1F3C58`

**`mobile/assets/adaptive-icon.png`** - 1024x1024 px
- Samma som icon.png

**Snabb lösning:** Använd en enkel färgad bild eller skapa med Figma/Canva.

### Steg 3: Starta Expo
```bash
npm start
```

### Steg 4: Välj hur du vill testa

**Alternativ A: På din iPhone/Android (Enklast!)**
1. Ladda ner **Expo Go** från App Store/Play Store
2. Öppna Expo Go
3. Skanna QR-koden från terminalen
4. Appen laddas! 🎉

**Alternativ B: iOS Simulator (Mac)**
- Tryck `i` i terminalen
- iOS Simulator öppnas automatiskt

**Alternativ C: Android Emulator**
- Tryck `a` i terminalen
- Android Emulator öppnas (om installerad)

**Alternativ D: Webbläsare**
- Tryck `w` i terminalen
- Öppnas på http://localhost:8081

---

## ⚙️ Konfiguration för Lokal Backend

Om du vill testa mot lokal backend (localhost:3000):

### För Simulator/Emulator:
Redigera `mobile/services/api.ts`:
```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'  // Fungerar i simulator
  : 'https://bolaxo-production.up.railway.app'
```

### För Fysisk Enhet:
Använd din dators IP istället för localhost:

1. **Hitta din IP:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Uppdatera API URL:**
   ```typescript
   const API_BASE_URL = __DEV__
     ? 'http://192.168.1.100:3000'  // Ersätt med din IP
     : 'https://bolaxo-production.up.railway.app'
   ```

---

## 🔧 Användbara Kommandon

När Expo körs kan du trycka:

- **`r`** - Reload appen
- **`m`** - Toggle developer menu
- **`j`** - Öppna debugger
- **`i`** - Öppna iOS simulator
- **`a`** - Öppna Android emulator
- **`w`** - Öppna i webbläsare
- **`?`** - Visa alla kommandon

---

## 🐛 Felsökning

### Problem: "Unable to resolve module"
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start -- --clear
```

### Problem: QR-kod fungerar inte
- Kontrollera att telefon och dator är på samma WiFi
- Försök med "Tunnel" mode: `npx expo start --tunnel`
- Eller använd "LAN" mode: `npx expo start --lan`

### Problem: Assets saknas
- Skapa placeholder-bilder (se ovan)
- Eller kommentera bort asset-referenser i `app.json` temporärt

### Problem: Node version varningar
- Du har Node 20.19.2, SDK 54 vill ha >=20.19.4
- Detta är bara varningar och bör fungera ändå
- För att fixa: uppgradera Node till senaste version

---

## ✅ Test-checklista

- [ ] Appen startar utan crash
- [ ] Login-skärm visas
- [ ] Navigation fungerar
- [ ] API-anrop fungerar (om backend körs)
- [ ] Bilder laddas korrekt

---

## 📚 Ytterligare Resurser

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Expo DevTools:** https://docs.expo.dev/workflow/developer-menu/

---

**Lycka till med testningen! 🎉**
