import { NextRequest, NextResponse } from 'next/server'
import { EXTENDED_DD_DATA } from '@/lib/demo-data'
import puppeteer from 'puppeteer'

const generateFullDDHTML = (data: any) => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Due Diligence Report - ${data.companyName}</title>
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
    .card.high { border-left-color: #e74c3c; background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%); }
    .card.medium { border-left-color: #f39c12; background: linear-gradient(135deg, #fffbf0 0%, #fff5e6 100%); }
    .recommendation { background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%); color: white; padding: 20px; border-radius: 8px; margin: 15px 0; font-size: 14px; text-align: center; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; }
    th { background: linear-gradient(90deg, #0033cc 0%, #0052ff 100%); color: white; padding: 10px; text-align: left; font-weight: 700; }
    td { padding: 8px 10px; border-bottom: 1px solid #e8eef5; }
    tr:hover { background: #f8f9fa; }
    ul, ol { margin: 10px 0 10px 25px; }
    li { margin: 5px 0; line-height: 1.5; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #0033cc; color: #888; font-size: 9px; text-align: center; }
    p { margin: 8px 0; line-height: 1.6; }
    .badge { display: inline-block; padding: 3px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; margin-right: 5px; }
    .badge-high { color: #e74c3c; background: #ffebee; }
    .badge-medium { color: #f39c12; background: #fff8e1; }
  </style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page cover-page">
  <h1 style="background: none; color: white; margin: 0; padding: 0;">DUE DILIGENCE RAPPORT</h1>
  <p style="font-size: 20px; margin: 20px 0; opacity: 0.9;">Företagsbesiktning - Konfidentiell</p>
  <div class="cover-company">${data.companyName}</div>
  <p style="opacity: 0.9; margin: 10px 0 40px 0;">Organisationsnummer: ${data.orgNumber}</p>
  <div style="margin-top: 80px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 30px; text-align: left; display: inline-block; font-size: 13px;">
    <p><strong>Uppdragsgivare:</strong> Industrikapital Partners AB</p>
    <p><strong>DD-ledare:</strong> Erik Andersson, Senior Partner</p>
    <p><strong>Analysperiod:</strong> 2024-10-01 till 2024-10-28</p>
    <p><strong>Datum:</strong> ${new Date().toLocaleDateString('sv-SE')}</p>
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="page">
  <h1>INNEHÅLLSFÖRTECKNING</h1>
  <ol style="font-size: 10px; margin: 20px 0 20px 30px;">
    <li>Executive Summary & Rekommendation</li>
    <li>Företagsöversikt</li>
    <li>Finansiell Analys - 3-årstrend</li>
    <li>Revenue & Cost Breakdown</li>
    <li>Working Capital Analys</li>
    <li>Kundbas - Detaljerad Analys</li>
    <li>Organisation & Personal</li>
    <li>Teknisk Bedömning</li>
    <li>Marknad & Konkurrensanalys</li>
    <li>Juridik & Compliance</li>
    <li>Risk Matrix & Mitigering</li>
    <li>Strengths & Opportunities</li>
    <li>Valuation & Return</li>
    <li>Slutsats & Rekommendation</li>
    <li>Appendix A - Kundbas-lista</li>
    <li>Appendix B - Organisationsschema</li>
    <li>Appendix C - Teknikstack</li>
  </ol>
</div>

<!-- PAGE 1: EXECUTIVE SUMMARY -->
<div class="page">
  <h1>1. EXECUTIVE SUMMARY</h1>
  <div class="recommendation">✓ GENOMFÖR MED VILLKOR</div>
  
  <h2>Övergripande Bedömning</h2>
  <p>${data.companyName} är en attraktiv investeringsmöjlighet med stark produktposition, erfaren ledning och solid finansiell utveckling. Rekommendation är att genomföra förvärvet under förutsättning att kritiska villkor uppfylls.</p>
  
  <h2>Nyckeltal</h2>
  <table>
    <tr><th>Metrik</th><th>2022</th><th>2023</th><th>2024E</th><th>Trend</th></tr>
    <tr><td>Omsättning (MSEK)</td><td>${(data.revenue2022/1000000).toFixed(1)}</td><td>${(data.revenue2023/1000000).toFixed(1)}</td><td>${(data.revenue2024/1000000).toFixed(1)}</td><td>+45% CAGR</td></tr>
    <tr><td>EBITDA (MSEK)</td><td>${(data.ebitda2022/1000000).toFixed(1)}</td><td>${(data.ebitda2023/1000000).toFixed(1)}</td><td>${(data.ebitda2024/1000000).toFixed(1)}</td><td>Stabil</td></tr>
    <tr><td>EBITDA Marginal</td><td>${((data.ebitda2022/data.revenue2022)*100).toFixed(1)}%</td><td>${((data.ebitda2023/data.revenue2023)*100).toFixed(1)}%</td><td>${((data.ebitda2024/data.revenue2024)*100).toFixed(1)}%</td><td>Declining</td></tr>
    <tr><td>Anställda (FTE)</td><td>8</td><td>10</td><td>12</td><td>+50% growth</td></tr>
    <tr><td>Antal Kunder</td><td>32</td><td>39</td><td>47</td><td>+47% growth</td></tr>
  </table>

  <div class="footer">Page 2 of 25+ | DD ${data.companyName}</div>
</div>

<!-- PAGE 2: COMPANY OVERVIEW -->
<div class="page">
  <h1>2. FÖRETAGSÖVERSIKT</h1>
  
  <h2>Grundläggande Info</h2>
  <p><strong>Namn:</strong> ${data.companyName}</p>
  <p><strong>Organisationsnummer:</strong> ${data.orgNumber}</p>
  <p><strong>Bransch:</strong> ${data.industry}</p>
  <p><strong>Beskrivning:</strong> ${data.description}</p>
  
  <h2>Verksamhet & Affärsmodell</h2>
  <p>Bolaget är en ledande SaaS-plattform för finansiell rapportering på nordisk marknad. Huvudintäkterna kommer från prenumerations-baserad mjukvara (67.7% av omsättningen), kompletterat med professionella tjänster och support.</p>
  
  <h2>Marknadspojition</h2>
  <ul>
    <li><strong>Marknadsandel:</strong> ${data.marketShare}% av nordisk marknad</li>
    <li><strong>TAM (Total Addressable Market):</strong> 2.5 MSEK</li>
    <li><strong>SAM (Serviceable Market):</strong> 800 MSEK</li>
    <li><strong>SOM (Serviceable Obtainable):</strong> 200 MSEK</li>
    <li><strong>Position:</strong> Top 3 i segmentet</li>
  </ul>

  <div class="footer">Page 3 of 25+ | DD ${data.companyName}</div>
</div>

<!-- PAGE 3-4: FINANCIAL ANALYSIS -->
<div class="page">
  <h1>3. FINANSIELL ANALYS - 3-ÅRSTREND</h1>
  
  <h2>Historisk Utveckling</h2>
  <table>
    <tr><th>År</th><th>Omsättning</th><th>EBITDA</th><th>Marginal</th><th>Tillväxt</th></tr>
    <tr><td>2022</td><td>${(data.revenue2022/1000000).toFixed(1)} MSEK</td><td>${(data.ebitda2022/1000000).toFixed(1)} MSEK</td><td>${((data.ebitda2022/data.revenue2022)*100).toFixed(1)}%</td><td>—</td></tr>
    <tr><td>2023</td><td>${(data.revenue2023/1000000).toFixed(1)} MSEK</td><td>${(data.ebitda2023/1000000).toFixed(1)} MSEK</td><td>${((data.ebitda2023/data.revenue2023)*100).toFixed(1)}%</td><td>+45%</td></tr>
    <tr style="background: #e8eef5;"><td>2024E</td><td>${(data.revenue2024/1000000).toFixed(1)} MSEK</td><td>${(data.ebitda2024/1000000).toFixed(1)} MSEK</td><td>${((data.ebitda2024/data.revenue2024)*100).toFixed(1)}%</td><td>+12%</td></tr>
  </table>
  
  <h2>Analys</h2>
  <ul>
    <li>Stark omsättningstillväxt på 45% CAGR 2022-2024</li>
    <li>Marginalpressning från 28% till 20% på grund av skalning och investeringar</li>
    <li>Personalkostnaderna ökat 42.5% av omsättningen (från investeringer i R&D och Sales)</li>
    <li>Working Capital effektivitet bra med 75-dagars cash cycle</li>
  </ul>

  <h1>4. REVENUE & COST BREAKDOWN</h1>
  
  <h2>Intäktsstruktur 2024</h2>
  <table>
    <tr><th>Segment</th><th>Belopp (MSEK)</th><th>Andel</th></tr>
    <tr><td>SaaS Subscription</td><td>${(data.financials_detailed.revenue_breakdown.saas/1000000).toFixed(1)}</td><td>67.7%</td></tr>
    <tr><td>Professional Services</td><td>${(data.financials_detailed.revenue_breakdown.professional_services/1000000).toFixed(1)}</td><td>20.0%</td></tr>
    <tr><td>Support & Maintenance</td><td>${(data.financials_detailed.revenue_breakdown.support_maintenance/1000000).toFixed(1)}</td><td>12.3%</td></tr>
    <tr style="background: #e8eef5;"><td><strong>Totalt</strong></td><td><strong>52.0</strong></td><td><strong>100%</strong></td></tr>
  </table>
  
  <h2>Kostnadsstruktur 2024</h2>
  <table>
    <tr><th>Kostnadsslag</th><th>Belopp (MSEK)</th><th>% av Omsättning</th></tr>
    <tr><td>COGS</td><td>${(data.financials_detailed.cost_structure.cogs/1000000).toFixed(1)}</td><td>${((data.financials_detailed.cost_structure.cogs/data.revenue2024)*100).toFixed(1)}%</td></tr>
    <tr><td>Personal</td><td>${(data.financials_detailed.cost_structure.personnel/1000000).toFixed(1)}</td><td>${((data.financials_detailed.cost_structure.personnel/data.revenue2024)*100).toFixed(1)}%</td></tr>
    <tr><td>Infrastruktur</td><td>${(data.financials_detailed.cost_structure.infrastructure/1000000).toFixed(1)}</td><td>${((data.financials_detailed.cost_structure.infrastructure/data.revenue2024)*100).toFixed(1)}%</td></tr>
    <tr><td>Marknadsföring</td><td>${(data.financials_detailed.cost_structure.marketing/1000000).toFixed(1)}</td><td>${((data.financials_detailed.cost_structure.marketing/data.revenue2024)*100).toFixed(1)}%</td></tr>
    <tr><td>R&D</td><td>${(data.financials_detailed.cost_structure.rd/1000000).toFixed(1)}</td><td>${((data.financials_detailed.cost_structure.rd/data.revenue2024)*100).toFixed(1)}%</td></tr>
  </table>

  <div class="footer">Page 4-5 of 25+ | DD ${data.companyName}</div>
</div>

<!-- PAGE 5: WORKING CAPITAL -->
<div class="page">
  <h1>5. WORKING CAPITAL ANALYS</h1>
  
  <h2>Cash Conversion Cycle</h2>
  <table>
    <tr><th>Komponent</th><th>Dagar</th><th>Belopp (MSEK)</th></tr>
    <tr><td>Days Sales Outstanding (DSO)</td><td>${data.financials_detailed.working_capital.accounts_receivable.days}</td><td>${(data.financials_detailed.working_capital.accounts_receivable.amount/1000000).toFixed(2)}</td></tr>
    <tr><td>Days Inventory Outstanding (DIO)</td><td>${data.financials_detailed.working_capital.inventory.days}</td><td>${(data.financials_detailed.working_capital.inventory.amount/1000000).toFixed(2)}</td></tr>
    <tr><td>Days Payable Outstanding (DPO)</td><td>${data.financials_detailed.working_capital.accounts_payable.days}</td><td>${(data.financials_detailed.working_capital.accounts_payable.amount/1000000).toFixed(2)}</td></tr>
    <tr style="background: #e8eef5;"><td><strong>Cash Cycle</strong></td><td><strong>${data.financials_detailed.working_capital.cash_cycle}</strong></td><td></td></tr>
  </table>
  
  <h2>Rekommendation</h2>
  <p>Working Capital är väl hanteradt med 75-dagars cykl. För 100 MSEK omsättning krävs ~2 MSEK WC. Inga väsentliga problem identifierade.</p>

  <h1>6. KUNDBAS - DETALJERAD ANALYS</h1>
  
  <h2>Top 3 Kunder (Risknivå: HIGH)</h2>
  <table>
    <tr><th>Kund</th><th>Omsättning</th><th>Tenure</th><th>Churn Risk</th><th>Expansion</th></tr>
    ${data.customers_detailed.slice(0, 3).map((c: any) => `<tr><td>${c.name}</td><td>${(c.revenue/1000000).toFixed(1)} MSEK</td><td>${c.relationship_length}</td><td>${c.churn_risk}</td><td>${c.expansion_potential}</td></tr>`).join('')}
  </table>
  
  <h2>Kundberoende-analys</h2>
  <ul>
    <li><strong>Top 1:</strong> 18% av omsättning (RISK!)</li>
    <li><strong>Top 3:</strong> 35% av omsättning (MEDEL-HÖGT BEROENDE)</li>
    <li><strong>Top 10:</strong> 65% av omsättning</li>
    <li><strong>SMB Base:</strong> 42 kunder, 35% av omsättning (diversifierat)</li>
  </ul>
  
  <h2>Mitigering Krav</h2>
  <ul>
    <li>Pre-closing customer calls för Top 3 kunder</li>
    <li>Kontraktskontinuitetsbekräftelse</li>
    <li>Potential retention-rabatt budget 5-10%</li>
  </ul>

  <div class="footer">Page 6-7 of 25+ | DD ${data.companyName}</div>
</div>

<!-- PAGE 6-7: ORGANIZATION & TECHNOLOGY -->
<div class="page">
  <h1>7. ORGANISATION & PERSONAL</h1>
  
  <h2>Organisationsstruktur</h2>
  <table>
    <tr><th>Avdelning</th><th>Headcount</th><th>Avg Lön</th><th>Beschreibung</th></tr>
    ${data.organization_detailed.departments.map((d: any) => `<tr><td>${d.name}</td><td>${d.headcount}</td><td>${d.avg_salary/1000} KSEK</td><td>${d.description}</td></tr>`).join('')}
  </table>
  
  <h2>Nyckelmedarbetare</h2>
  <ul>
    <li><strong>VD (Anna Pettersson):</strong> 10 år tenure - KRITISK</li>
    <li><strong>CTO (Erik Svensson):</strong> 8 år tenure - KRITISK</li>
    <li><strong>Head of Sales (Sofia Bergström):</strong> 5 år tenure - VIKTIG</li>
  </ul>
  
  <h2>Personalnyckeltal</h2>
  <ul>
    <li>Genomsnittlig tenure: ${data.avgTenure} år</li>
    <li>Årlig turnover: ${data.turnover}% (låg)</li>
    <li>Lönesumma: ~12.7 MSEK årligen</li>
  </ul>

  <h1>8. TEKNISK BEDÖMNING</h1>
  
  <h2>Teknikstack</h2>
  <p><strong>Frontend:</strong> ${data.tech_detailed.frontend}</p>
  <p><strong>Backend:</strong> ${data.tech_detailed.backend}</p>
  <p><strong>Database:</strong> ${data.tech_detailed.database}</p>
  <p><strong>Infrastructure:</strong> ${data.tech_detailed.infrastructure}</p>
  
  <h2>Kodkvalitet & DevOps</h2>
  <table>
    <tr><th>Metrik</th><th>Värde</th><th>Bedömning</th></tr>
    <tr><td>Test Coverage</td><td>${data.tech_detailed.code_quality.test_coverage}</td><td>God (60%+ är standard)</td></tr>
    <tr><td>Code Reviews</td><td>${data.tech_detailed.code_quality.code_reviews}</td><td>Strikt process</td></tr>
    <tr><td>Deploy Frequency</td><td>${data.tech_detailed.code_quality.deployment_frequency}</td><td>Agil</td></tr>
    <tr><td>Deployment Success</td><td>${data.tech_detailed.code_quality.deployment_success_rate}</td><td>Excellent</td></tr>
  </table>
  
  <h2>Säkerhet & Compliance</h2>
  <ul>
    <li><strong>Certifieringar:</strong> ${data.tech_detailed.compliance}</li>
    <li><strong>Uptime SLA:</strong> ${data.uptime}% (industrial strength)</li>
    <li><strong>Data Protection:</strong> Encryption at rest/transit, WAF, VPC</li>
  </ul>

  <div class="footer">Page 8-9 of 25+ | DD ${data.companyName}</div>
</div>

<!-- PAGE 8-9: MARKET & RISKS -->
<div class="page">
  <h1>9. MARKNAD & KONKURRENSANALYS</h1>
  
  <h2>Marknadsstorlek & Potential</h2>
  <p><strong>TAM:</strong> 2.5 MSEK (nordisk SaaS accounting)</p>
  <p><strong>Current Market:</strong> ~38.5 MSEK (TAM × 1.5%)</p>
  <p><strong>Growth Potential:</strong> 3-5x inom 5-10 år genom geografisk expansion och upsell</p>
  
  <h2>Konkurrenter</h2>
  <table>
    <tr><th>Konkurrent</th><th>Market Share</th><th>Styrkor</th><th>Svagheter</th></tr>
    ${data.market_detailed.competitors.map((c: any) => `<tr><td>${c.name}</td><td>${c.market_share}</td><td>${c.strengths.join(', ')}</td><td>${c.weaknesses.join(', ')}</td></tr>`).join('')}
  </table>

  <h1>10. JURIDIK & COMPLIANCE</h1>
  
  <h2>Rättslig Status</h2>
  <ul>
    <li>Registrerad hos Bolagsverket ✓</li>
    <li>Alla licenser och tillstånd in place ✓</li>
    <li>GDPR compliant ✓</li>
    <li>Inga pågående rättstvister (minor leverantördispyt på 300 KSEK) ⚠</li>
  </ul>
  
  <h2>IP-rättigheter</h2>
  <ul>
    <li>Sourcekodd ägs av Bolaget ✓</li>
    <li>3 patenterbara algoritmer identifierade</li>
    <li>Ingen tredjepartsrisk ✓</li>
  </ul>

  <h1>11. RISK MATRIX & MITIGERING</h1>
  
  <h2>Kritiska Risker (HIGH)</h2>
  ${data.risks_detailed.filter((r: any) => r.severity === 'HIGH').map((r: any) => `
  <div class="card high">
    <h3>${r.risk}</h3>
    <p><strong>Sannolikhet:</strong> ${r.probability}</p>
    <p><strong>Mitigering:</strong> ${r.mitigation}</p>
    <p><strong>Residual Risk:</strong> <span class="badge badge-medium">${r.residual_risk}</span></p>
  </div>
  `).join('')}
  
  <h2>Medel Risker (MEDIUM)</h2>
  ${data.risks_detailed.filter((r: any) => r.severity === 'MEDIUM').map((r: any) => `
  <div class="card medium">
    <h3>${r.risk}</h3>
    <p><strong>Mitigering:</strong> ${r.mitigation}</p>
  </div>
  `).join('')}

  <div class="footer">Page 10-12 of 25+ | DD ${data.companyName}</div>
</div>

<!-- PAGE 10: STRENGTHS & VALUATION -->
<div class="page">
  <h1>12. STYRKOR & MÖJLIGHETER</h1>
  
  <ul>
    ${data.strengths.map((s: string) => `<li>${s}</li>`).join('')}
  </ul>

  <h1>13. VALUATION & FÖRVÄNTAD AVKASTNING</h1>
  
  <h2>Fair Value Range: 145-165 MSEK | Target: 150 MSEK</h2>
  
  <table>
    <tr><th>Scenario</th><th>Värdering (MSEK)</th><th>MOIC (5y)</th><th>IRR</th></tr>
    <tr><td>Conservative</td><td>135</td><td>2.5x</td><td>25%</td></tr>
    <tr><td>Base Case</td><td>150</td><td>3.2x</td><td>35%</td></tr>
    <tr><td>Bull Case (SaaS Success)</td><td>170</td><td>4.5x</td><td>50%</td></tr>
  </table>
  
  <h2>Förväntade Synergier (År 2+)</h2>
  <ul>
    <li>Revenue synergier: 15-20 MSEK annually (cross-selling)</li>
    <li>Cost synergier: 3-5 MSEK annually (shared services)</li>
    <li>Total annual lift: 18-25 MSEK</li>
  </ul>

  <h1>14. SLUTSATS & REKOMMENDATION</h1>
  
  <div class="recommendation">✓ GENOMFÖR MED FOKUSERADE ÅTGÄRDER</div>
  
  <h2>Kritiska Villkor för Genomförande</h2>
  <ol>
    <li>Retention-bonus för ledning (2-år commitment för VD, CTO, Head of Sales)</li>
    <li>Pre-closing customer calls för Top 3 kunder</li>
    <li>Cloud migration plan (AWS full migration, 3-4 mån)</li>
    <li>Dedikerad integration team, 100-dagars roadmap</li>
  </ol>
  
  <h2>Nästa Steg</h2>
  <ul>
    <li>Finalisera Representations & Warranties</li>
    <li>Genomför finalment SPA review</li>
    <li>Schedulera customer calls</li>
    <li>Prepare closing documentation</li>
  </ul>

  <div class="footer">Page 13-14 of 25+ | DD ${data.companyName}</div>
</div>

<!-- APPENDICES -->
<div class="page">
  <h1>APPENDIX A - KUNDBAS-LISTA</h1>
  <table>
    <tr><th>Kund</th><th>Omsättning</th><th>Tenure</th><th>Churn Risk</th></tr>
    ${data.customers_detailed.map((c: any) => `<tr><td>${c.name}</td><td>${(c.revenue/1000000).toFixed(1)}</td><td>${c.relationship_length}</td><td>${c.churn_risk}</td></tr>`).join('')}
  </table>
  
  <h1>APPENDIX B - ORGANISATIONSSCHEMA</h1>
  <table>
    <tr><th>Avdelning</th><th>Headcount</th><th>Rolled Up Budget</th></tr>
    ${data.organization_detailed.departments.map((d: any) => `<tr><td>${d.name}</td><td>${d.headcount}</td><td>${d.headcount * d.avg_salary}</td></tr>`).join('')}
  </table>
  
  <h1>APPENDIX C - TEKNIKSTACK DETALJ</h1>
  <p><strong>Frontend:</strong> ${data.tech_detailed.frontend}</p>
  <p><strong>Backend:</strong> ${data.tech_detailed.backend}</p>
  <p><strong>Database:</strong> ${data.tech_detailed.database}</p>
  <p><strong>Infrastructure:</strong> ${data.tech_detailed.infrastructure}</p>
  <p><strong>Monitoring:</strong> ${data.tech_detailed.monitoring}</p>
  <p><strong>Security:</strong> ${data.tech_detailed.security}</p>
  <p><strong>Compliance:</strong> ${data.tech_detailed.compliance}</p>

  <div class="footer">Page 15+ of 25+ | DD ${data.companyName} | Appendices</div>
</div>

</body>
</html>
`

export async function POST(request: NextRequest) {
  try {
    const html = generateFullDDHTML(EXTENDED_DD_DATA)
    
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
        'Content-Disposition': 'attachment; filename="DD_Full_CloudTech_25pages.pdf"'
      }
    })
  } catch (error) {
    console.error('Full DD generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate DD report', details: (error as Error).message },
      { status: 500 }
    )
  }
}
