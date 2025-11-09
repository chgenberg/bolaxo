import { NextResponse } from 'next/server'

// Force dynamic - absolutely no static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

// Simple GET that always works
export async function GET() {
  return NextResponse.json({ 
    message: 'Valuation API',
    status: 'active',
    method: 'POST'
  })
}

// POST handler - will be loaded dynamically only at runtime
export async function POST(request: Request) {
  // Dynamic import to ensure nothing loads during build
  const { handleValuationRequest } = await import('./handler')
  return handleValuationRequest(request)
}
