/**
 * Helper functions for checking user roles
 * Supports both single roles (e.g., "seller") and multiple roles (e.g., "seller,buyer")
 */

export function hasRole(userRole: string, roleToCheck: string): boolean {
  if (!userRole) return false
  // Split by comma and check if role exists
  const roles = userRole.split(',').map(r => r.trim())
  return roles.includes(roleToCheck)
}

export function isSeller(userRole: string): boolean {
  return hasRole(userRole, 'seller')
}

export function isBuyer(userRole: string): boolean {
  return hasRole(userRole, 'buyer')
}

export function isBroker(userRole: string): boolean {
  return hasRole(userRole, 'broker')
}

export function isAdmin(userRole: string): boolean {
  return hasRole(userRole, 'admin')
}

