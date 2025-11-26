// Industry-specific sales process steps and tips
// Each industry has customized guidance for selling companies in that sector

export interface IndustryStepItem {
  title: string
  summary: string
  expanded: string
  stats?: { value: string; label: string; tipKey?: string; sublabel?: string }[]
  chart?: { data: number[]; label: string }
  rings?: { percent: number; label: string }[]
  timeline?: { label: string; duration: string }[]
}

export interface IndustryStep {
  id: number
  title: string
  subtitle: string
  duration: string
  fact: string
  items: IndustryStepItem[]
}

type IndustryStepsData = {
  [industryId: string]: {
    stepOverrides: {
      [stepId: number]: {
        fact?: string
        items?: Partial<IndustryStepItem>[]
      }
    }
  }
}

// Industry-specific overrides and additions for each step
export const INDUSTRY_STEPS_DATA: IndustryStepsData = {
  'it-konsult-utveckling': {
    stepOverrides: {
      1: {
        fact: 'IT-konsultbolag med dokumenterade processer säljs för 20-30% högre multiplar.',
        items: [
          {
            title: 'Dokumentera konsultportfölj och kompetens',
            summary: 'CV:n, certifieringar och specialistområden för alla konsulter.',
            expanded: 'Köpare av IT-konsultbolag värderar humankapitalet högt. Samla uppdaterade CV:n för alla konsulter med tydliga kompetensområden.\n\nDokumentera certifieringar (Microsoft, AWS, Google Cloud, etc.) och specialiseringar. Skapa en kompetensmatris som visar teamets samlade kunskap.\n\nVisa beläggningsgrad historiskt och per konsult - detta är ett nyckelmått för konsultbolags lönsamhet.',
            stats: [
              { value: '70-85%', label: 'God beläggningsgrad' },
              { value: '3-5x', label: 'Typisk multipel på EBITDA' }
            ]
          },
          {
            title: 'Strukturera pågående uppdrag och ramavtal',
            summary: 'Dokumentera alla kundavtal, timpriser och löptider.',
            expanded: 'Köpare vill se stabila intäktsströmmar. Kartlägg alla pågående uppdrag med: kund, konsult(er), timpris, uppsägningstid och löptid.\n\nSärskilt värdefulla är ramavtal med stora kunder som ger förtur vid upphandlingar. Dokumentera även volymåtaganden och pristrappar.\n\nEn konsultverksamhet med långa kundrelationer och ramavtal värderas betydligt högre än en med korta projektuppdrag.'
          },
          {
            title: 'Minska nyckelpersonberoendet i leverans',
            summary: 'Säkerställ att kunskap inte bara finns hos ägaren/grundaren.',
            expanded: 'I konsultbolag är nyckelpersonberoende extra kritiskt. Om ägaren är den som har alla kundrelationer eller är den enda seniora konsulten, minskar värdet drastiskt.\n\nBörja delegera kundansvar till andra. Se till att flera konsulter kan leverera till varje kund. Dokumentera arbetsmetoder och projektmallar.\n\nEn köpare vill se att verksamheten kan fortsätta utan grundaren.'
          }
        ]
      },
      2: {
        fact: 'IT-konsultbolag värderas ofta till 0.8-1.5x omsättning eller 4-8x EBITDA.',
        items: [
          {
            title: 'Beräkna justerat EBITDA för konsultbolag',
            summary: 'Normalisera för ägarens lön och underkonsultkostnader.',
            expanded: 'I konsultbolag är ägarens lön ofta avgörande för EBITDA. Justera för marknadsmässig lön om ägaren tar ut för lite eller för mycket.\n\nSkilj på anställda konsulter och underkonsulter - marginalen på underkonsulter är typiskt lägre. Visa EBITDA-bryggan tydligt.\n\nKöpare tittar särskilt på: debiteringsgrad, genomsnittligt timpris, andel underkonsulter och overhead-kostnader.'
          },
          {
            title: 'Värdera humankapitalet',
            summary: 'Konsulternas kompetens och lojalitet är den främsta tillgången.',
            expanded: 'Till skillnad från produktbolag har konsultbolag få materiella tillgångar. Värdet ligger i konsulterna och kundrelationerna.\n\nVisa låg personalomsättning och dokumentera retention-strategier. Identifiera vilka konsulter som är kritiska och risken att de slutar vid ägarskifte.\n\nÖverväg retention bonusar eller delägarskap för nyckelpersoner som del av transaktionen.'
          }
        ]
      },
      4: {
        items: [
          {
            title: 'Due diligence för IT-konsultbolag',
            summary: 'Fokus på konsultavtal, konkurrensklausuler och kundkoncentration.',
            expanded: 'Köparen kommer granska: anställningsavtal och konkurrensklausuler, vilka kunder som står för störst andel av intäkterna, ramavtalens villkor och löptid.\n\nSe till att alla konsulter har korrekta anställningsavtal med rimliga konkurrensklausuler. Dokumentera IP-överföringsklausuler - vem äger koden som konsulterna skriver?\n\nVanliga DD-frågor: konsulternas senioritet, timprisutveckling, kundnöjdhetsmätningar, bench-kostnader.'
          }
        ]
      }
    }
  },

  'ehandel-d2c': {
    stepOverrides: {
      1: {
        fact: 'E-handelsbolag med stark LTV/CAC-ratio får 30-50% premium vid försäljning.',
        items: [
          {
            title: 'Dokumentera enhetsekonomin (unit economics)',
            summary: 'CAC, LTV, AOV, återköpsfrekvens och marginal per order.',
            expanded: 'E-handelsköpare analyserar enhetsekonomin noggrant. Dokumentera: Customer Acquisition Cost (CAC) per kanal, Customer Lifetime Value (LTV), Average Order Value (AOV), återköpsfrekvens och kohortanalys.\n\nVisa hur marginal per order utvecklats över tid. Bryt ner kostnaderna: produktkostnad, frakt, retur, betallösning, marknadsföring.\n\nEn stark LTV/CAC-ratio (>3:1) är mycket attraktiv för köpare.',
            stats: [
              { value: '>3:1', label: 'Bra LTV/CAC-ratio' },
              { value: '<10%', label: 'Låg returgrad' }
            ]
          },
          {
            title: 'Kartlägg trafikkällor och marknadsföringskostnader',
            summary: 'Organisk vs betald trafik, ROAS per kanal.',
            expanded: 'Visa varifrån trafiken kommer: organisk sökning, betalda annonser (Google, Meta, TikTok), affiliates, email, direkt.\n\nDokumentera ROAS (Return on Ad Spend) per kanal och hur det utvecklats. Hög andel organisk trafik värderas positivt då det är mer hållbart.\n\nKöpare oroar sig för beroende av dyra betalda kanaler - visa att ni kan växa lönsamt.'
          },
          {
            title: 'Dokumentera lager och leverantörskedja',
            summary: 'Lagervärde, omsättningshastighet, leverantörsavtal.',
            expanded: 'E-handel är kapitalkrävande pga lager. Dokumentera: aktuellt lagervärde, lageromsättningshastighet, inkurant lager, säsongsvariationer.\n\nKartlägg leverantörskedjan: vilka leverantörer, ledtider, MOQ, betalningsvillkor, exklusivitetsavtal.\n\nKöpare vill förstå rörelsekapitalbehovet och risken i leverantörsberoendet.'
          }
        ]
      },
      2: {
        fact: 'E-handelsbolag värderas ofta till 2-5x EBITDA eller 0.5-2x omsättning.',
        items: [
          {
            title: 'Värdering av e-handelsbolag',
            summary: 'Multiplar baserat på tillväxt, marginal och återköpsfrekvens.',
            expanded: 'E-handelsbolag värderas primärt på EBITDA-multiplar (2-5x) men starkt växande bolag kan värderas på omsättningsmultiplar.\n\nFaktorer som höjer värderingen: hög tillväxt, stark bruttomarginal (>50%), hög återköpsfrekvens, eget varumärke vs återförsäljning, låg returgrad.\n\nFaktorer som sänker: låg marginal, högt reklamreklamationsberoende, hög kundkoncentration på en kanal.'
          },
          {
            title: 'Värdera kunddatabasen och email-listan',
            summary: 'Aktiva kunder, email-lista och sociala följare är tillgångar.',
            expanded: 'En stor, aktiv kunddatabas är en värdefull tillgång. Dokumentera: antal aktiva kunder (köpt senaste 12 mån), email-lista med öppningsgrad, sociala medier-följare.\n\nVisa hur ni segmenterar och aktiverar listan. Hög engagement = mer värde.\n\nKöpare som kan korssälja till er kundbas betalar premium.'
          }
        ]
      },
      4: {
        items: [
          {
            title: 'Due diligence för e-handel',
            summary: 'Fokus på plattform, data och leverantörsavtal.',
            expanded: 'E-handels-DD fokuserar på: teknisk plattform (Shopify, WooCommerce, egen), trafikdata (Google Analytics, Meta Pixel), leverantörsavtal, varumärkesskydd.\n\nSe till att ni äger all data - inte bara plattformen. Dokumentera alla integrationer och tredjepartsverktyg.\n\nVanliga frågor: vem äger kunddata vid flytt, finns det leverantörsavtal som kan sägas upp, hur ser returer och reklamationer ut historiskt?'
          }
        ]
      }
    }
  },

  'saas-licensmjukvara': {
    stepOverrides: {
      1: {
        fact: 'SaaS-bolag med NRR >100% värderas till 50-100% högre multiplar.',
        items: [
          {
            title: 'Dokumentera MRR/ARR och tillväxt',
            summary: 'Monthly/Annual Recurring Revenue med kohortanalys.',
            expanded: 'SaaS-bolag värderas primärt på återkommande intäkter. Dokumentera: MRR/ARR totalt och per produkt/segment, MoM och YoY tillväxt, New MRR, Expansion MRR, Churn MRR.\n\nSkapa kohortanalys som visar hur kundgrupper utvecklas över tid. Net Revenue Retention (NRR) är nyckelmåttet - visar om befintliga kunder växer.\n\nNRR >100% (expansion överväger churn) är mycket attraktivt.',
            stats: [
              { value: '>100%', label: 'Stark NRR' },
              { value: '<5%', label: 'Låg månadslig churn' }
            ]
          },
          {
            title: 'Kartlägg teknisk skuld och arkitektur',
            summary: 'Kodkvalitet, dokumentation och skalbarhet.',
            expanded: 'Köpare av SaaS-bolag gör ofta teknisk due diligence. Dokumentera: arkitekturöversikt, teknikstack, infrastrukturkostnader, utvecklingsprocesser.\n\nVar transparent om teknisk skuld - alla bolag har det. Viktigare är att ha en plan för att hantera den.\n\nVisa att produkten är skalbar: hur ökar kostnaderna när användarna ökar? Kan ni hantera 10x fler kunder?'
          },
          {
            title: 'Säkerställ IP-ägande och licensavtal',
            summary: 'Vem äger koden? Tredjepartsberoenden?',
            expanded: 'Kontrollera att bolaget verkligen äger all kod. Har anställda och konsulter skrivit under IP-avtal? Finns det open source-komponenter med restriktiva licenser?\n\nDokumentera alla tredjepartslicenser och deras villkor. Visa att ni har rätt att sälja/överlåta mjukvaran.\n\nDetta är ofta en deal-breaker - oklart IP-ägande kan stoppa en affär.'
          }
        ]
      },
      2: {
        fact: 'SaaS-bolag värderas ofta till 5-15x ARR beroende på tillväxt och churn.',
        items: [
          {
            title: 'SaaS-värdering: ARR-multiplar',
            summary: 'Värdering baseras på ARR, tillväxt, churn och NRR.',
            expanded: 'SaaS-bolag värderas på ARR-multiplar som varierar med: tillväxttakt (>50% YoY = premium), churn (<5% årlig = bra), NRR (>100% = mycket bra), gross margin (>70% = typiskt).\n\nMultiplarna har sjunkit 2022-2024 men starka bolag får fortfarande 5-15x ARR.\n\nVid lägre tillväxt används ibland EBITDA-multiplar (10-20x) istället.'
          },
          {
            title: 'Beräkna Rule of 40',
            summary: 'Tillväxt + vinstmarginal bör överstiga 40%.',
            expanded: 'Rule of 40 är en tumregel för SaaS: tillväxttakt + EBITDA-marginal bör vara >40%.\n\nExempel: 30% tillväxt + 15% EBITDA-marginal = 45% (bra). Ett bolag med 10% tillväxt behöver 30% marginal.\n\nDetta hjälper köpare jämföra bolag i olika faser och balansera tillväxt mot lönsamhet.'
          }
        ]
      },
      4: {
        items: [
          {
            title: 'Teknisk due diligence för SaaS',
            summary: 'Kodgranskning, säkerhet, skalbarhet och dokumentation.',
            expanded: 'SaaS-DD inkluderar ofta teknisk granskning: kodkvalitet och testning, säkerhet (penetrationstest, sårbarhetsscanning), skalbarhet och prestanda, utvecklingsprocesser och deployment.\n\nFörbered dokumentation av arkitektur, API:er och integrationer. Ha svar redo om GDPR-compliance, datalagring och incidenthistorik.\n\nEn smidig teknisk DD signalerar professionalism.'
          }
        ]
      }
    }
  },

  'bygg-anlaggning': {
    stepOverrides: {
      1: {
        fact: 'Byggbolag med diversifierad projektportfölj får 20-30% bättre värdering.',
        items: [
          {
            title: 'Dokumentera orderstock och projektportfölj',
            summary: 'Pågående och kommande projekt med marginaler.',
            expanded: 'Orderstocken är nyckeln till ett byggbolags värde. Dokumentera alla pågående och kontrakterade projekt: projektnamn, kontraktssumma, färdigställandegrad, förväntad marginal, slutdatum.\n\nVisa historisk projektlönsamhet - hur ofta träffar ni budgeterad marginal? Dokumentera även anbudsportföljen och hitrate.\n\nEn lång orderbok med god spridning på projekttyper och kunder är attraktiv.',
            stats: [
              { value: '12+ mån', label: 'Stark orderbok' },
              { value: '5-10%', label: 'Typisk projektmarginal' }
            ]
          },
          {
            title: 'Kartlägg garantiåtaganden och pågående arbeten',
            summary: 'Framtida garantirisker och värdering av pågående projekt.',
            expanded: 'Byggbolag har ofta omfattande garantiåtaganden. Dokumentera: alla pågående garantiperioder, historiska garantikostnader, avsättningar i balansräkningen.\n\nPågående arbeten ska värderas korrekt. Köpare kommer granska successiv vinstavräkning och risken för framtida förluster.\n\nTransparens om projekt som gått dåligt bygger förtroende.'
          },
          {
            title: 'Dokumentera maskiner, fordon och utrustning',
            summary: 'Tillgångsförteckning med värdering och underhållsstatus.',
            expanded: 'Byggbolag har ofta betydande maskinpark. Skapa en komplett förteckning: typ, årsmodell, bokfört värde, uppskattat marknadsvärde, underhållshistorik.\n\nVilka maskiner ägs vs leasas? Dokumentera leasingavtal och återstående löptider.\n\nEn välunderhållen maskinpark med känd historik är en tillgång.'
          }
        ]
      },
      2: {
        fact: 'Byggbolag värderas ofta till 3-6x EBITDA, högre med stark orderbok.',
        items: [
          {
            title: 'Värdering av byggbolag',
            summary: 'EBITDA-multipel justerad för orderbok och projektrisker.',
            expanded: 'Byggbolag värderas primärt på justerat EBITDA (3-6x). Justeringar görs för: ägarlön, engångsprojekt (bra eller dåliga), periodiseringar av pågående arbeten.\n\nOrderboken påverkar starkt - en full orderbok 18 månader fram motiverar premium.\n\nMaskinpark och fastigheter värderas ofta separat från rörelsen.'
          }
        ]
      },
      4: {
        items: [
          {
            title: 'Due diligence för byggbolag',
            summary: 'Fokus på projekt, garantier, arbetsmiljö och tillstånd.',
            expanded: 'Bygg-DD fokuserar på: detaljerad projektgenomgång (varje större projekt), garantiåtaganden och historik, arbetsmiljö och säkerhet (olycksstatistik), miljötillstånd och compliance.\n\nVanliga problemområden: underskattade garantireserver, felaktigt avräknade pågående arbeten, utestående tvister med beställare.\n\nFörbered dokumentation av alla större projekt senaste 5 åren.'
          }
        ]
      }
    }
  },

  'restaurang-cafe': {
    stepOverrides: {
      1: {
        fact: 'Restauranger med stabila hyresavtal och alkoholtillstånd värderas 30-50% högre.',
        items: [
          {
            title: 'Säkra hyresavtal och läge',
            summary: 'Överlåtbart hyresavtal är avgörande för restaurangvärdet.',
            expanded: 'Restaurangens läge är ofta dess viktigaste tillgång. Kontrollera att hyresavtalet: är överlåtbart utan hyresvärdens veto, har tillräcklig återstående löptid (minst 5 år), har rimlig hyra i förhållande till omsättning.\n\nDokumentera även möjligheter till förlängning och hyresjusteringsklausuler.\n\nEtt attraktivt läge med trygg hyressituation är grundläggande för värdet.',
            stats: [
              { value: '8-15%', label: 'Hyra av omsättning' },
              { value: '5+ år', label: 'Önskad löptid hyresavtal' }
            ]
          },
          {
            title: 'Dokumentera alkoholtillstånd och serveringsregler',
            summary: 'Tillståndshistorik och compliance är kritiskt.',
            expanded: 'Alkoholtillståndet är ofta knuten till verksamheten, inte bolaget. Kontrollera: tillståndets omfattning och villkor, serveringsansvarigs situation, historik med tillsynsmyndigheter.\n\nVid överlåtelse kan köparen behöva söka nytt tillstånd - processen tar 2-4 månader.\n\nDokumentera att verksamheten följt alla regler och undvik skäl till anmärkningar.'
          },
          {
            title: 'Kartlägg personal och schemaläggning',
            summary: 'Personalstyrka, scheman och kollektivavtalskostnader.',
            expanded: 'Restaurangbranschen är personalintensiv. Dokumentera: alla anställda med roll och anställningsform, schemaläggningssystem, kollektivavtalstillägg och OB-kostnader.\n\nVisa personalkostnad som andel av omsättning (typiskt 30-40%). Identifiera nyckelpersoner - kockar och servicepersonal som är kritiska.\n\nHög personalomsättning är en röd flagga för köpare.'
          }
        ]
      },
      2: {
        fact: 'Restauranger värderas ofta till 1.5-3x EBITDA eller baserat på omsättning.',
        items: [
          {
            title: 'Värdering av restaurangverksamhet',
            summary: 'Baserat på omsättning, läge och tillståndsituation.',
            expanded: 'Restauranger värderas ofta på omsättningsmultiplar (30-60% av årsomsättning) eller EBITDA (1.5-3x).\n\nFaktorer som höjer värdet: A-läge, stabilt hyresavtal, alkoholtillstånd, starkt varumärke, koncept som kan skalas.\n\nFaktorer som sänker: kort hyresavtal, ägarberoende i köket, låg marginal, hög personalomsättning.'
          }
        ]
      }
    }
  },

  'halsa-skonhet': {
    stepOverrides: {
      1: {
        fact: 'Skönhetssalonger med lojal kundbas och abonnemangsmodell värderas 40% högre.',
        items: [
          {
            title: 'Dokumentera kundbas och återbesöksfrekvens',
            summary: 'Kundlojalitet, bokningshistorik och kundvärde.',
            expanded: 'Kunder är huvudtillgången i skönhetsbranschen. Dokumentera: antal aktiva kunder (besökt senaste 12 mån), genomsnittlig återbesöksfrekvens, genomsnittligt kundvärde per år.\n\nVisa kundretention över tid - hur många kommer tillbaka? Dokumentera även kundbokningssystemet och dess data.\n\nEn lojal kundbas som följer terapeuter är både en tillgång och en risk.',
            stats: [
              { value: '4-6x', label: 'Besök per kund/år' },
              { value: '>70%', label: 'God retention' }
            ]
          },
          {
            title: 'Säkerställ att personal stannar vid överlåtelse',
            summary: 'Terapeuter och stylister tar ofta kunder med sig vid flytt.',
            expanded: 'Det största risken vid försäljning av salong är att personal och kunder försvinner. Skapa incitament för personal att stanna: informera tidigt och inkludera i processen, erbjud retention bonusar.\n\nDokumentera anställningsavtal - finns konkurrensbegränsningar? Överväg att låta nyckelpersoner träffa köparen tidigt.\n\nVisa för köparen att kunderna är lojala mot salongen, inte bara individer.'
          },
          {
            title: 'Inventera produkter, utrustning och varumärken',
            summary: 'Värde i lager, maskiner och eventuella egenvarumärken.',
            expanded: 'Dokumentera: produktlager med värdering, utrustning och maskiner (laser, injektioner, etc.), varumärken ni representerar och avtal.\n\nVissa behandlingar kräver certifieringar - dokumentera vilka licenser som följer med verksamheten.\n\nOm ni har egna produkter under eget varumärke, värdera dessa separat.'
          }
        ]
      },
      2: {
        fact: 'Skönhetssalonger värderas ofta till 1.5-3x EBITDA eller 30-50% av omsättning.',
        items: [
          {
            title: 'Värdering av salong och klinik',
            summary: 'Baserat på kundstock, läge och personalstabilitet.',
            expanded: 'Värderingen baseras på: justerat EBITDA (1.5-3x), alternativt 30-50% av omsättning, lägets attraktivitet och hyresavtal.\n\nPremie för: abonnemangskunder, stabilt team, starka varumärkesagenturer, medicinsk-estetiska behandlingar.\n\nAvdrag för: hög personalomsättning, kort hyresavtal, ägarberoende.'
          }
        ]
      }
    }
  },

  'gym-fitness-wellness': {
    stepOverrides: {
      1: {
        fact: 'Gym med låg churn (<5%/mån) och hög PT-andel får 30-50% premium.',
        items: [
          {
            title: 'Dokumentera medlemsdata och churn',
            summary: 'Aktiva medlemmar, churn rate och ARPM (snittintäkt per medlem).',
            expanded: 'Gym värderas på medlemsbasen. Dokumentera: totalt antal medlemmar (aktiva vs pausade), monthly churn rate, ARPM (Average Revenue Per Member), medlemskategorier och priser.\n\nVisa kohortanalys - hur länge stannar medlemmar i genomsnitt? Beräkna Customer Lifetime Value.\n\nLåg churn (<5%/mån) och hög ARPM indikerar stark verksamhet.',
            stats: [
              { value: '<5%', label: 'Bra månads-churn' },
              { value: '400-600 kr', label: 'Typisk ARPM' }
            ]
          },
          {
            title: 'Kartlägg PT och tilläggstjänster',
            summary: 'Personlig träning, gruppklasser och andra intäktsströmmar.',
            expanded: 'PT och tilläggstjänster har ofta högre marginal. Dokumentera: antal PT-timmar och intäkter, andel medlemmar som köper PT, kostnader och marginaler för PT.\n\nAndra intäktsströmmar: kostcoaching, företagsavtal, events, produktförsäljning.\n\nVisa utveckling över tid och potential att öka försäljningen av tilläggstjänster.'
          },
          {
            title: 'Dokumentera utrustning och lokalkostnader',
            summary: 'Maskinpark, underhållsbehov och hyresavtal.',
            expanded: 'Inventera all utrustning med: inköpsdatum, ursprungligt pris, uppskattat restvärde, underhållsstatus.\n\nPlanerade reinvesteringar? Utrustning åldras och kräver förnyelse var 5-10 år.\n\nHyresavtalet är kritiskt - dokumentera löptid, villkor och möjlighet till överlåtelse. Hyra bör vara <20% av omsättning.'
          }
        ]
      },
      2: {
        fact: 'Gym värderas ofta till 3-5x EBITDA eller baserat på intäkt per medlem.',
        items: [
          {
            title: 'Värdering av gym och träningsanläggningar',
            summary: 'Baserat på medlemsbas, churn och lokalsituation.',
            expanded: 'Gym värderas på EBITDA (3-5x) justerat för: medlemsutveckling, churn-trend, hyresavtalets längd, utrustningens skick.\n\nStora gym-kedjor köper ibland baserat på "per medlem"-värdering (1000-3000 kr per aktiv medlem).\n\nPremium fitness (CrossFit, boutique studios) kan få högre multiplar pga lägre churn.'
          }
        ]
      }
    }
  },

  'ekonomitjanster-redovisning': {
    stepOverrides: {
      1: {
        fact: 'Redovisningsbyråer med digitala processer och återkommande intäkter får 25% premium.',
        items: [
          {
            title: 'Dokumentera kundstock och intäktsfördelning',
            summary: 'Antal kunder, genomsnittsintäkt och avtalstyper.',
            expanded: 'Redovisningsbyråer värderas på kundstocken. Dokumentera: antal aktiva kunder, intäkt per kund, andel med fasta månadsavtal vs löpande räkning.\n\nVisa kundfördelning: hur stor andel är topp-10 kunder? Branschfördelning? Visa kundretention - hur länge stannar kunder i snitt?\n\nHög andel återkommande avtal (>70%) är attraktivt.',
            stats: [
              { value: '>70%', label: 'Fasta avtal' },
              { value: '10+ år', label: 'Typisk kundrelation' }
            ]
          },
          {
            title: 'Kartlägg personal och auktorisationer',
            summary: 'Auktoriserade redovisningskonsulter och deras kundansvar.',
            expanded: 'Personal är kritiskt. Dokumentera: antal auktoriserade konsulter, vilka kunder varje konsult ansvarar för, risk om konsulter slutar.\n\nAuktorisationer från FAR eller SRF är värdefulla. Visa kompetensutveckling och certifieringar.\n\nPlanera hur kundrelationer kan överföras - köpare vill minska nyckelpersonrisken.'
          },
          {
            title: 'Visa digitaliserings- och effektivitetsgrad',
            summary: 'Vilka system används? Hur automatiserad är processen?',
            expanded: 'Digitalisering är avgörande. Dokumentera: vilka system (Fortnox, Visma, etc.), grad av automatisering, processer för bokslut och deklarationer.\n\nVisa intäkt per konsult och hur den utvecklats. Effektiva byråer med moderna system värderas högre.\n\nKöpare söker ofta skalbarhet - kan fler kunder hanteras med samma personal?'
          }
        ]
      },
      2: {
        fact: 'Redovisningsbyråer värderas ofta till 0.8-1.2x omsättning eller 4-6x EBITDA.',
        items: [
          {
            title: 'Värdering av redovisningsbyrå',
            summary: 'Baserat på återkommande intäkter och kundkvalitet.',
            expanded: 'Multiplar: 0.8-1.2x omsättning eller 4-6x EBITDA är vanligt. Premium för: hög andel fasta avtal, stor andel digitaliserande kunder, låg kundkoncentration.\n\nÄgarbyte i byrå kräver ofta övergångsperiod där säljaren hjälper med kundrelationer. Planera för 6-12 månaders överlämning.\n\nKonsolidering i branschen gör att kedjor ofta är köpare.'
          }
        ]
      }
    }
  },

  'detaljhandel-fysisk': {
    stepOverrides: {
      1: {
        fact: 'Butikskedjor med omnikanalstrategi och kundklubb värderas 25-40% högre.',
        items: [
          {
            title: 'Dokumentera butiksportfölj och hyresavtal',
            summary: 'Varje butiks omsättning, hyresvillkor och löptid.',
            expanded: 'Skapa en översikt per butik: adress, yta, omsättning, hyra, hyresavtalets löptid och villkor.\n\nVilka butiker är lönsamma? Finns det butiker som borde stängas? Är hyresavtalen överlåtbara?\n\nKöpare analyserar butiksportföljen noggrant - var transparent om problembutiker.',
            stats: [
              { value: '10-15%', label: 'Typisk hyra av omsättning' },
              { value: '3+ år', label: 'Önskad återstående löptid' }
            ]
          },
          {
            title: 'Inventera lager och leverantörsavtal',
            summary: 'Lagervärde, omsättningshastighet och inköpsvillkor.',
            expanded: 'Lager är ofta den största tillgången. Dokumentera: totalt lagervärde, lager per butik/kategori, inkurant lager, säsongsvariationer.\n\nLeverantörsavtal: vilka är huvudleverantörerna, betalningsvillkor, rabattavtal, exklusivitetsavtal.\n\nVisa lageromsättningshastighet - snabb omsättning = mindre kapitalbindning.'
          },
          {
            title: 'Visa kundklubb och kunddata',
            summary: 'Medlemmar, köpmönster och marknadsföringsmöjligheter.',
            expanded: 'En kundklubb är en värdefull tillgång. Dokumentera: antal medlemmar, aktivitetsgrad, genomsnittligt medlemsköp vs icke-medlemmar.\n\nVisa hur ni använder kunddata för marknadsföring. GDPR-compliance för kundregistret.\n\nKöpare som kan korssälja till er kundbas betalar premium.'
          }
        ]
      },
      2: {
        fact: 'Detaljhandel värderas ofta till 2-4x EBITDA eller som substans + goodwill.',
        items: [
          {
            title: 'Värdering av detaljhandelskedja',
            summary: 'Baserat på lönsamhet, lager och butiksportfölj.',
            expanded: 'Värdering: 2-4x EBITDA är vanligt, men varierar stort. Komponenter: rörelseresultat, lagervärde (till marknadspris, ej bokfört), butikslägen/hyresavtal.\n\nFysisk handel har pressade multiplar pga e-handelshot. Premium för: unika varumärken, stark kundlojalitet, omnikanalstrategi.\n\nSubstansvärdering (tillgångar - skulder + goodwill) kan vara relevant.'
          }
        ]
      }
    }
  },

  'marknadsforing-kommunikation-pr': {
    stepOverrides: {
      1: {
        fact: 'Byråer med retainer-kunder och specialistnisch får 30-50% premium.',
        items: [
          {
            title: 'Dokumentera kundportfölj och intäktstyper',
            summary: 'Retainer vs projekt, kundkoncentration och branschspridning.',
            expanded: 'Kategorisera intäkterna: retainer/månadsavtal, projektbaserade, medieinköp (med throughput). Visa andelen återkommande intäkter.\n\nDokumentera kundkoncentration - hur stor andel är topp-5 kunder? Visa branschspridning och om ni har nischexpertis.\n\nHög andel retainer (>50%) och låg kundkoncentration (<25% hos största kund) är attraktivt.',
            stats: [
              { value: '>50%', label: 'Bra retainer-andel' },
              { value: '<25%', label: 'Max för största kund' }
            ]
          },
          {
            title: 'Kartlägg team och nyckelkompetenser',
            summary: 'Kreativa ledare, kundansvariga och specialister.',
            expanded: 'Byråer säljer kompetens. Dokumentera: teamets sammansättning och erfarenhet, vem som äger vilka kundrelationer, specialistkompetenser.\n\nIdentifiera nyckelpersoner - finns risk att de slutar vid ägarskifte? Överväg retention-avtal eller delägarskap.\n\nVisa byråns "arbeten" - case studies och utmärkelser som bevisar kvalitet.'
          },
          {
            title: 'Dokumentera arbetsprocesser och verktyg',
            summary: 'Projektmetodik, tidsrapportering och effektivitet.',
            expanded: 'Professionella processer ökar värdet. Dokumentera: projektledningsmetodik, tidsrapportering och debiteringsgrad, verktyg och plattformar.\n\nVisa debiteringsgrad per medarbetare och utveckling. Ineffektiva byråer (låg debiteringsgrad) värderas lägre.\n\nKöpare söker skalbarhet - kan processer replikeras?'
          }
        ]
      },
      2: {
        fact: 'Kommunikationsbyråer värderas ofta till 0.5-1x omsättning eller 3-6x EBITDA.',
        items: [
          {
            title: 'Värdering av kommunikationsbyrå',
            summary: 'Baserat på återkommande intäkter och teamkvalitet.',
            expanded: 'Multiplar varierar: 0.5-1x omsättning, 3-6x EBITDA. Premium för: hög retainer-andel, starka kundrelationer, nischexpertis, dokumenterade processer.\n\nByråer är svåra att värdera pga humankapitalets betydelse. Earnout är vanligt för att hantera risken att nyckelpersoner/kunder försvinner.\n\nMediabyråer med genomströmning värderas ofta lägre per omsättningskrona.'
          }
        ]
      }
    }
  }
}

// Function to get merged steps for an industry
export function getIndustrySteps(industryId: string, baseSteps: IndustryStep[]): IndustryStep[] {
  const industryData = INDUSTRY_STEPS_DATA[industryId]
  if (!industryData) return baseSteps
  
  return baseSteps.map(step => {
    const override = industryData.stepOverrides[step.id]
    if (!override) return step
    
    return {
      ...step,
      fact: override.fact || step.fact,
      items: override.items 
        ? [...(override.items as IndustryStepItem[]), ...step.items.slice(override.items.length)]
        : step.items
    }
  })
}

// Get industry-specific tip for a step
export function getIndustryTip(industryId: string, stepId: number): string | null {
  const industryData = INDUSTRY_STEPS_DATA[industryId]
  if (!industryData) return null
  
  const override = industryData.stepOverrides[stepId]
  return override?.fact || null
}

