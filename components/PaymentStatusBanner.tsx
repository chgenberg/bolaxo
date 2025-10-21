'use client'

import Link from 'next/link'
import { Invoice } from '@/store/paymentStore'

interface PaymentStatusBannerProps {
  invoices: Invoice[]
}

export default function PaymentStatusBanner({ invoices }: PaymentStatusBannerProps) {
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue')
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending')
  
  const mostUrgent = overdueInvoices.length > 0 
    ? overdueInvoices[0] 
    : pendingInvoices.length > 0 
      ? pendingInvoices[0]
      : null

  if (!mostUrgent) return null

  const daysUntilDue = Math.ceil((mostUrgent.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDue < 0

  return (
    <div className={`sticky top-16 z-40 ${
      isOverdue 
        ? 'bg-red-500' 
        : daysUntilDue <= 3 
          ? 'bg-yellow-500'
          : 'bg-blue-500'
    } text-white py-3 px-4`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {isOverdue ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">
                Faktura förfallen! Betala för att undvika paus av tjänsten. 
                Förfallodatum: {mostUrgent.dueDate.toLocaleDateString('sv-SE')}
              </span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">
                Faktura att betala: {mostUrgent.total.toLocaleString('sv-SE')} kr. 
                Förfallodag: {mostUrgent.dueDate.toLocaleDateString('sv-SE')} ({Math.abs(daysUntilDue)} dagar kvar)
              </span>
            </>
          )}
        </div>
        <Link 
          href={`/kvitto/${mostUrgent.id}`} 
          className="bg-white text-primary-blue px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm"
        >
          Se faktura →
        </Link>
      </div>
    </div>
  )
}

