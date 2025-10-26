import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const adminToken = request.cookies.get('adminToken')?.value
  
  console.log('🔍 [TEST] Cookie check:')
  console.log('adminToken present:', !!adminToken)
  console.log('adminToken value:', adminToken ? `${adminToken.substring(0, 20)}...` : 'NOT FOUND')
  console.log('All cookies:', Array.from(request.cookies.getSetCookie?.() || []))
  
  return NextResponse.json({
    adminToken: !!adminToken,
    tokenValue: adminToken ? `${adminToken.substring(0, 20)}...` : null,
    message: adminToken ? '✅ Cookie found!' : '❌ Cookie not found'
  })
}
