import { redirect } from 'next/navigation'

// Root page - redirect to default locale
// Middleware should handle this, but this is a fallback
export default function RootPage() {
  redirect('/sv')
}
