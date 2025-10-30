/**
 * Launch Mode Configuration
 * Controls which features are visible/enabled during initial launch
 * Set LAUNCH_MODE to true to hide non-core features
 */

import type { UserRole } from '@/store/paymentStore'

export const LAUNCH_CONFIG = {
  // Set to true to enable launch mode (hide non-core features)
  LAUNCH_MODE: true,

  // Core features always visible
  VISIBLE_FEATURES: {
    VALUATION: true, // Gratis värdering för säljare
    SELLER_LISTINGS: true, // Annonser för säljare
    BROKER_LISTINGS: true, // Annonser för mäklare (NEW)
    BUYER_SEARCH: true, // Sök för köpare
    LOGIN_REGISTER: true, // Login/Register
    NDA: true, // NDA-process
    LOI: true, // Indikativt anbud
    TRANSACTION_BASICS: true, // Transaktion tracking
  },

  // Features to hide during launch (show "Coming Soon")
  COMING_SOON_FEATURES: {
    INVESTOR_MODE: true,
    ADMIN_PANEL: true,
    CHAT_MESSAGING: true,
    ADVANCED_ANALYTICS: true,
    TEAM_MANAGEMENT: true,
    DOCUMENT_AUTOMATION: true,
    PAYMENT_PROCESSING: true, // Initially no payment needed (all free)
    MARKETPLACE_PREMIUM: true, // Premium features
    API_INTEGRATION: true,
    WHITE_LABEL: true,
  },

  // Hide these roles from registration (empty = show all)
  HIDDEN_ROLES: [] as UserRole[],

  // Navigation items visibility
  NAVIGATION: {
    SHOW_FOR_MAKLARE: true, // Show broker section now
    SHOW_FOR_INVESTERARE: false,
    SHOW_BLOG: false,
    SHOW_ADMIN: false,
    SHOW_CHAT: false,
  },

  // Only show these dashboard sections
  ALLOWED_DASHBOARD_SECTIONS: [
    'listings', // Säljare & Mäklare: Mina annonser
    'deals', // Köpare: Mina affärer
    'saved', // Köpare: Sparade objekt
    'lois', // Säljare & Mäklare: Mottagna LOIs
    'messages', // Begränsad - bara för transaktioner
  ],

  // Free trial limits
  FREE_LIMITS: {
    SELLER_LISTINGS: 999, // Unlimited listings
    BROKER_LISTINGS: 999, // Unlimited listings for brokers
    SELLER_VALUATIONS: 999, // Unlimited valuations
    BUYER_SEARCHES: 999, // Unlimited searches
    BUYER_NDA_REQUESTS: 999, // Unlimited NDA requests
  },

  // Payment settings
  PAYMENTS: {
    ENABLED: false, // All features free during launch
    SELLER_LISTING_COST: 0,
    BROKER_LISTING_COST: 0,
    BUYER_SUBSCRIPTION: 0,
    TRANSACTION_FEE: 0,
  },
}

/**
 * Helper function to check if feature is available
 */
export function isFeatureAvailable(feature: keyof typeof LAUNCH_CONFIG.VISIBLE_FEATURES): boolean {
  if (!LAUNCH_CONFIG.LAUNCH_MODE) {
    return true // All features available if not in launch mode
  }
  return LAUNCH_CONFIG.VISIBLE_FEATURES[feature] ?? false
}

/**
 * Helper function to check if feature is coming soon
 */
export function isFeatureComingSoon(feature: keyof typeof LAUNCH_CONFIG.COMING_SOON_FEATURES): boolean {
  if (!LAUNCH_CONFIG.LAUNCH_MODE) {
    return false // Nothing is "coming soon" if not in launch mode
  }
  return LAUNCH_CONFIG.COMING_SOON_FEATURES[feature] ?? false
}
