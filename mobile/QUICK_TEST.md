# 🧪 Snabbstart: Testa Appen Lokalt

## 🚀 Snabbaste Sättet (5 minuter)

### Steg 1: Installera dependencies
```bash
cd mobile
npm install
```

### Steg 2: Starta Expo
```bash
npm start
```

### Steg 3: Välj hur du vill testa

**Alternativ A: På din iPhone/Android (Enklast!)**
1. Ladda ner **Expo Go** från App Store/Play Store
2. Öppna Expo Go
3. Skanna QR-koden som visas i terminalen
4. Appen laddas automatiskt! 🎉

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

## ⚙️ Konfigurera för Lokal Backend

Om du vill testa mot lokal backend (localhost:3000):

### För Simulator/Emulator:
Redigera `mobile/services/api.ts`:
```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'  // Fungerar i simulator
  : 'https://bolaxo-production.up.railway.app'
```

### För Fysisk Enhet:
Du måste använda din dators IP istället för localhost:

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

3. **Starta backend lokalt:**
   ```bash
   # I root-mappen
   npm run dev
   ```

---

## 🔧 Vanliga Kommandon

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
rm -rf node_modules
npm install
npm start -- --clear
```

### Problem: QR-kod fungerar inte
- Kontrollera att telefon och dator är på samma WiFi
- Försök: `npx expo start --tunnel`

### Problem: API-anrop fungerar inte
- Kontrollera att backend körs (`npm run dev`)
- För fysisk enhet: använd IP istället för localhost
- Kontrollera firewall-inställningar

---

## ✅ Test-checklista

- [ ] Appen startar utan crash
- [ ] Login-skärm visas
- [ ] Navigation fungerar
- [ ] API-anrop fungerar (om backend körs)
- [ ] Bilder laddas korrekt

---

**Se `LOCAL_TESTING_GUIDE.md` för detaljerad guide!**

