import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'

export interface DDPdfData {
  // Deal info
  listingId: string
  companyName: string
  companyOrgNumber: string
  
  // Buyer info
  buyerName: string
  ddTeamLead: string
  ddStartDate: string
  ddCompletionDate: string
  
  // Financial findings
  financialFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  
  // Legal findings
  legalFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  
  // Commercial findings
  commercialFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  
  // HR findings
  hrFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  
  // IT findings
  itFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  
  // Tax findings
  taxFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  
  // Environmental findings
  envFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  
  // Overall assessment
  overallRiskLevel?: 'Low' | 'Medium' | 'High' | 'Critical'
  dealRecommendation?: string
  topThreeRisks?: string[]
}

type PDFDocumentType = InstanceType<typeof PDFDocument>

function getSeverityColor(severity: string): [number, number, number] {
  switch (severity) {
    case 'Critical': return [220, 53, 69] // Red
    case 'High': return [253, 126, 20]     // Orange
    case 'Medium': return [255, 193, 7]    // Yellow
    case 'Low': return [40, 167, 69]       // Green
    default: return [108, 117, 125]        // Gray
  }
}

function createSectionHeader(doc: PDFDocumentType, title: string, sectionNum: number) {
  doc.fontSize(16).font('Helvetica-Bold').fillColor('#0E2D5C')
  doc.text(`${sectionNum}. ${title}`, { underline: true })
  doc.moveDown(0.5)
  doc.fillColor('#000000')
}

function addFinding(
  doc: PDFDocumentType,
  finding: { title: string; severity: string; description: string; recommendation?: string },
  index: number
) {
  const [r, g, b] = getSeverityColor(finding.severity)
  
  // Finding box
  doc.rect(50, doc.y, 500, 4).fill(`rgb(${r},${g},${b})`)
  doc.moveDown(0.3)
  
  // Title and severity badge
  doc.fontSize(11).font('Helvetica-Bold')
  doc.text(finding.title, 50, doc.y, { width: 400 })
  
  // Severity badge
  const badgeX = 450
  const badgeY = doc.y - 15
  doc.rect(badgeX, badgeY, 90, 18).fill(`rgb(${r},${g},${b})`)
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#FFFFFF')
  doc.text(finding.severity, badgeX + 5, badgeY + 3, { width: 80 })
  doc.fillColor('#000000')
  
  doc.moveDown(0.8)
  
  // Description
  doc.fontSize(10).font('Helvetica')
  doc.text('Findings:', { underline: true })
  doc.text(finding.description, { indent: 20, align: 'justify' })
  doc.moveDown(0.3)
  
  // Recommendation
  if (finding.recommendation) {
    doc.text('Recommendation:', { underline: true })
    doc.text(finding.recommendation, { indent: 20, align: 'justify' })
  }
  
  doc.moveDown(0.5)
}

export async function generateDDReportPDF(data: DDPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true
    })

    const buffers: Buffer[] = []

    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      resolve(Buffer.concat(buffers))
    })
    doc.on('error', reject)

    // ===== TITLE PAGE =====
    doc.fontSize(28).font('Helvetica-Bold').fillColor('#0E2D5C')
    doc.text('DUE DILIGENCE RAPPORT', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(14).font('Helvetica').fillColor('#000000')
    doc.text('(Företagsbesiktning)', { align: 'center' })
    
    doc.moveDown(2)
    doc.fontSize(14).font('Helvetica-Bold').text(`För förvärv av ${data.companyName}`)
    doc.fontSize(11).font('Helvetica')
    doc.text(`Organisationsnummer: ${data.companyOrgNumber}`)
    
    doc.moveDown(2)
    doc.text(`Köpare: ${data.buyerName}`)
    doc.text(`DD-ledare: ${data.ddTeamLead}`)
    doc.text(`Startdatum: ${new Date(data.ddStartDate).toLocaleDateString('sv-SE')}`)
    doc.text(`Slutfört: ${new Date(data.ddCompletionDate).toLocaleDateString('sv-SE')}`)
    
    doc.moveDown(3)
    doc.fontSize(10).fillColor('#C00000').font('Helvetica-Bold')
    doc.text('KONFIDENTIELLT', { align: 'center' })
    doc.text('För auktoriserade mottagare endast', { align: 'center' })
    doc.fillColor('#000000')

    doc.addPage()

    // ===== EXECUTIVE SUMMARY =====
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#0E2D5C')
    doc.text('VERKSTÄLLANDE SAMMANFATTNING', { underline: true })
    doc.moveDown(0.5)
    doc.fillColor('#000000')
    
    // Overall risk level
    const riskColors: Record<string, [number, number, number]> = {
      Low: [40, 167, 69],
      Medium: [255, 193, 7],
      High: [253, 126, 20],
      Critical: [220, 53, 69]
    }
    const riskColor = riskColors[data.overallRiskLevel || 'Medium']
    
    doc.fontSize(12).font('Helvetica-Bold').text('Övergripande risknivå:')
    doc.rect(50, doc.y, 150, 30).fill(`rgb(${riskColor[0]},${riskColor[1]},${riskColor[2]})`)
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#FFFFFF')
    doc.text(data.overallRiskLevel || 'Medium', 55, doc.y + 5)
    doc.fillColor('#000000')
    doc.moveDown(2)
    
    // Top three risks
    if (data.topThreeRisks && data.topThreeRisks.length > 0) {
      doc.fontSize(11).font('Helvetica-Bold').text('Tre viktigaste riskerna:')
      data.topThreeRisks.forEach((risk, idx) => {
        doc.fontSize(10).font('Helvetica').text(`${idx + 1}. ${risk}`, { indent: 20 })
      })
      doc.moveDown(0.5)
    }
    
    // Recommendation
    if (data.dealRecommendation) {
      doc.fontSize(11).font('Helvetica-Bold').text('Rekommendation:')
      doc.fontSize(10).font('Helvetica').text(data.dealRecommendation, { align: 'justify', indent: 20 })
      doc.moveDown(1)
    }
    
    doc.fontSize(9).fillColor('#808080')
    doc.text('Denna rapport är baserad på tillgänglig dokumentation och intervjuer. En fullständig framtidsprognos kan inte garanteras.')

    doc.addPage()

    // ===== FINANSIELL DUE DILIGENCE =====
    if (data.financialFindings && data.financialFindings.length > 0) {
      createSectionHeader(doc, 'Finansiell Due Diligence', 1)
      data.financialFindings.forEach(finding => addFinding(doc, finding, 0))
      doc.addPage()
    }

    // ===== JURIDISK DUE DILIGENCE =====
    if (data.legalFindings && data.legalFindings.length > 0) {
      createSectionHeader(doc, 'Juridisk Due Diligence', 2)
      data.legalFindings.forEach(finding => addFinding(doc, finding, 0))
      doc.addPage()
    }

    // ===== KOMMERSIELL DUE DILIGENCE =====
    if (data.commercialFindings && data.commercialFindings.length > 0) {
      createSectionHeader(doc, 'Kommersiell Due Diligence', 3)
      data.commercialFindings.forEach(finding => addFinding(doc, finding, 0))
      doc.addPage()
    }

    // ===== HR DUE DILIGENCE =====
    if (data.hrFindings && data.hrFindings.length > 0) {
      createSectionHeader(doc, 'HR & Organisation', 4)
      data.hrFindings.forEach(finding => addFinding(doc, finding, 0))
      doc.addPage()
    }

    // ===== IT DUE DILIGENCE =====
    if (data.itFindings && data.itFindings.length > 0) {
      createSectionHeader(doc, 'IT & Teknisk', 5)
      data.itFindings.forEach(finding => addFinding(doc, finding, 0))
      doc.addPage()
    }

    // ===== SKATT =====
    if (data.taxFindings && data.taxFindings.length > 0) {
      createSectionHeader(doc, 'Skattemässig Due Diligence', 6)
      data.taxFindings.forEach(finding => addFinding(doc, finding, 0))
      doc.addPage()
    }

    // ===== MILJÖ =====
    if (data.envFindings && data.envFindings.length > 0) {
      createSectionHeader(doc, 'Miljömässig Due Diligence', 7)
      data.envFindings.forEach(finding => addFinding(doc, finding, 0))
      doc.addPage()
    }

    // ===== SIGNATURE PAGE =====
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#0E2D5C')
    doc.text('UNDERTECKNING', { underline: true })
    doc.moveDown(1)
    doc.fillColor('#000000')
    
    doc.fontSize(11).font('Helvetica').text(
      'Denna rapport är baserad på tillgänglig information per rapporteringsdatum. ' +
      'Rapporten är avsedd för användning i samband med köpbeslutet och är konfidentiell.',
      { align: 'justify' }
    )
    
    doc.moveDown(3)
    doc.text('DD-ledare:')
    doc.moveDown(2)
    doc.text('_' . repeat(40))
    doc.text(data.ddTeamLead)
    doc.moveDown(0.3)
    doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`)

    doc.end()
  })
}
