import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

const generateSPAHTML = (data: any) => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Share Purchase Agreement</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #2c3e50;
      background: white;
      line-height: 1.7;
    }
    
    @page {
      margin: 0;
      size: A4;
    }
    
    .page {
      page-break-after: always;
      padding: 60px 50px;
      background: white;
      min-height: 297mm;
    }
    
    /* COVER PAGE */
    .cover-page {
      background: linear-gradient(135deg, #0033cc 0%, #003366 50%, #001a4d 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 297mm;
      text-align: center;
      padding: 0;
    }
    
    .cover-page h1 {
      font-size: 56px;
      margin-bottom: 15px;
      font-weight: 800;
      letter-spacing: 2px;
    }
    
    .cover-page h2 {
      font-size: 26px;
      margin-bottom: 80px;
      font-weight: 300;
      opacity: 0.9;
      letter-spacing: 1px;
    }
    
    .cover-company {
      font-size: 36px;
      font-weight: 700;
      margin: 40px 0 15px 0;
    }
    
    .cover-metadata {
      margin-top: 100px;
      border-top: 2px solid rgba(255,255,255,0.3);
      padding-top: 50px;
      text-align: left;
      display: inline-block;
    }
    
    .metadata-item {
      margin: 12px 0;
      font-size: 14px;
      opacity: 0.95;
    }
    
    .metadata-label {
      font-weight: 600;
      opacity: 1;
    }
    
    /* HEADERS */
    h1 {
      color: white;
      font-size: 42px;
      margin-bottom: 40px;
      padding: 30px 50px;
      background: linear-gradient(90deg, #0033cc 0%, #0052ff 100%);
      margin-left: -50px;
      margin-right: -50px;
      margin-top: -60px;
    }
    
    h2 {
      color: #0033cc;
      font-size: 28px;
      margin-top: 50px;
      margin-bottom: 25px;
      padding-bottom: 12px;
      border-bottom: 3px solid #0033cc;
      font-weight: 700;
    }
    
    h3 {
      color: #005dd6;
      font-size: 20px;
      margin-top: 30px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    /* CARDS */
    .card {
      background: white;
      border-left: 5px solid #0033cc;
      padding: 25px;
      margin: 25px 0;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 51, 204, 0.12);
    }
    
    .card-highlight {
      border-left: 5px solid #0052ff;
      background: linear-gradient(135deg, #f0f7ff 0%, #e8eef5 100%);
    }
    
    /* TABLES */
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 30px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    th {
      background: linear-gradient(90deg, #0033cc 0%, #0052ff 100%);
      color: white;
      padding: 18px;
      text-align: left;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 16px 18px;
      border-bottom: 1px solid #e8eef5;
      font-size: 14px;
    }
    
    tr:hover {
      background: #f8f9fa;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    /* LISTS */
    ul, ol {
      margin: 20px 0 20px 35px;
    }
    
    li {
      margin: 10px 0;
      line-height: 1.8;
    }
    
    /* FOOTER */
    .footer {
      margin-top: 80px;
      padding-top: 25px;
      border-top: 2px solid #0033cc;
      color: #666;
      font-size: 11px;
      text-align: center;
    }
    
    p {
      margin: 15px 0;
      line-height: 1.8;
    }
    
    .section-number {
      display: inline-block;
      background: #0033cc;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      text-align: center;
      line-height: 32px;
      font-weight: 700;
      margin-right: 10px;
    }
    
    .definition {
      background: #f8f9fa;
      padding: 12px;
      margin: 10px 0;
      border-left: 4px solid #0033cc;
      font-style: italic;
    }
  </style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page cover-page">
  <h1 style="background: none; color: white; margin: 0; padding: 0; border: none;">SHARE PURCHASE AGREEMENT</h1>
  <h2 style="color: rgba(255,255,255,0.9); border: none; margin: 15px 0 80px 0; padding: 0;">Aktieöverlåtelseavtal</h2>
  
  <div class="cover-company">${data.companyName || 'AB'}</div>
  <p style="opacity: 0.9; margin: 10px 0 50px 0;">Organisationsnummer: ${data.orgNumber || '000000-0000'}</p>
  
  <div class="cover-metadata">
    <div class="metadata-item"><span class="metadata-label">Säljare:</span> ${data.sellerName || 'Säljaren'}</div>
    <div class="metadata-item"><span class="metadata-label">Köpare:</span> ${data.buyerName || 'Köparen'}</div>
    <div class="metadata-item"><span class="metadata-label">Målbolag:</span> ${data.companyName || 'Bolaget'}</div>
    <div class="metadata-item"><span class="metadata-label">Köpeskilling:</span> ${data.purchasePrice || 'TBD'} SEK</div>
    <div class="metadata-item"><span class="metadata-label">Avtalsdatum:</span> ${new Date().toLocaleDateString('sv-SE')}</div>
  </div>
</div>

<!-- PREAMBLE & PARTIES -->
<div class="page">
  <h1>PARTERNA OCH GEMENSAMMA BESTÄMMELSER</h1>
  
  <h2>1. Parterna</h2>
  
  <p><strong>Denna överenskommelse ("Avtalet") ingår mellan:</strong></p>
  
  <div class="card">
    <h3>Säljare</h3>
    <p><strong>Namn:</strong> ${data.sellerName || '(Säljare)'}</p>
    <p><strong>Personnummer/Orgnummer:</strong> ${data.sellerIdNumber || 'TBD'}</p>
    <p><strong>Adress:</strong> ${data.sellerAddress || 'TBD'}</p>
    <p><strong>Bank:</strong> ${data.sellerBank || 'TBD'}</p>
    <p><strong>Bankgiro:</strong> ${data.sellerBankGiro || 'TBD'}</p>
    <p>("Säljaren")</p>
  </div>
  
  <div class="card">
    <h3>Köpare</h3>
    <p><strong>Namn:</strong> ${data.buyerName || '(Köpare)'}</p>
    <p><strong>Organisationsnummer:</strong> ${data.buyerOrgNumber || 'TBD'}</p>
    <p><strong>Adress:</strong> ${data.buyerAddress || 'TBD'}</p>
    <p><strong>Bank:</strong> ${data.buyerBank || 'TBD'}</p>
    <p><strong>Bankgiro:</strong> ${data.buyerBankGiro || 'TBD'}</p>
    <p>("Köparen")</p>
  </div>
  
  <h2>2. Målbolaget</h2>
  
  <div class="card">
    <p><strong>Namn:</strong> ${data.companyName || 'AB'}</p>
    <p><strong>Organisationsnummer:</strong> ${data.orgNumber || '000000-0000'}</p>
    <p><strong>Juridisk form:</strong> ${data.legalForm || 'Aktiebolag'}</p>
    <p><strong>Registreringsadress:</strong> ${data.companyAddress || 'TBD'}</p>
    <p><strong>Bransch:</strong> ${data.industry || 'TBD'}</p>
    <p><strong>Verksamhetsbeskrivning:</strong> ${data.description || 'TBD'}</p>
  </div>
  
  <h2>3. Definitioner och Tolkning</h2>
  
  <h3>3.1 Centrala Definitioner</h3>
  
  <div class="definition"><strong>"Avtalet"</strong> - Denna Share Purchase Agreement tillsammans med alla bilagor och appendices</div>
  <div class="definition"><strong>"Anställda"</strong> - Alla personer anställda av Bolaget på Stämningstiden</div>
  <div class="definition"><strong>"Åtaganden"</strong> - Alla åtaganden, ansvar och skulder som Bolaget har</div>
  <div class="definition"><strong>"Closing"</strong> - Genomförandet av transaktionen enligt denna Avtalet</div>
  <div class="definition"><strong>"Tillgångar"</strong> - Alla tillgångar som Bolaget äger på Stämningstiden</div>
  <div class="definition"><strong>"Stämningstiden"</strong> - Klockan 23:59 dagen före Closing Date</div>
  <div class="definition"><strong>"Säkerhet"</strong> - Alla former av säkerhet/pantsättningar på Bolagets tillgångar</div>
  
  <div class="footer">
    <p>Share Purchase Agreement | ${data.companyName || 'Bolaget'} | ${new Date().toLocaleDateString('sv-SE')}</p>
  </div>
</div>

<!-- PURCHASE PRICE & PAYMENT -->
<div class="page">
  <h1>KÖPESKILLING OCH BETALNINGSVILLKOR</h1>
  
  <h2>4. Köpeskilling</h2>
  
  <div class="card card-highlight">
    <h3>Köpeskilling Sammanfattning</h3>
    <table>
      <tr>
        <th>Komponent</th>
        <th>Belopp (SEK)</th>
        <th>Andel (%)</th>
      </tr>
      <tr>
        <td>Basköpeskilling</td>
        <td>${data.basePurchasePrice || 'TBD'}</td>
        <td>100%</td>
      </tr>
      <tr>
        <td>Earnout (möjligt)</td>
        <td>${data.earnoutAmount || 'TBD'}</td>
        <td>${data.earnoutPercentage || 'TBD'}%</td>
      </tr>
      <tr style="background: #e8eef5; font-weight: bold;">
        <td>Totalt möjligt</td>
        <td>${data.totalMaxPrice || 'TBD'}</td>
        <td>100%+</td>
      </tr>
    </table>
  </div>
  
  <h2>5. Betalningsvillkor</h2>
  
  <h3>5.1 Vid Closing</h3>
  <p>Köparen skall på Closing Date betala följande till Säljaren:</p>
  <ul>
    <li>Basköpeskilling minus Escrow-belopp</li>
    <li>Nettning för Drift Working Capital</li>
    <li>Ersättning för Anställdas semesterkassor</li>
    <li>Justering för Skuldnettning</li>
  </ul>
  
  <h3>5.2 Betalningsmetod</h3>
  <p>Betalning skall göras via banköverföring till följande bankkonto:</p>
  <ul>
    <li><strong>Bank:</strong> ${data.sellerBank || 'TBD'}</li>
    <li><strong>Bankgiro/IBAN:</strong> ${data.sellerBankGiro || 'TBD'}</li>
    <li><strong>Kontoinnehavare:</strong> ${data.sellerName || 'Säljaren'}</li>
  </ul>
  
  <h3>5.3 Escrow-arrangemang</h3>
  <p>Köparen och Säljaren skall åt sidan avsätta följande för Escrow-ändamål:</p>
  <ul>
    <li><strong>Escrow-belopp:</strong> ${data.escrowAmount || 'TBD'} SEK (${data.escrowPercentage || '10'}% av basköpeskilling)</li>
    <li><strong>Escrow-period:</strong> ${data.escrowPeriod || '18'} månader från Closing</li>
    <li><strong>Escrow-agent:</strong> ${data.escrowAgent || 'TBD'}</li>
  </ul>
  
  <div class="footer">
    <p>Share Purchase Agreement - Köpeskilling & Betalningsvillkor</p>
  </div>
</div>

<!-- REPRESENTATIONS & WARRANTIES -->
<div class="page">
  <h1>FÖRSÄKRINGAR OCH ÅTAGANDEN</h1>
  
  <h2>6. Säljarens Försäkringar och Åtaganden</h2>
  
  <h3>6.1 Juridisk Status</h3>
  <ul>
    <li>Bolaget är korrekt bildade och registrerade enligt svensk lag</li>
    <li>Bolagsordningen är giltig och gällande</li>
    <li>Säljaren äger alla aktier utan belastning eller säkerhet</li>
    <li>Det finns inga andra återstående krav från tidigare ägen</li>
  </ul>
  
  <h3>6.2 Finansiell Information</h3>
  <ul>
    <li>De finansiella rapporterna är korrekta och kompletta</li>
    <li>Årsredovisningarna följer Bokföringslagen och IFRS-principerna</li>
    <li>Ingen väsentlig förändring i finansiell ställning sedan senaste rapport</li>
    <li>Alla skatter är betalda korrekt och i tid</li>
  </ul>
  
  <h3>6.3 Affärsverksamhet</h3>
  <ul>
    <li>Bolaget är driftskompetent och legitim</li>
    <li>Alla väsentliga kontrakt är giltiga och bindande</li>
    <li>Det finns inga pågående rättstvister eller anspråk</li>
    <li>Bolagets personalpolicy följer aktuell lagstiftning</li>
  </ul>
  
  <h3>6.4 Miljö- och Säkerhetsöversikt</h3>
  <ul>
    <li>Bolaget följer all miljölagstiftning</li>
    <li>Alla arbetsplatsöversyn är genomförda korrekt</li>
    <li>Det finns inga miljöproblem eller latenta risker</li>
  </ul>
  
  <h2>7. Köparens Försäkringar och Åtaganden</h2>
  
  <h3>7.1 Betalningsförmåga</h3>
  <ul>
    <li>Köparen har tillräckliga medel för att genomföra köpet</li>
    <li>Köparen är juridiskt befogad att ingå detta Avtal</li>
    <li>Inga andra åtaganden hindrar genomförandet</li>
  </ul>
  
  <div class="footer">
    <p>Share Purchase Agreement - Försäkringar & Åtaganden</p>
  </div>
</div>

<!-- INDEMNIFICATION -->
<div class="page">
  <h1>GOTTGÖRELSE OCH ANSVARSBEGRÄNSNING</h1>
  
  <h2>8. Säljarens Gottgörelseskyldighet</h2>
  
  <h3>8.1 Allmän Gottgörelse</h3>
  <p>Säljaren åtar sig att gottgöra Köparen för alla förluster eller skador som uppstår på grund av:</p>
  <ul>
    <li>Brott mot försäkringar och åtaganden i detta Avtal</li>
    <li>Faktisk skillnad mellan försäkrad och verklig status</li>
    <li>Dolda skulder eller åtaganden som ej uppgavs</li>
    <li>Krav från tredje parter som gör anspråk på tillgångar</li>
  </ul>
  
  <h3>8.2 Ansvarsobegränsningar</h3>
  <table>
    <tr>
      <th>Typ av Ansvar</th>
      <th>Tak</th>
      <th>Netto-lag/Tidsperiod</th>
    </tr>
    <tr>
      <td>Allmän Gottgörelse</td>
      <td>5% av Basköpeskilling</td>
      <td>18 månader från Closing</td>
    </tr>
    <tr>
      <td>Finansiell Gottgörelse</td>
      <td>10% av Basköpeskilling</td>
      <td>3 år från Closing</td>
    </tr>
    <tr>
      <td>Skattemässig Gottgörelse</td>
      <td>Unbegränsad</td>
      <td>7 år från Closing</td>
    </tr>
    <tr>
      <td>IP & Miljö Gottgörelse</td>
      <td>Unbegränsad</td>
      <td>Tidsohindrad</td>
    </tr>
  </table>
  
  <h3>8.3 Netto-lag ("Basket")</h3>
  <p>Samlad gottgörelse skall endast erläggas om:</p>
  <ul>
    <li>Enskild försäljningsyrkande överskrider 50,000 SEK</li>
    <li>Totalt gottgörelsekrav överskrider 100,000 SEK ("Basket")</li>
    <li>Därefter skall ALL gottgörelse erläggas (inklusive Basket-belopp)</li>
  </ul>
  
  <h2>9. Kapning av Ansvar</h2>
  
  <h3>9.1 Maximal Ansvar för Säljaren</h3>
  <p>Säljarens totala ansvar enligt detta Avtal skall inte överstiga:</p>
  <ul>
    <li><strong>Högsta tak:</strong> 25% av Basköpeskilling (Seller Cap)</li>
    <li><strong>Undantag:</strong> Skattemässiga och IP-relaterade anspråk är unbegränsade</li>
  </ul>
  
  <div class="footer">
    <p>Share Purchase Agreement - Gottgörelse & Ansvar</p>
  </div>
</div>

<!-- CLOSING CONDITIONS & MECHANICS -->
<div class="page">
  <h1>AVSLUTNINGSVILLKOR OCH GENOMFÖRANDE</h1>
  
  <h2>10. Avslutningsvillkor</h2>
  
  <h3>10.1 Genomförandes Bedingelser</h3>
  <p><strong>Köparen och Säljaren är endast skyldiga att genomföra Closing om:</strong></p>
  <ul>
    <li>Inga väsentliga motsägelser i försäkringar har avslöjats</li>
    <li>Alla väsentliga kontrakt har godkänts av motparter (Change of Control)</li>
    <li>Alla anställda kontrakt är godkända/inte uppsagda</li>
    <li>Finansiella rapporter är korrekta utan väsentlig avvikelse</li>
    <li>Arbetskapitalet ligger inom +/- 10% av prognostiserad nivå</li>
    <li>Inga juridiska eller regulatoriska hinder har uppstått</li>
  </ul>
  
  <h3>10.2 Avslutningsdatum ("Closing Date")</h3>
  <p><strong>Closing Date skall vara:</strong></p>
  <ul>
    <li>Tidigast: ${data.closingDate || 'TBD'}</li>
    <li>Senast: 30 dagar från signeringsdatum om inte villkor är uppfyllda</li>
    <li>Kan förlängas med 30 dagar om alla villkor nästan är uppfyllda</li>
  </ul>
  
  <h2>11. Avslutnings Procedur</h2>
  
  <h3>11.1 På Closing Date</h3>
  <ol>
    <li><strong>Böckerna avslutas</strong> vid Stämningstiden (23:59 dagen före Closing Date)</li>
    <li><strong>Arbetstidsextraktion</strong> av Working Capital genomförs</li>
    <li><strong>Betalning överförs</strong> från Köpare till Säljare enligt betalningsvillkor</li>
    <li><strong>Aktier överförs</strong> elektroniskt via VPC eller motsvarande</li>
    <li><strong>Dokument överlämnas</strong> (aktieöverlåtelser, styrelsebeslut, etc)</li>
    <li><strong>Avslutningsuppsättning</strong> undertecknas av båda parter</li>
  </ol>
  
  <h3>11.2 Post-Closing Åtgärder</h3>
  <p>Inom 10 arbetsdagar efter Closing skall:</p>
  <ul>
    <li>Bolagsregistreringen uppdateras hos Bolagsverket</li>
    <li>Banker notifieras om byte av ägare</li>
    <li>Försäkringsöverföringar genomförs</li>
    <li>Anställda presenteras för sin nya ägare</li>
  </ul>
  
  <div class="footer">
    <p>Share Purchase Agreement - Closing & Genomförande</p>
  </div>
</div>

<!-- EARNOUT & SPECIAL TERMS -->
<div class="page">
  <h1>EARNOUT-BESTÄMMELSER</h1>
  
  <h2>12. Earnout-Struktur</h2>
  
  <h3>12.1 Earnout-belopp och Perioder</h3>
  <table>
    <tr>
      <th>År</th>
      <th>Målkriteria</th>
      <th>Möjligt Earnout-belopp</th>
    </tr>
    <tr>
      <td>År 1 (Post-Closing)</td>
      <td>${data.earnoutYear1Target || 'TBD'}</td>
      <td>${data.earnoutYear1Amount || 'TBD'} SEK</td>
    </tr>
    <tr>
      <td>År 2</td>
      <td>${data.earnoutYear2Target || 'TBD'}</td>
      <td>${data.earnoutYear2Amount || 'TBD'} SEK</td>
    </tr>
    <tr>
      <td>År 3</td>
      <td>${data.earnoutYear3Target || 'TBD'}</td>
      <td>${data.earnoutYear3Amount || 'TBD'} SEK</td>
    </tr>
    <tr style="background: #e8eef5; font-weight: bold;">
      <td colspan="2">Totalt Earnout-potentiell</td>
      <td>${data.totalEarnout || 'TBD'} SEK</td>
    </tr>
  </table>
  
  <h3>12.2 Målkriteria</h3>
  <p><strong>Earnout baseras på följande KPI:</strong></p>
  <ul>
    <li><strong>Primär:</strong> Rörelseresultat (EBITDA) för respektive år</li>
    <li><strong>Sekundär:</strong> Omsättning och kundretention</li>
    <li><strong>Tertiär:</strong> Ej avkortningsrätt för utgifter relaterade till integration</li>
  </ul>
  
  <h3>12.3 Beräkning och Betalning</h3>
  <ul>
    <li>Köparen skall göra reglering av earnout inom 60 dagar efter räkenskapsårets slut</li>
    <li>Säljarens revisorer får granska all underliggande dokumentation</li>
    <li>Om det finns oenighet får tredje parts-revisor göra final bedömning</li>
    <li>Kostnad för tredje parts-revisor delas 50/50 mellan parterna</li>
  </ul>
  
  <div class="footer">
    <p>Share Purchase Agreement - Earnout-bestämmelser</p>
  </div>
</div>

<!-- NON-COMPETE & CONFIDENTIALITY -->
<div class="page">
  <h1>KONKURRENSFÖRBUD OCH KONFIDENTIALITET</h1>
  
  <h2>13. Konkurrensförbud ("Non-Compete")</h2>
  
  <h3>13.1 Säljarens Förpliktelser</h3>
  <p><strong>Säljaren åtar sig att under följande period inte:</strong></p>
  <ul>
    <li>Direkt eller indirekt vara verksam inom samma industri/bransch</li>
    <li>Ägra aktier eller äga del i konkurrerande verksamhet</li>
    <li>Anlita eller rekrytera anställda från Bolaget</li>
    <li>Dra nytta av Bolagets affärshemligheter eller kundlister</li>
  </ul>
  
  <h3>13.2 Längd och Geografisk Räckvidd</h3>
  <ul>
    <li><strong>Tidsperiod:</strong> ${data.nonCompetePeriod || '3'} år från Closing Date</li>
    <li><strong>Geografisk räckvidd:</strong> ${data.nonCompeteGeography || 'Norden'}</li>
    <li><strong>Bransch:</strong> Samma industri som Bolaget är verksamt inom</li>
  </ul>
  
  <h2>14. Konfidentialitet och Sekretess</h2>
  
  <h3>14.1 Konfidentiell Information</h3>
  <p><strong>Information som räknas som konfidentiell:</strong></p>
  <ul>
    <li>Affärsplaner och strategier</li>
    <li>Finansiella data och prognoser</li>
    <li>Kundlistor och leverantörsavtal</li>
    <li>Tekniska ritningar, källkod och IP</li>
    <li>Personuppgifter på anställda</li>
  </ul>
  
  <h3>14.2 Undantag från Sekretess</h3>
  <p><strong>Sekretessen gäller inte för:</strong></p>
  <ul>
    <li>Information som redan är offentlig</li>
    <li>Information som måste avslöjas för att uppfylla juridisk skyldighet</li>
    <li>Information som mottagaren redan kände till före avslöjandet</li>
  </ul>
  
  <h3>14.3 Sekretessperiod</h3>
  <p>Denna sekretessklausul gäller:</p>
  <ul>
    <li><strong>Före Closing:</strong> 3 år</li>
    <li><strong>Efter Closing:</strong> 5 år från Closing Date</li>
    <li><strong>För affärshemligheter:</strong> Obegränsad (enligt Trade SECRETS Act)</li>
  </ul>
  
  <div class="footer">
    <p>Share Purchase Agreement - Konkurrensförbud & Konfidentialitet</p>
  </div>
</div>

<!-- EMPLOYEE & BENEFITS -->
<div class="page">
  <h1>ANSTÄLLNING OCH FÖRMÅNER</h1>
  
  <h2>15. Övertagande av Anställda</h2>
  
  <h3>15.1 Övertagande</h3>
  <p><strong>Köparen övertar alla anställda enligt följande villkor:</strong></p>
  <ul>
    <li>Alla anställningskontrakt övergår till Köparen på oförändrade villkor</li>
    <li>Ingen uppsägning eller omstrukturering utan 3 månaders varsel (enligt LA)</li>
    <li>Löner och förmåner förblir oförändrade minst 12 månader</li>
    <li>Pensionsförpliktelser övergår enligt ITP/SPP-regler</li>
  </ul>
  
  <h3>15.2 Semesterkassor och Obetald Semester</h3>
  <p><strong>Säljaren ansvarar för utbetalning av:</strong></p>
  <ul>
    <li>All semesterkassa enligt Semesterlagen</li>
    <li>Övertid och provisioner för perioden före Closing</li>
    <li>Obetald sjuklön och semester (inräknat i nettoavräkning)</li>
  </ul>
  
  <h2>16. Personalomsättning Risker</h2>
  
  <h3>16.1 Nyckelmedarbetare</h3>
  <p><strong>Följande nyckelmedarbetare är identifierade som kritiska:</strong></p>
  <ul>
    <li>${data.keyEmployee1 || 'Namn'} (VD/Ledare)</li>
    <li>${data.keyEmployee2 || 'Namn'} (Teknik/CTO)</li>
    <li>${data.keyEmployee3 || 'Namn'} (Försäljning)</li>
  </ul>
  
  <h3>16.2 Retention-bonus</h3>
  <p>För att säkerställa lojalitet erbjuds följande retention-bonus:</p>
  <ul>
    <li><strong>VD:</strong> ${data.ceoBonus || 'TBD'} SEK efter 12 månader</li>
    <li><strong>CTO:</strong> ${data.ctoBonus || 'TBD'} SEK efter 12 månader</li>
    <li><strong>Andra nyckelpersoner:</strong> ${data.otherBonus || 'TBD'} SEK efter 12 månader</li>
  </ul>
  
  <div class="footer">
    <p>Share Purchase Agreement - Anställning & Förmåner</p>
  </div>
</div>

<!-- MISCELLANEOUS -->
<div class="page">
  <h1>ÖVRIGA BESTÄMMELSER</h1>
  
  <h2>17. Tvister och Lösning</h2>
  
  <h3>17.1 Lösningsprocess</h3>
  <ol>
    <li>Parterna försöker lösa tvisten i god tro inom 15 dagar</li>
    <li>Om ej löst, eskaleras till ledande representanter</li>
    <li>Om fortfarande olöst, kan tvisten föras till förlikning</li>
    <li>Om förlikning misslyckas, går tvisten till domstol</li>
  </ol>
  
  <h3>17.2 Tillämplig Lag</h3>
  <p>Detta Avtal skall tolkas enligt <strong>svensk rätt</strong> och genomföras enligt denna.</p>
  
  <h3>17.3 Domstol</h3>
  <p>Tvister skall prövas av <strong>Stockholms District Court</strong> eller högre instans om parts granskar.</p>
  
  <h2>18. Ändringar och Tillägg</h2>
  
  <h3>18.1 Ändringar</h3>
  <p>Ändringar av detta Avtal skall göras skriftligen och undertecknas av båda parter för att vara giltiga.</p>
  
  <h3>18.2 Hela Avtalet</h3>
  <p>Detta Avtal tillsammans med bilagor utgör hela avtalet mellan parterna. Alla tidigare överenskommelser upphävs.</p>
  
  <h2>19. Undertecknande</h2>
  
  <p><strong>Till bevis härom undertecknas detta Avtal på två originalexemplar:</strong></p>
  
  <div style="margin-top: 60px; display: flex; gap: 100px;">
    <div>
      <p style="border-top: 1px solid #000; margin-top: 40px; padding-top: 10px;">
        <strong>Säljaren</strong><br/>
        Namn: _______________________<br/>
        Underskrift: _______________________<br/>
        Datum: _______________________
      </p>
    </div>
    <div>
      <p style="border-top: 1px solid #000; margin-top: 40px; padding-top: 10px;">
        <strong>Köparen</strong><br/>
        Namn: _______________________<br/>
        Underskrift: _______________________<br/>
        Datum: _______________________
      </p>
    </div>
  </div>
  
  <div class="footer">
    <p>Share Purchase Agreement - Slutsignering | ${data.companyName || 'Bolaget'} | ${new Date().toLocaleDateString('sv-SE')}</p>
  </div>
</div>

</body>
</html>
`

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const html = generateSPAHTML(data.formData || data)
    
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    
    await page.setContent(html, { waitUntil: 'networkidle2' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: 0, bottom: 0, left: 0, right: 0 }
    })
    
    await browser.close()
    
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="SPA_Agreement.pdf"'
      }
    })
  } catch (error) {
    console.error('SPA PDF generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate SPA PDF', details: (error as Error).message },
      { status: 500 }
    )
  }
}
