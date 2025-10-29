import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'

export interface DDPdfData {
  listingId: string
  companyName: string
  companyOrgNumber: string
  buyerName: string
  ddTeamLead: string
  ddStartDate: string
  ddCompletionDate: string
  financialFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  legalFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  commercialFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  hrFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  itFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  taxFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  envFindings?: Array<{
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    description: string
    recommendation?: string
  }>
  overallRiskLevel?: 'Low' | 'Medium' | 'High' | 'Critical'
  dealRecommendation?: string
  topThreeRisks?: string[]
}

function getSeverityColor(severity: string): [number, number, number] {
  switch (severity) {
    case 'Critical': return [220, 53, 69]
    case 'High': return [253, 126, 20]
    case 'Medium': return [255, 193, 7]
    case 'Low': return [40, 167, 69]
    default: return [108, 117, 125]
  }
}

export async function generateDDReportPDF(data: DDPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      })

      const buffers: Buffer[] = []

      doc.on('data', (chunk: Buffer) => buffers.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      doc.on('error', reject)

      // TITLE PAGE
      doc.fontSize(28).fillColor('#0E2D5C').text('DUE DILIGENCE RAPPORT', { align: 'center' })
      doc.moveDown(0.5)
      doc.fontSize(14).fillColor('#000000').text('(Företagsbesiktning)', { align: 'center' })
      doc.moveDown(2)
      doc.fontSize(14).text(`För förvärv av ${data.companyName}`)
      doc.moveDown(0.5)
      doc.fontSize(11).text(`Organisationsnummer: ${data.companyOrgNumber}`)
      doc.text(`Köpare: ${data.buyerName}`)
      doc.text(`DD-ledare: ${data.ddTeamLead}`)
      doc.text(`Startdatum: ${new Date(data.ddStartDate).toLocaleDateString('sv-SE')}`)
      doc.text(`Slutfört: ${new Date(data.ddCompletionDate).toLocaleDateString('sv-SE')}`)
      doc.moveDown(3)
      doc.fontSize(10).fillColor('#C00000').text('KONFIDENTIELLT', { align: 'center' })
      doc.text('För auktoriserade mottagare endast', { align: 'center' })
      doc.fillColor('#000000')

      doc.addPage()

      // EXECUTIVE SUMMARY
      doc.fontSize(16).fillColor('#0E2D5C').text('VERKSTÄLLANDE SAMMANFATTNING', { underline: true })
      doc.moveDown(0.5)
      doc.fillColor('#000000')
      
      const riskColors: Record<string, [number, number, number]> = {
        Low: [40, 167, 69],
        Medium: [255, 193, 7],
        High: [253, 126, 20],
        Critical: [220, 53, 69]
      }
      const riskColor = riskColors[data.overallRiskLevel || 'Medium']
      
      doc.fontSize(12).text('Övergripande risknivå:')
      doc.moveDown(0.5)
      doc.rect(50, doc.y, 150, 30).fill(`rgb(${riskColor[0]},${riskColor[1]},${riskColor[2]})`)
      doc.fontSize(14).fillColor('#FFFFFF').text(data.overallRiskLevel || 'Medium', 55, doc.y + 5)
      doc.fillColor('#000000')
      doc.moveDown(2)
      
      if (data.topThreeRisks && data.topThreeRisks.length > 0) {
        doc.fontSize(11).text('Tre viktigaste riskerna:')
        data.topThreeRisks.forEach((risk, idx) => {
          doc.fontSize(10).text(`${idx + 1}. ${risk}`, { indent: 20 })
        })
        doc.moveDown(0.5)
      }
      
      if (data.dealRecommendation) {
        doc.fontSize(11).text('Rekommendation:')
        doc.fontSize(10).text(data.dealRecommendation, { align: 'justify', indent: 20 })
        doc.moveDown(1)
      }

      doc.addPage()

      // SECTIONS
      const sections = [
        { title: 'Finansiell Due Diligence', findings: data.financialFindings, num: 1 },
        { title: 'Juridisk Due Diligence', findings: data.legalFindings, num: 2 },
        { title: 'Kommersiell Due Diligence', findings: data.commercialFindings, num: 3 },
        { title: 'HR & Organisation', findings: data.hrFindings, num: 4 },
        { title: 'IT & Teknisk', findings: data.itFindings, num: 5 },
        { title: 'Skattemässig Due Diligence', findings: data.taxFindings, num: 6 },
        { title: 'Miljömässig Due Diligence', findings: data.envFindings, num: 7 }
      ]

      sections.forEach(section => {
        if (section.findings && section.findings.length > 0) {
          doc.fontSize(14).fillColor('#0E2D5C').text(`${section.num}. ${section.title}`, { underline: true })
          doc.moveDown(0.5)
          doc.fillColor('#000000')
          
          section.findings.forEach(finding => {
            const [r, g, b] = getSeverityColor(finding.severity)
            
            doc.rect(50, doc.y, 500, 4).fill(`rgb(${r},${g},${b})`)
            doc.moveDown(0.3)
            
            doc.fontSize(11).text(finding.title, { width: 400 })
            doc.moveDown(0.3)
            
            doc.fontSize(9).fillColor('#FFFFFF')
            doc.rect(450, doc.y - 15, 90, 18).fill(`rgb(${r},${g},${b})`)
            doc.text(finding.severity, 455, doc.y - 10, { width: 80 })
            doc.fillColor('#000000')
            doc.moveDown(0.8)
            
            doc.fontSize(10).text('Findings:')
            doc.text(finding.description, { indent: 20, align: 'justify' })
            doc.moveDown(0.3)
            
            if (finding.recommendation) {
              doc.text('Recommendation:')
              doc.text(finding.recommendation, { indent: 20, align: 'justify' })
            }
            
            doc.moveDown(0.5)
          })

          doc.addPage()
        }
      })

      // SIGNATURE PAGE
      doc.fontSize(14).fillColor('#0E2D5C').text('UNDERTECKNING', { underline: true })
      doc.moveDown(1)
      doc.fillColor('#000000')
      doc.fontSize(11).text('DD-rapport upprättad av:')
      doc.moveDown(0.5)
      doc.text(data.ddTeamLead)
      doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`)
      doc.moveDown(1)
      doc.text('_'.repeat(50))
      doc.moveDown(0.5)
      doc.text('Underskrift')

      doc.end()
    } catch (error) {
      console.error('Error generating DD PDF:', error)
      reject(error)
    }
  })
}
