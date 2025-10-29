import { NextResponse } from 'next/server'
import { EXTENDED_SPA_DATA } from '@/lib/demo-data'
import puppeteer from 'puppeteer'

const generateFullSPAHTML = (data: any) => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Share Purchase Agreement - ${data.companyName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2c3e50; background: white; line-height: 1.6; }
    @page { margin: 0; size: A4; }
    .page { page-break-after: always; padding: 50px 45px; background: white; min-height: 297mm; font-size: 11px; }
    .cover-page { background: linear-gradient(135deg, #0033cc 0%, #003366 50%, #001a4d 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 297mm; text-align: center; padding: 0; }
    .cover-page h1 { font-size: 56px; margin-bottom: 15px; font-weight: 800; letter-spacing: 2px; }
    .cover-company { font-size: 36px; font-weight: 700; margin: 40px 0; }
    h1 { color: white; font-size: 36px; margin-bottom: 30px; padding: 25px 40px; background: linear-gradient(90deg, #0033cc 0%, #0052ff 100%); margin-left: -45px; margin-right: -45px; margin-top: -50px; }
    h2 { color: #0033cc; font-size: 18px; margin-top: 25px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #0033cc; font-weight: 700; }
    h3 { color: #005dd6; font-size: 12px; margin-top: 15px; margin-bottom: 8px; font-weight: 600; }
    .card { background: white; border-left: 4px solid #0033cc; padding: 15px; margin: 15px 0; border-radius: 6px; box-shadow: 0 2px 10px rgba(0, 51, 204, 0.08); }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; }
    th { background: linear-gradient(90deg, #0033cc 0%, #0052ff 100%); color: white; padding: 10px; text-align: left; font-weight: 700; }
    td { padding: 8px 10px; border-bottom: 1px solid #e8eef5; }
    tr:hover { background: #f8f9fa; }
    ul, ol { margin: 10px 0 10px 25px; }
    li { margin: 5px 0; line-height: 1.5; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #0033cc; color: #888; font-size: 9px; text-align: center; }
    p { margin: 8px 0; line-height: 1.6; }
    .section-number { background: #0033cc; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 10px; margin-right: 8px; }
    .toc-page { margin-top: 50px; }
  </style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page cover-page">
  <h1 style="background: none; color: white; margin: 0; padding: 0;">SHARE PURCHASE AGREEMENT</h1>
  <p style="font-size: 20px; margin: 20px 0; opacity: 0.9;">Aktieöverlåtelseavtal</p>
  <div class="cover-company">${data.companyName}</div>
  <p style="opacity: 0.9; margin: 10px 0 40px 0;">Organisationsnummer: ${data.orgNumber}</p>
  <div style="margin-top: 80px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 30px; text-align: left; display: inline-block; font-size: 13px;">
    <p><strong>Säljare:</strong> ${data.sellerName}</p>
    <p><strong>Köpare:</strong> ${data.buyerName}</p>
    <p style="margin-top: 20px;"><strong>Köpeskilling:</strong> ${data.basePurchasePrice} SEK</p>
    <p><strong>Datum:</strong> ${new Date().toLocaleDateString('sv-SE')}</p>
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="page toc-page">
  <h1>INNEHÅLLSFÖRTECKNING</h1>
  <ol style="font-size: 10px; margin: 20px 0 20px 30px;">
    <li>Parterna och Målbolaget</li>
    <li>Köpeskilling och Betalningsvillkor</li>
    <li>Representations och Warranties - Säljaren</li>
    <li>Representations och Warranties - Köparen</li>
    <li>Covenants före Closing</li>
    <li>Closing Conditions</li>
    <li>Closing</li>
    <li>Anställda och Förmåner</li>
    <li>Non-compete och Konfidentialitet</li>
    <li>Gottgörelse och Indemnification</li>
    <li>Earnout</li>
    <li>Övriga Bestämmelser</li>
    <li>Schedule A - Kundbas</li>
    <li>Schedule B - Leverantörer</li>
    <li>Schedule C - Anställda</li>
    <li>Schedule D - Material Contracts</li>
    <li>Schedule E - Juridiska Problem</li>
  </ol>
</div>

<!-- SECTION 1-3: PARTIES, PRICING, REPS SELLER -->
<div class="page">
  <h1>1. PARTERNA OCH MÅLBOLAGET</h1>
  <h2>1.1 Säljare</h2>
  <p><strong>Namn:</strong> ${data.sellerName}</p>
  <p><strong>Personnummer:</strong> ${data.sellerIdNumber}</p>
  <p><strong>Adress:</strong> ${data.sellerAddress}</p>
  <p><strong>Bank:</strong> ${data.sellerBank}, Bankgiro: ${data.sellerBankGiro}</p>
  
  <h2>1.2 Köpare</h2>
  <p><strong>Namn:</strong> ${data.buyerName}</p>
  <p><strong>Organisationsnummer:</strong> ${data.buyerOrgNumber}</p>
  <p><strong>Adress:</strong> ${data.buyerAddress}</p>
  <p><strong>Bank:</strong> ${data.buyerBank}, Bankgiro: ${data.buyerBankGiro}</p>
  
  <h2>1.3 Målbolaget</h2>
  <p><strong>Namn:</strong> ${data.companyName}</p>
  <p><strong>Organisationsnummer:</strong> ${data.orgNumber}</p>
  <p><strong>Juridisk form:</strong> ${data.legalForm}</p>
  <p><strong>Adress:</strong> ${data.companyAddress}</p>
  <p><strong>Bransch:</strong> ${data.industry}</p>
  <p><strong>Beskrivning:</strong> ${data.description}</p>

  <h1>2. KÖPESKILLING OCH BETALNINGSVILLKOR</h1>
  <h2>2.1 Köpeskilling</h2>
  <table>
    <tr><th>Komponent</th><th>Belopp (SEK)</th><th>Andel</th></tr>
    <tr><td>Basköpeskilling</td><td>${data.basePurchasePrice}</td><td>100%</td></tr>
    <tr><td>Möjlig Earnout</td><td>${data.earnoutAmount}</td><td>${data.earnoutPercentage}%</td></tr>
    <tr style="background: #e8eef5; font-weight: bold;"><td>Totalt möjligt</td><td>${data.totalMaxPrice}</td><td>114.3%</td></tr>
  </table>
  
  <h2>2.2 Betalningsvillkor</h2>
  <ul>
    <li>Basköpeskilling minus Escrow (${data.escrowAmount} SEK)</li>
    <li>Escrow-period: ${data.escrowPeriod} månader från Closing</li>
    <li>Escrow-agent: ${data.escrowAgent}</li>
    <li>Earnout: ${data.totalEarnout} SEK över 3 år baserat på KPI</li>
  </ul>

  <h1>3. REPRESENTATIONS OCH WARRANTIES - SÄLJAREN</h1>
  <h2>3.1 Organisatoriska Representations</h2>
  <ul>
    ${data.representations.organization.map((rep: string) => `<li>${rep}</li>`).join('')}
  </ul>
  
  <h2>3.2 Kapitalisering</h2>
  <ul>
    ${data.representations.capitalization.map((rep: string) => `<li>${rep}</li>`).join('')}
  </ul>
  
  <h2>3.3 Finansiella Representations</h2>
  <ul>
    ${data.representations.financial.map((rep: string) => `<li>${rep}</li>`).join('')}
  </ul>
  
  <h2>3.4 Tillgångar</h2>
  <ul>
    ${data.representations.assets.map((rep: string) => `<li>${rep}</li>`).join('')}
  </ul>
  
  <h2>3.5 Skulder</h2>
  <ul>
    ${data.representations.liabilities.map((rep: string) => `<li>${rep}</li>`).join('')}
  </ul>
  
  <h2>3.6 Kontrakt</h2>
  <ul>
    ${data.representations.contracts.map((rep: string) => `<li>${rep}</li>`).join('')}
  </ul>

  <div class="footer">Page 3 of 40+ | SPA ${data.companyName}</div>
</div>

<!-- SECTION 4-6: REPS BUYER, COVENANTS, CONDITIONS -->
<div class="page">
  <h1>4. REPRESENTATIONS OCH WARRANTIES - KÖPAREN</h1>
  <h2>4.1 Organisering</h2>
  <ul>
    <li>Köparen är korrekt organiserad enligt tillämplig lag</li>
    <li>Köparen är juridiskt befogad att ingå detta Avtal</li>
    <li>Köparen har erhållit all nödvändig godkännande</li>
  </ul>
  
  <h2>4.2 Finansiering</h2>
  <ul>
    <li>Köparen har eller kommer att erhålla tillräcklig finansiering</li>
    <li>Inga begränsningar föreligger för betalning</li>
  </ul>

  <h1>5. COVENANTS FÖRE CLOSING</h1>
  <h2>5.1 Säljarens Covenants</h2>
  <ul>
    <li>Säljaren ska föra verksamheten i normal ordning</li>
    <li>Säljaren ska inte göra väsentliga ändringar utan godkännande</li>
    <li>Säljaren ska underrätta om väsentliga förändringar</li>
    <li>Säljaren ska genomföra Due Diligence-process</li>
    <li>Säljaren ska säkra kundar före Closing</li>
  </ul>
  
  <h2>5.2 Köparens Covenants</h2>
  <ul>
    <li>Köparen ska genomföra Due Diligence</li>
    <li>Köparen ska ansöka om nödvändiga myndighetsgodkännanden</li>
    <li>Köparen ska hålla villkoren konfidentiellt</li>
  </ul>

  <h1>6. CLOSING CONDITIONS</h1>
  <h2>6.1 Betingelser för Genomförande</h2>
  <ul>
    <li>Inga väsentliga motsägelser i Representations avslöjats</li>
    <li>Alla väsentliga kontrakt godkända av motparter</li>
    <li>Alla anställda kontrakt godkända/inte uppsagda</li>
    <li>Finansiella rapporter korrekta utan väsentlig avvikelse</li>
    <li>Working Capital inom +/- 10% av prognostiserad nivå</li>
    <li>Inga juridiska eller regulatoriska hinder</li>
    <li>Nyckelmedarbetares retention-avtal undertecknade</li>
    <li>Top 3 kunders förlängningsmeddelanden mottagnas</li>
  </ul>
  
  <h2>6.2 Closing Date</h2>
  <p><strong>Tidigast:</strong> ${data.closingDate}</p>
  <p><strong>Senast:</strong> 30 dagar från signeringsdatum</p>
  <p><strong>Förlängning möjlig:</strong> Med ytterligare 30 dagar om villkor nästan uppfyllda</p>

  <div class="footer">Page 4 of 40+ | SPA ${data.companyName}</div>
</div>

<!-- SECTION 7-10: CLOSING, EMPLOYEES, COVENANTS -->
<div class="page">
  <h1>7. CLOSING</h1>
  <h2>7.1 Closing Procedur</h2>
  <ol>
    <li>Böckerna avslutas vid Stämningstiden (23:59 dagen före Closing Date)</li>
    <li>Working Capital extrakteras</li>
    <li>Betalning överförs från Köpare till Säljare</li>
    <li>Aktier överförs elektroniskt via VPC</li>
    <li>Dokument överlämnas (aktieöverlåtelser, styrelsebeslut)</li>
    <li>Avslutningsuppsättning undertecknas</li>
  </ol>

  <h1>8. ANSTÄLLDA OCH FÖRMÅNER</h1>
  <h2>8.1 Övertagande av Anställda</h2>
  <ul>
    <li>Alla anställningskontrakt övergår på oförändrade villkor</li>
    <li>Ingen uppsägning utan 3 månaders varsel (enligt LA)</li>
    <li>Löner och förmåner oförändrade minst 12 månader</li>
    <li>Pensionsförpliktelser övergår enligt ITP/SPP-regler</li>
  </ul>
  
  <h2>8.2 Retention & Key Person Bonuses</h2>
  <table>
    <tr><th>Person</th><th>Roll</th><th>Bonus</th><th>Period</th></tr>
    <tr><td>Anna Pettersson</td><td>VD</td><td>${data.ceoBonus} SEK</td><td>12 mån</td></tr>
    <tr><td>Erik Svensson</td><td>CTO</td><td>${data.ctoBonus} SEK</td><td>12 mån</td></tr>
    <tr><td>Sofia Bergström</td><td>Head of Sales</td><td>${data.otherBonus} SEK</td><td>12 mån</td></tr>
  </table>
  
  <h2>8.3 Semesterkassor & Obetald Semester</h2>
  <ul>
    <li>Säljaren betalar all semesterkassa enligt Semesterlagen</li>
    <li>Övertid och provisioner för perioden före Closing</li>
    <li>Inräknas i nettingsräkning</li>
  </ul>

  <h1>9. NON-COMPETE OCH KONFIDENTIALITET</h1>
  <h2>9.1 Konkurrensförbud</h2>
  <ul>
    <li><strong>Period:</strong> ${data.nonCompetePeriod} år från Closing</li>
    <li><strong>Geografi:</strong> ${data.nonCompeteGeography}</li>
    <li>Säljaren får inte bedriva konkurrerande verksamhet</li>
    <li>Säljaren får inte rekrytera från Bolaget</li>
    <li>Säljaren får inte dra nytta av affärshemligheter</li>
  </ul>
  
  <h2>9.2 Konfidentialitet</h2>
  <ul>
    <li>Båda parter håller information konfidentiell</li>
    <li>Innan Closing: 3 år</li>
    <li>Efter Closing: 5 år</li>
    <li>Affärshemligheter: Obegränsat</li>
  </ul>

  <div class="footer">Page 5 of 40+ | SPA ${data.companyName}</div>
</div>

<!-- SECTION 10-12: INDEMNIFICATION, EARNOUT, GENERAL -->
<div class="page">
  <h1>10. GOTTGÖRELSE OCH INDEMNIFICATION</h1>
  <h2>10.1 Säljarens Gottgörelse</h2>
  <p>Säljaren gottgör Köparen för förluster från:</p>
  <ul>
    <li>Brott mot Representations och Warranties</li>
    <li>Faktisk skillnad mellan försäkrad och verklig status</li>
    <li>Dolda skulder eller åtaganden</li>
    <li>Tredje parts anspråk</li>
  </ul>
  
  <h2>10.2 Ansvarsbegränsningar</h2>
  <table>
    <tr><th>Typ</th><th>Tak</th><th>Period</th></tr>
    <tr><td>Allmän Gottgörelse</td><td>5% av Köpeskilling</td><td>18 mån</td></tr>
    <tr><td>Finansiell Gottgörelse</td><td>10% av Köpeskilling</td><td>3 år</td></tr>
    <tr><td>Skatt Gottgörelse</td><td>Unbegränsad</td><td>7 år</td></tr>
    <tr><td>IP & Miljö</td><td>Unbegränsad</td><td>Tidsohindrad</td></tr>
  </table>
  
  <h2>10.3 Netto-lag ("Basket")</h2>
  <ul>
    <li>Enskild yrkande: minst 50,000 SEK</li>
    <li>Totalt Basket: minst 100,000 SEK</li>
    <li>Därefter: ALL gottgörelse erlägges</li>
    <li>Säljarens totala ansvar: Max 25% av Köpeskilling</li>
  </ul>

  <h1>11. EARNOUT BESTÄMMELSER</h1>
  <h2>11.1 Earnout Struktur</h2>
  <table>
    <tr><th>År</th><th>Målkriteria</th><th>Möjligt Earnout</th></tr>
    <tr><td>År 1</td><td>${data.earnoutYear1Target}</td><td>${data.earnoutYear1Amount} SEK</td></tr>
    <tr><td>År 2</td><td>${data.earnoutYear2Target}</td><td>${data.earnoutYear2Amount} SEK</td></tr>
    <tr><td>År 3</td><td>${data.earnoutYear3Target}</td><td>${data.earnoutYear3Amount} SEK</td></tr>
  </table>
  
  <h2>11.2 Beräkning & Betalning</h2>
  <ul>
    <li>Köparen reglerar earnout inom 60 dagar efter årsslut</li>
    <li>Säljarens revisorer får granska dokumentation</li>
    <li>Vid oenighet: tredje parts-revisor gör final bedömning</li>
    <li>Kostnad delas 50/50</li>
  </ul>

  <h1>12. ÖVRIGA BESTÄMMELSER</h1>
  <h2>12.1 Tvister & Lösning</h2>
  <ul>
    <li>Parterna försöker lösa i god tro (15 dagar)</li>
    <li>Vid oenighet: förlikning eller domstol</li>
    <li>Tillämplig lag: Svensk rätt</li>
    <li>Domstol: Stockholms District Court</li>
  </ul>
  
  <h2>12.2 Ändringar & Hela Avtalet</h2>
  <ul>
    <li>Ändringar kräver skriftligt godkännande</li>
    <li>Avtalet tillsammans med Schedules är helt avtalet</li>
    <li>Tidigare överenskommelser upphävs</li>
  </ul>

  <div class="footer">Page 6 of 40+ | SPA ${data.companyName}</div>
</div>

<!-- SCHEDULE A: CUSTOMER LIST -->
<div class="page">
  <h1>SCHEDULE A - KUNDBAS</h1>
  <table>
    <tr><th>Kund</th><th>Årsomsättning</th><th>Andel</th><th>Status</th></tr>
    ${data.schedules.customers.map((c: any) => `<tr><td>${c.name}</td><td>${c.revenue}</td><td>${c.share}</td><td>${c.status}</td></tr>`).join('')}
  </table>

  <div class="footer">Page 7 of 40+ | SPA ${data.companyName}</div>
</div>

<!-- SCHEDULE B: SUPPLIERS -->
<div class="page">
  <h1>SCHEDULE B - LEVERANTÖRER</h1>
  <table>
    <tr><th>Leverantör</th><th>Kategori</th><th>Årlig Kostnad</th><th>Betalningsvillkor</th></tr>
    ${data.schedules.suppliers.map((s: any) => `<tr><td>${s.name}</td><td>${s.category}</td><td>${s.annual}</td><td>${s.terms}</td></tr>`).join('')}
  </table>

  <div class="footer">Page 8 of 40+ | SPA ${data.companyName}</div>
</div>

<!-- SCHEDULE C: EMPLOYEES -->
<div class="page">
  <h1>SCHEDULE C - ANSTÄLLDA</h1>
  <table>
    <tr><th>Namn</th><th>Roll</th><th>Lön</th><th>Bonus</th><th>Tenure</th></tr>
    ${data.schedules.employees.map((e: any) => `<tr><td>${e.name}</td><td>${e.role}</td><td>${e.salary}</td><td>${e.bonus}</td><td>${e.tenure}</td></tr>`).join('')}
  </table>

  <div class="footer">Page 9 of 40+ | SPA ${data.companyName}</div>
</div>

<!-- SCHEDULE D: MATERIAL CONTRACTS -->
<div class="page">
  <h1>SCHEDULE D - MATERIAL CONTRACTS</h1>
  <table>
    <tr><th>Kontrakt</th><th>Värde</th><th>Term</th><th>CoC Risk</th><th>Status</th></tr>
    ${data.material_contracts.map((c: any) => `<tr><td>${c.contract}</td><td>${c.value}</td><td>${c.term}</td><td>${c.coc_risk}</td><td>${c.status}</td></tr>`).join('')}
  </table>

  <div class="footer">Page 10 of 40+ | SPA ${data.companyName}</div>
</div>

<!-- SCHEDULE E: LEGAL ISSUES -->
<div class="page">
  <h1>SCHEDULE E - JURIDISKA PROBLEM & CONTINGENCIES</h1>
  <table>
    <tr><th>Problem</th><th>Belopp</th><th>Status</th><th>Sannolikhet</th><th>Rekommendation</th></tr>
    ${data.legal_issues.map((l: any) => `<tr><td>${l.issue}</td><td>${l.amount}</td><td>${l.status}</td><td>${l.probability}</td><td>${l.recommendation}</td></tr>`).join('')}
  </table>

  <h2>Undertecknande</h2>
  <div style="margin-top: 60px; display: flex; gap: 100px;">
    <div>
      <p style="border-top: 2px solid #000; padding-top: 20px;">
        <strong>Säljare</strong><br/>
        Namn: ${data.sellerName}<br/>
        Underskrift: _______________________<br/>
        Datum: _______________________
      </p>
    </div>
    <div>
      <p style="border-top: 2px solid #000; padding-top: 20px;">
        <strong>Köpare</strong><br/>
        Namn: ${data.buyerName}<br/>
        Underskrift: _______________________<br/>
        Datum: _______________________
      </p>
    </div>
  </div>

  <div class="footer">Page 11 of 40+ | SPA ${data.companyName} | Undertecknande</div>
</div>

</body>
</html>
`

export async function GET() {
  try {
    const html = generateFullSPAHTML(EXTENDED_SPA_DATA)
    
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
        'Content-Disposition': 'attachment; filename="SPA_Full_CloudTech_40pages.pdf"'
      }
    })
  } catch (error) {
    console.error('Full SPA generation failed:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate SPA', details: (error as Error).message }), { status: 500 })
  }
}
