import PDFDocument from 'pdfkit'

export interface SanitycheckPdfData {
  companyName: string
  orgNumber?: string
  industry?: string
  website?: string
  generatedAt: string
  score: number
  summary: string
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  valuationRange: {
    min: number
    max: number
    multipleMin: number
    multipleMax: number
    basis: string
  }
  recommendations: string[]
  pitchdeckSlides: string[]
  formData: Record<string, unknown>
}

// Color palette
const COLORS = {
  navy: '#0A1628',
  navyLight: '#1a2d4a',
  emerald: '#10B981',
  emeraldLight: '#D1FAE5',
  emeraldDark: '#059669',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  red: '#EF4444',
  redLight: '#FEE2E2',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  gray: '#6B7280',
  grayLight: '#F3F4F6',
  grayDark: '#374151',
  white: '#FFFFFF'
}

// Demo financial data for the mockup
const DEMO_FINANCIALS = {
  revenue: [32, 42, 52, 58],
  ebitda: [6.4, 8.4, 10.4, 11.6],
  years: ['2021', '2022', '2023', '2024E'],
  margins: { gross: 72, operating: 20, net: 16 },
  kpis: {
    recurringRevenue: 67,
    customerRetention: 94,
    employeeCount: 24,
    avgContractValue: 185
  }
}

// Demo category scores
const DEMO_SCORES = {
  categories: [
    { name: 'Finansiell styrka', score: 78 },
    { name: 'Marknad & kunder', score: 72 },
    { name: 'Organisation', score: 68 },
    { name: 'Processer & system', score: 75 },
    { name: 'Tillväxtpotential', score: 82 },
    { name: 'Säljberedskap', score: 65 }
  ]
}

export async function generateSanitycheckPDF(data: SanitycheckPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 50, right: 50 },
        bufferPages: true,
        info: {
          Title: `Sanitycheck & Värdering - ${data.companyName}`,
          Author: 'BOLAXO',
          Subject: 'Företagsanalys och indikativ värdering',
          Creator: 'BOLAXO Sanitycheck Platform'
        }
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const pageWidth = doc.page.width
      const contentWidth = pageWidth - 100

      // === PAGE 1: COVER ===
      drawCoverPage(doc, data, pageWidth)

      // === PAGE 2: EXECUTIVE SUMMARY ===
      doc.addPage()
      drawExecutiveSummary(doc, data, pageWidth, contentWidth)

      // === PAGE 3: FINANCIAL OVERVIEW ===
      doc.addPage()
      drawFinancialOverview(doc, data, pageWidth, contentWidth)

      // === PAGE 4: SWOT ANALYSIS ===
      doc.addPage()
      drawSwotAnalysis(doc, data, pageWidth, contentWidth)

      // === PAGE 5: VALUATION ===
      doc.addPage()
      drawValuationSection(doc, data, pageWidth, contentWidth)

      // === PAGE 6: RECOMMENDATIONS & NEXT STEPS ===
      doc.addPage()
      drawRecommendationsAndNextSteps(doc, data, pageWidth, contentWidth)

      // Add page numbers and footer
      const pages = doc.bufferedPageRange()
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i)
        
        // Page number
        doc.fontSize(9)
           .fillColor(COLORS.gray)
           .text(
             `Sida ${i + 1} av ${pages.count}`,
             50,
             doc.page.height - 30,
             { align: 'right', width: contentWidth }
           )
        
        // Footer line
        if (i > 0) {
          doc.moveTo(50, doc.page.height - 45)
             .lineTo(pageWidth - 50, doc.page.height - 45)
             .strokeColor(COLORS.grayLight)
             .lineWidth(0.5)
             .stroke()
          
          doc.fontSize(8)
             .fillColor(COLORS.gray)
             .text('BOLAXO | Konfidentiellt', 50, doc.page.height - 30)
        }
      }

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

function drawCoverPage(doc: PDFKit.PDFDocument, data: SanitycheckPdfData, pageWidth: number): void {
  // Full navy header
  doc.rect(0, 0, pageWidth, 320)
     .fill(COLORS.navy)

  // Decorative gradient overlay effect (simulated with rectangles)
  doc.rect(0, 0, pageWidth, 320)
     .fillOpacity(0.1)
     .fill(COLORS.blue)
     .fillOpacity(1)

  // Logo
  doc.fontSize(36)
     .fillColor(COLORS.white)
     .text('BOLAXO', 50, 50)

  // Subtitle
  doc.fontSize(12)
     .fillColor(COLORS.white)
     .opacity(0.6)
     .text('SANITYCHECK & VÄRDERINGSRAPPORT', 50, 95)
     .opacity(1)

  // Company name
  doc.fontSize(42)
     .fillColor(COLORS.white)
     .text(data.companyName, 50, 150, { width: pageWidth - 100 })

  // Metadata row
  const metaY = 230
  const metaItems = [
    { label: 'Org.nr', value: data.orgNumber || 'N/A' },
    { label: 'Bransch', value: data.industry || 'N/A' },
    { label: 'Genererad', value: new Date(data.generatedAt).toLocaleDateString('sv-SE') }
  ]
  
  metaItems.forEach((item, i) => {
    const x = 50 + i * 170
    doc.fontSize(10)
       .fillColor(COLORS.white)
       .opacity(0.5)
       .text(item.label.toUpperCase(), x, metaY)
       .opacity(1)
       .fontSize(13)
       .text(item.value, x, metaY + 16)
  })

  // Large score display
  const scoreY = 400
  const scoreColor = data.score >= 70 ? COLORS.emerald : data.score >= 50 ? COLORS.amber : COLORS.red
  
  // Score background circle
  const centerX = pageWidth / 2
  doc.circle(centerX, scoreY, 90)
     .fill(COLORS.grayLight)
  
  // Progress ring (outer)
  doc.circle(centerX, scoreY, 80)
     .lineWidth(12)
     .strokeColor(scoreColor)
     .fillOpacity(0)
     .stroke()
  
  // Inner white circle
  doc.circle(centerX, scoreY, 65)
     .fill(COLORS.white)

  // Score number
  doc.fontSize(56)
     .fillColor(COLORS.navy)
     .text(data.score.toString(), centerX - 50, scoreY - 30, { width: 100, align: 'center' })

  doc.fontSize(14)
     .fillColor(COLORS.gray)
     .text('poäng', centerX - 50, scoreY + 35, { width: 100, align: 'center' })

  // Score label
  const scoreLabel = data.score >= 70 ? 'Hög säljberedskap' : data.score >= 50 ? 'Måttlig säljberedskap' : 'Kräver förbättring'
  doc.fontSize(20)
     .fillColor(COLORS.navy)
     .text(scoreLabel, 50, scoreY + 110, { align: 'center', width: pageWidth - 100 })

  // Summary text
  doc.fontSize(12)
     .fillColor(COLORS.gray)
     .text(data.summary, 70, scoreY + 150, {
       align: 'center',
       width: pageWidth - 140,
       lineGap: 5
     })

  // Bottom decorative element
  doc.rect(50, doc.page.height - 100, pageWidth - 100, 3)
     .fill(COLORS.emerald)

  // Footer
  doc.fontSize(10)
     .fillColor(COLORS.gray)
     .text('Detta dokument är konfidentiellt och avsett endast för mottagaren.', 50, doc.page.height - 70, {
       align: 'center',
       width: pageWidth - 100
     })
}

function drawExecutiveSummary(doc: PDFKit.PDFDocument, data: SanitycheckPdfData, pageWidth: number, contentWidth: number): void {
  // Header
  drawSectionHeader(doc, 'Sammanfattning', 50, 50)

  let yPos = 100

  // Key metrics in a grid
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Nyckeltal i korthet', 50, yPos)

  yPos += 30

  const metrics = [
    { label: 'Säljberedskapspoäng', value: `${data.score}/100`, color: data.score >= 70 ? COLORS.emerald : COLORS.amber, icon: '📊' },
    { label: 'Värderingsspann', value: `${data.valuationRange.min}-${data.valuationRange.max} MSEK`, color: COLORS.blue, icon: '💰' },
    { label: 'Multipel (EBITDA)', value: `${data.valuationRange.multipleMin}x-${data.valuationRange.multipleMax}x`, color: COLORS.purple, icon: '📈' },
    { label: 'Identifierade styrkor', value: `${data.swot.strengths.length} st`, color: COLORS.emerald, icon: '✓' }
  ]

  const boxWidth = (contentWidth - 20) / 2
  const boxHeight = 75

  metrics.forEach((metric, i) => {
    const x = 50 + (i % 2) * (boxWidth + 20)
    const y = yPos + Math.floor(i / 2) * (boxHeight + 15)

    // Box
    doc.roundedRect(x, y, boxWidth, boxHeight, 8)
       .fill(COLORS.grayLight)

    // Color accent
    doc.roundedRect(x, y, 5, boxHeight, 3)
       .fill(metric.color)

    // Content
    doc.fontSize(24)
       .fillColor(COLORS.navy)
       .text(metric.value, x + 20, y + 15, { width: boxWidth - 30 })

    doc.fontSize(11)
       .fillColor(COLORS.gray)
       .text(metric.label, x + 20, y + 48)
  })

  yPos += 210

  // Category scores visualization
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Poäng per kategori', 50, yPos)

  yPos += 25

  DEMO_SCORES.categories.forEach((cat, i) => {
    const barWidth = (cat.score / 100) * (contentWidth - 150)
    const barColor = cat.score >= 75 ? COLORS.emerald : cat.score >= 60 ? COLORS.amber : COLORS.red

    // Label
    doc.fontSize(10)
       .fillColor(COLORS.grayDark)
       .text(cat.name, 50, yPos + i * 35)

    // Background bar
    doc.roundedRect(180, yPos + i * 35 - 2, contentWidth - 180, 18, 4)
       .fill(COLORS.grayLight)

    // Progress bar
    doc.roundedRect(180, yPos + i * 35 - 2, barWidth, 18, 4)
       .fill(barColor)

    // Score value
    doc.fontSize(10)
       .fillColor(COLORS.navy)
       .text(`${cat.score}%`, pageWidth - 80, yPos + i * 35)
  })

  yPos += 240

  // About section
  doc.roundedRect(50, yPos, contentWidth, 100, 8)
     .fill(COLORS.navyLight)
     .fillOpacity(0.05)
     .fill(COLORS.grayLight)

  doc.fontSize(12)
     .fillColor(COLORS.navy)
     .text('Om denna analys', 70, yPos + 20)

  doc.fontSize(10)
     .fillColor(COLORS.gray)
     .text(
       'Denna rapport är baserad på en AI-driven analys av företagets nyckelområden. ' +
       'Resultaten ger en indikation på säljberedskap och potentiellt värde, men ersätter inte ' +
       'en fullständig due diligence eller professionell värdering.',
       70, yPos + 42,
       { width: contentWidth - 40, lineGap: 4 }
     )
}

function drawFinancialOverview(doc: PDFKit.PDFDocument, data: SanitycheckPdfData, pageWidth: number, contentWidth: number): void {
  drawSectionHeader(doc, 'Finansiell översikt', 50, 50)

  let yPos = 100

  // Revenue chart (bar chart simulation)
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Omsättningsutveckling (MSEK)', 50, yPos)

  yPos += 30

  const chartHeight = 150
  const chartWidth = contentWidth / 2 - 30
  const barWidth = 40
  const maxValue = Math.max(...DEMO_FINANCIALS.revenue)

  // Draw bars
  DEMO_FINANCIALS.revenue.forEach((value, i) => {
    const barHeight = (value / maxValue) * (chartHeight - 30)
    const x = 50 + i * (barWidth + 25)
    const y = yPos + chartHeight - barHeight

    // Bar
    doc.roundedRect(x, y, barWidth, barHeight, 4)
       .fill(COLORS.blue)

    // Value on top
    doc.fontSize(10)
       .fillColor(COLORS.navy)
       .text(value.toString(), x, y - 18, { width: barWidth, align: 'center' })

    // Year label
    doc.fontSize(9)
       .fillColor(COLORS.gray)
       .text(DEMO_FINANCIALS.years[i], x, yPos + chartHeight + 5, { width: barWidth, align: 'center' })
  })

  // EBITDA chart
  const ebitdaStartX = pageWidth / 2 + 20
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('EBITDA-utveckling (MSEK)', ebitdaStartX, yPos - 30)

  const maxEbitda = Math.max(...DEMO_FINANCIALS.ebitda)

  DEMO_FINANCIALS.ebitda.forEach((value, i) => {
    const barHeight = (value / maxEbitda) * (chartHeight - 30)
    const x = ebitdaStartX + i * (barWidth + 25)
    const y = yPos + chartHeight - barHeight

    // Bar
    doc.roundedRect(x, y, barWidth, barHeight, 4)
       .fill(COLORS.emerald)

    // Value
    doc.fontSize(10)
       .fillColor(COLORS.navy)
       .text(value.toFixed(1), x, y - 18, { width: barWidth, align: 'center' })

    // Year
    doc.fontSize(9)
       .fillColor(COLORS.gray)
       .text(DEMO_FINANCIALS.years[i], x, yPos + chartHeight + 5, { width: barWidth, align: 'center' })
  })

  yPos += chartHeight + 50

  // Margin indicators
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Marginalanalys', 50, yPos)

  yPos += 30

  const margins = [
    { label: 'Bruttomarginal', value: DEMO_FINANCIALS.margins.gross, color: COLORS.emerald },
    { label: 'Rörelsemarginal', value: DEMO_FINANCIALS.margins.operating, color: COLORS.blue },
    { label: 'Nettomarginal', value: DEMO_FINANCIALS.margins.net, color: COLORS.purple }
  ]

  margins.forEach((margin, i) => {
    const x = 50 + i * ((contentWidth - 40) / 3 + 20)
    const circleRadius = 45

    // Background circle
    doc.circle(x + circleRadius, yPos + circleRadius, circleRadius)
       .fill(COLORS.grayLight)

    // Progress arc (simplified as filled portion)
    doc.circle(x + circleRadius, yPos + circleRadius, circleRadius - 8)
       .lineWidth(10)
       .strokeColor(margin.color)
       .stroke()

    // Inner circle
    doc.circle(x + circleRadius, yPos + circleRadius, circleRadius - 18)
       .fill(COLORS.white)

    // Value
    doc.fontSize(18)
       .fillColor(COLORS.navy)
       .text(`${margin.value}%`, x, yPos + circleRadius - 8, { width: circleRadius * 2, align: 'center' })

    // Label
    doc.fontSize(10)
       .fillColor(COLORS.gray)
       .text(margin.label, x, yPos + circleRadius * 2 + 15, { width: circleRadius * 2, align: 'center' })
  })

  yPos += 160

  // KPI boxes
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Nyckel-KPIer', 50, yPos)

  yPos += 25

  const kpis = [
    { label: 'Återkommande intäkter', value: `${DEMO_FINANCIALS.kpis.recurringRevenue}%`, desc: 'av total omsättning' },
    { label: 'Kundretention', value: `${DEMO_FINANCIALS.kpis.customerRetention}%`, desc: 'årlig retention' },
    { label: 'Medarbetare', value: DEMO_FINANCIALS.kpis.employeeCount.toString(), desc: 'heltidsanställda' },
    { label: 'Snitt kontraktsvärde', value: `${DEMO_FINANCIALS.kpis.avgContractValue}k`, desc: 'SEK/år' }
  ]

  const kpiBoxWidth = (contentWidth - 30) / 4

  kpis.forEach((kpi, i) => {
    const x = 50 + i * (kpiBoxWidth + 10)

    doc.roundedRect(x, yPos, kpiBoxWidth, 80, 6)
       .fill(COLORS.grayLight)

    doc.fontSize(22)
       .fillColor(COLORS.navy)
       .text(kpi.value, x + 10, yPos + 15, { width: kpiBoxWidth - 20, align: 'center' })

    doc.fontSize(9)
       .fillColor(COLORS.gray)
       .text(kpi.label, x + 5, yPos + 48, { width: kpiBoxWidth - 10, align: 'center' })

    doc.fontSize(8)
       .fillColor(COLORS.gray)
       .text(kpi.desc, x + 5, yPos + 62, { width: kpiBoxWidth - 10, align: 'center' })
  })
}

function drawSwotAnalysis(doc: PDFKit.PDFDocument, data: SanitycheckPdfData, pageWidth: number, contentWidth: number): void {
  drawSectionHeader(doc, 'SWOT-analys', 50, 50)

  const boxWidth = (contentWidth - 20) / 2
  const boxHeight = 280
  const startY = 100

  // Strengths
  drawSwotBox(doc, 50, startY, boxWidth, boxHeight, 'Styrkor', data.swot.strengths, COLORS.emerald, COLORS.emeraldLight, '✓')

  // Weaknesses
  drawSwotBox(doc, 60 + boxWidth, startY, boxWidth, boxHeight, 'Svagheter', data.swot.weaknesses, COLORS.amber, COLORS.amberLight, '!')

  // Opportunities
  drawSwotBox(doc, 50, startY + boxHeight + 20, boxWidth, boxHeight, 'Möjligheter', data.swot.opportunities, COLORS.blue, COLORS.blueLight, '↗')

  // Threats
  drawSwotBox(doc, 60 + boxWidth, startY + boxHeight + 20, boxWidth, boxHeight, 'Hot', data.swot.threats, COLORS.red, COLORS.redLight, '⚠')
}

function drawSwotBox(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  items: string[],
  accentColor: string,
  bgColor: string,
  icon: string
): void {
  // Background with rounded corners
  doc.roundedRect(x, y, width, height, 10)
     .fill(bgColor)

  // Top accent bar
  doc.roundedRect(x, y, width, 6, 3)
     .fill(accentColor)

  // Icon circle
  doc.circle(x + 30, y + 35, 15)
     .fill(accentColor)

  // Title
  doc.fontSize(16)
     .fillColor(accentColor)
     .text(title, x + 55, y + 27)

  // Items with bullets
  let itemY = y + 65
  items.forEach((item, i) => {
    if (itemY < y + height - 25) {
      // Bullet
      doc.circle(x + 25, itemY + 6, 4)
         .fill(accentColor)

      // Text
      doc.fontSize(10)
         .fillColor(COLORS.navy)
         .text(item, x + 40, itemY, { width: width - 55, lineGap: 3 })

      const textHeight = doc.heightOfString(item, { width: width - 55 })
      itemY += Math.max(textHeight + 15, 35)
    }
  })
}

function drawValuationSection(doc: PDFKit.PDFDocument, data: SanitycheckPdfData, pageWidth: number, contentWidth: number): void {
  drawSectionHeader(doc, 'Indikativ värdering', 50, 50)

  let yPos = 100

  // Main valuation box
  doc.roundedRect(50, yPos, contentWidth, 200, 12)
     .fill(COLORS.navy)

  // Decorative element
  doc.roundedRect(50, yPos, 8, 200, 4)
     .fill(COLORS.emerald)

  // Value range
  doc.fontSize(12)
     .fillColor(COLORS.white)
     .opacity(0.6)
     .text('UPPSKATTAT VÄRDERINGSSPANN', 80, yPos + 30)
     .opacity(1)

  doc.fontSize(52)
     .fillColor(COLORS.white)
     .text(`${data.valuationRange.min} – ${data.valuationRange.max}`, 80, yPos + 55)

  doc.fontSize(24)
     .fillColor(COLORS.white)
     .opacity(0.8)
     .text('MSEK', 80, yPos + 115)
     .opacity(1)

  // Multiple box
  const multipleBoxX = pageWidth - 200
  doc.roundedRect(multipleBoxX, yPos + 30, 130, 80, 8)
     .fill(COLORS.white)
     .fillOpacity(0.1)
     .fill(COLORS.navyLight)

  doc.fontSize(10)
     .fillColor(COLORS.white)
     .opacity(0.6)
     .text('MULTIPEL', multipleBoxX + 10, yPos + 45)
     .opacity(1)

  doc.fontSize(24)
     .fillColor(COLORS.emerald)
     .text(`${data.valuationRange.multipleMin}x - ${data.valuationRange.multipleMax}x`, multipleBoxX + 10, yPos + 65)

  doc.fontSize(10)
     .fillColor(COLORS.white)
     .opacity(0.6)
     .text('EBITDA', multipleBoxX + 10, yPos + 95)
     .opacity(1)

  // Enterprise value indicator bar
  doc.fontSize(10)
     .fillColor(COLORS.white)
     .opacity(0.6)
     .text('Värderingsspann visualisering', 80, yPos + 155)
     .opacity(1)

  // Range bar
  doc.roundedRect(80, yPos + 170, contentWidth - 80, 12, 6)
     .fill(COLORS.white)
     .fillOpacity(0.2)

  const rangeStart = 0.3
  const rangeEnd = 0.7
  doc.roundedRect(80 + (contentWidth - 80) * rangeStart, yPos + 170, (contentWidth - 80) * (rangeEnd - rangeStart), 12, 6)
     .fill(COLORS.emerald)

  yPos += 230

  // Valuation basis
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Värderingsgrund', 50, yPos)

  yPos += 25

  doc.fontSize(11)
     .fillColor(COLORS.gray)
     .text(data.valuationRange.basis, 50, yPos, {
       width: contentWidth,
       lineGap: 5
     })

  yPos += 80

  // Methodology boxes
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Värderingsmetodik', 50, yPos)

  yPos += 25

  const methods = [
    { title: 'Multipelvärdering', desc: 'Baserat på EBITDA-multiplar för jämförbara transaktioner i branschen' },
    { title: 'DCF-indikation', desc: 'Diskonterade kassaflöden med hänsyn till tillväxtpotential' },
    { title: 'Tillgångsvärdering', desc: 'Bedömning av immateriella tillgångar och kundportfölj' }
  ]

  const methodBoxWidth = (contentWidth - 20) / 3

  methods.forEach((method, i) => {
    const x = 50 + i * (methodBoxWidth + 10)

    doc.roundedRect(x, yPos, methodBoxWidth, 90, 6)
       .fill(COLORS.grayLight)

    doc.fontSize(11)
       .fillColor(COLORS.navy)
       .text(method.title, x + 12, yPos + 15, { width: methodBoxWidth - 24 })

    doc.fontSize(9)
       .fillColor(COLORS.gray)
       .text(method.desc, x + 12, yPos + 35, { width: methodBoxWidth - 24, lineGap: 3 })
  })

  yPos += 120

  // Disclaimer
  doc.roundedRect(50, yPos, contentWidth, 80, 8)
     .fill(COLORS.amberLight)

  doc.fontSize(11)
     .fillColor(COLORS.amber)
     .text('⚠ Viktig information', 70, yPos + 15)

  doc.fontSize(10)
     .fillColor(COLORS.grayDark)
     .text(
       'Detta värderingsspann är indikativt och baserat på tillgänglig information. En faktisk värdering ' +
       'kräver fullständig due diligence och detaljerad analys av finansiella rapporter, kontrakt och marknadsfaktorer.',
       70, yPos + 35,
       { width: contentWidth - 40, lineGap: 3 }
     )
}

function drawRecommendationsAndNextSteps(doc: PDFKit.PDFDocument, data: SanitycheckPdfData, pageWidth: number, contentWidth: number): void {
  drawSectionHeader(doc, 'Rekommendationer', 50, 50)

  let yPos = 100

  // Priority actions
  doc.fontSize(12)
     .fillColor(COLORS.gray)
     .text('Prioriterade åtgärder för att maximera värdet vid en försäljning:', 50, yPos, { width: contentWidth })

  yPos += 35

  data.recommendations.forEach((rec, i) => {
    // Number badge
    doc.circle(70, yPos + 12, 16)
       .fill(COLORS.emerald)

    doc.fontSize(12)
       .fillColor(COLORS.white)
       .text((i + 1).toString(), 62, yPos + 6, { width: 16, align: 'center' })

    // Recommendation text
    doc.fontSize(11)
       .fillColor(COLORS.navy)
       .text(rec, 100, yPos + 3, { width: contentWidth - 70, lineGap: 4 })

    const textHeight = doc.heightOfString(rec, { width: contentWidth - 70 })
    yPos += Math.max(textHeight + 20, 45)
  })

  yPos += 20

  // Pitchdeck structure
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Föreslagen pitchdeck-struktur', 50, yPos)

  yPos += 25

  const slideWidth = (contentWidth - 40) / 4

  data.pitchdeckSlides.forEach((slide, i) => {
    const x = 50 + (i % 4) * (slideWidth + 10)
    const y = yPos + Math.floor(i / 4) * 50

    doc.roundedRect(x, y, slideWidth, 40, 6)
       .fill(COLORS.grayLight)

    doc.fontSize(9)
       .fillColor(COLORS.navy)
       .text(`${i + 1}. ${slide}`, x + 8, y + 13, { width: slideWidth - 16 })
  })

  yPos += Math.ceil(data.pitchdeckSlides.length / 4) * 50 + 30

  // Next steps CTA
  doc.roundedRect(50, yPos, contentWidth, 120, 12)
     .fill(COLORS.navy)

  doc.fontSize(18)
     .fillColor(COLORS.white)
     .text('Redo att ta nästa steg?', 70, yPos + 25)

  doc.fontSize(11)
     .fillColor(COLORS.white)
     .opacity(0.8)
     .text(
       'Uppgradera till ett premiumpaket för att få tillgång till professionella mallar, ' +
       'pitchdeck-stöd, personlig rådgivning och matchning med kvalificerade köpare.',
       70, yPos + 55,
       { width: contentWidth - 40, lineGap: 4 }
     )
     .opacity(1)

  // CTA button (simulated)
  doc.roundedRect(70, yPos + 90, 180, 35, 6)
     .fill(COLORS.emerald)

  doc.fontSize(11)
     .fillColor(COLORS.white)
     .text('Kontakta oss: bolaxo.se', 70, yPos + 100, { width: 180, align: 'center' })
}

function drawSectionHeader(doc: PDFKit.PDFDocument, title: string, x: number, y: number): void {
  doc.fontSize(26)
     .fillColor(COLORS.navy)
     .text(title, x, y)

  doc.moveTo(x, y + 35)
     .lineTo(x + 80, y + 35)
     .strokeColor(COLORS.emerald)
     .lineWidth(4)
     .stroke()
}
