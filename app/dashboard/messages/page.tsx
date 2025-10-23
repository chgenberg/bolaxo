'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { MessageSquare, Send, Paperclip, Search, Circle, CheckCheck, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getMessages, sendMessage, markMessagesRead, getListingById, getUserById } from '@/lib/api-client'

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [inbox, setInbox] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const mockConversations = [
    {
      id: 'conv-001',
      contactName: 'Anna Lindberg',
      contactCompany: 'Tech Ventures AB',
      listing: 'SaaS-bolag med ARR 8 MSEK',
      lastMessage: 'Tack för informationen! Vi skulle gärna se mer detaljerad...',
      lastMessageTime: '14:32',
      unread: 2,
      status: 'online'
    },
    {
      id: 'conv-002',
      contactName: 'Johan Andersson',
      contactCompany: 'Investment Nord AB',
      listing: 'E-handelsföretag i Stockholm',
      lastMessage: 'Kan vi boka ett möte nästa vecka?',
      lastMessageTime: 'Igår',
      unread: 0,
      status: 'offline'
    },
    {
      id: 'conv-003',
      contactName: 'Maria Eriksson',
      contactCompany: 'Nordic Capital Partners',
      listing: 'E-handelsföretag i Stockholm',
      lastMessage: 'Vi har granskat materialet och har några frågor...',
      lastMessageTime: 'Ons',
      unread: 1,
      status: 'offline'
    }
  ]

  const mockMessages = [
    {
      id: 'msg-001',
      sender: 'Anna Lindberg',
      content: 'Hej! Vi har granskat NDA och är mycket intresserade av att gå vidare.',
      timestamp: '2024-06-20 09:15',
      sent: false,
      read: true
    },
    {
      id: 'msg-002',
      sender: 'Du',
      content: 'Hej Anna! Vad roligt att höra. Jag skickar över mer detaljerad information inom kort.',
      timestamp: '2024-06-20 09:45',
      sent: true,
      read: true
    },
    {
      id: 'msg-003',
      sender: 'Anna Lindberg',
      content: 'Perfekt! Vi är särskilt intresserade av er tekniska plattform och tillväxtpotential.',
      timestamp: '2024-06-20 10:30',
      sent: false,
      read: true
    },
    {
      id: 'msg-004',
      sender: 'Du',
      content: 'Jag har nu laddat upp teknisk dokumentation och tillväxtprognos i datarum. Du har fått tillgång.',
      timestamp: '2024-06-20 11:00',
      sent: true,
      read: true
    },
    {
      id: 'msg-005',
      sender: 'Anna Lindberg',
      content: 'Tack för informationen! Vi skulle gärna se mer detaljerad finansiell historik för de senaste 3 åren.',
      timestamp: '2024-06-20 14:32',
      sent: false,
      read: false
    }
  ]

  const selectedConv = mockConversations.find(c => c.id === selectedConversation)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      try {
        const res = await getMessages({ userId: user.id })
        setInbox(res.messages)
        // Autoselect most recent conversation by peer
        if (res.messages.length > 0) {
          const last = res.messages[res.messages.length - 1]
          setSelectedConversation(`${last.listingId}::${last.senderId === user.id ? last.recipientId : last.senderId}`)
        }
      } catch (e) {
        // fallback keeps mock
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Conversations list */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-gray" />
              <input
                type="text"
                placeholder="Sök konversationer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {(inbox.length ? groupConversations(inbox, user?.id) : mockConversations).map((conv: any) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedConversation === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-text-dark">{conv.contactName}</h3>
                    {conv.status === 'online' && (
                      <Circle className="w-2 h-2 text-green-500 fill-current" />
                    )}
                  </div>
                  <span className="text-xs text-text-gray">{conv.lastMessageTime}</span>
                </div>
                <p className="text-xs text-text-gray mb-1">{conv.contactCompany}</p>
                <p className="text-xs text-primary-blue mb-2">{conv.listing}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text-gray truncate flex-1">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="ml-2 bg-primary-blue text-white text-xs rounded-full px-2 py-0.5">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-text-dark">{selectedConv?.contactName}</h2>
                <p className="text-sm text-text-gray">{selectedConv?.contactCompany} • {selectedConv?.listing}</p>
              </div>
              <button className="text-sm text-primary-blue hover:underline">
                Visa köparprofil
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(inbox.length ? filterByConversation(inbox, selectedConversation, user?.id) : mockMessages).map((message: any) => (
              <div
                key={message.id}
                className={`flex ${(message.senderId === user?.id || message.sent) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${(message.senderId === user?.id || message.sent) ? 'text-right' : 'text-left'}`}>
                  <div className={`rounded-lg px-4 py-2 ${
                    (message.senderId === user?.id || message.sent) 
                      ? 'bg-primary-blue text-white' 
                      : 'bg-gray-100 text-text-dark'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-text-gray">
                      {new Date(message.createdAt || message.timestamp).toLocaleString('sv-SE')}
                    </span>
                    {(message.senderId === user?.id || message.sent) && (
                      message.read ? (
                        <CheckCheck className="w-3 h-3 text-primary-blue" />
                      ) : (
                        <Clock className="w-3 h-3 text-text-gray" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-text-gray" />
              </button>
              <div className="flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Skriv ett meddelande..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  rows={1}
                />
              </div>
              <button 
                className="p-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={async () => {
                  if (!user || !messageText.trim()) return
                  const [listingId, peerId] = (selectedConversation || '').split('::')
                  if (!listingId || !peerId) return
                  try {
                    await sendMessage({ listingId, senderId: user.id, recipientId: peerId, content: messageText.trim() })
                    setMessageText('')
                    const res = await getMessages({ userId: user.id, listingId, peerId })
                    setInbox(res.messages)
                  } catch (e) {}
                }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-text-gray">
              <button className="hover:text-primary-blue">Snabbsvar</button>
              <button className="hover:text-primary-blue">Mall</button>
              <button className="hover:text-primary-blue">Schemalägg</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helpers to transform raw messages into conversation list
async function enrichConversationMeta(listingId: string, peerId: string) {
  try {
    const [listing, peer] = await Promise.all([
      getListingById(listingId),
      getUserById(peerId)
    ])
    return {
      listingTitle: listing.anonymousTitle || listing.companyName || 'Objekt',
      peerName: peer.user.name || peer.user.email,
      peerCompany: peer.user.companyName || '',
    }
  } catch {
    return { listingTitle: 'Objekt', peerName: 'Kontakt', peerCompany: '' }
  }
}

function groupConversations(messages: any[], userId?: string | null) {
  const map = new Map<string, any>()
  for (const m of messages) {
    const peerId = m.senderId === userId ? m.recipientId : m.senderId
    const id = `${m.listingId}::${peerId}`
    const existing = map.get(id)
    const lastTime = new Date(m.createdAt).toLocaleDateString('sv-SE')
    map.set(id, {
      id,
      contactName: m.peerName || 'Kontakt',
      contactCompany: m.peerCompany || '',
      listing: m.listingTitle || 'Objekt',
      lastMessage: m.content,
      lastMessageTime: lastTime,
      unread: existing ? existing.unread : (m.read ? 0 : 1),
      status: 'offline',
    })
  }
  return Array.from(map.values()).reverse()
}

function filterByConversation(messages: any[], conversationId: string | null, userId?: string | null) {
  if (!conversationId) return []
  const [listingId, peerId] = conversationId.split('::')
  return messages.filter(m => m.listingId === listingId && (m.senderId === peerId || m.recipientId === peerId))
}
