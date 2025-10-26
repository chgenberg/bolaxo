'use client'

import { useState, useEffect } from 'react'
import { Bell, X, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Notification {
  id: string
  subject: string
  content: string
  createdAt: string
  read: boolean
  listingId?: string
}

export default function NotificationCenter() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch notifications
  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?userId=${user.id}&unreadOnly=false`)
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
          setUnreadCount(data.unreadCount || 0)
        } else if (response.status === 401) {
          console.log('User not authenticated for notifications')
          setNotifications([])
          setUnreadCount(0)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setNotifications([])
      }
    }

    fetchNotifications()

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, notificationIds })
      })

      if (response.ok) {
        setNotifications(notifications.map(n => 
          notificationIds.includes(n.id) ? { ...n, read: true } : n
        ))
        setUnreadCount(Math.max(0, unreadCount - notificationIds.length))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  if (!user) return null

  return (
    <>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-blue-900 transition-colors rounded-lg hover:bg-blue-50"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-blue-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-20 right-4 z-50 w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Meddelanden
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-blue-800 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Inga meddelanden än</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-6 py-4 border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead([notification.id])}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-900 rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notification.subject.replace(/^\[.*?\]\s/, '')}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => markAsRead(notifications.filter(n => !n.read).map(n => n.id))}
                  className="text-sm text-blue-900 font-medium hover:underline flex items-center gap-1"
                >
                  Markera alla som lästa
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

function formatTime(dateString: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just nu'
  if (diffMins < 60) return `${diffMins}m sedan`
  if (diffHours < 24) return `${diffHours}h sedan`
  if (diffDays < 7) return `${diffDays}d sedan`
  
  return date.toLocaleDateString('sv-SE')
}
