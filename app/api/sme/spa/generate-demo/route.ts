import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Create a professional SPA PDF with proper formatting
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R 20 0 R] /Count 2 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj

4 0 obj
<< /Length 3500 >>
stream
BT
/F2 28 Tf
50 720 Td
(AKTIEOVERLATTELSEAVTAL) Tj
0 -45 Td
/F1 12 Tf
(Share Purchase Agreement - SPA) Tj
0 -60 Td
/F2 14 Tf
(For forvarv av TechVision AB) Tj

0 -50 Td
/F1 11 Tf
(Organisationsnummer: 556234-5678) Tj

0 -200 Td
/F2 14 Tf
(PARTER) Tj

0 -30 Td
/F1 11 Tf
(SALJARE:) Tj
0 -20 Td
(Tech Founders AB) Tj
0 -15 Td
(Organisationsnummer: 556234-5678) Tj
0 -15 Td
(Adress: Stureplan 2, 114 35 Stockholm) Tj

0 -35 Td
(KOPARE:) Tj
0 -20 Td
(Industrikapital Partners AB) Tj
0 -15 Td
(Organisationsnummer: 556100-1234) Tj
0 -15 Td
(Adress: Norrlandsgatan 15, 113 41 Stockholm) Tj

0 -35 Td
(BOLAG:) Tj
0 -20 Td
(TechVision AB) Tj
0 -15 Td
(Organisationsnummer: 556234-5678) Tj
0 -15 Td
(Adress: Stureplan 2, 114 35 Stockholm) Tj

0 -50 Td
/F2 14 Tf
(KOPESKILLING OCH BETALNINGSVILLKOR) Tj

0 -30 Td
/F1 11 Tf
(Total kopeskilling: 150,000,000 SEK) Tj

0 -35 Td
(Betalningsstruktur:) Tj
0 -25 Td
(- Cash at closing: 115,000,000 SEK (76.7%) ) Tj
0 -20 Td
(- Escrow (18 manader): 20,000,000 SEK (13.3%) ) Tj
0 -20 Td
(- Earn-out (3 ar): 15,000,000 SEK (10.0%) ) Tj

0 -40 Td
(Betalningsvillkor:) Tj
0 -25 Td
(Betalning ska erlasas via bankoverforing senast Tilltradesdagen.) Tj
0 -20 Td
(Forrantnin enligt svensk ratt palopas vid drojsmal.) Tj

0 -40 Td
/F2 14 Tf
(GARANTIER FRAN SALJAREN) Tj

0 -30 Td
/F1 11 Tf
(Saljaren garanterar foljande:) Tj

0 -25 Td
(1. Organisationen: Bolaget ar korekt registrerat hos Bolagsverket) Tj
0 -20 Td
(2. Aganderatt: Saljaren ager 100 procent av aktierna och dessa ar helt obundna) Tj
0 -20 Td
(3. Finansiella rapporter: Arsredovisningar ar korrekta och kompletta) Tj
0 -20 Td
(4. Inga dolda skulder: Inga skulder existerar utanfor balansrakningnen) Tj
0 -20 Td
(5. Kontrakt: Alla material kontrakt ar tillgangliga och giltiga) Tj
0 -20 Td
(6. Tvister: Inga pagaende tvister existerar) Tj
0 -20 Td
(7. Anstallda: Alla anstallningsforalhanden ar lagliga) Tj
0 -20 Td
(8. Skatter: Alla skatter ar betalda och rapportering ar korrekt) Tj
0 -20 Td
(9. IP-rattigheter: Bolaget ager all IP och ingen tredjepartsrisk existerar) Tj

0 -40 Td
/F2 14 Tf
(VILLKOR FOR TILLTRADANDET) Tj

0 -30 Td
/F1 11 Tf
(Tilltradandet ar beroende av foljande villkor:) Tj

0 -25 Td
(1. Genomford due diligence enligt avtalet) Tj
0 -20 Td
(2. Inget vasentligt negativt har intraffall i bolaget) Tj
0 -20 Td
(3. Nyckelpersoberoende retention-avtal undertecknade) Tj
0 -20 Td
(4. Top 10 kundkontrakt bekraftade att fortsatta) Tj
0 -20 Td
(5. Erforderliga myndighetsgodkannanden erhallna) Tj

0 -40 Td
/F2 14 Tf
(EARN-OUT STRUKTUR) Tj

0 -30 Td
/F1 11 Tf
(Tilllaggskopekalingen berams enligt:) Tj

0 -25 Td
(KPI: Arslig omsattning under 3-arsperioden) Tj
0 -20 Td
(Mal: Omsattning over 55 MSEK) Tj
0 -20 Td
(Betalningsperiod: Arligen i efterfoljande 3 ar) Tj
0 -20 Td
(Maximalt utfall: 15,000,000 SEK) Tj

0 -40 Td
/F2 14 Tf
(KONKURRENSFORUDS OCH SEKRETESS) Tj

0 -30 Td
/F1 11 Tf
(Saljaren forbinder sig att under 2 ar inte bedriva konkurrerande verksamhet.) Tj
0 -20 Td
(Saljaren forbinder sig att inte verva Bolagets anstallda eller kunder.) Tj
0 -20 Td
(Brott mot dessa forbuds ger upphov till konventionalvite: 100,000 SEK/manad) Tj

0 -40 Td
/F2 14 Tf
(UNDERTECKNINGAR) Tj

0 -40 Td
/F1 11 Tf
(SALJARE:) Tj
0 -50 Td
(Namnteckning: ___________________________) Tj
0 -30 Td
(Namn i klartext: ___________________________) Tj
0 -30 Td
(Datum: ___________________________) Tj

0 -50 Td
(KOPARE:) Tj
0 -50 Td
(Namnteckning: ___________________________) Tj
0 -30 Td
(Namn i klartext: ___________________________) Tj
0 -30 Td
(Datum: ___________________________) Tj

0 -50 Td
/F1 9 Tf
(Detta dokument ar juridiskt bindande enligt svensk ratt.) Tj
0 -15 Td
(Bada parter rekommenderas att soka juridisk radgivning innan undertecknande.) Tj

ET
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj

20 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 21 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj

21 0 obj
<< /Length 1500 >>
stream
BT
/F2 14 Tf
50 750 Td
(BILAGOR OCH TILLAGGSBESTAMMELSER) Tj

0 -40 Td
/F1 11 Tf
(BILAGA A - CLOSING CHECKLISTA) Tj

0 -30 Td
/F1 10 Tf
(1. Transaktionsdokument undertecknade) Tj
0 -20 Td
(2. Rskonkurrensbeslut fattat) Tj
0 -20 Td
(3. Andringsbeslut om styrelse genomfort) Tj
0 -20 Td
(4. Varderingscertifikat mottaget) Tj

0 -40 Td
/F1 11 Tf
(BILAGA B - FINANSIELL DATA) Tj

0 -30 Td
/F1 10 Tf
(Omsattning 2024: 52,000,000 SEK) Tj
0 -20 Td
(EBITDA 2024: 10,400,000 SEK) Tj
0 -20 Td
(EBITDA-marginal: 20 procent) Tj
0 -20 Td
(Antal anstallda: 12 FTE) Tj
0 -20 Td
(Tillvaxt CAGR 2021-2024: 45 procent) Tj

0 -40 Td
/F1 11 Tf
(BILAGA C - NYCKELKONTRAKT) Tj

0 -30 Td
/F1 10 Tf
(Televerket - 18 procent av omsattningen) Tj
0 -20 Td
(Vattenfall Digital - 12 procent av omsattningen) Tj
0 -20 Td
(Scania Digital Services - 5 procent av omsattningen) Tj
0 -20 Td
(Volvo Connected Solutions - 3 procent av omsattningen) Tj

0 -40 Td
/F1 11 Tf
(SALESTAX OCH ANDRA VILLKOR) Tj

0 -30 Td
/F1 10 Tf
(Ingen stempel eller registreringsavgift enligt svensk lag.) Tj
0 -20 Td
(Koparens advokat ansvarar for registrering.) Tj
0 -20 Td
(Detta avtal tolkas enligt svensk ratt.) Tj
0 -20 Td
(Vid oenighet anropas Stockholms Handelskammares skiljedomsinstitut.) Tj

0 -50 Td
/F1 9 Tf
(Detta ar sidan 2 av SPA-avtalet for TechVision AB.) Tj
0 -15 Td
(Datum for upprattande: Idag, 2024-10-29) Tj

ET
endstream
endobj

xref
0 22
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000125 00000 n 
0000000274 00000 n 
0000003874 00000 n 
0000003972 00000 n 
0000004072 00000 n 
0000004171 00000 n 
0000005771 00000 n 
trailer
<< /Size 22 /Root 1 0 R >>
startxref
7371
%%EOF`

    const pdfBuffer = Buffer.from(pdfContent, 'utf8')
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="spa-avtal-TechVision-${new Date().getTime()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
