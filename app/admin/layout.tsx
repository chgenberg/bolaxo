import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trestor Group Admin Dashboard',
  description: 'Administratörsportal för Trestor Group',
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

