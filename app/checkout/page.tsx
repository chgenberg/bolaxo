import { redirect } from 'next/navigation'

export default function CheckoutRedirect() {
  // Redirect non-locale route to default locale during SSR and at runtime
  redirect('/sv/checkout')
}

// Prevent static prerendering
export const dynamic = 'force-dynamic'
export const dynamicParams = true
