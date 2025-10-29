import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

const generateBeautifulHTML = () => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Due Diligence Report - TechVision AB</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #2c3e50;
      background: #f8f9fa;
      line-height: 1.6;
    }
    
    .page-break {
      page-break-after: always;
      padding: 60px;
      background: white;
      margin-bottom: 20px;
    }
    
    /* Cover Page */
    .cover-page {
      background: linear-gradient(135deg, #003366 0%, #004d99 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
    }
    
    .cover-page h1 {
      font-size: 48px;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    .cover-page h2 {
      font-size: 24px;
      margin-bottom: 60px;
      font-weight: 300;
      opacity: 0.9;
    }
    
    .cover-metadata {
      margin-top: 100px;
      border-top: 1px solid rgba(255,255,255,0.3);
      padding-top: 40px;
    }
    
    .metadata-item {
      margin: 12px 0;
      font-size: 14px;
    }
    
    .metadata-label {
      opacity: 0.8;
    }
    
    /* Headers */
    h1 {
      color: #003366;
      font-size: 32px;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 3px solid #003366;
    }
    
    h2 {
      color: #004d99;
      font-size: 24px;
      margin-top: 40px;
      margin-bottom: 20px;
    }
    
    h3 {
      color: #0066cc;
      font-size: 18px;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    
    /* Cards & Boxes */
    .card {
      background: white;
      border-left: 4px solid #003366;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .card.high-risk {
      border-left-color: #d9534f;
      background: #fff5f5;
    }
    
    .card.medium-risk {
      border-left-color: #f0ad4e;
      background: #fffbf0;
    }
    
    .card.low-risk {
      border-left-color: #5cb85c;
      background: #f5fff5;
    }
    
    .metric-box {
      display: inline-block;
      background: #f0f7ff;
      padding: 20px 30px;
      border-radius: 8px;
      margin: 10px 15px 10px 0;
      text-align: center;
      min-width: 150px;
    }
    
    .metric-box .value {
      font-size: 28px;
      font-weight: bold;
      color: #003366;
    }
    
    .metric-box .label {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    
    th {
      background: #003366;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    tr:hover {
      background: #f8f9fa;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    /* Risk Badge */
    .risk-high {
      color: #d9534f;
      font-weight: bold;
      background: #ffebee;
      padding: 2px 8px;
      border-radius: 3px;
    }
    
    .risk-medium {
      color: #f0ad4e;
      font-weight: bold;
      background: #fff8e1;
      padding: 2px 8px;
      border-radius: 3px;
    }
    
    .risk-low {
      color: #5cb85c;
      font-weight: bold;
      background: #e8f5e9;
      padding: 2px 8px;
      border-radius: 3px;
    }
    
    /* Chart Container */
    .chart-container {
      position: relative;
      height: 300px;
      margin: 30px 0;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    /* Lists */
    ul, ol {
      margin: 15px 0 15px 30px;
    }
    
    li {
      margin: 8px 0;
    }
    
    /* Footer */
    .footer {
      margin-top: 80px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #999;
      font-size: 12px;
      text-align: center;
    }
    
    /* Recommendation Box */
    .recommendation {
      background: linear-gradient(135deg, #5cb85c 0%, #5cb85c 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin: 30px 0;
      font-size: 18px;
      text-align: center;
      font-weight: bold;
    }
    
    /* Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .summary-card .number {
      font-size: 32px;
      font-weight: bold;
      color: #003366;
    }
    
    .summary-card .text {
      color: #666;
      margin-top: 10px;
      font-size: 14px;
    }
  </style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page-break cover-page">
  <h1>DUE DILIGENCE RAPPORT</h1>
  <h2>Företagsbesiktning - Konfidentiell</h2>
  
  <div style="margin: 60px 0;">
    <h3 style="font-size: 28px; color: white; margin: 0;">TechVision AB</h3>
    <p style="margin-top: 10px; opacity: 0.9;">Organisationsnummer: 556234-5678</p>
  </div>
  
  <div class="cover-metadata">
    <div class="metadata-item"><span class="metadata-label">Uppdragsgivare:</span> Industrikapital Partners AB</div>
    <div class="metadata-item"><span class="metadata-label">DD-ledare:</span> Erik Andersson, Senior Partner</div>
    <div class="metadata-item"><span class="metadata-label">Analysperiod:</span> 2024-10-01 till 2024-10-28</div>
    <div class="metadata-item"><span class="metadata-label">Rapport datum:</span> 2024-10-29</div>
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="page-break">
  <h1>INNEHÅLLSFÖRTECKNING</h1>
  <ol style="font-size: 16px; line-height: 2;">
    <li>Executive Summary</li>
    <li>Finansiell Analys</li>
    <li>Juridisk Bedömning</li>
    <li>Kommersiell Bedömning</li>
    <li>HR & Organisation</li>
    <li>Teknisk Bedömning</li>
    <li>Risköversikt</li>
    <li>Värdering</li>
    <li>Integrationsplan</li>
    <li>Slutsats & Rekommendation</li>
  </ol>
</div>

<!-- EXECUTIVE SUMMARY -->
<div class="page-break">
  <h1>EXECUTIVE SUMMARY</h1>
  
  <div class="recommendation">✓ REKOMMENDATION: GENOMFÖR MED VILLKOR</div>
  
  <h2>Övergripande Risknivå: MEDIUM</h2>
  <p>TechVision AB presenterar en attraktiv investitionsmöjlighet trots vissa riskfaktorer som kan mitigeras genom strukturerade åtgärder.</p>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="number">52.0</div>
      <div class="text">MSEK Omsättning 2024</div>
    </div>
    <div class="summary-card">
      <div class="number">10.4</div>
      <div class="text">MSEK EBITDA (20%)</div>
    </div>
    <div class="summary-card">
      <div class="number">45%</div>
      <div class="text">CAGR 2021-2024</div>
    </div>
  </div>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="number">150</div>
      <div class="text">MSEK Värdering</div>
    </div>
    <div class="summary-card">
      <div class="number">14.4x</div>
      <div class="text">EV/EBITDA</div>
    </div>
    <div class="summary-card">
      <div class="number">35%</div>
      <div class="text">Kund-koncentration</div>
    </div>
  </div>
  
  <h2>Kritiska Villkor för Genomförande</h2>
  <div class="card">
    <ul>
      <li>✓ Retention-avtal med CTO, Head of Sales (2-år commitment)</li>
      <li>✓ Säkra Top-3 kund-relationer före closing</li>
      <li>✓ Cloud migration plan (AWS/Azure, 3-4 mån)</li>
      <li>✓ 100-dagars integration plan</li>
    </ul>
  </div>
</div>

<!-- FINANSIELL ANALYS -->
<div class="page-break">
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
      <td>-</td>
    </tr>
    <tr>
      <td>2023</td>
      <td>46.4</td>
      <td>10.1</td>
      <td>21.7%</td>
      <td>+45%</td>
    </tr>
    <tr style="background: #f8f9fa; font-weight: bold;">
      <td>2024E</td>
      <td>52.0</td>
      <td>10.4</td>
      <td>20.0%</td>
      <td>+12%</td>
    </tr>
  </table>
  
  <div class="card high-risk">
    <h3>🔴 [HIGH] Stark omsättningsökning men sjunkande marginaler</h3>
    <p><strong>Beskrivning:</strong> EBITDA-marginalen har sjunkit från 28% till 20% på grund av ökade personalkostnader och marknadspressing.</p>
    <p style="margin-top: 10px;"><strong>Root cause:</strong></p>
    <ul>
      <li>Personal kostnader +15% YoY</li>
      <li>Konkurrens från nya marknadsaktörer</li>
      <li>Investering i R&D och produktutveckling</li>
    </ul>
    <p style="margin-top: 10px;"><strong>Rekommendation:</strong> Kostnadsoptimering genom automation + offshore. Målmarginal 26% är uppnåbar inom 12 mån.</p>
  </div>
  
  <div class="card medium-risk">
    <h3>🟡 [MEDIUM] Arbetskapitalberoende</h3>
    <p><strong>Cash Conversion Cycle:</strong> 75 dagar (DSO 60 - DPO 45)</p>
    <p><strong>WC behov för 100 MSEK omsättning:</strong> ~2.0 MSEK</p>
    <p style="margin-top: 10px;"><strong>Rekommendation:</strong> Finansieringsarrangemang för WC. Överväg factoring för accelererad kassainsamling.</p>
  </div>
  
  <div class="card low-risk">
    <h3>🟢 [LOW] Skatteoptimering - Unrealized Potential</h3>
    <p><strong>Potential skatteåterbäring:</strong> 500-800 KSEK över 3 år (R&D tax credits)</p>
    <p><strong>Årlig benefit:</strong> ~250 KSEK</p>
  </div>
</div>

<!-- JURIDISK BEDÖMNING -->
<div class="page-break">
  <h1>JURIDISK BEDÖMNING</h1>
  
  <h2>Kundkontrakt - Change of Control Risk</h2>
  
  <table>
    <tr>
      <th>Kund</th>
      <th>% Omsättning</th>
      <th>Kontraktvillkor</th>
      <th>CoC Risk</th>
      <th>Risk Level</th>
    </tr>
    <tr>
      <td>Televerket</td>
      <td>18%</td>
      <td>3 år (renew 2026)</td>
      <td>Auto-termination möjlig</td>
      <td><span class="risk-high">HIGH</span></td>
    </tr>
    <tr>
      <td>Vattenfall Digital</td>
      <td>12%</td>
      <td>2 år (expires 2025)</td>
      <td>Standard CoC</td>
      <td><span class="risk-medium">MEDIUM</span></td>
    </tr>
    <tr>
      <td>Scania Digital</td>
      <td>5%</td>
      <td>1 år (renew Q4 24)</td>
      <td>Ingen specifik CoC</td>
      <td><span class="risk-low">LOW</span></td>
    </tr>
    <tr style="background: #f8f9fa; font-weight: bold;">
      <td>Övriga 44 kunder</td>
      <td>65%</td>
      <td>Blandade (1-3 år)</td>
      <td>Låga villkor generellt</td>
      <td><span class="risk-low">LOW</span></td>
    </tr>
  </table>
  
  <div class="card high-risk">
    <h3>⚠️ Kritisk: Pre-closing kundkommunikation obligatorisk</h3>
    <p>De tre top-kunderna måste kontaktas före closing för att säkra relation. Budget för möjlig prisrabatt: 5-10%.</p>
  </div>
  
  <div class="card low-risk">
    <h3>IP-rättigheter - Rensad</h3>
    <p>✓ All källkod och IP korrekt registrerad på bolaget</p>
    <p>✓ 3 patenterbara algoritmer identifierade (investment för filing: ~100 KSEK)</p>
  </div>
</div>

<!-- FINANSIELL VÄRDERING -->
<div class="page-break">
  <h1>VÄRDERING & FINANSIERING</h1>
  
  <h2>Värderingsmatris</h2>
  
  <table>
    <tr>
      <th>Metod</th>
      <th>Värdering</th>
      <th>Multipel/Antaganden</th>
    </tr>
    <tr>
      <td>DCF (WACC 12%, TV 3%)</td>
      <td><strong>155 MSEK</strong></td>
      <td>Base case scenario</td>
    </tr>
    <tr>
      <td>EV/Revenue (2.9x)</td>
      <td><strong>150 MSEK</strong></td>
      <td>52 MSEK × 2.9x</td>
    </tr>
    <tr>
      <td>EV/EBITDA (14.4x)</td>
      <td><strong>150 MSEK</strong></td>
      <td>10.4 MSEK × 14.4x</td>
    </tr>
    <tr style="background: #e8f5e9; font-weight: bold;">
      <td>Fair Value Range</td>
      <td>145-165 MSEK</td>
      <td><strong>Target: 150 MSEK</strong></td>
    </tr>
  </table>
  
  <h2>Känslighetsanalys</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="number" style="color: #d9534f;">135</div>
      <div class="text">Bear Case (-10%)</div>
    </div>
    <div class="summary-card">
      <div class="number" style="color: #003366;">150</div>
      <div class="text">Base Case</div>
    </div>
    <div class="summary-card">
      <div class="number" style="color: #5cb85c;">170</div>
      <div class="text">Bull Case (+13%)</div>
    </div>
  </div>
  
  <h2>Förväntad Avkastning (IRR over 5 år)</h2>
  <div class="card">
    <ul>
      <li><strong>Conservative Scenario:</strong> 2.5x MOIC, 25% IRR</li>
      <li><strong>Base Scenario:</strong> 3.2x MOIC, 35% IRR</li>
      <li><strong>SaaS Success Scenario:</strong> 4.5x MOIC, 50% IRR</li>
    </ul>
  </div>
</div>

<!-- INTEGRATIONSPLAN -->
<div class="page-break">
  <h1>INTEGRATIONSPLAN - 100 DAGAR ROADMAP</h1>
  
  <h2>Dag 1-14: Foundation & Communication</h2>
  <div class="card">
    <ul>
      <li>Announce acquisition till all employees</li>
      <li>Retention-bonus signing (CTO, Head of Sales, CEO)</li>
      <li>Top 10 customer calls (reassurance + handling CoC)</li>
      <li>Integration team appointment (5 FTE)</li>
    </ul>
  </div>
  
  <h2>Dag 15-30: Quick Wins & Stabilization</h2>
  <div class="card">
    <ul>
      <li>Cloud migration kickoff (AWS/Azure setup)</li>
      <li>Sales team integration planning</li>
      <li>Financial systems consolidation</li>
      <li>Culture & brand workshops</li>
    </ul>
  </div>
  
  <h2>Dag 31-100: Deep Integration & Value Creation</h2>
  <div class="card">
    <ul>
      <li>Cloud migration execution (50% complete)</li>
      <li>Cross-selling pilot (target: 5 new deals)</li>
      <li>Cost synergy identification (target: 3-5 MSEK)</li>
      <li>SaaS product roadmap finalization</li>
    </ul>
  </div>
  
  <h2>Förväntade Synergier (År 2+)</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="number" style="color: #5cb85c;">15-20</div>
      <div class="text">Revenue Synergier (MSEK)</div>
    </div>
    <div class="summary-card">
      <div class="number" style="color: #5cb85c;">3-5</div>
      <div class="text">Cost Synergier (MSEK)</div>
    </div>
    <div class="summary-card">
      <div class="number" style="color: #5cb85c;">18-25</div>
      <div class="text">Total Annual (MSEK)</div>
    </div>
  </div>
</div>

<!-- SLUTSATS -->
<div class="page-break">
  <h1>SLUTSATS & REKOMMENDATION</h1>
  
  <div class="recommendation" style="background: linear-gradient(135deg, #5cb85c 0%, #5cb85c 100%); font-size: 24px;">
    ✓ REKOMMENDATION: GENOMFÖR FÖRVÄRVET
  </div>
  
  <h2>Styrkor</h2>
  <div class="card low-risk">
    <ul>
      <li>✓ Stark marknadspojtion (Top 3 i segmentet)</li>
      <li>✓ Erfaren ledning (5-8 år tenure)</li>
      <li>✓ Solid produkt (95% NPS)</li>
      <li>✓ Tillväxtbana (45% CAGR)</li>
      <li>✓ SaaS-potential (2-3x värderings multipel upside)</li>
    </ul>
  </div>
  
  <h2>Kritiska Villkor</h2>
  <div class="card high-risk">
    <ol>
      <li><strong>Retention:</strong> 2-årig bonus för CTO, CEO, Head of Sales</li>
      <li><strong>Kund-relationer:</strong> Pre-closing calls med Top 3</li>
      <li><strong>Infrastruktur:</strong> Cloud migration inom 4 mån</li>
      <li><strong>Integration:</strong> Dedicated team + 100-day plan</li>
    </ol>
  </div>
  
  <h2>Exit Strategi (5-7 år)</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="text" style="margin: 0; color: #003366; font-weight: bold;">Strategic Buyer</div>
      <div class="number" style="font-size: 20px; color: #5cb85c;">3-4x MOIC</div>
    </div>
    <div class="summary-card">
      <div class="text" style="margin: 0; color: #003366; font-weight: bold;">Financial Buyer</div>
      <div class="number" style="font-size: 20px; color: #5cb85c;">2.5-3x MOIC</div>
    </div>
    <div class="summary-card">
      <div class="text" style="margin: 0; color: #003366; font-weight: bold;">IPO Option</div>
      <div class="number" style="font-size: 20px; color: #5cb85c;">Leveraged</div>
    </div>
  </div>
  
  <div class="footer">
    <p>Denna rapport är konfidentiell och endast avsedd för auktoriserade mottagare.</p>
    <p>Rapport datum: 2024-10-29 | DD-ledare: Erik Andersson, Senior Partner</p>
    <p>Industrikapital Partners AB</p>
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
