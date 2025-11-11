'use client'

import { useState, Suspense } from 'react'
import { 
  TrendingUp, Download, CheckCircle, AlertCircle, Award, 
  BarChart3, FileText, Shield, Target, Briefcase, 
  Clock, Users, AlertTriangle, Lightbulb, DollarSign,
  ChevronRight, TrendingDown, Zap, Package, Globe
} from 'lucide-react'

const mockResult = {
  valuation: {
    range: {
      min: 28500000,
      max: 42750000,
      mostLikely: 35625000,
      confidence: 0.82
    },
    methodology: {
      primary: "Diskonterat kassaflöde (DCF)",
      secondary: "Multipelvärdering baserat på jämförbara bolag",
      explanation: "DCF-metoden valdes som primär värderingsmetod då bolaget har stabila och förutsägbara kassaflöden med 78% återkommande intäkter och låg churn (<5%). DCF-metoden värderar bolaget baserat på nuvarande värde av framtida kassaflöden, vilket är mest relevant för bolag med stabila och förutsägbara kassaflöden.\n\nDCF-beräkningen baserades på:\n- Fritt kassaflöde (FCF) för de kommande 5 åren baserat på finansiella projektioner\n- Terminalvärde beräknat med perpetuity growth-modell (g=2,5%) eller exit multiple (8x EBITDA)\n- WACC (Weighted Average Cost of Capital) på 9,5% baserat på: riskfri ränta (3,5%), equity risk premium (5,5%), beta (1,1), och cost of debt (4,5%)\n- Discount rate anpassad för bolagets specifika riskprofil\n\nVärderingen kompletterades med en multipelvärdering baserat på 12 jämförbara bolag inom samma bransch för att validera DCF-resultatet. Jämförbara bolag identifierades baserat på: (1) Liknande affärsmodell (SaaS/B2B software), (2) Liknande storlek (omsättning 30-100 MSEK), (3) Liknande tillväxt (10-25% CAGR), (4) Liknande lönsamhet (EBITDA-margin 15-25%), (5) Liknande geografi (Nordic/European).\n\nMultiplar använda:\n- EV/Revenue: 3,5-5,5x (median 4,2x)\n- EV/EBITDA: 8-12x (median 9,5x)\n- EV/FCF: 12-18x (median 14x)\n\nDCF-värderingen resulterade i ett värde på 34,2 MSEK (midpoint) medan multipelvärderingen resulterade i 36,8 MSEK (midpoint). Genomsnittet av dessa två metoder ger 35,5 MSEK, vilket är i linje med den slutliga värderingen på 35,6 MSEK.\n\nVärderingen tar hänsyn till:\n- Stark tillväxt (18% CAGR) som motiverar premium\n- Hög lönsamhet (22% EBITDA) som motiverar högre multiplar\n- Stark kassaflödeskonvertering (85%) som minskar risk\n- Marknadsledande position (32% marknadsandel) som ger konkurrensfördelar\n- Identifierade risker (nyckelpersoner, teknisk skuld) som justerar värderingen nedåt\n- Värdeskapande möjligheter (internationell expansion, cross-selling) som justerar värderingen uppåt\n\nKonfidensgraden på 82% reflekterar att värderingen är väl underbyggd med flera valideringsmetoder och stabila finansiella siffror, men att det finns viss osäkerhet kring framtida tillväxt och marknadsutveckling."
    },
    adjustments: [
      {
        type: "Stark marknadsposition",
        impact: 3200000,
        reason: "Bolaget har en ledande position inom sin nisch med 32% marknadsandel, vilket är 2,5x större än närmaste konkurrent. Denna marknadsposition ger flera värdeskapande faktorer: (1) Starkt varumärke med 87% aided awareness, (2) Nätverkseffekter där värdet ökar med fler användare, (3) Högre prissättningskraft tack vare marknadsposition, (4) Bättre tillgång till partnerskap och distribution, (5) Möjlighet att attrahera bättre talanger. Marknadspositionen är hållbar tack vare patenterad teknologi, starka kundrelationer, och hög switching costs. Denna justering motsvarar en premium på ~9% över basvärderingen och är väl motiverad av jämförbara transaktioner där marknadsledare värderas 5-15% högre."
      },
      {
        type: "Teknisk skuld",
        impact: -1800000,
        reason: "IT-systemen byggda 2018 på PHP 7.2 tappar support 2024 vilket kräver modernisering inom 12-18 månader. Estimerad kostnad är 3-5 MSEK och tar 6-9 månader. Denna teknisk skuld påverkar värderingen negativt eftersom: (1) Det kräver betydande investeringar som köparen måste göra, (2) Det skapar säkerhetsrisker tills moderniseringen är klar, (3) Det begränsar skalbarhet och internationell expansion, (4) Det kan påverka produktutvecklingshastighet. Justeringen på -1,8 MSEK motsvarar ~40% av moderniseringskostnaden och reflekterar att moderniseringen är nödvändig men att påbörjad modernisering kan minska risken. Om moderniseringen påbörjas före försäljning kan justeringen minskas till -0,9 MSEK."
      },
      {
        type: "Återkommande intäkter",
        impact: 2400000,
        reason: "78% av intäkterna är återkommande med exceptionellt låg churn (<5% årligen vs branschsnitt 12-15%). Detta ger flera värdeskapande faktorer: (1) Hög förutsägbarhet i kassaflödet vilket minskar risk och motiverar högre värdering, (2) Låg kundanskaffningskostnad per kund eftersom churn är låg, (3) Möjlighet till expansion revenue från befintliga kunder (+7% årligen), (4) Hög kundlivstid (genomsnitt 6,5 år) vilket ökar Customer Lifetime Value. Återkommande intäkter värderas typiskt 20-30% högre än engångsintäkter i jämförbara transaktioner. Justeringen på +2,4 MSEK motsvarar en premium på ~7% och är väl motiverad av branschstandarder där SaaS-bolag med >70% ARR värderas betydligt högre."
      },
      {
        type: "Nyckelpersonsberoende",
        impact: -900000,
        reason: "Hög beroende av VD och säljchef utan dokumenterade processer eller ersättare. VD och säljchef står tillsammans för 65% av kundrelationerna och 55% av nyförsäljningen. Om någon av dessa skulle lämna skulle det ha betydande negativ påverkan på verksamheten. Uppskattad värdeförlust vid abrupt bortfall: 15-25%. Justeringen på -0,9 MSEK reflekterar denna risk men tar också hänsyn till att risken kan minskas genom rekrytering av vice VD och dokumentation. Om vice VD rekryteras före försäljning kan justeringen minskas till -0,4 MSEK. Denna justering är konservativ jämfört med potentiell värdeförlust men reflekterar att risken är hanterbar med rätt åtgärder."
      },
      {
        type: "Kundkoncentration",
        impact: -600000,
        reason: "Top 10 kunder står för 45% av omsättning vilket är över rekommenderad gräns på 30-35%. Den största kunden står för 12% av omsättning vilket är över rekommenderad gräns på 8-10%. Om största kunden skulle säga upp sitt avtal skulle det ha betydande påverkan på både omsättning och lönsamhet. Justeringen på -0,6 MSEK reflekterar denna risk men tar också hänsyn till att kundrelationerna är väletablerade med långa avtal (genomsnitt 4 år) och låg churn-risk. Om diversifieringsstrategi implementeras och max 8% per kund nås kan justeringen minskas till -0,3 MSEK."
      },
      {
        type: "Stark kassaflödeskonvertering",
        impact: 1500000,
        reason: "Kassaflödeskonvertering på 85% av EBITDA är exceptionellt stark och betydligt över branschgenomsnittet på 60-65%. Detta ger flera värdeskapande faktorer: (1) Hög kvalitet i resultatet vilket minskar risk, (2) Möjlighet att finansiera tillväxt utan extern finansiering, (3) Flexibilitet för investeringar och utdelningar, (4) Stark finansiell stabilitet med kassareserv på 18,5 MSEK. Stark kassaflödeskonvertering värderas typiskt 10-15% högre i jämförbara transaktioner. Justeringen på +1,5 MSEK motsvarar en premium på ~4% och är väl motiverad."
      },
      {
        type: "Patenterad teknologi",
        impact: 1800000,
        reason: "Patenterad teknologi som ger verifierbar 40% effektivitetsvinst jämfört med konkurrenters lösningar är en unik konkurrensfördel. Patentet ger: (1) Exklusivitet och skydd mot konkurrenter, (2) Möjlighet till licensintäkter i framtiden, (3) Högre värdering i jämförbara transaktioner (IP-intensive bolag värderas 15-25% högre), (4) Strategiskt värde för köpare som söker teknologisk kompetens. Justeringen på +1,8 MSEK motsvarar en premium på ~5% och reflekterar patentets värde men är konservativ jämfört med potentiellt strategiskt värde för rätt köpare."
      }
    ]
  },
  executiveSummary: `SAMMANFATTNING AV FÖRETAGSVÄRDERING OCH DUE DILIGENCE

Baserat på en omfattande due diligence-analys som täcker 42 kritiska affärsområden, värderas bolaget till 35,6 MSEK med ett konfidensintervall på 28,5-42,8 MSEK. Värderingen baseras på en kombination av diskonterat kassaflöde (DCF) som primär metod och multipelvärdering som valideringsmetod, vilket ger en konfidensgrad på 82%.

FINANSIELL STYRKA OCH HISTORISK UTVECKLING

Bolaget har uppvisat exceptionell finansiell utveckling under de senaste tre åren. Omsättningen har vuxit från 42 MSEK (2021) till 68 MSEK (2023), vilket motsvarar en sammansatt årlig tillväxttakt (CAGR) på 18%. Detta är betydligt över branschsnittet på 8-10% och indikerar stark marknadsposition och effektiv verksamhet.

Lönsamheten är imponerande med en EBITDA-marginal på 22%, vilket är 7 procentenheter över branschgenomsnittet på 15%. Bruttomarginal ligger på exceptionella 72%, jämfört med branschsnitt på 55%, vilket tyder på stark prissättningskraft och effektiv kostnadskontroll. Nettomarginal på 14% är också betydligt över branschsnitt och visar på hållbar lönsamhet även efter finansiella kostnader och skatter.

Kassaflödeskonverteringen är mycket stark på 85% av EBITDA, vilket indikerar hög kvalitet i resultatet och minimal rörelsekapitalbindning. Detta möjliggörs delvis av att 40% av kunderna betalar förskott, vilket ger en naturlig finansiering av verksamheten. Det fria kassaflödet har varit konsekvent positivt och vuxit i takt med resultatet, vilket ger ägarna flexibilitet för både investeringar och utdelningar.

AFFÄRSMODELL OCH INTÄKTSSTRUKTUR

En av bolagets största styrkor är den höga andelen återkommande intäkter. 78% av omsättningen kommer från prenumerationer och serviceavtal med genomsnittlig löptid på 3 år. Detta ger hög förutsägbarhet i kassaflödet och minskar beroendet av kontinuerlig nyförsäljning. Churn-raten är exceptionellt låg på under 5% årligen, vilket är betydligt bättre än branschsnittet på 12-15%.

Kundbasen består av 247 aktiva kunder, varav majoriteten är medelstora till stora företag med god betalningsförmåga. Genomsnittlig kundlivstid är 6,5 år, vilket tyder på högt kundvärde och stark kundlojalitet. Customer Lifetime Value (LTV) beräknas till 890 000 kr medan Customer Acquisition Cost (CAC) ligger på 67 000 kr, vilket ger ett utmärkt LTV/CAC-ratio på 13,3x.

MARKNADSPOSITION OCH KONKURRENSSITUATION

Bolaget har etablerat sig som marknadsledare inom sin nisch med en marknadsandel på 32%. Detta är resultatet av 8 års fokuserat arbete med produktutveckling och kundservice. Den totala adresserbara marknaden (TAM) i Sverige uppskattas till 2,1 miljarder kronor årligen, vilket innebär att bolaget har betydande tillväxtpotential även inom befintlig marknad.

Konkurrenslandskapet består av tre huvudkategorier: 1) Två större internationella aktörer med bred produktportfölj men mindre fokus på den svenska marknaden, 2) Fem medelstora svenska konkurrenter med liknande erbjudande men svagare varumärke och teknologi, 3) Ett tiotal mindre nischaktörer som fokuserar på specifika kundsegment eller geografiska områden.

Bolagets konkurrensfördelar är väldokumenterade och hållbara. Den patenterade teknologin ger 40% effektivitetsvinst jämfört med konkurrenternas lösningar, vilket är verifierat genom oberoende tester. Varumärket är starkt etablerat med 87% aided awareness bland målgruppen. Kundnöjdheten mätt som Net Promoter Score (NPS) ligger på 72, vilket är exceptionellt högt jämfört med branschgenomsnittet på 45.

OPERATIONELL EXCELLENS OCH ORGANISATION

Säljorganisationen är välfungerande med tydliga processer och hög produktivitet. Genomsnittlig säljcykel är 3,2 månader, vilket är i linje med branschstandard för denna typ av lösningar. Konverteringsgraden från kvalificerad lead till kund ligger på 28%, vilket är över branschsnitt. Säljproduktiviteten mätt som intäkt per säljare är 4,2 MSEK årligen, vilket är konkurrenskraftigt.

Teknologiplattformen är byggd 2018 och har skalat väl med verksamheten. Systemet hanterar för närvarande 247 kunder utan prestandaproblem och har kapacitet för ytterligare 400-500 kunder innan större investeringar krävs. Dock bygger plattformen på PHP 7.2 som tappar officiellt support under 2024, vilket innebär att en modernisering är nödvändig inom 12-18 månader.

Organisationen består av 32 medarbetare fördelade på säljare (8), kundservice (6), produktutveckling (9), administration (4), och ledning (5). Personalomsättningen är låg på 8% årligen, vilket är betydligt under branschsnittet på 15-18%. Detta tyder på god arbetsmiljö och stark företagskultur.

IDENTIFIERADE RISKER OCH UTMANINGAR

Den mest kritiska risken är beroendet av nyckelpersoner, specifikt VD och säljchef. VD har grundat bolaget och har djupa relationer med många av de största kunderna. Säljchefen ansvarar för 40% av nyförsäljningen och har unika relationer inom branschen. Ingen av dessa roller har dokumenterade ersättare eller överlämningsplaner. Vid en försäljning är det kritiskt att säkerställa att dessa personer stannar kvar under en övergångsperiod, vilket bör regleras i transaktionsavtalet.

Den tekniska skulden utgör en betydande risk och kostnad. Moderniseringen av IT-plattformen estimeras kosta 3-5 MSEK och ta 6-9 månader att genomföra. Detta bör påbörjas före en försäljning för att undvika att köparen använder detta som förhandlingskort för prisavdrag. En påbörjad modernisering visar också på framåtblickande ledning och minskar upplevd risk.

Kundkoncentrationen med top 10 kunder som står för 45% av omsättningen utgör en finansiell risk. Den största kunden står för 12% av omsättningen, vilket är över den rekommenderade gränsen på 8-10%. Om denna kund skulle säga upp sitt avtal skulle det ha betydande påverkan på både omsättning och lönsamhet. En diversifieringsstrategi bör implementeras för att minska denna risk.

VÄRDESKAPANDE MÖJLIGHETER

Internationell expansion till de nordiska grannländerna representerar den största tillväxtmöjligheten. Den totala adresserbara marknaden i Norden är tre gånger större än i Sverige, och bolagets lösning är fullt tillämpbar på dessa marknader. En försiktig expansion till Norge och Danmark skulle kunna öka den adresserbara marknaden med 150% inom 2-3 år.

Cross-selling till befintlig kundbas är en betydande outnyttjad möjlighet. För närvarande köper endast 35% av kunderna mer än en produkt, trots att produktportföljen innehåller flera kompletterande lösningar. En strukturerad cross-selling-strategi med incitament för säljare skulle kunna öka genomsnittlig intäkt per kund med 40-60%.

Produktutveckling mot en SaaS-modell skulle kunna öka både marginalerna och värderingen. För närvarande är lösningen delvis on-premise, vilket kräver installation och support. En ren SaaS-lösning skulle minska dessa kostnader och möjliggöra snabbare skalning. SaaS-bolag värderas typiskt 30-50% högre än traditionella mjukvarubolag på grund av högre förutsägbarhet och lägre kundanskaffningskostnader.

REKOMMENDERAD TRANSAKTIONSSTRATEGI

Optimal tidpunkt för försäljning bedöms vara om 6-9 månader efter implementering av kritiska förbättringsåtgärder. Detta ger tid att visa förbättrad lönsamhet, minskad risk, och påbörjad tillväxtresa, vilket kan höja värderingen med 15-20% (5-7 MSEK).

Rekommenderad köparprofil är antingen en Private Equity-fond med branschfokus som har kapital och kompetens för internationell expansion, eller en strategisk köpare inom närliggande vertikal som söker marknadskonsolidering. Internationella aktörer som vill etablera sig på den svenska marknaden är också potentiella köpare.

Affärsstrukturen bör vara 70% kontant vid tillträde, 20% deponerat för garantier i 18 månader, och 10% earn-out baserat på EBITDA-mål. Detta balanserar säljarens önskan om säker exit med köparens behov av riskreducering. Nyckelpersoner bör ha stay-on bonusar och VD bör förbinda sig att stanna 12 månader med möjlighet till konsultavtal därefter.

SLUTSATS

Bolaget representerar en attraktiv investeringsmöjlighet med stark finansiell historik, ledande marknadsposition, och betydande tillväxtpotential. Värderingen på 35,6 MSEK är väl underbyggd och tar hänsyn till både styrkor och identifierade risker. Med rätt förberedelser och timing kan värdet maximeras ytterligare, vilket gör detta till en mycket attraktiv försäljningskandidat inom de närmaste 12 månaderna.`,
  ddFindings: {
    strengths: [
      "Marknadsledande position med 32% marknadsandel inom sin nisch, vilket är 2,5x större än närmaste konkurrent",
      "78% återkommande intäkter med exceptionellt låg churn-rate (<5% årligen vs branschsnitt 12-15%)",
      "EBITDA-marginal på 22% vilket är 7 procentenheter över branschsnitt på 15%, trendande uppåt",
      "Skalbar teknologiplattform som möjliggör tillväxt utan proportionell kostnadsökning - nuvarande kapacitet 3x större än användning",
      "Stark kundnöjdhet (NPS 72 vs branschsnitt 45) och exceptionellt långa kundrelationer (genomsnitt 6,5 år)",
      "Välfungerande säljorganisation med dokumenterade processer och hög produktivitet (4,2 MSEK/säljare)",
      "Diversifierad produktportfölj med 5 huvudprodukter som minskar beroendet av enskilda produkter",
      "Stark kassaflödeskonvertering (85% av EBITDA) med minimal rörelsekapitalbindning",
      "Patenterad teknologi som ger verifierbar 40% effektivitetsvinst jämfört med konkurrenters lösningar",
      "Starkt varumärke med 87% aided awareness bland målgruppen i Sverige",
      "Låg personalomsättning (8% vs branschsnitt 15-18%) som indikerar stark företagskultur",
      "Hög konverteringsgrad från lead till kund (28% vs branschsnitt 18-22%)",
      "Utmärkt LTV/CAC-ratio på 13,3x vilket är betydligt över hållbarhetsgränsen på 3x",
      "Förskottsbetalningar från 40% av kunderna ger naturlig finansiering av verksamheten",
      "Genomsnittlig avtalslängd på 3 år ger hög förutsägbarhet i intäktsflödet",
      "Certifieringar inom ISO 27001 och ISO 9001 som är krav för många större kunder",
      "Etablerade partnerskap med 3 större systemintegratörer som driver 15% av nyförsäljningen",
      "Dokumenterad och skalbar onboarding-process som minskar time-to-value för nya kunder",
      "Proaktiv kundservice med 95% first-call resolution och genomsnittlig svarstid under 2 timmar"
    ],
    weaknesses: [
      "Kritiskt beroende av VD och säljchef som tillsammans står för 65% av kundrelationerna utan dokumenterad överlämningsplan eller vice VD",
      "IT-system byggt 2018 på PHP 7.2 som tappar support 2024 - kräver modernisering inom 12-18 månader (estimerad kostnad 3-5 MSEK)",
      "Begränsad internationell närvaro med 95% av försäljning i Sverige - ingen etablerad go-to-market strategi för internationell expansion",
      "Svag digital marknadsföring med endast 8% av leads från digitala kanaler jämfört med branschsnitt på 35%",
      "Manuella processer inom ekonomi och rapportering - saknar automatiserad månadsrapportering och KPI-dashboards",
      "Låg investeringsnivå i R&D (3% av omsättning vs 8% branschsnitt) vilket kan påverka långsiktig konkurrenskraft",
      "Ingen dedikerad produktchef - produktutveckling styrs ad-hoc av VD och utvecklingsteam",
      "Begränsad dokumentation av teknisk arkitektur och systemdesign - knowledge silos hos enskilda utvecklare",
      "Saknar formell säljträning och onboarding-program för nya säljare",
      "Ingen strukturerad cross-selling strategi trots att endast 35% av kunder köper flera produkter",
      "Begränsad användning av data och analytics för affärsbeslut - saknar BI-verktyg",
      "Ingen dokumenterad disaster recovery plan eller business continuity plan",
      "Svag employer branding gör rekrytering av senior talanger utmanande",
      "Ingen strukturerad kundlojalitetsprogram eller community-building initiativ"
    ],
    opportunities: [
      "Internationell expansion till Norge och Danmark som första steg - TAM ökar med 150% och kulturell närhet underlättar",
      "Digitalisering av säljprocessen med marketing automation och lead nurturing kan öka konvertering med 20-30% och minska CAC med 25%",
      "Strukturerad cross-selling strategi till befintlig kundbas - endast 35% köper flera produkter trots hög komplementaritet",
      "Strategiska förvärv av 2-3 mindre konkurrenter för snabb marknadskonsolidering och geografisk expansion",
      "Utveckling av ren SaaS-version av huvudprodukten kan öka marginaler med 5-8 procentenheter och attrahera mindre kunder",
      "Utöka partnerskap med större systemintegratörer - nuvarande 3 partners driver endast 15% av försäljning",
      "Lansera freemium-modell för att accelerera marknadsadoption och skapa viral tillväxt",
      "Utveckla branschspecifika vertikaler som kan prissättas premium (estimerat 20-30% högre ASP)",
      "Implementera AI/ML för prediktiv analytics vilket kan differentierade erbjudandet och motivera prisökningar",
      "Skapa marketplace för tredjepartstillägg vilket kan generera nya intäktsströmmar och öka switching costs",
      "Etablera customer success-funktion för att driva expansion revenue och minska churn ytterligare",
      "Utveckla white-label lösning för partners vilket kan öppna nya distributionskanaler",
      "Lansera professionella tjänster (konsulting, implementation) som komplement till produkten",
      "Skapa API-ekosystem för integrationer vilket ökar produktens värde och lock-in effekt"
    ],
    threats: [
      "Internationella tech-jättar som börjar fokusera på denna nisch med betydligt större resurser för produktutveckling och marknadsföring",
      "Prispress från lågkostnadsalternativ, särskilt från Östeuropa och Indien, som kan underminera premiumpositionering",
      "Regulatoriska förändringar inom GDPR/dataskydd som kan kräva betydande investeringar i compliance och säkerhet",
      "Konjunkturnedgång kan påverka B2B-investeringsvilja och leda till längre säljcykler och lägre deal sizes",
      "Cybersäkerhetsrisker och potentiella dataläckor som kan skada varumärke och leda till kundbortfall",
      "Disruptiv teknologi (AI/ML) som kan göra nuvarande lösningsansats obsolet inom 3-5 år",
      "Konsolidering bland konkurrenter som skapar större och starkare konkurrenter med bredare erbjudande",
      "Kundernas ökande krav på integrationer och ekosystem som kan vara kostsamt att uppfylla",
      "Talangbrist inom tech som driver upp lönekostnader och gör rekrytering utmanande",
      "Open source-alternativ som kan erbjuda liknande funktionalitet gratis",
      "Förändrade köpbeteenden där kunder föredrar all-in-one plattformar framför best-of-breed lösningar",
      "Geopolitisk instabilitet som kan påverka internationell expansion och leverantörskedjor"
    ],
    redFlags: [
      {
        severity: "high",
        area: "Organisation",
        description: "VD och säljchef står tillsammans för 65% av kundrelationerna och 55% av nyförsäljningen utan dokumenterad överlämningsplan eller ersättare. VD har grundat bolaget 2015 och har djupa personliga relationer med många av de största kunderna, särskilt inom Enterprise-segmentet. Säljchefen ansvarar för 40% av nyförsäljningen och har unika branschrelationer som har byggts upp över 10 år. Ingen av dessa roller har dokumenterade processer, kundöverlämningar eller successionsplaner. Om någon av dessa skulle lämna skulle det ha omedelbar negativ påverkan på försäljning, kundrelationer och bolagets värdering. Riskbedömning: Sannolikhet hög (VD är 58 år, säljchef 52 år, båda har uttryckt intresse för exit), Påverkan mycket hög (uppskattad värdeförlust 15-25% vid abrupt bortfall).",
        mitigation: "Implementera omgående: (1) Rekrytera vice VD med säljansvar inom 3-4 månader (budget 150-200k SEK), (2) Dokumentera alla kundrelationer i CRM med kontaktpersoner, historik och relationer, (3) Skapa successionsplaner för båda roller med tydliga kriterier och tidsplaner, (4) Implementera stay-on bonusar för båda (2-3 MSEK vardera) för att säkerställa kontinuitet under försäljningsprocessen, (5) Etablera regelbundna kundöverlämningar där vice VD introduceras till top 20 kunder, (6) Skapa dokumenterade processer för alla kritiska aktiviteter som nu är personberoende."
      },
      {
        severity: "high",
        area: "Teknologi",
        description: "Core-system byggt 2018 på PHP 7.2 med MySQL-databas tappar officiell support under 2024 vilket innebär säkerhetsrisker, begränsad tillgång till säkerhetsuppdateringar, och teknisk skuld som växer exponentiellt. Systemet hanterar för närvarande 247 kunder utan prestandaproblem men har identifierade flaskhalsar vid 350+ kunder. Modernisering till modern tech stack (Node.js/Python backend, React frontend, PostgreSQL) är nödvändig inom 12-18 månader för att undvika säkerhetsincidenter och möjliggöra skalning. Estimerad kostnad är 3-5 MSEK och tar 6-9 månader. Riskbedömning: Sannolikhet mycket hög (support upphör 2024), Påverkan hög (säkerhetsincidenter kan skada varumärke och leda till GDPR-böter upp till 4% av omsättning, dvs 2,7 MSEK).",
        mitigation: "Påbörja modernisering omgående: (1) Fasa 1: Migration av kritiska komponenter (3 månader, 1,5 MSEK), (2) Fasa 2: Fullständig migration (6 månader, 2-3 MSEK), (3) Engagera säkerhetskonsult för riskbedömning och recommendations (100k SEK), (4) Implementera säkerhetsmonitoring och incident response plan, (5) Dokumentera teknisk skuld och skapa roadmap för modernisering, (6) Budgetera och reservera 5 MSEK för hela projektet. Påbörjad modernisering före försäljning minskar upplevd risk och kan höja värderingen med 5-10%."
      },
      {
        severity: "medium",
        area: "Kunder",
        description: "Top 10 kunder står för 45% av omsättning vilket är över rekommenderad gräns på 30-35%. Den största kunden står för 12% av omsättning (8,2 MSEK/år) vilket är över rekommenderad gräns på 8-10%. Om denna kund skulle säga upp sitt avtal skulle det ha betydande påverkan på både omsättning och lönsamhet. Riskbedömning: Sannolikhet medel (kunden har varit kund i 8 år men har nya ägare som kan ändra strategi), Påverkan hög (12% omsättningsförlust = 8,2 MSEK, plus negativ signal till andra kunder).",
        mitigation: "Diversifieringsstrategi: (1) Fokusera på att växa med mindre kunder - mål: max 8% per kund inom 12 månader, (2) Förhandla om längre avtal med största kunden (förläng från 3 till 5 år), (3) Utveckla dedikerad account management för top 10 kunder med regelbundna business reviews, (4) Skapa expansion opportunities inom största kunden genom upselling och cross-selling, (5) Etablera kundsuccession plan för att minska beroendet av enskilda kontakter, (6) Överväg kreditförsäkring för största kunden för att minska finansiell risk."
      },
      {
        severity: "medium",
        area: "Finansiell",
        description: "Ingen dokumenterad budget- eller prognosprocess vilket gör det svårt att förutsäga framtida resultat och identifiera avvikelser i tid. Månadsrapportering sker men saknar KPI-dashboards, rolling forecasts och tydliga benchmarks. Detta gör det svårt för potentiella köpare att bedöma förutsägbarhet och risk. Riskbedömning: Sannolikhet hög (processer saknas), Påverkan medel (kan påverka värderingen negativt och göra due diligence mer komplicerad).",
        mitigation: "Implementera omgående: (1) Månadsrapportering med KPI-dashboards (Power BI eller Tableau, budget 50k SEK + 20k/månad), (2) Rolling 12-månaders forecast uppdateras månadsvis, (3) Budgetprocess med tydliga antaganden och scenarier, (4) Benchmarking mot branschnyckeltal, (5) Automatiserad rapportering från ERP-system, (6) Regelbundna business reviews med ledningsteamet. Tidsram: 1 månad för implementation."
      },
      {
        severity: "low",
        area: "Legal",
        description: "GDPR-dokumentation är ofullständig med saknade biträdesavtal (DPA) för vissa leverantörer och begränsad dokumentation av databehandling. Detta kan leda till böter upp till 4% av omsättning (2,7 MSEK) vid en incident eller revision. Riskbedömning: Sannolikhet låg (inga incidenter hittills), Påverkan medel (böter kan vara betydande men sannolikhet låg).",
        mitigation: "Genomför GDPR-revision: (1) Engagera GDPR-konsult för fullständig revision (budget 200-300k SEK), (2) Uppdatera alla biträdesavtal (DPA) med leverantörer, (3) Dokumentera all databehandling enligt GDPR-krav, (4) Implementera data protection impact assessments (DPIA) för nya processer, (5) Skapa incident response plan för dataläckor, (6) Utbilda personal i GDPR. Tidsram: 2-3 månader."
      },
      {
        severity: "medium",
        area: "Marknad",
        description: "Begränsad internationell närvaro med 95% av försäljning i Sverige gör bolaget sårbart för svensk konjunktur och begränsar tillväxtpotential. Ingen etablerad go-to-market strategi för internationell expansion trots att lösningen är fullt tillämpbar på nordiska marknader. Riskbedömning: Sannolikhet medel (konjunkturnedgång kan påverka), Påverkan medel (begränsad tillväxtpotential kan påverka värderingen).",
        mitigation: "Utveckla internationell strategi: (1) Marknadsanalys för Norge och Danmark (budget 200k SEK), (2) Pilotprojekt med 2-3 kunder i Norge inom 6 månader, (3) Rekrytera lokal säljare eller partner i Norge, (4) Anpassa produkt och marknadsföring för nordiska marknader, (5) Budgetera 1-2 MSEK för internationell expansion år 1."
      }
    ],
    quickWins: [
      {
        action: "Implementera prisoptimering och value-based pricing",
        impact: "+8-12% på EBITDA genom 5-8% prisökning på befintliga kunder och 10-15% på nya kunder",
        timeframe: "2-3 månader",
        cost: "250-500k SEK (priskonsult + kommunikationsmaterial)"
      },
      {
        action: "Automatisera fakturering, påminnelser och inkasso",
        impact: "Frigör 2 FTE (1,6 MSEK årligen), förbättrad kassaflöde med 15 dagar, minskat DSO från 58 till 45 dagar",
        timeframe: "1-2 månader",
        cost: "100-200k SEK (mjukvara + implementation)"
      },
      {
        action: "Lansera strukturerat referensprogram med incitament",
        impact: "+15-20% nya kunder från referenser, -40% CAC för refererade kunder, högre konvertering",
        timeframe: "1 månad",
        cost: "50-100k SEK (plattform + marknadsföringsmaterial)"
      },
      {
        action: "Optimera Google Ads, SEO och content marketing",
        impact: "-30% CAC, +25% kvalificerade leads, förbättrad brand awareness",
        timeframe: "3 månader",
        cost: "300k SEK (byrå + verktyg)"
      },
      {
        action: "Implementera upsell/cross-sell playbook för befintliga kunder",
        impact: "+20-25% expansion revenue, ökat ARPU med 15-20%",
        timeframe: "1-2 månader",
        cost: "50k SEK (utveckling av playbook och säljmaterial)"
      },
      {
        action: "Lansera customer success-program för top 50 kunder",
        impact: "Minskat churn med 2 procentenheter (värde: 1,4 MSEK årligen), ökad NPS",
        timeframe: "2 månader",
        cost: "Intern tid + 100k SEK (verktyg)"
      },
      {
        action: "Optimera onboarding-process med automatisering",
        impact: "Minskat time-to-value från 45 till 30 dagar, frigör 1 FTE, högre kundnöjdhet",
        timeframe: "2-3 månader",
        cost: "200k SEK (utveckling + verktyg)"
      },
      {
        action: "Implementera lead scoring och marketing automation",
        impact: "+35% säljproduktivitet, kortare säljcykel med 20%, bättre lead-kvalitet",
        timeframe: "2 månader",
        cost: "150k SEK (plattform + setup)"
      }
    ]
  },
  financialAnalysis: {
    historicalPerformance: {
      revenue: {
        trend: "Stark positiv trend med konsekvent tillväxt och accelererande momentum",
        cagr: 18,
        analysis: "Omsättningen har vuxit från 42 MSEK (2021) till 52 MSEK (2022) och vidare till 68 MSEK (2023), vilket motsvarar en sammansatt årlig tillväxttakt (CAGR) på 18%. Detta är exceptionellt starkt jämfört med branschgenomsnittet på 8-10% och placerar bolaget i top decilen av tillväxtbolag inom sektorn.\n\nTillväxten är driven av flera faktorer: (1) Organisk tillväxt från befintliga kunder genom expansion och upselling (+12% årligen), (2) Nykundsförsäljning som bidragit med +9% årligen, (3) Prisökningar på 6% årligen som implementerats utan nämnvärd churn, och (4) Lansering av ny produktlinje under Q2 2023 som redan genererar 10,2 MSEK årligen (15% av total omsättning).\n\nKvartalsvis analys visar accelererande tillväxt: Q1 2023 +14% YoY, Q2 2023 +17% YoY, Q3 2023 +21% YoY, Q4 2023 +23% YoY. Detta tyder på att tillväxtmotorn stärks snarare än avtar. Den nya produktlinjen har en högre genomsnittlig deal size (385k vs 275k för huvudprodukten) och kortare säljcykel (2,1 månader vs 3,2 månader), vilket bör fortsätta driva acceleration.\n\nOmsättningen per anställd har ökat från 1,31 MSEK (2021) till 2,13 MSEK (2023), vilket visar på stark operationell hävstång och effektivitet. Detta är 40% över branschsnittet och indikerar att bolaget kan växa snabbare än kostnadsbasen ökar.\n\nGeografisk fördelning: Stockholm 45%, Göteborg 22%, Malmö 15%, övriga Sverige 18%. Kundfördelningen per bransch: Tech/IT 35%, Professional Services 28%, Manufacturing 20%, Retail 12%, Övriga 5%. Denna diversifiering minskar konjunkturkänslighet och branschspecifika risker."
      },
      profitability: {
        margins: {
          gross: "72%",
          ebitda: "22%",
          net: "14%",
          operating: "19%"
        },
        trend: "Förbättring med 3 procentenheter sedan 2021",
        analysis: "Lönsamheten har stärkts konsekvent över de senaste tre åren. Bruttomarginalen har förbättrats från 68% (2021) till 72% (2023), driven av (1) Förbättrad prissättning med value-based pricing-modell, (2) Skalfördelar i produktutveckling och support, (3) Ökad andel återkommande intäkter som har högre marginaler, och (4) Effektivisering av leveransprocesser.\n\nEBITDA-marginalen har förbättrats från 19% (2021) till 22% (2023), vilket är 7 procentenheter över branschgenomsnittet på 15%. Denna förbättring har skett trots betydande investeringar i säljorganisation (+3 FTE) och produktutveckling (+2 FTE). Detta visar på stark operationell hävstång där tillväxten driver lönsamhet snarare än minskar den.\n\nKostnadsstrukturen är välbalanserad: Personalkostnader 48% av omsättning (branschsnitt 55%), IT och hosting 8% (branschsnitt 12%), Marknadsföring 6% (branschsnitt 10%), Övriga OPEX 16% (branschsnitt 18%). Den lägre kostnadsbasen motiverar premiumvärderingen.\n\nNettomarginalen på 14% är exceptionell för branschen och visar på hållbar lönsamhet även efter finansiella kostnader och skatter. Bolaget har ingen nettoskuld vilket minskar finansiella kostnader och ger flexibilitet för framtida investeringar.\n\nTrendanalys visar att lönsamheten accelererar: EBITDA-marginalen ökade med 1,2 procentenheter 2021-2022 och 1,8 procentenheter 2022-2023. Detta tyder på att förbättringsåtgärderna ger ökande effekt över tid."
      },
      cashFlow: {
        quality: "Mycket hög",
        conversion: 85,
        analysis: "Kassaflödeskonverteringen på 85% av EBITDA är exceptionellt stark och indikerar hög kvalitet i resultatet. Detta är betydligt över branschgenomsnittet på 60-65% och placerar bolaget i top 10% av branschen.\n\nFaktorer som driver den starka kassaflödeskonverteringen:\n\n1. Förskottsbetalningar: 40% av kunderna betalar förskott (genomsnitt 3 månader), vilket ger en naturlig finansiering av verksamheten och minskar rörelsekapitalbehovet. Detta genererar cirka 9 MSEK i förskottsbetalningar som kan användas för drift.\n\n2. Låg rörelsekapitalbindning: Kundfordringar omsätter snabbt (DSO 58 dagar vs branschsnitt 75 dagar) tack vare tydliga betalningsvillkor och proaktiv fakturering. Lager är minimalt (endast merchandise för events, värde <100k SEK). Leverantörsskulder hanteras effektivt med genomsnittlig betalningstid på 32 dagar.\n\n3. Låg kapitalintensitet: Bolaget är tjänstebaserat med minimala anläggningstillgångar (endast IT-utrustning och mjukvara, totalt 2,3 MSEK). Capex är lågt (3-4% av omsättning, 2-2,7 MSEK årligen) och består främst av IT-utrustning och mjukvara. Detta ger starkt fritt kassaflöde.\n\n4. Kvalitet i intäktsflödet: 78% återkommande intäkter ger hög förutsägbarhet och minskar säsongsvariationer. Churn är låg (<5%) vilket säkerställer kontinuerligt kassaflöde. Genomsnittlig avtalslängd på 3 år ger långsiktig stabilitet.\n\nDet fria kassaflödet har varit konsekvent positivt och vuxit från 6,8 MSEK (2021) till 12,7 MSEK (2023), vilket motsvarar en CAGR på 37%. Detta ger ägarna betydande flexibilitet för både investeringar, utdelningar och framtida förvärv.\n\nKassaflödesanalys per kvartal visar stabila och förutsägbara mönster utan större säsongsvariationer. Q4 tenderar att vara starkast (+15% vs Q1-Q3) på grund av kundernas budgetcykler, men variationen är hanterbar och förutsägbar.\n\nBolaget har byggt upp en kassareserv på 18,5 MSEK (27% av omsättning), vilket ger stark finansiell stabilitet och möjliggör strategiska investeringar utan extern finansiering. Detta är betydligt över branschsnittet på 10-15% och visar på konservativ finansiell hantering."
      }
    },
    projections: {
      baseCase: {
        year1: 38500000,
        year2: 42000000,
        year3: 46500000
      },
      bestCase: {
        year1: 42750000,
        year2: 48500000,
        year3: 55000000
      },
      worstCase: {
        year1: 32000000,
        year2: 34000000,
        year3: 36500000
      }
    },
    workingCapital: {
      current: 8500000,
      optimal: 6200000,
      improvement: "Potential att frigöra 2,3 MSEK genom optimering av kundfordringar (minska från 58 till 45 dagar genom förbättrad fakturering och påminnelser), optimering av leverantörsskulder (öka från 32 till 45 dagar genom förhandling av bättre villkor), och minskning av övriga omsättningstillgångar. Detta skulle förbättra kassaflödet betydligt och kan finansiera IT-moderniseringen utan extern finansiering. Genomförandet kräver: (1) Automatiserad faktureringsprocess, (2) Proaktiv kreditkontroll, (3) Förhandling av leverantörsavtal, (4) Optimering av faktureringsfrekvens. Tidsram: 3-4 månader. Kostnad: 200-300k SEK för system och processförbättringar."
    }
  },
  marketPosition: {
    competitiveAdvantages: [
      "Patenterad teknologi som ger verifierbar 40% effektivitetsvinst jämfört med konkurrenters lösningar - verifierat genom oberoende tester från KTH och branschorganisationer",
      "Långsiktiga kundavtal med automatiska prisökningar (genomsnitt 3 år, 85% har auto-renewal) som ger hög förutsägbarhet och låg churn",
      "Branschens högsta kundnöjdhet (NPS 72 vs branschsnitt 45) vilket driver organisk tillväxt genom referenser",
      "Exklusiva certifieringar (ISO 27001, ISO 9001, SOC 2) som endast 3 aktörer i Sverige har - krav för många större kunder",
      "Datadriven insikt från 8 års kunddata (247 kunder, 1,2 miljoner datapunkter) som möjliggör prediktiv analytics och personalisering",
      "Nätverkseffekter - värdet ökar med fler användare vilket skapar naturliga barriärer för konkurrenter",
      "Starkt varumärke med 87% aided awareness bland målgruppen i Sverige - etablerat genom konsekvent marknadsföring och thought leadership",
      "Djupt integrations-ekosystem med 45+ partners (ERP, CRM, betalningslösningar) som ökar switching costs",
      "Proprietär algoritm för personalisering som har utvecklats över 6 år och ger mätbar förbättring i kundresultat",
      "Exklusiva partnerskap med 3 större systemintegratörer som driver 15% av nyförsäljning och ger tillgång till deras kundbas",
      "Först-mover-fördel inom AI-driven funktionalitet som konkurrenter saknar",
      "Stark kundlojalitet med genomsnittlig kundlivstid på 6,5 år och 94% retention rate",
      "Skalbar teknologiplattform som kan hantera 3x nuvarande belastning utan större investeringar",
      "Dokumenterad och beprövad onboarding-process som minskar time-to-value till 30 dagar (branschsnitt 60 dagar)",
      "Proaktiv kundservice med 95% first-call resolution och genomsnittlig svarstid under 2 timmar",
      "Branschspecifik expertis inom 5 vertikaler som möjliggör premiumprissättning"
    ],
    marketShare: {
      current: 32,
      potential: 45,
      details: "Nuvarande marknadsandel på 32% gör bolaget till marknadsledare inom sin nisch. Den totala adresserbara marknaden (TAM) i Sverige uppskattas till 2,1 miljarder kronor årligen, vilket innebär att bolagets nuvarande omsättning på 68 MSEK representerar 3,2% av TAM. Detta visar på betydande tillväxtpotential även inom befintlig marknad.\n\nMarknadsandelen har vuxit från 24% (2021) till 32% (2023), vilket motsvarar en årlig tillväxt på 4 procentenheter. Denna tillväxt har drivits av: (1) Organisk tillväxt från befintliga kunder, (2) Nykundsförsäljning som överträffat marknadstillväxten, (3) Konkurrenter som har tappat marknadsandelar, (4) Ny produktlinje som har attraherat nya kundsegment.\n\nPotentiell marknadsandel på 45% är realistisk inom 3-5 år baserat på: (1) Fortsatt organisk tillväxt (+8-10% årligen), (2) Strategiska förvärv av mindre konkurrenter, (3) Internationell expansion till Norge och Danmark, (4) Ny produktlinje som växer till 25% av omsättning. Detta skulle öka omsättningen till ~95 MSEK inom 3 år.\n\nKonkurrenssituationen är relativt stabil med inga större disruptiva förändringar. De två största konkurrenterna har marknadsandelar på 18% och 15% respektive, och ingen av dem har vuxit snabbare än bolaget de senaste tre åren. Detta ger bolaget möjlighet att fortsätta ta marknadsandelar."
    },
    customerAnalysis: {
      concentration: "Måttlig - top 10 kunder står för 45% av omsättning, största kund 12%",
      quality: "Mycket hög - blue chip-företag, låg kreditrisk, genomsnittlig kundstorlek 275k SEK/år",
      retention: 94,
      satisfaction: "NPS 72, CSAT 4.6/5",
      details: "Kundbasen består av 247 aktiva kunder fördelade på: Enterprise (>500k SEK/år) 15% (37 kunder, genomsnitt 750k SEK/år), Mid-market (200-500k) 45% (111 kunder, genomsnitt 320k SEK/år), SMB (<200k) 40% (99 kunder, genomsnitt 140k SEK/år). Genomsnittlig kundlivstid är 6,5 år med 94% retention rate. Churn är låg (<5% årligen) och primärt driven av företagsnedläggningar eller förvärv där köparen använder annan lösning. Expansion revenue från befintliga kunder är +7% årligen genom upselling och cross-selling.\n\nCustomer Lifetime Value (LTV) är 890k SEK medan Customer Acquisition Cost (CAC) är 67k SEK, vilket ger ett utmärkt LTV/CAC-ratio på 13,3x. Detta är betydligt över hållbarhetsgränsen på 3x och indikerar mycket effektiv kundanskaffning. Payback period är 8 månader vilket är exceptionellt bra och ger snabb ROI på marknadsföringsinvesteringar.\n\nTop 10 kunder står för 45% av omsättning vilket är över rekommenderad gräns på 30-35%, men dessa är väletablerade relationer med långa avtal (genomsnitt 4 år) och låg churn-risk. Den största kunden står för 12% av omsättning (8,2 MSEK/år) vilket är över rekommenderad gräns på 8-10%, men relationen är mycket stabil med 8 års historia och auto-renewal avtal.\n\nGenomsnittlig deal size är 275k SEK för huvudprodukten och 385k SEK för ny produktlinje. Säljcykel är 3,2 månader för huvudprodukten och 2,1 månader för ny produktlinje. Konverteringsgrad från kvalificerad lead till kund är 28% vilket är över branschsnittet på 18-22%.\n\nKundnöjdhet är exceptionellt hög med NPS på 72 (branschsnitt 45) och CSAT på 4,6/5. 87% av kunderna skulle rekommendera bolaget till andra, vilket driver organisk tillväxt genom referenser. Genomsnittlig antal referenser per kund är 1,2 vilket är högt för B2B-branschen."
    }
  },
  operationalExcellence: {
    efficiency: {
      score: 7.5,
      benchmarkComparison: "Top 25% i branschen, särskilt stark inom säljeffektivitet och kundservice. Omsättning per anställd (2,13 MSEK) är 40% över branschsnitt. Säljproduktivitet (4,2 MSEK/säljare) är i top 10%. Kundserviceeffektivitet (kunder per supportmedarbetare) är 41 kunder vilket är 30% bättre än branschsnitt. Utvecklingseffektivitet (features per utvecklare) är också över snittet tack vare välfungerande processer och teknisk skuld som är hanterbar."
    },
    technology: {
      maturity: "Mogen men åldrande - behöver modernisering",
      investmentNeeded: 5000000,
      details: "Teknologiplattformen är byggd 2018 på PHP 7.2 med MySQL-databas och React frontend. Systemet har skalat väl och hanterar för närvarande 247 kunder utan prestandaproblem. Kapaciteten är beräknad till 400-500 kunder innan större investeringar krävs. Dock tappar PHP 7.2 officiell support under 2024 vilket innebär säkerhetsrisker och begränsad tillgång till nya features. Modernisering till modern tech stack (Node.js/Python backend, React frontend, PostgreSQL) är nödvändig inom 12-18 månader. Estimerad kostnad är 3-5 MSEK och tar 6-9 månader. Moderniseringen kommer att förbättra: (1) Utvecklingshastighet med 30-40%, (2) Systemprestanda med 20-30%, (3) Säkerhet och compliance, (4) Skalbarhet för internationell expansion, (5) Developer experience och rekryteringsbarhet. Påbörjad modernisering före försäljning minskar upplevd risk och kan höja värderingen."
    },
    organization: {
      keyPersonRisk: "Hög - VD och säljchef kritiska utan backup",
      cultureFit: "Stark kultur men personberoende",
      details: "Organisationen består av 32 medarbetare fördelade på: Ledning (5), Sälj (8), Kundservice (6), Produktutveckling (9), Administration (4). Personalomsättningen är låg på 8% årligen vilket är betydligt under branschsnittet på 15-18%. Detta tyder på stark företagskultur och god arbetsmiljö. Employee Net Promoter Score (eNPS) är 58 vilket är över branschsnittet på 35-40.\n\nKritisk risk: VD och säljchef står tillsammans för 65% av kundrelationerna och 55% av nyförsäljningen. Ingen av dessa roller har dokumenterade ersättare eller överlämningsplaner. VD har grundat bolaget och har djupa personliga relationer med många av de största kunderna. Säljchefen ansvarar för 40% av nyförsäljningen och har unika branschrelationer. Om någon av dessa skulle lämna skulle det ha betydande negativ påverkan på verksamheten.\n\nRekommendation: Rekrytera vice VD med säljansvar inom 3-4 månader. Detta minskar risken och visar framåtblickande ledning. Budget: 150-200k SEK för rekrytering."
    },
    processes: {
      maturity: "Ojämn - säljprocesser mogna, back-office outvecklat",
      improvementAreas: ["Ekonomiprocesser", "HR/rekrytering", "Produktutveckling", "Kundservice-automation"],
      details: "Säljprocesserna är välfungerande med dokumenterade playbooks, tydliga steg från lead till kund, och regelbunden uppföljning. CRM-systemet används konsekvent och ger god insyn i pipeline. Säljträning genomförs regelbundet men saknar strukturerat program.\n\nEkonomiprocesserna är delvis manuella med begränsad automatisering. Månadsrapportering sker men saknar KPI-dashboards och rolling forecasts. Fakturering och inkasso är manuellt vilket tar tid och kan förbättras.\n\nHR-processerna är grundläggande med begränsad employer branding och rekryteringsstrategi. Onboarding av nya medarbetare är informell och saknar struktur.\n\nProduktutveckling saknar dedikerad produktchef och styrs ad-hoc av VD och utvecklingsteam. Roadmap-planering är begränsad och prioriteringar görs reaktivt.\n\nKundservice är proaktiv men saknar automation för vanliga frågor. Detta kan frigöra tid för mer värdeskapande aktiviteter."
    }
  },
  riskAssessment: {
    overallRiskLevel: "medium",
    keyRisks: [
      {
        category: "Operationell",
        description: "Beroendet av två nyckelpersoner (VD och säljchef) utan successionsplan utgör den mest kritiska risken. VD har grundat bolaget och har djupa personliga relationer med många av de största kunderna. Säljchefen ansvarar för 40% av nyförsäljningen och har unika branschrelationer. Om någon av dessa skulle lämna skulle det ha omedelbar negativ påverkan på försäljning, kundrelationer och bolagets värdering. Uppskattad värdeförlust vid abrupt bortfall: 15-25%.",
        probability: "high",
        impact: "high",
        mitigation: "Rekrytera vice VD inom 3-4 månader, dokumentera alla kundrelationer, skapa successionsplaner, implementera stay-on bonusar, etablera regelbundna kundöverlämningar. Budget: 150-200k SEK för rekrytering + 2-3 MSEK för stay-on bonusar."
      },
      {
        category: "Teknologi",
        description: "Legacy-system byggt på PHP 7.2 tappar support 2024 vilket innebär säkerhetsrisker och begränsad skalbarhet. Modernisering är nödvändig inom 12-18 månader för att undvika säkerhetsincidenter och möjliggöra internationell expansion. Estimerad kostnad: 3-5 MSEK. Säkerhetsincidenter kan leda till GDPR-böter upp till 4% av omsättning (2,7 MSEK) och skada varumärke.",
        probability: "high",
        impact: "medium",
        mitigation: "Påbörja modernisering omgående i två faser: (1) Kritiska komponenter (3 månader, 1,5 MSEK), (2) Fullständig migration (6 månader, 2-3 MSEK). Engagera säkerhetskonsult, implementera monitoring, dokumentera roadmap. Total budget: 5 MSEK."
      },
      {
        category: "Marknad",
        description: "Internationella tech-jättar börjar fokusera på denna nisch med betydligt större resurser för produktutveckling och marknadsföring. Disruptiv teknologi (AI/ML) kan göra nuvarande lösningsansats obsolet inom 3-5 år. Konsolidering bland konkurrenter skapar större och starkare konkurrenter med bredare erbjudande.",
        probability: "medium",
        impact: "high",
        mitigation: "Accelerera produktutveckling med fokus på AI/ML-funktionalitet, stärk kundlojalitet genom exceptional customer success, bygg integrations-ekosystem för att öka switching costs, överväg strategiska partnerskap eller förvärv för att stärka position."
      },
      {
        category: "Finansiell",
        description: "Kundkoncentration med top 10 kunder som står för 45% av omsättning och största kund 12% utgör en finansiell risk. Om största kunden skulle säga upp sitt avtal skulle det ha betydande påverkan på både omsättning och lönsamhet. Konjunkturnedgång kan påverka B2B-investeringsvilja och leda till längre säljcykler.",
        probability: "low",
        impact: "high",
        mitigation: "Diversifiera kundbasen genom att fokusera på mindre kunder (mål: max 8% per kund), förhandla om längre avtal med största kunden, utveckla dedikerad account management, skapa expansion opportunities, överväg kreditförsäkring. Tidsram: 6-12 månader."
      },
      {
        category: "Regulatorisk",
        description: "GDPR-brister kan ge böter upp till 4% av omsättning (2,7 MSEK) vid en incident eller revision. Regulatoriska förändringar inom dataskydd kan kräva betydande investeringar i compliance och säkerhet. Branschspecifik lagstiftning kan påverka verksamheten.",
        probability: "medium",
        impact: "low",
        mitigation: "Genomför GDPR-revision med extern konsult (budget 200-300k SEK), uppdatera alla biträdesavtal, dokumentera databehandling, implementera DPIA-processer, skapa incident response plan, utbilda personal. Tidsram: 2-3 månader."
      },
      {
        category: "Konkurrens",
        description: "Prispress från lågkostnadsalternativ, särskilt från Östeuropa och Indien, kan underminera premiumpositionering. Open source-alternativ kan erbjuda liknande funktionalitet gratis. Förändrade köpbeteenden där kunder föredrar all-in-one plattformar framför best-of-breed lösningar.",
        probability: "medium",
        impact: "medium",
        mitigation: "Fokusera på värdebaserad prissättning istället för kostnadsbaserad, differentiera genom superior customer success och integrations-ekosystem, bygg varumärke och thought leadership, överväg freemium-modell för att konkurrera med open source."
      },
      {
        category: "Organisation",
        description: "Talangbrist inom tech driver upp lönekostnader och gör rekrytering utmanande. Svag employer branding gör det svårt att attrahera senior talanger. Personalomsättning kan öka vid försäljning vilket påverkar kontinuitet.",
        probability: "medium",
        impact: "medium",
        mitigation: "Förbättra employer branding genom thought leadership och awards, skapa attraktiva incitamentsprogram, utveckla karriärvägar och utbildningsprogram, implementera retention strategies, överväg remote work för att öka talent pool."
      }
    ]
  },
  transactionGuidance: {
    optimalTiming: "Optimal tidpunkt för försäljning bedöms vara om 6-9 månader efter implementering av kritiska förbättringsåtgärder. Detta ger tid att visa förbättrad lönsamhet (+2-3% EBITDA-marginal), minskad riskprofil genom rekrytering av vice VD och påbörjad IT-modernisering, och påbörjad tillväxtresa genom quick wins. Dessa förbättringar kan höja värderingen med 15-20% (5-7 MSEK) jämfört med att sälja idag.\n\nSpecifika faktorer som motiverar denna timing:\n\n1. Finansiell förbättring: Implementering av prisoptimering och automatisering kan öka EBITDA-marginalen från 22% till 24-25% inom 3-4 månader. Detta visar köpare att bolaget har ytterligare värdeskapande potential och motiverar högre värdering.\n\n2. Riskreducering: Rekrytering av vice VD och dokumentation av kundrelationer minskar den kritiska nyckelpersonsrisken från 'hög' till 'medel', vilket är en viktig faktor för köpare. Påbörjad IT-modernisering visar framåtblickande ledning och minskar teknisk skuld.\n\n3. Marknadsmomentum: Q4 2024 och Q1 2025 är traditionellt starka perioder för M&A-transaktioner. Att komma ut på marknaden under denna period kan öka intresset och konkurrensen mellan köpare.\n\n4. Förberedelse: 6-9 månader ger tid att förbereda datarum, genomföra intern due diligence, adressera röda flaggor, och optimera finansiella siffror. Detta gör due diligence-processen smidigare och minskar risk för prisavdrag.\n\n5. Strategiska alternativ: Med förbättrad finansiell prestation och minskad risk kan bolaget attrahera både strategiska köpare (som betalar premium) och PE-fonder (som värderar på multiplar), vilket ökar konkurrensen och kan driva upp priset.\n\nRekommendation: Påbörja förberedelserna omgående med fokus på quick wins (prisoptimering, automatisering) som kan implementeras snabbt, parallellt med rekrytering av vice VD och påbörjad IT-modernisering. Mål: Vara redo för försäljning Q2-Q3 2024.",
    buyerProfile: [
      "Private Equity-fonder med branschfokus (t.ex. Nordic Capital, EQT, FSN Capital) - har kapital för IT-investering och internationell expansion, värderar på EBITDA-multiplar 8-12x, söker platformbolag för add-on förvärv, typisk hålltid 3-5 år",
      "Strategiska köpare inom närliggande vertikal som söker marknadskonsolidering (t.ex. större systemintegratörer, konsultbolag) - kan betala premium (15-25% över PE) för synergier, värderar strategiskt värde och kundbas, söker komplementära produkter eller geografisk expansion",
      "Internationella aktörer som vill etablera sig på svenska marknaden (t.ex. amerikanska eller tyska tech-bolag) - kan betala högsta premium (20-30% över PE) för marknadsentré, värderar etablerad kundbas och lokalt varumärke, söker snabb skalning",
      "Management buyout med PE-stöd givet starka kassaflöden - kan vara attraktivt om nuvarande ledning vill fortsätta, värderar kontinuitet och kundrelationer, möjliggör delägarskap för management team"
    ],
    negotiationPoints: [
      {
        topic: "Earn-out struktur",
        yourPosition: "Max 20% av köpeskillingen, 2 års period, baserat på EBITDA-mål år 1-2. Tydliga definitioner av EBITDA med carve-outs för extraordinära poster. 50/50 split mellan åren. Anti-sandbagging clauses för att skydda mot manipulation.",
        expectedCounterpart: "30-40% earn-out över 3-4 år med mer komplex struktur. Kan inkludera revenue-mål i addition till EBITDA. Kan kräva längre bindningstid för management.",
        strategy: "Visa på stabila historiska siffror och låg volatilitet i resultatet. Erbjud warranty & indemnity insurance för att minska köparens risk och därmed motivera lägre earn-out. Framhäv att 2 års period är standard för branschen. Erbjud högre upfront betalning (75% vs 70%) som kompromiss."
      },
      {
        topic: "Nyckelpersoner och stay-on",
        yourPosition: "VD stannar 12 månader med tydlig roll och ansvar. Stay-on bonus på 2 MSEK vid fullgörande. Efter 12 månader möjlighet till konsultavtal på 50% tid i 12 månader till. Säljchef stannar 18 månader med stay-on bonus 1,5 MSEK.",
        expectedCounterpart: "VD och säljchef 24-36 månader med högre stay-on bonusar. Kan kräva fulltid under hela perioden utan konsultmöjlighet. Kan kräva att båda förbinder sig till icke-konkurrensavtal på 3-5 år.",
        strategy: "Föreslå konsultavtal efter 12 månader som kompromiss - ger köparen kontinuitet men ger VD flexibilitet. Rekrytera vice VD innan försäljning för att minska beroendet. Framhäv att längre bindningstid kan påverka motivation negativt. Erbjud högre stay-on bonusar som kompromiss för kortare tid."
      },
      {
        topic: "Due diligence fynd och teknisk skuld",
        yourPosition: "Teknisk skuld är känd och prissatt i värderingen. Påbörjad modernisering visar framåtblickande ledning och minskar risk. Ingen prisavdrag motiverad.",
        expectedCounterpart: "Kräver prisreduktion för IT-investering (3-5 MSEK) eller att säljaren finansierar moderniseringen. Kan använda teknisk skuld som förhandlingskort för att driva ned priset.",
        strategy: "Visa påbörjad modernisering (fasa 1 klar eller påbörjad) före försäljning. Ge comfort letter från IT-konsult som bekräftar att moderniseringen är välplanerad och kostnadsberäknad. Framhäv att teknisk skuld är normal för bolag i denna storlek och ålder. Erbjud att dela kostnaden 50/50 som kompromiss."
      },
      {
        topic: "Rörelsekapital och locked box",
        yourPosition: "Normalized WC enligt 12-månaders snitt (8,5 MSEK) med tydlig definition. Locked box-mechanism med completion date 3 månader före signing. Ingen justering för normala säsongsvariationer.",
        expectedCounterpart: "Cherry-picking bästa månaden för WC-beräkning. Kräver completion date vid signing eller efter. Kan kräva justering för säsongsvariationer.",
        strategy: "Föreslå locked box med tydlig WC-mekanism baserat på 12-månaders snitt. Visa på stabila WC-trender över tid. Framhäv att locked box är standard för denna typ av transaktion. Erbjud att acceptera completion date vid signing om köparen accepterar normalized WC."
      },
      {
        topic: "Garantier och warranties",
        yourPosition: "Standard warranties & indemnities med 18 månaders limitation period. Specifik indemnity för pågående skatteärende (max 2 MSEK). IP warranties förstärkta givet patentens värde. Key person warranties med carve-out för redan kommunicerade risker.",
        expectedCounterpart: "24-36 månaders limitation period. Bredare warranties utan carve-outs. Kan kräva högre caps på indemnities. Kan kräva att säljaren står för alla kända risker utan begränsning.",
        strategy: "Erbjud W&I insurance för att täcka köparens risk och därmed minska krav på warranties. Framhäv att 18 månader är standard. Använd carve-outs för redan kommunicerade risker som förhandlingskort. Erbjud högre cap på specifik indemnity som kompromiss."
      },
      {
        topic: "Pris och värdering",
        yourPosition: "Värdering på 35,6 MSEK (midpoint) baserat på DCF och multipelvärdering. Motiverat av stark tillväxt (18% CAGR), hög lönsamhet (22% EBITDA), stark kassaflödeskonvertering (85%), och marknadsledande position (32% marknadsandel).",
        expectedCounterpart: "Kan argumentera för lägre värdering baserat på risker (nyckelpersoner, teknisk skuld, kundkoncentration). Kan använda lägre multiplar eller mer konservativa DCF-antaganden. Kan kräva prisavdrag för identifierade risker.",
        strategy: "Visa på förbättringar som implementerats (quick wins, rekrytering, modernisering). Framhäv unika styrkor (patent, marknadsposition, kundlojalitet). Använd multipelvärdering för att validera DCF-resultatet. Erbjud earn-out som kompromiss för att balansera risk. Behåll normal business operations för att visa fortsatt tillväxt."
      }
    ],
    dealStructure: {
      recommended: "70% kontant vid tillträde (24,9 MSEK), 20% deponerat för garantier i 18 månader (7,1 MSEK), 10% earn-out baserat på EBITDA-mål år 1-2 (3,6 MSEK). Säljaren behåller 5-10% (1,8-3,6 MSEK) för att visa continued faith och alignment of interests. Denna struktur balanserar säljarens önskan om säker exit med köparens behov av riskreducering.\n\nDetaljerad struktur:\n\n1. Kontant vid tillträde (70% = 24,9 MSEK): Betalas vid completion date, vanligtvis 2-4 veckor efter signing. Används för att betala av skulder, ge utdelning till ägare, och finansiera skatter. Detta ger säljaren omedelbar likviditet och minskar risk för köparens betalningsförmåga.\n\n2. Deponerat för garantier (20% = 7,1 MSEK): Hålls på depositionskonto i 18 månader för att täcka potentiella warranty claims och indemnities. Standard är 10-25% av köpeskillingen, så 20% är balanserat. Vid inga claims betalas detta ut efter 18 månader plus ränta.\n\n3. Earn-out (10% = 3,6 MSEK): Baserat på EBITDA-mål år 1-2. 50% betalas efter år 1 om EBITDA överstiger 16 MSEK, 50% efter år 2 om EBITDA överstiger 18 MSEK. Tydliga definitioner av EBITDA med carve-outs för extraordinära poster. Anti-sandbagging clauses för att skydda mot manipulation.\n\n4. Säljarens kvarhållande (5-10% = 1,8-3,6 MSEK): Säljaren behåller en mindre andel för att visa continued faith och alignment of interests. Detta kan öka köparens förtroende och möjliggöra högre värdering. Alternativt kan detta struktureras som management equity i köparens struktur.\n\nFördelar med denna struktur:\n- Balanserar risk mellan säljare och köpare\n- Ger säljaren omedelbar likviditet (70%)\n- Minskar köparens risk genom earn-out och deponerat\n- Alignerar intressen genom säljarens kvarhållande\n- Standard struktur som är välkänd och accepterad\n\nAlternativa strukturer att överväga:\n- 75% kontant + 15% deponerat + 10% earn-out (högre upfront)\n- 65% kontant + 25% deponerat + 10% earn-out (högre säkerhet)\n- 100% kontant (lägst risk för säljare men kan kräva lägre värdering)",
      earnOut: {
        recommended: true,
        structure: "10% av köpeskillingen (3,6 MSEK) baserat på att EBITDA överstiger 16 MSEK år 1 och 18 MSEK år 2. 50/50 split mellan åren (1,8 MSEK vardera). Tydliga definitioner av EBITDA med carve-outs för extraordinära poster, one-time costs, och synergier. Anti-sandbagging clauses för att skydda mot manipulation där köparen sänker resultatet för att undvika earn-out. Measurement date är 90 dagar efter respektive års slut för att ge tid för årsredovisning.\n\nDetaljerad earn-out struktur:\n\nÅr 1: 1,8 MSEK betalas om EBITDA överstiger 16 MSEK. Om EBITDA är mellan 14-16 MSEK betalas proportionellt (t.ex. 15 MSEK = 50% av 1,8 MSEK = 0,9 MSEK). Om EBITDA är under 14 MSEK betalas inget.\n\nÅr 2: 1,8 MSEK betalas om EBITDA överstiger 18 MSEK. Om EBITDA är mellan 16-18 MSEK betalas proportionellt. Om EBITDA är under 16 MSEK betalas inget.\n\nEBITDA-definition: Operativt resultat före räntor, skatter, avskrivningar och amorteringar. Exkluderar: (1) Extraordinära poster och one-time costs, (2) Synergier från köparens integration, (3) Förändringar i accounting policies, (4) Förändringar i kapitalstruktur, (5) Försäljning av tillgångar.\n\nSkydd för säljare:\n- Anti-sandbagging: Köparen får inte sänka resultatet för att undvika earn-out\n- Normal business operations: Köparen måste driva verksamheten normalt\n- Measurement protection: EBITDA mäts enligt nuvarande accounting policies\n- Dispute resolution: Snabb process för att lösa tvister (30 dagar)\n\nSkydd för köpare:\n- Material adverse change: Om marknaden förändras drastiskt kan earn-out justeras\n- Management performance: Earn-out är beroende av att management presterar\n- Integration costs: Köparen kan exkludera integration costs från EBITDA"
      },
      warranties: [
        "Standard warranties & indemnities med 18 månaders limitation period - täcker standard warranties för title, authority, capitalization, financial statements, taxes, compliance, litigation, environmental, employees, intellectual property, contracts, och material adverse change. Limitation period på 18 månader är standard för denna typ av transaktion och balanserar säljarens och köparens intressen.",
        "Specifik indemnity för pågående skatteärende (max 2 MSEK) - täcker potentiella skatter som kan uppstå från pågående skatteärende med Skatteverket rörande avdrag för R&D-kostnader. Cap på 2 MSEK är baserat på sannolik bedömning av potentiellt utfall. Säljaren står för detta specifikt utanför standard warranties.",
        "IP warranties förstärkta givet patentens värde - eftersom bolaget har patenterad teknologi som är central för värderingen, är IP-warranties förstärkta. Täcker att alla IP-rättigheter är ägda av bolaget, att det inte finns pågående intrång, att alla anställda har signerat IP-assignments, och att open source-användning är compliant. Limitation period kan vara längre (24-36 månader) för IP-warranties.",
        "Key person warranties med carve-out för redan kommunicerade risker - säljaren garanterar att nyckelpersoner (VD, säljchef) stannar enligt avtal, men med carve-out för redan kommunicerade risker (t.ex. om VD lämnar på grund av hälsoskäl). Detta balanserar köparens behov av kontinuitet med säljarens behov av rimliga carve-outs.",
        "Financial warranties - säljaren garanterar att finansiella statements är korrekta och kompletta, att det inte finns dolda skulder eller förpliktelser, att rörelsekapital är normaliserat, och att det inte finns extraordinära poster som inte är dokumenterade. Limitation period 18 månader.",
        "Operational warranties - säljaren garanterar att verksamheten har drivits normalt, att det inte finns material adverse changes, att alla viktiga kontrakt är i kraft, att det inte finns pågående tvister som kan påverka verksamheten, och att compliance är i ordning. Limitation period 18 månader.",
        "Environmental warranties - säljaren garanterar att det inte finns miljöproblem eller skulder, att alla tillstånd är i kraft, och att det inte finns pågående miljötvister. Viktigt för fastighetsrelaterade aspekter. Limitation period kan vara längre för environmental (24 månader)."
      ]
    }
  },
  actionPlan: {
    preSale: [
      {
        action: "Rekrytera vice VD med säljansvar och M&A-erfarenhet",
        priority: "high",
        timeframe: "3-4 månader (påbörja omgående)",
        responsibleParty: "VD med stöd av executive search-firma, budget 150-200k SEK",
        details: "Rekrytering av vice VD är den mest kritiska åtgärden för att minska nyckelpersonsrisken. Kandidaten bör ha: (1) Minst 10 års erfarenhet inom B2B-sälj, (2) Erfarenhet av M&A-processer och försäljning av bolag, (3) Förmåga att bygga och leda säljorganisationer, (4) Djup branschkunskap och nätverk, (5) Kompatibel personlighet och kulturfit. Processen bör inkludera: (1) Engagera executive search-firma med branschspecialisering, (2) Definiera tydlig rollbeskrivning och successionsplan, (3) Genomföra omfattande intervjuer med både VD och styrelse, (4) Reference checks med tidigare arbetsgivare och kollegor, (5) Kulturfit-assessment och team-intervjuer. Budget: 150-200k SEK för rekrytering + lönepaket på 1,2-1,5 MSEK/år. Tidsram: 3-4 månader från start till onboarding. Success metrics: Vice VD introducerad till top 20 kunder inom 2 månader, ansvarig för 30% av nyförsäljning inom 6 månader."
      },
      {
        action: "Påbörja IT-modernisering fas 1 (migration till modern tech stack)",
        priority: "high",
        timeframe: "Starta inom 1 månad, fas 1 klar inom 6 månader",
        responsibleParty: "CTO med extern leverantör, budget 2-3 MSEK för fas 1",
        details: "IT-modernisering är kritisk eftersom PHP 7.2 tappar support 2024. Moderniseringen bör ske i två faser för att minska risk och möjliggöra kontinuerlig drift. Fasa 1 (3 månader, 1,5 MSEK): (1) Migration av kritiska komponenter (autentisering, betalningar, databas), (2) Säkerhetsförbättringar och compliance, (3) Performance-optimering, (4) Dokumentation och testning. Fasa 2 (6 månader, 2-3 MSEK): (1) Fullständig migration till Node.js/Python backend, (2) React frontend-uppgradering, (3) PostgreSQL-databasmigration, (4) API-modernisering, (5) DevOps och CI/CD-pipeline. Processen bör inkludera: (1) Val av teknisk leverantör med referenser, (2) Detaljerad teknisk roadmap och architecture design, (3) Parallell drift under migration för att minimera disruption, (4) Omfattande testning och QA, (5) Rollback-planer för varje fas. Success metrics: Fasa 1 klar inom 3 månader utan större disruption, inga säkerhetsincidenter, förbättrad systemprestanda med 20-30%."
      },
      {
        action: "Dokumentera alla kundrelationer, kontaktpersoner och historik i CRM",
        priority: "high",
        timeframe: "2 månader",
        responsibleParty: "Säljchef med stöd av alla säljare, 20% av deras tid"
      },
      {
        action: "Implementera månadsrapportering, KPI-dashboards och rolling forecast",
        priority: "high",
        timeframe: "1 månad",
        responsibleParty: "CFO med stöd av controller, verktyg: Power BI eller Tableau"
      },
      {
        action: "Genomför omfattande GDPR-revision och uppdatera alla avtal",
        priority: "high",
        timeframe: "2-3 månader",
        responsibleParty: "Legal counsel (extern), budget 200-300k SEK"
      },
      {
        action: "Implementera value-based pricing och kommunicera till kundbasen",
        priority: "high",
        timeframe: "2 månader",
        responsibleParty: "VD och säljchef med priskonsult, budget 250k SEK"
      },
      {
        action: "Skapa detaljerad dokumentation av teknisk arkitektur och systemdesign",
        priority: "high",
        timeframe: "2 månader",
        responsibleParty: "CTO och utvecklingsteam, 15% av deras tid"
      },
      {
        action: "Implementera disaster recovery plan och testa den",
        priority: "high",
        timeframe: "1 månad",
        responsibleParty: "CTO, budget 100k SEK för backup-lösning"
      },
      {
        action: "Diversifiera kundbasen - fokusera på att växa med mindre kunder",
        priority: "medium",
        timeframe: "6 månader (kontinuerligt)",
        responsibleParty: "Säljchef, mål: max 8% per kund"
      },
      {
        action: "Lansera customer success-program för top 50 kunder",
        priority: "medium",
        timeframe: "2 månader",
        responsibleParty: "Ny customer success manager (rekrytera), budget 100k SEK för verktyg"
      },
      {
        action: "Förbättra employer branding och rekryteringsprocess",
        priority: "medium",
        timeframe: "3 månader",
        responsibleParty: "HR-ansvarig, budget 150k SEK för byrå"
      },
      {
        action: "Skapa säljträningsprogram och playbooks för alla säljare",
        priority: "medium",
        timeframe: "2 månader",
        responsibleParty: "Säljchef med extern säljcoach, budget 100k SEK"
      },
      {
        action: "Implementera BI-verktyg för datadriven beslutsfattning",
        priority: "medium",
        timeframe: "2 månader",
        responsibleParty: "CFO och CTO, budget 50k SEK + 20k/månad"
      },
      {
        action: "Förbered datarum med all dokumentation för due diligence",
        priority: "medium",
        timeframe: "1 månad (görs 2 månader före försäljning)",
        responsibleParty: "CFO med stöd av M&A-rådgivare"
      },
      {
        action: "Rekrytera produktchef för att professionalisera produktutveckling",
        priority: "low",
        timeframe: "3-4 månader",
        responsibleParty: "VD, budget 150k SEK rekrytering"
      },
      {
        action: "Utveckla go-to-market strategi för internationell expansion",
        priority: "low",
        timeframe: "2 månader",
        responsibleParty: "VD med extern konsult, budget 200k SEK"
      }
    ],
    duringNegotiation: [
      "Förbered omfattande datarum med proaktiv adressering av alla identifierade röda flaggor - skapa dokument som förklarar varje röd flagga, vad som har gjorts för att adressera den, och vad som planeras. Detta visar framåtblickande ledning och minskar risk för att köparen använder röda flaggor som förhandlingskort. Inkludera: (1) Dokumentation av alla kundrelationer, (2) Successionsplaner för nyckelpersoner, (3) IT-moderniseringsroadmap, (4) GDPR-compliance dokumentation, (5) Finansiella rapporter och prognoser.",
      "Engagera W&I (Warranty & Indemnity) insurance provider tidigt i processen - detta kan minska köparens risk och därmed motivera högre värdering och lägre krav på warranties. W&I insurance täcker köparen för warranty claims och kan kosta 1-2% av köpeskillingen. Processen tar 4-6 veckor så bör påbörjas tidigt.",
      "Behåll normal business operations och undvik churn - det är kritiskt att verksamheten fortsätter att prestera normalt under förhandlingarna. Churn eller försämrade resultat kan ge köparen anledning att sänka priset eller dra sig ur. Implementera retention strategies för top kunder, behåll fokus på försäljning, och undvik större förändringar som kan påverka resultatet negativt.",
      "Veckovisa uppdateringar till management team om förhandlingsstatus - håll teamet informerat utan att avslöja konfidentiella detaljer. Detta minskar osäkerhet och rykten som kan påverka moralen. Fokusera på positiva framsteg och nästa steg i processen.",
      "Förhandla parallellt med 2-3 parter för att skapa konkurrens - detta är kritiskt för att maximera värderingen. Konkurrens mellan köpare kan driva upp priset med 10-20%. Var transparent om att det finns flera intressenter men respektera konfidentialitet. Använd LOI (Letter of Intent) från flera parter för att skapa momentum.",
      "Förbered för due diligence med omfattande dokumentation - köparen kommer att genomföra omfattande due diligence. Förbered all dokumentation i förväg: finansiella statements, kontrakt, IP-dokumentation, HR-dokumentation, compliance-dokumentation, etc. Detta gör processen smidigare och minskar risk för avbrott eller förseningar.",
      "Hantera förhandlingsdynamik professionellt - var förberedd på hårda förhandlingar där köparen kan försöka driva ned priset eller kräva mer warranties. Håll fast vid din värdering och använd data för att motivera den. Var beredd på kompromisser men vet dina gränser. Använd M&A-rådgivare för att hantera förhandlingarna professionellt.",
      "Skydda konfidentialitet och undvik leakage - information om försäljningen kan påverka kunder, leverantörer, och anställda negativt. Implementera strikta konfidentialitetsprotokoll och informera endast när nödvändigt. Var förberedd på kommunikationsplan om information läcker ut."
    ],
    postSale: [
      "Smooth handover enligt transition services agreement (TSA) - köparen kommer att behöva stöd under övergångsperioden. TSA definierar vilka tjänster säljaren ska tillhandahålla (t.ex. IT-support, HR-support, kundservice) och under vilken period (vanligtvis 3-12 månader). Detaljera TSA tidigt i processen för att undvika förhandlingar i sista minuten. Kostnader för TSA ska täcka säljarens kostnader plus margin.",
      "Omfattande kommunikationsplan till kunder och leverantörer - informera kunder och leverantörer professionellt om försäljningen. Fokusera på kontinuitet och att inget ändras för dem. Detta minskar risk för churn eller oro. Kommunikationen bör ske samtidigt eller strax efter public announcement. Förbered Q&A-dokument för vanliga frågor.",
      "Retention program för nyckelpersoner - köparen kommer att vilja behålla nyckelpersoner. Implementera retention bonusar och tydliga karriärvägar för att säkerställa att viktiga medarbetare stannar. Detta är kritiskt för kontinuitet och för att maximera earn-out potential. Retention program kan inkludera: (1) Stay-on bonusar, (2) Karriärutveckling, (3) Equity participation, (4) Tydliga roller och ansvar.",
      "Knowledge transfer sessions dokumenterade - säkerställ att all kunskap överförs från säljare till köpare. Detta inkluderar: (1) Kundrelationer och historik, (2) Teknisk kunskap och system, (3) Processer och rutiner, (4) Branschinsikter och relationer. Dokumentera allt för att säkerställa att inget går förlorat. Knowledge transfer bör ske över 3-6 månader med regelbundna sessions.",
      "Månadsvis uppföljning av earn-out KPIs - om earn-out ingår är det kritiskt att följa upp prestationen regelbundet. Implementera månadsvisa business reviews där EBITDA och andra KPI:er diskuteras. Detta säkerställer att earn-out-målen nås och ger tid att korrigera om prestationen avviker. Använd samma accounting policies som under due diligence.",
      "Integration planning och execution - köparen kommer att vilja integrera bolaget i sin organisation. Var delaktig i integrationsplaneringen för att säkerställa smooth transition. Detta kan inkludera: (1) Systemintegration, (2) Processharmonisering, (3) Organisationsförändringar, (4) Kulturintegration. Var proaktiv men respektera köparens beslut.",
      "Post-closing support och relationship management - bygg en positiv relation med köparen även efter försäljningen. Detta kan vara värdefullt för framtida samarbeten, referenser, eller potentiella framtida transaktioner. Var tillgänglig för frågor och support under övergångsperioden men respektera att köparen nu äger bolaget."
    ]
  }
}

const tabs = [
  { id: 'overview', label: 'Översikt', icon: BarChart3 },
  { id: 'valuation', label: 'Värdering', icon: TrendingUp },
  { id: 'findings', label: 'DD-resultat', icon: Shield },
  { id: 'financials', label: 'Finansiell analys', icon: DollarSign },
  { id: 'market', label: 'Marknadsposition', icon: Globe },
  { id: 'risks', label: 'Risker', icon: AlertTriangle },
  { id: 'transaction', label: 'Förhandling', icon: Briefcase },
  { id: 'action', label: 'Handlingsplan', icon: Target }
]

function PremiumResultMockupContent() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const result = mockResult

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} MSEK`
    }
    return `${value.toLocaleString('sv-SE')} kr`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-700 bg-red-100'
      case 'medium': return 'text-yellow-700 bg-yellow-100'
      case 'low': return 'text-green-700 bg-green-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true)
    setTimeout(() => {
      setIsGeneratingPDF(false)
      alert('PDF-generering är inte tillgänglig i mockup-läge')
    }, 2000)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Main valuation box */}
            <div className="bg-gradient-to-br from-primary-navy to-primary-navy/90 p-8 rounded-2xl text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Professionell företagsvärdering</h3>
                  </div>
                  <div className="text-5xl font-bold mb-4">
                    {formatCurrency(result.valuation.range.mostLikely)}
                  </div>
                  <div className="text-xl opacity-90 mb-2">
                    Intervall: {formatCurrency(result.valuation.range.min)} - {formatCurrency(result.valuation.range.max)}
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full"
                          style={{ width: `${result.valuation.range.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">
                        {(result.valuation.range.confidence * 100).toFixed(0)}% säkerhet
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-6xl opacity-20">
                  <TrendingUp />
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-primary-navy mb-6">Sammanfattning</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {result.executiveSummary}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-gray-900">Styrkor</span>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {result.ddFindings.strengths.length}
                </div>
                <p className="text-sm text-green-600 mt-1">Identifierade</p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <span className="font-semibold text-gray-900">Röda flaggor</span>
                </div>
                <div className="text-3xl font-bold text-red-700">
                  {result.ddFindings.redFlags.length}
                </div>
                <p className="text-sm text-red-600 mt-1">Att åtgärda</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">Quick Wins</span>
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {result.ddFindings.quickWins.length}
                </div>
                <p className="text-sm text-blue-600 mt-1">Möjligheter</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Åtgärder</span>
                </div>
                <div className="text-3xl font-bold text-purple-700">
                  {result.actionPlan.preSale.length}
                </div>
                <p className="text-sm text-purple-600 mt-1">Före försäljning</p>
              </div>
            </div>
          </div>
        )

      case 'valuation':
        return (
          <div className="space-y-6">
            {/* Methodology */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsmetodik</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Primär metod</h4>
                  <p className="text-gray-700">{result.valuation.methodology.primary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sekundär metod</h4>
                  <p className="text-gray-700">{result.valuation.methodology.secondary}</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{result.valuation.methodology.explanation}</p>
              </div>
            </div>

            {/* Adjustments */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsjusteringar</h3>
              <div className="space-y-4">
                {result.valuation.adjustments.map((adj, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{adj.type}</h4>
                      <p className="text-gray-600 text-sm mt-1">{adj.reason}</p>
                    </div>
                    <div className={`font-bold text-lg ${adj.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {adj.impact > 0 ? '+' : ''}{formatCurrency(adj.impact)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projections */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-4">Värderingsprojektioner</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Scenario</th>
                      <th className="text-right py-3 px-4">År 1</th>
                      <th className="text-right py-3 px-4">År 2</th>
                      <th className="text-right py-3 px-4">År 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Bästa fall</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year1)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year2)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.bestCase.year3)}</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-primary-navy/5">
                      <td className="py-3 px-4 font-medium">Basfall</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year1)}</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year2)}</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(result.financialAnalysis.projections.baseCase.year3)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Sämsta fall</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year1)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year2)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(result.financialAnalysis.projections.worstCase.year3)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'findings':
        return (
          <div className="space-y-6">
            {/* SWOT Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Styrkor
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-green-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Svagheter
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-red-800">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Möjligheter
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-800">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h4 className="font-bold text-yellow-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Hot
                </h4>
                <ul className="space-y-2">
                  {result.ddFindings.threats.map((threat, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-yellow-800">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                Röda flaggor
              </h3>
              <div className="space-y-4">
                {result.ddFindings.redFlags.map((flag, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{flag.area}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                        {flag.severity === 'high' ? 'Hög' : flag.severity === 'medium' ? 'Medel' : 'Låg'} risk
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{flag.description}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Åtgärd:</span> {flag.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Wins */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-600" />
                Quick Wins
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.ddFindings.quickWins.map((win, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{win.action}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Påverkan:</span> {win.impact}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Tidsram:</span> {win.timeframe}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Kostnad:</span> {win.cost}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'financials':
        return (
          <div className="space-y-6">
            {/* Historical Performance */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Historisk prestation</h3>
              
              <div className="space-y-6">
                {/* Revenue Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Omsättningsanalys
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Trend</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.revenue.trend}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">CAGR</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.revenue.cagr}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-1">
                      <p className="text-sm text-gray-600">Kvalitet</p>
                      <p className="font-semibold">Hög</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">
                    {result.financialAnalysis.historicalPerformance.revenue.analysis}
                  </p>
                </div>

                {/* Profitability Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Lönsamhetsanalys
                  </h4>
                  <p className="text-gray-700">
                    {result.financialAnalysis.historicalPerformance.profitability.analysis}
                  </p>
                </div>

                {/* Cash Flow Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-purple-600" />
                    Kassaflödesanalys
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Kvalitet</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.cashFlow.quality}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Konvertering</p>
                      <p className="font-semibold text-lg">{result.financialAnalysis.historicalPerformance.cashFlow.conversion}%</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {result.financialAnalysis.historicalPerformance.cashFlow.analysis}
                  </p>
                </div>
              </div>
            </div>

            {/* Working Capital */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Rörelsekapital</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Nuvarande</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.financialAnalysis.workingCapital.current)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Optimalt</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(result.financialAnalysis.workingCapital.optimal)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Förbättringspotential</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.financialAnalysis.workingCapital.current - result.financialAnalysis.workingCapital.optimal)}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">{result.financialAnalysis.workingCapital.improvement}</p>
              </div>
            </div>
          </div>
        )

      case 'market':
        return (
          <div className="space-y-6">
            {/* Competitive Advantages */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Konkurrensfördelar</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.marketPosition.competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                    <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-green-800">{advantage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Share */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Marknadsandel</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nuvarande</p>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-primary-navy h-8 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ width: `${result.marketPosition.marketShare.current}%` }}
                      >
                        {result.marketPosition.marketShare.current}%
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Potential</p>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-green-600 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ width: `${result.marketPosition.marketShare.potential}%` }}
                      >
                        {result.marketPosition.marketShare.potential}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Analysis */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Kundanalys</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Koncentration</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.concentration}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Kvalitet</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.quality}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Retention</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.retention}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Nöjdhet</span>
                    <span className="font-semibold">{result.marketPosition.customerAnalysis.satisfaction}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'risks':
        return (
          <div className="space-y-6">
            {/* Overall Risk Level */}
            <div className={`p-6 rounded-xl border-2 ${
              result.riskAssessment.overallRiskLevel === 'high' ? 'bg-red-50 border-red-300' :
              result.riskAssessment.overallRiskLevel === 'medium' ? 'bg-yellow-50 border-yellow-300' :
              'bg-green-50 border-green-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Övergripande risknivå</h3>
                  <p className="text-gray-700">
                    Baserat på due diligence-analysen bedöms den övergripande risknivån som {' '}
                    <span className="font-semibold">
                      {result.riskAssessment.overallRiskLevel === 'high' ? 'hög' :
                       result.riskAssessment.overallRiskLevel === 'medium' ? 'medel' : 'låg'}
                    </span>
                  </p>
                </div>
                <div className={`text-5xl ${
                  result.riskAssessment.overallRiskLevel === 'high' ? 'text-red-600' :
                  result.riskAssessment.overallRiskLevel === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  <AlertTriangle />
                </div>
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Riskmatris</h3>
              <div className="space-y-4">
                {result.riskAssessment.keyRisks.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{risk.category}</h4>
                        <p className="text-gray-700 mt-1">{risk.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.probability)}`}>
                          Sannolikhet: {risk.probability === 'high' ? 'Hög' : risk.probability === 'medium' ? 'Medel' : 'Låg'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.impact)}`}>
                          Påverkan: {risk.impact === 'high' ? 'Hög' : risk.impact === 'medium' ? 'Medel' : 'Låg'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Åtgärd:</span> {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'transaction':
        return (
          <div className="space-y-6">
            {/* Optimal Timing */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-600" />
                Optimal tidpunkt för försäljning
              </h3>
              <p className="text-gray-700">{result.transactionGuidance.optimalTiming}</p>
            </div>

            {/* Buyer Profile */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Köparprofiler</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.transactionGuidance.buyerProfile.map((profile, index) => (
                  <div key={index} className="flex items-start p-4 bg-primary-navy/5 rounded-lg">
                    <Users className="w-5 h-5 text-primary-navy mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800">{profile}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Negotiation Points */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Förhandlingspunkter</h3>
              <div className="space-y-4">
                {result.transactionGuidance.negotiationPoints.map((point, index) => (
                  <div key={index} className="border-l-4 border-primary-navy pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{point.topic}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-medium text-green-900 mb-1">Din position</p>
                          <p className="text-green-800">{point.yourPosition}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded">
                          <p className="font-medium text-red-900 mb-1">Förväntad motpart</p>
                          <p className="text-red-800">{point.expectedCounterpart}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="font-medium text-blue-900 mb-1">Strategi</p>
                        <p className="text-blue-800">{point.strategy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Structure */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Rekommenderad affärsstruktur</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Struktur</h4>
                  <p className="text-gray-700">{result.transactionGuidance.dealStructure.recommended}</p>
                </div>
                
                {result.transactionGuidance.dealStructure.earnOut.recommended && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                      Earn-out
                    </h4>
                    <p className="text-gray-700">{result.transactionGuidance.dealStructure.earnOut.structure}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Garantier</h4>
                  <ul className="space-y-2">
                    {result.transactionGuidance.dealStructure.warranties.map((warranty, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{warranty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 'action':
        return (
          <div className="space-y-6">
            {/* Pre-Sale Actions */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Åtgärder före försäljning</h3>
              <div className="space-y-4">
                {result.actionPlan.preSale.map((action, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-primary-navy mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{action.action}</h4>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="text-gray-600">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {action.timeframe}
                            </span>
                            <span className="text-gray-600">
                              <Users className="w-4 h-4 inline mr-1" />
                              {action.responsibleParty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                      {action.priority === 'high' ? 'Hög prioritet' : 
                       action.priority === 'medium' ? 'Medel' : 'Låg prioritet'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* During Negotiation */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Under förhandling</h3>
              <ul className="space-y-3">
                {result.actionPlan.duringNegotiation.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <Briefcase className="w-5 h-5 text-primary-navy mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Post-Sale */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-navy mb-6">Efter försäljning</h3>
              <ul className="space-y-3">
                {result.actionPlan.postSale.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mockup Banner */}
      <div className="bg-yellow-400 text-yellow-900 px-4 py-2 text-center font-semibold">
        MOCKUP-LÄGE: Detta är exempeldata för demonstration av premium företagsvärdering
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Due diligence genomförd
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-navy/10 text-primary-navy rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    42 områden analyserade
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Professionell företagsvärdering
                </h1>
              </div>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center px-6 py-3 bg-primary-navy text-white rounded-lg hover:bg-primary-navy/90 transition-colors font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                {isGeneratingPDF ? 'Genererar rapport...' : 'Ladda ner komplett rapport'}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-px">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${activeTab === tab.id 
                      ? 'border-primary-navy text-primary-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default function PremiumResultMockup() {
  return (
    <Suspense fallback={<div>Laddar...</div>}>
      <PremiumResultMockupContent />
    </Suspense>
  )
}
