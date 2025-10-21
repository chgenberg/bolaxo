import { create } from 'zustand'

export interface BuyerPreferences {
  regions: string[]
  industries: string[]
  revenueMin: string
  revenueMax: string
  ebitdaMin: string
  ebitdaMax: string
  buyerType: 'operational' | 'financial' | ''
  emailAlerts: boolean
}

export interface BuyerProfile {
  verified: boolean
  bankIdVerified: boolean
  linkedInUrl: string
  companyInfo: string
  createdAt: Date | null
}

interface BuyerStore {
  preferences: BuyerPreferences
  profile: BuyerProfile
  savedObjects: string[]
  compareList: string[]
  shortlist: string[]
  ndaSignedObjects: string[]
  updatePreferences: (prefs: Partial<BuyerPreferences>) => void
  updateProfile: (profile: Partial<BuyerProfile>) => void
  toggleSaved: (objectId: string) => void
  toggleCompare: (objectId: string) => void
  toggleShortlist: (objectId: string) => void
  signNDA: (objectId: string) => void
  clearCompare: () => void
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
}

const initialPreferences: BuyerPreferences = {
  regions: [],
  industries: [],
  revenueMin: '',
  revenueMax: '',
  ebitdaMin: '',
  ebitdaMax: '',
  buyerType: '',
  emailAlerts: true,
}

const initialProfile: BuyerProfile = {
  verified: false,
  bankIdVerified: false,
  linkedInUrl: '',
  companyInfo: '',
  createdAt: null,
}

export const useBuyerStore = create<BuyerStore>((set, get) => ({
  preferences: initialPreferences,
  profile: initialProfile,
  savedObjects: [],
  compareList: [],
  shortlist: [],
  ndaSignedObjects: [],

  updatePreferences: (prefs) => {
    set((state) => ({
      preferences: { ...state.preferences, ...prefs }
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  updateProfile: (profile) => {
    set((state) => ({
      profile: { ...state.profile, ...profile }
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  toggleSaved: (objectId) => {
    set((state) => ({
      savedObjects: state.savedObjects.includes(objectId)
        ? state.savedObjects.filter(id => id !== objectId)
        : [...state.savedObjects, objectId]
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  toggleCompare: (objectId) => {
    set((state) => {
      const inList = state.compareList.includes(objectId)
      const newList = inList
        ? state.compareList.filter(id => id !== objectId)
        : state.compareList.length < 4
          ? [...state.compareList, objectId]
          : state.compareList
      return { compareList: newList }
    })
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  toggleShortlist: (objectId) => {
    set((state) => ({
      shortlist: state.shortlist.includes(objectId)
        ? state.shortlist.filter(id => id !== objectId)
        : [...state.shortlist, objectId]
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  signNDA: (objectId) => {
    set((state) => ({
      ndaSignedObjects: [...state.ndaSignedObjects, objectId]
    }))
    setTimeout(() => get().saveToLocalStorage(), 100)
  },

  clearCompare: () => set({ compareList: [] }),

  saveToLocalStorage: () => {
    const { preferences, profile, savedObjects, compareList, shortlist, ndaSignedObjects } = get()
    if (typeof window !== 'undefined') {
      localStorage.setItem('bolagsportalen_buyer', JSON.stringify({
        preferences,
        profile,
        savedObjects,
        compareList,
        shortlist,
        ndaSignedObjects,
      }))
    }
  },

  loadFromLocalStorage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bolagsportalen_buyer')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          set(data)
        } catch (e) {
          console.error('Failed to load buyer data', e)
        }
      }
    }
  },
}))

