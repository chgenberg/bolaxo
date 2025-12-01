import type { Readable } from 'stream'
import * as XLSX from 'xlsx'
import * as mammoth from 'mammoth'
import Tesseract from 'tesseract.js'

// pdf-parse is CommonJS, need to import correctly
const getPdfParse = () => {
  const mod = require('pdf-parse') as any
  return mod.default || mod
}

// Minimum text length to consider a PDF as having readable text
const MIN_TEXT_LENGTH_FOR_VALID_PDF = 100

export interface DocumentExtractionResult {
  text: string
  format: 'pdf' | 'excel' | 'word' | 'powerpoint' | 'text' | 'image' | 'unknown'
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
      case 'image':
        return await extractFromImage(buffer, fileName)
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
  if (mimeType.includes('image/')) return 'image'

  // Filename extension detection
  const ext = fileName.toLowerCase().split('.').pop()
  if (ext === 'pdf') return 'pdf'
  if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'excel'
  if (['doc', 'docx'].includes(ext || '')) return 'word'
  if (['ppt', 'pptx'].includes(ext || '')) return 'powerpoint'
  if (['txt', 'md'].includes(ext || '')) return 'text'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif'].includes(ext || '')) return 'image'

  return 'unknown'
}

/**
 * Extract text from PDF with OCR fallback for scanned documents
 */
async function extractFromPDF(buffer: Buffer): Promise<DocumentExtractionResult> {
  try {
    const pdfParseFunc = getPdfParse()
    const pdf = await pdfParseFunc(buffer)
    const text = pdf.text || ''
    
    // If we got enough text, return it directly
    if (text.trim().length >= MIN_TEXT_LENGTH_FOR_VALID_PDF) {
      return {
        text,
        format: 'pdf',
        pages: pdf.numpages || 0,
        confidence: 0.95,
        metadata: {
          pages: pdf.numpages,
          producedBy: pdf.info?.Producer || 'Unknown',
          createdAt: pdf.info?.CreationDate,
          extractionMethod: 'text'
        }
      }
    }
    
    // PDF appears to be scanned/image-based, try OCR
    console.log('[PDF] Text extraction yielded minimal text, attempting OCR...')
    const ocrResult = await extractTextWithOCR(buffer, pdf.numpages || 1)
    
    if (ocrResult.text.trim().length > text.trim().length) {
      return {
        text: ocrResult.text,
        format: 'pdf',
        pages: pdf.numpages || 0,
        confidence: ocrResult.confidence,
        metadata: {
          pages: pdf.numpages,
          producedBy: pdf.info?.Producer || 'Unknown',
          createdAt: pdf.info?.CreationDate,
          extractionMethod: 'ocr',
          ocrLanguage: 'swe+eng'
        }
      }
    }
    
    // Return whatever text we got
    return {
      text: text || ocrResult.text,
      format: 'pdf',
      pages: pdf.numpages || 0,
      confidence: 0.5,
      metadata: {
        pages: pdf.numpages,
        producedBy: pdf.info?.Producer || 'Unknown',
        createdAt: pdf.info?.CreationDate,
        extractionMethod: 'mixed',
        warning: 'Limited text extraction - document may be image-based'
      }
    }
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw error
  }
}

/**
 * Extract text from PDF using OCR (for scanned documents)
 */
async function extractTextWithOCR(pdfBuffer: Buffer, pageCount: number): Promise<{ text: string; confidence: number }> {
  try {
    // Convert PDF pages to images using pdf-to-png-converter
    const { pdfToPng } = await import('pdf-to-png-converter')
    
    // Convert first few pages (limit to avoid timeout)
    const maxPages = Math.min(pageCount, 5)
    const pngPages = await pdfToPng(pdfBuffer, {
      disableFontFace: true,
      useSystemFonts: true,
      viewportScale: 2.0, // Higher resolution for better OCR
      pagesToProcess: Array.from({ length: maxPages }, (_, i) => i + 1)
    })
    
    let fullText = ''
    let totalConfidence = 0
    let processedPages = 0
    
    // Process each page with Tesseract OCR
    for (const page of pngPages) {
      try {
        console.log(`[OCR] Processing page ${page.pageNumber}...`)
        
        const result = await Tesseract.recognize(
          page.content, // PNG buffer
          'swe+eng', // Swedish + English language
          {
            logger: () => {} // Suppress logging
          }
        )
        
        if (result.data.text) {
          fullText += `\n--- Sida ${page.pageNumber} ---\n${result.data.text}`
          totalConfidence += result.data.confidence
          processedPages++
        }
      } catch (pageError) {
        console.error(`[OCR] Error processing page ${page.pageNumber}:`, pageError)
      }
    }
    
    const avgConfidence = processedPages > 0 ? totalConfidence / processedPages / 100 : 0
    
    console.log(`[OCR] Completed: ${processedPages} pages, avg confidence: ${(avgConfidence * 100).toFixed(1)}%`)
    
    return {
      text: fullText.trim(),
      confidence: Math.max(0.6, avgConfidence) // Minimum 60% confidence for OCR
    }
  } catch (error) {
    console.error('[OCR] Failed to extract text with OCR:', error)
    return { text: '', confidence: 0 }
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
 * Extract text from image files using OCR
 */
async function extractFromImage(buffer: Buffer, fileName: string): Promise<DocumentExtractionResult> {
  try {
    console.log(`[OCR] Processing image: ${fileName}`)
    
    const result = await Tesseract.recognize(
      buffer,
      'swe+eng', // Swedish + English
      {
        logger: () => {} // Suppress verbose logging
      }
    )
    
    const text = result.data.text || ''
    const confidence = result.data.confidence / 100
    
    console.log(`[OCR] Image processed: ${text.length} chars, confidence: ${(confidence * 100).toFixed(1)}%`)
    
    return {
      text,
      format: 'image',
      confidence: Math.max(0.6, confidence),
      metadata: {
        extractionMethod: 'ocr',
        ocrLanguage: 'swe+eng',
        originalFileName: fileName
      }
    }
  } catch (error) {
    console.error('[OCR] Image extraction error:', error)
    throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
