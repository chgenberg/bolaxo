import { NextRequest, NextResponse } from 'next/server'
import { DEMO_DD_FULL_DATA } from '@/lib/demo-data'
import puppeteer from 'puppeteer'

const generateDDHTML = (data: any) => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Due Diligence Report - ${data.companyName}</title>
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
    .card.high { border-left-color: #e74c3c; background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%); }
    .card.medium { border-left-color: #f39c12; background: linear-gradient(135deg, #fffbf0 0%, #fff5e6 100%); }
    .card.low { border-left-color: #27ae60; background: linear-gradient(135deg, #f5fff5 0%, #e8ffe8 100%); }
    .summary-card { background: linear-gradient(135deg, #f8f9fa 0%, #e8eef5 100%); padding: 30px 20px; border-radius: 12px; text-align: center; border: 2px solid #0033cc; box-shadow: 0 6px 20px rgba(0, 51, 204, 0.15); display: inline-block; width: 30%; margin: 1%; }
    .summary-card .number { font-size: 40px; font-weight: 800; color: #0033cc; margin: 10px 0; }
    .summary-card .text { color: #2c3e50; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .recommendation { background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%); color: white; padding: 40px; border-radius: 12px; margin: 35px 0; font-size: 24px; text-align: center; font-weight: 700; box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3); }
    table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 30px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
    th { background: linear-gradient(90deg, #0033cc 0%, #0052ff 100%); color: white; padding: 18px; text-align: left; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 14px 16px; border-bottom: 1px solid #e8eef5; font-size: 13px; }
    tr:hover { background: #f8f9fa; }
    tr:last-child td { border-bottom: none; }
    ul, ol { margin: 20px 0 20px 35px; }
    li { margin: 8px 0; line-height: 1.7; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #0033cc; color: #666; font-size: 10px; text-align: center; }
    p { margin: 12px 0; line-height: 1.7; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-right: 5px; }
    .badge-high { color: #e74c3c; background: #ffebee; }
    .badge-medium { color: #f39c12; background: #fff8e1; }
    .badge-low { color: #27ae60; background: #e8f5e9; }
  </style>
</head>
<body>

<div class="page cover-page">
  <h1 style="background: none; color: white; margin: 0; padding: 0; border: none;">DUE DILIGENCE RAPPORT</h1>
  <h2 style="color: rgba(255,255,255,0.9); border: none; margin: 15px 0 80px 0; padding: 0;">Företagsbesiktning - Konfidentiell</h2>
  <div class="cover-company">${data.companyName}</div>
  <p style="opacity: 0.9; margin: 10px 0 50px 0;">Organisationsnummer: ${data.orgNumber}</p>
  <div class="cover-metadata">
    <div class="metadata-item"><span class="metadata-label">Uppdragsgivare:</span> Industrikapital Partners AB</div>
    <div class="metadata-item"><span class="metadata-label">DD-ledare:</span> Erik Andersson, Senior Partner</div>
    <div class="metadata-item"><span class="metadata-label">Analysperiod:</span> 2024-10-01 till 2024-10-28</div>
    <div class="metadata-item"><span class="metadata-label">Rapport datum:</span> ${new Date().toLocaleDateString('sv-SE')}</div>
  </div>
</div>

<div class="page">
  <h1>EXECUTIVE SUMMARY</h1>
  <div class="recommendation">✓ GENOMFÖR MED VILLKOR</div>
  
  <div class="summary-card">
    <div class="number">${(data.revenue2024 / 1000000).toFixed(1)}</div>
    <div class="text">MSEK Omsättning</div>
  </div>
  <div class="summary-card">
    <div class="number">${(data.ebitda2024 / 1000000).toFixed(1)}</div>
    <div class="text">MSEK EBITDA</div>
  </div>
  <div class="summary-card">
    <div class="number">45%</div>
    <div class="text">CAGR Tillväxt</div>
  </div>
  
  <h2>Övergripande Risknivå: MEDIUM</h2>
  <p>${data.companyName} presenterar en attraktiv investitionsmöjlighet med följande karaktäristika:</p>
  
  <h2 style="margin-top: 30px;">Kritiska Risker</h2>
  ${data.criticalRisks.map((risk: any) => `
  <div class="card high">
    <h3>🔴 ${risk.title}</h3>
    <p><strong>Mitigering:</strong> ${risk.mitigation}</p>
  </div>
  `).join('')}
  
  <h2 style="margin-top: 30px;">Mitigerbara Risker</h2>
  ${data.mediumRisks.map((risk: any) => `
  <div class="card medium">
    <h3>🟡 ${risk.title}</h3>
    <p><strong>Mitigering:</strong> ${risk.mitigation}</p>
  </div>
  `).join('')}
</div>

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
      <td>${(data.revenue2022 / 1000000).toFixed(1)}</td>
      <td>${(data.ebitda2022 / 1000000).toFixed(1)}</td>
      <td>${((data.ebitda2022 / data.revenue2022) * 100).toFixed(1)}%</td>
      <td>—</td>
    </tr>
    <tr>
      <td>2023</td>
      <td>${(data.revenue2023 / 1000000).toFixed(1)}</td>
      <td>${(data.ebitda2023 / 1000000).toFixed(1)}</td>
      <td>${((data.ebitda2023 / data.revenue2023) * 100).toFixed(1)}%</td>
      <td>+45%</td>
    </tr>
    <tr style="background: linear-gradient(90deg, #f0f7ff 0%, #e8eef5 100%);">
      <td><strong>2024E</strong></td>
      <td><strong>${(data.revenue2024 / 1000000).toFixed(1)}</strong></td>
      <td><strong>${(data.ebitda2024 / 1000000).toFixed(1)}</strong></td>
      <td><strong>${((data.ebitda2024 / data.revenue2024) * 100).toFixed(1)}%</strong></td>
      <td><strong>+12%</strong></td>
    </tr>
  </table>
  
  <h2>Nyckeltal & Metriker</h2>
  <ul>
    <li><strong>Antal Anställda:</strong> ${data.employees} FTE</li>
    <li><strong>Antal Kunder:</strong> ${data.totalCustomers}</li>
    <li><strong>Top 3 Kunder:</strong> ${data.top3Revenue}% av omsättning (RISK!)</li>
    <li><strong>Churn Rate:</strong> ${data.churnRate}% årlig</li>
    <li><strong>NPS Score:</strong> ${data.nps} (Stark!)</li>
    <li><strong>Test Coverage:</strong> ${data.testCoverage}%</li>
    <li><strong>System Uptime:</strong> ${data.uptime}% SLA</li>
  </ul>
</div>

<div class="page">
  <h1>TEKNISK BEDÖMNING</h1>
  
  <h2>Arkitektur & Infrastruktur</h2>
  <div class="card">
    <p><strong>Teknikstack:</strong> ${data.techStack}</p>
    <p><strong>Cloud vs On-Premise:</strong> ${data.cloudVsOnpremise}</p>
    <p><strong>Datacenter:</strong> ${data.datacenters}</p>
    <p><strong>Backup & Disaster Recovery:</strong> ${data.backupStrategy}</p>
  </div>
  
  <h2>Säkerhet</h2>
  <ul>
    <li><strong>Certifieringar:</strong> ${data.securityCertification}</li>
    <li><strong>Test Coverage:</strong> ${data.testCoverage}% (Industry avg 60%)</li>
    <li><strong>Uptime SLA:</strong> ${data.uptime}% (zeer stabil!)</li>
    <li><strong>GDPR Compliance:</strong> ✓ Confirmerad</li>
  </ul>
  
  <h2>Risk Assessment: LÅGT</h2>
  <div class="card low">
    <p>Teknisk infrastruktur är väl utvecklad, modern och säker. 100% cloud-baserat reducerar on-premise risker betydligt.</p>
  </div>
</div>

<div class="page">
  <h1>ORGANISATION & PERSONAL</h1>
  
  <h2>Organisationsstruktur</h2>
  <table>
    <tr>
      <th>Roll</th>
      <th>Namn</th>
      <th>Tenure</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>VD/CEO</td>
      <td>${data.ceoName}</td>
      <td>Långtid</td>
      <td><span class="badge badge-low">Kritisk</span></td>
    </tr>
    <tr>
      <td>CFO</td>
      <td>${data.cfoName}</td>
      <td>Medium</td>
      <td><span class="badge badge-low">Viktig</span></td>
    </tr>
    <tr>
      <td>CTO</td>
      <td>${data.ctoName}</td>
      <td>Långtid</td>
      <td><span class="badge badge-high">Kritisk</span></td>
    </tr>
  </table>
  
  <h2>Personalnyckeltal</h2>
  <ul>
    <li><strong>Totalt antal:</strong> ${data.employees} FTE</li>
    <li><strong>Genomsnittlig tenure:</strong> ${data.avgTenure} år</li>
    <li><strong>Årlig turnover:</strong> ${data.turnover}% (låg, bra tecken)</li>
  </ul>
  
  <h2>Risk Assessment: HÖGT</h2>
  <div class="card high">
    <p>Betydande nyckelpersonsberoende. VD, CTO och Head of Sales är kritiska. Retention-bonus rekommenderas starkt.</p>
  </div>
</div>

<div class="page">
  <h1>KOMMERSIELL BEDÖMNING</h1>
  
  <h2>Marknadspojition</h2>
  <table>
    <tr>
      <th>Metrik</th>
      <th>Värde</th>
    </tr>
    <tr>
      <td>Market Share</td>
      <td>${data.marketShare}%</td>
    </tr>
    <tr>
      <td>Total Addressable Market (TAM)</td>
      <td>${(data.tam / 1000000000).toFixed(1)} MSEK</td>
    </tr>
    <tr>
      <td>Bransch</td>
      <td>${data.industry}</td>
    </tr>
    <tr>
      <td>Konkurrenter</td>
      <td>3-5 större spelare</td>
    </tr>
  </table>
  
  <h2>Kundbas</h2>
  <ul>
    <li><strong>Totalt antal kunder:</strong> ${data.totalCustomers}</li>
    <li><strong>Största kund:</strong> ${data.topCustomerRevenue}% av omsättning</li>
    <li><strong>Top 3:</strong> ${data.top3Revenue}% av omsättning</li>
    <li><strong>Top 10:</strong> ${data.top10Revenue}% av omsättning</li>
    <li><strong>Churn Rate:</strong> ${data.churnRate}% årlig</li>
    <li><strong>NPS:</strong> ${data.nps}/100 (Excellent!)</li>
  </ul>
  
  <h2>Risk Assessment: MEDIUM-HIGH</h2>
  <div class="card medium">
    <p>Kundberoende är högt med Top 3 representerar ${data.top3Revenue}% av revenue. Pre-closing kundkommunikation obligatorisk.</p>
  </div>
</div>

<div class="page">
  <h1>SLUTSATS & REKOMMENDATION</h1>
  
  <div class="recommendation">✓ GENOMFÖR FÖRVÄRVET MED FOKUSERADE ÅTGÄRDER</div>
  
  <h2>Styrkor</h2>
  <ul>
    ${data.strengths.map((strength: any) => `<li>${strength}</li>`).join('')}
  </ul>
  
  <h2>Kritiska Villkor för Genomförande</h2>
  <div class="card high">
    <ol>
      <li><strong>Retention-bonus för ledning:</strong> 2-år commitment för CTO, Head of Sales, CEO</li>
      <li><strong>Kund-säkring:</strong> Pre-closing calls med Top 3 kunder innan closing</li>
      <li><strong>Cloud migration:</strong> Börja omedelbar, 3-4 mån timeline</li>
      <li><strong>Integration plan:</strong> Dedikerad team, 100-dagars roadmap</li>
    </ol>
  </div>
  
  <h2>Förväntad Avkastning</h2>
  <div class="summary-card">
    <div class="number">2.5x</div>
    <div class="text">Conservative (25% IRR)</div>
  </div>
  <div class="summary-card">
    <div class="number">3.2x</div>
    <div class="text">Base Case (35% IRR)</div>
  </div>
  <div class="summary-card">
    <div class="number">4.5x</div>
    <div class="text">SaaS Success (50% IRR)</div>
  </div>
  
  <div class="footer">
    <p>Due Diligence Report | ${data.companyName} | ${new Date().toLocaleDateString('sv-SE')}</p>
    <p>Denna rapport är konfidentiell och endast avsedd för auktoriserade mottagare.</p>
  </div>
</div>

</body>
</html>
`

export async function POST(request: NextRequest) {
  try {
    const html = generateDDHTML(DEMO_DD_FULL_DATA)
    
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: 0, bottom: 0, left: 0, right: 0 }
    })
    
    await browser.close()
    
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="DD_Report_Demo_CloudTech.pdf"'
      }
    })
  } catch (error) {
    console.error('Demo DD generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate DD report', details: (error as Error).message },
      { status: 500 }
    )
  }
}
