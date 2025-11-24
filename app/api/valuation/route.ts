export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { GET: HandlerGET } = await import('./handler')
  return HandlerGET(request)
}

export async function POST(request: Request) {
  const { POST: HandlerPOST } = await import('./handler')
  return HandlerPOST(request)
}
