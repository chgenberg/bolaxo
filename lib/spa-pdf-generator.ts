import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'

export interface SPAPdfData {
  sellerName: string
  sellerOrgNumber: string
  sellerAddress: string
  buyerName: string
  buyerOrgNumber: string
  buyerAddress: string
  companyName: string
  companyOrgNumber: string
  companyAddress: string
  numberOfShares: number
  percentageOwned: number
  purchasePrice: number
  closingDate: string
  paymentMethod: 'wire' | 'check' | 'other'
  paymentDueDate: string
  cashAtClosing: number
  escrowAmount: number
  escrowPeriod: string
  earnoutAmount?: number
  earnoutPeriod?: string
  earnoutKPI?: string
  representations: string[]
  warranties: string[]
  conditions: string[]
  nonCompetePeriod: string
  indemnification?: string
  financialData?: {
    latestRevenue?: number
    latestEBITDA?: number
    employees?: number
    lastFiscalYear?: string
  }
  extractedInfo?: Record<string, any>
}

export async function generateSPAPDF(data: SPAPdfData): Promise<Buffer> {
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
      doc.fontSize(24).text('AKTIEÖVERLÅTELSEAVTAL', { align: 'center' })
      doc.moveDown(1)
      doc.fontSize(14).text('(Share Purchase Agreement)', { align: 'center' })
      doc.moveDown(2)
      doc.fontSize(12).text(`För förvärv av ${data.companyName}`, { align: 'center' })
      doc.moveDown(3)
      doc.fontSize(11).text(`Mellan:\n${data.sellerName}\n(Säljare)\n\noch\n\n${data.buyerName}\n(Köpare)`, { align: 'center' })
      doc.moveDown(3)
      doc.fontSize(11).text(`Datum: ${new Date(data.closingDate).toLocaleDateString('sv-SE')}`, { align: 'center' })
      doc.moveDown(5)
      doc.fontSize(10).text('KONFIDENTIELLT\nFör auktoriserade mottagare endast', { align: 'center' })

      doc.addPage()

      // CONTENTS
      doc.fontSize(16).text('INNEHÅLLSFÖRTECKNING', { underline: true })
      doc.moveDown(0.5)
      
      const contents = [
        '1. Parter och bakgrund',
        '2. Föremålet för överlåtelsen',
        '3. Köpeskilling och betalningsvillkor',
        '4. Garantier från säljaren'
      ]

      contents.forEach(content => {
        doc.fontSize(11).text(content, { indent: 20 })
        doc.moveDown(0.3)
      })

      doc.addPage()

      // SECTION 1
      doc.fontSize(14).text('1. Parter och bakgrund', { underline: true })
      doc.moveDown(0.5)
      doc.fontSize(11).text(`Säljare: ${data.sellerName} (${data.sellerOrgNumber})`)
      doc.text(`Köpare: ${data.buyerName} (${data.buyerOrgNumber})`)
      doc.text(`Bolag: ${data.companyName} (${data.companyOrgNumber})`)
      doc.moveDown(1)

      // SECTION 2
      doc.fontSize(14).text('2. Föremålet för överlåtelsen', { underline: true })
      doc.moveDown(0.5)
      doc.fontSize(11).text(`Samtliga ${data.numberOfShares} stamaktier (${data.percentageOwned}% av bolaget).`)
      doc.moveDown(1)

      // SECTION 3
      doc.fontSize(14).text('3. Köpeskilling och betalningsvillkor', { underline: true })
      doc.moveDown(0.5)
      doc.fontSize(11).text(`Total köpeskilling: ${data.purchasePrice.toLocaleString('sv-SE')} SEK`)
      doc.text(`- Cash at closing: ${data.cashAtClosing.toLocaleString('sv-SE')} SEK`)
      doc.text(`- Escrow (${data.escrowPeriod}): ${data.escrowAmount.toLocaleString('sv-SE')} SEK`)
      if (data.earnoutAmount) {
        doc.text(`- Earn-out (${data.earnoutPeriod}): ${data.earnoutAmount.toLocaleString('sv-SE')} SEK`)
      }
      doc.moveDown(1)

      // SECTION 4
      doc.fontSize(14).text('4. Garantier från säljaren', { underline: true })
      doc.moveDown(0.5)
      doc.fontSize(11)
      data.representations.slice(0, 5).forEach((rep, idx) => {
        doc.text(`${idx + 1}. ${rep}`, { indent: 20 })
      })
      doc.moveDown(2)

      // SIGNATURES
      doc.fontSize(14).text('UNDERTECKNINGAR', { underline: true })
      doc.moveDown(2)
      doc.fontSize(11).text('SÄLJARE: ' + data.sellerName)
      doc.text('_'.repeat(40))
      doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`)
      doc.moveDown(2)
      doc.text('KÖPARE: ' + data.buyerName)
      doc.text('_'.repeat(40))
      doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`)

      doc.end()
    } catch (error) {
      console.error('Error generating SPA PDF:', error)
      reject(error)
    }
  })
}
