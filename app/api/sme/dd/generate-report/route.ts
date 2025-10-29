import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Create a comprehensive DD Report PDF
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R 30 0 R 31 0 R 32 0 R] /Count 4 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj

4 0 obj
<< /Length 4000 >>
stream
BT
/F2 32 Tf
50 730 Td
(DUE DILIGENCE) Tj
0 -40 Td
(RAPPORT) Tj

0 -50 Td
/F1 14 Tf
(Foretagsbesiktning - M&A Transaction) Tj

0 -60 Td
/F2 16 Tf
(TechVision AB) Tj

0 -30 Td
/F1 12 Tf
(Organisationsnummer: 556234-5678) Tj
0 -25 Td
(Kopare: Industrikapital Partners AB) Tj
0 -25 Td
(DD-ledare: Erik Andersson, Senior Partner) Tj
0 -25 Td
(Startdatum: 2024-10-01) Tj
0 -25 Td
(Slutfort: 2024-10-28) Tj
0 -25 Td
(Rapport upprattad: 2024-10-29) Tj

0 -60 Td
/F2 14 Tf
(VERKSTALLANDE SAMMANFATTNING) Tj

0 -35 Td
/F1 11 Tf
(OVERGRIPANDE RISKNIVA) Tj
0 -25 Td
(MEDIUM - Genomfor forvarvvet med fokuserade riskmilderande atgarder) Tj

0 -40 Td
/F1 11 Tf
(OVERGRIPANDE REKOMMENDATION) Tj

0 -25 Td
(Genomfor forvarvvet. Kritiska atgarder:) Tj
0 -20 Td
(1. Retentions-bonus for CTO och Head of Sales under 2-arsperioden) Tj
0 -20 Td
(2. Intensiv kunddiversifieringsplan for att reducera Top-3 beroende) Tj
0 -20 Td
(3. 6-manaders IT-moderniseringsplan fran legacy-system till cloud) Tj
0 -20 Td
(4. Succession planning for nyckelpositioner genomforas omedelbar) Tj

0 -40 Td
/F2 14 Tf
(TRE VIKTIGASTE RISKERNA) Tj

0 -35 Td
/F1 11 Tf
(HOGE RISK) Tj
0 -20 Td
(1. Kundberoende - 35 procent av omsattningen kommer fran 3 storre kunder) Tj
0 -20 Td
(   Top-kund: Televerket (18 procent av omsattningen)) Tj
0 -20 Td
(   Konsekvens: Utgaende kunders potentiella "change of control"-klausuler) Tj

0 -30 Td
(MEDIUM RISK) Tj
0 -20 Td
(2. Teknisk skuld - Legacy-system behover modernisering fran on-prem till cloud) Tj
0 -20 Td
(   Estimerad moderniseringskostnad: 200-300 KSEK) Tj
0 -20 Td
(   Timeline: 3-4 manader) Tj

0 -30 Td
(MEDIUM RISK) Tj
0 -20 Td
(3. Nyckelpersoberoende - CTO ager 5 procent och Head of Sales ar huvudkontakt) Tj
0 -20 Td
(   Successionsplan: Ej dokmenterad) Tj
0 -20 Td
(   Atgarder: Retention-bonus och accelererad succession-planing) Tj

0 -40 Td
/F2 14 Tf
(FINANSIELL SAMMANFATTNING) Tj

0 -30 Td
/F1 11 Tf
(Omsattning 2024: 52.0 MSEK) Tj
0 -20 Td
(EBITDA 2024: 10.4 MSEK (20 procent marginal)) Tj
0 -20 Td
(Tillvaxt CAGR 2021-2024: 45 procent) Tj
0 -20 Td
(Tillvaxttrend: Fortsatt positiv) Tj

0 -30 Td
(Finansiella foljander:) Tj
0 -20 Td
(- Sjunkande marginaler: EBITDA-marginal sjunkit fran 28 procent till 22 procent) Tj
0 -20 Td
(- Arbetskap italberoende: Krav pa ca 2 MSEK arbetande kapital for skalning) Tj
0 -20 Td
(- Skatteffektivitet: Utnyttar ej fullt R&D-skattelattningar (500-800 KSEK potential)) Tj

0 -40 Td
/F2 14 Tf
(JURIDISK SAMMANFATTNING) Tj

0 -30 Td
/F1 11 Tf
(Kritiska juridiska fynd:) Tj
0 -20 Td
(- 8 av 15 storre kundkontrakt kraver notification vid agarskifte) Tj
0 -20 Td
(- 3 kontrakt har "change of control"-klausul som kan trigga uppsagning) Tj
0 -20 Td
(- All IP ar korrekt dokumenterad som bolagets egendom) Tj
0 -20 Td
(- En mindre leverantorskonflikt pa ca 300 KSEK under forkliking) Tj

0 -40 Td
/F2 14 Tf
(COMMERCIAL ASSESSMENT) Tj

0 -30 Td
/F1 11 Tf
(Marknadsposition: STRONG) Tj
0 -20 Td
(- Marknadsledande position inom molnbaserade affarsystemer for medelstora foretag) Tj
0 -20 Td
(- Brand recognition: Mycket hog bland target-kunder) Tj
0 -20 Td
(- Konkurrenstryck: 2 nya konkurrenter enterat marknaden 2024) Tj

0 -30 Td
(Tillvaxtpotential: EXCELLENT) Tj
0 -20 Td
(- SaaS-expansionsmojlighet: Marknad varderad till 2-3 BSEK i Norden) Tj
0 -20 Td
(- Estimerad potential recurring revenue: Kunde oka vardering 2-3x) Tj
0 -20 Td
(- Rekommenderad timeline: Beta-lansering SaaS-produkt Q3 2025) Tj

ET
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj

30 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 33 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj

31 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 34 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj

32 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 35 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj

33 0 obj
<< /Length 2000 >>
stream
BT
/F2 14 Tf
50 750 Td
(PERSONALANALYS) Tj

0 -30 Td
/F1 11 Tf
(Organisationsstruktur) Tj
0 -25 Td
(- CEO & Founder: Anders Jonsson (8 ar)] Tj
0 -20 Td
(- CTO & Co-founder: Sofia Bergstrom (8 ar, ager 5 procent)) Tj
0 -20 Td
(- Head of Sales: Magnus Eriksson (4 ar, kontakt for 40 procent av kunder)) Tj
0 -20 Td
(- Senior Developers: 3 personer med 4-7 ars tenure) Tj
0 -20 Td
(- Junior Developers: 2 personer anstallda 2024) Tj

0 -35 Td
(KRITISKA FYND:) Tj
0 -25 Td
(HIGH RISK - Nyckelpersonalberoende) Tj
0 -20 Td
(- CTO och Head of Sales ar kritiska for affarsverksamhet) Tj
0 -20 Td
(- Ingen successionsplan dokumenterad) Tj
0 -20 Td
(- ATGARDER: Retention-bonus 2 ar, succession-planing start omedelbar) Tj

0 -30 Td
(MEDIUM RISK - Loner under marknad) Tj
0 -20 Td
(- Loner ligger 8-12 procent under marknadsgrad) Tj
0 -20 Td
(- Risk for poaching post-acquisition) Tj
0 -20 Td
(- ATGARDER: Budget 10-15 procent loneoke for key-talent (ca 500 KSEK arligen)) Tj

0 -30 Td
(LOW RISK - Stabil organisation) Tj
0 -20 Td
(- Genomsnittlig tenure bland anstallda: 5.2 ar) Tj
0 -20 Td
(- Inget signifikant turnover-problema) Tj

0 -50 Td
/F2 14 Tf
(IT & INFRASTRUKTUR) Tj

0 -30 Td
/F1 11 Tf
(HIGH RISK - Infrastruktur modernisering) Tj
0 -25 Td
(- Hosting pa on-premise servrar fran 2016 (INTE skalbar for tillvaxt)) Tj
0 -20 Td
(- Modern tech-stack (Node.js, React, Postgres) men gammal infrastruktur) Tj
0 -20 Td
(- Migration till cloud (AWS/Azure) kraves innan storskalig tillvaxt) Tj
0 -20 Td
(- Estimerad migration-kostnad: 200-300 KSEK) Tj
0 -20 Td
(- Estimerad timeline: 3-4 manader) Tj

0 -35 Td
(MEDIUM RISK - Data Security) Tj
0 -20 Td
(- GDPR-compliance implementerat men saknar SOC2 Type II-certifiering) Tj
0 -20 Td
(- Inga formell penetration testing genomforda) Tj
0 -20 Td
(- ATGARDER: Implementera SOC2 Type II certification (kostnad ca 150 KSEK)) Tj

0 -35 Td
(LOW RISK - Backup & Disaster Recovery) Tj
0 -20 Td
(- Backup-rutiner finns med 24-timmar RTO) Tj
0 -20 Td
(- Acceptabelt for nuvarande kundkritikalitet) Tj
0 -20 Td
(- Rekommendation: Implementera 4-timmar RTO post-acquisition) Tj

ET
endstream
endobj

34 0 obj
<< /Length 1500 >>
stream
BT
/F2 14 Tf
50 750 Td
(SKATTE- OCH REGELEFTERLEVNAD) Tj

0 -30 Td
/F1 11 Tf
(Skattestatus: COMPLIANT) Tj
0 -25 Td
(- Bolaget ar skattemassigt korrekt klassificerat) Tj
0 -20 Td
(- All rapportering ar up-to-date) Tj
0 -20 Td
(- Inga pagaende skatterevisioner eller tvister) Tj

0 -35 Td
(Vardeskatteserver) Tj
0 -25 Td
(- Reserverna motsvarar ca 15 procent av vinsten (NORMAL)) Tj
0 -20 Td
(- Ingen risk for vardeskattskuld) Tj

0 -35 Td
(R&D-skattelattningar) Tj
0 -25 Td
(- Bolaget utnytjar INTE fullt ut mojliga R&D-skattelattningar) Tj
0 -20 Td
(- Potentiell skatteaterbackning: 500-800 KSEK over 3 ar) Tj
0 -20 Td
(- REKOMMENDATION: Engagera specialiserad skattekonsiliar omedelbar) Tj

0 -50 Td
/F2 14 Tf
(MILJOMASSIG ANALYS) Tj

0 -30 Td
/F1 11 Tf
(LOW RISK - Minimal miljopaverk) Tj
0 -25 Td
(- IT-tjanstefore - ingen fysisk produktion) Tj
0 -20 Td
(- Miljopaverk begransad till energiforbrukning fran servrar) Tj
0 -20 Td
(- REKOMMENDATION: Implementera green IT-policy post-acquisition) Tj

0 -60 Td
/F2 14 Tf
(TRANSAKTIONSREKOMMENDATION) Tj

0 -30 Td
/F1 11 Tf
(REKOMMENDATION: GENOMFOR FORVARVVET) Tj

0 -25 Td
(Handlingsplan for integration:) Tj
0 -20 Td
(1. Saljare retention-bonus: Anders, Sofia, Magnus (2-ar earn-out)) Tj
0 -20 Td
(2. Cloud-migration: 3-4 manader implementering innan skalning) Tj
0 -20 Td
(3. Kunddiversifiering: Fasus pa kundexpansion for att reducera Top-3 risk) Tj
0 -20 Td
(4. IT-modernisering: SOC2 certification + infrastructure upgrade) Tj
0 -20 Td
(5. Succession planning: Immediate dokumentation av nyckelroller) Tj

0 -50 Td
/F1 9 Tf
(Denna rapport ar konfidentiell och avsedd endast for auktoriserade mottagare.) Tj
0 -15 Td
(Den bygggar pa befintlig dokumentation och intervjuer. Fullstandig framtidsprognos) Tj
0 -15 Td
(kan inte garanteras.) Tj

0 -30 Td
(Rapport upprattad av: Erik Andersson, Senior Partner) Tj
0 -15 Td
(Datum: 2024-10-29) Tj

ET
endstream
endobj

35 0 obj
<< /Length 1000 >>
stream
BT
/F2 14 Tf
50 750 Td
(AVSLUTANDE KOMMENTARER) Tj

0 -40 Td
/F1 11 Tf
(Styrkor med TechVision AB:) Tj
0 -25 Td
(+ Stark marknadsposition med god brand recognition) Tj
0 -20 Td
(+ Stabil och erfaren ledningsgrupp) Tj
0 -20 Td
(+ Solid tillvaxt: 45 procent CAGR 2021-2024) Tj
0 -20 Td
(+ Modern tech-stack med potential for SaaS-expansion) Tj
0 -20 Td
(+ Marginalkompression identifierad men adresserbar) Tj

0 -40 Td
/F1 11 Tf
(Huvudsakliga risker:) Tj
0 -25 Td
(- Kundberoende (35 procent fran 3 storre kunder)) Tj
0 -20 Td
(- Infrastruktur modernisering kraves) Tj
0 -20 Td
(- Nyckelpersoberoende (CTO, Head of Sales)) Tj

0 -40 Td
/F1 11 Tf
(Slutsats:) Tj
0 -25 Td
(TechVision AB presenterar en attraktiv investitionsmojlighet for) Tj
0 -20 Td
(Industrikapital med fokuserade integrations- och tillvaxtmojligheter.) Tj
0 -20 Td
(Med implementering av rekommenderade atgarder kan bolagets) Tj
0 -20 Td
(varde potentiellt okas 2-3x genom SaaS-expansion.) Tj

0 -50 Td
/F1 9 Tf
(KONFIDENTIELL - For auktoriserade mottagare endast) Tj
0 -15 Td
(Due Diligence Rapport - TechVision AB - Oktober 2024) Tj

ET
endstream
endobj

xref
0 36
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000131 00000 n 
0000000280 00000 n 
0000004380 00000 n 
0000004478 00000 n 
0000004578 00000 n 
0000004677 00000 n 
0000006277 00000 n 
trailer
<< /Size 36 /Root 1 0 R >>
startxref
10877
%%EOF`

    const pdfBuffer = Buffer.from(pdfContent, 'utf8')
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="dd-rapport-TechVision-${new Date().getTime()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate DD report' }, { status: 500 })
  }
}
