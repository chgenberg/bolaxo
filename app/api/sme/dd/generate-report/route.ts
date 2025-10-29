import { NextRequest, NextResponse } from 'next/server'
import { generateDDReportPdf } from '@/lib/dd-report-generator'
import type { DDReportData } from '@/lib/dd-report-generator'

export async function POST(req: NextRequest) {
  try {
    const { documents, ddData } = await req.json()

    if (!documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'No documents provided' },
        { status: 400 }
      )
    }

    console.log('Documents received for DD analysis:', documents.length)

    // TODO: Analyze documents with OpenAI when document specs arrive
    // Step 1: Call extractDDReport(documents)
    // Step 2: Merge results with ddData

    // For now: Generate report with provided data
    const reportData: DDReportData = {
      companyName: ddData.companyName,
      reportDate: new Date().toISOString().split('T')[0],
      preparedBy: ddData.preparedBy || 'Bolaxo Due Diligence Team',
      executiveSummary: ddData.executiveSummary || 'Executive summary will be generated after document analysis',
      financialFindings: ddData.financialFindings || [],
      operationalFindings: ddData.operationalFindings || [],
      legalFindings: ddData.legalFindings || [],
      riskSummary: ddData.riskSummary || {
        overallRisk: 'medium',
        description: 'Risk assessment pending document analysis'
      }
    }

    console.log('Generating DD Report PDF...')
    const pdfBuffer = await generateDDReportPdf(reportData)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="DD-Report-${reportData.companyName}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating DD report:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate DD report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
