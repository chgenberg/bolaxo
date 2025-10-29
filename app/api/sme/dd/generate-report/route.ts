import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDDFindingsFromDocuments } from '@/lib/dd-document-analyzer'
import { generateDDReportPDF, type DDPdfData } from '@/lib/dd-pdf-generator'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { listingId, buyerId, uploads, documentCategories } = body

    if (!listingId || !buyerId) {
      return NextResponse.json(
        { error: 'Missing listingId or buyerId' },
        { status: 400 }
      )
    }

    console.log('Starting DD report generation...')

    // Simulate document processing (in real app, would read from S3)
    const documents = [
      {
        category: 'financial_dd',
        content: 'Financial statements, revenue trends, cash flow analysis'
      },
      {
        category: 'legal_dd',
        content: 'Contracts, IP documentation, legal compliance'
      },
      {
        category: 'commercial_dd',
        content: 'Customer analysis, market position, competitive landscape'
      },
      {
        category: 'hr_dd',
        content: 'Organization structure, key personnel, retention risks'
      },
      {
        category: 'it_dd',
        content: 'IT systems, cybersecurity, data protection measures'
      },
      {
        category: 'tax_dd',
        content: 'Tax strategy, deductions, compliance history'
      },
      {
        category: 'environmental_dd',
        content: 'Environmental permits, compliance, pollution risks'
      }
    ]

    console.log('Analyzing documents with GPT...')
    // Generate findings using GPT
    const analysisResult = await generateDDFindingsFromDocuments(documents)

    // Categorize findings
    const financialFindings = analysisResult.findings.filter(f => f.category === 'Financial')
    const legalFindings = analysisResult.findings.filter(f => f.category === 'Legal')
    const commercialFindings = analysisResult.findings.filter(f => f.category === 'Commercial')
    const hrFindings = analysisResult.findings.filter(f => f.category === 'HR')
    const itFindings = analysisResult.findings.filter(f => f.category === 'IT')
    const taxFindings = analysisResult.findings.filter(f => f.category === 'Tax')
    const envFindings = analysisResult.findings.filter(f => f.category === 'Environmental')

    // Determine overall risk level
    const criticalCount = analysisResult.findings.filter(f => f.severity === 'Critical').length
    const highCount = analysisResult.findings.filter(f => f.severity === 'High').length
    
    let overallRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low'
    if (criticalCount > 0) overallRiskLevel = 'Critical'
    else if (criticalCount === 0 && highCount > 2) overallRiskLevel = 'High'
    else if (highCount > 0) overallRiskLevel = 'Medium'

    // Get top 3 critical/high findings
    const topRisks = analysisResult.findings
      .filter(f => f.severity === 'Critical' || f.severity === 'High')
      .slice(0, 3)
      .map(f => `${f.title} (${f.severity})`)

    // Create PDF data
    const pdfData: DDPdfData = {
      listingId,
      companyName: 'Målbolaget AB',
      companyOrgNumber: '556000-0000',
      buyerName: 'Köpare AB',
      ddTeamLead: 'DD Team',
      ddStartDate: new Date().toISOString(),
      ddCompletionDate: new Date().toISOString(),
      financialFindings: financialFindings.length > 0 ? financialFindings : undefined,
      legalFindings: legalFindings.length > 0 ? legalFindings : undefined,
      commercialFindings: commercialFindings.length > 0 ? commercialFindings : undefined,
      hrFindings: hrFindings.length > 0 ? hrFindings : undefined,
      itFindings: itFindings.length > 0 ? itFindings : undefined,
      taxFindings: taxFindings.length > 0 ? taxFindings : undefined,
      envFindings: envFindings.length > 0 ? envFindings : undefined,
      overallRiskLevel,
      dealRecommendation: analysisResult.dealRecommendation,
      topThreeRisks: topRisks.length > 0 ? topRisks : undefined
    }

    console.log('Generating PDF report...')
    // Generate PDF
    const pdfBuffer = await generateDDReportPDF(pdfData)

    // Save to database
    const reportId = uuidv4()
    
    console.log('Saving report to database...')
    // In real app, would save to database
    // For now, just return the report ID

    return NextResponse.json({
      success: true,
      reportId,
      status: 'completed',
      riskLevel: overallRiskLevel,
      findingsCount: analysisResult.findings.length,
      criticalCount,
      highCount,
      message: 'DD report generated successfully'
    })
  } catch (error) {
    console.error('DD report generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate DD report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
