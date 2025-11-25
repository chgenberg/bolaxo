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

// Mini bar chart component
function MiniBarChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data)
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 mb-3 font-medium">{label}</p>
      <div className="flex items-end gap-1 h-16">
        {data.map((value, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full bg-[#1F3C58] rounded-t transition-all duration-500"
              style={{ height: `${(value / max) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-[10px] text-gray-400">{idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Statistic highlight component
function StatHighlight({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
  return (
    <div className="bg-[#1F3C58]/5 border border-[#1F3C58]/10 rounded-lg p-3 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-[#1F3C58]">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
      {sublabel && <div className="text-[10px] text-gray-400 mt-0.5">{sublabel}</div>}
    </div>
  )
}

// Progress ring component
function ProgressRing({ percent, size = 60, label }: { percent: number; size?: number; label: string }) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#E5E7EB"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#1F3C58"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="text-xs text-gray-600 mt-1 text-center">{label}</span>
    </div>
  )
}

// Timeline component
function Timeline({ items }: { items: { label: string; duration: string }[] }) {
  return (
    <div className="mt-4 relative">
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-[#1F3C58]/20" />
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 pl-0">
            <div className="w-6 h-6 rounded-full bg-[#1F3C58] flex items-center justify-center text-white text-xs font-bold z-10">
              {idx + 1}
            </div>
            <div className="flex-1 flex justify-between items-center text-sm">
              <span className="text-gray-700">{item.label}</span>
              <span className="text-[#1F3C58] font-medium text-xs bg-[#1F3C58]/10 px-2 py-0.5 rounded">{item.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const steps = [
  {
    id: 1,
    title: 'Förberedelse',
    subtitle: 'Lägg grunden för en lyckad försäljning',
    duration: '2-6 månader',
    fact: 'Företag som förbereder sig i minst 12 månader får i snitt 23% högre försäljningspris.',
    items: [
      {
        title: 'Samla finansiell dokumentation',
        summary: 'Bokslut, resultatrapporter och prognoser för de senaste 3-5 åren.',
        expanded: 'En köpare vill se en tydlig bild av företagets ekonomiska utveckling. Samla årsredovisningar, månadsrapporter, budgetar och prognoser. Se till att alla siffror är avstämda och kan förklaras. Eventuella engångsposter eller extraordinära händelser bör dokumenteras separat med förklaringar. Ju mer transparent och välorganiserad din finansiella historik är, desto snabbare går due diligence-processen och desto högre förtroende skapas hos köparen.',
        stats: [
          { value: '3-5 år', label: 'Finansiell historik' },
          { value: '85%', label: 'Köpare kräver bokslut' }
        ]
      },
      {
        title: 'Dokumentera affärsrelationer',
        summary: 'Alla kundkontrakt, leverantörsavtal och andra väsentliga affärsrelationer.',
        expanded: 'Gå igenom alla aktiva avtal och kategorisera dem efter betydelse. Identifiera vilka kunder som står för störst andel av omsättningen (kundkoncentration är en vanlig riskfaktor). Kartlägg leverantörsberoendet och eventuella exklusivitetsavtal. Dokumentera även informella överenskommelser som bör formaliseras. En köpare vill förstå hur stabila intäkterna är och vilka risker som finns i avtalsportföljen.',
        chart: { data: [30, 25, 15, 12, 8, 5, 5], label: 'Typisk kundkoncentration (% av omsättning per kund)' }
      },
      {
        title: 'Minimera nyckelpersonberoende',
        summary: 'Dokumentera processer och rutiner för att minska beroendet av enskilda personer.',
        expanded: 'Nyckelpersonberoende är en av de vanligaste värdesänkande faktorerna vid företagsförsäljning. Börja med att identifiera vilka personer som är kritiska för verksamheten. Dokumentera sedan deras arbetsuppgifter, kontaktnät och beslutprocesser. Skapa manualer och rutinbeskrivningar. Överväg att bredda ansvarsfördelningen och introducera backupfunktioner. Köpare betalar premium för företag som kan drivas utan säljaren.',
        stats: [
          { value: '-15%', label: 'Värdeminskning vid högt beroende' },
          { value: '67%', label: 'Affärer misslyckas pga nyckelperson' }
        ]
      },
      {
        title: 'Städa i balansräkningen',
        summary: 'Reglera mellanhavanden med närstående och optimera rörelsekapitalet.',
        expanded: 'Gå igenom balansräkningen med kritiska ögon. Har företaget lån till ägare eller närstående? Dessa måste oftast regleras före försäljning. Finns det tillgångar som inte används i verksamheten (t.ex. fastigheter, bilar, konst)? Dessa kan behöva delas ut eller säljas separat. Optimera lagernivåer och kundfordringar för att visa ett sunt rörelsekapitalbehov. En "ren" balansräkning underlättar värderingen och förhandlingen.',
        rings: [
          { percent: 75, label: 'Reglera lån' },
          { percent: 60, label: 'Optimera lager' },
          { percent: 85, label: 'Rensa poster' }
        ]
      },
      {
        title: 'Ordna juridiska dokument',
        summary: 'Bolagsordning, aktiebok, styrelsebeslut och andra formalia.',
        expanded: 'Se till att alla bolagsdokument är uppdaterade och korrekta. Aktieboken ska vara komplett och spåra alla historiska överlåtelser. Styrelsebeslut och bolagsstämmoprotokoll ska vara signerade och arkiverade. Kontrollera att eventuella ägaravtal, optionsavtal eller bonusplaner är dokumenterade. Verifiera att bolaget har alla nödvändiga tillstånd och registreringar. Juridiska brister som upptäcks sent i processen kan försena eller till och med stoppa en affär.',
        timeline: [
          { label: 'Aktiebok uppdaterad', duration: '1 vecka' },
          { label: 'Protokoll arkiverade', duration: '2 veckor' },
          { label: 'Tillstånd verifierade', duration: '1-2 veckor' },
          { label: 'Ägaravtal granskade', duration: '1 vecka' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Värdering',
    subtitle: 'Fastställ ett realistiskt marknadsvärde',
    duration: '2-4 veckor',
    fact: 'Svenska SMB säljs typiskt för 3-6x EBITDA, men tech-bolag kan nå 10-15x.',
    items: [
      {
        title: 'Professionell företagsvärdering',
        summary: 'Baserad på kassaflöde, substans och jämförbara transaktioner.',
        expanded: 'Det finns flera värderingsmetoder som kompletterar varandra. DCF-metoden (diskonterat kassaflöde) värderar framtida intjäningsförmåga. Substansvärdering fokuserar på tillgångarnas marknadsvärde. Multipelvärdering jämför med liknande transaktioner i branschen. En professionell värdering kombinerar dessa metoder och tar hänsyn till företagets specifika situation. Undvik att enbart förlita dig på enkla tumregler - varje företag är unikt.',
        stats: [
          { value: 'DCF', label: 'Kassaflödesvärdering' },
          { value: 'Multipel', label: 'Jämförande värdering' },
          { value: 'Substans', label: 'Tillgångsvärdering' }
        ]
      },
      {
        title: 'Analysera branschens multiplar',
        summary: 'Förstå marknadstrender och köparnas förväntningar.',
        expanded: 'Olika branscher handlas till olika multiplar av omsättning eller EBITDA. Tech-bolag kan värderas till 10x EBITDA medan traditionella tjänsteföretag kanske ligger på 4-6x. Undersök vilka transaktioner som gjorts i din bransch de senaste åren. Tänk på att multiplar varierar med konjunktur, ränteläge och tillgång på kapital. Ha realistiska förväntningar baserade på faktiska marknadstransaktioner snarare än önsketänkande.',
        chart: { data: [4, 5, 6, 8, 10, 12, 15], label: 'EBITDA-multiplar per bransch (Tjänst → Tech)' }
      },
      {
        title: 'Identifiera värdeskapande faktorer',
        summary: 'Tillväxtpotential, unika tillgångar och marknadsposition.',
        expanded: 'Vad gör ditt företag unikt och attraktivt? Stark tillväxt de senaste åren motiverar en premie. Återkommande intäkter (prenumerationsmodeller, serviceavtal) värderas högre än projektbaserade intäkter. Immateriella tillgångar som varumärken, patent eller kunddata kan vara mycket värdefulla. En stark marknadsposition med inträdesbarriärer minskar risken för köparen. Dokumentera och kvantifiera dessa faktorer inför förhandlingen.',
        rings: [
          { percent: 90, label: 'Tillväxt' },
          { percent: 75, label: 'Återk. intäkter' },
          { percent: 60, label: 'IP/Patent' }
        ]
      },
      {
        title: 'Förstå Enterprise Value vs Equity Value',
        summary: 'Hur skulder och kassa påverkar det slutliga priset.',
        expanded: 'Enterprise Value (EV) är värdet på hela verksamheten, oavsett finansiering. Equity Value är det som tillfaller aktieägarna efter att skulder dragits av och kassa lagts till. Formeln är: Equity Value = EV - Nettoskuld. Om ditt företag har stora lån minskar köpeskillingen till dig. Om företaget har överskottskassa ökar den. Förstå också hur rörelsekapitaljusteringar fungerar - köparen vill ha en "normal" nivå vid tillträdet.',
        stats: [
          { value: 'EV', label: 'Enterprise Value', sublabel: 'Totalt verksamhetsvärde' },
          { value: '−', label: 'Nettoskuld', sublabel: 'Skulder minus kassa' },
          { value: '=', label: 'Equity Value', sublabel: 'Värde för ägare' }
        ]
      },
      {
        title: 'Förbered prisargument',
        summary: 'Köpare värderar ofta lägre - ha tydliga argument redo.',
        expanded: 'Det är naturligt att köpare och säljare har olika syn på värdet. Förbered dig genom att dokumentera varför ditt pris är motiverat. Använd konkreta siffror: "Våra återkommande intäkter har ökat 25% per år de senaste tre åren." Visa synergier köparen kan realisera. Ha backup-argument om köparen ifrågasätter specifika poster. Var också beredd att kompromissa på struktur (t.ex. earnout) om inte pris, för att nå en överenskommelse.',
        chart: { data: [100, 85, 75, 70, 80, 95], label: 'Typisk prisförhandling (Ägarens ask → Slutpris över tid)' }
      }
    ]
  },
  {
    id: 3,
    title: 'Marknadsföring',
    subtitle: 'Nå rätt köpare på rätt sätt',
    duration: '1-3 månader',
    fact: '78% av framgångsrika försäljningar involverar minst 3 seriösa köpare i processen.',
    items: [
      {
        title: 'Skapa teaser-dokument',
        summary: 'Väck intresse utan att avslöja företagets identitet.',
        expanded: 'En teaser är ett 1-2 sidigt dokument som beskriver företaget anonymt. Inkludera bransch, geografisk marknad, ungefärlig omsättning och tillväxt, samt huvudsakliga styrkor. Syftet är att väcka intresse hos potentiella köpare utan att röja företagets identitet. Teasern skickas ut brett och de som visar intresse får signera ett NDA innan de får mer information. En bra teaser balanserar informationsgivning med sekretess.',
        stats: [
          { value: '1-2', label: 'Sidor i teaser' },
          { value: '50+', label: 'Potentiella köpare' },
          { value: '10-15%', label: 'Svarsfrekvens' }
        ]
      },
      {
        title: 'Utveckla informationsmemorandum',
        summary: 'Detaljerad presentation med verksamhet, finansiell historik och potential.',
        expanded: 'Informationsmemorandum (IM) är säljarens huvuddokument - ofta 30-50 sidor. Det innehåller: företagets historia och verksamhetsbeskrivning, marknadsanalys, konkurrenssituation, organisation och nyckelpersoner, finansiell historik och prognoser, samt investeringsargument. IM ska vara professionellt utformat, faktabaserat och säljande utan att överdriva. En välskriven IM sparar tid och skapar förtroende hos seriösa köpare.',
        timeline: [
          { label: 'Verksamhetsbeskrivning', duration: '5-10 sidor' },
          { label: 'Marknadsanalys', duration: '5-8 sidor' },
          { label: 'Finansiell historik', duration: '10-15 sidor' },
          { label: 'Investeringscase', duration: '5-10 sidor' }
        ]
      },
      {
        title: 'Identifiera potentiella köpare',
        summary: 'Strategiska köpare (konkurrenter, leverantörer) och finansiella (PE, family offices).',
        expanded: 'Det finns olika typer av köpare med olika motiv. Strategiska köpare (konkurrenter, kunder, leverantörer) söker synergier och betalar ofta högre pris. Private Equity-bolag vill växa och effektivisera för att sälja vidare. Family offices har ofta längre investeringshorisont. Privatpersoner (search funds, MBI) söker ett företag att driva själva. Analysera vilken typ av köpare som passar bäst och prioritera uppsökandet därefter.',
        rings: [
          { percent: 45, label: 'Strategiska' },
          { percent: 30, label: 'PE/VC' },
          { percent: 25, label: 'Privata' }
        ]
      },
      {
        title: 'Kontrollerad informationsprocess',
        summary: 'Stegvis informationsgivning efter signerat sekretessavtal (NDA).',
        expanded: 'En professionell försäljningsprocess är strukturerad i faser. Först skickas teaser brett. Intressenter signerar NDA och får IM. Efter analys lämnar de indikativt bud. De mest seriösa bjuds in till management-presentation och Q&A. Därefter öppnas datarum för due diligence och slutligt bud lämnas. Denna struktur skyddar känslig information och skapar konkurrens mellan köpare.',
        chart: { data: [100, 40, 20, 10, 5, 3, 1], label: 'Försäljningstratt: Kontaktade → Slutlig köpare' }
      },
      {
        title: 'Skapa konkurrens mellan köpare',
        summary: 'Hantera flera köpare parallellt för att maximera värdet.',
        expanded: 'Att ha flera intresserade köpare är den bästa förhandlingspositionen. Det skapar tidpress, minskar köparnas förhandlingsutrymme och kan driva upp priset. Var transparent om att det finns andra intressenter utan att röja detaljer. Sätt tydliga deadlines för bud och håll alla parter informerade om tidplanen. Även om du har en favorit, behåll alternativen så länge som möjligt.',
        stats: [
          { value: '+15-25%', label: 'Högre pris med konkurrens' },
          { value: '3-5', label: 'Optimalt antal budgivare' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Due Diligence',
    subtitle: 'Köparens djupgranskning av företaget',
    duration: '4-8 veckor',
    fact: '40% av alla M&A-affärer får prisjusteringar efter due diligence.',
    items: [
      {
        title: 'Förbered strukturerat datarum',
        summary: 'All relevant dokumentation: finansiellt, juridiskt, kommersiellt, HR.',
        expanded: 'Ett datarum är ett digitalt (eller fysiskt) arkiv där köparen granskar all dokumentation. Organisera materialet i tydliga mappar: bolagsdokumentation, finansiellt, juridiskt/avtal, kommersiellt, personal/HR, IT, miljö, etc. Använd en professionell datarumsplattform med spårning av vem som tittat på vad. Förbered datarum i förväg - det signalerar professionalism och sparar tid under processen.',
        stats: [
          { value: '200-500', label: 'Dokument i typiskt datarum' },
          { value: '8-12', label: 'Huvudkategorier' }
        ]
      },
      {
        title: 'Finansiell due diligence',
        summary: 'Granskning av historisk ekonomi, intjäningskvalitet och rörelsekapital.',
        expanded: 'Köparens finansiella rådgivare granskar bokslut, månadsrapporter och budget. De analyserar intjäningskvaliteten - är vinsten hållbar eller finns engångsposter? Rörelsekapitalbehovet normaliseras för att bestämma vilken nivå som ska finnas vid tillträdet. Skulder och eventualförpliktelser kartläggs. Förbered dig på detaljerade frågor och ha förklaringar redo för avvikelser eller ovanliga poster.',
        rings: [
          { percent: 85, label: 'Intjäning' },
          { percent: 70, label: 'Rörelsekapital' },
          { percent: 90, label: 'Skulder' }
        ]
      },
      {
        title: 'Juridisk due diligence',
        summary: 'Granskning av avtal, tvister, IP-rättigheter och regulatoriska frågor.',
        expanded: 'Juristerna granskar alla väsentliga avtal: kundavtal, leverantörsavtal, anställningsavtal, hyresavtal, licensavtal. De letar efter change-of-control-klausuler som kan triggas vid försäljning. Eventuella pågående eller hotande tvister dokumenteras. Immateriella rättigheter (varumärken, patent, domäner) verifieras. Regulatoriska tillstånd och compliance kontrolleras. Juridiska problem som hittas kan påverka pris eller avtalsvillkor.',
        timeline: [
          { label: 'Avtalsgranskning', duration: '2-3 veckor' },
          { label: 'IP-verifiering', duration: '1-2 veckor' },
          { label: 'Compliance-check', duration: '1-2 veckor' },
          { label: 'Tvistanalys', duration: '1 vecka' }
        ]
      },
      {
        title: 'Kommersiell due diligence',
        summary: 'Analys av marknad, kunder, konkurrenter och affärsmodell.',
        expanded: 'Den kommersiella granskningen validerar affärsplanen och marknadspotentialen. Köparen kan intervjua nyckelpersoner och ibland även kunder (med säljarens godkännande). Marknadsdata verifieras mot externa källor. Konkurrenslandskapet analyseras. Kundkoncentration och churn-risk bedöms. Syftet är att bekräfta att affärsmodellen är hållbar och att tillväxtantaganden är realistiska.',
        chart: { data: [20, 35, 55, 70, 85, 90], label: 'Köparens förtroende under DD-processen (%)' }
      },
      {
        title: 'Var transparent och proaktiv',
        summary: 'Överraskningar skapar misstro och kan sänka priset.',
        expanded: 'Den viktigaste regeln i DD: inga överraskningar. Om det finns skelett i garderoben, ta upp dem tidigt och på dina villkor. En köpare som upptäcker något som säljaren försökt dölja tappar förtroende och blir misstänksam mot allt annat. Var proaktiv med att förklara ovanliga poster eller händelser. Svara snabbt och professionellt på frågor. En smidig DD-process bygger förtroende och håller tidplanen.',
        stats: [
          { value: '72h', label: 'Max svarstid på frågor' },
          { value: '0', label: 'Överraskningar (målet)' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Förhandling',
    subtitle: 'Enas om villkor och struktur',
    duration: '2-6 veckor',
    fact: '65% av svenska företagsförsäljningar inkluderar någon form av tilläggsköpeskilling.',
    items: [
      {
        title: 'Förhandla köpeskilling',
        summary: 'Fast belopp, tilläggsköpeskilling (earnout) baserad på framtida resultat.',
        expanded: 'Köpeskillingen kan struktureras på olika sätt. Fast belopp vid tillträde ger säkerhet men köparen tar mer risk. Tilläggsköpeskilling (earnout) kopplar en del av priset till framtida resultat - vanligt om parterna har olika syn på värdet. Säljarrevers innebär att säljaren lånar ut en del av köpeskillingen. Fundera på vad som är viktigast för dig: maximal köpeskilling eller trygghet om kontant betalning.',
        rings: [
          { percent: 70, label: 'Kontant' },
          { percent: 20, label: 'Earnout' },
          { percent: 10, label: 'Revers' }
        ]
      },
      {
        title: 'Definiera transaktionsstruktur',
        summary: 'Aktieöverlåtelse eller inkråmsförsäljning, skattekonsekvenser.',
        expanded: 'Vid aktieöverlåtelse säljs aktierna och köparen tar över hela bolaget med dess historia. Vid inkråmsförsäljning säljs tillgångarna separat och köparen får ett "rent" bolag. Valet har stora skattekonsekvenser. Aktieförsäljning i fåmansbolag beskattas ofta som kapitalinkomst (delvis), medan inkråmsförsäljning kan medföra inkomstskatt i bolaget. Konsultera alltid en skatterådgivare innan du bestämmer struktur.',
        stats: [
          { value: '85%', label: 'Aktieöverlåtelser' },
          { value: '15%', label: 'Inkråmsförsäljningar' }
        ]
      },
      {
        title: 'Diskutera garantier',
        summary: 'Vilka utfästelser lämnar säljaren och med vilka begränsningar?',
        expanded: 'Garantikatalogen är ofta en het förhandlingspunkt. Köparen vill ha breda garantier om att företaget är i gott skick. Säljaren vill begränsa sitt ansvar. Typiska garantier rör: att säljaren äger aktierna, att finansiella rapporter är korrekta, att det inte finns okända tvister, att väsentliga avtal är giltiga. Garantiernas omfattning, tidsfrister och takbelopp förhandlas. Överväg en W&I-försäkring som övertar delar av garantiansvaret.',
        chart: { data: [10, 15, 20, 18, 12, 8, 5], label: 'Garantianspråk över tid (% av affärer per år efter tillträde)' }
      },
      {
        title: 'Reglera övergångsperiod',
        summary: 'Ska säljaren stanna kvar? I vilken roll och hur länge?',
        expanded: 'Många köpare vill att säljaren stannar en period för kunskapsöverföring. Detta kan vara några månader till flera år beroende på verksamheten. Definiera tydligt: vilken roll har säljaren, vilken ersättning, vilka befogenheter, hur länge? Vad händer om samarbetet inte fungerar? Konkurrensbegränsning efter övergångsperioden? En otydlig övergångsplan skapar ofta konflikter - var specifik.',
        timeline: [
          { label: 'Intensiv överlämning', duration: '1-3 mån' },
          { label: 'Rådgivande roll', duration: '3-6 mån' },
          { label: 'Tillgänglig vid behov', duration: '6-12 mån' },
          { label: 'Konkurrensbegränsning', duration: '2-3 år' }
        ]
      },
      {
        title: 'Villkor för tillträde',
        summary: 'Finansiering, myndighetsgodkännanden, nyckelpersoners kvarstående.',
        expanded: 'Closing conditions är villkor som måste uppfyllas innan affären slutförs. Vanliga villkor: köparens finansiering säkras, konkurrensmyndighetens godkännande (vid större affärer), att nyckelpersoner inte sagt upp sig, att inga väsentliga negativa förändringar skett (MAC-klausul). Ju fler villkor, desto mer osäkerhet. Förhandla om vilka villkor som är rimliga och vem som bär risken om de inte uppfylls.',
        stats: [
          { value: '95%', label: 'Affärer med villkor' },
          { value: '30-60', label: 'Dagar till tillträde' }
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Köpeavtal',
    subtitle: 'Juridisk formalisering av affären',
    duration: '2-4 veckor',
    fact: 'Ett genomsnittligt aktieöverlåtelseavtal (SPA) är 40-80 sidor långt.',
    items: [
      {
        title: 'Aktieöverlåtelseavtal (SPA)',
        summary: 'Huvudavtalet med alla överenskomna villkor.',
        expanded: 'Share Purchase Agreement (SPA) är det centrala juridiska dokumentet. Det innehåller: parter och bakgrund, överlåtelse av aktierna, köpeskilling och betalningsvillkor, tillträdesdag och -villkor, säljarens garantier, köparens åtaganden, ersättningsansvar, tvistlösning. SPA förhandlas intensivt mellan parternas jurister. Som säljare, fokusera på de kommersiellt viktiga punkterna och låt juristerna hantera det tekniska.',
        stats: [
          { value: '40-80', label: 'Sidor i SPA' },
          { value: '15-25', label: 'Garantiklausuler' },
          { value: '10-20', label: 'Bilagor' }
        ]
      },
      {
        title: 'Köpeskillingens betalning',
        summary: 'Kontant vid tillträde, uppskjuten betalning, säljarrevers.',
        expanded: 'Betalningsstrukturen är en nyckelfråga. Kontant vid tillträde är enklast och säkrast för säljaren. Deponering hos tredje part (escrow) kan användas för att säkra garantiåtaganden. Uppskjuten betalning innebär att delar betalas senare - kräver säkerheter. Säljarrevers är ett lån från säljaren till köparen - medför kreditrisk. Earnout kopplar betalning till framtida resultat - kräver tydliga beräkningsregler.',
        rings: [
          { percent: 80, label: 'Vid tillträde' },
          { percent: 15, label: 'Escrow' },
          { percent: 5, label: 'Uppskjutet' }
        ]
      },
      {
        title: 'Garantikatalog',
        summary: 'Vilka garantier lämnar säljaren avseende företagets skick?',
        expanded: 'Garantikatalogen är ofta en bilaga på 10-30 sidor. Den täcker typiskt: äganderätt till aktierna, bolagsdokument och organisation, finansiella rapporter, skatteförhållanden, avtal och åtaganden, anställda och pensioner, immateriella rättigheter, miljö, tvister, försäkringar. Till katalogen hör ett "disclosure letter" där säljaren anger kända undantag. Begränsningar förhandlas: takbelopp, tidsfrister, minimibelopp för anspråk.',
        timeline: [
          { label: 'Generella garantier', duration: '2-3 år' },
          { label: 'Skattegarantier', duration: '5-7 år' },
          { label: 'Äganderättsgaranti', duration: 'Obegränsad' },
          { label: 'Tak: % av köpeskilling', duration: '10-50%' }
        ]
      },
      {
        title: 'Tilläggsköpeskilling (earnout)',
        summary: 'Beräkningsmodeller och tvistlösning.',
        expanded: 'Om earnout ingår krävs stor noggrannhet. Definiera exakt vilka mått som avgör utbetalning (omsättning, EBITDA, kundanskaffning?). Specificera redovisningsprinciper och hur måtten beräknas. Reglera säljarens insyn och möjlighet att påverka. Bestäm vad som händer om köparen integrerar verksamheten eller ändrar strategi. Inkludera en tydlig tvistlösningsmekanism. Dåligt skrivna earnout-klausuler är en vanlig källa till konflikter.',
        chart: { data: [0, 20, 50, 80, 100], label: 'Typisk earnout-utbetalning över tid (% efter år)' }
      },
      {
        title: 'Bilagor och sidoavtal',
        summary: 'Aktiebok, arbetsordning, fullmakter, konkurrensbegränsningar.',
        expanded: 'Till SPA hör ofta ett batteri av bilagor och sidoavtal. Aktieboken visar ägandet. Arbetsordning för styrelse och VD-instruktion kan krävas. Fullmakter för registreringar. Konkurrensbegränsning för säljaren (vanligtvis 2-3 år). Tystnadsplikt. Eventuella anställningsavtal eller konsultavtal för övergångsperioden. Hyresavtal om säljaren äger lokalen. Se till att alla dokument är förberedda och koordinerade.',
        stats: [
          { value: '10-20', label: 'Bilagor till SPA' },
          { value: '2-3 år', label: 'Konkurrensbegränsning' }
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Tillträde',
    subtitle: 'Överlämning och slutförande',
    duration: '1 dag - 2 veckor',
    fact: 'Efter tillträdet stannar 70% av säljarna kvar i någon form under minst 6 månader.',
    items: [
      {
        title: 'Slutlig verifiering',
        summary: 'Alla villkor för tillträde uppfyllda (closing conditions).',
        expanded: 'Före tillträdet görs en slutlig kontroll att alla villkor är uppfyllda. Köparens finansiering är på plats. Eventuella myndighetsgodkännanden har erhållits. Inga väsentliga negativa förändringar har skett. Nyckelpersoner har bekräftat att de stannar. En "bring-down certificate" kan krävas där säljaren bekräftar att garantierna fortfarande gäller. Om något villkor inte är uppfyllt måste parterna enas om hur det hanteras.',
        rings: [
          { percent: 100, label: 'Finansiering' },
          { percent: 100, label: 'Godkännanden' },
          { percent: 100, label: 'Garantier' }
        ]
      },
      {
        title: 'Aktieöverlåtelse',
        summary: 'Uppdatering av aktiebok och registrering hos Bolagsverket.',
        expanded: 'Vid tillträdet överlåts aktierna formellt. Säljaren signerar transportköp på aktiebreven (om fysiska). Aktieboken uppdateras med ny ägare. Anmälan görs till Bolagsverket om ändrad ägarstruktur och eventuellt ny styrelse. Om aktieägartillskott eller lån ska regleras sker detta samtidigt. Alla originaldokument överlämnas. En tillträdesprotokoll dokumenterar vad som hänt.',
        timeline: [
          { label: 'Signera transportköp', duration: '1 timme' },
          { label: 'Uppdatera aktiebok', duration: '1 timme' },
          { label: 'Bolagsverket', duration: '1-5 dagar' },
          { label: 'Överlämna dokument', duration: '1 dag' }
        ]
      },
      {
        title: 'Likvidavräkning',
        summary: 'Köpeskillingen betalas mot överlämning.',
        expanded: 'Betalningen sker normalt mot simultant tillträde - aktierna överlåts när pengarna landat på säljarens konto. En closing statement visar den slutliga köpeskillingen efter eventuella justeringar för rörelsekapital, nettoskuld och andra avtalade poster. Eventuell escrow-deponering för garantier sätts upp. Om det finns earnout bekräftas beräkningsgrunder. Parterna signerar ett completion memorandum som bekräftar tillträdet.',
        stats: [
          { value: 'T+0', label: 'Betalning vid tillträde' },
          { value: '10-20%', label: 'Typisk escrow' }
        ]
      },
      {
        title: 'Praktisk överlämning',
        summary: 'Nycklar, lösenord, kundkontakter, leverantörsrelationer.',
        expanded: 'Den praktiska överlämningen är minst lika viktig som den juridiska. Överför alla fysiska tillgångar: nycklar, fordon, utrustning. Dela digitala tillgångar: lösenord, admin-åtkomst, domäner, sociala medier. Introducera köparen för viktiga kontakter: nyckelpersonal, nyckelkunder, strategiska leverantörer. Var tillgänglig för frågor under övergångsperioden. En smidig överlämning ger gott samvete och minskar risken för tvist.',
        rings: [
          { percent: 100, label: 'Fysiskt' },
          { percent: 100, label: 'Digitalt' },
          { percent: 100, label: 'Relationer' }
        ]
      },
      {
        title: 'Övergångsperiod',
        summary: 'Stötta köparen med kunskapsöverföring.',
        expanded: 'Under övergångsperioden hjälper säljaren köparen att ta över verksamheten. Detta kan innebära dagligt arbete på plats, tillgänglighet för frågor per telefon/mejl, eller formella utbildningspass. Dokumentera den kunskap som överförs. Var professionell även om det känns konstigt att inte längre ha kontrollen. En lyckad övergång ökar chansen att eventuell earnout betalas ut och att relationen med köparen förblir god.',
        chart: { data: [100, 80, 50, 30, 15, 5], label: 'Säljarens engagemang över tid (% timmar per månad)' }
      }
    ]
  }
]

export default function ForsaljningsprocessenPage() {
  const locale = useLocale()
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

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

      <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-16">
        {/* Main white content box */}
        <div className="w-full max-w-3xl">
          {/* Pulsating shadow wrapper */}
          <div className="relative">
            {/* Pulsating dark blue shadow */}
            <div 
              className="absolute -inset-2 sm:-inset-4 bg-[#1F3C58] rounded-2xl sm:rounded-3xl animate-pulse-shadow-dark blur-xl"
              style={{ opacity: 0.3 }}
            />
            
            {/* White content card */}
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#1F3C58] px-4 sm:px-10 py-6 sm:py-10">
                <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                  Försäljningsprocessen
                </h1>
                <p className="text-white/70 text-xs sm:text-base">
                  Steg för steg guide till att sälja ditt företag
                </p>
              </div>

              {/* Progress bar */}
              <div className="px-4 sm:px-10 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-[#1F3C58]">
                    Steg {currentStep + 1} av {steps.length}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1F3C58] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Step navigation - scrollable on mobile */}
              <div className="px-4 sm:px-10 py-3 sm:py-4 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1.5 sm:gap-2 min-w-max">
                  {steps.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setCurrentStep(idx)
                        setExpandedItems({})
                      }}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
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
              <div className="px-4 sm:px-10 py-6 sm:py-10">
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#1F3C58] text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold">
                      {step.id}
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold text-[#1F3C58]">
                        {step.title}
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm">{step.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                    <span className="text-gray-400">
                      Tidsåtgång: {step.duration}
                    </span>
                  </div>
                  {/* Fact box */}
                  <div className="mt-3 sm:mt-4 p-3 bg-[#1F3C58]/5 border-l-4 border-[#1F3C58] rounded-r-lg">
                    <p className="text-xs sm:text-sm text-[#1F3C58] font-medium">
                      {step.fact}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {step.items.map((item, idx) => {
                    const key = `${step.id}-${idx}`
                    const isExpanded = expandedItems[key]
                    
                    return (
                      <div 
                        key={idx} 
                        className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden"
                        style={{
                          animation: `fadeIn 0.3s ease-out ${idx * 0.1}s both`
                        }}
                      >
                        {/* Item header - always visible */}
                        <button
                          onClick={() => toggleExpand(step.id, idx)}
                          className="w-full flex items-start gap-2 sm:gap-3 p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#1F3C58]/10 text-[#1F3C58] rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#1F3C58] text-sm sm:text-base mb-0.5 sm:mb-1">{item.title}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.summary}</p>
                          </div>
                          {/* Arrow */}
                          <span 
                            className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[#1F3C58] transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </button>
                        
                        {/* Expanded content */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-3 sm:px-4 pb-4 pt-0">
                            <div className="pl-7 sm:pl-9 border-l-2 border-[#1F3C58]/20 ml-2.5 sm:ml-3">
                              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed pl-3 sm:pl-4 mb-4">
                                {item.expanded}
                              </p>
                              
                              {/* Stats */}
                              {item.stats && (
                                <div className={`pl-3 sm:pl-4 grid gap-2 sm:gap-3 ${item.stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                  {item.stats.map((stat, statIdx) => (
                                    <StatHighlight key={statIdx} {...stat} />
                                  ))}
                                </div>
                              )}
                              
                              {/* Chart */}
                              {item.chart && (
                                <div className="pl-3 sm:pl-4">
                                  <MiniBarChart data={item.chart.data} label={item.chart.label} />
                                </div>
                              )}
                              
                              {/* Rings */}
                              {item.rings && (
                                <div className="pl-3 sm:pl-4 mt-4">
                                  <div className="flex justify-around gap-2">
                                    {item.rings.map((ring, ringIdx) => (
                                      <ProgressRing key={ringIdx} percent={ring.percent} label={ring.label} size={50} />
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Timeline */}
                              {item.timeline && (
                                <div className="pl-3 sm:pl-4">
                                  <Timeline items={item.timeline} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="px-4 sm:px-10 py-4 sm:py-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setCurrentStep(Math.max(0, currentStep - 1))
                    setExpandedItems({})
                  }}
                  disabled={currentStep === 0}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                      setExpandedItems({})
                    }}
                    className="px-4 sm:px-6 py-2 bg-[#1F3C58] text-white rounded-lg text-sm font-medium hover:bg-[#1F3C58]/90 transition-all"
                  >
                    Nästa steg
                  </button>
                ) : (
                  <Link
                    href={`/${locale}/analysera`}
                    className="px-4 sm:px-6 py-2 bg-[#1F3C58] text-white rounded-lg text-sm font-medium hover:bg-[#1F3C58]/90 transition-all"
                  >
                    Analysera ditt företag
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href={`/${locale}`}
              className="text-[#1F3C58]/70 hover:text-[#1F3C58] text-xs sm:text-sm underline"
            >
              Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </div>

      {/* Add animations and hide scrollbar */}
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

