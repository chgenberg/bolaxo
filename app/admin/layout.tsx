import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bolaxo Admin Dashboard',
  description: 'Administratörsportal för Bolaxo',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}

