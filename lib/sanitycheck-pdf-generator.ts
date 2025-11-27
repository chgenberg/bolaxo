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
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  red: '#EF4444',
  redLight: '#FEE2E2',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
  gray: '#6B7280',
  grayLight: '#F3F4F6',
  white: '#FFFFFF'
}

export async function generateSanitycheckPDF(data: SanitycheckPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true,
        info: {
          Title: `Sanitycheck & Värdering - ${data.companyName}`,
          Author: 'BOLAXO',
          Subject: 'Företagsanalys och indikativ värdering',
          Creator: 'BOLAXO Sanitycheck'
        }
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // === COVER PAGE ===
      drawCoverPage(doc, data)

      // === EXECUTIVE SUMMARY ===
      doc.addPage()
      drawExecutiveSummary(doc, data)

      // === SWOT ANALYSIS ===
      doc.addPage()
      drawSwotAnalysis(doc, data)

      // === VALUATION ===
      doc.addPage()
      drawValuationSection(doc, data)

      // === RECOMMENDATIONS ===
      doc.addPage()
      drawRecommendations(doc, data)

      // === PITCHDECK STRUCTURE ===
      drawPitchdeckSection(doc, data)

      // Add page numbers
      const pages = doc.bufferedPageRange()
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i)
        doc.fontSize(9)
           .fillColor(COLORS.gray)
           .text(
             `${i + 1} / ${pages.count}`,
             50,
             doc.page.height - 40,
             { align: 'center' }
           )
      }

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

function drawCoverPage(doc: PDFKit.PDFDocument, data: SanitycheckPdfData): void {
  // Navy background header
  doc.rect(0, 0, doc.page.width, 280)
     .fill(COLORS.navy)

  // Logo
  doc.fontSize(32)
     .fillColor(COLORS.white)
     .text('BOLAXO', 50, 60, { align: 'left' })

  // Title
  doc.fontSize(14)
     .fillColor(COLORS.white)
     .opacity(0.7)
     .text('SANITYCHECK & VÄRDERING', 50, 120)
     .opacity(1)

  doc.fontSize(36)
     .fillColor(COLORS.white)
     .text(data.companyName, 50, 145, { width: doc.page.width - 100 })

  // Metadata boxes
  const metaY = 210
  doc.fontSize(10)
     .fillColor(COLORS.white)
     .opacity(0.6)

  if (data.orgNumber) {
    doc.text('Org.nr', 50, metaY)
       .opacity(1)
       .fontSize(12)
       .text(data.orgNumber, 50, metaY + 14)
  }

  if (data.industry) {
    doc.opacity(0.6)
       .fontSize(10)
       .text('Bransch', 200, metaY)
       .opacity(1)
       .fontSize(12)
       .text(data.industry, 200, metaY + 14)
  }

  const formattedDate = new Date(data.generatedAt).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  doc.opacity(0.6)
     .fontSize(10)
     .text('Genererad', 400, metaY)
     .opacity(1)
     .fontSize(12)
     .text(formattedDate, 400, metaY + 14)

  // Score circle
  const scoreX = doc.page.width / 2
  const scoreY = 420
  const scoreRadius = 80

  // Score background circle
  doc.circle(scoreX, scoreY, scoreRadius)
     .fill(COLORS.grayLight)

  // Score progress arc (simplified as colored circle segment)
  const scoreColor = data.score >= 70 ? COLORS.emerald : data.score >= 50 ? COLORS.amber : COLORS.red
  doc.circle(scoreX, scoreY, scoreRadius - 10)
     .fill(scoreColor)

  // Inner white circle
  doc.circle(scoreX, scoreY, scoreRadius - 20)
     .fill(COLORS.white)

  // Score text
  doc.fontSize(48)
     .fillColor(COLORS.navy)
     .text(data.score.toString(), scoreX - 40, scoreY - 25, { width: 80, align: 'center' })

  doc.fontSize(14)
     .fillColor(COLORS.gray)
     .text('poäng', scoreX - 40, scoreY + 30, { width: 80, align: 'center' })

  // Score label
  const scoreLabel = data.score >= 70 ? 'Hög säljberedskap' : data.score >= 50 ? 'Måttlig säljberedskap' : 'Behöver förbättring'
  doc.fontSize(16)
     .fillColor(COLORS.navy)
     .text(scoreLabel, 50, scoreY + 100, { align: 'center', width: doc.page.width - 100 })

  // Summary
  doc.fontSize(12)
     .fillColor(COLORS.gray)
     .text(data.summary, 50, scoreY + 140, {
       align: 'center',
       width: doc.page.width - 100,
       lineGap: 4
     })

  // Footer
  doc.fontSize(10)
     .fillColor(COLORS.gray)
     .text('Konfidentiellt dokument genererat av BOLAXO', 50, doc.page.height - 80, {
       align: 'center',
       width: doc.page.width - 100
     })
}

function drawExecutiveSummary(doc: PDFKit.PDFDocument, data: SanitycheckPdfData): void {
  // Header
  doc.fontSize(24)
     .fillColor(COLORS.navy)
     .text('Sammanfattning', 50, 50)

  doc.moveTo(50, 85)
     .lineTo(200, 85)
     .strokeColor(COLORS.emerald)
     .lineWidth(3)
     .stroke()

  let yPos = 110

  // Summary text
  doc.fontSize(12)
     .fillColor(COLORS.gray)
     .text(data.summary, 50, yPos, {
       width: doc.page.width - 100,
       lineGap: 6
     })

  yPos += 80

  // Key metrics grid
  const metrics = [
    { label: 'Säljberedskap', value: `${data.score}/100`, color: data.score >= 70 ? COLORS.emerald : data.score >= 50 ? COLORS.amber : COLORS.red },
    { label: 'Indikativ multipel', value: `${data.valuationRange.multipleMin}x - ${data.valuationRange.multipleMax}x`, color: COLORS.blue },
    { label: 'Styrkor identifierade', value: data.swot.strengths.length.toString(), color: COLORS.emerald },
    { label: 'Förbättringsområden', value: data.swot.weaknesses.length.toString(), color: COLORS.amber }
  ]

  const boxWidth = (doc.page.width - 130) / 2
  const boxHeight = 80

  metrics.forEach((metric, i) => {
    const x = 50 + (i % 2) * (boxWidth + 30)
    const y = yPos + Math.floor(i / 2) * (boxHeight + 15)

    // Box background
    doc.roundedRect(x, y, boxWidth, boxHeight, 8)
       .fill(COLORS.grayLight)

    // Color indicator
    doc.roundedRect(x, y, 4, boxHeight, 2)
       .fill(metric.color)

    // Value
    doc.fontSize(28)
       .fillColor(COLORS.navy)
       .text(metric.value, x + 20, y + 15, { width: boxWidth - 30 })

    // Label
    doc.fontSize(11)
       .fillColor(COLORS.gray)
       .text(metric.label, x + 20, y + 50, { width: boxWidth - 30 })
  })

  yPos += 200

  // About this report
  doc.fontSize(16)
     .fillColor(COLORS.navy)
     .text('Om denna rapport', 50, yPos)

  yPos += 30

  const aboutText = `Denna rapport är genererad baserat på de svar som lämnats i BOLAXO Sanitycheck. 
Analysen ger en indikation på bolagets säljberedskap och ett uppskattat värderingsspann baserat på branschspecifika multiplar.

Observera att detta är en preliminär analys och inte ersätter en fullständig företagsvärdering eller due diligence-process.`

  doc.fontSize(11)
     .fillColor(COLORS.gray)
     .text(aboutText, 50, yPos, {
       width: doc.page.width - 100,
       lineGap: 5
     })
}

function drawSwotAnalysis(doc: PDFKit.PDFDocument, data: SanitycheckPdfData): void {
  // Header
  doc.fontSize(24)
     .fillColor(COLORS.navy)
     .text('SWOT-analys', 50, 50)

  doc.moveTo(50, 85)
     .lineTo(180, 85)
     .strokeColor(COLORS.emerald)
     .lineWidth(3)
     .stroke()

  const boxWidth = (doc.page.width - 130) / 2
  const boxHeight = 280
  const startY = 110

  // Strengths
  drawSwotBox(doc, 50, startY, boxWidth, boxHeight, 'Styrkor', data.swot.strengths, COLORS.emerald, COLORS.emeraldLight)

  // Weaknesses
  drawSwotBox(doc, 80 + boxWidth, startY, boxWidth, boxHeight, 'Svagheter', data.swot.weaknesses, COLORS.amber, COLORS.amberLight)

  // Opportunities
  drawSwotBox(doc, 50, startY + boxHeight + 20, boxWidth, boxHeight, 'Möjligheter', data.swot.opportunities, COLORS.blue, COLORS.blueLight)

  // Threats
  drawSwotBox(doc, 80 + boxWidth, startY + boxHeight + 20, boxWidth, boxHeight, 'Hot', data.swot.threats, COLORS.red, COLORS.redLight)
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
  bgColor: string
): void {
  // Background
  doc.roundedRect(x, y, width, height, 8)
     .fill(bgColor)

  // Accent bar
  doc.roundedRect(x, y, width, 4, 2)
     .fill(accentColor)

  // Title
  doc.fontSize(14)
     .fillColor(accentColor)
     .text(title, x + 15, y + 20)

  // Items
  let itemY = y + 50
  items.forEach((item, i) => {
    if (itemY < y + height - 20) {
      doc.fontSize(10)
         .fillColor(COLORS.navy)
         .text(`• ${item}`, x + 15, itemY, { width: width - 30 })
      itemY += 40
    }
  })
}

function drawValuationSection(doc: PDFKit.PDFDocument, data: SanitycheckPdfData): void {
  // Header
  doc.fontSize(24)
     .fillColor(COLORS.navy)
     .text('Indikativ värdering', 50, 50)

  doc.moveTo(50, 85)
     .lineTo(220, 85)
     .strokeColor(COLORS.emerald)
     .lineWidth(3)
     .stroke()

  let yPos = 110

  // Valuation range box
  doc.roundedRect(50, yPos, doc.page.width - 100, 180, 12)
     .fill(COLORS.navy)

  // Range values
  doc.fontSize(14)
     .fillColor(COLORS.white)
     .opacity(0.7)
     .text('VÄRDERINGSSPANN (MSEK)', 70, yPos + 25)
     .opacity(1)

  doc.fontSize(48)
     .fillColor(COLORS.white)
     .text(`${data.valuationRange.min} - ${data.valuationRange.max}`, 70, yPos + 55)

  // Multiples
  doc.fontSize(12)
     .fillColor(COLORS.white)
     .opacity(0.7)
     .text('MULTIPEL', 70, yPos + 120)
     .opacity(1)
     .fontSize(20)
     .text(`${data.valuationRange.multipleMin}x - ${data.valuationRange.multipleMax}x`, 70, yPos + 140)

  yPos += 210

  // Basis explanation
  doc.fontSize(14)
     .fillColor(COLORS.navy)
     .text('Värderingsgrund', 50, yPos)

  yPos += 25

  doc.fontSize(11)
     .fillColor(COLORS.gray)
     .text(data.valuationRange.basis, 50, yPos, {
       width: doc.page.width - 100,
       lineGap: 5
     })

  yPos += 80

  // Disclaimer
  doc.roundedRect(50, yPos, doc.page.width - 100, 100, 8)
     .fill(COLORS.grayLight)

  doc.fontSize(11)
     .fillColor(COLORS.navy)
     .text('⚠️ Observera', 70, yPos + 20)

  doc.fontSize(10)
     .fillColor(COLORS.gray)
     .text(
       'Detta värderingsspann är indikativt och baserat på branschspecifika multiplar samt de svar som lämnats. ' +
       'En faktisk värdering kräver en detaljerad genomgång av finansiella rapporter, kundavtal, och andra väsentliga dokument.',
       70, yPos + 40,
       { width: doc.page.width - 140, lineGap: 4 }
     )
}

function drawRecommendations(doc: PDFKit.PDFDocument, data: SanitycheckPdfData): void {
  // Header
  doc.fontSize(24)
     .fillColor(COLORS.navy)
     .text('Rekommendationer', 50, 50)

  doc.moveTo(50, 85)
     .lineTo(230, 85)
     .strokeColor(COLORS.emerald)
     .lineWidth(3)
     .stroke()

  let yPos = 110

  doc.fontSize(12)
     .fillColor(COLORS.gray)
     .text('Baserat på analysen rekommenderar vi följande åtgärder för att förbättra säljbarheten:', 50, yPos, {
       width: doc.page.width - 100
     })

  yPos += 50

  data.recommendations.forEach((rec, i) => {
    // Number circle
    doc.circle(70, yPos + 10, 15)
       .fill(COLORS.emerald)

    doc.fontSize(12)
       .fillColor(COLORS.white)
       .text((i + 1).toString(), 64, yPos + 4)

    // Recommendation text
    doc.fontSize(12)
       .fillColor(COLORS.navy)
       .text(rec, 100, yPos, {
         width: doc.page.width - 150,
         lineGap: 4
       })

    yPos += 60
  })
}

function drawPitchdeckSection(doc: PDFKit.PDFDocument, data: SanitycheckPdfData): void {
  let yPos = doc.y + 60

  // Check if we need a new page
  if (yPos > doc.page.height - 300) {
    doc.addPage()
    yPos = 50
  }

  // Header
  doc.fontSize(18)
     .fillColor(COLORS.navy)
     .text('Föreslagen pitchdeck-struktur', 50, yPos)

  yPos += 40

  doc.fontSize(11)
     .fillColor(COLORS.gray)
     .text('För att presentera bolaget för potentiella köpare rekommenderar vi följande slides:', 50, yPos, {
       width: doc.page.width - 100
     })

  yPos += 40

  data.pitchdeckSlides.forEach((slide, i) => {
    doc.roundedRect(50, yPos, doc.page.width - 100, 35, 6)
       .fill(COLORS.grayLight)

    doc.fontSize(11)
       .fillColor(COLORS.navy)
       .text(slide, 70, yPos + 10, {
         width: doc.page.width - 140
       })

    yPos += 45
  })

  // Footer CTA
  yPos += 30

  doc.roundedRect(50, yPos, doc.page.width - 100, 80, 8)
     .fill(COLORS.navy)

  doc.fontSize(14)
     .fillColor(COLORS.white)
     .text('Redo att ta nästa steg?', 70, yPos + 20)

  doc.fontSize(11)
     .fillColor(COLORS.white)
     .opacity(0.8)
     .text('Uppgradera till ett premiumpaket för att få tillgång till professionella mallar, pitchdeck-stöd och personlig rådgivning.', 70, yPos + 42, {
       width: doc.page.width - 140
     })
     .opacity(1)
}

