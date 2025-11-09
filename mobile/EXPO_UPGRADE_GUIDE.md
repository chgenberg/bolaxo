# 🔄 Expo SDK Upgrade Guide - SDK 50 → SDK 54

## 📋 Steg-för-steg Upgrade

Följ dessa steg enligt [Expo's officiella guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/):

---

## ✅ Steg 1: Uppgradera Expo SDK

```bash
cd mobile
npm install expo@^54.0.0
```

Detta uppgraderar Expo från SDK 50 till SDK 54.

---

## ✅ Steg 2: Uppgradera alla dependencies

Expo-paket måste matcha SDK-versionen. Kör:

```bash
npx expo install --fix
```

Detta uppdaterar automatiskt alla Expo-paket till rätt versioner för SDK 54.

Sedan kontrollera efter problem:

```bash
npx expo-doctor
```

Detta visar eventuella konflikter eller problem.

---

## ✅ Steg 3: Uppdatera native projects

### Om du använder Continuous Native Generation (CNG):
Ta bort `android` och `ios` mappar om de finns:

```bash
cd mobile
rm -rf android ios
```

De kommer återskapas automatiskt vid nästa build.

### Om du har native kod:
Kör `npx pod-install` om du har iOS-mapp:

```bash
cd mobile/ios
pod install
```

---

## ✅ Steg 4: Läs Release Notes

**Viktigt:** Läs SDK 54 release notes för breaking changes:
- https://blog.expo.dev/expo-sdk-54-is-now-available

Vanliga breaking changes:
- React Native uppgraderingar
- Nya API:er
- Deprecated features

---

## 🔍 Vad som kommer uppdateras

När du kör `npx expo install --fix` kommer dessa paket uppdateras:

- `expo-router` → SDK 54 version
- `expo-secure-store` → SDK 54 version
- `expo-notifications` → SDK 54 version
- `expo-location` → SDK 54 version
- `expo-image-picker` → SDK 54 version
- `react-native` → Nyare version (kompatibel med SDK 54)
- Alla andra Expo-paket

---

## ⚠️ Viktiga Noteringar

### Expo Go Kompatibilitet
- Expo Go stödjer endast senaste SDK-versionen
- Om du använder SDK 50, fungerar det inte med senaste Expo Go
- SDK 54 är nödvändigt för att använda senaste Expo Go

### Development Builds
- För produktion: använd development builds (inte Expo Go)
- Development builds stödjer äldre SDK-versioner längre

---

## 🚀 Kör Upgrade Nu

```bash
cd mobile

# Steg 1: Uppgradera Expo
npm install expo@^54.0.0

# Steg 2: Fixa alla dependencies
npx expo install --fix

# Steg 3: Kontrollera problem
npx expo-doctor

# Steg 4: Testa appen
npm start
```

---

## 🐛 Om något går fel

### Problem: Dependency conflicts
```bash
rm -rf node_modules package-lock.json
npm install
npx expo install --fix
```

### Problem: Expo doctor visar fel
- Följ rekommendationerna från `expo-doctor`
- Uppdatera paket som behövs
- Kontrollera att alla Expo-paket matchar SDK 54

### Problem: Appen startar inte
- Kontrollera console för errors
- Kör `npx expo start --clear`
- Testa med `npm start`

---

## 📚 Ytterligare Resurser

- **Expo Upgrade Guide:** https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
- **SDK 54 Release Notes:** https://blog.expo.dev/expo-sdk-54-is-now-available
- **Expo Doctor:** https://docs.expo.dev/more/expo-doctor/

---

## ✅ Efter Upgrade

När upgrade är klar:

1. **Testa appen lokalt:**
   ```bash
   npm start
   ```

2. **Testa på simulator:**
   ```bash
   npm run ios
   # eller
   npm run android
   ```

3. **Kontrollera att allt fungerar:**
   - Login
   - Navigation
   - API-anrop
   - Native features (kamera, notifications, etc.)

---

**Lycka till med uppgraderingen! 🚀**

