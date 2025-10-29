export const PROFESSIONAL_SPA_CONTENT = {
  title: "AKTIEÖVERLÅTELSEAVTAL",
  subtitle: "SHARE PURCHASE AGREEMENT",
  
  parties: {
    seller: {
      name: "Tech Founders AB",
      orgNumber: "556234-5678",
      address: "Stureplan 2, 114 35 Stockholm",
      bankAccount: "SEB 5234 12 345 67",
      representatives: "Anders Jönsson (VD)"
    },
    buyer: {
      name: "Industrikapital Partners AB", 
      orgNumber: "556100-1234",
      address: "Norrlandsgatan 15, 113 41 Stockholm",
      bankAccount: "Handelsbanken 6234 12 345 67",
      representatives: "Erik Andersson (Partner)"
    },
    target: {
      name: "TechVision AB",
      orgNumber: "556234-5678",
      address: "Stureplan 2, 114 35 Stockholm",
      shareCapital: "100,000 SEK",
      numberOfShares: 1000,
      nominalValue: "100 SEK per aktie"
    }
  },
  
  purchasePrice: {
    total: 150000000,
    breakdown: {
      cashAtClosing: 115000000,
      escrow: 20000000,
      earnout: 15000000
    },
    valuation: {
      evEbitda: "14.4x",
      evRevenue: "2.9x",
      methodology: "DCF och multipel-analys"
    }
  },
  
  sections: [
    {
      number: "1",
      title: "DEFINITIONER OCH TOLKNINGAR",
      content: [
        "1.1 I detta Avtal ska följande termer ha nedan angiven betydelse:",
        "- 'Avtalet': Detta aktieöverlåtelseavtal inklusive alla bilagor",
        "- 'Aktierna': Samtliga 1,000 utgivna aktier i Bolaget",
        "- 'Bolaget': TechVision AB, org.nr 556234-5678",
        "- 'Köpeskillingen': Det totala vederlaget om 150,000,000 SEK",
        "- 'Tillträdesdagen': Den dag då äganderätten övergår",
        "- 'Escrow-kontot': Spärrat konto hos SEB för deponering",
        "- 'Material Adverse Change': Väsentlig negativ förändring enligt definition",
        "1.2 Hänvisningar till lagar ska innefatta ändringar och ersättningslagstiftning",
        "1.3 Rubriker används endast för läsbarhet och påverkar inte tolkning"
      ]
    },
    {
      number: "2",
      title: "FÖRSÄLJNING OCH KÖP AV AKTIER",
      content: [
        "2.1 Säljaren överlåter härmed Aktierna till Köparen",
        "2.2 Köparen förvärvar härmed Aktierna från Säljaren",
        "2.3 Överlåtelsen omfattar samtliga rättigheter kopplade till Aktierna",
        "2.4 Aktierna överlåts fria från pantsättning och andra belastningar"
      ]
    },
    {
      number: "3",
      title: "KÖPESKILLING",
      content: [
        "3.1 Total köpeskilling: 150,000,000 SEK fördelat enligt:",
        "3.1.1 Kontant vid tillträde: 115,000,000 SEK (76.67%)",
        "3.1.2 Escrow-belopp: 20,000,000 SEK (13.33%)",
        "3.1.3 Tilläggsköpeskilling: Upp till 15,000,000 SEK (10%)",
        "3.2 Betalning ska ske via banköverföring till angivet konto",
        "3.3 Dröjsmålsränta enligt räntelagen vid sen betalning"
      ]
    },
    {
      number: "4",
      title: "TILLÄGGSKÖPESKILLING (EARN-OUT)",
      content: [
        "4.1 Beräkningsperiod: 3 år från Tillträdesdagen",
        "4.2 KPI-mål:",
        "- År 1: Omsättning > 55 MSEK = 5 MSEK earn-out",
        "- År 2: Omsättning > 65 MSEK = 5 MSEK earn-out",  
        "- År 3: Omsättning > 75 MSEK = 5 MSEK earn-out",
        "4.3 Beräkning baseras på reviderade årsredovisningar",
        "4.4 Köparen förbinder sig att driva Bolaget i normal omfattning",
        "4.5 Anti-avoidance: Köparen får ej avsiktligt minska omsättning"
      ]
    },
    {
      number: "5",
      title: "VILLKOR FÖR TILLTRÄDET",
      content: [
        "5.1 Följande villkor ska vara uppfyllda före Tillträdet:",
        "5.1.1 Due diligence slutförd utan väsentliga fynd",
        "5.1.2 Inga MAC-händelser har inträffat",
        "5.1.3 Nyckelpersoner har tecknat retentionsavtal",
        "5.1.4 Erforderliga myndighetssgodkännanden erhållits",
        "5.1.5 Bolagsstämmobeslut har fattats",
        "5.2 Part kan efterge villkor som är till dennes förmån"
      ]
    },
    {
      number: "6",
      title: "GARANTIER FRÅN SÄLJAREN",
      content: [
        "6.1 Äganderätt och befogenheter",
        "6.1.1 Säljaren äger Aktierna med full äganderätt",
        "6.1.2 Säljaren har full befogenhet att ingå detta Avtal",
        "6.2 Bolaget och dess verksamhet",
        "6.2.1 Bolaget är vederbörligen bildat och registrerat",
        "6.2.2 Årsredovisningar ger rättvisande bild",
        "6.2.3 Inga dolda skulder eller åtaganden",
        "6.3 Tillgångar",
        "6.3.1 Bolaget har giltig äganderätt till alla tillgångar",
        "6.3.2 Tillgångarna är i gott skick för normal användning",
        "6.4 Immateriella rättigheter",
        "6.4.1 Bolaget äger all väsentlig IP",
        "6.4.2 Ingen intrångstalan pågår eller hotar"
      ]
    },
    {
      number: "7",
      title: "SKADELÖSHÅLLANDE",
      content: [
        "7.1 Säljaren ska hålla Köparen skadelös för:",
        "7.1.1 Brott mot garantier i detta Avtal",
        "7.1.2 Skatter hänförliga till perioden före Tillträdet",
        "7.1.3 Ej redovisade skulder",
        "7.2 Ansvarsbegränsningar:",
        "7.2.1 Maximalt ansvar: 10% av Köpeskillingen (15 MSEK)",
        "7.2.2 Minimikrav per anspråk: 100,000 SEK",
        "7.2.3 Tidsbegränsning: 18 månader från Tillträdet"
      ]
    },
    {
      number: "8",
      title: "KONKURRENS- OCH VÄRVNINGSFÖRBUD",
      content: [
        "8.1 Konkurrensförbud: 3 år inom Sverige och Norge",
        "8.2 Värvningsförbud: 2 år avseende Bolagets anställda",
        "8.3 Kundförbud: 2 år avseende Bolagets kunder",
        "8.4 Vite vid överträdelse: 1 MSEK per månad"
      ]
    },
    {
      number: "9",
      title: "SEKRETESS",
      content: [
        "9.1 Konfidentiell information ska hållas hemlig",
        "9.2 Användning endast för Avtalets genomförande",
        "9.3 Gäller 5 år från undertecknandet"
      ]
    },
    {
      number: "10",
      title: "TVISTLÖSNING",
      content: [
        "10.1 Svensk rätt tillämpas",
        "10.2 Tvister löses genom skiljedom vid SCC",
        "10.3 Säte: Stockholm",
        "10.4 Språk: Svenska"
      ]
    }
  ],
  
  schedules: [
    {
      title: "BILAGA 1 - BOLAGSINFORMATION",
      content: [
        "Fullständig bolagsstruktur",
        "Lista över dotterbolag",
        "Aktiebok",
        "Bolagsordning"
      ]
    },
    {
      title: "BILAGA 2 - FINANSIELL INFORMATION",
      content: [
        "Årsredovisningar 2022-2024",
        "Management accounts",
        "Budget 2025",
        "Working capital-analys"
      ]
    },
    {
      title: "BILAGA 3 - VÄSENTLIGA AVTAL",
      content: [
        "Top 10 kundavtal",
        "Leverantörsavtal",
        "Anställningsavtal nyckelpersoner",
        "Hyresavtal"
      ]
    },
    {
      title: "BILAGA 4 - DD-RAPPORT",
      content: [
        "Legal Due Diligence",
        "Financial Due Diligence",
        "Commercial Due Diligence",
        "IT Due Diligence"
      ]
    }
  ],
  
  signatories: {
    seller: {
      name: "Anders Jönsson",
      title: "VD, Tech Founders AB",
      date: new Date().toISOString()
    },
    buyer: {
      name: "Erik Andersson", 
      title: "Partner, Industrikapital Partners AB",
      date: new Date().toISOString()
    },
    witnesses: [
      {
        name: "Anna Lindberg",
        title: "Advokat, Vinge"
      },
      {
        name: "Magnus Olsson",
        title: "Advokat, Mannheimer Swartling"
      }
    ]
  }
}
