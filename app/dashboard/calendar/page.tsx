'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Calendar, Clock, MapPin, Video, Phone, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('week')

  const events = [
    {
      id: 'evt-001',
      title: 'DD-möte med Tech Innovations',
      date: '2024-06-20',
      time: '10:00',
      duration: '90 min',
      type: 'meeting',
      location: 'Teams',
      attendees: ['Erik Johansson', 'Anna Lindberg'],
      color: 'bg-blue-100 border-blue-300 text-blue-900'
    },
    {
      id: 'evt-002',
      title: 'Uppföljning Nordic Capital',
      date: '2024-06-20',
      time: '14:00',
      duration: '60 min',
      type: 'call',
      location: 'Telefon',
      attendees: ['Anna Bergström'],
      color: 'bg-green-100 border-green-300 text-green-900'
    },
    {
      id: 'evt-003',
      title: 'Intern avstämning - Pipeline',
      date: '2024-06-21',
      time: '09:00',
      duration: '30 min',
      type: 'internal',
      location: 'Kontoret',
      attendees: ['Johan Svensson', 'Maria Eriksson'],
      color: 'bg-purple-100 border-purple-300 text-purple-900'
    },
    {
      id: 'evt-004',
      title: 'Signering SPA - Modekedjan',
      date: '2024-06-22',
      time: '11:00',
      duration: '120 min',
      type: 'signing',
      location: 'Advokatbyrån',
      attendees: ['Köpare', 'Säljare', 'Jurister'],
      color: 'bg-amber-100 border-amber-300 text-amber-900'
    }
  ]

  const weekDays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - date.getDay() + i + 1)
    return date
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return Video
      case 'call': return Phone
      case 'signing': return Users
      default: return Calendar
    }
  }

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8) // 8:00 to 20:00

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-dark">Kalender</h1>
            <p className="text-sm text-text-gray mt-1">Hantera möten och viktiga datum</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Boka möte
          </button>
        </div>

        {/* Calendar controls */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-text-gray" />
              </button>
              <h2 className="text-lg font-semibold text-text-dark">
                Juni 2024 - Vecka 25
              </h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-text-gray" />
              </button>
              <button className="px-3 py-1.5 text-sm text-primary-blue hover:bg-blue-50 rounded-lg transition-colors">
                Idag
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {['month', 'week', 'day'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as any)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    view === v
                      ? 'bg-primary-blue text-white'
                      : 'text-text-gray hover:bg-gray-100'
                  }`}
                >
                  {v === 'month' ? 'Månad' : v === 'week' ? 'Vecka' : 'Dag'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Week view */}
        {view === 'week' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-3 text-xs font-medium text-text-gray uppercase"></div>
              {currentWeek.map((date, i) => (
                <div key={i} className="p-3 text-center border-l border-gray-200">
                  <div className="text-xs font-medium text-text-gray uppercase">{weekDays[i]}</div>
                  <div className={`text-lg font-semibold mt-1 ${
                    date.toDateString() === new Date().toDateString() 
                      ? 'text-primary-blue' 
                      : 'text-text-dark'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-8">
              {timeSlots.map((hour) => (
                <>
                  <div key={`time-${hour}`} className="p-3 text-xs text-text-gray text-right border-t border-gray-100">
                    {hour}:00
                  </div>
                  {currentWeek.map((date, dayIndex) => (
                    <div key={`${hour}-${dayIndex}`} className="p-2 border-l border-t border-gray-100 min-h-[60px] relative">
                      {events
                        .filter(e => {
                          const eventDate = new Date(e.date)
                          const eventHour = parseInt(e.time.split(':')[0])
                          return eventDate.toDateString() === date.toDateString() && eventHour === hour
                        })
                        .map((event) => {
                          const Icon = getEventIcon(event.type)
                          return (
                            <div
                              key={event.id}
                              className={`absolute inset-x-1 p-2 rounded-lg border ${event.color} cursor-pointer hover:shadow-md transition-shadow`}
                              style={{ 
                                height: `${parseInt(event.duration) * 0.8}px`,
                                minHeight: '40px'
                              }}
                            >
                              <div className="flex items-start gap-1">
                                <Icon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{event.title}</p>
                                  <p className="text-xs opacity-75">{event.time} • {event.location}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming events */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-text-dark mb-4">Kommande händelser</h2>
          
          <div className="space-y-3">
            {events.map((event) => {
              const Icon = getEventIcon(event.type)
              return (
                <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg ${event.color}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-text-dark">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-text-gray">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString('sv-SE')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time} ({event.duration})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {event.attendees.map((attendee, i) => (
                        <span key={i} className="text-xs bg-white px-2 py-1 rounded-full">
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="text-sm text-primary-blue hover:underline">
                    Visa detaljer
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
