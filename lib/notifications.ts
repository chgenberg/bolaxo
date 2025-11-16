import { prisma } from '@/lib/prisma'

export type NotificationType = 'match' | 'nda' | 'message' | 'system'

interface NotificationPayload {
  userId?: string | null
  type: NotificationType
  title: string
  message: string
  listingId?: string | null
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  listingId
}: NotificationPayload) {
  if (!userId) return

  try {
    await prisma.message.create({
      data: {
        listingId: listingId || '',
        senderId: 'system',
        recipientId: userId,
        subject: `[${type.toUpperCase()}] ${title}`,
        content: message,
        read: false,
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

