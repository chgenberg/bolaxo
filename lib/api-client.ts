export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

export async function apiJSON<T>(url: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', body: any): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

// Messages
export async function getMessages(params: { userId: string; listingId?: string; peerId?: string }) {
  const q = new URLSearchParams()
  q.set('userId', params.userId)
  if (params.listingId) q.set('listingId', params.listingId)
  if (params.peerId) q.set('peerId', params.peerId)
  return apiGet<{ messages: any[] }>(`/api/messages?${q.toString()}`)
}

export async function sendMessage(payload: { listingId: string; senderId: string; recipientId: string; subject?: string; content: string }) {
  return apiJSON<{ message: any }>(`/api/messages`, 'POST', payload)
}

export async function markMessagesRead(ids: string[]) {
  return apiJSON<{ success: boolean }>(`/api/messages`, 'PATCH', { ids })
}

// NDA Requests
export async function listNDARequests(params: { listingId?: string; buyerId?: string; sellerId?: string; status?: string }) {
  const q = new URLSearchParams()
  if (params.listingId) q.set('listingId', params.listingId)
  if (params.buyerId) q.set('buyerId', params.buyerId)
  if (params.sellerId) q.set('sellerId', params.sellerId)
  if (params.status) q.set('status', params.status)
  return apiGet<{ requests: any[] }>(`/api/nda-requests?${q.toString()}`)
}

export async function createNDARequest(payload: { listingId: string; buyerId: string; sellerId: string; message?: string; buyerProfile?: any }) {
  return apiJSON<{ request: any }>(`/api/nda-requests`, 'POST', payload)
}

export async function updateNDAStatus(payload: { id: string; status: 'pending' | 'approved' | 'rejected' }) {
  return apiJSON<{ request: any }>(`/api/nda-requests`, 'PATCH', payload)
}

// Saved Listings
export async function getSavedListings(userId: string) {
  const q = new URLSearchParams()
  q.set('userId', userId)
  return apiGet<{ saved: { id: string; userId: string; listingId: string; notes?: string }[] }>(`/api/saved-listings?${q.toString()}`)
}

export async function saveListing(payload: { userId: string; listingId: string; notes?: string }) {
  return apiJSON<{ saved: any }>(`/api/saved-listings`, 'POST', payload)
}

export async function unsaveListing(userId: string, listingId: string) {
  const q = new URLSearchParams()
  q.set('userId', userId)
  q.set('listingId', listingId)
  const res = await fetch(`/api/saved-listings?${q.toString()}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// Listings
export async function getUserListings(params: { status?: string; userId?: string; industry?: string; location?: string; priceMin?: number; priceMax?: number }) {
  const q = new URLSearchParams()
  if (params.status) q.set('status', params.status)
  if (params.userId) q.set('userId', params.userId)
  if (params.industry) q.set('industry', params.industry)
  if (params.location) q.set('location', params.location)
  if (params.priceMin !== undefined) q.set('priceMin', String(params.priceMin))
  if (params.priceMax !== undefined) q.set('priceMax', String(params.priceMax))
  return apiGet<any[]>(`/api/listings?${q.toString()}`)
}

export async function getListingById(id: string) {
  return apiGet<any>(`/api/listings/${id}`)
}

// Buyer Profile
export async function getBuyerProfile(params: { userId?: string; email?: string }) {
  const q = new URLSearchParams()
  if (params.userId) q.set('userId', params.userId)
  if (params.email) q.set('email', params.email)
  return apiGet<{ profile: any | null; user: { id: string; email: string; name?: string; role: string } }>(`/api/buyer-profile?${q.toString()}`)
}

export async function saveBuyerProfile(payload: any) {
  return apiJSON<{ success: boolean; profile: any }>(`/api/buyer-profile`, 'POST', payload)
}
