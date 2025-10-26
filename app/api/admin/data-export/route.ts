import { NextRequest, NextResponse } from 'next/server'

// Data Export/Import API

const mockExportHistor = [
  {
    id: 'export-1',
    dataType: 'users',
    format: 'csv',
    recordCount: 3456,
    fileSize: 5.2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: 'export-2',
    dataType: 'listings',
    format: 'json',
    recordCount: 1567,
    fileSize: 8.9,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'completed'
  }
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      exports: mockExportHistor,
      availableDataTypes: ['users', 'listings', 'transactions', 'payments', 'messages', 'ndas'],
      availableFormats: ['csv', 'json', 'excel']
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dataType, format, filters } = body

    const newExport = {
      id: `export-${Date.now()}`,
      dataType,
      format,
      recordCount: Math.floor(Math.random() * 5000) + 100,
      fileSize: (Math.random() * 15 + 0.5).toFixed(1),
      createdAt: new Date(),
      status: 'completed'
    }

    mockExportHistor.push(newExport)

    return NextResponse.json({
      success: true,
      message: 'Export created',
      data: newExport,
      downloadUrl: `/api/admin/data-export/${newExport.id}/download`
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
