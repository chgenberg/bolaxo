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
/Length 1200
>>
stream
BT
/F1 24 Tf
50 750 Td
(AKTIEOVERLATTELSEAVTAL) Tj
ET
BT
/F1 14 Tf
50 720 Td
(Share Purchase Agreement) Tj
ET
BT
/F1 12 Tf
50 680 Td
(For forvarv av TechVision AB) Tj
ET
BT
/F1 11 Tf
50 650 Td
(Saljare: Tech Founders AB) Tj
ET
BT
/F1 11 Tf
50 630 Td
(Kopare: Industrikapital Partners AB) Tj
ET
BT
/F1 11 Tf
50 610 Td
(Organisationsnummer: 556234-5678) Tj
ET
BT
/F1 11 Tf
50 590 Td
(Antal aktier: 1000) Tj
ET
BT
/F1 11 Tf
50 570 Td
(Kopeskilling: 150,000,000 SEK) Tj
ET
BT
/F1 11 Tf
50 550 Td
(Cash at closing: 115,000,000 SEK) Tj
ET
BT
/F1 11 Tf
50 530 Td
(Escrow (18 manader): 20,000,000 SEK) Tj
ET
BT
/F1 11 Tf
50 510 Td
(Earn-out (3 ar): 15,000,000 SEK) Tj
ET
BT
/F1 14 Tf
50 450 Td
(UNDERTECKNINGAR) Tj
ET
BT
/F1 11 Tf
50 410 Td
(Saljare: ___________________   Datum: ___________) Tj
ET
BT
/F1 11 Tf
50 380 Td
(Kopare: ____________________   Datum: ___________) Tj
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
0000001574 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
1671
%%EOF`

    const pdfBuffer = Buffer.from(pdfContent, 'utf8')
    
    return new NextResponse(pdfBuffer, {
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
