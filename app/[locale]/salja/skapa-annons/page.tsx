'use client'

import ListingWizard from '@/components/ListingWizard'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function SkapaAnnonsPage() {
  const router = useRouter()
  const locale = useLocale()

  const handleClose = () => {
    router.push(`/${locale}/salja`)
  }

  return <ListingWizard onClose={handleClose} />
}

