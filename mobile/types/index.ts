// Types shared between web and mobile
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'seller' | 'buyer' | 'broker';
  avatarUrl?: string;
}

export interface Listing {
  id: string;
  companyName: string;
  anonymousTitle: string;
  industry: string;
  region: string;
  location?: string;
  revenue: number;
  revenueRange?: string;
  priceMin: number;
  priceMax: number;
  employees?: number;
  status: 'draft' | 'active' | 'paused' | 'sold';
  views: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerProfile {
  userId: string;
  preferredRegions: string[];
  preferredIndustries: string[];
  priceMin?: number;
  priceMax?: number;
  revenueMin?: number;
  revenueMax?: number;
  investmentExperience?: string;
  financingReady: boolean;
  timeframe?: string;
}

export interface NDARequest {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'approved' | 'rejected' | 'signed';
  message?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  signedAt?: string;
}

export interface Message {
  id: string;
  listingId: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Match {
  id: string;
  listingId: string;
  buyerId: string;
  matchScore: number;
  listingTitle: string;
  createdAt: string;
}

