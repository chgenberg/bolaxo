# 🍎 Apple App Store Publicering - Komplett Guide

## 📋 Översikt

BOLAXO mobil-appen är redan byggd med **Expo + React Native**. För att publicera på Apple App Store behöver du följa dessa steg.

---

## ✅ Vad som redan finns

- ✅ Expo-projekt setup (`mobile/` mapp)
- ✅ `app.json` konfigurerad med bundle identifier: `com.bolaxo.app`
- ✅ React Native app med navigation och API-integration
- ✅ Grundläggande funktionalitet implementerad

---

## 🎯 Steg-för-steg: Från kod till App Store

### STEG 1: Apple Developer Account (Kostar ~$99/år)

#### 1.1 Skapa Apple Developer Account
1. Gå till: https://developer.apple.com/programs/
2. Klicka "Enroll"
3. Logga in med ditt Apple ID
4. Välj **Organization** (om du har bolag) eller **Individual**
5. Fyll i information och betala $99/år
6. Vänta på godkännande (kan ta 1-2 dagar)

#### 1.2 Verifiera din identitet
- **Individual:** Personnummer + ID-handling
- **Organization:** Organisationsnummer + verifiering

---

### STEG 2: Förbered appen för produktion

#### 2.1 Uppdatera `app.json`

**Först, kontrollera att detta är korrekt:**

```json
{
  "expo": {
    "name": "BOLAXO",
    "slug": "bolaxo-mobile",
    "version": "1.0.0",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.bolaxo.app",  // ← Viktigt!
      "buildNumber": "1",  // ← Lägg till detta
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Vi använder din plats för att visa relevanta företag i närheten.",
        "NSPhotoLibraryUsageDescription": "Vi behöver tillgång till dina foton för att ladda upp bilder till annonser.",
        "NSCameraUsageDescription": "Vi behöver tillgång till kameran för att ta bilder till annonser."
      }
    }
  }
}
```

#### 2.2 Skapa app-ikoner och splash screens

**Du behöver dessa bilder:**

1. **App Icon** (`mobile/assets/icon.png`)
   - Storlek: **1024x1024 px**
   - Format: PNG (ingen transparens)
   - Inga rundade hörn (Apple lägger till dem automatiskt)
   - Ingen text eller märkning

2. **Splash Screen** (`mobile/assets/splash.png`)
   - Storlek: **1242x2436 px** (iPhone X format)
   - Bakgrundsfärg: `#1F3C58` (din brand-färg)
   - Centrerad logo

3. **Adaptive Icon** (Android, men behövs också)
   - Storlek: **1024x1024 px**
   - Foreground image (logo)
   - Background color: `#1F3C58`

**Tips:** Använd Figma eller Canva för att skapa dessa.

---

### STEG 3: Installera EAS (Expo Application Services)

EAS är Expo's officiella verktyg för att bygga och publicera appar.

#### 3.1 Installera EAS CLI
```bash
npm install -g eas-cli
```

#### 3.2 Logga in på Expo
```bash
eas login
```

#### 3.3 Konfigurera EAS Build
```bash
cd mobile
eas build:configure
```

Detta skapar `eas.json` filen.

---

### STEG 4: Konfigurera EAS Build

#### 4.1 Skapa `eas.json` (om den inte finns)

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "ios": {
        "bundleIdentifier": "com.bolaxo.app"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "din-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      }
    }
  }
}
```

---

### STEG 5: Bygga appen för iOS

#### 5.1 Första bygget (för att skapa App Store Connect-post)

```bash
cd mobile
eas build --platform ios --profile production
```

**Detta kommer att:**
- Fråga om du vill skapa en ny app i App Store Connect (svara JA)
- Bygga appen i molnet (tar ~20-30 minuter)
- Ge dig en `.ipa` fil som kan laddas upp

#### 5.2 Vänta på bygget
- Du får en länk att följa byggprocessen
- När det är klart får du en download-länk

---

### STEG 6: App Store Connect Setup

#### 6.1 Logga in på App Store Connect
1. Gå till: https://appstoreconnect.apple.com
2. Logga in med ditt Apple Developer Account

#### 6.2 Skapa ny app (om inte redan skapad)
1. Klicka "My Apps" → "+" → "New App"
2. Fyll i:
   - **Platform:** iOS
   - **Name:** BOLAXO
   - **Primary Language:** Swedish (sv)
   - **Bundle ID:** com.bolaxo.app (välj från dropdown)
   - **SKU:** bolaxo-ios-001 (unikt ID)
   - **User Access:** Full Access

#### 6.3 App Information
Fyll i:
- **Category:** Business
- **Subcategory:** (lämna tomt eller välj relevant)
- **Privacy Policy URL:** https://bolaxo.se/juridiskt/integritetspolicy

---

### STEG 7: Förbered App Store Assets

#### 7.1 Screenshots (KRITISKT!)

Du behöver screenshots i dessa storlekar:

**iPhone 6.7" (iPhone 14 Pro Max):**
- 1290 x 2796 px
- Minst 3 screenshots, max 10

**iPhone 6.5" (iPhone 11 Pro Max):**
- 1242 x 2688 px
- Minst 3 screenshots

**iPhone 5.5" (iPhone 8 Plus):**
- 1242 x 2208 px
- Minst 3 screenshots

**iPad Pro 12.9":**
- 2048 x 2732 px
- Minst 3 screenshots (valfritt men rekommenderas)

**Tips:**
- Ta screenshots från iOS Simulator
- Visa viktiga funktioner (dashboard, sökning, annonser)
- Använd samma design som din web-app

#### 7.2 App Preview Video (Valfritt men rekommenderat)
- Max 30 sekunder
- Visa appen i användning
- Storlek: 1920 x 1080 px (landscape) eller 1080 x 1920 px (portrait)

#### 7.3 App Description

**Svenska:**
```
BOLAXO - Marknadsplatsen för företagsförsäljning

Hitta rätt företag att köpa eller sälj ditt företag på Sveriges ledande plattform för företagsöverlåtelser.

FÖR KÖPARE:
• Sök och filtrera företag efter bransch, region och storlek
• Få matchningar baserat på dina preferenser
• Signera NDA digitalt och få tillgång till datarum
• Jämför objekt sida vid sida
• Skapa indikativa anbud (LOI)

FÖR SÄLJARE:
• Skapa annonser direkt från mobilen
• Hantera dina annonser och NDA-förfrågningar
• Få notifikationer när matchningar hittas
• Se statistik och aktivitet på dina annonser

FÖR MÄKLARE:
• Hantera flera annonser för olika kunder
• Få översikt över alla pågående affärer
• Effektiv kundhantering

FUNKTIONER:
✓ AI-driven värdering av företag
✓ Säker NDA-process med BankID
✓ Datarum med dokumenthantering
✓ Q&A för köpare och säljare
✓ Push-notifikationer för viktiga händelser
✓ Offline-stöd för grundläggande funktioner

BOLAXO är byggt för att förenkla företagsförsäljning och göra processen säker, transparent och effektiv.
```

**Engelska:**
```
BOLAXO - The Marketplace for Business Sales

Find the right company to buy or sell your business on Sweden's leading platform for business transfers.

FOR BUYERS:
• Search and filter companies by industry, region and size
• Get matches based on your preferences
• Sign NDAs digitally and access data rooms
• Compare objects side by side
• Create indicative offers (LOI)

FOR SELLERS:
• Create listings directly from your phone
• Manage your listings and NDA requests
• Get notifications when matches are found
• View statistics and activity on your listings

FOR BROKERS:
• Manage multiple listings for different clients
• Get overview of all ongoing deals
• Efficient client management

FEATURES:
✓ AI-driven company valuation
✓ Secure NDA process with BankID
✓ Data room with document management
✓ Q&A for buyers and sellers
✓ Push notifications for important events
✓ Offline support for basic functions

BOLAXO is built to simplify business sales and make the process secure, transparent and efficient.
```

#### 7.4 Keywords
```
företagsförsäljning,affärsöverlåtelse,M&A,köpa företag,sälja företag,bolagsvärdering,NDA,datarum,LOI,mäklare,köpare,säljare
```

#### 7.5 Support URL
- https://bolaxo.se/kontakt

#### 7.6 Marketing URL (Valfritt)
- https://bolaxo.se

---

### STEG 8: TestFlight (Beta-testning)

#### 8.1 Ladda upp första build
1. I App Store Connect → "TestFlight" tab
2. Klicka "+" → "iOS App"
3. Välj din build från EAS
4. Vänta på processing (kan ta 10-30 minuter)

#### 8.2 Lägg till testare
1. Gå till "Internal Testing"
2. Lägg till interna testare (max 100)
3. De får email med TestFlight-länk

#### 8.3 Testa appen
- Ladda ner TestFlight-appen på iPhone
- Acceptera inbjudan
- Installera och testa appen

**Testa:**
- ✅ Login fungerar
- ✅ Navigation fungerar
- ✅ API-anrop fungerar
- ✅ Push-notifikationer fungerar
- ✅ Alla viktiga funktioner

---

### STEG 9: Submit till App Store Review

#### 9.1 Förbered för submission

**I App Store Connect → "App Store" tab:**

1. **Version Information:**
   - Version: 1.0.0
   - Copyright: © 2025 BOLAXO AB (eller ditt bolag)

2. **What's New in This Version:**
   ```
   Första versionen av BOLAXO mobil-app!
   
   • Sök och filtrera företag
   • Skapa och hantera annonser
   • Signera NDA digitalt
   • Få matchningar baserat på preferenser
   • Push-notifikationer för viktiga händelser
   ```

3. **App Review Information:**
   - **Contact Information:** Din email
   - **Phone:** Ditt telefonnummer
   - **Demo Account:** Skapa ett test-konto för Apple att använda
   - **Notes:** 
     ```
     Test-konto för review:
     Email: review@bolaxo.se
     Password: ReviewTest123!
     
     Appen använder BankID för verifiering, men detta är valfritt för grundläggande funktioner.
     ```

4. **Version Release:**
   - Välj "Automatically release this version" eller "Manually release"

#### 9.2 Submit för review
1. Klicka "Submit for Review"
2. Svara på frågor om export compliance (vanligtvis "No")
3. Bekräfta att all information är korrekt
4. Klicka "Submit"

---

### STEG 10: Vänta på Review

#### 10.1 Review Process
- **Vanlig tid:** 1-3 dagar
- **Status:** "Waiting for Review" → "In Review" → "Ready for Sale" eller "Rejected"

#### 10.2 Om appen blir rejected
- Du får feedback från Apple
- Fixa problemen
- Skicka in igen

**Vanliga anledningar till rejection:**
- Saknade privacy policy länkar
- Appen kraschar vid start
- Saknade ikoner eller screenshots
- Felaktig bundle identifier
- Appen fungerar inte som beskrivet

---

## 🔧 Tekniska Krav

### Krav som måste uppfyllas:

1. ✅ **Privacy Policy** - Måste finnas på din webbsida
2. ✅ **App Icons** - Alla storlekar måste finnas
3. ✅ **Screenshots** - Minst 3 för varje enhet
4. ✅ **App fungerar** - Ingen krasch vid start
5. ✅ **API fungerar** - Backend måste vara live
6. ✅ **BankID integration** - Om använd, måste fungera

---

## 💰 Kostnader

### Årliga kostnader:
- **Apple Developer Program:** $99/år (~1,000 SEK/år)
- **Expo EAS Build:** Gratis för första 30 builds/månad, sedan $29/månad

### Engångskostnader:
- Design av ikoner och screenshots (om du anlitar designer): ~5,000-10,000 SEK

---

## 📱 Snabb Checklista

### Före du börjar:
- [ ] Apple Developer Account skapat ($99/år)
- [ ] App-ikoner skapade (1024x1024)
- [ ] Splash screens skapade
- [ ] Privacy Policy på webbsidan
- [ ] Test-konto för Apple review

### Under utveckling:
- [ ] EAS CLI installerat
- [ ] `eas.json` konfigurerad
- [ ] App byggd och testad lokalt
- [ ] TestFlight build skapad
- [ ] Beta-testare har testat

### Före submission:
- [ ] Screenshots taget (alla storlekar)
- [ ] App description skriven (SV + EN)
- [ ] Keywords valda
- [ ] Support URL angiven
- [ ] Demo-konto skapat för review

### Submission:
- [ ] Alla fält i App Store Connect ifyllda
- [ ] Build laddad upp
- [ ] Submit for Review klickad
- [ ] Väntar på godkännande

---

## 🚀 Snabbstart-kommando

När allt är klart:

```bash
cd mobile

# 1. Konfigurera EAS (första gången)
eas build:configure

# 2. Bygg för produktion
eas build --platform ios --profile production

# 3. När bygget är klart, submit till App Store
eas submit --platform ios --profile production
```

---

## 📚 Ytterligare Resurser

- **Expo Docs:** https://docs.expo.dev/build/introduction/
- **Apple App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **App Store Connect Help:** https://help.apple.com/app-store-connect/

---

## ⚠️ Viktiga Tips

1. **Testa grundligt** - Apple är strikta, testa allt innan submission
2. **Privacy Policy** - Måste vara tillgänglig och komplett
3. **Screenshots** - Ta tid på dig, de är första intrycket
4. **Demo-konto** - Skapa ett som fungerar perfekt för review
5. **Version nummer** - Börja med 1.0.0, öka vid varje uppdatering

---

## 🎯 Nästa Steg Efter Publicering

1. **Övervaka reviews** - Svara på användarrecensioner
2. **Analytics** - Använd App Store Connect Analytics
3. **Uppdateringar** - Planera regelbundna uppdateringar
4. **Marketing** - Marknadsför appen på din webbsida

---

**Lycka till med publiceringen! 🚀**

