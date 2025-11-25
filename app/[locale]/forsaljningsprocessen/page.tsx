'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

// Hide header on this page
const HideHeader = () => {
  useEffect(() => {
    const header = document.querySelector('header')
    if (header) {
      header.style.display = 'none'
    }
    return () => {
      if (header) {
        header.style.display = ''
      }
    }
  }, [])
  return null
}

const steps = [
  {
    id: 1,
    title: 'Förberedelse',
    subtitle: 'Lägg grunden för en lyckad försäljning',
    duration: '2-6 månader',
    items: [
      {
        title: 'Samla finansiell dokumentation',
        summary: 'Bokslut, resultatrapporter och prognoser för de senaste 3-5 åren.',
        expanded: 'En köpare vill se en tydlig bild av företagets ekonomiska utveckling. Samla årsredovisningar, månadsrapporter, budgetar och prognoser. Se till att alla siffror är avstämda och kan förklaras. Eventuella engångsposter eller extraordinära händelser bör dokumenteras separat med förklaringar. Ju mer transparent och välorganiserad din finansiella historik är, desto snabbare går due diligence-processen och desto högre förtroende skapas hos köparen.'
      },
      {
        title: 'Dokumentera affärsrelationer',
        summary: 'Alla kundkontrakt, leverantörsavtal och andra väsentliga affärsrelationer.',
        expanded: 'Gå igenom alla aktiva avtal och kategorisera dem efter betydelse. Identifiera vilka kunder som står för störst andel av omsättningen (kundkoncentration är en vanlig riskfaktor). Kartlägg leverantörsberoendet och eventuella exklusivitetsavtal. Dokumentera även informella överenskommelser som bör formaliseras. En köpare vill förstå hur stabila intäkterna är och vilka risker som finns i avtalsportföljen.'
      },
      {
        title: 'Minimera nyckelpersonberoende',
        summary: 'Dokumentera processer och rutiner för att minska beroendet av enskilda personer.',
        expanded: 'Nyckelpersonberoende är en av de vanligaste värdesänkande faktorerna vid företagsförsäljning. Börja med att identifiera vilka personer som är kritiska för verksamheten. Dokumentera sedan deras arbetsuppgifter, kontaktnät och beslutprocesser. Skapa manualer och rutinbeskrivningar. Överväg att bredda ansvarsfördelningen och introducera backupfunktioner. Köpare betalar premium för företag som kan drivas utan säljaren.'
      },
      {
        title: 'Städa i balansräkningen',
        summary: 'Reglera mellanhavanden med närstående och optimera rörelsekapitalet.',
        expanded: 'Gå igenom balansräkningen med kritiska ögon. Har företaget lån till ägare eller närstående? Dessa måste oftast regleras före försäljning. Finns det tillgångar som inte används i verksamheten (t.ex. fastigheter, bilar, konst)? Dessa kan behöva delas ut eller säljas separat. Optimera lagernivåer och kundfordringar för att visa ett sunt rörelsekapitalbehov. En "ren" balansräkning underlättar värderingen och förhandlingen.'
      },
      {
        title: 'Ordna juridiska dokument',
        summary: 'Bolagsordning, aktiebok, styrelsebeslut och andra formalia.',
        expanded: 'Se till att alla bolagsdokument är uppdaterade och korrekta. Aktieboken ska vara komplett och spåra alla historiska överlåtelser. Styrelsebeslut och bolagsstämmoprotokoll ska vara signerade och arkiverade. Kontrollera att eventuella ägaravtal, optionsavtal eller bonusplaner är dokumenterade. Verifiera att bolaget har alla nödvändiga tillstånd och registreringar. Juridiska brister som upptäcks sent i processen kan försena eller till och med stoppa en affär.'
      }
    ]
  },
  {
    id: 2,
    title: 'Värdering',
    subtitle: 'Fastställ ett realistiskt marknadsvärde',
    duration: '2-4 veckor',
    items: [
      {
        title: 'Professionell företagsvärdering',
        summary: 'Baserad på kassaflöde, substans och jämförbara transaktioner.',
        expanded: 'Det finns flera värderingsmetoder som kompletterar varandra. DCF-metoden (diskonterat kassaflöde) värderar framtida intjäningsförmåga. Substansvärdering fokuserar på tillgångarnas marknadsvärde. Multipelvärdering jämför med liknande transaktioner i branschen. En professionell värdering kombinerar dessa metoder och tar hänsyn till företagets specifika situation. Undvik att enbart förlita dig på enkla tumregler - varje företag är unikt.'
      },
      {
        title: 'Analysera branschens multiplar',
        summary: 'Förstå marknadstrender och köparnas förväntningar.',
        expanded: 'Olika branscher handlas till olika multiplar av omsättning eller EBITDA. Tech-bolag kan värderas till 10x EBITDA medan traditionella tjänsteföretag kanske ligger på 4-6x. Undersök vilka transaktioner som gjorts i din bransch de senaste åren. Tänk på att multiplar varierar med konjunktur, ränteläge och tillgång på kapital. Ha realistiska förväntningar baserade på faktiska marknadstransaktioner snarare än önsketänkande.'
      },
      {
        title: 'Identifiera värdeskapande faktorer',
        summary: 'Tillväxtpotential, unika tillgångar och marknadsposition.',
        expanded: 'Vad gör ditt företag unikt och attraktivt? Stark tillväxt de senaste åren motiverar en premie. Återkommande intäkter (prenumerationsmodeller, serviceavtal) värderas högre än projektbaserade intäkter. Immateriella tillgångar som varumärken, patent eller kunddata kan vara mycket värdefulla. En stark marknadsposition med inträdesbarriärer minskar risken för köparen. Dokumentera och kvantifiera dessa faktorer inför förhandlingen.'
      },
      {
        title: 'Förstå Enterprise Value vs Equity Value',
        summary: 'Hur skulder och kassa påverkar det slutliga priset.',
        expanded: 'Enterprise Value (EV) är värdet på hela verksamheten, oavsett finansiering. Equity Value är det som tillfaller aktieägarna efter att skulder dragits av och kassa lagts till. Formeln är: Equity Value = EV - Nettoskuld. Om ditt företag har stora lån minskar köpeskillingen till dig. Om företaget har överskottskassa ökar den. Förstå också hur rörelsekapitaljusteringar fungerar - köparen vill ha en "normal" nivå vid tillträdet.'
      },
      {
        title: 'Förbered prisargument',
        summary: 'Köpare värderar ofta lägre - ha tydliga argument redo.',
        expanded: 'Det är naturligt att köpare och säljare har olika syn på värdet. Förbered dig genom att dokumentera varför ditt pris är motiverat. Använd konkreta siffror: "Våra återkommande intäkter har ökat 25% per år de senaste tre åren." Visa synergier köparen kan realisera. Ha backup-argument om köparen ifrågasätter specifika poster. Var också beredd att kompromissa på struktur (t.ex. earnout) om inte pris, för att nå en överenskommelse.'
      }
    ]
  },
  {
    id: 3,
    title: 'Marknadsföring',
    subtitle: 'Nå rätt köpare på rätt sätt',
    duration: '1-3 månader',
    items: [
      {
        title: 'Skapa teaser-dokument',
        summary: 'Väck intresse utan att avslöja företagets identitet.',
        expanded: 'En teaser är ett 1-2 sidigt dokument som beskriver företaget anonymt. Inkludera bransch, geografisk marknad, ungefärlig omsättning och tillväxt, samt huvudsakliga styrkor. Syftet är att väcka intresse hos potentiella köpare utan att röja företagets identitet. Teasern skickas ut brett och de som visar intresse får signera ett NDA innan de får mer information. En bra teaser balanserar informationsgivning med sekretess.'
      },
      {
        title: 'Utveckla informationsmemorandum',
        summary: 'Detaljerad presentation med verksamhet, finansiell historik och potential.',
        expanded: 'Informationsmemorandum (IM) är säljarens huvuddokument - ofta 30-50 sidor. Det innehåller: företagets historia och verksamhetsbeskrivning, marknadsanalys, konkurrenssituation, organisation och nyckelpersoner, finansiell historik och prognoser, samt investeringsargument. IM ska vara professionellt utformat, faktabaserat och säljande utan att överdriva. En välskriven IM sparar tid och skapar förtroende hos seriösa köpare.'
      },
      {
        title: 'Identifiera potentiella köpare',
        summary: 'Strategiska köpare (konkurrenter, leverantörer) och finansiella (PE, family offices).',
        expanded: 'Det finns olika typer av köpare med olika motiv. Strategiska köpare (konkurrenter, kunder, leverantörer) söker synergier och betalar ofta högre pris. Private Equity-bolag vill växa och effektivisera för att sälja vidare. Family offices har ofta längre investeringshorisont. Privatpersoner (search funds, MBI) söker ett företag att driva själva. Analysera vilken typ av köpare som passar bäst och prioritera uppsökandet därefter.'
      },
      {
        title: 'Kontrollerad informationsprocess',
        summary: 'Stegvis informationsgivning efter signerat sekretessavtal (NDA).',
        expanded: 'En professionell försäljningsprocess är strukturerad i faser. Först skickas teaser brett. Intressenter signerar NDA och får IM. Efter analys lämnar de indikativt bud. De mest seriösa bjuds in till management-presentation och Q&A. Därefter öppnas datarum för due diligence och slutligt bud lämnas. Denna struktur skyddar känslig information och skapar konkurrens mellan köpare.'
      },
      {
        title: 'Skapa konkurrens mellan köpare',
        summary: 'Hantera flera köpare parallellt för att maximera värdet.',
        expanded: 'Att ha flera intresserade köpare är den bästa förhandlingspositionen. Det skapar tidpress, minskar köparnas förhandlingsutrymme och kan driva upp priset. Var transparent om att det finns andra intressenter utan att röja detaljer. Sätt tydliga deadlines för bud och håll alla parter informerade om tidplanen. Även om du har en favorit, behåll alternativen så länge som möjligt.'
      }
    ]
  },
  {
    id: 4,
    title: 'Due Diligence',
    subtitle: 'Köparens djupgranskning av företaget',
    duration: '4-8 veckor',
    items: [
      {
        title: 'Förbered strukturerat datarum',
        summary: 'All relevant dokumentation: finansiellt, juridiskt, kommersiellt, HR.',
        expanded: 'Ett datarum är ett digitalt (eller fysiskt) arkiv där köparen granskar all dokumentation. Organisera materialet i tydliga mappar: bolagsdokumentation, finansiellt, juridiskt/avtal, kommersiellt, personal/HR, IT, miljö, etc. Använd en professionell datarumsplattform med spårning av vem som tittat på vad. Förbered datarum i förväg - det signalerar professionalism och sparar tid under processen.'
      },
      {
        title: 'Finansiell due diligence',
        summary: 'Granskning av historisk ekonomi, intjäningskvalitet och rörelsekapital.',
        expanded: 'Köparens finansiella rådgivare granskar bokslut, månadsrapporter och budget. De analyserar intjäningskvaliteten - är vinsten hållbar eller finns engångsposter? Rörelsekapitalbehovet normaliseras för att bestämma vilken nivå som ska finnas vid tillträdet. Skulder och eventualförpliktelser kartläggs. Förbered dig på detaljerade frågor och ha förklaringar redo för avvikelser eller ovanliga poster.'
      },
      {
        title: 'Juridisk due diligence',
        summary: 'Granskning av avtal, tvister, IP-rättigheter och regulatoriska frågor.',
        expanded: 'Juristerna granskar alla väsentliga avtal: kundavtal, leverantörsavtal, anställningsavtal, hyresavtal, licensavtal. De letar efter change-of-control-klausuler som kan triggas vid försäljning. Eventuella pågående eller hotande tvister dokumenteras. Immateriella rättigheter (varumärken, patent, domäner) verifieras. Regulatoriska tillstånd och compliance kontrolleras. Juridiska problem som hittas kan påverka pris eller avtalsvillkor.'
      },
      {
        title: 'Kommersiell due diligence',
        summary: 'Analys av marknad, kunder, konkurrenter och affärsmodell.',
        expanded: 'Den kommersiella granskningen validerar affärsplanen och marknadspotentialen. Köparen kan intervjua nyckelpersoner och ibland även kunder (med säljarens godkännande). Marknadsdata verifieras mot externa källor. Konkurrenslandskapet analyseras. Kundkoncentration och churn-risk bedöms. Syftet är att bekräfta att affärsmodellen är hållbar och att tillväxtantaganden är realistiska.'
      },
      {
        title: 'Var transparent och proaktiv',
        summary: 'Överraskningar skapar misstro och kan sänka priset.',
        expanded: 'Den viktigaste regeln i DD: inga överraskningar. Om det finns skelett i garderoben, ta upp dem tidigt och på dina villkor. En köpare som upptäcker något som säljaren försökt dölja tappar förtroende och blir misstänksam mot allt annat. Var proaktiv med att förklara ovanliga poster eller händelser. Svara snabbt och professionellt på frågor. En smidig DD-process bygger förtroende och håller tidplanen.'
      }
    ]
  },
  {
    id: 5,
    title: 'Förhandling',
    subtitle: 'Enas om villkor och struktur',
    duration: '2-6 veckor',
    items: [
      {
        title: 'Förhandla köpeskilling',
        summary: 'Fast belopp, tilläggsköpeskilling (earnout) baserad på framtida resultat.',
        expanded: 'Köpeskillingen kan struktureras på olika sätt. Fast belopp vid tillträde ger säkerhet men köparen tar mer risk. Tilläggsköpeskilling (earnout) kopplar en del av priset till framtida resultat - vanligt om parterna har olika syn på värdet. Säljarrevers innebär att säljaren lånar ut en del av köpeskillingen. Fundera på vad som är viktigast för dig: maximal köpeskilling eller trygghet om kontant betalning.'
      },
      {
        title: 'Definiera transaktionsstruktur',
        summary: 'Aktieöverlåtelse eller inkråmsförsäljning, skattekonsekvenser.',
        expanded: 'Vid aktieöverlåtelse säljs aktierna och köparen tar över hela bolaget med dess historia. Vid inkråmsförsäljning säljs tillgångarna separat och köparen får ett "rent" bolag. Valet har stora skattekonsekvenser. Aktieförsäljning i fåmansbolag beskattas ofta som kapitalinkomst (delvis), medan inkråmsförsäljning kan medföra inkomstskatt i bolaget. Konsultera alltid en skatterådgivare innan du bestämmer struktur.'
      },
      {
        title: 'Diskutera garantier',
        summary: 'Vilka utfästelser lämnar säljaren och med vilka begränsningar?',
        expanded: 'Garantikatalogen är ofta en het förhandlingspunkt. Köparen vill ha breda garantier om att företaget är i gott skick. Säljaren vill begränsa sitt ansvar. Typiska garantier rör: att säljaren äger aktierna, att finansiella rapporter är korrekta, att det inte finns okända tvister, att väsentliga avtal är giltiga. Garantiernas omfattning, tidsfrister och takbelopp förhandlas. Överväg en W&I-försäkring som övertar delar av garantiansvaret.'
      },
      {
        title: 'Reglera övergångsperiod',
        summary: 'Ska säljaren stanna kvar? I vilken roll och hur länge?',
        expanded: 'Många köpare vill att säljaren stannar en period för kunskapsöverföring. Detta kan vara några månader till flera år beroende på verksamheten. Definiera tydligt: vilken roll har säljaren, vilken ersättning, vilka befogenheter, hur länge? Vad händer om samarbetet inte fungerar? Konkurrensbegränsning efter övergångsperioden? En otydlig övergångsplan skapar ofta konflikter - var specifik.'
      },
      {
        title: 'Villkor för tillträde',
        summary: 'Finansiering, myndighetsgodkännanden, nyckelpersoners kvarstående.',
        expanded: 'Closing conditions är villkor som måste uppfyllas innan affären slutförs. Vanliga villkor: köparens finansiering säkras, konkurrensmyndighetens godkännande (vid större affärer), att nyckelpersoner inte sagt upp sig, att inga väsentliga negativa förändringar skett (MAC-klausul). Ju fler villkor, desto mer osäkerhet. Förhandla om vilka villkor som är rimliga och vem som bär risken om de inte uppfylls.'
      }
    ]
  },
  {
    id: 6,
    title: 'Köpeavtal',
    subtitle: 'Juridisk formalisering av affären',
    duration: '2-4 veckor',
    items: [
      {
        title: 'Aktieöverlåtelseavtal (SPA)',
        summary: 'Huvudavtalet med alla överenskomna villkor.',
        expanded: 'Share Purchase Agreement (SPA) är det centrala juridiska dokumentet. Det innehåller: parter och bakgrund, överlåtelse av aktierna, köpeskilling och betalningsvillkor, tillträdesdag och -villkor, säljarens garantier, köparens åtaganden, ersättningsansvar, tvistlösning. SPA förhandlas intensivt mellan parternas jurister. Som säljare, fokusera på de kommersiellt viktiga punkterna och låt juristerna hantera det tekniska.'
      },
      {
        title: 'Köpeskillingens betalning',
        summary: 'Kontant vid tillträde, uppskjuten betalning, säljarrevers.',
        expanded: 'Betalningsstrukturen är en nyckelfråga. Kontant vid tillträde är enklast och säkrast för säljaren. Deponering hos tredje part (escrow) kan användas för att säkra garantiåtaganden. Uppskjuten betalning innebär att delar betalas senare - kräver säkerheter. Säljarrevers är ett lån från säljaren till köparen - medför kreditrisk. Earnout kopplar betalning till framtida resultat - kräver tydliga beräkningsregler.'
      },
      {
        title: 'Garantikatalog',
        summary: 'Vilka garantier lämnar säljaren avseende företagets skick?',
        expanded: 'Garantikatalogen är ofta en bilaga på 10-30 sidor. Den täcker typiskt: äganderätt till aktierna, bolagsdokument och organisation, finansiella rapporter, skatteförhållanden, avtal och åtaganden, anställda och pensioner, immateriella rättigheter, miljö, tvister, försäkringar. Till katalogen hör ett "disclosure letter" där säljaren anger kända undantag. Begränsningar förhandlas: takbelopp, tidsfrister, minimibelopp för anspråk.'
      },
      {
        title: 'Tilläggsköpeskilling (earnout)',
        summary: 'Beräkningsmodeller och tvistlösning.',
        expanded: 'Om earnout ingår krävs stor noggrannhet. Definiera exakt vilka mått som avgör utbetalning (omsättning, EBITDA, kundanskaffning?). Specificera redovisningsprinciper och hur måtten beräknas. Reglera säljarens insyn och möjlighet att påverka. Bestäm vad som händer om köparen integrerar verksamheten eller ändrar strategi. Inkludera en tydlig tvistlösningsmekanism. Dåligt skrivna earnout-klausuler är en vanlig källa till konflikter.'
      },
      {
        title: 'Bilagor och sidoavtal',
        summary: 'Aktiebok, arbetsordning, fullmakter, konkurrensbegränsningar.',
        expanded: 'Till SPA hör ofta ett batteri av bilagor och sidoavtal. Aktieboken visar ägandet. Arbetsordning för styrelse och VD-instruktion kan krävas. Fullmakter för registreringar. Konkurrensbegränsning för säljaren (vanligtvis 2-3 år). Tystnadsplikt. Eventuella anställningsavtal eller konsultavtal för övergångsperioden. Hyresavtal om säljaren äger lokalen. Se till att alla dokument är förberedda och koordinerade.'
      }
    ]
  },
  {
    id: 7,
    title: 'Tillträde',
    subtitle: 'Överlämning och slutförande',
    duration: '1 dag - 2 veckor',
    items: [
      {
        title: 'Slutlig verifiering',
        summary: 'Alla villkor för tillträde uppfyllda (closing conditions).',
        expanded: 'Före tillträdet görs en slutlig kontroll att alla villkor är uppfyllda. Köparens finansiering är på plats. Eventuella myndighetsgodkännanden har erhållits. Inga väsentliga negativa förändringar har skett. Nyckelpersoner har bekräftat att de stannar. En "bring-down certificate" kan krävas där säljaren bekräftar att garantierna fortfarande gäller. Om något villkor inte är uppfyllt måste parterna enas om hur det hanteras.'
      },
      {
        title: 'Aktieöverlåtelse',
        summary: 'Uppdatering av aktiebok och registrering hos Bolagsverket.',
        expanded: 'Vid tillträdet överlåts aktierna formellt. Säljaren signerar transportköp på aktiebreven (om fysiska). Aktieboken uppdateras med ny ägare. Anmälan görs till Bolagsverket om ändrad ägarstruktur och eventuellt ny styrelse. Om aktieägartillskott eller lån ska regleras sker detta samtidigt. Alla originaldokument överlämnas. En tillträdesprotokoll dokumenterar vad som hänt.'
      },
      {
        title: 'Likvidavräkning',
        summary: 'Köpeskillingen betalas mot överlämning.',
        expanded: 'Betalningen sker normalt mot simultant tillträde - aktierna överlåts när pengarna landat på säljarens konto. En closing statement visar den slutliga köpeskillingen efter eventuella justeringar för rörelsekapital, nettoskuld och andra avtalade poster. Eventuell escrow-deponering för garantier sätts upp. Om det finns earnout bekräftas beräkningsgrunder. Parterna signerar ett completion memorandum som bekräftar tillträdet.'
      },
      {
        title: 'Praktisk överlämning',
        summary: 'Nycklar, lösenord, kundkontakter, leverantörsrelationer.',
        expanded: 'Den praktiska överlämningen är minst lika viktig som den juridiska. Överför alla fysiska tillgångar: nycklar, fordon, utrustning. Dela digitala tillgångar: lösenord, admin-åtkomst, domäner, sociala medier. Introducera köparen för viktiga kontakter: nyckelpersonal, nyckelkunder, strategiska leverantörer. Var tillgänglig för frågor under övergångsperioden. En smidig överlämning ger gott samvete och minskar risken för tvist.'
      },
      {
        title: 'Övergångsperiod',
        summary: 'Stötta köparen med kunskapsöverföring.',
        expanded: 'Under övergångsperioden hjälper säljaren köparen att ta över verksamheten. Detta kan innebära dagligt arbete på plats, tillgänglighet för frågor per telefon/mejl, eller formella utbildningspass. Dokumentera den kunskap som överförs. Var professionell även om det känns konstigt att inte längre ha kontrollen. En lyckad övergång ökar chansen att eventuell earnout betalas ut och att relationen med köparen förblir god.'
      }
    ]
  }
]

export default function ForsaljningsprocessenPage() {
  const locale = useLocale()
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsAutoPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 8000)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const toggleExpand = (stepId: number, itemIdx: number) => {
    const key = `${stepId}-${itemIdx}`
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const progress = ((currentStep + 1) / steps.length) * 100
  const step = steps[currentStep]

  return (
    <div className="min-h-screen bg-gray-100">
      <HideHeader />
      {/* Pulsating dark blue background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-[#1F3C58] animate-pulse-shadow-dark"
          style={{ 
            clipPath: 'ellipse(80% 60% at 50% 40%)',
            opacity: 0.15
          }}
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:py-16">
        {/* Main white content box */}
        <div className="w-full max-w-3xl">
          {/* Pulsating shadow wrapper */}
          <div className="relative">
            {/* Pulsating dark blue shadow */}
            <div 
              className="absolute -inset-4 bg-[#1F3C58] rounded-3xl animate-pulse-shadow-dark blur-xl"
              style={{ opacity: 0.3 }}
            />
            
            {/* White content card */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#1F3C58] px-6 sm:px-10 py-8 sm:py-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Försäljningsprocessen
                </h1>
                <p className="text-white/70 text-sm sm:text-base">
                  Steg för steg guide till att sälja ditt företag
                </p>
              </div>

              {/* Progress bar */}
              <div className="px-6 sm:px-10 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1F3C58]">
                    Steg {currentStep + 1} av {steps.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progress)}% genomgången
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1F3C58] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Step navigation */}
              <div className="px-6 sm:px-10 py-4 border-b border-gray-100 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {steps.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setCurrentStep(idx)
                        setIsAutoPlaying(false)
                        setExpandedItems({})
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        idx === currentStep
                          ? 'bg-[#1F3C58] text-white'
                          : idx < currentStep
                            ? 'bg-[#1F3C58]/10 text-[#1F3C58]'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step content */}
              <div className="px-6 sm:px-10 py-8 sm:py-10">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="flex-shrink-0 w-10 h-10 bg-[#1F3C58] text-white rounded-full flex items-center justify-center text-lg font-bold">
                      {step.id}
                    </span>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1F3C58]">
                        {step.title}
                      </h2>
                      <p className="text-gray-500 text-sm">{step.subtitle}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Typisk tidsåtgång: {step.duration}
                  </div>
                </div>

                <div className="space-y-3">
                  {step.items.map((item, idx) => {
                    const key = `${step.id}-${idx}`
                    const isExpanded = expandedItems[key]
                    
                    return (
                      <div 
                        key={idx} 
                        className="border border-gray-200 rounded-xl overflow-hidden"
                        style={{
                          animation: `fadeIn 0.3s ease-out ${idx * 0.1}s both`
                        }}
                      >
                        {/* Item header - always visible */}
                        <button
                          onClick={() => toggleExpand(step.id, idx)}
                          className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-[#1F3C58]/10 text-[#1F3C58] rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#1F3C58] mb-1">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.summary}</p>
                          </div>
                          {/* Arrow */}
                          <span 
                            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#1F3C58] transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </button>
                        
                        {/* Expanded content */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-4 pb-4 pt-0">
                            <div className="pl-9 border-l-2 border-[#1F3C58]/20 ml-3">
                              <p className="text-gray-700 text-sm leading-relaxed pl-4">
                                {item.expanded}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="px-6 sm:px-10 py-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setCurrentStep(Math.max(0, currentStep - 1))
                    setIsAutoPlaying(false)
                    setExpandedItems({})
                  }}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentStep === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#1F3C58] hover:bg-[#1F3C58]/10'
                  }`}
                >
                  Föregående
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentStep(currentStep + 1)
                      setIsAutoPlaying(false)
                      setExpandedItems({})
                    }}
                    className="px-6 py-2 bg-[#1F3C58] text-white rounded-lg font-medium hover:bg-[#1F3C58]/90 transition-all"
                  >
                    Nästa steg
                  </button>
                ) : (
                  <Link
                    href={`/${locale}/analysera`}
                    className="px-6 py-2 bg-[#1F3C58] text-white rounded-lg font-medium hover:bg-[#1F3C58]/90 transition-all"
                  >
                    Analysera ditt företag
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}`}
              className="text-[#1F3C58]/70 hover:text-[#1F3C58] text-sm underline"
            >
              Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </div>

      {/* Add fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
