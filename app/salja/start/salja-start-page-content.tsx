'use client'

import { useRouter } from 'next/navigation'
import ListingWizard from '@/components/ListingWizard'

export default function SaljaStartPageContent() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/salja')
  }

  return <ListingWizard onClose={handleClose} />
}

