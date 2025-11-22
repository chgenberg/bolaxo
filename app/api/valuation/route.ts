export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
}

export { GET, POST } from './handler'
