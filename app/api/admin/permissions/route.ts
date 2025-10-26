import { NextRequest, NextResponse } from 'next/server'

// Role-Based Permissions API

const defaultPermissions = {
  super_admin: {
    users: ['view', 'create', 'edit', 'delete', 'bulk_actions', 'export'],
    listings: ['view', 'create', 'edit', 'delete', 'bulk_actions', 'export'],
    transactions: ['view', 'edit', 'delete', 'bulk_actions', 'export'],
    payments: ['view', 'edit', 'delete', 'bulk_actions', 'export'],
    financial: ['view', 'export', 'reports'],
    moderation: ['view', 'approve', 'reject', 'dismiss', 'bulk_actions'],
    audit: ['view', 'export'],
    analytics: ['view', 'export', 'reports'],
    sellers: ['view', 'edit', 'contact'],
    buyers: ['view', 'edit', 'contact'],
    fraud: ['view', 'investigate', 'flag', 'suspend'],
    ndas: ['view', 'send_reminder', 'extend', 'resend'],
    emails: ['view', 'resend', 'unsubscribe'],
    integrations: ['view', 'test', 'configure'],
    messages: ['view', 'approve', 'block', 'delete'],
    tickets: ['view', 'create', 'respond', 'assign', 'close'],
    reports: ['view', 'generate', 'download', 'delete'],
    admins: ['view', 'create', 'edit', 'delete', 'assign_roles'],
    settings: ['view', 'edit', 'configure']
  },
  admin: {
    users: ['view', 'edit', 'bulk_actions', 'export'],
    listings: ['view', 'edit', 'bulk_actions', 'export'],
    transactions: ['view', 'edit', 'bulk_actions', 'export'],
    payments: ['view', 'edit', 'bulk_actions', 'export'],
    financial: ['view', 'export'],
    moderation: ['view', 'approve', 'reject', 'dismiss', 'bulk_actions'],
    audit: ['view', 'export'],
    analytics: ['view', 'export'],
    sellers: ['view', 'edit'],
    buyers: ['view', 'edit'],
    fraud: ['view', 'investigate', 'flag'],
    ndas: ['view', 'send_reminder', 'extend'],
    emails: ['view', 'resend'],
    integrations: ['view'],
    messages: ['view', 'approve', 'block'],
    tickets: ['view', 'respond', 'assign'],
    reports: ['view', 'generate', 'download'],
    admins: ['view']
  },
  moderator: {
    listings: ['view', 'edit'],
    moderation: ['view', 'approve', 'reject', 'dismiss'],
    audit: ['view'],
    fraud: ['view'],
    messages: ['view', 'approve', 'block'],
    tickets: ['view', 'respond']
  },
  analyst: {
    users: ['view', 'export'],
    listings: ['view', 'export'],
    transactions: ['view', 'export'],
    payments: ['view', 'export'],
    financial: ['view', 'export', 'reports'],
    analytics: ['view', 'export', 'reports'],
    sellers: ['view'],
    buyers: ['view'],
    fraud: ['view'],
    reports: ['view', 'generate', 'download']
  },
  support: {
    users: ['view'],
    tickets: ['view', 'create', 'respond', 'assign', 'close'],
    messages: ['view'],
    sellers: ['view'],
    buyers: ['view']
  }
}

const allModules = [
  'users', 'listings', 'transactions', 'payments', 'financial',
  'moderation', 'audit', 'analytics', 'sellers', 'buyers',
  'fraud', 'ndas', 'emails', 'integrations', 'messages',
  'tickets', 'reports', 'admins', 'settings'
]

const allActions = [
  'view', 'create', 'edit', 'delete', 'bulk_actions', 'export',
  'approve', 'reject', 'dismiss', 'investigate', 'flag', 'suspend',
  'send_reminder', 'extend', 'resend', 'unsubscribe', 'test',
  'configure', 'block', 'respond', 'assign', 'close', 'generate',
  'download', 'assign_roles', 'contact'
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')

    if (role && role in defaultPermissions) {
      return NextResponse.json({
        success: true,
        role,
        permissions: (defaultPermissions as any)[role],
        allModules,
        allActions
      })
    }

    return NextResponse.json({
      success: true,
      roles: Object.keys(defaultPermissions),
      permissions: defaultPermissions,
      allModules,
      allActions
    })
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, module, actions } = body

    if (!role || !module || !actions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update permissions in memory (in production, would save to DB)
    const rolePerms = (defaultPermissions as any)[role]
    if (!rolePerms) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    rolePerms[module] = actions

    return NextResponse.json({
      success: true,
      message: `Permissions updated for ${role} role`,
      role,
      module,
      actions,
      updatedPermissions: rolePerms
    })
  } catch (error) {
    console.error('Error updating permissions:', error)
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { newRole, permissions } = body

    if (!newRole || !permissions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Add new role in memory
    (defaultPermissions as any)[newRole] = permissions

    return NextResponse.json({
      success: true,
      message: `New role '${newRole}' created`,
      role: newRole,
      permissions
    })
  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 })
  }
}
