import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const CheckoutClient = dynamic(() => import('./CheckoutClient'), { ssr: false })

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Laddar...</div>}>
      <CheckoutClient />
    </Suspense>
  )
}
