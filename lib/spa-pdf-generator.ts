import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'

export interface SPAPdfData {
  companyName: string
  sellerName: string
  buyerName: string
  purchasePrice: number
  closingDate: string
  cashAtClosing: number
  escrowHoldback: number
  earnoutStructure?: any
  financialData?: {
    revenue: number
    ebitda: number
    employees: number
  }
  representations: string[]
  warranties: string[]
  conditions: string[]
  extractedInfo?: Record<string, any>
}

type PDFDocumentType = InstanceType<typeof PDFDocument>

function createHeader(doc: PDFDocumentType, title: string, subtitle?: string) {
  // Title
  doc.fontSize(24).font('Helvetica-Bold').text(title, { align: 'center' })
  
  if (subtitle) {
    doc.fontSize(12).font('Helvetica').text(subtitle, { align: 'center' })
  }
  
  doc.moveDown(0.5)
  doc.strokeColor('#002D5C').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown(0.5)
}

function createSection(doc: PDFDocumentType, title: string, content: string | string[]) {
  doc.fontSize(14).font('Helvetica-Bold').text(title)
  doc.fontSize(11).font('Helvetica')
  
  if (Array.isArray(content)) {
    content.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, { align: 'left' })
    })
  } else {
    doc.text(content, { align: 'left', width: 500 })
  }
  
  doc.moveDown(0.3)
}

function createTable(
  doc: PDFDocumentType,
  data: { label: string; value: string | number }[],
  options?: { labelWidth?: number }
) {
  const labelWidth = options?.labelWidth || 200
  const valueX = 250
  
  data.forEach((row) => {
    doc.fontSize(11).font('Helvetica-Bold').text(row.label, 50, doc.y, { width: labelWidth })
    doc.fontSize(11).font('Helvetica').text(String(row.value), valueX, doc.y - 15)
    doc.moveDown(0.5)
  })
}

function addWatermark(doc: PDFDocumentType, text: string) {
  const size = doc.page.width
  
  doc
    .fontSize(60)
    .font('Helvetica-Bold')
    .opacity(0.1)
    .text(text, 0, size / 2, {
      align: 'center',
      angle: 45
    })
    .opacity(1)
}

export async function generateSPAPdf(data: SPAPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const doc = new PDFDocument({ size: 'A4', margin: 50 })

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    doc.on('error', reject)

    try {
      // Add watermark
      addWatermark(doc, 'KONFIDENTIELLT')

      // Title Page
      doc.fontSize(32).font('Helvetica-Bold').text('SHARE PURCHASE AGREEMENT', { align: 'center' })
      doc.moveDown(0.5)
      doc.fontSize(14).font('Helvetica').text(`Between ${data.sellerName} and ${data.buyerName}`, {
        align: 'center'
      })
      doc.moveDown(2)

      // Company Info
      doc.fontSize(12).font('Helvetica-Bold').text('COMPANY')
      doc.fontSize(11).font('Helvetica').text(data.companyName)
      doc.moveDown(1)

      doc.fontSize(12).font('Helvetica-Bold').text('EFFECTIVE DATE')
      doc.fontSize(11).font('Helvetica').text(new Date(data.closingDate).toLocaleDateString('sv-SE'))
      doc.moveDown(2)

      doc.addPage()

      // Financial Terms Section
      createHeader(doc, 'FINANCIAL TERMS', 'Köpeskillingen och dess fördelning')

      const financialTerms = [
        { label: 'Enterprise Value', value: `${(data.purchasePrice / 1000000).toFixed(1)} MSEK` },
        { label: 'Cash at Closing', value: `${(data.cashAtClosing / 1000000).toFixed(1)} MSEK` },
        { label: 'Escrow Holdback (18 mån)', value: `${(data.escrowHoldback / 1000000).toFixed(1)} MSEK` },
        { label: 'Earnout Structure', value: data.earnoutStructure ? 'KPI-Based' : 'N/A' }
      ]
      createTable(doc, financialTerms)

      doc.addPage()

      // Company Information Section
      if (data.financialData) {
        createHeader(doc, 'COMPANY INFORMATION', 'Finansiell sammanfattning')

        const companyInfo = [
          { label: 'Revenue (annual)', value: `${(data.financialData.revenue / 1000000).toFixed(1)} MSEK` },
          { label: 'EBITDA', value: `${(data.financialData.ebitda / 1000000).toFixed(1)} MSEK` },
          { label: 'Employees', value: data.financialData.employees }
        ]
        createTable(doc, companyInfo)

        doc.moveDown(1)
      }

      // Representations & Warranties Section
      doc.addPage()
      createHeader(doc, 'REPRESENTATIONS & WARRANTIES', 'Vad säljaren garanterar')
      createSection(doc, 'Seller Representations', data.representations)

      // Conditions Section
      if (data.conditions && data.conditions.length > 0) {
        doc.moveDown(1)
        createSection(doc, 'Closing Conditions', data.conditions)
      }

      // Signature Page
      doc.addPage()
      doc.fontSize(14).font('Helvetica-Bold').text('SIGNATURE PAGE')
      doc.moveDown(2)

      doc.fontSize(11).font('Helvetica').text('SELLER:')
      doc.moveDown(3)
      doc.text('_______________________________')
      doc.fontSize(10).text(data.sellerName)

      doc.moveDown(3)
      doc.fontSize(11).font('Helvetica').text('BUYER:')
      doc.moveDown(3)
      doc.text('_______________________________')
      doc.fontSize(10).text(data.buyerName)

      doc.end()
    } catch (error) {
      doc.end()
      reject(error)
    }
  })
}
