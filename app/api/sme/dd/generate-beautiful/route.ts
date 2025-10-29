import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

const generateBeautifulHTML = () => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Due Diligence Report - TechVision AB</title>
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
    
    /* COVER PAGE - GORGEOUS */
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
    
    .card.high-risk {
      border-left: 5px solid #e74c3c;
      background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
      border-radius: 8px;
    }
    
    .card.medium-risk {
      border-left: 5px solid #f39c12;
      background: linear-gradient(135deg, #fffbf0 0%, #fff5e6 100%);
      border-radius: 8px;
    }
    
    .card.low-risk {
      border-left: 5px solid #27ae60;
      background: linear-gradient(135deg, #f5fff5 0%, #e8ffe8 100%);
      border-radius: 8px;
    }
    
    /* METRIC BOXES */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 25px;
      margin: 35px 0;
    }
    
    .summary-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #e8eef5 100%);
      padding: 30px 20px;
      border-radius: 12px;
      text-align: center;
      border: 2px solid #0033cc;
      box-shadow: 0 6px 20px rgba(0, 51, 204, 0.15);
    }
    
    .summary-card .number {
      font-size: 40px;
      font-weight: 800;
      color: #0033cc;
      margin: 10px 0;
    }
    
    .summary-card .text {
      color: #2c3e50;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* RECOMMENDATION BOX */
    .recommendation {
      background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
      color: white;
      padding: 40px;
      border-radius: 12px;
      margin: 35px 0;
      font-size: 24px;
      text-align: center;
      font-weight: 700;
      box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
      letter-spacing: 1px;
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
    
    tr[style*="background"] {
      font-weight: 600;
      background: linear-gradient(90deg, #f0f7ff 0%, #e8eef5 100%) !important;
    }
    
    /* RISK BADGES */
    .risk-high {
      color: #e74c3c;
      font-weight: 700;
      background: #ffebee;
      padding: 4px 10px;
      border-radius: 4px;
      display: inline-block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .risk-medium {
      color: #f39c12;
      font-weight: 700;
      background: #fff8e1;
      padding: 4px 10px;
      border-radius: 4px;
      display: inline-block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .risk-low {
      color: #27ae60;
      font-weight: 700;
      background: #e8f5e9;
      padding: 4px 10px;
      border-radius: 4px;
      display: inline-block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
  </style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page cover-page">
  <h1 style="background: none; color: white; margin: 0; padding: 0; border: none;">DUE DILIGENCE RAPPORT</h1>
  <h2 style="color: rgba(255,255,255,0.9); border: none; margin: 15px 0 80px 0; padding: 0;">Företagsbesiktning - Konfidentiell</h2>
  
  <div class="cover-company">TechVision AB</div>
  <p style="opacity: 0.9; margin: 10px 0 50px 0;">Organisationsnummer: 556234-5678</p>
  
  <div class="cover-metadata">
    <div class="metadata-item"><span class="metadata-label">Uppdragsgivare:</span> Industrikapital Partners AB</div>
    <div class="metadata-item"><span class="metadata-label">DD-ledare:</span> Erik Andersson, Senior Partner</div>
    <div class="metadata-item"><span class="metadata-label">Analysperiod:</span> 2024-10-01 till 2024-10-28</div>
    <div class="metadata-item"><span class="metadata-label">Rapport datum:</span> 2024-10-29</div>
  </div>
</div>

<!-- EXECUTIVE SUMMARY -->
<div class="page">
  <h1>EXECUTIVE SUMMARY</h1>
  
  <div class="recommendation">✓ GENOMFÖR MED VILLKOR</div>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="number">52.0</div>
      <div class="text">MSEK Omsättning</div>
    </div>
    <div class="summary-card">
      <div class="number">10.4</div>
      <div class="text">MSEK EBITDA</div>
    </div>
    <div class="summary-card">
      <div class="number">45%</div>
      <div class="text">CAGR Tillväxt</div>
    </div>
  </div>
  
  <h2>Övergripande Risknivå: MEDIUM</h2>
  <p>TechVision AB presenterar en attraktiv investitionsmöjlighet med följande karaktäristika:</p>
  
  <div class="card high-risk">
    <h3>🔴 Kritiska Risker</h3>
    <ul>
      <li><strong>Kundberoende:</strong> 35% från 3 större kunder (HÖGSTA RISK)</li>
      <li><strong>Infrastruktur:</strong> On-premise servrar från 2016 (MÅSTE MIGRERAS)</li>
      <li><strong>Nyckelpersoner:</strong> CTO och Head of Sales kritiska (RETENTION KRÄVS)</li>
    </ul>
  </div>
  
  <div class="card medium-risk">
    <h3>🟡 Mitigerbara Risker</h3>
    <ul>
      <li>Marginalpressing (20% EBITDA-marginal, mål 26%)</li>
      <li>Arbetande kapital (2 MSEK behövs för skalning)</li>
      <li>Säkerhet (saknar SOC2 Type II)</li>
    </ul>
  </div>
  
  <div class="card low-risk">
    <h3>🟢 Styrkor</h3>
    <ul>
      <li>Strong product (95% NPS)</li>
      <li>Erfaren ledning (5-8 år tenure)</li>
      <li>SaaS-potential (2-3x värderingsmultipel upside)</li>
    </ul>
  </div>
</div>

<!-- FINANSIELL ANALYS -->
<div class="page">
  <h1>FINANSIELL ANALYS</h1>
  
  <h2>Historisk Utveckling (2022-2024)</h2>
  
  <table>
    <tr>
      <th>År</th>
      <th>Omsättning (MSEK)</th>
      <th>EBITDA (MSEK)</th>
      <th>Marginal</th>
      <th>Tillväxt</th>
    </tr>
    <tr>
      <td>2022</td>
      <td>32.0</td>
      <td>9.0</td>
      <td>28.1%</td>
      <td>—</td>
    </tr>
    <tr>
      <td>2023</td>
      <td>46.4</td>
      <td>10.1</td>
      <td>21.7%</td>
      <td>+45%</td>
    </tr>
    <tr style="background: linear-gradient(90deg, #f0f7ff 0%, #e8eef5 100%);">
      <td><strong>2024E</strong></td>
      <td><strong>52.0</strong></td>
      <td><strong>10.4</strong></td>
      <td><strong>20.0%</strong></td>
      <td><strong>+12%</strong></td>
    </tr>
  </table>
  
  <h2>Värdering</h2>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="number">155</div>
      <div class="text">DCF Värdering</div>
    </div>
    <div class="summary-card">
      <div class="number">14.4x</div>
      <div class="text">EV/EBITDA</div>
    </div>
    <div class="summary-card">
      <div class="number">2.9x</div>
      <div class="text">EV/Revenue</div>
    </div>
  </div>
  
  <h3>Fair Value Range: 145-165 MSEK | Target: 150 MSEK</h3>
  
  <div class="card">
    <h3>Känslighetssanalys</h3>
    <ul>
      <li><strong>Bear Case (-10%):</strong> 135 MSEK (om churn ökar, margin faller)</li>
      <li><strong>Base Case:</strong> 150 MSEK (realistisk scenario)</li>
      <li><strong>Bull Case (+13%):</strong> 170 MSEK (om SaaS lyckas, margin recovers)</li>
    </ul>
  </div>
</div>

<!-- REKOMMENDATION PAGE -->
<div class="page">
  <h1>SLUTSATS & REKOMMENDATION</h1>
  
  <div class="recommendation" style="background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);">✓ GENOMFÖR FÖRVÄRVET MED FOKUSERADE ÅTGÄRDER</div>
  
  <h2>Kritiska Villkor för Genomförande</h2>
  
  <div class="card high-risk">
    <ol>
      <li><strong>Retention-bonus för ledning:</strong> 2-år commitment för CTO, Head of Sales, CEO (1-2 MSEK)</li>
      <li><strong>Kund-säkring:</strong> Pre-closing calls med Top 3 kunder innan closing</li>
      <li><strong>Cloud migration:</strong> Börja omedelbar, 3-4 mån timeline, 200-300 KSEK budget</li>
      <li><strong>Integration plan:</strong> Dedikerad team, 100-dagars roadmap</li>
    </ol>
  </div>
  
  <h2>Förväntad Avkastning</h2>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="number" style="font-size: 32px;">2.5x</div>
      <div class="text">Conservative (25% IRR)</div>
    </div>
    <div class="summary-card">
      <div class="number" style="font-size: 32px;">3.2x</div>
      <div class="text">Base Case (35% IRR)</div>
    </div>
    <div class="summary-card">
      <div class="number" style="font-size: 32px;">4.5x</div>
      <div class="text">SaaS Success (50% IRR)</div>
    </div>
  </div>
  
  <div class="card medium-risk">
    <h3>Förväntade Synergier (År 2+)</h3>
    <ul>
      <li>Revenue synergier: 15-20 MSEK (cross-selling)</li>
      <li>Cost synergier: 3-5 MSEK (shared services)</li>
      <li>Total annual lift: 18-25 MSEK</li>
    </ul>
  </div>
  
  <div class="footer">
    <p>Denna rapport är konfidentiell och endast avsedd för auktoriserade mottagare.</p>
    <p>Rapport datum: 2024-10-29 | DD-ledare: Erik Andersson, Senior Partner | Industrikapital Partners AB</p>
  </div>
</div>

</body>
</html>
`

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(generateBeautifulHTML(), { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      printBackground: true
    })
    
    await browser.close()
    
    // Convert Uint8Array to Buffer for NextResponse
    const pdfBufferConverted = Buffer.from(pdfBuffer)
    
    return new NextResponse(pdfBufferConverted, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="DD-Report-TechVision-Beautiful-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating beautiful DD report:', error)
    return NextResponse.json({
      error: 'Failed to generate DD report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
