# Google Custom Search API Setup

Google Custom Search API används för att hämta nyheter, omnämnanden och sentiment-data om företag som värderas. Detta ger AI:n kritisk kontext om varumärke, publicitet och eventuella risker.

## Vad får vi från Google Search?

- **Nyhetsartiklar** - Senaste 6 månader
- **Omnämnanden** - Social media och branschsidor
- **Sentiment-analys** - Positiva/negativa nyckelord
- **Online-närvaro** - Antal sökträffar (varumärkesstyrka)
- **Top resultat** - De 3 viktigaste omnämnandena

## Setup (5 minuter)

### Steg 1: Skapa Google Cloud Project & API Key

1. Gå till https://console.cloud.google.com/
2. Skapa ett nytt projekt (eller välj befintligt)
3. Aktivera "Custom Search API"
   - Sök efter "Custom Search API" i API Library
   - Klicka "Enable"
4. Skapa API-nyckel:
   - Gå till "Credentials"
   - Klicka "Create Credentials" → "API Key"
   - Kopiera nyckeln → Lägg till i `.env`:
     ```
     GOOGLE_SEARCH_API_KEY="AIzaSyxxxxxxxxxxxxxx"
     ```

### Steg 2: Skapa Search Engine

1. Gå till https://programmablesearchengine.google.com/
2. Klicka "Add" (skapa ny sökmotor)
3. Konfiguration:
   - **Search the entire web**: JA ✓
   - **Name**: "Bolaxo Company Search" (valfritt)
   - **Language**: Swedish
4. Spara och kopiera **Search Engine ID**
5. Lägg till i `.env`:
   ```
   GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"
   ```

## Kostnad

- **Gratis tier**: 100 sökningar/dag
- **Betald**: $5 per 1,000 sökningar efter det
- Med 10 värderingar/dag = 10 sökningar = **helt gratis**
- Med 500 värderingar/dag = 500 sökningar = $20/dag ($600/mån)

## Environment Variables

Lägg till i `.env` eller `.env.local`:

```bash
# Google Custom Search API
GOOGLE_SEARCH_API_KEY="AIzaSyxxxxxxxxxxxxxx"
GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"
```

## Test

När API-nycklarna är konfigurerade, kör en värdering. Du kommer se:

```
✓ Google Search: {
    results: 10,
    totalResults: 1234,
    newsCount: 5,
    recentNews: true,
    positive: 3,
    negative: 0
  }
```

## Vad händer om API-nycklar saknas?

Inget fel! Google Search är valfritt:
- Värderingen fungerar ändå med 9 andra källor
- Loggen visar: `[Google Search] API key not configured, skipping...`
- AI:n får fortfarande data från Allabolag, Ratsit, Proff, LinkedIn, etc.

## Felhantering

### Error: Rate limit exceeded (429)

Du har använt upp 100 gratis sökningar/dag. Lösningar:
1. Vänta till nästa dag (gratis tier återställs)
2. Aktivera billing i Google Cloud (betald version)

### Error: Invalid API key (400)

- Kontrollera att API-nyckeln är korrekt kopierad
- Verifiera att "Custom Search API" är aktiverad
- Försök skapa en ny API-nyckel

### Error: Search engine not found (404)

- Kontrollera att Search Engine ID är korrekt
- Verifiera att sökmotorn är konfigurerad att söka "entire web"

## Exempel på vad AI:n får

```
GOOGLE SEARCH - NEWS, OMNÄMNANDEN & SENTIMENT:
- Totalt antal träffar: 12,450
  ✓ Stark online-närvaro - etablerat varumärke
- Nyhetsartiklar: 8
- Senaste nyheter (6 mån): Ja ✓
- Social media omnämnanden: 15
- Branschrelaterade träffar: 23

SENTIMENT-ANALYS:
✓ POSITIVA SIGNALER (5): tillväxt, expansion, award, vinnare, innovativ
  ✓ EXCELLENT: Starkt positivt momentum - kan motivera +10-15% högre multipel

TOP SÖKRESULTAT:
1. "Företaget X vinner pris för innovation 2024"
   Företaget har utsetts till årets innovativa företag...
2. "Expansion till Norge - 50% tillväxt"
   Kraftig tillväxt och expansion till nya marknader...
3. "Investering på 10 MSEK för skalning"
   Nytt kapital ska användas för att skala verksamheten...
```

## Hur påverkar det värderingen?

Google Search-data används för att:

1. **Varumärkesstyrka**
   - < 100 träffar: ⚠️ Begränsad varumärkesstyrka → Lägre multipel
   - > 10,000 träffar: ✓ Starkt varumärke → Högre multipel

2. **Positivt momentum**
   - Många positiva nyckelord + senaste nyheter: +10-15% högre värdering
   - Awards, expansion, investeringar: Starkt signal

3. **Negativa risker**
   - Konkurs, stämning, skandal: 🚨 Kan motivera 20-40% lägre värdering
   - AI:n får tydlig varning att undersöka noggrannt

4. **Aktivitetsnivå**
   - Senaste nyheter (6 mån): ✓ Aktivt företag
   - Inga nyheter: ⚠️ Kan vara inaktivt eller ha låg PR-aktivitet

## Support

Vid problem:
- Dokumentation: https://developers.google.com/custom-search/v1/overview
- Support: https://console.cloud.google.com/support

