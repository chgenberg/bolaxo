import { create } from 'zustand'

export type UserRole = 'seller' | 'broker' | 'buyer'
export type PaymentMethod = 'card' | 'invoice'
export type PlanType = 'basic' | 'featured' | 'premium' | 'broker-pro' | 'broker-premium'
export type BillingPeriod = 'monthly' | 'until-sold' | 'yearly'

export interface User {
  email: string
  role: UserRole
  verified: boolean
  bankIdVerified: boolean
  name: string
  phone: string
  companyName?: string
  orgNumber?: string
  region?: string
  
  // Broker specific
  brokerWebsite?: string
  
  // Buyer specific
  buyerType?: 'operational' | 'financial'
}

export interface CustomerDetails {
  companyName: string
  orgNumber: string
  invoiceAddress: string
  reference?: string
  peppolId?: string
  email: string
}

export interface Subscription {
  id: string
  plan: PlanType
  billingPeriod: BillingPeriod
  status: 'active' | 'paused' | 'cancelled'
  price: number
  startDate: Date
  nextBillingDate?: Date
  paymentMethod: PaymentMethod
  gracePeriodEnd?: Date
}

export interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  vat: number
  total: number
  dueDate: Date
  status: 'pending' | 'paid' | 'overdue'
  pdfUrl?: string
  ocr: string
}

interface PaymentStore {
  user: User | null
  customerDetails: CustomerDetails | null
  selectedPlan: PlanType | null
  selectedPeriod: BillingPeriod | null
  subscription: Subscription | null
  invoices: Invoice[]
  
  setUser: (user: User) => void
  setCustomerDetails: (details: CustomerDetails) => void
  selectPlan: (plan: PlanType, period: BillingPeriod) => void
  createSubscription: (paymentMethod: PaymentMethod) => void
  updateSubscriptionStatus: (status: 'active' | 'paused' | 'cancelled') => void
  addInvoice: (invoice: Invoice) => void
  markInvoicePaid: (invoiceId: string) => void
  
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  user: null,
  customerDetails: null,
  selectedPlan: null,
  selectedPeriod: null,
  subscription: null,
  invoices: [],

  setUser: (user) => {
    set({ user })
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  setCustomerDetails: (details) => {
    set({ customerDetails: details })
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  selectPlan: (plan, period) => {
    set({ selectedPlan: plan, selectedPeriod: period })
  },

  createSubscription: (paymentMethod) => {
    const { selectedPlan, selectedPeriod } = get()
    if (!selectedPlan || !selectedPeriod) return

    const prices: Record<PlanType, number> = {
      'basic': 4995,
      'featured': 9995,
      'premium': 19995,
      'broker-pro': 9995,
      'broker-premium': 24995,
    }

    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      plan: selectedPlan,
      billingPeriod: selectedPeriod,
      status: 'active',
      price: prices[selectedPlan],
      startDate: new Date(),
      paymentMethod,
      nextBillingDate: selectedPeriod === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : undefined,
    }

    set({ subscription })
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  updateSubscriptionStatus: (status) => {
    set((state) => ({
      subscription: state.subscription 
        ? { ...state.subscription, status }
        : null
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  addInvoice: (invoice) => {
    set((state) => ({
      invoices: [...state.invoices, invoice]
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  markInvoicePaid: (invoiceId) => {
    set((state) => ({
      invoices: state.invoices.map(inv =>
        inv.id === invoiceId ? { ...inv, status: 'paid' as const } : inv
      )
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  saveToLocalStorage: () => {
    const { user, customerDetails, subscription, invoices } = get()
    if (typeof window !== 'undefined') {
      localStorage.setItem('bolagsportalen_payment', JSON.stringify({
        user,
        customerDetails,
        subscription,
        invoices,
      }))
    }
  },

  loadFromLocalStorage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bolagsportalen_payment')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          set(data)
        } catch (e) {
          console.error('Failed to load payment data', e)
        }
      }
    }
  },
}))

