import { NextRequest, NextResponse } from 'next/server'

const DEMO_SPA_PDF = Buffer.from(`%PDF-1.4
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
<< /Length 600 >>
stream
BT
/F1 24 Tf
50 750 Td
(AKTIEÖVERLÅTELSEAVTAL) Tj
0 -40 Td
/F1 12 Tf
(Share Purchase Agreement) Tj
0 -50 Td
/F1 11 Tf
(För förvärv av TechVision AB) Tj
0 -30 Td
(Mellan: Tech Founders AB (Säljare)) Tj
0 -20 Td
(och Industrikapital Partners AB (Köpare)) Tj
0 -50 Td
(Total köpeskilling: 150,000,000 SEK) Tj
0 -20 Td
(- Cash at closing: 115,000,000 SEK) Tj
0 -20 Td
(- Escrow (18 månader): 20,000,000 SEK) Tj
0 -20 Td
(- Earn-out (3 år): 15,000,000 SEK) Tj
0 -50 Td
(UNDERTECKNINGAR) Tj
0 -30 Td
(Säljare: _________________________   Köpare: _______________________) Tj
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
914
%%EOF`, 'utf8')

export async function GET(req: NextRequest) {
  try {
    return new NextResponse(DEMO_SPA_PDF, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="spa-demo-${new Date().getTime()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
