import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Create a proper PDF with text content
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 1800
>>
stream
BT
/F1 28 Tf
50 750 Td
(DUE DILIGENCE RAPPORT) Tj
ET
BT
/F1 14 Tf
50 710 Td
(Foretagsbesiktning) Tj
ET
BT
/F1 12 Tf
50 670 Td
(For forvarv av TechVision AB) Tj
ET
BT
/F1 11 Tf
50 640 Td
(Organisationsnummer: 556234-5678) Tj
ET
BT
/F1 11 Tf
50 620 Td
(Kopare: Industrikapital Partners AB) Tj
ET
BT
/F1 11 Tf
50 600 Td
(DD-ledare: Erik Andersson, Partner) Tj
ET
BT
/F1 11 Tf
50 580 Td
(Startdatum: 2024-10-01) Tj
ET
BT
/F1 11 Tf
50 560 Td
(Slutfort: 2024-10-28) Tj
ET
BT
/F1 14 Tf
50 500 Td
(VERKSTALLANDE SAMMANFATTNING) Tj
ET
BT
/F1 12 Tf
50 470 Td
(Overgripande riskniva: MEDIUM) Tj
ET
BT
/F1 11 Tf
50 440 Td
(Tre viktigaste riskerna:) Tj
ET
BT
/F1 10 Tf
50 420 Td
(1. Kundberoende: 35 procent av omsattningen fran 3 storre kunder) Tj
ET
BT
/F1 10 Tf
50 400 Td
(2. Teknisk skuld: Legacy-system behover modernisering) Tj
ET
BT
/F1 10 Tf
50 380 Td
(3. Nyckelpersoberoende: CTO och Head of Sales ar kritiska) Tj
ET
BT
/F1 12 Tf
50 340 Td
(FINANSIELL ANALYS) Tj
ET
BT
/F1 10 Tf
50 320 Td
(Omsattning 2024: 52 MSEK) Tj
ET
BT
/F1 10 Tf
50 300 Td
(EBITDA-marginal: 20 procent (10.4 MSEK)) Tj
ET
BT
/F1 10 Tf
50 280 Td
(CAGR 2021-2024: 45 procent) Tj
ET
BT
/F1 12 Tf
50 240 Td
(REKOMMENDATION) Tj
ET
BT
/F1 10 Tf
50 220 Td
(Genomfor forvarvet med foljande villkor:) Tj
ET
BT
/F1 10 Tf
50 200 Td
(1. Retentions-bonus for nyckelpersoberoende under 2 ar) Tj
ET
BT
/F1 10 Tf
50 180 Td
(2. Diversifiera kundbas genom integration) Tj
ET
BT
/F1 10 Tf
50 160 Td
(3. 6-manaders IT-moderniseringsplan) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000002174 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
2271
%%EOF`

    const pdfBuffer = Buffer.from(pdfContent, 'utf8')
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="dd-rapport-demo-${new Date().getTime()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate DD report' }, { status: 500 })
  }
}
