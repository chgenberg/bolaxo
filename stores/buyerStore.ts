import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BuyerStore {
  savedObjects: string[]
  ndaSignedObjects: string[]
  toggleSaved: (objectId: string) => void
  signNDA: (objectId: string) => void
  hasNDA: (objectId: string) => boolean
}

export const useBuyerStore = create<BuyerStore>()(
  persist(
    (set, get) => ({
      savedObjects: [],
      ndaSignedObjects: [],
      
      toggleSaved: (objectId: string) => {
        set((state) => ({
          savedObjects: state.savedObjects.includes(objectId)
            ? state.savedObjects.filter((id) => id !== objectId)
            : [...state.savedObjects, objectId]
        }))
      },
      
      signNDA: (objectId: string) => {
        set((state) => ({
          ndaSignedObjects: state.ndaSignedObjects.includes(objectId)
            ? state.ndaSignedObjects
            : [...state.ndaSignedObjects, objectId]
        }))
      },
      
      hasNDA: (objectId: string) => {
        return get().ndaSignedObjects.includes(objectId)
      }
    }),
    {
      name: 'buyer-storage',
    }
  )
)

