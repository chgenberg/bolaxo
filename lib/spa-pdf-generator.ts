import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'

export interface SPAPdfData {
  // Parties
  sellerName: string
  sellerOrgNumber: string
  sellerAddress: string
  buyerName: string
  buyerOrgNumber: string
  buyerAddress: string
  
  // Company
  companyName: string
  companyOrgNumber: string
  companyAddress: string
  numberOfShares: number
  percentageOwned: number
  
  // Purchase terms
  purchasePrice: number
  closingDate: string
  paymentMethod: 'wire' | 'check' | 'other'
  paymentDueDate: string
  
  // Payment structure
  cashAtClosing: number
  escrowAmount: number
  escrowPeriod: string
  earnoutAmount?: number
  earnoutPeriod?: string
  earnoutKPI?: string
  
  // Terms
  representations: string[]
  warranties: string[]
  conditions: string[]
  nonCompetePeriod: string
  indemnification?: string
  
  // Financial data
  financialData?: {
    latestRevenue?: number
    latestEBITDA?: number
    employees?: number
    lastFiscalYear?: string
  }
  
  // Extracted from documents
  extractedInfo?: Record<string, any>
}

type PDFDocumentType = InstanceType<typeof PDFDocument>

// Safe font setter - don't chain, handle errors
function setFont(doc: PDFDocumentType, font: string) {
  try {
    doc.font(font)
  } catch (e) {
    try {
      doc.font('Helvetica')
    } catch (e2) {
      // Silent fallback
    }
  }
}

export async function generateSPAPDF(data: SPAPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true
      })

      const buffers: Buffer[] = []

      doc.on('data', (chunk: Buffer) => buffers.push(chunk))
      doc.on('end', () => {
        resolve(Buffer.concat(buffers))
      })
      doc.on('error', reject)

      // ===== TITLE PAGE =====
      doc.fontSize(24)
      setFont(doc, 'Helvetica-Bold')
      doc.text('AKTIEÖVERLÅTELSEAVTAL', { align: 'center' })
      doc.moveDown(1)
      
      doc.fontSize(14)
      setFont(doc, 'Helvetica')
      doc.text('(Share Purchase Agreement)', { align: 'center' })
      doc.moveDown(2)

      doc.fontSize(12)
      setFont(doc, 'Helvetica-Bold')
      doc.text(`För förvärv av ${data.companyName}`, { align: 'center' })
      doc.moveDown(3)

      doc.fontSize(11)
      setFont(doc, 'Helvetica')
      doc.text(`Mellan:\n${data.sellerName}\n(Säljare)\n\noch\n\n${data.buyerName}\n(Köpare)`, { align: 'center' })
      doc.moveDown(3)

      doc.fontSize(11)
      doc.text(`Datum: ${new Date(data.closingDate).toLocaleDateString('sv-SE')}`, { align: 'center' })
      doc.moveDown(5)

      doc.fontSize(10)
      setFont(doc, 'Helvetica')
      doc.text('KONFIDENTIELLT\nFör auktoriserade mottagare endast', { align: 'center' })

      doc.addPage()

      // ===== CONTENT =====
      doc.fontSize(16)
      setFont(doc, 'Helvetica-Bold')
      doc.text('INNEHÅLLSFÖRTECKNING', { underline: true })
      doc.moveDown(0.5)
      
      const contents = [
        '1. Parter och bakgrund',
        '2. Föremålet för överlåtelsen',
        '3. Köpeskilling och betalningsvillkor',
        '4. Garantier från säljaren'
      ]

      contents.forEach(content => {
        doc.fontSize(11)
        setFont(doc, 'Helvetica')
        doc.text(content, { indent: 20 })
        doc.moveDown(0.3)
      })

      doc.addPage()

      // ===== SECTION 1 =====
      doc.fontSize(14)
      setFont(doc, 'Helvetica-Bold')
      doc.text('1. Parter och bakgrund', { underline: true })
      doc.moveDown(0.5)
      
      doc.fontSize(11)
      setFont(doc, 'Helvetica')
      doc.text(`Säljare: ${data.sellerName} (${data.sellerOrgNumber})`)
      doc.text(`Köpare: ${data.buyerName} (${data.buyerOrgNumber})`)
      doc.text(`Bolag: ${data.companyName} (${data.companyOrgNumber})`)
      doc.moveDown(1)

      // ===== SECTION 2 =====
      doc.fontSize(14)
      setFont(doc, 'Helvetica-Bold')
      doc.text('2. Föremålet för överlåtelsen', { underline: true })
      doc.moveDown(0.5)
      
      doc.fontSize(11)
      setFont(doc, 'Helvetica')
      doc.text(`Samtliga ${data.numberOfShares} stamaktier (${data.percentageOwned}% av bolaget).`)
      doc.moveDown(1)

      // ===== SECTION 3 =====
      doc.fontSize(14)
      setFont(doc, 'Helvetica-Bold')
      doc.text('3. Köpeskilling och betalningsvillkor', { underline: true })
      doc.moveDown(0.5)
      
      doc.fontSize(11)
      setFont(doc, 'Helvetica')
      doc.text(`Total köpeskilling: ${data.purchasePrice.toLocaleString('sv-SE')} SEK`)
      doc.text(`- Cash at closing: ${data.cashAtClosing.toLocaleString('sv-SE')} SEK`)
      doc.text(`- Escrow (${data.escrowPeriod}): ${data.escrowAmount.toLocaleString('sv-SE')} SEK`)
      if (data.earnoutAmount) {
        doc.text(`- Earn-out (${data.earnoutPeriod}): ${data.earnoutAmount.toLocaleString('sv-SE')} SEK`)
      }
      doc.moveDown(1)

      // ===== SECTION 4 =====
      doc.fontSize(14)
      setFont(doc, 'Helvetica-Bold')
      doc.text('4. Garantier från säljaren', { underline: true })
      doc.moveDown(0.5)
      
      doc.fontSize(11)
      setFont(doc, 'Helvetica')
      data.representations.slice(0, 5).forEach((rep, idx) => {
        doc.text(`${idx + 1}. ${rep}`, { indent: 20 })
      })
      doc.moveDown(2)

      // ===== SIGNATURES =====
      doc.fontSize(14)
      setFont(doc, 'Helvetica-Bold')
      doc.text('UNDERTECKNINGAR', { underline: true })
      doc.moveDown(2)

      doc.fontSize(11)
      setFont(doc, 'Helvetica')
      doc.text('SÄLJARE: ' + data.sellerName)
      doc.text('_'.repeat(40))
      doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`)
      doc.moveDown(2)

      doc.text('KÖPARE: ' + data.buyerName)
      doc.text('_'.repeat(40))
      doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`)

      // Finalize
      doc.end()
    } catch (error) {
      console.error('Error generating SPA PDF:', error)
      reject(error)
    }
  })
}
