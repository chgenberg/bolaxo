import type { Readable } from 'stream'
import * as XLSX from 'xlsx'
import * as mammoth from 'mammoth'

// pdf-parse is CommonJS, need to import correctly
const getPdfParse = () => {
  const mod = require('pdf-parse') as any
  return mod.default || mod
}

export interface DocumentExtractionResult {
  text: string
  format: 'pdf' | 'excel' | 'word' | 'powerpoint' | 'text' | 'unknown'
  pages?: number
  sheets?: string[]
  confidence: number
  metadata?: Record<string, any>
}

/**
 * Universal document reader that extracts text from multiple file formats
 * Supports: PDF, Excel (.xlsx, .xls), Word (.docx), PowerPoint (.pptx), Text files
 */
export async function extractTextFromDocument(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<DocumentExtractionResult> {
  try {
    // Determine format from MIME type and filename
    const format = detectFormat(mimeType, fileName)

    switch (format) {
      case 'pdf':
        return await extractFromPDF(buffer)
      case 'excel':
        return extractFromExcel(buffer)
      case 'word':
        return await extractFromWord(buffer)
      case 'powerpoint':
        return await extractFromPowerPoint(buffer)
      case 'text':
        return extractFromText(buffer)
      default:
        return {
          text: buffer.toString('utf8'),
          format: 'unknown',
          confidence: 0.3,
          metadata: { reason: 'Unable to determine format' }
        }
    }
  } catch (error) {
    console.error('Document extraction error:', error)
    throw new Error(`Failed to extract text from document: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function detectFormat(mimeType: string, fileName: string): DocumentExtractionResult['format'] {
  // MIME type detection
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'excel'
  if (mimeType.includes('word') || mimeType.includes('wordprocessingml')) return 'word'
  if (mimeType.includes('presentation') || mimeType.includes('officedocument.presentationml')) return 'powerpoint'
  if (mimeType.includes('text') || mimeType.includes('plain')) return 'text'

  // Filename extension detection
  const ext = fileName.toLowerCase().split('.').pop()
  if (ext === 'pdf') return 'pdf'
  if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'excel'
  if (['doc', 'docx'].includes(ext || '')) return 'word'
  if (['ppt', 'pptx'].includes(ext || '')) return 'powerpoint'
  if (['txt', 'md'].includes(ext || '')) return 'text'

  return 'unknown'
}

/**
 * Extract text from PDF
 */
async function extractFromPDF(buffer: Buffer): Promise<DocumentExtractionResult> {
  try {
    const pdfParseFunc = getPdfParse()
    const pdf = await pdfParseFunc(buffer)
    const text = pdf.text || ''
    
    return {
      text,
      format: 'pdf',
      pages: pdf.numpages || 0,
      confidence: 0.95,
      metadata: {
        pages: pdf.numpages,
        producedBy: pdf.info?.Producer || 'Unknown',
        createdAt: pdf.info?.CreationDate
      }
    }
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw error
  }
}

/**
 * Extract text from Excel (.xlsx, .xls, .csv)
 */
function extractFromExcel(buffer: Buffer): DocumentExtractionResult {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheets = workbook.SheetNames
    
    let text = ''
    const sheetData: Record<string, string> = {}
    
    sheets.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName]
      const sheetText = XLSX.utils.sheet_to_csv(worksheet)
      text += `\n--- SHEET: ${sheetName} ---\n${sheetText}`
      sheetData[sheetName] = sheetText
    })

    return {
      text,
      format: 'excel',
      sheets,
      confidence: 0.9,
      metadata: {
        sheetNames: sheets,
        totalSheets: sheets.length,
        sheetData
      }
    }
  } catch (error) {
    console.error('Excel extraction error:', error)
    throw error
  }
}

/**
 * Extract text from Word (.docx)
 */
async function extractFromWord(buffer: Buffer): Promise<DocumentExtractionResult> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    const text = result.value || ''
    
    return {
      text,
      format: 'word',
      confidence: 0.9,
      metadata: {
        warnings: result.messages?.map(m => m.message) || []
      }
    }
  } catch (error) {
    console.error('Word extraction error:', error)
    throw error
  }
}

/**
 * Extract text from PowerPoint (.pptx)
 * PPTX is a ZIP format containing XML files
 */
async function extractFromPowerPoint(buffer: Buffer): Promise<DocumentExtractionResult> {
  try {
    // PPTX is ZIP-based, we need to extract and parse XML
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    await zip.loadAsync(buffer)

    let text = ''
    const slides: string[] = []

    // Extract text from each slide
    for (const fileName of Object.keys(zip.files)) {
      if (fileName.includes('slide') && fileName.endsWith('.xml')) {
        const content = await zip.files[fileName].async('text')
        
        // Simple XML text extraction - remove tags
        const slideText = content
          .replace(/<[^>]*>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, ' ')
          .trim()
        
        if (slideText) {
          slides.push(slideText)
          text += `\n--- SLIDE: ${fileName} ---\n${slideText}`
        }
      }
    }

    return {
      text,
      format: 'powerpoint',
      pages: slides.length,
      confidence: 0.85,
      metadata: {
        slides: slides.length,
        slideContent: slides
      }
    }
  } catch (error) {
    console.error('PowerPoint extraction error:', error)
    throw error
  }
}

/**
 * Extract text from plain text files
 */
function extractFromText(buffer: Buffer): DocumentExtractionResult {
  const text = buffer.toString('utf8')
  
  return {
    text,
    format: 'text',
    confidence: 1.0,
    metadata: {
      encoding: 'utf8',
      characterCount: text.length,
      lineCount: text.split('\n').length
    }
  }
}

/**
 * Utility function to clean and normalize extracted text
 */
export function cleanExtractedText(text: string): string {
  return text
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove special characters but keep some punctuation
    .replace(/[^\w\s.,;:!?\-()]/g, ' ')
    // Trim
    .trim()
}

/**
 * Split text into chunks for GPT processing (max 4000 chars per chunk)
 */
export function splitTextForGPT(text: string, maxChunkSize: number = 4000): string[] {
  const chunks: string[] = []
  let currentChunk = ''

  const sentences = text.split(/(?<=[.!?])\s+/)
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = sentence
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence
    }
  }
  
  if (currentChunk) chunks.push(currentChunk)
  return chunks
}
