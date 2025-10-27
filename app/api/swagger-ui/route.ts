import { NextRequest, NextResponse } from 'next/server'
import { generateSwaggerHTML } from '@/app/lib/swagger'

export async function GET(request: NextRequest) {
  return new NextResponse(generateSwaggerHTML(), {
    headers: {
      'Content-Type': 'text/html'
    }
  })
}
