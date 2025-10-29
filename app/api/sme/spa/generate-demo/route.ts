import { NextResponse } from 'next/server'
import { DEMO_SPA_FULL_DATA } from '@/lib/demo-data'
import puppeteer from 'puppeteer'

const generateSPAHTML = (data: any) => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Share Purchase Agreement - ${data.companyName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2c3e50; background: white; line-height: 1.7; }
    @page { margin: 0; size: A4; }
    .page { page-break-after: always; padding: 60px 50px; background: white; min-height: 297mm; }
    .cover-page { background: linear-gradient(135deg, #0033cc 0%, #003366 50%, #001a4d 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 297mm; text-align: center; padding: 0; }
    .cover-page h1 { font-size: 56px; margin-bottom: 15px; font-weight: 800; letter-spacing: 2px; }
    .cover-page h2 { font-size: 26px; margin-bottom: 80px; font-weight: 300; opacity: 0.9; letter-spacing: 1px; }
    .cover-company { font-size: 36px; font-weight: 700; margin: 40px 0 15px 0; }
    .cover-metadata { margin-top: 100px; border-top: 2px solid rgba(255,255,255,0.3); padding-top: 50px; text-align: left; display: inline-block; }
    .metadata-item { margin: 12px 0; font-size: 14px; opacity: 0.95; }
    .metadata-label { font-weight: 600; opacity: 1; }
    h1 { color: white; font-size: 42px; margin-bottom: 40px; padding: 30px 50px; background: linear-gradient(90deg, #0033cc 0%, #0052ff 100%); margin-left: -50px; margin-right: -50px; margin-top: -60px; }
    h2 { color: #0033cc; font-size: 28px; margin-top: 50px; margin-bottom: 25px; padding-bottom: 12px; border-bottom: 3px solid #0033cc; font-weight: 700; }
    h3 { color: #005dd6; font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: 600; }
    .card { background: white; border-left: 5px solid #0033cc; padding: 25px; margin: 25px 0; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 51, 204, 0.12); }
    table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 30px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
    th { background: linear-gradient(90deg, #0033cc 0%, #0052ff 100%); color: white; padding: 18px; text-align: left; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 16px 18px; border-bottom: 1px solid #e8eef5; font-size: 14px; }
    tr:hover { background: #f8f9fa; }
    tr:last-child td { border-bottom: none; }
    ul, ol { margin: 20px 0 20px 35px; }
    li { margin: 10px 0; line-height: 1.8; }
    .footer { margin-top: 80px; padding-top: 25px; border-top: 2px solid #0033cc; color: #666; font-size: 11px; text-align: center; }
    p { margin: 15px 0; line-height: 1.8; }
    .definition { background: #f8f9fa; padding: 12px; margin: 10px 0; border-left: 4px solid #0033cc; font-style: italic; }
  </style>
</head>
<body>

<div class="page cover-page">
  <h1 style="background: none; color: white; margin: 0; padding: 0; border: none;">SHARE PURCHASE AGREEMENT</h1>
  <h2 style="color: rgba(255,255,255,0.9); border: none; margin: 15px 0 80px 0; padding: 0;">Aktieöverlåtelseavtal</h2>
  <div class="cover-company">${data.companyName}</div>
  <p style="opacity: 0.9; margin: 10px 0 50px 0;">Organisationsnummer: ${data.orgNumber}</p>
  <div class="cover-metadata">
    <div class="metadata-item"><span class="metadata-label">Säljare:</span> ${data.sellerName}</div>
    <div class="metadata-item"><span class="metadata-label">Köpare:</span> ${data.buyerName}</div>
    <div class="metadata-item"><span class="metadata-label">Målbolag:</span> ${data.companyName}</div>
    <div class="metadata-item"><span class="metadata-label">Köpeskilling:</span> ${data.basePurchasePrice} SEK</div>
    <div class="metadata-item"><span class="metadata-label">Avtalsdatum:</span> ${new Date().toLocaleDateString('sv-SE')}</div>
  </div>
</div>

<div class="page">
  <h1>1. PARTERNA OCH MÅLBOLAGET</h1>
  <h2>1.1 Säljare</h2>
  <div class="card">
    <p><strong>Namn:</strong> ${data.sellerName}</p>
    <p><strong>Personnummer:</strong> ${data.sellerIdNumber}</p>
    <p><strong>Adress:</strong> ${data.sellerAddress}</p>
    <p><strong>Bank:</strong> ${data.sellerBank}</p>
    <p><strong>Bankgiro:</strong> ${data.sellerBankGiro}</p>
  </div>
  
  <h2>1.2 Köpare</h2>
  <div class="card">
    <p><strong>Namn:</strong> ${data.buyerName}</p>
    <p><strong>Organisationsnummer:</strong> ${data.buyerOrgNumber}</p>
    <p><strong>Adress:</strong> ${data.buyerAddress}</p>
    <p><strong>Bank:</strong> ${data.buyerBank}</p>
    <p><strong>Bankgiro:</strong> ${data.buyerBankGiro}</p>
  </div>
  
  <h2>1.3 Målbolaget</h2>
  <div class="card">
    <p><strong>Namn:</strong> ${data.companyName}</p>
    <p><strong>Organisationsnummer:</strong> ${data.orgNumber}</p>
    <p><strong>Juridisk form:</strong> ${data.legalForm}</p>
    <p><strong>Registreringsadress:</strong> ${data.companyAddress}</p>
    <p><strong>Bransch:</strong> ${data.industry}</p>
    <p><strong>Verksamhetsbeskrivning:</strong> ${data.description}</p>
  </div>
</div>

<div class="page">
  <h1>2. KÖPESKILLING OCH BETALNINGSVILLKOR</h1>
  <h2>2.1 Köpeskilling</h2>
  <table>
    <tr>
      <th>Komponent</th>
      <th>Belopp (SEK)</th>
    </tr>
    <tr>
      <td>Basköpeskilling</td>
      <td>${data.basePurchasePrice}</td>
    </tr>
    <tr>
      <td>Möjlig Earnout</td>
      <td>${data.earnoutAmount}</td>
    </tr>
    <tr style="background: #e8eef5; font-weight: bold;">
      <td>Totalt möjligt</td>
      <td>${data.totalMaxPrice}</td>
    </tr>
  </table>
  
  <h2>2.2 Betalningsvillkor</h2>
  <ul>
    <li>Basköpeskilling minus Escrow-belopp vid Closing</li>
    <li>Escrow-belopp: ${data.escrowAmount} SEK (${data.escrowPercentage}% av basköpeskilling)</li>
    <li>Escrow-period: ${data.escrowPeriod} månader från Closing Date</li>
    <li>Escrow-agent: ${data.escrowAgent}</li>
  </ul>
  
  <h2>2.3 Earnout-bestämmelser</h2>
  <table>
    <tr>
      <th>År</th>
      <th>Målkriteria</th>
      <th>Möjligt Earnout</th>
    </tr>
    <tr>
      <td>År 1</td>
      <td>${data.earnoutYear1Target}</td>
      <td>${data.earnoutYear1Amount} SEK</td>
    </tr>
    <tr>
      <td>År 2</td>
      <td>${data.earnoutYear2Target}</td>
      <td>${data.earnoutYear2Amount} SEK</td>
    </tr>
    <tr>
      <td>År 3</td>
      <td>${data.earnoutYear3Target}</td>
      <td>${data.earnoutYear3Amount} SEK</td>
    </tr>
  </table>
</div>

<div class="page">
  <h1>3. FÖRSÄKRINGAR OCH ÅTAGANDEN</h1>
  <h2>3.1 Säljarens Försäkringar</h2>
  <h3>Juridisk Status</h3>
  <ul>
    <li>Bolaget är korrekt bildade och registrerade enligt svensk lag</li>
    <li>Bolagsordningen är giltig och gällande</li>
    <li>Säljaren äger alla aktier utan belastning eller säkerhet</li>
    <li>Det finns inga andra återstående krav från tidigare ägare</li>
  </ul>
  
  <h3>Finansiell Information</h3>
  <ul>
    <li>De finansiella rapporterna är korrekta och kompletta</li>
    <li>Årsredovisningarna följer Bokföringslagen och IFRS-principerna</li>
    <li>Ingen väsentlig förändring i finansiell ställning sedan senaste rapport</li>
    <li>Alla skatter är betalda korrekt och i tid</li>
  </ul>
  
  <h3>Affärsverksamhet</h3>
  <ul>
    <li>Bolaget är driftskompetent och legitim</li>
    <li>Alla väsentliga kontrakt är giltiga och bindande</li>
    <li>Det finns inga pågående rättstvister eller anspråk</li>
    <li>Bolagets personalpolicy följer aktuell lagstiftning</li>
  </ul>
</div>

<div class="page">
  <h1>4. GOTTGÖRELSE OCH ANSVARSBEGRÄNSNING</h1>
  <h2>4.1 Säljarens Gottgörelseskyldighet</h2>
  <p>Säljaren åtar sig att gottgöra Köparen för alla förluster eller skador som uppstår på grund av brott mot försäkringar och åtaganden i detta Avtal.</p>
  
  <h2>4.2 Ansvarsbegränsningar</h2>
  <table>
    <tr>
      <th>Ansvar</th>
      <th>Tak</th>
      <th>Period</th>
    </tr>
    <tr>
      <td>Allmän Gottgörelse</td>
      <td>5% av Basköpeskilling</td>
      <td>18 månader</td>
    </tr>
    <tr>
      <td>Finansiell Gottgörelse</td>
      <td>10% av Basköpeskilling</td>
      <td>3 år</td>
    </tr>
    <tr>
      <td>Skattemässig Gottgörelse</td>
      <td>Unbegränsad</td>
      <td>7 år</td>
    </tr>
  </table>
  
  <h2>4.3 Netto-lag ("Basket")</h2>
  <ul>
    <li>Enskild gottgörelse måste överstiga 50,000 SEK</li>
    <li>Totalt gottgörelsekrav måste överstiga 100,000 SEK</li>
    <li>Säljarens totala ansvar är begränsat till 25% av Basköpeskilling</li>
  </ul>
</div>

<div class="page">
  <h1>5. CLOSING OCH GENOMFÖRANDE</h1>
  <h2>5.1 Closing Date</h2>
  <p><strong>Closing Date:</strong> ${data.closingDate}</p>
  
  <h2>5.2 Avslutningsvillkor</h2>
  <ul>
    <li>Inga väsentliga motsägelser i försäkringar har avslöjats</li>
    <li>Alla väsentliga kontrakt har godkänts av motparter</li>
    <li>Alla anställda kontrakt är godkända/inte uppsagda</li>
    <li>Finansiella rapporter är korrekta utan väsentlig avvikelse</li>
    <li>Arbetskapitalet ligger inom +/- 10% av prognostiserad nivå</li>
    <li>Inga juridiska eller regulatoriska hinder har uppstått</li>
  </ul>
  
  <h2>5.3 Closing Procedur</h2>
  <ol>
    <li>Böckerna avslutas vid Stämningstiden (23:59 dagen före Closing Date)</li>
    <li>Arbetstidsextraktion av Working Capital genomförs</li>
    <li>Betalning överförs från Köpare till Säljare</li>
    <li>Aktier överförs elektroniskt</li>
    <li>Dokument överlämnas</li>
    <li>Avslutningsuppsättning undertecknas</li>
  </ol>
</div>

<div class="page">
  <h1>6. ANSTÄLLNING OCH RETENTION</h1>
  <h2>6.1 Övertagande av Anställda</h2>
  <ul>
    <li>Alla anställningskontrakt övergår till Köparen på oförändrade villkor</li>
    <li>Ingen uppsägning utan 3 månaders varsel (enligt LA)</li>
    <li>Löner och förmåner förblir oförändrade minst 12 månader</li>
    <li>Pensionsförpliktelser övergår enligt ITP/SPP-regler</li>
  </ul>
  
  <h2>6.2 Nyckelmedarbetare & Retention</h2>
  <div class="card">
    <p><strong>${data.keyEmployee1}:</strong> ${data.ceoBonus} SEK retention bonus efter 12 månader</p>
    <p><strong>${data.keyEmployee2}:</strong> ${data.ctoBonus} SEK retention bonus efter 12 månader</p>
    <p><strong>${data.keyEmployee3}:</strong> ${data.otherBonus} SEK retention bonus efter 12 månader</p>
  </div>
</div>

<div class="page">
  <h1>7. KONKURRENSFÖRBUD OCH KONFIDENTIALITET</h1>
  <h2>7.1 Konkurrensförbud</h2>
  <ul>
    <li><strong>Tidsperiod:</strong> ${data.nonCompetePeriod} år från Closing Date</li>
    <li><strong>Geografisk räckvidd:</strong> ${data.nonCompeteGeography}</li>
    <li>Säljaren får inte direkt/indirekt vara verksam inom samma bransch</li>
    <li>Säljaren får inte rekrytera anställda från Bolaget</li>
  </ul>
  
  <h2>7.2 Konfidentialitet</h2>
  <ul>
    <li>Båda parter måste hålla all information konfidentiell</li>
    <li>Konfidentialiteten gäller 3 år före Closing, 5 år efter</li>
    <li>Affärshemligheter är obegränsat skyddade</li>
  </ul>
  
  <h2>7.3 Tvister och Lösning</h2>
  <ul>
    <li>Parterna försöker lösa tvisten i god tro inom 15 dagar</li>
    <li>Vid oenighet kan tvisten föras till förlikning</li>
    <li>Denna avtalet tolkas enligt svensk rätt</li>
    <li>Tvister prövas av Stockholms District Court</li>
  </ul>
</div>

<div class="page">
  <h1>8. UNDERTECKNANDE</h1>
  <p style="margin-bottom: 60px;">Till bevis härom undertecknas detta Avtal på två originalexemplar:</p>
  
  <div style="display: flex; gap: 80px; margin-top: 100px;">
    <div>
      <p style="border-top: 2px solid #000; padding-top: 20px;">
        <strong>Säljaren</strong><br/><br/>
        Namn: ${data.sellerName}<br/>
        Underskrift: _______________________<br/>
        Datum: _______________________
      </p>
    </div>
    <div>
      <p style="border-top: 2px solid #000; padding-top: 20px;">
        <strong>Köparen</strong><br/><br/>
        Namn: ${data.buyerName}<br/>
        Underskrift: _______________________<br/>
        Datum: _______________________
      </p>
    </div>
  </div>
  
  <div class="footer">
    <p>Share Purchase Agreement | ${data.companyName} | ${new Date().toLocaleDateString('sv-SE')}</p>
  </div>
</div>

</body>
</html>
`

export async function GET() {
  try {
    const html = generateSPAHTML(DEMO_SPA_FULL_DATA)
    
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: 0, bottom: 0, left: 0, right: 0 }
    })
    
    await browser.close()
    
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="SPA_Demo_CloudTech.pdf"'
      }
    })
  } catch (error) {
    console.error('Demo SPA generation failed:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate SPA', details: (error as Error).message }), { status: 500 })
  }
}
