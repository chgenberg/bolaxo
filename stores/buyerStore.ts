import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type MatchStatus =
  | 'saved'
  | 'unsaved'
  | 'invite_sent'
  | 'nda_signed'
  | 'dd_start'

interface MatchEvent {
  listingId: string
  status: MatchStatus
  note?: string
  timestamp: string
}

interface BuyerStore {
  savedObjects: string[]
  ndaSignedObjects: string[]
  matchEvents: MatchEvent[]
  toggleSaved: (objectId: string) => void
  signNDA: (objectId: string) => void
  logMatchEvent: (listingId: string, status: MatchStatus, note?: string) => void
  getLatestStatus: (objectId: string) => MatchEvent | undefined
  hasNDA: (objectId: string) => boolean
}

export const useBuyerStore = create<BuyerStore>()(
  persist(
    (set, get) => ({
      savedObjects: [],
      ndaSignedObjects: [],
      matchEvents: [],
      
      logMatchEvent: (objectId: string, status: MatchStatus, note?: string) => {
        set((state) => ({
          matchEvents: [
            ...state.matchEvents,
            {
              listingId: objectId,
              status,
              note,
              timestamp: new Date().toISOString()
            }
          ]
        }))
      },
      
      toggleSaved: (objectId: string) => {
        set((state) => {
          const alreadySaved = state.savedObjects.includes(objectId)
          const updatedSaved = alreadySaved
            ? state.savedObjects.filter((id) => id !== objectId)
            : [...state.savedObjects, objectId]

          return {
            savedObjects: updatedSaved,
            matchEvents: [
              ...state.matchEvents,
              {
                listingId: objectId,
                status: alreadySaved ? 'unsaved' : 'saved',
                timestamp: new Date().toISOString()
              }
            ]
          }
        })
      },
      
      signNDA: (objectId: string) => {
        set((state) => {
          const alreadySigned = state.ndaSignedObjects.includes(objectId)
          if (alreadySigned) {
            return state
          }

          return {
            ndaSignedObjects: [...state.ndaSignedObjects, objectId],
            matchEvents: [
              ...state.matchEvents,
              {
                listingId: objectId,
                status: 'nda_signed',
                timestamp: new Date().toISOString()
              }
            ]
          }
        })
      },
      
      getLatestStatus: (objectId: string) => {
        const events = get().matchEvents
        for (let i = events.length - 1; i >= 0; i--) {
          if (events[i].listingId === objectId) return events[i]
        }
        return undefined
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

