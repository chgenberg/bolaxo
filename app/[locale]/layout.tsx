import { redirect } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Redirect root to default locale (sv)
  redirect('/sv')
}