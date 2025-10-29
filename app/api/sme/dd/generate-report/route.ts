import { NextRequest, NextResponse } from 'next/server'

const DEMO_DD_PDF = Buffer.from(`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 800 >>
stream
BT
/F1 28 Tf
50 750 Td
(DUE DILIGENCE RAPPORT) Tj
0 -40 Td
/F1 14 Tf
(Företagsbesiktning) Tj
0 -40 Td
/F1 12 Tf
(För förvärv av TechVision AB) Tj
0 -30 Td
/F1 11 Tf
(Organisationsnummer: 556234-5678) Tj
0 -20 Td
(Köpare: Industrikapital Partners AB) Tj
0 -20 Td
(DD-ledare: Erik Andersson, Partner) Tj
0 -20 Td
(Startdatum: 2024-10-01) Tj
0 -20 Td
(Slutfört: 2024-10-28) Tj
0 -50 Td
(VERKSTÄLLANDE SAMMANFATTNING) Tj
0 -30 Td
(Övergripande risknivå: MEDIUM) Tj
0 -30 Td
(Tre viktigaste riskerna:) Tj
0 -20 Td
(1. Kundberoende: 35% av omsättningen från 3 större kunder) Tj
0 -20 Td
(2. Teknisk skuld: Legacy-system behöver modernisering) Tj
0 -20 Td
(3. Nyckelpersonalberoende: CTO och Head of Sales är kritiska) Tj
0 -50 Td
(REKOMMENDATION: Genomför förvärvet med följande villkor:) Tj
0 -20 Td
(1. Retentions-bonus för nyckelpersonal under 2 år) Tj
0 -20 Td
(2. Diversifiera kundbas genom integration) Tj
0 -20 Td
(3. 6-månaders IT-moderniseringsplan) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000133 00000 n 
0000000214 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
1114
%%EOF`, 'utf8')

export async function GET(req: NextRequest) {
  try {
    return new NextResponse(DEMO_DD_PDF, {
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
