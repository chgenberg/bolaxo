import { NextRequest, NextResponse } from 'next/server'
import { swaggerConfig } from '@/app/lib/swagger'

export async function GET(request: NextRequest) {
  return NextResponse.json(swaggerConfig)
}
