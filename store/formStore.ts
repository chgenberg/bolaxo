import { create } from 'zustand'

export interface FormData {
  // Step 1 - Grundinfo
  companyName: string
  category: string
  foundedYear: string
  employees: string
  location: string
  description: string
  foretagestyp: string
  ort: string
  omsattningIntervall: string
  antalAnstallda: string
  agarensRoll: string
  
  // Step 2 - Affärsdata
  omsattningAr1: string
  omsattningAr2: string
  omsattningAr3: string
  ebitda: string
  prisideMin: string
  prisideMax: string
  vadIngår: string
  
  // Step 3 - Styrkor & risker
  styrka1: string
  styrka2: string
  styrka3: string
  risk1: string
  risk2: string
  risk3: string
  varforSalja: string
  
  // Step 4 - Media
  anonymVisning: boolean
  logoUrl: string
  images: string[]
  
  // Step 5 - NDA
  ndaTemplate: string
  requireBankId: boolean
  
  // Step 6 - Paket
  selectedPackage: 'basic' | 'featured' | 'premium'
}

interface FormStore {
  formData: FormData
  currentStep: number
  lastSaved: Date | null
  updateField: (field: string, value: any) => void
  updateMultipleFields: (fields: Partial<FormData>) => void
  setCurrentStep: (step: number) => void
  resetForm: () => void
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
}

const initialFormData: FormData = {
  companyName: '',
  category: '',
  foundedYear: '',
  employees: '',
  location: '',
  description: '',
  foretagestyp: '',
  ort: '',
  omsattningIntervall: '',
  antalAnstallda: '',
  agarensRoll: '',
  omsattningAr1: '',
  omsattningAr2: '',
  omsattningAr3: '',
  ebitda: '',
  prisideMin: '',
  prisideMax: '',
  vadIngår: '',
  styrka1: '',
  styrka2: '',
  styrka3: '',
  risk1: '',
  risk2: '',
  risk3: '',
  varforSalja: '',
  anonymVisning: true,
  logoUrl: '',
  images: [],
  ndaTemplate: 'standard',
  requireBankId: true,
  selectedPackage: 'basic',
}

export const useFormStore = create<FormStore>((set, get) => ({
  formData: initialFormData,
  currentStep: 1,
  lastSaved: null,

  updateField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    }))
    // Auto-save after update
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  updateMultipleFields: (fields) => {
    set((state) => ({
      formData: { ...state.formData, ...fields }
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  resetForm: () => set({ formData: initialFormData, currentStep: 1, lastSaved: null }),

  saveToLocalStorage: () => {
    const { formData } = get()
    if (typeof window !== 'undefined') {
      localStorage.setItem('bolagsportalen_draft', JSON.stringify(formData))
      set({ lastSaved: new Date() })
    }
  },

  loadFromLocalStorage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bolagsportalen_draft')
      if (saved) {
        try {
          const parsedData = JSON.parse(saved)
          set({ formData: parsedData, lastSaved: new Date() })
        } catch (e) {
          console.error('Failed to load saved draft', e)
        }
      }
    }
  },
}))

