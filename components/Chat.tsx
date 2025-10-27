'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Check, CheckCheck, MoreVertical, Phone, Video, Info } from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  read: boolean
  createdAt: string
  sender: {
    id: string
    name: string
    email: string
    role: string
  }
  recipient: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface ChatProps {
  currentUserId: string
  peerId: string
  peerName: string
  peerRole: string
  listingId?: string
  listingTitle?: string
}

export default function Chat({ currentUserId, peerId, peerName, peerRole, listingId, listingTitle }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams({
        peerId,
        page: page.toString(),
        limit: '50'
      })
      if (listingId) params.append('listingId', listingId)

      const response = await fetch(`/api/messages?${params}`, {
        headers: {
          'x-user-id': currentUserId
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        setHasMore(data.pagination.hasMore)
        setUnreadCount(data.unreadCount)
        
        // Mark messages as read
        const unreadIds = data.messages
          .filter((m: Message) => m.recipientId === currentUserId && !m.read)
          .map((m: Message) => m.id)
        
        if (unreadIds.length > 0) {
          await markAsRead(unreadIds)
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark messages as read
  const markAsRead = async (ids: string[]) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId
        },
        body: JSON.stringify({ ids })
      })
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId
        },
        body: JSON.stringify({
          recipientId: peerId,
          content: newMessage,
          listingId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages([...messages, data.message])
        setNewMessage('')
        scrollToBottom()
      } else if (response.status === 403) {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 24) {
      return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    } else if (hours < 48) {
      return 'Igår ' + date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
    }
  }

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString('sv-SE')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return groups
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [page])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary-navy text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            {peerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{peerName}</h3>
            <p className="text-xs text-white/70">
              {peerRole === 'seller' ? 'Säljare' : 'Köpare'}
              {listingTitle && ` • ${listingTitle}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-navy"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Inga meddelanden än</p>
            <p className="text-sm mt-2">Säg hej och börja konversationen!</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, groupedMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-xs text-gray-500 px-2">{date}</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              
              {/* Messages for this date */}
              {groupedMessages.map((message, index) => {
                const isOwn = message.senderId === currentUserId
                const showAvatar = index === 0 || 
                  groupedMessages[index - 1].senderId !== message.senderId
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwn && showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                        {message.sender.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!isOwn && !showAvatar && <div className="w-8" />}
                    
                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwn 
                            ? 'bg-primary-navy text-white' 
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                        {isOwn && (
                          message.read ? (
                            <CheckCheck className="w-3 h-3 text-primary-blue" />
                          ) : (
                            <Check className="w-3 h-3 text-gray-400" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv ett meddelande..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-navy"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-primary-navy text-white rounded-full hover:bg-primary-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
