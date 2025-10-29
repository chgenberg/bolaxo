import { createWriteStream } from 'fs'
import { Readable } from 'stream'

/**
 * Ultra-simple PDF generator that doesn't use any fonts
 * This avoids all font loading issues in serverless environments
 */
export async function generateSimplePDF(title: string, content: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const chunks: Buffer[] = []
      
      // Simple PDF header
      let pdf = '%PDF-1.4\n'
      
      // Objects
      const objects: string[] = []
      
      // Object 1: Catalog
      objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj')
      
      // Object 2: Pages
      objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj')
      
      // Object 3: Page
      objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj')
      
      // Object 4: Resources
      objects.push('4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>\nendobj')
      
      // Object 5: Content stream
      let stream = 'BT\n'
      stream += '/F1 24 Tf\n'
      stream += '50 750 Td\n'
      stream += `(${title}) Tj\n`
      stream += '0 -30 Td\n'
      
      let yPos = 700
      content.forEach(line => {
        stream += '/F1 11 Tf\n'
        stream += `50 ${yPos} Td\n`
        stream += `(${line.substring(0, 80)}) Tj\n`
        yPos -= 15
        if (yPos < 50) yPos = 750
      })
      
      stream += 'ET\n'
      
      objects.push(`5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}endstream\nendobj`)
      
      // Build xref table
      let offset = pdf.length
      const xref: number[] = []
      
      objects.forEach((obj, idx) => {
        xref.push(offset)
        pdf += obj + '\n'
        offset = pdf.length
      })
      
      // Add xref
      const xrefOffset = pdf.length
      pdf += 'xref\n'
      pdf += `0 ${objects.length + 1}\n`
      pdf += '0000000000 65535 f \n'
      xref.forEach(pos => {
        pdf += `${String(pos).padStart(10, '0')} 00000 n \n`
      })
      
      // Add trailer
      pdf += 'trailer\n'
      pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
      pdf += 'startxref\n'
      pdf += `${xrefOffset}\n`
      pdf += '%%EOF'
      
      resolve(Buffer.from(pdf, 'utf8'))
    } catch (error) {
      reject(error)
    }
  })
}
