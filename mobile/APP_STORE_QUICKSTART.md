# 🚀 App Store Snabbstart - 10 Steg till Publicering

## Snabb Översikt

**Tid:** ~1-2 veckor (beroende på review-tid)  
**Kostnad:** $99/år (Apple Developer)  
**Svårighetsgrad:** Medel (med Expo är det enklare!)

---

## ✅ Steg 1: Apple Developer Account (1 dag)

1. Gå till https://developer.apple.com/programs/
2. Klicka "Enroll"
3. Välj Organization eller Individual
4. Betala $99/år
5. Vänta på godkännande (1-2 dagar)

**Kostnad:** $99/år (~1,000 SEK/år)

---

## ✅ Steg 2: Installera EAS CLI (5 min)

```bash
npm install -g eas-cli
eas login
```

---

## ✅ Steg 3: Konfigurera EAS Build (5 min)

```bash
cd mobile
eas build:configure
```

Detta skapar `eas.json` (redan skapad för dig!)

---

## ✅ Steg 4: Skapa App-Ikoner (1-2 timmar)

**Du behöver:**
- `mobile/assets/icon.png` - 1024x1024 px
- `mobile/assets/splash.png` - 1242x2436 px
- `mobile/assets/adaptive-icon.png` - 1024x1024 px

**Tips:** Använd Figma eller Canva, eller anlita designer (~5,000 SEK)

---

## ✅ Steg 5: Bygg Appen (30 min)

```bash
cd mobile
eas build --platform ios --profile production
```

**Detta tar ~20-30 minuter** och bygger appen i molnet.

---

## ✅ Steg 6: App Store Connect Setup (30 min)

1. Gå till https://appstoreconnect.apple.com
2. "My Apps" → "+" → "New App"
3. Fyll i:
   - Name: BOLAXO
   - Bundle ID: com.bolaxo.app
   - SKU: bolaxo-ios-001
4. Spara

---

## ✅ Steg 7: Ladda upp Build (10 min)

1. I App Store Connect → "TestFlight" tab
2. "+" → "iOS App"
3. Välj din build från EAS
4. Vänta på processing (~10-30 min)

---

## ✅ Steg 8: TestFlight Beta (1-2 dagar)

1. Lägg till interna testare
2. Testa appen grundligt
3. Fixa eventuella buggar

---

## ✅ Steg 9: Förbered App Store Assets (2-4 timmar)

**Du behöver:**
- Screenshots (minst 3 per enhet)
- App description (SV + EN)
- Keywords
- Privacy Policy URL

**Se `APP_STORE_GUIDE.md` för detaljerade krav.**

---

## ✅ Steg 10: Submit för Review (10 min)

1. I App Store Connect → "App Store" tab
2. Fyll i alla fält
3. Klicka "Submit for Review"
4. Vänta 1-3 dagar på godkännande

---

## 🎯 Checklista

### Före du börjar:
- [ ] Apple Developer Account ($99/år)
- [ ] App-ikoner skapade
- [ ] Privacy Policy på webbsidan

### Under utveckling:
- [ ] EAS CLI installerat
- [ ] App byggd och testad
- [ ] TestFlight build skapad

### Före submission:
- [ ] Screenshots taget
- [ ] App description skriven
- [ ] Demo-konto för review

### Submission:
- [ ] Alla fält ifyllda
- [ ] Build laddad upp
- [ ] Submit for Review

---

## 💡 Viktiga Tips

1. **Testa grundligt** - Apple är strikta
2. **Privacy Policy** - Måste finnas
3. **Screenshots** - Ta tid på dig
4. **Demo-konto** - Skapa ett perfekt konto för review

---

## 📞 Hjälp & Support

- **Expo Docs:** https://docs.expo.dev/build/introduction/
- **Apple Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **EAS Support:** https://docs.expo.dev/build/introduction/

---

## 🚀 När du är redo:

```bash
cd mobile

# Bygg för produktion
eas build --platform ios --profile production

# Submit till App Store (när bygget är klart)
eas submit --platform ios --profile production
```

**Lycka till! 🎉**

