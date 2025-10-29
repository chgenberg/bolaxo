import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'

export interface DDReportData {
  companyName: string
  reportDate: string
  preparedBy: string
  executiveSummary: string
  financialFindings: Array<{
    category: string
    finding: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    impact: string
    recommendation: string
  }>
  operationalFindings: Array<{
    category: string
    finding: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    impact: string
    recommendation: string
  }>
  legalFindings: Array<{
    category: string
    finding: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    impact: string
    recommendation: string
  }>
  riskSummary: {
    overallRisk: 'critical' | 'high' | 'medium' | 'low'
    description: string
  }
  extractedInfo?: Record<string, any>
}

type PDFDocumentType = InstanceType<typeof PDFDocument>

function createHeader(doc: PDFDocumentType, title: string, subtitle?: string) {
  doc.fontSize(24).font('Helvetica-Bold').text(title, { align: 'center' })
  
  if (subtitle) {
    doc.fontSize(12).font('Helvetica').text(subtitle, { align: 'center' })
  }
  
  doc.moveDown(0.5)
  doc.strokeColor('#C41E3A').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown(0.5)
}

function addFinding(
  doc: PDFDocumentType,
  finding: {
    category: string
    finding: string
    severity: string
    impact: string
    recommendation: string
  }
) {
  const severityColor = {
    critical: '#D32F2F',
    high: '#F57C00',
    medium: '#FBC02D',
    low: '#388E3C'
  }[finding.severity] || '#666'

  doc.fontSize(11).font('Helvetica-Bold').fillColor(severityColor).text(`${finding.category.toUpperCase()}`)
  doc.fillColor('#000')
  
  doc.fontSize(10).font('Helvetica').text(`Finding: ${finding.finding}`)
  doc.text(`Severity: ${finding.severity.toUpperCase()}`, { link: null })
  doc.text(`Impact: ${finding.impact}`)
  doc.text(`Recommendation: ${finding.recommendation}`)
  doc.moveDown(0.3)
  doc.strokeColor('#EEEEEE').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown(0.3)
}

export async function generateDDReportPdf(data: DDReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const doc = new PDFDocument({ size: 'A4', margin: 50 })

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    doc.on('error', reject)

    try {
      // Title Page
      doc.fontSize(32).font('Helvetica-Bold').text('DUE DILIGENCE REPORT', { align: 'center' })
      doc.moveDown(1)
      doc.fontSize(16).font('Helvetica').text(data.companyName, { align: 'center' })
      doc.moveDown(2)

      doc.fontSize(11).font('Helvetica').text(`Report Date: ${data.reportDate}`, { align: 'center' })
      doc.text(`Prepared by: ${data.preparedBy}`, { align: 'center' })
      doc.moveDown(2)

      // Risk Summary Box
      const riskColor = {
        critical: '#D32F2F',
        high: '#F57C00',
        medium: '#FBC02D',
        low: '#4CAF50'
      }[data.riskSummary.overallRisk]

      doc.rect(50, doc.y, 500, 80).fillAndStroke(riskColor, '#000')
      doc.fillColor('#FFF').fontSize(12).font('Helvetica-Bold').text('OVERALL RISK ASSESSMENT', 60, doc.y + 10)
      doc.fontSize(20).text(data.riskSummary.overallRisk.toUpperCase(), 60, doc.y)
      doc.fontSize(10).font('Helvetica').text(data.riskSummary.description, 60, doc.y + 30, { width: 480 })
      doc.fillColor('#000')
      doc.moveDown(6)

      doc.addPage()

      // Executive Summary
      createHeader(doc, 'EXECUTIVE SUMMARY')
      doc.fontSize(11).font('Helvetica').text(data.executiveSummary, { align: 'left', width: 500 })
      doc.moveDown(1)

      // Financial Findings
      doc.addPage()
      createHeader(doc, 'FINANCIAL FINDINGS', 'Analysis and observations regarding financial performance and structure')
      data.financialFindings.forEach(finding => addFinding(doc, finding))

      // Operational Findings
      if (data.operationalFindings.length > 0) {
        doc.addPage()
        createHeader(doc, 'OPERATIONAL FINDINGS', 'Analysis of business operations and processes')
        data.operationalFindings.forEach(finding => addFinding(doc, finding))
      }

      // Legal Findings
      if (data.legalFindings.length > 0) {
        doc.addPage()
        createHeader(doc, 'LEGAL & COMPLIANCE FINDINGS', 'Analysis of legal structure and regulatory compliance')
        data.legalFindings.forEach(finding => addFinding(doc, finding))
      }

      // Conclusion Page
      doc.addPage()
      doc.fontSize(14).font('Helvetica-Bold').text('CONCLUSION & RECOMMENDATIONS')
      doc.moveDown(1)
      
      doc.fontSize(11).font('Helvetica').text(
        'This Due Diligence Report summarizes findings across financial, operational, and legal areas. ' +
        'The identified items require attention and should be addressed during negotiation of transaction terms.'
      )

      doc.end()
    } catch (error) {
      doc.end()
      reject(error)
    }
  })
}
